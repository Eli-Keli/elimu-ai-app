import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export interface Flashcard {
  term: string;
  definition: string;
}

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  subject?: string;
}

export default function FlashcardViewer({ flashcards, subject }: FlashcardViewerProps) {
  const { colors } = useTheme();
  const { getScaledSize } = useFontSize();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  const currentCard = flashcards[currentIndex];

  // Flip animation
  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 180;
    
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    
    setIsFlipped(!isFlipped);
  };

  // Swipe gesture handler
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD && currentIndex > 0) {
          // Swipe right - previous card
          handlePrevious();
        } else if (gestureState.dx < -SWIPE_THRESHOLD && currentIndex < flashcards.length - 1) {
          // Swipe left - next card
          handleNext();
        } else {
          // Return to center
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      Animated.timing(translateX, {
        toValue: -SCREEN_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
        flipAnim.setValue(0);
        translateX.setValue(SCREEN_WIDTH);
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      Animated.timing(translateX, {
        toValue: SCREEN_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(currentIndex - 1);
        setIsFlipped(false);
        flipAnim.setValue(0);
        translateX.setValue(-SCREEN_WIDTH);
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  // Interpolate flip animation
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 90, 90, 180],
    outputRange: [1, 1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 90, 90, 180],
    outputRange: [0, 0, 1, 1],
  });

  if (flashcards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: getScaledSize(16) }]}>
          No flashcards available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      {subject && (
        <Text style={[styles.subject, { color: colors.text, fontSize: getScaledSize(18) }]}>
          📚 {subject}
        </Text>
      )}

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Text style={[styles.progressText, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
          Card {currentIndex + 1} of {flashcards.length}
        </Text>
        <View style={styles.progressDots}>
          {flashcards.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentIndex ? colors.primary : colors.border,
                  width: index === currentIndex ? 10 : 6,
                  height: index === currentIndex ? 10 : 6,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Flashcard */}
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleFlip}
          style={styles.touchable}
        >
          {/* Front Side */}
          <Animated.View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
              {
                transform: [{ rotateY: frontInterpolate }],
                opacity: frontOpacity,
              },
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={[styles.label, { color: colors.primary, fontSize: getScaledSize(12) }]}>
                TERM
              </Text>
              <Text style={[styles.term, { color: colors.text, fontSize: getScaledSize(24) }]}>
                {currentCard.term}
              </Text>
              <View style={[styles.tapHint, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.tapHintText, { color: colors.primary, fontSize: getScaledSize(12) }]}>
                  Tap to flip ↻
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Back Side */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              { backgroundColor: colors.primary, borderColor: colors.primary },
              {
                transform: [{ rotateY: backInterpolate }],
                opacity: backOpacity,
              },
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={[styles.label, { color: '#fff', fontSize: getScaledSize(12) }]}>
                DEFINITION
              </Text>
              <Text style={[styles.definition, { color: '#fff', fontSize: getScaledSize(18) }]}>
                {currentCard.definition}
              </Text>
              <View style={[styles.tapHint, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                <Text style={[styles.tapHintText, { color: '#fff', fontSize: getScaledSize(12) }]}>
                  Tap to flip ↻
                </Text>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          style={[
            styles.navButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            currentIndex === 0 && styles.navButtonDisabled,
          ]}
        >
          <Text style={[styles.navButtonText, { color: currentIndex === 0 ? colors.textSecondary : colors.primary, fontSize: getScaledSize(16) }]}>
            ← Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          style={[
            styles.navButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            currentIndex === flashcards.length - 1 && styles.navButtonDisabled,
          ]}
        >
          <Text style={[styles.navButtonText, { color: currentIndex === flashcards.length - 1 ? colors.textSecondary : colors.primary, fontSize: getScaledSize(16) }]}>
            Next →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Swipe Hint */}
      <Text style={[styles.swipeHint, { color: colors.textSecondary, fontSize: getScaledSize(12) }]}>
        💡 Swipe left/right to navigate
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    borderRadius: 5,
  },
  cardContainer: {
    height: 400,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  touchable: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 2,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 16,
  },
  term: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  definition: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 20,
  },
  tapHint: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
  },
  tapHintText: {
    fontSize: 12,
    fontWeight: '600',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  swipeHint: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
