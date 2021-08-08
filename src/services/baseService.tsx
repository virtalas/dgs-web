import axios, { CancelTokenSource } from 'axios'
import jwt from 'jwt-decode'
import qs from 'qs'

import { API_ROOT } from '../apiConfig'

let tokenExpiryInterceptor: number

const get = (endpoint: string, source: CancelTokenSource, params?: any) => {
  return axios.get(API_ROOT + endpoint, {
    cancelToken: source.token,
    params: params,
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: "repeat" })
    },
  })
}

const post = (endpoint: string, source: CancelTokenSource, data?: any) => {
  return axios.post(API_ROOT + endpoint, data, {
    cancelToken: source.token,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

const put = (endpoint: string, source: CancelTokenSource, data?: any) => {
  return axios.put(API_ROOT + endpoint, data, {
    cancelToken: source.token,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

const delete_ = (endpoint: string, source: CancelTokenSource, data?: any) => {
  return axios.delete(API_ROOT + endpoint, {
    cancelToken: source.token,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  })
}

const cancelTokenSource = (): CancelTokenSource => {
  return axios.CancelToken.source()
}

const runMigrations = () => {
  return post('/users/migrations', cancelTokenSource())
}

const extractUserId = (token: AuthToken) => {
  const tokenData: { sub: string } = jwt(token.access_token)
  return tokenData['sub']
}

const checkTokenExpired = (token?: AuthToken): boolean => {
  if (!token) return false
  const tokenData: { exp: string } = jwt(token.access_token)
  return Date.now() >= parseInt(tokenData.exp) * 1000
}

const useTokenExpiryChecker = (handler: () => void, existingToken?: AuthToken) => {
  removeTokenExpiryChecker()
  tokenExpiryInterceptor = axios.interceptors.request.use(config => {
    if (checkTokenExpired(existingToken) && !config.url?.includes('login')) {
      console.log('Token expired, request url:', config.url, 'token:', existingToken)
      handler()
    }
    return config
  }, error => {
    console.log(error.response ? error.response.data : error)
    return Promise.reject(error)
  })
  console.log('added interceptor', tokenExpiryInterceptor)
}

const removeTokenExpiryChecker = () => {
  console.log('eject interceptor', tokenExpiryInterceptor)
  axios.interceptors.request.eject(tokenExpiryInterceptor)
}

const useAccessToken = (access_token: string) => {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token
}

const useResponseJSONLogger = () => {
  axios.interceptors.response.use(response => {
    console.log(response.data)
    return response
  }, function (error) {
    return Promise.reject(error)
  })
}

export default {
  get,
  post,
  put,
  delete_,
  cancelTokenSource,
  useTokenExpiryChecker,
  removeTokenExpiryChecker,
  useAccessToken,
  useResponseJSONLogger,
  extractUserId,
  runMigrations,
}
