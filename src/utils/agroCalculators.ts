import { CropRecommendation } from '../data/agronomyData';
import { ZimbabweLocation } from '../data/zimbabweLocations';

export interface YieldPredictionInput {
  crop: CropRecommendation;
  location: ZimbabweLocation;
  farmAreaHa: number; // e.g. 0.0625 for 1 Pfumvudza plot, or 1.0 for 1 ha
  rainfallReceivedMm: number;
  inputCompliancePercent: number; // 20% to 120% of recommended fertilizer
  pestSeverity: 'none' | 'light' | 'moderate' | 'severe';
  weedingTimeliness: 'optimal' | 'delayed_2w' | 'delayed_4w';
  isPfumvudzaTechnique: boolean; // 15% moisture conservation bonus
}

export interface YieldPredictionResult {
  predictedYieldTonHa: number;
  predictedTotalBags50kg: number;
  predictedGrossValueUsd: number;
  potentialMaxYieldTonHa: number;
  waterStressPenaltyPct: number;
  pestInfestationPenaltyPct: number;
  nutrientDeficitPenaltyPct: number;
  pfumvudzaBonusPct: number;
  confidenceRating: 'High' | 'Medium' | 'Low';
  advisoryCommentary: string;
}

export function calculatePredictedYield(input: YieldPredictionInput): YieldPredictionResult {
  const baseYield = input.crop.expectedYieldTonPerHa.avg;
  const maxPotential = input.crop.expectedYieldTonPerHa.high;

  // 1. Water Stress Penalty
  const reqMin = input.crop.rainfallRequirementMm.min;
  let waterStressFactor = 1.0;
  if (input.rainfallReceivedMm < reqMin) {
    const deficitRatio = (reqMin - input.rainfallReceivedMm) / reqMin;
    waterStressFactor = Math.max(0.25, 1.0 - (deficitRatio * 1.15));
  } else if (input.rainfallReceivedMm > input.crop.rainfallRequirementMm.max * 1.3) {
    // Waterlogging penalty
    waterStressFactor = 0.88;
  }
  const waterPenaltyPct = Math.round((1 - waterStressFactor) * 100);

  // 2. Fertilizer / Nutrient Factor
  let nutrientFactor = 1.0;
  if (input.inputCompliancePercent < 100) {
    nutrientFactor = 0.45 + (input.inputCompliancePercent / 100) * 0.55;
  } else {
    nutrientFactor = 1.0 + Math.min(0.15, (input.inputCompliancePercent - 100) * 0.005);
  }
  const nutrientPenaltyPct = Math.max(0, Math.round((1 - (input.inputCompliancePercent / 100)) * 55));

  // 3. Pest / Disease Penalty
  let pestPenaltyPct = 0;
  if (input.pestSeverity === 'light') pestPenaltyPct = 12;
  if (input.pestSeverity === 'moderate') pestPenaltyPct = 28;
  if (input.pestSeverity === 'severe') pestPenaltyPct = 52;
  const pestFactor = 1.0 - (pestPenaltyPct / 100);

  // 4. Weeding Timeliness
  let weedingFactor = 1.0;
  if (input.weedingTimeliness === 'delayed_2w') weedingFactor = 0.85;
  if (input.weedingTimeliness === 'delayed_4w') weedingFactor = 0.65;

  // 5. Pfumvudza conservation bonus (moisture trap basins + mulch)
  const pfumvudzaBonus = input.isPfumvudzaTechnique ? 1.18 : 1.0;
  const pfumvudzaBonusPct = input.isPfumvudzaTechnique ? 18 : 0;

  // Combined Yield
  let calculatedYield = baseYield * waterStressFactor * nutrientFactor * pestFactor * weedingFactor * pfumvudzaBonus;
  calculatedYield = Math.max(0.4, Math.min(maxPotential * (input.isPfumvudzaTechnique ? 1.15 : 1.0), calculatedYield));

  const totalTons = calculatedYield * input.farmAreaHa;
  const totalBags50kg = Math.round((totalTons * 1000) / 50);

  // Benchmark average price per bag (~$14.50 for white maize / $17.50 for sorghum)
  const pricePerBag = input.crop.category === 'Small Grain' ? 17.50 : input.crop.category === 'Legume' ? 32.00 : 14.50;
  const grossValueUsd = Math.round(totalBags50kg * pricePerBag);

  let confidenceRating: 'High' | 'Medium' | 'Low' = 'High';
  if (input.location.daysSinceLastRain > 10 || input.pestSeverity === 'severe') {
    confidenceRating = 'Medium';
  }

  let advisory = '';
  if (waterPenaltyPct > 30) {
    advisory = `Critical water stress detected (${input.rainfallReceivedMm}mm vs ${reqMin}mm needed). Deep mulching and Pfumvudza potholing are vital to hold moisture.`;
  } else if (pestPenaltyPct > 25) {
    advisory = `Pest pressure is severely depleting yield potential by -${pestPenaltyPct}%. Immediate application of registered Agricura Karate Zeon or wood ash is urgent.`;
  } else if (nutrientPenaltyPct > 20) {
    advisory = `Crop is nitrogen hungry. Adding split top-dressing (Ammonium Nitrate) while soil is damp can restore 1.5 to 2.5 tonnes/ha.`;
  } else {
    advisory = `Favorable conditions! Maintaining weed-free basins and routine scouting will lock in high Hurudza master farmer yields.`;
  }

  return {
    predictedYieldTonHa: Number(calculatedYield.toFixed(2)),
    predictedTotalBags50kg: totalBags50kg,
    predictedGrossValueUsd: grossValueUsd,
    potentialMaxYieldTonHa: Number(maxPotential.toFixed(2)),
    waterStressPenaltyPct: waterPenaltyPct,
    pestInfestationPenaltyPct: pestPenaltyPct,
    nutrientDeficitPenaltyPct: nutrientPenaltyPct,
    pfumvudzaBonusPct,
    confidenceRating,
    advisoryCommentary: advisory,
  };
}

