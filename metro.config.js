const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push('cjs');
defaultConfig.resolver.assetExts.push('jsx');
defaultConfig.resolver.assetExts.push('js');
defaultConfig.resolver.assetExts.push('ts');
defaultConfig.resolver.assetExts.push('tsx');

module.exports = defaultConfig;
// module.exports = {
//   resolver: {
//     sourceExts: ['jsx', 'js', 'ts', 'tsx'], // Add this line
//   },
//   // ...
// };
