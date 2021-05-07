import React, { useEffect, useState } from 'react'
import Router from './components/Router'
import jwt from 'jwt-decode'
import axios, { CancelTokenSource } from 'axios'

import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import ThemeProvider from "@material-ui/styles/ThemeProvider"

import { AuthContext } from "./context/AuthContext"

const theme = createMuiTheme({})

const DEBUG = false

const App: React.FC<{}> = () => {
  let localToken = localStorage.getItem("dgs-token")
  let existingToken = localToken !== null
                        && localToken !== undefined
                        && localToken !== 'undefined' 
                        ? JSON.parse(localToken as string)
                        : null
  const [userId, setUserId] = useState<string | undefined>()

  const extractUserId = (token: AuthToken) => {
    const tokenData: { sub: string } = jwt(token.access_token)
    return tokenData['sub']
  }

  const checkTokenExpired = (token?: AuthToken): boolean => {
    if (!token) return false
    const tokenData: { exp: string } = jwt(token.access_token)
    return Date.now() >= parseInt(tokenData.exp) * 1000
  }

  useEffect(() => {
    if (existingToken) {
      setUserId(extractUserId(existingToken))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = (token: AuthToken) => {
    console.log('App: handleLogin')
    localStorage.setItem('dgs-token', JSON.stringify(token))
    setUserId(extractUserId(token))
  }

  const handleLogout = () => {
    console.log('App: handleLogout')
    localStorage.removeItem('dgs-token')
    localToken = null
    existingToken = null
    setUserId(undefined)
  }

  if (existingToken) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + existingToken.access_token

    axios.interceptors.request.use(config => {
      console.log('checking token', existingToken)
      if (checkTokenExpired(existingToken) && !config.url?.includes('login')) {
        console.log('App: token expired, axios.interceptors:', config.url)
        handleLogout()
      }
      return config
    }, error => {
      console.log(error.response ? error.response.data : error)
      return Promise.reject(error)
    })
  }

  if (DEBUG) {
    axios.interceptors.response.use(response => {
      console.log(response.data)
      return response
    }, function (error) {
      return Promise.reject(error)
    })
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
