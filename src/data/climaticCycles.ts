export interface RegionClimaticCycle {
  region: 'I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V';
  regionTitle: string;
  agroZoneDescription: string;
  annualRainfallRangeMm: string;
  seasons: {
    name: string;
    localName: string; // Shona / Ndebele season
    months: string;
    description: string;
    agroAction: string;
    temperatureRangeC: string;
    averageRainfallSharePct: number;
  }[];
  monthlyClimaticData: {
    month: string;
    monthCode: string;
    avgRainfallMm: number;
    evapotranspirationEt0MmPerDay: number;
    avgTempMaxC: number;
    avgTempMinC: number;
    drySpellRiskPct: number;
    agriActivity: string;
  }[];
  optimalPlantingWindow: {
    earliestDate: string; // e.g. "15 November"
    latestRecommendedDate: string; // e.g. "10 December"
    cutoffDate: string; // e.g. "25 December"
    rainTriggerMm3Days: number; // e.g. 28mm
    dryPlantingAllowed: boolean;
    criticalNotes: string;
  };
  criticalDrySpellRiskWindow: {
    period: string; // e.g. "15 January - 28 January"
    probabilityPct: number;
    mitigationStrategy: string;
  };
  irrigationGuidance: {
    isIrrigationMandatory: boolean;
    supplementaryNeedsMm: number;
    criticalStagesRequiringWater: string[];
    recommendedIrrigationIntervalDays: number;
    waterSavingTechnique: string;
  };
}

