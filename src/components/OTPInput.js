import React, { useState, useRef, useEffect } from 'react';

import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import { TextInput } from 'react-native-paper';

import { LIGHT } from '../constants/Colors';
import { screenWidth } from '../utils/commonFunctions';

const OTPInput = ({
  length = 6,
  onOtpComplete,
  containerStyle,
  inputStyle
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputs = useRef([]);
  useEffect(() => {
    const startListening = async () => {
      try {
        RNOtpVerify.getOtp().then(() =>
          RNOtpVerify.addListener((otpCode) => {
            if (otpCode && otpCode !== 'Timeout Error') {
              const testOtp = /(\d{6})/g.exec(otpCode);
              const otp = testOtp && testOtp[1];
              // console.log({ testOtp, otp });
              if (otp?.length) {
                setOtp(otp.split('').slice(0, length));
                onOtpComplete(otp);
              }
            }
          })
        );
      } catch (err) {
        console.error('Error starting SMS Retriever listener:', err);
      }
    };

    startListening();

    return () => {
      RNOtpVerify.removeListener();
    };
  }, [length, onOtpComplete]);
  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    if (text.length > 1) {
      const pastedOtp = text.split('').slice(0, length);
      setOtp(pastedOtp);
      onOtpComplete(pastedOtp.join(''));
      return;
    }

    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < length - 1) {
      const nextInput = inputs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }

    if (newOtp.every((digit) => digit !== '')) {
      onOtpComplete(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];
      if (!otp[index] && index > 0) {
        inputs.current[index - 1].focus();
      }
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {otp.map((digit, index) => (
        <TextInput
          theme={{
            colors: {
              primary: LIGHT.borderGrey
            }
          }}
          key={index}
          value={digit}
          style={[styles.input, inputStyle]}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          ref={(ref) => (inputs.current[index] = ref)}
          keyboardType="numeric"
          maxLength={1}
          autoFocus={index === 0}
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
        />
      ))}
    </View>
  );
};

OTPInput.propTypes = {
  length: PropTypes.any,
  onOtpComplete: PropTypes.func,
  containerStyle: PropTypes.any,
  inputStyle: PropTypes.any
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.13,
    borderWidth: 1,
    borderColor: LIGHT.borderGrey,
    margin: 5,
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 18,
    color: LIGHT.text.main
  }
});

export default OTPInput;
