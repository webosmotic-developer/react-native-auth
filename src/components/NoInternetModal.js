import {View} from 'react-native';
import {Text} from 'react-native-paper';

import CommonModal from './CommonModal';
import SvgImageViewer from './SvgImageViewer';
import OfflineIcon from '../assets/svg/offline.svg';
import {fontFamily} from '../constants/fontFamily';
import {typography} from '../constants/Fonts';
import GlobalStyles from '../constants/GlobalStyles';

const NoInternetModal = () => {
  return (
    <CommonModal
      isVisible={true}
      theme={{colors: {backdrop: 'rgba(0,0,0,0.5)'}}}>
      <View
        style={{
          backgroundColor: 'white',
          margin: 16,
          padding: 16,
          borderRadius: 16,
          alignItems: 'center',
        }}>
        <View>
          <SvgImageViewer LocalIcon={OfflineIcon} height={130} width={130} />
        </View>
        <Text style={[typography.headlineLarge, GlobalStyles.mb(6)]}>
          Connection Lost !
        </Text>
        <Text
          style={[
            GlobalStyles.textCenter,
            typography.titleMedium,
            {fontFamily: fontFamily.medium},
          ]}>
          There seems to be problem with your internet connection. Please check
          your connection or try again!
        </Text>
      </View>
    </CommonModal>
  );
};

export default NoInternetModal;