export const REGION_CLIMATIC_CYCLES: Record<'I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V', RegionClimaticCycle> = {
  'I': {
    region: 'I',
    regionTitle: 'Natural Region I - Eastern Highlands (Specialized & Diversified)',
    agroZoneDescription: 'High altitude (>1,050m), high rainfall (>1,000mm) with continuous misty showers (Guti). Low frost risk except deep valleys.',
    annualRainfallRangeMm: '1,000mm - 1,400mm+',
    seasons: [
      {
        name: 'Warm Spring',
        localName: 'Chirimo / Isilimo',
        months: 'Aug - Oct',
        description: 'Persistent drizzle, valley mists. Temperature warms from 18°C to 26°C.',
        agroAction: 'Land preparation, tea and coffee nursery care, early horticultural planting under gravity feed.',
        temperatureRangeC: '14°C - 26°C',
        averageRainfallSharePct: 15,
      },
      {
        name: 'Main Summer Rain',
        localName: 'Zhizha / Ihlobo',
        months: 'Nov - Mar',
        description: 'Heavy sustained precipitation, high cloud cover, cyclone exposure from Mozambique channel.',
        agroAction: 'Main summer cropping, disease monitoring (fungal blight), drainage ditch maintenance.',
        temperatureRangeC: '16°C - 27°C',
        averageRainfallSharePct: 75,
      },
      {
        name: 'Autumn Harvest',
        localName: 'Matsutso / Ukwindla',
        months: 'Apr - May',
        description: 'Gradual drop in rainfall, cool crisp mornings, clearing skies.',
        agroAction: 'Physiological maturity drying, macadamia and coffee harvest, winter crop nursery.',
        temperatureRangeC: '12°C - 22°C',
        averageRainfallSharePct: 8,
      },
      {
        name: 'Cold Winter',
        localName: 'Chando / Ubusika',
        months: 'Jun - Jul',
        description: 'Cold, persistent mountain mist (Guti). Very low evaporation.',
        agroAction: 'Pruning fruit orchards, continuous vegetable production under mild valley conditions.',
        temperatureRangeC: '8°C - 19°C',
        averageRainfallSharePct: 2,
      },
    ],
    monthlyClimaticData: [
      { month: 'October', monthCode: 'OCT', avgRainfallMm: 45, evapotranspirationEt0MmPerDay: 4.8, avgTempMaxC: 25, avgTempMinC: 13, drySpellRiskPct: 10, agriActivity: 'Pfumvudza basin digging, manure lining' },
      { month: 'November', monthCode: 'NOV', avgRainfallMm: 140, evapotranspirationEt0MmPerDay: 4.2, avgTempMaxC: 26, avgTempMinC: 15, drySpellRiskPct: 12, agriActivity: 'Early planting window opens after 25mm rain' },
      { month: 'December', monthCode: 'DEC', avgRainfallMm: 260, evapotranspirationEt0MmPerDay: 3.9, avgTempMaxC: 25, avgTempMinC: 16, drySpellRiskPct: 8, agriActivity: 'Active vegetative growth, 1st top dressing' },
      { month: 'January', monthCode: 'JAN', avgRainfallMm: 310, evapotranspirationEt0MmPerDay: 3.8, avgTempMaxC: 24, avgTempMinC: 16, drySpellRiskPct: 5, agriActivity: 'Flowering & tasseling, fungicide sprays for blight' },
      { month: 'February', monthCode: 'FEB', avgRainfallMm: 270, evapotranspirationEt0MmPerDay: 3.7, avgTempMaxC: 24, avgTempMinC: 16, drySpellRiskPct: 7, agriActivity: 'Grain filling & cobs drooping' },
      { month: 'March', monthCode: 'MAR', avgRainfallMm: 160, evapotranspirationEt0MmPerDay: 3.6, avgTempMaxC: 23, avgTempMinC: 14, drySpellRiskPct: 15, agriActivity: 'Black layer maturity reached, field drying' },
      { month: 'April', monthCode: 'APR', avgRainfallMm: 60, evapotranspirationEt0MmPerDay: 3.2, avgTempMaxC: 22, avgTempMinC: 12, drySpellRiskPct: 30, agriActivity: 'Main harvest & dry crib storage' },
      { month: 'May', monthCode: 'MAY', avgRainfallMm: 25, evapotranspirationEt0MmPerDay: 2.8, avgTempMaxC: 20, avgTempMinC: 10, drySpellRiskPct: 70, agriActivity: 'Shelling, moisture testing (12.5%)' },
    ],
    optimalPlantingWindow: {
      earliestDate: '25 October',
      latestRecommendedDate: '10 December',
      cutoffDate: '25 December',
      rainTriggerMm3Days: 25,
      dryPlantingAllowed: false,
      criticalNotes: 'Region I allows long-season hybrids (SC 719, SC 727) due to prolonged rainfall duration. Protect against waterlogging.',
    },
    criticalDrySpellRiskWindow: {
      period: '18 January - 25 January',
      probabilityPct: 12,
      mitigationStrategy: 'Moisture is rarely deficient in Region I; focus on opening drainage furrows to prevent nitrogen leaching.',
    },
    irrigationGuidance: {
      isIrrigationMandatory: false,
      supplementaryNeedsMm: 80,
      criticalStagesRequiringWater: ['Nursery establishment', 'October dry-planting transitions'],
      recommendedIrrigationIntervalDays: 10,
      waterSavingTechnique: 'Gravity-fed furrow management and hillside contour trenches.',
    },
  },

  'IIa': {
    region: 'IIa',
    regionTitle: 'Natural Region IIa - Highveld Intensive Cropping (Mazowe, Goromonzi, Marondera)',
    agroZoneDescription: 'High plateau (1,200m - 1,600m), fertile red loams & sandveld. Reliable summer rainfall (750 - 1,000mm) with low mid-season dry spell probability.',
    annualRainfallRangeMm: '750mm - 1,000mm',
    seasons: [
      {
        name: 'Warm Dry Spring',
        localName: 'Chirimo / Isilimo',
        months: 'Aug - Oct',
        description: 'Dry, sunny, high solar radiation. Rapid daytime warming up to 30°C.',
        agroAction: 'Pfumvudza basin digging (August), mulch collection, Compound D basal procurement.',
        temperatureRangeC: '15°C - 30°C',
        averageRainfallSharePct: 8,
      },
      {
        name: 'Main Summer Rain',
        localName: 'Zhizha / Ihlobo',
        months: 'Nov - Mar',
        description: 'Reliable convective thunderstorms and Intertropical Convergence Zone (ITCZ) rains. Peak precipitation in Dec/Jan.',
        agroAction: 'Main sowing window (Nov 15-Dec 5), split Ammonium Nitrate applications, weed control.',
        temperatureRangeC: '17°C - 28°C',
        averageRainfallSharePct: 84,
      },
      {
        name: 'Autumn Harvest',
        localName: 'Matsutso / Ukwindla',
        months: 'Apr - May',
        description: 'Dry days, warm sunshine, cool nights. Ideal for field moisture reduction.',
        agroAction: 'Maize cob collection, groundnut lifting, grain moisture verification (target <= 12.5%).',
        temperatureRangeC: '13°C - 24°C',
        averageRainfallSharePct: 6,
      },
      {
        name: 'Cold Dry Winter',
        localName: 'Chando / Ubusika',
        months: 'Jun - Jul',
        description: 'Clear sunny days, cold nights (down to 4°C - 7°C), occasional ground frost.',
        agroAction: 'Winter irrigated wheat under center-pivot/furrow, crop residue mulching, GMB deliveries.',
        temperatureRangeC: '6°C - 22°C',
        averageRainfallSharePct: 2,
      },
    ],
    monthlyClimaticData: [
      { month: 'October', monthCode: 'OCT', avgRainfallMm: 30, evapotranspirationEt0MmPerDay: 5.4, avgTempMaxC: 29, avgTempMinC: 15, drySpellRiskPct: 20, agriActivity: 'Finalize Pfumvudza basins, pre-place Compound D' },
      { month: 'November', monthCode: 'NOV', avgRainfallMm: 110, evapotranspirationEt0MmPerDay: 4.8, avgTempMaxC: 28, avgTempMinC: 16, drySpellRiskPct: 18, agriActivity: 'Optimal planting window opens upon 28mm cumulative rain' },
      { month: 'December', monthCode: 'DEC', avgRainfallMm: 210, evapotranspirationEt0MmPerDay: 4.2, avgTempMaxC: 27, avgTempMinC: 17, drySpellRiskPct: 12, agriActivity: 'Thinning at 14 DAP, 1st AN top-dressing at knee height' },
      { month: 'January', monthCode: 'JAN', avgRainfallMm: 240, evapotranspirationEt0MmPerDay: 4.0, avgTempMaxC: 26, avgTempMinC: 17, drySpellRiskPct: 15, agriActivity: '2nd AN split, silking & tasseling peak moisture' },
      { month: 'February', monthCode: 'FEB', avgRainfallMm: 180, evapotranspirationEt0MmPerDay: 4.2, avgTempMaxC: 26, avgTempMinC: 16, drySpellRiskPct: 14, agriActivity: 'Grain filling (milky to dough stage), pest scouting' },
      { month: 'March', monthCode: 'MAR', avgRainfallMm: 95, evapotranspirationEt0MmPerDay: 4.0, avgTempMaxC: 26, avgTempMinC: 15, drySpellRiskPct: 28, agriActivity: 'Physiological maturity (black layer), stalks drying' },
      { month: 'April', monthCode: 'APR', avgRainfallMm: 35, evapotranspirationEt0MmPerDay: 3.5, avgTempMaxC: 24, avgTempMinC: 12, drySpellRiskPct: 60, agriActivity: 'Field harvest, cobs de-husking, drying racks' },
      { month: 'May', monthCode: 'MAY', avgRainfallMm: 10, evapotranspirationEt0MmPerDay: 3.0, avgTempMaxC: 22, avgTempMinC: 9, drySpellRiskPct: 90, agriActivity: 'Shelling, treat with Actellic Gold, store / sell' },
    ],
    optimalPlantingWindow: {
      earliestDate: '12 November',
      latestRecommendedDate: '05 December',
      cutoffDate: '20 December',
      rainTriggerMm3Days: 28,
      dryPlantingAllowed: false,
      criticalNotes: 'Planting after 10 December drops maize yield by 1.2% per day of delay. Strictly sow medium-season hybrids (SC 637 / SC 649).',
    },
    criticalDrySpellRiskWindow: {
      period: '16 January - 26 January',
      probabilityPct: 18,
      mitigationStrategy: 'Ensure grass mulch is >=5cm thick to prevent soil evaporation during this mid-season dry interval.',
    },
    irrigationGuidance: {
      isIrrigationMandatory: false,
      supplementaryNeedsMm: 120,
      criticalStagesRequiringWater: ['Planting germination (if rain delays past 1 Dec)', 'Tasseling / silking (Day 60-70)'],
      recommendedIrrigationIntervalDays: 7,
      waterSavingTechnique: 'Pfumvudza basin retention & micro-drip lateral lines.',
    },
  },

  'IIb': {
    region: 'IIb',
    regionTitle: 'Natural Region IIb - Highveld Semi-Intensive (Chinhoyi, Banket, Bindura)',
    agroZoneDescription: 'High plateau (1,100m - 1,400m). Similar to IIa but experiences more frequent and severe mid-season dry spells in mid-to-late January.',
    annualRainfallRangeMm: '700mm - 850mm',
    seasons: [
      {
        name: 'Warm Dry Spring',
        localName: 'Chirimo / Isilimo',
        months: 'Aug - Oct',
        description: 'Dry, hot afternoons, dry sandy soils.',
        agroAction: 'Mulch gathering, basin construction, lime application on acidic sandveld.',
        temperatureRangeC: '16°C - 32°C',
        averageRainfallSharePct: 7,
      },
      {
        name: 'Main Summer Rain',
        localName: 'Zhizha / Ihlobo',
        months: 'Nov - Mar',
        description: 'Convective rainfall with noticeable 10-14 day dry spell in January.',
        agroAction: 'Early planting with medium-to-early hybrids (SC 537/637), timely top-dressing.',
        temperatureRangeC: '18°C - 29°C',
        averageRainfallSharePct: 83,
      },
      {
        name: 'Autumn Harvest',
        localName: 'Matsutso / Ukwindla',
        months: 'Apr - May',
        description: 'Warm dry conditions, minimal rain.',
        agroAction: 'Grain harvesting, stover management.',
        temperatureRangeC: '14°C - 25°C',
        averageRainfallSharePct: 7,
      },
      {
        name: 'Cold Dry Winter',
        localName: 'Chando / Ubusika',
        months: 'Jun - Jul',
        description: 'Crisp cold nights, dry mornings.',
        agroAction: 'Irrigated horticultural plots (cabbages, tomatoes) & winter wheat.',
        temperatureRangeC: '7°C - 23°C',
        averageRainfallSharePct: 3,
      },
    ],
    monthlyClimaticData: [
      { month: 'October', monthCode: 'OCT', avgRainfallMm: 25, evapotranspirationEt0MmPerDay: 5.6, avgTempMaxC: 30, avgTempMinC: 16, drySpellRiskPct: 25, agriActivity: 'Pfumvudza hole preparation & manure placement' },
      { month: 'November', monthCode: 'NOV', avgRainfallMm: 100, evapotranspirationEt0MmPerDay: 5.0, avgTempMaxC: 29, avgTempMinC: 17, drySpellRiskPct: 22, agriActivity: 'Sowing upon 28mm planting rain' },
      { month: 'December', monthCode: 'DEC', avgRainfallMm: 190, evapotranspirationEt0MmPerDay: 4.4, avgTempMaxC: 28, avgTempMinC: 17, drySpellRiskPct: 18, agriActivity: 'Vegetative weeding, 1st AN application' },
      { month: 'January', monthCode: 'JAN', avgRainfallMm: 200, evapotranspirationEt0MmPerDay: 4.3, avgTempMaxC: 27, avgTempMinC: 17, drySpellRiskPct: 28, agriActivity: 'Mid-season dry spell vigil; 2nd top-dressing' },
      { month: 'February', monthCode: 'FEB', avgRainfallMm: 160, evapotranspirationEt0MmPerDay: 4.4, avgTempMaxC: 27, avgTempMinC: 16, drySpellRiskPct: 22, agriActivity: 'Cob filling, pest scouting' },
      { month: 'March', monthCode: 'MAR', avgRainfallMm: 80, evapotranspirationEt0MmPerDay: 4.2, avgTempMaxC: 27, avgTempMinC: 15, drySpellRiskPct: 35, agriActivity: 'Black layer maturity' },
      { month: 'April', monthCode: 'APR', avgRainfallMm: 28, evapotranspirationEt0MmPerDay: 3.6, avgTempMaxC: 25, avgTempMinC: 12, drySpellRiskPct: 70, agriActivity: 'Harvesting & cob storage' },
      { month: 'May', monthCode: 'MAY', avgRainfallMm: 8, evapotranspirationEt0MmPerDay: 3.1, avgTempMaxC: 23, avgTempMinC: 10, drySpellRiskPct: 92, agriActivity: 'Shelling & marketing' },
    ],
    optimalPlantingWindow: {
      earliestDate: '15 November',
      latestRecommendedDate: '08 December',
      cutoffDate: '22 December',
      rainTriggerMm3Days: 28,
      dryPlantingAllowed: false,
      criticalNotes: 'Plant early so flowering (the critical moisture period) occurs before or immediately after the January dry spell window.',
    },
    criticalDrySpellRiskWindow: {
      period: '15 January - 28 January',
      probabilityPct: 28,
      mitigationStrategy: 'Top dress AN strictly before 10 January or delay until rain resumes; never apply AN on dry soil.',
    },
    irrigationGuidance: {
      isIrrigationMandatory: false,
      supplementaryNeedsMm: 140,
      criticalStagesRequiringWater: ['Tasseling & Pollination (mid-January)', 'Grain dough filling'],
      recommendedIrrigationIntervalDays: 6,
      waterSavingTechnique: 'Pfumvudza mulch cover and tied ridges.',
    },
  },

  'III': {
    region: 'III',
    regionTitle: 'Natural Region III - Midlands Semi-Intensive (Gweru, Kwekwe, Kadoma)',
    agroZoneDescription: 'Moderate rainfall (650 - 800mm). Higher temperatures and frequent mid-season dry spells lasting 2 to 3 weeks in January. Severe drought in El Niño years.',
    annualRainfallRangeMm: '650mm - 800mm',
    seasons: [
      {
        name: 'Warm Spring',
        localName: 'Chirimo / Isilimo',
        months: 'Aug - Oct',
        description: 'Dry, warm winds, sandy soil drying out rapidly.',
        agroAction: 'Pfumvudza basin preparation, organic manure application, purchasing drought-tolerant seed.',
        temperatureRangeC: '16°C - 31°C',
        averageRainfallSharePct: 6,
      },
      {
        name: 'Summer Rain Season',
        localName: 'Zhizha / Ihlobo',
        months: 'Nov - Mar',
        description: 'Short, intense rainfall events followed by prolonged hot dry intervals (Nyamavhuvhu).',
        agroAction: 'Staggered planting, soil moisture preservation, small grain focus (Sorghum, Sunflower).',
        temperatureRangeC: '17°C - 28°C',
        averageRainfallSharePct: 84,
      },
      {
        name: 'Autumn Harvest',
        localName: 'Matsutso / Ukwindla',
        months: 'Apr - May',
        description: 'Dry, calm weather, ideal for sun drying crops.',
        agroAction: 'Early harvesting to prevent termite damage, bird scaring on small grains.',
        temperatureRangeC: '13°C - 24°C',
        averageRainfallSharePct: 7,
      },
      {
        name: 'Cold Winter',
        localName: 'Chando / Ubusika',
        months: 'Jun - Jul',
        description: 'Cold night temperatures (down to 2°C in open veld), risk of frost.',
        agroAction: 'Livestock supplementary lick feeding, small scale vegetable garden irrigation.',
        temperatureRangeC: '5°C - 21°C',
        averageRainfallSharePct: 3,
      },
    ],
    monthlyClimaticData: [
      { month: 'October', monthCode: 'OCT', avgRainfallMm: 22, evapotranspirationEt0MmPerDay: 5.8, avgTempMaxC: 30, avgTempMinC: 15, drySpellRiskPct: 35, agriActivity: 'Pfumvudza basin digging & dry mulching' },
      { month: 'November', monthCode: 'NOV', avgRainfallMm: 85, evapotranspirationEt0MmPerDay: 5.2, avgTempMaxC: 29, avgTempMinC: 16, drySpellRiskPct: 30, agriActivity: 'Planting window opens upon 30mm soaking rain' },
      { month: 'December', monthCode: 'DEC', avgRainfallMm: 160, evapotranspirationEt0MmPerDay: 4.6, avgTempMaxC: 28, avgTempMinC: 17, drySpellRiskPct: 24, agriActivity: 'Vegetative growth, weeding, AN top dressing' },
      { month: 'January', monthCode: 'JAN', avgRainfallMm: 170, evapotranspirationEt0MmPerDay: 4.5, avgTempMaxC: 27, avgTempMinC: 16, drySpellRiskPct: 38, agriActivity: 'CRITICAL: High dry spell risk window (Nyamavhuvhu)' },
      { month: 'February', monthCode: 'FEB', avgRainfallMm: 130, evapotranspirationEt0MmPerDay: 4.6, avgTempMaxC: 27, avgTempMinC: 16, drySpellRiskPct: 32, agriActivity: 'Grain filling; supplementary water if available' },
      { month: 'March', monthCode: 'MAR', avgRainfallMm: 65, evapotranspirationEt0MmPerDay: 4.4, avgTempMaxC: 27, avgTempMinC: 14, drySpellRiskPct: 45, agriActivity: 'Physiological maturity & stalk cutting' },
      { month: 'April', monthCode: 'APR', avgRainfallMm: 22, evapotranspirationEt0MmPerDay: 3.8, avgTempMaxC: 25, avgTempMinC: 11, drySpellRiskPct: 75, agriActivity: 'Harvesting, threshing sorghum/millet' },
      { month: 'May', monthCode: 'MAY', avgRainfallMm: 6, evapotranspirationEt0MmPerDay: 3.2, avgTempMaxC: 22, avgTempMinC: 8, drySpellRiskPct: 95, agriActivity: 'Grain protection and sale' },
    ],
    optimalPlantingWindow: {
      earliestDate: '20 November',
      latestRecommendedDate: '12 December',
      cutoffDate: '24 December',
      rainTriggerMm3Days: 30,
      dryPlantingAllowed: true, // Dry planting in basins with mulch is recognized
      criticalNotes: 'In Region III, prioritize early-medium maize (SC 537) or traditional grains (Sorghum SV2 / Macia). Use dry-planting in mulch ahead of rain to capture the earliest moisture.',
    },
    criticalDrySpellRiskWindow: {
      period: '12 January - 28 January',
      probabilityPct: 38,
      mitigationStrategy: 'Stagger planting dates by 10 days across two plots so pollination windows do not both coincide with mid-January drought.',
    },
    irrigationGuidance: {
      isIrrigationMandatory: false,
      supplementaryNeedsMm: 180,
      criticalStagesRequiringWater: ['Flowering / Head emergence (January dry spell rescue)', 'Grain fill'],
      recommendedIrrigationIntervalDays: 5,
      waterSavingTechnique: 'Contour ridges, infiltration pits, and Pfumvudza mulch beds.',
    },
  },

  'IV': {
    region: 'IV',
    regionTitle: 'Natural Region IV - Semi-Extensive Farming (Masvingo, Gokwe, Lupane, Tsholotsho)',
    agroZoneDescription: 'Low, erratic rainfall (450 - 650mm) with periodic severe droughts. Kalahari sands & sodic soils. High evapotranspiration (>5.5 mm/day).',
    annualRainfallRangeMm: '450mm - 650mm',
    seasons: [
      {
        name: 'Hot Dry Season',
        localName: 'Chirimo / Isilimo',
        months: 'Aug - Oct',
        description: 'Very hot, dry, dusty. Daytime temperatures often exceed 34°C.',
        agroAction: 'Pfumvudza water harvesting basin digging, collecting thorn branches for kraal fencing.',
        temperatureRangeC: '18°C - 35°C',
        averageRainfallSharePct: 5,
      },
      {
        name: 'Short Erratic Rains',
        localName: 'Zhizha / Ihlobo',
        months: 'Nov - Mar',
        description: 'Short rain window, long intervals between rains. High likelihood of mid-season moisture stress.',
        agroAction: 'Dry planting small grains (Mhunga, Mapfunde), cowpeas, short-season maize (SC 419).',
        temperatureRangeC: '19°C - 33°C',
        averageRainfallSharePct: 85,
      },
      {
        name: 'Autumn Season',
        localName: 'Matsutso / Ukwindla',
        months: 'Apr - May',
        description: 'Very dry, warm sunny days.',
        agroAction: 'Harvesting, storage in grain bags with insecticide, stover grazing for cattle.',
        temperatureRangeC: '14°C - 27°C',
        averageRainfallSharePct: 7,
      },
      {
        name: 'Dry Winter',
        localName: 'Chando / Ubusika',
        months: 'Jun - Jul',
        description: 'Mild sunny days, cool nights.',
        agroAction: 'Livestock management, borehole maintenance, winter dipping.',
        temperatureRangeC: '8°C - 24°C',
        averageRainfallSharePct: 3,
      },
    ],
    monthlyClimaticData: [
      { month: 'October', monthCode: 'OCT', avgRainfallMm: 18, evapotranspirationEt0MmPerDay: 6.2, avgTempMaxC: 33, avgTempMinC: 17, drySpellRiskPct: 45, agriActivity: 'Water harvesting pits (Dead-end contours)' },
      { month: 'November', monthCode: 'NOV', avgRainfallMm: 60, evapotranspirationEt0MmPerDay: 5.6, avgTempMaxC: 32, avgTempMinC: 18, drySpellRiskPct: 40, agriActivity: 'Dry planting into mulch-covered basins' },
      { month: 'December', monthCode: 'DEC', avgRainfallMm: 130, evapotranspirationEt0MmPerDay: 4.8, avgTempMaxC: 30, avgTempMinC: 18, drySpellRiskPct: 32, agriActivity: 'Main planting upon 32mm rainfall; early weeding' },
      { month: 'January', monthCode: 'JAN', avgRainfallMm: 140, evapotranspirationEt0MmPerDay: 4.8, avgTempMaxC: 30, avgTempMinC: 18, drySpellRiskPct: 52, agriActivity: 'HIGH DROUGHT RISK: Preserve moisture; scout pests' },
      { month: 'February', monthCode: 'FEB', avgRainfallMm: 95, evapotranspirationEt0MmPerDay: 4.9, avgTempMaxC: 30, avgTempMinC: 17, drySpellRiskPct: 42, agriActivity: 'Grain filling on small grains; bird scaring' },
      { month: 'March', monthCode: 'MAR', avgRainfallMm: 45, evapotranspirationEt0MmPerDay: 4.6, avgTempMaxC: 29, avgTempMinC: 15, drySpellRiskPct: 55, agriActivity: 'Early harvesting; protect from stalk borers' },
      { month: 'April', monthCode: 'APR', avgRainfallMm: 15, evapotranspirationEt0MmPerDay: 4.0, avgTempMaxC: 27, avgTempMinC: 13, drySpellRiskPct: 82, agriActivity: 'Threshing, sun drying, bagging' },
      { month: 'May', monthCode: 'MAY', avgRainfallMm: 4, evapotranspirationEt0MmPerDay: 3.4, avgTempMaxC: 25, avgTempMinC: 10, drySpellRiskPct: 98, agriActivity: 'Cattle browsing on crop stover' },
    ],
    optimalPlantingWindow: {
      earliestDate: '25 November',
      latestRecommendedDate: '15 December',
      cutoffDate: '28 December',
      rainTriggerMm3Days: 32,
      dryPlantingAllowed: true,
      criticalNotes: 'Rainfed maize is high risk. Agritex standard recommends 2 plots of Sorghum/Millet to 1 plot of ultra-early maize (SC 303 / SC 419).',
    },
    criticalDrySpellRiskWindow: {
      period: '10 January - 02 February',
      probabilityPct: 52,
      mitigationStrategy: 'Deep mulching, intercropping with cowpeas for ground cover, and supplementary bucket watering.',
    },
    irrigationGuidance: {
      isIrrigationMandatory: false,
      supplementaryNeedsMm: 240,
      criticalStagesRequiringWater: ['Post-emergence survival', 'Flowering / Head emergence'],
      recommendedIrrigationIntervalDays: 4,
      waterSavingTechnique: 'Drip irrigation kits, rainwater harvesting tanks, and heavy organic mulch.',
    },
  },

  'V': {
    region: 'V',
    regionTitle: 'Natural Region V - Lowveld Arid & Extensive (Chiredzi, Beitbridge, Mwenezi)',
    agroZoneDescription: 'Low elevation (<500m), very low rainfall (<450mm), extreme summer heat (>38°C). Rainfed crop production is unreliable without irrigation schemes (e.g. Save Valley, Chisumbanje, Bubi-Lupane).',
    annualRainfallRangeMm: '< 450mm',
    seasons: [
      {
        name: 'Intense Hot Spring',
        localName: 'Chirimo / Isilimo',
        months: 'Aug - Oct',
        description: 'Extreme heat, high solar radiation, drought-stressed vegetation.',
        agroAction: 'Irrigation canal rehabilitation, kraal manure gathering, goat veld management.',
        temperatureRangeC: '20°C - 39°C',
        averageRainfallSharePct: 5,
      },
      {
        name: 'Hot Erratic Summer',
        localName: 'Zhizha / Ihlobo',
        months: 'Nov - Mar',
        description: 'Sporadic cloud bursts with rapid runoff and high evaporation.',
        agroAction: 'Scheduled scheme irrigation (sugar cane, winter wheat, green mealies) or Mapfunde/Mhunga.',
        temperatureRangeC: '22°C - 37°C',
        averageRainfallSharePct: 82,
      },
      {
        name: 'Autumn Drying Period',
        localName: 'Matsutso / Ukwindla',
        months: 'Apr - May',
        description: 'Dry, warm sunny days, zero rain.',
        agroAction: 'Crop harvesting, sorting, livestock marketing at CC Sales auctions.',
        temperatureRangeC: '16°C - 30°C',
        averageRainfallSharePct: 9,
      },
      {
        name: 'Mild Winter',
        localName: 'Chando / Ubusika',
        months: 'Jun - Jul',
        description: 'Warm sunny days, mild nights (10°C - 14°C). Zero frost risk.',
        agroAction: 'Winter irrigation of wheat, beans, tomatoes, onions.',
        temperatureRangeC: '11°C - 26°C',
        averageRainfallSharePct: 4,
      },
    ],
    monthlyClimaticData: [
      { month: 'October', monthCode: 'OCT', avgRainfallMm: 12, evapotranspirationEt0MmPerDay: 7.0, avgTempMaxC: 36, avgTempMinC: 20, drySpellRiskPct: 60, agriActivity: 'Irrigation canal prep; flood basin repair' },
      { month: 'November', monthCode: 'NOV', avgRainfallMm: 45, evapotranspirationEt0MmPerDay: 6.4, avgTempMaxC: 35, avgTempMinC: 21, drySpellRiskPct: 55, agriActivity: 'Irrigated planting or Pearl Millet dry planting' },
      { month: 'December', monthCode: 'DEC', avgRainfallMm: 110, evapotranspirationEt0MmPerDay: 5.5, avgTempMaxC: 33, avgTempMinC: 21, drySpellRiskPct: 45, agriActivity: 'Irrigation scheduling; weed control' },
      { month: 'January', monthCode: 'JAN', avgRainfallMm: 105, evapotranspirationEt0MmPerDay: 5.6, avgTempMaxC: 33, avgTempMinC: 21, drySpellRiskPct: 65, agriActivity: 'SEVERE DROUGHT RISK: Rainfed crops wilt without irrigation' },
      { month: 'February', monthCode: 'FEB', avgRainfallMm: 75, evapotranspirationEt0MmPerDay: 5.5, avgTempMaxC: 33, avgTempMinC: 20, drySpellRiskPct: 58, agriActivity: 'Irrigation at grain fill; bird control' },
      { month: 'March', monthCode: 'MAR', avgRainfallMm: 35, evapotranspirationEt0MmPerDay: 5.0, avgTempMaxC: 32, avgTempMinC: 18, drySpellRiskPct: 70, agriActivity: 'Early harvesting; stalk storage' },
      { month: 'April', monthCode: 'APR', avgRainfallMm: 10, evapotranspirationEt0MmPerDay: 4.4, avgTempMaxC: 30, avgTempMinC: 15, drySpellRiskPct: 90, agriActivity: 'Main harvest; prepare winter irrigated beans' },
      { month: 'May', monthCode: 'MAY', avgRainfallMm: 3, evapotranspirationEt0MmPerDay: 3.8, avgTempMaxC: 28, avgTempMinC: 12, drySpellRiskPct: 99, agriActivity: 'Winter wheat / beans planting under irrigation' },
    ],
    optimalPlantingWindow: {
      earliestDate: '01 December',
      latestRecommendedDate: '20 December',
      cutoffDate: '05 January',
      rainTriggerMm3Days: 35,
      dryPlantingAllowed: true,
      criticalNotes: 'Rainfed cropping should ONLY use Pearl Millet (Inyawuthi) or Sorghum. For maize, production must be within an organized irrigation scheme.',
    },
    criticalDrySpellRiskWindow: {
      period: '05 January - 05 February',
      probabilityPct: 65,
      mitigationStrategy: 'Full irrigation scheduling with weekly canal rotations or dedicated solar borehole pumping.',
    },
    irrigationGuidance: {
      isIrrigationMandatory: true,
      supplementaryNeedsMm: 450,
      criticalStagesRequiringWater: ['Establishment', 'Vegetative', 'Tasseling / Flowering', 'Grain fill'],
      recommendedIrrigationIntervalDays: 3,
      waterSavingTechnique: 'Night irrigation to reduce evaporative losses, drip emitters, and deep mulching.',
    },
  },
};
