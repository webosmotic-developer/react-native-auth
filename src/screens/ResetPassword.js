import React, {useCallback, useEffect, useRef, useState} from 'react';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
import {useForm, FormProvider} from 'react-hook-form';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {Iconify} from 'react-native-iconify';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ActivityIndicator} from 'react-native-paper';
import * as yup from 'yup';

import CommonActionSheet from '../components/CommonActionSheet';
import CommonButton from '../components/CommonButton';
import CommonSnackBar from '../components/CommonSnackBar';
import EmailSentModal from '../components/EmailSentModal';
import RenderInputWithRightIcon from '../components/RenderInputWithRightIcon';
import {LIGHT, primaryColor} from '../constants/Colors';
import {typography} from '../constants/Fonts';
import GlobalStyles from '../constants/GlobalStyles';
import validationSchemas from '../utils/validationSchema';
import {
  useLazyResendForgotPasswordMailQuery,
  useResetPasswordMutation,
  useVerifyTokenQuery,
} from '../store/apis/auth';

const validationSchema = yup.object({
  password: validationSchemas.password,
  confirmPassword: validationSchemas.confirmPassword,
});

const ResetPassword = ({route}) => {
  const token = route?.params?.token || '';
  const [
    resendVerificationLink,
    {isLoading: isResend, isSuccess: isResendSuccess, data: resendData},
  ] = useLazyResendForgotPasswordMailQuery();
  const navigation = useNavigation();
  const [resetPassword, {isLoading, isSuccess, isError, error}] =
    useResetPasswordMutation();
  const {
    isLoading: isVerifyTokenLoading,
    isError: isVerifyTokenError,
    error: verifyTokenError,
  } = useVerifyTokenQuery({
    verifyToken: token,
  });
  const confirmPasswordFieldRef = useRef();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passSecure, setPassSecure] = useState(true);
  const [confirmPassSecure, setConfirmPassSecure] = useState(true);

  useEffect(() => {
    if (!isResend && resendData?.status === 'SUCCESS') {
      setSnackbarMessage(resendData?.message);
      setSnackbarType('success');
    }
  }, [isResend, resendData?.message, resendData?.status]);

  const methods = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const {handleSubmit, reset} = methods;

  const onSubmit = useCallback(
    async data => {
      delete data.confirmPassword;
      await resetPassword({
        token,
        password: data.password,
      });
    },
    [resetPassword, token],
  );

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        reset();
        setIsModalVisible(true);
      } else if (isError && error?.data?.message) {
        setSnackbarMessage(error?.data?.message);
        setSnackbarType('error');
      }
    }
  }, [error?.data?.message, isError, isLoading, isSuccess, reset]);

  return (
    <>
      <StatusBar backgroundColor={primaryColor[300]} barStyle="dark-content" />
      {isVerifyTokenLoading ? (
        <View style={[GlobalStyles.centeredContent, GlobalStyles.bgWhite]}>
          <ActivityIndicator size={40} />
        </View>
      ) : (
        <>
          <KeyboardAwareScrollView
            style={[GlobalStyles.flex1, GlobalStyles.bgWhite]}
            keyboardShouldPersistTaps="always"
            extraHeight={100}
            extraScrollHeight={100}
            showsVerticalScrollIndicator={false}>
            <View style={GlobalStyles.ph(16)}>
              <View
                style={[
                  GlobalStyles.mb(20),
                  GlobalStyles.mt(14),
                  GlobalStyles.alignCenter,
                ]}>
                <View style={styles.titleIconContainer}>
                  <Iconify
                    icon="mdi:lock-reset"
                    size={81.4}
                    color={primaryColor[300]}
                  />
                </View>
                <Text style={typography.headlineLarge}>Reset Password?</Text>
                <Text style={[typography.subtitleSmall, styles.descText]}>
                  Your new password must be different from the previous password
                  you used.
                </Text>
              </View>

              <FormProvider {...methods}>
                <RenderInputWithRightIcon
                  isViewOnly={isLoading}
                  label={'Password'}
                  name="password"
                  keyboardType="default"
                  secureTextEntry={passSecure}
                  maxLength={50}
                  onRightIconPress={() =>
                    setPassSecure(prevState => !prevState)
                  }
                  onSubmitEditing={() => {
                    confirmPasswordFieldRef?.current?.focus();
                  }}
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
                <RenderInputWithRightIcon
                  isViewOnly={isLoading}
                  label={'Confirm Password'}
                  name="confirmPassword"
                  keyboardType="default"
                  inputRef={confirmPasswordFieldRef}
                  secureTextEntry={confirmPassSecure}
                  maxLength={50}
                  onSubmitEditing={handleSubmit(onSubmit)}
                  onRightIconPress={() =>
                    setConfirmPassSecure(prevState => !prevState)
                  }
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
              </FormProvider>
              <CommonButton
                style={GlobalStyles.mt(8)}
                mode="contained"
                loading={isLoading}
                onPress={handleSubmit(onSubmit)}
                buttonTitle="Reset Password"
              />

              <Text
                style={[
                  styles.haveAnAccountText,
                  GlobalStyles.pv(
                    verifyTokenError?.data?.data?.status === 'INVALID'
                      ? 16
                      : 30,
                  ),
                ]}>
                Back to{'  '}
                <Text
                  style={GlobalStyles.linkText}
                  underline="none"
                  onPress={() => {
                    navigation.navigate('SignIn');
                  }}>
                  Sign In
                </Text>
              </Text>
            </View>
          </KeyboardAwareScrollView>
          {!isResendSuccess ? (
            <CommonActionSheet
              isVisible={isModalVisible || isVerifyTokenError}
              hideModal={() => setIsModalVisible(false)}>
              <View>
                <View style={[GlobalStyles.ph(16), GlobalStyles.mb(30)]}>
                  <View
                    style={[
                      GlobalStyles.mt(14),
                      GlobalStyles.mb(20),
                      GlobalStyles.alignCenter,
                    ]}>
                    <View style={[styles.sentTitleIconContainer]}>
                      <Iconify
                        icon="mdi:lock-check-outline"
                        size={69.77}
                        color={primaryColor[300]}
                      />
                    </View>
                    <Text style={typography.headlineLarge}>
                      {isVerifyTokenError
                        ? verifyTokenError?.data?.data?.status
                        : 'Password reset complete'}
                    </Text>
                    <Text style={[typography.subtitleSmall, styles.descText]}>
                      {isVerifyTokenError
                        ? verifyTokenError?.data?.data?.message
                        : 'Your password reset was successful. You can now proceed to login to your account.'}
                    </Text>
                  </View>
                  {verifyTokenError?.data?.data?.status !== 'INVALID' ? (
                    <CommonButton
                      mode="contained"
                      loading={isVerifyTokenError ? isResend : isLoading}
                      onPress={async () => {
                        if (
                          isVerifyTokenError &&
                          verifyTokenError?.data?.data?.status !== 404
                        ) {
                          await resendVerificationLink({
                            token,
                          });
                        } else {
                          navigation.navigate('SignIn');
                        }
                      }}
                      buttonTitle={
                        isVerifyTokenError &&
                        verifyTokenError?.data?.data?.status !== 404
                          ? 'Resend verification mail'
                          : 'Go to sign in'
                      }
                    />
                  ) : null}
                  {isVerifyTokenError ? (
                    <View style={styles.haveAnAccount}>
                      <Text style={styles.haveAnAccountText}>
                        Back to{'  '}
                        <Text
                          style={GlobalStyles.linkText}
                          underline="none"
                          onPress={() => navigation.navigate('SignIn')}>
                          Sign In
                        </Text>
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </CommonActionSheet>
          ) : (
            <EmailSentModal
              isModalVisible={true}
              setIsModalVisible={() => {}}
              isLoading={isLoading}
            />
          )}
          <CommonSnackBar
            message={snackbarMessage}
            type={snackbarType}
            clearMessage={() => setSnackbarMessage('')}
          />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  haveAnAccount: {
    paddingBottom: 16,
  },
  haveAnAccountText: {
    textAlign: 'center',
    ...typography.descMedium,
  },
  descText: {
    marginTop: 10,
    width: '88%',
    alignSelf: 'center',
  },
  titleIconContainer: {
    backgroundColor: primaryColor[100],
    padding: 26,
    borderRadius: 100,
    marginTop: 26,
    marginBottom: 20,
  },
  sentTitleIconContainer: {
    backgroundColor: primaryColor[100],
    padding: 24,
    borderRadius: 100,
    marginTop: 16,
    marginBottom: 20,
  },
});

ResetPassword.propTypes = {
  route: PropTypes.any,
};

export default ResetPassword;
