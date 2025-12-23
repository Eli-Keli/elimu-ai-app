import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { colors } from '../src/theme/colors';

type ThemeMode = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large';
type Language = 'en' | 'sw';

export default function SettingsScreen() {
  // State
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [ttsVoice, setTtsVoice] = useState<string>('default');
  const [language, setLanguage] = useState<Language>('en');
  const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
    loadVoices();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedTheme, savedFontSize, savedVoice, savedLanguage] = await Promise.all([
        AsyncStorage.getItem('@app_theme'),
        AsyncStorage.getItem('@app_fontSize'),
        AsyncStorage.getItem('@app_ttsVoice'),
        AsyncStorage.getItem('@app_language'),
      ]);

      if (savedTheme) setThemeMode(savedTheme as ThemeMode);
      if (savedFontSize) setFontSize(savedFontSize as FontSize);
      if (savedVoice) setTtsVoice(savedVoice);
      if (savedLanguage) setLanguage(savedLanguage as Language);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadVoices = async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      setAvailableVoices(voices);
    } catch (error) {
      console.error('Failed to load voices:', error);
    }
  };

  // Handlers
  const handleThemeChange = async (value: boolean) => {
    const newTheme: ThemeMode = value ? 'dark' : 'light';
    setThemeMode(newTheme);
    try {
      await AsyncStorage.setItem('@app_theme', newTheme);
      Alert.alert('Theme Updated', `Switched to ${newTheme} mode. Restart the app to see changes.`);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const handleFontSizeChange = async (size: FontSize) => {
    setFontSize(size);
    try {
      await AsyncStorage.setItem('@app_fontSize', size);
      Alert.alert('Font Size Updated', 'Your preference has been saved.');
    } catch (error) {
      console.error('Failed to save font size:', error);
    }
  };

  const handleLanguageChange = async (lang: Language) => {
    setLanguage(lang);
    try {
      await AsyncStorage.setItem('@app_language', lang);
      Alert.alert('Language Updated', lang === 'en' ? 'Set to English' : 'Imewekwa kwa Kiswahili');
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const testVoice = (voice: Speech.Voice) => {
    const testText = language === 'en' 
      ? 'This is how I sound.' 
      : 'Hii ni jinsi ninavyosikika.';
    Speech.speak(testText, {
      language: voice.language,
      voice: voice.identifier,
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  const isDarkMode = themeMode === 'dark';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.mainHeader}>Settings</Text>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Appearance</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>Enable dark theme</Text>
          </View>
          <Switch 
            value={isDarkMode}
            onValueChange={handleThemeChange}
            trackColor={{ false: '#ccc', true: colors.accent }}
            thumbColor={isDarkMode ? colors.primary : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Font Size</Text>
            <Text style={styles.settingDescription}>Adjust reading text size</Text>
          </View>
        </View>
        <View style={styles.fontSizeButtons}>
          <TouchableOpacity 
            style={[styles.fontButton, fontSize === 'small' && styles.fontButtonActive]}
            onPress={() => handleFontSizeChange('small')}
          >
            <Text style={[styles.fontButtonText, fontSize === 'small' && styles.fontButtonTextActive]}>
              A-
            </Text>
            <Text style={styles.fontButtonLabel}>Small</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.fontButton, fontSize === 'medium' && styles.fontButtonActive]}
            onPress={() => handleFontSizeChange('medium')}
          >
            <Text style={[styles.fontButtonText, fontSize === 'medium' && styles.fontButtonTextActive]}>
              A
            </Text>
            <Text style={styles.fontButtonLabel}>Medium</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.fontButton, fontSize === 'large' && styles.fontButtonActive]}
            onPress={() => handleFontSizeChange('large')}
          >
            <Text style={[styles.fontButtonText, fontSize === 'large' && styles.fontButtonTextActive]}>
              A+
            </Text>
            <Text style={styles.fontButtonLabel}>Large</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Audio Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Audio Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Text-to-Speech Voice</Text>
        </View>
        
        {availableVoices.length > 0 ? (
          <View style={styles.voiceList}>
            {availableVoices.slice(0, 5).map((voice) => (
              <TouchableOpacity
                key={voice.identifier}
                style={[
                  styles.voiceItem,
                  ttsVoice === voice.identifier && styles.voiceItemActive
                ]}
                onPress={async () => {
                  setTtsVoice(voice.identifier);
                  await AsyncStorage.setItem('@app_ttsVoice', voice.identifier);
                  testVoice(voice);
                }}
              >
                <View style={styles.voiceInfo}>
                  <Text style={[
                    styles.voiceName,
                    ttsVoice === voice.identifier && styles.voiceNameActive
                  ]}>
                    {voice.name}
                  </Text>
                  <Text style={styles.voiceLanguage}>{voice.language}</Text>
                </View>
                {ttsVoice === voice.identifier && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.noVoicesText}>No voices available</Text>
        )}
      </View>

      {/* Language Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Language</Text>
        
        <View style={styles.languageButtons}>
          <TouchableOpacity
            style={[styles.languageButton, language === 'en' && styles.languageButtonActive]}
            onPress={() => handleLanguageChange('en')}
          >
            <Text style={[styles.languageButtonText, language === 'en' && styles.languageButtonTextActive]}>
              🇬🇧 English
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.languageButton, language === 'sw' && styles.languageButtonActive]}
            onPress={() => handleLanguageChange('sw')}
          >
            <Text style={[styles.languageButtonText, language === 'sw' && styles.languageButtonTextActive]}>
              🇰🇪 Kiswahili
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Elimu AI v1.0.0</Text>
        <Text style={styles.footerSubtext}>Making learning accessible for everyone</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  mainHeader: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: colors.text,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  fontSizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  fontButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  fontButtonActive: {
    backgroundColor: colors.accent + '20',
    borderColor: colors.primary,
  },
  fontButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  fontButtonTextActive: {
    color: colors.primary,
  },
  fontButtonLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  voiceList: {
    marginTop: 8,
  },
  voiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  voiceItemActive: {
    backgroundColor: colors.accent + '15',
    borderColor: colors.primary,
  },
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  voiceNameActive: {
    color: colors.primary,
  },
  voiceLanguage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  noVoicesText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 12,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  languageButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: colors.accent + '20',
    borderColor: colors.primary,
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  languageButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