export interface PostHarvestInputAnalysis {
  cropName: string;
  totalAreaHa: number;
  actualHarvestBags50kg: number;
  actualSellingPricePerBagUsd: number;
  seedCostUsd: number;
  compoundDFertilizerCostUsd: number;
  anTopDressingCostUsd: number;
  chemicalsAgrochemicalsCostUsd: number;
  laborAndHaulageCostUsd: number;
  appliedNitrogenKg: number;
}

export interface PostHarvestResult {
  totalRevenueUsd: number;
  totalRevenueZig: number;
  totalVariableCostsUsd: number;
  totalVariableCostsZig: number;
  netGrossMarginUsd: number;
  netGrossMarginZig: number;
  returnOnInvestmentPct: number;
  costPerBagUsd: number;
  profitPerBagUsd: number;
  breakEvenYieldBags: number;
  nitrogenUseEfficiencyKgPerKg: number; // kg grain per kg N
  efficiencyGrade: 'A+ Master Farmer (Hurudza)' | 'B Profitable' | 'C Marginal' | 'D Loss Making';
  efficiencyAdvice: string;
}

export function analyzePostHarvestPerformance(input: PostHarvestInputAnalysis, usdToZigRate = 28.5): PostHarvestResult {
  const totalRevenueUsd = input.actualHarvestBags50kg * input.actualSellingPricePerBagUsd;
  const totalRevenueZig = totalRevenueUsd * usdToZigRate;

  const totalVariableCostsUsd =
    input.seedCostUsd +
    input.compoundDFertilizerCostUsd +
    input.anTopDressingCostUsd +
    input.chemicalsAgrochemicalsCostUsd +
    input.laborAndHaulageCostUsd;
  const totalVariableCostsZig = totalVariableCostsUsd * usdToZigRate;

  const netGrossMarginUsd = totalRevenueUsd - totalVariableCostsUsd;
  const netGrossMarginZig = netGrossMarginUsd * usdToZigRate;

  const returnOnInvestmentPct = totalVariableCostsUsd > 0
    ? Math.round((netGrossMarginUsd / totalVariableCostsUsd) * 100)
    : 0;

  const costPerBagUsd = input.actualHarvestBags50kg > 0
    ? Number((totalVariableCostsUsd / input.actualHarvestBags50kg).toFixed(2))
    : 0;

  const profitPerBagUsd = Number((input.actualSellingPricePerBagUsd - costPerBagUsd).toFixed(2));

  const breakEvenYieldBags = input.actualSellingPricePerBagUsd > 0
    ? Math.ceil(totalVariableCostsUsd / input.actualSellingPricePerBagUsd)
    : 0;

  // Total grain in kg
  const totalGrainKg = input.actualHarvestBags50kg * 50;
  const nitrogenUseEfficiencyKgPerKg = input.appliedNitrogenKg > 0
    ? Number((totalGrainKg / input.appliedNitrogenKg).toFixed(1))
    : 0;

  let efficiencyGrade: 'A+ Master Farmer (Hurudza)' | 'B Profitable' | 'C Marginal' | 'D Loss Making' = 'B Profitable';
  let efficiencyAdvice = '';

  if (returnOnInvestmentPct >= 110 && costPerBagUsd <= 7.50) {
    efficiencyGrade = 'A+ Master Farmer (Hurudza)';
    efficiencyAdvice = `Outstanding performance! Your production cost of $${costPerBagUsd}/bag is well below the national commercial average of $9.20. Your Nitrogen Use Efficiency of ${nitrogenUseEfficiencyKgPerKg} kg grain/kg N indicates exceptional Pfumvudza placement.`;
  } else if (returnOnInvestmentPct >= 40) {
    efficiencyGrade = 'B Profitable';
    efficiencyAdvice = `Solid return of ${returnOnInvestmentPct}%. To push toward Hurudza level, optimize top-dressing split timing and integrate more kraal manure to shave $15-$20 off synthetic fertilizer bills.`;
  } else if (returnOnInvestmentPct >= 0) {
    efficiencyGrade = 'C Marginal';
    efficiencyAdvice = `Marginal margin ($${netGrossMarginUsd}). High input costs eroded margins. Consider bulk collective buying through your local farmer group (Nhimbe/Pfumvudza club) to secure agrochemical discounts.`;
  } else {
    efficiencyGrade = 'D Loss Making';
    efficiencyAdvice = `Loss incurred (-$${Math.abs(netGrossMarginUsd)}). Breakeven required ${breakEvenYieldBags} bags. Key remedies: soil pH test (acidic sand soils neutralize up to 50% of applied fertilizer), drought-tolerant varieties, and early moisture trapping.`;
  }

  return {
    totalRevenueUsd: Math.round(totalRevenueUsd),
    totalRevenueZig: Math.round(totalRevenueZig),
    totalVariableCostsUsd: Math.round(totalVariableCostsUsd),
    totalVariableCostsZig: Math.round(totalVariableCostsZig),
    netGrossMarginUsd: Math.round(netGrossMarginUsd),
    netGrossMarginZig: Math.round(netGrossMarginZig),
    returnOnInvestmentPct,
    costPerBagUsd,
    profitPerBagUsd,
    breakEvenYieldBags,
    nitrogenUseEfficiencyKgPerKg,
    efficiencyGrade,
    efficiencyAdvice,
  };
}

