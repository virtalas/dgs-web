import { createContext, useContext } from 'react'

type ContextProps = {
  handleLogin: (token: AuthToken) => void,
  handleLogout: () => void,
  authenticated: boolean,
  userId: string | undefined,
}

export const AuthContext = createContext<Partial<ContextProps>>({})

export function useAuth() {
  return useContext(AuthContext)
}
