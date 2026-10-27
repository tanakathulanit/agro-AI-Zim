import React, { useState } from 'react';
import {
  Sprout,
  ArrowRight,
  Phone,
  ShieldCheck,
  TrendingUp,
  Camera,
  BookOpen,
  MapPin,
  CheckCircle2,
  Menu,
  X,
  ExternalLink,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  AlertTriangle,
  Globe
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ZimbabweLiveFlag } from './ZimbabweLiveFlag';

interface PublicWebsiteProps {
  onLaunchApp: (targetTab?: string) => void;
  onOpenSignIn: () => void;
  onOpenUssd: () => void;
  onOpenTransparency: (doc: 'terms' | 'privacy' | 'ussd') => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  onLaunchApp,
  onOpenSignIn,
  onOpenUssd,
  onOpenTransparency
}) => {
  const { isShona, isNdebele } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Real, authentic photography assets from Unsplash CDN
  const IMAGES = {
    heroFarmland: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80',
    farmerInspecting: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80',
    fertileSoilBasins: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1000&q=80',
    marketplaceProduce: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=80',
    mobileInField: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
    goldenGrainHarvest: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1000&q=80'
  };

  const commodityTicker = [
    { label: 'GMB Grade A Maize', price: '$335 / Tonne', change: '+3.2%', note: 'Moisture < 12.5%' },
    { label: 'Mbare Musika Sugar Beans', price: '$105 / 50kg bag', change: '+1.5%', note: 'Grade 1 Red Speckled' },
    { label: 'Fresh Sandak Tomatoes', price: '$7.50 / wooden crate', change: '-2.0%', note: 'Mbare Market wholesale' },
    { label: 'Red Sorghum (Delta Maltings)', price: '$300 / Tonne', change: 'Steady', note: 'Contract buying rate' },
    { label: 'Shelled Groundnuts (Renmark)', price: '$120 / 50kg bag', change: '+4.0%', note: 'Bulawayo wholesale' }
  ];

  const naturalRegions = [
    {
      region: 'Region I',
      rainfall: '> 1,000 mm/yr',
      area: 'Eastern Highlands (Nyanga, Chipinge, Chimanimani)',
      crops: 'Tea, Coffee, Forestry, Seed Potatoes & Macadamia',
      color: 'border-sky-500 bg-sky-500/10 text-sky-300'
    },
    {
      region: 'Region IIa / IIb',
      rainfall: '750 - 1,000 mm/yr',
      area: 'Mashonaland Central & East (Mazowe, Goromonzi, Chinhoyi)',
      crops: 'Intensive Grain Belt: Hybrid White Maize, Tobacco, Soya Beans',
      color: 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
    },
    {
      region: 'Region III',
      rainfall: '650 - 800 mm/yr',
      area: 'Midlands & Manicaland (Kwekwe, Kadoma, Rusape)',
      crops: 'Semi-Intensive: Maize, Sunflower, Cotton, Soya Beans & Livestock',
      color: 'border-teal-500 bg-teal-500/10 text-teal-300'
    },
    {
      region: 'Region IV',
      rainfall: '450 - 650 mm/yr',
      area: 'Gokwe, Masvingo, Lupane, Mudzi, Binga',
      crops: 'Semi-Extensive: Drought-Tolerant Sorghum, Pearl Millet, Groundnuts',
      color: 'border-amber-500 bg-amber-500/10 text-amber-300'
    },
    {
      region: 'Region V',
      rainfall: '< 450 mm/yr',
      area: 'Lowveld (Chiredzi, Beitbridge, Mwenezi, Gwanda)',
      crops: 'Drought-Hardy Small Grains, Sugarcane (Irrigated), Extensive Cattle',
      color: 'border-rose-500 bg-rose-500/10 text-rose-300'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* ==================== 1. TOP PUBLIC NAVBAR ==================== */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-950/60 border border-emerald-400/30">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  Farmers Dictionary Zw
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hidden sm:inline">
                  National Network
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                {isShona
                  ? 'Ruzivo Rwokurima neKupfuya muZimbabwe'
                  : isNdebele
                  ? 'Ezolimo Lokufuya eZimbabwe'
                  : 'National Agro-Ecological Advisory & Precision Farming Network'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#solutions" className="hover:text-emerald-400 transition">Solutions</a>
            <a href="#pfumvudza" className="hover:text-emerald-400 transition">Pfumvudza Calculator</a>
            <a href="#ussd" className="hover:text-emerald-400 transition">2G USSD (*144#)</a>
            <a href="#markets" className="hover:text-emerald-400 transition">Market Benchmarks</a>
            <a href="#regions" className="hover:text-emerald-400 transition">Natural Regions</a>
            <button
              onClick={() => onOpenTransparency('terms')}
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Transparency
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <ZimbabweLiveFlag size="sm" showPulseBadge={true} className="hidden xl:inline-flex" />
            <LanguageSwitcher />

            <button
              onClick={onOpenSignIn}
              className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-xl bg-slate-900/80 transition cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={() => onLaunchApp()}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-950/40 border border-emerald-400/30 flex items-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Launch Advisory App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onLaunchApp()}
              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg"
            >
              Launch App
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs text-slate-400">Language:</span>
              <LanguageSwitcher />
            </div>
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 py-1"
            >
              Solutions
            </a>
            <a
              href="#pfumvudza"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 py-1"
            >
              Pfumvudza / Intwasa Calculator
            </a>
            <a
              href="#ussd"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 py-1"
            >
              2G USSD (*144#)
            </a>
            <a
              href="#markets"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 py-1"
            >
              Market Prices
            </a>
            <a
              href="#regions"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 py-1"
            >
              Natural Regions
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLaunchApp();
                }}
                className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <span>Launch Advisory App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignIn();
                }}
                className="w-full py-2 bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs rounded-xl"
              >
                Sign In to Portal
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ==================== 2. HERO SECTION ==================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Real Farmland Photography Background with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.heroFarmland}
            alt="Lush maize and agricultural fields in Zimbabwe"
            className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-[1.1]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50"></div>
          <div className="absolute inset-0 bg-radial from-emerald-950/30 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Serving Smallholders & Commercial Growers Across Natural Regions I–V</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Empowering Zimbabwean Smallholders with{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Precision Agronomy
            </span>{' '}
            & Real-Time Intelligence
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Bridging the agricultural divide through trilingual digital advisories, Pfumvudza conservation plot planning, AI crop pathology diagnostics, live open-market price discovery, and 2G USSD (*144#) accessibility.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onLaunchApp()}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm sm:text-base font-extrabold rounded-2xl shadow-xl shadow-emerald-950/60 border border-emerald-400/40 flex items-center justify-center gap-3 transition transform hover:scale-105 cursor-pointer"
            >
              <span>Open Advisory Portal (Web App)</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenUssd}
              className="w-full sm:w-auto px-7 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white text-sm sm:text-base font-bold rounded-2xl border border-slate-700/80 shadow-md backdrop-blur-md flex items-center justify-center gap-3 transition cursor-pointer"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Dial *144# USSD Preview</span>
            </button>
          </div>

          {/* Trust Metrics Bar */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl font-black text-emerald-400">60+</div>
              <div className="text-xs font-semibold text-slate-400">Farming Districts</div>
              <div className="text-[11px] text-slate-400">Goromonzi to Chiredzi</div>
            </div>
            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl font-black text-emerald-400">1,456</div>
              <div className="text-xs font-semibold text-slate-400">Basins per Plot</div>
              <div className="text-[11px] text-slate-400">Standard 0.0624 Ha Model</div>
            </div>
            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl font-black text-emerald-400">3</div>
              <div className="text-xs font-semibold text-slate-400">National Languages</div>
              <div className="text-[11px] text-slate-400">English, Shona & Ndebele</div>
            </div>
            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl font-black text-emerald-400">100%</div>
              <div className="text-xs font-semibold text-slate-400">Independent Advisory</div>
              <div className="text-[11px] text-slate-400">Open Public Transparency</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. LIVE COMMODITY TICKER STRIP ==================== */}
      <section id="markets" className="bg-slate-900 border-y border-slate-800 py-3.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Live Commodity Benchmarks
            </span>
          </div>

          <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-3 w-full">
            {commodityTicker.map((item, idx) => (
              <div
                key={idx}
                className="shrink-0 bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs"
              >
                <span className="text-slate-400 font-medium">{item.label}:</span>
                <span className="text-white font-extrabold">{item.price}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-mono">
                  {item.change}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onLaunchApp('market')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 shrink-0 flex items-center gap-1 transition"
          >
            <span>Full Market Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ==================== 4. INTERACTIVE FEATURE SHOWCASE WITH REAL PHOTOGRAPHY ==================== */}
      <section id="solutions" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400">
            Precision Agricultural Solutions
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Comprehensive Digital Infrastructure for Zimbabwean Agriculture
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Explore authentic, field-calibrated tools designed to mitigate climate risks, optimize fertilizer investments, and protect harvests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Pfumvudza / Intwasa Calculator */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col group hover:border-emerald-500/50 transition">
            <div className="relative h-48 overflow-hidden">
              <img
                src={IMAGES.fertileSoilBasins}
                alt="Hands preparing fertile soil basins for Pfumvudza"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                Conservation Agronomy
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                  Pfumvudza Precision Input Calculator
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Based on Zimbabwe's national 0.0624 Ha standard plot unit (1,456 basins at 75cm × 60cm). Automatically calculates exact Compound D micro-dosing, certified hybrid seed requirements (SC 719 / SC 637), and expected grain tonnage.
                </p>
              </div>
              <button
                onClick={() => onLaunchApp('planner')}
                className="w-full py-2.5 bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Calculate Your Plot Inputs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: AI Crop & Livestock Diagnostics */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col group hover:border-emerald-500/50 transition">
            <div className="relative h-48 overflow-hidden">
              <img
                src={IMAGES.farmerInspecting}
                alt="Smallholder farmer inspecting crop leaves in field"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 bg-teal-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                Vision AI Diagnostic
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                  Crop & Livestock Disease Diagnostic Scanner
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Upload or capture leaf photographs for early detection of Fall Armyworm, Maize Streak Virus, Late Blight, or Theileriosis. Includes on-device image downscaling (~150KB) to save cellular data, exact knapsack dilution ratios, and PHI periods.
                </p>
              </div>
              <button
                onClick={() => onLaunchApp('health')}
                className="w-full py-2.5 bg-slate-800 hover:bg-teal-600 hover:text-white text-teal-400 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Run Disease Diagnosis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: 2G Feature Phone USSD Gateway */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col group hover:border-emerald-500/50 transition">
            <div className="relative h-48 overflow-hidden">
              <img
                src={IMAGES.mobileInField}
                alt="Mobile handset in rural field setting"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 bg-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                2G Inclusion (*144#)
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                  2G USSD (*144#) & Two-Way SMS Protocol
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Designed for the 60%+ smallholders using basic "mbudzi" feature phones without internet bundles. Operates via GSM radio signaling with zero data balance requirements, 160-character budget constraints, and sub-60ms edge latency.
                </p>
              </div>
              <button
                onClick={onOpenUssd}
                className="w-full py-2.5 bg-slate-800 hover:bg-amber-600 hover:text-white text-amber-400 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Try Live USSD Emulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Trilingual National Agro-Dictionary */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col group hover:border-emerald-500/50 transition">
            <div className="relative h-48 overflow-hidden">
              <img
                src={IMAGES.goldenGrainHarvest}
                alt="Golden grain harvest and maize crop storage"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                Vernacular Literacy
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                  Trilingual Agro-Glossary (English, Shona & Ndebele)
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Eliminating language barriers with verified vernacular farming definitions. Instant search for Shona terms (<em>Chibage, Mupfudze, Makomba ePfumvudza</em>) and Ndebele terms (<em>Umbila, Umquba, Izikhombo zeIntwasa</em>).
                </p>
              </div>
              <button
                onClick={() => onLaunchApp('dictionary')}
                className="w-full py-2.5 bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Search Agro-Dictionary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 5: Real-Time Open Market Discovery */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col group hover:border-emerald-500/50 transition">
            <div className="relative h-48 overflow-hidden">
              <img
                src={IMAGES.marketplaceProduce}
                alt="Vibrant fresh produce marketplace with vegetable crates"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                Price Transparency
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                  Wholesale Market Discovery (Mbare, Renmark & GMB)
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Track wholesale and retail prices across commodities including White Maize, Sugar Beans, Tomatoes (Sandak crates), Groundnuts, and Sorghum to ensure smallholders are never short-changed by middlemen.
                </p>
              </div>
              <button
                onClick={() => onLaunchApp('market')}
                className="w-full py-2.5 bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-400 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Full Market Rates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 6: Community Outbreak Surveillance Radar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col group hover:border-emerald-500/50 transition">
            <div className="relative h-48 overflow-hidden bg-slate-950 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-emerald-500/40 flex items-center justify-center relative animate-pulse">
                <div className="w-16 h-16 rounded-full border border-rose-500/50 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-rose-400" />
                </div>
              </div>
              <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                Biosecurity Radar
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                  Community Pest Surveillance & Geofenced Alerts
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Crowdsourced field reports alert neighboring farmers within a 15km–50km radius to active Fall Armyworm or African Armyworm infestations, enabling proactive perimeter spraying and quarantine measures.
                </p>
              </div>
              <button
                onClick={() => onLaunchApp('geofence')}
                className="w-full py-2.5 bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-400 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Open Surveillance Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. THE 2G USSD (*144#) SPOTLIGHT ==================== */}
      <section id="ussd" className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Phone className="w-3.5 h-3.5" />
                <span>Zero Internet • Zero Mobile Data Required</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                2G Omnichannel Telecommunications Architecture
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                In rural communal lands such as Gokwe, Mudzi, Binga, and Mwenezi, over 60% of farming households rely on basic feature phones. Our USSD gateway protocol (*144#) operates directly over GSM signaling channels (MAP - Mobile Application Part), providing the exact same precision agricultural intelligence without needing a smartphone or internet balance.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Idempotent State Machine</h4>
                    <p className="text-xs text-slate-400">Deterministic menu navigation tree delivering Pfumvudza calculations, market prices, and pest alerts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">GSM 7-Bit 160-Character Optimization</h4>
                    <p className="text-xs text-slate-400">Zero mid-sentence truncations across basic monochrome LCD feature-phone screens.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Sub-60 Millisecond Execution</h4>
                    <p className="text-xs text-slate-400">Computed in-memory to prevent telco gateway timeouts in low-signal rural cells.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onOpenUssd}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Launch Interactive *144# Emulator</span>
                </button>
                <button
                  onClick={() => onOpenTransparency('ussd')}
                  className="px-5 py-3 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
                >
                  View Technical Specification
                </button>
              </div>
            </div>

            {/* Visual Phone Mockup */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm bg-slate-950 border-4 border-slate-800 rounded-[2.5rem] p-6 shadow-2xl relative">
                <div className="w-16 h-1.5 bg-slate-800 rounded-full mx-auto mb-6"></div>
                <div className="bg-[#8fa382] text-slate-900 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-700 shadow-inner">
                  <div className="font-bold border-b border-slate-700/40 pb-1 flex justify-between text-[11px]">
                    <span>*144# USSD</span>
                    <span>2G SIGNAL</span>
                  </div>
                  <div className="whitespace-pre-line text-[11.5px] leading-tight">
                    FARMERS DICTIONARY ZW{'\n'}
                    1. Pfumvudza Calculator{'\n'}
                    2. Mbare Musika Prices{'\n'}
                    3. Fall Armyworm Alert{'\n'}
                    4. Dekad Rain Alert{'\n'}
                    5. Chinja Rurimi
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                    <div
                      key={k}
                      className="h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-slate-400"
                    >
                      {k}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                    Reference Specification Model
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. ZIMBABWE NATURAL REGIONS BREAKDOWN ==================== */}
      <section id="regions" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400">
            Agro-Ecological Telemetry
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Zimbabwe's Five Natural Agro-Ecological Regions
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Farming advice must match your specific rainfall regime and soil type. Our platform calibrates planting dates, certified seed varieties, and basin spacing across all 60+ districts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {naturalRegions.map((r, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border bg-slate-900/80 backdrop-blur-sm space-y-4 ${r.color.split(' ')[0]}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${r.color}`}>
                  {r.region}
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">{r.rainfall}</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{r.area}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{r.crops}</p>
              </div>
              <button
                onClick={() => onLaunchApp('crops')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition pt-2"
              >
                <span>View Regional Planting Guidelines</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 7. PRE-FOOTER CTA BANNER ==================== */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-y border-emerald-500/20 py-16 px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400">
            Open Access Agricultural Technology
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Plan Your Season with Precision Agronomic Intelligence?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Access the Pfumvudza calculator, real-time market prices, plant disease diagnostic scanner, and vernacular dictionary directly through your browser or feature phone.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onLaunchApp()}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm sm:text-base font-black rounded-2xl shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition transform hover:scale-105 cursor-pointer"
            >
              <span>Launch National Agro-Advisory Portal</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenSignIn}
              className="w-full sm:w-auto px-6 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white text-sm sm:text-base font-bold rounded-2xl border border-slate-700 transition cursor-pointer"
            >
              <span>Sign In to Existing Farm Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== 8. WEBSITE FOOTER & TRANSPARENCY ==================== */}
      <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand & Mission */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2 text-white font-extrabold text-base">
                <span>🌾 Farmers Dictionary Zw</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                National Agro-Advisory Network delivering precision conservation agronomy, biosecurity outbreak monitoring, and trilingual guidance across Zimbabwe's agricultural communal lands and commercial estates.
              </p>
            </div>

            {/* Col 2: Solutions */}
            <div className="space-y-2">
              <h5 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Advisory Solutions</h5>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><button onClick={() => onLaunchApp('planner')} className="hover:text-emerald-400">Pfumvudza Plot Calculator</button></li>
                <li><button onClick={() => onLaunchApp('health')} className="hover:text-emerald-400">Disease Diagnostic Scanner</button></li>
                <li><button onClick={() => onLaunchApp('market')} className="hover:text-emerald-400">Mbare & GMB Market Rates</button></li>
                <li><button onClick={() => onLaunchApp('dictionary')} className="hover:text-emerald-400">Trilingual Glossary</button></li>
                <li><button onClick={onOpenUssd} className="hover:text-amber-400">2G USSD (*144#) Protocol</button></li>
              </ul>
            </div>

            {/* Col 3: Governance & Transparency */}
            <div className="space-y-2">
              <h5 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Transparency & Legal</h5>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><button onClick={() => onOpenTransparency('terms')} className="hover:text-emerald-400">Terms of Service</button></li>
                <li><button onClick={() => onOpenTransparency('privacy')} className="hover:text-teal-400">Data Privacy Policy</button></li>
                <li><button onClick={() => onOpenTransparency('ussd')} className="hover:text-amber-400">USSD Architecture (*144#)</button></li>
                <li><span className="text-slate-400">Cyber & Data Protection Act [12:07]</span></li>
              </ul>
            </div>
          </div>

          {/* Legal Notice & Non-Affiliation Disclaimer */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-1">
            <strong className="text-amber-400 uppercase tracking-wider block">
              Legal Notice & Non-Affiliation Disclaimer:
            </strong>
            <p>
              Farmers Dictionary Zw is an independent private educational and farm records platform. It is not affiliated with, authorized by, sponsored by, or an official agency of Agritex (Department of Agricultural Technical and Extension Services), the Ministry of Lands, Agriculture, Fisheries, Water and Rural Development, or any commercial corporate supplier. References to registered agrochemicals, seed varieties, or telecommunications carriers are provided solely for educational reference and agronomic planning.
            </p>
          </div>

          {/* Bottom Copyright & Document Trigger Links */}
          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="font-medium text-slate-400">
              © 2026 Farmers Dictionary Zw • National Agro-Advisory Network
            </span>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
              <button
                onClick={() => onOpenTransparency('terms')}
                className="hover:text-emerald-400 transition cursor-pointer underline underline-offset-2"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button
                onClick={() => onOpenTransparency('privacy')}
                className="hover:text-teal-400 transition cursor-pointer underline underline-offset-2"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => onOpenTransparency('ussd')}
                className="hover:text-amber-400 transition cursor-pointer underline underline-offset-2"
              >
                USSD Gateway (*144#)
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
