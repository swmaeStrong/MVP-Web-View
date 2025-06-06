// api-utils.ts
import { AxiosResponse } from 'axios';
import { ApiResponse } from '../shared/@types/apiResponse';

export async function parseApi<T>(
  promise: Promise<AxiosResponse<ApiResponse<T>>>
): Promise<T> {
  const { data } = await promise;
  if (!data.isSuccess) throw new Error(data.message);
  return data.data;
}
