import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { COLORS, SPACING, SCATTER_LABELS, BORDER_RADIUS } from '../constants/tokens';

interface CalmSliderProps {
  value: number; // 0-10
  onChange: (value: number) => void;
  question: string;
}

export function CalmSlider({ value, onChange, question }: CalmSliderProps) {
  const getValueColor = (val: number) => {
    if (val <= 2) return COLORS.calm;
    if (val <= 6) return COLORS.neutral;
    return COLORS.scattered;
  };

  const label = SCATTER_LABELS[value];
  const color = getValueColor(value);

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor={COLORS.primary}
          maximumTrackTintColor={COLORS.divider}
          thumbTintColor={color}
        />

        <View style={styles.trackLabels}>
          <Text style={styles.trackLabel}>Very Calm</Text>
          <Text style={styles.trackLabel}>Very Scattered</Text>
        </View>
      </View>

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
    width: 300,
    marginBottom: SPACING.md,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  trackLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xs,
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
