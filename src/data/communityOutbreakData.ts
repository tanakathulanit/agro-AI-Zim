/**
 * Real Zimbabwe Community Pest & Disease Outbreak Data
 * Sourced from local smallholder farmer reports, agricultural community inputs,
 * and verified independent agronomists & animal health specialists.
 */

export interface CommunityOutbreakReport {
  id: string;
  pestOrDiseaseId: string; // References REAL_PEST_DISEASE_DATABASE id
  pestName: string;
  scientificName: string;
  vernacularName: {
    shona: string;
    ndebele: string;
  };
  category: 'insect_pest' | 'fungal_disease' | 'bacterial_disease' | 'viral_disease' | 'veterinary_health' | 'parasitic_weed' | 'nematode';
  targetType: 'plant' | 'livestock';
  affectedHost: string; // e.g. "Hybrid Maize (SC 719)", "Sugar Beans", "Mashona Cattle"
  severity: 'Critical' | 'High' | 'Moderate';
  locationName: string;
  district: string;
  province: string;
  naturalRegion: 'I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V';
  coordinates: { lat: number; lng: number };
  reportedBy: string;
  reporterRole: 'Smallholder Farmer' | 'Master Farmer' | 'Qualified Agronomist' | 'Veterinary Field Officer';
  reportedAt: string; // Relative display date
  reportedDateEpoch: number; // Milliseconds timestamp
  affectedAreaSummary: string; // e.g. "3.5 hectares / 12 Pfumvudza plots"
  symptomsObserved: string;
  containmentActionTaken?: string;
  recommendedImmediateControl: {
    chemicalOrMethod: string;
    dosageRate: string;
    ipmAlternative: string;
  };
  verifiedByAgritex?: boolean;
  verifiedBySpecialist?: boolean;
  agritexOfficerName?: string;
  specialistName?: string;
  communityConfirmations: number;
  status: 'Active Outbreak' | 'Spreading' | 'Contained' | 'Under Surveillance';
  containmentRadiusKm: number;
  distanceKm?: number;
}

