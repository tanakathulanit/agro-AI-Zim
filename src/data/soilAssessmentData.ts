/**
 * Zimbabwe Soil Quality, Fertilizer Recommendation & Water Retention Database
 * Sourced from:
 * - Agritex (Department of Agricultural Technical and Extension Services) Field Handbooks
 * - Chemistry and Soil Research Institute (CSRI), Harare
 * - University of Zimbabwe Faculty of Agriculture & CIMMYT Southern Africa
 * - National Pfumvudza/Intwasa Conservation Agriculture Standards
 */

export type SoilTextureType = 'sandy' | 'loam' | 'clay';
export type NaturalRegionCode = 'I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V';

export interface SoilTextureDetails {
  id: SoilTextureType;
  name: string;
  shonaName: string;
  ndebeleName: string;
  tagline: string;
  sandPct: number;
  siltPct: number;
  clayPct: number;
  cecRangeCmol: string; // Cation Exchange Capacity
  bulkDensity: string;
  waterHoldingCapacityMmPerM: { min: number; max: number; average: number };
  infiltrationRateMmPerHour: number;
  infiltrationSpeedCategory: 'Rapid' | 'Moderate' | 'Slow';
  drainageRate: 'Excessive / Very Rapid' | 'Well Drained' | 'Slow / Prone to Waterlogging';
  nutrientLeachingRisk: 'Extreme' | 'Moderate' | 'Low / Nutrient Retentive';
  crustingSusceptibility: 'Low' | 'Moderate' | 'Severe';
  commonZimbabweLocations: string[];
  fieldFeelProfile: {
    dryFeel: string;
    moistFeel: string;
    ribbonLengthCm: string;
    stickiness: string;
  };
}

export const SOIL_TEXTURE_DATABASE: Record<SoilTextureType, SoilTextureDetails> = {
  sandy: {
    id: 'sandy',
    name: 'Sandy Soil (Granitic Sandveld)',
    shonaName: 'Ivhu reJecha (Mhungwe / Jecha)',
    ndebeleName: 'Umhlabathi weSihlabathi',
    tagline: 'Light, coarse-grained granite sands with rapid drainage and high leaching risk',
    sandPct: 82,
    siltPct: 10,
    clayPct: 8,
    cecRangeCmol: '2 - 6 cmol(+)/kg',
    bulkDensity: '1.55 - 1.65 g/cm³',
    waterHoldingCapacityMmPerM: { min: 60, max: 95, average: 75 },
    infiltrationRateMmPerHour: 38,
    infiltrationSpeedCategory: 'Rapid',
    drainageRate: 'Excessive / Very Rapid',
    nutrientLeachingRisk: 'Extreme',
    crustingSusceptibility: 'Low',
    commonZimbabweLocations: [
      'Chivi', 'Gutu', 'Buhera', 'Goromonzi (Sandveld parts)', 'Lupane', 
      'Marondera', 'Makoni south', 'Wedza', 'Zaka', 'Bikita'
    ],
    fieldFeelProfile: {
      dryFeel: 'Loose, gritty, falls apart completely through fingers without forming clumps.',
      moistFeel: 'Cannot be molded into a ball without crumbling. Highly abrasive and gritty feel.',
      ribbonLengthCm: 'No ribbon forms (< 0.5 cm). Crumbles immediately when pushed over thumb.',
      stickiness: 'Completely non-sticky; washes off hands with zero residue.'
    }
  },
  loam: {
    id: 'loam',
    name: 'Loam Soil (Fertile Red / Medium Alluvial)',
    shonaName: 'Ivhu reRondo / Dope rakanaka',
    ndebeleName: 'Umhlabathi weSidaka esiLungele ukulima',
    tagline: 'Balanced, crumbly, and nutrient-rich soil with optimal aeration and water storage',
    sandPct: 45,
    siltPct: 35,
    clayPct: 20,
    cecRangeCmol: '12 - 20 cmol(+)/kg',
    bulkDensity: '1.25 - 1.40 g/cm³',
    waterHoldingCapacityMmPerM: { min: 120, max: 165, average: 145 },
    infiltrationRateMmPerHour: 20,
    infiltrationSpeedCategory: 'Moderate',
    drainageRate: 'Well Drained',
    nutrientLeachingRisk: 'Moderate',
    crustingSusceptibility: 'Moderate',
    commonZimbabweLocations: [
      'Mazowe Valley', 'Chegutu', 'Norton', 'Rusape', 'Chipinge', 
      'Banket', 'Concession', 'Hartley', 'Macheke'
    ],
    fieldFeelProfile: {
      dryFeel: 'Soft, crumbly aggregates that crush with moderate pressure into fine floury crumbs.',
      moistFeel: 'Forms a firm, spongy ball that holds its shape. Neither too gritty nor too slippery.',
      ribbonLengthCm: 'Forms a medium ribbon of 2.5 - 4.0 cm before breaking under its own weight.',
      stickiness: 'Slightly sticky when wet, easily wiped off fingers.'
    }
  },
  clay: {
    id: 'clay',
    name: 'Clay Soil (Red Fersiallitic & Black Vertisol / Munyakwe)',
    shonaName: 'Ivhu reMunyakwe / Dhaka gobvu',
    ndebeleName: 'Isidaka esiNzima / Umhlabathi weDaka elilolaka',
    tagline: 'Heavy, dense soil rich in minerals with high water holding capacity and slow infiltration',
    sandPct: 22,
    siltPct: 28,
    clayPct: 50,
    cecRangeCmol: '25 - 45 cmol(+)/kg',
    bulkDensity: '1.10 - 1.25 g/cm³',
    waterHoldingCapacityMmPerM: { min: 165, max: 220, average: 195 },
    infiltrationRateMmPerHour: 6,
    infiltrationSpeedCategory: 'Slow',
    drainageRate: 'Slow / Prone to Waterlogging',
    nutrientLeachingRisk: 'Low / Nutrient Retentive',
    crustingSusceptibility: 'Severe',
    commonZimbabweLocations: [
      'Mazowe (Iron Duke / Glendale)', 'Bindura red soils', 'Kadoma', 'Kwekwe', 
      'Chiredzi vertisols', 'Middle Sabi', 'Centenary', 'Battlefields'
    ],
    fieldFeelProfile: {
      dryFeel: 'Hard as brick, difficult to break with bare hands. Forms wide surface cracks when dry.',
      moistFeel: 'Very plastic, malleable, and smooth like pottery clay. Highly cohesive ball.',
      ribbonLengthCm: 'Forms a long, shiny, flexible ribbon > 5 cm without breaking.',
      stickiness: 'Extremely sticky when wet; clings firmly to tools and boots.'
    }
  }
};

