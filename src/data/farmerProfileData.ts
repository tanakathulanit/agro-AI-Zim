/**
 * Farmers Dictionary Zw - Comprehensive Farmer Profile & Personalized Agritex Advisory Engine
 * Supports smallholder (Pfumvudza / Intwasa), A1, A2, and communal farmers in Zimbabwe.
 */

import { ZimbabweLocation, ZIMBABWE_LOCATIONS } from './zimbabweLocations';

export interface CropHolding {
  id: string;
  cropId: string;
  cropName: string;
  vernacularName?: string;
  variety: string;
  areaPlanted: number;
  areaUnit: 'pfumvudza_plots' | 'hectares' | 'acres';
  sowingDate: string; // YYYY-MM-DD
  growthStage: 'land_prep' | 'germination' | 'vegetative' | 'flowering_tasseling' | 'grain_filling' | 'harvesting';
  irrigationStatus: 'rainfed' | 'irrigated' | 'supplementary';
  expectedYieldBagsOrTonnes: number;
  notes?: string;
}

export interface LivestockHoldings {
  cattleHeadcount: number;
  cattleBreeds: string[];
  cattleDippingStatus: 'up_to_date' | 'due_this_week' | 'overdue';
  goatSheepHeadcount: number;
  goatBreeds: string[];
  poultryHeadcount: number;
  poultryType: string[];
  pigsHeadcount: number;
  draftOxenPairs: number;
  lastDippingDate?: string;
  lastAnthraxBlacklegVaccine?: string;
}

export interface FarmerProfile {
  id: string;
  farmerName: string;
  farmName: string;
  nationalIdNumber?: string;
  phoneNumber: string;
  resettlementModel: 'Pfumvudza Communal' | 'A1 Resettlement' | 'A2 Commercial' | 'Peri-Urban Horticulture' | 'Old Resettlement';
  districtId: string;
  districtName: string;
  province: string;
  wardOrVillage: string;
  naturalRegion: 'I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V';
  totalLandSize: number;
  landSizeUnit: 'pfumvudza_plots' | 'hectares' | 'acres';
  soilTexture: 'sandy' | 'red_clay' | 'loam' | 'black_vertisol';
  waterSource: 'rainfed' | 'pfumvudza_catchment' | 'borehole_drip' | 'river_dam_canal' | 'sand_abstraction';
  hasSoilTestReport: boolean;
  activeCrops: CropHolding[];
  livestock: LivestockHoldings;
  updatedAt: string;
}

export interface PersonalizedAdvisoryResult {
  generatedDate: string;
  farmSummaryHeadline: string;
  urgencyLevel: 'Normal' | 'High Attention' | 'Critical Action';
  soilAndBasalDirectives: string[];
  cropStageDirectives: {
    cropName: string;
    variety: string;
    stage: string;
    daysAfterPlanting: number;
    recommendedActions: string[];
    sprayAlert?: string;
    nutritionDose?: string;
  }[];
  livestockDirectives: {
    category: string;
    directive: string;
    urgency: 'routine' | 'urgent' | 'seasonal';
  }[];
  waterAndClimaticDirectives: string[];
  pfumvudzaInputPackage: {
    compoundDRequiredBags50kg: number;
    anTopDressingRequiredBags50kg: number;
    certifiedSeedKg: number;
    kraalManureTonsEstimated: number;
    mulchBalesRequired: number;
  };
}

export const PROFILE_STORAGE_KEY = 'farmers_dict_user_profile_v2';

/**
 * Creates an empty, blank farmer profile template for manual entry.
 * There are NO pre-installed farmer profiles; profiles must be manually entered.
 */
