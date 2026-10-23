import { useState, useEffect, useMemo, useCallback } from 'react';
import { ZimbabweLocation } from '../data/zimbabweLocations';
import { REGION_CLIMATIC_CYCLES } from '../data/climaticCycles';
import { fetchLiveWeather, LiveWeatherData } from '../services/weatherService';

export interface MajorCropPlantingProfile {
  cropId: string;
  cropName: string;
  vernacularName: string; // Shona / Ndebele
  category: 'Cereal' | 'Small Grain' | 'Legume' | 'Oilseed';
  suitableRegions: ('I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V')[];
  recommendedVarieties: string[];
  optimalDekadStart: number; // SADC Dekad (1-36)
  optimalDekadEnd: number;   // SADC Dekad (1-36)
  optimalCalendarDates: string; // Human readable
  requiredDekadRainIndex: number; // 0-100 threshold
  minRainfall3DaysMm: number;    // Agritex 3-day rainfall threshold
  optimalSoilTempRangeC: { min: number; max: number };
  pfumvudzaSpacing: string;
  basalFertilizer: string;
  urgencyDaysToPlant: number;
}

export const MAJOR_ZIMBABWE_CROPS: MajorCropPlantingProfile[] = [
  {
    cropId: 'maize_medium',
    cropName: 'Hybrid White Maize (Medium Maturity)',
    vernacularName: 'Chibage / Umumbu (SC 637 / SC 719)',
    category: 'Cereal',
    suitableRegions: ['I', 'IIa', 'IIb', 'III'],
    recommendedVarieties: ['Seed Co SC 637', 'Seed Co SC 719', 'Pannar PAN 53'],
    optimalDekadStart: 32, // Nov Dekad II (11-20 Nov)
    optimalDekadEnd: 35,   // Dec Dekad II (11-20 Dec)
    optimalCalendarDates: '15 November - 15 December',
    requiredDekadRainIndex: 65,
    minRainfall3DaysMm: 28,
    optimalSoilTempRangeC: { min: 18, max: 32 },
    pfumvudzaSpacing: '75cm between rows x 60cm between basins (2 plants/basin)',
    basalFertilizer: 'Compound D (7:14:7) 1 beer-bottle-cap (10g) per basin covered with 2cm soil',
    urgencyDaysToPlant: 4,
  },
  {
    cropId: 'maize_early',
    cropName: 'Early Maturity Maize (Drought Escape)',
    vernacularName: 'Chibage Chinosvika Kurumidza (SC 301 / SC 403 / SC 529)',
    category: 'Cereal',
    suitableRegions: ['IIb', 'III', 'IV'],
    recommendedVarieties: ['Seed Co SC 403 (Tsoko)', 'SC 529', 'SC 301'],
    optimalDekadStart: 32, // Nov Dekad II
    optimalDekadEnd: 36,   // Dec Dekad III (21-31 Dec)
    optimalCalendarDates: '15 November - 28 December',
    requiredDekadRainIndex: 50,
    minRainfall3DaysMm: 22,
    optimalSoilTempRangeC: { min: 18, max: 34 },
    pfumvudzaSpacing: '75cm x 60cm basins',
    basalFertilizer: 'Compound D or well-rotted cattle kraal manure',
    urgencyDaysToPlant: 5,
  },
  {
    cropId: 'sorghum_drought',
    cropName: 'Sorghum / Mhunga (Drought Resilient)',
    vernacularName: 'Mapfunde / Amabele (SV-2 / Macia)',
    category: 'Small Grain',
    suitableRegions: ['IIb', 'III', 'IV', 'V'],
    recommendedVarieties: ['SV-2 (White)', 'SV-4', 'Macia', 'Silila'],
    optimalDekadStart: 33, // Nov Dekad III (21-30 Nov)
    optimalDekadEnd: 36,   // Dec Dekad III (21-31 Dec)
    optimalCalendarDates: '25 November - 28 December',
    requiredDekadRainIndex: 40,
    minRainfall3DaysMm: 18,
    optimalSoilTempRangeC: { min: 20, max: 35 },
    pfumvudzaSpacing: '75cm x 30cm basins (thin to 2 plants/station)',
    basalFertilizer: 'Single Superphosphate or half-cap Compound D + organic manure',
    urgencyDaysToPlant: 6,
  },
  {
    cropId: 'groundnuts_legume',
    cropName: 'Groundnuts / Nzungu (Nutrient-Dense Legume)',
    vernacularName: 'Nzungu / Amazambane (Ilanda / Natal Common)',
    category: 'Legume',
    suitableRegions: ['I', 'IIa', 'IIb', 'III', 'IV'],
    recommendedVarieties: ['Ilanda', 'Natal Common', 'Nyanda', 'SC Flamingo'],
    optimalDekadStart: 32, // Nov Dekad II
    optimalDekadEnd: 34,   // Dec Dekad I (01-10 Dec)
    optimalCalendarDates: '15 November - 10 December',
    requiredDekadRainIndex: 58,
    minRainfall3DaysMm: 25,
    optimalSoilTempRangeC: { min: 18, max: 30 },
    pfumvudzaSpacing: '45cm rows x 15cm in-row on raised ridges or basins',
    basalFertilizer: 'Gypsum (at flowering) + Single Superphosphate basal',
    urgencyDaysToPlant: 4,
  },
  {
    cropId: 'pearl_millet',
    cropName: 'Pearl Millet / Inyawuthi (Extreme Arid Staple)',
    vernacularName: 'Mhunga / Inyawuthi (PMV-3)',
    category: 'Small Grain',
    suitableRegions: ['III', 'IV', 'V'],
    recommendedVarieties: ['PMV-3', 'Okashana 1', 'Kavela'],
    optimalDekadStart: 33, // Nov Dekad III
    optimalDekadEnd: 1,    // Jan Dekad I (01-10 Jan)
    optimalCalendarDates: '01 December - 10 January',
    requiredDekadRainIndex: 35,
    minRainfall3DaysMm: 15,
    optimalSoilTempRangeC: { min: 21, max: 36 },
    pfumvudzaSpacing: '75cm x 30cm spacing (shallow 2cm depth)',
    basalFertilizer: 'Kraal compost + light Compound D',
    urgencyDaysToPlant: 7,
  },
  {
    cropId: 'soya_beans',
    cropName: 'Soya Beans (Commercial High-Protein Legume)',
    vernacularName: 'Soya Beans (SC Safari / Bimha)',
    category: 'Legume',
    suitableRegions: ['I', 'IIa', 'IIb'],
    recommendedVarieties: ['SC Safari', 'SC Saga', 'Bimha', 'Status'],
    optimalDekadStart: 32, // Nov Dekad II
    optimalDekadEnd: 34,   // Dec Dekad I
    optimalCalendarDates: '15 November - 10 December',
    requiredDekadRainIndex: 70,
    minRainfall3DaysMm: 30,
    optimalSoilTempRangeC: { min: 18, max: 28 },
    pfumvudzaSpacing: '45cm rows x 5cm drill in-row',
    basalFertilizer: 'Compound L or Superphosphate + Rhizobium Legume Inoculant',
    urgencyDaysToPlant: 3,
  },
  {
    cropId: 'roundnuts_nyimo',
    cropName: 'Roundnuts / Bambara Nut (Nyimo)',
    vernacularName: 'Nyimo / Indlubu (Mana / Brown Speckled)',
    category: 'Legume',
    suitableRegions: ['IIb', 'III', 'IV', 'V'],
    recommendedVarieties: ['Mana', 'Red Pod Indigenous', 'Black Eyed'],
    optimalDekadStart: 33, // Nov Dekad III
    optimalDekadEnd: 35,   // Dec Dekad II
    optimalCalendarDates: '25 November - 20 December',
    requiredDekadRainIndex: 45,
    minRainfall3DaysMm: 20,
    optimalSoilTempRangeC: { min: 19, max: 32 },
    pfumvudzaSpacing: '45cm x 15cm stations',
    basalFertilizer: 'Superphosphate or decomposed wood ash compost',
    urgencyDaysToPlant: 6,
  },
];

