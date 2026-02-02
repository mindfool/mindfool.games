/**
 * MobileContainer - Constrains content to mobile-friendly width on desktop
 *
 * Wraps content to max 428px width (iPhone 14 Pro Max), centered on larger screens.
 * Use this as the outermost container on all screens for consistent mobile-first design.
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_MOBILE_WIDTH = 428;

interface MobileContainerProps {
  children: React.ReactNode;
  style?: object;
}

export function MobileContainer({ children, style }: MobileContainerProps) {
  return (
    <View style={[styles.outer, style]}>
      <View style={styles.inner}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_MOBILE_WIDTH,
  },
});
