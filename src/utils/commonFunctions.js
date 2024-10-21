import EventEmitter from 'events';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode as atob} from 'base-64';
import {Dimensions} from 'react-native';

export const maskPart = str => {
  if (str.length <= 4) {
    return str;
  }
  return `${str.substring(0, 2)}${'*'.repeat(str.length - 4)}${str.substring(
    str.length - 2,
  )}`;
};

export const eventEmitter = new EventEmitter();

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/');

  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

export const getUserId = async () => {
  const token =
    (await AsyncStorage.getItem('token')) ||
    (await AsyncStorage.getItem('refresh'));

  if (token) {
    const jwtData = parseJwt(token);
    return {
      id: jwtData?._id || jwtData?.aud,
      userType: (jwtData?.role || jwtData?.userType)?.toLowerCase(),
    };
  }
  return '';
};

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

export const queryParamsBuilder = query => {
  if (typeof query !== 'object') {
    return '';
  }
  const keys = Object.keys(query).filter(
    b => query[b] !== null && query[b] !== '',
  );
  if (keys.length) {
    return (
      '?' +
      new URLSearchParams(
        keys.reduce((a, b) => {
          a[b] = query[b];
          return a;
        }, {}),
      ).toString()
    );
  }
  return '';
};
