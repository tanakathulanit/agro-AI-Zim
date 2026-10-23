import React, { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown, Check, Globe } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { Language, SUPPORTED_LANGUAGES } from '../i18n/translations';

interface LanguageSwitcherProps {
  variant?: 'header' | 'compact' | 'segmented';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'header',
  className = '' 
}) => {
  const { language, setLanguage, currentLanguageOption } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Segmented 3-button toggle variant (quick 1-click on header)
  return (
    <div className={`relative flex items-center ${className}`} ref={dropdownRef}>
      {/* Quick Toggle Buttons for Fast 1-Tap Switching */}
      <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/90 shadow-2xs">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-150 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-xs scale-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title={`${lang.name} (${lang.nativeName}) - ${lang.regionHint}`}
              aria-pressed={isActive}
            >
              <span className="text-xs">{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </button>
          );
        })}
      </div>

      {/* Dropdown Menu Trigger for Mobile Screens or Compact View */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition shadow-2xs"
          aria-haspopup="true"
          aria-expanded={isOpen}
          title="Change Language / Chinja Mutauro / Guqula Ulimi"
        >
          <Languages className="w-3.5 h-3.5 text-emerald-700" />
          <span className="font-bold">{currentLanguageOption.nativeName}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-1">
            <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3 text-emerald-600" />
              <span>Select Language / Mutauro / Ulimi</span>
            </div>

            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full px-3 py-2 text-left text-xs transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50/80 text-emerald-950 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{lang.nativeName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({lang.name})</span>
                      </div>
                      <div className="text-[10px] text-slate-500">{lang.regionHint}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
