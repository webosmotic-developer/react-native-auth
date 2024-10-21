import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import { LIGHT, primaryColor } from '../constants/Colors';
import { typography } from '../constants/Fonts';
import GlobalStyles from '../constants/GlobalStyles';

export default function CommonInput({
  error,
  onChange,
  keyboardType,
  outlineColor,
  secureTextEntry,
  inputBorderRadius,
  style,
  value,
  onBlur,
  onPress,
  label,
  customIcon,
  rightIcon,
  rightText,
  onLeftIconPress,
  onRightIconPress,
  onChangeText,
  onFocus,
  outlineStyle,
  placeholderTextColor,
  rightIconComponent,
  disabled,
  showPlaceholder,
  isViewOnly,
  onSubmitEditing,
  inputRef,
  multiline,
  leftIconComponent,
  placeholder,
  maxLength
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <TextInput
        onPressIn={onPress}
        maxLength={maxLength}
        autoCapitalize={'sentences'}
        autoCorrect={false}
        editable={!isViewOnly}
        theme={{
          colors: {
            primary: LIGHT.text.secondary
          }
        }}
        style={[
          styles.input,
          {
            borderRadius: inputBorderRadius || 8,
            elevation: 0,
            textAlignVertical: multiline ? 'top' : 'center'
          },
          style,
          isViewOnly && styles.nonEditableInput
        ]}
        disabled={disabled}
        onSubmitEditing={onSubmitEditing}
        ref={inputRef}
        outlineStyle={[
          {
            borderRadius: inputBorderRadius || 8,
            borderWidth: 1,
            borderColor: isViewOnly
              ? primaryColor[300]
              : outlineColor || LIGHT.text.disabled
          },
          outlineStyle
        ]}
        textColor={disabled ? LIGHT.text.disabled : LIGHT.text.secondary}
        placeholderTextColor={placeholderTextColor || LIGHT.text.disabled}
        placeholder={
          multiline && !isFocused && !showPlaceholder
            ? ''
            : placeholder || label
        }
        error={error?.message}
        outlineColor={outlineColor || LIGHT.text.disabled}
        activeOutlineColor={LIGHT.text.disabled}
        secureTextEntry={!!secureTextEntry}
        keyboardType={keyboardType || 'default'}
        value={value}
        mode="outlined"
        onBlur={() => {
          if (multiline) {
            setIsFocused(false);
          }
          onBlur?.();
        }}
        onFocus={() => {
          if (multiline) {
            setIsFocused(true);
          }
          onFocus?.();
        }}
        onChangeText={(text) => {
          if (onChangeText) {
            onChangeText?.(text);
          }
          onChange(text);
        }}
        label={multiline && !value?.length && !isFocused ? '' : label}
        multiline={multiline}
        numberOfLines={multiline ? 5 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
        left={
          leftIconComponent ||
          (customIcon?.type ? (
            <TextInput.Icon
              forceTextInputFocus={false}
              type={customIcon?.type}
              icon={customIcon?.name}
              color={LIGHT.text.disabled}
              onPress={onLeftIconPress}
            />
          ) : null)
        }
        right={
          rightIconComponent ||
          (rightIcon ? (
            <TextInput.Icon
              forceTextInputFocus={false}
              type={rightIcon?.type}
              icon={rightIcon?.name}
              color={LIGHT.text.disabled}
              onPress={onRightIconPress}
              style={[GlobalStyles.mr(16)]}
            />
          ) : (
            rightText && <TextInput.Affix text={rightText} />
          ))
        }
      />
      {multiline && !value?.length && !isFocused ? (
        <Text style={styles.emptyLabel}>{label}</Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    shadowRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    elevation: 6,
    paddingHorizontal: 10,
    ...typography.descMedium
  },
  emptyLabel: {
    ...typography.bodyMedium,
    fontSize: 14,
    paddingLeft: 15,
    position: 'absolute',
    top: 16,
    left: 10,
    color: 'grey'
  }
});

CommonInput.propTypes = {
  error: PropTypes.any,
  onPress: PropTypes.any,
  onChange: PropTypes.any,
  keyboardType: PropTypes.any,
  outlineColor: PropTypes.any,
  secureTextEntry: PropTypes.any,
  style: PropTypes.any,
  outlineStyle: PropTypes.any,
  value: PropTypes.any,
  onBlur: PropTypes.any,
  label: PropTypes.any,
  customIcon: PropTypes.any,
  rightIcon: PropTypes.any,
  rightText: PropTypes.any,
  onLeftIconPress: PropTypes.any,
  onRightIconPress: PropTypes.any,
  onFocus: PropTypes.any,
  onChangeText: PropTypes.any,
  placeholderTextColor: PropTypes.string,
  rightIconComponent: PropTypes.element,
  leftIconComponent: PropTypes.element,
  disabled: PropTypes.bool,
  inputBorderRadius: PropTypes.number,
  isViewOnly: PropTypes.bool,
  onSubmitEditing: PropTypes.func,
  inputRef: PropTypes.any,
  multiline: PropTypes.bool,
  placeholder: PropTypes.string,
  showPlaceholder: PropTypes.bool,
  maxLength: PropTypes.any
};
