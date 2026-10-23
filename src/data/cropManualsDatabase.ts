/**
 * Official Zimbabwe Technical Crop Production Manuals & Agronomy Handbooks
 * Compiled from official Zimbabwe Ministry of Agriculture, DR&SS, and Agritex Technical Extension Handbooks
 */

export interface ManualSection {
  heading: string;
  subsections?: {
    title: string;
    content: string;
    bulletPoints?: string[];
  }[];
  content?: string;
  bulletPoints?: string[];
}

export interface CropManual {
  id: string;
  title: string;
  company?: string;
  edition: string;
  category: 'Cereals & Grains' | 'Horticulture & Vegetables' | 'Legumes & Oilseeds' | 'Cash Crops (Tobacco/Cotton)' | 'Crop Protection & Spraying' | 'Crop Nutrition & Soils';
  targetCrops: string[];
  recommendedRegions: ('I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V')[];
  summary: string;
  keyDirectives: string[];
  plantPopulationPerHa: string;
  seedRatePerHa: string;
  basalFertilizerRecommendation: string;
  topDressingRecommendation: string;
  sprayProgramHighlight: string;
  harvestCriteria: string;
  sections: ManualSection[];
}

export const OFFICIAL_CROP_MANUALS: CropManual[] = [
  // ==================== SEED CO ZIMBABWE ====================
  {
    id: 'seedco-maize-manual',
    title: 'Hybrid Maize Agronomy & Variety Selection Guide',
    edition: '2024/2025 National Production Standards',
    category: 'Cereals & Grains',
    targetCrops: ['Maize (White Hybrid)', 'Yellow Maize', 'Sweetcorn'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    summary: 'The authoritative Zimbabwean guide to maximizing hybrid maize yields from 3.0 t/ha to over 12.0 t/ha. Details variety positioning across maturity groups (SC 300 to SC 700 series), Pfumvudza precision planting, and climate adaptation.',
    keyDirectives: [
      'Match maturity series to Natural Region: 700 Series (SC719/727) for Region I/IIa, 600 Series (SC637/649) for Region IIb/III, 500/400 Series (SC513/SC403) for Region III/IV, 300 Series (SC301/303) for dry Region IV/V.',
      'Maintain plant population of 44,000 to 50,000 plants/ha under rainfed Pfumvudza (75cm x 60cm with 2 plants/basin). Under full irrigation, increase to 55,000 - 60,000 plants/ha.',
      'Never sow seed into dry soil ahead of light showers; wait for a verified 25mm to 30mm cumulative planting rain.',
      'Thin to target population by 14 days after emergence (DAE); delayed thinning induces stalk elongation and lodging.'
    ],
    plantPopulationPerHa: '44,444 to 53,333 plants/ha (Pfumvudza: 2 plants/basin at 75cm x 60cm)',
    seedRatePerHa: '20 - 25 kg/ha certified seed (80,000 seeds/pocket)',
    basalFertilizerRecommendation: 'Compound D (7:14:7) at 300-400 kg/ha or 1 beer bottle cap (10g) per basin placed 5cm deep and covered with 2cm soil.',
    topDressingRecommendation: 'Ammonium Nitrate (AN 34.5% N) at 250-350 kg/ha split into two: 50% at V6 (knee-high, 4-5 weeks) and 50% at V10 (early tasseling).',
    sprayProgramHighlight: 'Karate Zeon 5CS (100ml/ha) or Ampligo (200ml/ha) at 10 DAE for Fall Armyworm. Pre-emergence Atrazine (4 L/ha) + Dual Magnum (1.5 L/ha).',
    harvestCriteria: 'Harvest when black physiological maturity layer forms at grain tip and moisture drops below 13.5%. Deliver to GMB at <= 12.5% moisture.',
    sections: [
      {
        heading: '1. Certified Hybrid Hybrid Maturity Groups & Regional Adaptation',
        bulletPoints: [
          'Ultra-Early (SC 301, SC 303): 105-115 days to maturity. Engineered for arid Region IV & V (Chiredzi, Beitbridge, Mwenezi) to escape late season drought.',
          'Early (SC 403 "Tsoko", SC 419): 120-130 days. Rapid grain filling and superior drought tolerance in Region III & IV.',
          'Medium (SC 513, SC 529, SC 637, SC 649): 130-142 days. Zimbabwe’s most popular all-rounder; exceptional flint grain texture and high GMB milling outturn.',
          'Late Maturity (SC 719, SC 727): 145-155 days. Unrivalled yield potential (>10 t/ha) for high-rainfall Region I & IIa (Goromonzi, Mazowe, Glendale, Chinhoyi).'
        ]
      },
      {
        heading: '2. Seedbed Preparation & Planting Spacing',
        content: 'Land preparation should be completed before October. Under Pfumvudza conservation agriculture, dig 1,456 basins per 0.0624 ha plot (15cm x 15cm x 15cm at 75cm row spacing by 60cm basin spacing). Drop 2 seeds per basin into moist soil after 25mm rain. Cover with 3-5cm of loose, friable soil.'
      },
      {
        heading: '3. Weed & Top-Dressing Management',
        content: 'Keep field 100% weed-free during the first 6 weeks. Apply first top dressing of Ammonium Nitrate (AN) at 30 DAE. Always apply into moist soil at least 7cm away from the stalk to prevent leaf and root scorch.'
      }
    ]
  },
  {
    id: 'seedco-soya-manual',
    title: 'Commercial Soya Bean High-Yield Manual',
    edition: '2024 Soya Agronomy Standard',
    category: 'Legumes & Oilseeds',
    targetCrops: ['Soya Beans (Soybeans)'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III'],
    summary: 'Comprehensive agronomy guide for commercial and smallholder soya bean producers. Focuses on Rhizobium inoculation, pod clearance heights, lodging prevention, and rotational nitrogen credits.',
    keyDirectives: [
      'Always treat seed with fresh certified Bradyrhizobium japonicum inoculant (1 sachet per 100kg seed) in a shaded area. Direct sunlight kills beneficial Rhizobia bacteria within 15 minutes.',
      'Sow in rows 45cm to 50cm apart with 5cm in-row spacing to achieve 350,000 to 400,000 plants/ha.',
      'Do NOT apply synthetic Nitrogen (AN or Urea) as top-dressing. High mineral nitrogen halts biological root nodulation and wastes input money.',
      'Apply Single Superphosphate (SSP) or Compound L/D to provide high phosphorus for root nodule development.'
    ],
    plantPopulationPerHa: '350,000 to 420,000 plants/ha',
    seedRatePerHa: '80 - 100 kg/ha',
    basalFertilizerRecommendation: 'Compound S or Single Superphosphate (SSP) at 200-300 kg/ha + 50 kg/ha Muriate of Potash.',
    topDressingRecommendation: 'None. Inoculated Rhizobia fix 60-100 kg pure N/ha naturally. Only apply Gypsum at flowering if calcium/sulfur is deficient.',
    sprayProgramHighlight: 'Dual Magnum 960EC (1.5 L/ha) pre-emergence for grasses. Nativo or Score (500ml/ha) for Asian Soybean Rust (Phakopsora pachyrhizi) at flowering.',
    harvestCriteria: 'Combine or hand-reap when 95% of pods turn straw-yellow/brown and seeds rattle in pods (13-14% moisture) to prevent pod shattering.',
    sections: [
      {
        heading: '1. Inoculation & Sowing Technique',
        content: 'Mix Rhizobium inoculant with 500ml water containing 2 tablespoons of sugar (acting as a sticker). Coat seed evenly and plant into moist soil within 2 hours. Sow 3-4cm deep; do not sow deeper than 5cm.'
      },
      {
        heading: '2. Variety Selection: SC Safari vs SC Squire',
        bulletPoints: [
          'SC Safari: High pod height clearance (>12cm above soil) for mechanical combine harvesting with zero cutter-bar loss.',
          'SC Squire: Indeterminate growth habit, superior tolerance to Asian Soybean Rust, and high oil content (21-22%).'
        ]
      }
    ]
  },
  {
    id: 'seedco-wheat-manual',
    title: 'Winter Wheat Commercial Production Guide',
    edition: '2024 National Winter Cropping Edition',
    category: 'Cereals & Grains',
    targetCrops: ['Winter Wheat (Bread Wheat)', 'Barley'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III'],
    summary: 'The definitive blueprint for Zimbabwe irrigated winter wheat. Covers optimal sowing windows (1 May - 20 May), stem rust prevention, and 7.5 to 9.5 t/ha target management.',
    keyDirectives: [
      'Sow strictly between 1 May and 20 May. Sowing after 31 May reduces potential yield by 50 kg/ha per day of delay due to terminal heat stress during grain filling.',
      'Achieve 200-240 viable seedlings per square meter (110 - 125 kg seed/ha).',
      'Maintain soil pH between 5.5 and 6.5 (CaCl2). Acid soils drastically reduce wheat tiller count.'
    ],
    plantPopulationPerHa: '2,000,000 to 2,500,000 plants/ha (200-250 seedlings/m²)',
    seedRatePerHa: '110 - 130 kg/ha',
    basalFertilizerRecommendation: 'Compound D (7:14:7) at 400-500 kg/ha broadcast and disced into top 10cm before planting.',
    topDressingRecommendation: 'Ammonium Nitrate (AN 34.5% N) at 350-450 kg/ha split: 50% at 3 weeks (tillering) and 50% at 6 weeks (pipe/booting stage).',
    sprayProgramHighlight: 'MCPA (1.5 L/ha) for broadleaf weeds at 4-5 leaf stage. Tilt / Nativo (500ml/ha) for Stripe Rust (Puccinia striiformis) and Powdery Mildew.',
    harvestCriteria: 'Combine harvest in September/October before early onset of summer rains when grain moisture is 12.0 - 12.5%.',
    sections: [
      {
        heading: '1. Certified Hybrid Varieties: SC Nduna & SC Selective',
        bulletPoints: [
          'SC Nduna: Exceptional gluten strength, high Hagberg Falling Number (>300 seconds), resistant to lodging under high nitrogen fertilization.',
          'SC Selective: High tillering capacity, excellent resistance to leaf and stem rust, ideal for smallholder commercial irrigation schemes.'
        ]
      }
    ]
  },

  // ==================== NATIONAL CROP NUTRITION & SOIL FERTILITY ====================
  {
    id: 'windmill-fertilizer-handbook',
    title: 'Comprehensive Crop Nutrition & Fertilizer Handbook',
    edition: 'Agro-Chemical & Nutrition 50th Edition',
    category: 'Crop Nutrition & Soils',
    targetCrops: ['Maize', 'Tobacco', 'Soya Beans', 'Wheat', 'Potatoes', 'Horticulture'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    summary: 'The industry-standard reference manual for soil fertility management across Zimbabwe. Details the 4R Nutrient Stewardship principle (Right Source, Right Rate, Right Time, Right Place), liming protocols, and specific crop fertilization regimes.',
    keyDirectives: [
      'Never apply Ammonium Nitrate top dressing on dry soil. Fertilizer requires active soil moisture to dissolve; otherwise nitrogen volatilizes into ammonia gas, losing up to 40% value.',
      'Compound D (7:14:7 + 6.5S) provides the essential root-initiating phosphorus (P2O5) and sulfur for cereal establishment.',
      'Apply Dolomitic Lime on granitic sandvelds at 500-1000 kg/ha every 3-4 years to neutralize soil acidity and unlock fixed soil phosphorus.',
      'In high-rainfall sandy soils (Goromonzi, Marondera), split top-dressing into 3 doses to minimize leaching into deep water tables.'
    ],
    plantPopulationPerHa: 'Varies by crop',
    seedRatePerHa: 'Varies by crop',
    basalFertilizerRecommendation: 'Compound D (7:14:7), Compound C (5:15:12 for Tobacco), or Superfert Cereal at 300 - 500 kg/ha.',
    topDressingRecommendation: 'Ammonium Nitrate (34.5% N) at 200 - 400 kg/ha calibrated strictly by soil texture and target yield.',
    sprayProgramHighlight: 'Integrate National Extension Standard Foliar Feeds: CalMax (calcium for blossom end rot), Booster Foliar (high N-P-K + trace elements).',
    harvestCriteria: 'Refer to individual crop maturity indicators.',
    sections: [
      {
        heading: '1. The 4R Nutrient Stewardship Framework',
        bulletPoints: [
          'Right Source: Match fertilizer formulation to crop needs (e.g. Compound C with nitrate-nitrogen for tobacco; Compound D for cereals).',
          'Right Rate: Base applications on soil fertility tests and realistic seasonal yield targets.',
          'Right Time: Apply basal at sowing; apply nitrogen top-dressing at peak vegetative demand.',
          'Right Place: Band or basin-place fertilizer 5cm deep and 5cm away from seed; never broadcast top-dressing indiscriminately.'
        ]
      },
      {
        heading: '2. Liming Protocols for Acid Zimbabwe Sandvelds',
        content: 'Over 70% of Zimbabwean communal lands have a pH below 4.8 (CaCl2). At this acidity, up to 60% of applied phosphate fertilizer is chemically locked with iron and aluminum ions and cannot be absorbed by crops. Apply Dolomitic Lime (containing magnesium and calcium) during winter land preparation.'
      }
    ]
  },
  {
    id: 'windmill-horticulture-nutrition',
    title: 'High-Value Horticulture & Vegetable Nutrition Manual',
    edition: 'Commercial Horticulture 2024',
    category: 'Horticulture & Vegetables',
    targetCrops: ['Tomatoes', 'Cabbages', 'Irish Potatoes', 'Onions', 'Carrots', 'Leaf Veg (Covo/Rape)'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III', 'IV'],
    summary: 'Technical nutrition programs for Zimbabwe market gardeners targeting Mbare Musika, Renkini, supermarkets, and processing factories. Covers basal pre-plant programs, fertigation schedules, and foliar calcium sprays.',
    keyDirectives: [
      'Tomatoes: Prevent Blossom End Rot by spraying CalMax (Calcium chloride + Boron) weekly from first fruit set.',
      'Cabbages: High nitrogen feeders. Apply basal Compound C/D at 600 kg/ha followed by 3 splits of Ammonium Nitrate at 2, 4, and 6 weeks after transplanting.',
      'Onions: Cease all nitrogen applications 4 weeks prior to harvest to allow bulbs to cure and prevent neck rot in storage.',
      'Potatoes: Apply 1,000 - 1,200 kg/ha Compound S (7:21:7) banded into the ridge at planting.'
    ],
    plantPopulationPerHa: 'Tomatoes: 18,000 - 22,000/ha; Cabbages: 35,000 - 45,000/ha; Onions: 300,000 - 400,000/ha',
    seedRatePerHa: 'Tomatoes: 250g/ha; Cabbage: 350g/ha; Onions: 3-4 kg/ha; Seed Potatoes: 2.0 - 2.5 t/ha',
    basalFertilizerRecommendation: 'Compound C (5:15:12) or Compound S at 600 - 1000 kg/ha + 15 t/ha cured kraal manure.',
    topDressingRecommendation: 'Ammonium Nitrate / Potassium Nitrate at 200 - 300 kg/ha split every 14 days through vegetative growth.',
    sprayProgramHighlight: 'CalMax (300 ml/100L water) + Multi-Feed P (high phosphorus foliar for root expansion).',
    harvestCriteria: 'Tomatoes: Breaker/turning stage for long transport, red-ripe for local direct sales.',
    sections: [
      {
        heading: '1. Tomato Precision Feeding Schedule',
        content: 'Transplant healthy 4-week seedlings. Apply 30g Compound C in each planting hole mixed with soil. Top dress with 5g AN at 2 weeks, followed by 5g Potassium Nitrate every 10 days during flowering and fruit sizing.'
      }
    ]
  },

  // ==================== NATIONAL CROP PROTECTION & INTEGRATED PEST MANAGEMENT ====================
  {
    id: 'agricura-crop-protection-manual',
    title: 'Field Crops Weed, Pest & Disease Protection Manual',
    edition: '2024 Master Field Manual',
    category: 'Crop Protection & Spraying',
    targetCrops: ['Maize', 'Sorghum', 'Soya Beans', 'Cotton', 'Wheat', 'Tobacco'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    summary: 'The ultimate crop protection reference guide in Zimbabwe. Features comprehensive spray programs for Fall Armyworm, African Bollworm, Gray Leaf Spot, Nutsedge, and Couch grass, with calibrated knapsack dosing tables.',
    keyDirectives: [
      'Calibrate knapsack sprayers before every season using clean water: verify nozzle discharge rate (L/min) and walking speed (1 m/s).',
      'Never spray insecticides with a flood-jet herbicide nozzle. Use hollow cone nozzles for insecticides/fungicides and flat fan nozzles for herbicides.',
      'Respect Pre-Harvest Intervals (PHI): do not harvest within the designated safety window printed on the registered chemical label.',
      'Always add Agral 90 wetting agent to overcome surface tension on waxy crop and weed leaves.'
    ],
    plantPopulationPerHa: 'Crop specific',
    seedRatePerHa: 'Crop specific',
    basalFertilizerRecommendation: 'Complementary to standard Agritex/National Extension Standard programs',
    topDressingRecommendation: 'N/A (Crop protection focus)',
    sprayProgramHighlight: 'Atrazine 500SC + Dual Magnum 960EC pre-emergence; Karate Zeon 5CS / Ampligo for Fall Armyworm; Shumba Super Dust for storage.',
    harvestCriteria: 'Observe PHI: Karate Zeon (7 days), Ampligo (3 days), Atrazine (60 days), Dithane M-45 (7 days).',
    sections: [
      {
        heading: '1. Safe Chemical Handling & Knapsack Calibration',
        bulletPoints: [
          'Step 1: Measure a 20m x 5m test plot (100 m²). Fill knapsack with 15L clean water.',
          'Step 2: Spray the plot at normal comfortable walking speed. Measure water volume used.',
          'Step 3: Multiply volume used by 100 to calculate water rate per hectare (typically 200 - 300 L/ha).'
        ]
      },
      {
        heading: '2. Fall Armyworm (Mhungu) Eradication Protocol',
        content: 'Scout 20 plants across 5 spots weekly. Treat when 5% of seedlings show fresh window-pane feeding signs. Direct spray lance into the central funnel whorl early morning or after 4:00 PM.'
      }
    ]
  },
  {
    id: 'agricura-horticulture-calendar',
    title: 'Comprehensive Horticultural Pest & Disease Spray Calendar',
    edition: 'Vegetable Protection Guide 2024',
    category: 'Horticulture & Vegetables',
    targetCrops: ['Tomatoes', 'Cabbages', 'Potatoes', 'Onions', 'Peppers', 'Butternuts'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III', 'IV'],
    summary: 'Week-by-week preventive and curative chemical spray calendars for high-value Zimbabwean market gardens. Covers Late Blight, Tuta Absoluta, Diamondback Moth, Aphids, Bacterial Spot, and Nematodes.',
    keyDirectives: [
      'Preventive spraying is 10 times cheaper than curative spraying. Once Late Blight infects 20% of a tomato field, recovery is virtually impossible.',
      'Rotate chemical modes of action: alternate between Group 3 (Score), Group M3 (Dithane), and Group 4 (Ridomil Gold) to prevent resistant fungal super-strains.',
      'Wear protective gear: rubber gloves, goggles, and respirator mask.'
    ],
    plantPopulationPerHa: 'Varies by crop',
    seedRatePerHa: 'Varies by crop',
    basalFertilizerRecommendation: 'Standard horticulture recommendations',
    topDressingRecommendation: 'Standard horticulture recommendations',
    sprayProgramHighlight: 'Ridomil Gold MZ (40g/15L) for Late Blight; Prove 1.92EC (20ml/15L) for Tuta Absoluta; Malathion 50EC (30ml/15L) for Aphids.',
    harvestCriteria: 'Strictly adhere to PHI before sending vegetables to Mbare Musika or supermarkets.',
    sections: [
      {
        heading: '1. Tomato Weekly Spray Calendar (Transplant to Final Harvest)',
        bulletPoints: [
          'Week 1 (Establishment): Drench transplant holes with Velum Prime or Confidor against cutworms and nematodes.',
          'Week 2-4 (Vegetative): Spray Copper Oxychloride (50g/15L) alternating with Dithane M-45 (40g/15L) every 7 days for bacterial spot and early blight.',
          'Week 5-8 (Flowering & Sizing): Spray Prove 1.92EC or Ampligo against Tuta absoluta and fruitworms. Add CalMax foliar calcium.',
          'Week 9+ (Wet Weather Warning): If persistent rains occur, spray Ridomil Gold MZ (50g/15L) within 24 hours to halt Late Blight spores.'
        ]
      }
    ]
  },
  {
    id: 'agricura-livestock-dip-manual',
    title: 'Livestock Dip, Tick Control & Veterinary Health Manual',
    edition: '2024 Department of Veterinary Services Certified',
    category: 'Crop Protection & Spraying',
    targetCrops: ['Beef Cattle', 'Dairy Cattle', 'Goats', 'Sheep'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    summary: 'The national standard field manual for cattle dip management, tick-borne disease containment, and the 5-5-4 dipping regimen against January Disease (Theileriosis), Heartwater, and Redwater.',
    keyDirectives: [
      'Maintain the statutory 5-5-4 dipping interval during summer rains (dip twice every 5 days, then every 4 days) using Triatix 12.5% EC.',
      'Supplement plunge dipping with tick grease applied to the ear canals, base of horns, tail switch, and between hooves.',
      'Never dip thirsty cattle: allow animals to drink clean borehole water before driving them through the plunge dip.'
    ],
    plantPopulationPerHa: 'Cattle carrying capacity: 3 - 6 ha/LSU in Region IV/V; 1.5 - 2.5 ha/LSU in Region II',
    seedRatePerHa: 'N/A',
    basalFertilizerRecommendation: 'N/A (Livestock nutrition)',
    topDressingRecommendation: 'N/A',
    sprayProgramHighlight: 'Triatix 12.5% EC (1L per 500L dip water); Decatix pour-on; Butalex injection for Theileriosis; Terramycin LA for Heartwater.',
    harvestCriteria: 'Meat withdrawal: 1 day for Triatix, 28 days for Terramycin, 42 days for Butalex.',
    sections: [
      {
        heading: '1. The 5-5-4 Dipping Protocol Explained',
        content: 'The brown ear tick (Rhipicephalus appendiculatus), which transmits lethal January Disease, requires 4 to 5 days of blood feeding on the host ear before transmitting the protozoan parasite. The 5-5-4 interval interrupts this biological transmission cycle completely, ensuring ticks are killed before they can infect the animal.'
      }
    ]
  },

  // ==================== CLIMATE-SMART SMALL GRAINS & FORAGES ====================
  {
    id: 'valley-seeds-small-grains',
    title: 'Climate-Resilient Dryland Small Grains & Forage Manual',
    edition: '2024 Drought Mitigation Edition',
    category: 'Cereals & Grains',
    targetCrops: ['Grain Sorghum (SVT1/Macia)', 'Pearl Millet (Mhunga)', 'Finger Millet (Rukweza)', 'Velvet Bean', 'Lablab'],
    recommendedRegions: ['III', 'IV', 'V'],
    summary: 'The definitive guide for dryland farmers in semi-arid Zimbabwe (Masvingo, Midlands, Matabeleland). Covers early sowing of traditional grains, drought dormancy revival, and high-protein fodder banks for livestock.',
    keyDirectives: [
      'Small grains (Sorghum and Mhunga) can withstand up to 25 consecutive rainless days mid-season without dying, unlike hybrid maize which aborts cobs.',
      'Sow small grains into fine seedbeds at shallow depth (1.5 - 2.0 cm). Deep sowing exhausts seedling energy reserves before emergence.',
      'Thin sorghum to 2 plants per station 14 days after emergence to prevent vegetative crowding and moisture competition.'
    ],
    plantPopulationPerHa: 'Sorghum: 80,000 - 100,000 plants/ha; Pearl Millet: 100,000 plants/ha',
    seedRatePerHa: 'Sorghum: 8 - 10 kg/ha; Pearl Millet: 5 - 8 kg/ha; Finger Millet: 4 - 6 kg/ha',
    basalFertilizerRecommendation: 'Single Superphosphate (SSP) or Compound D at 150 - 200 kg/ha + 2 generous handfuls decomposed kraal manure per basin.',
    topDressingRecommendation: 'Ammonium Nitrate (AN) at 100 - 150 kg/ha applied at 4 weeks after sowing if soil moisture permits.',
    sprayProgramHighlight: 'Karate Zeon 5CS (100ml/ha) for early stem borer. Community bird scaring during soft dough stage.',
    harvestCriteria: 'Harvest when grain heads are hard and dry (cannot be dented by fingernail). Thresh on clean canvas floors to avoid grit.',
    sections: [
      {
        heading: '1. Sorghum & Pearl Millet Agronomy for Region IV & V',
        bulletPoints: [
          'SVT 1 Sorghum: White grain variety, excellent for sadza, ready in 110-120 days.',
          'Macia Sorghum: Short compact stature, dwarf variety, highly resistant to lodging in wind storms.',
          'PMV 3 Pearl Millet: Highly nutritious, drought-hardy cereal adapted to extreme sandy velds.'
        ]
      }
    ]
  },
  {
    id: 'valley-seeds-pastures',
    title: 'Legume Pastures & High-Protein Fodder Banks',
    edition: '2024 Livestock Nutrition Series',
    category: 'Legumes & Oilseeds',
    targetCrops: ['Velvet Bean (Mucuna pruriens)', 'Lablab purpureus', 'Sunnhemp', 'Bana Grass'],
    recommendedRegions: ['IIb', 'III', 'IV', 'V'],
    summary: 'Practical handbook for smallholder farmers building on-farm drought feed banks. Details planting and harvesting of high-protein forage legumes to replace expensive commercial beef and dairy feed concentrates.',
    keyDirectives: [
      'Plant Mucuna (Velvet bean) or Lablab along fence lines and field borders to create rich hay reserves for the dry winter season (July-October).',
      'Cut forage legumes at 50% flowering for peak crude protein content (16-18% CP).',
      'Sun-dry hay on raised racks for 3 days before baling or storing in ventilated hay barns.'
    ],
    plantPopulationPerHa: '60,000 - 80,000 plants/ha',
    seedRatePerHa: 'Mucuna: 35 - 45 kg/ha; Lablab: 25 - 30 kg/ha',
    basalFertilizerRecommendation: 'Single Superphosphate (SSP) at 150 kg/ha (legumes fix their own nitrogen).',
    topDressingRecommendation: 'None required.',
    sprayProgramHighlight: 'Minimal chemicals needed; highly hardy and suppressive of weeds.',
    harvestCriteria: 'Cut at 50% pod set; feed 2-3 kg dry legume hay per cow per day with grass stover.',
    sections: [
      {
        heading: '1. Overcoming Winter Cattle Weight Loss',
        content: 'Communal cattle lose up to 25% of body weight between August and November because dry veld grass drops to below 3% crude protein. Feeding just 2kg of dried Velvet Bean hay daily maintains cattle weight, ensures successful calf calving, and sustains draught power for early land prep.'
      }
    ]
  },

  // ==================== NATIONAL COMMERCIAL CASH CROPS & SPECIALTY HUSBANDRY ====================
  {
    id: 'kutsaga-tobacco-manual',
    title: '(TRB) Official Flue-Cured Tobacco Production Manual',
    edition: '2024/2025 National Tobacco Standard',
    category: 'Cash Crops (Tobacco/Cotton)',
    targetCrops: ['Flue-Cured Virginia Tobacco'],
    recommendedRegions: ['IIa', 'IIb', 'III'],
    summary: 'The official regulatory and technical manual for Zimbabwean flue-cured tobacco farmers. Covers seedbed floating tray hygiene, ridging, Compound C fertilizer programs, topping, sucker control, and barn curing.',
    keyDirectives: [
      'Strictly observe the statutory tobacco sowing date: do not sow seedbeds before 1 June.',
      'Mandatory tobacco destruction date: uproot and destroy all tobacco stalks by 15 May to break the life cycle of tobacco virus vectors and nematodes.',
      'Apply Compound C (5:15:12) or Tobacco High-K basal fertilizer along the ridge at 600 - 800 kg/ha.',
      'Top plants as soon as 10% of plants flower (button stage) to redirect energy into leaf enlargement and nicotine synthesis.'
    ],
    plantPopulationPerHa: '14,800 to 15,500 plants/ha (1.2m row spacing x 55cm in-row)',
    seedRatePerHa: '5g pelleted certified seed per hectare (float tray system)',
    basalFertilizerRecommendation: 'Compound C (5:15:12) or National Fertilizer Standard Tobacco High-K at 600 - 800 kg/ha.',
    topDressingRecommendation: 'Potassium Nitrate (KNO3) at 100-150 kg/ha + Ammonium Nitrate (50-100 kg/ha) based on leaf vigor and soil leaching.',
    sprayProgramHighlight: 'Confidor drench in seedbeds; Velum Prime / Ethocel for nematodes; Torque 360SL for sucker suppression.',
    harvestCriteria: 'Reap bottom leaves first when they turn lemon-yellow with puckered grain texture. Cure in barn at calibrated temperatures.',
    sections: [
      {
        heading: '1. Float Tray System Hygiene',
        content: 'Use clean borehole water with electrical conductivity below 0.5 mS/cm. Disinfect trays with a 10% bleach solution before seeding. Clip seedlings 3-4 times to ensure uniform stalk girth and root ball volume.'
      }
    ]
  },

  // ==================== SEED CO HORTICULTURE & LEGUMES ====================
  {
    id: 'seedco-prime-horticulture-manual',
    title: 'Commercial Horticulture Production Handbook',
    edition: '2024/2025 Professional Growers Edition',
    category: 'Horticulture & Vegetables',
    targetCrops: ['Cabbage', 'Tomato', 'Onion', 'Butternut', 'Green Pepper', 'Watermelon', 'Carrot'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III', 'IV'],
    summary: 'The master commercial horticulture production blueprint by Prime Certified Hybrid Zimbabwe. Formulates complete crop cycles for open-field and tunnel growers from nursery seedling management, fertigation curves, to harvest grading.',
    keyDirectives: [
      'Nursery bed sterilisation: Solarise or fumigate nursery seedbeds 4 weeks prior to sowing to eliminate Pythium damping-off fungi.',
      'Cabbage spacing: Plant Star 3301 at 60cm x 40cm (41,600 plants/ha) for 4kg commercial heads; narrow to 50cm x 35cm (57,000 plants/ha) for catering 2.5kg heads.',
      'Tomato trellising: Stake or string indeterminate varieties (Daisy F1, Rodade) vertically to facilitate airflow, uniform spray penetration, and prevent ground rot.',
      'Onion curing: Fold tops when 60% of foliage falls naturally; cure bulbs in field windrows or shaded sheds for 10-14 days before clipping roots and tops.'
    ],
    plantPopulationPerHa: 'Cabbage: 41,000 - 57,000; Tomato: 22,000 - 28,000; Onion: 350,000 - 450,000; Watermelon: 3,500 - 5,000',
    seedRatePerHa: 'Cabbage: 250g; Tomato: 150g; Onion: 3.5 - 4.5kg; Carrot: 4 - 6kg; Watermelon: 2.5 - 3.5kg',
    basalFertilizerRecommendation: 'Compound C (5:15:12) or Compound S at 600 - 1,000 kg/ha + 20 t/ha compost.',
    topDressingRecommendation: 'Ammonium Nitrate (150-250 kg/ha) in 2-3 early splits, followed by Potassium Nitrate / MOP (150-200 kg/ha) at fruit swelling.',
    sprayProgramHighlight: 'Rotate systemic and contact fungicides (Dithane M-45 + Ridomil Gold); spray Prove 1.92EC / Ampligo against Tuta absoluta and Diamondback moth.',
    harvestCriteria: 'Tomatoes: breaker stage for long transport, red-ripe for local wholesale; Cabbage: solid firm heads; Onions: dry papery bronze skin.',
    sections: [
      {
        heading: '1. Nursery Seedbed & Speedling Tray Management',
        bulletPoints: [
          'Use sterile pine bark growing medium in 128 or 200-cell polystyrene seedling trays.',
          'Drench trays with Previcur or Copper Oxychloride at emergence to halt damping-off.',
          'Harden seedlings 7 days before transplanting by withholding nitrogen and reducing water to once daily.'
        ]
      },
      {
        heading: '2. Fertigation & Split Top-Dressing Protocol',
        bulletPoints: [
          'Week 1-3 after transplant: High phosphorus for root establishment (Compound C / MAP).',
          'Week 4-7: Balanced vegetative growth with Ammonium Nitrate and Quick-Gro foliar.',
          'Week 8 to Harvest: High potassium (Potassium Nitrate / SOP) for firm fruit walls, high brix sugar, and extended transport shelf-life.'
        ]
      }
    ]
  },
  {
    id: 'seedco-traditional-grains-manual',
    title: 'Traditional Grains & Dryland Cereal Production Guide',
    edition: '2024/2025 Climate-Smart Series',
    category: 'Cereals & Grains',
    targetCrops: ['Sorghum (SC Sila / Macia)', 'Pearl Millet (SC Chiredzi)', 'Finger Millet / Zviyo', 'Sunflower (SC Siria)'],
    recommendedRegions: ['III', 'IV', 'V'],
    summary: 'Comprehensive agronomy guide for Zimbabwe semi-arid Natural Regions III, IV, and V. Outlines precision spacing, moisture conservation, Pfumvudza basin adaptations, and striga weed management.',
    keyDirectives: [
      'SC Sila sorghum matures in 115 days; withstands 3-week mid-season dry spells by rolling leaves and entering temporary dormancy.',
      'Pearl Millet (Mhunga) thrives on infertile Kalahari and communal sandvelds with as little as 300mm annual rainfall.',
      'Sow sorghum and millet seed shallowly (1.5 - 2.5cm); deep planting suffocates emerging coleoptiles.',
      'Scout early for armored crickets and quelea birds during soft dough stage.'
    ],
    plantPopulationPerHa: 'Sorghum: 66,000 - 88,000 plants/ha; Pearl Millet: 80,000 - 100,000 plants/ha; Sunflower: 44,000 plants/ha',
    seedRatePerHa: 'Sorghum: 8 - 10 kg/ha; Pearl Millet: 5 - 7 kg/ha; Finger Millet: 3 - 5 kg/ha; Sunflower: 4 - 5 kg/ha',
    basalFertilizerRecommendation: 'Compound D or Compound L at 150 - 250 kg/ha in Pfumvudza basins.',
    topDressingRecommendation: 'Ammonium Nitrate at 75 - 150 kg/ha applied at knee-high stage after first weeding.',
    sprayProgramHighlight: 'Shumba Super Dust for post-harvest grain storage; Karate Zeon for stalk borer and armyworm.',
    harvestCriteria: 'Harvest when black layer forms at grain attachment point (physiological maturity) and moisture is below 13%.',
    sections: [
      {
        heading: '1. Pfumvudza Basin Spacing for Small Grains',
        content: 'Space basins 75cm between rows and 30cm in-row. Sow 4-5 seeds per basin and thin to 2 plants at 14 DAE. Mulching basins with crop stover retains 40% more soil moisture over hot dry spells.'
      }
    ]
  },
  {
    id: 'seedco-sugar-beans-manual',
    title: 'Certified Sugar Beans & Biofortified Pulses Guide',
    edition: '2024/2025 High-Value Pulse Edition',
    category: 'Legumes & Oilseeds',
    targetCrops: ['Sugar Beans (SC Bounty / Gloria)', 'NUA 45 (Biofortified Iron Bean)', 'Cowpeas (CBC 1 / CBC 2)'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III'],
    summary: 'Production manual for high-yielding dry field beans and high-iron beans (NUA 45). Details Rhizobium nodulation, disease-free seed sourcing, critical spray programs against bean stem maggot, and post-harvest handling.',
    keyDirectives: [
      'Always plant certified disease-free seed; recycled farm seed carries halo blight and anthracnose internally within the embryo.',
      'NUA 45 bean contains 40% more zinc and 80% more iron than standard market beans; high demand from school feeding and health markets.',
      'Avoid planting beans on the same land consecutively; maintain a 3-year rotation with maize or sorghum.',
      'Harvest in early morning hours to prevent pods shattering open in the heat of the day.'
    ],
    plantPopulationPerHa: '200,000 to 250,000 plants/ha (45cm row x 8-10cm in-row)',
    seedRatePerHa: '70 - 90 kg/ha certified seed',
    basalFertilizerRecommendation: 'Compound D or Single Super Phosphate (SSP) at 200 - 300 kg/ha.',
    topDressingRecommendation: 'Rhizobium inoculation replaces nitrogen top-dressing; if nodulation fails, apply 50-75 kg/ha AN at 21 DAP.',
    sprayProgramHighlight: 'Karate Zeon at 7 & 14 DAE for bean stem maggot; Dithane M-45 + Bravo for anthracnose and rust.',
    harvestCriteria: 'Reap when 90% of pods have turned yellow-tan; dry whole plants on clean canvas tarps.',
    sections: [
      {
        heading: '1. Rhizobium Inoculant Technique',
        content: 'Dissolve 2 tablespoons of sugar in 250ml clean water to act as a sticker. Mix sticker thoroughly with bean seed, then sprinkle Grasslands Rhizobium powder until all seeds have a fine black coat. Dry in shade for 15 minutes and plant immediately into moist soil.'
      }
    ]
  },

  // ==================== PFUMVUDZA & PRECISION SOIL NUTRIENT DOSING ====================
  {
    id: 'windmill-pfumvudza-dosing-manual',
    title: 'Pfumvudza & Smallholder Precision Dosing Guide',
    edition: '2024/2025 Climate-Proof Agriculture Manual',
    category: 'Crop Nutrition & Soils',
    targetCrops: ['Maize', 'Sorghum', 'Soya Beans', 'Groundnuts', 'Sunflower', 'Cowpeas'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    summary: 'The authoritative precision micro-dosing manual for Zimbabwe National Pfumvudza/Intwasa program. Calibrates exact fertilizer weights using standard household beer bottle caps and cups per 1/16th hectare plot (62.4m x 16m = 1,456 basins).',
    keyDirectives: [
      '1 standard beer bottle cap (crown cork) holds exactly 10 grams of Compound D or Ammonium Nitrate.',
      'Always apply basal Compound D to the bottom of the 15cm deep basin and cover with 2-3cm of loose soil BEFORE dropping the seed.',
      'Mulch every basin with at least 5cm of crop residue, grass, or veld thatch to suppress evaporation and lower root zone temperatures.',
      'Top dressing AN micro-dosing: Apply 1 bottle cap (10g) 5cm away from the maize stalk at knee-high (V6 stage), followed by second split at early tasseling.'
    ],
    plantPopulationPerHa: '44,444 plants/ha (2 plants per basin x 1,456 basins per 0.0624 ha plot)',
    seedRatePerHa: '20 - 25 kg/ha certified seed',
    basalFertilizerRecommendation: 'Compound D (7:14:7) at 250 - 350 kg/ha (approx 16kg per Pfumvudza plot = 10g per basin).',
    topDressingRecommendation: 'Ammonium Nitrate (34.5% N) at 200 - 300 kg/ha in 2 equal micro-dosed splits (10g/basin at V6, 10g/basin at tasseling).',
    sprayProgramHighlight: 'Shumba Super Dust for grain cribs; Karate Zeon for fall armyworm funnel drenching.',
    harvestCriteria: 'Dry cob down to 12.5% moisture; grain cannot be dented with a fingernail.',
    sections: [
      {
        heading: '1. Pfumvudza Basin Dimension Standards',
        content: 'Basins must measure exactly 15cm length x 15cm width x 15cm depth. Row spacing is 75cm and in-row spacing is 60cm. This creates exactly 28 rows with 52 basins per row (1,456 basins per plot). Two maize plants per basin yield 2,912 cobs per plot, guaranteeing household calorie security.'
      }
    ]
  },
  {
    id: 'windmill-tobacco-cotton-nutrition',
    title: 'Tobacco & Cotton Basal/Top Dressing Nutrition Manual',
    edition: '2024/2025 Cash Crop Standards',
    category: 'Cash Crops (Tobacco/Cotton)',
    targetCrops: ['Flue-Cured Virginia Tobacco', 'Burley Tobacco', 'Certified Hybridtton'],
    recommendedRegions: ['IIa', 'IIb', 'III', 'IV'],
    summary: 'Technical agronomic formulation for high-grade export cash crops. Calibrates specific N:P:K:S ratios to maximize leaf grade, nicotine-to-sugar balance in tobacco, and boll weight and staple length in cotton.',
    keyDirectives: [
      'Tobacco: Never use chloride-containing fertilizers (like Muriate of Potash - MOP); chloride ruins leaf combustibility and produces ash with offensive aroma. Use only Sulphate of Potash (SOP) or Potassium Nitrate.',
      'Tobacco: Apply Compound C (5:15:12) banded 10cm to the side and 10cm below ridge crest at 600 - 800 kg/ha.',
      'Cotton: Apply Compound L (5:17:10 + 0.1B) at 200 - 300 kg/ha; Boron is mandatory to prevent flower bud shedding and hollow square stems.',
      'Top-dress cotton with Ammonium Nitrate at 100-150 kg/ha at first square formation.'
    ],
    plantPopulationPerHa: 'Tobacco: 15,000 plants/ha; Cotton: 33,000 - 45,000 plants/ha',
    seedRatePerHa: 'Tobacco: 5g pelleted seed; Cotton: 15 - 20 kg/ha acid-delinted seed',
    basalFertilizerRecommendation: 'Tobacco: Compound C (5:15:12) at 650 kg/ha; Cotton: Compound L (5:17:10 + B) at 250 kg/ha.',
    topDressingRecommendation: 'Tobacco: Potassium Nitrate (100 kg/ha) + AN (75 kg/ha); Cotton: Ammonium Nitrate (AN) at 120 kg/ha at squaring.',
    sprayProgramHighlight: 'Dimethoate + Karate Zeon against aphids, red spider mites, and bollworms.',
    harvestCriteria: 'Tobacco: Ripe lemon-yellow leaf; Cotton: Clean, fully burst white bolls picked dry into hessian bags.',
    sections: [
      {
        heading: '1. Tobacco Curing Color & Sugar Preservation',
        content: 'Yellowing stage requires 35-38°C dry bulb with 2°C wet bulb depression. Raising heat too quickly before chlorophyll breaks down sets green color in leaf, severely discounting floor price.'
      }
    ]
  },
  {
    id: 'windmill-soil-liming-remediation',
    title: 'Soil Acidity, Liming & Soil Health Master Protocol',
    edition: '2024/2025 Soil Science Bulletin',
    category: 'Crop Nutrition & Soils',
    targetCrops: ['All Crops', 'Maize', 'Soya Beans', 'Wheat', 'Groundnuts', 'Horticulture'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    summary: 'The definitive soil reclamation guide for Zimbabwean communal and commercial soils. Explains how soil acidity (pH < 5.0 CaCl2) locks up to 70% of applied N-P-K fertilizers and how to remediate with Calcitic and Dolomitic lime.',
    keyDirectives: [
      'Test soil pH every 3 years: If pH (CaCl2) is below 5.0, applied phosphorus binds irreversibly with toxic aluminum and iron ions.',
      'Choose the right lime: Use Dolomitic Lime (CaMg(CO3)2) if soil Magnesium is low; use Calcitic Lime (CaCO3) if Magnesium is adequate.',
      'Apply agricultural lime 2 to 3 months before planting; lime requires soil moisture and time to dissolve and neutralize soil acidity.',
      'Thoroughly incorporate lime into the top 15-20cm plough layer; surface-applied lime has very slow downward mobility.'
    ],
    plantPopulationPerHa: 'Universal soil conditioning',
    seedRatePerHa: 'Not applicable',
    basalFertilizerRecommendation: '1.5 to 3.5 tonnes/ha Agricultural Lime based on soil texture: Sand (1.0-1.5 t/ha), Loam (2.0-2.5 t/ha), Clay (3.0-4.0 t/ha).',
    topDressingRecommendation: 'Gypsum (Calcium Sulphate) at 200 - 300 kg/ha on groundnuts at early flowering to prevent "pops" (empty pods).',
    sprayProgramHighlight: 'Foliar zinc and boron (National Extension Standard Agritrac) to bypass temporary soil micro-nutrient lockup.',
    harvestCriteria: 'Maintain soil pH in the sweet spot of 5.5 to 6.5 (CaCl2) for maximum crop nutrient uptake efficiency.',
    sections: [
      {
        heading: '1. The Fertilizer Efficiency Multiplier',
        content: 'At pH 4.5, only 30% of applied Compound D and Ammonium Nitrate is absorbed by crops, wasting $70 out of every $100 spent on fertilizer. Correcting soil pH to 5.5 restores nutrient absorption to 85-90%, immediately doubling crop yields.'
      }
    ]
  },

  // ==================== NATIONAL EMERGENCY PEST OUTBREAK PROTOCOLS ====================
  {
    id: 'agricura-fall-armyworm-protocol',
    title: 'Fall Armyworm & Stalk Borer Emergency Control Protocol',
    edition: '2024/2025 National Pest Emergency Guide',
    category: 'Crop Protection & Spraying',
    targetCrops: ['Maize', 'Sorghum', 'Pearl Millet', 'Sweetcorn', 'Winter Wheat'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    summary: 'The emergency field response guide against Fall Armyworm (Spodoptera frugiperda) and African Maize Stalk Borer (Busseola fusca). Formulates chemical rotation, scouting thresholds, and knapsack nozzle calibration.',
    keyDirectives: [
      'Scout early: Inspect 20 plants in 5 random field locations twice weekly. Action threshold is reached when 5% of seedlings show fresh "windowing" pinhole leaf damage.',
      'Spray before caterpillars hide: Fall armyworms tunnel deep into the plant funnel by 3rd instar; spray between 6:00 AM and 8:30 AM or at dusk when caterpillars emerge to feed.',
      'Rotate chemical modes of action: Alternate synthetic pyrethroids (Karate Zeon) with diamides (Belt 480SC / Ampligo) and avermectins (Prove 1.92EC) to prevent rapid insect resistance.',
      'Direct spray stream vertically downward into the funnel whorl using a solid cone nozzle at low pressure (2 bar).'
    ],
    plantPopulationPerHa: 'Standard crop population',
    seedRatePerHa: 'Not applicable',
    basalFertilizerRecommendation: 'Healthy, well-fertilized crops tolerate pest damage significantly better than nutrient-stressed plants.',
    topDressingRecommendation: 'Ensure rapid vegetative growth with split AN to assist plants outgrowing early caterpillar defoliation.',
    sprayProgramHighlight: 'Karate Zeon 5CS (120 ml/ha) -> Ampligo 150ZC (150 ml/ha) -> Belt 480SC (100 ml/ha).',
    harvestCriteria: 'Inspect cobs before harvest for secondary Aspergillus ear rots entered via caterpillar boreholes.',
    sections: [
      {
        heading: '1. Cultural & Physical IPM Counter-Measures',
        content: 'Communal farmers can drop 1 teaspoon of clean dry sand, wood ash, or finely ground dried neem leaf into the funnel of young maize plants. The abrasive grains irritate the caterpillar cuticles and dry them out, providing effective low-cost supplementary control.'
      }
    ]
  },
  {
    id: 'agricura-weed-management-handbook',
    title: 'Weed Science & Selective Herbicide Handbook',
    edition: '2024/2025 Field Crop Weed Manual',
    category: 'Crop Protection & Spraying',
    targetCrops: ['Maize', 'Soya Beans', 'Groundnuts', 'Wheat', 'Sugar Beans'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III', 'IV'],
    summary: 'Master herbicide application compendium detailing pre-emergence and post-emergence selective herbicides. Eliminates the back-breaking labor of manual weeding and protects crops during the critical weed-free period (first 35 days).',
    keyDirectives: [
      'Pre-emergence herbicides require moist soil: Spray Atrazine or Dual Magnum within 48 hours after planting into moist seedbeds for the chemical barrier to activate.',
      'Maize pre-emergence program: Apply Atrazine 500SC (3.0 - 4.0 L/ha) + Dual Magnum 960EC (1.0 L/ha) for total control of annual grasses and broadleaf weeds.',
      'Post-emergence maize rescue: If weeds emerge, spray Stella Star 420SC (Topramezone + Dicamba) at 1.0 L/ha when weeds are at 2-4 leaf stage.',
      'Legume selectivity: Spray Basagran 480SL (Bentazone) post-emergence over soya beans and groundnuts for broadleaf weeds and yellow nutsedge.'
    ],
    plantPopulationPerHa: 'Maintains zero weed competition',
    seedRatePerHa: 'Not applicable',
    basalFertilizerRecommendation: 'Weeds consume up to 45% of applied basal fertilizer if not controlled within 14 DAE.',
    topDressingRecommendation: 'Never apply top dressing onto weedy fields; weeds will outgrow the crop.',
    sprayProgramHighlight: 'Pre-plant burndown: Glyphosate 480SL (2-3 L/ha); Pre-emergence: Atrazine + Dual; Post-emergence: Stella Star / Servian.',
    harvestCriteria: 'Clean weed-free fields facilitate rapid mechanical combining or hand harvesting without weed seed contamination.',
    sections: [
      {
        heading: '1. Knapsack Sprayer Calibration Steps',
        bulletPoints: [
          'Measure out a test strip of 100 meters length x 1 meter width (100 m² = 1/100th ha).',
          'Fill knapsack with plain water and spray the strip at a normal, steady walking pace.',
          'Measure the water used in liters and multiply by 100 to determine water volume per hectare (typically 200 - 250 L/ha).',
          'Divide required chemical rate by the number of knapsacks needed per hectare.'
        ]
      }
    ]
  },
  {
    id: 'agricura-horticulture-disease-manual',
    title: 'High-Value Horticulture Fungicide & Bactericide Program',
    edition: '2024/2025 Commercial Vegetable Health Guide',
    category: 'Crop Protection & Spraying',
    targetCrops: ['Tomatoes', 'Potatoes', 'Cabbages', 'Peppers', 'Onions', 'Cucurbits'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III', 'IV'],
    summary: 'The professional disease control manual for commercial vegetable growers. Covers Early Blight, Late Blight, Bacterial Spot, Powdery Mildew, Downy Mildew, and Anthracnose with strict Pre-Harvest Interval (PHI) compliance.',
    keyDirectives: [
      'Late Blight emergency (Phytophthora infestans): Under cold, drizzly overcast conditions, spray Ridomil Gold MZ immediately before lesions spread; switch to Dithane M-45 for maintenance.',
      'Bacterial disease control: Spray Copper Oxychloride 85WP on tomatoes and peppers against Bacterial Canker and Bacterial Spot; antibiotics are prohibited.',
      'Strictly observe Pre-Harvest Intervals (PHI): Dithane M-45 (7 days on tomatoes); Ridomil Gold (14 days); Score 250EC (7 days); Copper Oxychloride (3 days).',
      'Add a quality adjuvant/sticker (Agral 90 or Wetcit) to every fungicide spray to prevent rain washing the chemical off waxy vegetable leaves.'
    ],
    plantPopulationPerHa: 'Protects commercial vegetable canopies',
    seedRatePerHa: 'Not applicable',
    basalFertilizerRecommendation: 'Balanced nutrition; avoid excessive nitrogen which creates soft succulent tissues vulnerable to fungal hyphae penetration.',
    topDressingRecommendation: 'Foliar calcium (Calcium Nitrate) prevents blossom end rot in tomatoes and tip-burn in cabbage.',
    sprayProgramHighlight: 'Preventive: Dithane M-45 + Copper Oxychloride; Curative systemic: Ridomil Gold MZ + Score 250EC.',
    harvestCriteria: 'Zero chemical residue on harvested produce; observe safety withholding periods meticulously.',
    sections: [
      {
        heading: '1. Resistance Management Principles',
        content: 'Single-site systemic fungicides (like Metalaxyl and Difenoconazole) are prone to fungal resistance if overused. Never apply single-site systemics more than 2-3 times per season. Always alternate with multi-site protective contact fungicides like Mancozeb and Copper.'
      }
    ]
  },

  // ==================== CLIMATE RESILIENT GRAINS & FODDER STANDARDS ====================
  {
    id: 'valley-seeds-drought-grains-manual',
    title: 'Climate-Smart Small Grains & Legumes Handbook',
    edition: '2024/2025 Agro-Ecological Resilience Edition',
    category: 'Cereals & Grains',
    targetCrops: ['White Sorghum (Macia / SV2)', 'Red Sorghum (SV4 / Red Swazi)', 'Pearl Millet', 'Cowpeas (CBC series)'],
    recommendedRegions: ['III', 'IV', 'V'],
    summary: 'Field production manual engineered specifically for drought-prone communal districts of Zimbabwe. Outlines varietal adaptation, bird-deterrent red tannin sorghums, brewing contracts with Delta Beverages, and cowpea grain-fodder dual-purpose management.',
    keyDirectives: [
      'Macia is a semi-dwarf white sorghum (1.3m tall) with huge compact heads; resistant to lodging and ideal for human sadza meal.',
      'Red Swazi & SV4 contain high seed tannins which deter quelea birds naturally; guaranteed brewing purchase contract by commercial maltsters.',
      'CBC2 cowpea provides dual benefits: yields up to 2.5 t/ha grain plus 4 t/ha nutritious green fodder for livestock fattening.',
      'Store small grain seed with Shumba Super Dust or mix with dry wood ash (30% by volume) in airtight metal grain silos.'
    ],
    plantPopulationPerHa: 'Sorghum: 70,000 - 85,000; Cowpeas: 110,000 - 140,000 plants/ha',
    seedRatePerHa: 'Sorghum: 8 - 10 kg/ha; Cowpeas: 25 - 35 kg/ha certified seed',
    basalFertilizerRecommendation: 'Compound D or SSP at 150 kg/ha in Pfumvudza planting basins.',
    topDressingRecommendation: 'Ammonium Nitrate (AN) at 75 - 100 kg/ha micro-dosed at knee-high stage.',
    sprayProgramHighlight: 'Karate Zeon for cowpea aphid and pod borer; natural bird scaring at dawn and dusk.',
    harvestCriteria: 'Thresh grain when head rattles when shaken and moisture is below 12.5%.',
    sections: [
      {
        heading: '1. Intercropping Sorghum with Cowpeas',
        content: 'Plant 2 rows of sorghum alternating with 1 row of cowpea in Pfumvudza basins. The cowpeas provide dense ground cover that conserves soil moisture and adds biologically fixed nitrogen to the sorghum root zone.'
      }
    ]
  },
  {
    id: 'valley-seeds-pastures-soil-guide',
    title: 'Multi-Species Pasture Leys & Fodder Conservation',
    edition: '2024/2025 Livestock & Soil Regeneration Guide',
    category: 'Legumes & Oilseeds',
    targetCrops: ['Katambora Rhodes Grass', 'Velvet Bean (Mucuna)', 'Sunnhemp', 'Stylosanthes guianensis', 'Lablab'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    summary: 'The complete livestock forage and soil regeneration handbook. Details establishing 3-year Katambora Rhodes Grass rotation to cleanse soil of root-knot nematodes for tobacco, and baling high-protein legume hay for communal cattle survival.',
    keyDirectives: [
      'Katambora Rhodes grass is immune to root-knot nematodes (Meloidogyne javanica); 3 years of Rhodes grass cleanses infected sandveld for tobacco and tomatoes.',
      'Velvet bean (Mucuna pruriens) fixes up to 150 kg N/ha and produces 5-8 tonnes/ha dry biomass with 18% crude protein.',
      'Sow Katambora seed onto a rolled, firm seedbed; broadcast at 6-8 kg/ha and roll again lightly; do not bury deeper than 5mm.',
      'Cut pasture hay when grasses are at early flowering (boot stage) to maximize digestible crude protein.'
    ],
    plantPopulationPerHa: 'Dense perennial sod / canopy cover',
    seedRatePerHa: 'Rhodes Grass: 6 - 8 kg/ha; Velvet Bean: 40 - 50 kg/ha; Sunnhemp: 35 kg/ha',
    basalFertilizerRecommendation: 'Establishment: Compound D at 150 - 200 kg/ha; top-dress with AN after each cut.',
    topDressingRecommendation: 'Ammonium Nitrate at 100 kg/ha after each hay cut or grazing cycle.',
    sprayProgramHighlight: 'Zero pesticide requirement; highly weed-suppressive canopy.',
    harvestCriteria: 'Bale hay when green color is preserved and moisture is 15-18% (stems snap cleanly without oozing sap).',
    sections: [
      {
        heading: '1. Winter Drought Fodder Bank Strategy',
        content: 'Communal cattle lose up to 25% of body weight between August and November because dry veld grass drops to below 3% crude protein. Feeding just 2kg of dried Velvet Bean hay daily maintains cattle weight, ensures successful calf calving, and sustains draught power for early land prep.'
      }
    ]
  },

  // ==================== National Fertilizer Standard (ZIMBABWE FERTILISER COMPANY) ====================
  {
    id: 'zfc-crop-nutrition-master-guide',
    title: 'Complete Crop Nutrition & Blended Fertilizers Manual',
    edition: '2024/2025 Total Crop Solutions Edition',
    category: 'Crop Nutrition & Soils',
    targetCrops: ['Maize', 'Wheat', 'Tobacco', 'Soya Beans', 'Horticulture', 'Cotton'],
    recommendedRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    summary: 'National Fertilizer Standard technical compendium detailing specialised basal blends and top dressings including Compound S, Compound J, Tobacco Blend, Cereal Special, Quick-Gro foliar, and Calcium Nitrate.',
    keyDirectives: [
      'Compound S (7:21:8 + 9S + 0.1B): Premium basal fertilizer for soya beans, groundnuts, and horticulture; high phosphorus drives rapid root elongation and sulfur boosts protein synthesis.',
      'Compound J (15:5:20): High-nitrogen, high-potassium top-dress blend formulated for commercial potato, banana, and citrus production.',
      'Foliar feeding with Quick-Gro: Spray Quick-Gro (NPK + trace elements) during periods of dry spell recovery or cold stress to jumpstart crop photosynthetic activity.',
      'Solubor (20.5% Boron): Essential foliar spray on cotton, sunflower, and brassicas to prevent hollow stems and poor pollination.'
    ],
    plantPopulationPerHa: 'Calibrated to commercial crop population',
    seedRatePerHa: 'Not applicable',
    basalFertilizerRecommendation: 'Compound D (7:14:7) at 300 - 400 kg/ha for cereals; Compound S at 400 - 600 kg/ha for vegetables.',
    topDressingRecommendation: 'Ammonium Nitrate (34.5% N) or Urea (46% N) at 200 - 300 kg/ha.',
    sprayProgramHighlight: 'Quick-Gro foliar at 2-3 L/ha + Agritrac micronutrient boost.',
    harvestCriteria: 'Optimum nutrient balance produces high hectolitre grain weight and superior marketable grade.',
    sections: [
      {
        heading: '1. Urea vs. Ammonium Nitrate Usage Rules',
        content: 'Urea contains 46% nitrogen compared to 34.5% in AN, making it cheaper per kg of N. However, Urea must be incorporated into moist soil immediately or applied ahead of a verified rain shower. If left on a hot dry soil surface, up to 40% of Urea nitrogen volatilizes into the air as ammonia gas.'
      }
    ]
  },

  // ==================== FLOAT BED SEEDLING PRODUCTION STANDARDS ====================
  {
    id: 'kutsaga-float-bed-seedlings-protocol',
    title: 'Float Bed Seedling Production & Float Trays Protocol',
    edition: '2024/2025 GAP Certification Standard',
    category: 'Cash Crops (Tobacco/Cotton)',
    targetCrops: ['Flue-Cured Virginia Tobacco', 'Horticulture Seedlings'],
    recommendedRegions: ['IIa', 'IIb', 'III'],
    summary: 'The official national research protocol for growing disease-free tobacco and vegetable seedlings using the float bed tray system. Completely replaces banned methyl bromide soil fumigation with clean water-borne nursery culture.',
    keyDirectives: [
      'Float pond construction: Construct level ponds lined with 250-micron black polythene plastic; fill with clean borehole water to a depth of 10-12cm.',
      'Water quality: Electrical conductivity (EC) must be less than 0.5 mS/cm and pH between 5.5 and 6.5.',
      'Fertilizer dosing: Apply Specialized Float Hydrofert (20:10:20) into pond water in split doses to maintain pond EC at 1.2 - 1.8 mS/cm.',
      'Seedling clipping: Clip leaf canopies 3-5 times starting 5 weeks after sowing to promote uniform stem thickness, prevent spiraling, and build hardy root systems.'
    ],
    plantPopulationPerHa: 'Produces 15,000 hardened transplants per hectare',
    seedRatePerHa: '5g pelleted certified seed (KRK 26, KRK 66, T71)',
    basalFertilizerRecommendation: 'Specialized Hydrofert Float Bed Fertilizer dissolved directly into float pond water.',
    topDressingRecommendation: 'Soluble Ammonium Nitrate pond top-up at 6 weeks if seedling foliage yellows.',
    sprayProgramHighlight: 'Confidor 200SL pond drench 3 days before field pulling gives 8-week systemic protection against aphids and vectors.',
    harvestCriteria: 'Pull seedlings when stem diameter reaches 6-8mm (pencil thickness) and height is 15-18cm with firm root plug.',
    sections: [
      {
        heading: '1. Seedbed Hygiene & Virus Prevention',
        content: 'Workers must wash hands with soapy water and dip shoes in disinfectant before entering the float bed area. Strictly prohibit smoking or handling unprocessed tobacco leaves near seedbeds; Tobacco Mosaic Virus (TMV) is transmitted mechanically on fingers.'
      }
    ]
  }
];

