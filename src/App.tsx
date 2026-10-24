/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ZIMBABWE_LOCATIONS, 
  ZimbabweLocation 
} from './data/zimbabweLocations';
import { 
  MASTER_CROPS, 
  CropRecommendation 
} from './data/agronomyData';
import { CropRecommendationEngine } from './components/CropRecommendationEngine';
import { PlantingHarvestPlanner } from './components/PlantingHarvestPlanner';
import { LocalWeatherStationsView } from './components/LocalWeatherStationsView';
import { YieldAndInputAnalysis } from './components/YieldAndInputAnalysis';
import { HealthDiagnostics } from './components/HealthDiagnostics';
import { GeoFencingMonitor } from './components/GeoFencingMonitor';
import { MarketPriceDiscovery } from './components/MarketPriceDiscovery';
import { CommunityForum } from './components/CommunityForum';
import { AgritexAssistant } from './components/AgritexAssistant';
import { SoilQualityAssessment } from './components/SoilQualityAssessment';
import { FarmersDictionaryAndWhatsApp } from './components/FarmersDictionaryAndWhatsApp';
import { CropManualsLibrary } from './components/CropManualsLibrary';
import { FarmerProfileView } from './components/FarmerProfileView';
import { FacebookPageHub } from './components/FacebookPageHub';
import { WhatsAppConnectModal } from './components/WhatsAppConnectModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineManagerBanner } from './components/OfflineManagerBanner';
import { WeatherAlertsNotificationCenter } from './components/WeatherAlertsNotificationCenter';
import { 
  Sprout, 
  TrendingUp, 
  Camera, 
  Radio, 
  Store, 
  Bot, 
  MapPin, 
  CloudRain, 
  Compass, 
  ChevronDown, 
  Users,
  Activity,
  Bell,
  CalendarRange,
  Layers,
  BookOpen,
  MessageSquare,
  FlaskConical,
  UserCheck,
  Share2,
  LogOut,
  ShieldCheck,
  Lock,
  Crown,
  Sparkles
} from 'lucide-react';
import { StationWithDistance, getStationsRankedByProximity } from './data/weatherStations';
import { useDekadPlantingAlert } from './hooks/useDekadPlantingAlert';
import { DekadPlantingAlertBanner } from './components/DekadPlantingAlertBanner';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LoginPage, AuthUser } from './components/LoginPage';

