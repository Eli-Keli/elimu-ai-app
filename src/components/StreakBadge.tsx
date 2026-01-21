import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useStreak } from '../contexts/StreakContext';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

interface StreakBadgeProps {
  onPress?: () => void;
  showDetailed?: boolean;
}

export function StreakBadge({ onPress, showDetailed = false }: StreakBadgeProps) {
  const { streakData, getCurrentMilestone, getNextMilestone, getDaysUntilNextMilestone } = useStreak();
  const { themeMode, colors } = useTheme();
  const { getScaledSize } = useFontSize();

  const isDark = themeMode === 'dark';
  const currentMilestone = getCurrentMilestone();
  const nextMilestone = getNextMilestone();
  const daysUntilNext = getDaysUntilNextMilestone();

  // Don't show badge if no streak
  if (streakData.currentStreak === 0 && !showDetailed) {
    return null;
  }

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const getStreakColor = () => {
    if (streakData.currentStreak === 0) return '#9E9E9E';
    if (streakData.currentStreak < 7) return '#4CAF50';
    if (streakData.currentStreak < 30) return '#FF9800';
    if (streakData.currentStreak < 100) return '#E91E63';
    return '#6200EA';
  };

  const getStreakEmoji = () => {
    if (streakData.currentStreak === 0) return '📚';
    if (streakData.currentStreak < 7) return '🌱';
    if (streakData.currentStreak < 30) return '🔥';
    if (streakData.currentStreak < 100) return '💪';
    return '👑';
  };

  const getMotivationalText = () => {
    if (streakData.currentStreak === 0) {
      return 'Start your learning journey!';
    }
    if (streakData.currentStreak === 1) {
      return 'Great start! Keep it up tomorrow!';
    }
    if (streakData.currentStreak < 7) {
      return `${6 - streakData.currentStreak} more days to reach 1 week!`;
    }
    if (nextMilestone) {
      return `${daysUntilNext} more days to ${nextMilestone.title}!`;
    }
    return 'You\'re a learning champion!';
  };

  if (showDetailed) {
    return (
      <TouchableOpacity
        style={[
          styles.detailedContainer,
          {
            backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
            borderColor: getStreakColor(),
          }
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {/* Main Streak Display */}
        <View style={styles.streakHeader}>
          <Text style={[styles.streakEmoji, { fontSize: getScaledSize(32) }]}>
            {getStreakEmoji()}
          </Text>
          <View style={styles.streakInfo}>
            <Text style={[styles.streakNumber, { color: getStreakColor(), fontSize: getScaledSize(28) }]}>
              {streakData.currentStreak}
            </Text>
            <Text style={[styles.streakLabel, { color: colors.text, fontSize: getScaledSize(16) }]}>
              day streak
            </Text>
          </View>
        </View>

        {/* Current Milestone */}
        {currentMilestone && (
          <View style={[styles.milestone, { backgroundColor: currentMilestone.color + '20' }]}>
            <Text style={[styles.milestoneEmoji, { fontSize: getScaledSize(20) }]}>
              {currentMilestone.emoji}
            </Text>
            <Text style={[styles.milestoneText, { color: currentMilestone.color, fontSize: getScaledSize(14) }]}>
              {currentMilestone.title}
            </Text>
          </View>
        )}

        {/* Motivational Text */}
        <Text style={[styles.motivationalText, { color: colors.textSecondary, fontSize: getScaledSize(13) }]}>
          {getMotivationalText()}
        </Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text, fontSize: getScaledSize(16) }]}>
              {streakData.longestStreak}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: getScaledSize(12) }]}>
              longest
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text, fontSize: getScaledSize(16) }]}>
              {streakData.totalStudySessions}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: getScaledSize(12) }]}>
              sessions
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Compact badge for home screen
  return (
    <TouchableOpacity
      style={[
        styles.compactContainer,
        {
          backgroundColor: getStreakColor(),
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={[styles.compactEmoji, { fontSize: getScaledSize(18) }]}>
        {getStreakEmoji()}
      </Text>
      <Text style={[styles.compactNumber, { fontSize: getScaledSize(16) }]}>
        {streakData.currentStreak}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Detailed view styles
  detailedContainer: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakEmoji: {
    marginRight: 12,
  },
  streakInfo: {
    alignItems: 'center',
  },
  streakNumber: {
    fontWeight: 'bold',
    lineHeight: 32,
  },
  streakLabel: {
    fontWeight: '600',
    marginTop: -4,
  },
  milestone: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  milestoneEmoji: {
    marginRight: 6,
  },
  milestoneText: {
    fontWeight: '600',
  },
  motivationalText: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
  },
  statLabel: {
    fontWeight: '500',
    marginTop: 2,
  },

  // Compact view styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  compactEmoji: {
    // No additional styles needed
  },
  compactNumber: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});