export interface CropNutrientDemand {
  id: string;
  name: string;
  shonaName: string;
  ndebeleName: string;
  baseBasalKgPerHa: number;
  baseTopKgPerHa: number;
  pfumvudzaBasinsPerPlot: number; // Standard is 1444 basins per 39m x 16m plot
  nutrientNeedsLevel: 'High Feeder' | 'Moderate Feeder' | 'Low Feeder / N-Fixer';
  recommendedBasalProduct: string;
  recommendedTopProduct: string;
}

export const CROPS_SOIL_CONFIG: Record<string, CropNutrientDemand> = {
  maize: {
    id: 'maize',
    name: 'Maize (Chibage / Umumbu)',
    shonaName: 'Chibage',
    ndebeleName: 'Umumbu',
    baseBasalKgPerHa: 300,
    baseTopKgPerHa: 250,
    pfumvudzaBasinsPerPlot: 1444,
    nutrientNeedsLevel: 'High Feeder',
    recommendedBasalProduct: 'Compound D (7:14:7) or Superfert Cereal Blend',
    recommendedTopProduct: 'Ammonium Nitrate (AN 34.5% N)'
  },
  sorghum_millet: {
    id: 'sorghum_millet',
    name: 'Sorghum & Pearl Millet (Mapfunde & Mhunga)',
    shonaName: 'Mapfunde / Mhunga',
    ndebeleName: 'Amabele / Inyawuthi',
    baseBasalKgPerHa: 150,
    baseTopKgPerHa: 120,
    pfumvudzaBasinsPerPlot: 1444,
    nutrientNeedsLevel: 'Moderate Feeder',
    recommendedBasalProduct: 'Compound D (7:14:7) + Compost',
    recommendedTopProduct: 'Ammonium Nitrate (AN 34.5% N) micro-dose'
  },
  legumes: {
    id: 'legumes',
    name: 'Groundnuts & Soya Beans (Nzungu & Soya)',
    shonaName: 'Nzungu / Nyimo / Soya',
    ndebeleName: 'Amazambane / Indlubu / Soya',
    baseBasalKgPerHa: 180,
    baseTopKgPerHa: 50,
    pfumvudzaBasinsPerPlot: 1444,
    nutrientNeedsLevel: 'Low Feeder / N-Fixer',
    recommendedBasalProduct: 'Single Super Phosphate (SSP 19% P₂O₅) + Gypsum for pegs',
    recommendedTopProduct: 'Inoculant Rhizobium (Minimal starter N only if deficient)'
  },
  sunflower: {
    id: 'sunflower',
    name: 'Sunflower (Pfurunzi / Imbonoswane)',
    shonaName: 'Pfurunzi',
    ndebeleName: 'Imbonoswane',
    baseBasalKgPerHa: 200,
    baseTopKgPerHa: 100,
    pfumvudzaBasinsPerPlot: 1444,
    nutrientNeedsLevel: 'Moderate Feeder',
    recommendedBasalProduct: 'Compound D (7:14:7) with Boron (B)',
    recommendedTopProduct: 'Ammonium Nitrate (AN 34.5% N)'
  },
  horticulture: {
    id: 'horticulture',
    name: 'Leaf Vegetables & Tomatoes (Muriwo & Madomasi)',
    shonaName: 'Muriwo / Madomasi',
    ndebeleName: 'Imbhida / Amatamatisi',
    baseBasalKgPerHa: 400,
    baseTopKgPerHa: 300,
    pfumvudzaBasinsPerPlot: 1444,
    nutrientNeedsLevel: 'High Feeder',
    recommendedBasalProduct: 'Compound S / Compound C (6:17:15) or Compound D',
    recommendedTopProduct: 'Calcium Ammonium Nitrate (CAN) or Potassium Nitrate'
  }
};

