import React from 'react';

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {AppRegistry} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';

import App from './App';
import {name as appName} from './app.json';
import {store} from './src/store/index';

function Root() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <App />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => Root);
