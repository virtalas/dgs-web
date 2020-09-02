import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'

import BasePage from './BasePage'
import GameInput from './gameInput/GameInput'
import Login from './login/Login'

const Router: React.FC<{}> = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/games/:gameid/input" component={GameInput} />
        <Route component={BasePage} />
      </Switch>
    </HashRouter>
  )
}

export default Router