export interface FertilizerCalculationResult {
  // Basal Dressing
  basalProductName: string;
  basalKgPerHa: number;
  basalBags50kgPerHa: number;
  basalPerBasinGrams: number;
  basalBottleCapDose: string; // e.g. "1 level Crown Beer Bottle Cap (10g)"
  basalPlacementDepthCm: string; // e.g. "Banded 7-10 cm deep, 5 cm beside seed"
  basalTiming: string;
  
  // Top Dressing
  topProductName: string;
  topKgPerHa: number;
  topBags50kgPerHa: number;
  topPerBasinGrams: number;
  topBottleCapDose: string; // e.g. "1/2 cap (5g) split into 2-3 applications"
  splitSchedule: {
    splitNumber: number;
    timingDap: string;
    ratePct: number;
    basinGrams: number;
    bottleCapText: string;
    weatherTrigger: string;
  }[];
  nitrogenEfficiencyRatingPct: number; // Uptake efficiency based on soil and region
  leachingHazardWarning: string | null;

  // Organic Soil Builder & Liming
  kraalManureHandfulsPerBasin: number; // 1 handful is approx 500g
  kraalManureTonPerHa: number;
  dolomiteLimeRequired: boolean;
  dolomiteLimeRateTonPerHa: number;
  dolomiteLimeBasinGrams: number;
  termitariaAnthillGuidance: string | null;

  // Total Plot Requirements (Pfumvudza Plot 1444 basins)
  plotTotals: {
    basalKg: number;
    topKg: number;
    manureWheelbarrows: number;
    estimatedCostUsd: number;
  };
}

export interface WaterRetentionStrategyResult {
  waterHoldingCapacityLabel: string;
  whcMmPerM: number;
  drySpellSafetyDays: number; // Days soil moisture supports crop with zero rain
  evaporativeVulnerability: 'Very High' | 'High' | 'Moderate' | 'Low';
  
  // 4 Core Actionable Protocols
  mulchProtocol: {
    recommendedDepthCm: number;
    materials: string[];
    benefit: string;
    criticalRule: string;
  };
  harvestingTechnique: {
    title: string;
    method: string;
    dimensions: string;
    agritexDiagramDescription: string;
  };
  soilStructureAmendment: {
    strategyName: string;
    instructions: string;
    permanence: string;
  };
  drySpellBufferPlan: {
    title: string;
    actionSteps: string[];
  };
}

/**
 * Calculates customized fertilizer rates based on:
 * - Soil Texture (Sandy, Loam, Clay)
 * - Zimbabwe Natural Region (I, IIa, IIb, III, IV, V)
 * - Selected Crop
 * - Farm Scale Multiplier
 */