export interface CropDekadSuitability {
  profile: MajorCropPlantingProfile;
  isRegionSuitable: boolean;
  isDekadIndexSatisfied: boolean;
  isCalendarWindowActive: boolean;
  isApproachingWindow: boolean;
  dekadDifference: number; // 0 if currently active, >0 if approaching, <0 if passed
  status: 'OPTIMAL_SOW_NOW' | 'FAVORABLE_APPROACHING' | 'WAIT_FOR_MOISTURE' | 'PAST_WINDOW' | 'REGION_UNSUITABLE';
  badgeLabel: string;
  badgeColor: string;
  isFavorable: boolean; // True when farmer should take planting action!
  indexProgressPct: number;
  advisoryText: string;
}

export interface DekadCalendarInfo {
  dekadNumber: number; // 1 to 36
  dekadOfMonth: 1 | 2 | 3;
  monthName: string;
  monthIndex: number; // 0-11
  dekadLabel: string; // e.g. "October Dekad II (11-20 Oct)"
  seasonName: string;
  seasonShona: string;
  dateRange: string;
}

export interface DekadPlantingAlertResult {
  location: ZimbabweLocation;
  currentDekad: DekadCalendarInfo;
  effectiveDekadIndex: number;
  liveWeather: LiveWeatherData | null;
  isLoadingWeather: boolean;
  weatherSource: 'Open-Meteo-Live' | 'MSD-Baseline';
  isConditionsFavorable: boolean;
  favorableCropsCount: number;
  totalEvaluatedCrops: number;
  favorableCrops: CropDekadSuitability[];
  allCropsEvaluation: CropDekadSuitability[];
  alertSummary: {
    title: string;
    message: string;
    severity: 'success' | 'warning' | 'info';
    badge: string;
    actionLabel: string;
  };
  isAlertDismissed: boolean;
  dismissAlert: () => void;
  reopenAlert: () => void;
  refreshTelemetry: () => void;
}

