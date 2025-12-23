import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../src/components/Button';
import { useTheme } from '../src/contexts/ThemeContext';
import { useFontSize } from '../src/contexts/FontSizeContext';
import { useLanguage } from '../src/contexts/LanguageContext';
import { SAMPLE_DOCUMENTS } from '../src/services/sampleDocuments';

const { width } = Dimensions.get('window');

interface UploadHistory {
  id: string;
  name: string;
  type: string;
  date: string;
}

export default function UploadScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { getScaledSize } = useFontSize();
  const { t } = useLanguage();
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([]);

  useEffect(() => {
    loadUploadHistory();
  }, []);

  const loadUploadHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('@upload_history');
      if (history) {
        setUploadHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading upload history:', error);
    }
  };

  const saveToHistory = async (file: { name: string; type: string }) => {
    try {
      const newEntry: UploadHistory = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        date: new Date().toLocaleDateString(),
      };
      
      const updatedHistory = [newEntry, ...uploadHistory].slice(0, 5);
      await AsyncStorage.setItem('@upload_history', JSON.stringify(updatedHistory));
      setUploadHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'text/plain'],
      });
      
      if (!result.canceled) {
        const file = result.assets[0];
        console.log('Document picked:', file.uri);
        
        await saveToHistory({
          name: file.name,
          type: file.mimeType || 'unknown',
        });
        
        router.push({ pathname: '/reader', params: { uri: file.uri } });
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const handleSampleSelect = (sampleId: string) => {
    router.push(`/results?sampleId=${sampleId}`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text, fontSize: getScaledSize(24) }]}>
          {t('upload.title')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
          {t('upload.supportedFormats')}
        </Text>
      </View>

      {/* Upload Area */}
      <View style={styles.uploadArea}>
        <View style={[styles.uploadBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.uploadIcon}>📁</Text>
          <Text style={[styles.uploadTitle, { color: colors.text, fontSize: getScaledSize(18) }]}>
            {t('upload.selectFile')}
          </Text>
          <Text style={[styles.uploadSubtitle, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
            {t('upload.supportedFormats')}
          </Text>
          <View style={styles.uploadButton}>
            <Button 
              title="📂 Browse Files" 
              onPress={handlePickDocument}
            />
          </View>
        </View>
      </View>

      {/* Quick Start with Samples */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: getScaledSize(20) }]}>
          {t('upload.quickStart')}
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
          Try these CBC-aligned sample documents
        </Text>
        
        <View style={styles.samplesGrid}>
          {SAMPLE_DOCUMENTS.slice(0, 4).map((sample) => (
            <TouchableOpacity
              key={sample.id}
              style={[styles.sampleCard, { backgroundColor: colors.card }]}
              onPress={() => handleSampleSelect(sample.id)}
            >
              <Text style={styles.sampleEmoji}>{sample.emoji}</Text>
              <Text style={[styles.sampleTitle, { color: colors.text, fontSize: getScaledSize(13) }]} numberOfLines={2}>
                {sample.title}
              </Text>
              <Text style={[styles.sampleGrade, { color: colors.primary, fontSize: getScaledSize(11) }]}>
                {sample.content.gradeLevel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={[styles.viewAllButton, { backgroundColor: colors.surface }]}
          onPress={() => router.push('/')}
        >
          <Text style={[styles.viewAllText, { color: colors.primary, fontSize: getScaledSize(14) }]}>
            View All Samples →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Upload History */}
      {uploadHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: getScaledSize(20) }]}>
            {t('upload.history')}
          </Text>
          {uploadHistory.map((item) => (
            <View key={item.id} style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.historyIcon, { backgroundColor: colors.primary + '20' }]}>
                <Text style={styles.historyIconText}>
                  {item.type.includes('pdf') ? '📄' : item.type.includes('image') ? '🖼️' : '📝'}
                </Text>
              </View>
              <View style={styles.historyInfo}>
                <Text style={[styles.historyName, { color: colors.text, fontSize: getScaledSize(16) }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.historyDate, { color: colors.textSecondary, fontSize: getScaledSize(12) }]}>
                  {item.date}
                </Text>
              </View>
            </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    
    opacity: 0.7,
  },
  uploadArea: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  uploadBox: {
    
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    
    borderStyle: 'dashed',
  },
  uploadIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '600',
    
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 12,
    
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 20,
  },
  uploadButton: {
    width: '100%',
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
  samplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  sampleCard: {
    width: (width - 56) / 2,
    
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sampleEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  sampleTitle: {
    fontSize: 13,
    fontWeight: '600',
    
    textAlign: 'center',
    marginBottom: 6,
    minHeight: 34,
  },
  sampleGrade: {
    fontSize: 11,
    
    fontWeight: '600',
  },
  viewAllButton: {
    marginHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
  viewAllText: {
    fontSize: 14,
    
    fontWeight: '600',
  },
  historyCard: {
    
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  historyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyIconText: {
    fontSize: 20,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 14,
    fontWeight: '600',
    
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    
    opacity: 0.5,
  },
  footer: {
    height: 40,
  },
});
