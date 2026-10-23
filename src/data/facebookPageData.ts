/**
 * Facebook Page Integration Data & Templates
 * For automated posting of market prices, agro-advisories, interactive polls, and 9:16 Facebook Reels.
 */

export interface FacebookPageConfig {
  pageId: string;
  pageName: string;
  category: string;
  fanCount: number;
  pictureUrl: string;
  isConnected: boolean;
  connectedAt?: string;
  hasPublishPermissions: boolean;
}

export interface FacebookPublishedPost {
  id: string;
  type: 'post' | 'reel' | 'poll';
  title: string;
  message: string;
  createdAt: string;
  permalinkUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  reachCount: number;
  thumbnailUrl?: string;
  status: 'published' | 'scheduled' | 'draft';
}

export interface InteractivePostTemplate {
  id: string;
  title: string;
  category: 'market' | 'outbreak' | 'chemical' | 'poll' | 'dictionary';
  icon: string;
  headline: string;
  defaultMessage: string;
  shonaMessage?: string;
  ndebeleMessage?: string;
  hashtags: string[];
  callToAction: string;
  interactiveType?: 'poll' | 'qa' | 'action_card';
  pollOptions?: string[];
}

export interface ReelScene {
  slideNumber: number;
  durationSeconds: number;
  headline: string;
  subtext: string;
  bgGradient: string;
  emojiIcon: string;
  voiceoverEn: string;
  voiceoverSn: string;
  voiceoverNd: string;
  highlightWords: string[];
}

export interface FacebookReelTemplate {
  id: string;
  title: string;
  targetAudience: string;
  totalDurationSeconds: number;
  category: 'pfumvudza' | 'pest_control' | 'knapsack' | 'markets' | 'livestock' | 'wisdom';
  coverEmoji: string;
  soundtrackLabel: string;
  caption: string;
  hashtags: string[];
  scenes: ReelScene[];
}

