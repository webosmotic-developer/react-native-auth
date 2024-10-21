import { LIGHT } from './Colors';

export const typography = {
  headlineLarge: {
    fontSize: 24,
    lineHeight: 29.05,
    textAlign: 'center',
    color: LIGHT.text.primary,
    fontFamily: 'Montserrat-Bold'
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: 'Montserrat-Regular'
  },
  headlineSmall: {
    fontSize: 20,
    lineHeight: 24.2,
    color: LIGHT.text.primary,
    fontFamily: 'Montserrat-Bold'
  },
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'Montserrat-Regular'
  },
  titleSemi: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: 'Montserrat-Regular'
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Montserrat-Regular'
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Montserrat-Regular'
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Montserrat-Regular'
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 16,
    color: LIGHT.text.secondary,
    fontFamily: 'Montserrat-Regular'
  },
  bodySmall: {
    fontSize: 16,
    lineHeight: 24,
    color: LIGHT.text.secondary,
    fontFamily: 'Montserrat-Regular'
  },
  subtitleSmall: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 24,
    color: LIGHT.text.secondary,
    fontFamily: 'Montserrat-Regular'
  },
  subtitleMedium: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'Montserrat-Regular'
  },
  subtitleLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
    fontFamily: 'Montserrat-Regular'
  },
  descSmall: {
    fontSize: 12,
    lineHeight: 24,
    color: LIGHT.text.primary,
    fontFamily: 'Montserrat-Regular'
  },
  descMedium: {
    fontSize: 14,
    lineHeight: 16.94,
    color: LIGHT.text.primary,
    fontFamily: 'Montserrat-Regular'
  }
};

export default {
  ios: {
    regular: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 'normal'
    },
    medium: {
      fontFamily: 'Montserrat-Medium',
      fontWeight: 'normal'
    },
    light: {
      fontFamily: 'Montserrat-Light',
      fontWeight: 'normal'
    },
    thin: {
      fontFamily: 'Montserrat-Thin',
      fontWeight: 'normal'
    }
  },
  android: {
    regular: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 'normal'
    },
    medium: {
      fontFamily: 'Montserrat-Medium',
      fontWeight: 'normal'
    },
    light: {
      fontFamily: 'Montserrat-Light',
      fontWeight: 'normal'
    },
    thin: {
      fontFamily: 'Montserrat-Thin',
      fontWeight: 'normal'
    }
  }
};
