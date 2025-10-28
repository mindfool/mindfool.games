import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from './Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/tokens';

interface ReflectionInputProps {
  onSubmit: (notes: string) => void;
  onSkip: () => void;
}

const MAX_LENGTH = 200;

export function ReflectionInput({ onSubmit, onSkip }: ReflectionInputProps) {
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onSubmit(notes.trim());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>How was your session?</Text>
        <Text style={styles.subtitle}>Optional • {MAX_LENGTH} characters max</Text>

        <TextInput
          style={styles.input}
          placeholder="Any thoughts or insights..."
          placeholderTextColor={COLORS.textSecondary}
          value={notes}
          onChangeText={setNotes}
          maxLength={MAX_LENGTH}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          returnKeyType="done"
          blurOnSubmit
        />

        <Text style={styles.charCount}>
          {notes.length}/{MAX_LENGTH}
        </Text>

        <View style={styles.buttons}>
          <View style={styles.buttonHalf}>
            <Button
              title="Skip"
              onPress={onSkip}
              variant="secondary"
              fullWidth
            />
          </View>
          <View style={styles.buttonSpacer} />
          <View style={styles.buttonHalf}>
            <Button
              title="Save"
              onPress={handleSubmit}
              fullWidth
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  input: {
    ...TYPOGRAPHY.bodyMedium,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    padding: SPACING.md,
    minHeight: 100,
    color: COLORS.textPrimary,
  },
  charCount: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  buttonHalf: {
    flex: 1,
  },
  buttonSpacer: {
    width: SPACING.md,
  },
});
