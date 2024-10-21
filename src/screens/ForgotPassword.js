import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import {useForm, FormProvider} from 'react-hook-form';
import {View, StyleSheet, StatusBar} from 'react-native';
import {Iconify} from 'react-native-iconify';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Text} from 'react-native-paper';
import * as yup from 'yup';

import CommonButton from '../components/CommonButton';
import EmailSentModal from '../components/EmailSentModal';
import RenderInputWithRightIcon from '../components/RenderInputWithRightIcon';
import {LIGHT, primaryColor} from '../constants/Colors';
import {typography} from '../constants/Fonts';
import GlobalStyles from '../constants/GlobalStyles';
import validationSchemas from '../utils/validationSchema';
import {useForgotPasswordMutation} from '../store/apis/auth';
import {useCallback, useEffect, useState} from 'react';
const validationSchema = yup.object({
  email: validationSchemas.email.trim(),
});

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [forgotPassword, {isLoading, isSuccess, isError, error}] =
    useForgotPasswordMutation();
  const [isResend, setIsResend] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('');

  const methods = useForm({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const {handleSubmit, getValues} = methods;
  const [enteredEmail, setEnteredEmail] = useState('');
  const onSubmit = useCallback(
    async data => {
      await forgotPassword({
        ...data,
      });
    },
    [forgotPassword],
  );

  useEffect(() => {
    return () => {
      setEnteredEmail('');
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        if (isResend) {
          setSnackbarMessage('Email sent successfully!');
          setSnackbarType('success');
        }
        setIsModalVisible(true);
        if (isResend) {
          setIsResend(false);
        }
      } else if (isError && error?.data?.message) {
        setSnackbarMessage(error?.data?.message);
        setSnackbarType('error');
      }
    }
  }, [error?.data?.message, isError, isLoading, isResend, isSuccess]);

  const resendEmail = async () => {
    setIsResend(true);
    await forgotPassword({
      email: enteredEmail,
    });
  };

  const userEmail = getValues('email');

  useEffect(() => {
    if (userEmail) {
      setEnteredEmail(userEmail);
    }
  }, [userEmail]);

  return (
    <>
      <StatusBar backgroundColor={primaryColor[300]} barStyle="dark-content" />
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
                icon="mdi:lock-outline"
                size={81.4}
                color={primaryColor[300]}
              />
            </View>
            <Text style={[typography.headlineLarge]}>Forgot Password?</Text>
            <Text style={[typography.subtitleSmall, styles.descText]}>
              Enter the email address you used to create the account, and we
              will email you instructions to reset your password.
            </Text>
          </View>

          <FormProvider {...methods}>
            <RenderInputWithRightIcon
              isViewOnly={isLoading}
              label={'Enter Email Address'}
              name="email"
              keyboardType="email-address"
              maxLength={50}
              iconType="iconify"
              onSubmitEditing={handleSubmit(onSubmit)}
              iconifyRightComponent={
                <Iconify
                  icon="mi:email"
                  size={24}
                  color={LIGHT.text.disabled}
                />
              }
            />
          </FormProvider>
          <CommonButton
            style={GlobalStyles.mt(8)}
            mode="contained"
            loading={isLoading}
            onPress={handleSubmit(onSubmit)}
            buttonTitle="Send email"
          />

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
        </View>
      </KeyboardAwareScrollView>
      <EmailSentModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        resendEmail={resendEmail}
        isLoading={isLoading}
        enteredEmail={enteredEmail}
        snackbarMessage={snackbarMessage}
        setSnackbarMessage={setSnackbarMessage}
        snackbarType={snackbarType}
      />
    </>
  );
};
const styles = StyleSheet.create({
  haveAnAccount: {
    paddingTop: 30,
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
    padding: 32,
    borderRadius: 100,
    marginTop: 26,
    marginBottom: 20,
  },
});
export default ForgotPassword;
