import { createContext, useContext } from 'react'

type ContextProps = {
  authToken: Object,
  loggedIn: (token: Object) => void,
  loggedOut: () => void,
  user: Player,
}

export const AuthContext = createContext<Partial<ContextProps>>({})

export function useAuth() {
  return useContext(AuthContext)
}
