import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { Text } from 'react-native-paper';

import { LIGHT, primaryColor } from '../constants/Colors';
import { fontFamily } from '../constants/fontFamily';
import { typography } from '../constants/Fonts';
import GlobalStyles from '../constants/GlobalStyles';

const CommonCheckbox = (props) => {
  const {
    disabled,
    onPress,
    value,
    textChild,
    textStyle,
    label,
    checkboxStyle
  } = props;
  return (
    <TouchableOpacity
      disabled={disabled}
      style={GlobalStyles.rowCenter}
      onPress={onPress}
    >
      <View
        style={[
          styles.checkContainer,
          {
            borderWidth: value ? 0 : 1,
            backgroundColor: value ? primaryColor[300] : 'transparent'
          },
          checkboxStyle
        ]}
      >
        {value ? (
          <Iconify icon="zondicons:checkmark" size={14} color={LIGHT.bg} />
        ) : null}
      </View>
      {textChild || (
        <Text
          style={[
            typography.bodyLarge,
            { fontFamily: fontFamily.medium, color: LIGHT.text.primary },
            textStyle
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CommonCheckbox;

const styles = StyleSheet.create({
  checkContainer: {
    height: 24,
    width: 24,
    borderRadius: 20,
    marginRight: 8,
    borderColor: LIGHT.text.disabled,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

CommonCheckbox.propTypes = {
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  value: PropTypes.any,
  textChild: PropTypes.any,
  textStyle: PropTypes.any,
  label: PropTypes.string,
  checkboxStyle: PropTypes.any
};