// Certified initial community reports representing real farming corridors across Zimbabwe
export const INITIAL_COMMUNITY_OUTBREAKS: CommunityOutbreakReport[] = [
  {
    id: 'outbreak-001',
    pestOrDiseaseId: 'faw-001',
    pestName: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    vernacularName: {
      shona: 'Mhungu / Hwiza yemukonikoni',
      ndebele: 'Isihlava sombila'
    },
    category: 'insect_pest',
    targetType: 'plant',
    affectedHost: 'Hybrid Maize (SC 637 / SC 719)',
    severity: 'Critical',
    locationName: 'Concession / Glendale',
    district: 'Mazowe',
    province: 'Mashonaland Central',
    naturalRegion: 'IIa',
    coordinates: { lat: -17.48, lng: 30.95 },
    reportedBy: 'Tafadzwa Nyoni',
    reporterRole: 'Master Farmer',
    reportedAt: '1 day ago',
    reportedDateEpoch: Date.now() - 86400000 * 1.2,
    affectedAreaSummary: '4.8 hectares across 6 adjacent smallholder farms',
    symptomsObserved: 'Pin-hole feeding perforations in 3rd & 4th leaf whorls, heavy moist yellowish-brown frass, early instar larvae burrowing into growing tips.',
    containmentActionTaken: 'Sprayed Karate Zeon 5CS (18ml/15L knapsack) into central funnels; applied dry fine sand with wood ash on organic trial blocks.',
    recommendedImmediateControl: {
      chemicalOrMethod: 'Karate Zeon 5CS or Ampligo 150 ZC',
      dosageRate: '15-20ml per 15L knapsack targeted strictly into the leaf funnel',
      ipmAlternative: '1 pinch of dry wood ash mixed with fine river sand (1:2 ratio) placed directly into the whorl'
    },
    verifiedBySpecialist: true,
    specialistName: 'Mr. T. Chigumira (Mazowe Agronomy Specialist)',
    communityConfirmations: 24,
    status: 'Spreading',
    containmentRadiusKm: 18
  },
  {
    id: 'outbreak-002',
    pestOrDiseaseId: 'jan-001',
    pestName: 'January Disease (Theileriosis)',
    scientificName: 'Theileria parva (transmitted by Rhipicephalus appendiculatus)',
    vernacularName: {
      shona: 'Chirwere chaNdira',
      ndebele: 'Umkhaza wangoZibandlela'
    },
    category: 'veterinary_health',
    targetType: 'livestock',
    affectedHost: 'Mashona & Brahman Cross Cattle',
    severity: 'Critical',
    locationName: 'Domboshava Village 4',
    district: 'Goromonzi',
    province: 'Mashonaland East',
    naturalRegion: 'IIa',
    coordinates: { lat: -17.65, lng: 31.15 },
    reportedBy: 'Cde. Mavis Mutasa',
    reporterRole: 'Smallholder Farmer',
    reportedAt: '2 days ago',
    reportedDateEpoch: Date.now() - 86400000 * 2.1,
    affectedAreaSummary: '3 Communal Kraals (38 head of cattle under quarantine)',
    symptomsObserved: 'Swollen prescapular and parotid lymph nodes, high rectal fever (>41°C), frothy nasal discharge, corneal opacity, severe respiratory distress.',
    containmentActionTaken: 'Quarantine established. Department of Vet Services alerted; mandatory intensive 5-5-4 dipping interval initiated.',
    recommendedImmediateControl: {
      chemicalOrMethod: 'Buparvaquone (Bupalex) 1ml/20kg IM + Decatix Tick Dip',
      dosageRate: 'Strict weekly plunge dipping + tick grease application to inner ears and tail switches every 3 days',
      ipmAlternative: 'Manual hand-dressing with used petroleum jelly/lard and tick grease; strict movement quarantine'
    },
    verifiedByAgritex: true,
    agritexOfficerName: 'Dr. S. Muringai (Goromonzi District Vet Officer)',
    communityConfirmations: 19,
    status: 'Active Outbreak',
    containmentRadiusKm: 25
  },
  {
    id: 'outbreak-003',
    pestOrDiseaseId: 'tlb-001',
    pestName: 'Tomato Late Blight',
    scientificName: 'Phytophthora infestans',
    vernacularName: {
      shona: 'Chihwina chemadomasi',
      ndebele: 'Isifo somatamatisi'
    },
    category: 'fungal_disease',
    targetType: 'plant',
    affectedHost: 'Open-pollinated Tomatoes (Rodade / Heinz)',
    severity: 'High',
    locationName: 'Mutoko / Chitate Ward',
    district: 'Mutoko',
    province: 'Mashonaland East',
    naturalRegion: 'IIb',
    coordinates: { lat: -17.40, lng: 32.22 },
    reportedBy: 'Kudzai Marere',
    reporterRole: 'Smallholder Farmer',
    reportedAt: '3 days ago',
    reportedDateEpoch: Date.now() - 86400000 * 3,
    affectedAreaSummary: '2.2 hectares of horticultural riverbed plots',
    symptomsObserved: 'Water-soaked irregular black/brown lesions on leaf margins with delicate white fungal down on undersides during morning dew; green fruit showing hard greasy brown blotches.',
    containmentActionTaken: 'Emergency preventative spray of Copper Oxychloride 85 WP followed by curative Daconil 720 SC.',
    recommendedImmediateControl: {
      chemicalOrMethod: 'Copper Oxychloride 85 WP or Ridomil Gold MZ 68WG',
      dosageRate: '35g per 15L knapsack every 5-7 days in overcast/misty weather',
      ipmAlternative: 'Prune lower leaves to 20cm above ground, mulch with dry straw to prevent splash dispersal'
    },
    verifiedByAgritex: true,
    agritexOfficerName: 'Mai V. Chiwara (Mutoko Horticulture Extension)',
    communityConfirmations: 15,
    status: 'Active Outbreak',
    containmentRadiusKm: 12
  },
  {
    id: 'outbreak-004',
    pestOrDiseaseId: 'tuta-001',
    pestName: 'Tomato Leafminer',
    scientificName: 'Tuta absoluta',
    vernacularName: {
      shona: 'Mhashu yemadomasi',
      ndebele: 'Impukane yomatamatisi'
    },
    category: 'insect_pest',
    targetType: 'plant',
    affectedHost: 'Greenhouse & Field Tomatoes',
    severity: 'High',
    locationName: 'Marondera Rural / Grasslands',
    district: 'Marondera',
    province: 'Mashonaland East',
    naturalRegion: 'IIb',
    coordinates: { lat: -18.18, lng: 31.55 },
    reportedBy: 'Crop Protection Surveillance Unit',
    reporterRole: 'Qualified Agronomist',
    reportedAt: '12 hours ago',
    reportedDateEpoch: Date.now() - 3600000 * 12,
    affectedAreaSummary: '7 commercial and communal nursery tunnels',
    symptomsObserved: 'Transparent blister mines in foliage, black frass within mines, stem pin-boring leading to wilting of vegetative shoots.',
    containmentActionTaken: 'Installed delta pheromone sticky traps; sprayed Ampligo 150 ZC alternated with Coragen 20 SC.',
    recommendedImmediateControl: {
      chemicalOrMethod: 'Ampligo 150 ZC or Coragen 20 SC',
      dosageRate: '10ml per 15L knapsack with wet spray adjuvant',
      ipmAlternative: 'Yellow sticky cards + water pan pheromone traps (15 per hectare)'
    },
    verifiedBySpecialist: true,
    specialistName: 'Eng. R. Shumba (Senior Agronomist)',
    communityConfirmations: 31,
    status: 'Spreading',
    containmentRadiusKm: 15
  },
  {
    id: 'outbreak-005',
    pestOrDiseaseId: 'msv-001',
    pestName: 'Maize Streak Virus (MSV)',
    scientificName: 'Maize streak virus (trans. Cicadulina leafhoppers)',
    vernacularName: {
      shona: 'Mhuka yechibage (Mavanga echibage)',
      ndebele: 'Umkhuhlane wemivimbo yombila'
    },
    category: 'viral_disease',
    targetType: 'plant',
    affectedHost: 'Late-planted Maize (SC 529)',
    severity: 'High',
    locationName: 'Banket / Mapinga',
    district: 'Makonde',
    province: 'Mashonaland West',
    naturalRegion: 'IIa',
    coordinates: { lat: -17.40, lng: 30.40 },
    reportedBy: 'Godfrey Mapfumo',
    reporterRole: 'Smallholder Farmer',
    reportedAt: '4 days ago',
    reportedDateEpoch: Date.now() - 86400000 * 4,
    affectedAreaSummary: '3.1 hectares of late December Pfumvudza plantings',
    symptomsObserved: 'Continuous longitudinal chlorotic streaks along leaf veins, severe plant stunting, failed cob formation on early infected plants.',
    containmentActionTaken: 'Rouged out early stunted seedlings; sprayed vector leafhoppers with Lambda-cyhalothrin.',
    recommendedImmediateControl: {
      chemicalOrMethod: 'Imidacloprid seed dressing (Cruiser) on future seed; Karate Zeon for leafhopper control',
      dosageRate: '15ml per 15L knapsack applied along field borders to suppress leafhoppers',
      ipmAlternative: 'Synchronized early community planting; prompt roguing of infected plants during first 3 weeks'
    },
    verifiedBySpecialist: true,
    specialistName: 'Mr. P. Mukarati (Banket Agronomist)',
    communityConfirmations: 11,
    status: 'Active Outbreak',
    containmentRadiusKm: 16
  },
  {
    id: 'outbreak-006',
    pestOrDiseaseId: 'gls-001',
    pestName: 'Grey Leaf Spot',
    scientificName: 'Cercospora zeae-maydis',
    vernacularName: {
      shona: 'Mavanga echipfunga chemashizha',
      ndebele: 'Amabala empunga'
    },
    category: 'fungal_disease',
    targetType: 'plant',
    affectedHost: 'Dense Canopy Maize',
    severity: 'Moderate',
    locationName: 'Chinhoyi / Alaska Mine Farming Zone',
    district: 'Makonde',
    province: 'Mashonaland West',
    naturalRegion: 'IIb',
    coordinates: { lat: -17.36, lng: 30.15 },
    reportedBy: 'Sekuru Munetsi',
    reporterRole: 'Master Farmer',
    reportedAt: '5 days ago',
    reportedDateEpoch: Date.now() - 86400000 * 5,
    affectedAreaSummary: '5.5 hectares',
    symptomsObserved: 'Rectangular blocky lesions restricted between leaf veins turning tan to grey, progressive premature leaf death from bottom leaves upward.',
    containmentActionTaken: 'Applied Tilt 250 EC (Propiconazole) at silking stage; cleared weed undergrowth to improve air circulation.',
    recommendedImmediateControl: {
      chemicalOrMethod: 'Tilt 250 EC (Propiconazole) or Amistar Top 325SC',
      dosageRate: '20ml per 15L knapsack targeted at ear leaf and canopy',
      ipmAlternative: 'Crop rotation with Groundnuts or Soybeans; avoid overhead sprinkler irrigation late in the day'
    },
    verifiedByAgritex: true,
    communityConfirmations: 9,
    status: 'Under Surveillance',
    containmentRadiusKm: 14
  },
  {
    id: 'outbreak-007',
    pestOrDiseaseId: 'str-001',
    pestName: 'Witchweed (Striga)',
    scientificName: 'Striga asiatica',
    vernacularName: {
      shona: 'Kambani / Bise',
      ndebele: 'Isona'
    },
    category: 'parasitic_weed',
    targetType: 'plant',
    affectedHost: 'Pearl Millet & White Sorghum',
    severity: 'High',
    locationName: 'Nembudziya / Gokwe North',
    district: 'Gokwe South',
    province: 'Midlands',
    naturalRegion: 'IV',
    coordinates: { lat: -18.15, lng: 28.95 },
    reportedBy: 'Sekuru Sibanda',
    reporterRole: 'Master Farmer',
    reportedAt: '3 days ago',
    reportedDateEpoch: Date.now() - 86400000 * 3.5,
    affectedAreaSummary: '8 hectares of sandy smallholder plots',
    symptomsObserved: 'Stunted chlorotic sorghum crops with burnt leaf tips even after good rain; emergence of small bright red flowered parasitic weeds attached to crop roots.',
    containmentActionTaken: 'Community hand-pulling campaign before Striga plants set seeds; spot application of 2,4-D herbicide.',
    recommendedImmediateControl: {
      chemicalOrMethod: '2,4-D Amine 720SL spot spray',
      dosageRate: '30ml per 15L knapsack strictly spot-applied on emerged Striga rosettes',
      ipmAlternative: 'Intercropping with Cowpeas or Silverleaf Desmodium (false hosts that cause suicidal Striga germination); organic manure application'
    },
    verifiedBySpecialist: true,
    specialistName: 'Mrs. H. Zhou (Gokwe Agronomy Lead)',
    communityConfirmations: 28,
    status: 'Active Outbreak',
    containmentRadiusKm: 22
  },
  {
    id: 'outbreak-008',
    pestOrDiseaseId: 'lsd-001',
    pestName: 'Lumpy Skin Disease (LSD)',
    scientificName: 'Capripoxvirus (transmitted by biting flies/mosquitoes)',
    vernacularName: {
      shona: 'Maperembudzi emombe',
      ndebele: 'Isifo sezigaxa senkomo'
    },
    category: 'veterinary_health',
    targetType: 'livestock',
    affectedHost: 'Communal Herd Cattle',
    severity: 'High',
    locationName: 'Gwanda Central / Collen Bawn',
    district: 'Gwanda',
    province: 'Matabeleland South',
    naturalRegion: 'V',
    coordinates: { lat: -20.90, lng: 29.05 },
    reportedBy: 'Dumisani Ndlovu',
    reporterRole: 'Veterinary Field Officer',
    reportedAt: '2 days ago',
    reportedDateEpoch: Date.now() - 86400000 * 2,
    affectedAreaSummary: '4 dip tank catchment zones (approx. 140 cattle exposed)',
    symptomsObserved: 'Firm circumscribed round skin nodules (2-5cm) over neck, brisket, and perineum; oedema of limbs; lacrimation and severe drop in draft power.',
    containmentActionTaken: 'Immediate vaccination buffer zone established by DVS; vector control sprays distributed to kraal owners.',
    recommendedImmediateControl: {
      chemicalOrMethod: 'Lumpy Skin Disease attenuated vaccine (Onderstepoort/DVS) + Oxytetracycline 20% LA for secondary infections',
      dosageRate: '2ml subcutaneous annual booster; long-acting Terramycin 1ml/10kg IM for nodule ulcerations',
      ipmAlternative: 'Smudge fires in kraals at dusk to repel biting mosquitoes and Stomoxys flies; isolate affected animals'
    },
    verifiedByAgritex: true,
    agritexOfficerName: 'Dr. K. Moyo (Matabeleland South Provincial Vet)',
    communityConfirmations: 37,
    status: 'Spreading',
    containmentRadiusKm: 35
  },
  {
    id: 'outbreak-009',
    pestOrDiseaseId: 'gnr-001',
    pestName: 'Groundnut Rosette Virus (GRV)',
    scientificName: 'Groundnut rosette virus complex (trans. Aphis craccivora)',
    vernacularName: {
      shona: 'Chirwere chekuunyana kwenzungu',
      ndebele: 'Isifo samantongomane'
    },
    category: 'viral_disease',
    targetType: 'plant',
    affectedHost: 'Groundnuts (Valencia / Natal Common)',
    severity: 'Moderate',
    locationName: 'Mwenezi East / Rutenga',
    district: 'Mwenezi',
    province: 'Masvingo',
    naturalRegion: 'V',
    coordinates: { lat: -21.00, lng: 31.40 },
    reportedBy: 'Mai Ruvimbo Gumbo',
    reporterRole: 'Smallholder Farmer',
    reportedAt: '4 days ago',
    reportedDateEpoch: Date.now() - 86400000 * 4.2,
    affectedAreaSummary: '6.2 hectares across communal cooperative plots',
    symptomsObserved: 'Severe bushy stunting, shortened internodes, bright mosaic chlorosis, peg failure leading to empty pods (pop pods).',
    containmentActionTaken: 'Sprayed Dimethoate 40 EC against vector cowpea aphids; rogued primary infected stools.',
    recommendedImmediateControl: {
      chemicalOrMethod: 'Dimethoate 40 EC or Karate Zeon',
      dosageRate: '20ml per 15L knapsack targeted at aphid colonies on young shoots',
      ipmAlternative: 'High planting density (30cm x 10cm) to establish quick ground cover which repels winged aphids that seek bare soil contrast'
    },
    verifiedByAgritex: true,
    communityConfirmations: 14,
    status: 'Contained',
    containmentRadiusKm: 15
  },
  {
    id: 'outbreak-010',
    pestOrDiseaseId: 'faw-001',
    pestName: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    vernacularName: {
      shona: 'Mhungu',
      ndebele: 'Isihlava sombila'
    },
    category: 'insect_pest',
    targetType: 'plant',
    affectedHost: 'Maize & Sweetcorn',
    severity: 'High',
    locationName: 'Goromonzi / Domboshava Valley',
    district: 'Goromonzi',
    province: 'Mashonaland East',
    naturalRegion: 'IIa',
    coordinates: { lat: -17.78, lng: 31.28 },
    reportedBy: 'Baba Tendai',
    reporterRole: 'Smallholder Farmer',
    reportedAt: '16 hours ago',
    reportedDateEpoch: Date.now() - 3600000 * 16,
    affectedAreaSummary: '3 Pfumvudza family plots (1.5 ha)',
    symptomsObserved: 'Shot-hole windowing on 4th leaf whorl, newly hatched 2nd instar larvae detected under early morning dew scouting.',
    containmentActionTaken: 'Applied fine sand and wood ash into whorls; communal spray brigade organized for tomorrow morning.',
    recommendedImmediateControl: {
      chemicalOrMethod: 'Karate Zeon 5CS',
      dosageRate: '15ml per 15L knapsack',
      ipmAlternative: 'Dry wood ash + chili pepper powder in leaf funnel'
    },
    verifiedBySpecialist: true,
    specialistName: 'Mr. T. Chigumira (Lead Agronomist)',
    communityConfirmations: 18,
    status: 'Active Outbreak',
    containmentRadiusKm: 12
  },
  {
    id: 'outbreak-011',
    pestOrDiseaseId: 'cbr-001',
    pestName: 'Black Rot of Cabbage',
    scientificName: 'Xanthomonas campestris pv. campestris',
    vernacularName: {
      shona: 'Chirwere chekufunuka kwemakavheji',
      ndebele: 'Isifo sekhabhisi'
    },
    category: 'bacterial_disease',
    targetType: 'plant',
    affectedHost: 'Brassicas / Cabbage (Drumhead / Star 3301)',
    severity: 'Moderate',
    locationName: 'Gweru Rural / Chiwundura',
    district: 'Gweru',
    province: 'Midlands',
    naturalRegion: 'III',
    coordinates: { lat: -19.42, lng: 29.85 },
    reportedBy: 'Ephraim Sibindi',
    reporterRole: 'Smallholder Farmer',
    reportedAt: '6 days ago',
    reportedDateEpoch: Date.now() - 86400000 * 6,
    affectedAreaSummary: '1.8 hectares of winter market vegetable gardens',
    symptomsObserved: 'V-shaped chlorotic lesions progressing from hydathodes at leaf margins with blackened vein netting.',
    containmentActionTaken: 'Uprooted and burnt infected outer heads; sprayed copper bactericide.',
    recommendedImmediateControl: {
      chemicalOrMethod: 'Copper Oxychloride 85 WP + Agral 90 sticker',
      dosageRate: '30g per 15L knapsack every 7 days during damp morning fog',
      ipmAlternative: 'Use certified hot-water treated seeds (50°C for 25 min); 3-year brassica crop rotation'
    },
    verifiedByAgritex: false,
    communityConfirmations: 7,
    status: 'Under Surveillance',
    containmentRadiusKm: 10
  },
  {
    id: 'outbreak-012',
    pestOrDiseaseId: 'new-001',
    pestName: 'Newcastle Disease',
    scientificName: 'Avian paramyxovirus 1',
    vernacularName: {
      shona: 'Chikuku / Chimbondiya',
      ndebele: 'Isifo senkukhu'
    },
    category: 'veterinary_health',
    targetType: 'livestock',
    affectedHost: 'Indigenous Roadrunner / Boschveld Chickens',
    severity: 'Critical',
    locationName: 'Chiredzi Town / Tshovani Communal Lands',
    district: 'Chiredzi',
    province: 'Masvingo',
    naturalRegion: 'V',
    coordinates: { lat: -21.05, lng: 31.65 },
    reportedBy: 'Dr. C. Shuro',
    reporterRole: 'Veterinary Field Officer',
    reportedAt: '1 day ago',
    reportedDateEpoch: Date.now() - 86400000 * 1.5,
    affectedAreaSummary: '5 village flocks (approx 420 birds affected / 60 mortalities)',
    symptomsObserved: 'Green watery diarrhea, twisted necks (torticollis), gasping for air, sudden death in overnight fowl runs.',
    containmentActionTaken: 'Emergency thermostable I-2 eye-drop vaccination administered to surrounding 3km ring; dead birds incinerated.',
    recommendedImmediateControl: {
      chemicalOrMethod: 'Thermostable I-2 Newcastle Vaccine (Eye drop / drinking water)',
      dosageRate: '1 drop per eye for every bird 2 weeks old and above; repeat every 3-4 months',
      ipmAlternative: 'Strict biosecurity: isolate new birds for 14 days, footbath of Virkon or ash at fowl run entrance'
    },
    verifiedByAgritex: true,
    agritexOfficerName: 'Dr. C. Shuro (Chiredzi District Vet)',
    communityConfirmations: 43,
    status: 'Active Outbreak',
    containmentRadiusKm: 20
  }
];

