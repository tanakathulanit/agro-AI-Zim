import React, { useState } from 'react';
import { 
  DekadPlantingAlertResult, 
  CropDekadSuitability 
} from '../hooks/useDekadPlantingAlert';
import { 
  Sprout, 
  CloudRain, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  SlidersHorizontal, 
  Calendar, 
  Gauge, 
  Thermometer, 
  Radio, 
  RefreshCw,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  Share2,
  Download
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { downloadDekadAdvisoryPDF } from '../utils/pdfAdvisoryGenerator';

interface Props {
  alertData: DekadPlantingAlertResult;
  onSelectCropForAdvisor?: (cropId: string) => void;
  onSelectCropForPlanner?: (cropId: string) => void;
  onNavigateToWeather?: () => void;
}

export const DekadPlantingAlertBanner: React.FC<Props> = ({
  alertData,
  onSelectCropForAdvisor,
  onSelectCropForPlanner,
  onNavigateToWeather,
}) => {
  const { t } = useTranslation();
  const {
    location,
    currentDekad,
    effectiveDekadIndex,
    liveWeather,
    isLoadingWeather,
    isConditionsFavorable,
    favorableCrops,
    allCropsEvaluation,
    alertSummary,
    isAlertDismissed,
    dismissAlert,
    reopenAlert,
    refreshTelemetry,
  } = alertData;

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedCropModal, setSelectedCropModal] = useState<CropDekadSuitability | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // If dismissed, show subtle floating trigger pill
  if (isAlertDismissed) {
    return (
      <div className="mb-4 flex items-center justify-between bg-emerald-950/90 text-white px-4 py-2 rounded-xl border border-emerald-800 text-xs shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-emerald-300">
            {isConditionsFavorable ? 'Dekad Sowing Alert Active' : 'Dekad Moisture Monitor'}
          </span>
          <span className="text-slate-300 hidden sm:inline">
            ({effectiveDekadIndex}/100 in {location.name})
          </span>
        </div>
        <button
          onClick={reopenAlert}
          className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg transition"
        >
          View Alert Banner
        </button>
      </div>
    );
  }

  const handleShareDekadAlert = () => {
    const text = `🌧️ *FARMERS DICTIONARY ZW • DEKAD PLANTING ALERT*
━━━━━━━━━━━━━━━━━━━━━
📍 *District:* ${location.name} (Region ${location.naturalRegion}, ${location.province})
📅 *Period:* ${currentDekad.dekadLabel}
📊 *Dekad Rainfall Index:* ${effectiveDekadIndex}/100
🌱 *Planting Status:* ${isConditionsFavorable ? 'SOWING CONDITIONS FAVORABLE' : 'PREPARE BASINS - AWAIT 25mm RAIN'}

🌾 *Recommended Sowing List:*
${favorableCrops.map(c => `• ${c.profile.cropName} (${c.badgeLabel})`).join('\n') || '• Basin preparation and kraal manure application'}

💡 *Action Guidance:*
${alertSummary.message}

━━━━━━━━━━━━━━━━━━━━━
_Powered by Farmers Dictionary Zw • Agro-Met Telemetry_`;

    const encoded = encodeURIComponent(text.trim());
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadDekadPDF = () => {
    setIsGeneratingPdf(true);
    try {
      const actions = [
        isConditionsFavorable 
          ? 'Begin Pfumvudza sowing into pre-dug basins within 48 to 72 hours while root-zone moisture is optimal.'
          : 'Do not sow dry seed; finish digging 15x15x15cm basins and place kraal manure / compost blanket.',
        'Apply basal Compound D (or fertilizer per Soil Quality Assessment) into basins before seed placement.',
        'Apply 5-7cm dry grass/stover mulch blanket to prevent scorching and suppress early weed flushes.',
        'Monitor local meteorological and agro-bulletins daily for sudden 3-day dry spells.'
      ];

      downloadDekadAdvisoryPDF({
        districtName: location.name,
        naturalRegion: location.naturalRegion,
        province: location.province,
        dekadLabel: currentDekad.dekadLabel,
        dekadPeriod: currentDekad.dateRange,
        rainfallIndex: effectiveDekadIndex,
        isFavorable: isConditionsFavorable,
        statusHeadline: isConditionsFavorable ? 'Optimal Sowing Window OPEN' : 'Basin Preparation Phase (Await 25mm rain)',
        summaryMessage: alertSummary.message,
        cumulativeRainMm: liveWeather?.agricultural.dekadAccumulatedRainfallMm || 42,
        forecastRainMm: liveWeather?.agricultural.rainfall7DaysMm || 18,
        soilMoistureScore: Math.round(liveWeather?.agricultural.soilMoisturePct || effectiveDekadIndex),
        temperatureC: Math.round(liveWeather?.current.temperatureC || 26),
        favorableCrops: favorableCrops.map(c => ({
          name: c.profile.cropName,
          badge: c.badgeLabel,
          reason: c.advisoryText
        })),
        actionChecklist: actions
      });
    } catch (err) {
      console.error('Failed to export Dekad PDF', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="mb-6 space-y-3">
      {/* Primary Alert Banner */}
      <div 
        className={`relative overflow-hidden rounded-2xl border transition-all shadow-md ${
          isConditionsFavorable
            ? 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white border-emerald-600/60'
            : 'bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white border-slate-700/60'
        }`}
      >
        {/* Animated Background Highlights for Active Favorable Conditions */}
        {isConditionsFavorable && (
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        )}

        <div className="p-4 sm:p-5 relative z-10">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div 
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xl shadow-md ${
                  isConditionsFavorable 
                    ? 'bg-emerald-500 text-slate-950 animate-bounce-subtle' 
                    : 'bg-slate-700 text-emerald-300'
                }`}
              >
                {isConditionsFavorable ? '🌱' : '📡'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span 
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1 ${
                      isConditionsFavorable 
                        ? 'bg-emerald-400 text-slate-950' 
                        : 'bg-amber-400 text-slate-950'
                    }`}
                  >
                    {isConditionsFavorable ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        {t('dekad_sowing_favorable')}
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        {t('dekad_sowing_wait')}
                      </>
                    )}
                  </span>

                  <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                    {currentDekad.dekadLabel}
                  </span>

                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300 hidden md:inline">
                    Region {location.naturalRegion} • {location.province}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                  {alertSummary.title}
                </h2>
              </div>
            </div>

            {/* Top Action Controls */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={handleShareDekadAlert}
                title="Share Dekad Alert to WhatsApp"
                className="px-2.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              <button
                onClick={handleDownloadDekadPDF}
                disabled={isGeneratingPdf}
                title="Download official Dekad Planting Advisory PDF"
                className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isGeneratingPdf ? 'PDF...' : 'PDF'}</span>
              </button>

              <button
                onClick={refreshTelemetry}
                disabled={isLoadingWeather}
                title="Refresh Real Weather Telemetry"
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition border border-white/10"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-300 ${isLoadingWeather ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse Alert' : 'Expand Alert'}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition border border-white/10"
              >
                {isExpanded ? 'Minimize' : 'Details'}
              </button>

              <button
                onClick={dismissAlert}
                title="Dismiss Banner"
                className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Left Column: Dekad Index Gauge & Live Weather Telemetry */}
            <div className="lg:col-span-5 bg-black/30 border border-white/10 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Dekad Rainfall Index
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-white">
                    {effectiveDekadIndex}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ 100</span>
                </div>
              </div>

              {/* Progress Bar with Agro-Climatic Zones */}
              <div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden flex border border-white/10">
                  {/* Deficit zone (0-35) */}
                  <div className="w-[35%] bg-rose-500/80 h-full border-r border-slate-900" title="Moisture Deficit (0-35)" />
                  {/* Moderate zone (35-65) */}
                  <div className="w-[30%] bg-amber-500/80 h-full border-r border-slate-900" title="Moderate Moisture (35-65)" />
                  {/* Sowing Optimal zone (65-100) */}
                  <div className="w-[35%] bg-emerald-500 h-full" title="Sowing Optimal (65-100)" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>0 (Deficit)</span>
                  <span>35 (Small Grains)</span>
                  <span>65 (Maize Sowing)</span>
                  <span>100</span>
                </div>
              </div>

              {/* Live Weather Micro-Sensors from Open-Meteo & MSD */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                <div className="bg-white/5 rounded-lg p-1.5">
                  <span className="text-[10px] text-emerald-300 block flex items-center justify-center gap-0.5">
                    <CloudRain className="w-3 h-3" /> 7D Rain
                  </span>
                  <span className="font-extrabold text-xs text-white">
                    {liveWeather?.agricultural?.rainfall7DaysMm ?? location.currentSeasonRainfallMm} mm
                  </span>
                </div>

                <div className="bg-white/5 rounded-lg p-1.5">
                  <span className="text-[10px] text-emerald-300 block flex items-center justify-center gap-0.5">
                    <Thermometer className="w-3 h-3" /> Seed Temp
                  </span>
                  <span className="font-extrabold text-xs text-white">
                    {liveWeather?.agricultural?.soilTempSeedbed5cmC ?? 24.5}°C
                  </span>
                </div>

                <div className="bg-white/5 rounded-lg p-1.5">
                  <span className="text-[10px] text-emerald-300 block flex items-center justify-center gap-0.5">
                    <Gauge className="w-3 h-3" /> Saturation
                  </span>
                  <span className="font-extrabold text-xs text-white">
                    {liveWeather?.agricultural?.soilMoisturePct ?? 78}%
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Favorable Crops Quick Chips & Advisory Message */}
            <div className="lg:col-span-7 space-y-2.5">
              <p className="text-xs text-slate-200 leading-relaxed">
                {alertSummary.message}
              </p>

              {/* Favorable Crops Badge Row */}
              {isConditionsFavorable ? (
                <div>
                  <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Crops with Active Sowing Green Light:
                    </span>
                    <span className="text-slate-300 font-normal">
                      Click a crop for Pfumvudza sowing instructions
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {favorableCrops.map((suit) => (
                      <button
                        key={suit.profile.cropId}
                        onClick={() => setSelectedCropModal(suit)}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-white text-xs font-bold transition flex items-center gap-1.5 group cursor-pointer"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition" />
                        <span>{suit.profile.cropName.split('(')[0].trim()}</span>
                        <ChevronRight className="w-3 h-3 text-emerald-300" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    Moisture threshold not yet reached in {location.name}. Prepare your Pfumvudza basins and apply basal Compound D, then await the opening 25mm soaking rain.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Expandable All-Crops Dekad Matrix */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  Zimbabwe Major Crops Dekad Sowing Matrix ({location.name} • Region {location.naturalRegion})
                </h3>

                {onNavigateToWeather && (
                  <button
                    onClick={onNavigateToWeather}
                    className="text-[11px] text-emerald-300 hover:text-white flex items-center gap-1 underline"
                  >
                    Inspect Live Weather Stations Telemetry
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {allCropsEvaluation.map((crop) => {
                  const isReady = crop.isFavorable;
                  return (
                    <div
                      key={crop.profile.cropId}
                      onClick={() => setSelectedCropModal(crop)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                        isReady
                          ? 'bg-emerald-900/40 hover:bg-emerald-900/60 border-emerald-500/50 shadow-sm'
                          : 'bg-black/20 hover:bg-black/30 border-white/5 opacity-80'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-xs text-white truncate">
                            {crop.profile.cropName}
                          </span>
                          <span 
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                              isReady 
                                ? 'bg-emerald-500 text-slate-950' 
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {isReady ? 'SOW NOW' : 'WAIT'}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-300 mb-2">
                          <span className="text-emerald-300 font-semibold">{crop.profile.optimalCalendarDates}</span>
                          <span className="block text-[10px] text-slate-400">
                            Required Index: {crop.profile.requiredDekadRainIndex}/100 (Trigger: {crop.profile.minRainfall3DaysMm}mm)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/10">
                        <span className="text-slate-400 text-[10px]">
                          {crop.profile.category}
                        </span>
                        <span className="text-emerald-300 font-bold flex items-center gap-0.5 text-[10px]">
                          Details
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal / Dialog for Detailed Crop Sowing Protocol */}
      {selectedCropModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                    {selectedCropModal.profile.category}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    selectedCropModal.isFavorable 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {selectedCropModal.badgeLabel}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedCropModal.profile.cropName}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedCropModal.profile.vernacularName}
                </p>
              </div>

              <button
                onClick={() => setSelectedCropModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Advisory Note */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Sprout className="w-4 h-4 text-emerald-700" />
                Agronomic Sowing Advisory:
              </span>
              <p className="leading-relaxed">
                {selectedCropModal.advisoryText}
              </p>
            </div>

            {/* Technical Parameters */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">
                  Optimal Sowing Window
                </span>
                <span className="font-bold text-slate-900">
                  {selectedCropModal.profile.optimalCalendarDates}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">
                  Dekad Index vs Threshold
                </span>
                <span className="font-bold text-slate-900">
                  {effectiveDekadIndex} / {selectedCropModal.profile.requiredDekadRainIndex} (3D Rain: {selectedCropModal.profile.minRainfall3DaysMm}mm)
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 col-span-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">
                  Pfumvudza / Intwasa Spacing & Density
                </span>
                <span className="font-bold text-slate-800">
                  {selectedCropModal.profile.pfumvudzaSpacing}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 col-span-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">
                  Basal Fertilizer Placement Protocol
                </span>
                <span className="font-medium text-slate-800">
                  {selectedCropModal.profile.basalFertilizer}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 col-span-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">
                  Certified Commercial Seed Varieties
                </span>
                <span className="font-semibold text-emerald-800">
                  {selectedCropModal.profile.recommendedVarieties.join(', ')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-slate-100">
              {onSelectCropForPlanner && (
                <button
                  onClick={() => {
                    const cId = selectedCropModal.profile.cropId;
                    setSelectedCropModal(null);
                    onSelectCropForPlanner(cId);
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold rounded-xl text-xs transition"
                >
                  Add to Sowing Planner
                </button>
              )}

              {onSelectCropForAdvisor && (
                <button
                  onClick={() => {
                    const cId = selectedCropModal.profile.cropId;
                    setSelectedCropModal(null);
                    onSelectCropForAdvisor(cId);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Sow in Crop Advisor
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
