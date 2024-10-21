import * as React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import AppNavigator from '../navigator/AppNavigator';

const AuthContext = React.createContext();

export default function AuthProvider() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          AsyncStorage.removeItem('token');
          AsyncStorage.removeItem('refresh');
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    const getUserToken = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('token');
      } catch (e) {
        // Restoring token failed
      }
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };
    getUserToken();
  }, []);

  const authContext = React.useMemo(
    () => ({
      setAuth: async data => {
        dispatch({type: 'SIGN_IN', token: data});
      },
      removeAuth: () => {
        dispatch({type: 'SIGN_OUT'});
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('refresh');
      },
      isLoading: state.isLoading,
      userToken: state.userToken,
    }),
    [state],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <AppNavigator state={state} />
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return React.useContext(AuthContext);
};