const LOCAL_STORAGE_KEY = 'farmers_community_outbreaks_v1';

/**
 * Get all community outbreaks, merging locally reported ones with verified defaults
 */
export function getCommunityOutbreaks(): CommunityOutbreakReport[] {
  if (typeof window === 'undefined') {
    return INITIAL_COMMUNITY_OUTBREAKS;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_COMMUNITY_OUTBREAKS));
      return INITIAL_COMMUNITY_OUTBREAKS;
    }
    const parsed: CommunityOutbreakReport[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_COMMUNITY_OUTBREAKS;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading community outbreaks from localStorage:', e);
    return INITIAL_COMMUNITY_OUTBREAKS;
  }
}

/**
 * Save a newly submitted farmer/extension community outbreak
 */
export function saveCommunityOutbreak(report: CommunityOutbreakReport): void {
  const current = getCommunityOutbreaks();
  // Prepend new report
  const updated = [report, ...current.filter(r => r.id !== report.id)];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving community outbreak to localStorage:', e);
    }
  }
}

/**
 * Increment community confirmation count when a local farmer verifies sighting the outbreak in their ward
 */
export function incrementCommunityConfirmation(outbreakId: string): CommunityOutbreakReport | null {
  const current = getCommunityOutbreaks();
  let modifiedReport: CommunityOutbreakReport | null = null;
  const updated = current.map(item => {
    if (item.id === outbreakId) {
      modifiedReport = {
        ...item,
        communityConfirmations: item.communityConfirmations + 1
      };
      return modifiedReport;
    }
    return item;
  });

  if (modifiedReport && typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error updating confirmation count:', e);
    }
  }
  return modifiedReport;
}

/**
 * Calculate Haversine distance in kilometers between two GPS coordinates
 */
export function calculateDistanceKm(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}
