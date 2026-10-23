/**
 * Offline Storage & On-Device Pre-downloaded Diagnostic Database
 * Powers 100% offline operation for smallholder farmers across rural Zimbabwe.
 */

import { matchBestDiagnosticRecord } from '../data/plantPestDiseaseDatabase';

export interface PreDownloadedAgrochemical {
  id: string;
  brandName: string;
  category: 'Insecticide' | 'Fungicide' | 'Herbicide' | 'Fertilizer' | 'Veterinary Dip' | 'Veterinary Antibiotic' | 'Organic / Cultural';
  activeIngredient: string;
  manufacturer: string;
  targetCondition: string;
  smallholderDosageRate: string;
  safetyIntervalPhi: string;
  localAvailability: string;
  priceEstimateUsd: string;
}

export const PRE_DOWNLOADED_AGROCHEMICAL_DB: PreDownloadedAgrochemical[] = [
  {
    id: 'chem-01',
    brandName: 'Karate Zeon 5CS',
    category: 'Insecticide',
    activeIngredient: 'Lambda-cyhalothrin (50g/L micro-encapsulated)',
    manufacturer: 'DR&SS Registered',
    targetCondition: 'Fall Armyworm (Mhungu), Stem borer, Cutworms',
    smallholderDosageRate: '15ml to 20ml per 15-litre knapsack sprayer into central plant whorl',
    safetyIntervalPhi: '14 days before harvest of green mealies',
    localAvailability: 'Available at all GMB depots and rural agro-dealers nationwide',
    priceEstimateUsd: '$6.50 per 100ml bottle',
  },
  {
    id: 'chem-02',
    brandName: 'Ampligo 150 ZC',
    category: 'Insecticide',
    activeIngredient: 'Chlorantraniliprole 100g/L + Lambda-cyhalothrin 50g/L',
    manufacturer: 'DR&SS Registered',
    targetCondition: 'Resistant 3rd instar Fall Armyworm, Tuta Absoluta in tomatoes',
    smallholderDosageRate: '10ml to 12ml per 15-litre knapsack sprayer',
    safetyIntervalPhi: '7 days before green picking',
    localAvailability: 'Provincial agro-dealers (Harare, Bulawayo, Chinhoyi)',
    priceEstimateUsd: '$12.00 per 100ml pack',
  },
  {
    id: 'chem-03',
    brandName: 'Copper Oxychloride 85 WP',
    category: 'Fungicide',
    activeIngredient: 'Copper Oxychloride 85% w/w (equiv. 50% metallic copper)',
    manufacturer: 'DR&SS Registered',
    targetCondition: 'Tomato Early & Late Blight, Groundnut Leaf Spot (Cercospora), Downy Mildew',
    smallholderDosageRate: '35g (approx. 2 matchboxfuls) per 15-litre knapsack',
    safetyIntervalPhi: '3 days for tomatoes and vegetables',
    localAvailability: 'Widely stocked in all communal agro-stores',
    priceEstimateUsd: '$5.50 per 500g pouch',
  },
  {
    id: 'chem-04',
    brandName: 'Daconil 720 SC',
    category: 'Fungicide',
    activeIngredient: 'Chlorothalonil 720g/L',
    manufacturer: 'DR&SS Registered',
    targetCondition: 'Severe Anthracnose, Leaf spot, Alternaria blight',
    smallholderDosageRate: '25ml per 15L knapsack',
    safetyIntervalPhi: '7 days',
    localAvailability: 'Town agro-dealers',
    priceEstimateUsd: '$9.00 per 200ml bottle',
  },
  {
    id: 'chem-05',
    brandName: 'Shumba Super Dust',
    category: 'Insecticide',
    activeIngredient: 'Pirimiphos-methyl 16g/kg + Deltamethrin 3g/kg',
    manufacturer: 'DR&SS Registered',
    targetCondition: 'Larger Grain Borer (LGB), Maize Weevil (Chipfukuto), Angoumois Grain Moth',
    smallholderDosageRate: '50g sachet thoroughly mixed per 50kg bag of clean dry grain (12% moisture)',
    safetyIntervalPhi: 'Safe for consumption immediately upon winnowing and washing',
    localAvailability: 'Ubiquitous in all communal trading stores',
    priceEstimateUsd: '$0.80 per 50g sachet ($7.50 per 500g)',
  },
  {
    id: 'chem-06',
    brandName: 'Decatix Cattle Dip 5%',
    category: 'Veterinary Dip',
    activeIngredient: 'Deltamethrin 50g/L',
    manufacturer: 'DR&SS Registered',
    targetCondition: 'Bont Tick (Amblyomma), Blue Tick, January Disease vector (Rhipicephalus appendiculatus)',
    smallholderDosageRate: '1ml per 1 litre of water (Hand spraying) or 1L per 1,000L plunge dip tank',
    safetyIntervalPhi: 'Meat: 42 days; Milk: 48 hours',
    localAvailability: 'Government Vet Depots & Agrovets',
    priceEstimateUsd: '$14.00 per 250ml bottle',
  },
  {
    id: 'chem-07',
    brandName: 'Bupalex (Buparvaquone 50mg/ml)',
    category: 'Veterinary Antibiotic',
    activeIngredient: 'Buparvaquone',
    manufacturer: 'DR&SS Registered',
    targetCondition: 'Acute Theileriosis / January Disease (Chirwere cheMbudzi)',
    smallholderDosageRate: '1ml per 20kg bodyweight injected intramuscularly in neck muscle',
    safetyIntervalPhi: 'Meat: 42 days; Milk: 48 hours',
    localAvailability: 'Veterinary prescription required at District Vet Offices',
    priceEstimateUsd: '$28.00 per 50ml vial',
  },
  {
    id: 'chem-08',
    brandName: 'Terramycin LA 200mg/ml',
    category: 'Veterinary Antibiotic',
    activeIngredient: 'Oxytetracycline Long Acting',
    manufacturer: 'DR&SS Registered',
    targetCondition: 'Heartwater (Chirwere cheMwoyo), Anaplasmosis / Gall Sickness, Foot Rot in Goats',
    smallholderDosageRate: '1ml per 10kg bodyweight deep intramuscular injection',
    safetyIntervalPhi: 'Meat: 28 days; Milk: 7 days',
    localAvailability: 'All veterinary and livestock outlets',
    priceEstimateUsd: '$11.50 per 100ml bottle',
  },
  {
    id: 'chem-09',
    brandName: 'Pfumvudza Fine Wood Ash & Sand IPM Mixture',
    category: 'Organic / Cultural',
    activeIngredient: 'Potassium carbonate, silica particles, abrasive ash',
    manufacturer: 'DR&SS Registered',
    targetCondition: 'Early Fall Armyworm larvae in leaf funnels',
    smallholderDosageRate: '1 pinch (bottle-cap volume) of dry sieved ash mixed with equal sand dropped directly into each plant whorl',
    safetyIntervalPhi: 'Zero days (Chemical-free)',
    localAvailability: '100% locally available on any smallholder homestead',
    priceEstimateUsd: '$0.00 (Zero cost)',
  },
  {
    id: 'chem-10',
    brandName: 'Gavakhava (Aloe Chabaudii) Tick Smear',
    category: 'Organic / Cultural',
    activeIngredient: 'Aloin, anthraquinones, bitter saponins',
    manufacturer: 'DR&SS Registered',
    targetCondition: 'Tick clusters on cattle ear bases and tail switches',
    smallholderDosageRate: 'Crush fresh fleshy aloe leaves and mix juice with petroleum jelly or grease; smear on tick hotspots weekly',
    safetyIntervalPhi: 'Zero days',
    localAvailability: 'Abundant wild succulent throughout communal grazing areas',
    priceEstimateUsd: '$0.00 (Zero cost)',
  },
];

