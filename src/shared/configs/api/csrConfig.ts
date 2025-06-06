import axios from 'axios';

import { noAccessTokenCode } from '../errorCode';
import { BASEURL } from './url';

export const API = axios.create({
  baseURL: BASEURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const FORMAPI = axios.create({
  baseURL: BASEURL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const setRccToken = (access: string) => {
  API.defaults.headers['Authorization'] = `Bearer ${access}`;
  FORMAPI.defaults.headers['Authorization'] = `Bearer ${access}`;
};

export const removeRccAccess = () => {
  delete API.defaults.headers['Authorization'];
  delete FORMAPI.defaults.headers['Authorization'];
};

export const getRccAccess = (): string =>
  `${API.defaults.headers['Authorization']}`;

API.interceptors.request.use(config => {
  const accessToken = getRccAccess();
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

API.interceptors.response.use(
  response => response,
  async error => {
    console.log(error, 'error');
    if (error.response) {
      const {
        response: {
          data: { errorCode },
        },
        config,
      } = error;

      //Access token 재발급 과정
      if (noAccessTokenCode.includes(errorCode) || error.status === 403) {
        //TODO: 토큰 재발급 요청을 ios로 보내는 로직을 작성
        return API.request(config);
      }
    }

    throw new Error(`${error}`);
  }
);

FORMAPI.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      const {
        response: {
          data: { errorCode },
        },
        config,
      } = error;

      //Access token 재발급 과정
      if (noAccessTokenCode.includes(errorCode) || error.status === 403) {
        //TODO: 토큰 재발급 요청을 ios로 보내는 로직을 작성
        return API.request(config);
      }
    }
    throw new Error(`${error}`);
  }
);
