import * as React from 'react'
import { Redirect, Route, RouteProps } from 'react-router'

import { useAuth } from "./context/AuthContext"

export interface ProtectedRouteProps extends RouteProps {
  // isAuthenticated: boolean;
  // isAllowed: boolean;
  // restrictedPath: string;
  // authenticationPath: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = props => {
  const { authToken } = useAuth()

  if (authToken) {
    return <Route {...props} />
  } else {
    const renderComponent = () => <Redirect to={{ pathname: '/login' }} />
    return <Route {...props} component={renderComponent} render={undefined} />
  }
}

export default ProtectedRoute
