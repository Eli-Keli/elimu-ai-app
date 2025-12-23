import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../src/components/Button';
import { useTheme } from '../src/contexts/ThemeContext';
import { useFontSize } from '../src/contexts/FontSizeContext';
import { useLanguage } from '../src/contexts/LanguageContext';
import { SAMPLE_DOCUMENTS } from '../src/services/sampleDocuments';

const { width } = Dimensions.get('window');

interface RecentDocument {
  id: string;
  title: string;
  subject: string;
  date: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { getScaledSize } = useFontSize();
  const { t } = useLanguage();
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);
  const [learningTip, setLearningTip] = useState('');

  useEffect(() => {
    loadRecentDocuments();
    loadDailyTip();
  }, []);

  const loadRecentDocuments = async () => {
    try {
      const recent = await AsyncStorage.getItem('@recent_documents');
      if (recent) {
        setRecentDocs(JSON.parse(recent));
      }
    } catch (error) {
      console.error('Error loading recent documents:', error);
    }
  };

  const loadDailyTip = () => {
    const tips = [
      '💡 Tip: Use flashcards to memorize key concepts quickly!',
      '🎯 Tip: Take breaks every 25 minutes for better focus.',
      '📚 Tip: Teach what you learn to remember it better!',
      '✨ Tip: Review your notes within 24 hours to retain more.',
      '🧠 Tip: Practice with quizzes to test your understanding.',
      '🌟 Tip: Study in short, focused sessions for best results.',
      '💪 Tip: Stay consistent - review a little every day!',
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setLearningTip(randomTip);
  };

  const handleSampleSelect = (sampleId: string) => {
    router.push(`/results?sampleId=${sampleId}`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text, fontSize: getScaledSize(28) }]}>
          {t('home.greeting')}
        </Text>
        <Text style={[styles.title, { color: colors.textSecondary, fontSize: getScaledSize(16) }]}>
          {t('home.subtitle')}
        </Text>
      </View>

      {/* Learning Tip */}
      <View style={[styles.tipCard, { backgroundColor: colors.accent + '15', borderLeftColor: colors.accent }]}>
        <Text style={[styles.tipText, { color: colors.text, fontSize: getScaledSize(14) }]}>{learningTip}</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: getScaledSize(20) }]}>
          {t('home.quickActions')}
        </Text>
        <View style={styles.actionButtons}>
          <Button 
            title={`📤 ${t('home.uploadDocument')}`}
            onPress={() => router.push('/upload')}
          />
          <Button 
            title={`⚙️ ${t('home.viewSettings')}`}
            onPress={() => router.push('/settings')}
          />
        </View>
      </View>

      {/* Sample Documents */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: getScaledSize(20) }]}>
          {t('home.quickStart')}
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
          CBC-aligned content for Kenyan students
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.samplesContainer}
        >
          {SAMPLE_DOCUMENTS.map((sample) => (
            <TouchableOpacity
              key={sample.id}
              style={[styles.sampleCard, { backgroundColor: colors.card }]}
              onPress={() => handleSampleSelect(sample.id)}
            >
              <Text style={styles.sampleEmoji}>{sample.emoji}</Text>
              <Text style={[styles.sampleTitle, { color: colors.text, fontSize: getScaledSize(14) }]} numberOfLines={2}>
                {sample.title}
              </Text>
              <Text style={[styles.sampleSubject, { color: colors.primary, fontSize: getScaledSize(12) }]}>
                {sample.subject}
              </Text>
              <View style={[styles.sampleBadge, { backgroundColor: colors.accent + '20' }]}>
                <Text style={[styles.sampleBadgeText, { color: colors.accent, fontSize: getScaledSize(10) }]}>
                  {sample.content.gradeLevel}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recent Documents */}
      {recentDocs.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: getScaledSize(20) }]}>
            {t('home.recentDocuments')}
          </Text>
          {recentDocs.slice(0, 3).map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={[styles.recentCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(`/results?docId=${doc.id}`)}
            >
              <View>
                <Text style={[styles.recentTitle, { color: colors.text, fontSize: getScaledSize(16) }]}>
                  {doc.title}
                </Text>
                <Text style={[styles.recentSubject, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
                  {doc.subject}
                </Text>
              </View>
              <Text style={[styles.recentDate, { color: colors.textSecondary, fontSize: getScaledSize(12) }]}>
                {doc.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    
    opacity: 0.7,
  },
  tipCard: {
    backgroundColor: '#FFF9E6',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    marginBottom: 24,
  },
  tipText: {
    fontSize: 14,
    color: '#795548',
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    
    opacity: 0.6,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  actionButtons: {
    paddingHorizontal: 20,
    gap: 12,
  },
  samplesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  sampleCard: {
    width: width * 0.4,
    
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sampleEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  sampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    
    marginBottom: 6,
    minHeight: 36,
  },
  sampleSubject: {
    fontSize: 12,
    
    opacity: 0.6,
    marginBottom: 8,
  },
  sampleBadge: {
    
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  sampleBadgeText: {
    fontSize: 10,
    
    fontWeight: '600',
  },
  recentCard: {
    
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    
    marginBottom: 4,
  },
  recentSubject: {
    fontSize: 12,
    
    opacity: 0.6,
  },
  recentDate: {
    fontSize: 12,
    
    opacity: 0.5,
  },
  footer: {
    height: 40,
  },
});
