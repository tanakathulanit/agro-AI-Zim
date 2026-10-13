/**
 * Planting & Harvest Planner Engine
 * Calculates region-calibrated calendars, fertilizer applications, and irrigation schedules.
 * Supports persistence, push/local alerts, and iCalendar (.ics) export.
 */

import { CropRecommendation } from '../data/agronomyData';
import { ZimbabweLocation } from '../data/zimbabweLocations';
import { REGION_CLIMATIC_CYCLES } from '../data/climaticCycles';

export type ReminderType = 'fertilization' | 'irrigation' | 'planting' | 'scouting' | 'harvest' | 'custom';

export interface PlannerReminder {
  id: string;
  title: string;
  type: ReminderType;
  scheduledDate: string; // YYYY-MM-DD
  stageDap: string; // e.g., "35 DAP (Knee-height)"
  dosageInstructions: string;
  criticalAlert: string;
  isCompleted: boolean;
  reminderActive: boolean;
  cropName: string;
  locationName: string;
  createdAt: string;
  notes?: string;
}

export interface PlannerMilestone {
  id: string;
  date: string; // YYYY-MM-DD
  dayOffset: number; // DAP relative to sowing
  title: string;
  type: ReminderType;
  stageName: string;
  description: string;
  recommendedInput: string;
  brandName: string;
  dosage: string;
  agritexAdvisory: string;
  weatherContext: string;
  isPassed: boolean;
  isToday: boolean;
}

export interface IrrigationMilestone {
  id: string;
  date: string;
  dap: number;
  stage: string;
  waterAmountMm: number;
  frequency: string;
  method: string;
  criticalRiskIfNotDone: string;
}

export interface FertilizationMilestone {
  id: string;
  date: string;
  dap: number;
  fertilizerName: string;
  brandProduct: string;
  dosagePerPlot: string;
  dosagePerHectare: string;
  applicationTechnique: string;
  timingRule: string;
}

export interface CropCalendarPlan {
  cropId: string;
  cropName: string;
  shonaName?: string;
  ndebeleName?: string;
  sowingDate: string;
  projectedHarvestDate: string;
  totalDurationDays: number;
  currentDap: number;
  currentSeasonPhase: string;
  location: ZimbabweLocation;
  farmingSystem: 'rainfed_pfumvudza' | 'conventional_rainfed' | 'supplementary_irrigation' | 'full_irrigation';
  milestones: PlannerMilestone[];
  reminders: PlannerReminder[];
  irrigationSchedule: IrrigationMilestone[];
  fertilizationSchedule: FertilizationMilestone[];
}

const STORAGE_KEY = 'hurudza_planner_reminders_v1';

/**
 * Helper to add days to a date string YYYY-MM-DD
 */