function AppContent() {
  const { t } = useTranslation();

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('agri_auth_user');
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return null;
  });

  const [selectedLocationId, setSelectedLocationId] = useState<string>('goromonzi');
  const [activeNavTab, setActiveNavTab] = useState<'crops' | 'planner' | 'weather' | 'yield' | 'health' | 'geofence' | 'market' | 'forum' | 'advisor' | 'soil' | 'dictionary' | 'manuals' | 'profile' | 'facebook'>('crops');
  const [preselectedCropForYield, setPreselectedCropForYield] = useState<CropRecommendation | undefined>(undefined);
  const [preselectedCropForPlanner, setPreselectedCropForPlanner] = useState<CropRecommendation | undefined>(undefined);
  const [farmerProfileContext, setFarmerProfileContext] = useState<string | undefined>(undefined);
  const [isGpsLocating, setIsGpsLocating] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Check if current authenticated user is developer
  const isDeveloper = currentUser?.role === 'developer';

  // Verify stored session with backend on mount
  useEffect(() => {
    const token = typeof window !== 'undefined'
      ? (localStorage.getItem('agri_auth_token') || localStorage.getItem('agri_dev_token'))
      : null;
    if (token) {
      fetch('/api/auth/session', {
        headers: { 'x-auth-token': token }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.isAuthenticated && data.user) {
            setCurrentUser(data.user);
            localStorage.setItem('agri_auth_user', JSON.stringify(data.user));
          }
        })
        .catch(() => {});
    }
  }, []);

  // Safe redirect: if regular user, Page 14 is never allowed
  useEffect(() => {
    if (!isDeveloper && activeNavTab === 'facebook') {
      setActiveNavTab('crops');
    }
  }, [isDeveloper, activeNavTab]);

  const handleLoginSuccess = (user: AuthUser, token: string) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agri_auth_user', JSON.stringify(user));
      localStorage.setItem('agri_auth_token', token);
      if (user.role === 'developer') {
        localStorage.setItem('agri_dev_token', token);
      }
    }
    // Developers start on Facebook Page Hub (Page 14), Farmers start on Crop Advisor (Page 1)
    if (user.role === 'developer') {
      setActiveNavTab('facebook');
    } else {
      setActiveNavTab('crops');
    }
  };

  const handleLogout = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('agri_auth_token') : null;
    if (token) {
      fetch('/api/developer/logout', {
        method: 'POST',
        headers: { 'x-auth-token': token }
      }).catch(() => {});
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agri_auth_user');
      localStorage.removeItem('agri_auth_token');
      localStorage.removeItem('agri_dev_token');
    }
    setCurrentUser(null);
    setActiveNavTab('crops');
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // WhatsApp Direct Connect Modal State
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);
  const [whatsAppModalTopic, setWhatsAppModalTopic] = useState<string | undefined>(undefined);
  const [whatsAppModalQuery, setWhatsAppModalQuery] = useState<string | undefined>(undefined);

  const handleOpenWhatsAppModal = (topic?: string, query?: string) => {
    setWhatsAppModalTopic(topic);
    setWhatsAppModalQuery(query);
    setIsWhatsAppModalOpen(true);
  };

  const currentLocation = ZIMBABWE_LOCATIONS.find(l => l.id === selectedLocationId) || ZIMBABWE_LOCATIONS[0];
  const closestStation = getStationsRankedByProximity(
    currentLocation.coordinates.lat,
    currentLocation.coordinates.lng
  )[0];

  // Dekad Rainfall Index & Zimbabwe Optimal Crop Planting Alert Hook
  const dekadAlert = useDekadPlantingAlert(currentLocation);

  const handleDetectGps = () => {
    setIsGpsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          // Find closest Zimbabwe district by true Euclidean/Haversine distance
          let bestDistrict = ZIMBABWE_LOCATIONS[0];
          let minDistance = Infinity;
          for (const loc of ZIMBABWE_LOCATIONS) {
            const dLat = loc.coordinates.lat - userLat;
            const dLng = loc.coordinates.lng - userLng;
            const dist = Math.sqrt(dLat * dLat + dLng * dLng);
            if (dist < minDistance) {
              minDistance = dist;
              bestDistrict = loc;
            }
          }
          setSelectedLocationId(bestDistrict.id);
          setIsGpsLocating(false);
        },
        (error) => {
          console.warn('Geolocation access declined or unavailable, selecting nearest agro-hub:', error.message);
          // Default to Goromonzi agro-met baseline
          setSelectedLocationId('goromonzi');
          setIsGpsLocating(false);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setSelectedLocationId('goromonzi');
      setIsGpsLocating(false);
    }
  };

  const handleSelectCropForYield = (crop: CropRecommendation) => {
    setPreselectedCropForYield(crop);
    setActiveNavTab('yield');
  };

  const handleSelectCropForPlanner = (crop: CropRecommendation) => {
    setPreselectedCropForPlanner(crop);
    setActiveNavTab('planner');
  };

  const handleApplyStationData = (station: StationWithDistance) => {
    // Switch to crop advisor to see adjusted micro-climate planting window
    setActiveNavTab('crops');
  };

  const handleSelectCropFromDekadAlertForAdvisor = (cropId: string) => {
    const crop = MASTER_CROPS.find(c => c.cropId === cropId);
    if (crop) {
      setPreselectedCropForYield(crop);
    }
    setActiveNavTab('crops');
  };

  const handleSelectCropFromDekadAlertForPlanner = (cropId: string) => {
    const crop = MASTER_CROPS.find(c => c.cropId === cropId);
    if (crop) {
      setPreselectedCropForPlanner(crop);
    }
    setActiveNavTab('planner');
  };

  const handleSelectCropForPlannerByName = (cropName: string) => {
    const crop = MASTER_CROPS.find(c => 
      c.name.toLowerCase().includes(cropName.toLowerCase()) || 
      cropName.toLowerCase().includes(c.name.toLowerCase())
    );
    if (crop) {
      setPreselectedCropForPlanner(crop);
    }
    setActiveNavTab('planner');
  };

  // ==================== AUTHENTICATION GATE ====================
  // If user is not authenticated, render dedicated Agritex Login Page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // ==================== SYSTEM PAGES ARCHITECTURE ====================
  // Define all 14 system pages with page numbers
  const ALL_SYSTEM_PAGES = [
    { id: 'crops', label: t('tab_crops'), icon: Sprout, pageNum: 1, isDevOnly: false },
    { id: 'planner', label: t('tab_planner'), icon: CalendarRange, pageNum: 2, isDevOnly: false },
    { id: 'weather', label: t('tab_weather'), icon: Activity, pageNum: 3, isDevOnly: false },
    { id: 'yield', label: t('tab_yield'), icon: TrendingUp, pageNum: 4, isDevOnly: false },
    { id: 'health', label: t('tab_health'), icon: Camera, pageNum: 5, isDevOnly: false },
    { id: 'geofence', label: t('tab_geofence'), icon: Radio, pageNum: 6, isDevOnly: false },
    { id: 'market', label: t('tab_market'), icon: Store, pageNum: 7, isDevOnly: false },
    { id: 'forum', label: t('tab_forum'), icon: Users, pageNum: 8, isDevOnly: false },
    { id: 'advisor', label: t('tab_advisor'), icon: Bot, pageNum: 9, isDevOnly: false },
    { id: 'soil', label: t('tab_soil'), icon: Layers, pageNum: 10, isDevOnly: false },
    { id: 'dictionary', label: t('tab_dictionary'), icon: BookOpen, pageNum: 11, isDevOnly: false },
    { id: 'manuals', label: t('tab_manuals'), icon: FlaskConical, pageNum: 12, isDevOnly: false },
    { id: 'profile', label: t('tab_profile'), icon: UserCheck, pageNum: 13, isDevOnly: false },
    { id: 'facebook', label: 'Page 14: Facebook Hub', icon: Share2, pageNum: 14, isDevOnly: true },
  ] as const;

  // Intelligent Role Filtering:
  // - If regular user (non-developer): strictly EXCLUDE Page 14 (total 13 pages)
  // - If developer: INCLUDE Page 14 (total 14 pages)
  const visiblePages = isDeveloper
    ? ALL_SYSTEM_PAGES
    : ALL_SYSTEM_PAGES.filter((p) => !p.isDevOnly);

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col">
      {/* Top Agricultural Broadcast Ticker */}
      <div className="bg-emerald-950 text-white text-xs px-4 py-2 border-b border-emerald-900 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 truncate">
          <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide shrink-0">
            {t('msd_bulletin')}
          </span>
          <span className="truncate text-slate-200">
            {dekadAlert.alertSummary.message}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0 text-slate-300 text-[11px]">
          <span>{t('gmb_benchmark')}</span>
          <span>•</span>
          <span>{t('rate_benchmark')}</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">{t('agritex_live')}</span>
        </div>
      </div>

      {/* Offline Mode & Synchronization Status Banner */}
      <OfflineManagerBanner />

      {/* Main App Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md border border-emerald-500/30">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">
                  {t('app_title')}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                  {t('app_subtitle')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {t('app_description')}
              </p>
            </div>
          </div>

          {/* Location Selector, GPS, User Profile & Logout */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Location Selector */}
            <div className="relative">
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl pl-8 pr-8 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
                title={t('select_location')}
              >
                {ZIMBABWE_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} (Region {loc.naturalRegion})
                  </option>
                ))}
              </select>
              <MapPin className="w-4 h-4 text-emerald-700 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={handleDetectGps}
              disabled={isGpsLocating}
              title={t('gps_detect')}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Compass className={`w-3.5 h-3.5 ${isGpsLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isGpsLocating ? t('gps_locating') : t('gps_detect')}</span>
            </button>

            {/* Direct WhatsApp Connect Button */}
            <button
              onClick={() => handleOpenWhatsAppModal()}
              className="px-3 py-2 bg-[#25D366] hover:bg-[#1EBE5D] active:bg-[#1DA851] text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs hover:shadow-md cursor-pointer shrink-0"
              title="Connect to Agricultural WhatsApp Helpline & Communities"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            </button>

            {/* Extreme Weather Notification Center */}
            <WeatherAlertsNotificationCenter 
              closestStation={closestStation}
              currentLocation={currentLocation}
              distanceKm={closestStation.distanceKm}
            />

            {/* PWA In-App Install Button */}
            <PWAInstallButton />

            {/* Authenticated User Role Badge & Logout */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  isDeveloper ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isDeveloper ? '👑' : '🌾'}
              </div>
              <div className="hidden sm:block text-left pr-1">
                <span className="text-xs font-black text-slate-800 block leading-tight truncate max-w-[130px]">
                  {currentUser.name}
                </span>
                <span
                  className={`text-[10px] font-bold block leading-tight ${
                    isDeveloper ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {isDeveloper ? 'Developer (14 Pgs)' : 'Farmer (13 Pgs)'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                title="Sign Out / Lock Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic System Page Tabs: 13 Pages for Farmers, 14 Pages for Developer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100 py-2">
            {visiblePages.map((page) => {
              const Icon = page.icon;
              const isActive = activeNavTab === page.id;
              const isPage14 = page.pageNum === 14;

              return (
                <button
                  key={page.id}
                  onClick={() => setActiveNavTab(page.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? isPage14
                        ? 'bg-[#1877F2] text-white shadow-md'
                        : 'bg-emerald-700 text-white shadow-sm'
                      : isPage14
                      ? 'text-blue-700 hover:text-blue-900 bg-blue-50/70 hover:bg-blue-100 border border-blue-200/80 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title={`${page.label} (Page ${page.pageNum})`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : isPage14 ? 'text-[#1877F2]' : 'text-slate-500'}`} />
                  <span>{page.label}</span>
                  {isPage14 && (
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      Dev
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        {/* ==================== ROLE-TAILORED DASHBOARD BANNERS ==================== */}
        {isDeveloper ? (
          /* DEVELOPER COMMAND CONSOLE DASHBOARD */
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-5 sm:p-6 mb-6 border border-blue-500/40 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-base sm:text-lg text-white">
                      Lead Developer Command Console
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Page 14 (Facebook Hub) Unlocked</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {currentUser.email}
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/90 mt-1 max-w-2xl leading-relaxed">
                    System Administrator session active. You have full oversight over all 14 pages, Meta Graph API tokens, live Reels video engine, and automated webhooks. Regular farmers only see pages 1 through 13.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  onClick={() => setActiveNavTab('facebook')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                    activeNavTab === 'facebook'
                      ? 'bg-[#1877F2] text-white ring-2 ring-blue-300'
                      : 'bg-white text-slate-900 hover:bg-blue-50'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5 text-[#1877F2]" />
                  <span>Launch Page 14: Facebook Hub</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-200 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Log out and return to Login Gateway"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* SMALLHOLDER FARMER DASHBOARD */
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 mb-6 border border-emerald-600/40 shadow-lg relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                  🌾
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-base sm:text-lg text-white">
                      Welcome, {currentUser.name}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2.5 py-0.5 rounded-full">
                      13 Agricultural Modules Active
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                    {currentUser.location || currentLocation.name} • Verified Agronomy & Conservation Agriculture (Pfumvudza/Intwasa) advisories loaded for your region.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenWhatsAppModal()}
                  className="px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask Extension Officer</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Sign Out of Farmer Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dekad Rainfall Index & Optimal Planting Alert Banner */}
        <DekadPlantingAlertBanner 
          alertData={dekadAlert}
          onSelectCropForAdvisor={handleSelectCropFromDekadAlertForAdvisor}
          onSelectCropForPlanner={handleSelectCropFromDekadAlertForPlanner}
          onNavigateToWeather={() => setActiveNavTab('weather')}
        />

        {activeNavTab === 'crops' && (
          <CropRecommendationEngine 
            selectedLocation={currentLocation}
            onSelectCropForYieldAnalysis={handleSelectCropForYield}
            onSelectCropForPlanner={handleSelectCropForPlanner}
            onNavigateToProfile={() => setActiveNavTab('profile')}
          />
        )}

        {activeNavTab === 'planner' && (
          <PlantingHarvestPlanner
            selectedLocation={currentLocation}
            preselectedCrop={preselectedCropForPlanner}
          />
        )}

        {activeNavTab === 'weather' && (
          <LocalWeatherStationsView
            currentLocation={currentLocation}
            onApplyStationDataToAdvisor={handleApplyStationData}
          />
        )}

        {activeNavTab === 'yield' && (
          <YieldAndInputAnalysis 
            selectedLocation={currentLocation}
            preselectedCrop={preselectedCropForYield}
          />
        )}

        {activeNavTab === 'health' && (
          <HealthDiagnostics 
            currentLocationName={`${currentLocation.name}, ${currentLocation.province} (Region ${currentLocation.naturalRegion})`}
            selectedLocation={currentLocation}
            isOfflineMode={!isOnline}
          />
        )}

        {activeNavTab === 'geofence' && (
          <GeoFencingMonitor />
        )}

        {activeNavTab === 'market' && (
          <MarketPriceDiscovery 
            currentLocationName={currentLocation.name}
          />
        )}

        {activeNavTab === 'forum' && (
          <CommunityForum
            currentLocationName={`${currentLocation.name}, ${currentLocation.province}`}
            isOfflineMode={!isOnline}
          />
        )}

        {activeNavTab === 'advisor' && (
          <AgritexAssistant 
            currentLocation={currentLocation}
            farmerProfileContext={farmerProfileContext}
          />
        )}

        {activeNavTab === 'soil' && (
          <SoilQualityAssessment
            selectedLocation={currentLocation}
            onNavigateToPlanner={(cropId) => {
              setActiveNavTab('planner');
            }}
            onNavigateToCropAdvisor={() => setActiveNavTab('crops')}
          />
        )}

        {activeNavTab === 'dictionary' && (
          <FarmersDictionaryAndWhatsApp
            currentLocation={currentLocation}
            onOpenWhatsAppModal={handleOpenWhatsAppModal}
          />
        )}

        {activeNavTab === 'manuals' && (
          <CropManualsLibrary
            currentLocation={currentLocation}
            onSelectCropForPlanner={handleSelectCropForPlannerByName}
          />
        )}

        {activeNavTab === 'profile' && (
          <FarmerProfileView
            currentLocation={currentLocation}
            onSyncAppLocation={(locId) => setSelectedLocationId(locId)}
            onNavigateToAssistant={(farmerContext) => {
              setFarmerProfileContext(farmerContext);
              setActiveNavTab('advisor');
            }}
            onNavigateToPlanner={(cropName) => {
              handleSelectCropForPlannerByName(cropName);
            }}
          />
        )}

        {/* Page 14: Facebook Page Hub (Exclusively for Authenticated Developer) */}
        {activeNavTab === 'facebook' && isDeveloper && (
          <FacebookPageHub
            currentLocation={currentLocation}
            onOpenWhatsAppModal={handleOpenWhatsAppModal}
          />
        )}
      </main>

      {/* Floating WhatsApp Quick Action Button */}
      <button
        onClick={() => handleOpenWhatsAppModal()}
        className="fixed bottom-5 right-5 z-40 bg-[#25D366] hover:bg-[#1EBE5D] active:bg-[#1DA851] text-white p-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer border-2 border-white/40"
        title="Connect with Agricultural Advisors on WhatsApp"
        aria-label="Connect to WhatsApp"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline font-black text-xs pr-1">WhatsApp Hub</span>
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
      </button>

      {/* WhatsApp Direct Connect Modal */}
      <WhatsAppConnectModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        currentLocation={currentLocation}
        initialTopic={whatsAppModalTopic}
        initialQuery={whatsAppModalQuery}
      />

      {/* Footer with Zimbabwean Agricultural Reference Data & Legal Disclaimer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-12 py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-300">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
              <span>🌾 Farmers Dictionary Zw</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 text-xs font-normal">
                Independent Smallholder Agronomy Advisory & Educational Platform
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
              <span>Pfumvudza / Intwasa Management</span>
              <span>•</span>
              <span>Open Agro-Met Telemetry</span>
              <span>•</span>
              <span>Wholesale Market Benchmarks</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-amber-400 uppercase tracking-wider block mb-1">
              Legal Notice & Non-Affiliation Disclaimer:
            </strong>
            Farmers Dictionary Zw is an independent private educational and farm records platform. It is not affiliated with, authorized by, sponsored by, or an official agency of Agritex (Department of Agricultural Technical and Extension Services), the Ministry of Lands, Agriculture, Fisheries, Water and Rural Development, or any statutory board. All agronomic models, dosage rates, market estimates, and calculations are provided for informational and planning purposes only. Farmers should consult their local registered agricultural specialist or agrochemical label instructions before making critical commercial or application decisions.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
