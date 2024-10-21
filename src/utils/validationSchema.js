import * as yup from 'yup';

const regex = {
  phone: /^[6-9]\d{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.{8,}).*$/,
  multipleSpace: /\s\s/,
  email:
    /^([a-z][a-z0-9_]*|(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/,
};

yup.addMethod(yup.string, 'multipleSpaces', function (errorMsg) {
  return this.test('multipleSpaces', errorMsg, function (value) {
    const {path, createError} = this;
    if (regex.multipleSpace.test(value)) {
      return createError({
        path,
        message: errorMsg || 'More than one consecutive spaces are not allowed',
      });
    }
    return true;
  });
});

yup.addMethod(yup.string, 'multipleSpaces', function (errorMsg) {
  return this.test('multipleSpaces', errorMsg, function (value) {
    const {path, createError} = this;
    if (regex.multipleSpace.test(value)) {
      return createError({
        path,
        message: errorMsg || 'More than one consecutive spaces are not allowed',
      });
    }
    return true;
  });
});

const validationSchemas = {
  phone: yup
    .string()
    .trim()
    .nullable()
    .required('Phone is required')
    .matches(regex.phone, 'Please enter a valid phone number'),
  email: yup
    .string()
    .trim()
    .email('Enter a valid email')
    .required('Email is required')
    .max(50, 'Email should not exceed more than 50 characters')
    .matches(regex.email, 'Enter valid email'),
  password: yup
    .string()
    .trim()
    .required('Password is required')
    .matches(
      regex.password,
      'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number and one special character',
    )
    .multipleSpaces(),
  contact: yup
    .string()
    .required('Please enter your email or phone number')
    .test(
      'is-email-or-phone',
      'Please enter a valid email or 10-digit phone number',
      value => {
        if (!value) {
          return true;
        }
        if (yup.string().email().isValidSync(value)) {
          return true;
        }
        return value.length === 10 && /^\d+$/.test(value);
      },
    ),
  confirmPassword: yup
    .string()
    .trim()
    .required('Confirm password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
};

export default validationSchemas;
