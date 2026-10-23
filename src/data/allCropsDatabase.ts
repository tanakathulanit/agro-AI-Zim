/**
 * All Zimbabwe Seasonal Field Crops & Commercial Horticulture Database
 * Encompassing Cereals, Small Grains, Legumes, Oilseeds, Industrial Cash Crops,
 * Winter Irrigated Crops, and Commercial High-Value Horticulture / Market Gardening.
 * Formulated with national agronomy standards from DR&SS and Agritex Technical Handbooks.
 */

export interface InputScheduleItem {
  stage: string;
  timingDap: string;
  task: string;
  recommendedInput: string;
  brandName: string;
  applicationRate: string;
  pfumvudzaPlotRate: string;
  estimatedCostUsd: number;
  criticalAdvisory: string;
}

export interface CropRecommendation {
  cropId: string;
  name: string;
  shonaName?: string;
  ndebeleName?: string;
  category: 'Cereal' | 'Legume' | 'Oilseed' | 'Tuber' | 'Small Grain' | 'Horticulture' | 'Cash Crop';
  seasonType?: 'Summer Rainfed' | 'Winter Irrigated' | 'All Season / Year-Round' | 'Late Catch Crop';
  suitableRegions: ('I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V')[];
  recommendedVarieties: string[];
  rainfallRequirementMm: { min: number; max: number };
  maturityDays: number;
  expectedYieldTonPerHa: { low: number; avg: number; high: number };
  pfumvudzaYieldBags: { low: number; avg: number; high: number };
  suitabilityScore: number;
  suitabilityReason: string;
  plantingTriggerCondition: string;
  zeroToMaturitySchedule: InputScheduleItem[];
}

