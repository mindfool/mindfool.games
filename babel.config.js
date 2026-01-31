module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true, // Required for zustand ESM compatibility
        },
      ],
    ],
    plugins: [
      'react-native-reanimated/plugin', // Required by Skia, expo-router, and nativewind
    ],
  };
};
