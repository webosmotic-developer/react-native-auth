import {encode as btoa} from 'base-64';

import {createApiInstance} from './createApiInstance';
import {queryParamsBuilder} from '../../utils/commonFunctions';

const extendedApi = createApiInstance.injectEndpoints({
  endpoints: build => ({
    signInInit: build.mutation({
      query({...body}) {
        return {
          url: '/auth/login/init',
          method: 'POST',
          body,
        };
      },
      transformResponse: res => {
        return res;
      },
    }),

    signInValidate: build.mutation({
      query({...body}) {
        if (body?.password) {
          body.password = btoa(body.password);
        }
        return {
          url: '/auth/login/validate',
          method: 'POST',
          body,
        };
      },
      transformResponse: res => {
        return res.data;
      },
    }),
    signUpInit: build.mutation({
      query({body}) {
        return {
          url: '/auth/register/init',
          method: 'POST',
          body,
        };
      },
      transformResponse: res => {
        return res;
      },
    }),
    signUpValidate: build.mutation({
      query({...body}) {
        if (body?.password) {
          body.password = btoa(body?.password);
        }
        return {
          url: '/auth/register/validate',
          method: 'POST',
          body,
        };
      },
      transformResponse: res => {
        return res.data;
      },
    }),
    forgotPassword: build.mutation({
      query(body) {
        return {
          url: '/auth/forgot-password',
          method: 'POST',
          body,
        };
      },
      transformResponse: res => {
        return res.data;
      },
    }),

    resendOTP: build.mutation({
      query({...body}) {
        return {
          url: '/auth/resend-otp',
          method: 'POST',
          body,
        };
      },
      transformResponse: res => res,
    }),
    verifyToken: build.query({
      query: ({verifyToken}) => {
        return `/auth/verify-token/${verifyToken}`;
      },
      transformResponse: res => {
        return res.data;
      },
    }),
    resendVerification: build.query({
      query(params) {
        return {
          url: '/auth/resend-email-verification',
          method: 'GET',
          params,
        };
      },
      transformResponse: res => {
        return res;
      },
    }),
    resendForgotPasswordMail: build.query({
      query(params) {
        return {
          url: '/auth/resend-forgot-password-email',
          method: 'GET',
          params,
        };
      },
      transformResponse: res => {
        return res;
      },
    }),
    resetPassword: build.mutation({
      query(body) {
        body.password = btoa(body?.password);
        return {
          url: '/auth/reset-password',
          method: 'POST',
          body,
        };
      },
      transformResponse: res => {
        return res.data;
      },
    }),
    resendVerificationEmail: build.mutation({
      query(query) {
        return {
          url: `/auth/resend-email-verification${queryParamsBuilder(query)}`,
          method: 'GET',
        };
      },
      transformResponse: res => res,
    }),
  }),
  overrideExisting: false,
});

export const {
  useSignInInitMutation,
  useResendVerificationEmailMutation,
  useSignInValidateMutation,
  useSignUpInitMutation,
  useForgotPasswordMutation,
  useVerifyTokenQuery,
  useResetPasswordMutation,
  useLazyResendForgotPasswordMailQuery,
  useLazyResendVerificationQuery,
  useSignUpValidateMutation,
  useResendOTPMutation,
} = extendedApi;
