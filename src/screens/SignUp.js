import React, {useCallback, useEffect, useRef, useState} from 'react';

import {yupResolver} from '@hookform/resolvers/yup';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useForm, FormProvider} from 'react-hook-form';
import {View, StyleSheet, Linking, StatusBar, Platform} from 'react-native';
import {Iconify} from 'react-native-iconify';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Divider, Text} from 'react-native-paper';
import * as yup from 'yup';

import {API_BASE_URL} from '../../env.json';
import CommonActionSheet from '../components/CommonActionSheet';
import CommonButton from '../components/CommonButton';
import CommonCheckbox from '../components/CommonCheckbox';
import CommonSnackBar from '../components/CommonSnackBar';
import CustomAlert from '../components/CustomAlert';
import RenderInputWithRightIcon from '../components/RenderInputWithRightIcon';
import OTPInput from '../components/OTPInput';
import {LIGHT, primaryColor} from '../constants/Colors';
import {typography} from '../constants/Fonts';
import GlobalStyles from '../constants/GlobalStyles';
import {
  useResendOTPMutation,
  useSignUpInitMutation,
  useSignUpValidateMutation,
} from '../store/apis/auth';
import {maskPart, screenHeight, screenWidth} from '../utils/commonFunctions';
import validationSchemas from '../utils/validationSchema';
let resendTimer = null;
const SignUp = () => {
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('');
  const [passSecure, setPassSecure] = useState(true);
  const [confirmPassSecure, setConfirmPassSecure] = useState(true);
  const navigation = useNavigation();
  const [signUp, {isLoading, isSuccess, isError, error}] =
    useSignUpValidateMutation();
  const [initSignUp] = useSignUpInitMutation();
  const [alertData, setAlertData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const confirmPasswordFieldRef = useRef();
  const [signUpStep, setSignUpStep] = useState(0);
  const [isPhone, setIsPhone] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [resendOTP] = useResendOTPMutation();
  const [otpTimer, setOtpTimer] = useState(120);
  // const [isEmailPublic, setIsEmailPublic] = useState(true);
  const [isAgreed, setIsAgreed] = useState(true);
  const [modalType, setModalType] = useState('');

  const validationSchema = yup.object({
    ...(signUpStep === 0 && {emailOrPhone: validationSchemas.contact}),
    ...(signUpStep === 1 &&
      !isPhone && {
        password: validationSchemas.password,
        confirmPassword: validationSchemas.confirmPassword,
      }),
  });

  const methods = useForm({
    defaultValues: {
      emailOrPhone: '',
    },
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const {handleSubmit, reset, setValue, getValues} = methods;

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
    if (signUpStep === 1 && isPhone) {
      resendCodeFunc();
    } else {
      clearInterval(resendTimer);
    }
  }, [isPhone, resendCodeFunc, signUpStep]);

  const sendOTP = async () => {
    const values = getValues();
    const res = await resendOTP({
      type: 'register',
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
  };

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        reset();
        setIsModalVisible(true);
      } else if (isError) {
        setSnackbarMessage(error?.data?.message);
        setSnackbarType('error');
      }
    }
  }, [error?.data?.message, isError, isLoading, isSuccess, reset]);

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

  const onSubmit = useCallback(
    async data => {
      if (signUpStep === 0) {
        if (!isAgreed) {
          setAlertData({
            title: 'Consent Required!',
            description:
              'Please accept the terms and conditions and privacy policy!',
          });
          return;
        }
        const response = await initSignUp({
          body: {identifier: data.emailOrPhone},
        });
        if (response?.data?.status === 'SUCCESS') {
          setSnackbarMessage(response.data?.message);
          setSnackbarType('success');
          setIsPhone(!data.emailOrPhone.includes('@'));
          setSignUpStep(1);
        } else {
          setSnackbarMessage(response?.error?.data?.message);
          setSnackbarType('error');
        }
      } else if (signUpStep === 1) {
        if (isPhone) {
          if (!/^\d{6}$/.test(otp)) {
            setAlertData({
              title: 'Invalid OTP!',
              description: 'Please enter a valid 6 digit OTP!',
            });
            return;
          }
          await signUp({
            phone: data.emailOrPhone,
            otp,
          });
        } else {
          delete data.confirmPassword;
          await signUp({
            email: data.emailOrPhone,
            password: data.password,
            // isEmailPrivate: !isEmailPublic,
          });
        }
      }
    },
    [
      initSignUp,
      isAgreed,
      // isEmailPublic,
      isPhone,
      otp,
      signUp,
      signUpStep,
    ],
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSignUpStep(0);
        setSnackbarMessage('');
        setSnackbarType('');
        reset();
      };
    }, [reset]),
  );

  const handleGoogleSignUp = () => {
    const link = `${API_BASE_URL}/auth/google/sign-up?redirectUrl=coables://app/SplashScreen/app&platform=mobile`;
    Linking.openURL(link, '_self');
  };

  const handleAppleSignUp = () => {
    navigation.navigate('SocialAuthWebView', {
      method: 'signup',
    });
  };

  const currentInputElement = {
    0: (
      <>
        <RenderInputWithRightIcon
          isViewOnly={isLoading}
          label={'Email or phone'}
          name="emailOrPhone"
          keyboardType="email-address"
          maxLength={50}
          iconType="iconify"
          onSubmitEditing={handleSubmit(onSubmit)}
          iconifyRightComponent={
            <Iconify icon="mi:email" size={24} color={LIGHT.text.disabled} />
          }
        />
        <View
          style={[
            styles.switchContainer,
            GlobalStyles.mt(10),
            {justifyContent: 'flex-start'},
          ]}>
          <CommonCheckbox
            checkboxStyle={{height: 20, width: 20}}
            value={isAgreed}
            onPress={() => {
              setIsAgreed(prev => !prev);
            }}
          />
          <Text
            style={[
              typography.bodyMedium,
              {color: LIGHT.text.disabled, maxWidth: '90%'},
              GlobalStyles.ml(8),
            ]}>
            I agree to{' '}
            <Text
              onPress={() => setModalType('privacyPolicy')}
              style={[
                typography.bodyMedium,
                {
                  color: LIGHT.primary.darker,
                  textDecorationLine: 'underline',
                },
              ]}>
              Privacy Policy
            </Text>{' '}
            and{' '}
            <Text
              onPress={() => setModalType('termsAndConditions')}
              style={[
                typography.bodyMedium,
                {color: LIGHT.primary.darker, textDecorationLine: 'underline'},
              ]}>
              Terms and Conditions
            </Text>
          </Text>
        </View>
      </>
    ),
    1: isPhone ? (
      <View style={[styles.otpInputContainer]}>
        <OTPInput length={6} onOtpComplete={setOtp} />
      </View>
    ) : (
      <>
        <RenderInputWithRightIcon
          key="signup_password"
          isViewOnly={isLoading}
          label={'Password'}
          name="password"
          keyboardType="default"
          secureTextEntry={passSecure}
          maxLength={50}
          onRightIconPress={() => setPassSecure(prevState => !prevState)}
          iconType="iconify"
          onSubmitEditing={() => confirmPasswordFieldRef?.current?.focus()}
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
        <RenderInputWithRightIcon
          isViewOnly={isLoading}
          key="signup_cnf_password"
          label={'Confirm Password'}
          name="confirmPassword"
          keyboardType="default"
          secureTextEntry={confirmPassSecure}
          maxLength={50}
          inputRef={confirmPasswordFieldRef}
          onSubmitEditing={handleSubmit(onSubmit)}
          onRightIconPress={() => setConfirmPassSecure(prevState => !prevState)}
          iconType="iconify"
          iconifyRightComponent={
            <>
              {confirmPassSecure ? (
                <Iconify
                  icon={'akar-icons:eye'}
                  size={24}
                  color={LIGHT.text.disabled}
                />
              ) : null}
              {!confirmPassSecure ? (
                <Iconify
                  icon={'akar-icons:eye-slashed'}
                  size={24}
                  color={LIGHT.text.disabled}
                />
              ) : null}
            </>
          }
        />
        {/* <View style={styles.switchContainer}>
          <Text
            style={[
              typography.bodyLarge,
              { color: LIGHT.text.disabled },
              GlobalStyles.ml(8)
            ]}
          >
            Show email publicly
          </Text>
          <Switch
            value={isEmailPublic}
            onValueChange={() => setIsEmailPublic((prev) => !prev)}
            color="#90AE21"
            trackColor={{
              false: '#D6D6D6',
              true: '#D6D6D6'
            }}
            thumbColor={isEmailPublic ? primaryColor[400] : primaryColor[400]}
          />
        </View> */}
      </>
    ),
  };

  const handleFacebookSignUp = () => {
    const link = `${API_BASE_URL}/auth/facebook/sign-up?redirectUrl=${API_BASE_URL}/app/SplashScreen/app&platform=mobile`;
    Linking.openURL(link, '_self');
  };

  useEffect(() => {
    if (signUpStep === 0) {
      setOtpTimer(120);
      setValue('password', '');
      setValue('confirmPassword', '');
    }
  }, [setValue, signUpStep]);

  return (
    <>
      <StatusBar backgroundColor={primaryColor[300]} barStyle="dark-content" />
      <KeyboardAwareScrollView
        style={[GlobalStyles.flex1, GlobalStyles.bgWhite]}
        keyboardShouldPersistTaps="always"
        extraHeight={100}
        extraScrollHeight={100}
        showsVerticalScrollIndicator={false}>
        <View style={GlobalStyles.p(16)}>
          <View style={[GlobalStyles.mb(20), GlobalStyles.mt(14)]}>
            <Text
              style={[
                typography.headlineLarge,
                GlobalStyles.mt(16),
                {textAlign: 'left'},
              ]}>
              Sign up
            </Text>
          </View>
          {signUpStep === 1 ? (
            isPhone ? (
              <Text style={typography.descSmall}>
                We have sent an OTP code to your phone number +91{' '}
                {maskEmailPhone()}. Enter the OTP code below to verify.
              </Text>
            ) : (
              <Text style={typography.descSmall}>
                Please enter password to sign up as {maskEmailPhone()}.
              </Text>
            )
          ) : null}

          <FormProvider {...methods}>
            {currentInputElement[signUpStep]}
          </FormProvider>
          <View
            style={[
              GlobalStyles.rowBetween,
              GlobalStyles.mb(4),
              {justifyContent: 'flex-end'},
            ]}>
            {signUpStep === 1 && isPhone ? (
              <Text
                style={[
                  styles.forgotPassword,
                  {
                    color:
                      otpTimer > 0 ? LIGHT.text.disabled : LIGHT.text.primary,
                  },
                ]}
                underline="none"
                onPress={() => {
                  if (otpTimer > 0) {
                    return;
                  }
                  sendOTP();
                }}>
                {otpTimer > 0
                  ? `Resend OTP in ${Math.floor(otpTimer / 60)}:${
                      otpTimer % 60 < 10 ? '0' : ''
                    }${otpTimer % 60} seconds`
                  : 'Resend OTP'}
              </Text>
            ) : null}
          </View>
          <View style={[GlobalStyles.rowBetween, GlobalStyles.mt(8)]}>
            {signUpStep > 0 ? (
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
                  setSignUpStep(prev => prev - 1);
                  setValue('password', '');
                  setValue('confirmPassword', '');
                }}
                buttonColor={'transparent'}
                buttonTitle={'Back'}
              />
            ) : null}

            <CommonButton
              style={{flexGrow: 1, flexShrink: 1}}
              mode="contained"
              loading={isLoading}
              onPress={handleSubmit(onSubmit)}
              disabled={signUpStep > 0 && isPhone && otp.length !== 6}
              buttonTitle={signUpStep === 0 ? 'Next' : 'Sign Up'}
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
              buttonColor={'white'}
              style={[styles.buttonContainer]}
              labelStyle={styles.labelStyle}
              buttonIcon={<Iconify icon="flat-color-icons:google" size={20} />}
              mode="contained"
              onPress={handleGoogleSignUp}
              buttonTitle={'Sign up with google'}
            />
            {Platform.OS === 'ios' ? (
              <CommonButton
                buttonColor={'white'}
                style={[styles.buttonContainer, GlobalStyles.mt(16)]}
                labelStyle={styles.labelStyle}
                buttonIcon={
                  <Iconify icon="ic:sharp-apple" size={26} color={'black'} />
                }
                mode="contained"
                onPress={handleAppleSignUp}
                buttonTitle={'Sign up with apple'}
              />
            ) : null}
            <CommonButton
              style={[styles.buttonContainer, GlobalStyles.mt(16)]}
              labelStyle={styles.labelStyle}
              mode="contained"
              buttonIcon={
                <Iconify icon="la:facebook-f" size={20} color={'#1976D2'} />
              }
              onPress={handleFacebookSignUp}
              buttonColor={'white'}
              buttonTitle={'Sign up with facebook'}
            />
          </View>
          <View style={styles.haveAnAccount}>
            <Text style={styles.haveAnAccountText}>
              Already have an account?{' '}
              <Text
                style={GlobalStyles.linkText}
                underline="none"
                onPress={() => navigation.navigate('SignIn')}>
                Sign In
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

      <CommonActionSheet
        isVisible={isModalVisible}
        hideModal={() => setIsModalVisible(false)}>
        <View>
          <View style={[GlobalStyles.ph(16), GlobalStyles.mb(30)]}>
            <View
              style={[
                GlobalStyles.mb(20),
                GlobalStyles.mt(14),
                GlobalStyles.alignCenter,
              ]}>
              <View style={styles.sentTitleIconContainer}>
                <Iconify
                  icon="mdi:email-sent-outline"
                  size={69.77}
                  color={primaryColor[300]}
                />
              </View>
              <Text style={typography.headlineLarge}>
                Registration successful!
              </Text>
              <Text style={[typography.subtitleSmall, styles.descText]}>
                {isPhone
                  ? 'Your phone number has been successfully registered and verified. Welcome to the app!'
                  : 'A verification email has been sent to your registered email. Kindly verify to continue using the app.'}
              </Text>
            </View>
            <View style={styles.haveAnAccount}>
              <Text style={styles.haveAnAccountText}>
                Back to{'  '}
                <Text
                  style={GlobalStyles.linkText}
                  underline="none"
                  onPress={() => {
                    setIsModalVisible(false);
                    navigation.navigate('SignIn');
                  }}>
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </CommonActionSheet>
      <CommonSnackBar
        message={snackbarMessage}
        type={snackbarType}
        clearMessage={() => setSnackbarMessage('')}
      />
      {alertData?.title ? (
        <CustomAlert {...alertData} defaultClear={() => setAlertData({})} />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: 0,
    ...GlobalStyles.bgWhite,
    ...GlobalStyles.w(screenWidth),
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    ...GlobalStyles.pb(20),
  },
  haveAnAccount: {
    ...GlobalStyles.pt(30),
  },
  haveAnAccountText: {
    ...GlobalStyles.textCenter,
    ...typography.descMedium,
  },
  divider: {
    height: 1,
    backgroundColor: LIGHT.borderGrey,
    flexGrow: 1,
  },
  buttonContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: LIGHT.text.primary,
    borderRadius: 40, // Rounded corners
    minHeight: 44, // Minimum height
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    minWidth: 140,
  },
  labelStyle: {
    color: 'black',
    fontFamily: 'San Francisco',
    fontSize: 16,
  },
  descText: {
    marginTop: 10,
    width: '88%',
    alignSelf: 'center',
  },
  sentTitleIconContainer: {
    backgroundColor: primaryColor[100],
    padding: 24,
    borderRadius: 100,
    marginTop: 16,
    marginBottom: 20,
  },

  otpInputContainer: {
    width: '100%',
    backgroundColor: LIGHT.bg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
});

export default SignUp;
