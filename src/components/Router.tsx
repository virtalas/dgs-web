import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'

import Drawer from './Drawer'
import NewGame from './games/NewGame'
import ScoreInputPage from './games/ScoreInputPage'

const Router: React.FC<{}> = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/games/new" component={NewGame}/>
        <Route path="/games/:gameid/input" component={ScoreInputPage}/>
        <Route component={Drawer}/>
      </Switch>
    </HashRouter>
  )
}

export default Router
