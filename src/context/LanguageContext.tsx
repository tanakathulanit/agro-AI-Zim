import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, TRANSLATIONS, TranslationKey, SUPPORTED_LANGUAGES, LanguageOption } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  isEnglish: boolean;
  isShona: boolean;
  isNdebele: boolean;
  currentLanguageOption: LanguageOption;
  supportedLanguages: LanguageOption[];
}

const STORAGE_KEY = 'farmers_app_language_preference';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as Language;
        if (stored === 'en' || stored === 'sn' || stored === 'nd') {
          return stored;
        }
      } catch {
        // Ignore storage errors
      }
    }
    return 'en';
  });

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
        document.documentElement.lang = newLang;
      } catch (err) {
        console.warn('Failed to persist language preference:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useCallback((key: TranslationKey, fallback?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && key in langDict) {
      return (langDict as any)[key];
    }
    const defaultDict = TRANSLATIONS.en;
    if (defaultDict && key in defaultDict) {
      return (defaultDict as any)[key];
    }
    return fallback || key;
  }, [language]);

  const currentLanguageOption = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isEnglish: language === 'en',
    isShona: language === 'sn',
    isNdebele: language === 'nd',
    currentLanguageOption,
    supportedLanguages: SUPPORTED_LANGUAGES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

export const useLanguage = useTranslation;
