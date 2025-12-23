import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { useTheme } from '../src/contexts/ThemeContext';
import { useFontSize } from '../src/contexts/FontSizeContext';
import { useLanguage } from '../src/contexts/LanguageContext';

export default function SettingsScreen() {
  const { themeMode, setThemeMode, colors } = useTheme();
  const { fontSize, setFontSize, getScaledSize } = useFontSize();
  const { language, setLanguage, t } = useLanguage();
  
  const [ttsVoice, setTtsVoice] = useState<string>('default');
  const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    loadVoices();
  }, []);

  const loadSettings = async () => {
    try {
      const savedVoice = await AsyncStorage.getItem('@app_ttsVoice');
      if (savedVoice) setTtsVoice(savedVoice);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadVoices = async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      
      // Filter for quality English and Swahili voices only
      const filteredVoices = voices.filter(voice => {
        const lang = voice.language.toLowerCase();
        const name = voice.name.toLowerCase();
        
        // iOS: Prefer Samantha and other quality en-US voices
        if (Platform.OS === 'ios') {
          return (
            (lang.startsWith('en') && (
              name.includes('samantha') ||
              name.includes('ava') ||
              name.includes('nicky') ||
              name.includes('susan')
            )) ||
            lang.startsWith('sw')
          );
        }
        
        // Android: Only en-US or sw voices
        return lang.startsWith('en-us') || lang.startsWith('sw');
      });

      // Sort to put Samantha first on iOS, or just keep first few quality voices
      const sortedVoices = filteredVoices.sort((a, b) => {
        if (Platform.OS === 'ios' && a.name.toLowerCase().includes('samantha')) return -1;
        if (Platform.OS === 'ios' && b.name.toLowerCase().includes('samantha')) return 1;
        return 0;
      });

      // Limit to top 5 voices
      setAvailableVoices(sortedVoices.slice(0, 5));
    } catch (error) {
      console.error('Failed to load voices:', error);
    }
  };

  const handleThemeChange = async (value: boolean) => {
    const newTheme = value ? 'dark' : 'light';
    await setThemeMode(newTheme);
  };

  const handleFontSizeChange = async (size: 'small' | 'medium' | 'large') => {
    await setFontSize(size);
  };

  const handleLanguageChange = async (lang: 'en' | 'sw') => {
    await setLanguage(lang);
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
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary, fontSize: getScaledSize(16) }]}>
          {t('settings.loading')}
        </Text>
      </View>
    );
  }

  const isDarkMode = themeMode === 'dark';

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      <Text style={[styles.mainHeader, { color: colors.text, fontSize: getScaledSize(32) }]}>
        {t('settings.title')}
      </Text>

      {/* Appearance Section */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionHeader, { color: colors.primary, fontSize: getScaledSize(18) }]}>
          {t('settings.appearance')}
        </Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text, fontSize: getScaledSize(16) }]}>
              {t('settings.darkMode')}
            </Text>
            <Text style={[styles.settingDescription, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
              {t('settings.darkModeDesc')}
            </Text>
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
            <Text style={[styles.settingLabel, { color: colors.text, fontSize: getScaledSize(16) }]}>
              {t('settings.fontSize')}
            </Text>
            <Text style={[styles.settingDescription, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
              {t('settings.fontSizeDesc')}
            </Text>
          </View>
        </View>
        <View style={styles.fontSizeButtons}>
          <TouchableOpacity 
            style={[
              styles.fontButton,
              { backgroundColor: fontSize === 'small' ? colors.accent + '20' : colors.surface },
              fontSize === 'small' && { borderColor: colors.primary }
            ]}
            onPress={() => handleFontSizeChange('small')}
          >
            <Text style={[
              styles.fontButtonText,
              { color: fontSize === 'small' ? colors.primary : colors.textSecondary, fontSize: 24 }
            ]}>
              A-
            </Text>
            <Text style={[styles.fontButtonLabel, { color: colors.textSecondary, fontSize: 12 }]}>
              {t('settings.small')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.fontButton,
              { backgroundColor: fontSize === 'medium' ? colors.accent + '20' : colors.surface },
              fontSize === 'medium' && { borderColor: colors.primary }
            ]}
            onPress={() => handleFontSizeChange('medium')}
          >
            <Text style={[
              styles.fontButtonText,
              { color: fontSize === 'medium' ? colors.primary : colors.textSecondary, fontSize: 24 }
            ]}>
              A
            </Text>
            <Text style={[styles.fontButtonLabel, { color: colors.textSecondary, fontSize: 12 }]}>
              {t('settings.medium')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.fontButton,
              { backgroundColor: fontSize === 'large' ? colors.accent + '20' : colors.surface },
              fontSize === 'large' && { borderColor: colors.primary }
            ]}
            onPress={() => handleFontSizeChange('large')}
          >
            <Text style={[
              styles.fontButtonText,
              { color: fontSize === 'large' ? colors.primary : colors.textSecondary, fontSize: 24 }
            ]}>
              A+
            </Text>
            <Text style={[styles.fontButtonLabel, { color: colors.textSecondary, fontSize: 12 }]}>
              {t('settings.large')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Audio Section */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionHeader, { color: colors.primary, fontSize: getScaledSize(18) }]}>
          {t('settings.audio')}
        </Text>
        
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: colors.text, fontSize: getScaledSize(16) }]}>
            {t('settings.ttsVoice')}
          </Text>
        </View>
        
        {availableVoices.length > 0 ? (
          <View style={styles.voiceList}>
            {availableVoices.map((voice) => (
              <TouchableOpacity
                key={voice.identifier}
                style={[
                  styles.voiceItem,
                  { backgroundColor: ttsVoice === voice.identifier ? colors.accent + '15' : colors.surface },
                  ttsVoice === voice.identifier && { borderColor: colors.primary }
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
                    { color: ttsVoice === voice.identifier ? colors.primary : colors.text, fontSize: getScaledSize(16) }
                  ]}>
                    {voice.name}
                  </Text>
                  <Text style={[styles.voiceLanguage, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
                    {voice.language}
                  </Text>
                </View>
                {ttsVoice === voice.identifier && (
                  <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={[styles.noVoicesText, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
            {t('settings.noVoices')}
          </Text>
        )}
      </View>

      {/* Language Section */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionHeader, { color: colors.primary, fontSize: getScaledSize(18) }]}>
          {t('settings.language')}
        </Text>
        
        <View style={styles.languageButtons}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              { backgroundColor: language === 'en' ? colors.accent + '20' : colors.surface },
              language === 'en' && { borderColor: colors.primary }
            ]}
            onPress={() => handleLanguageChange('en')}
          >
            <Text style={[
              styles.languageButtonText,
              { color: language === 'en' ? colors.primary : colors.textSecondary, fontSize: getScaledSize(16) }
            ]}>
              🇬🇧 {t('settings.english')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.languageButton,
              { backgroundColor: language === 'sw' ? colors.accent + '20' : colors.surface },
              language === 'sw' && { borderColor: colors.primary }
            ]}
            onPress={() => handleLanguageChange('sw')}
          >
            <Text style={[
              styles.languageButtonText,
              { color: language === 'sw' ? colors.primary : colors.textSecondary, fontSize: getScaledSize(16) }
            ]}>
              🇰🇪 {t('settings.swahili')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.text, fontSize: getScaledSize(16) }]}>
          {t('settings.appInfo')}
        </Text>
        <Text style={[styles.footerSubtext, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
          {t('settings.tagline')}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontWeight: '500',
  },
  mainHeader: {
    fontWeight: 'bold',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontWeight: '600',
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
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {},
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
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  fontButtonActive: {},
  fontButtonText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fontButtonTextActive: {},
  fontButtonLabel: {},
  voiceList: {
    marginTop: 8,
  },
  voiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  voiceItemActive: {},
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontWeight: '500',
  },
  voiceNameActive: {},
  voiceLanguage: {
    marginTop: 2,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noVoicesText: {
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
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  languageButtonActive: {},
  languageButtonText: {
    fontWeight: '500',
  },
  languageButtonTextActive: {
    fontWeight: '600',
  },
  footer: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontWeight: '600',
    marginBottom: 4,
  },
  footerSubtext: {
    textAlign: 'center',
  },
});
