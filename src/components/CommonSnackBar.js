import React, {useState, useEffect} from 'react';

import PropTypes from 'prop-types';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Iconify} from 'react-native-iconify';

import {LIGHT} from '../constants/Colors';
import {fontFamily} from '../constants/fontFamily';
import GlobalStyles from '../constants/GlobalStyles';
import {screenWidth} from '../utils/commonFunctions';

const CommonSnackBar = props => {
  const [isVisible, setIsVisible] = useState(false);
  const {message, type, clearMessage, bottom} = props;

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      if (type === 'success') {
        const timeout = setTimeout(() => {
          setIsVisible(false);
          clearMessage?.();
        }, 3000);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsVisible(false);
          clearMessage?.();
        }, 15000);
        return () => clearTimeout(timeout);
      }
    }
  }, [clearMessage, message, type]);

  const getSnackbarStyle = () => {
    switch (type) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      default:
        return styles.default;
    }
  };

  const getContainerStyle = () => {
    switch (type) {
      case 'success':
        return styles.containerSuccess;
      case 'error':
        return styles.containerError;
      default:
        return styles.containerDefault;
    }
  };

  return message?.length ? (
    <View
      style={[
        styles.container(bottom),
        getContainerStyle(),
        isVisible ? styles.visible : styles.hidden,
        GlobalStyles.rowBetween,
        {alignItems: 'flex-start'},
      ]}>
      <Text
        style={[
          getSnackbarStyle(),
          GlobalStyles.growShrink,
          GlobalStyles.w('90%'),
        ]}>
        {message}
      </Text>
      <TouchableOpacity
        onPress={() => {
          setIsVisible(false);
          clearMessage?.();
        }}>
        <Iconify
          style={[GlobalStyles.mr(4)]}
          icon="gridicons:cross"
          size={20}
          color={'white'}
        />
      </TouchableOpacity>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: bottom => ({
    position: 'absolute',
    bottom: bottom || 20,
    left: 20,
    right: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    opacity: 0,
    maxWidth: screenWidth - 40,
  }),
  visible: {
    opacity: 1,
  },
  hidden: {
    display: 'none',
  },
  success: {
    color: LIGHT.bg,
    fontFamily: fontFamily.bold,
  },
  error: {
    color: LIGHT.bg,
    fontFamily: fontFamily.bold,
  },
  default: {
    color: LIGHT.black,
    fontFamily: fontFamily.bold,
  },
  containerSuccess: {
    backgroundColor: LIGHT.success.main,
  },
  containerError: {
    backgroundColor: LIGHT.error.main,
  },
  containerDefault: {
    color: 'white',
  },
});

CommonSnackBar.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
  clearMessage: PropTypes.func,
  bottom: PropTypes.number,
};

export default CommonSnackBar;
