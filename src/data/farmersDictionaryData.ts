/**
 * Farmers Dictionary Zw - Comprehensive Zimbabwe Agricultural Dictionary & WhatsApp Data
 * Encompassing Pfumvudza/Intwasa, Agro-Ecological Zones (Regions I-V), Traditional Grains,
 * Veterinary Sciences, Agrochemicals, Soil Physics, and Extension Standards.
 * Sourced from Agritex, CSRI, DR&SS, and Zimbabwe Farmer Field Schools.
 */

export interface DictionaryEntry {
  id: string;
  term: string;
  shona: string;
  ndebele: string;
  category: 'Pfumvudza' | 'Soil & Water' | 'Crops & Grains' | 'Livestock & Health' | 'Fertilizers & Chemicals' | 'Markets & Economics';
  definitionEn: string;
  definitionSn: string;
  definitionNd: string;
  agritexRecommendation: string;
  applicableRegions: ('I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V')[];
  importance: 'Essential' | 'High' | 'Standard';
  tags: string[];
}

export interface WhatsAppCommunityGroup {
  id: string;
  name: string;
  region: string;
  focus: string;
  memberCount: string;
  description: string;
  defaultInviteLink: string;
  agritexModerator: string;
}

export const WHATSAPP_COMMUNITY_GROUPS: WhatsAppCommunityGroup[] = [
  {
    id: 'pfumvudza-national',
    name: 'Pfumvudza / Intwasa National Champions',
    region: 'National (Regions I - V)',
    focus: 'Basin preparation, mulching, hole spacing, and zero-tillage yields',
    memberCount: '1,024+ Farmers',
    description: 'Official national community sharing daily basin digging benchmarks, manure placement rates, and early sowing alerts across Zimbabwe.',
    defaultInviteLink: 'https://chat.whatsapp.com/invite/pfumvudza-champions-zw',
    agritexModerator: 'Agritex National Conservation Agronomist'
  },
  {
    id: 'mash-maize-soya',
    name: 'Mashonaland High-Yield Maize & Soya Hub',
    region: 'Region IIa & IIb (Goromonzi, Mazowe, Chinhoyi, Marondera)',
    focus: 'Commercial & smallholder hybrid maize, top-dressing splits, FAW scouting',
    memberCount: '890+ Farmers',
    description: 'Focused on high-rainfall cropping systems, SC719/PAN53 hybrids, lime applications, and grain drying protocols.',
    defaultInviteLink: 'https://chat.whatsapp.com/invite/mashonaland-agro-zw',
    agritexModerator: 'Mashonaland Provincial Crops Officer'
  },
  {
    id: 'manicaland-horticulture',
    name: 'Manicaland Highlands & Honde Valley Farmers',
    region: 'Region I & II (Mutare, Nyanga, Chipinge, Chimanimani)',
    focus: 'Avocados, macadamia, tea, coffee, potato blight, drip irrigation',
    memberCount: '670+ Farmers',
    description: 'Specialized agro-climatic discussions for mountainous high-rainfall farmers dealing with acidic soils and cold-season horticultural crops.',
    defaultInviteLink: 'https://chat.whatsapp.com/invite/manicaland-farmers-zw',
    agritexModerator: 'Eastern Highlands Horticulture Specialist'
  },
  {
    id: 'midlands-masvingo-grains',
    name: 'Midlands & Masvingo Small Grains Network',
    region: 'Region III & IV (Gweru, Gokwe, Masvingo, Chivi, Gutu)',
    focus: 'Sorghum (SVT1), Pearl millet, cowpeas, dead-level contours',
    memberCount: '940+ Farmers',
    description: 'Climate-resilient dryland farming methods, water harvesting in semi-arid velds, and drought mitigation protocols.',
    defaultInviteLink: 'https://chat.whatsapp.com/invite/midlands-masvingo-zw',
    agritexModerator: 'Dryland Farming Extension Lead'
  },
  {
    id: 'matabeleland-livestock',
    name: 'Matabeleland Cattle & Livestock Guild',
    region: 'Region IV & V (Bulawayo, Lupane, Gwanda, Beitbridge, Plumtree)',
    focus: 'Boran & Tuli cattle, dipping schedules, tick-borne disease, bush encroachment',
    memberCount: '810+ Farmers',
    description: 'Veterinary support network focusing on preventing Theileriosis (January Disease), lumpy skin, drought supplementary feeding, and goat breeding.',
    defaultInviteLink: 'https://chat.whatsapp.com/invite/matabeleland-livestock-zw',
    agritexModerator: 'Department of Veterinary Services (DVS) Lead'
  },
  {
    id: 'peri-urban-market-gardeners',
    name: 'Peri-Urban Market Gardeners (Mbare & Renkini)',
    region: 'Urban & Peri-Urban (Harare, Bulawayo, Chitungwiza)',
    focus: 'Tomatoes, brassicas, onions, direct fresh pricing, pest management',
    memberCount: '1,200+ Farmers',
    description: 'Real-time market price updates from Mbare Musika and Renkini, cabbage glut alerts, and cold storage negotiation tips.',
    defaultInviteLink: 'https://chat.whatsapp.com/invite/peri-urban-market-zw',
    agritexModerator: 'Horticultural Marketing Board Liaison'
  }
];

