/* eslint-disable react/react-in-jsx-scope */
import {StyleSheet, Text, View} from 'react-native';
import GlobalStyles from '../constants/GlobalStyles';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../context/AuthProvider';
import {typography} from '../constants/Fonts';
import CommonButton from '../components/CommonButton';
import {LIGHT} from '../constants/Colors';
import {Iconify} from 'react-native-iconify';
import CustomAlert from '../components/CustomAlert';
import {useState} from 'react';

const Dashboard = () => {
  const navigation = useNavigation();
  const [alertData, setAlertData] = useState({});
  const auth = useAuth();

  return (
    <View style={[GlobalStyles.alignJustifyCenter, GlobalStyles.grow1]}>
      <Text style={typography.headlineLarge}>Dashboard</Text>
      {auth?.userToken ? (
        <View style={{padding: 20}}>
          <CommonButton
            style={styles.logoutContainer}
            labelStyle={{color: LIGHT.text.error}}
            onPress={() => {
              setAlertData({
                title: 'Logging out',
                description: 'Are you sure you want to logout?',
                buttons: [
                  {
                    text: 'Cancel',
                  },
                  {
                    text: 'Logout',
                    onPress: () => {
                      auth.removeAuth();
                    },
                  },
                ],
              });
            }}
            buttonIcon={
              <Iconify
                icon="ri:logout-box-r-line"
                size={24}
                color={LIGHT.text.error}
              />
            }
            buttonColor={'white'}
            buttonTitle={'Logout'}
          />
        </View>
      ) : (
        <>
          <Text
            style={[
              GlobalStyles.linkText,
              GlobalStyles.textCenter,
              GlobalStyles.mt(20),
            ]}
            underline="none"
            onPress={() => navigation.navigate('SignUp')}>
            Go to Sign Up
          </Text>
          <Text
            style={[
              GlobalStyles.linkText,
              GlobalStyles.textCenter,
              GlobalStyles.mt(20),
            ]}
            underline="none"
            onPress={() => navigation.navigate('SignIn')}>
            Go to Sign In
          </Text>
        </>
      )}
      {alertData?.title ? (
        <CustomAlert {...alertData} defaultClear={() => setAlertData({})} />
      ) : null}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  logoutContainer: {
    borderWidth: 1,
    borderColor: LIGHT.text.error,
    borderRadius: 4,
  },
});
