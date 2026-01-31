import React, { ReactNode } from 'react';
import { Pressable, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { hapticService } from '../../services/HapticService';

interface AnimatedPressableProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scaleValue?: number;
  disabled?: boolean;
  testID?: string;
  hapticEnabled?: boolean;
}

export function AnimatedPressable({
  children,
  onPress,
  style,
  scaleValue = 0.96,
  disabled = false,
  testID,
  hapticEnabled = true,
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (hapticEnabled) {
      hapticService.light();
    }
    scale.value = withTiming(scaleValue, {
      duration: 100,
      easing: Easing.out(Easing.cubic),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      testID={testID}
      style={style}
    >
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