export function createEmptyFarmerProfile(defaultDistrictId = 'goromonzi'): FarmerProfile {
  const loc = ZIMBABWE_LOCATIONS.find(l => l.id === defaultDistrictId) || ZIMBABWE_LOCATIONS[0];
  return {
    id: `profile-${Date.now()}`,
    farmerName: '',
    farmName: '',
    nationalIdNumber: '',
    phoneNumber: '',
    resettlementModel: 'Pfumvudza Communal',
    districtId: loc.id,
    districtName: loc.name,
    province: loc.province,
    wardOrVillage: '',
    naturalRegion: (loc.naturalRegion as 'I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V') || 'IIa',
    totalLandSize: 1,
    landSizeUnit: 'pfumvudza_plots',
    soilTexture: 'loam',
    waterSource: 'rainfed',
    hasSoilTestReport: false,
    activeCrops: [],
    livestock: {
      cattleHeadcount: 0,
      cattleBreeds: [],
      cattleDippingStatus: 'up_to_date',
      goatSheepHeadcount: 0,
      goatBreeds: [],
      poultryHeadcount: 0,
      poultryType: [],
      pigsHeadcount: 0,
      draftOxenPairs: 0,
      lastDippingDate: '',
      lastAnthraxBlacklegVaccine: ''
    },
    updatedAt: ''
  };
}

/**
 * Load manually saved profile from localStorage.
 * Returns null if no manual profile has been entered by the user.
 */
export function loadFarmerProfile(): FarmerProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    // Purge deprecated mock profile key from previous sessions
    localStorage.removeItem('farmers_dict_user_profile_v1');
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.farmerName || !parsed.farmerName.trim()) {
      return null;
    }
    return parsed;
  } catch (err) {
    console.warn('Failed to load farmer profile from localStorage', err);
    return null;
  }
}

/**
 * Save manually entered farmer profile to localStorage
 */
export function saveFarmerProfile(profile: FarmerProfile): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const toSave: FarmerProfile = {
      ...profile,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch (err) {
    console.error('Failed to save farmer profile to localStorage', err);
    return false;
  }
}

/**
 * Clear saved farmer profile from localStorage
 */
export function clearFarmerProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem('farmers_dict_user_profile_v1');
  } catch (err) {
    console.error('Failed to clear farmer profile from localStorage', err);
  }
}

/**
 * Calculates Days After Planting (DAP) from sowing date
 */
