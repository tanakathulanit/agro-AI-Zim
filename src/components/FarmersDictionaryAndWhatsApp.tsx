import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Share2, 
  MessageSquare, 
  PhoneCall, 
  Users, 
  Sparkles, 
  ExternalLink, 
  Check, 
  Copy, 
  MapPin, 
  HelpCircle, 
  ArrowRight, 
  Compass, 
  Sprout, 
  Layers, 
  ShieldCheck, 
  FileText, 
  QrCode,
  Tag,
  Bookmark,
  Mic,
  MicOff,
  Volume2,
  AlertCircle,
  X,
  ChevronDown,
  Globe
} from 'lucide-react';
import { ZimbabweLocation } from '../data/zimbabweLocations';
import { 
  FARMERS_DICTIONARY_ENTRIES, 
  DictionaryEntry, 
  WHATSAPP_COMMUNITY_NETWORKS, 
  ADVISORY_TOPIC_OPTIONS,
  buildWhatsAppLink,
  buildWhatsAppUniversalShare,
  generateWhatsAppInquiryMessage,
  generateWhatsAppDailyDigest
} from '../data/farmersDictionaryData';
import { useLanguage } from '../context/LanguageContext';

export interface VoiceLanguageOption {
  code: string;
  shortLabel: string;
  label: string;
  nativeLabel: string;
  flag: string;
  langKey: 'en' | 'sn' | 'nd';
  hint: string;
  sampleTerms: string[];
}

export const VOICE_LANGUAGES: VoiceLanguageOption[] = [
  {
    code: 'en-ZW',
    shortLabel: 'EN',
    label: 'English (Zimbabwe)',
    nativeLabel: 'English',
    flag: '🇿🇼',
    langKey: 'en',
    hint: 'Speak any agro term (e.g. "Pfumvudza", "Compound D", "Armyworm")',
    sampleTerms: ['Pfumvudza', 'Compound D', 'Armyworm', 'Ammonium Nitrate', 'Basin']
  },
  {
    code: 'sn-ZW',
    shortLabel: 'SN',
    label: 'ChiShona (Zimbabwe)',
    nativeLabel: 'ChiShona',
    flag: '🇿🇼',
    langKey: 'sn',
    hint: 'Taura zita rechirongwa kana chirwere (se: "Nhokwe", "Manyowa", "Mhungu")',
    sampleTerms: ['Pfumvudza', 'Nhokwe', 'Manyowa', 'Mhungu', 'Gwatakwata', 'Chibage']
  },
  {
    code: 'nd-ZW',
    shortLabel: 'ND',
    label: 'isiNdebele (Zimbabwe)',
    nativeLabel: 'isiNdebele',
    flag: '🇿🇼',
    langKey: 'nd',
    hint: 'Khuluma ibizo lezithelo kumbe izilwanyana (njenge: "Intwasa", "Umumbu", "Dhibhi")',
    sampleTerms: ['Intwasa', 'Umumbu', 'Dhibhi', 'Umquba', 'Izilwanyana', 'Umuthi']
  }
];

interface FarmersDictionaryAndWhatsAppProps {
  currentLocation: ZimbabweLocation;
  onOpenWhatsAppModal: (topic?: string, query?: string) => void;
}

