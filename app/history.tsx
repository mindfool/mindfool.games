import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useHistoryStore } from '../src/stores/historyStore';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../src/constants/tokens';
import { GameMode } from '../src/types';
import { useState } from 'react';

type TimeRange = 'week' | 'month' | 'all';

export default function HistoryScreen() {
  const router = useRouter();
  const sessions = useHistoryStore((state) => state.getSessions());
  const [filterMode, setFilterMode] = useState<GameMode | 'all'>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  // Filter sessions by BOTH mode AND time range
  const getFilteredSessions = () => {
    let filtered = sessions;

    // Apply mode filter
    if (filterMode !== 'all') {
      filtered = filtered.filter(s => s.mode === filterMode);
    }

    // Apply time range filter
    const now = new Date();
    if (timeRange === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      filtered = filtered.filter(s => new Date(s.timestamp) >= weekAgo);
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      filtered = filtered.filter(s => new Date(s.timestamp) >= monthAgo);
    }

    return filtered;
  };

  const filteredSessions = getFilteredSessions();

  // Calculate stats from FILTERED sessions (reflects time range + mode filters)
  const totalSessions = filteredSessions.length;
  const avgImprovement = filteredSessions.length > 0
    ? filteredSessions.reduce((sum, s) => sum + s.delta, 0) / filteredSessions.length
    : 0;

  // Find favorite mode from filtered sessions
  const modeCounts = filteredSessions.reduce((acc, s) => {
    acc[s.mode] = (acc[s.mode] || 0) + 1;
    return acc;
  }, {} as Record<GameMode, number>);

  const favoriteMode = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as GameMode | undefined;

  const getModeEmoji = (mode: GameMode) => {
    switch (mode) {
      case 'balloon-breathing': return '🎈';
      case 'walking-meditation': return '🚶';
      case 'number-bubbles': return '🔢';
      case 'gong-listening': return '🔔';
      case 'counting-ladder': return '🪜';
    }
  };

  const getModeName = (mode: GameMode): string => {
    switch (mode) {
      case 'balloon-breathing': return 'Balloon Breathing';
      case 'walking-meditation': return 'Walking Meditation';
      case 'number-bubbles': return 'Number Bubbles';
      case 'gong-listening': return 'Gong Listening';
      case 'counting-ladder': return 'Counting Ladder';
      default: return mode;
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient
      colors={[COLORS.backgroundLight, COLORS.background, COLORS.backgroundMedium]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerBadge}>
            <Text style={styles.headerEmoji}>📊</Text>
          </View>
          <Text style={styles.title}>Your Journey</Text>
          <Text style={styles.subtitle}>
            {filteredSessions.length === sessions.length
              ? `${totalSessions} sessions completed`
              : `${filteredSessions.length} of ${sessions.length} sessions`
            }
          </Text>
        </View>

        {sessions.length === 0 ? (
          // Empty state
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptyText}>
              Complete your first mindfulness session to see your progress here
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => router.back()}>
              <Text style={styles.emptyButtonText}>Start a Session</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Time Range Toggle */}
            <View style={styles.timeRangeContainer}>
              <TouchableOpacity
                style={[styles.timeRangeButton, timeRange === 'week' && styles.timeRangeButtonActive]}
                onPress={() => setTimeRange('week')}
              >
                <Text style={[styles.timeRangeText, timeRange === 'week' && styles.timeRangeTextActive]}>
                  Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.timeRangeButton, timeRange === 'month' && styles.timeRangeButtonActive]}
                onPress={() => setTimeRange('month')}
              >
                <Text style={[styles.timeRangeText, timeRange === 'month' && styles.timeRangeTextActive]}>
                  Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.timeRangeButton, timeRange === 'all' && styles.timeRangeButtonActive]}
                onPress={() => setTimeRange('all')}
              >
                <Text style={[styles.timeRangeText, timeRange === 'all' && styles.timeRangeTextActive]}>
                  All Time
                </Text>
              </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{totalSessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={[
                  styles.statValue,
                  avgImprovement > 0 && styles.positiveValue,
                  avgImprovement < 0 && styles.negativeValue
                ]}>
                  {avgImprovement > 0 ? '+' : ''}{avgImprovement.toFixed(1)}
                </Text>
                <Text style={styles.statLabel}>Avg Improvement</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {favoriteMode ? getModeEmoji(favoriteMode) : '—'}
                </Text>
                <Text style={styles.statLabel}>Favorite</Text>
              </View>
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScroll}
              >
                <TouchableOpacity
                  style={[styles.filterButton, filterMode === 'all' && styles.filterButtonActive]}
                  onPress={() => setFilterMode('all')}
                >
                  <Text style={[styles.filterText, filterMode === 'all' && styles.filterTextActive]}>
                    All
                  </Text>
                </TouchableOpacity>

                {(['balloon-breathing', 'walking-meditation', 'number-bubbles', 'gong-listening', 'counting-ladder'] as GameMode[]).map(mode => (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.filterButton, filterMode === mode && styles.filterButtonActive]}
                    onPress={() => setFilterMode(mode)}
                  >
                    <Text style={styles.filterEmoji}>{getModeEmoji(mode)}</Text>
                    <Text style={[styles.filterText, filterMode === mode && styles.filterTextActive]}>
                      {getModeName(mode).split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Session List */}
            <View style={styles.sessionList}>
              <Text style={styles.sectionTitle}>
                {filteredSessions.length} {filteredSessions.length === 1 ? 'Session' : 'Sessions'}
              </Text>

              {filteredSessions.map((session) => (
                <View key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <View style={styles.sessionMode}>
                      <Text style={styles.sessionEmoji}>{getModeEmoji(session.mode)}</Text>
                      <View>
                        <Text style={styles.sessionModeName}>{getModeName(session.mode)}</Text>
                        <Text style={styles.sessionTime}>{formatDate(session.timestamp)}</Text>
                      </View>
                    </View>
                    <View style={styles.sessionDelta}>
                      <Text style={[
                        styles.sessionDeltaValue,
                        session.delta > 0 && styles.positiveDelta,
                        session.delta < 0 && styles.negativeDelta
                      ]}>
                        {session.delta > 0 ? '+' : ''}{session.delta}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sessionDetails}>
                    <View style={styles.sessionDetail}>
                      <Text style={styles.detailLabel}>Before</Text>
                      <Text style={styles.detailValue}>{session.preScore}</Text>
                    </View>
                    <View style={styles.sessionDetail}>
                      <Text style={styles.detailLabel}>After</Text>
                      <Text style={styles.detailValue}>{session.postScore}</Text>
                    </View>
                    <View style={styles.sessionDetail}>
                      <Text style={styles.detailLabel}>Duration</Text>
                      <Text style={styles.detailValue}>{formatDuration(session.duration)}</Text>
                    </View>
                  </View>

                  {session.notes && (
                    <View style={styles.sessionNotes}>
                      <Text style={styles.notesText}>"{session.notes}"</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: SPACING.xl,
    top: SPACING['2xl'],
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  headerBadge: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.colored,
  },
  headerEmoji: {
    fontSize: 32,
  },
  title: {
    ...TYPOGRAPHY.displayLarge,
    fontSize: 32,
    color: COLORS.textPrimary,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING['3xl'],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING['2xl'],
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    ...TYPOGRAPHY.displayMedium,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  emptyText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  emptyButtonText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xs,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
  },
  timeRangeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  timeRangeText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  timeRangeTextActive: {
    color: COLORS.white,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  statValue: {
    ...TYPOGRAPHY.displayMedium,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  positiveValue: {
    color: COLORS.calm,
  },
  negativeValue: {
    color: COLORS.scattered,
  },
  filterContainer: {
    marginBottom: SPACING.lg,
  },
  filterScroll: {
    gap: SPACING.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    gap: 8,
    ...SHADOWS.sm,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.colored,
  },
  filterEmoji: {
    fontSize: 18,
  },
  filterText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.white,
  },
  sessionList: {
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  sessionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sessionMode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sessionEmoji: {
    fontSize: 32,
  },
  sessionModeName: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  sessionTime: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  sessionDelta: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
  sessionDeltaValue: {
    ...TYPOGRAPHY.displayMedium,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  positiveDelta: {
    color: COLORS.calm,
  },
  negativeDelta: {
    color: COLORS.scattered,
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sessionDetail: {
    alignItems: 'center',
  },
  detailLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  sessionNotes: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  notesText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