export interface LivestockPostHarvestInput {
  livestockType: 'Cattle' | 'Goat' | 'Poultry';
  headCount: number;
  feedAndLicksCostUsd: number;
  dippingAndVetCostUsd: number;
  laborAndShelterCostUsd: number;
  calvesOrKidsBorn: number;
  mortalityCount: number;
  salesRevenueUsd: number;
  finalHerdValuationUsd: number;
  initialHerdValuationUsd: number;
}

export interface LivestockPostHarvestResult {
  totalInputCostUsd: number;
  netEnterpriseProfitUsd: number;
  returnOnCapitalPct: number;
  weaningSurvivalRatePct: number;
  costPerHeadUsd: number;
  commentary: string;
}

export function analyzeLivestockPerformance(input: LivestockPostHarvestInput): LivestockPostHarvestResult {
  const totalInputCostUsd = input.feedAndLicksCostUsd + input.dippingAndVetCostUsd + input.laborAndShelterCostUsd;
  const assetValueChange = input.finalHerdValuationUsd - input.initialHerdValuationUsd;
  const totalGrossIncome = input.salesRevenueUsd + assetValueChange;
  const netEnterpriseProfitUsd = totalGrossIncome - totalInputCostUsd;

  const returnOnCapitalPct = input.initialHerdValuationUsd > 0
    ? Math.round((netEnterpriseProfitUsd / input.initialHerdValuationUsd) * 100)
    : 0;

  const totalBorn = input.calvesOrKidsBorn;
  const survivalCount = totalBorn - input.mortalityCount;
  const weaningSurvivalRatePct = totalBorn > 0 ? Math.round((Math.max(0, survivalCount) / totalBorn) * 100) : 100;
  const costPerHeadUsd = input.headCount > 0 ? Number((totalInputCostUsd / input.headCount).toFixed(2)) : 0;

  let commentary = '';
  if (weaningSurvivalRatePct >= 90) {
    commentary = `Superb herd health management! Survival rate of ${weaningSurvivalRatePct}% exceeds regional commercial benchmarks. Routine dipping prevented tick-borne attrition.`;
  } else if (weaningSurvivalRatePct >= 75) {
    commentary = `Good herd maintenance. Winter licks protected body condition, but mortality (${input.mortalityCount} head) suggests review of night predator kraaling or clostridial vaccination.`;
  } else {
    commentary = `High losses detected (${100 - weaningSurvivalRatePct}% mortality). Prioritize weekly dipping compliance and deworming before next wet season.`;
  }

  return {
    totalInputCostUsd: Math.round(totalInputCostUsd),
    netEnterpriseProfitUsd: Math.round(netEnterpriseProfitUsd),
    returnOnCapitalPct,
    weaningSurvivalRatePct,
    costPerHeadUsd,
    commentary,
  };
}
