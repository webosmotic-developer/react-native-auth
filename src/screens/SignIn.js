import React, {useCallback, useEffect, useRef, useState} from 'react';

import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
import {useForm, FormProvider} from 'react-hook-form';
import {
  View,
  StyleSheet,
  Linking,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Iconify} from 'react-native-iconify';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ActivityIndicator, Divider, Text} from 'react-native-paper';
import * as yup from 'yup';

import {API_BASE_URL} from '../../env.json';
import CommonButton from '../components/CommonButton';
import CommonSnackBar from '../components/CommonSnackBar';
import CustomAlert from '../components/CustomAlert';
import RenderInputWithRightIcon from '../components/RenderInputWithRightIcon';
import OTPInput from '../components/OTPInput';
import {LIGHT, primaryColor} from '../constants/Colors';
import {fontFamily} from '../constants/fontFamily';
import {typography} from '../constants/Fonts';
import GlobalStyles from '../constants/GlobalStyles';
import {useAuth} from '../context/AuthProvider';
import {
  useResendOTPMutation,
  useResendVerificationEmailMutation,
  useSignInInitMutation,
  useSignInValidateMutation,
} from '../store/apis/auth';
import {getUserId, maskPart, screenHeight} from '../utils/commonFunctions';
import validationSchemas from '../utils/validationSchema';
let resendTimer = null;
const SignIn = props => {
  const {route} = props;
  const [passSecure, setPassSecure] = useState(true);
  // const [isRememberChecked, setIsRememberChecked] = useState(true);
  const navigation = useNavigation();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('');
  const passwordFieldRef = useRef();
  const [alertData, setAlertData] = useState({});
  const [signIn, {data, isLoading, isSuccess, isError, error}] =
    useSignInValidateMutation();
  const [initSignIn, {isLoading: isInitSignInLoading, error: initSignInError}] =
    useSignInInitMutation();
  const [resendOTP] = useResendOTPMutation();

  const getUserDataFromToken = async () => {
    const data = await getUserId();
    return data;
  };

  const [signInStep, setSignInStep] = useState(0);
  const [isPhone, setIsPhone] = useState(false);
  const [otp, setOtp] = useState('');

  const validationSchema = yup.object({
    ...(signInStep === 0 && {emailOrPhone: validationSchemas.contact}),
    ...(signInStep === 1 && !isPhone && {password: validationSchemas.password}),
  });

  const auth = useAuth();
  const setTokens = useCallback(async () => {
    await AsyncStorage.setItem('token', data?.accessToken);
    await AsyncStorage.setItem('refresh', data?.refreshToken);
    const userDetails = await getUserDataFromToken();

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Dashboard',
          params: userDetails,
        },
      ],
    });
  }, [data?.accessToken, data?.refreshToken, navigation]);

  useEffect(() => {
    if (route?.params?.error) {
      setSnackbarMessage(route?.params?.error);
      setSnackbarType('error');
    }
  }, [route?.params?.error]);

  useEffect(() => {
    if (!isLoading && !isInitSignInLoading) {
      if (isSuccess) {
        setTokens(data);
        auth.setAuth(data?.accessToken);
      } else if (isError) {
        if (error?.data?.message) {
          setSnackbarMessage(error?.data?.message);
          setSnackbarType('error');
        }
      }
    }
  }, [
    auth,
    data,
    error?.data?.message,
    isError,
    isLoading,
    isSuccess,
    isInitSignInLoading,
    setTokens,
  ]);

  const methods = useForm({
    defaultValues: {
      emailOrPhone: '',
    },
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const [resendVerification, {isLoading: isEmailSendingLoading}] =
    useResendVerificationEmailMutation();

  const [otpTimer, setOtpTimer] = useState(120);

  const resendCodeFunc = useCallback(async () => {
    clearInterval(resendTimer);
    setOtpTimer(120);
    resendTimer = setInterval(() => {
      setOtpTimer(prev => prev - 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (otpTimer <= 0) {
      clearInterval(resendTimer);
    }
  }, [otpTimer]);

  useEffect(() => {
    return () => {
      clearInterval(resendTimer);
    };
  }, []);

  useEffect(() => {
    if (signInStep === 1 && isPhone) {
      resendCodeFunc();
    } else {
      clearInterval(resendTimer);
    }
  }, [isPhone, resendCodeFunc, signInStep]);

  const {handleSubmit, getValues, reset, setValue} = methods;

  useEffect(() => {
    if (signInStep === 0) {
      setOtpTimer(120);
      setValue('password', '');
    }
  }, [setValue, signInStep]);

  const sendOTP = useCallback(async () => {
    const values = getValues();
    if (values?.emailOrPhone) {
      const res = await resendOTP({
        type: 'login',
        phone: values?.emailOrPhone,
      });
      if (res?.data?.status === 'SUCCESS' && res?.data?.message) {
        setSnackbarMessage(res?.data?.message);
        setSnackbarType('success');
        resendCodeFunc();
      } else if (res?.error?.data?.message) {
        setSnackbarMessage(res?.error?.data?.message);
        setSnackbarType('error');
      }
    }
  }, [getValues, resendCodeFunc, resendOTP]);

  const onSubmit = useCallback(
    async data => {
      if (signInStep === 0) {
        const response = await initSignIn({identifier: data.emailOrPhone});
        if (response?.data?.status === 'SUCCESS') {
          setSnackbarMessage(response.data?.message);
          setSnackbarType('success');
          setIsPhone(!data.emailOrPhone.includes('@'));
          setSignInStep(1);
        } else {
          setSnackbarMessage(response?.error?.data?.message);
          setSnackbarType('error');
        }
      } else if (signInStep === 1) {
        let payload = {
          email: data.emailOrPhone,
          password: data.password,
        };
        if (isPhone) {
          if (!/^\d{6}$/.test(otp)) {
            setAlertData({
              title: 'Invalid OTP!',
              description: 'Please enter a valid 6 digit OTP!',
            });
            return;
          }
          payload = {
            phone: data.emailOrPhone,
            otp,
          };
        }
        const res = await signIn(payload);

        if (res?.error?.status === 401 || res?.error) {
          setSnackbarMessage(res?.error?.data?.message);
          setSnackbarType('error');
        }
      }
    },
    [initSignIn, isPhone, otp, signIn, signInStep],
  );

  const currentInputElement = {
    0: (
      <RenderInputWithRightIcon
        isViewOnly={isLoading}
        key={'emailOrPhone'}
        name="emailOrPhone"
        label="Email or phone"
        keyboardType="email-address"
        maxLength={50}
        iconType="iconify"
        onSubmitEditing={handleSubmit(onSubmit)}
        iconifyRightComponent={
          <Iconify icon="mi:email" size={24} color={LIGHT.text.disabled} />
        }
      />
    ),
    1: isPhone ? (
      <View style={[styles.otpInputContainer]}>
        <OTPInput length={6} onOtpComplete={setOtp} />
      </View>
    ) : (
      <RenderInputWithRightIcon
        isViewOnly={isLoading}
        inputRef={passwordFieldRef}
        label={'Password'}
        name="password"
        keyboardType="default"
        secureTextEntry={passSecure}
        maxLength={50}
        onSubmitEditing={handleSubmit(onSubmit)}
        onRightIconPress={() => setPassSecure(prevState => !prevState)}
        iconType="iconify"
        iconifyRightComponent={
          <>
            {passSecure ? (
              <Iconify
                icon={'akar-icons:eye'}
                size={24}
                color={LIGHT.text.disabled}
              />
            ) : null}
            {!passSecure ? (
              <Iconify
                icon={'akar-icons:eye-slashed'}
                size={24}
                color={LIGHT.text.disabled}
              />
            ) : null}
          </>
        }
      />
    ),
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSignInStep(0);
        setSnackbarMessage('');
        setSnackbarType('');
        reset();
      };
    }, [reset]),
  );
  const maskEmailPhone = useCallback(() => {
    const emailOrPhone = getValues()?.emailOrPhone;
    if (emailOrPhone?.length) {
      if (isPhone) {
        return maskPart(emailOrPhone);
      } else {
        const [localPart, domain] = emailOrPhone.split('@');
        return `${maskPart(localPart)}@${domain}`;
      }
    }
  }, [getValues, isPhone]);
  const handleGoogleLogin = () => {
    const link = `${API_BASE_URL}/auth/google/sign-in?redirectUrl=coables://app/SplashScreen/app&platform=mobile`;
    Linking.openURL(link, '_self');
  };
  const handleAppleLogin = () => {
    navigation.navigate('SocialAuthWebView', {
      method: 'signin',
    });
  };

  const handleFacebookLogin = () => {
    const link = `${API_BASE_URL}/auth/facebook/sign-in?redirectUrl=${API_BASE_URL}/app/SplashScreen/app&platform=mobile`;
    Linking.openURL(link, '_self');
  };

  return (
    <>
      <StatusBar backgroundColor={primaryColor[300]} barStyle="dark-content" />
      <KeyboardAwareScrollView
        style={[GlobalStyles.flex1, GlobalStyles.bgWhite]}
        keyboardShouldPersistTaps="always"
        extraHeight={200}
        extraScrollHeight={200}
        showsVerticalScrollIndicator={false}>
        {initSignInError?.data?.data?.status === 'EMAIL_NOT_VERIFIED' ? (
          <View
            style={[
              GlobalStyles.m(16),
              GlobalStyles.mb(0),
              GlobalStyles.p(16),
              {
                backgroundColor: LIGHT.chip.lightRed,
                borderWidth: 1,
                borderColor: LIGHT.error.main,
                borderRadius: 4,
              },
            ]}>
            <Text
              style={[
                typography.descMedium,
                {color: LIGHT.error.darker},
                GlobalStyles.mb(8),
              ]}>
              Your email address is not verified. Please check your inbox and
              verify your email to log in.
            </Text>
            <View style={GlobalStyles.rowCenter}>
              <Text
                style={(typography.descMedium, {color: LIGHT.error.darker})}>
                Click here to
              </Text>
              <TouchableOpacity
                style={[GlobalStyles.pl(4), GlobalStyles.rowCenter]}
                onPress={async () => {
                  const values = getValues();
                  if (values?.emailOrPhone) {
                    const res = await resendVerification({
                      email: values?.emailOrPhone,
                    });
                    if (res?.data?.status === 'SUCCESS') {
                      setSnackbarMessage(res?.data?.message);
                      setSnackbarType('success');
                    } else {
                      setSnackbarMessage(
                        res?.error?.data?.message || res?.error?.error,
                      );
                      setSnackbarType('error');
                    }
                  } else {
                    setSnackbarMessage('Please enter a valid email');
                    setSnackbarType('error');
                  }
                }}>
                <Text
                  style={
                    (typography.descMedium,
                    {
                      textDecorationLine: 'underline',
                      color: LIGHT.error.darker,
                    })
                  }>
                  Resend Verification Mail
                </Text>
                {isEmailSendingLoading && (
                  <ActivityIndicator
                    color={LIGHT.error.darker}
                    size={18}
                    style={GlobalStyles.ml(8)}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        <View style={GlobalStyles.p(16)}>
          <View style={[GlobalStyles.mb(20), GlobalStyles.mt(14)]}>
            <Text style={typography.headlineLarge}>Welcome Back!</Text>
            <Text
              style={[
                typography.bodyMedium,
                GlobalStyles.mt(8),
                GlobalStyles.textCenter,
              ]}>
              Please enter your details
            </Text>
          </View>
          {signInStep === 1 ? (
            <Text style={[typography.descSmall, GlobalStyles.mb(16)]}>
              {isPhone
                ? `We have sent an OTP code to your phone number +91 ${maskEmailPhone()}. Enter the OTP code below to verify.`
                : `Please enter password to sign in as ${maskEmailPhone()}.`}
            </Text>
          ) : null}
          <FormProvider {...methods}>
            {currentInputElement[signInStep]}
          </FormProvider>

          <View
            style={[
              GlobalStyles.rowBetween,
              GlobalStyles.mb(4),
              {justifyContent: 'flex-end'},
            ]}>
            {signInStep === 1 ? (
              <Text
                style={[
                  styles.forgotPassword,
                  {
                    color:
                      otpTimer > 0 && isPhone
                        ? LIGHT.text.disabled
                        : LIGHT.text.primary,
                  },
                ]}
                underline="none"
                onPress={() => {
                  if (!isPhone) {
                    setSignInStep(0);
                    navigation.navigate('ForgotPassword');
                  } else {
                    if (otpTimer > 0) {
                      return;
                    }
                    sendOTP();
                  }
                }}>
                {isPhone
                  ? otpTimer > 0
                    ? `Resend OTP in ${Math.floor(otpTimer / 60)}:${
                        otpTimer % 60 < 10 ? '0' : ''
                      }${otpTimer % 60} seconds`
                    : 'Resend OTP'
                  : 'Forgot password?'}
              </Text>
            ) : null}
          </View>
          <View style={[GlobalStyles.rowBetween, GlobalStyles.mt(8)]}>
            {signInStep > 0 ? (
              <CommonButton
                style={{
                  flexGrow: 1,
                  flexShrink: 1,
                  borderWidth: 1,
                  borderColor: LIGHT.primary.main,
                  marginRight: 16,
                }}
                mode="contained"
                onPress={() => {
                  setSignInStep(prev => prev - 1);
                  setOtp('');
                  setOtpTimer(120);
                }}
                buttonColor={'transparent'}
                buttonTitle={'Back'}
              />
            ) : null}
            <CommonButton
              style={{flexGrow: 1, flexShrink: 1}}
              mode="contained"
              loading={isLoading || isInitSignInLoading}
              onPress={handleSubmit(onSubmit)}
              disabled={signInStep > 0 && isPhone && otp.length !== 6}
              buttonTitle={signInStep === 0 ? 'Next' : 'Sign In'}
            />
          </View>
          <View style={GlobalStyles.rowCenter}>
            <Divider style={styles.divider} />
            <Text
              style={[
                typography.subtitleMedium,
                GlobalStyles.textCenter,
                GlobalStyles.mv(screenHeight * 0.04),
                GlobalStyles.mh(16),
              ]}>
              Or
            </Text>
            <Divider style={styles.divider} />
          </View>
          <View style={styles.centeredContent}>
            <CommonButton
              style={[styles.buttonContainer]}
              buttonColor={'white'}
              labelStyle={styles.labelStyle}
              buttonIcon={<Iconify icon="flat-color-icons:google" size={20} />}
              mode="contained"
              onPress={handleGoogleLogin}
              buttonTitle={'Sign in with google'}
            />
            {Platform.OS === 'ios' ? (
              <CommonButton
                style={[styles.buttonContainer, GlobalStyles.mt(16)]}
                buttonColor={'white'}
                labelStyle={styles.labelStyle}
                buttonIcon={
                  <Iconify icon="ic:sharp-apple" size={20} color={'black'} />
                }
                mode="contained"
                onPress={handleAppleLogin}
                buttonTitle={'Sign in with apple'}
              />
            ) : null}
            <CommonButton
              style={[styles.buttonContainer, GlobalStyles.mt(16)]}
              labelStyle={styles.labelStyle}
              mode="contained"
              buttonIcon={
                <Iconify icon="la:facebook-f" size={20} color={'#1976D2'} />
              }
              onPress={handleFacebookLogin}
              buttonColor={'white'}
              buttonTitle={'Sign in with facebook'}
            />
          </View>
          <View style={styles.haveAnAccount}>
            <Text style={styles.haveAnAccountText}>
              Don't have an account?{' '}
              <Text
                style={[GlobalStyles.linkText, GlobalStyles.ml(6)]}
                underline="none"
                onPress={() => {
                  navigation.navigate('SignUp');
                }}>
                Sign Up
              </Text>
            </Text>
            <Text
              style={[
                GlobalStyles.linkText,
                GlobalStyles.textCenter,
                GlobalStyles.mt(10),
              ]}
              underline="none"
              onPress={() => navigation.navigate('Dashboard')}>
              Go to Dashboard
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
      {alertData?.title ? (
        <CustomAlert {...alertData} defaultClear={() => setAlertData({})} />
      ) : null}
      <CommonSnackBar
        message={snackbarMessage}
        type={snackbarType}
        clearMessage={() => setSnackbarMessage('')}
      />
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: LIGHT.text.primary,
    borderRadius: 40, // Rounded corners
    minHeight: 2, // Minimum height
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    minWidth: 140,
  },
  divider: {
    height: 1,
    backgroundColor: LIGHT.borderGrey,
    flexGrow: 1,
  },
  labelStyle: {
    color: 'black',
    fontFamily: 'San Francisco',
    fontSize: 16,
  },
  otpInputContainer: {
    width: '100%',
    backgroundColor: LIGHT.bg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  haveAnAccount: {
    paddingTop: 30,
    paddingBottom: 16,
  },
  haveAnAccountText: {
    textAlign: 'center',
    ...typography.descMedium,
  },
  forgotPassword: {
    textAlign: 'right',
    fontSize: 14,
    lineHeight: 24,
    fontFamily: fontFamily.semiBold,
    color: LIGHT.text.primary,
    marginBottom: 4,
  },
});

SignIn.propTypes = {
  route: PropTypes.any,
};

export default SignIn;