export const INTERACTIVE_POST_TEMPLATES: InteractivePostTemplate[] = [
  {
    id: 'system-launch-announcement',
    title: '🚀 System Launch (All 3 Languages)',
    category: 'dictionary',
    icon: '🌾',
    headline: 'Welcome to Farmers Dictionary Zimbabwe • Mauya / Siyalemukela',
    defaultMessage: `🇿🇼 WELCOME TO FARMERS DICTIONARY ZIMBABWE! 🌾
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Empowering every farmer across Zimbabwe with free, real-time agricultural intelligence, localized market prices, certified pest diagnostics, and trilingual technical guidance in English, ChiShona, and isiNdebele!

Whether you farm in Region I (Eastern Highlands) or Region V (Lowveld), this system was built for YOUR field, herd, and pocket.

📱 KEY FEATURES FOR YOU:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ Trilingual Duramazwi / Isichazamazwi (1,000+ terms)
• Search agronomy, livestock, and soil terms in English, ChiShona, or isiNdebele.
• Tap the voice microphone to speak terms in your mother tongue!

2️⃣ Daily Wholesale Market Prices (USD & ZiG)
• Real-time commodity trackers from Mbare Musika (Harare), Renkini/Malaleni (Bulawayo), Sakubva (Mutare), and GMB statutory floors.

3️⃣ Certified Pest & Disease Field Diagnostics
• Instant identification and treatment directives for Fall Armyworm, Tomato Leaf Miner (Tuta Absoluta), Bacterial Wilt, and January Disease (Theileriosis).

4️⃣ Agrochemical Safety & Knapsack Dilution Calculator
• Calculate exact chemical millilitres per 16L/20L knapsack, safety color-band hazard codes, and Pre-Harvest Intervals (PHI).

5️⃣ Pfumvudza / Intwasa Precision Calendars
• Step-by-step planting basin spacing (15cm x 15cm), fertilizer cap precision, and mulch management for maximum drought resilience.

6️⃣ 1-Tap WhatsApp Agronomy Dispatch
• Share alerts, diagnoses, and advisories directly with local Agritex extension officers and farming groups.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇿🇼 CHISHONA: MAUYA KU FARMERS DICTIONARY ZW!
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Varimi vemuZimbabwe, tinokugashirei kune chishandiso chedu chitsva chekurima chakaumbwa kusimudzira goho renyu!

• Duramazwi Rezvekurima: Tsvagai mashoko ese eAgritex nemutauro weChiShona kana kutaura nemakrofoni.
• Mitengo Yemazuva Ese: Zivai mitengo chaiyo pa Mbare Musika, GMB, nemisika yemadunhu ese muUSD neZiG kuti musadyirwe nevamupedzanhamo.
• Kudzivirira Zvipembenene: Zano riri pamutemo rekupedza kukonye (Fall Armyworm), zvirwere zvemadomasi, nenyora dzechirwere cheJanuary (Theileriosis).
• Pfumvudza / Intwasa: Mazano ekuchera makomba, kuisa mupfudze, nekuchengetedza hunyoro muvhu kuti musakanganiswe nekusanaya zvakanaka kwemvura.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇿🇼 ISINDEBELE: SIYALAMUKELA KU FARMERS DICTIONARY ZW!
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Balimi bakithi eZimbabwe, siyalemukela kunkundla yethu yezolimo ebalulekileyo eyenzelwe ukuthuthukisa umsebenzi wenu!

• Isichazamazwi Sezolimo: Dingani amagama ezolimo ngesiNdebele, ukhulume nge-voice search mahala.
• Amanani Emakethe Ansukuzonke: Tholani intengo eRenkini (Bulawayo), GMB, lezinye izabelo ku-USD le-ZiG ukuze lingaqili ziholi.
• Ukwelapha Izilokazane: Amacebo okuvikela ibutho lesibungu (Fall Armyworm), imikhuhlane yezilimo, leye zifuyo njenge January Disease.
• Uhlelo Lwe-Intwasa: Ukulungisa imisele ngendlela eqondileyo kanye lokufaka umquba ngokulingeneyo ukuze uvune kakhulu.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 INTERACTIVE QUESTION FOR OUR FARMERS:
Which district are you farming in, and which crop or livestock are you managing this season? Drop a comment below! 👇

🔗 Access the free Web Application here:
https://ais-pre-iirwvujxhjhismccovw3wo-535649001550.europe-west2.run.app

#ZimbabweFarming #FarmersDictionaryZw #Pfumvudza #Intwasa #MbareMusika #Agritex #SmallholderFarmers #AgriTech #ZimbabweAgriculture #Harare #Bulawayo`,
    shonaMessage: `🇿🇼 MAUYA KU FARMERS DICTIONARY ZIMBABWE! 🌾
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Varimi vemuZimbabwe, tinokugashirei kune chishandiso chitsva chekurima chakaumbwa kusimudzira goho nemari yenyu!

📱 ZVINANGWA ZVIKURU:
1️⃣ Duramazwi Rezvekurima (ChiShona, Ndebele, English): Tsvagai mazwi ezvekurima nemutauro wenyu kana kutaura nefoni.
2️⃣ Mitengo ye Mbare Musika & GMB: Wana mitengo chaiyo yezvirimwa nezvipfuyo zuva nezuva.
3️⃣ Kurapa Zvirwere neKukonye: Nzira dzepamutemo dzekudzivirira Fall Armyworm nezvirwere zvemadomasi.
4️⃣ Pfumvudza Precision: Mazano eAgritex ekurima uchishandisa makomba nekuchengetedza hunyoro.

💬 Varimi, muri kurima mudunhu ripi uye muri kurima zvirimwa zvipi gore rino? Nyorai pasi apa! 👇
🔗 Vhurai app apa: https://ais-pre-iirwvujxhjhismccovw3wo-535649001550.europe-west2.run.app

#Pfumvudza #ZimbabweFarming #MbareMusika #Varimi #FarmersDictionaryZw`,
    ndebeleMessage: `🇿🇼 SIYALEMUKELA KU FARMERS DICTIONARY ZIMBABWE! 🌾
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Balimi bakithi eZimbabwe, siyalemukela kunkundla yethu yezolimo ebalulekileyo eyenzelwe ukuthuthukisa umsebenzi wenu lamapulazi enu!

📱 IZINTO EZIQOKATHEKILEYO:
1️⃣ Isichazamazwi Sezolimo: Amagama e-agronomy le-livestock ngesiNdebele, Shona, le-English.
2️⃣ Intengo Zalamuhla eRenkini le-GMB: Amanani ezilimo lemfuyo ngansuku zonke ku-USD le-ZiG.
3️⃣ Ukulwisana Lezibungu: Amacebo okulwisana le-Fall Armyworm kanye le-January Disease.
4️⃣ Uhlelo Lwe-Intwasa: Amasu okuvuna kakhulu emhlabathini oomileyo.

💬 Balimi, lilima kusiphi isabelo njalo lifuye yiphi imfuyo lonyaka? Bhalani lapha ngaphansi! 👇
🔗 Vulani i-app lapha: https://ais-pre-iirwvujxhjhismccovw3wo-535649001550.europe-west2.run.app

#Intwasa #ZimbabweFarming #BulawayoRenkini #Abalimi #FarmersDictionaryZw`,
    hashtags: ['#ZimbabweFarming', '#FarmersDictionaryZw', '#Pfumvudza', '#Intwasa', '#MbareMusika', '#Agritex', '#SmallholderFarmers', '#AgriTech'],
    callToAction: 'Explore the full trilingual system, live market prices, and diagnostic tools in Farmers Dictionary Zw'
  },
  {
    id: 'custom-manual-post',
    title: 'Custom Manual Post',
    category: 'dictionary',
    icon: '✍️',
    headline: 'Agricultural Field Advisory & Community Notice',
    defaultMessage: `🌱 *ZIMBABWE FARMERS COMMUNITY NOTICE* 🌱
━━━━━━━━━━━━━━━━━━━━━
📍 *Updates for smallholders across all agro-ecological regions:*

• Farmers are advised to maintain active scouting for pests and check soil moisture.
• Access certified inputs and regional market comparisons in the Farmers Dictionary Zw app.

💬 Have questions or farming tips for your district? Comment below! 👇`,
    shonaMessage: `🌱 *CHIZIVISO CHEVARIMI VEMU ZIMBABWE* 🌱
━━━━━━━━━━━━━━━━━━━━━
Varimi vese mumadunhu akasiyana-siyana kurudzirwai kuramba muchiongorora zvirimwa zvenyu mazuva ese.

💬 Unomurimi mune rimwe zano rekugovana? Nyorai pasi apa! 👇`,
    ndebeleMessage: `🌱 *ISAZISO SABALIMI BEZIMBABWE* 🌱
━━━━━━━━━━━━━━━━━━━━━
Abalimi bayakhuthazwa ukuthi bahlale behlola izilimo zabo emapulazini ukuze bavikele izilokazane.

💬 Ulomlayezo obawole bokuphakamisa abanye? Bhalani lapha ngaphansi! 👇`,
    hashtags: ['#ZimbabweFarming', '#Agritex', '#Pfumvudza', '#FarmersDictionaryZw', '#ManualPost'],
    callToAction: 'Connect with fellow farmers and verify agricultural standards in Farmers Dictionary Zw'
  },
  {
    id: 'market-prices-today',
    title: 'Daily Market Price Index',
    category: 'market',
    icon: '📈',
    headline: 'Mbare Musika & Bulawayo Renkini Wholesale Prices',
    defaultMessage: `🌽 *TODAY'S ZIMBABWE FARMERS MARKET UPDATE* 🌽
━━━━━━━━━━━━━━━━━━━━━
📍 *Mbare Musika Wholesale (Harare)*
• White Maize (50kg bag): $14.50 (ZiG 413) ⬆️ High Demand
• Tomatoes (30kg crate): $18.00 (ZiG 513) ⬇️ Heavy Supply
• Shelled Groundnuts (20L Tin): $16.00 (ZiG 456) 🔥 Very High
• Orange Sweet Potatoes (15kg pocket): $6.50 (ZiG 185) 🟢 Stable

🏛️ *Grain Marketing Board (GMB) Statutory Floor*
• Grade A Maize: $335 / Metric Tonne (Guaranteed purchase)
• Traditional Small Grains (Sorghum/Millet): $335 / Tonne
• Soya Beans: $580 / Tonne (Critical oil expresser demand)

💡 *Agritex Tip:* Grade your tomatoes before packing into crates. Grade 1 Roma fetch up to $4 more per crate!

💬 Farmers: What prices are buyers offering in your local district today? Drop your town and crop below! 👇`,
    shonaMessage: `🌽 *MUTENGO WEMAZUVA ANO PA MBARE MUSIKA* 🌽
Chibage 50kg bag: $14.50 • Madomasi 30kg crate: $18.00 • Nzungu 20L tin: $16.00 • GMB Chibage Tonne: $335.
Varimi, mumadunhu menyu chibage chiri kutengwa nemarii nhasi? Nyorai pasi apa! 👇`,
    ndebeleMessage: `🌽 *INTENGO ZALAMUHLA EMALALENI MARKET (BULAWAYO)* 🌽
Umumbu 50kg: $16.50 • Inyawuthi 50kg: $18.50 • Nyimo 20L: $19.00 • Imbuzi eziphilayo: $38.00.
Balimi, lithengisa ngamalini esabelweni senu lamuhla? Bhalani lapha ngaphansi! 👇`,
    hashtags: ['#MbareMusika', '#ZimbabweFarming', '#AgriPrices', '#Pfumvudza', '#FarmersDictionaryZw', '#GMB'],
    callToAction: 'Check full nationwide market comparison in the Farmers Dictionary Zw app'
  },
  {
    id: 'outbreak-emergency-alert',
    title: 'Emergency Pest Outbreak Alert',
    category: 'outbreak',
    icon: '🚨',
    headline: 'High Alert: Fall Armyworm Funnel Damage Detected',
    defaultMessage: `🚨 *URGENT AGRITEX FIELD ADVISORY: FALL ARMYWORM ALERT* 🚨
━━━━━━━━━━━━━━━━━━━━━
⚠️ *Affected Agro-Regions:* Regions IIb, III & IV (Goromonzi, Marondera, Bindura, Chinhoyi)
🎯 *Target Crop:* Maize & Sweetcorn at 4 - 6 leaf stage (Knee-height)

🔍 *How to Scout in Your Field:*
Inspect 20 consecutive plants in 5 different spots. Look for:
1. Pinhole window-pane feeding marks on young leaves
2. Moist sawdust-like frass (droppings) inside the central leaf whorl
3. Brown caterpillar with distinct inverted "Y" on head capsule

🧪 *DR&SS Registered Emergency Controls:*
• *Ampligo 150ZC:* 15 - 20 ml per 15L knapsack
• *Karate Zeon 5CS:* 10 - 15 ml per 15L knapsack
• *Belt 480SC:* 8 - 10 ml per 15L knapsack

💡 *Zero-Cash Indigenous Tip:* Drop 1 teaspoon of clean fine sand or dry wood ash directly into the central funnel whorl early morning!

Share this alert with fellow farmers in your local WhatsApp and farming groups! 👇`,
    shonaMessage: `🚨 *YAMPIRO YEKUCHIMBIDZIKA: MHUNGU (FALL ARMYWORM) YAMUKA!* 🚨
Varimi vezvibage, tarisai mumakoko emashizha zvino! Kana maona maburi nemadhodhi akaita se sawdust, kurumidzai kupfapfaidza Karate Zeon kana Belt 480SC. Kana musina mari, dirai madota akasefwa mumukoko wechibage!`,
    ndebeleMessage: `🚨 *ISIXWAYISO ESIQAKATHEKILEKO: IMBOVANE (FALL ARMYWORM) ISIBONAKALILE!* 🚨
Balimi bomumbu, qaphelani ezinhliziyweni zezihlahla zomumbu. Fafazani ngomuthi obhalisiweyo njenge Karate Zeon kumbe lifake umlotha ohlanzekileyo enhliziyweni yesihlahla!`,
    hashtags: ['#FallArmyworm', '#Mhungu', '#AgritexAlert', '#MaizePests', '#PfumvudzaProtection', '#ZimbabweAgro'],
    callToAction: 'Run AI leaf scan or inspect chemical dosage manuals in the Farmers Dictionary Zw app'
  },
  {
    id: 'pfumvudza-poll',
    title: 'Interactive Farmer Poll & Quiz',
    category: 'poll',
    icon: '❓',
    headline: 'National Planting Progress Poll',
    defaultMessage: `📊 *FARMERS VOICE ZW: WHERE ARE YOU ON YOUR PFUMVUDZA PLOTS?* 🇿🇼
━━━━━━━━━━━━━━━━━━━━━
With the latest Meteorological Services Department (MSD) dekad rainfall advisory showing moisture fronts across the country, we want to hear from every smallholder grower!

React to this post to cast your vote:
👍 *LIKE:* All basins dug, mulched, and basal fertilizer placed!
❤️ *LOVE:* Sowed our seeds and already seeing uniform green emergence!
😮 *WOW:* Waiting for the next 25mm soaking rain before dropping seed.
💡 *BULB:* Focused on horticulture, onions, and drip-irrigated plots.

💬 *Comment below:* What natural region are you in, and how are soil moisture levels in your basins right now? Let's connect across Zimbabwe!`,
    shonaMessage: `📊 *CHIRONGWA CHEPFUMVUDZA 2026: WASVIKA PAPI?* 🇿🇼
Reacting kune ino post kuvhota:
👍 Basins dzakachochorwa nemakanda!
❤️ Mbeu yakatodyarwa yamera!
😮 Takamirira mvura yakasimba!
Taura mudunhu mako mutsamba dzekutanga! 👇`,
    ndebeleMessage: `📊 *UHLELO LWENTWASA: UKUWELIPHI IBANGA?* 🇿🇼
👍 Imigodi igxotshiwe yafakwa umquba!
❤️ Sesihlanyele izilimo sezimila!
😮 Sisamele izulu elinamandla!
Bhalani isabelo senu lapha ngaphansi! 👇`,
    hashtags: ['#PfumvudzaPoll', '#IntwasaProgress', '#ZimFarmersConnect', '#SmallholderVoices', '#FoodSecurityZW'],
    callToAction: 'Calculate exact seed & fertilizer quantities for your plots using our Yield Calculator',
    interactiveType: 'poll',
    pollOptions: [
      'Basins dug, mulched & fertilized (👍 Like)',
      'Seeds in the ground & emerging (❤️ Love)',
      'Awaiting 25mm soaking rain (😮 Wow)',
      'Horticulture & irrigated crops (💡 Insightful)'
    ]
  },
  {
    id: 'chemical-safety-dossier',
    title: 'Agrochemical Safe Use & PHI Card',
    category: 'chemical',
    icon: '🧪',
    headline: 'Knapsack Calibration & Pre-Harvest Intervals',
    defaultMessage: `🧪 *DR&SS STATUTORY AGROCHEMICAL SAFETY DIRECTIVE* 🧪
━━━━━━━━━━━━━━━━━━━━━
🔬 *Focus Product:* Prove 1.92EC (Emamectin benzoate 19.2 g/L)
📋 *DR&SS Registration No:* ZW-P-0935/2016
🏷️ *Toxicity Group:* Amber (Dangerous - Class III)

🎯 *Target Pests:* Tuta Absoluta (Tomato Leafminer), Diamondback Moth, Thrips
💧 *Application Rate:* 15 - 20 ml per 15L knapsack sprayer
⏱️ *Pre-Harvest Interval (PHI):* STRICTLY 3 DAYS
🛡️ *Re-Entry Interval:* 24 Hours

⚠️ *Crucial Safety Directives:*
• ALWAYS spray late afternoon after 16:30 when honeybees have returned to hives
• Wear neoprene/nitrile gloves and a vapor respirator mask
• NEVER harvest or pick tomatoes for home cooking or market before the 3-day PHI has elapsed!

📖 Save this card to your phone for reference during your next knapsack mix!`,
    hashtags: ['#AgrochemicalSafety', '#PesticideRegulations', '#DRSS', '#TomatoFarming', '#SafeSpraying'],
    callToAction: 'Access full 8-section multilingual manuals for all 79 registered chemicals in the app'
  },
  {
    id: 'duramazwi-word-of-day',
    title: 'Indigenous Agro Wisdom (Duramazwi)',
    category: 'dictionary',
    icon: '📖',
    headline: 'Duramazwi reVarimi / Isichazamazwi Sabalimi',
    defaultMessage: `📖 *FARMERS DICTIONARY ZW • INDIGENOUS WISDOM OF THE DAY* 🇿🇼
━━━━━━━━━━━━━━━━━━━━━
🌱 *Term:* NHOKWE (Sedge / Cyperus esculentus)
🇿🇼 *ChiShona:* Nhokwe / Pfende
🇿🇼 *SiNdebele:* Inqoba / Intombo
🔬 *Botanical:* Yellow Nutsedge / Watergrass

💡 *Indigenous & Agritex Science:*
In traditional Zimbabwean farming, dense patches of Nhokwe indicate shallow underground perched water tables and heavy clay/vlei hydrology. While a tough competitor for maize, its tubers are a nutrient-rich emergency forage and indigenous food staple!

🌱 *Agritex Field Tip:* To eliminate Nhokwe in maize plots without damaging seedlings, apply Halosulfuron 75WG (50g/ha) or Bentazone when sedge shoots have 3 to 5 leaves.

Do your elders remember other uses for Nhokwe? Share your family's farming stories in the comments! 👇`,
    hashtags: ['#DuramazwiReVarimi', '#Isichazamazwi', '#IndigenousKnowledge', '#ZimCulture', '#AgroEcology'],
    callToAction: 'Search over 200 terms by voice in English, Shona, or Ndebele in the Farmers Dictionary app'
  }
];

