import { ApiResponse } from '@/shared/@types/apiResponse'
import axios from 'axios'
import { BASEURL } from './url'

export const updateAccess = async (
  tokenRequest: Token.TokenRequest
): Promise<ApiResponse<Token.TokenResponse>> => {
  const response = await axios.post(`${BASEURL}/auth/refresh`, tokenRequest)
  return response.data
}
