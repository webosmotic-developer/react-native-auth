import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

import { LIGHT } from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';
import { screenWidth } from '../utils/commonFunctions';

const CommonActionSheet = (props) => {
  const { children, isVisible, style, onBackdropPress } = props;

  return (
    <Modal
      isVisible={isVisible}
      style={GlobalStyles.m(0)}
      onBackdropPress={onBackdropPress}
    >
      <View style={[styles.mainContainer, style]}>
        <View style={styles.ovalGreyIcon}></View>
        {children}
        <View style={styles.ovalGreyBottomIcon}></View>
      </View>
    </Modal>
  );
};

CommonActionSheet.propTypes = {
  children: PropTypes.any,
  isVisible: PropTypes.bool,
  style: PropTypes.any,
  onBackdropPress: PropTypes.func
};

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: 0,
    ...GlobalStyles.bgWhite,
    ...GlobalStyles.w(screenWidth),
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    ...GlobalStyles.pb(20)
  },
  ovalGreyIcon: {
    height: 5,
    width: '10%',
    backgroundColor: '#3C3C434D',
    alignSelf: 'center',
    borderRadius: 10,
    ...GlobalStyles.mt(10)
  },
  ovalGreyBottomIcon: {
    height: 5,
    width: '30%',
    backgroundColor: LIGHT.black,
    alignSelf: 'center',
    borderRadius: 10,
    ...GlobalStyles.mt(10)
  }
});

export default CommonActionSheet;
