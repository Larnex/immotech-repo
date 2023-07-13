/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');
const { getDefaultConfig } = require('metro-config');
// const extraNodeModules = require('node-libs-react-native');
const nodeModulesPaths = [path.resolve(path.join(__dirname, '../node_modules'))];

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    watchFolders: [path.resolve(__dirname, '../')],
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      extraNodeModules: {
        // ...extraNodeModules,
        '@immotech/util': path.resolve(path.join(__dirname, '../util')),
        '@immotech-component': path.resolve(path.join(__dirname, '../component')),
        '@immotech-feature': path.resolve(path.join(__dirname, '../feature')),
        '@immotech/screens': path.resolve(path.join(__dirname, '../screens')),
      },
      nodeModulesPaths,
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };
})();