export function calculateCustomFertilizer(
  texture: SoilTextureType,
  region: NaturalRegionCode,
  cropId: string,
  plotCount: number = 1
): FertilizerCalculationResult {
  const crop = CROPS_SOIL_CONFIG[cropId] || CROPS_SOIL_CONFIG['maize'];

  // Base adjustments based on Natural Region rainfall & leaching potential
  let regionFactor = 1.0;
  let limeNeeded = false;
  let limeRate = 0;

  switch (region) {
    case 'I': // >1000mm, high leaching, acidic
      regionFactor = 1.15;
      limeNeeded = true;
      limeRate = texture === 'sandy' ? 1.5 : 2.5; // t/ha
      break;
    case 'IIa': // 750-1000mm, high potential
      regionFactor = 1.10;
      limeNeeded = texture === 'sandy';
      limeRate = 1.0;
      break;
    case 'IIb': // 700-800mm
      regionFactor = 1.0;
      limeNeeded = texture === 'sandy';
      limeRate = 0.8;
      break;
    case 'III': // 500-700mm, mid-season dry spells
      regionFactor = 0.85;
      limeNeeded = false;
      limeRate = 0;
      break;
    case 'IV': // 450-650mm, semi-arid
      regionFactor = 0.65; // High chemical fertilizer without rain causes crop burn
      limeNeeded = false;
      limeRate = 0;
      break;
    case 'V': // <450mm, arid
      regionFactor = 0.50; // Rely heavily on kraal manure, reduce synthetic N
      limeNeeded = false;
      limeRate = 0;
      break;
  }

  // Texture-specific modifiers
  let basalTextureMod = 1.0;
  let topTextureMod = 1.0;
  let splitsCount = 2;
  let nEfficiency = 65;
  let leachingWarning: string | null = null;
  let termitariaNote: string | null = null;
  let manureHandfuls = 1; // per basin
  let manureTon = 5;

  if (texture === 'sandy') {
    // Sands have very low CEC (2-6). They cannot hold large single doses of N.
    // Must split top dressing into 3 smaller micro-dosing applications to prevent leaching.
    basalTextureMod = 0.90; // Too much basal without organic matter washes away
    topTextureMod = 0.95;
    splitsCount = 3;
    nEfficiency = region === 'I' || region === 'IIa' ? 42 : 55;
    leachingWarning = 'Extreme Leaching Hazard: Coarse granitic sands cannot hold dissolved nitrogen during downpours. Never apply top dressing on dry soil or in a single large dose.';
    manureHandfuls = 2; // Mandatory to create cation exchange sites
    manureTon = 10;
    termitariaNote = 'Agritex Termitaria (Chulu) Practice: Mix 1-2 shovels of crushed anthill clay into sandy basins. This permanently increases cation exchange capacity (CEC) and doubles nutrient retention for 5+ seasons.';
  } else if (texture === 'clay') {
    // Clays have high CEC (25-45). They bind ammonium tightly, but can fix phosphorus.
    // Basal P must be banded close to roots.
    basalTextureMod = 1.15; // Higher basal placement to overcome P-fixation in red fersiallitic clays
    topTextureMod = 1.05;
    splitsCount = region === 'I' ? 2 : 1; // Can hold top dressing well
    nEfficiency = 78;
    manureHandfuls = 1;
    manureTon = 6;
    leachingWarning = region === 'I' ? 'Waterlogging Risk: Heavy clay soils in Region I can suffer nitrogen loss via denitrification when saturated. Ensure drainage.' : null;
  } else {
    // Loam
    basalTextureMod = 1.0;
    topTextureMod = 1.0;
    splitsCount = 2;
    nEfficiency = 82;
    manureHandfuls = 1;
    manureTon = 7;
  }

  const finalBasalKgPerHa = Math.round(crop.baseBasalKgPerHa * regionFactor * basalTextureMod);
  const finalTopKgPerHa = Math.round(crop.baseTopKgPerHa * regionFactor * topTextureMod);

  // Per basin calculation for 1 Hectare (~44,444 planting stations for Pfumvudza maize, or 1444 per 1/16 ha plot)
  // 1 standard Pfumvudza plot (624 m²) has exactly 1,444 basins.
  // Rate per basin = (kg/ha / 44,444 stations) * 1000 = grams per basin.
  const basalGramsPerBasin = Number(((finalBasalKgPerHa / 44444) * 1000).toFixed(1));
  const topGramsPerBasin = Number(((finalTopKgPerHa / 44444) * 1000).toFixed(1));

  // Determine bottle cap text
  // 1 standard crown beer bottle cap (Chigunwe) holds ~5g (level) or ~10g (heaped) of fertilizer.
  // Cup No. 5 = 5g, Cup No. 8 = 8g, Cup No. 30 = 30g.
  let basalCapText = '';
  if (basalGramsPerBasin <= 6) {
    basalCapText = '1 level beer bottle cap (5g) per basin';
  } else if (basalGramsPerBasin <= 11) {
    basalCapText = '1 heaped beer bottle cap (10g) per basin';
  } else if (basalGramsPerBasin <= 16) {
    basalCapText = '1.5 beer bottle caps (~15g) per basin';
  } else {
    basalCapText = '2 beer bottle caps (~20g) or 1 No. 30 Cup per basin';
  }

  let topCapText = '';
  if (topGramsPerBasin <= 6) {
    topCapText = '1 level beer bottle cap (5g) per basin total';
  } else if (topGramsPerBasin <= 11) {
    topCapText = '1 heaped beer bottle cap (10g) per basin total';
  } else {
    topCapText = '1.5 beer bottle caps (15g) per basin total';
  }

  // Generate split schedule
  const splitSchedule = [];
  if (splitsCount === 3) {
    // 3 splits for sandy soils
    splitSchedule.push({
      splitNumber: 1,
      timingDap: '21 - 28 DAP (Knee-high stage, 4-5 leaves)',
      ratePct: 35,
      basinGrams: Number((topGramsPerBasin * 0.35).toFixed(1)),
      bottleCapText: '1/3 beer bottle cap (~3.5g) placed 5cm from stalk',
      weatherTrigger: 'Apply within 24-48 hours after receiving at least 15mm of rain shower. Never apply to parched dry sand.'
    });
    splitSchedule.push({
      splitNumber: 2,
      timingDap: '42 - 49 DAP (Early stem elongation / 8 leaves)',
      ratePct: 40,
      basinGrams: Number((topGramsPerBasin * 0.40).toFixed(1)),
      bottleCapText: '1/2 beer bottle cap (~4g) banded in basin circle',
      weatherTrigger: 'Apply after steady soaking rain; avoid applying if a prolonged dry spell is forecasted.'
    });
    splitSchedule.push({
      splitNumber: 3,
      timingDap: '60 - 65 DAP (Just prior to tasseling / flowering)',
      ratePct: 25,
      basinGrams: Number((topGramsPerBasin * 0.25).toFixed(1)),
      bottleCapText: '1/4 beer bottle cap (~2.5g) top micro-dose',
      weatherTrigger: 'Crucial for grain filling! Only apply if subsoil has adequate moisture buffer.'
    });
  } else if (splitsCount === 2) {
    splitSchedule.push({
      splitNumber: 1,
      timingDap: '28 - 35 DAP (Knee-high, 5-6 leaves)',
      ratePct: 50,
      basinGrams: Number((topGramsPerBasin * 0.50).toFixed(1)),
      bottleCapText: '1/2 beer bottle cap (~5g) placed 7cm from plant',
      weatherTrigger: 'Apply into moist soil under mulch cover after rain.'
    });
    splitSchedule.push({
      splitNumber: 2,
      timingDap: '50 - 56 DAP (Early tasseling / boot stage)',
      ratePct: 50,
      basinGrams: Number((topGramsPerBasin * 0.50).toFixed(1)),
      bottleCapText: '1/2 beer bottle cap (~5g) covered with thin mulch layer',
      weatherTrigger: 'Check soil moisture before application. Withhold if crop shows mid-day leaf rolling.'
    });
  } else {
    // Single split for heavy clay in low/medium rainfall
    splitSchedule.push({
      splitNumber: 1,
      timingDap: '30 - 38 DAP (Active vegetative)',
      ratePct: 100,
      basinGrams: topGramsPerBasin,
      bottleCapText: '1 heaped beer bottle cap (~10g) banded 10cm from stalk',
      weatherTrigger: 'Clay binds ammonium ions well; apply when topsoil is moist.'
    });
  }

  // Plot totals (for 1444 basins per plot)
  const plotBasalKg = Number(((basalGramsPerBasin * 1444 * plotCount) / 1000).toFixed(1));
  const plotTopKg = Number(((topGramsPerBasin * 1444 * plotCount) / 1000).toFixed(1));
  const manureWheelbarrows = Math.round((manureHandfuls * 1444 * plotCount * 0.5) / 50); // 50kg wheelbarrow
  
  // Approximate input costs in Zimbabwe (USD benchmark: Compound D ~$36/50kg, AN ~$42/50kg)
  const estimatedCostUsd = Math.round((plotBasalKg * 0.72) + (plotTopKg * 0.84) + (limeNeeded ? 12 : 0));

  return {
    basalProductName: crop.recommendedBasalProduct,
    basalKgPerHa: finalBasalKgPerHa,
    basalBags50kgPerHa: Number((finalBasalKgPerHa / 50).toFixed(1)),
    basalPerBasinGrams: basalGramsPerBasin,
    basalBottleCapDose: basalCapText,
    basalPlacementDepthCm: texture === 'clay' 
      ? 'Band deeply at 8 - 10 cm depth, 5 cm beside planting station to prevent P-fixation'
      : 'Place at bottom of 15cm Pfumvudza basin, cover with 2cm barrier soil before seed',
    basalTiming: 'At basin preparation (Winter / September - October) before first effective rains',
    
    topProductName: crop.recommendedTopProduct,
    topKgPerHa: finalTopKgPerHa,
    topBags50kgPerHa: Number((finalTopKgPerHa / 50).toFixed(1)),
    topPerBasinGrams: topGramsPerBasin,
    topBottleCapDose: topCapText,
    splitSchedule,
    nitrogenEfficiencyRatingPct: nEfficiency,
    leachingHazardWarning: leachingWarning,

    kraalManureHandfulsPerBasin: manureHandfuls,
    kraalManureTonPerHa: manureTon,
    dolomiteLimeRequired: limeNeeded,
    dolomiteLimeRateTonPerHa: limeRate,
    dolomiteLimeBasinGrams: limeNeeded ? Number(((limeRate * 1000000 / 44444)).toFixed(1)) : 0,
    termitariaAnthillGuidance: termitariaNote,

    plotTotals: {
      basalKg: plotBasalKg,
      topKg: plotTopKg,
      manureWheelbarrows: Math.max(1, manureWheelbarrows),
      estimatedCostUsd
    }
  };
}

