import * as React from 'react';

import PropTypes from 'prop-types';
import { View } from 'react-native';
import { SvgWithCssUri } from 'react-native-svg';

import GlobalStyles from '../constants/GlobalStyles';

const SvgImageViewer = (props) => {
  const { LocalIcon, path, width, style, height } = props;
  return (
    <View style={[GlobalStyles.alignJustifyCenter, style]}>
      {LocalIcon ? (
        <LocalIcon width={width} height={height} />
      ) : path && path.includes('.svg') ? (
        <SvgWithCssUri width={width} height={height} uri={path} />
      ) : null}
    </View>
  );
};

SvgImageViewer.propTypes = {
  LocalIcon: PropTypes.any,
  path: PropTypes.any,
  width: PropTypes.any,
  style: PropTypes.any,
  height: PropTypes.any
};

export default SvgImageViewer;
