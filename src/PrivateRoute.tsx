import * as React from 'react'
import { Redirect, Route, RouteProps } from 'react-router'

import { useAuth } from "./context/AuthContext"

export const PrivateRoute: React.FC<RouteProps> = props => {
  const { authToken } = useAuth()

  if (authToken) {
    // Logged in.
    return <Route {...props} />
  } else {
    // Not logged in, redirect to login page.
    const renderComponent = () => <Redirect to={{ pathname: '/login' }} />
    return <Route {...props} component={renderComponent} render={undefined} />
  }
}

export default PrivateRoute
