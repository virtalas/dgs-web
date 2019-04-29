import React, { Component } from 'react'
import Router from './components/Router'

import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";

import './css/App.css'

// Temporary solution for using @material-ui/styles (will be unneeded in Material UI v4):
// https://github.com/mui-org/material-ui/issues/14271
const theme = createMuiTheme({
  typography: {
    useNextVariants: true, // Use new typography v2
  },
});

// TODO: handle login, pass signed in player info as props

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    )
  }
}

export default App
