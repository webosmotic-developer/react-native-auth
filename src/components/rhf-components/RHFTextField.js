import React from 'react';

import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { LIGHT } from '../../constants/Colors';
import CommonInput from '../CommonInput';

export default function RHFTextField({
  name,
  inputBorderRadius,
  secureTextEntry,
  onLeftIconPress,
  onRightIconPress,
  rightIcon,
  rightText,
  style,
  defaultValue,
  onChangeText,
  isCustomSwitch,
  onChangeSwitchIcon,
  switchValue,
  containerStyle,
  outlineColor,
  onFocus,
  rightIconComponent,
  leftIconComponent,
  isViewOnly,
  onSubmitEditing,
  inputRef,
  placeholder,
  ...other
}) {
  const { control } = useFormContext();
  const fields = { ...other };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, onBlur, value } = field;
        return (
          <View style={containerStyle}>
            <View
              style={[
                styles.inputContainer,
                {
                  marginBottom: error?.message && !isViewOnly ? 2 : 12,
                  borderRadius: inputBorderRadius || 32
                }
              ]}
            >
              <CommonInput
                {...fields}
                onSubmitEditing={onSubmitEditing}
                placeholder={placeholder}
                inputRef={inputRef}
                inputBorderRadius={inputBorderRadius}
                onChange={onChange}
                onBlur={onBlur}
                value={defaultValue || value}
                secureTextEntry={secureTextEntry}
                onLeftIconPress={onLeftIconPress}
                onRightIconPress={onRightIconPress}
                rightIcon={rightIcon}
                rightText={rightText}
                style={style}
                rightIconComponent={rightIconComponent}
                leftIconComponent={leftIconComponent}
                isCustomSwitch={isCustomSwitch}
                onChangeSwitchIcon={onChangeSwitchIcon}
                switchValue={switchValue}
                containerStyle={containerStyle}
                outlineColor={outlineColor}
                onFocus={onFocus}
                onChangeText={onChangeText}
                isViewOnly={isViewOnly}
              />
            </View>
            {error?.message && !isViewOnly ? (
              <Text style={styles.errorMessage} variant="bodySmall">
                {error?.message}
              </Text>
            ) : (
              <View />
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row'
  },
  errorMessage: {
    color: LIGHT.error.main,
    textAlign: 'left',
    marginLeft: 6
  }
});

RHFTextField.propTypes = {
  isCustomSwitch: PropTypes.any,
  name: PropTypes.string,
  onChangeSwitchIcon: PropTypes.any,
  onLeftIconPress: PropTypes.any,
  onRightIconPress: PropTypes.any,
  inputBorderRadius: PropTypes.number,
  rightIcon: PropTypes.shape({
    color: PropTypes.any,
    name: PropTypes.any,
    type: PropTypes.any
  }),
  isViewOnly: PropTypes.bool,
  rightIconComponent: PropTypes.any,
  leftIconComponent: PropTypes.any,
  outlineColor: PropTypes.any,
  rightText: PropTypes.any,
  secureTextEntry: PropTypes.any,
  style: PropTypes.any,
  switchValue: PropTypes.any,
  containerStyle: PropTypes.any,
  onFocus: PropTypes.any,
  onChangeText: PropTypes.any,
  onSubmitEditing: PropTypes.func,
  inputRef: PropTypes.any,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string
};
