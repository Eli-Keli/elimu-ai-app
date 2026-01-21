import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null; // ISO date string
  totalStudySessions: number;
  studyDates: string[]; // Array of ISO date strings
}

export interface Milestone {
  days: number;
  title: string;
  emoji: string;
  color: string;
}

interface StreakContextType {
  streakData: StreakData;
  recordStudySession: () => Promise<void>;
  getMilestones: () => Milestone[];
  getCurrentMilestone: () => Milestone | null;
  getNextMilestone: () => Milestone | null;
  getDaysUntilNextMilestone: () => number;
  isLoading: boolean;
}

// Context
const StreakContext = createContext<StreakContextType | undefined>(undefined);

// Storage key
const STREAK_STORAGE_KEY = '@elimu_study_streak';

// Predefined milestones
const MILESTONES: Milestone[] = [
  { days: 1, title: 'First Step', emoji: '👶', color: '#4CAF50' },
  { days: 3, title: 'Getting Started', emoji: '🌱', color: '#8BC34A' },
  { days: 7, title: 'One Week', emoji: '📅', color: '#FF9800' },
  { days: 14, title: 'Two Weeks', emoji: '💪', color: '#FF5722' },
  { days: 30, title: 'One Month', emoji: '🏆', color: '#9C27B0' },
  { days: 60, title: 'Two Months', emoji: '🔥', color: '#E91E63' },
  { days: 100, title: 'Centurion', emoji: '👑', color: '#FFD700' },
  { days: 365, title: 'Year Master', emoji: '🌟', color: '#6200EA' },
];

// Helper functions
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

const isConsecutiveDay = (date1: Date, date2: Date): boolean => {
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Provider
export function StreakProvider({ children }: { children: ReactNode }) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    totalStudySessions: 0,
    studyDates: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load streak data from AsyncStorage on mount
  useEffect(() => {
    loadStreakData();
  }, []);

  // Load streak data from storage
  const loadStreakData = async () => {
    try {
      setIsLoading(true);
      const storedData = await AsyncStorage.getItem(STREAK_STORAGE_KEY);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setStreakData(parsedData);
        console.log(`[Streak] Loaded data: ${parsedData.currentStreak} day streak`);
        
        // Check if streak should be reset due to inactivity
        await checkAndResetStreak(parsedData);
      } else {
        console.log('[Streak] No existing data, starting fresh');
      }
    } catch (error) {
      console.error('[Streak] Failed to load streak data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if streak should be reset due to inactivity
  const checkAndResetStreak = async (data: StreakData) => {
    if (!data.lastStudyDate) return;

    const today = new Date();
    const lastStudy = new Date(data.lastStudyDate);
    const daysSinceLastStudy = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));

    // If more than 1 day has passed, reset current streak but keep longest streak
    if (daysSinceLastStudy > 1) {
      const updatedData = {
        ...data,
        currentStreak: 0,
      };
      setStreakData(updatedData);
      await saveStreakData(updatedData);
      console.log(`[Streak] Reset streak due to ${daysSinceLastStudy} days of inactivity`);
    }
  };

  // Save streak data to storage
  const saveStreakData = async (data: StreakData) => {
    try {
      await AsyncStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
      console.log(`[Streak] Saved data: ${data.currentStreak} day streak`);
    } catch (error) {
      console.error('[Streak] Failed to save streak data:', error);
      throw error;
    }
  };

  // Record a study session
  const recordStudySession = async () => {
    try {
      const today = new Date();
      const todayString = getTodayDateString();
      
      // Check if already studied today
      if (streakData.lastStudyDate && isSameDay(today, new Date(streakData.lastStudyDate))) {
        console.log('[Streak] Already studied today, no change');
        return;
      }

      let newCurrentStreak = 1;
      
      // Calculate new streak
      if (streakData.lastStudyDate) {
        const lastStudy = new Date(streakData.lastStudyDate);
        
        if (isConsecutiveDay(today, lastStudy)) {
          // Consecutive day, increment streak
          newCurrentStreak = streakData.currentStreak + 1;
        } else {
          // Gap in days, restart streak
          newCurrentStreak = 1;
        }
      }

      // Update longest streak if needed
      const newLongestStreak = Math.max(streakData.longestStreak, newCurrentStreak);

      // Update study dates array (keep last 365 days)
      const updatedStudyDates = [...streakData.studyDates.filter(date => date !== todayString), todayString]
        .sort()
        .slice(-365); // Keep only last 365 days

      const updatedData: StreakData = {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastStudyDate: todayString,
        totalStudySessions: streakData.totalStudySessions + 1,
        studyDates: updatedStudyDates,
      };

      setStreakData(updatedData);
      await saveStreakData(updatedData);
      
      console.log(`[Streak] Session recorded: ${newCurrentStreak} day streak (${updatedData.totalStudySessions} total sessions)`);
      
      // Log milestone achievements
      const currentMilestone = getCurrentMilestone();
      const prevMilestone = MILESTONES.find(m => m.days === newCurrentStreak - 1);
      if (currentMilestone && !prevMilestone) {
        console.log(`[Streak] 🎉 Milestone achieved: ${currentMilestone.title} (${currentMilestone.days} days)`);
      }
      
    } catch (error) {
      console.error('[Streak] Failed to record study session:', error);
      throw error;
    }
  };

  // Get all milestones
  const getMilestones = (): Milestone[] => {
    return MILESTONES;
  };

  // Get current milestone (highest achieved)
  const getCurrentMilestone = (): Milestone | null => {
    const achieved = MILESTONES.filter(m => m.days <= streakData.currentStreak);
    return achieved.length > 0 ? achieved[achieved.length - 1] : null;
  };

  // Get next milestone to achieve
  const getNextMilestone = (): Milestone | null => {
    const next = MILESTONES.find(m => m.days > streakData.currentStreak);
    return next || null;
  };

  // Get days until next milestone
  const getDaysUntilNextMilestone = (): number => {
    const next = getNextMilestone();
    return next ? next.days - streakData.currentStreak : 0;
  };

  const value: StreakContextType = {
    streakData,
    recordStudySession,
    getMilestones,
    getCurrentMilestone,
    getNextMilestone,
    getDaysUntilNextMilestone,
    isLoading,
  };

  return (
    <StreakContext.Provider value={value}>
      {children}
    </StreakContext.Provider>
  );
}

// Hook
export function useStreak() {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error('useStreak must be used within StreakProvider');
  }
  return context;
}