export const FACEBOOK_REELS_TEMPLATES: FacebookReelTemplate[] = [
  {
    id: 'reel-pfumvudza-masterclass',
    title: 'Pfumvudza Basin Spacing & Mulch Magic (60s)',
    targetAudience: 'Smallholder maize & sorghum growers',
    totalDurationSeconds: 60,
    category: 'pfumvudza',
    coverEmoji: '🌽',
    soundtrackLabel: 'Uplifting African Marimba Beats (120 BPM)',
    caption: 'Double your maize yield this season without expensive machinery! Here is the exact Agritex Pfumvudza basin blueprint that withstands dry spells. 🇿🇼 #Pfumvudza #ZimFarming #FoodSecurity',
    hashtags: ['#Pfumvudza', '#ZimbabweAgriculture', '#SmallholderFarmers', '#ClimateSmart', '#ReelsAgro', '#HarvestMore'],
    scenes: [
      {
        slideNumber: 1,
        durationSeconds: 10,
        headline: 'Why Are Your Neighbor\'s Crops Green While Yours Wilt?',
        subtext: 'The secret is not luck—it is 15cm x 15cm moisture conservation.',
        bgGradient: 'from-emerald-950 via-emerald-800 to-slate-950',
        emojiIcon: '💡',
        voiceoverEn: 'Ever wondered why some farmers harvest 5 tonnes per hectare while others struggle with withered stalks? The secret is Pfumvudza precision.',
        voiceoverSn: 'Wakambozvibvunza here kuti nei vamwe varimi vachikohwa matani mashanu asi vamwe vachiona mbesa dzichitsva? Chakavanzika iPfumvudza.',
        voiceoverNd: 'Uke wazibuza ukuthi kungani abanye abalimi bevuna amakhilogremu amanengi kodwa abanye izilimo zabo zisitsha? Yimfihlo yeNtwasa.',
        highlightWords: ['Double Yield', 'Moisture', 'Pfumvudza']
      },
      {
        slideNumber: 2,
        durationSeconds: 15,
        headline: 'Step 1: The Standard Basin Blueprint',
        subtext: 'Spacing: 75cm between rows • 60cm between basins • Depth: 15cm.',
        bgGradient: 'from-amber-950 via-emerald-900 to-slate-900',
        emojiIcon: '📐',
        voiceoverEn: 'Dig your basins precisely: 15 centimetres deep, 15 centimetres wide, and 35 centimetres long. Spaced 75cm between rows and 60cm within the row.',
        voiceoverSn: 'Chera makomba ako zvine hutsanana: 15cm kudzika, 15cm kufara, ne 35cm kureba. Fambisa tambo 75cm pakati pemitsetse.',
        voiceoverNd: 'Gubha imigodi yakho ngokucophelela: 15cm ukutshona, 15cm ububanzi, 35cm ubude. Thiya intambo 75cm phakathi kwemigqa.',
        highlightWords: ['15cm Deep', '75cm Rows', 'Precision Basins']
      },
      {
        slideNumber: 3,
        durationSeconds: 18,
        headline: 'Step 2: 1 Bottle Cap of Compound D + Mulch Blanket',
        subtext: 'Never let raw fertilizer touch the seed! Add 2cm soil buffer.',
        bgGradient: 'from-teal-950 via-emerald-800 to-amber-950',
        emojiIcon: '🌾',
        voiceoverEn: 'Place one beer bottle cap of Compound D at the base, cover with 2 centimetres of soil, and blanket the field with dry grass mulch to trap every drop of dew.',
        voiceoverSn: 'Isa chifukidzo chehwahwa cheCompound D pasi, vhara nevhu re 2cm, woisa huswa hwakaoma kudzivirira kubuda kwemvura muvhu.',
        voiceoverNd: 'Faka isivimbo sebhodo leCompound D phansi, vala ngenhlabathi ye 2cm, ubeke utshani obomileyo ukuvikela amanzi.',
        highlightWords: ['1 Bottle Cap', 'Cover Soil', 'Mulch Blanket']
      },
      {
        slideNumber: 4,
        durationSeconds: 17,
        headline: 'The Result: 28 Days of Drought Resistance!',
        subtext: 'Track your optimal planting window with Farmers Dictionary Zw.',
        bgGradient: 'from-emerald-900 via-teal-900 to-emerald-950',
        emojiIcon: '🏆',
        voiceoverEn: 'When mid-season dry spells strike, mulched basins hold moisture for up to 28 days! Download the Farmers Dictionary Zw app for free Agritex calendars.',
        voiceoverSn: 'Kana zuva rikapisa, makomba ane huswa anochengeta hunyoro kwemazuva 28! Shandisa Farmers Dictionary Zw app kuwana ruzivo rweAgritex mahara.',
        voiceoverNd: 'Lapho ilanga litshisa, imigodi ehlonyelweyo ibamba umswakama okwamalanga angamatshumi amabili lasithupha! Sebenzisa Farmers Dictionary Zw app mahala.',
        highlightWords: ['28 Days Moisture', 'Bumper Harvest', 'Get Free App']
      }
    ]
  },
  {
    id: 'reel-fall-armyworm-strike',
    title: 'Stop Fall Armyworm Fast: Scouting & Safe Spraying (50s)',
    targetAudience: 'Maize & sorghum smallholders',
    totalDurationSeconds: 50,
    category: 'pest_control',
    coverEmoji: '🐛',
    soundtrackLabel: 'Fast Urgent Tech Beat (128 BPM)',
    caption: 'Do not let Fall Armyworm wipe out your maize crop overnight! Spot the pinhole window panes and treat with DR&SS certified controls. 🛑🐛 #FallArmyworm #AgritexAlert #MaizeProtection',
    hashtags: ['#StopArmyworm', '#MhunguAlert', '#InsecticideSafety', '#DRSSApproved', '#PfumvudzaHeroes'],
    scenes: [
      {
        slideNumber: 1,
        durationSeconds: 10,
        headline: '48 Hours to Save Your Maize Whorl!',
        subtext: 'A single armyworm moth lays up to 1,000 eggs in 3 days.',
        bgGradient: 'from-rose-950 via-red-900 to-slate-950',
        emojiIcon: '⚠️',
        voiceoverEn: 'Fall Armyworm can destroy an entire hectare of young maize in 48 hours. Here is how to catch it before it is too late.',
        voiceoverSn: 'Mhungu inogona kuparadza munda wese wechibage mumaawa makumi mana nemasere. Onai zvokuita musati maita kurasikirwa.',
        voiceoverNd: 'Imbovane ingachitha insimu yonke yomumbu emahoreni angamatshumi amane lasitshiyagalombili. Nanka amacebo okuvikela.',
        highlightWords: ['48 Hours', 'Urgent Alert', 'Scout Now']
      },
      {
        slideNumber: 2,
        durationSeconds: 15,
        headline: 'Spot the Signs: Window-Panes & Moist Frass',
        subtext: 'Scout 20 plants in 5 field locations twice every week.',
        bgGradient: 'from-amber-950 via-rose-900 to-slate-900',
        emojiIcon: '🔍',
        voiceoverEn: 'Look deep into the central funnel. If you see translucent leaf scratches or sawdust-like frass, you have active larvae feeding inside.',
        voiceoverSn: 'Tarisisa mukati memukoko wechibage. Kana ukaona mashizha ane maburi madiki nemadhodhi akaita se sawdust, mhungu yotodya.',
        voiceoverNd: 'Khangela phakathi kwenhliziyo yesihlahla. Nxa ubona amatswayi lamasila afana le sawdust, izibungu zisezitshalo.',
        highlightWords: ['Pinhole Marks', 'Frass Sawdust', 'Funnel Leaf']
      },
      {
        slideNumber: 3,
        durationSeconds: 15,
        headline: 'Direct Strike: Knapsack Nozzle into the Funnel',
        subtext: 'Spray Karate Zeon 5CS (15ml/15L) or Ampligo (15ml/15L) at sunrise.',
        bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
        emojiIcon: '🎯',
        voiceoverEn: 'Aim your knapsack nozzle directly down into each funnel whorl early morning or late afternoon when caterpillars crawl up to feed.',
        voiceoverSn: 'Nangana kamuti kaye mukati chaiwo memukoko mangwanani-ngwanani kana masikati ava kupera.',
        voiceoverNd: 'Khomba umbhobho wesifutho ngqo phakathi kwenhliziyo ekuseni kakhulu loba ntambama.',
        highlightWords: ['Direct Nozzle', 'Whorl Spray', 'Early Morning']
      },
      {
        slideNumber: 4,
        durationSeconds: 10,
        headline: 'Zero Cash? Use Fine Sand & Dry Wood Ash!',
        subtext: 'Natural physical abrasion lacerates armyworm skin without cost.',
        bgGradient: 'from-slate-900 via-emerald-900 to-emerald-950',
        emojiIcon: '🛡️',
        voiceoverEn: 'No money for chemicals? A spoonful of dry wood ash and fine sand poured into the whorl cuts the caterpillar body and suffocates it.',
        voiceoverSn: 'Hapana mari yemushonga? Durura chipunu chemadota nejecha rakatsetseka mumukoko rinocheka ganda remhungu rouraya.',
        voiceoverNd: 'Kawulali imali yomuthi? Faka isipunu somlotha lesihlabathi esicolekileyo enhliziyweni yesihlahla.',
        highlightWords: ['Zero Cost', 'Wood Ash Trick', 'Caterpillar Control']
      }
    ]
  },
  {
    id: 'reel-knapsack-calibration',
    title: 'Calibrating Your 15L Knapsack Sprayer in 45s',
    targetAudience: 'Horticulture & field crop growers',
    totalDurationSeconds: 45,
    category: 'knapsack',
    coverEmoji: '💧',
    soundtrackLabel: 'Rhythmic Acoustic Guitar & Shaker (115 BPM)',
    caption: 'Stop wasting expensive agrochemicals or burning crop leaves! Calibrate your 15L knapsack in 3 simple steps. 💧🎒 #SprayerCalibration #AgroTips #FarmSmart',
    hashtags: ['#KnapsackCalibration', '#SprayingSafety', '#FarmersDictionaryZw', '#TomatoFarming', '#AgritexVerified'],
    scenes: [
      {
        slideNumber: 1,
        durationSeconds: 10,
        headline: 'Are You Burning Leaves or Wasting $20 per Spray?',
        subtext: 'Over-dosing burns crops; under-dosing creates chemical resistance.',
        bgGradient: 'from-blue-950 via-indigo-900 to-slate-950',
        emojiIcon: '🎒',
        voiceoverEn: 'Over-dosing chemicals scorches your crop leaves. Under-dosing creates resistant super-pests. Here is how to calibrate in 45 seconds.',
        voiceoverSn: 'Kupfuuridza chiyero chemushonga kunopisa mbesa. Kushomeka kunoita kuti zvipembenene zvisafe. Ndivo matanho ekuyera knapsack.',
        voiceoverNd: 'Ukudlulisa umuthi kutshisa izilimo. Ukunciphisa kwenza izilwanyana zingafi. Nanka amacebo wokukala isifutho sakho.',
        highlightWords: ['Calibrate Sprayer', 'Stop Waste', 'Save Money']
      },
      {
        slideNumber: 2,
        durationSeconds: 15,
        headline: 'Step 1: Test with Pure Water on 100m² Plot',
        subtext: 'Measure 10 metres by 10 metres. Walk at 1 step per second.',
        bgGradient: 'from-teal-950 via-blue-900 to-slate-900',
        emojiIcon: '🚶',
        voiceoverEn: 'Fill your knapsack with clean water. Spray a 10 by 10 metre test plot at normal walking speed. Measure how many litres you used.',
        voiceoverSn: 'Zadza knapsack nemvura yakachena chete. Pfapfaidza panzvimbo ye 10 metres ne 10 metres uchifamba nhanho dzakatsiga.',
        voiceoverNd: 'Faka amanzi ahlanzekileyo esifutheni. Fafaza indawo engamamitha alitshumi ngalitshumi uhambe ngesivinini esijwayelekileyo.',
        highlightWords: ['Clean Water Test', '100 sq metres', 'Steady Pace']
      },
      {
        slideNumber: 3,
        durationSeconds: 20,
        headline: 'Step 2: The Slurry Method (Never Dump Raw Powder!)',
        subtext: 'Pre-dissolve in a 5L plastic bucket before pouring into tank.',
        bgGradient: 'from-emerald-950 via-teal-900 to-slate-950',
        emojiIcon: '🧪',
        voiceoverEn: 'Never dump powder directly into the knapsack! Pre-mix your exact measured dosage in a 5-litre bucket of water first, then strain into the tank.',
        voiceoverSn: 'Usambodira hupfu hwemushonga mu knapsack! Tanga wakanyungudusa mubhakedhi rine mvura shoma wozosefa uchidira mutangi.',
        voiceoverNd: 'Ungaze wathela impuphu yomuthi ngqo esifutheni! Qala uyincibilikise ebhakedeni lamanzi elilamathani amahlanu.',
        highlightWords: ['Slurry Pre-mix', 'Strain Water', 'Protect Nozzle']
      }
    ]
  },
  {
    id: 'reel-market-prices-fast',
    title: 'This Week\'s Market Prices: Where to Sell for Top Dollar',
    targetAudience: 'Commercial horticulture & grain traders',
    totalDurationSeconds: 40,
    category: 'markets',
    coverEmoji: '📈',
    soundtrackLabel: 'Upbeat African Afro-Pop Beats',
    caption: 'Where is the best money for your harvest this week? Check wholesale rates from Mbare, Bulawayo, and GMB depots. 📈💵 #MbareMusika #ZimMarkets #CropProfits',
    hashtags: ['#AgriBusiness', '#ZimCommodities', '#MarketPrices', '#HorticultureProfits', '#SellSmart'],
    scenes: [
      {
        slideNumber: 1,
        durationSeconds: 10,
        headline: 'Don\'t Sell at Farm-Gate for Peanuts!',
        subtext: 'Know the verified wholesale rates before middle-men arrive.',
        bgGradient: 'from-amber-950 via-emerald-900 to-slate-950',
        emojiIcon: '💰',
        voiceoverEn: 'Middlemen will offer you half of what your harvest is worth. Here are the verified wholesale prices from major markets across Zimbabwe this week.',
        voiceoverSn: 'Makoronyera anoda kukutorera mbesa nemutengo wepasi. Onai mitengo yechokwadi iri kufamba pamisika mikuru muZimbabwe.',
        voiceoverNd: 'Osomabhizimusi bafuna ukukuthengela ngenani eliphansi. Nanka amanani eqiniso aphuma ezimakethe ezinkulu eZimbabwe.',
        highlightWords: ['Fair Prices', 'Wholesale Benchmark', 'No Middlemen']
      },
      {
        slideNumber: 2,
        durationSeconds: 15,
        headline: 'Top High-Demand Crops This Week',
        subtext: 'Soya Beans: $580/t • Shelled Groundnuts: $16/tin • White Maize: $14.50/bag',
        bgGradient: 'from-emerald-950 via-teal-900 to-slate-900',
        emojiIcon: '🥜',
        voiceoverEn: 'Soya beans are paying $580 per tonne at GMB and oil expressers. Shelled groundnuts are flying off the floor at $16 per 20-litre tin.',
        voiceoverSn: 'Soya beans iri kutengwa $580 patani nevanogadzira mafuta. Nzungu dzakatsokwa dziri pa $16 petini ye 20 litres.',
        voiceoverNd: 'Indumba zeSoya zibiza amadola angamakhulu amahlanu lamatshumi ayisikhombisa ngetani. Amantongomane ehlutshiweyo abiza $16.',
        highlightWords: ['Soya $580', 'Groundnuts $16', 'Maize $14.50']
      },
      {
        slideNumber: 3,
        durationSeconds: 15,
        headline: 'Get Live Daily Prices on Your Phone Free',
        subtext: 'Tap into Farmers Dictionary Zw for real-time ZiG & USD price feeds.',
        bgGradient: 'from-slate-900 via-emerald-900 to-emerald-950',
        emojiIcon: '📲',
        voiceoverEn: 'Want daily price updates sent directly to your WhatsApp? Open Farmers Dictionary Zw and never get short-changed again!',
        voiceoverSn: 'Unoda kuwana mitengo yemazuva ese pa WhatsApp yako? Vhura Farmers Dictionary Zw ugogara uine ruzivo!',
        voiceoverNd: 'Ufuna ukuthola amanani ansukuzonke ku WhatsApp yakho? Vula Farmers Dictionary Zw uhlale ulolwazi!',
        highlightWords: ['Daily WhatsApp', 'Free Agro App', 'Maximize Profits']
      }
    ]
  }
];

