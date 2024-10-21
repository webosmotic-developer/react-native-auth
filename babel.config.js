module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-paper/babel',
    'react-native-iconify/plugin',
    ['@babel/plugin-transform-private-methods', {loose: true}],
  ],
};