export const AGRITEX_OFFICIAL_HOTLINES = [
  {
    name: 'Agritex National Farmer Advisory Helpdesk',
    number: '263772100254',
    display: '+263 77 210 0254',
    badge: 'Official WhatsApp Helpdesk',
    hours: '24/7 Agro-Advisory'
  },
  {
    name: 'Department of Veterinary Services (DVS) Alert Line',
    number: '263712004821',
    display: '+263 71 200 4821',
    badge: 'Livestock & Tick Disease',
    hours: '06:00 - 20:00 Daily'
  },
  {
    name: 'Zimbabwe Farmers Union (ZFU) Support Desk',
    number: '263773449102',
    display: '+263 77 344 9102',
    badge: 'Input Subsidies & Markets',
    hours: '08:00 - 17:00 Mon-Sat'
  }
];

export const FARMERS_DICTIONARY_ENTRIES: DictionaryEntry[] = [
  {
    id: 'pfumvudza-basin',
    term: 'Pfumvudza / Intwasa Planting Basin',
    shona: 'Guvha rePfumvudza',
    ndebele: 'Umgodi we-Intwasa',
    category: 'Pfumvudza',
    definitionEn: 'A standardized precision planting pit measuring 15cm long x 15cm wide x 15cm deep spaced at 75cm between rows and 60cm within rows (or 75cm x 75cm), designed to concentrate rainfall, organic mulch, and basal fertilizer directly around crop roots.',
    definitionSn: 'Gomba rinoti 15cm kudzika, 15cm kufara uye 15cm kureba, rinocherwa pasina kurima negejo. Rinoita kuti mvura nefetereza zvigare chaizvo pamidzi yechibage.',
    definitionNd: 'Umgodi ole-15cm ngokutshona, 15cm ububanzi kanye le-15cm ubude owenzelwe ukugcina amanzi lezivundiso eduze lempande zezilimo.',
    agritexRecommendation: 'Dig all 1,456 basins per 0.0624 ha plot before November. Add one handful (approx. 200g) well-decomposed kraal manure plus one beer bottle cap (5g) Compound D at the base, covered by 2-3cm soil before dropping seeds.',
    applicableRegions: ['IIa', 'IIb', 'III', 'IV', 'V'],
    importance: 'Essential',
    tags: ['pfumvudza', 'intwasa', 'basin', 'conservation-agriculture', 'zero-tillage']
  },
  {
    id: 'nhokwe-mulch',
    term: 'Mulch / Soil Blanket (Nhokwe)',
    shona: 'Nhokwe / Mupfudze weMasora',
    ndebele: 'Umgubane / Utshani bokugubungela',
    category: 'Pfumvudza',
    definitionEn: 'A continuous protective carpet of dry grass, crop residue (maize stover), or leaf litter covering the soil surface to prevent moisture evaporation, suppress weed germination, and moderate soil temperature.',
    definitionSn: 'Masora akaoma kana mashanga echibage anowadzirwa pamusoro peivhu kuchengetedza unyoro kuti mvura isakurumidze kupera nezuva.',
    definitionNd: 'Utshani obomileyo loba izikhuni ezisikiweyo ezendlalwa phezu komhlabathi ukuze umhlabathi ungatshi lilanga lezihlume zingamili.',
    agritexRecommendation: 'Aim for 100% soil cover (at least 3-5 tonnes dry biomass per hectare). Do not burn crop stover after harvest; mulch preserves up to 40% more soil moisture through 14-day dry spells in Regions III, IV, and V.',
    applicableRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    importance: 'Essential',
    tags: ['mulch', 'nhokwe', 'moisture-preservation', 'organic-cover']
  },
  {
    id: 'dekad-rainfall',
    term: 'Dekad (Agro-Meteorological 10-Day Period)',
    shona: 'Mazuva Gumi eMamiriro ekunze',
    ndebele: 'Izinsuku Ezilitshumi Zomkhathi',
    category: 'Markets & Economics',
    definitionEn: 'The international and MSD standard 10-day rainfall monitoring unit (3 dekads per month, 36 dekads per agricultural year). Sowing decisions in Zimbabwe are based on dekadal threshold crossings (minimum 25-30mm per dekad).',
    definitionSn: 'Chikamu chemazuva gumi chinoshandiswa neveMSD kutarisa kuwanda kwemvura inonaya. Murimi anongotanga kudyara kana mazuva gumi anaya anopfuura 25mm kusvika 30mm.',
    definitionNd: 'Isikhathi sezinsuku ezilitshumi esisetshenziswa ngabe-MSD ukukala izulu. Ukuhlanyela kuqala lapho izulu lithola okungenani 25-30mm esikhathini lesi.',
    agritexRecommendation: 'Do not plant on isolated single showers in October (Dekad 28-29) unless cumulative dekadal rainfall reaches 25-35mm and soil is wet down to 20cm depth.',
    applicableRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    importance: 'High',
    tags: ['dekad', 'meteorology', 'planting-window', 'msd', 'rainfall-index']
  },
  {
    id: 'compound-d',
    term: 'Compound D Fertilizer (7-14-7)',
    shona: 'Fetereza yeBasal (Compound D)',
    ndebele: 'Isivundiso Sokuqala (Compound D)',
    category: 'Fertilizers & Chemicals',
    definitionEn: 'The standard Zimbabwean basal planting fertilizer consisting of 7% Nitrogen (N), 14% Phosphorus (P2O5), and 7% Potassium (K2O), plus 6-8% Sulphur. Promotes rapid early root establishment and seedling vigor.',
    definitionSn: 'Fetereza inoiswa pakudyara ine nitrogen, phosphorus, nepotassium. Inobatsira kuti midzi yembewu ikure yakasimba uye nekukasira.',
    definitionNd: 'Isivundiso esihlanyelwa lezinhlamvu esile-phosphorus enengi eyenza impande ziqine masinyane.',
    agritexRecommendation: 'In sandy soils, apply 200-300 kg/ha (approx. 5g or one beer bottle cap per Pfumvudza basin). Always place 2cm below or to the side of the seed; never place seed in direct contact with fertilizer granules.',
    applicableRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    importance: 'Essential',
    tags: ['compound-d', 'basal-fertilizer', 'phosphorus', 'root-development']
  },
  {
    id: 'ammonium-nitrate',
    term: 'Ammonium Nitrate (AN 34.5% N)',
    shona: 'Fetereza yeTop-Dressing (AN)',
    ndebele: 'Isivundiso Sokugqolozela (AN)',
    category: 'Fertilizers & Chemicals',
    definitionEn: 'High-nitrogen granular top-dressing fertilizer containing 34.5% pure nitrogen in both nitrate and ammonium forms, providing immediate and sustained green vegetative growth and cob/grain enlargement.',
    definitionSn: 'Fetereza inoiswa kana chibage chapfuura mumabvi (top-dressing). Inopa nitrogen inoita kuti mashizha asvibe nekukora kwegaka.',
    definitionNd: 'Isivundiso esimhlophe esiphiwa izilimo sezikulile ukuze zibe lamahlamvu aluhlaza lezikhwebu ezinkulu.',
    agritexRecommendation: 'Never apply all AN in one dose on sandy soils to prevent leaching. Split into two: 50% at 4-5 weeks (knee height, approx. 5g/basin) and 50% at 7-8 weeks (tasseling), applying only into moist soil within 10cm of the stem.',
    applicableRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    importance: 'Essential',
    tags: ['ammonium-nitrate', 'an', 'top-dressing', 'nitrogen', 'leaching']
  },
  {
    id: 'fall-armyworm',
    term: 'Fall Armyworm (Spodoptera frugiperda)',
    shona: 'Mhungu / Gonye reChibage',
    ndebele: 'Isihlava sombila / Umnyundu',
    category: 'Livestock & Health',
    definitionEn: 'An aggressive invasive pest whose larvae bore into the whorls, stems, and cobs of maize and sorghum, chewing characteristic ragged "window pane" holes and depositing coarse sawdust-like frass.',
    definitionSn: 'Gonye rinopinda mumwoyo mepwere yechibage richidya mashizha nemhodzi richisiya madhaka anenge mupupupu.',
    definitionNd: 'Isibungu esingena phakathi enhliziyweni yombila sidle amahlamvu sesule insila efana le-sawdust.',
    agritexRecommendation: 'Scout 20 plants across 5 spots weekly. Spray in late afternoon when larvae feed. Use Emamectin benzoate (Ampligo / Prove), Lambda-cyhalothrin (Karate Zeon), or fine dry wood ash / sand dropped directly into the plant funnel for smallholder basins.',
    applicableRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    importance: 'Essential',
    tags: ['fall-armyworm', 'pest', 'spodoptera', 'maize-pest', 'karate-zeon']
  },
  {
    id: 'january-disease',
    term: 'January Disease (Theileriosis)',
    shona: 'Chirwere cheMombe cheNduru / Theileriosis',
    ndebele: 'Umkhuhlane Wezinkomo kaZibandlela (Theileriosis)',
    category: 'Livestock & Health',
    definitionEn: 'A fatal cattle tick-borne protozoan disease caused by Theileria parva and transmitted by the brown ear tick (Rhipicephalus appendiculatus), causing swollen lymph nodes, frothy nasal discharge, severe anemia, and rapid death.',
    definitionSn: 'Chirwere chinouraya mombe chinokonzerwa nezvikwekwe zvinogara munzeve. Mombe inozvimba mapfundo, kubuda furo mumhuno nekukosora.',
    definitionNd: 'Umkhuhlane oyingozi ezinkomeni obangelwa ngamakhizane asemathunjini lendlebeni, wenze inkomo ibomvu, ivuvuke amadlala ife masinyane.',
    agritexRecommendation: 'Strictly observe the 5-5-4 dipping regimen during the rainy season (dip every 5 days twice, then every 4 days). Apply tick grease inside ears, under tail switch, and around brisket between dip days. Treat early with Buparvaquone (Butalex).',
    applicableRegions: ['IIa', 'IIb', 'III', 'IV'],
    importance: 'Essential',
    tags: ['theileriosis', 'january-disease', 'ticks', 'cattle-health', 'dip-tank']
  },
  {
    id: 'mupfudze-kraal-manure',
    term: 'Kraal Manure (Mupfudze / Umquba)',
    shona: 'Mupfudze weMudanga',
    ndebele: 'Umquba Wasesibayeni',
    category: 'Fertilizers & Chemicals',
    definitionEn: 'Decomposed animal excreta and bedding from cattle or goat kraals. Adds essential organic matter, micro-nutrients, restores cation exchange capacity (CEC), and dramatically increases water holding capacity in granitic sands.',
    definitionSn: 'Mupfudze wemombe kana wembudzi wakaora zvakanaka mudanga. Unoita kuti ivhu rejecha rikwanise kubata mvura kwemazuva akawanda.',
    definitionNd: 'Umquba wezinkomo owomileyo loba owonakeleyo owenza umhlabathi wesihlabathi ubambe amanzi lezivundiso.',
    agritexRecommendation: 'Apply 10 to 15 tonnes per hectare or two generous handfuls (approx. 250-400g) per Pfumvudza basin during dry winter months (July-September) so it cures and prevents nitrogen-lock during seed germination.',
    applicableRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    importance: 'High',
    tags: ['manure', 'mupfudze', 'umquba', 'soil-organic-matter', 'water-retention']
  },
  {
    id: 'sorghum-svt1',
    term: 'Sorghum / Mapfunde (SVT1 / Macia)',
    shona: 'Mapfunde',
    ndebele: 'Amabele',
    category: 'Crops & Grains',
    definitionEn: 'Indigenous drought-tolerant cereal crop adapted to semi-arid agro-ecological zones with deep secondary root systems capable of entering temporary dormancy during mid-season dry spells and reviving upon rainfall.',
    definitionSn: 'Zvirimwa zvechivanhu zvisingafe nekusanaya kwemvura. Zvinokwanisa kupararira midzi pasi zvichimirira mvura pasina kusvava.',
    definitionNd: 'Izilimo zesintu ezingatshi loba izulu linqamukile. Amabele alempande ezitshonayo ezingaphila endaweni ezomileyo.',
    agritexRecommendation: 'Mandatory grain for Natural Regions IV & V (e.g., Chivi, Beitbridge, Mwenezi, Gokwe). Plant certified varieties like SVT1 or Macia at 8-10 kg/ha in 75cm rows; thin to 2 plants per station 2 weeks after emergence.',
    applicableRegions: ['III', 'IV', 'V'],
    importance: 'Essential',
    tags: ['sorghum', 'mapfunde', 'amabele', 'small-grains', 'drought-hardy']
  },
  {
    id: 'finger-millet-rukweza',
    term: 'Finger Millet / Rukweza / Uphoko',
    shona: 'Rukweza / Zviyo',
    ndebele: 'Uphoko',
    category: 'Crops & Grains',
    definitionEn: 'Highly nutritious small grain rich in calcium, iron, and methionine. Stores safely in traditional granaries for up to 10 years without pesticide treatments due to dense tannin-rich seed coats.',
    definitionSn: 'Mbeu yechiShona ine utano hwakanyanya kudarika zvimwe zvirimwa zvese. Haina kuorera munzvimbo inogarisa kana mumatura kwemakore akawanda.',
    definitionNd: 'Ukudla kwemvelo okulomkhonto womzimba owomileyo ongaboliyo esiphpaleni okweminyaka elitshumi.',
    agritexRecommendation: 'Plant early with first effective rains in November in well-prepared fine seedbeds. Seeds are minuscule: mix 1 part seed with 3 parts dry sand or dry sieved compost for even dribbling along shallow furrows.',
    applicableRegions: ['IIb', 'III', 'IV'],
    importance: 'High',
    tags: ['rukweza', 'uphoko', 'zviyo', 'finger-millet', 'traditional-grain']
  },
  {
    id: 'dead-level-contour',
    term: 'Dead-Level Contour / Makoronga',
    shona: 'Makoronga Asina Kudonha (Dead-Level)',
    ndebele: 'Imigelo Engenamthambeko (Dead-Level)',
    category: 'Soil & Water',
    definitionEn: 'An engineered earthen ditch dug precisely along true elevation contours (0% gradient) with earthen ties, designed to capture 100% of surface runoff from hillsides and force it to infiltrate underground to recharge local water tables.',
    definitionSn: 'Gero rakacherwa rakaenzana pasina mutserendende kuti mvura yese inoyerera mumunda isatize asi inyure muvhu.',
    definitionNd: 'Umgelo ombiweyo ulingane ncamashi ukuze amanzi agelezayo angahambi kodwa atshone phansi komhlabathi.',
    agritexRecommendation: 'Construct using an A-frame in Regions IV and V spaced 20-30 meters apart. Plant Vetiver grass or Bana grass on the lower crest to stabilize walls and supply continuous green livestock fodder.',
    applicableRegions: ['III', 'IV', 'V'],
    importance: 'High',
    tags: ['contour', 'water-harvesting', 'dead-level', 'vetiver', 'soil-conservation']
  },
  {
    id: 'gmb-depot',
    term: 'Grain Marketing Board (GMB)',
    shona: 'GMB (Dura reNyika)',
    ndebele: 'I-GMB (Isiphala Sezizwe)',
    category: 'Markets & Economics',
    definitionEn: 'Zimbabwe statutory grain storage and price stabilization board that purchases maize, traditional grains, wheat, and soya beans at gazetted floor prices while administering the presidential input scheme.',
    definitionSn: 'Dura renyika rehurumende rinotenga zvirimwa zvose zvinosanganisira chibage, mapfunde, zviyo nesoya nemitengo yakatarwa nehurumende.',
    definitionNd: 'Inkampani kahulumende ehlala ithenga amabele, umbila lamantongomane ngentengo ebekiweyo esizweni.',
    agritexRecommendation: 'Deliver grain at or below 12.5% moisture content. Test using the sealed glass bottle salt test: if table salt clumps to grain after shaking in a sealed dry bottle, moisture is above 13% and grain will be rejected.',
    applicableRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    importance: 'High',
    tags: ['gmb', 'grain-marketing-board', 'moisture-content', 'pricing-index']
  },
  {
    id: 'nhimbe-humwe',
    term: 'Nhimbe / Humwe (Communal Labor Synergy)',
    shona: 'Nhimbe / Jakwara / Humwe',
    ndebele: 'Ilima (Ukusebenzisana)',
    category: 'Pfumvudza',
    definitionEn: 'Traditional Zimbabwean community cooperative work gathering where neighbors assemble to accomplish high-labor seasonal tasks (basin excavation, weeding, harvesting, or threshing) accompanied by shared food and traditional beverages.',
    definitionSn: 'Kushandira pamwe kwevavakidzani mumusha apo vanobatana kuchera makomba ePfumvudza kana kukohwa vachibatsirana pasina mubhadharo wemari.',
    definitionNd: 'Ukuhlangana kwabomakhelwane besizana ukulima, ukumba imigodi kumbe ukuvuna beselusukwini olulodwa njengomndeni owodwa.',
    agritexRecommendation: 'Leverage Nhimbe groups of 8-12 farmers to dig the 1,456 Pfumvudza basins per household within 2-3 days before the October heat spikes.',
    applicableRegions: ['I', 'IIa', 'IIb', 'III', 'IV', 'V'],
    importance: 'Standard',
    tags: ['nhimbe', 'ilima', 'community-labor', 'cooperative-farming']
  },
  {
    id: 'dolomitic-lime',
    term: 'Agricultural Dolomitic Lime',
    shona: 'Choko yeIvhu (Dolomite Lime)',
    ndebele: 'Ilime Yomhlabathi (Dolomite)',
    category: 'Soil & Water',
    definitionEn: 'Calcium and magnesium carbonate rock powder used to neutralize soil acidity (raise pH from below 5.0 to optimal 5.5-6.5), unlocking tied-up phosphorus and preventing fertilizer wastage in granite sands.',
    definitionSn: 'Upfu hweDombo runoderedza acidity yeivhu kuitira kuti fetereza yemari inoshanda isarasike pamashizha nemidzi.',
    definitionNd: 'Impuphu yelime ehlisa ubumuncu bomhlabathi ukuze izivundiso ezithengiweyo zisebenze kuhle ezilinyweni.',
    agritexRecommendation: 'Broadcast 500 - 1,000 kg/ha on acidic sandy velds (pH < 4.8) at least 1 month before planting or apply 1 matchbox full (approx. 20g) per Pfumvudza basin during winter preparation.',
    applicableRegions: ['I', 'IIa', 'IIb', 'III'],
    importance: 'High',
    tags: ['lime', 'soil-acidity', 'ph-correction', 'dolomite', 'phosphorus-uptake']
  },
  {
    id: 'cowpea-nyemba',
    term: 'Cowpea / Nyemba / Indumba',
    shona: 'Nyemba',
    ndebele: 'Indumba',
    category: 'Crops & Grains',
    definitionEn: 'Rapid-growing leguminous crop with high biological nitrogen fixation capacity (up to 40-70 kg N/ha via symbiotic Rhizobia root nodules), high protein leaves eaten as mufushwa, and superior drought tolerance.',
    definitionSn: 'Mbeu yemhuri yenyemba inosunga nitrogen yemuchadenga ichiisa muvhu uye inodyiwa mashizha senyemba kana mufushwa une utano hwakanyanya.',
    definitionNd: 'Isilimo esilamahlamvu adliwayo lezinhlamvu eziphezulu ngezamaprotein, esifaka ivundiso ye-nitrogen emhlabathini.',
    agritexRecommendation: 'Intercrop or rotate with maize every 2 seasons. Sow 20-25 kg/ha; do not apply synthetic nitrogen (AN) as it halts the plant’s natural nitrogen-fixing nodulation nodules.',
    applicableRegions: ['IIb', 'III', 'IV', 'V'],
    importance: 'Essential',
    tags: ['nyemba', 'indumba', 'cowpeas', 'nitrogen-fixation', 'rhizobia', 'intercropping']
  },
  {
    id: 'mbare-musika',
    term: 'Mbare Musika Wholesale Market',
    shona: 'Mbare Musika (Musika Mukuru)',
    ndebele: 'Emakethe eMbare / Renkini',
    category: 'Markets & Economics',
    definitionEn: 'Zimbabwe’s central fresh-produce open wholesale terminal market in Harare where daily farm-gate prices for tomatoes, cabbages, onions, potatoes, and leaf vegetables fluctuate in response to national lorry supply.',
    definitionSn: 'Musika mukuru wemuriwo nezvibereko weHarare unoshandiswa nevarimi kubva mumatunhu ose kutengesa zvibereko nemitengo yezuva nezuva.',
    definitionNd: 'Imakethe enkulu eHarare lapho abalimi abathengisa khona imibhida, amatomatisi lezithelo ngentengo yebusuku lempondozankomo.',
    agritexRecommendation: 'Time harvests for Tuesday to Thursday night arrivals when bulk buyers from provincial towns purchase inventory. Always verify truck freight costs per pocket/crate prior to loading.',
    applicableRegions: ['I', 'IIa', 'IIb', 'III', 'IV'],
    importance: 'Standard',
    tags: ['mbare-musika', 'market-prices', 'wholesale', 'fresh-produce', 'renkini']
  }
];

