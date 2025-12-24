import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';
import { Button } from './Button';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizViewerProps {
  questions: QuizQuestion[];
  subject?: string;
  onComplete?: (score: number, total: number) => void;
}

export default function QuizViewer({ questions, subject, onComplete }: QuizViewerProps) {
  const { colors } = useTheme();
  const { getScaledSize } = useFontSize();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (optionIndex: number) => {
    if (showExplanation) return; // Prevent changing answer after submission
    
    setSelectedAnswer(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setShowExplanation(true);

    // Update score if correct
    if (selectedAnswer === currentQuestion.correctAnswer) {
      if (!answeredQuestions[currentQuestionIndex]) {
        setCorrectAnswers(correctAnswers + 1);
      }
    }

    // Mark question as answered
    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestionIndex] = true;
    setAnsweredQuestions(newAnswered);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizCompleted(true);
      if (onComplete) {
        onComplete(correctAnswers, questions.length);
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setAnsweredQuestions(new Array(questions.length).fill(false));
  };

  if (questions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: getScaledSize(16) }]}>
          No quiz questions available
        </Text>
      </View>
    );
  }

  // Quiz Completed Screen
  if (quizCompleted) {
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.resultsContainer}>
        <Text style={[styles.resultsTitle, { color: colors.text, fontSize: getScaledSize(32) }]}>
          {passed ? '🎉' : '📚'}
        </Text>
        <Text style={[styles.resultsTitle, { color: colors.text, fontSize: getScaledSize(28) }]}>
          Quiz Complete!
        </Text>
        
        <View style={[styles.scoreCard, { backgroundColor: colors.card, borderColor: passed ? '#4CAF50' : colors.primary }]}>
          <Text style={[styles.scoreText, { color: colors.text, fontSize: getScaledSize(48) }]}>
            {correctAnswers}/{questions.length}
          </Text>
          <Text style={[styles.percentageText, { color: colors.textSecondary, fontSize: getScaledSize(24) }]}>
            {percentage}%
          </Text>
        </View>

        <Text style={[styles.resultMessage, { color: colors.text, fontSize: getScaledSize(18) }]}>
          {passed 
            ? '🌟 Excellent work! You have mastered this topic!' 
            : '💪 Good effort! Review the material and try again.'}
        </Text>

        {/* Performance Breakdown */}
        <View style={[styles.breakdownCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.breakdownTitle, { color: colors.text, fontSize: getScaledSize(16) }]}>
            Performance Breakdown
          </Text>
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
              ✅ Correct:
            </Text>
            <Text style={[styles.breakdownValue, { color: '#4CAF50', fontSize: getScaledSize(14) }]}>
              {correctAnswers}
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
              ❌ Incorrect:
            </Text>
            <Text style={[styles.breakdownValue, { color: '#f44336', fontSize: getScaledSize(14) }]}>
              {questions.length - correctAnswers}
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
              📊 Total:
            </Text>
            <Text style={[styles.breakdownValue, { color: colors.text, fontSize: getScaledSize(14) }]}>
              {questions.length}
            </Text>
          </View>
        </View>

        <Button
          title="🔄 Retake Quiz"
          onPress={handleRetakeQuiz}
          style={{ backgroundColor: colors.primary, marginTop: 20 }}
        />
      </ScrollView>
    );
  }

  // Quiz Question Screen
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      {subject && (
        <Text style={[styles.subject, { color: colors.text, fontSize: getScaledSize(18) }]}>
          🎯 Quiz: {subject}
        </Text>
      )}

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Text style={[styles.progressText, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              },
            ]}
          />
        </View>
        <View style={styles.progressDots}>
          {questions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: 
                    index < currentQuestionIndex 
                      ? '#4CAF50' 
                      : index === currentQuestionIndex 
                      ? colors.primary 
                      : colors.border,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Question Card */}
      <View style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.questionText, { color: colors.text, fontSize: getScaledSize(20) }]}>
          {currentQuestion.question}
        </Text>
      </View>

      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === currentQuestion.correctAnswer;
          const showCorrect = showExplanation && isCorrect;
          const showIncorrect = showExplanation && isSelected && !isCorrect;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswerSelect(index)}
              disabled={showExplanation}
              style={[
                styles.optionButton,
                {
                  backgroundColor: colors.card,
                  borderColor: 
                    showCorrect 
                      ? '#4CAF50' 
                      : showIncorrect 
                      ? '#f44336' 
                      : isSelected 
                      ? colors.primary 
                      : colors.border,
                  borderWidth: isSelected || showCorrect || showIncorrect ? 3 : 2,
                },
              ]}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.optionCircle,
                    {
                      borderColor: 
                        showCorrect 
                          ? '#4CAF50' 
                          : showIncorrect 
                          ? '#f44336' 
                          : isSelected 
                          ? colors.primary 
                          : colors.border,
                      backgroundColor: 
                        showCorrect 
                          ? '#4CAF50' 
                          : showIncorrect 
                          ? '#f44336' 
                          : isSelected 
                          ? colors.primary 
                          : 'transparent',
                    },
                  ]}
                >
                  {(isSelected || showCorrect || showIncorrect) && (
                    <Text style={styles.optionCheckmark}>
                      {showCorrect ? '✓' : showIncorrect ? '✗' : '●'}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: colors.text,
                      fontSize: getScaledSize(16),
                      fontWeight: isSelected ? '600' : '400',
                    },
                  ]}
                >
                  {String.fromCharCode(65 + index)}) {option}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Explanation */}
      {showExplanation && (
        <View
          style={[
            styles.explanationCard,
            {
              backgroundColor: 
                selectedAnswer === currentQuestion.correctAnswer 
                  ? '#E8F5E9' 
                  : '#FFEBEE',
              borderColor: 
                selectedAnswer === currentQuestion.correctAnswer 
                  ? '#4CAF50' 
                  : '#f44336',
            },
          ]}
        >
          <Text
            style={[
              styles.explanationTitle,
              {
                color: 
                  selectedAnswer === currentQuestion.correctAnswer 
                    ? '#2E7D32' 
                    : '#C62828',
                fontSize: getScaledSize(16),
              },
            ]}
          >
            {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
          </Text>
          <Text
            style={[
              styles.explanationText,
              {
                color: 
                  selectedAnswer === currentQuestion.correctAnswer 
                    ? '#2E7D32' 
                    : '#C62828',
                fontSize: getScaledSize(14),
              },
            ]}
          >
            {currentQuestion.explanation}
          </Text>
        </View>
      )}

      {/* Action Button */}
      <View style={styles.actionContainer}>
        {!showExplanation ? (
          <Button
            title="Submit Answer"
            onPress={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            style={{
              backgroundColor: selectedAnswer === null ? colors.border : colors.primary,
              opacity: selectedAnswer === null ? 0.5 : 1,
            }}
          />
        ) : (
          <Button
            title={isLastQuestion ? '🏁 Finish Quiz' : 'Next Question →'}
            onPress={handleNextQuestion}
            style={{ backgroundColor: colors.primary }}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 10,
  },
  progressContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  questionCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 30,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCheckmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  explanationCard: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 20,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 22,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  resultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  scoreCard: {
    width: '100%',
    padding: 40,
    borderRadius: 20,
    borderWidth: 4,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '600',
  },
  resultMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  breakdownCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  breakdownLabel: {
    fontSize: 14,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
