import { ApiResponse } from '@/shared/@types/apiResponse';
import axios from 'axios';
import { setRccToken } from './csrConfig';
import { setRscToken } from './ssrConfig';
import { BASEURL } from './url';

export const updateAccess = async (
  tokenRequest: Token.TokenRequest
): Promise<ApiResponse<Token.TokenResponse>> => {
  const response = await axios.post(`${BASEURL}/auth/refresh`, tokenRequest);

  const { refreshToken, accessToken } = response.data;

  setRccToken(accessToken, refreshToken);
  setRscToken(accessToken, refreshToken);

  console.log(response.data, 'response.data');
  return response.data;
};
