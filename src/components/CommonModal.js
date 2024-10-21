import * as React from 'react';

import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Modal } from 'react-native-paper';

const CommonModal = (props) => {
  const {
    hideModal,
    isVisible,
    children,
    dismissable,
    dismissableBackButton,
    theme
  } = props;
  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    margin: 16
  };

  return (
    <Modal
      theme={theme || {}}
      dismissableBackButton={dismissableBackButton}
      dismissable={dismissable || false}
      visible={isVisible}
      onDismiss={hideModal}
    >
      <View contentContainerStyle={containerStyle}>{children}</View>
    </Modal>
  );
};

CommonModal.propTypes = {
  isVisible: PropTypes.bool,
  hideModal: PropTypes.func,
  children: PropTypes.element,
  dismissable: PropTypes.bool,
  dismissableBackButton: PropTypes.bool,
  theme: PropTypes.any
};

export default CommonModal;
