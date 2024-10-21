import AsyncStorage from '@react-native-async-storage/async-storage';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {API_BASE_URL} from '../../../env.json';

const refreshQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  method: 'GET',
  prepareHeaders: async headers => {
    const refToken = (await AsyncStorage.getItem('refresh')) || false;
    headers.set('ngrok-skip-browser-warning', '69420');
    headers.set('Access-Control-Allow-Origin', 'no-cors');
    if (refToken) {
      headers.set('refreshToken', refToken);
    }
    headers.set('platform', 'mobile');
    return headers;
  },
});

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async headers => {
    const storedTokenValue = await AsyncStorage.getItem('token');
    const token = storedTokenValue || false;
    headers.set('ngrok-skip-browser-warning', '69420');
    headers.set('Access-Control-Allow-Origin', 'no-cors');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('platform', 'mobile');
    return headers;
  },
});
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error?.status === 401) {
    const storedRefTokenValue = await AsyncStorage.getItem('refresh');
    const refToken = storedRefTokenValue || false;
    if (refToken) {
      // try to get a new token
      const {data: refreshResult} = await refreshQuery(
        '/auth/refresh-token',
        api,
        extraOptions,
      );
      if (
        refreshResult?.status === 'SUCCESS' &&
        refreshResult?.data &&
        refreshResult?.data?.accessToken &&
        refreshResult?.data?.refreshToken
      ) {
        await AsyncStorage.setItem('token', refreshResult.data.accessToken);
        await AsyncStorage.setItem('refresh', refreshResult.data.refreshToken);
        return await baseQuery(args, api, extraOptions);
      }
    }
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('refresh');
    api.dispatch({type: 'logout'});
  }
  if (result.error && result.error?.status === 403) {
    console.error('You don not have permission to access', result.error);
  }
  if (result.error && result.error.originalStatus === 429) {
    // error
  }
  console.log('request---', result?.error);

  console.log('result==========', result?.meta);

  return result;
};
// initialize an empty api service that we'll inject endpoints into later as needed
export const createApiInstance = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [],
  endpoints: () => ({}),
});
export default createApiInstance;