export const ALL_EXPANDED_CROPS: CropRecommendation[] = [
  // ==================== SUMMER CEREALS & CASH CROPS ====================
  {
    cropId: 'maize_early',
    name: 'Early Maturity Maize (Drought Escape)',
    shonaName: 'Chibage Chinosvika Kurumidza',
    ndebeleName: 'Umumbu Okuphangisayo',
    category: 'Cereal',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['IIb', 'III', 'IV'],
    recommendedVarieties: ['Seed Co SC 403 (Tsoko)', 'Seed Co SC 419', 'Seed Co SC 513', 'Pannar PAN 413'],
    rainfallRequirementMm: { min: 450, max: 700 },
    maturityDays: 120,
    expectedYieldTonPerHa: { low: 2.8, avg: 5.2, high: 7.5 },
    pfumvudzaYieldBags: { low: 9, avg: 15, high: 21 },
    suitabilityScore: 94,
    suitabilityReason: 'Fast vegetative cycle escapes mid-season dry spells and terminal drought in Regions III & IV.',
    plantingTriggerCondition: 'Plant on 22mm rainfall between 20 Nov and 20 Dec.',
    zeroToMaturitySchedule: [
      {
        stage: 'Basin Prep & Basal Fertilizer',
        timingDap: '-10 to 0 DAP',
        task: 'Dig Pfumvudza basins (15cm x 15cm x 15cm at 75cm x 60cm); add kraal manure and basal fertilizer.',
        recommendedInput: 'Compound D (7:14:7) (7:14:7)',
        brandName: 'Compound D (7:14:7) Basal',
        applicationRate: '250 kg/ha',
        pfumvudzaPlotRate: '1 beer bottle cap (10g) per basin covered by 2cm soil',
        estimatedCostUsd: 32.00,
        criticalAdvisory: 'Cover fertilizer with 2cm soil before dropping seed to prevent seedling root scorch.'
      },
      {
        stage: 'Sowing Certified Seed',
        timingDap: '0 DAP',
        task: 'Drop 2 seeds per basin; thin to 2 vigorous plants after 14 days.',
        recommendedInput: 'Certified Hybrid Seed',
        brandName: 'Seed Co SC 403 / SC 513',
        applicationRate: '20 - 25 kg/ha',
        pfumvudzaPlotRate: '1.2 kg per plot',
        estimatedCostUsd: 11.50,
        criticalAdvisory: 'Early varieties fill cobs quickly; keep basins weed-free during the first 30 days.'
      },
      {
        stage: 'Armyworm Scouting & Spray',
        timingDap: '10 to 14 DAP',
        task: 'Scout central whorls for early Fall Armyworm pinholes.',
        recommendedInput: 'Lambda-cyhalothrin 5CS',
        brandName: 'Karate Zeon 5CS',
        applicationRate: '100 ml/ha',
        pfumvudzaPlotRate: '10 ml per 15L knapsack',
        estimatedCostUsd: 5.50,
        criticalAdvisory: 'Spray directly into the central funnel whorl early morning or after 4:00 PM.'
      },
      {
        stage: 'Top Dressing (Knee-High)',
        timingDap: '28 to 35 DAP',
        task: 'Apply Ammonium Nitrate top dressing into moist soil.',
        recommendedInput: 'Ammonium Nitrate (AN 34.5% N)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '200 kg/ha',
        pfumvudzaPlotRate: '1 beer bottle cap (5g) per plant',
        estimatedCostUsd: 38.00,
        criticalAdvisory: 'Apply strictly into moist soil after rain, 5cm away from the stalk.'
      },
      {
        stage: 'Harvest & Grain Dusting',
        timingDap: '110 to 125 DAP',
        task: 'Harvest dry cobs; sun-dry to 12.5% moisture; treat with grain protectant dust.',
        recommendedInput: 'Grain Protectant Dust',
        brandName: 'Shumba Super Dust',
        applicationRate: '50g / 50kg bag',
        pfumvudzaPlotRate: '300g per harvest',
        estimatedCostUsd: 3.00,
        criticalAdvisory: 'Shell only when cob moisture is <= 12.5% to prevent mould and aflatoxin contamination.'
      }
    ]
  },
  {
    cropId: 'maize_ultra_early',
    name: 'Ultra-Early Maize (Chibage chekuchimbidza)',
    shonaName: 'Chibage chekuchimbidza',
    ndebeleName: 'Umumbu Wehlobo',
    category: 'Cereal',
    seasonType: 'Late Catch Crop',
    suitableRegions: ['IV', 'V'],
    recommendedVarieties: ['Seed Co SC 301', 'Seed Co SC 303', 'Agriseeds Tsoko Extreme'],
    rainfallRequirementMm: { min: 350, max: 550 },
    maturityDays: 105,
    expectedYieldTonPerHa: { low: 2.0, avg: 3.8, high: 5.0 },
    pfumvudzaYieldBags: { low: 7, avg: 12, high: 16 },
    suitabilityScore: 92,
    suitabilityReason: 'Matures in just 100-105 days. Ideal catch-crop for late rains in December/January in Beitbridge, Mwenezi, and Chiredzi.',
    plantingTriggerCondition: 'Can plant up to 05 January following 20mm soaking rain.',
    zeroToMaturitySchedule: [
      {
        stage: 'Basin Prep & Micro-Dosing',
        timingDap: '-5 to 0 DAP',
        task: 'Basin digging with 2 generous handfuls of cured kraal manure.',
        recommendedInput: 'Compound D + Kraal Compost',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '150 kg/ha',
        pfumvudzaPlotRate: 'Half bottle cap (5g) per basin',
        estimatedCostUsd: 20.00,
        criticalAdvisory: 'Kraal manure holds moisture in sandy soils during erratic rainy seasons.'
      },
      {
        stage: 'Planting',
        timingDap: '0 DAP',
        task: 'Sow 2 seeds per basin into moist soil; mulch heavily with dry veld grass.',
        recommendedInput: 'Seed Co SC 301 / SC 303 certified seed',
        brandName: 'Seed Co SC 301',
        applicationRate: '20 kg/ha',
        pfumvudzaPlotRate: '1 kg per plot',
        estimatedCostUsd: 11.00,
        criticalAdvisory: 'Do not plant in dry soil ahead of anticipated rain.'
      },
      {
        stage: 'Single Top Dressing',
        timingDap: '25 to 30 DAP',
        task: 'Apply micro-dose of Ammonium Nitrate.',
        recommendedInput: 'Ammonium Nitrate (AN)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '100 kg/ha',
        pfumvudzaPlotRate: 'Half bottle cap per plant station',
        estimatedCostUsd: 22.00,
        criticalAdvisory: 'If mid-season dry spell is active, withhold nitrogen until rain returns.'
      },
      {
        stage: 'Harvest',
        timingDap: '95 to 105 DAP',
        task: 'Early harvest before winter frost or Quelea bird incursions.',
        recommendedInput: 'Post-harvest grain protectant',
        brandName: 'Shumba Super Dust',
        applicationRate: '50g / 50kg bag',
        pfumvudzaPlotRate: '200g',
        estimatedCostUsd: 2.00,
        criticalAdvisory: 'Dry thoroughly on raised platforms.'
      }
    ]
  },
  {
    cropId: 'tobacco_cash_crop',
    name: 'Flue-Cured Virginia Tobacco (Gold Leaf)',
    shonaName: 'Fodya',
    ndebeleName: 'Igwayi',
    category: 'Cash Crop',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['IIa', 'IIb'],
    recommendedVarieties: ['Kutsaga KRK26', 'Kutsaga KRK66', 'Kutsaga T71', 'Kutsaga T72'],
    rainfallRequirementMm: { min: 750, max: 1050 },
    maturityDays: 140,
    expectedYieldTonPerHa: { low: 2.2, avg: 3.4, high: 4.8 },
    pfumvudzaYieldBags: { low: 15, avg: 25, high: 35 }, // Bales per ha
    suitabilityScore: 90,
    suitabilityReason: 'Zimbabwe’s top foreign currency earning crop ($2.80 - $4.50/kg at TIMB auction floors). Requires intensive management and curing barn access.',
    plantingTriggerCondition: 'Transplant hardened 15cm seedlings between 15 October (under water planting) and 15 November.',
    zeroToMaturitySchedule: [
      {
        stage: 'Float Tray Seedbed & Float Hygiene',
        timingDap: '-60 to -1 DAP',
        task: 'Sow certified pelleted seed into float trays filled with sterilized pine bark.',
        recommendedInput: 'Float Bed Hydrofert Fertilizer + Confidor 200SL seedbed drench',
        brandName: 'Hydrofert Float Fertilizer + Confidor 200SL',
        applicationRate: '150g per 200-cell tray',
        pfumvudzaPlotRate: '4 trays for smallholder 0.25 ha',
        estimatedCostUsd: 28.00,
        criticalAdvisory: 'Clip seedling leaves 3-4 times to build thick sturdy stems with dense root balls.'
      },
      {
        stage: 'Ridging & Basal Fertilizer Banding',
        timingDap: '0 DAP',
        task: 'Construct ridges at 1.2m spacing. Band Compound C along the ridge core.',
        recommendedInput: 'Compound C (5:15:12) or Tobacco High-K',
        brandName: 'Compound C (5:15:12) / Tobacco High-K Blend',
        applicationRate: '600 - 800 kg/ha',
        pfumvudzaPlotRate: '35g per planting station',
        estimatedCostUsd: 75.00,
        criticalAdvisory: 'High potassium and low chlorine are critical for top leaf burn and aroma.'
      },
      {
        stage: 'Nematode & Cutworm Protection',
        timingDap: '0 to 7 DAP',
        task: 'Water planting with 2-3 liters water per station containing nematicide.',
        recommendedInput: 'Fluopyram or Fenamiphos',
        brandName: 'Velum Prime 400SC (Fluopyram)',
        applicationRate: '625 ml/ha',
        pfumvudzaPlotRate: '15 ml per knapsack',
        estimatedCostUsd: 22.00,
        criticalAdvisory: 'Root-knot nematodes destroy tobacco root systems in light sandy soils.'
      },
      {
        stage: 'Top Dressing & Ridging Up',
        timingDap: '21 to 28 DAP',
        task: 'Apply Potassium Nitrate + Ammonium Nitrate split alongside the ridge; re-ridge.',
        recommendedInput: 'Potassium Nitrate (KNO3) + AN',
        brandName: 'Potassium Nitrate (KNO3)',
        applicationRate: '150 kg/ha KNO3 + 75 kg/ha AN',
        pfumvudzaPlotRate: '10g per plant',
        estimatedCostUsd: 48.00,
        criticalAdvisory: 'Re-ridge soil high around stalks to anchor plants and prevent waterlogging.'
      },
      {
        stage: 'Topping & Sucker Control',
        timingDap: '65 to 75 DAP',
        task: 'Break off flower heads at button stage; apply sucker control chemical immediately.',
        recommendedInput: 'Butralin 360SL sucker control',
        brandName: 'Torque 360SL / Super Sucker',
        applicationRate: '8 - 10 L/ha',
        pfumvudzaPlotRate: '300 ml per 15L knapsack',
        estimatedCostUsd: 35.00,
        criticalAdvisory: 'Uncontrolled suckers drain nicotine, reducing leaf weight and grade value by 50%.'
      },
      {
        stage: 'Reaping & Curing',
        timingDap: '90 to 140 DAP',
        task: 'Reap in primings (2-3 leaves at a time from bottom to top) as leaves turn lemon-yellow.',
        recommendedInput: 'Barn Curing Firewood / Coal / Rocket Barn',
        brandName: 'Fuel-Efficient Rocket Barn / Chita Barn',
        applicationRate: 'Calibrated barn heat',
        pfumvudzaPlotRate: 'Barn labor',
        estimatedCostUsd: 60.00,
        criticalAdvisory: 'Cure in 4 stages: yellowing (35-38°C), color fixing (40-48°C), leaf drying (50-60°C), and stem drying (68-71°C).'
      }
    ]
  },
  {
    cropId: 'cotton_cash_crop',
    name: 'Cotton / Donje (White Gold)',
    shonaName: 'Donje',
    ndebeleName: 'Ihwaba',
    category: 'Cash Crop',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['III', 'IV', 'V'],
    recommendedVarieties: ['Quton Albar SZ9314', 'Quton PM4', 'Quton Mahyco Hybrid'],
    rainfallRequirementMm: { min: 450, max: 700 },
    maturityDays: 150,
    expectedYieldTonPerHa: { low: 1.2, avg: 2.2, high: 3.5 },
    pfumvudzaYieldBags: { low: 8, avg: 16, high: 26 }, // 50kg seed cotton bales
    suitabilityScore: 92,
    suitabilityReason: 'Deep taproot withstands harsh heat and semi-arid conditions in Gokwe, Muzarabani, Checheche, and Sanyati.',
    plantingTriggerCondition: 'Plant on 25mm rain in late November or early December.',
    zeroToMaturitySchedule: [
      {
        stage: 'Seedbed Prep & Basal Dressing',
        timingDap: '-7 to 0 DAP',
        task: 'Plough and ridge at 90cm row spacing; apply basal fertilizer.',
        recommendedInput: 'Compound L or Compound D',
        brandName: 'Compound L (5:17:10 + B) (Cotton Blend)',
        applicationRate: '200 kg/ha',
        pfumvudzaPlotRate: '12 kg per plot',
        estimatedCostUsd: 26.00,
        criticalAdvisory: 'Band fertilizer along the furrow 5cm below delinted certified seed.'
      },
      {
        stage: 'Planting Delinted Certified Seed',
        timingDap: '0 DAP',
        task: 'Sow acid-delinted seed at 90cm x 30cm spacing; thin to 1 plant per station.',
        recommendedInput: 'Acid-delinted certified seed',
        brandName: 'Quton Albar SZ9314',
        applicationRate: '15 - 20 kg/ha',
        pfumvudzaPlotRate: '1.2 kg per plot',
        estimatedCostUsd: 14.00,
        criticalAdvisory: 'Delinted seed germinates faster and enables uniform plant spacing.'
      },
      {
        stage: 'Jassid & Aphid Scouting',
        timingDap: '21 to 35 DAP',
        task: 'Scout leaf undersides for sucking jassids and aphids causing leaf curling.',
        recommendedInput: 'Acetamiprid or Dimethoate',
        brandName: 'Dimethoate 40EC',
        applicationRate: '750 ml/ha',
        pfumvudzaPlotRate: '25 ml per 15L knapsack',
        estimatedCostUsd: 7.50,
        criticalAdvisory: 'Early season sucking pests dwarf seedlings and stop squaring.'
      },
      {
        stage: 'Top Dressing & Bollworm Pegging',
        timingDap: '50 to 65 DAP',
        task: 'Apply Ammonium Nitrate; scout for African Bollworm and Spiny Bollworm eggs.',
        recommendedInput: 'Ammonium Nitrate + Ampligo / Belt',
        brandName: 'Ammonium Nitrate (AN 34.5% N) + Ampligo',
        applicationRate: '100 kg/ha AN + 200 ml/ha Ampligo',
        pfumvudzaPlotRate: '5g AN/plant + 15ml Ampligo/knapsack',
        estimatedCostUsd: 32.00,
        criticalAdvisory: 'Spray immediately when 5 bollworm eggs or small larvae are spotted per 24 plants.'
      },
      {
        stage: 'Hand Picking & Grading',
        timingDap: '130 to 160 DAP',
        task: 'Hand-pick clean white bolls into separate sacks: Grade A (clean white) vs Grade D (stained).',
        recommendedInput: 'Clean Hessian or Cotton Bags (No Polypropylene)',
        brandName: 'Cottco Certified Woolpacks',
        applicationRate: 'Manual selective picking',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Never use plastic or polypropylene bags; plastic thread contamination leads to rejection at Cottco ginneries.'
      }
    ]
  },
  {
    cropId: 'winter_wheat',
    name: 'Winter Wheat (Irri-Crop)',
    shonaName: 'Gorosi reChando',
    ndebeleName: 'Ingqoloyi Yobusika',
    category: 'Cereal',
    seasonType: 'Winter Irrigated',
    suitableRegions: ['I', 'IIa', 'IIb', 'III'],
    recommendedVarieties: ['Seed Co SC Nduna', 'Seed Co SC Selective', 'Seed Co SC Smart', 'Kana'],
    rainfallRequirementMm: { min: 450, max: 600 }, // Under 100% irrigation
    maturityDays: 135,
    expectedYieldTonPerHa: { low: 5.0, avg: 7.2, high: 9.8 },
    pfumvudzaYieldBags: { low: 18, avg: 26, high: 36 },
    suitabilityScore: 95,
    suitabilityReason: 'Grown exclusively under winter irrigation (May-October). High national food security priority with guaranteed GMB purchase price ($450/tonne).',
    plantingTriggerCondition: 'Plant strictly between 01 May and 20 May under pre-irrigated seedbed.',
    zeroToMaturitySchedule: [
      {
        stage: 'Land Preparation & Basal Dressing',
        timingDap: '-7 to 0 DAP',
        task: 'Fine seedbed discing and rolling; broadcast and incorporate basal fertilizer.',
        recommendedInput: 'Compound D (7:14:7) (7:14:7) or Wheat Blend',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '400 - 500 kg/ha',
        pfumvudzaPlotRate: '30 kg per plot',
        estimatedCostUsd: 65.00,
        criticalAdvisory: 'Ensure soil pH is above 5.5; acidic soil drastically limits tillering.'
      },
      {
        stage: 'Planting & Sowing',
        timingDap: '0 DAP',
        task: 'Drill seed at 15-20cm row spacing, 2-3cm depth.',
        recommendedInput: 'Certified Seed Co Wheat Seed',
        brandName: 'Seed Co SC Nduna / SC Selective',
        applicationRate: '110 - 130 kg/ha',
        pfumvudzaPlotRate: '7.5 kg seed per plot',
        estimatedCostUsd: 18.00,
        criticalAdvisory: 'Never plant wheat deeper than 3cm; deep drilling reduces emergence by 30%.'
      },
      {
        stage: '1st Top Dressing (Tillering)',
        timingDap: '21 to 25 DAP',
        task: 'Apply 1st split of Ammonium Nitrate right before irrigation cycle.',
        recommendedInput: 'Ammonium Nitrate (AN 34.5% N)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '200 kg/ha',
        pfumvudzaPlotRate: '12 kg per plot',
        estimatedCostUsd: 38.00,
        criticalAdvisory: 'Timely nitrogen at tillering produces 4-6 heads per plant.'
      },
      {
        stage: 'Broadleaf Weed Spray',
        timingDap: '28 to 35 DAP',
        task: 'Spray selective broadleaf herbicide.',
        recommendedInput: 'MCPA 400SL or 2,4-D Amine',
        brandName: 'MCPA 400SL',
        applicationRate: '1.5 L/ha',
        pfumvudzaPlotRate: '60 ml per 15L knapsack',
        estimatedCostUsd: 8.50,
        criticalAdvisory: 'Apply at 4-5 leaf stage of wheat before boot stage.'
      },
      {
        stage: '2nd Top Dressing (Booting/Pipe Stage)',
        timingDap: '45 to 55 DAP',
        task: 'Apply 2nd split of nitrogen before wheat head emerges.',
        recommendedInput: 'Ammonium Nitrate (AN)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '150 - 200 kg/ha',
        pfumvudzaPlotRate: '10 kg per plot',
        estimatedCostUsd: 32.00,
        criticalAdvisory: 'Boosts grain protein content above 12% and enhances bread baking quality.'
      },
      {
        stage: 'Rust Fungicide & Grain Filling',
        timingDap: '65 to 80 DAP',
        task: 'Scout for Stripe Rust and Stem Rust on flag leaves.',
        recommendedInput: 'Tebuconazole + Trifloxystrobin',
        brandName: 'Nativo 300SC (Tebuconazole + Trifloxystrobin)',
        applicationRate: '500 ml/ha',
        pfumvudzaPlotRate: '25 ml per knapsack',
        estimatedCostUsd: 16.00,
        criticalAdvisory: 'Flag leaf generates 75% of grain carbohydrates; protect it from fungal rust.'
      },
      {
        stage: 'Combine Harvesting',
        timingDap: '125 to 140 DAP',
        task: 'Harvest in September/October before early onset of summer rains.',
        recommendedInput: 'Combine harvester with reel adjustments',
        brandName: 'Grain handling equipment',
        applicationRate: 'Mechanical harvest',
        pfumvudzaPlotRate: 'Manual or combine harvest',
        estimatedCostUsd: 40.00,
        criticalAdvisory: 'Rain on mature unharvested wheat triggers sprouting in ear, downgrading grain to animal feed.'
      }
    ]
  },
  {
    cropId: 'sunflower_oilseed',
    name: 'Sunflower / Penzura (High-Oil Seed)',
    shonaName: 'Penzura',
    ndebeleName: 'Imbilapila',
    category: 'Oilseed',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['IIb', 'III', 'IV', 'V'],
    recommendedVarieties: ['Seed Co SC Kilimo', 'Seed Co SC Siyanda', 'Pannar PAN 7351', 'Record'],
    rainfallRequirementMm: { min: 400, max: 650 },
    maturityDays: 105,
    expectedYieldTonPerHa: { low: 1.5, avg: 2.6, high: 3.8 },
    pfumvudzaYieldBags: { low: 6, avg: 11, high: 16 },
    suitabilityScore: 93,
    suitabilityReason: 'Tolerates heat and marginal soils; high edible oil content (42-45%) with strong local demand from oil expressers.',
    plantingTriggerCondition: 'Can be planted from early December up to mid-January as a catch crop.',
    zeroToMaturitySchedule: [
      {
        stage: 'Basin Prep & Basal Dressing',
        timingDap: '-5 to 0 DAP',
        task: 'Basins dug at 75cm x 30cm spacing; integrate Compound D.',
        recommendedInput: 'Compound D or Single Superphosphate',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '150 - 200 kg/ha',
        pfumvudzaPlotRate: '5g per basin station',
        estimatedCostUsd: 22.00,
        criticalAdvisory: 'Sunflower roots penetrate compacted subsoils; do not over-fertilize with nitrogen.'
      },
      {
        stage: 'Planting & Thinning',
        timingDap: '0 to 14 DAP',
        task: 'Sow 3 seeds per basin at 2-3cm depth; thin to 1 plant per station at 2 weeks.',
        recommendedInput: 'Certified hybrid sunflower seed',
        brandName: 'Seed Co Kilimo / PAN 7351',
        applicationRate: '5 - 6 kg/ha',
        pfumvudzaPlotRate: '350g per plot',
        estimatedCostUsd: 7.50,
        criticalAdvisory: 'Ensure accurate 1 plant per station; crowded sunflowers produce tiny heads with low oil.'
      },
      {
        stage: 'Single Top Dressing',
        timingDap: '30 DAP',
        task: 'Light top dressing of Ammonium Nitrate right before flower bud formation (star stage).',
        recommendedInput: 'Ammonium Nitrate (AN)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '100 kg/ha',
        pfumvudzaPlotRate: 'Half bottle cap per plant',
        estimatedCostUsd: 22.00,
        criticalAdvisory: 'Keep nitrogen modest to prevent lodging and fungal head rot.'
      },
      {
        stage: 'Bird Protection & Harvesting',
        timingDap: '90 to 105 DAP',
        task: 'Harvest when the back of head turns yellow-brown and bracts dry.',
        recommendedInput: 'Hand cutting and threshing over canvas',
        brandName: 'Natural solar curing',
        applicationRate: 'Manual harvesting',
        pfumvudzaPlotRate: 'Family labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Do not leave mature heads standing in fields; wild birds can consume entire crops.'
      }
    ]
  },
  {
    cropId: 'cowpeas_legume',
    name: 'Cowpeas / Nyemba / Indumba',
    shonaName: 'Nyemba',
    ndebeleName: 'Indumba',
    category: 'Legume',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['IIb', 'III', 'IV', 'V'],
    recommendedVarieties: ['IT18', 'CBC1', 'CBC2', 'Black Eye', 'Beitbridge Local'],
    rainfallRequirementMm: { min: 350, max: 600 },
    maturityDays: 85,
    expectedYieldTonPerHa: { low: 1.0, avg: 1.8, high: 2.8 },
    pfumvudzaYieldBags: { low: 4, avg: 8, high: 12 },
    suitabilityScore: 96,
    suitabilityReason: 'Extreme drought tolerance, dual-purpose leaves for vegetable greens (mufushwa), and fixes 40-70 kg N/ha into poor communal soils.',
    plantingTriggerCondition: 'Plant on 20mm rain between 01 Dec and 10 Jan.',
    zeroToMaturitySchedule: [
      {
        stage: 'Basin Prep & Phosphate Basal',
        timingDap: '-5 to 0 DAP',
        task: 'Pfumvudza basins or flat inter-row sowing.',
        recommendedInput: 'Single Superphosphate (SSP)',
        brandName: 'Single Superphosphate (SSP)',
        applicationRate: '100 kg/ha',
        pfumvudzaPlotRate: '5g per station',
        estimatedCostUsd: 14.00,
        criticalAdvisory: 'Phosphate stimulates vigorous root nodulation.'
      },
      {
        stage: 'Planting',
        timingDap: '0 DAP',
        task: 'Sow at 45cm x 15cm; 2-3 seeds per station.',
        recommendedInput: 'Certified cowpea seed',
        brandName: 'Seed Co / Agriseeds IT18',
        applicationRate: '20 - 25 kg/ha',
        pfumvudzaPlotRate: '1.5 kg per plot',
        estimatedCostUsd: 5.50,
        criticalAdvisory: 'Rapid emergence in 3-4 days in warm soil.'
      },
      {
        stage: 'Aphid & Pod Borer Scouting',
        timingDap: '30 to 45 DAP',
        task: 'Scout flowers and pods for black aphids and Maruca pod borers.',
        recommendedInput: 'Karate Zeon 5CS',
        brandName: 'Karate Zeon',
        applicationRate: '100 ml/ha',
        pfumvudzaPlotRate: '10 ml per 15L knapsack',
        estimatedCostUsd: 4.50,
        criticalAdvisory: 'Spray at early flowering; pod borers destroy young pods from the inside.'
      },
      {
        stage: 'Pod Harvest & Storage Protection',
        timingDap: '75 to 85 DAP',
        task: 'Hand-pick dry pods; dry to 11% moisture; treat with Shumba Super Dust against bruchid beetles.',
        recommendedInput: 'Storage Dust',
        brandName: 'Shumba Super Dust',
        applicationRate: '50g / 50kg bag',
        pfumvudzaPlotRate: '150g',
        estimatedCostUsd: 2.00,
        criticalAdvisory: 'Untreated cowpeas will be riddled with bean bruchid exit holes within 6 weeks.'
      }
    ]
  },
  {
    cropId: 'finger_millet_seasonal',
    name: 'Finger Millet / Rukweza / Zviyo',
    shonaName: 'Rukweza / Zviyo',
    ndebeleName: 'Uphoko',
    category: 'Small Grain',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['IIa', 'IIb', 'III', 'IV'],
    recommendedVarieties: ['FMV-1', 'FMV-2', 'Indigenous Red Pod'],
    rainfallRequirementMm: { min: 450, max: 750 },
    maturityDays: 125,
    expectedYieldTonPerHa: { low: 1.5, avg: 2.5, high: 3.8 },
    pfumvudzaYieldBags: { low: 6, avg: 10, high: 15 },
    suitabilityScore: 94,
    suitabilityReason: 'Nutritional super-grain rich in calcium and iron. Can be stored safely in granaries for 10 years without weevil damage.',
    plantingTriggerCondition: 'Plant on early November/December rains in fine firm seedbed.',
    zeroToMaturitySchedule: [
      {
        stage: 'Fine Seedbed Prep & Manure',
        timingDap: '-7 to 0 DAP',
        task: 'Prepare fine crumb seedbed; incorporate kraal compost.',
        recommendedInput: 'Compost + Compound D',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '150 kg/ha',
        pfumvudzaPlotRate: '5g per station',
        estimatedCostUsd: 18.00,
        criticalAdvisory: 'Tiny seeds require a fine, firm seedbed; do not leave clods.'
      },
      {
        stage: 'Sowing (Sand Dilution Method)',
        timingDap: '0 DAP',
        task: 'Mix 1 part tiny millet seed with 3 parts dry river sand; dribble along shallow furrows (1cm deep).',
        recommendedInput: 'Certified FMV-1 seed',
        brandName: 'Seed Co / National Genebank FMV-1',
        applicationRate: '5 kg/ha',
        pfumvudzaPlotRate: '300g seed mixed with sand',
        estimatedCostUsd: 4.50,
        criticalAdvisory: 'Never bury seed deeper than 1cm; deep planting prevents emergence.'
      },
      {
        stage: 'Early Weeding & Thinning',
        timingDap: '21 to 28 DAP',
        task: 'Hand weed aggressively; small millet seedlings are easily out-competed by grass weeds.',
        recommendedInput: 'Hand weeding / Thinning',
        brandName: 'Manual labor',
        applicationRate: 'Labor',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Distinguish finger millet seedlings from wild Eleusine grass (Rapoko grass).'
      },
      {
        stage: 'Harvest',
        timingDap: '115 to 130 DAP',
        task: 'Cut dry brown finger-heads; sun-dry and thresh with sticks on clean smeared floors.',
        recommendedInput: 'Threshing equipment',
        brandName: 'Traditional storage',
        applicationRate: 'Natural drying',
        pfumvudzaPlotRate: 'Family labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Stores securely in traditional granaries for up to 10 years without pesticides.'
      }
    ]
  },

  // ==================== COMMERCIAL HORTICULTURE CROPS ====================
  {
    cropId: 'tomatoes_horticulture',
    name: 'Tomatoes / Tamati (High-Value Market)',
    shonaName: 'Tamati',
    ndebeleName: 'Utamatisi',
    category: 'Horticulture',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['I', 'IIa', 'IIb', 'III', 'IV'],
    recommendedVarieties: ['Roma VF', 'Rodade', 'Daisy F1 (Determinate)', 'Star 9037', 'Nandi F1'],
    rainfallRequirementMm: { min: 500, max: 700 }, // Under furrow or drip irrigation
    maturityDays: 75, // Days from transplanting
    expectedYieldTonPerHa: { low: 35.0, avg: 60.0, high: 95.0 },
    pfumvudzaYieldBags: { low: 120, avg: 220, high: 350 }, // Standard 10kg wooden crates per 0.06 ha plot
    suitabilityScore: 95,
    suitabilityReason: 'Highest daily cash-flow vegetable in Zimbabwe. Huge demand at Mbare Musika, Renkini, fast food outlets, and local schools ($8 - $16 per wooden crate).',
    plantingTriggerCondition: 'Transplant 4-5 week seedlings year-round with irrigation. Avoid heavy frost in July.',
    zeroToMaturitySchedule: [
      {
        stage: 'Nursery / Seedling Float Trays',
        timingDap: '-30 to 0 DAP',
        task: 'Raise seedlings in 200-cell polystyrene trays with sterilized peat moss/bark.',
        recommendedInput: 'Certified F1 Tomato Seed + Velum Prime',
        brandName: 'Daisy F1 + Velum Prime (Fluopyram)',
        applicationRate: '200 - 250 g/ha',
        pfumvudzaPlotRate: '1,500 seedlings',
        estimatedCostUsd: 25.00,
        criticalAdvisory: 'Drench trays with Confidor 2 days before transplanting to prevent viral leaf curl transmitted by whiteflies.'
      },
      {
        stage: 'Transplanting & Basal Fertilizer',
        timingDap: '0 DAP',
        task: 'Transplant at 1.0m row spacing x 40cm in-row; apply Compound C.',
        recommendedInput: 'Compound C (5:15:12) (5:15:12) + Manure',
        brandName: 'Compound C (5:15:12)',
        applicationRate: '800 kg/ha',
        pfumvudzaPlotRate: '30g per transplant station',
        estimatedCostUsd: 55.00,
        criticalAdvisory: 'Water thoroughly immediately after transplanting to establish root contact.'
      },
      {
        stage: 'Trellising, Staking & Pruning',
        timingDap: '14 to 28 DAP',
        task: 'Stake indeterminate varieties with wooden poles and baling twine; prune suckers.',
        recommendedInput: 'Trellis twine & Eucalyptus poles',
        brandName: 'Trellis Infrastructure',
        applicationRate: 'Materials',
        pfumvudzaPlotRate: 'Plot staking',
        estimatedCostUsd: 20.00,
        criticalAdvisory: 'Staking keeps fruit off the soil, preventing fruit rot and improving spray coverage.'
      },
      {
        stage: 'Fungicide & Tuta Absoluta Spray',
        timingDap: '21 to 65 DAP',
        task: 'Weekly alternating spray against Late Blight and Tuta Absoluta.',
        recommendedInput: 'Dithane M-45 alternating with Ridomil Gold + Prove 1.92EC',
        brandName: 'Dithane M-45 + Prove',
        applicationRate: '2 kg/ha Dithane + 300 ml/ha Prove',
        pfumvudzaPlotRate: '40g Dithane + 15ml Prove per 15L knapsack',
        estimatedCostUsd: 38.00,
        criticalAdvisory: 'Spray immediately before rainy spells; Late Blight can destroy 100% of tomato crops within 4 days.'
      },
      {
        stage: 'Foliar Calcium (Anti-Blossom End Rot)',
        timingDap: '35 to 70 DAP',
        task: 'Spray foliar calcium weekly during fruit expansion.',
        recommendedInput: 'CalMax (Calcium + Boron) (Calcium + Boron)',
        brandName: 'CalMax (Calcium + Boron)',
        applicationRate: '3 L/ha',
        pfumvudzaPlotRate: '50 ml per 15L knapsack',
        estimatedCostUsd: 12.00,
        criticalAdvisory: 'Prevents black sunken Blossom End Rot scars at the bottom of tomato fruits.'
      },
      {
        stage: 'Staggered Harvesting',
        timingDap: '70 to 110 DAP',
        task: 'Pick every 3-4 days at breaker stage (first pink blush) for long transport; pack in standard wooden crates.',
        recommendedInput: 'Harvest Crates',
        brandName: 'Standard Mbare Wooden Sandal Crates',
        applicationRate: 'Manual picking',
        pfumvudzaPlotRate: 'Family labor',
        estimatedCostUsd: 15.00,
        criticalAdvisory: 'Handle gently; avoid dropping fruits into crates to prevent bruising and transit rot.'
      }
    ]
  },
  {
    cropId: 'cabbages_horticulture',
    name: 'Cabbages / Kavheji (Heavy Market Head)',
    shonaName: 'Kavheji',
    ndebeleName: 'Iklabishi',
    category: 'Horticulture',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['I', 'IIa', 'IIb', 'III', 'IV'],
    recommendedVarieties: ['Star 3301', 'Star 3311', 'Marcanta F1', 'Megaton F1', 'Copenhagen Market'],
    rainfallRequirementMm: { min: 450, max: 650 },
    maturityDays: 80, // From transplanting
    expectedYieldTonPerHa: { low: 40.0, avg: 65.0, high: 90.0 },
    pfumvudzaYieldBags: { low: 1800, avg: 2400, high: 3200 }, // Individual heads per 0.06 ha plot
    suitabilityScore: 94,
    suitabilityReason: 'Year-round staple across Zimbabwe. Resilient transport qualities and steady market pricing ($0.50 - $1.00 per head).',
    plantingTriggerCondition: 'Transplant 4-week seedlings year-round with irrigation.',
    zeroToMaturitySchedule: [
      {
        stage: 'Transplanting & Basal Fertilizer',
        timingDap: '0 DAP',
        task: 'Transplant at 60cm x 45cm spacing (approx 37,000 plants/ha); apply basal Compound C.',
        recommendedInput: 'Compound C (5:15:12) or Compound D',
        brandName: 'Compound C (5:15:12)',
        applicationRate: '600 kg/ha',
        pfumvudzaPlotRate: '20g per planting hole',
        estimatedCostUsd: 45.00,
        criticalAdvisory: 'Thoroughly mix basal fertilizer with soil before inserting root plug.'
      },
      {
        stage: 'Diamondback Moth (DBM) & Aphid Control',
        timingDap: '14 to 35 DAP',
        task: 'Scout under leaves for DBM larvae and mealy cabbage aphids.',
        recommendedInput: 'Karate Zeon or Ampligo + Agral 90',
        brandName: 'Karate Zeon 5CS + Agral 90',
        applicationRate: '150 ml/ha Karate + 100 ml Agral 90',
        pfumvudzaPlotRate: '15 ml Karate + 10 ml Agral 90 per knapsack',
        estimatedCostUsd: 8.50,
        criticalAdvisory: 'Cabbage leaves have thick wax; always include Agral 90 sticker so spray does not roll off.'
      },
      {
        stage: '1st Top Dressing (Rosette Stage)',
        timingDap: '21 DAP',
        task: 'Apply 1st split of Ammonium Nitrate.',
        recommendedInput: 'Ammonium Nitrate (AN 34.5% N)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '200 kg/ha',
        pfumvudzaPlotRate: '5g per plant',
        estimatedCostUsd: 35.00,
        criticalAdvisory: 'Cabbage is a heavy nitrogen consumer; apply when soil is moist.'
      },
      {
        stage: '2nd Top Dressing (Head Cupping Stage)',
        timingDap: '42 DAP',
        task: 'Apply 2nd split of Ammonium Nitrate as central leaves cup together.',
        recommendedInput: 'Ammonium Nitrate (AN)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '200 kg/ha',
        pfumvudzaPlotRate: '5g per plant',
        estimatedCostUsd: 35.00,
        criticalAdvisory: 'Crucial for solid head density; skips result in loose, puffy, unsellable heads.'
      },
      {
        stage: 'Harvest',
        timingDap: '75 to 90 DAP',
        task: 'Harvest when heads are rock-hard when pressed with thumb.',
        recommendedInput: 'Sharp harvest knife',
        brandName: 'Direct field cutting',
        applicationRate: 'Manual cutting',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Leave 3-4 outer green wrapper leaves to protect the white head during open truck transport to Mbare.'
      }
    ]
  },
  {
    cropId: 'potatoes_horticulture',
    name: 'Irish Potatoes / Mbatatisi',
    shonaName: 'Mbatatisi',
    ndebeleName: 'Amagwinya',
    category: 'Tuber',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['I', 'IIa', 'IIb'],
    recommendedVarieties: ['BP1', 'Montclare', 'Mondial', 'Amigo', 'Valor'],
    rainfallRequirementMm: { min: 500, max: 800 },
    maturityDays: 110,
    expectedYieldTonPerHa: { low: 25.0, avg: 40.0, high: 60.0 },
    pfumvudzaYieldBags: { low: 120, avg: 200, high: 300 }, // 15kg potato pockets per plot
    suitabilityScore: 92,
    suitabilityReason: 'Extremely high profit potential ($8 - $14 per 15kg pocket). Thrives in well-drained red clay and sandy loams with reliable water.',
    plantingTriggerCondition: 'Three planting seasons in Zimbabwe: First crop (Nov/Dec summer), Second crop (Feb/Mar autumn), Third crop (Jul/Aug winter frost-free).',
    zeroToMaturitySchedule: [
      {
        stage: 'Land Prep & High Phosphate Basal',
        timingDap: '-7 to 0 DAP',
        task: 'Plough deeply (30cm) to create clod-free soil; open 90cm furrows.',
        recommendedInput: 'Compound S (7:21:8 + 9S + 0.1B) (7:21:7) or Potato Blend',
        brandName: 'Compound S (7:21:8 + 9S + 0.1B)',
        applicationRate: '1,000 - 1,200 kg/ha',
        pfumvudzaPlotRate: '60 kg per plot',
        estimatedCostUsd: 110.00,
        criticalAdvisory: 'Potatoes have shallow roots; heavy basal phosphate placement in the furrow is mandatory.'
      },
      {
        stage: 'Planting Certified Seed Tubers',
        timingDap: '0 DAP',
        task: 'Place well-sprouted seed tubers (egg size, 35-55mm) spaced 30cm in furrow, eyes facing up.',
        recommendedInput: 'Certified Seed Potatoes (Quarantine Certified)',
        brandName: 'Nyanga Seed Potato / Seed Co BP1',
        applicationRate: '2,000 - 2,500 kg/ha (140-160 pockets/ha)',
        pfumvudzaPlotRate: '10 pockets (15kg) per plot',
        estimatedCostUsd: 130.00,
        criticalAdvisory: 'Never plant unsprouted or diseased table potatoes; seed certification prevents bacterial wilt (Ralstonia).'
      },
      {
        stage: '1st Earthing Up & Top Dressing',
        timingDap: '25 to 30 DAP',
        task: 'Apply Ammonium Nitrate and build a high 25cm ridge around stems.',
        recommendedInput: 'Ammonium Nitrate (AN)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '300 kg/ha',
        pfumvudzaPlotRate: '18 kg per plot',
        estimatedCostUsd: 48.00,
        criticalAdvisory: 'Earthing up prevents tubers from being exposed to sunlight, which turns them green and poisonous (solanine).'
      },
      {
        stage: 'Late Blight Preventative Spray Program',
        timingDap: '30 to 80 DAP',
        task: 'Preventative spray every 7 days; alternate contact and systemic fungicides.',
        recommendedInput: 'Dithane M-45 M-45 alternating with Ridomil Gold MZ',
        brandName: 'Dithane M-45 + Ridomil Gold',
        applicationRate: '2.5 kg/ha Dithane / 2.0 kg/ha Ridomil',
        pfumvudzaPlotRate: '50g per 15L knapsack',
        estimatedCostUsd: 45.00,
        criticalAdvisory: 'Late Blight can wipe out a potato field in 48 hours during misty, rainy weather.'
      },
      {
        stage: 'Dehaulming & Skin Curing',
        timingDap: '95 to 105 DAP',
        task: 'Slash or spray off foliage (dehaulm) 14 days before harvest.',
        recommendedInput: 'Foliage slashing / Gramoxone',
        brandName: 'Agronomic skin curing practice',
        applicationRate: 'Mechanical / chemical dehaulming',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 10.00,
        criticalAdvisory: 'Dehaulming hardens potato skins so they do not feather or skin during transport.'
      },
      {
        stage: 'Harvesting & Bagging',
        timingDap: '110 to 120 DAP',
        task: 'Carefully lift ridges with potato forks; sort into Large, Medium, and Chat; bag in 15kg pockets.',
        recommendedInput: 'Standard Red/Orange 15kg Pockets',
        brandName: 'Potato Marketing Pockets',
        applicationRate: 'Packing materials',
        pfumvudzaPlotRate: 'Pockets ($0.45 each)',
        estimatedCostUsd: 35.00,
        criticalAdvisory: 'Never harvest wet potatoes or wash table potatoes before storage; moisture breeds soft rot.'
      }
    ]
  },
  {
    cropId: 'onions_horticulture',
    name: 'Onions / Hanyanisi (Cured Bulb Market)',
    shonaName: 'Hanyanisi',
    ndebeleName: 'Anyanisi',
    category: 'Horticulture',
    seasonType: 'Winter Irrigated',
    suitableRegions: ['I', 'IIa', 'IIb', 'III', 'IV'],
    recommendedVarieties: ['Texas Grano', 'Red Creole (Long keeping)', 'Sivan F1', 'Hojem F1'],
    rainfallRequirementMm: { min: 400, max: 600 },
    maturityDays: 140,
    expectedYieldTonPerHa: { low: 30.0, avg: 45.0, high: 70.0 },
    pfumvudzaYieldBags: { low: 140, avg: 220, high: 320 }, // 10kg onion mesh pockets per plot
    suitabilityScore: 93,
    suitabilityReason: 'Outstanding post-harvest storage lifespan (4-6 months for Red Creole). High off-season prices in September-December ($7 - $12 per pocket).',
    plantingTriggerCondition: 'Sow seedbeds in Feb-April; transplant seedlings in April-May for winter bulb development.',
    zeroToMaturitySchedule: [
      {
        stage: 'Seedbed & Nursery',
        timingDap: '-50 to 0 DAP',
        task: 'Sow thinly in raised seedbeds at 15cm row spacing; drench against damping off.',
        recommendedInput: 'Certified seed + Dithane M-45',
        brandName: 'Texas Grano',
        applicationRate: '3.5 - 4.5 kg seed/ha',
        pfumvudzaPlotRate: '250g seed',
        estimatedCostUsd: 22.00,
        criticalAdvisory: 'Seedlings are ready when pencil-thick (6-8 weeks).'
      },
      {
        stage: 'Transplanting & Basal Fertilizer',
        timingDap: '0 DAP',
        task: 'Transplant at 25cm row spacing x 8-10cm in-row; apply Compound C.',
        recommendedInput: 'Compound C (5:15:12) (5:15:12) or Compound S',
        brandName: 'Compound C (5:15:12)',
        applicationRate: '600 kg/ha',
        pfumvudzaPlotRate: '35 kg per plot',
        estimatedCostUsd: 48.00,
        criticalAdvisory: 'Trim seedling tops and roots lightly; plant shallow (no deeper than 2cm).'
      },
      {
        stage: 'Thrips & Purple Blotch Protection',
        timingDap: '25 to 70 DAP',
        task: 'Scout for Onion Thrips in leaf sheaths and Purple Blotch lesions.',
        recommendedInput: 'Malathion 50EC + Score 250EC + Agral 90',
        brandName: 'Score 250EC + Malathion + Agral 90',
        applicationRate: '300 ml/ha Score + 1 L/ha Malathion',
        pfumvudzaPlotRate: '15 ml Score + 25 ml Malathion + 10 ml Agral per knapsack',
        estimatedCostUsd: 22.00,
        criticalAdvisory: 'Onion leaves are upright and waxy; Agral 90 sticker is mandatory.'
      },
      {
        stage: 'Top Dressing & Bulbing',
        timingDap: '30 and 60 DAP',
        task: 'Two splits of Ammonium Nitrate during vegetative leaf production.',
        recommendedInput: 'Ammonium Nitrate (AN)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '150 kg/ha per split',
        pfumvudzaPlotRate: '10 kg per split',
        estimatedCostUsd: 45.00,
        criticalAdvisory: 'Cease all nitrogen 4 weeks before harvest; late nitrogen causes thick necks and neck rot in storage.'
      },
      {
        stage: 'Withholding Water & Field Curing',
        timingDap: '120 to 140 DAP',
        task: 'Stop irrigation when 50% of tops fall over (neck break). Lift bulbs after 10 days; windrow cure under shade for 2 weeks.',
        recommendedInput: 'Shaded curing racks',
        brandName: 'Air curing facilities',
        applicationRate: 'Natural curing',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Never store onions with moist green necks. Cured bulbs have paper-dry rustling outer skins.'
      }
    ]
  },
  {
    cropId: 'leaf_vegetables_horticulture',
    name: 'Leaf Greens / Rape / Covo / Choumoellier',
    shonaName: 'Muriwo weMashizha',
    ndebeleName: 'Imibhida',
    category: 'Horticulture',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    recommendedVarieties: ['English Giant Rape', 'Covo Rugare', 'Choumoellier', 'Kwanono Covo', 'Mustard Greens'],
    rainfallRequirementMm: { min: 400, max: 600 },
    maturityDays: 45,
    expectedYieldTonPerHa: { low: 20.0, avg: 35.0, high: 55.0 },
    pfumvudzaYieldBags: { low: 250, avg: 450, high: 700 }, // Standard 15kg vegetable bundles per plot over season
    suitabilityScore: 98,
    suitabilityReason: 'The daily dietary breadwinner of Zimbabwean smallholders. Harvestable every 7 days for up to 9 months consecutively.',
    plantingTriggerCondition: 'Transplant 4-week seedlings year-round with basic irrigation.',
    zeroToMaturitySchedule: [
      {
        stage: 'Basin Prep & Manure Basal',
        timingDap: '-5 to 0 DAP',
        task: 'Basins dug at 60cm x 40cm; incorporate heavy kraal manure and Compound D.',
        recommendedInput: 'Well-rotted kraal manure + Compound D',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '400 kg/ha Compound D + 15 t/ha manure',
        pfumvudzaPlotRate: '20g Compound D + 2 handfuls manure/basin',
        estimatedCostUsd: 25.00,
        criticalAdvisory: 'Heavy organic manure keeps leaves succulent and dark green.'
      },
      {
        stage: 'Transplanting',
        timingDap: '0 DAP',
        task: 'Transplant sturdy pencil-thick seedlings in late afternoon; water immediately.',
        recommendedInput: 'Certified seed / Covo cuttings',
        brandName: 'English Giant / Choumoellier',
        applicationRate: '2 kg/ha seed',
        pfumvudzaPlotRate: '100g seed',
        estimatedCostUsd: 6.00,
        criticalAdvisory: 'Covo can be propagated from vegetative side cuttings (vanasikana).'
      },
      {
        stage: 'Aphid & Bagrada Bug Protection',
        timingDap: '14 to 60 DAP',
        task: 'Scout for grey mealy aphids and Bagrada shield bugs.',
        recommendedInput: 'Malathion 50EC',
        brandName: 'Malathion 50EC',
        applicationRate: '1 L/ha',
        pfumvudzaPlotRate: '30 ml per 15L knapsack',
        estimatedCostUsd: 6.50,
        criticalAdvisory: 'Respect 7-day pre-harvest interval; wash harvested bundles in clean water.'
      },
      {
        stage: 'Weekly Picking & Nitrogen Feeding',
        timingDap: '35 to 200 DAP',
        task: 'Pick 3-4 bottom mature leaves per plant weekly; apply light Ammonium Nitrate spoon-feeding every 2 weeks.',
        recommendedInput: 'Ammonium Nitrate (AN)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '50 kg/ha every 14 days',
        pfumvudzaPlotRate: '2g per plant station every 2 weeks',
        estimatedCostUsd: 28.00,
        criticalAdvisory: 'Never pick top growing point; continuous leaf harvest stimulates rapid new leaf unfurling.'
      }
    ]
  },
  {
    cropId: 'butternuts_horticulture',
    name: 'Butternuts & Pumpkins / Manhanga',
    shonaName: 'Manhanga / Manhanga eButternut',
    ndebeleName: 'Amathanga',
    category: 'Horticulture',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['IIa', 'IIb', 'III', 'IV'],
    recommendedVarieties: ['Waltham Butternut', 'Sunset F1', 'Musina F1', 'Flat White Boer Pumpkin'],
    rainfallRequirementMm: { min: 450, max: 700 },
    maturityDays: 95,
    expectedYieldTonPerHa: { low: 18.0, avg: 30.0, high: 45.0 },
    pfumvudzaYieldBags: { low: 80, avg: 140, high: 220 }, // 10kg export/supermarket bags per plot
    suitabilityScore: 94,
    suitabilityReason: 'Low labor crop with excellent shelf life (3-4 months). Leaves eaten as muboora; huge demand in urban supermarkets and catering ($5 - $9 per 10kg pocket).',
    plantingTriggerCondition: 'Plant on 25mm rain in November-December or August under irrigation.',
    zeroToMaturitySchedule: [
      {
        stage: 'Basin Prep & Basal Fertilizer',
        timingDap: '-5 to 0 DAP',
        task: 'Dig wide basins (30cm x 30cm x 20cm deep) spaced 2.0m between rows x 1.0m within row.',
        recommendedInput: 'Kraal manure + Compound C or D',
        brandName: 'Compound C (5:15:12) / D',
        applicationRate: '400 kg/ha Compound + 10 t/ha manure',
        pfumvudzaPlotRate: '40g fertilizer + 3 handfuls manure per basin',
        estimatedCostUsd: 28.00,
        criticalAdvisory: 'Wide spacing allows trailing vines to spread without overcrowding.'
      },
      {
        stage: 'Direct Sowing',
        timingDap: '0 DAP',
        task: 'Sow 3 seeds per basin at 3cm depth; thin to 2 vigorous plants after 10 days.',
        recommendedInput: 'Certified seed',
        brandName: 'Waltham / Sunset F1',
        applicationRate: '3.0 - 4.0 kg/ha',
        pfumvudzaPlotRate: '250g certified seed',
        estimatedCostUsd: 12.00,
        criticalAdvisory: 'Pre-soak seed for 4 hours to accelerate germination.'
      },
      {
        stage: 'Powdery Mildew & Fruit Fly Protection',
        timingDap: '40 to 70 DAP',
        task: 'Scout for powdery white mildew on leaves and cucurbit fruit flies stinging young fruits.',
        recommendedInput: 'Score 250EC + Karate Zeon',
        brandName: 'Score 250EC + Karate Zeon',
        applicationRate: '300 ml Score + 100 ml Karate per ha',
        pfumvudzaPlotRate: '15 ml Score + 10 ml Karate per knapsack',
        estimatedCostUsd: 14.50,
        criticalAdvisory: 'Fruit fly stings cause young butternuts to rot and abort prematurely.'
      },
      {
        stage: 'Harvesting & Stem Curing',
        timingDap: '85 to 105 DAP',
        task: 'Cut with 3cm stem (pedicel) attached when rind turns deep tan and resists fingernail pressure.',
        recommendedInput: 'Pruning shears',
        brandName: 'Harvest shears',
        applicationRate: 'Careful cutting with stem intact',
        pfumvudzaPlotRate: 'Family labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Never break stem off flush with fruit; broken stems allow fungal rot to enter the fruit in storage.'
      }
    ]
  },
  {
    cropId: 'carrots_horticulture',
    name: 'Carrots / Karoti',
    shonaName: 'Karoti',
    ndebeleName: 'Ikarodi',
    category: 'Horticulture',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['I', 'IIa', 'IIb', 'III'],
    recommendedVarieties: ['Kuroda', 'Nantes', 'Chantenay Red Cored'],
    rainfallRequirementMm: { min: 400, max: 600 },
    maturityDays: 85,
    expectedYieldTonPerHa: { low: 25.0, avg: 40.0, high: 60.0 },
    pfumvudzaYieldBags: { low: 100, avg: 180, high: 260 }, // 10kg vegetable crates per plot
    suitabilityScore: 91,
    suitabilityReason: 'Thrives in stone-free deep sandy loams. Commands steady year-round retail and wholesale prices in urban centers.',
    plantingTriggerCondition: 'Sow year-round with irrigation into fine, stone-free raised beds.',
    zeroToMaturitySchedule: [
      {
        stage: 'Deep Seedbed Preparation',
        timingDap: '-7 to 0 DAP',
        task: 'Fork soil deeply to 30cm; remove all stones and hard clods; avoid fresh kraal manure.',
        recommendedInput: 'Single Superphosphate (SSP) + Compound D',
        brandName: 'Single Superphosphate (SSP 19%)',
        applicationRate: '400 kg/ha',
        pfumvudzaPlotRate: '25 kg per plot',
        estimatedCostUsd: 24.00,
        criticalAdvisory: 'Fresh manure or stones cause roots to fork and split, making carrots unmarketable.'
      },
      {
        stage: 'Direct Sowing (Sand Mix)',
        timingDap: '0 DAP',
        task: 'Mix tiny seed with fine river sand; sow in shallow drills 20cm apart, 1cm deep; cover lightly.',
        recommendedInput: 'Certified Kuroda / Nantes Seed',
        brandName: 'Kuroda',
        applicationRate: '4.0 - 5.0 kg/ha',
        pfumvudzaPlotRate: '250g seed',
        estimatedCostUsd: 14.00,
        criticalAdvisory: 'Keep surface continuously moist with light daily watering until germination (7-10 days).'
      },
      {
        stage: 'Thinning & Weeding',
        timingDap: '21 to 28 DAP',
        task: 'Thin seedlings to 4-5cm apart in rows.',
        recommendedInput: 'Manual precision thinning',
        brandName: 'Hand labor',
        applicationRate: 'Labor',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Thinning is critical; crowded carrots remain thin like pencils.'
      },
      {
        stage: 'Harvest',
        timingDap: '80 to 95 DAP',
        task: 'Water bed before lifting to loosen soil; pull by tops, wash, trim foliage, and bundle.',
        recommendedInput: 'Clean washing troughs',
        brandName: 'Post-harvest wash',
        applicationRate: 'Washing and bundling',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Wash immediately in clean water to reveal bright orange skin.'
      }
    ]
  },
  {
    cropId: 'peppers_horticulture',
    name: 'Green & Sweet Peppers / Mhiripiri',
    shonaName: 'Mhiripiri Inotapira',
    ndebeleName: 'Ibhabhatshi',
    category: 'Horticulture',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['I', 'IIa', 'IIb', 'III'],
    recommendedVarieties: ['California Wonder', 'Commander F1', 'King Arthur F1', 'Habenero / Birdseye (Chilli)'],
    rainfallRequirementMm: { min: 500, max: 700 },
    maturityDays: 80, // from transplant
    expectedYieldTonPerHa: { low: 20.0, avg: 35.0, high: 50.0 },
    pfumvudzaYieldBags: { low: 90, avg: 160, high: 240 }, // 10kg crates per plot
    suitabilityScore: 92,
    suitabilityReason: 'High cash value in supermarkets and fresh markets. Premium prices paid for blocky, thick-walled sweet peppers.',
    plantingTriggerCondition: 'Transplant 6-week seedlings into warm frost-free soil.',
    zeroToMaturitySchedule: [
      {
        stage: 'Transplanting & Basal Nutrition',
        timingDap: '0 DAP',
        task: 'Transplant at 75cm x 40cm; apply Compound C.',
        recommendedInput: 'Compound C (5:15:12) (5:15:12)',
        brandName: 'Compound C (5:15:12)',
        applicationRate: '600 kg/ha',
        pfumvudzaPlotRate: '25g per station',
        estimatedCostUsd: 36.00,
        criticalAdvisory: 'Peppers are frost sensitive; schedule for warm spring/summer months.'
      },
      {
        stage: 'Bacterial Spot & Thrips Control',
        timingDap: '21 to 50 DAP',
        task: 'Spray Copper Oxychloride against bacterial spot; scout for thrips.',
        recommendedInput: 'Copper Oxychloride 85WP + Confidor',
        brandName: 'Copper Oxychloride + Confidor',
        applicationRate: '2.5 kg/ha Copper + 250 ml/ha Confidor',
        pfumvudzaPlotRate: '40g Copper + 10ml Confidor per knapsack',
        estimatedCostUsd: 18.00,
        criticalAdvisory: 'Bacterial spot causes water-soaked lesions and fruit drop during wet humid weather.'
      },
      {
        stage: 'Calcium & Potassium Top Dressing',
        timingDap: '30 to 75 DAP',
        task: 'Apply Potassium Nitrate every 14 days; spray CalMax (Calcium + Boron).',
        recommendedInput: 'Potassium Nitrate + CalMax',
        brandName: 'Potassium Nitrate (KNO3) + CalMax (Calcium + Boron)',
        applicationRate: '150 kg/ha KNO3 + 3 L/ha CalMax',
        pfumvudzaPlotRate: '10g KNO3/plant + 40ml CalMax/knapsack',
        estimatedCostUsd: 32.00,
        criticalAdvisory: 'Potassium and calcium ensure thick, crunchy fruit walls that resist transit damage.'
      },
      {
        stage: 'Harvest',
        timingDap: '75 to 110 DAP',
        task: 'Clip fruit with 2cm stem attached when blocky and firm.',
        recommendedInput: 'Harvest shears',
        brandName: 'Pruning shears',
        applicationRate: 'Manual clipping',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Cut with shears; pulling fruit by hand breaks brittle pepper branches.'
      }
    ]
  },
  {
    cropId: 'watermelons_horticulture',
    name: 'Watermelons / Manwiwa / Amavhuve',
    shonaName: 'Manwiwa',
    ndebeleName: 'Amavhuve',
    category: 'Horticulture',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['IIb', 'III', 'IV', 'V'],
    recommendedVarieties: ['Charleston Gray', 'Crimson Sweet', 'All Sweet', 'Sweet Sangria F1'],
    rainfallRequirementMm: { min: 400, max: 600 },
    maturityDays: 90,
    expectedYieldTonPerHa: { low: 25.0, avg: 45.0, high: 70.0 },
    pfumvudzaYieldBags: { low: 150, avg: 280, high: 400 }, // Individual large melons per plot
    suitabilityScore: 94,
    suitabilityReason: 'Huge summer holiday demand (November-January). Sells for $1.50 - $4.00 per melon along major highways and wholesale markets.',
    plantingTriggerCondition: 'Plant in August/September under irrigation or November with first warm rains.',
    zeroToMaturitySchedule: [
      {
        stage: 'Wide Basin Prep & Compost',
        timingDap: '-5 to 0 DAP',
        task: 'Dig wide basins (40cm x 40cm x 25cm) spaced 2.5m x 1.5m; add heavy kraal manure.',
        recommendedInput: 'Kraal manure + Compound D',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '350 kg/ha Compound D + 15 t/ha manure',
        pfumvudzaPlotRate: '50g Compound D + 4 handfuls manure/basin',
        estimatedCostUsd: 26.00,
        criticalAdvisory: 'High organic matter stores moisture for succulent fruit flesh.'
      },
      {
        stage: 'Planting',
        timingDap: '0 DAP',
        task: 'Sow 3 seeds per station, 3cm deep; thin to 2 plants.',
        recommendedInput: 'Certified seed',
        brandName: 'Charleston Gray',
        applicationRate: '2.5 - 3.5 kg/ha',
        pfumvudzaPlotRate: '200g seed',
        estimatedCostUsd: 11.00,
        criticalAdvisory: 'Plant when soil temperature exceeds 20°C; cold soil rots watermelon seed.'
      },
      {
        stage: 'Anthracnose & Fruit Fly Prevention',
        timingDap: '35 to 65 DAP',
        task: 'Spray Dithane M-45 against anthracnose leaf and fruit spots; trap fruit flies.',
        recommendedInput: 'Dithane M-45 + Karate Zeon',
        brandName: 'Dithane M-45 M-45 + Karate Zeon',
        applicationRate: '2.0 kg/ha Dithane + 100 ml Karate',
        pfumvudzaPlotRate: '40g Dithane + 10ml Karate/knapsack',
        estimatedCostUsd: 15.00,
        criticalAdvisory: 'Fruit fly larvae cause internal melon flesh to rot and ferment.'
      },
      {
        stage: 'Harvest Readiness Test',
        timingDap: '80 to 95 DAP',
        task: 'Harvest when ground spot turns from white to creamy yellow, tendril dries, and fruit sounds dull when thumped.',
        recommendedInput: 'Harvest knife',
        brandName: 'Field cutting',
        applicationRate: 'Manual cutting with stem',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Watermelons do not ripen after picking; harvest only fully field-ripened fruits.'
      }
    ]
  },
  // ==================== EXPANDED COMMERCIAL HORTICULTURE CROPS ====================
  {
    cropId: 'french_beans_horticulture',
    name: 'Green Beans / Fine French Beans',
    shonaName: 'Mhandire / Bhinzi Nyoro',
    ndebeleName: 'Indumba Eziluhlaza',
    category: 'Horticulture',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['I', 'IIa', 'IIb', 'III'],
    recommendedVarieties: ['Star 2005', 'Serengeti', 'Contender', 'Teresa'],
    rainfallRequirementMm: { min: 350, max: 550 },
    maturityDays: 60,
    expectedYieldTonPerHa: { low: 7.0, avg: 12.0, high: 18.0 },
    pfumvudzaYieldBags: { low: 8, avg: 14, high: 20 }, // 10kg crates
    suitabilityScore: 92,
    suitabilityReason: 'Fast 60-day turnover cash crop. High demand from supermarkets, canning processors, and export outgrower schemes in Mashonaland and Manicaland.',
    plantingTriggerCondition: 'Plant in staggered 2-week successions from August to April under furrow or drip irrigation.',
    zeroToMaturitySchedule: [
      {
        stage: 'Basin Soil Conditioning & Basal Dosing',
        timingDap: '-5 to 0 DAP',
        task: 'Till soil to fine tilth; apply Compound C or D in planting furrows spaced 45cm x 10cm.',
        recommendedInput: 'Compound C (5:15:12) (5:15:12) or Compound D',
        brandName: 'Compound C (5:15:12)',
        applicationRate: '400 kg/ha',
        pfumvudzaPlotRate: '25 kg per standard plot',
        estimatedCostUsd: 34.00,
        criticalAdvisory: 'Avoid direct contact between bean seed and chemical fertilizer to prevent burning.'
      },
      {
        stage: 'Precision Sowing',
        timingDap: '0 DAP',
        task: 'Sow 1 seed every 8-10cm, 2.5cm deep in moist soil.',
        recommendedInput: 'Certified Rhizobium Inoculated Seed',
        brandName: 'Star 2005',
        applicationRate: '45 - 55 kg/ha',
        pfumvudzaPlotRate: '3 kg seed',
        estimatedCostUsd: 22.00,
        criticalAdvisory: 'Inoculate with Soil Inoculant factory Rhizobium for active nitrogen fixation.'
      },
      {
        stage: 'Early Foliar Boost & Bean Stem Maggot Spray',
        timingDap: '14 to 21 DAP',
        task: 'Spray against Bean Stem Maggot (Ophiomyia) and spray Quick-Gro foliar.',
        recommendedInput: 'Karate Zeon 5CS + Quick-Gro',
        brandName: 'Karate Zeon + Quick-Gro',
        applicationRate: '120 ml/ha Karate + 2 L/ha Quick-Gro',
        pfumvudzaPlotRate: '10ml Karate + 30ml Quick-Gro/knapsack',
        estimatedCostUsd: 12.50,
        criticalAdvisory: 'Bean stem maggot kills young seedlings by tunneling into root crowns within first 20 days.'
      },
      {
        stage: 'Rust & Heliothis Pod Borer Control',
        timingDap: '35 to 45 DAP',
        task: 'Apply Dithane M-45 + Ampligo at onset of flowering to protect pods.',
        recommendedInput: 'Dithane M-45 M-45 + Ampligo',
        brandName: 'Dithane M-45 + Ampligo',
        applicationRate: '1.8 kg/ha Dithane + 150 ml/ha Ampligo',
        pfumvudzaPlotRate: '35g Dithane + 10ml Ampligo/knapsack',
        estimatedCostUsd: 18.00,
        criticalAdvisory: 'Comply with 3-day Pre-Harvest Interval (PHI) for fresh market export.'
      },
      {
        stage: 'Selective Hand Picking',
        timingDap: '55 to 70 DAP',
        task: 'Harvest pencil-thick straight pods every 2 days early morning before heat peaks.',
        recommendedInput: 'Ventilated harvest crates',
        brandName: 'Clean plastic lug boxes',
        applicationRate: 'Every 48 hours for 3 weeks',
        pfumvudzaPlotRate: 'Family labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Do not allow seeds to swell inside pods; swollen pods are downgraded from fine beans to canning grade.'
      }
    ]
  },
  {
    cropId: 'garlic_horticulture',
    name: 'Commercial Garlic',
    shonaName: 'Gariki',
    ndebeleName: 'I-Garlikhi',
    category: 'Horticulture',
    seasonType: 'Winter Irrigated',
    suitableRegions: ['I', 'IIa', 'IIb', 'III'],
    recommendedVarieties: ['Giant White', 'Zimbabwean Violet / Purple Stripe', 'Egyptian White'],
    rainfallRequirementMm: { min: 300, max: 450 },
    maturityDays: 150,
    expectedYieldTonPerHa: { low: 6.0, avg: 10.0, high: 15.0 },
    pfumvudzaYieldBags: { low: 6, avg: 11, high: 16 }, // 50kg sacks dry cured bulbs
    suitabilityScore: 95,
    suitabilityReason: 'One of Zimbabwe\'s highest return-per-hectare horticulture cash crops ($2.50 - $4.00/kg wholesale). Excellent storage life of 6-9 months allows farmers to hold for maximum price spikes.',
    plantingTriggerCondition: 'Plant between February and April as temperatures cool to promote bulb vernalization and root development.',
    zeroToMaturitySchedule: [
      {
        stage: 'Deep Bed Preparation & Basal Nutrition',
        timingDap: '-10 to 0 DAP',
        task: 'Incorporate well-rotted cattle manure (20 t/ha) and Compound S or Compound D deeply into raised beds.',
        recommendedInput: 'Compound S (7:21:8 + 9S + 0.1B) (7:21:8 + 9S + 0.1B) or Compound D',
        brandName: 'Compound S (7:21:8 + 9S + 0.1B)',
        applicationRate: '600 kg/ha',
        pfumvudzaPlotRate: '35 kg Compound S + 5 wheelbarrows kraal compost',
        estimatedCostUsd: 48.00,
        criticalAdvisory: 'Garlic requires high phosphorus and sulphur for pungent allicin compound synthesis.'
      },
      {
        stage: 'Clove Separation & Planting',
        timingDap: '0 DAP',
        task: 'Separate large mother bulbs into individual cloves; plant upright (root end down) 15cm x 10cm, 3cm deep.',
        recommendedInput: 'Certified Disease-Free Seed Cloves',
        brandName: 'Selected Giant White / Violet Cloves',
        applicationRate: '700 - 900 kg cloves/ha',
        pfumvudzaPlotRate: '50 kg cloves per plot',
        estimatedCostUsd: 95.00,
        criticalAdvisory: 'Plant only plump outer cloves; small inner cloves produce tiny commercial bulbs.'
      },
      {
        stage: 'Thrips & Purple Blotch Prevention',
        timingDap: '30 to 75 DAP',
        task: 'Spray Confidor or Prove against onion thrips; apply Dithane M-45 against purple blotch (Alternaria porri).',
        recommendedInput: 'Confidor 200SL + Dithane M-45 M-45',
        brandName: 'Confidor + Dithane M-45',
        applicationRate: '250 ml Confidor + 2 kg Dithane/ha',
        pfumvudzaPlotRate: '15ml Confidor + 40g Dithane/knapsack',
        estimatedCostUsd: 21.00,
        criticalAdvisory: 'Thrips vector viruses and cause silver streaking on leaves that stunt bulb expansion.'
      },
      {
        stage: 'Top Dressing Nitrogen',
        timingDap: '45 and 75 DAP',
        task: 'Split-apply Ammonium Nitrate along plant rows; water immediately.',
        recommendedInput: 'Ammonium Nitrate (AN 34.5% N) (34.5% N)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '200 kg/ha in 2 splits (100 kg at 45 DAP, 100 kg at 75 DAP)',
        pfumvudzaPlotRate: '12 kg AN total',
        estimatedCostUsd: 18.00,
        criticalAdvisory: 'Stop all nitrogen by 90 DAP; late nitrogen causes thick-necked cloves that fail to bulb.'
      },
      {
        stage: 'Withholding Water & Curing',
        timingDap: '135 to 160 DAP',
        task: 'Stop irrigation 3 weeks before lifting when 60% of foliage has lodged; lift carefully and cure in dry shade for 14 days.',
        recommendedInput: 'Natural Shade Curing Shed',
        brandName: 'Well-ventilated curing racks',
        applicationRate: '14-21 days shade curing',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Never dry garlic in direct scorching sun; sun scald cooks the cloves and ruins storage viability.'
      }
    ]
  },
  {
    cropId: 'ginger_horticulture',
    name: 'Commercial Ginger',
    shonaName: 'Jinja',
    ndebeleName: 'I-Jinjari',
    category: 'Horticulture',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['I', 'IIa', 'IIb'],
    recommendedVarieties: ['Honde Valley Local Giant', 'China White', 'Yellow Commercial'],
    rainfallRequirementMm: { min: 650, max: 1200 },
    maturityDays: 240,
    expectedYieldTonPerHa: { low: 15.0, avg: 25.0, high: 38.0 },
    pfumvudzaYieldBags: { low: 12, avg: 22, high: 32 }, // 50kg bags washed rhizomes
    suitabilityScore: 90,
    suitabilityReason: 'Premium beverage and spice cash crop flourishing in frost-free, humid pockets of Region I (Eastern Highlands) and Region II under shade net or micro-irrigation ($1.80 - $3.20/kg).',
    plantingTriggerCondition: 'Plant pre-sprouted seed rhizomes in August/September with warm spring temperatures.',
    zeroToMaturitySchedule: [
      {
        stage: 'High-Humus Ridge Bedding & Basal Feeding',
        timingDap: '-14 to 0 DAP',
        task: 'Construct high raised beds (30cm) heavily amended with kraal compost, forest loam, and Compound C.',
        recommendedInput: 'Compound C (5:15:12) (5:15:12) + Compost',
        brandName: 'Compound C (5:15:12)',
        applicationRate: '500 kg/ha Compound C + 30 t/ha decomposed compost',
        pfumvudzaPlotRate: '30 kg Compound C + 8 wheelbarrows compost',
        estimatedCostUsd: 46.00,
        criticalAdvisory: 'Ginger rhizomes rot in compacted, waterlogged clay; good drainage is non-negotiable.'
      },
      {
        stage: 'Rhizome Piece Planting & Mulching',
        timingDap: '0 DAP',
        task: 'Plant 40-50g seed rhizome setts with 2-3 viable eyes 5cm deep, 25cm apart; cover with 5cm dry grass mulch.',
        recommendedInput: 'Certified Pre-sprouted Rhizomes + Thick Grass Mulch',
        brandName: 'Honde Valley Giant Rhizomes',
        applicationRate: '1,200 - 1,500 kg rhizomes/ha',
        pfumvudzaPlotRate: '75 kg rhizome setts',
        estimatedCostUsd: 110.00,
        criticalAdvisory: 'Mulch is essential to maintain root zone humidity and lower midday soil temperatures below 30°C.'
      },
      {
        stage: 'Bacterial Wilt & Pythium Drenching',
        timingDap: '30 to 90 DAP',
        task: 'Drench ridges with Copper Oxychloride and Ridomil Gold to prevent soft rot and bacterial wilt.',
        recommendedInput: 'Copper Oxychloride + Ridomil Gold',
        brandName: 'Copper Oxychloride + Ridomil Gold',
        applicationRate: '2.5 kg Copper + 2.0 kg Ridomil/ha',
        pfumvudzaPlotRate: '40g Copper + 35g Ridomil/knapsack',
        estimatedCostUsd: 26.00,
        criticalAdvisory: 'Bacterial wilt (Ralstonia) can wipe out an entire ginger ridge in 5 days of warm, rainy weather.'
      },
      {
        stage: 'Earthing Up & Potassium Top Dressing',
        timingDap: '60, 110, and 160 DAP',
        task: 'Earth up ridges with compost to keep rhizomes covered; apply Potassium Nitrate/MOP for fat rhizome expansion.',
        recommendedInput: 'Potassium Sulphate (SOP) + AN',
        brandName: 'Soluble Potassium Sulphate (SOP)',
        applicationRate: '250 kg/ha SOP + 150 kg/ha AN in 3 splits',
        pfumvudzaPlotRate: '20 kg total',
        estimatedCostUsd: 36.00,
        criticalAdvisory: 'Exposed rhizomes turn green, fibrous, and lose market grade.'
      },
      {
        stage: 'Harvesting Plump Rhizomes',
        timingDap: '220 to 260 DAP',
        task: 'Harvest when leaves yellow and dry off; dig carefully with garden fork to avoid slicing rhizome fingers; wash and dry in shade.',
        recommendedInput: 'Garden digging fork + Washing troughs',
        brandName: 'Manual farm harvest',
        applicationRate: 'Full ridge lifting',
        pfumvudzaPlotRate: 'Family labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Clean thoroughly in potable water; do not scrape skin to prevent fungal ingress during transit.'
      }
    ]
  },
  {
    cropId: 'sweet_potato_horticulture',
    name: 'Orange-Fleshed Sweet Potato (OFSP)',
    shonaName: 'Mabura / Mbambaira Dzeyero',
    ndebeleName: 'Imbambayila / Ubhatata Obubomvu',
    category: 'Tuber',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    recommendedVarieties: ['Chingovha (High dry matter)', 'Alisha (High Vitamin A)', 'Beauregard (Fast maturing)', 'Brondal'],
    rainfallRequirementMm: { min: 400, max: 750 },
    maturityDays: 110,
    expectedYieldTonPerHa: { low: 12.0, avg: 22.0, high: 35.0 },
    pfumvudzaYieldBags: { low: 18, avg: 32, high: 48 }, // 50kg bags
    suitabilityScore: 96,
    suitabilityReason: 'National food security and nutrition champion. Rich in Pro-Vitamin A; highly drought-tolerant; thrives in low-fertility communal sandvelds with zero expensive pesticide requirements.',
    plantingTriggerCondition: 'Plant vine cuttings on ridges or Pfumvudza mounds on first 25mm planting rains between November and January.',
    zeroToMaturitySchedule: [
      {
        stage: 'Mound/Ridge Construction & Basal Placement',
        timingDap: '-5 to 0 DAP',
        task: 'Heap high ridges (40cm high, 1m apart) or Pfumvudza mounds; incorporate kraal manure and minimal Compound D.',
        recommendedInput: 'Kraal manure + Compound D (7:14:7)',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '150 - 200 kg/ha Compound D',
        pfumvudzaPlotRate: '12 kg Compound D per plot',
        estimatedCostUsd: 16.00,
        criticalAdvisory: 'High nitrogen causes excessive vine foliage growth and small, skinny tubers.'
      },
      {
        stage: 'Vine Cutting Planting',
        timingDap: '0 DAP',
        task: 'Plant clean 30cm apical vine cuttings at 45-degree angle with 3 nodes buried underground and 2 nodes exposed, 30cm apart.',
        recommendedInput: 'Certified Disease-Free Vine Cuttings',
        brandName: 'Agritex / Seed Co Clean OFSP Vines',
        applicationRate: '33,000 vine cuttings/ha',
        pfumvudzaPlotRate: '2,000 cuttings',
        estimatedCostUsd: 15.00,
        criticalAdvisory: 'Use top 30cm vine tips; older bottom vines harbor sweet potato weevil eggs.'
      },
      {
        stage: 'Weeding & Sweet Potato Weevil Defense',
        timingDap: '21 to 45 DAP',
        task: 'Hand weed before vines cover the ground; earth up soil around mounds to seal cracks where weevils enter.',
        recommendedInput: 'Soil earthing up + Carbaryl/Karate (if weevils spotted)',
        brandName: 'Karate Zeon',
        applicationRate: '100 ml/ha Karate',
        pfumvudzaPlotRate: '10ml/knapsack',
        estimatedCostUsd: 7.00,
        criticalAdvisory: 'Earthing up to cover exposed roots is the single most effective cultural control for sweet potato weevil.'
      },
      {
        stage: 'Harvesting Tubers',
        timingDap: '100 to 125 DAP',
        task: 'Carefully dig tubers as leaves begin to turn pale yellow; handle gently to avoid skinning.',
        recommendedInput: 'Harvest fork',
        brandName: 'Manual farm harvest',
        applicationRate: 'Progressive or once-off harvest',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Cure harvested tubers for 5-7 days in a warm, shaded shed (25-30°C) to heal harvest wounds and convert starches to sugars.'
      }
    ]
  },
  {
    cropId: 'peas_horticulture',
    name: 'Garden Peas & Sugar Snap / Snow Peas',
    shonaName: 'Pizi Nyoro',
    ndebeleName: 'Amaphizi',
    category: 'Horticulture',
    seasonType: 'Winter Irrigated',
    suitableRegions: ['I', 'IIa', 'IIb', 'III'],
    recommendedVarieties: ['Ambassador', 'Oregon Sugar Pod (Snow pea)', 'Sugar Daddy (Snap)', 'Greenfeast'],
    rainfallRequirementMm: { min: 300, max: 450 },
    maturityDays: 70,
    expectedYieldTonPerHa: { low: 5.0, avg: 9.0, high: 14.0 },
    pfumvudzaYieldBags: { low: 6, avg: 11, high: 16 }, // 10kg lugs
    suitabilityScore: 91,
    suitabilityReason: 'Ideal winter cash crop during cool, dry months (May-August). Fixes atmospheric nitrogen; high supermarket price ($2.00 - $3.50/kg) for sweet crunchy pods.',
    plantingTriggerCondition: 'Sow between April and June when nighttime temperatures drop below 15°C.',
    zeroToMaturitySchedule: [
      {
        stage: 'Basal Phosphate Fertilization & Trellis Posts',
        timingDap: '-5 to 0 DAP',
        task: 'Apply Compound C or Single Super Phosphate in planting lines spaced 50cm x 5cm; erect support trellising.',
        recommendedInput: 'Compound C (5:15:12) (5:15:12) / SSP',
        brandName: 'Compound C (5:15:12)',
        applicationRate: '350 kg/ha',
        pfumvudzaPlotRate: '22 kg Compound C',
        estimatedCostUsd: 28.00,
        criticalAdvisory: 'Peas love cool weather and neutral pH (6.0 - 6.8); apply lime if soil is below pH 5.5.'
      },
      {
        stage: 'Inoculated Sowing',
        timingDap: '0 DAP',
        task: 'Sow seed 3cm deep, 5cm apart in moist rows.',
        recommendedInput: 'Rhizobium Inoculated Pea Seed',
        brandName: 'Ambassador',
        applicationRate: '60 - 80 kg/ha',
        pfumvudzaPlotRate: '4 kg seed',
        estimatedCostUsd: 24.00,
        criticalAdvisory: 'Overwatering before emergence causes seeds to rot in cold winter soils.'
      },
      {
        stage: 'Powdery Mildew & Ascochyta Blight Spray',
        timingDap: '30 to 50 DAP',
        task: 'Spray Kumulus DF (Sulphur) or Score 250EC against powdery mildew (Erysiphe pisi) during flowering.',
        recommendedInput: 'Kumulus DF or Score',
        brandName: 'Kumulus DF Sulphur / Score',
        applicationRate: '2.0 kg/ha Kumulus or 350 ml/ha Score',
        pfumvudzaPlotRate: '40g Kumulus/knapsack',
        estimatedCostUsd: 14.00,
        criticalAdvisory: 'Powdery mildew coats pea pods in white powder, rendering them completely unmarketable.'
      },
      {
        stage: 'Continuous Pod Picking',
        timingDap: '65 to 85 DAP',
        task: 'Pick every 2-3 days while pods are young, tender, and sweet.',
        recommendedInput: 'Clean picking baskets',
        brandName: 'Hand harvest',
        applicationRate: 'Bi-weekly picking',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Keep picked peas out of direct sun; cool immediately to preserve sugar content.'
      }
    ]
  },
  {
    cropId: 'cucumbers_horticulture',
    name: 'Field & Greenhouse Cucumbers',
    shonaName: 'Magaka / Magaka eChirungu',
    ndebeleName: 'Amakhukhamba',
    category: 'Horticulture',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['I', 'IIa', 'IIb', 'III', 'IV'],
    recommendedVarieties: ['Ashley', 'Marketer', 'English Long Green F1', 'Super Slice'],
    rainfallRequirementMm: { min: 400, max: 600 },
    maturityDays: 55,
    expectedYieldTonPerHa: { low: 18.0, avg: 35.0, high: 55.0 },
    pfumvudzaYieldBags: { low: 25, avg: 50, high: 75 }, // 15kg crates
    suitabilityScore: 93,
    suitabilityReason: 'Rapid 55-day maturity crop generating quick cashflow between long seasons. Strong demand in urban vegetable markets, fast-food outlets, and hotels.',
    plantingTriggerCondition: 'Plant under irrigation August-October or with first summer rains in November.',
    zeroToMaturitySchedule: [
      {
        stage: 'Basin Prep & High Organic Basal',
        timingDap: '-5 to 0 DAP',
        task: 'Dig basins spaced 1.2m x 60cm; fill with 2 handfuls compost + 1 bottle cap Compound D.',
        recommendedInput: 'Compost + Compound D (7:14:7)',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '400 kg/ha',
        pfumvudzaPlotRate: '25 kg Compound D',
        estimatedCostUsd: 32.00,
        criticalAdvisory: 'Cucumbers have shallow fibrous roots; organic matter maintains high moisture retention.'
      },
      {
        stage: 'Sowing',
        timingDap: '0 DAP',
        task: 'Plant 2 seeds per station 2cm deep; thin to 1 vigorous plant at 10 DAE.',
        recommendedInput: 'Certified Seed',
        brandName: 'Ashley',
        applicationRate: '2.5 - 3.5 kg/ha',
        pfumvudzaPlotRate: '200g seed',
        estimatedCostUsd: 14.00,
        criticalAdvisory: 'Ensure soil temperature is above 18°C for rapid 4-day uniform germination.'
      },
      {
        stage: 'Downy Mildew & Melon Fly Control',
        timingDap: '20 to 45 DAP',
        task: 'Apply Ridomil Gold MZ against downy mildew and trap fruit/melon flies with baited traps.',
        recommendedInput: 'Ridomil Gold + Karate Zeon',
        brandName: 'Ridomil Gold MZ + Karate',
        applicationRate: '2.0 kg Ridomil + 100 ml Karate/ha',
        pfumvudzaPlotRate: '35g Ridomil + 10ml Karate/knapsack',
        estimatedCostUsd: 19.00,
        criticalAdvisory: 'Downy mildew causes angular yellow leaf lesions that scorch foliage within 48 hours.'
      },
      {
        stage: 'Harvesting Crisp Fruit',
        timingDap: '50 to 75 DAP',
        task: 'Harvest dark green, firm, cylindrical fruits 18-22cm long every 2-3 days.',
        recommendedInput: 'Sharp harvest clippers',
        brandName: 'Clean plastic crates',
        applicationRate: 'Continuous 3-4 weeks',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Cut stem with clippers; pulling fruits tears the vines and initiates fungal rot.'
      }
    ]
  },
  {
    cropId: 'beetroot_horticulture',
    name: 'Red Beetroot',
    shonaName: 'Bhitiruti',
    ndebeleName: 'I-Bhitirudi',
    category: 'Horticulture',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['I', 'IIa', 'IIb', 'III'],
    recommendedVarieties: ['Detroit Dark Red', 'Crimson Globe', 'Early Wonder'],
    rainfallRequirementMm: { min: 350, max: 500 },
    maturityDays: 65,
    expectedYieldTonPerHa: { low: 15.0, avg: 25.0, high: 40.0 },
    pfumvudzaYieldBags: { low: 20, avg: 35, high: 50 }, // 10kg pockets
    suitabilityScore: 92,
    suitabilityReason: 'Fast-growing root crop with rising health food consumption in Zimbabwe. Both succulent roots and vitamin-packed beet greens are commercially salable.',
    plantingTriggerCondition: 'Sow year-round under irrigation; optimal quality produced in cooler months (March-September).',
    zeroToMaturitySchedule: [
      {
        stage: 'Fine Tilth Bedding & Boron Nutrition',
        timingDap: '-5 to 0 DAP',
        task: 'Prepare stone-free raised beds; apply Compound S or Compound C (both contain vital Boron).',
        recommendedInput: 'Compound S (7:21:8 + 9S + 0.1B) (contains 0.1% Boron)',
        brandName: 'Compound S (7:21:8 + 9S + 0.1B)',
        applicationRate: '500 kg/ha',
        pfumvudzaPlotRate: '30 kg Compound S',
        estimatedCostUsd: 40.00,
        criticalAdvisory: 'Boron deficiency causes internal black heart rot in beet roots; never use boron-free fertilizer.'
      },
      {
        stage: 'Direct Sowing & Thinning',
        timingDap: '0 to 18 DAP',
        task: 'Sow seed clusters 2cm deep in rows 25cm apart; thin to 8-10cm at 18 DAE.',
        recommendedInput: 'Certified Beetroot Seed',
        brandName: 'Detroit Dark Red',
        applicationRate: '7 - 10 kg/ha',
        pfumvudzaPlotRate: '600g seed',
        estimatedCostUsd: 16.00,
        criticalAdvisory: 'Each beetroot seed is a multigerm cluster producing 2-4 seedlings; rigorous thinning is vital.'
      },
      {
        stage: 'Cercospora Leaf Spot Protection',
        timingDap: '30 to 50 DAP',
        task: 'Spray Dithane M-45 or Copper Oxychloride if circular spots with purple margins appear on leaves.',
        recommendedInput: 'Dithane M-45 M-45',
        brandName: 'Dithane M-45 M-45',
        applicationRate: '2.0 kg/ha',
        pfumvudzaPlotRate: '40g/knapsack',
        estimatedCostUsd: 11.00,
        criticalAdvisory: 'Defoliation halts root enlargement and reduces root sugar concentration.'
      },
      {
        stage: 'Bunching & Harvesting',
        timingDap: '60 to 75 DAP',
        task: 'Pull roots when 5-7cm in diameter; wash and tie in bunches of 4-5 with healthy green tops.',
        recommendedInput: 'Washing troughs + Twine',
        brandName: 'Farm fresh bunching',
        applicationRate: 'Once-off or selective pulling',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Do not allow roots to exceed 8cm; oversized beetroots turn woody and develop pale internal rings.'
      }
    ]
  },
  {
    cropId: 'spinach_horticulture',
    name: 'Swiss Chard / True Spinach',
    shonaName: 'Spinachi / Muriwo weChirungu',
    ndebeleName: 'Ispinatshi',
    category: 'Horticulture',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['I', 'IIa', 'IIb', 'III', 'IV'],
    recommendedVarieties: ['Fordhook Giant', 'Lucullus', 'Green Wave'],
    rainfallRequirementMm: { min: 350, max: 600 },
    maturityDays: 50,
    expectedYieldTonPerHa: { low: 25.0, avg: 45.0, high: 70.0 },
    pfumvudzaYieldBags: { low: 150, avg: 280, high: 400 }, // Bunches per week
    suitabilityScore: 95,
    suitabilityReason: 'The ultimate perpetual weekly income generator for smallholder market gardens. Continuous leaf harvesting for 6-9 months from a single planting.',
    plantingTriggerCondition: 'Transplant nursery seedlings year-round with steady irrigation.',
    zeroToMaturitySchedule: [
      {
        stage: 'Bed Prep & Heavy Manure',
        timingDap: '-7 to 0 DAP',
        task: 'Deep dig beds incorporating 25 t/ha poultry or cattle manure plus Compound D.',
        recommendedInput: 'Manure + Compound D (7:14:7)',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '450 kg/ha',
        pfumvudzaPlotRate: '28 kg Compound D',
        estimatedCostUsd: 35.00,
        criticalAdvisory: 'Spinach is a voracious nitrogen and potassium feeder.'
      },
      {
        stage: 'Transplanting',
        timingDap: '0 DAP',
        task: 'Transplant 4-week-old sturdy seedlings spaced 40cm x 30cm; water deeply.',
        recommendedInput: 'Certified Seedlings',
        brandName: 'Fordhook Giant',
        applicationRate: '45,000 seedlings/ha',
        pfumvudzaPlotRate: '2,800 seedlings',
        estimatedCostUsd: 18.00,
        criticalAdvisory: 'Do not bury the growing crown beneath soil; buried crowns rot.'
      },
      {
        stage: 'Ammonium Nitrate Routine Top Dressing',
        timingDap: 'Every 21 days after first pick',
        task: 'Apply 75 kg/ha Ammonium Nitrate every 3 weeks to spur continuous dark green succulent leaf generation.',
        recommendedInput: 'Ammonium Nitrate (AN 34.5% N) (34.5% N)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '250 kg/ha cumulative in 3-4 splits',
        pfumvudzaPlotRate: '15 kg AN total',
        estimatedCostUsd: 22.00,
        criticalAdvisory: 'Always water immediately after applying AN granular fertilizer to prevent leaf scorch.'
      },
      {
        stage: 'Weekly Leaf Cutting',
        timingDap: '45 to 220 DAP',
        task: 'Snap or cut outer mature leaves leaving 4-5 inner leaves to continue growing; bundle into 1kg commercial bunches.',
        recommendedInput: 'Harvest knife + Sisal twine',
        brandName: 'Fresh market harvest',
        applicationRate: 'Weekly harvest cycle',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Harvest early in the morning while leaves are turgid and crisp; dunk in cold water to preserve shelf life.'
      }
    ]
  },
  {
    cropId: 'okra_horticulture',
    name: 'Commercial Okra',
    shonaName: 'Derere / Derere reChirungu',
    ndebeleName: 'Idelele',
    category: 'Horticulture',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['IIb', 'III', 'IV', 'V'],
    recommendedVarieties: ['Clemson Spineless', 'Star 9060', 'Emerald Green', 'Kirikou F1'],
    rainfallRequirementMm: { min: 350, max: 600 },
    maturityDays: 55,
    expectedYieldTonPerHa: { low: 8.0, avg: 15.0, high: 22.0 },
    pfumvudzaYieldBags: { low: 12, avg: 24, high: 36 }, // 10kg boxes
    suitabilityScore: 94,
    suitabilityReason: 'Outstanding drought and heat tolerance suited for hotter lowveld areas (Regions III, IV, V). High daily consumption across Zimbabwean households and commercial culinary market.',
    plantingTriggerCondition: 'Direct seed from September to January when soil is thoroughly warm (>22°C).',
    zeroToMaturitySchedule: [
      {
        stage: 'Basin Prep & Basal Dressing',
        timingDap: '-5 to 0 DAP',
        task: 'Dig basins spaced 75cm x 40cm; apply kraal manure and Compound D.',
        recommendedInput: 'Compound D (7:14:7)',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '300 kg/ha',
        pfumvudzaPlotRate: '18 kg Compound D',
        estimatedCostUsd: 24.00,
        criticalAdvisory: 'Okra tolerates poor soils but yields triple with modest basal phosphate.'
      },
      {
        stage: 'Soaking & Sowing Seed',
        timingDap: '0 DAP',
        task: 'Soak hard seed in lukewarm water for 12 hours before planting 3 seeds per station 2.5cm deep; thin to 1 plant.',
        recommendedInput: 'Certified Seed',
        brandName: 'Clemson Spineless',
        applicationRate: '8 - 10 kg/ha',
        pfumvudzaPlotRate: '600g seed',
        estimatedCostUsd: 12.00,
        criticalAdvisory: 'Water soaking breaks seed coat dormancy and speeds emergence from 12 days to 5 days.'
      },
      {
        stage: 'Flea Beetle & Aphid Management',
        timingDap: '15 to 40 DAP',
        task: 'Spray Karate Zeon or Malathion if tiny shot-holes appear on young seedling leaves.',
        recommendedInput: 'Karate Zeon 5CS',
        brandName: 'Karate Zeon',
        applicationRate: '100 ml/ha',
        pfumvudzaPlotRate: '10ml/knapsack',
        estimatedCostUsd: 8.00,
        criticalAdvisory: 'Flea beetles can skeletonize young cotyledons in warm dry spells.'
      },
      {
        stage: 'Daily Tender Pod Harvest',
        timingDap: '55 to 110 DAP',
        task: 'Cut tender pods 7-10cm long every 2 days wearing gloves; pods become tough and woody if left too long.',
        recommendedInput: 'Pruning shears + Gloves',
        brandName: 'Hand harvest',
        applicationRate: 'Harvest every 48 hours',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Regular picking stimulates the plant to produce flowers continuously for 8 weeks.'
      }
    ]
  },
  {
    cropId: 'eggplant_horticulture',
    name: 'Eggplant / Brinjal',
    shonaName: 'Bhurinjari / Zai rePasi',
    ndebeleName: 'I-Eggplanti',
    category: 'Horticulture',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['I', 'IIa', 'IIb', 'III', 'IV'],
    recommendedVarieties: ['Black Beauty', 'Florida High Bush', 'Long Purple'],
    rainfallRequirementMm: { min: 400, max: 650 },
    maturityDays: 75,
    expectedYieldTonPerHa: { low: 20.0, avg: 35.0, high: 50.0 },
    pfumvudzaYieldBags: { low: 25, avg: 45, high: 65 }, // 10kg boxes
    suitabilityScore: 89,
    suitabilityReason: 'Hardy solanaceous crop bearing prolifically for up to 5 months. Popular in urban Asian markets, restaurants, and local greengrocers ($0.80 - $1.50/kg).',
    plantingTriggerCondition: 'Transplant nursery seedlings in August-November under irrigation or early summer.',
    zeroToMaturitySchedule: [
      {
        stage: 'Ridge Preparation & Basal Nutrition',
        timingDap: '-7 to 0 DAP',
        task: 'Incorporate 15 t/ha manure + Compound C in ridges spaced 90cm x 50cm.',
        recommendedInput: 'Compound C (5:15:12)',
        brandName: 'Compound C (5:15:12)',
        applicationRate: '500 kg/ha',
        pfumvudzaPlotRate: '30 kg Compound C',
        estimatedCostUsd: 42.00,
        criticalAdvisory: 'Eggplant demands heavy potassium for glossy, thick-walled fruit skin.'
      },
      {
        stage: 'Transplanting Seedlings',
        timingDap: '0 DAP',
        task: 'Transplant 6-week-old hardened seedlings 50cm apart.',
        recommendedInput: 'Certified Seedlings',
        brandName: 'Black Beauty',
        applicationRate: '22,000 plants/ha',
        pfumvudzaPlotRate: '1,400 plants',
        estimatedCostUsd: 15.00,
        criticalAdvisory: 'Stake heavy-bearing plants to prevent fruit touching soil and rotting.'
      },
      {
        stage: 'Red Spider Mite & Fruit Borer Spray',
        timingDap: '30 to 75 DAP',
        task: 'Spray Prove 1.92EC or Karate against spider mites and fruit borers.',
        recommendedInput: 'Prove 1.92EC',
        brandName: 'Prove',
        applicationRate: '250 ml/ha',
        pfumvudzaPlotRate: '15ml/knapsack',
        estimatedCostUsd: 14.00,
        criticalAdvisory: 'Red spider mites thrive in hot dry weather; check underside of leaves for fine webbing.'
      },
      {
        stage: 'Harvesting Glossy Fruit',
        timingDap: '70 to 140 DAP',
        task: 'Harvest when fruit is plump, heavy, and skin is glossy and deep purple.',
        recommendedInput: 'Pruning shears',
        brandName: 'Hand harvest with calyx',
        applicationRate: 'Weekly harvest',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Cut with 2cm green calyx stem intact; dull skin indicates over-ripeness and bitter seeds.'
      }
    ]
  },
  {
    cropId: 'strawberries_horticulture',
    name: 'High-Value Commercial Strawberries',
    shonaName: 'Sitirobheri',
    ndebeleName: 'I-Strobheri',
    category: 'Horticulture',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['I', 'IIa', 'IIb'],
    recommendedVarieties: ['Chandler', 'Camarosa', 'Albion', 'Festival'],
    rainfallRequirementMm: { min: 450, max: 700 },
    maturityDays: 80,
    expectedYieldTonPerHa: { low: 12.0, avg: 22.0, high: 35.0 },
    pfumvudzaYieldBags: { low: 300, avg: 600, high: 900 }, // 250g punnets per week
    suitabilityScore: 94,
    suitabilityReason: 'Supreme high-value horticulture crop popular in Domboshava, Marondera, Honde Valley, and peri-urban Harare ($3.00 - $6.00/kg). Generates massive bi-weekly income from April through November.',
    plantingTriggerCondition: 'Plant runner splits into plastic-mulched raised beds in March/April as winter sets in.',
    zeroToMaturitySchedule: [
      {
        stage: 'Raised Beds, Drip Tape & Black Plastic Mulch',
        timingDap: '-10 to 0 DAP',
        task: 'Form 25cm high raised beds; incorporate compost + Compound S (7:21:8 + 9S + 0.1B); lay drip line and UV black mulch film.',
        recommendedInput: 'Compound S (7:21:8 + 9S + 0.1B) + Black Plastic Mulch',
        brandName: 'Compound S (7:21:8 + 9S + 0.1B)',
        applicationRate: '600 kg/ha Compound S',
        pfumvudzaPlotRate: '35 kg Compound S',
        estimatedCostUsd: 65.00,
        criticalAdvisory: 'Black plastic mulch prevents fruit rotting on bare soil, suppresses weeds, and keeps root zone moist.'
      },
      {
        stage: 'Runner Planting',
        timingDap: '0 DAP',
        task: 'Punch holes in plastic spaced 30cm x 30cm double row; plant rooted runners with crown flush with soil level.',
        recommendedInput: 'Certified Disease-Free Strawberry Runners',
        brandName: 'Domboshava / Marondera Chandler Runners',
        applicationRate: '50,000 runners/ha',
        pfumvudzaPlotRate: '3,100 runners',
        estimatedCostUsd: 140.00,
        criticalAdvisory: 'Burying the crown kills the runner; shallow planting exposes roots to drying out.'
      },
      {
        stage: 'Botrytis Grey Mould & Spider Mite Prevention',
        timingDap: '30 to 90 DAP',
        task: 'Spray Dithane M-45 + Kumulus DF or Switch against Botrytis grey mould on flowers and ripening berries.',
        recommendedInput: 'Switch or Dithane M-45 M-45',
        brandName: 'Switch / Dithane M-45',
        applicationRate: '1.0 kg/ha Switch or 2.0 kg/ha Dithane',
        pfumvudzaPlotRate: '20g Switch/knapsack',
        estimatedCostUsd: 28.00,
        criticalAdvisory: 'Botrytis turns ripe berries into fuzzy grey slime within 24 hours under damp morning conditions.'
      },
      {
        stage: 'Bi-Weekly Punnet Picking',
        timingDap: '75 to 210 DAP',
        task: 'Pick 3/4 to full red berries every 3 days by pinching stem 1cm above berry; pack directly into 250g plastic punnets.',
        recommendedInput: 'Clear 250g clamshell punnets',
        brandName: 'Direct field pack punnets',
        applicationRate: 'Twice weekly harvest for 6 months',
        pfumvudzaPlotRate: 'Labor + Punnets ($30)',
        estimatedCostUsd: 30.00,
        criticalAdvisory: 'Never touch the fruit pulp directly; always pick by the stem to prevent bruising.'
      }
    ]
  },
  {
    cropId: 'sweetcorn_horticulture',
    name: 'Hybrid Sweetcorn & Baby Corn',
    shonaName: 'Chibage Chekutapira',
    ndebeleName: 'Umumbu Omnandi',
    category: 'Horticulture',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['I', 'IIa', 'IIb', 'III'],
    recommendedVarieties: ['Seed Co SC 407 Sweetcorn', 'Star 7714', 'Starke Ayres Hollywood', 'GSS 5649'],
    rainfallRequirementMm: { min: 450, max: 700 },
    maturityDays: 75,
    expectedYieldTonPerHa: { low: 10.0, avg: 16.0, high: 24.0 },
    pfumvudzaYieldBags: { low: 40, avg: 75, high: 110 }, // Bags of 50 fresh green cobs
    suitabilityScore: 93,
    suitabilityReason: 'Sold fresh as green cobs to city supermarkets and roadside braai vendors ($0.25 - $0.50 per fresh cob). Fast 75-day turnaround compared to 140 days for grain maize.',
    plantingTriggerCondition: 'Plant staggered plantings every 3 weeks under irrigation from August to March.',
    zeroToMaturitySchedule: [
      {
        stage: 'Basin Dosing & Basal Compound D',
        timingDap: '-5 to 0 DAP',
        task: 'Dig Pfumvudza basins spaced 75cm x 30cm; apply Compound D (7:14:7) covered with 2cm soil.',
        recommendedInput: 'Compound D (7:14:7) (7:14:7)',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '350 kg/ha',
        pfumvudzaPlotRate: '22 kg Compound D',
        estimatedCostUsd: 28.00,
        criticalAdvisory: 'Isolate sweetcorn from standard grain maize by at least 150m to prevent cross-pollination which makes kernels starchy.'
      },
      {
        stage: 'Precision Sowing',
        timingDap: '0 DAP',
        task: 'Sow 2 seeds per basin 3cm deep; thin to 1 plant at 10 DAE.',
        recommendedInput: 'Certified Hybrid Sweetcorn Seed',
        brandName: 'Seed Co SC 407 Sweetcorn',
        applicationRate: '15 - 18 kg/ha',
        pfumvudzaPlotRate: '1.2 kg seed',
        estimatedCostUsd: 25.00,
        criticalAdvisory: 'Sweetcorn seed has shrunken wrinkled kernels; handle gently to avoid cracking embryo.'
      },
      {
        stage: 'Fall Armyworm Early Scouting & Spray',
        timingDap: '14 to 35 DAP',
        task: 'Apply Ampligo 150ZC or Karate into the plant funnel before caterpillars bore into the developing cob.',
        recommendedInput: 'Ampligo 150ZC',
        brandName: 'Ampligo',
        applicationRate: '150 ml/ha',
        pfumvudzaPlotRate: '10ml/knapsack directed into funnel',
        estimatedCostUsd: 14.00,
        criticalAdvisory: 'Worm-eaten cobs cannot be sold to retail supermarkets.'
      },
      {
        stage: 'Top Dressing Nitrogen',
        timingDap: '28 DAP (Knee High)',
        task: 'Apply 1 beer bottle cap Ammonium Nitrate per plant; hill soil up around stalks.',
        recommendedInput: 'Ammonium Nitrate (AN 34.5% N) (34.5% N)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '250 kg/ha',
        pfumvudzaPlotRate: '15 kg AN',
        estimatedCostUsd: 22.00,
        criticalAdvisory: 'Adequate nitrogen ensures complete tip fill of kernels.'
      },
      {
        stage: 'Milk Stage Harvest',
        timingDap: '70 to 80 DAP',
        task: 'Harvest when silks turn brown and puncture of kernel yields milky sap (not clear water and not thick dough).',
        recommendedInput: 'Hand snapping',
        brandName: 'Early morning field snapping',
        applicationRate: 'Direct morning harvest',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Sugars rapidly turn to starch after picking; deliver to market or cold store within 6 hours.'
      }
    ]
  },
  // ==================== EXPANDED SEASONAL FIELD & CASH CROPS ====================
  {
    cropId: 'sugar_beans_legume',
    name: 'Certified Sugar Beans / Dry Field Beans',
    shonaName: 'Bhinzi DzeMutsvairo / Mbambaira DzeChirimo',
    ndebeleName: 'Indumba / Amabhinzi',
    category: 'Legume',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['I', 'IIa', 'IIb', 'III'],
    recommendedVarieties: ['Seed Co SC Bounty', 'Gloria (National Standard)', 'NUA 45 (Biofortified High-Iron)', 'Sweet Valentine'],
    rainfallRequirementMm: { min: 450, max: 700 },
    maturityDays: 90,
    expectedYieldTonPerHa: { low: 1.5, avg: 2.8, high: 4.0 },
    pfumvudzaYieldBags: { low: 4, avg: 7, high: 11 }, // 50kg bags
    suitabilityScore: 95,
    suitabilityReason: 'Zimbabwe\'s premiere food and cash pulse ($1.50 - $2.20/kg wholesale). NUA 45 variety is biofortified with Iron and Zinc for child cognitive growth. Fixes nitrogen for subsequent maize rotation.',
    plantingTriggerCondition: 'Plant between 15 December and 15 January to avoid mid-season heavy rains during pod filling which cause anthracnose.',
    zeroToMaturitySchedule: [
      {
        stage: 'Basin Prep & Basal Phosphate Dosing',
        timingDap: '-5 to 0 DAP',
        task: 'Dig Pfumvudza basins spaced 75cm x 30cm; apply Compound D or Single Super Phosphate.',
        recommendedInput: 'Compound D (7:14:7) (7:14:7) or SSP',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '200 - 250 kg/ha',
        pfumvudzaPlotRate: '15 kg Compound D',
        estimatedCostUsd: 22.00,
        criticalAdvisory: 'Sugar beans are sensitive to soil acidity; ensure soil pH is above 5.2.'
      },
      {
        stage: 'Rhizobium Inoculation & Sowing',
        timingDap: '0 DAP',
        task: 'Coat seed with Grasslands Rhizobium inoculant; sow 3 seeds per basin, 4cm deep.',
        recommendedInput: 'Certified Seed + Grasslands Inoculant',
        brandName: 'Seed Co SC Bounty / NUA 45',
        applicationRate: '60 - 80 kg/ha',
        pfumvudzaPlotRate: '4.5 kg seed + $2 inoculant packet',
        estimatedCostUsd: 28.00,
        criticalAdvisory: 'Inoculation replaces expensive top-dressing nitrogen fertilizers.'
      },
      {
        stage: 'Bean Stem Maggot & Anthracnose Spray',
        timingDap: '14 to 35 DAP',
        task: 'Spray Karate Zeon against stem maggot and Dithane M-45 against bean rust/anthracnose.',
        recommendedInput: 'Karate Zeon + Dithane M-45 M-45',
        brandName: 'Karate Zeon + Dithane M-45',
        applicationRate: '100 ml Karate + 1.8 kg Dithane/ha',
        pfumvudzaPlotRate: '10ml Karate + 35g Dithane/knapsack',
        estimatedCostUsd: 15.00,
        criticalAdvisory: 'Humid conditions trigger rapid anthracnose pod rot; preventive spraying is essential.'
      },
      {
        stage: 'Harvesting & Pod Shelling',
        timingDap: '85 to 100 DAP',
        task: 'Pull plants when 90% of pods turn yellow-brown; dry on tarpaulins before threshing.',
        recommendedInput: 'Clean heavy tarpaulin',
        brandName: 'Manual beating and winnowing',
        applicationRate: 'Dry threshing',
        pfumvudzaPlotRate: 'Family labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Thresh gently to avoid splitting the seed coat; split beans are rejected by packaging buyers.'
      }
    ]
  },
  {
    cropId: 'malting_barley_seasonal',
    name: 'Winter Irrigated Malting Barley',
    shonaName: 'Bhari reDoro',
    ndebeleName: 'I-Bhali',
    category: 'Cereal',
    seasonType: 'Winter Irrigated',
    suitableRegions: ['IIa', 'IIb', 'III'],
    recommendedVarieties: ['Cocktail', 'Fortress', 'Delta Guaranteed Varieties'],
    rainfallRequirementMm: { min: 400, max: 600 },
    maturityDays: 130,
    expectedYieldTonPerHa: { low: 4.5, avg: 6.8, high: 9.0 },
    pfumvudzaYieldBags: { low: 12, avg: 19, high: 26 }, // 50kg bags
    suitabilityScore: 92,
    suitabilityReason: 'Guaranteed contract cash crop grown under commercial winter center-pivots or flood irrigation for Delta Beverages malting plant in Kwekwe. Strictly requires low grain protein (<11.5%).',
    plantingTriggerCondition: 'Plant between 1 May and 31 May under full irrigation to escape late spring rains and heat stress during grain filling.',
    zeroToMaturitySchedule: [
      {
        stage: 'Fine Seedbed & Basal Fertilizer',
        timingDap: '-5 to 0 DAP',
        task: 'Disc and roll to firm, level seedbed; broadcast Compound D or Wheat/Barley blend.',
        recommendedInput: 'Compound D (7:14:7) / Cereal Basal Blend',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '400 kg/ha',
        pfumvudzaPlotRate: '25 kg Compound D',
        estimatedCostUsd: 34.00,
        criticalAdvisory: 'Level seedbed ensures uniform irrigation water distribution and even seedling emergence.'
      },
      {
        stage: 'Drilling Certified Seed',
        timingDap: '0 DAP',
        task: 'Drill seed at 17cm row spacing, 3cm deep; irrigate immediately to 100% field capacity.',
        recommendedInput: 'Certified Malting Barley Seed',
        brandName: 'Delta / Seed Co Cocktail',
        applicationRate: '100 - 110 kg/ha',
        pfumvudzaPlotRate: '7 kg seed',
        estimatedCostUsd: 40.00,
        criticalAdvisory: 'Calibrate seeder accurately; uneven plant population creates varied tiller sizes and non-uniform malt.'
      },
      {
        stage: 'Split Top Dressing (Strict Nitrogen Control)',
        timingDap: '21 and 42 DAP',
        task: 'Apply Ammonium Nitrate early at tillering (21 DAP); do NOT apply late nitrogen.',
        recommendedInput: 'Ammonium Nitrate (AN 34.5% N) (34.5% N)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '180 - 220 kg/ha in 2 early splits',
        pfumvudzaPlotRate: '13 kg AN total',
        estimatedCostUsd: 22.00,
        criticalAdvisory: 'Late nitrogen after 45 DAP raises grain protein above 11.5%, which causes contract rejection by brewmasters.'
      },
      {
        stage: 'Leaf Rust & Powdery Mildew Spray',
        timingDap: '55 to 75 DAP',
        task: 'Apply Nativo 300SC or Folicur 250EC when flag leaf emerges.',
        recommendedInput: 'Nativo 300SC (Tebuconazole + Trifloxystrobin) or Folicur 250EC',
        brandName: 'Nativo 300SC / Folicur 250EW',
        applicationRate: '400 ml/ha Nativo or 750 ml/ha Folicur',
        pfumvudzaPlotRate: '15ml Nativo/knapsack',
        estimatedCostUsd: 26.00,
        criticalAdvisory: 'Protecting the flag leaf accounts for over 50% of total barley grain fill.'
      },
      {
        stage: 'Combine Harvesting',
        timingDap: '125 to 140 DAP',
        task: 'Harvest when grain moisture drops below 12.5%; check for plump, unbroken kernels.',
        recommendedInput: 'Combine harvester with drum speed adjusted',
        brandName: 'Clean mechanized harvest',
        applicationRate: 'Mechanical combine',
        pfumvudzaPlotRate: 'Contract combine service',
        estimatedCostUsd: 35.00,
        criticalAdvisory: 'Skinning or cracking grains during threshing kills the malt embryo; maintain low cylinder speed.'
      }
    ]
  },
  {
    cropId: 'sesame_oilseed',
    name: 'Export Sesame / Simsim',
    shonaName: 'Rusinga / Runinga',
    ndebeleName: 'Inhlaba Yembewu / I-Sesame',
    category: 'Oilseed',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['III', 'IV', 'V'],
    recommendedVarieties: ['S-42', 'Lindy White', 'Valley Seeds Drought Sesame'],
    rainfallRequirementMm: { min: 300, max: 500 },
    maturityDays: 100,
    expectedYieldTonPerHa: { low: 0.8, avg: 1.5, high: 2.2 },
    pfumvudzaYieldBags: { low: 3, avg: 6, high: 9 }, // 50kg bags
    suitabilityScore: 95,
    suitabilityReason: 'Supreme drought-hardy oilseed cash crop for dry communal lowvelds (Chiredzi, Beitbridge, Mwenezi, Gokwe, Mudzi). Booming export demand to Asian confectionery markets ($1.00 - $1.40/kg). Requires almost zero fertilizer.',
    plantingTriggerCondition: 'Plant on first warm rains in late November or December; thrives in high summer temperatures >30°C.',
    zeroToMaturitySchedule: [
      {
        stage: 'Fine Seedbed Prep & Modest Basal',
        timingDap: '-5 to 0 DAP',
        task: 'Shallow cultivate; apply small band of Compound L or Compound D.',
        recommendedInput: 'Compound D (7:14:7) (7:14:7)',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '100 - 150 kg/ha (very low requirement)',
        pfumvudzaPlotRate: '8 kg Compound D',
        estimatedCostUsd: 12.00,
        criticalAdvisory: 'Sesame deep taproot extracts moisture and nutrients from depths where maize cannot reach.'
      },
      {
        stage: 'Precision Sowing Tiny Seed',
        timingDap: '0 DAP',
        task: 'Mix 1 part tiny seed with 3 parts dry sand or ash for uniform distribution; sow 1.5cm deep in rows 45cm apart.',
        recommendedInput: 'Certified Sesame Seed',
        brandName: 'Valley Seeds / Agritex White Sesame',
        applicationRate: '4 - 6 kg/ha',
        pfumvudzaPlotRate: '350g seed',
        estimatedCostUsd: 9.00,
        criticalAdvisory: 'Never plant deeper than 2cm; tiny sesame seedlings cannot push through deep soil.'
      },
      {
        stage: 'Thinning & Sesame Webworm Control',
        timingDap: '20 to 35 DAP',
        task: 'Thin seedlings to 10cm apart; spray Karate Zeon if sesame webworms (Antigastra) fold leaves.',
        recommendedInput: 'Karate Zeon 5CS',
        brandName: 'Karate Zeon',
        applicationRate: '100 ml/ha',
        pfumvudzaPlotRate: '10ml/knapsack',
        estimatedCostUsd: 7.00,
        criticalAdvisory: 'Unthinned sesame becomes spindly and yields only a fraction of potential capsules.'
      },
      {
        stage: 'Shock Stooking & Inverted Drying',
        timingDap: '95 to 115 DAP',
        task: 'Cut plants when lowest capsules turn yellowish-brown; bundle into upright shocks on canvas sheets to allow capsules to open naturally.',
        recommendedInput: 'Sickle + Heavy canvas/tarpaulins',
        brandName: 'Shock drying and shaking',
        applicationRate: 'Upright stooking',
        pfumvudzaPlotRate: 'Family labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Do not wait for top pods to dry in the field; capsules shatter and drop all expensive seed onto the ground.'
      }
    ]
  },
  {
    cropId: 'paprika_cash_crop',
    name: 'Commercial Export Paprika',
    shonaName: 'Mhiripiri yeKutengesa',
    ndebeleName: 'I-Paphirika',
    category: 'Cash Crop',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['IIa', 'IIb', 'III'],
    recommendedVarieties: ['King Paprika', 'Papriqueen', 'Red Bovine F1'],
    rainfallRequirementMm: { min: 500, max: 750 },
    maturityDays: 140,
    expectedYieldTonPerHa: { low: 2.5, avg: 4.5, high: 7.0 },
    pfumvudzaYieldBags: { low: 8, avg: 15, high: 24 }, // 50kg bags dried pods
    suitabilityScore: 91,
    suitabilityReason: 'High-value export cash crop cultivated under outgrower contracts. Prized for red oleoresin extract used worldwide in natural food coloring ($1.40 - $2.20/kg dry grade A).',
    plantingTriggerCondition: 'Transplant nursery seedlings in October/November with early irrigation or first good summer rains.',
    zeroToMaturitySchedule: [
      {
        stage: 'Basin Prep & High Phosphate Basal',
        timingDap: '-7 to 0 DAP',
        task: 'Dig basins spaced 75cm x 40cm; apply Compound C (5:15:12) + Kraal manure.',
        recommendedInput: 'Compound C (5:15:12) (5:15:12)',
        brandName: 'Compound C (5:15:12)',
        applicationRate: '500 kg/ha',
        pfumvudzaPlotRate: '30 kg Compound C',
        estimatedCostUsd: 42.00,
        criticalAdvisory: 'Paprika requires heavy potassium and phosphorus for vibrant red pigment synthesis.'
      },
      {
        stage: 'Transplanting Nursery Seedlings',
        timingDap: '0 DAP',
        task: 'Transplant 6-8 week hardened seedlings 40cm apart; water immediately.',
        recommendedInput: 'Certified Seedlings',
        brandName: 'King Paprika Certified Seedlings',
        applicationRate: '30,000 seedlings/ha',
        pfumvudzaPlotRate: '1,900 seedlings',
        estimatedCostUsd: 22.00,
        criticalAdvisory: 'Harden seedlings in the nursery by withholding water 5 days prior to field planting.'
      },
      {
        stage: 'Bacterial Spot & Anthracnose Spray Program',
        timingDap: '28 to 70 DAP',
        task: 'Apply Copper Oxychloride + Dithane M-45 alternately every 10 days during rainy season.',
        recommendedInput: 'Copper Oxychloride + Dithane M-45',
        brandName: 'Copper Oxychloride + Dithane M-45',
        applicationRate: '2.5 kg Copper / 2.0 kg Dithane per ha',
        pfumvudzaPlotRate: '40g Copper / 35g Dithane/knapsack',
        estimatedCostUsd: 20.00,
        criticalAdvisory: 'Bacterial spot (Xanthomonas) lesions cause pod drop and disqualify pods from Grade A ASTA rating.'
      },
      {
        stage: 'Ammonium Nitrate Top Dressing',
        timingDap: '30 and 60 DAP',
        task: 'Apply AN granular in two splits; do not apply excessive nitrogen after fruit set.',
        recommendedInput: 'Ammonium Nitrate (AN 34.5% N) (34.5% N)',
        brandName: 'Ammonium Nitrate (AN 34.5% N)',
        applicationRate: '200 kg/ha in 2 splits',
        pfumvudzaPlotRate: '12 kg AN total',
        estimatedCostUsd: 18.00,
        criticalAdvisory: 'Excessive nitrogen delays pod ripening and lowers the ASTA color score.'
      },
      {
        stage: 'Selective Deep-Red Pod Picking & Solar Curing',
        timingDap: '110 to 160 DAP',
        task: 'Harvest only 100% deep crimson red, partially wilted pods; cure on raised wire drying racks covered from rain.',
        recommendedInput: 'Raised wire mesh drying racks',
        brandName: 'Solar tunnel drying',
        applicationRate: 'Periodic weekly picking',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Never pick orange or green pods; paprika does not develop red oleoresin off the vine.'
      }
    ]
  },
  {
    cropId: 'pigeon_peas_legume',
    name: 'Pigeon Peas / Red Gram',
    shonaName: 'Nzuwa / Mutorododo',
    ndebeleName: 'Udumba / Umdandazo',
    category: 'Small Grain',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['III', 'IV', 'V'],
    recommendedVarieties: ['Valley Seeds ICEAP 00040', 'ICEAP 00557', 'Local Communal Landrace'],
    rainfallRequirementMm: { min: 350, max: 600 },
    maturityDays: 150,
    expectedYieldTonPerHa: { low: 1.2, avg: 2.2, high: 3.5 },
    pfumvudzaYieldBags: { low: 4, avg: 7, high: 11 }, // 50kg bags
    suitabilityScore: 96,
    suitabilityReason: 'Supreme perennial/semi-perennial drought break-crop for dry regions. Deep 2m taproot breaks hardpan plough pans; enriches soil with 40-70 kg N/ha; woody stems provide vital cooking firewood for communal homes.',
    plantingTriggerCondition: 'Plant on first summer rains in November/December as intercrop with sorghum or sole crop.',
    zeroToMaturitySchedule: [
      {
        stage: 'Basin Prep & Minimal Basal Phosphate',
        timingDap: '-5 to 0 DAP',
        task: 'Dig Pfumvudza basins spaced 1m x 50cm; apply kraal manure + small band Single Super Phosphate.',
        recommendedInput: 'Kraal manure + SSP',
        brandName: 'Single Superphosphate (SSP) / Compound D',
        applicationRate: '150 kg/ha',
        pfumvudzaPlotRate: '10 kg SSP',
        estimatedCostUsd: 14.00,
        criticalAdvisory: 'Tolerates poor, rocky soils where maize completely wilts.'
      },
      {
        stage: 'Direct Sowing',
        timingDap: '0 DAP',
        task: 'Sow 2 seeds per station 3cm deep; thin to 1 vigorous bush.',
        recommendedInput: 'Certified Seed',
        brandName: 'Valley Seeds ICEAP 00040',
        applicationRate: '15 - 20 kg/ha',
        pfumvudzaPlotRate: '1.2 kg seed',
        estimatedCostUsd: 11.00,
        criticalAdvisory: 'Extremely slow early vegetative growth; keep free of weeds for first 30 days.'
      },
      {
        stage: 'Pod Borer Management at Flowering',
        timingDap: '70 to 95 DAP',
        task: 'Spray Karate Zeon or Ampligo when flower buds open to prevent pod borers (Helicoverpa armigera).',
        recommendedInput: 'Karate Zeon 5CS',
        brandName: 'Karate Zeon',
        applicationRate: '120 ml/ha',
        pfumvudzaPlotRate: '10ml/knapsack',
        estimatedCostUsd: 9.00,
        criticalAdvisory: 'Pod borers chew directly into young green pods and destroy developing seeds.'
      },
      {
        stage: 'Harvesting & Multi-Year Ratooning',
        timingDap: '140 to 170 DAP',
        task: 'Pick dry brown pods; or cut entire branches. Prune bush to 50cm height; it will resprout vigorously with next year\'s rains.',
        recommendedInput: 'Sickle + Tarpaulin',
        brandName: 'Manual beating and threshing',
        applicationRate: 'Perennial ratoon management',
        pfumvudzaPlotRate: 'Family labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Perennial pigeon pea bushes provide drought food security for 2-3 consecutive seasons without replanting.'
      }
    ]
  },
  {
    cropId: 'cassava_tuber',
    name: 'Drought-Resilient Cassava',
    shonaName: 'Manyoka / Mufarinya',
    ndebeleName: 'Umtshaza',
    category: 'Tuber',
    seasonType: 'All Season / Year-Round',
    suitableRegions: ['IIb', 'III', 'IV', 'V'],
    recommendedVarieties: ['TMS 30572 (High yield, virus resistant)', 'Mweru', 'Chinangwa', 'Agritex Sweet Cassava'],
    rainfallRequirementMm: { min: 350, max: 800 },
    maturityDays: 270,
    expectedYieldTonPerHa: { low: 15.0, avg: 28.0, high: 45.0 },
    pfumvudzaYieldBags: { low: 25, avg: 45, high: 70 }, // 50kg bags fresh tubers
    suitabilityScore: 97,
    suitabilityReason: 'The ultimate underground biological famine insurance policy. Once established, cassava survives severe El Niño droughts without dying. Farmers harvest tubers on demand for up to 2 years after maturity.',
    plantingTriggerCondition: 'Plant stem cuttings on mounds or ridges in October/November before or during early rains.',
    zeroToMaturitySchedule: [
      {
        stage: 'High Mound / Ridge Preparation',
        timingDap: '-7 to 0 DAP',
        task: 'Construct mounds (50cm high, 1m apart); add kraal manure and small Compound D.',
        recommendedInput: 'Kraal manure + Compound D (7:14:7)',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '200 kg/ha',
        pfumvudzaPlotRate: '12 kg Compound D',
        estimatedCostUsd: 16.00,
        criticalAdvisory: 'Loose mounded soil allows huge, straight tuber expansion and effortless digging.'
      },
      {
        stage: 'Stem Cutting Planting',
        timingDap: '0 DAP',
        task: 'Plant mature woody stem cuttings (25cm long with 4-6 nodes) slanted at 45 degrees with 2/3 buried underground.',
        recommendedInput: 'Clean Disease-Free Stem Cuttings',
        brandName: 'Agritex / TRB Clean Stem Stakes',
        applicationRate: '10,000 stakes/ha',
        pfumvudzaPlotRate: '625 stem cuttings',
        estimatedCostUsd: 12.00,
        criticalAdvisory: 'Ensure buds point upwards; planting cuttings upside down delays sprouting.'
      },
      {
        stage: 'Cassava Green Mite & Mealybug Monitoring',
        timingDap: '45 to 120 DAP',
        task: 'Scout for cassava mosaic disease (CMD - leaf crinkling); rogue out infected plants immediately.',
        recommendedInput: 'Field sanitary roguing',
        brandName: 'Clean culture roguing',
        applicationRate: 'Zero spray needed for resistant varieties',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Planting certified CMD-resistant TMS varieties completely eliminates need for chemical sprays.'
      },
      {
        stage: 'Flexible In-Ground Storage & Lifting',
        timingDap: '240 to 450 DAP',
        task: 'Dig tubers progressively as needed for family consumption, flour milling, or livestock starch feed.',
        recommendedInput: 'Harvest fork',
        brandName: 'Progressive fresh harvest',
        applicationRate: 'On-demand harvesting',
        pfumvudzaPlotRate: 'Labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Fresh cassava tubers deteriorate 48 hours after lifting; process into dried chips (Garinyoka) or freeze immediately.'
      }
    ]
  },
  {
    cropId: 'castor_bean_oilseed',
    name: 'Industrial Castor Bean',
    shonaName: 'Mupfuta / Mafuta ePfuta',
    ndebeleName: 'Umhlakuva',
    category: 'Oilseed',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['IIb', 'III', 'IV', 'V'],
    recommendedVarieties: ['Galit Hybrid', 'BRS 149', 'Local Commercial Castor'],
    rainfallRequirementMm: { min: 350, max: 600 },
    maturityDays: 120,
    expectedYieldTonPerHa: { low: 1.2, avg: 2.4, high: 3.8 },
    pfumvudzaYieldBags: { low: 4, avg: 7, high: 12 }, // 50kg bags
    suitabilityScore: 92,
    suitabilityReason: 'Industrial lubricant and biofuel oilseed with extraordinary drought tolerance. Livestock do not graze on castor due to ricin, making it immune to cattle destruction in unfenced communal lands ($0.70 - $1.10/kg).',
    plantingTriggerCondition: 'Direct seed in November/December on first 20mm rainfall.',
    zeroToMaturitySchedule: [
      {
        stage: 'Basin Dosing & Basal Compound D',
        timingDap: '-5 to 0 DAP',
        task: 'Dig basins spaced 1.5m x 1m; apply kraal manure + Compound D.',
        recommendedInput: 'Compound D (7:14:7)',
        brandName: 'Compound D (7:14:7)',
        applicationRate: '200 kg/ha',
        pfumvudzaPlotRate: '12 kg Compound D',
        estimatedCostUsd: 16.00,
        criticalAdvisory: 'Extremely deep rooting system breaks subsoil compacted layers.'
      },
      {
        stage: 'Planting',
        timingDap: '0 DAP',
        task: 'Plant 2 seeds per station 4cm deep; thin to 1 vigorous bush at 14 DAE.',
        recommendedInput: 'Certified Hybrid Castor Seed',
        brandName: 'Certified High-Yield Castor Bean Seed',
        applicationRate: '8 - 12 kg/ha',
        pfumvudzaPlotRate: '750g seed',
        estimatedCostUsd: 14.00,
        criticalAdvisory: 'WARNING: Castor seeds contain lethal ricin; keep away from children and poultry feed.'
      },
      {
        stage: 'Semilooper & Capsule Borer Control',
        timingDap: '40 to 80 DAP',
        task: 'Spray Karate Zeon or Malathion if castor semilooper caterpillars defoliate leaves.',
        recommendedInput: 'Karate Zeon 5CS',
        brandName: 'Karate Zeon',
        applicationRate: '120 ml/ha',
        pfumvudzaPlotRate: '10ml/knapsack',
        estimatedCostUsd: 9.00,
        criticalAdvisory: 'Defoliation during flowering aborts developing spike racemes.'
      },
      {
        stage: 'Spike Harvesting & Threshing',
        timingDap: '110 to 150 DAP',
        task: 'Clip brown, dry racemes into bags; sun dry on tarpaulin until capsules pop open.',
        recommendedInput: 'Pruning shears + Tarpaulins',
        brandName: 'Manual harvesting',
        applicationRate: 'Bi-weekly raceme cutting',
        pfumvudzaPlotRate: 'Family labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Always wear gloves when handling and threshing dry castor pods.'
      }
    ]
  },
  {
    cropId: 'sunnhemp_forage_legume',
    name: 'Sunnhemp & Velvet Bean (Green Manure & Forage)',
    shonaName: 'Mupfudze Wegirinhi / Hurukuru yeMombe',
    ndebeleName: 'Umquba Oluhlaza / Ukudla Kwenkomo',
    category: 'Legume',
    seasonType: 'Summer Rainfed',
    suitableRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    recommendedVarieties: ['Valley Seeds Crotalaria juncea (Sunnhemp)', 'Mucuna pruriens (Velvet Bean)', 'Lablab purpureus'],
    rainfallRequirementMm: { min: 350, max: 700 },
    maturityDays: 75,
    expectedYieldTonPerHa: { low: 20.0, avg: 35.0, high: 50.0 }, // Fresh green biomass for plough-down
    pfumvudzaYieldBags: { low: 15, avg: 25, high: 40 }, // Bales of cured high-protein winter cattle hay
    suitabilityScore: 98,
    suitabilityReason: 'The master soil rejuvenator and winter cattle fodder bank. Suppresses root-knot nematodes by up to 90%; fixes over 120 kg N/ha into the soil; provides 18-22% crude protein hay that stops communal cattle dying of poverty in dry winter months.',
    plantingTriggerCondition: 'Broadcast or drill in November-January on any shower; germinates in 3 days.',
    zeroToMaturitySchedule: [
      {
        stage: 'Rough Seedbed Broadcast',
        timingDap: '0 DAP',
        task: 'Broadcast seed over Pfumvudza inter-rows or dedicated fallow field; lightly harrow or rake in 2-3cm.',
        recommendedInput: 'Valley Seeds Inoculated Sunnhemp / Velvet Bean Seed',
        brandName: 'Valley Seeds Sunnhemp / Mucuna',
        applicationRate: '35 - 45 kg/ha',
        pfumvudzaPlotRate: '2.5 kg seed',
        estimatedCostUsd: 15.00,
        criticalAdvisory: 'Requires ZERO fertilizer. Produces massive lush green biomass on residual soil nutrients.'
      },
      {
        stage: 'Smother Canopy & Weed Suppression',
        timingDap: '15 to 45 DAP',
        task: 'Dense leafy canopy smothers all annual weeds including witchweed (Striga) and couch grass (Tsangadzi).',
        recommendedInput: 'Natural biological suppression',
        brandName: 'Zero weeding required',
        applicationRate: 'Dense canopy cover',
        pfumvudzaPlotRate: 'Zero cost',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Sunnhemp root exudates act as a bio-nematicide, cleansing soil for upcoming tobacco or tomato crops.'
      },
      {
        stage: 'Soil Incorporation OR Hay Baling',
        timingDap: '60 to 75 DAP (at 50% flowering)',
        task: 'Either chop and incorporate green biomass into soil as organic fertilizer, or cut and cure into high-protein winter cattle hay.',
        recommendedInput: 'Machete or sickle + Hay baling twine',
        brandName: 'Farm organic cycling',
        applicationRate: 'Chop and incorporate into top 15cm soil',
        pfumvudzaPlotRate: 'Family labor',
        estimatedCostUsd: 0.00,
        criticalAdvisory: 'Incorporate at 50% flowering; woody stems after seed set take much longer to decompose in the soil.'
      }
    ]
  }
];

