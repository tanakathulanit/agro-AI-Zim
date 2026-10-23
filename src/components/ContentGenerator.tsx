import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Share2,
  MessageCircle,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  CloudRain,
  HelpCircle,
  Layers,
  ArrowRight,
  Send,
  Zap,
  Globe
} from 'lucide-react';
import { ALL_EXPANDED_CROPS, CropRecommendation } from '../data/allCropsDatabase';
import { WHATSAPP_COMMUNITY_GROUPS, WhatsAppCommunityGroup } from '../data/farmersDictionaryData';
import { ZimbabweLocation } from '../data/zimbabweLocations';

export interface LivestockData {
  id: string;
  name: string;
  shonaName: string;
  ndebeleName: string;
  icon: string;
  category: 'Cattle' | 'Goats' | 'Poultry' | 'Pigs' | 'Sheep';
  keyDiseases: string[];
  keyAdvice: string;
  shonaAdvice: string;
  ndebeleAdvice: string;
  marketPriceRange: string;
  hashtags: string[];
}

export interface MarketInsightData {
  id: string;
  marketName: string;
  location: string;
  icon: string;
  topCommodities: { name: string; price: string; unit: string; trend: 'up' | 'down' | 'stable' }[];
  marketAdvisory: string;
  shonaAdvisory: string;
  ndebeleAdvisory: string;
  hashtags: string[];
}

