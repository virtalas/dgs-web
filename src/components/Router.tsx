import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'

import PrivateRoute from '../PrivateRoute'
import BasePage from './BasePage'
import GameInput from './gameInput/GameInput'
import Login from './login/Login'
import Register from './login/Register'

const Router: React.FC<{}> = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register/:guestid" component={Register} />
        <Route path="/register" component={Register} />
        <PrivateRoute path="/games/:gameid/input" component={GameInput} />
        <PrivateRoute component={BasePage} />
      </Switch>
    </HashRouter>
  )
}

export default Router