/**
 * Calculates current SADC/Agritex Dekad (1..36) from a given Date
 */
export function calculateSADCDekad(date: Date = new Date()): DekadCalendarInfo {
  const month = date.getMonth(); // 0-11
  const day = date.getDate();    // 1-31

  let dekadOfMonth: 1 | 2 | 3 = 1;
  let dateRange = '01 - 10';
  if (day >= 11 && day <= 20) {
    dekadOfMonth = 2;
    dateRange = '11 - 20';
  } else if (day >= 21) {
    dekadOfMonth = 3;
    const lastDay = new Date(date.getFullYear(), month + 1, 0).getDate();
    dateRange = `21 - ${lastDay}`;
  }

  // SADC Dekad index: 1 = Jan Dekad I ... 36 = Dec Dekad III
  const dekadNumber = month * 3 + dekadOfMonth;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[month];

  // Agro seasons in Zimbabwe:
  // Nov - Mar: Zhizha (Main Summer Cropping)
  // Apr - May: Matsutso (Autumn Harvest)
  // Jun - Jul: Chando (Winter Storage/Wheat)
  // Aug - Oct: Chirimo (Spring Land Prep & Basins)
  let seasonName = 'Spring Land Preparation';
  let seasonShona = 'Chirimo';
  if (month >= 10 || month <= 2) {
    seasonName = 'Main Summer Cropping';
    seasonShona = 'Zhizha';
  } else if (month >= 3 && month <= 4) {
    seasonName = 'Autumn Maturation & Harvest';
    seasonShona = 'Matsutso';
  } else if (month >= 5 && month <= 6) {
    seasonName = 'Winter Rest & Dry Curing';
    seasonShona = 'Chando';
  }

  const romanNumerals = ['I', 'II', 'III'];
  const dekadLabel = `${monthName} Dekad ${romanNumerals[dekadOfMonth - 1]} (${dateRange} ${monthName.slice(0, 3)})`;

  return {
    dekadNumber,
    dekadOfMonth,
    monthName,
    monthIndex: month,
    dekadLabel,
    seasonName,
    seasonShona,
    dateRange: `${dateRange} ${monthName}`,
  };
}

/**
 * Primary Custom Hook: Compares Dekad rainfall index with optimal planting windows
 * of major Zimbabwean crops and generates a visual alert if conditions are favorable.
 */
