import axios, { CancelTokenSource } from 'axios'

import { API_ROOT } from '../apiConfig'
import baseService from './baseService'

const register = async (email: string, firstName: string, lastName: string, password: string, source: CancelTokenSource, id?: string): Promise<string> => {
  const response = await baseService.post('/users', source, {
    email: email,
    first_name: firstName,
    last_name: lastName,
    password: password,
  })
  return response.data
}

const registerGuestAsUser = async (id: string, email: string, firstName: string, lastName: string, password: string, source: CancelTokenSource): Promise<string> => {
  const response = await baseService.post('/users/guestsignup', source, {
    id: id,
    email: email,
    first_name: firstName,
    last_name: lastName,
    password: password,
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
  registerGuestAsUser,
  login,
}
