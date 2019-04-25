import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'

import Drawer from './Drawer'

class Router extends React.Component {

  render() {
    // Placeholder component:
    const NewGame = () => (
      <div>New Game!</div>
    )

    return (
      <HashRouter>
        <Switch>
          <Route path="/games/new" component={NewGame}/>
          <Route component={Drawer}/>
        </Switch>
      </HashRouter>
    )
  }
}

export default Router
