import { createContext, useContext } from 'react'

type ContextProps = {
  authToken: Object,
  setToken: any,
  user: Player,
};

export const AuthContext = createContext<Partial<ContextProps>>({})

export function useAuth() {
  return useContext(AuthContext)
}
