import React from 'react'
import Router from './components/Router'

import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import ThemeProvider from "@material-ui/styles/ThemeProvider"

import { AuthContext } from "./context/AuthContext"

const theme = createMuiTheme({})

// TODO: handle login, pass signed in player info as props

const App: React.FC<{}> = () => {
  // Check whether logged in or not.

  return (
    <AuthContext.Provider value={false}>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </AuthContext.Provider>
  )
}

export default App
