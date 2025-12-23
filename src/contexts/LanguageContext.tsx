import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'sw';

interface Translations {
  [key: string]: {
    en: string;
    sw: string;
  };
}

const translations: Translations = {
  // Home Screen
  'home.greeting': { en: 'Karibu! 👋', sw: 'Karibu! 👋' },
  'home.subtitle': { en: 'Welcome to Elimu AI', sw: 'Karibu Elimu AI' },
  'home.tip': { en: 'Today\'s Tip', sw: 'Kidokezo cha Leo' },
  'home.quickActions': { en: 'Quick Actions', sw: 'Vitendo vya Haraka' },
  'home.uploadDocument': { en: 'Upload Document', sw: 'Pakia Hati' },
  'home.viewSettings': { en: 'View Settings', sw: 'Angalia Mipangilio' },
  'home.quickStart': { en: 'Quick Start', sw: 'Anza Haraka' },
  'home.recentDocuments': { en: 'Recent Documents', sw: 'Hati za Hivi Karibuni' },
  'home.noRecentDocs': { en: 'No recent documents', sw: 'Hakuna hati za hivi karibuni' },

  // Upload Screen
  'upload.title': { en: 'Upload Document', sw: 'Pakia Hati' },
  'upload.selectFile': { en: 'Tap to Select File', sw: 'Gusa Kuchagua Faili' },
  'upload.supportedFormats': { en: 'PDF, Images, Text files', sw: 'PDF, Picha, Faili za maandishi' },
  'upload.quickStart': { en: 'Quick Start', sw: 'Anza Haraka' },
  'upload.history': { en: 'Upload History', sw: 'Historia ya Kupakia' },
  'upload.noHistory': { en: 'No upload history yet', sw: 'Hakuna historia ya kupakia bado' },

  // Settings Screen
  'settings.title': { en: 'Settings', sw: 'Mipangilio' },
  'settings.appearance': { en: 'Appearance', sw: 'Muonekano' },
  'settings.darkMode': { en: 'Dark Mode', sw: 'Hali ya Giza' },
  'settings.darkModeDesc': { en: 'Enable dark theme', sw: 'Washa mandhari ya giza' },
  'settings.fontSize': { en: 'Font Size', sw: 'Ukubwa wa Herufi' },
  'settings.fontSizeDesc': { en: 'Adjust reading text size', sw: 'Rekebisha ukubwa wa maandishi' },
  'settings.small': { en: 'Small', sw: 'Ndogo' },
  'settings.medium': { en: 'Medium', sw: 'Kati' },
  'settings.large': { en: 'Large', sw: 'Kubwa' },
  'settings.audio': { en: 'Audio Settings', sw: 'Mipangilio ya Sauti' },
  'settings.ttsVoice': { en: 'Text-to-Speech Voice', sw: 'Sauti ya Kusoma' },
  'settings.noVoices': { en: 'No voices available', sw: 'Hakuna sauti zinazopatikana' },
  'settings.language': { en: 'Language', sw: 'Lugha' },
  'settings.english': { en: 'English', sw: 'Kiingereza' },
  'settings.swahili': { en: 'Kiswahili', sw: 'Kiswahili' },
  'settings.appInfo': { en: 'Elimu AI v1.0.0', sw: 'Elimu AI v1.0.0' },
  'settings.tagline': { en: 'Making learning accessible for everyone', sw: 'Kufanya elimu ipatikane kwa wote' },
  'settings.loading': { en: 'Loading settings...', sw: 'Inapakia mipangilio...' },

  // Results Screen
  'results.title': { en: 'Results', sw: 'Matokeo' },
  'results.text': { en: 'Text', sw: 'Maandishi' },
  'results.audio': { en: 'Audio', sw: 'Sauti' },
  'results.visuals': { en: 'Visuals', sw: 'Picha' },
  'results.study': { en: 'Study', sw: 'Soma' },
  'results.copy': { en: 'Copy', sw: 'Nakili' },
  'results.save': { en: 'Save', sw: 'Hifadhi' },
  'results.share': { en: 'Share', sw: 'Shiriki' },
  'results.backHome': { en: 'Back to Home', sw: 'Rudi Nyumbani' },
  'results.copied': { en: '✅ Copied!', sw: '✅ Imenakiliwa!' },
  'results.copiedMessage': { en: 'Text copied to clipboard', sw: 'Maandishi yamenakiliwa' },

  // Processing
  'processing.title': { en: 'Processing Document', sw: 'Inachakata Hati' },
  'processing.extract': { en: 'Extracting text', sw: 'Inachukua maandishi' },
  'processing.simplify': { en: 'Simplifying content', sw: 'Inarahisisha maudhui' },
  'processing.audio': { en: 'Creating audio', sw: 'Inaunda sauti' },
  'processing.visuals': { en: 'Generating visuals', sw: 'Inazalisha picha' },

  // Common
  'common.loading': { en: 'Loading...', sw: 'Inapakia...' },
  'common.error': { en: 'Error', sw: 'Kosa' },
  'common.success': { en: 'Success', sw: 'Imefanikiwa' },
  'common.cancel': { en: 'Cancel', sw: 'Ghairi' },
  'common.ok': { en: 'OK', sw: 'Sawa' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('@app_language');
      if (savedLanguage) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('@app_language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  if (isLoading) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
