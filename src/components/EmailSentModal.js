import {useNavigation} from '@react-navigation/native';
import PropTypes, {bool} from 'prop-types';
import {StyleSheet, View} from 'react-native';
import {Iconify} from 'react-native-iconify';
import {Text} from 'react-native-paper';
import GlobalStyles from '../constants/GlobalStyles';
import CommonActionSheet from './CommonActionSheet';
import {typography} from '../constants/Fonts';
import {primaryColor} from '../constants/Colors';
import CommonButton from './CommonButton';
import CommonSnackBar from './CommonSnackBar';

const EmailSentModal = props => {
  const {
    isModalVisible,
    setIsModalVisible,
    enteredEmail,
    resendEmail,
    isLoading,
    snackbarMessage,
    setSnackbarMessage,
    snackbarType,
  } = props;
  const navigation = useNavigation();

  return (
    <CommonActionSheet
      isVisible={isModalVisible}
      hideModal={() => setIsModalVisible(false)}>
      <View>
        <View style={GlobalStyles.ph(16)}>
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
            <Text style={typography.headlineLarge}>Email Sent</Text>
            <Text style={[typography.subtitleSmall, styles.descText]}>
              We have sent you an email{' '}
              {enteredEmail ? `at ${enteredEmail}` : ''}, check your inbox and
              follow the instructions to reset your account password.
            </Text>
            {enteredEmail ? (
              <Text
                style={[
                  typography.subtitleSmall,
                  styles.descText,
                  GlobalStyles.mt(10),
                ]}>
                Did not receive the email?
              </Text>
            ) : null}
          </View>
          {enteredEmail ? (
            <CommonButton
              mode="contained"
              loading={isLoading}
              onPress={resendEmail}
              buttonTitle="Resend Email"
            />
          ) : null}

          <View
            style={[styles.haveAnAccount, !enteredEmail && GlobalStyles.pt(0)]}>
            <Text style={[styles.haveAnAccountText]}>
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
      <CommonSnackBar
        message={snackbarMessage}
        type={snackbarType}
        clearMessage={() => setSnackbarMessage('')}
      />
    </CommonActionSheet>
  );
};

EmailSentModal.propTypes = {
  isModalVisible: PropTypes.bool,
  setIsModalVisible: PropTypes.func,
  enteredEmail: PropTypes.string,
  resendEmail: PropTypes.func,
  isLoading: bool,
  snackbarMessage: PropTypes.string,
  snackbarType: PropTypes.string,
  setSnackbarMessage: PropTypes.func,
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
  sentTitleIconContainer: {
    backgroundColor: primaryColor[100],
    padding: 24,
    borderRadius: 100,
    marginTop: 16,
    marginBottom: 20,
  },
});

export default EmailSentModal;
