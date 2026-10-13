import React, { useState } from 'react';
import { 
  ZimbabweLocation 
} from '../data/zimbabweLocations';
import { 
  MASTER_CROPS, 
  CropRecommendation 
} from '../data/agronomyData';
import { 
  MapPin, 
  CloudRain, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sprout, 
  TrendingUp, 
  ChevronRight,
  Info,
  DollarSign,
  Radio
} from 'lucide-react';
import { getStationsRankedByProximity } from '../data/weatherStations';

interface Props {
  selectedLocation: ZimbabweLocation;
  onSelectCropForYieldAnalysis?: (crop: CropRecommendation) => void;
  onSelectCropForPlanner?: (crop: CropRecommendation) => void;
}

export const CropRecommendationEngine: React.FC<Props> = ({ 
  selectedLocation,
  onSelectCropForYieldAnalysis,
  onSelectCropForPlanner
}) => {
  // Find closest automated weather station to adjust micro-climate data
  const closestStation = getStationsRankedByProximity(
    selectedLocation.coordinates.lat,
    selectedLocation.coordinates.lng
  )[0];

  // Filter and score crops for this specific location & agro-ecological region
  const rankedCrops = MASTER_CROPS.map((crop) => {
    let score = crop.suitabilityScore;

    // Region match check
    const isRegionMatch = crop.suitableRegions.includes(selectedLocation.naturalRegion);
    if (!isRegionMatch) {
      score -= 35;
    }

    // Micro-climate rainfall check (incorporates nearest station 7-day rainfall)
    if (closestStation.rainfall7DaysMm >= 30) {
      score += 4; // micro-climate moisture boost
    } else if (closestStation.soilMoistureSaturationPct < 40) {
      score -= 6; // micro-climate moisture deficit
    }

    // Soil compatibility
    if (selectedLocation.dominantSoil.includes('Sandy') && crop.category === 'Legume') {
      score += 5; // Legumes do well in communal sandveld
    }

    const clampedScore = Math.max(20, Math.min(99, score));
    return {
      ...crop,
      dynamicScore: clampedScore,
    };
  }).sort((a, b) => b.dynamicScore - a.dynamicScore);

  const [activeCropId, setActiveCropId] = useState<string>(rankedCrops[0].cropId);
  const activeCrop = rankedCrops.find(c => c.cropId === activeCropId) || rankedCrops[0];

  // Dynamic Weather Index Planting Date calculation based on hyper-local closest station
  const getPlantingWindowNotice = () => {
    const isTriggered = closestStation.plantingMoistureTriggered;
    const sevenDayRain = closestStation.rainfall7DaysMm;
    const soilTemp = closestStation.soilTemp5cmC;
    const soilMoist = closestStation.soilMoistureSaturationPct;

    if (isTriggered || (sevenDayRain >= 28 && soilMoist >= 65)) {
      return {
        status: 'OPEN_NOW',
        badge: 'Planting Window OPEN',
        badgeColor: 'bg-emerald-500 text-slate-950 font-black',
        text: `Hyper-local telemetry from nearest station (${closestStation.name}, ${closestStation.distanceKm} km away): 7-day cumulative rainfall is ${sevenDayRain}mm, soil moisture is ${soilMoist}%, and seed-bed temperature is ${soilTemp}°C. Sowing threshold (>28mm) is actively SATISFIED. Sow ${activeCrop.name} in your Pfumvudza basins within the next 4 days.`,
        daysToStart: 0,
      };
    } else if (sevenDayRain >= 18 || soilMoist >= 48) {
      return {
        status: 'UPCOMING_SOON',
        badge: 'Prepare Basins (2-5 Days)',
        badgeColor: 'bg-amber-500 text-slate-950 font-bold',
        text: `Nearest station (${closestStation.name}) recorded ${sevenDayRain}mm in the last 7 days with soil moisture at ${soilMoist}%. Planting trigger approaches. Sowing of ${activeCrop.name} should begin in 3 to 5 days upon next 10mm shower. Finish digging basins and adding basal Compound D.`,
        daysToStart: 4,
      };
    } else {
      return {
        status: 'WAIT_FOR_RAIN',
        badge: 'Moisture Deficit (Dry)',
        badgeColor: 'bg-rose-500 text-white font-bold',
        text: `Nearest station (${closestStation.name}, ${closestStation.distanceKm}km away) indicates low root zone saturation (${soilMoist}%). Do NOT dry-plant seed. Await verified 25mm planting rains to avoid false germination.`,
        daysToStart: 10,
      };
    }
  };

  const plantingNotice = getPlantingWindowNotice();

  // Calculate total estimated input costs for the active crop's Pfumvudza plot
  const totalPlotInputCost = activeCrop.zeroToMaturitySchedule.reduce(
    (sum, item) => sum + item.estimatedCostUsd, 
    0
  );

  return (
    <div className="space-y-6">
      {/* Geospatial and 10-Year Climatic Analysis Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                📍
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedLocation.name} — {selectedLocation.district} District
                </h3>
                <p className="text-xs text-slate-500">
                  Province: {selectedLocation.province} • Natural Agro-Ecological Farming Region {selectedLocation.naturalRegion}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
              Region {selectedLocation.naturalRegion}
            </span>
            <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5" />
              10-Yr Avg: {selectedLocation.annualRainfallAvgMm} mm/yr
            </span>
            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-semibold">
              pH: {selectedLocation.soilPh}
            </span>
          </div>
        </div>

        {/* Soil & 10-Year Rainfall Mini-Chart */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 pt-1">
          {/* Dominant Soil Info */}
          <div className="md:col-span-5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Agronomic Soil Profile
            </span>
            <div className="font-bold text-slate-800 mb-1">
              {selectedLocation.dominantSoil}
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {selectedLocation.soilPh < 5.3 
                ? 'Acidic granitic sand: requires 200kg/ha agricultural lime to prevent fertilizer lockup.'
                : 'Favorable pH balance; responsive to Compound D basal and organic compost placement.'}
            </p>
          </div>

          {/* 10-Year Rainfall Distribution Bar */}
          <div className="md:col-span-7 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                10-Year Rainfall Trend (2015 - 2024)
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Current Season: <strong className="text-emerald-700">{selectedLocation.currentSeasonRainfallMm} mm</strong>
              </span>
            </div>

            <div className="flex items-end gap-1.5 h-14 pt-2">
              {selectedLocation.tenYearRainfall.map((rf) => {
                const heightPct = Math.min(100, (rf.rainfallMm / 1300) * 100);
                const isDrought = rf.seasonalQuality === 'Drought';
                const isExceptional = rf.seasonalQuality === 'Exceptional';

                return (
                  <div key={rf.year} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all ${
                        isDrought
                          ? 'bg-rose-400 group-hover:bg-rose-500'
                          : isExceptional
                            ? 'bg-emerald-600 group-hover:bg-emerald-700'
                            : 'bg-blue-400 group-hover:bg-blue-500'
                      }`}
                    />
                    <span className="text-[9px] text-slate-400 font-mono">
                      '{String(rf.year).slice(2)}
                    </span>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:block z-20 bg-slate-900 text-white text-[10px] p-1.5 rounded whitespace-nowrap shadow-lg">
                      {rf.year}: {rf.rainfallMm}mm ({rf.seasonalQuality})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Dynamic Weather & Planting Date Advisory */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-base text-white">
              Dynamic Sowing & Planting Date Advisory
            </h4>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-bold ${plantingNotice.badgeColor}`}>
            {plantingNotice.badge}
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed mb-3 max-w-3xl">
          {plantingNotice.text}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-800/60 text-xs">
          <div>
            <span className="text-[10px] text-emerald-300">Dekad Soil Moisture</span>
            <div className="font-bold text-white text-sm">{selectedLocation.dekadRainIndex} / 100</div>
          </div>
          <div>
            <span className="text-[10px] text-emerald-300">Last Shower</span>
            <div className="font-bold text-white text-sm">{selectedLocation.daysSinceLastRain} days ago</div>
          </div>
          <div>
            <span className="text-[10px] text-emerald-300">Planting Trigger Threshold</span>
            <div className="font-bold text-white text-sm">28mm in 3 days</div>
          </div>
          <div>
            <span className="text-[10px] text-emerald-300">Pfumvudza Window Status</span>
            <div className="font-bold text-emerald-400 text-sm">
              {plantingNotice.daysToStart === 0 ? 'Optimal Sowing Now' : `Opens in ~${plantingNotice.daysToStart} days`}
            </div>
          </div>
        </div>
      </div>

      {/* Crop Recommendation Rankings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-bold text-base text-slate-900">
              Recommended Crops for {selectedLocation.name} (Region {selectedLocation.naturalRegion})
            </h4>
            <p className="text-xs text-slate-500">
              Ranked by 10-year climatic match, soil adaptability, and smallholder food & cash security.
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {rankedCrops.length} Crops Evaluated
          </span>
        </div>

        {/* Crop Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {rankedCrops.map((crop) => {
            const isSelected = crop.cropId === activeCropId;

            return (
              <div
                key={crop.cropId}
                onClick={() => setActiveCropId(crop.cropId)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-bold text-sm text-slate-900">
                    {crop.name}
                  </div>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    crop.dynamicScore >= 90
                      ? 'bg-emerald-100 text-emerald-800'
                      : crop.dynamicScore >= 75
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                  }`}>
                    {crop.dynamicScore}% Match
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 mb-2 font-medium">
                  {crop.shonaName ? `Shona: ${crop.shonaName}` : ''} {crop.ndebeleName ? `• Ndebele: ${crop.ndebeleName}` : ''}
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rainfall Needed:</span>
                    <span className="font-semibold">{crop.rainfallRequirementMm.min}-{crop.rainfallRequirementMm.max} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Maturity:</span>
                    <span className="font-semibold">{crop.maturityDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pfumvudza Plot Yield:</span>
                    <span className="font-bold text-emerald-800">{crop.pfumvudzaYieldBags.avg} bags (50kg)</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                  <span>View Input Schedule</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Crop Zero-to-Maturity Input Schedule Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 bg-slate-50/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sprout className="w-5 h-5 text-emerald-700" />
              <h4 className="font-bold text-base text-slate-900">
                Zero-to-Maturity Input Schedule: {activeCrop.name}
              </h4>
            </div>
            <p className="text-xs text-slate-500">
              Recommended Varieties: <strong className="text-slate-800">{activeCrop.recommendedVarieties.join(', ')}</strong> • Spacing & Agritex standard rates
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Estimated 1-Plot Input Total</span>
              <span className="text-sm font-black text-emerald-800">${totalPlotInputCost.toFixed(2)} USD</span>
            </div>

            <div className="flex items-center gap-2">
              {onSelectCropForPlanner && (
                <button
                  onClick={() => onSelectCropForPlanner(activeCrop)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                  title="Generate personalized planting calendar and fertilization reminders for this crop"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Planting & Harvest Planner
                </button>
              )}

              {onSelectCropForYieldAnalysis && (
                <button
                  onClick={() => onSelectCropForYieldAnalysis(activeCrop)}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Predict Yield With This Crop
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Input Schedule Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Stage & Timing</th>
                <th className="p-3.5">Agronomic Task</th>
                <th className="p-3.5">Required Input & Zim Brand</th>
                <th className="p-3.5">Pfumvudza Plot Rate (1/16 ha)</th>
                <th className="p-3.5">Estimated Cost</th>
                <th className="p-3.5">Hurudza Master Advisory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeCrop.zeroToMaturitySchedule.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 align-top">
                    <div className="font-bold text-slate-900">{item.stage}</div>
                    <span className="text-[11px] text-emerald-700 font-mono font-semibold bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                      {item.timingDap}
                    </span>
                  </td>
                  <td className="p-3.5 align-top text-slate-700 max-w-xs leading-relaxed">
                    {item.task}
                  </td>
                  <td className="p-3.5 align-top">
                    <div className="font-bold text-slate-900">{item.recommendedInput}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{item.brandName}</div>
                  </td>
                  <td className="p-3.5 align-top font-semibold text-slate-800">
                    {item.pfumvudzaPlotRate}
                  </td>
                  <td className="p-3.5 align-top font-bold text-emerald-800">
                    ${item.estimatedCostUsd.toFixed(2)}
                  </td>
                  <td className="p-3.5 align-top text-slate-600 max-w-xs leading-relaxed">
                    <span className="text-amber-800 font-medium">⚠️ {item.criticalAdvisory}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
