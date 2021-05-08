import React, { useEffect, useState } from 'react'
import Router from './components/Router'

import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import ThemeProvider from "@material-ui/styles/ThemeProvider"

import { AuthContext } from "./context/AuthContext"
import baseService from './services/baseService'

const DEBUG = false

const theme = createMuiTheme({})

const App: React.FC<{}> = () => {
  let localToken = localStorage.getItem("dgs-token")
  let existingToken = localToken !== null
                        && localToken !== undefined
                        && localToken !== 'undefined' 
                        ? JSON.parse(localToken as string)
                        : null
  const [userId, setUserId] = useState<string | undefined>()


  useEffect(() => {
    if (existingToken) {
      setUserId(baseService.extractUserId(existingToken))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = (token: AuthToken) => {
    localStorage.setItem('dgs-token', JSON.stringify(token))
    setUserId(baseService.extractUserId(token))
  }

  const handleLogout = () => {
    localStorage.removeItem('dgs-token')
    localToken = null
    existingToken = null
    setUserId(undefined)
  }

  if (existingToken) {
    baseService.useAccessToken(existingToken.access_token)
    baseService.useTokenExpiryChecker(handleLogout, existingToken)
  }

  if (DEBUG) {
    baseService.useResponseJSONLogger()
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
