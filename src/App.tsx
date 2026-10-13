/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  CalendarRange
} from 'lucide-react';
import { StationWithDistance, getStationsRankedByProximity } from './data/weatherStations';

export default function App() {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('goromonzi');
  const [activeNavTab, setActiveNavTab] = useState<'crops' | 'planner' | 'weather' | 'yield' | 'health' | 'geofence' | 'market' | 'forum' | 'advisor'>('crops');
  const [preselectedCropForYield, setPreselectedCropForYield] = useState<CropRecommendation | undefined>(undefined);
  const [preselectedCropForPlanner, setPreselectedCropForPlanner] = useState<CropRecommendation | undefined>(undefined);
  const [isGpsLocating, setIsGpsLocating] = useState<boolean>(false);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);

  const currentLocation = ZIMBABWE_LOCATIONS.find(l => l.id === selectedLocationId) || ZIMBABWE_LOCATIONS[0];
  const closestStation = getStationsRankedByProximity(
    currentLocation.coordinates.lat,
    currentLocation.coordinates.lng
  )[0];

  const handleDetectGps = () => {
    setIsGpsLocating(true);
    // Simulate high-accuracy GPS coordinates detection matching nearest Zimbabwe district
    setTimeout(() => {
      setSelectedLocationId('mazowe');
      setIsGpsLocating(false);
    }, 700);
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

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col">
      {/* Top Agricultural Broadcast Ticker */}
      <div className="bg-emerald-950 text-white text-xs px-4 py-2 border-b border-emerald-900 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 truncate">
          <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide shrink-0">
            MSD AGRI-BULLETIN
          </span>
          <span className="truncate text-slate-200">
            Based on today’s Dekad rainfall index ({currentLocation.dekadRainIndex}/100) in {currentLocation.name}, maize planting should begin within 4 days. Soil moisture is optimal for Pfumvudza/Intwasa basins.
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0 text-slate-300 text-[11px]">
          <span>GMB Grade A: $335/tonne</span>
          <span>•</span>
          <span>USD/ZiG: 28.50</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">Agritex Extension Live</span>
        </div>
      </div>

      {/* Offline Mode & Synchronization Status Banner */}
      <OfflineManagerBanner
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulatedOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
      />

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
                  Hurudza
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                  SMART AGRO-ADVISORY
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Smallholder Decision Engine • Zimbabwe Natural Regions I - V
              </p>
            </div>
          </div>

          {/* Location Selector, GPS Detection & PWA Install Button */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl pl-8 pr-8 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
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
              title="Detect Farm Coordinates via GPS"
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Compass className={`w-3.5 h-3.5 ${isGpsLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isGpsLocating ? 'Locating...' : 'GPS Auto-Detect'}</span>
            </button>

            {/* Extreme Weather Push Notification Center */}
            <WeatherAlertsNotificationCenter 
              closestStation={closestStation}
              currentLocation={currentLocation}
              distanceKm={closestStation.distanceKm}
            />

            {/* PWA In-App Install Button */}
            <PWAInstallButton />
          </div>
        </div>

        {/* 8 System Tab Navigation Items */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100 py-2">
            <button
              onClick={() => setActiveNavTab('crops')}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                activeNavTab === 'crops'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              1. Crop Advisor
            </button>

            <button
              onClick={() => setActiveNavTab('planner')}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                activeNavTab === 'planner'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              2. Planting & Harvest Planner
            </button>

            <button
              onClick={() => setActiveNavTab('weather')}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                activeNavTab === 'weather'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              3. Weather Stations Network
            </button>

            <button
              onClick={() => setActiveNavTab('yield')}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                activeNavTab === 'yield'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              4. Yield Prediction & Audit
            </button>

            <button
              onClick={() => setActiveNavTab('health')}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                activeNavTab === 'health'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              5. AI Health Scanner & Agrochemicals
            </button>

            <button
              onClick={() => setActiveNavTab('geofence')}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                activeNavTab === 'geofence'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              6. Livestock Geo-Fencing
            </button>

            <button
              onClick={() => setActiveNavTab('market')}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                activeNavTab === 'market'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              7. Market Price Discovery
            </button>

            <button
              onClick={() => setActiveNavTab('forum')}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                activeNavTab === 'forum'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              8. Community Forum (Dare)
            </button>

            <button
              onClick={() => setActiveNavTab('advisor')}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                activeNavTab === 'advisor'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              9. Extension Officer AI
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        {activeNavTab === 'crops' && (
          <CropRecommendationEngine 
            selectedLocation={currentLocation}
            onSelectCropForYieldAnalysis={handleSelectCropForYield}
            onSelectCropForPlanner={handleSelectCropForPlanner}
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
            isOfflineMode={isSimulatedOffline}
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
            isOfflineMode={isSimulatedOffline}
          />
        )}

        {activeNavTab === 'advisor' && (
          <AgritexAssistant 
            currentLocation={currentLocation}
          />
        )}
      </main>

      {/* Footer with Zimbabwean Agricultural Reference Data */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <span>Hurudza Smart Agro-Advisory</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-normal">
              Supporting smallholder farmers across all 10 Zimbabwe Provinces
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span>Conservation Agriculture (Pfumvudza / Intwasa)</span>
            <span>Micro-Climate AWS Network</span>
            <span>Offline-Ready PWA</span>
            <span>GMB & Mbare Musika Pricing Index</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
