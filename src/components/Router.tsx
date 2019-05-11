import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'

import Drawer from './Drawer'
import NewGame from './gameInput/NewGame'
import GameInput from './gameInput/GameInput'

const Router: React.FC<{}> = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/games/new" component={NewGame}/>
        <Route path="/games/:gameid/input" component={GameInput}/>
        <Route component={Drawer}/>
      </Switch>
    </HashRouter>
  )
}

export default Router
