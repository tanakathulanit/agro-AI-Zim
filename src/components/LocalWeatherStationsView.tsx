import React, { useState, useEffect, useCallback } from 'react';
import { 
  ZimbabweLocation 
} from '../data/zimbabweLocations';
import { 
  ZIMBABWE_WEATHER_STATIONS, 
  WeatherStation, 
  getStationsRankedByProximity,
  StationWithDistance 
} from '../data/weatherStations';
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Gauge, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Sprout,
  RefreshCw,
  Calendar,
  Sparkles
} from 'lucide-react';
import { fetchLiveWeather, LiveWeatherData } from '../services/weatherService';

interface Props {
  currentLocation: ZimbabweLocation;
  onApplyStationDataToAdvisor?: (station: StationWithDistance) => void;
}

export const LocalWeatherStationsView: React.FC<Props> = ({ 
  currentLocation,
  onApplyStationDataToAdvisor
}) => {
  // Rank all stations by distance from current farmer coordinates
  const rankedStations = getStationsRankedByProximity(
    currentLocation.coordinates.lat,
    currentLocation.coordinates.lng
  );

  const [selectedStationId, setSelectedStationId] = useState<string>(rankedStations[0].id);
  const activeStation = rankedStations.find(s => s.id === selectedStationId) || rankedStations[0];

  const [liveData, setLiveData] = useState<LiveWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('Just now');

  const loadStationWeather = useCallback(async (force = false) => {
    setIsLoading(true);
    try {
      const data = await fetchLiveWeather(
        activeStation.coordinates.lat,
        activeStation.coordinates.lng,
        force
      );
      setLiveData(data);
      setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('Failed to load station weather:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeStation.coordinates.lat, activeStation.coordinates.lng]);

  useEffect(() => {
    loadStationWeather(false);
  }, [loadStationWeather]);

  return (
    <div className="space-y-6">
      {/* Network Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                📡
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Zimbabwe Automated Weather Station (AWS) Network
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time micro-climate telemetry from MSD Zimbabwe, Agritex Automated Stations & Research Centres.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              10 Stations Online
            </span>
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
              Farm Reference: {currentLocation.name}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Highlight Card: Closest Station Micro-Climate Intelligence */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-emerald-800/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded tracking-wider uppercase">
                Closest Weather Station ({activeStation.distanceKm} km away)
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Code: {activeStation.code}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {activeStation.name}
            </h2>
            <p className="text-xs text-emerald-300">
              {activeStation.district} District • {activeStation.province} • Natural Region {activeStation.naturalRegion} ({activeStation.elevationM}m elev.)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs shrink-0">
            <button
              onClick={() => loadStationWeather(true)}
              disabled={isLoading}
              title="Refresh Real Satellite & AWS Telemetry"
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : `Synced ${lastRefreshedAt}`}</span>
            </button>
            {activeStation.plantingMoistureTriggered || (liveData?.agricultural?.rainfall7DaysMm ?? 0) >= 28 ? (
              <span className="bg-emerald-500 text-slate-950 font-black px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sowing Trigger Active
              </span>
            ) : (
              <span className="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Rainfall Accumulating
              </span>
            )}
          </div>
        </div>

        {/* 6 Key Hyper-Local Micro-Climate Sensors (Real-Time Live Telemetry) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {/* Sensor 1: 24h & 7D Rain */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
              <span className="flex items-center gap-1"><CloudRain className="w-3.5 h-3.5" /> 7-Day Rain</span>
            </div>
            <div className="text-2xl font-black text-white">
              {liveData?.agricultural?.rainfall7DaysMm ?? activeStation.rainfall7DaysMm} mm
            </div>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              24h: {liveData?.agricultural?.rainfall24hMm ?? activeStation.rainfall24hMm} mm
            </span>
          </div>

          {/* Sensor 2: Soil Temperature (Seed Bed) */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
              <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5" /> Soil Temp (5cm)</span>
            </div>
            <div className="text-2xl font-black text-white">
              {liveData?.agricultural?.soilTempSeedbed5cmC ?? activeStation.soilTemp5cmC}°C
            </div>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              Root (10cm): {liveData?.agricultural?.soilTempRootzone10cmC ?? activeStation.soilTemp10cmC}°C
            </span>
          </div>

          {/* Sensor 3: Air Temperature & Humidity */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
              <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5" /> Humidity</span>
            </div>
            <div className="text-2xl font-black text-white">
              {liveData?.current?.relativeHumidityPct ?? activeStation.relativeHumidityPct}%
            </div>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              Air: {liveData?.current?.temperatureC ?? activeStation.airTempC}°C
            </span>
          </div>

          {/* Sensor 4: Soil Moisture Saturation */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
              <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5" /> Soil Moisture</span>
            </div>
            <div className="text-2xl font-black text-white">
              {liveData?.agricultural?.soilMoisturePct ?? activeStation.soilMoistureSaturationPct}%
            </div>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              Capacity Saturation
            </span>
          </div>

          {/* Sensor 5: Evapotranspiration ET0 */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
              <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5" /> ET₀ Loss</span>
            </div>
            <div className="text-2xl font-black text-white">
              {liveData?.agricultural?.evapotranspirationEt0Mm ?? activeStation.evapotranspirationEt0MmDay}
            </div>
            <span className="text-[10px] text-slate-300 block mt-0.5">mm/day evaporation</span>
          </div>

          {/* Sensor 6: Wind Telemetry */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
              <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5" /> Wind Speed</span>
            </div>
            <div className="text-2xl font-black text-white">
              {liveData?.current?.windSpeedKmh ?? activeStation.windSpeedKmh}
            </div>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              km/h ({liveData?.current?.windDirectionCompass ?? activeStation.windDirection})
            </span>
          </div>
        </div>

        {/* Micro-Climate Action Directives */}
        <div className="p-4 bg-black/40 border border-white/10 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Micro-Climate Agronomic Directives
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeStation.diseaseInfectionRisk.includes('High')
                  ? 'bg-rose-500 text-white'
                  : 'bg-emerald-500/30 text-emerald-300'
              }`}>
                {activeStation.diseaseInfectionRisk}
              </span>
            </div>
            <ul className="text-xs text-slate-200 list-disc pl-4 space-y-0.5">
              {activeStation.microclimateAlerts.map((alt, idx) => (
                <li key={idx}>{alt}</li>
              ))}
            </ul>
          </div>

          {onApplyStationDataToAdvisor && (
            <button
              onClick={() => onApplyStationDataToAdvisor(activeStation)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs transition shrink-0 flex items-center gap-1.5 shadow-md"
            >
              Apply Micro-Climate Sowing Window
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 7-Day Day-by-Day Hyper-Local Agro-Climatic Forecast */}
      {liveData?.dailyForecast && liveData.dailyForecast.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <h4 className="font-bold text-sm text-slate-900">
                  7-Day Agro-Meteorological Sowing & Rainfall Forecast ({activeStation.name})
                </h4>
              </div>
              <p className="text-xs text-slate-500">
                Live precipitation projections & FAO-56 evapotranspiration (ET₀) to plan Pfumvudza sowing and basal fertilization.
              </p>
            </div>
            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Open-Meteo High-Resolution Model
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {liveData.dailyForecast.map((day, idx) => {
              const isRainExpected = day.precipitationSumMm >= 2.0;
              const isHeavyRain = day.precipitationSumMm >= 15.0;

              return (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col justify-between text-xs transition ${
                    isHeavyRain 
                      ? 'bg-blue-50/70 border-blue-300' 
                      : isRainExpected 
                        ? 'bg-emerald-50/50 border-emerald-200' 
                        : 'bg-slate-50 border-slate-200/70'
                  }`}
                >
                  <div>
                    <div className="text-[10px] text-slate-500 font-mono font-semibold">
                      {new Date(day.date).toLocaleDateString('en-ZW', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="font-extrabold text-sm text-slate-900 mt-1">
                      {day.tempMaxC}° <span className="text-slate-400 font-normal text-xs">/ {day.tempMinC}°</span>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1 line-clamp-2 leading-tight">
                      {day.weatherDescription}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 flex items-center gap-0.5">
                        <CloudRain className="w-3 h-3 text-blue-600" /> Rain:
                      </span>
                      <span className={`font-black ${isRainExpected ? 'text-blue-700' : 'text-slate-700'}`}>
                        {day.precipitationSumMm} mm
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 flex items-center gap-0.5">
                        <Sun className="w-3 h-3 text-amber-600" /> ET₀:
                      </span>
                      <span className="font-semibold text-slate-700">
                        {day.et0Mm} mm/d
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Proximity Ranked Station List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-900">
              Nearby Zimbabwe Weather Stations (Ranked by Distance)
            </h4>
            <span className="text-xs text-slate-500">
              Stations prioritized for your farm coordinates ({currentLocation.coordinates.lat}, {currentLocation.coordinates.lng})
            </span>
          </div>
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
            Auto-Distance Haversine Matrix
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Station & Code</th>
                <th className="p-3.5">Distance</th>
                <th className="p-3.5">District / Region</th>
                <th className="p-3.5">24h / 7-Day Rain</th>
                <th className="p-3.5">Soil Temp (5cm)</th>
                <th className="p-3.5">Moisture Saturation</th>
                <th className="p-3.5">Sowing Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankedStations.map((st) => {
                const isSelected = st.id === selectedStationId;
                const isClosest = st.id === rankedStations[0].id;

                return (
                  <tr 
                    key={st.id} 
                    className={`hover:bg-slate-50/80 transition ${isSelected ? 'bg-emerald-50/40' : ''}`}
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {st.name}
                        {isClosest && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.2 rounded">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {st.code} • {st.operator}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-emerald-800">
                      {st.distanceKm} km
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {st.district} (Region {st.naturalRegion})
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {st.rainfall24hMm}mm / <span className="text-blue-700">{st.rainfall7DaysMm}mm</span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-semibold">
                      {st.soilTemp5cmC}°C
                    </td>
                    <td className="p-3.5 text-slate-700">
                      <span className="font-bold">{st.soilMoistureSaturationPct}%</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        st.plantingMoistureTriggered
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {st.plantingMoistureTriggered ? 'Sowing Active' : 'Building Moisture'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedStationId(st.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition border ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? 'Inspecting' : 'Inspect Telemetry'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
