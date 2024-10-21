import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { Portal } from 'react-native-paper';

import CommonModal from '../components/CommonModal';
import { fontFamily } from '../constants/fontFamily';
import { typography } from '../constants/Fonts';
import GlobalStyles from '../constants/GlobalStyles';
import { screenWidth } from '../utils/commonFunctions';
const CustomAlert = (props) => {
  const { title, description, buttons, defaultClear } = props;
  const [visible, setVisible] = useState(false);
  const alertButton = buttons?.length
    ? buttons
    : [{ text: 'Okay', onPress: () => hideAlert() }];
  const showAlert = () => {
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (title || description) {
      showAlert();
    }
  }, [description, title]);

  return (
    <Portal>
      <CommonModal isVisible={visible} hideModal={hideAlert}>
        <View
          style={{
            backgroundColor: '#F9F2F2',
            margin: screenWidth * 0.08,
            borderRadius: 12,
            alignItems: 'center'
          }}
        >
          <View style={GlobalStyles.p(16)}>
            <Text
              style={[
                GlobalStyles.textCenter,
                typography.headlineSmall,
                GlobalStyles.mb(10),
                { fontFamily: fontFamily.semiBold }
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                GlobalStyles.textCenter,
                typography.bodyMedium,
                GlobalStyles.mb(8),
                { fontFamily: fontFamily.medium, lineHeight: 20 }
              ]}
            >
              {description}
            </Text>
          </View>
          <View
            style={[
              GlobalStyles.rowCenter,
              { borderTopWidth: 1, borderColor: '#DADADA' }
            ]}
          >
            {alertButton?.length
              ? alertButton?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={item?.text}
                      onPress={() => {
                        hideAlert();
                        item?.onPress?.();
                        defaultClear?.();
                      }}
                      style={
                        item?.style || {
                          flexGrow: 1,
                          borderRightWidth:
                            index === alertButton?.length - 1 ? 0 : 1,
                          borderColor: '#DADADA',
                          alignItems: 'center',
                          paddingVertical: 13,
                          paddingHorizontal: 16
                        }
                      }
                    >
                      <Text
                        style={[
                          typography.bodyMedium,
                          { fontFamily: fontFamily.semiBold, color: '#016FFE' }
                        ]}
                      >
                        {item.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              : null}
          </View>
        </View>
      </CommonModal>
    </Portal>
  );
};

export default CustomAlert;

CustomAlert.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  buttons: PropTypes.any,
  defaultClear: PropTypes.any
};