/**
 * Format a WhatsApp Click-to-Chat URL
 */
export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  // Strip non-digits
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

/**
 * Build a Universal WhatsApp Share URL for any active device
 */
export function buildWhatsAppUniversalShare(text: string): string {
  const encoded = encodeURIComponent(text.trim());
  return `https://api.whatsapp.com/send?text=${encoded}`;
}

/**
 * Generate a pre-formatted Agricultural Field Inquiry for WhatsApp
 */
export function generateWhatsAppInquiryMessage(options: {
  topic: string;
  districtName: string;
  naturalRegion: string;
  farmerName?: string;
  queryDetails?: string;
}): string {
  const { topic, districtName, naturalRegion, farmerName, queryDetails } = options;
  return `🌾 *FARMERS DICTIONARY ZW • AGRITEX ADVISORY INQUIRY*
━━━━━━━━━━━━━━━━━━━━━
📍 *District:* ${districtName} (Natural Region ${naturalRegion})
👤 *Farmer:* ${farmerName || 'Smallholder Farmer'}
📌 *Topic:* ${topic}

📝 *Field Query:*
${queryDetails || 'Please assist with Agritex verified advisory for our local conditions, planting timing, and input rates.'}

━━━━━━━━━━━━━━━━━━━━━
_Sent via Farmers Dictionary Zw System_`;
}

