import React, { Component } from 'react'
import Drawer from './components/Drawer'

import './css/App.css'

// TODO: handle login, pass signed in player info as props

class App extends Component {
  render() {
    return (
      <div className="App">
        <Drawer />
      </div>
    )
  }
}

export default App
