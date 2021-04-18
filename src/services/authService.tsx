import axios from 'axios'

import { API_ROOT } from '../apiConfig'

const register = async (email: string, firstName: string, lastName: string, password: string): Promise<string> => {
  const response = await axios.post(`${API_ROOT}/users`, {
    email: email,
    first_name: firstName,
    last_name: lastName,
    password: password,
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return response.data
}

const login = async (email: string, password: string): Promise<AuthToken> => {
  const bodyFormData = new FormData()
  bodyFormData.append('username', email)
  bodyFormData.append('password', password)
  
  const response = await axios.post(`${API_ROOT}/authentication/login/password`, bodyFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
  return response.data
}

export default {
  register,
  login,
}
