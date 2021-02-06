import axios from 'axios'

import { API_ROOT } from '../apiConfig'

const register = async (email: string, firstName: string, lastName: string, password: string): Promise<string> => {
  const response = await axios.post(`${API_ROOT}/users`, {
    email: email,
    first_name: firstName,
    last_name: lastName,
    password: password,
  })
  return response.data
}

const login = async (username: string, password: string): Promise<string> => {
  // TODO: Returns JWT, which contains Player
  const a = `${API_ROOT}/users`
  return 'jsklfdödskljflfkjsököfsksjdfökjdfs'
}

export default {
  register,
  login,
}