export function calculateDaysAfterPlanting(sowingDateStr: string): number {
  if (!sowingDateStr) return 0;
  const sowingDate = new Date(sowingDateStr);
  const now = new Date();
  const diffTime = now.getTime() - sowingDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Generate comprehensive personalized Agritex advisory recommendations
 * specifically customized to the farmer's land location, crops, and livestock!
 */
export function generatePersonalizedAgritexAdvisory(profile: FarmerProfile): PersonalizedAdvisoryResult {
  const totalPlots = profile.landSizeUnit === 'pfumvudza_plots' 
    ? profile.totalLandSize 
    : profile.landSizeUnit === 'hectares' 
      ? Math.max(1, Math.round(profile.totalLandSize * 16)) 
      : Math.max(1, Math.round(profile.totalLandSize * 6.5));

  // 1. Soil & Basal Nutrition Directives
  const soilDirectives: string[] = [];
  if (profile.soilTexture === 'sandy') {
    soilDirectives.push(`Sandveld Leaching Management: Light sandy soils in ${profile.districtName} lose nitrogen rapidly during heavy downpours. Split Ammonium Nitrate into 3 micro-dressings (at knee-height, tasseling, and post-pollination) rather than 1 heavy dressing.`);
    soilDirectives.push(`Kraal Manure Blanket: Apply at least 2 handfuls (~500g) of well-rotted cattle/goat manure into each Pfumvudza basin to build cation exchange capacity.`);
    if (profile.naturalRegion === 'I' || profile.naturalRegion === 'IIa') {
      soilDirectives.push(`Lime Correction: Apply 500kg/ha dolomitic or calcitic lime 6-8 weeks ahead of planting to correct subsoil acidity (pH < 5.2).`);
    }
  } else if (profile.soilTexture === 'red_clay') {
    soilDirectives.push(`Heavy Red Clay Potholing: Fersiallitic clay in ${profile.districtName} holds basal nutrients firmly. Place Compound D (7:14:7) at 10g per basin (1 standard beer bottle cap) covered with 2cm of soil before dropping seed.`);
    soilDirectives.push(`Crust Prevention: Avoid working wet clay to prevent compaction pans. Maintain 5cm grass mulch blanket over basins to stop surface baking.`);
  } else if (profile.soilTexture === 'black_vertisol') {
    soilDirectives.push(`Vertisol Swell-Shrink Protocol: Black clay ('Dope') exhibits severe waterlogging in early season and deep cracking upon drying. Dig drainage interceptor furrows above basins.`);
  } else {
    soilDirectives.push(`Balanced Loam Nutrition: Apply 1 standard beer bottle cap (10g) Compound D basal per basin. Top-dress with Ammonium Nitrate (AN) at 21 and 42 days after emergence.`);
  }

  // 2. Crop Stage-Specific Directives
  const cropStageDirectives = profile.activeCrops.map((crop) => {
    const dap = calculateDaysAfterPlanting(crop.sowingDate);
    const actions: string[] = [];
    let sprayAlert: string | undefined;
    let nutritionDose: string | undefined;

    if (crop.growthStage === 'land_prep') {
      actions.push(`Complete Pfumvudza basin digging: 15cm length × 15cm width × 15cm depth, spaced 75cm between rows and 60cm within rows (1,444 basins per standard plot).`);
      actions.push(`Apply basal organic matter: Add 1-2 handfuls of kraal manure or well-decomposed compost per basin.`);
      nutritionDose = 'Compound D (10g / 1 bottle cap per basin) placed at bottom of basin and covered with 2cm clean soil.';
    } else if (crop.growthStage === 'germination') {
      actions.push(`Emergence Inspection: Check germination percentage 7-10 days after sowing. Fill missing stations immediately with pre-soaked seed.`);
      actions.push(`Weed Flush Defense: Hand-pull early weeds while seedlings are small to eliminate moisture competition.`);
      sprayAlert = 'Scout for Cutworm larvae at soil surface if seedling stems are cut off at ground level (Karate Zeon spray if cut plants exceed 3%).';
    } else if (crop.growthStage === 'vegetative') {
      actions.push(`Knee-Height Weeding: Keep a 2-meter border around plots clean. Thin seedlings to exactly 2 healthy plants per basin.`);
      actions.push(`First Nitrogen Split: Apply 1 bottle cap (5g) Ammonium Nitrate (AN) or Urea in a small ring 5cm away from plant stems on moist soil.`);
      nutritionDose = 'Ammonium Nitrate (AN) 34.5% N: 5g per basin applied during or immediately after rainfall.';
      sprayAlert = 'Weekly Fall Armyworm (FAW) scouting: Inspect 20 consecutive whorls. If pin-holes or yellow frass appear, spray Ampligo 150 ZC or place dry wood ash into the leaf funnel.';
    } else if (crop.growthStage === 'flowering_tasseling') {
      actions.push(`Critical Moisture Window: Avoid any root disturbance. If a 7-day mid-season dry spell hits, irrigate or conserve with mulch blanket.`);
      actions.push(`Second Top-Dressing: Apply second AN split (5g/basin) at early silk/tassel emergence for maximum ear filling.`);
      sprayAlert = 'Check for Maize Stalk Borer and Aphids on lower silks. Observe 14-day Pre-Harvest Interval (PHI) for any agrochemicals.';
    } else if (crop.growthStage === 'grain_filling') {
      actions.push(`Bird and Rodent Scaring: Protect ripening cobs and legume pods from Quelea birds and field rodents.`);
      actions.push(`Stop Nitrogen: Cease any fertilizer applications to promote dry down and prevent ear rot (Diplodia/Fusarium).`);
      actions.push(`Inspect cob drooping: Ensure maize cobs turn downward before physiological maturity.`);
    } else {
      actions.push(`Harvest at physiological maturity: Harvest when black layer appears at grain base and grain moisture drops below 13.5%.`);
      actions.push(`GMB Delivery Standard: Ensure grain is sun-dried on clean tarpaulins to avoid aflatoxin contamination. Maximum permissible GMB delivery moisture is 12.5%.`);
    }

    return {
      cropName: crop.cropName,
      variety: crop.variety,
      stage: crop.growthStage.replace('_', ' ').toUpperCase(),
      daysAfterPlanting: dap,
      recommendedActions: actions,
      sprayAlert,
      nutritionDose
    };
  });

  // 3. Livestock Holdings Directives
  const livestockDirectives: { category: string; directive: string; urgency: 'routine' | 'urgent' | 'seasonal' }[] = [];
  if (profile.livestock.cattleHeadcount > 0) {
    if (profile.livestock.cattleDippingStatus === 'overdue' || profile.livestock.cattleDippingStatus === 'due_this_week') {
      livestockDirectives.push({
        category: 'Cattle Health & Tick Defense',
        directive: `Mandatory Dipping Due: 5-5-4 dipping regime active in Natural Region ${profile.naturalRegion}. Dip all ${profile.livestock.cattleHeadcount} cattle at the local community dip-tank or apply Amitraz 12.5% EC (Tickoff / Triatix) pour-on to prevent January Disease (Theileriosis) and Babesiosis.`,
        urgency: 'urgent'
      });
    } else {
      livestockDirectives.push({
        category: 'Cattle Maintenance',
        directive: `Dipping status is up-to-date. Ensure calves receive dry-season protein lick and deworming with Albendazole 10% suspension.`,
        urgency: 'routine'
      });
    }

    if (profile.livestock.draftOxenPairs > 0) {
      livestockDirectives.push({
        category: 'Draft Animal Power (Mombe dzekurimisa)',
        directive: `Conditioning Draft Oxen: Provide ${profile.livestock.draftOxenPairs} pair(s) of working oxen with supplementary crushed white maize/sorghum stover and molasses salt lick 30 days ahead of primary planting season.`,
        urgency: 'seasonal'
      });
    }
  }

  if (profile.livestock.goatSheepHeadcount > 0) {
    livestockDirectives.push({
      category: 'Small Ruminants (Goats & Sheep)',
      directive: `Pulpy Kidney & Internal Parasite Control: Vaccinate all ${profile.livestock.goatSheepHeadcount} goats against Enterotoxemia (Pulpy Kidney) before green flush rains. Provide raised slatted floor kraals to prevent foot rot.`,
      urgency: 'routine'
    });
  }

  if (profile.livestock.poultryHeadcount > 0) {
    livestockDirectives.push({
      category: 'Poultry & Roadrunners (Huku dzekumusha)',
      directive: `Newcastle Disease Eye-Drop (I-2 Vaccine): Administer heat-stable thermostable Newcastle vaccine eye-drops to all ${profile.livestock.poultryHeadcount} birds every 3-4 months. Add Aloe vera (Chikakarara) extract to drinking water for general gut immunity.`,
      urgency: 'routine'
    });
  }

  // 4. Water & Climatic Directives
  const waterDirectives: string[] = [];
  if (profile.waterSource === 'rainfed') {
    waterDirectives.push(`Dryland Moisture Conservation: With 100% rainfed farming in Region ${profile.naturalRegion}, zero-runoff Pfumvudza mulch is non-negotiable. Maintain 5-7cm depth of dried veld grass or sorghum stover over all active basins.`);
    waterDirectives.push(`Dry-Spell Cushioning: Each well-mulched Pfumvudza basin holds root-zone water for up to 14-21 days of continuous mid-season dry spell.`);
  } else if (profile.waterSource === 'borehole_drip') {
    waterDirectives.push(`Precision Drip Irrigation Scheduling: Apply 2.5 hours of drip run early morning (06:00 - 08:30) twice weekly. Target 4 liters per dripper station during flowering/fruiting.`);
  } else {
    waterDirectives.push(`Supplementary Irrigation Scheduling: Maintain silt traps and recharge trenches around your farm perimeter to maximize aquifer recharge.`);
  }

  // 5. Pfumvudza Input Package Requirement Calculation
  const inputPackage = {
    compoundDRequiredBags50kg: Math.ceil(totalPlots * 0.5), // 1 bag Compound D serves 2 Pfumvudza plots
    anTopDressingRequiredBags50kg: Math.ceil(totalPlots * 0.5), // 1 bag AN serves 2 Pfumvudza plots
    certifiedSeedKg: Math.round(totalPlots * 2.5), // 2.5 kg seed per plot
    kraalManureTonsEstimated: Number((totalPlots * 0.75).toFixed(1)), // ~750kg per plot
    mulchBalesRequired: Math.round(totalPlots * 12) // 12 bales per plot
  };

  const urgencyLevel: 'Normal' | 'High Attention' | 'Critical Action' = 
    profile.livestock.cattleDippingStatus === 'overdue' ? 'Critical Action' :
    profile.activeCrops.some(c => c.growthStage === 'vegetative' || c.growthStage === 'flowering_tasseling') ? 'High Attention' : 'Normal';

  return {
    generatedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    farmSummaryHeadline: `${profile.farmName} • ${profile.districtName} (Natural Region ${profile.naturalRegion})`,
    urgencyLevel,
    soilAndBasalDirectives: soilDirectives,
    cropStageDirectives,
    livestockDirectives,
    waterAndClimaticDirectives: waterDirectives,
    pfumvudzaInputPackage: inputPackage
  };
}

/**
 * Build personalized WhatsApp advisory message ready to broadcast or send to extension officer
 */
export function buildPersonalizedWhatsAppAdvisory(profile: FarmerProfile, advisory: PersonalizedAdvisoryResult): string {
  const cropList = advisory.cropStageDirectives
    .map(c => `• *${c.cropName}* (${c.variety}) - Stage: _${c.stage}_ (DAP: ${c.daysAfterPlanting}d)\n  Directives: ${c.recommendedActions[0]}`)
    .join('\n');

  const livestockList = advisory.livestockDirectives.length > 0
    ? advisory.livestockDirectives.map(l => `• *${l.category}:* ${l.directive}`).join('\n')
    : '• No livestock recorded';

  return `🧑‍🌾 *FARMERS DICTIONARY ZW • PERSONALIZED AGRITEX ADVISORY*
━━━━━━━━━━━━━━━━━━━━━
📍 *Farm:* ${profile.farmName} (${profile.farmerName})
📌 *Location:* ${profile.districtName}, ${profile.wardOrVillage} (Region ${profile.naturalRegion})
🌱 *Soil:* ${profile.soilTexture.replace('_', ' ').toUpperCase()} | Water: ${profile.waterSource.replace('_', ' ').toUpperCase()}
📐 *Enterprise Size:* ${profile.totalLandSize} ${profile.landSizeUnit.replace('_', ' ')}

🌽 *CROPS IN GROUND & EXTENSION DIRECTIVES:*
${cropList || '• No active crops registered'}

🐂 *LIVESTOCK DIRECTIVES & VET PROTOCOL:*
${livestockList}

📦 *PFUMVUDZA INPUT REQUIREMENTS:*
• Basal Compound D: ${advisory.pfumvudzaInputPackage.compoundDRequiredBags50kg} bags (50kg)
• Top Dressing AN: ${advisory.pfumvudzaInputPackage.anTopDressingRequiredBags50kg} bags (50kg)
• Certified Seed: ${advisory.pfumvudzaInputPackage.certifiedSeedKg} kg
• Mulch Blanket: ${advisory.pfumvudzaInputPackage.mulchBalesRequired} bales

━━━━━━━━━━━━━━━━━━━━━
_Generated via Farmers Dictionary Zw • Tailored Agritex Extension Service_`;
}
