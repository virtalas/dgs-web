import React, { useEffect, useState } from 'react'
import Router from './components/Router'
import jwt from 'jwt-decode'
import axios from 'axios'

import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import ThemeProvider from "@material-ui/styles/ThemeProvider"

import { AuthContext } from "./context/AuthContext"

const theme = createMuiTheme({})

const App: React.FC<{}> = () => {
  const localToken = localStorage.getItem("dgs-token")
  const existingToken = localToken !== null
                        && localToken !== undefined
                        && localToken !== 'undefined' 
                        ? JSON.parse(localToken as string)
                        : null
  const [userId, setUserId] = useState<string | undefined>()

  const extractUserId = (token: AuthToken) => {
    const tokenData: { sub: string } = jwt(token.access_token)
    return tokenData['sub']
  }

  const checkTokenExpired = (token: AuthToken): boolean => {
    const tokenData: { exp: string } = jwt(token.access_token)
    return Date.now() >= parseInt(tokenData.exp) * 1000
  }

  useEffect(() => {
    const addTokenExpiryInterceptor = () => {
      axios.interceptors.request.use(config => {
        if (checkTokenExpired(existingToken)) {
          handleLogout()
        }  
        return config
      }, error => {
        return Promise.reject(error)
      })
    }
  
    if (existingToken) {
      addTokenExpiryInterceptor()
      setUserId(extractUserId(existingToken))
    }  
  }, [existingToken])

  const handleLogin = (token: AuthToken) => {
    localStorage.setItem('dgs-token', JSON.stringify(token))
    setUserId(extractUserId(token))
  }

  const handleLogout = () => {
    localStorage.removeItem('dgs-token')
    setUserId(undefined)
  }

  if (existingToken) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + existingToken.access_token
  }

  return (
    <AuthContext.Provider value={{
      handleLogin: handleLogin,
      handleLogout: handleLogout,
      authenticated: existingToken !== null,
      userId: userId,
    }}>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </AuthContext.Provider>
  )
}

export default App
