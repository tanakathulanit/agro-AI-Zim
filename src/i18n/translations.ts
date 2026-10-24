/**
 * Farmers Dictionary Zw - Multilingual Translations
 * Languages supported:
 * - English (en): Official national language
 * - Shona (sn): ChiShona (Spoken by ~75% of Zimbabwean population across Mashonaland, Manicaland, Masvingo, Midlands)
 * - Ndebele (nd): isiNdebele (Spoken by ~20% of Zimbabwean population across Matabeleland North & South, Bulawayo, Midlands)
 */

export type Language = 'en' | 'sn' | 'nd';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  regionHint: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇿🇼',
    regionHint: 'National & Administrative'
  },
  {
    code: 'sn',
    name: 'Shona',
    nativeName: 'ChiShona',
    flag: '🇿🇼',
    regionHint: 'Mashonaland, Manicaland, Masvingo'
  },
  {
    code: 'nd',
    name: 'Ndebele',
    nativeName: 'isiNdebele',
    flag: '🇿🇼',
    regionHint: 'Matabeleland, Bulawayo, Midlands'
  }
];

export const TRANSLATIONS = {
  en: {
    // Header & Brand
    app_title: 'Farmers Dictionary Zw',
    app_subtitle: 'SMART AGRO-ADVISORY & FIELD DICTIONARY',
    app_description: 'Zimbabwe Agricultural Knowledge Engine • Natural Regions I - V • Connected to WhatsApp',
    select_location: 'Select District',
    gps_detect: 'GPS Auto-Detect',
    gps_locating: 'Locating...',
    language_select: 'Language',
    connect_whatsapp: 'Connect WhatsApp',
    whatsapp_active: 'WhatsApp Active',
    
    // Ticker
    msd_bulletin: 'MSD AGRI-BULLETIN',
    gmb_benchmark: 'GMB Grade A: $335/tonne',
    rate_benchmark: 'USD/ZiG: 28.50',
    agritex_live: 'Field Advisory Live',

    // Navigation Tabs
    tab_crops: '1. Crop Advisor',
    tab_planner: '2. Planting & Harvest Planner',
    tab_weather: '3. Weather Stations Network',
    tab_yield: '4. Yield Prediction & Audit',
    tab_health: '5. AI Health Scanner & Agrochemicals',
    tab_geofence: '6. Livestock Geo-Fencing',
    tab_market: '7. Market Price Discovery',
    tab_forum: '8. Community Forum (Dare)',
    tab_advisor: '9. Farm Agronomist AI',
    tab_soil: '10. Soil Quality Assessment',
    tab_dictionary: '11. Farmers Dictionary & WhatsApp',
    tab_manuals: '12. Crop Manuals & Registered Chemicals',
    tab_profile: '13. Farmer Profile & Personalized Advisory',
    tab_facebook: '14. Facebook Page & Reels Studio',
    soil_tool_title: 'Soil Quality, Fertilizer & Moisture Advisor',
    soil_tool_subtitle: 'Zimbabwe Natural Regions I - V • Soil Texture Diagnostics & Precision Pfumvudza Dosing',

    // Offline Manager
    offline_status_online: 'Live Online • Satellite & Agro-Telemetry Active',
    offline_status_offline: 'Offline Mode Active • Running On-Device Zimbabwe Agro Database',
    offline_sync_pending: 'Records queued in offline outbox for automatic sync',

    // Dekad Alert Banner
    dekad_badge: 'DEKAD RAINFALL & PLANTING ALERT',
    dekad_sowing_favorable: 'SOWING CONDITIONS FAVORABLE',
    dekad_sowing_moderate: 'MARGINAL SOWING CONDITIONS',
    dekad_sowing_wait: 'PREPARE BASINS - WAIT FOR SUFFICIENT RAIN',
    dekad_moisture_level: 'Pfumvudza Basin Moisture',
    dekad_recommended_crops: 'Recommended for Immediate Sowing:',
    dekad_action_advisor: 'Open in Crop Advisor',
    dekad_action_schedule: 'Inspect Dekad Calendar',
    dekad_close: 'Dismiss Alert',

    // Health Scanner & Outbreak Heatmap
    scanner_title: 'Plant & Livestock Health Diagnostic System',
    scanner_subtitle: 'Field Camera Scanner • EPPO & DR&SS Certified',
    scanner_camera_btn: 'Field Camera Scanner',
    scanner_heatmap_btn: 'Outbreak Heat Map',
    scanner_db_btn: 'Pest & Disease Database',
    scanner_chemicals_btn: 'Agrochemical Register',
    scanner_nearby_alerts: 'Active Threats ≤ 50km',
    scanner_outbreak_banner: 'Community Outbreak Alert: Verified pests reported near your farm.',
    scanner_view_heatmap: 'View Heat Map',

    // Community & Outbreaks
    outbreak_report_btn: 'Report Field Outbreak',
    outbreak_distance_from_farm: 'from Your Farm',
    outbreak_high_risk: 'HIGH THREAT VECTOR',
    outbreak_confirm_btn: 'I Spotted This Too (+1)',
    outbreak_reported_by: 'Reported by',
    outbreak_symptoms: 'Observed Field Symptoms',
    outbreak_containment: 'Prescribed Immediate Containment',

    // Common Actions
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    filter: 'Filter',
    download: 'Download',
    back: 'Back',
    confirm: 'Confirm',
    close: 'Close',
    details: 'View Details',
    loading: 'Loading...'
  },

  sn: {
    // Header & Brand
    app_title: 'Farmers Dictionary Zw',
    app_subtitle: 'DURA REZIVO REKURIMA NEWHATSAPP',
    app_description: 'Dura reRuzivo rweVarimi vemuZimbabwe • Matunhu I - V • Yakabatana neWhatsApp',
    select_location: 'Sarudza Dunhu Rako',
    gps_detect: 'Tsvaga Pano paGPS',
    gps_locating: 'Kutsvaga nzvimbo...',
    language_select: 'Mutauro',
    connect_whatsapp: 'Batana paWhatsApp',
    whatsapp_active: 'WhatsApp paMhepo',
    
    // Ticker
    msd_bulletin: 'CHIZIVISO CHEMAMIRIRO EKUNZE (MSD)',
    gmb_benchmark: 'GMB Giredhi A: $335/tani',
    rate_benchmark: 'USD/ZiG: 28.50',
    agritex_live: 'Unyanzvi paMhepo',

    // Navigation Tabs
    tab_crops: '1. Zano reZvirimwa',
    tab_planner: '2. Urongwa hweKudyara neKukohwa',
    tab_weather: '3. Mukana weMamiriro ekunze',
    tab_yield: '4. Kufungidzira Zvibereko',
    tab_health: '5. Ongororo yeZvirwere neMushonga',
    tab_geofence: '6. Kutarisa Zvipfuyo neMuganhu',
    tab_market: '7. Mitengo yeMisika (Mbare/GMB)',
    tab_forum: '8. Dare reVarimi (Forum)',
    tab_advisor: '9. Mudzidzisi weZvekurima AI',
    tab_soil: '10. Ongororo yeIvhu neFetereza',
    tab_dictionary: '11. Duramazwi reVarimi neWhatsApp',
    tab_manuals: '12. Mabhuku eKurima neMishonga Yakanyoreswa',
    tab_profile: '13. Nhoroondo yeMurimi & Zano Rokurima',
    tab_facebook: '14. Facebook Page & Reels Studio',
    soil_tool_title: 'Ongororo yeHutano hweIvhu neKuchengetedza Mvura',
    soil_tool_subtitle: 'Matunhu eKurima I - V • Hupenyu hweIvhu neZviyero zvePfumvudza',

    // Offline Manager
    offline_status_online: 'Iri paIndaneti • Mashoko emamiriro ekunze ari kubuda zvakanaka',
    offline_status_offline: 'Pasina Indaneti (Offline) • Ruzivo rwuri kushanda mufoni mako',
    offline_sync_pending: 'Mashoko akachengetwa achazotumirwa kana indaneti yadzoka',

    // Dekad Alert Banner
    dekad_badge: 'CHIZIVISO CHEMABASA EKUDYARA (DEKAD)',
    dekad_sowing_favorable: 'MAMIRIRO EKUDYARA AKANAKA KWAMBZO',
    dekad_sowing_moderate: 'NYORO ICHIRI PASI - CHENJERAI',
    dekad_sowing_wait: 'CHERA MAKOFU - CHIRIRA MVURA YAKAKWANA',
    dekad_moisture_level: 'Hunyoro mumakofu ePfumvudza',
    dekad_recommended_crops: 'Zvirimwa zvinokurudzirwa kudyara izvozvi:',
    dekad_action_advisor: 'Tarisa muZano reZvirimwa',
    dekad_action_schedule: 'Tarisa Karenda yeDekad',
    dekad_close: 'Vhara Chiziviso',

    // Health Scanner & Outbreak Heatmap
    scanner_title: 'Ongororo yeHutano hweZvirimwa neZvipfuyo',
    scanner_subtitle: 'Kamera yeMumunda • Zvakabvumidzwa neEPPO neDR&SS',
    scanner_camera_btn: 'Kamera yeMumunda',
    scanner_heatmap_btn: 'Mepu yeHutachiona (Heat Map)',
    scanner_db_btn: 'Tura reZvipembenene neZvirwere',
    scanner_chemicals_btn: 'Mushonga Wakanyoreswa weKurima',
    scanner_nearby_alerts: 'Ngozi Dzinotyisa mukati me50km',
    scanner_outbreak_banner: 'Chiziviso cheHutachiona: Varimi vakaona mhungu nezvirwere pedyo nemunda wako.',
    scanner_view_heatmap: 'Vhura Mepu yeHutachiona',

    // Community & Outbreaks
    outbreak_report_btn: 'Shuma Hutachiona hweMumunda',
    outbreak_distance_from_farm: 'kubva pamunda wako',
    outbreak_high_risk: 'NGOZI HURU YEKUTAPUKIRA',
    outbreak_confirm_btn: 'Ndakaonawo Izvi Pano (+1)',
    outbreak_reported_by: 'Zvashumwa na',
    outbreak_symptoms: 'Zviratidzo zvakaonekwa mumunda',
    outbreak_containment: 'Matanho ekumisa kupararira kwechimbichimbi',

    // Common Actions
    save: 'Sevha',
    cancel: 'Kanzura',
    search: 'Tsvaga',
    filter: 'Sefa',
    download: 'Dhaunirodha',
    back: 'Dzokera Shure',
    confirm: 'Tsinhiro',
    close: 'Vhara',
    details: 'Tarisa Zvizere',
    loading: 'Zviri kurodha...'
  },

  nd: {
    // Header & Brand
    app_title: 'Farmers Dictionary Zw',
    app_subtitle: 'ISICHAZAMAZWI SABALIMI LEWHATSAPP',
    app_description: 'Isiphala Solwazi Lwabalimi baseZimbabwe • Izabelo I - V • Ixhumene leWhatsApp',
    select_location: 'Khetha Isigaba Sakho',
    gps_detect: 'Dinga NgeGPS',
    gps_locating: 'Ukudinga indawo...',
    language_select: 'Ulimi',
    connect_whatsapp: 'Xhumana kuWhatsApp',
    whatsapp_active: 'WhatsApp Isebenza',
    
    // Ticker
    msd_bulletin: 'UMBIKO WOMKHATHI WEZULU (MSD)',
    gmb_benchmark: 'GMB Ibanga A: $335/ithani',
    rate_benchmark: 'USD/ZiG: 28.50',
    agritex_live: 'Ucebiso Lwezolimo Lukhona',

    // Navigation Tabs
    tab_crops: '1. Umcebisi Wezilimo',
    tab_planner: '2. Uhlelo Lokuhlanyela Lokuvuna',
    tab_weather: '3. Isiteshi Zomkhathi Wezulu',
    tab_yield: '4. Isilinganiso Sesivuno',
    tab_health: '5. Ukuhlola Imikhuhlane Lemithi',
    tab_geofence: '6. Ukulinda Izifuyo Ngefence',
    tab_market: '7. Intengo Zezimakethe (Renkini/GMB)',
    tab_forum: '8. Inkundla Yabalimi (Dare)',
    tab_advisor: '9. Umcebisi Wezokulima AI',
    tab_soil: '10. Ukuhlolwa Komhlabathi Lemvundiso',
    tab_dictionary: '11. Isichazamazwi Sabalimi leWhatsApp',
    tab_manuals: '12. Amabhuku Ezilimo Lemithi Ebhalisiweyo',
    tab_profile: '13. Iphrofayili Yomlimi Lokwelulekwa',
    tab_facebook: '14. I-Facebook Page & Reels Studio',
    soil_tool_title: 'Uhlelo Lokuhlola Umhlabathi Lokulondoloza Amanzi',
    soil_tool_subtitle: 'Izabelo ZeZimbabwe I - V • Isilinganiso Sezakhi Zomhlabathi Le-Intwasa',

    // Offline Manager
    offline_status_online: 'Ku-inthanethi • Imbiko yomkhathi isebenza kuhle',
    offline_status_offline: 'Ngaphandle Kwe-inthanethi (Offline) • Isebenza ngefoni kuphela',
    offline_sync_pending: 'Imbiko igciniwe izathunyelwa nxa inthanethi isibuyile',

    // Dekad Alert Banner
    dekad_badge: 'UMBIKO WEZULU LOKUHLANYELA (DEKAD)',
    dekad_sowing_favorable: 'ISIKHATHI SOKUHLANYELA SIHLANZEKILE',
    dekad_sowing_moderate: 'UMHLABA USOMILE KHATSHANA - QAPHELA',
    dekad_sowing_wait: 'LUNGISELELA AMAGODI - LINDA IZULU ELANELEYO',
    dekad_moisture_level: 'Ukuswakama emagodini e-Intwasa',
    dekad_recommended_crops: 'Izilimo ezilungele ukuhlanyelwa manje:',
    dekad_action_advisor: 'Vula kuMcebisi Wezilimo',
    dekad_action_schedule: 'Hlola Ikhalenda le-Dekad',
    dekad_close: 'Vala Umbiko',

    // Health Scanner & Outbreak Heatmap
    scanner_title: 'Uhlelo Lokuhlola Impilakahle Yezilimo Lezifuyo',
    scanner_subtitle: 'Ikhamera Yensimu • Iqinisekiswe yi-EPPO le-DR&SS',
    scanner_camera_btn: 'Ikhamera Yensimu',
    scanner_heatmap_btn: 'Imephu Yemikhuhlane (Heat Map)',
    scanner_db_btn: 'Imininingwane Yezinambuzane Lemikhuhlane',
    scanner_chemicals_btn: 'Imithi Yokulima Ebhalisiweyo',
    scanner_nearby_alerts: 'Ingozi Ezingaphakathi kwe-50km',
    scanner_outbreak_banner: 'Isixwayiso: Abalimi babike izinambuzane lemikhuhlane eduzane lensimu yakho.',
    scanner_view_heatmap: 'Vula Imephu Yemikhuhlane',

    // Community & Outbreaks
    outbreak_report_btn: 'Bika Umkhuhlane Wensimu',
    outbreak_distance_from_farm: 'ukusuka ensimini yakho',
    outbreak_high_risk: 'INGOZI ENKULU YOKUTHELELANA',
    outbreak_confirm_btn: 'Ngibone Lokhu Lami (+1)',
    outbreak_reported_by: 'Kubikwe ngu',
    outbreak_symptoms: 'Izibonakaliso ezibonwe ensimini',
    outbreak_containment: 'Izinyathelo zokuqeda umkhuhlane masinya',

    // Common Actions
    save: 'Gcina',
    cancel: 'Cima',
    search: 'Dinga',
    filter: 'Hluza',
    download: 'Donsa',
    back: 'Buyela Emuva',
    confirm: 'Qinisekisa',
    close: 'Vala',
    details: 'Bona Kabanzi',
    loading: 'Kulayisha...'
  }
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;
