import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FontSize = 'small' | 'medium' | 'large';

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => Promise<void>;
  getFontMultiplier: () => number;
  getScaledSize: (baseSize: number) => number;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider = ({ children }: { children: ReactNode }) => {
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFontSize();
  }, []);

  const loadFontSize = async () => {
    try {
      const savedFontSize = await AsyncStorage.getItem('@app_fontSize');
      if (savedFontSize) {
        setFontSizeState(savedFontSize as FontSize);
      }
    } catch (error) {
      console.error('Failed to load font size:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setFontSize = async (size: FontSize) => {
    try {
      await AsyncStorage.setItem('@app_fontSize', size);
      setFontSizeState(size);
    } catch (error) {
      console.error('Failed to save font size:', error);
    }
  };

  const getFontMultiplier = () => {
    switch (fontSize) {
      case 'small':
        return 0.85;
      case 'large':
        return 1.15;
      default:
        return 1.0;
    }
  };

  const getScaledSize = (baseSize: number) => {
    return baseSize * getFontMultiplier();
  };

  if (isLoading) {
    return null;
  }

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize, getFontMultiplier, getScaledSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within FontSizeProvider');
  }
  return context;
};
