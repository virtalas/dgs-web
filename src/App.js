import React, { Component } from 'react'
import Router from './components/Router'

import './css/App.css'

// TODO: handle login, pass signed in player info as props

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router />
      </div>
    )
  }
}

export default App