export function addDaysToDate(baseDateStr: string, days: number): string {
  const d = new Date(baseDateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Formats YYYY-MM-DD to friendly string like "18 Nov 2026"
 */
export function formatFriendlyDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Calculates day difference from today: negative = past, 0 = today, positive = upcoming
 */
export function getDaysDifferenceFromToday(dateStr: string): number {
  const [year, month, day] = dateStr.split('-');
  const target = new Date(Number(year), Number(month) - 1, Number(day));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Generates an agro-region synchronized Crop Calendar Plan
 */
export function generateCropCalendarPlan(
  crop: CropRecommendation,
  location: ZimbabweLocation,
  sowingDate: string,
  farmingSystem: 'rainfed_pfumvudza' | 'conventional_rainfed' | 'supplementary_irrigation' | 'full_irrigation' = 'rainfed_pfumvudza'
): CropCalendarPlan {
  const regionCycle = REGION_CLIMATIC_CYCLES[location.naturalRegion] || REGION_CLIMATIC_CYCLES['IIa'];
  const totalDurationDays = crop.maturityDays || 135;
  const projectedHarvestDate = addDaysToDate(sowingDate, totalDurationDays);

  const todayStr = new Date().toISOString().split('T')[0];
  const sowingDateObj = new Date(sowingDate);
  const todayObj = new Date(todayStr);
  const rawDiffDays = Math.round((todayObj.getTime() - sowingDateObj.getTime()) / (1000 * 60 * 60 * 24));
  const currentDap = Math.max(0, Math.min(totalDurationDays, rawDiffDays));

  // Determine current season name in Shona/Ndebele
  const currentMonth = todayObj.getMonth(); // 0-11
  let currentSeasonPhase = 'Zhizha / Ihlobo (Summer Rains)';
  if (currentMonth >= 7 && currentMonth <= 9) currentSeasonPhase = 'Chirimo / Isilimo (Land Prep & Basins)';
  else if (currentMonth >= 3 && currentMonth <= 4) currentSeasonPhase = 'Matsutso / Ukwindla (Harvest & Drying)';
  else if (currentMonth >= 5 && currentMonth <= 6) currentSeasonPhase = 'Chando / Ubusika (Cold Winter & Storage)';

  // Build Milestones
  const milestones: PlannerMilestone[] = [];
  const fertilizationSchedule: FertilizationMilestone[] = [];
  const irrigationSchedule: IrrigationMilestone[] = [];

  // 1. Land Prep & Basins (-21 DAP)
  const landPrepDate = addDaysToDate(sowingDate, -21);
  milestones.push({
    id: `ms-${crop.cropId}-prep`,
    date: landPrepDate,
    dayOffset: -21,
    title: 'Land Prep & Pfumvudza Basins',
    type: 'planting',
    stageName: 'Pre-Planting (Chirimo)',
    description: 'Dig 1,456 planting basins per 1/16 ha plot (15cm x 15cm x 15cm at 75cm x 60cm spacing). Collect dry grass mulch.',
    recommendedInput: 'Kraal Manure (5-8 tonnes/ha) or Compost + Grass Mulch',
    brandName: 'Local Organic Compost / Veld Grass',
    dosage: '1 double handful (approx 500g) of well-rotted manure per basin',
    agritexAdvisory: 'Mulching with grass stops soil temperature exceeding 35°C, reducing early seedling heat scorch.',
    weatherContext: `Region ${location.naturalRegion}: Daytime temperatures rising. ET0 is ~${regionCycle.monthlyClimaticData[0]?.evapotranspirationEt0MmPerDay || 5.2} mm/day.`,
    isPassed: landPrepDate < todayStr,
    isToday: landPrepDate === todayStr,
  });

  // 2. Basal Dressing Placement (-7 DAP to 0 DAP)
  const basalDate = addDaysToDate(sowingDate, -3);
  milestones.push({
    id: `ms-${crop.cropId}-basal`,
    date: basalDate,
    dayOffset: -3,
    title: 'Basal Fertilizer Application (Compound D)',
    type: 'fertilization',
    stageName: 'Pre-Planting Basal',
    description: 'Apply Compound D (7:14:7) at the bottom of each basin and cover with 2cm to 3cm of loose soil.',
    recommendedInput: 'Compound D (7% N, 14% P2O5, 7% K2O, 6.5% S)',
    brandName: 'Windmill / ZFC Compound D',
    dosage: '1 standard beer bottle cap (10g) per basin (approx. 200kg/ha)',
    agritexAdvisory: 'CRITICAL: Never let seed touch pure chemical fertilizer. The 2cm soil separation layer is essential to prevent seed embryo burning.',
    weatherContext: 'Pre-placement allows phosphorus to dissolve as soon as the first planting rainfall occurs.',
    isPassed: basalDate < todayStr,
    isToday: basalDate === todayStr,
  });

  fertilizationSchedule.push({
    id: `fert-basal`,
    date: basalDate,
    dap: -3,
    fertilizerName: 'Basal Compound D (7:14:7)',
    brandProduct: 'Windmill / ZFC Compound D',
    dosagePerPlot: '14.5 kg per standard Pfumvudza plot (1,456 basins)',
    dosagePerHectare: '200 - 300 kg / ha',
    applicationTechnique: 'Band/Basin placement at bottom, covered with 2cm soil buffer',
    timingRule: 'Apply 3 to 7 days before anticipated planting rains',
  });

  // 3. Sowing Day (0 DAP)
  milestones.push({
    id: `ms-${crop.cropId}-sow`,
    date: sowingDate,
    dayOffset: 0,
    title: `Sowing / Planting ${crop.name}`,
    type: 'planting',
    stageName: 'Planting Day (0 DAP)',
    description: `Plant 2 certified seeds per basin into moist soil at 5cm depth. If dry-planting, wait for verified 25-30mm rain.`,
    recommendedInput: `Certified Seed: ${crop.recommendedVarieties.slice(0, 2).join(' or ')}`,
    brandName: 'Seed Co / Pannar Certified Hybrid',
    dosage: '1.0 kg seed per standard plot (25 kg/ha)',
    agritexAdvisory: `Check rainfall threshold: Regional requirement is ${regionCycle.optimalPlantingWindow.rainTriggerMm3Days}mm over 3 days before covering.`,
    weatherContext: `Sowing window for Region ${location.naturalRegion}: ${regionCycle.optimalPlantingWindow.earliestDate} to ${regionCycle.optimalPlantingWindow.latestRecommendedDate}.`,
    isPassed: sowingDate < todayStr,
    isToday: sowingDate === todayStr,
  });

  // 4. Emergence & Thinning (14 DAP)
  const emergenceDate = addDaysToDate(sowingDate, 14);
  milestones.push({
    id: `ms-${crop.cropId}-emergence`,
    date: emergenceDate,
    dayOffset: 14,
    title: 'Seedling Emergence & Thinning',
    type: 'scouting',
    stageName: 'Establishment (14 DAP)',
    description: 'Thin basins to 1 strong seedling if rainfall is erratic, or leave 2 if moisture is abundant. Re-plant any empty gaps immediately.',
    recommendedInput: 'Manual hand roguing & gap-filling seed',
    brandName: 'Farm Labor / Certified Seed',
    dosage: 'Target population: 44,000 to 53,000 plants/ha',
    agritexAdvisory: 'Do not pull seedlings aggressively; pinch or snip weak seedlings at soil level to avoid tearing roots of the keeper.',
    weatherContext: 'Scout for cutworms and millipedes attacking tender hypocotyls.',
    isPassed: emergenceDate < todayStr,
    isToday: emergenceDate === todayStr,
  });

  // 5. 1st Weeding & Pest Scouting (21 DAP)
  const weedDate = addDaysToDate(sowingDate, 21);
  milestones.push({
    id: `ms-${crop.cropId}-weed1`,
    date: weedDate,
    dayOffset: 21,
    title: '1st Weeding & Fall Armyworm Scout',
    type: 'scouting',
    stageName: 'Early Vegetative (21 DAP)',
    description: 'Scout the crop for Fall Armyworm (Mhungu) pinhole damage in leaf funnels. Remove early weeds before they steal nitrogen.',
    recommendedInput: 'Agricura Karate Zeon or Ampligo + Hand weeding / Dutch hoe',
    brandName: 'Agricura Karate Zeon 5CS',
    dosage: '15ml in 15L knapsack sprayer directed into whorls',
    agritexAdvisory: 'Early weeding gives a 30% yield advantage. Spray pests before 9am or after 4pm when larvae are feeding.',
    weatherContext: 'Frequent morning humidity can trigger early fungal spores.',
    isPassed: weedDate < todayStr,
    isToday: weedDate === todayStr,
  });

  // 6. 1st Split Top Dressing (35 DAP - Knee Height)
  const topDress1Date = addDaysToDate(sowingDate, 35);
  milestones.push({
    id: `ms-${crop.cropId}-topdress1`,
    date: topDress1Date,
    dayOffset: 35,
    title: '1st Top Dressing (Ammonium Nitrate AN)',
    type: 'fertilization',
    stageName: 'Knee Height (35 DAP)',
    description: 'Apply Ammonium Nitrate (34.5% N) at knee-height stage right after rain when the soil is damp.',
    recommendedInput: 'Ammonium Nitrate (AN) 34.5% Nitrogen',
    brandName: 'Sable Chemicals / Windmill AN',
    dosage: '1 beer bottle cap (10g) per basin placed 5cm away from plant stem',
    agritexAdvisory: 'NEVER apply AN on bone-dry soil; the nitrogen will volatilize as ammonia gas into the air. Wait for soil dampness.',
    weatherContext: `Check Region ${location.naturalRegion} Dekad index: Soil moisture should be above 40% before AN top-dressing.`,
    isPassed: topDress1Date < todayStr,
    isToday: topDress1Date === todayStr,
  });

  fertilizationSchedule.push({
    id: `fert-top1`,
    date: topDress1Date,
    dap: 35,
    fertilizerName: '1st Top Dressing - Ammonium Nitrate (34.5% N)',
    brandProduct: 'Sable Chemicals / Windmill AN',
    dosagePerPlot: '14.5 kg per standard Pfumvudza plot (1,456 plants)',
    dosagePerHectare: '150 - 200 kg / ha',
    applicationTechnique: 'Surface spot placement 5cm-10cm from stalk, covered with mulch to minimize volatilization',
    timingRule: 'Apply at V5-V6 knee-height, strictly on moist soil after a shower',
  });

  // 7. 2nd Split Top Dressing (56 DAP - Pre-Tasseling)
  const topDress2Date = addDaysToDate(sowingDate, 56);
  milestones.push({
    id: `ms-${crop.cropId}-topdress2`,
    date: topDress2Date,
    dayOffset: 56,
    title: '2nd Top Dressing (Tasseling Booster)',
    type: 'fertilization',
    stageName: 'Pre-Tasseling (56 DAP)',
    description: 'Second split of Ammonium Nitrate (or urea) to boost cob elongation and grain sink potential.',
    recommendedInput: 'Ammonium Nitrate (AN 34.5% N)',
    brandName: 'Sable Chemicals AN',
    dosage: '1/2 to 1 beer bottle cap (5-10g) per basin if soil moisture allows',
    agritexAdvisory: 'If mid-season dry spell is severe in Region III/IV, withhold this second split until the next rain.',
    weatherContext: `Historical dry spell window in Region ${location.naturalRegion}: ${regionCycle.criticalDrySpellRiskWindow.period}.`,
    isPassed: topDress2Date < todayStr,
    isToday: topDress2Date === todayStr,
  });

  fertilizationSchedule.push({
    id: `fert-top2`,
    date: topDress2Date,
    dap: 56,
    fertilizerName: '2nd Top Dressing - Pre-Tasseling Nitrogen',
    brandProduct: 'Sable Chemicals AN',
    dosagePerPlot: '7.5 kg - 10 kg per standard plot',
    dosagePerHectare: '100 - 150 kg / ha',
    applicationTechnique: 'Side-dress placement between basins',
    timingRule: 'Apply at V10 pre-tassel stage if rain is steady',
  });

  // 8. Critical Flowering & Tasseling (65 DAP)
  const floweringDate = addDaysToDate(sowingDate, 65);
  milestones.push({
    id: `ms-${crop.cropId}-flower`,
    date: floweringDate,
    dayOffset: 65,
    title: 'Tasseling & Silking (Critical Moisture Phase)',
    type: 'irrigation',
    stageName: 'Reproductive (65 DAP)',
    description: 'Pollen shed and silk emergence. Water deficit during this 14-day window reduces final yield by up to 50%.',
    recommendedInput: 'Supplementary irrigation if rain pauses for more than 5 days',
    brandName: 'Solar Borehole / Gravity Canal / Drip',
    dosage: '35mm - 45mm water depth per week',
    agritexAdvisory: 'Keep basins moist. Ensure Pfumvudza mulch is intact to prevent evaporative water loss during hot midday sunshine.',
    weatherContext: 'Peak water demand phase (Crop coefficient Kc = 1.20). Daily crop transpiration exceeds 5.5mm.',
    isPassed: floweringDate < todayStr,
    isToday: floweringDate === todayStr,
  });

  // 9. Grain Dough Filling (90 DAP)
  const grainFillDate = addDaysToDate(sowingDate, 90);
  milestones.push({
    id: `ms-${crop.cropId}-grainfill`,
    date: grainFillDate,
    dayOffset: 90,
    title: 'Grain Filling (Milky to Hard Dough)',
    type: 'irrigation',
    stageName: 'Grain Fill (90 DAP)',
    description: 'Starch accumulating in kernels. Check for stalk rot and cob borers.',
    recommendedInput: 'Maintain soil moisture; stop nitrogen application',
    brandName: 'Field Inspection',
    dosage: '25mm - 30mm supplementary water if rain ceases prematurely',
    agritexAdvisory: 'Moisture stress now causes small, shriveled kernels and premature tip blanking.',
    weatherContext: `Transition towards autumn (Matsutso). Rainfall declining in Region ${location.naturalRegion}.`,
    isPassed: grainFillDate < todayStr,
    isToday: grainFillDate === todayStr,
  });

  // 10. Physiological Maturity - Black Layer (120 DAP)
  const maturityDate = addDaysToDate(sowingDate, Math.max(105, totalDurationDays - 15));
  milestones.push({
    id: `ms-${crop.cropId}-blacklayer`,
    date: maturityDate,
    dayOffset: totalDurationDays - 15,
    title: 'Physiological Maturity (Black Layer)',
    type: 'scouting',
    stageName: 'Maturity (Black Layer)',
    description: 'Black layer has formed at the tip of the maize kernel. Nutrient transfer is complete; crop is safe from frost or rain stoppage.',
    recommendedInput: 'Cut and stook or bend cobs downwards to shed rain showers',
    brandName: 'Manual Crop Stooking',
    dosage: 'N/A',
    agritexAdvisory: 'Bending cobs downwards prevents rainwater from penetrating the husk and causing cob rot (Diplodia / Fusarium).',
    weatherContext: 'Dry autumn days begin. Low humidity accelerates natural field drying.',
    isPassed: maturityDate < todayStr,
    isToday: maturityDate === todayStr,
  });

  // 11. Harvest Window (Maturity DAP)
  milestones.push({
    id: `ms-${crop.cropId}-harvest`,
    date: projectedHarvestDate,
    dayOffset: totalDurationDays,
    title: `Main Harvest: ${crop.name}`,
    type: 'harvest',
    stageName: 'Harvest & Field Curing',
    description: 'Harvest cobs/heads. Sun dry on clean tarpaulins or elevated drying cribs.',
    recommendedInput: 'Clean heavy-duty tarpaulins, sharp harvesting knives, grain bags',
    brandName: 'GMB / Grain Pro Storage Bags',
    dosage: `Expected yield: ${crop.expectedYieldTonPerHa.avg} tonnes/ha (${crop.pfumvudzaYieldBags.avg} bags/plot)`,
    agritexAdvisory: 'Do not shell immediately if grain moisture is above 13.5%. Premature bagging causes aflatoxin mold.',
    weatherContext: 'Dry Matsutso sunshine. Optimum period for sun-curing.',
    isPassed: projectedHarvestDate < todayStr,
    isToday: projectedHarvestDate === todayStr,
  });

  // 12. Shelling & Safe Storage (+10 days post-harvest)
  const storageDate = addDaysToDate(projectedHarvestDate, 10);
  milestones.push({
    id: `ms-${crop.cropId}-storage`,
    date: storageDate,
    dayOffset: totalDurationDays + 10,
    title: 'Shelling, Moisture Test & Storage Treatment',
    type: 'harvest',
    stageName: 'Post-Harvest Protection',
    description: 'Shell grain when moisture is verified <= 12.5% with salt-bottle test or GMB moisture meter. Dust with grain protectant.',
    recommendedInput: 'Pirimiphos-methyl + Permethrin grain dust (Actellic Gold / Chirindamatura)',
    brandName: 'Agricura Actellic Gold Dust',
    dosage: '50g sachet per 50kg bag of shelled grain (mix thoroughly)',
    agritexAdvisory: 'Treated grain in hermetic or clean woven bags protects against Large Grain Borer (Scania) for up to 12 months.',
    weatherContext: 'Winter season (Chando) conditions ensure cool, dry storage environment.',
    isPassed: storageDate < todayStr,
    isToday: storageDate === todayStr,
  });

  // Build Irrigation Schedule
  const irrigationNeeds = farmingSystem === 'full_irrigation' || farmingSystem === 'supplementary_irrigation';
  if (irrigationNeeds || regionCycle.irrigationGuidance.isIrrigationMandatory) {
    irrigationSchedule.push(
      {
        id: 'irrig-1',
        date: addDaysToDate(sowingDate, -2),
        dap: -2,
        stage: 'Pre-Planting Soaking',
        waterAmountMm: 35,
        frequency: 'Single application before sowing',
        method: 'Basin filling or drip line run for 3 hours',
        criticalRiskIfNotDone: 'Uneven germination and dry soil crusting around seed',
      },
      {
        id: 'irrig-2',
        date: addDaysToDate(sowingDate, 10),
        dap: 10,
        stage: 'Early Vegetative (V2)',
        waterAmountMm: 25,
        frequency: 'Every 5 to 7 days',
        method: 'Drip emitters or controlled furrow',
        criticalRiskIfNotDone: 'Seedling stunting; shallow root development',
      },
      {
        id: 'irrig-3',
        date: addDaysToDate(sowingDate, 35),
        dap: 35,
        stage: 'Knee Height (V6) Top Dressing Soak',
        waterAmountMm: 30,
        frequency: 'Immediately after AN application',
        method: 'Basin soak or drip line run',
        criticalRiskIfNotDone: 'Nitrogen fertilizer burn or gaseous volatilization',
      },
      {
        id: 'irrig-4',
        date: addDaysToDate(sowingDate, 62),
        dap: 62,
        stage: 'Tasseling & Silk Emergence (R1)',
        waterAmountMm: 45,
        frequency: 'Every 3 to 4 days during peak flowering',
        method: 'Full root-zone saturation (drip or sprinkler)',
        criticalRiskIfNotDone: 'CRITICAL: Silk desiccation leads to barren cobs and 50%+ yield wipeout',
      },
      {
        id: 'irrig-5',
        date: addDaysToDate(sowingDate, 85),
        dap: 85,
        stage: 'Kernel Blister to Dough (R3-R4)',
        waterAmountMm: 35,
        frequency: 'Every 5 days',
        method: 'Controlled irrigation',
        criticalRiskIfNotDone: 'Incomplete tip fill and light grain test weight',
      },
      {
        id: 'irrig-6',
        date: addDaysToDate(sowingDate, 110),
        dap: 110,
        stage: 'Final Cut-Off Irrigation',
        waterAmountMm: 20,
        frequency: 'Final pulse before black layer',
        method: 'Light basin watering',
        criticalRiskIfNotDone: 'Excessive late watering causes cob rot and delays drying',
      }
    );
  }

  // Create default reminders for crucial operations
  const reminders: PlannerReminder[] = [
    {
      id: `rem-${crop.cropId}-basal`,
      title: `Apply Compound D Basal Dressing - ${crop.name}`,
      type: 'fertilization',
      scheduledDate: basalDate,
      stageDap: 'Pre-Planting (-3 DAP)',
      dosageInstructions: '1 beer bottle cap (10g) of Compound D per basin, covered by 2cm soil layer.',
      criticalAlert: 'Place before rains so phosphorus is solubilized in the root zone.',
      isCompleted: basalDate < todayStr,
      reminderActive: true,
      cropName: crop.name,
      locationName: location.name,
      createdAt: todayStr,
    },
    {
      id: `rem-${crop.cropId}-plant`,
      title: `Sowing Window Opens - ${crop.name}`,
      type: 'planting',
      scheduledDate: sowingDate,
      stageDap: 'Day 0 (Sowing)',
      dosageInstructions: `Drop 2 certified seeds (${crop.recommendedVarieties[0]}) per basin into damp soil.`,
      criticalAlert: `Ensure minimum 25mm rain has fallen in ${location.name} before sowing.`,
      isCompleted: sowingDate < todayStr,
      reminderActive: true,
      cropName: crop.name,
      locationName: location.name,
      createdAt: todayStr,
    },
    {
      id: `rem-${crop.cropId}-top1`,
      title: `Apply 1st Top Dressing (Ammonium Nitrate AN) - ${crop.name}`,
      type: 'fertilization',
      scheduledDate: topDress1Date,
      stageDap: '35 DAP (Knee-height)',
      dosageInstructions: '1 beer bottle cap (10g) of AN per basin, placed 5cm away from stalk on damp soil.',
      criticalAlert: 'Must be applied immediately after a shower. Never apply onto dry soil.',
      isCompleted: topDress1Date < todayStr,
      reminderActive: true,
      cropName: crop.name,
      locationName: location.name,
      createdAt: todayStr,
    },
    {
      id: `rem-${crop.cropId}-irrig-flower`,
      title: `Critical Flowering Moisture Check - ${crop.name}`,
      type: 'irrigation',
      scheduledDate: floweringDate,
      stageDap: '65 DAP (Tasseling & Silking)',
      dosageInstructions: 'Inspect soil moisture depth. Apply 35mm supplementary irrigation or basin soaking if rain has paused.',
      criticalAlert: 'Water stress during this 10-day window causes permanent pollen death and barren cobs.',
      isCompleted: floweringDate < todayStr,
      reminderActive: true,
      cropName: crop.name,
      locationName: location.name,
      createdAt: todayStr,
    },
    {
      id: `rem-${crop.cropId}-harvest`,
      title: `Harvest & Field Drying Window - ${crop.name}`,
      type: 'harvest',
      scheduledDate: projectedHarvestDate,
      stageDap: `${totalDurationDays} DAP (Maturity)`,
      dosageInstructions: 'Harvest dry cobs/heads. Sun dry on clean tarpaulins until 12.5% safe grain moisture.',
      criticalAlert: 'Check grain moisture before shelling to avoid fungal aflatoxin contamination.',
      isCompleted: projectedHarvestDate < todayStr,
      reminderActive: true,
      cropName: crop.name,
      locationName: location.name,
      createdAt: todayStr,
    },
  ];

  return {
    cropId: crop.cropId,
    cropName: crop.name,
    shonaName: crop.shonaName,
    ndebeleName: crop.ndebeleName,
    sowingDate,
    projectedHarvestDate,
    totalDurationDays,
    currentDap,
    currentSeasonPhase,
    location,
    farmingSystem,
    milestones,
    reminders,
    irrigationSchedule,
    fertilizationSchedule,
  };
}

/**
 * Storage helpers for persisted custom & active reminders
 */
export function getSavedReminders(): PlannerReminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveReminders(reminders: PlannerReminder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  } catch (e) {
    console.error('Failed to save reminders to localStorage:', e);
  }
}

/**
 * Generates an iCalendar (.ics) formatted string for export to phone calendars
 */
export function exportCalendarToIcs(
  plan: CropCalendarPlan,
  farmerName = 'Hurudza Farmer'
): void {
  const nowStr = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const cleanCropName = plan.cropName.replace(/[^a-zA-Z0-9 ]/g, '');

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hurudza Agro-Advisory Zimbabwe//Planting Harvest Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Hurudza ${cleanCropName} Agro-Calendar`,
    `X-WR-TIMEZONE:Africa/Harare`,
  ];

  plan.milestones.forEach((ms) => {
    const dateFormatted = ms.date.replace(/-/g, '');
    const uid = `${ms.id}-${dateFormatted}@hurudza.agro.zw`;
    const summary = `[Hurudza] ${ms.title}`;
    const description = `Stage: ${ms.stageName}\\nInput: ${ms.recommendedInput}\\nDosage: ${ms.dosage}\\nAgritex Advisory: ${ms.agritexAdvisory}\\nLocation: ${plan.location.name} (Region ${plan.location.naturalRegion})`;

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${nowStr}`,
      `DTSTART;VALUE=DATE:${dateFormatted}`,
      `DTEND;VALUE=DATE:${dateFormatted}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${plan.location.name}, Zimbabwe`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'BEGIN:VALARM',
      'TRIGGER:-PT12H', // Alarm 12 hours before
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${summary}`,
      'END:VALARM',
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Hurudza_${cleanCropName.replace(/\s+/g, '_')}_Calendar_${plan.location.district}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
