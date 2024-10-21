import PropTypes from 'prop-types';
import {TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-paper';

import {LIGHT} from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';
import RHFTextField from './rhf-components/RHFTextField';
import SvgImageViewer from './SvgImageViewer';

const RenderInputWithRightIcon = props => {
  const {icon, iconifyRightComponent, iconifyLeftComponent, iconType, ...rest} =
    props;
  const Icon = icon;
  return (
    <RHFTextField
      {...rest}
      rightIconComponent={
        <TextInput.Icon
          style={GlobalStyles.mr(16)}
          forceTextInputFocus={false}
          icon={() =>
            iconType === 'iconify' ? (
              <TouchableOpacity
                activeOpacity={
                  !Object?.hasOwn(rest, 'onRightIconPress') ? 1 : 0.6
                }
                onPress={() => rest?.onRightIconPress?.()}>
                {iconifyRightComponent}
              </TouchableOpacity>
            ) : (
              <SvgImageViewer LocalIcon={Icon} height={20} width={20} />
            )
          }
        />
      }
      leftIconComponent={
        iconifyLeftComponent ? (
          <TextInput.Icon
            style={GlobalStyles.ml(16)}
            forceTextInputFocus={false}
            icon={() =>
              iconType === 'iconify' ? (
                <TouchableOpacity
                  style={GlobalStyles.rowCenter}
                  activeOpacity={
                    !Object?.hasOwn(rest, 'onLeftIconPress') ? 1 : 0.6
                  }
                  onPress={() => rest?.onLeftIconPress?.()}>
                  {iconifyLeftComponent}
                  <View
                    style={{
                      marginLeft: 10,
                      height: 20,
                      width: 1.5,
                      backgroundColor: LIGHT.text.primary,
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <SvgImageViewer LocalIcon={Icon} height={20} width={20} />
              )
            }
          />
        ) : null
      }
    />
  );
};

RenderInputWithRightIcon.propTypes = {
  icon: PropTypes.any,
  iconType: PropTypes.string,
  iconifyRightComponent: PropTypes.element,
  iconifyLeftComponent: PropTypes.element,
};

export default RenderInputWithRightIcon;
