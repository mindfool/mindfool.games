import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS, SPACING, SCATTER_LABELS, BORDER_RADIUS } from '../constants/tokens';

interface CalmSliderProps {
  value: number; // 0-10
  onChange: (value: number) => void;
  question: string;
}

const TRACK_WIDTH = 300;
const THUMB_SIZE = 28;
const SEGMENT_WIDTH = TRACK_WIDTH / 10;

export function CalmSlider({ value, onChange, question }: CalmSliderProps) {
  const position = useSharedValue(value * SEGMENT_WIDTH);

  const updateValue = (newValue: number) => {
    onChange(newValue);
  };

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      const newPos = Math.max(0, Math.min(TRACK_WIDTH, position.value + event.changeX));
      position.value = newPos;

      const newValue = Math.round(newPos / SEGMENT_WIDTH);
      runOnJS(updateValue)(Math.min(10, Math.max(0, newValue)));
    })
    .onEnd(() => {
      // Snap to nearest position
      const snappedValue = Math.round(position.value / SEGMENT_WIDTH);
      position.value = withSpring(snappedValue * SEGMENT_WIDTH, {
        damping: 15,
        stiffness: 150,
      });
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  // Get color based on value (0 = scattered, 10 = calm)
  const getValueColor = (val: number) => {
    if (val <= 3) return COLORS.scattered;
    if (val <= 7) return COLORS.neutral;
    return COLORS.calm;
  };

  const label = SCATTER_LABELS[value];
  const color = getValueColor(value);

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>

      <View style={styles.sliderContainer}>
        {/* Track */}
        <View style={styles.track}>
          <View style={[styles.trackFilled, { width: position.value }]} />
        </View>

        {/* Thumb */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <View style={[styles.thumbInner, { backgroundColor: color }]} />
          </Animated.View>
        </GestureDetector>

        {/* Labels */}
        <View style={styles.trackLabels}>
          <Text style={styles.trackLabel}>Very Scattered</Text>
          <Text style={styles.trackLabel}>Very Calm</Text>
        </View>
      </View>

      {/* Value display */}
      <View style={styles.valueContainer}>
        <Text style={[styles.valueNumber, { color }]}>{value}</Text>
        <Text style={[styles.valueLabel, { color }]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  sliderContainer: {
    width: TRACK_WIDTH + THUMB_SIZE,
    height: 60,
    position: 'relative',
    marginBottom: SPACING.md,
  },
  track: {
    position: 'absolute',
    top: 20,
    left: THUMB_SIZE / 2,
    width: TRACK_WIDTH,
    height: 4,
    backgroundColor: COLORS.divider,
    borderRadius: 2,
  },
  trackFilled: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    top: 6,
    left: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    // Larger tap area for accessibility
    padding: 10,
  },
  thumbInner: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  trackLabels: {
    position: 'absolute',
    top: 32,
    left: THUMB_SIZE / 2,
    width: TRACK_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  valueContainer: {
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    minWidth: 200,
  },
  valueNumber: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  valueLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
});
