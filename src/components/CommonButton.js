import React from 'react';

import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, View, Image} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';

import {LIGHT, primaryColor} from '../constants/Colors';
import {fontFamily} from '../constants/fontFamily';
import {typography} from '../constants/Fonts';
import GlobalStyles from '../constants/GlobalStyles';

const CommonButton = props => {
  const {
    style,
    buttonTitle,
    loading,
    labelStyle,
    buttonColor,
    buttonImage,
    buttonIcon,
    buttonEndIcon,
    ...rest
  } = props;

  const isDisabled = loading || rest?.disabled;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      {...rest}
      style={[
        styles.button,
        style,
        {
          backgroundColor: isDisabled
            ? '#E0E0E0'
            : buttonColor || primaryColor[300],
        },
      ]}
      disabled={isDisabled}>
      {loading ? (
        <ActivityIndicator
          style={GlobalStyles.mr(10)}
          color={LIGHT.text.primary}
          size={18}
        />
      ) : null}
      {buttonIcon ? (
        <>
          {buttonIcon}
          <View style={GlobalStyles.w(buttonTitle ? 4 : 0)} />
        </>
      ) : buttonImage ? (
        <>
          {/* <Image
            style={{
              height: 16,
              width: 14
            }}
            source={buttonImage}
            resizeMode={FastImage.resizeMode.contain}
          /> */}
          <View style={GlobalStyles.w(buttonTitle ? 4 : 0)} />
        </>
      ) : null}
      <Text
        style={[
          styles.label,
          labelStyle,
          {
            color: isDisabled
              ? LIGHT.text.disabled
              : labelStyle?.color || LIGHT.text.primary,
          },
        ]}>
        {buttonTitle}
      </Text>
      {buttonEndIcon ? (
        <>
          <View style={GlobalStyles.w(4)} />
          {buttonEndIcon}
        </>
      ) : null}
    </TouchableOpacity>
  );
};

CommonButton.propTypes = {
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  labelStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  buttonTitle: PropTypes.string,
  buttonImage: PropTypes.any,
  loading: PropTypes.bool,
  buttonColor: PropTypes.string,
  buttonIcon: PropTypes.element,
  buttonEndIcon: PropTypes.any,
};

const styles = StyleSheet.create({
  button: {
    height: 44,
    backgroundColor: primaryColor[300],
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  label: {
    ...typography.descMedium,
    fontFamily: fontFamily.semiBold,
    textTransform: 'capitalize',
  },
});

export default CommonButton;
