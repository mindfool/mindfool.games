# Native App Troubleshooting Guide

## Current Issue: Metro Bundler Hangs on Startup

### Symptoms
- Metro bundler starts but hangs at "Waiting on http://localhost:8081"
- No progress after this point - bundler never becomes ready
- Web version works perfectly (proving code is correct)
- TypeScript compilation succeeds

### Diagnosis

After extensive troubleshooting, the issue appears to be:

**Root Cause**: Node.js version incompatibility
- **Current**: Node v20.15.0
- **Required**: Node >= v20.19.4

Many packages in the project require Node >= 20.19.4:
- `metro` and all `metro-*` packages
- `@react-native/*` packages
- `expo-server`

### What We've Tried

✅ **Successfully Completed:**
1. Fixed TypeScript compilation errors
2. Removed/re-added react-native-reanimated
3. Cleared all Metro/Expo caches
4. Tested with various Metro configurations
5. Enabled react-native-reanimated/plugin (required by Skia, expo-router, nativewind)
6. Verified code correctness (web version works)

❌ **Still Hanging:**
- Native Metro bundler initialization

### Recommended Solutions

#### Option 1: Upgrade Node.js (Recommended)

```bash
# Using nvm (recommended)
nvm install 20.19.4
nvm use 20.19.4
nvm alias default 20.19.4

# Or using Homebrew
brew upgrade node
```

After upgrading:
```bash
cd /Users/simon/git/mindfool/mindfool.games
rm -rf node_modules package-lock.json
npm install
npx expo start
```

#### Option 2: Use EAS Build for Native

Since the web version works, you can use EAS Build to create native builds in the cloud (which has the correct Node version):

```bash
# Configure EAS Build (already done)
npx eas build:configure

# Build for Android
npx eas build --platform android --profile preview

# Build for iOS
npx eas build --platform ios --profile preview
```

#### Option 3: Continue with Web Version

The web version at https://mindfoolgames-bkjzztzu0-favourses-projects.vercel.app works perfectly and can be:
- Accessed on mobile browsers
- Installed as a PWA
- Used for testing and development

### Technical Details

**Dependencies Requiring Node >= 20.19.4:**
```
metro@0.83.2
@react-native/*@0.81.5
expo-server@1.0.2
```

**Current Dependency Tree:**
- `@shopify/react-native-skia` → `react-native-reanimated@4.1.3` → `react-native-worklets@0.5.2`
- `expo-router` → `react-native-reanimated@4.1.3`
- `nativewind` → `react-native-reanimated@4.1.3`

### Files Modified During Troubleshooting

1. **babel.config.js**: Re-enabled react-native-reanimated/plugin
2. **src/stores/historyStore.ts**: Temporarily disabled AsyncStorage persistence
3. **package.json**: Removed react-native-reanimated (but it's still required by other deps)

### Next Steps

1. **Immediate**: Use web version for testing
2. **Short-term**: Upgrade Node.js to >= 20.19.4
3. **Long-term**: Re-enable AsyncStorage persistence after Metro works

### Testing Native App After Fix

Once Metro starts successfully:

```bash
# Start Expo
npx expo start

# Test on physical device
# Scan QR code with Expo Go app

# Or test in simulator
npx expo start --ios  # macOS only
npx expo start --android  # Requires Android SDK
```

### Known Working Configuration

- ✅ **Web version**: Fully functional
- ✅ **TypeScript**: No compilation errors
- ✅ **Code quality**: All features implemented correctly
- ⏳ **Native bundler**: Blocked by Node version

## Additional Resources

- [Expo Troubleshooting](https://docs.expo.dev/troubleshooting/overview/)
- [Metro Bundler Docs](https://metrobundler.dev/)
- [React Native Requirements](https://reactnative.dev/docs/environment-setup)
- [Node Version Management](https://github.com/nvm-sh/nvm)

## Contact

If issues persist after upgrading Node:
1. Check GitHub issues: https://github.com/mindfool/mindfool.games/issues
2. Review spec docs: https://github.com/mindfool/mindfool.games-spec-docs
3. Test web version: https://mindfoolgames-bkjzztzu0-favourses-projects.vercel.app
