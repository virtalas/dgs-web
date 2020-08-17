import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'

import BasePage from './BasePage'
import GameInput from './gameInput/GameInput'

const Router: React.FC<{}> = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/games/:gameid/input" component={GameInput}/>
        <Route component={BasePage}/>
      </Switch>
    </HashRouter>
  )
}

export default Router
