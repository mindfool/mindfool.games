import { View, Text, StyleSheet } from 'react-native';
import type { Session } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, SCATTER_LABELS } from '../constants/tokens';

interface LastSessionCardProps {
  session: Session;
}

export function LastSessionCard({ session }: LastSessionCardProps) {
  const improvement = -session.delta; // Negative delta = improvement
  const daysAgo = Math.floor(
    (Date.now() - new Date(session.timestamp).getTime()) / (1000 * 60 * 60 * 24)
  );

  const getImprovementColor = () => {
    if (improvement >= 2) return COLORS.calm;
    if (improvement >= 0) return COLORS.primary;
    return COLORS.neutral;
  };

  const getImprovementText = () => {
    if (improvement > 0) return `+${improvement} calmer`;
    if (improvement === 0) return 'No change';
    return `${improvement} more scattered`;
  };

  const getTimeText = () => {
    if (daysAgo === 0) return 'Today';
    if (daysAgo === 1) return 'Yesterday';
    return `${daysAgo} days ago`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Last Session</Text>
        <Text style={styles.time}>{getTimeText()}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Before</Text>
          <Text style={styles.statValue}>{session.preScore}</Text>
          <Text style={styles.statSubtext}>{SCATTER_LABELS[session.preScore]}</Text>
        </View>

        <View style={styles.arrow}>
          <Text style={styles.arrowText}>→</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>After</Text>
          <Text style={styles.statValue}>{session.postScore}</Text>
          <Text style={styles.statSubtext}>{SCATTER_LABELS[session.postScore]}</Text>
        </View>
      </View>

      <View style={[styles.improvementBadge, { backgroundColor: getImprovementColor() + '20' }]}>
        <Text style={[styles.improvementText, { color: getImprovementColor() }]}>
          {getImprovementText()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.textPrimary,
  },
  time: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  statValue: {
    ...TYPOGRAPHY.displaySmall,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  statSubtext: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  arrow: {
    paddingHorizontal: SPACING.md,
  },
  arrowText: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  improvementBadge: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  improvementText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
});