/**
 * Derives customized water retention and conservation agriculture tips
 * tailored to Soil Texture and Natural Region
 */
export function deriveWaterRetentionStrategy(
  texture: SoilTextureType,
  region: NaturalRegionCode
): WaterRetentionStrategyResult {
  const details = SOIL_TEXTURE_DATABASE[texture];
  const whcAverage = details.waterHoldingCapacityMmPerM.average;

  // Days of crop water security (how long soil stores plant-available water during dry spell)
  // Region evapotranspiration (ET0) rates: Region I = 3.5mm/d, II = 4.5mm/d, III = 5.5mm/d, IV = 6.5mm/d, V = 7.5mm/d
  let etRate = 4.5;
  if (region === 'I') etRate = 3.5;
  else if (region === 'IIa' || region === 'IIb') etRate = 4.5;
  else if (region === 'III') etRate = 5.5;
  else if (region === 'IV') etRate = 6.5;
  else if (region === 'V') etRate = 7.5;

  // Typical effective rooting depth in Pfumvudza basin = 0.45m
  const plantAvailableWaterMm = (whcAverage * 0.45 * 0.5); // 50% readily available water threshold (RAW)
  const drySpellDays = Math.max(3, Math.round(plantAvailableWaterMm / etRate));

  let vulnerability: 'Very High' | 'High' | 'Moderate' | 'Low' = 'Moderate';
  if (texture === 'sandy' && (region === 'IV' || region === 'V')) vulnerability = 'Very High';
  else if (texture === 'sandy' || region === 'IV' || region === 'V') vulnerability = 'High';
  else if (texture === 'clay' && region === 'I') vulnerability = 'Low';

  // Customized strategies
  let mulchStrategy = {
    recommendedDepthCm: 5,
    materials: ['Dry thatch grass (Uswa)', 'Maize stover (Maranje)', 'Sorghum stalks', 'Groundnut haulms'],
    benefit: 'Reduces surface evaporation by up to 60% and lowers root-zone soil temperature by 4-6°C.',
    criticalRule: 'Maintain minimum 30% soil cover before the first planting rains. Never burn crop residues.'
  };

  let harvestStrategy = {
    title: 'Standard Pfumvudza Basins with Mulch Blanket',
    method: 'Dig precise 15cm x 15cm x 15cm basins along the contour at 75cm row by 60cm basin spacing.',
    dimensions: '15cm depth × 15cm width × 15cm length (stores 3.3 liters of water per rain event)',
    agritexDiagramDescription: 'Basin acts as a micro-catchment sink capturing 100% of rain directly over the root zone with zero runoff.'
  };

  let amendmentStrategy = {
    strategyName: 'Organic Humus Sponge Building',
    instructions: 'Incorporate well-composted cattle manure or thermal compost into the root zone.',
    permanence: 'Annual application builds permanent soil aggregation.'
  };

  let drySpellPlan = {
    title: 'Mid-Season Dry Spell Emergency Buffer Protocol',
    actionSteps: [
      'Inspect mulch cover: Ensure all bare soil exposed by weeding is re-covered with dry grass.',
      'Shallow weed scraping: Slice weeds at ground level without inverting soil to avoid moisture loss.',
      'If prolonged dry spell exceeds 10 days in Region III/IV/V, prune bottom 2 senescent maize leaves to reduce transpiration.'
    ]
  };

  // Tailor based on Texture & Region
  if (texture === 'sandy') {
    mulchStrategy = {
      recommendedDepthCm: region === 'IV' || region === 'V' ? 8 : 6,
      materials: ['Thatch grass (Hyparrhenia)', 'Maize stover', 'Piliostigma / Combretum leaves', 'Reeds'],
      benefit: 'Sandy soil heats up rapidly and dries in 48 hours without cover. Mulch prevents sand baking and surface crusting.',
      criticalRule: 'Apply thick blanket mulch immediately after basin digging. In sandy soils, bare soil loses 5mm of moisture per day to solar radiation.'
    };

    harvestStrategy = {
      title: region === 'IV' || region === 'V' 
        ? 'Deep Pfumvudza Basins + Dead-Level Contour Infiltration'
        : 'In-Situ Basin Micro-Catchment with Sand Buffering',
      method: 'Dig basins slightly deeper (18-20cm) in dry regions. Backfill with 5cm kraal manure + compost sponge layer at the base.',
      dimensions: '20cm depth × 15cm width × 15cm length. Pair with dead-level contours on slopes > 2%.',
      agritexDiagramDescription: 'The bottom manure sponge traps gravity water before it leaches through coarse subsoil beyond roots.'
    };

    amendmentStrategy = {
      strategyName: 'Anthill (Chulu / Isidaka) Clay Amelioration',
      instructions: 'Collect termite mound / anthill soil during winter. Crush finely and place 1-2 standard shovels (2-3 kg) in every sandy basin mixed with kraal manure.',
      permanence: 'Permanent mineral transformation! Anthill clay adds active montmorillonite clay particles, raising water retention capacity by over 120% indefinitely.'
    };

    if (region === 'IV' || region === 'V') {
      drySpellPlan.actionSteps = [
        'Urgent: Do NOT apply any top dressing fertilizer during dry spell. Synthetic nitrogen pulls moisture from plant roots causing rapid scorching ("kunyura").',
        'Check basin mulch thickness: If mulch is under 6cm, cut fresh dry grass or small branches to shade basin rims.',
        'Maintain tied ridges between basins to trap any erratic convectional shower without losing a drop of runoff.',
        'If available, apply supplemental borehole/weir water directly into the basin bowl at dusk (2 liters per basin every 5 days).'
      ];
    }
  } else if (texture === 'clay') {
    mulchStrategy = {
      recommendedDepthCm: 4,
      materials: ['Maize stover', 'Soybean trash', 'Dry veld grass', 'Sunnhemp residues'],
      benefit: 'Prevents heavy clay from baking into rock-hard surface crust and checks wide shrink-swell cracking.',
      criticalRule: 'Avoid over-thick mulching (>8cm) in high rainfall Region I/II, which can cause excessive dampness and damping-off fungal disease.'
    };

    harvestStrategy = {
      title: region === 'I' || region === 'IIa'
        ? 'Raised Pfumvudza Beds or Drainage Furrows (Waterlogging Prevention)'
        : 'Potholed Basins for Clay Crusting Mitigation',
      method: region === 'I' || region === 'IIa'
        ? 'In high rainfall zones, create shallow drainage furrow along contour to discharge cyclone water while retaining moisture in basin roots.'
        : 'Dig standard 15cm basins. Break any sealed surface crust using a hand hoe before rains so water enters.',
      dimensions: '15cm depth × 15cm width. In Region I/II, space furrows every 3rd row.',
      agritexDiagramDescription: 'Controls soil aeration while preserving high deep-subsoil water reserves.'
    };

    amendmentStrategy = {
      strategyName: 'Crumb Structure & Gypsum / Organic Conditioning',
      instructions: 'Apply coarse organic compost or 200kg/ha Agricultural Gypsum (Calcium Sulfate) if clay is sodic or sticky. Gypsum flocculates tight clay particles into loose, aerated crumbs.',
      permanence: 'Improves water percolation and root penetration for 3-4 years.'
    };

    drySpellPlan.actionSteps = [
      'Heavy clay holds the highest water reserves (up to 16 days of water security). Do not panic during short dry spells.',
      'Surface crust inspection: Check if soil is forming wide cracks that tear fine crop root hairs. Scatter dry mulch into cracks to seal them.',
      'Weed aggressively: Weeds on clay soils have deep taproots that steal subsoil moisture quickly.',
      'Top dressing caution: Wait for soil cracks to reclose after rain before applying fertilizer.'
    ];
  } else {
    // Loam
    mulchStrategy = {
      recommendedDepthCm: 5,
      materials: ['Veld grass', 'Maize stover', 'Bean residue', 'Compost mulch'],
      benefit: 'Maintains ideal moisture equilibrium, preserving crumb aggregation and active earthworm biology.',
      criticalRule: 'Keep at least 40% mulch cover across all inter-row corridors.'
    };

    harvestStrategy = {
      title: 'Standard Precision Pfumvudza Basins',
      method: 'Standard 15cm × 15cm × 15cm basins aligned perfectly along the A-frame contour lines.',
      dimensions: '15cm depth × 15cm width × 15cm length at 75cm × 60cm spacing.',
      agritexDiagramDescription: 'Maximum water use efficiency (WUE) with minimal soil disturbance.'
    };

    amendmentStrategy = {
      strategyName: 'Crop Residue & Rotation Carbon Enrichment',
      instructions: 'Rotate cereals with nitrogen-fixing grain legumes (Cowpea/Soya) and leave 100% of legume biomass on the soil surface.',
      permanence: 'Sustained topsoil organic carbon (>2.5%).'
    };
  }

  return {
    waterHoldingCapacityLabel: `${details.waterHoldingCapacityMmPerM.min} - ${details.waterHoldingCapacityMmPerM.max} mm/m (${details.waterHoldingCapacityMmPerM.average} mm/m average)`,
    whcMmPerM: whcAverage,
    drySpellSafetyDays: drySpellDays,
    evaporativeVulnerability: vulnerability,
    mulchProtocol: mulchStrategy,
    harvestingTechnique: harvestStrategy,
    soilStructureAmendment: amendmentStrategy,
    drySpellBufferPlan: drySpellPlan
  };
}