export const LIVESTOCK_DATABASE: LivestockData[] = [
  {
    id: 'beef-cattle',
    name: 'Beef Cattle (Mashona / Brahman / Steers)',
    shonaName: 'Mombe dzenyama (Mashona / Brahman)',
    ndebeleName: 'Inkomo zenyama (Amankomo)',
    icon: '🐂',
    category: 'Cattle',
    keyDiseases: ['January Disease (Theileriosis)', 'Lumpy Skin Disease', 'Blackleg / Chigodhi'],
    keyAdvice: 'Observe strict 5-5-4 dipping interval during rains. Apply tick grease in ears and under tail switch. Vaccinate with Blanthrax before rainy season.',
    shonaAdvice: 'Dhidhisai mombe mazuva mashanu-mashanu-mana (5-5-4) munguva yemvura kudzivirira Theileriosis. Zora girisi rekwekwe munzeve nemumuswe.',
    ndebeleAdvice: 'Cwilani inkomo nsukuzonke ngohlelo lwe 5-5-4 ngesikhathi sezulu ukuze zivikeleke emikhuhlaneni yamakhizane. Gcobani amafutha ezindlebeni.',
    marketPriceRange: 'Slaughter Grade C $3.10/kg CDW • Feeder Steers $1.45/kg live • Weaners $1.60/kg live',
    hashtags: ['#ZimbabweCattle', '#MashonaBreed', '#JanuaryDisease', '#AgritexVeterinary', '#BeefProduction']
  },
  {
    id: 'goats',
    name: 'Boer & Indigenous Goats',
    shonaName: 'Mbudzi dzeChivanhu neBoer',
    ndebeleName: 'Imbuzi zesiNdebele le-Boer',
    icon: '🐐',
    category: 'Goats',
    keyDiseases: ['Pulpy Kidney (Enterotoxaemia)', 'Heartwater / Chigwadara', 'Internal Helminths (Tapeworms)'],
    keyAdvice: 'Vaccinate kids against Pulpy Kidney at 6 weeks. Provide raised slatted housing to prevent hoof rot and pneumonia during wet months.',
    shonaAdvice: 'Baya mbudzi mushonga wePulpy Kidney pamasvondo matanhatu. Vakai matanga akasimudzwa ane mapango kudzivirira manyoka nenyere.',
    ndebeleAdvice: 'Hlabani imbuzi umuthi wePulpy Kidney ngemva kwamaviki ayisithupha. Yakhelani izibaya eziphakamileyo ukuze zivikeleke emanyathelweni.',
    marketPriceRange: 'Live Adult Goat: $35.00 - $45.00 • Boer Breeding Buck: $120.00 - $250.00',
    hashtags: ['#GoatFarmingZw', '#BoerGoats', '#SmallRuminants', '#AgriProfitsZw', '#Pfumvudza']
  },
  {
    id: 'broilers-roadrunners',
    name: 'Broilers & Indigenous Roadrunners',
    shonaName: 'Huku dzeBroiler neChivanhu (Roadrunners)',
    ndebeleName: 'Inkukhu ze-Broiler lezesintu',
    icon: '🐓',
    category: 'Poultry',
    keyDiseases: ['Newcastle Disease / Chitopa', 'Gumboro (IBD)', 'Fowl Pox / Chibhokisi'],
    keyAdvice: 'Vaccinate Newcastle Eye-Drop on Day 1 and Day 18. Keep brooding chamber at 32-35°C for first 7 days with adequate ventilation.',
    shonaAdvice: 'Donsai mushonga weNewcastle muziso pazuva rekutanga nerechi18. Dzimai mhepo inotonhora pwere dzichangotanga kurimwa.',
    ndebeleAdvice: 'Fakani umuthi we-Newcastle emehlweni osukwini lokuqala lolwe-18. Fudumezani amatshiyane kusukela osukwini lokuqala.',
    marketPriceRange: 'Live Roadrunner: $6.00 - $8.00 • Dressed Broiler (1.8kg): $4.00 - $5.50 • Crate of Eggs: $3.80 - $4.50',
    hashtags: ['#PoultryZimbabwe', '#RoadrunnersZw', '#Broilers', '#ChickenFarming', '#AgriBusiness']
  },
  {
    id: 'dairy-cattle',
    name: 'Dairy Cattle (Friesian / Jersey / Crosses)',
    shonaName: 'Mombe dzeMukaka',
    ndebeleName: 'Inkomo Zochago',
    icon: '🐄',
    category: 'Cattle',
    keyDiseases: ['Mastitis / Chirwere cheChikwere', 'Milk Fever (Hypocalcaemia)', 'Foot Rot'],
    keyAdvice: 'Practice pre- and post-milking iodine teat dipping. Ensure balanced silage and high-protein dairy meal (minimum 16% CP) for 15L+ daily production.',
    shonaAdvice: 'Geza minyatso ne-iodine mushure mekukama kudzivirira mastitis. Pindai zvokudya zvine protein yakawanda (dairy meal ne silage).',
    ndebeleAdvice: 'Sesanani amabele ngenkathi yokusenga lomuthi we-iodine. Phani inkomo ukudla okulamandla e-silage lomgubo wochago.',
    marketPriceRange: 'Raw Farmgate Milk: $0.55 - $0.65 / Litre • Lactating Cross Cow: $750 - $1,100',
    hashtags: ['#DairyFarmingZw', '#MilkProduction', '#MastitisPrevention', '#SilageFeeding', '#ZimDairy']
  },
  {
    id: 'piggery',
    name: 'Piggery & Commercial Swine',
    shonaName: 'Nguruve dzekutengesa',
    ndebeleName: 'Ingulube Zokuthengisa',
    icon: '🐖',
    category: 'Pigs',
    keyDiseases: ['African Swine Fever (ASF)', 'Piglet Anemia', 'Erysipelas'],
    keyAdvice: 'Biosecurity is the only defense against ASF: zero swill feeding, perimeter fencing, disinfection footbaths. Administer 2ml Iron injection on Day 3.',
    shonaAdvice: 'Regai kudyisa zvokudya zvakasara (swill) kudzivirira African Swine Fever. Baya tsono ye iron pazuva rechitatu mushure mekuzvarwa.',
    ndebeleAdvice: 'Lingaphisi ingulube ukudla okusileyo (swill) ukuvikela i-African Swine Fever. Hlabani amawundlu i-iron ngosuku lwesithathu.',
    marketPriceRange: 'Porkers (60-70kg live): $2.20 - $2.40/kg live • Weaners: $25 - $35 each',
    hashtags: ['#PiggeryZimbabwe', '#PorkProduction', '#AfricanSwineFever', '#PigBiosecurity', '#LivestockZw']
  }
];

