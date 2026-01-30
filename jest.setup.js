// Silence React Native warnings in tests
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Import mocks
require('./__mocks__/@shopify/react-native-skia');
require('./__mocks__/@react-native-async-storage/async-storage');
require('./__mocks__/expo-av');
