const api_root_production = process.env.REACT_APP_API_ROOT

let root

if (api_root_production) {
  root = api_root_production
} else {
  root = 'http://127.0.0.1:8000'
}

export const API_ROOT = root
