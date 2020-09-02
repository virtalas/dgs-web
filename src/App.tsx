import React, { useState } from 'react'
import Router from './components/Router'

import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import ThemeProvider from "@material-ui/styles/ThemeProvider"

import { AuthContext } from "./context/AuthContext"

const theme = createMuiTheme({})

const App: React.FC<{}> = () => {
  const existingTokens = JSON.parse('' + localStorage.getItem("dgs-token"));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data: Object) => {
    localStorage.setItem("dgs-token", JSON.stringify(data));
    setAuthTokens(data);
  }

  return (
    <AuthContext.Provider value={{ authToken: authTokens, setToken: setTokens }}>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </AuthContext.Provider>
  )
}

export default App
