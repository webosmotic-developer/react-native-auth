export const primaryColor = {
  100: '#F5FAE5',
  200: '#CFE67B',
  300: '#BCDC49',
  400: '#B0C75C',
  500: '#90AE21'
};

/**
 * Secondary color shades
 */
export const secondaryColor = {
  100: '#E3F8FC',
  200: '#07404B',
  300: '#05323B',
  400: '#032025'
};

export const LIGHT = {
  bg: 'white',
  primary: {
    main: primaryColor[300],
    light: primaryColor[200],
    dark: primaryColor[400],
    darker: primaryColor[500],
    contrastText: primaryColor[100]
  },
  secondary: {
    main: secondaryColor[200],
    light: secondaryColor[100],
    dark: secondaryColor[300],
    darker: secondaryColor[400]
  },
  error: {
    main: '#F44336',
    light: '#e57373',
    dark: '#D32F2F',
    darker: '#B51B1B'
  },

  warning: {
    main: '#F5B836',
    light: '#FFEECA',
    dark: '#E29E0B',
    darker: '#B98109'
  },
  success: {
    main: '#66bb6a',
    light: '#88CA8B',
    dark: '#479E4B',
    darker: '#3A813D'
  },
  background: {
    accordion: '#F2F9F8'
  },
  info: {
    main: '#29B6F6',
    light: '#75CFF9',
    dark: '#0888C4',
    darker: '#076D9D'
  },
  black: 'black',
  grey: {
    50: '#ececec',
    100: '#d1d5db',
    200: '#9CA3AF69',
    300: '#c5c6c7'
  },
  text: {
    primary: '#07404B',
    secondary: '#4F5A5E',
    disabled: '#8FA5AE',
    error: '#F44336',
    warning: '#F5B836',
    success: '#66BB6A',
    info: '#29B6F6'
  },
  type: 'Light',
  card: '#F2F9FB',
  borderGrey: '#D8DFE2',
  yellow: '#F8B84E',
  chip: {
    lightBlue: '#B8E2F5',
    lightRed: '#FFD8D8',
    lightgreen: '#F5FAE5'
  }
};
