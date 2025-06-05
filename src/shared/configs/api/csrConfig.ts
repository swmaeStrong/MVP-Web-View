import axios from 'axios'

import { STORAGE_REFRESH_KEY } from '@/shared/constants/storage'
import { noAccessTokenCode } from '../errorCode'
import { BASEURL } from './url'

export const API = axios.create({
  baseURL: BASEURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const FORMAPI = axios.create({
  baseURL: BASEURL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

export const setRccToken = (access: string, refresh: string | false) => {
  API.defaults.headers['Authorization'] = `Bearer ${access}`
  FORMAPI.defaults.headers['Authorization'] = `Bearer ${access}`
  if (refresh) localStorage.setItem(STORAGE_REFRESH_KEY, refresh)
}

export const removeRccAccess = () => {
  delete API.defaults.headers['Authorization']
  delete FORMAPI.defaults.headers['Authorization']
}

export const getRccAccess = (): string =>
  `${API.defaults.headers['Authorization']}`

export const removeRccRefresh = (): void => {
  localStorage.removeItem(STORAGE_REFRESH_KEY)
}

export const getRccRefresh = (): string | null => {
  return localStorage.getItem(STORAGE_REFRESH_KEY)
}

API.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      const {
        response: {
          data: { errorCode },
        },
        config,
      } = error

      //Access token 재발급 과정
      if (noAccessTokenCode.includes(errorCode)) {
        const refresh = getRccRefresh()
        if (!refresh) {
          // refresh token 없으면 접근 불가 이런 페이지로 이동
        } else {
          // const accessToken = await updateAccess(refresh);
          // config.headers['Authorization'] = `Bearer ${accessToken}`;
          // return API.request(config);
        }
      }
    }
    throw new Error(`${error}`)
  }
)

FORMAPI.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      const {
        response: {
          data: { errorCode },
        },
        config,
      } = error

      //Access token 재발급 과정
      if (noAccessTokenCode.includes(errorCode)) {
        const refresh = getRccRefresh()
        if (!refresh) {
          location.href = '/auth/signin'
        } else {
          // accessToken 새로 발급 후 요청
          // const accessToken = await updateAccess(refresh);
          // config.headers['Authorization'] = `Bearer ${accessToken}`;
          // return API.request(config);
        }
      }
    }
    throw new Error(`${error}`)
  }
)
