import { LIGHT } from './Colors';
import { fontFamily } from './fontFamily';
import { typography } from './Fonts';
export default {
  mt: (value) => ({
    marginTop: value
  }),

  mh: (value) => ({
    marginHorizontal: value
  }),
  mv: (value) => ({
    marginVertical: value
  }),
  m: (value) => ({
    margin: value
  }),
  pv: (value) => ({
    paddingVertical: value
  }),
  w: (value) => ({
    width: value
  }),
  ph: (value) => ({
    paddingHorizontal: value
  }),
  p: (value) => ({
    padding: value
  }),
  ml: (value) => ({
    marginLeft: value
  }),
  pt: (value) => ({
    paddingTop: value
  }),
  pl: (value) => ({
    paddingLeft: value
  }),
  pb: (value) => ({
    paddingBottom: value
  }),
  mr: (value) => ({
    marginRight: value
  }),
  mb: (value) => ({
    marginBottom: value
  }),
  textLeft: {
    textAlign: 'left'
  },
  textCapitalize: {
    textTransform: 'capitalize'
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  alignJustifyCenter: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  growShrink: (value) => ({
    flexGrow: value,
    flexShrink: value
  }),
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  bgWhite: {
    backgroundColor: LIGHT.bg
  },
  flex1: {
    flex: 1
  },
  textCenter: {
    textAlign: 'center'
  },
  grow1: {
    flexGrow: 1
  },
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  linkText: {
    ...typography.descMedium,
    fontFamily: fontFamily.semiBold
  },
  alignCenter: {
    alignItems: 'center'
  }
};
