import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, View } from 'react-native';
import { Text } from 'react-native-paper';

import CommonButton from '../components/CommonButton';
import CustomAlert from '../components/CustomAlert';
import { typography } from '../constants/Fonts';
import GlobalStyles from '../constants/GlobalStyles';

const ResendVerificationMail = () => {
  const navigation = useNavigation();
  const [alertData, setAlertData] = useState({});
  const resendVerificationMail = () => {
    setAlertData({
      title: 'Successful',
      description: 'Mail sent successfully',
      buttons: [
        {
          text: 'Ok',
          onPress: async () => {
            navigation.navigate('SignIn');
          },
        },
      ],
    });
  };

  return (
    <SafeAreaView style={[GlobalStyles.centeredContent, GlobalStyles.bgWhite]}>
      <Text
        style={[
          typography.titleSmall,
          GlobalStyles.mb(16),
          GlobalStyles.textCenter,
        ]}
      >
        Link has been expired. Click the below button to resend a verification
        mail on your registered email.
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <CommonButton
          mode="contained"
          onPress={resendVerificationMail}
          buttonTitle="Resend mail"
        />
      </View>
      {alertData?.title ? (
        <CustomAlert {...alertData} defaultClear={() => setAlertData({})} />
      ) : null}
    </SafeAreaView>
  );
};

export default ResendVerificationMail;