export const INITIAL_PUBLISHED_FEED: FacebookPublishedPost[] = [
  {
    id: 'post-fb-001',
    type: 'post',
    title: 'Daily Market Update - Mbare Musika',
    message: `🌽 TODAY'S ZIMBABWE FARMERS MARKET UPDATE 🌽\nWhite Maize 50kg: $14.50 ⬆️ | Tomatoes (30kg crate): $18.00 ⬇️ | Soya Beans GMB: $580/tonne 🔥. Check regional comparisons in the Farmers Dictionary Zw app!`,
    createdAt: '2 hours ago',
    permalinkUrl: 'https://facebook.com/farmersdictionaryzw/posts/1049281728',
    likesCount: 142,
    commentsCount: 38,
    sharesCount: 29,
    reachCount: 3820,
    thumbnailUrl: '',
    status: 'published'
  },
  {
    id: 'reel-fb-001',
    type: 'reel',
    title: 'Pfumvudza 5-Step Planting Masterclass (Reel)',
    message: `Double your maize yield with this 15cm x 15cm basin precision method! Watch how 1 bottle cap of Compound D protects against mid-season drought. #Pfumvudza #ZimFarming #Reels`,
    createdAt: 'Yesterday at 16:30',
    permalinkUrl: 'https://facebook.com/reel/9284192019482',
    likesCount: 524,
    commentsCount: 87,
    sharesCount: 145,
    reachCount: 12450,
    thumbnailUrl: '',
    status: 'published'
  },
  {
    id: 'poll-fb-001',
    type: 'poll',
    title: 'National Planting Progress Poll',
    message: `Where are you on your Pfumvudza plots this season? React 👍 for basins dug & mulched, ❤️ for seeds emerging, 😮 waiting for rain! Drop your district below!`,
    createdAt: '3 days ago',
    permalinkUrl: 'https://facebook.com/farmersdictionaryzw/posts/1049280911',
    likesCount: 319,
    commentsCount: 164,
    sharesCount: 42,
    reachCount: 7920,
    thumbnailUrl: '',
    status: 'published'
  }
];
