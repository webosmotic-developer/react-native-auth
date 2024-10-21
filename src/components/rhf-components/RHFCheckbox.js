import React from 'react';

import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';

import CommonCheckbox from '../CommonCheckbox';
const RHFCheckbox = ({
  name,
  label,
  defaultValue,
  textStyle,
  textChild,
  disabled,
  onStatusChange
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue ?? false}
      render={({ field: { onChange, value } }) => (
        <CommonCheckbox
          label={label}
          textChild={textChild}
          textStyle={textStyle}
          disabled={disabled}
          value={value}
          onPress={() => {
            onStatusChange?.(!value);
            onChange(!value);
          }}
        />
      )}
    />
  );
};

RHFCheckbox.propTypes = {
  label: PropTypes.any,
  name: PropTypes.any,
  defaultValue: PropTypes.bool,
  textStyle: PropTypes.any,
  textChild: PropTypes.element,
  disabled: PropTypes.bool,
  onStatusChange: PropTypes.func
};

export default RHFCheckbox;
