import React, { useState } from 'react'
import Router from './components/Router'
import jwt from 'jwt-decode'

import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import ThemeProvider from "@material-ui/styles/ThemeProvider"

import { AuthContext } from "./context/AuthContext"

const theme = createMuiTheme({})

const emptyUser: Player = {
  id: '',
  firstName: '',
  guest: false,
  admin: false,
}

const App: React.FC<{}> = () => {
  const localToken = localStorage.getItem("dgs-token")
  const existingToken = localToken !== null
                        && localToken !== undefined
                        && localToken !== 'undefined' 
                        ? JSON.parse(localToken as string)
                        : null
  // TODO: Check for expired token?

  const [authToken, setAuthToken] = useState(existingToken)
  const [user, setUser] = useState<Player>({ ...emptyUser })

  if (authToken) {
    const userData = jwt(authToken.access_token)
    // TODO
    // setUser(previousUser => { ...previousUser, firstName: userData.})
  }

  const loggedIn = (tokenData: Object) => {
    localStorage.setItem('dgs-token', JSON.stringify(tokenData))
    setAuthToken(tokenData)
    // TODO
    // setUser(???)
  }

  const loggedOut = () => {
    localStorage.removeItem('dgs-token')
    setAuthToken(null)
    setUser({ ...emptyUser })
  }

  return (
    <AuthContext.Provider value={{
      authToken: authToken,
      loggedIn: loggedIn,
      loggedOut: loggedOut,
      user: user,
    }}>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </AuthContext.Provider>
  )
}

export default App
