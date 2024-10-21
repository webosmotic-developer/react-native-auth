import React, {useEffect, useState} from 'react';

import {addEventListener} from '@react-native-community/netinfo';
import {Portal} from 'react-native-paper';

import NoInternetModal from './src/components/NoInternetModal';
import AuthProvider from './src/context/AuthProvider';

function App() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {!isConnected ? (
        <Portal>
          <NoInternetModal />
        </Portal>
      ) : null}
      <AuthProvider />
    </>
  );
}

export default App;