export const FarmersDictionaryAndWhatsApp: React.FC<FarmersDictionaryAndWhatsAppProps> = ({
  currentLocation,
  onOpenWhatsAppModal
}) => {
  const { language, t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'dictionary' | 'whatsapp_hub'>('dictionary');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Web Speech API Voice Search States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceLanguage, setVoiceLanguage] = useState<VoiceLanguageOption>(() => {
    if (language === 'sn') return VOICE_LANGUAGES[1];
    if (language === 'nd') return VOICE_LANGUAGES[2];
    return VOICE_LANGUAGES[0];
  });
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showVoiceLanguageMenu, setShowVoiceLanguageMenu] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);

  // Sync voice language when global language changes
  useEffect(() => {
    if (language === 'sn') setVoiceLanguage(VOICE_LANGUAGES[1]);
    else if (language === 'nd') setVoiceLanguage(VOICE_LANGUAGES[2]);
    else setVoiceLanguage(VOICE_LANGUAGES[0]);
  }, [language]);

  // Check speech recognition support once mounted
  useEffect(() => {
    const hasSupport = typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setSpeechSupported(hasSupport);

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup abort
        }
      }
    };
  }, []);

  const handleToggleVoiceSearch = (targetLang?: VoiceLanguageOption) => {
    const activeLang = targetLang || voiceLanguage;
    if (targetLang) {
      setVoiceLanguage(targetLang);
      setShowVoiceLanguageMenu(false);
    }

    setVoiceError(null);
    setInterimTranscript('');

    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setVoiceError(
        'Voice search is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari, or type your query in the box.'
      );
      return;
    }

    // If currently listening, stop it
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      recognition.lang = activeLang.code;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalStr += item[0].transcript;
          } else {
            interimStr += item[0].transcript;
          }
        }

        if (interimStr) {
          setInterimTranscript(interimStr);
        }

        if (finalStr) {
          const cleaned = finalStr.trim().replace(/[.,!?]+$/, '');
          setSearchQuery(cleaned);
          setInterimTranscript('');
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceError('Microphone permission denied. Please allow microphone access in your browser to speak terms.');
        } else if (event.error === 'no-speech') {
          setVoiceError('No speech detected. Please tap the microphone and speak clearly.');
        } else if (event.error === 'language-not-supported') {
          // If regional code is not supported, attempt fallback to generic language code
          setVoiceError(`Voice language "${activeLang.nativeLabel}" tag not supported on this device. Switching to English...`);
          setVoiceLanguage(VOICE_LANGUAGES[0]);
        } else {
          setVoiceError(`Voice search issue: ${event.error}. Please try again.`);
        }
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setVoiceError('Could not start microphone voice search. Please check your browser audio permissions.');
      setIsListening(false);
    }
  };

  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  // Term categories
  const categories = [
    { id: 'all', label: 'All Terms', count: FARMERS_DICTIONARY_ENTRIES.length },
    { id: 'Pfumvudza', label: 'Pfumvudza / Intwasa' },
    { id: 'Soil & Water', label: 'Soil & Water' },
    { id: 'Crops & Grains', label: 'Crops & Grains' },
    { id: 'Livestock & Health', label: 'Livestock & Health' },
    { id: 'Fertilizers & Chemicals', label: 'Fertilizers & Chemicals' },
    { id: 'Markets & Economics', label: 'Markets & Economics' }
  ];

  // Filter dictionary entries
  const filteredEntries = useMemo(() => {
    return FARMERS_DICTIONARY_ENTRIES.filter((entry) => {
      // Category filter
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) {
        return false;
      }

      // Region filter
      if (selectedRegionFilter !== 'all') {
        const matchesRegion = entry.applicableRegions.some(
          r => r.toLowerCase().includes(selectedRegionFilter.toLowerCase())
        );
        if (!matchesRegion) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTerm = entry.term.toLowerCase().includes(q);
        const matchesShona = entry.shona.toLowerCase().includes(q);
        const matchesNdebele = entry.ndebele.toLowerCase().includes(q);
        const matchesDef = entry.definitionEn.toLowerCase().includes(q) ||
          entry.definitionSn.toLowerCase().includes(q) ||
          entry.definitionNd.toLowerCase().includes(q);
        const matchesAgritex = entry.agritexRecommendation.toLowerCase().includes(q);
        const matchesTags = entry.tags.some(t => t.toLowerCase().includes(q));

        return matchesTerm || matchesShona || matchesNdebele || matchesDef || matchesAgritex || matchesTags;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedRegionFilter]);

  const handleShareTermToWhatsApp = (entry: DictionaryEntry) => {
    const text = `📖 *FARMERS DICTIONARY ZW • AGRONOMIC ENTRY*
━━━━━━━━━━━━━━━━━━━━━
🌱 *Term:* ${entry.term}
🇿🇼 *ChiShona:* ${entry.shona}
🇿🇼 *SiNdebele:* ${entry.ndebele}
📌 *Category:* ${entry.category} | *Regions:* ${entry.applicableRegions.join(', ')}

📝 *Definition:*
${entry.definitionEn}

💡 *Agronomic Guidance:*
${entry.agritexRecommendation}

━━━━━━━━━━━━━━━━━━━━━
_Shared from Farmers Dictionary Zw App_`;

    const shareUrl = buildWhatsAppUniversalShare(text);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyTerm = (entry: DictionaryEntry) => {
    const text = `Farmers Dictionary Zw: ${entry.term} (${entry.shona} / ${entry.ndebele}) - ${entry.definitionEn} | Agritex Recommendation: ${entry.agritexRecommendation}`;
    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAskAboutTerm = (entry: DictionaryEntry) => {
    onOpenWhatsAppModal(
      `Clarification on ${entry.term}`,
      `Mhoroi / Salibonani! I am reading the Farmers Dictionary Zw entry for "${entry.term}" (${entry.shona}). How does this specifically apply to my fields in ${currentLocation.name} (Region ${currentLocation.naturalRegion})?`
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Zimbabwe Styling */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/40">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-6 top-6 hidden lg:block opacity-15 text-8xl pointer-events-none select-none">
          📖
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Official System Directory</span>
            </span>

            <span className="bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
              <span>Connected to WhatsApp</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Farmers Dictionary Zw
          </h2>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            The national Zimbabwean agro-dictionary, bridging indigenous farming knowledge (<span className="text-white font-semibold italic">Duramazwi reVarimi</span> / <span className="text-white font-semibold italic">Isichazamazwi Sabalimi</span>) with verified Agritex scientific standards, Pfumvudza precision dosing, and <strong>direct 1-tap WhatsApp connectivity</strong> for smallholder farmers across Natural Regions I to V.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenWhatsAppModal()}
              className="px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] active:bg-[#1DA851] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect to WhatsApp Now</span>
            </button>

            <button
              onClick={() => setActiveSubTab(activeSubTab === 'dictionary' ? 'whatsapp_hub' : 'dictionary')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl backdrop-blur-xs transition flex items-center gap-2 border border-white/20"
            >
              {activeSubTab === 'dictionary' ? (
                <>
                  <Users className="w-4 h-4 text-emerald-300" />
                  <span>View WhatsApp Community Hub</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 text-emerald-300" />
                  <span>Browse Agro-Dictionary</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Buttons */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('dictionary')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
            activeSubTab === 'dictionary'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Agricultural Dictionary ({FARMERS_DICTIONARY_ENTRIES.length} Terms)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('whatsapp_hub')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
            activeSubTab === 'whatsapp_hub'
              ? 'bg-[#25D366] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#25D366] group-hover:text-white" />
          <span>WhatsApp Hub & Farmer Communities</span>
        </button>
      </div>

      {/* SUB-VIEW 1: AGRICULTURAL DICTIONARY */}
      {activeSubTab === 'dictionary' && (
        <div className="space-y-6">
          {/* Search Bar & Filters */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input with Integrated Web Speech API Voice Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search in English, ChiShona, SiNdebele (e.g., Pfumvudza, Nhokwe, Mhungu, Compound D)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl pl-10 pr-24 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition shadow-inner"
                />

                {/* Right Input Action Cluster: Clear + Voice Language + Mic Icon */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Voice Language Selector Pill & Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowVoiceLanguageMenu(!showVoiceLanguageMenu)}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 flex items-center gap-1 transition shadow-2xs"
                      title={`Spoken Language: ${voiceLanguage.nativeLabel} (Click to change)`}
                    >
                      <span>{voiceLanguage.flag}</span>
                      <span className="font-extrabold">{voiceLanguage.shortLabel}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {showVoiceLanguageMenu && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-2 space-y-1">
                        <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                          Select Voice Language
                        </div>
                        {VOICE_LANGUAGES.map((vLang) => (
                          <button
                            key={vLang.code}
                            type="button"
                            onClick={() => {
                              handleToggleVoiceSearch(vLang);
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                              voiceLanguage.code === vLang.code
                                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{vLang.flag}</span>
                              <div>
                                <span className="block font-black">{vLang.nativeLabel}</span>
                                <span className="block text-[10px] text-slate-500 font-normal">{vLang.label}</span>
                              </div>
                            </div>
                            {voiceLanguage.code === vLang.code && (
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Web Speech API Voice Search Microphone Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleVoiceSearch()}
                    className={`relative p-2 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-xs ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-400/40 shadow-rose-200'
                        : 'bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white'
                    }`}
                    title={
                      isListening
                        ? `Listening in ${voiceLanguage.nativeLabel}... Click to stop`
                        : `Voice Search in ${voiceLanguage.nativeLabel} (Speak English, Shona, or Ndebele)`
                    }
                    aria-label="Voice Search"
                  >
                    {isListening ? (
                      <Mic className="w-4 h-4 animate-bounce" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}

                    {/* Active recording indicator ping */}
                    {isListening && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Natural Region Quick Filter */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-600 shrink-0 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Region:</span>
                </span>
                <select
                  value={selectedRegionFilter}
                  onChange={(e) => setSelectedRegionFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">All Regions (I - V)</option>
                  <option value="I">Region I (Highlands)</option>
                  <option value="IIa">Region IIa (Intensive)</option>
                  <option value="IIb">Region IIb (Sub-intensive)</option>
                  <option value="III">Region III (Semi-intensive)</option>
                  <option value="IV">Region IV (Semi-arid)</option>
                  <option value="V">Region V (Arid / Lowveld)</option>
                </select>
              </div>
            </div>

            {/* Active Voice Search Listening Tray */}
            {isListening && (
              <div className="bg-gradient-to-r from-rose-50 via-amber-50/50 to-emerald-50 border-2 border-rose-400/60 rounded-2xl p-4 shadow-md space-y-3 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                    </span>
                    <span className="text-xs font-black text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Listening in {voiceLanguage.nativeLabel}</span>
                      <span className="text-slate-400 font-normal">({voiceLanguage.label})</span>
                    </span>

                    {/* Animated Soundwave Equalizer */}
                    <div className="flex items-center gap-1 pl-2">
                      <span className="w-1 h-3 bg-rose-500 rounded-full animate-pulse [animation-delay:-0.4s]"></span>
                      <span className="w-1 h-4 bg-rose-600 rounded-full animate-pulse [animation-delay:-0.2s]"></span>
                      <span className="w-1 h-5 bg-rose-500 rounded-full animate-pulse [animation-delay:-0.1s]"></span>
                      <span className="w-1 h-3.5 bg-rose-600 rounded-full animate-pulse"></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={stopVoiceSearch}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Stop Listening</span>
                    </button>
                  </div>
                </div>

                {/* Spoken Live Transcript or Prompt */}
                <div className="bg-white/90 backdrop-blur-xs rounded-xl p-3 border border-rose-200/80 shadow-inner">
                  {interimTranscript ? (
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-rose-600 shrink-0 animate-pulse" />
                      <p className="text-sm font-black text-rose-950 italic">
                        "{interimTranscript}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 font-medium flex items-center gap-2">
                      <Mic className="w-3.5 h-3.5 text-rose-500 shrink-0 animate-bounce" />
                      <span>{voiceLanguage.hint}</span>
                    </p>
                  )}
                </div>

                {/* Quick Switch Voice Language & Sample Term Prompts */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-rose-200/60 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-500">Switch voice dialect:</span>
                    {VOICE_LANGUAGES.map((vLang) => (
                      <button
                        key={vLang.code}
                        type="button"
                        onClick={() => handleToggleVoiceSearch(vLang)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                          voiceLanguage.code === vLang.code
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <span>{vLang.flag}</span>
                        <span>{vLang.nativeLabel}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Quick terms:</span>
                    {voiceLanguage.sampleTerms.slice(0, 3).map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setSearchQuery(term);
                          stopVoiceSearch();
                        }}
                        className="px-2 py-0.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-lg text-[10px] font-bold transition"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Voice Error Banner */}
            {voiceError && (
              <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl p-3 text-xs flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-medium">{voiceError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setVoiceError(null)}
                  className="text-amber-700 hover:text-amber-900 font-bold px-2 py-1 hover:bg-amber-100 rounded-lg transition shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong>{filteredEntries.length}</strong> agricultural terms 
              {selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}
              {selectedRegionFilter !== 'all' ? ` for Region ${selectedRegionFilter}` : ''}
            </span>

            <span className="text-emerald-800 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Every term includes 1-tap WhatsApp sharing</span>
            </span>
          </div>

          {/* Dictionary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-300 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                      {entry.category}
                    </span>

                    <div className="flex items-center gap-1">
                      {entry.applicableRegions.map((reg) => (
                        <span
                          key={reg}
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          R-{reg}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Term Title & Vernacular Translations */}
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-800 transition">
                      {entry.term}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <span className="font-bold text-amber-700">ChiShona:</span> {entry.shona}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center gap-1 font-medium">
                        <span className="font-bold text-blue-700">SiNdebele:</span> {entry.ndebele}
                      </span>
                    </div>
                  </div>

                  {/* Plain Language Definition */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {language === 'sn' ? entry.definitionSn : language === 'nd' ? entry.definitionNd : entry.definitionEn}
                  </p>

                  {/* Agritex Field Recommendation Box */}
                  <div className="bg-emerald-50/70 border-l-4 border-emerald-600 rounded-r-2xl p-3 text-xs text-emerald-950 space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Agritex Field Protocol:</span>
                    </div>
                    <p className="text-slate-700 leading-normal">
                      {entry.agritexRecommendation}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer with WhatsApp Integration */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Share to WhatsApp */}
                    <button
                      onClick={() => handleShareTermToWhatsApp(entry)}
                      className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
                      title="Share this dictionary term directly to WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share to WhatsApp</span>
                    </button>

                    {/* Ask on WhatsApp */}
                    <button
                      onClick={() => handleAskAboutTerm(entry)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-xl transition flex items-center gap-1"
                      title="Ask Agritex extension officer on WhatsApp about this term"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Ask Officer</span>
                    </button>
                  </div>

                  {/* Copy Text */}
                  <button
                    onClick={() => handleCopyTerm(entry)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition"
                    title="Copy definition"
                  >
                    {copiedId === entry.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <div className="text-4xl">🌾</div>
              <h3 className="font-bold text-base text-slate-800">
                No dictionary terms match your search
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try searching in English, ChiShona, or SiNdebele, or clear the category and region filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedRegionFilter('all');
                }}
                className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: WHATSAPP HUB & FARMER COMMUNITIES */}
      {activeSubTab === 'whatsapp_hub' && (
        <div className="space-y-6">
          {/* Quick Advisory Connection Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center text-2xl shadow-md">
                  💬
                </div>
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                    WhatsApp Advisory & Field Inquiries
                  </h3>
                  <p className="text-xs text-slate-500">
                    Structured agronomic messaging for smallholder farmers across all 10 provinces of Zimbabwe
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onOpenWhatsAppModal()}
                  className="px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Compose Inquiry</span>
                </button>

                <button
                  onClick={() => {
                    const digest = generateWhatsAppDailyDigest({
                      name: currentLocation.name,
                      naturalRegion: currentLocation.naturalRegion,
                      province: currentLocation.province
                    });
                    const url = buildWhatsAppUniversalShare(digest);
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Share today's field digest to your WhatsApp status or group"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Daily Digest</span>
                </button>
              </div>
            </div>

            {/* Advisory Topic Quick Dispatch Tiles */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Quick Advisory Inquiry Templates (Tap to Launch):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {ADVISORY_TOPIC_OPTIONS.slice(0, 6).map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => onOpenWhatsAppModal(topic.title, `Mhoroi! I need advisory regarding ${topic.title.toLowerCase()} in ${currentLocation.name} (Region ${currentLocation.naturalRegion}): ${topic.prompt}.`)}
                    className="bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 space-y-1.5 transition cursor-pointer group"
                  >
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {topic.category}
                    </span>
                    <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-900 transition">
                      {topic.title}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {topic.prompt}
                    </p>
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-[#25D366] group-hover:text-[#1EBE5D] pt-1">
                      <span>Launch Inquiry</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regional Agro-Climatic Advisory Networks */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <span>Regional Agro-Climatic Advisory Networks</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Broadcast agronomic guidelines, rainfall thresholds, and Pfumvudza benchmarks directly to your local WhatsApp groups and cooperatives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WHATSAPP_COMMUNITY_NETWORKS.map((network) => (
                <div
                  key={network.id}
                  className="border border-slate-200 rounded-2xl p-4 hover:border-emerald-300 hover:bg-emerald-50/10 transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{network.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {network.memberCount}
                      </span>
                    </div>

                    <div className="text-xs text-emerald-800 font-semibold">{network.region}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{network.description}</p>
                    <div className="text-[11px] text-slate-500 font-medium pt-1">
                      🌱 Focus: {network.focus}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-700 font-mono whitespace-pre-wrap border border-slate-100">
                    {network.sampleBroadcast}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        const url = buildWhatsAppUniversalShare(network.sampleBroadcast);
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                      className="flex-1 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Bulletin to WhatsApp</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(network.sampleBroadcast);
                        setCopiedId(network.id);
                        setTimeout(() => setCopiedId(null), 2500);
                      }}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                      title="Copy bulletin text"
                    >
                      {copiedId === network.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
