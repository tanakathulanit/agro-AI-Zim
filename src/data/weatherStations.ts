export interface WeatherStation {
  id: string;
  name: string;
  code: string;
  district: string;
  province: string;
  naturalRegion: 'I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V';
  operator: 'MSD Zimbabwe' | 'Agritex AWS Network' | 'SADC Climate Centre' | 'Research Station';
  coordinates: { lat: number; lng: number };
  elevationM: number;
  status: 'Online / Transmitting' | 'Calibrating';
  lastTelemetryMinsAgo: number;
  // Hyper-local micro-climate telemetry
  airTempC: number;
  dewPointC: number;
  relativeHumidityPct: number;
  soilTemp5cmC: number;  // Seed zone temperature
  soilTemp10cmC: number; // Root zone temperature
  solarRadiationWm2: number;
  rainfall24hMm: number;
  rainfall7DaysMm: number;
  seasonalAccumulatedMm: number;
  evapotranspirationEt0MmDay: number;
  soilMoistureSaturationPct: number;
  windSpeedKmh: number;
  windDirection: string;
  microclimateAlerts: string[];
  plantingMoistureTriggered: boolean;
  diseaseInfectionRisk: 'Low' | 'Moderate' | 'High (Humid Blight Alert)';
}

export const ZIMBABWE_WEATHER_STATIONS: WeatherStation[] = [
  {
    id: 'domboshava-aws',
    name: 'Domboshava Agro-Met Station',
    code: 'MSD-ZW-042',
    district: 'Goromonzi',
    province: 'Mashonaland East',
    naturalRegion: 'IIa',
    operator: 'MSD Zimbabwe',
    coordinates: { lat: -17.61, lng: 31.14 },
    elevationM: 1530,
    status: 'Online / Transmitting',
    lastTelemetryMinsAgo: 4,
    airTempC: 25.4,
    dewPointC: 17.2,
    relativeHumidityPct: 76,
    soilTemp5cmC: 24.1,
    soilTemp10cmC: 22.8,
    solarRadiationWm2: 820,
    rainfall24hMm: 14.5,
    rainfall7DaysMm: 34.0,
    seasonalAccumulatedMm: 645,
    evapotranspirationEt0MmDay: 3.8,
    soilMoistureSaturationPct: 84,
    windSpeedKmh: 9.2,
    windDirection: 'ENE',
    microclimateAlerts: [
      'Cumulative 48h rain (31mm) satisfies Pfumvudza sowing threshold.',
      'Optimal seedbed temperature (24.1°C) promotes rapid 4-day maize emergence.',
    ],
    plantingMoistureTriggered: true,
    diseaseInfectionRisk: 'Moderate',
  },
  {
    id: 'henderson-aws',
    name: 'Henderson Research Station AWS',
    code: 'AGRITEX-MZ-008',
    district: 'Mazowe',
    province: 'Mashonaland Central',
    naturalRegion: 'IIa',
    operator: 'Agritex AWS Network',
    coordinates: { lat: -17.58, lng: 30.98 },
    elevationM: 1280,
    status: 'Online / Transmitting',
    lastTelemetryMinsAgo: 2,
    airTempC: 26.8,
    dewPointC: 18.0,
    relativeHumidityPct: 72,
    soilTemp5cmC: 25.6,
    soilTemp10cmC: 23.9,
    solarRadiationWm2: 860,
    rainfall24hMm: 18.2,
    rainfall7DaysMm: 42.5,
    seasonalAccumulatedMm: 765,
    evapotranspirationEt0MmDay: 4.1,
    soilMoistureSaturationPct: 89,
    windSpeedKmh: 11.5,
    windDirection: 'NE',
    microclimateAlerts: [
      'Deep red soil moisture reservoir at 89% saturation.',
      'Sowing window actively open for SC 719 and SC 637 long-season varieties.',
    ],
    plantingMoistureTriggered: true,
    diseaseInfectionRisk: 'Moderate',
  },
  {
    id: 'marondera-grasslands-aws',
    name: 'Grasslands Research Station Agro-AWS',
    code: 'MSD-ZW-014',
    district: 'Marondera',
    province: 'Mashonaland East',
    naturalRegion: 'IIb',
    operator: 'Research Station',
    coordinates: { lat: -18.18, lng: 31.50 },
    elevationM: 1610,
    status: 'Online / Transmitting',
    lastTelemetryMinsAgo: 6,
    airTempC: 23.2,
    dewPointC: 16.5,
    relativeHumidityPct: 81,
    soilTemp5cmC: 22.4,
    soilTemp10cmC: 21.0,
    solarRadiationWm2: 780,
    rainfall24hMm: 8.0,
    rainfall7DaysMm: 29.5,
    seasonalAccumulatedMm: 690,
    evapotranspirationEt0MmDay: 3.2,
    soilMoistureSaturationPct: 78,
    windSpeedKmh: 14.0,
    windDirection: 'SE',
    microclimateAlerts: [
      'Cool night temperatures (14°C) slow early fungal spore propagation.',
      'Moisture index favorable for Soya bean rhizobium inoculation.',
    ],
    plantingMoistureTriggered: true,
    diseaseInfectionRisk: 'Low',
  },
  {
    id: 'banket-chinhoyi-aws',
    name: 'Banket Agricultural Met Station',
    code: 'MSD-ZW-031',
    district: 'Makonde',
    province: 'Mashonaland West',
    naturalRegion: 'IIb',
    operator: 'MSD Zimbabwe',
    coordinates: { lat: -17.38, lng: 30.40 },
    elevationM: 1220,
    status: 'Online / Transmitting',
    lastTelemetryMinsAgo: 1,
    airTempC: 28.1,
    dewPointC: 17.4,
    relativeHumidityPct: 65,
    soilTemp5cmC: 26.8,
    soilTemp10cmC: 24.5,
    solarRadiationWm2: 910,
    rainfall24hMm: 6.4,
    rainfall7DaysMm: 31.0,
    seasonalAccumulatedMm: 698,
    evapotranspirationEt0MmDay: 4.6,
    soilMoistureSaturationPct: 76,
    windSpeedKmh: 8.5,
    windDirection: 'E',
    microclimateAlerts: [
      'High evaporative demand (4.6mm/day). Ensure mulch cover on Pfumvudza basins.',
    ],
    plantingMoistureTriggered: true,
    diseaseInfectionRisk: 'Low',
  },
  {
    id: 'chipinge-ratelshoek-aws',
    name: 'Ratelshoek Agro-Met Telemetry Node',
    code: 'MSD-ZW-088',
    district: 'Chipinge',
    province: 'Manicaland',
    naturalRegion: 'I',
    operator: 'MSD Zimbabwe',
    coordinates: { lat: -20.18, lng: 32.78 },
    elevationM: 1140,
    status: 'Online / Transmitting',
    lastTelemetryMinsAgo: 3,
    airTempC: 22.0,
    dewPointC: 19.5,
    relativeHumidityPct: 88,
    soilTemp5cmC: 21.5,
    soilTemp10cmC: 20.2,
    solarRadiationWm2: 640,
    rainfall24hMm: 28.0,
    rainfall7DaysMm: 68.5,
    seasonalAccumulatedMm: 1110,
    evapotranspirationEt0MmDay: 2.9,
    soilMoistureSaturationPct: 96,
    windSpeedKmh: 12.0,
    windDirection: 'ESE',
    microclimateAlerts: [
      'High relative humidity (88%) triggers High Blight / Anthracnose infection alert.',
      'Saturated soil: avoid heavy tractor traffic to prevent soil compaction.',
    ],
    plantingMoistureTriggered: true,
    diseaseInfectionRisk: 'High (Humid Blight Alert)',
  },
  {
    id: 'thornhill-gweru-aws',
    name: 'Thornhill Synoptic Weather Station',
    code: 'MSD-ZW-019',
    district: 'Gweru',
    province: 'Midlands',
    naturalRegion: 'III',
    operator: 'MSD Zimbabwe',
    coordinates: { lat: -19.45, lng: 29.85 },
    elevationM: 1428,
    status: 'Online / Transmitting',
    lastTelemetryMinsAgo: 5,
    airTempC: 27.2,
    dewPointC: 14.8,
    relativeHumidityPct: 58,
    soilTemp5cmC: 26.2,
    soilTemp10cmC: 24.1,
    solarRadiationWm2: 890,
    rainfall24hMm: 4.0,
    rainfall7DaysMm: 22.0,
    seasonalAccumulatedMm: 525,
    evapotranspirationEt0MmDay: 4.8,
    soilMoistureSaturationPct: 62,
    windSpeedKmh: 15.2,
    windDirection: 'SE',
    microclimateAlerts: [
      'Soil moisture at 62%. Short dry spell (3 days) underway.',
      'Planting window requires 12mm top-up shower before sowing medium-maturity maize.',
    ],
    plantingMoistureTriggered: false,
    diseaseInfectionRisk: 'Low',
  },
  {
    id: 'gokwe-nembudziya-aws',
    name: 'Nembudziya Agritex AWS Node',
    code: 'AGRITEX-GK-004',
    district: 'Gokwe South',
    province: 'Midlands',
    naturalRegion: 'IV',
    operator: 'Agritex AWS Network',
    coordinates: { lat: -18.20, lng: 28.94 },
    elevationM: 910,
    status: 'Online / Transmitting',
    lastTelemetryMinsAgo: 7,
    airTempC: 31.4,
    dewPointC: 15.0,
    relativeHumidityPct: 49,
    soilTemp5cmC: 31.0,
    soilTemp10cmC: 28.2,
    solarRadiationWm2: 950,
    rainfall24hMm: 0.0,
    rainfall7DaysMm: 16.5,
    seasonalAccumulatedMm: 438,
    evapotranspirationEt0MmDay: 5.6,
    soilMoistureSaturationPct: 48,
    windSpeedKmh: 10.8,
    windDirection: 'NE',
    microclimateAlerts: [
      'Elevated soil surface temperature (31°C). Prioritize Sorghum (SV-2) and Pearl Millet.',
      'Severe evapotranspiration (5.6mm/day): thick mulch layer strictly required.',
    ],
    plantingMoistureTriggered: false,
    diseaseInfectionRisk: 'Low',
  },
  {
    id: 'chiredzi-triangle-aws',
    name: 'Triangle Lowveld Agro-Met Node',
    code: 'MSD-ZW-073',
    district: 'Chiredzi',
    province: 'Masvingo',
    naturalRegion: 'V',
    operator: 'SADC Climate Centre',
    coordinates: { lat: -21.02, lng: 31.45 },
    elevationM: 420,
    status: 'Online / Transmitting',
    lastTelemetryMinsAgo: 2,
    airTempC: 34.6,
    dewPointC: 16.2,
    relativeHumidityPct: 42,
    soilTemp5cmC: 33.8,
    soilTemp10cmC: 30.5,
    solarRadiationWm2: 990,
    rainfall24hMm: 0.0,
    rainfall7DaysMm: 8.0,
    seasonalAccumulatedMm: 318,
    evapotranspirationEt0MmDay: 6.4,
    soilMoistureSaturationPct: 36,
    windSpeedKmh: 13.5,
    windDirection: 'E',
    microclimateAlerts: [
      'Extreme heat stress index for conventional maize.',
      'Only drought-hardy small grains (Inyawuthi/Mhunga) or supplemental irrigation feasible.',
    ],
    plantingMoistureTriggered: false,
    diseaseInfectionRisk: 'Low',
  },
  {
    id: 'lupane-university-aws',
    name: 'Lupane Agro-Telemetry Node',
    code: 'MSD-ZW-056',
    district: 'Lupane',
    province: 'Matabeleland North',
    naturalRegion: 'IV',
    operator: 'Agritex AWS Network',
    coordinates: { lat: -18.93, lng: 27.75 },
    elevationM: 980,
    status: 'Online / Transmitting',
    lastTelemetryMinsAgo: 8,
    airTempC: 30.2,
    dewPointC: 15.5,
    relativeHumidityPct: 52,
    soilTemp5cmC: 29.5,
    soilTemp10cmC: 27.0,
    solarRadiationWm2: 920,
    rainfall24hMm: 2.5,
    rainfall7DaysMm: 19.0,
    seasonalAccumulatedMm: 420,
    evapotranspirationEt0MmDay: 5.1,
    soilMoistureSaturationPct: 45,
    windSpeedKmh: 11.0,
    windDirection: 'NNE',
    microclimateAlerts: [
      'Kalahari sand filtration rate very fast. Basin water retention critical.',
      'Pearl Millet PMV-3 and Nyimo recommended.',
    ],
    plantingMoistureTriggered: false,
    diseaseInfectionRisk: 'Low',
  },
  {
    id: 'gwanda-colenbrander-aws',
    name: 'Gwanda Colenbrander Met Station',
    code: 'MSD-ZW-067',
    district: 'Gwanda',
    province: 'Matabeleland South',
    naturalRegion: 'V',
    operator: 'MSD Zimbabwe',
    coordinates: { lat: -20.93, lng: 29.02 },
    elevationM: 960,
    status: 'Online / Transmitting',
    lastTelemetryMinsAgo: 3,
    airTempC: 32.8,
    dewPointC: 13.0,
    relativeHumidityPct: 38,
    soilTemp5cmC: 32.5,
    soilTemp10cmC: 29.2,
    solarRadiationWm2: 970,
    rainfall24hMm: 0.0,
    rainfall7DaysMm: 5.0,
    seasonalAccumulatedMm: 285,
    evapotranspirationEt0MmDay: 6.0,
    soilMoistureSaturationPct: 31,
    windSpeedKmh: 16.0,
    windDirection: 'ESE',
    microclimateAlerts: [
      'Low moisture reservoir (31%). Livestock veld grazing browse protection advised.',
      'Protect goats against thorny tick encroachment along dry riverbeds.',
    ],
    plantingMoistureTriggered: false,
    diseaseInfectionRisk: 'Low',
  },
];

/**
 * Calculates distance in kilometers between two geo-coordinates using Haversine formula
 */
export function calculateHaversineDistanceKm(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export interface StationWithDistance extends WeatherStation {
  distanceKm: number;
}

/**
 * Ranks all weather stations by proximity to the farmer's current coordinates
 */
export function getStationsRankedByProximity(
  farmerLat: number, 
  farmerLng: number
): StationWithDistance[] {
  return ZIMBABWE_WEATHER_STATIONS.map(station => {
    const distanceKm = calculateHaversineDistanceKm(
      farmerLat,
      farmerLng,
      station.coordinates.lat,
      station.coordinates.lng
    );
    return {
      ...station,
      distanceKm,
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}
