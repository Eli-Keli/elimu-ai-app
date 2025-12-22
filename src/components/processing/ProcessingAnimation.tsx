import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme/colors';

interface ProcessingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: 'pending' | 'active' | 'completed';
}

interface ProcessingAnimationProps {
  currentStep: number;
  onComplete?: () => void;
}

export default function ProcessingAnimation({ currentStep, onComplete }: ProcessingAnimationProps) {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 1,
      title: 'Extracting Text',
      description: 'Reading your document...',
      icon: '📄',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Simplifying Content',
      description: 'Making it easier to understand...',
      icon: '🧠',
      status: 'pending',
    },
    {
      id: 3,
      title: 'Generating Audio',
      description: 'Creating speech narration...',
      icon: '🔊',
      status: 'pending',
    },
    {
      id: 4,
      title: 'Creating Visuals',
      description: 'Generating helpful diagrams...',
      icon: '🎨',
      status: 'pending',
    },
  ]);

  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    // Update step statuses based on current step
    setSteps((prevSteps) =>
      prevSteps.map((step) => ({
        ...step,
        status:
          step.id < currentStep
            ? 'completed'
            : step.id === currentStep
            ? 'active'
            : 'pending',
      }))
    );

    // Animate progress bar
    Animated.timing(progress, {
      toValue: (currentStep / steps.length) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      if (currentStep >= steps.length && onComplete) {
        setTimeout(onComplete, 500);
      }
    });
  }, [currentStep]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Processing Your Document</Text>
        <Text style={styles.subtitle}>Please wait while we prepare your content</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>

      {/* Processing Steps */}
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.id}>
            <View style={styles.stepRow}>
              {/* Step Icon */}
              <View
                style={[
                  styles.stepIcon,
                  step.status === 'completed' && styles.stepIconCompleted,
                  step.status === 'active' && styles.stepIconActive,
                ]}
              >
                <Text style={styles.stepIconText}>
                  {step.status === 'completed' ? '✓' : step.icon}
                </Text>
              </View>

              {/* Step Content */}
              <View style={styles.stepContent}>
                <Text
                  style={[
                    styles.stepTitle,
                    step.status === 'active' && styles.stepTitleActive,
                    step.status === 'completed' && styles.stepTitleCompleted,
                  ]}
                >
                  {step.title}
                </Text>
                {step.status === 'active' && (
                  <Text style={styles.stepDescription}>{step.description}</Text>
                )}
              </View>

              {/* Status Indicator */}
              {step.status === 'active' && (
                <View style={styles.loadingDots}>
                  <LoadingDots />
                </View>
              )}
            </View>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.connector,
                  step.status === 'completed' && styles.connectorCompleted,
                ]}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

function LoadingDots() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return <Text style={styles.dotsText}>{dots}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.6,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.primary + '20',
    borderRadius: 3,
    marginBottom: 40,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  stepsContainer: {
    flex: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  stepIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  stepIconActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  stepIconCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepIconText: {
    fontSize: 24,
    color: colors.text,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    opacity: 0.5,
  },
  stepTitleActive: {
    color: colors.primary,
    opacity: 1,
  },
  stepTitleCompleted: {
    opacity: 0.7,
  },
  stepDescription: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.6,
    marginTop: 4,
  },
  connector: {
    width: 2,
    height: 30,
    backgroundColor: colors.primary + '30',
    marginLeft: 24,
  },
  connectorCompleted: {
    backgroundColor: colors.primary,
  },
  loadingDots: {
    width: 30,
  },
  dotsText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
});
