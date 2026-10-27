export interface AppUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'developer' | 'farmer' | 'agritex_officer' | 'commercial_buyer';
  title?: string;
  badgeNumber?: string;
  location: string;
  farmingType: string;
  createdAt: string;
}

export interface DiagnosticHistoryRecord {
  id: string;
  timestamp: string;
  epoch: number;
  cropOrAnimal: string;
  targetType: 'plant' | 'livestock';
  location: string;
  notes: string;
  diagnosis: string;
  confidenceScore: number;
  severity: 'High' | 'Moderate' | 'Low';
  remedyProduct?: string;
  dosageInstructions?: string;
  ipmAlternative?: string;
  diagnosedBy: string;
  verifiedStatus: 'AI Verified' | 'Agritex Inspected' | 'Pending Field Scouting';
}

export const SEED_APP_USERS: AppUserRecord[] = [
  {
    id: 'dev-01',
    name: 'Thulani Tanaka',
    email: 'thulanitanaka144@gmail.com',
    passwordHash: 'developer2026',
    role: 'developer',
    title: 'Lead AgTech Systems Architect & Admin',
    badgeNumber: 'DEV-SYSTEMS-01',
    location: 'Harare Agronomy Center',
    farmingType: 'National Agro-Ecological Systems & Meta Hub',
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'agritex-01',
    name: 'Mai Tariro Marange',
    email: 'officer@agritex.gov.zw',
    passwordHash: 'agritex2026',
    role: 'agritex_officer',
    title: 'Senior Agritex Extension Officer & Plant Pathology Lead',
    badgeNumber: 'AGR-ZW-9042',
    location: 'Mashonaland East / Mutoko Hub',
    farmingType: 'Field Crop Inspection & Emergency Containment',
    createdAt: '2026-02-01T09:30:00.000Z'
  },
  {
    id: 'farmer-01',
    name: 'Sekuru Tendai Moyo',
    email: 'farmer@zimfarmers.org',
    passwordHash: 'farmer2026',
    role: 'farmer',
    title: 'Pfumvudza Master Farmer Lead',
    badgeNumber: 'ZCFU-FARMER-342',
    location: 'Goromonzi (Region IIa)',
    farmingType: 'Maize, Groundnuts & Horticulture',
    createdAt: '2026-02-10T11:00:00.000Z'
  },
  {
    id: 'buyer-01',
    name: 'Farai Chitepo',
    email: 'buyer@gmb.co.zw',
    passwordHash: 'buyer2026',
    role: 'commercial_buyer',
    title: 'Commercial Grain & Horticulture Buyer',
    badgeNumber: 'GMB-TRADER-512',
    location: 'Harare Aspindale Grain Hub',
    farmingType: 'Bulk Grain Offtaking & Mbare Musika Wholesale',
    createdAt: '2026-02-15T14:15:00.000Z'
  }
];

export const SEED_DIAGNOSTICS: DiagnosticHistoryRecord[] = [
  {
    id: 'diag-hist-001',
    timestamp: 'Today at 08:30 AM',
    epoch: Date.now() - 3600000 * 2,
    cropOrAnimal: 'Maize (SC 719)',
    targetType: 'plant',
    location: 'Goromonzi Ward 4 (Region IIa)',
    notes: 'Window pane leaf feeding and frass visible in maize whorl during morning scouting',
    diagnosis: 'Fall Armyworm (Spodoptera frugiperda) / Mhungu',
    confidenceScore: 94,
    severity: 'High',
    remedyProduct: 'Agricura Karate Zeon 5CS (Lambda-cyhalothrin)',
    dosageInstructions: '20ml per 15L knapsack directed directly into whorls late afternoon',
    ipmAlternative: 'Wood ash and fine river sand (1:1 ratio) applied into plant whorl at dawn',
    diagnosedBy: 'Sekuru Tendai Moyo (Master Farmer)',
    verifiedStatus: 'Agritex Inspected'
  },
  {
    id: 'diag-hist-002',
    timestamp: 'Yesterday at 04:15 PM',
    epoch: Date.now() - 3600000 * 26,
    cropOrAnimal: 'Tomatoes (Heinz 1370)',
    targetType: 'plant',
    location: 'Mutoko Riverbed Plots (Region IIb)',
    notes: 'Water-soaked irregular black blotches with white fungal down on leaf margins',
    diagnosis: 'Late Blight (Phytophthora infestans) / Bakiteriya yemadomasi',
    confidenceScore: 91,
    severity: 'High',
    remedyProduct: 'Windmill Copper Oxychloride 85 WP / Ridomil Gold MZ 68WG',
    dosageInstructions: '35g per 15L knapsack repeated every 5-7 days in misty weather',
    ipmAlternative: 'Prune lower leaves 20cm above soil line and mulch heavily with dry grass',
    diagnosedBy: 'Mai Tariro Marange (Agritex Officer)',
    verifiedStatus: 'Agritex Inspected'
  },
  {
    id: 'diag-hist-003',
    timestamp: '3 days ago',
    epoch: Date.now() - 3600000 * 72,
    cropOrAnimal: 'Indigenous Mashona Cattle',
    targetType: 'livestock',
    location: 'Wedza Communal Dip Tank Zone',
    notes: 'Brown ear ticks clustering in deep ear folds with swollen prescapular lymph nodes',
    diagnosis: 'Theileriosis (January Disease) & Brown Ear Tick Infestation',
    confidenceScore: 89,
    severity: 'High',
    remedyProduct: 'Decatix Cattle Dip / Butalex (Buparvaquone)',
    dosageInstructions: 'Weekly compulsory dipping; subcutaneous Butalex under veterinary supervision',
    ipmAlternative: 'Tick grease (petroleum jelly + sulfur) applied by hand in ear canal folds',
    diagnosedBy: 'District Veterinary Extension Team',
    verifiedStatus: 'Agritex Inspected'
  }
];