export const MARKET_INSIGHTS_DATABASE: MarketInsightData[] = [
  {
    id: 'mbare-musika-wholesale',
    marketName: 'Mbare Musika Wholesale Market (Harare)',
    location: 'Harare • Mashonaland Hub',
    icon: '🏬',
    topCommodities: [
      { name: 'White Maize (50kg bag)', price: '$14.50 (ZiG 413)', unit: '50kg', trend: 'up' },
      { name: 'Tomatoes (30kg Wooden Crate)', price: '$18.00 (ZiG 513)', unit: '30kg Crate', trend: 'down' },
      { name: 'Shelled Groundnuts (20L Tin)', price: '$16.00 (ZiG 456)', unit: '20L Tin', trend: 'up' },
      { name: 'Onions (10kg Pocket)', price: '$7.50 (ZiG 214)', unit: 'Pocket', trend: 'stable' }
    ],
    marketAdvisory: 'Tomato influx from Mutoko & Uzumba lowering prices; grade into Grade 1 Roma crates for $4/crate premium. Maize grain demand very high.',
    shonaAdvisory: 'Madomasi akawanda ari kubva Mutoko; sarudzai akaibva zvakanaka muGrade 1 kuti muwane mari yakawanda. Chibage chiri kutsvagwa zvikuru.',
    ndebeleAdvisory: 'Amatamatisi anengi avela eMutoko enza intengo yehle; hlelanani nge-Grade 1. Umumbu udingeka kakhulu emakethe lamuhla.',
    hashtags: ['#MbareMusika', '#HarareMarkets', '#ZimMarketPrices', '#HorticultureZw', '#GrainPrices']
  },
  {
    id: 'renkini-bulawayo',
    marketName: 'Renkini / Malaleni Market (Bulawayo)',
    location: 'Bulawayo • Matabeleland Hub',
    icon: '🚛',
    topCommodities: [
      { name: 'Pearl Millet / Inyawuthi (50kg)', price: '$18.50 (ZiG 527)', unit: '50kg', trend: 'up' },
      { name: 'Roundnuts / Nyimo / Indlubu (20L)', price: '$19.00 (ZiG 541)', unit: '20L Bucket', trend: 'up' },
      { name: 'Sorghum / Amabele (50kg)', price: '$17.00 (ZiG 484)', unit: '50kg', trend: 'stable' },
      { name: 'Live Indigenous Goat', price: '$38.00 (ZiG 1,083)', unit: 'Per Head', trend: 'up' }
    ],
    marketAdvisory: 'Small grains trading at 25% premium above Harare due to strong traditional brew & drought feed restocking demand.',
    shonaAdvisory: 'Zvirimwa zvetsanga zvakaita semhunga nenyimo zviri kutengwa nemutengo wepamusoro kuBulawayo kupfuura kuHarare.',
    ndebeleAdvisory: 'Inyawuthi lendlubu ziyathengwa ngentengo ephezulu eBulawayo ngoba abantu bedinga ukudla kwesintu lemfuyo.',
    hashtags: ['#BulawayoRenkini', '#SmallGrains', '#Inyawuthi', '#MatabelelandFarming', '#Nyimo']
  },
  {
    id: 'cc-sales-cattle-auction',
    marketName: 'CC Sales Livestock Auction (Mount Hampden / Gweru)',
    location: 'Mount Hampden / Gweru / Bulawayo',
    icon: '⚖️',
    topCommodities: [
      { name: 'Feeder Steers (280-320kg)', price: '$1.45/kg liveweight', unit: 'per kg', trend: 'up' },
      { name: 'Weaner Calves (180-220kg)', price: '$1.60/kg liveweight', unit: 'per kg', trend: 'up' },
      { name: 'Slaughter Oxen (Commercial)', price: '$1.25/kg liveweight', unit: 'per kg', trend: 'stable' },
      { name: 'Breeding Mashona Heifers', price: '$480.00 / head', unit: 'head', trend: 'up' }
    ],
    marketAdvisory: 'Commercial feedlots competing aggressively for 300kg steers before winter feed costs surge. Weigh cattle before sale to guarantee returns.',
    shonaAdvisory: 'Mafidhloti ari kutsvaga mabhuru ekukodza; pimirai mombe dzenyu pa sikero musati matengesa kuti musadyirwe mari.',
    ndebeleAdvisory: 'Abalimi bamabhizimusi badinga inkabi zokondla masinyane. Kalani inkomo zenu esikelweni ngaphambi kokuthengisa.',
    hashtags: ['#CCSalesZw', '#CattleAuction', '#FeederSteers', '#LivestockPrices', '#MountHampden']
  },
  {
    id: 'gmb-statutory-floor',
    marketName: 'Grain Marketing Board (GMB) Statutory Floors',
    location: 'National Depots (Harare, Concession, Norton, Gweru, Bulawayo)',
    icon: '🏛️',
    topCommodities: [
      { name: 'Grade A Maize Grain', price: '$335.00 / Metric Tonne', unit: 'Tonne (GMB Floor)', trend: 'stable' },
      { name: 'Traditional Small Grains', price: '$335.00 / Metric Tonne', unit: 'Tonne', trend: 'stable' },
      { name: 'Soya Beans (Industrial)', price: '$580.00 / Metric Tonne', unit: 'Tonne', trend: 'up' },
      { name: 'Sunflower Seed', price: '$415.00 / Metric Tonne', unit: 'Tonne', trend: 'up' }
    ],
    marketAdvisory: 'Moisture content must be below 12.5% for maize delivery acceptance. Early deliverers receive prioritized statutory payment allocations.',
    shonaAdvisory: 'Hunyoro hwechibage hunofanira kunge huri pasi pe 12.5% kuti GMB igamuchire. Womesai chibage zvakanaka pamatsva.',
    ndebeleAdvisory: 'Umumbu kumele wome ube phansi kwe 12.5% ye-moisture ukuze i-GMB iwuthathe. Womisani umumbu elangeni ngaphambi kokuhambisa.',
    hashtags: ['#GMBZimbabwe', '#GrainMarketingBoard', '#MaizeFloorPrice', '#SoyaBeansZw', '#PfumvudzaDeliveries']
  }
];