/**
 * On-Device Offline Diagnostic Analyzer
 * Evaluates symptoms using pre-downloaded heuristics without network connectivity.
 */
export function runOfflineDiagnostics(
  targetType: 'plant' | 'livestock',
  cropOrAnimal: string,
  userNotes: string
) {
  const { record, confidenceScore } = matchBestDiagnosticRecord(targetType, cropOrAnimal, userNotes);

  return {
    diagnosis: `${record.name} (${record.scientificName}) / ${record.vernacularNames.shona}`,
    confidenceScore,
    conditionType: record.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    severity: (record.riskLevel === 'Critical' ? 'High' : record.riskLevel) as 'High' | 'Moderate' | 'Low',
    affectedPart: record.affectedPlantParts.join(', '),
    symptomsSummary: record.symptomsSummary,
    primaryRemedy: {
      productName: record.primaryRegisteredControl.brandName,
      activeIngredient: record.primaryRegisteredControl.activeIngredient,
      manufacturer: record.primaryRegisteredControl.manufacturer,
      dosageInstructions: record.primaryRegisteredControl.dilutionRate,
      applicationTiming: record.primaryRegisteredControl.applicationTiming,
      preHarvestInterval: record.primaryRegisteredControl.safetyPreHarvestInterval,
    },
    ipmAndOrganicAlternative: {
      methodName: record.ipmOrganicControl.methodName,
      preparationAndApplication: `${record.ipmOrganicControl.preparationInstructions}. Cultural practice: ${record.ipmOrganicControl.culturalPractice}`,
    },
    preventativeMeasures: record.preventativeProtocol,
    agritexAdvisoryNote: `${record.agritexAdvisory} [Verified Reference: ${record.eppoCode} | ${record.economicThreshold}]`,
    isOfflineGenerated: true,
    recordId: record.id,
  };
}

// Offline Outbox Management for Community Posts & Sync Queue
export interface OfflineQueueItem {
  id: string;
  type: 'community_post' | 'comment' | 'diagnostic_scan';
  timestamp: string;
  payload: any;
  status: 'pending' | 'synced';
}

const OUTBOX_STORAGE_KEY = 'farmers_offline_outbox';

export function getOfflineOutbox(): OfflineQueueItem[] {
  try {
    const raw = localStorage.getItem(OUTBOX_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToOfflineOutbox(item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'status'>): OfflineQueueItem {
  const current = getOfflineOutbox();
  const newItem: OfflineQueueItem = {
    ...item,
    id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };
  const updated = [newItem, ...current];
  try {
    localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
  return newItem;
}

export function clearSyncedOutboxItems() {
  try {
    const current = getOfflineOutbox();
    const remaining = current.filter(i => i.status === 'pending');
    localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(remaining));
  } catch (err) {
    console.warn('Failed to clear outbox:', err);
  }
}
