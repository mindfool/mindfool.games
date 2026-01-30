// Mock Expo runtime globals
global.__ExpoImportMetaRegistry = {};
global.structuredClone = global.structuredClone || ((val) => JSON.parse(JSON.stringify(val)));

// Import mocks
require('./__mocks__/@shopify/react-native-skia');
require('./__mocks__/@react-native-async-storage/async-storage');
require('./__mocks__/expo-av');