interface ContentGeneratorProps {
  currentLocation: ZimbabweLocation;
  targetPageId?: string;
  onApplyPostToStudio: (caption: string, title?: string) => void;
  onOpenWhatsAppModal?: (topic?: string, query?: string) => void;
  onDirectPublishToPage: (caption: string, title?: string) => void;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  currentLocation,
  targetPageId = '1312589948614022',
  onApplyPostToStudio,
  onOpenWhatsAppModal,
  onDirectPublishToPage
}) => {
  // Category Mode
  const [selectedCategory, setSelectedCategory] = useState<'crop' | 'livestock' | 'market'>('crop');

  // Selected Items
  const [selectedCropId, setSelectedCropId] = useState<string>(ALL_EXPANDED_CROPS[0]?.cropId || 'maize_early');
  const [selectedLivestockId, setSelectedLivestockId] = useState<string>(LIVESTOCK_DATABASE[0].id);
  const [selectedMarketId, setSelectedMarketId] = useState<string>(MARKET_INSIGHTS_DATABASE[0].id);

  // Content Angle / Tone
  const [postAngle, setPostAngle] = useState<'advisory' | 'outbreak' | 'market' | 'poll' | 'weather'>('advisory');

  // Output Language
  const [languageMode, setLanguageMode] = useState<'trilingual' | 'en' | 'sn' | 'nd'>('trilingual');

  // Selected WhatsApp Group for CTA
  const [selectedWhatsAppGroup, setSelectedWhatsAppGroup] = useState<WhatsAppCommunityGroup>(
    WHATSAPP_COMMUNITY_GROUPS[0]
  );

  // Copy state
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [customizedText, setCustomizedText] = useState<string | null>(null);

  // Resolving selected entities
  const selectedCrop = useMemo(() => {
    return ALL_EXPANDED_CROPS.find((c) => c.cropId === selectedCropId) || ALL_EXPANDED_CROPS[0];
  }, [selectedCropId]);

  const selectedLivestock = useMemo(() => {
    return LIVESTOCK_DATABASE.find((l) => l.id === selectedLivestockId) || LIVESTOCK_DATABASE[0];
  }, [selectedLivestockId]);

  const selectedMarket = useMemo(() => {
    return MARKET_INSIGHTS_DATABASE.find((m) => m.id === selectedMarketId) || MARKET_INSIGHTS_DATABASE[0];
  }, [selectedMarketId]);

  // Generate the core structured content based on current selections
  const generatedContent = useMemo(() => {
    const appUrl = 'https://ais-pre-iirwvujxhjhismccovw3wo-535649001550.europe-west2.run.app';
    const districtInfo = `${currentLocation.name} (Natural Region ${currentLocation.naturalRegion})`;

    let headline = '';
    let bodyEn = '';
    let bodySn = '';
    let bodyNd = '';
    let hashtags: string[] = [];

    if (selectedCategory === 'crop') {
      headline = `🌾 ${selectedCrop.name.toUpperCase()} FIELD DIRECTIVE • ${currentLocation.name.toUpperCase()}`;
      hashtags = [
        `#${selectedCrop.name.replace(/[^a-zA-Z0-9]/g, '')}`,
        '#Pfumvudza',
        '#ZimbabweFarming',
        '#AgritexDirectives',
        `#Region${currentLocation.naturalRegion}`,
        '#FarmersDictionaryZw'
      ];

      // English Content
      bodyEn = `🌱 *CROP OVERVIEW & AGRITEX RECOMMENDATION:*
• Target Crop: ${selectedCrop.name} (${selectedCrop.shonaName ? selectedCrop.shonaName + ' / ' : ''}${selectedCrop.ndebeleName || ''})
• Suitable Agro-Regions: Regions ${selectedCrop.suitableRegions.join(', ')}
• Recommended Certified Varieties: ${selectedCrop.recommendedVarieties.slice(0, 3).join(', ')}
• Days to Maturity: ~${selectedCrop.maturityDays} Days
• Rainfall Needed: ${selectedCrop.rainfallRequirementMm.min}mm - ${selectedCrop.rainfallRequirementMm.max}mm
• Pfumvudza Spacing & Basin Rate: 1 standard beer bottle cap (10g) Compound D per basin covered by 2cm soil.
💡 *Expert Field Advice:* ${selectedCrop.suitabilityReason} ${selectedCrop.plantingTriggerCondition}`;

      // Shona Content
      bodySn = `🇿🇼 *CHISHONA - MAZANO ANOKOSHA PAMUSORO PE ${selectedCrop.shonaName || selectedCrop.name}:*
• Mbewu inokurudzirwa: ${selectedCrop.recommendedVarieties.slice(0, 2).join(', ')}.
• Pfumvudza: Chicherai makomba 15cm x 15cm x 15cm, isa chifuniko chebhodhoro che Compound D.
• Nguva yekukura: Mazuva anoda kusvika ${selectedCrop.maturityDays}.
💡 *Zano reAgritex:* ${selectedCrop.suitabilityReason}`;

      // Ndebele Content
      bodyNd = `🇿🇼 *ISINDEBELE - AMACEBO AQOKATHEKILEYO NGE ${selectedCrop.ndebeleName || selectedCrop.name}:*
• Inhlamvu ezinconywayo: ${selectedCrop.recommendedVarieties.slice(0, 2).join(', ')}.
• Uhlelo lwe-Intwasa: Lungisani imisele ngendlela eqondileyo, lifake isivundiso se-Compound D.
• Isikhathi sokuvuna: Izinsuku ezingaba ngu-${selectedCrop.maturityDays}.
💡 *Umlayezo wabe-Agritex:* ${selectedCrop.suitabilityReason}`;
    } else if (selectedCategory === 'livestock') {
      headline = `${selectedLivestock.icon} ${selectedLivestock.name.toUpperCase()} HUSBANDRY & VET BULLETIN`;
      hashtags = [
        ...selectedLivestock.hashtags,
        '#LivestockZw',
        `#${currentLocation.name.replace(/[^a-zA-Z0-9]/g, '')}`,
        '#AgritexVet',
        '#FarmersDictionaryZw'
      ];

      // English Content
      bodyEn = `🐾 *LIVESTOCK MANAGEMENT & VETERINARY PROTOCOLS:*
• Stock Type: ${selectedLivestock.name} (${selectedLivestock.shonaName} / ${selectedLivestock.ndebeleName})
• Monitored Health Threats: ${selectedLivestock.keyDiseases.join(', ')}
• Current Livestock Market Benchmark: ${selectedLivestock.marketPriceRange}
💉 *Veterinary & Husbandry Standard:*
${selectedLivestock.keyAdvice}`;

      // Shona Content
      bodySn = `🇿🇼 *CHISHONA - KUCHENGETEDZWA KWEMHUKA (${selectedLivestock.shonaName}):*
• Zvirwere zvinonetsa: ${selectedLivestock.keyDiseases.slice(0, 2).join(', ')}.
• Mitengo yemhuka pamusika: ${selectedLivestock.marketPriceRange}.
💡 *Zano reChiremba weMhuka:* ${selectedLivestock.shonaAdvice}`;

      // Ndebele Content
      bodyNd = `🇿🇼 *ISINDEBELE - UKUKHATHALELA IMFUYO (${selectedLivestock.ndebeleName}):*
• Imikhuhlane eqakathekileyo: ${selectedLivestock.keyDiseases.slice(0, 2).join(', ')}.
• Amanani emakethe: ${selectedLivestock.marketPriceRange}.
💡 *Umlayezo wabe-Veterinary:* ${selectedLivestock.ndebeleAdvice}`;
    } else {
      // Market Insight
      headline = `📈 REAL-TIME MARKET INTELLIGENCE: ${selectedMarket.marketName.toUpperCase()}`;
      hashtags = [
        ...selectedMarket.hashtags,
        '#ZimbabweMarketPrices',
        '#AgriArbitrage',
        '#FarmersDictionaryZw'
      ];

      const commodityList = selectedMarket.topCommodities
        .map((c) => `• ${c.name} (${c.unit}): ${c.price} [Trend: ${c.trend === 'up' ? '📈 Rising' : c.trend === 'down' ? '📉 Surplus' : '🟢 Stable'}]`)
        .join('\n');

      bodyEn = `📊 *TODAY'S COMMODITY WHOLESALE BENCHMARKS:*
${commodityList}

💡 *Selling Strategy & Arbitrage:*
${selectedMarket.marketAdvisory}`;

      bodySn = `🇿🇼 *CHISHONA - MITENGO YEMUSIKA NEZANO REKUTENGESA:*
${selectedMarket.topCommodities.slice(0, 2).map((c) => `• ${c.name}: ${c.price}`).join('\n')}
💡 *Zano kuVarimi:* ${selectedMarket.shonaAdvisory}`;

      bodyNd = `🇿🇼 *ISINDEBELE - INTENGO ZOMHLABATHI LAMACEBO OKUTHENGISA:*
${selectedMarket.topCommodities.slice(0, 2).map((c) => `• ${c.name}: ${c.price}`).join('\n')}
💡 *Umlayezo kwi-Market:* ${selectedMarket.ndebeleAdvisory}`;
    }

    // Call To Action Section specifically pointing to the WhatsApp Hub
    const whatsAppCta = `━━━━━━━━━━━━━━━━━━━━━━━━━━━
📲 *CONNECT TO OUR 1-TAP WHATSAPP HUB:*
Need 1-on-1 personalized advisory with a certified Agritex extension officer or want to join over ${selectedWhatsAppGroup.memberCount} in the *${selectedWhatsAppGroup.name}*?
👉 Tap to chat or join our community: ${selectedWhatsAppGroup.defaultInviteLink}

🌐 Explore the Trilingual Agricultural Dictionary & Live Diagnostic Scanner:
${appUrl}`;

    // Assemble output based on languageMode
    let finalPost = '';

    if (languageMode === 'en') {
      finalPost = `${headline}\n📍 District: ${districtInfo}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${bodyEn}\n\n${whatsAppCta}\n\n${hashtags.join(' ')}`;
    } else if (languageMode === 'sn') {
      finalPost = `${headline}\n📍 Dunhu: ${districtInfo}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${bodySn}\n\n${whatsAppCta}\n\n${hashtags.join(' ')}`;
    } else if (languageMode === 'nd') {
      finalPost = `${headline}\n📍 Isigaba: ${districtInfo}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${bodyNd}\n\n${whatsAppCta}\n\n${hashtags.join(' ')}`;
    } else {
      // Trilingual Combined (Recommended for maximum reach)
      finalPost = `${headline} 🇿🇼
📍 District/Dunhu: ${districtInfo}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
${bodyEn}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
${bodySn}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
${bodyNd}

${whatsAppCta}

${hashtags.join(' ')}`;
    }

    return {
      headline,
      content: finalPost,
      hashtags
    };
  }, [
    selectedCategory,
    selectedCrop,
    selectedLivestock,
    selectedMarket,
    languageMode,
    currentLocation,
    selectedWhatsAppGroup
  ]);

  // The active text displayed in editor (either generated or manually customized)
  const currentText = customizedText !== null ? customizedText : generatedContent.content;

  // AI Polish with Gemini
  const handleAiPolish = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/facebook/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `${generatedContent.headline} for ${currentLocation.name}`,
          type: 'post',
          language: languageMode === 'sn' ? 'sn' : languageMode === 'nd' ? 'nd' : 'en',
          extraNotes: `Must include WhatsApp CTA for "${selectedWhatsAppGroup.name}" and cover crops/livestock data.`
        })
      });

      const data = await res.json();
      if (data.success && data.generated?.content) {
        setCustomizedText(data.generated.content);
      }
    } catch (e) {
      console.warn('AI Polish failed, continuing with built-in agronomy data:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Reset customized text to auto-generated
  const handleReset = () => {
    setCustomizedText(null);
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard write error:', e);
    }
  };

  // Transfer to Post Studio
  const handleTransferToStudio = () => {
    onApplyPostToStudio(currentText, generatedContent.headline);
  };

  // Direct Publish to Page
  const handleDirectPost = () => {
    onDirectPublishToPage(currentText, generatedContent.headline);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-5 sm:p-7">
      {/* Component Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[11px] font-black rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Content Generator</span>
            </span>

            <span className="px-2.5 py-0.5 bg-blue-50 text-[#1877F2] border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1">
              <span>Target:</span>
              <strong className="font-mono">facebook.com/{targetPageId}</strong>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Auto-Generate Polished Agro Posts for Facebook
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Select a verified crop, livestock breed, or market price insight from Zimbabwe’s Agritex database.
            Produces instant bilingual posts formatted with viral emojis, technical directives, and direct WhatsApp Hub CTAs.
          </p>
        </div>

        {/* Quick CTA to WhatsApp Modal */}
        {onOpenWhatsAppModal && (
          <button
            onClick={() => onOpenWhatsAppModal(selectedCrop.name, 'Agritex Facebook Inquiry')}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs transition flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Launch WhatsApp Hub</span>
          </button>
        )}
      </div>

      {/* STEP 1: CATEGORY SELECTION */}
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Step 1: Choose Your Agricultural Focus</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('crop');
              setCustomizedText(null);
            }}
            className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
              selectedCategory === 'crop'
                ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <span className="text-2xl p-2 rounded-xl bg-white shadow-2xs">🌾</span>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-slate-900">Field Crops & Horticulture</h4>
              <p className="text-[11px] text-slate-500">Maize, Small Grains, Soya, Tomatoes, Groundnuts</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('livestock');
              setCustomizedText(null);
            }}
            className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
              selectedCategory === 'livestock'
                ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <span className="text-2xl p-2 rounded-xl bg-white shadow-2xs">🐂</span>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-slate-900">Livestock & Pastures</h4>
              <p className="text-[11px] text-slate-500">Beef, Boer Goats, Broilers, Dairy, Piggery</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('market');
              setCustomizedText(null);
            }}
            className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
              selectedCategory === 'market'
                ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <span className="text-2xl p-2 rounded-xl bg-white shadow-2xs">📈</span>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-slate-900">Market Price Index</h4>
              <p className="text-[11px] text-slate-500">Mbare Musika, Renkini, CC Sales, GMB Floors</p>
            </div>
          </button>
        </div>
      </div>

      {/* STEP 2: SELECT SPECIFIC ENTITY */}
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>
            Step 2: Select Specific {selectedCategory === 'crop' ? 'Crop' : selectedCategory === 'livestock' ? 'Livestock Breed' : 'Market Center'}
          </span>
        </label>

        {selectedCategory === 'crop' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {ALL_EXPANDED_CROPS.slice(0, 12).map((crop) => (
              <button
                key={crop.cropId}
                onClick={() => {
                  setSelectedCropId(crop.cropId);
                  setCustomizedText(null);
                }}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedCropId === crop.cropId
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <span className="text-base block mb-0.5">🌱</span>
                <span className="text-xs font-bold line-clamp-1">{crop.name}</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {crop.shonaName || crop.category}
                </span>
              </button>
            ))}
          </div>
        )}

        {selectedCategory === 'livestock' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {LIVESTOCK_DATABASE.map((live) => (
              <button
                key={live.id}
                onClick={() => {
                  setSelectedLivestockId(live.id);
                  setCustomizedText(null);
                }}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-start gap-2.5 ${
                  selectedLivestockId === live.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <span className="text-2xl">{live.icon}</span>
                <div>
                  <span className="text-xs font-bold block leading-tight">{live.name}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{live.shonaName}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedCategory === 'market' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {MARKET_INSIGHTS_DATABASE.map((mkt) => (
              <button
                key={mkt.id}
                onClick={() => {
                  setSelectedMarketId(mkt.id);
                  setCustomizedText(null);
                }}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-start gap-2.5 ${
                  selectedMarketId === mkt.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <span className="text-2xl">{mkt.icon}</span>
                <div>
                  <span className="text-xs font-bold block leading-tight">{mkt.marketName}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{mkt.location}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* STEP 3: CONFIGURE LANGUAGE & WHATSAPP HUB CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-200">
        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Output Language Format:</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                setLanguageMode('trilingual');
                setCustomizedText(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                languageMode === 'trilingual'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              🇿🇼 Tri-Lingual (All 3 Combined)
            </button>
            <button
              onClick={() => {
                setLanguageMode('en');
                setCustomizedText(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                languageMode === 'en'
                  ? 'bg-[#1877F2] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              🇬🇧 English Only
            </button>
            <button
              onClick={() => {
                setLanguageMode('sn');
                setCustomizedText(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                languageMode === 'sn'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              🇿🇼 ChiShona
            </button>
            <button
              onClick={() => {
                setLanguageMode('nd');
                setCustomizedText(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                languageMode === 'nd'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              🇿🇼 isiNdebele
            </button>
          </div>
        </div>

        {/* WhatsApp Hub Call-To-Action Destination */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Featured WhatsApp Hub Community CTA:</span>
          </label>
          <select
            value={selectedWhatsAppGroup.id}
            onChange={(e) => {
              const grp = WHATSAPP_COMMUNITY_GROUPS.find((g) => g.id === e.target.value);
              if (grp) {
                setSelectedWhatsAppGroup(grp);
                setCustomizedText(null);
              }
            }}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
          >
            {WHATSAPP_COMMUNITY_GROUPS.map((grp) => (
              <option key={grp.id} value={grp.id}>
                {grp.name} ({grp.memberCount})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STEP 4: GENERATED POST PREVIEW & EDITING */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <span>Generated Facebook Post Ready for facebook.com/{targetPageId}</span>
            {customizedText !== null && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                Customized
              </span>
            )}
          </label>

          <div className="flex items-center gap-2">
            {customizedText !== null && (
              <button
                onClick={handleReset}
                className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Reset to default template"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            <button
              onClick={handleAiPolish}
              disabled={isGeneratingAi}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Enhance copy with Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>{isGeneratingAi ? 'Polishing...' : 'AI Enhance Copy'}</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={12}
            value={currentText}
            onChange={(e) => setCustomizedText(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1877F2] font-mono leading-relaxed"
          />
        </div>

        {/* Character Count & Stats */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>
            {currentText.length} characters • ~{Math.ceil(currentText.split(' ').length / 150)} min read
          </span>
          <span className="text-emerald-700 font-bold">
            ✓ Complete with emojis, Agritex directives & WhatsApp Hub CTA
          </span>
        </div>
      </div>

      {/* STEP 5: ACTION SUITE */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex-1 md:flex-none px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copy Post Text</span>
              </>
            )}
          </button>

          {/* Transfer to Post Studio */}
          <button
            onClick={handleTransferToStudio}
            className="flex-1 md:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            title="Load this post into Post Studio to preview 1200x630 graphic card"
          >
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <span>Load in Post Studio</span>
          </button>
        </div>

        {/* Direct Publish to Page (1312589948614022) */}
        <button
          onClick={handleDirectPost}
          className="w-full md:w-auto px-6 py-2.5 bg-[#1877F2] hover:bg-blue-600 active:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Post to Page ({targetPageId})</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </button>
      </div>
    </div>
  );
};
