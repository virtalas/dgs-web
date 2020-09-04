import React, { useState } from 'react'
import Router from './components/Router'

import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import ThemeProvider from "@material-ui/styles/ThemeProvider"

import { AuthContext } from "./context/AuthContext"

const theme = createMuiTheme({})

const mockLoggedInUser = {
  id: 'fdjskfl83fhsgls',
  firstName: 'Konsta',
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

  let loggedInUser = {
    id: '',
    firstName: '',
    guest: false,
    admin: false,
  }
  if (authToken) {
    loggedInUser = mockLoggedInUser // TODO: Extract user from authToken.
  }
  const [user, setUser] = useState<Player>(loggedInUser)

  const loggedIn = (tokenData: Object) => {
    localStorage.setItem('dgs-token', JSON.stringify(tokenData))
    setAuthToken(tokenData)
    setUser(mockLoggedInUser) // TODO: Extract user from authToken.
  }

  const loggedOut = () => {
    localStorage.removeItem('dgs-token')
    setAuthToken(null)
    setUser(loggedInUser)
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