export function useDekadPlantingAlert(
  selectedLocation: ZimbabweLocation,
  options?: {
    forceLiveWeather?: boolean;
  }
): DekadPlantingAlertResult {
  const [liveWeather, setLiveWeather] = useState<LiveWeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [isAlertDismissed, setIsAlertDismissed] = useState<boolean>(false);

  // Fetch real weather API on location change
  const loadWeather = useCallback(async (force = false) => {
    setIsLoadingWeather(true);
    try {
      const data = await fetchLiveWeather(
        selectedLocation.coordinates.lat,
        selectedLocation.coordinates.lng,
        force
      );
      setLiveWeather(data);
    } catch (err) {
      console.warn('Weather fetch warning in hook:', err);
    } finally {
      setIsLoadingWeather(false);
    }
  }, [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng]);

  useEffect(() => {
    loadWeather(options?.forceLiveWeather ?? false);
  }, [loadWeather, options?.forceLiveWeather]);

  // Reset alert dismiss when user changes location
  useEffect(() => {
    setIsAlertDismissed(false);
  }, [selectedLocation.id]);

  // Real active Agritex/SADC Dekad derived from current date
  const currentDekad = useMemo(() => {
    return calculateSADCDekad(new Date());
  }, []);

  // Effective Dekad rainfall index:
  // Combines location base index with live Open-Meteo telemetry when available
  const effectiveDekadIndex = useMemo(() => {
    if (liveWeather?.agricultural?.dekadRainIndex) {
      // Blend 60% real-time satellite/gauge API with 40% location agro-soil index
      return Math.round(
        liveWeather.agricultural.dekadRainIndex * 0.6 + selectedLocation.dekadRainIndex * 0.4
      );
    }
    return selectedLocation.dekadRainIndex;
  }, [liveWeather, selectedLocation.dekadRainIndex]);

  // Compare Dekad rainfall index with all major crops
  const allCropsEvaluation = useMemo<CropDekadSuitability[]>(() => {
    const regionCycle = REGION_CLIMATIC_CYCLES[selectedLocation.naturalRegion];
    const userDekad = currentDekad.dekadNumber;

    return MAJOR_ZIMBABWE_CROPS.map((profile) => {
      const isRegionSuitable = profile.suitableRegions.includes(selectedLocation.naturalRegion);
      const isDekadIndexSatisfied = effectiveDekadIndex >= profile.requiredDekadRainIndex;

      // Calendar window analysis:
      // In Zimbabwe, if dekad wraps around year-end: e.g. Pearl Millet start 33, end 1 (Jan)
      let isCalendarWindowActive = false;
      let isApproachingWindow = false;
      let dekadDiff = 0;

      if (profile.optimalDekadStart <= profile.optimalDekadEnd) {
        isCalendarWindowActive = userDekad >= profile.optimalDekadStart && userDekad <= profile.optimalDekadEnd;
        if (userDekad < profile.optimalDekadStart) {
          dekadDiff = profile.optimalDekadStart - userDekad;
          isApproachingWindow = dekadDiff <= 2; // within 20 days
        } else if (userDekad > profile.optimalDekadEnd) {
          dekadDiff = profile.optimalDekadEnd - userDekad;
        }
      } else {
        // Wraps over Dec/Jan (e.g. 33 to 1)
        isCalendarWindowActive = userDekad >= profile.optimalDekadStart || userDekad <= profile.optimalDekadEnd;
        if (!isCalendarWindowActive) {
          dekadDiff = userDekad > profile.optimalDekadEnd ? profile.optimalDekadStart - userDekad : 0;
          isApproachingWindow = dekadDiff <= 2 && dekadDiff > 0;
        }
      }

      // Check regional agro-cycle dry planting rules
      const dryPlantingAllowed = regionCycle.optimalPlantingWindow.dryPlantingAllowed;

      // Progress towards required moisture threshold (0-100%)
      const indexProgressPct = Math.min(100, Math.round((effectiveDekadIndex / profile.requiredDekadRainIndex) * 100));

      let status: CropDekadSuitability['status'] = 'WAIT_FOR_MOISTURE';
      let badgeLabel = 'Awaiting Moisture';
      let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
      let isFavorable = false;
      let advisoryText = '';

      if (!isRegionSuitable) {
        status = 'REGION_UNSUITABLE';
        badgeLabel = `Not Recommended (Region ${selectedLocation.naturalRegion})`;
        badgeColor = 'bg-slate-100 text-slate-500 border-slate-200';
        advisoryText = `${profile.cropName} is not agro-ecologically suited for Natural Region ${selectedLocation.naturalRegion}. Focus on recommended regional staples.`;
      } else if (isCalendarWindowActive && isDekadIndexSatisfied) {
        status = 'OPTIMAL_SOW_NOW';
        badgeLabel = 'Optimal Sowing Window OPEN';
        badgeColor = 'bg-emerald-600 text-white font-black animate-pulse border-emerald-400';
        isFavorable = true;
        advisoryText = `Dekad index (${effectiveDekadIndex}/100) satisfies threshold (${profile.requiredDekadRainIndex}/100). Sowing window is actively OPEN. Sow within ${profile.urgencyDaysToPlant} days in prepared Pfumvudza basins.`;
      } else if (isCalendarWindowActive && !isDekadIndexSatisfied) {
        status = 'WAIT_FOR_MOISTURE';
        badgeLabel = `Calendar Active: Moisture Deficit (${effectiveDekadIndex}/${profile.requiredDekadRainIndex})`;
        badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
        advisoryText = `Calendar window is active (${profile.optimalCalendarDates}), but Dekad index (${effectiveDekadIndex}/100) is below the ${profile.requiredDekadRainIndex}/100 threshold. Do NOT dry plant without supplementary irrigation. Await 25mm soaking rain.`;
      } else if (isApproachingWindow && isDekadIndexSatisfied) {
        status = 'FAVORABLE_APPROACHING';
        badgeLabel = 'Early Rains Favorable — Prep Basins';
        badgeColor = 'bg-teal-600 text-white font-bold border-teal-400';
        isFavorable = true;
        advisoryText = `Exceptional early moisture detected! Dekad index (${effectiveDekadIndex}/100) is already sufficient. Sowing window opens in ${dekadDiff * 10} days (${profile.optimalCalendarDates}). Finalize basin digging & basal fertilizer placement now.`;
      } else if (isApproachingWindow && !isDekadIndexSatisfied) {
        status = 'WAIT_FOR_MOISTURE';
        badgeLabel = `Approaching Window (in ${dekadDiff * 10} days)`;
        badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
        advisoryText = `Sowing window approaches in ${dekadDiff * 10} days. Current moisture index is ${effectiveDekadIndex}/100. Finish land preparation ahead of opening rains.`;
      } else if (dekadDiff < 0) {
        status = 'PAST_WINDOW';
        badgeLabel = 'Optimal Window Past Cut-off';
        badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
        advisoryText = `Optimal sowing window ended ${Math.abs(dekadDiff) * 10} days ago. Planting now risks end-of-season drought scorch during grain filling. Switch to ultra-early varieties or small grains.`;
      } else {
        status = 'WAIT_FOR_MOISTURE';
        badgeLabel = 'Off-Season / Pre-Season';
        badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
        advisoryText = `Currently in off-season preparation. Sowing window: ${profile.optimalCalendarDates}.`;
      }

      return {
        profile,
        isRegionSuitable,
        isDekadIndexSatisfied,
        isCalendarWindowActive,
        isApproachingWindow,
        dekadDifference: dekadDiff,
        status,
        badgeLabel,
        badgeColor,
        isFavorable,
        indexProgressPct,
        advisoryText,
      };
    });
  }, [selectedLocation.naturalRegion, currentDekad.dekadNumber, effectiveDekadIndex]);

  // Filter only crops where conditions are favorable
  const favorableCrops = useMemo(() => {
    return allCropsEvaluation.filter(c => c.isFavorable);
  }, [allCropsEvaluation]);

  const isConditionsFavorable = favorableCrops.length > 0;

  // Build high-level summary alert text
  const alertSummary = useMemo(() => {
    if (isConditionsFavorable) {
      const topCropNames = favorableCrops.slice(0, 3).map(c => c.profile.cropName.split(' ')[0]).join(', ');
      return {
        title: `🌱 Sowing Alert: Conditions Favorable in ${selectedLocation.name}!`,
        message: `Dekad rainfall index (${effectiveDekadIndex}/100) satisfies threshold for ${favorableCrops.length} major crops (${topCropNames}). Soil moisture in ${selectedLocation.district} is primed for Pfumvudza sowing.`,
        severity: 'success' as const,
        badge: `Planting Green Light (${favorableCrops.length} Crops)`,
        actionLabel: 'Inspect Favorable Crops & Basin Spacing',
      };
    } else {
      return {
        title: `🌾 Dekad Soil Moisture Monitoring: ${selectedLocation.name}`,
        message: `Current Dekad index is ${effectiveDekadIndex}/100 for ${currentDekad.dekadLabel}. Awaiting verified planting rainfall (>25mm) before seed placement to prevent false emergence.`,
        severity: 'info' as const,
        badge: `Moisture Index: ${effectiveDekadIndex}/100`,
        actionLabel: 'View Planting Window Timeline',
      };
    }
  }, [isConditionsFavorable, selectedLocation.name, selectedLocation.district, effectiveDekadIndex, favorableCrops, currentDekad.dekadLabel]);

  const dismissAlert = useCallback(() => {
    setIsAlertDismissed(true);
  }, []);

  const reopenAlert = useCallback(() => {
    setIsAlertDismissed(false);
  }, []);

  const refreshTelemetry = useCallback(() => {
    loadWeather(true);
  }, [loadWeather]);

  return {
    location: selectedLocation,
    currentDekad,
    effectiveDekadIndex,
    liveWeather,
    isLoadingWeather,
    weatherSource: liveWeather?.source === 'Open-Meteo-Live' ? 'Open-Meteo-Live' : 'MSD-Baseline',
    isConditionsFavorable,
    favorableCropsCount: favorableCrops.length,
    totalEvaluatedCrops: MAJOR_ZIMBABWE_CROPS.length,
    favorableCrops,
    allCropsEvaluation,
    alertSummary,
    isAlertDismissed,
    dismissAlert,
    reopenAlert,
    refreshTelemetry,
  };
}