/**
 * 3-Step Field Ribbon & Texture Test Guide
 * Helps smallholder farmers determine their soil type in the field without laboratory tools
 */
export interface RibbonTestStep {
  stepNumber: number;
  title: string;
  shonaTitle: string;
  ndebeleTitle: string;
  instruction: string;
  criteria: {
    observation: string;
    leadsToTexture: SoilTextureType | 'continue';
    nextActionOrResult: string;
  }[];
}

export const RIBBON_TEST_STEPS: RibbonTestStep[] = [
  {
    stepNumber: 1,
    title: 'The Ball Squeeze Test',
    shonaTitle: 'Danho 1: Kutsikitsira Bhora reIvhu',
    ndebeleTitle: 'Isigaba 1: Ukukhama Ibhola Lomhlabathi',
    instruction: 'Take a palmful of topsoil (from 10cm depth). Remove stones and grass roots. Slowly add drops of water until soil is moist like bread dough. Squeeze it firmly in your fist.',
    criteria: [
      {
        observation: 'Soil does not hold together at all; crumbles through fingers like sugar',
        leadsToTexture: 'sandy',
        nextActionOrResult: 'Confirmed: Pure Sand (Jecha / Sihlabathi). Very low water retention.'
      },
      {
        observation: 'Soil forms a ball that holds together when you open your hand',
        leadsToTexture: 'continue',
        nextActionOrResult: 'Proceed to Step 2: The Ribbon Roll Test.'
      }
    ]
  },
  {
    stepNumber: 2,
    title: 'The Ribbon Roll Test',
    shonaTitle: 'Danho 2: Kupeta Rupandi rweIvhu',
    ndebeleTitle: 'Isigaba 2: Ukugoqa i-Ribbon Yomhlabathi',
    instruction: 'Roll the moist soil ball into a cigar cylinder (about 1cm thick). Gently push the cylinder over your index finger using your thumb, letting it extend and hang until it breaks under its own weight.',
    criteria: [
      {
        observation: 'No ribbon forms (< 0.5 cm) or ribbon breaks immediately upon pushing',
        leadsToTexture: 'sandy',
        nextActionOrResult: 'Confirmed: Sandy Loam / Sandveld. Low CEC.'
      },
      {
        observation: 'Forms a medium ribbon between 2.5 cm and 4.0 cm before breaking',
        leadsToTexture: 'loam',
        nextActionOrResult: 'Confirmed: Loam / Sandy Clay Loam. Ideal balanced soil structure.'
      },
      {
        observation: 'Forms a long, strong, shiny ribbon > 5 cm without breaking',
        leadsToTexture: 'clay',
        nextActionOrResult: 'Confirmed: Heavy Clay / Munyakwe. High water holding capacity.'
      }
    ]
  },
  {
    stepNumber: 3,
    title: 'The Wet Grit Feel Confirmation',
    shonaTitle: 'Danho 3: Kunzwa Jecha neMutezo',
    ndebeleTitle: 'Isigaba 3: Ukuzwa Ubunxele Lobulula',
    instruction: 'Rub a pinch of wet soil between your thumb and forefinger with excess water.',
    criteria: [
      {
        observation: 'Feels distinctly sharp, gritty, and makes a scratching sound',
        leadsToTexture: 'sandy',
        nextActionOrResult: 'Sandy soil confirmed: Requires split fertilizer & anthill/manure.'
      },
      {
        observation: 'Feels smooth, floury, and neither dominant in grit nor heavily sticky',
        leadsToTexture: 'loam',
        nextActionOrResult: 'Loam soil confirmed: Standard Pfumvudza agronomic package.'
      },
      {
        observation: 'Feels very sticky, plastic, and stains skin with greasy residue',
        leadsToTexture: 'clay',
        nextActionOrResult: 'Clay soil confirmed: Watch for crusting; high P basal required.'
      }
    ]
  }
];