/**
 * Generate today's WhatsApp Daily Agricultural Digest
 */
export function generateWhatsAppDailyDigest(district: {
  name: string;
  naturalRegion: string;
  province: string;
}): string {
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return `🇿🇼 *FARMERS DICTIONARY ZW • DAILY FIELD DIGEST*
📅 *Date:* ${dateStr}
📍 *District:* ${district.name} | *Region:* ${district.naturalRegion} | *Province:* ${district.province}
━━━━━━━━━━━━━━━━━━━━━

🌧️ *Dekad Rainfall & Planting Status:*
• Basin Moisture Check: Ensure minimum 25mm planting rain before dropping seed.
• Top Recommended Crops for Region ${district.naturalRegion}:
  ${district.naturalRegion === 'I' || district.naturalRegion === 'IIa' ? '🌽 SC637/PAN53 Hybrid Maize, Soya Beans, Seed Potato' : district.naturalRegion === 'IIb' || district.naturalRegion === 'III' ? '🌽 SC513/SC403 Maize, Groundnuts, Nyemba, Sugar Beans' : '🌾 SVT1 Sorghum, Pearl Millet, Cowpeas, Sesame, Drought Maize'}

🌱 *Pfumvudza / Soil Care Directive:*
• Maintain 100% mulch blanket to preserve 35-40% more soil moisture.
• Apply 1 beer bottle cap Compound D (approx 5g) per basin covered with 2cm soil.

🐛 *Pest & Livestock Scouting Alert:*
• Fall Armyworm: Inspect 20 maize whorls weekly for sawdust frass.
• Cattle Dipping: Maintain the 5-5-4 tick control schedule against January Disease (Theileriosis).

💰 *Benchmark Markets Today:*
• GMB Grade A Maize: $335/tonne
• Traditional Grains (Sorghum/Millet): $335/tonne (Guaranteed)
• Mbare Musika Tomatoes: $8 - $14 / wooden crate

━━━━━━━━━━━━━━━━━━━━━
_Share this digest to your local farmer WhatsApp group!_
_Powered by Farmers Dictionary Zw • Agritex Verified_`;
}
