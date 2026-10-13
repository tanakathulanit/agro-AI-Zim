/**
 * Extreme Weather Push Notification & Micro-Climate Hazard Engine
 * Evaluates hyper-local telemetry from Zimbabwe weather stations to alert smallholder farmers.
 */

import { WeatherStation } from '../data/weatherStations';
import { ZimbabweLocation } from '../data/zimbabweLocations';

export type WeatherHazardType = 
  | 'SEVERE_STORM_HAIL' 
  | 'EXTREME_HEATWAVE' 
  | 'FLASH_FLOOD_CYCLONE' 
  | 'WINTER_FROST_ALERT' 
  | 'LIGHTNING_GALE_WARNING';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'ADVISORY';

export interface WeatherNotificationAlert {
  id: string;
  hazardType: WeatherHazardType;
  severity: AlertSeverity;
  title: string;
  summary: string;
  reportingStationName: string;
  distanceKm: number;
  triggerMetric: string; // e.g. "Air Temp: 38.6°C" or "Forecast: 65mm / 3h"
  timestamp: string;
  actionableFarmChecklist: string[];
  affectedEnterprises: ('Maize' | 'Horticulture' | 'Livestock' | 'Granaries' | 'Pfumvudza Basins')[];
  shonaAlertSummary: string;
  ndebeleAlertSummary: string;
  isRead?: boolean;
}

/**
 * Synthesizes an alert chime using Web Audio API
 */
export function playAlertChime(severity: AlertSeverity = 'CRITICAL') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = severity === 'CRITICAL' ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(severity === 'CRITICAL' ? 880 : 587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      severity === 'CRITICAL' ? 440 : 440, 
      ctx.currentTime + 0.4
    );

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);

    // Haptic vibration if supported on mobile
    if ('vibrate' in navigator) {
      if (severity === 'CRITICAL') {
        navigator.vibrate([250, 100, 250, 100, 400]);
      } else {
        navigator.vibrate([150, 80, 150]);
      }
    }
  } catch (err) {
    console.warn('Audio alert not allowed or supported:', err);
  }
}

/**
 * Dispatches a native browser push notification if permission granted
 */
export async function sendNativePushNotification(alert: WeatherNotificationAlert): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(`🚨 ${alert.title}`, {
        body: `${alert.summary} Station: ${alert.reportingStationName} (${alert.distanceKm}km).`,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: alert.id,
      });
      playAlertChime(alert.severity);
      return true;
    } catch (e) {
      console.warn('Native notification dispatch error:', e);
    }
  }
  return false;
}

/**
 * Evaluates current weather station data & micro-climate for hazard conditions
 */
export function evaluateWeatherHazards(
  station: WeatherStation,
  location: ZimbabweLocation,
  distanceKm: number
): WeatherNotificationAlert[] {
  const alerts: WeatherNotificationAlert[] = [];
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Extreme Heatwave Hazard (temps > 33°C or solar > 900W/m²)
  if (station.airTempC >= 32.5 || station.evapotranspirationEt0MmDay >= 5.5) {
    alerts.push({
      id: `alert-heat-${station.id}-${Date.now()}`,
      hazardType: 'EXTREME_HEATWAVE',
      severity: station.airTempC >= 35.0 ? 'CRITICAL' : 'WARNING',
      title: `Extreme Heatwave & Moisture Desiccation Hazard (${station.airTempC}°C)`,
      summary: `Dangerous evaporative stress (${station.evapotranspirationEt0MmDay} mm/day loss) detected at ${station.name}. Rapid wilting risk for young crops.`,
      reportingStationName: station.name,
      distanceKm,
      triggerMetric: `Ambient Temp: ${station.airTempC}°C • ET₀: ${station.evapotranspirationEt0MmDay} mm/day`,
      timestamp: `Today at ${now}`,
      actionableFarmChecklist: [
        'Add an extra 5cm dry mulch layer into Pfumvudza basins immediately to shield root zone.',
        'Do NOT apply foliar agrochemicals between 10:00 AM and 3:30 PM (causes severe chemical leaf scorch).',
        'Herd cattle and goats to shaded paddock shelters; ensure clean water troughs are replenished twice daily.',
        'Irrigate vegetables late evening after 5:00 PM to maximize moisture penetration.',
      ],
      affectedEnterprises: ['Maize', 'Horticulture', 'Livestock', 'Pfumvudza Basins'],
      shonaAlertSummary: 'Kupisa kwakanyanya: Wedzerai mashanga (mulch) mumakomba ePfumvudza kuti muviri wevhu usapwa nemhepo inopisa.',
      ndebeleAlertSummary: 'Ukutshisa okukhulu: Faka utshani obomileyo ezigodini ze-Intwasa ukuvikela umswakama womhlabathi.',
    });
  }

  // 2. Severe Storm & Hail Hazard (rainfall > 25mm/24h or relative humidity > 85%)
  if (station.rainfall24hMm >= 18.0 || station.relativeHumidityPct >= 85) {
    alerts.push({
      id: `alert-storm-${station.id}-${Date.now()}`,
      hazardType: 'SEVERE_STORM_HAIL',
      severity: station.rainfall24hMm >= 25.0 ? 'CRITICAL' : 'WARNING',
      title: `Severe Thunderstorm & Torrential Downpour Alert (${station.rainfall24hMm}mm / 24h)`,
      summary: `Violent convection storm cells active near ${station.name}. High risk of waterlogging, Pfumvudza basin overflow, and crop lodging.`,
      reportingStationName: station.name,
      distanceKm,
      triggerMetric: `24h Rain: ${station.rainfall24hMm}mm • Soil Saturation: ${station.soilMoistureSaturationPct}%`,
      timestamp: `Today at ${now}`,
      actionableFarmChecklist: [
        'Clear overflow drainage furrows around contour ridges to stop flash flooding across basins.',
        'Stake and hill up loose soil around knee-high maize stems to prevent wind snap.',
        'Secure granaries (Dura) with elevated tarpaulins against water seepage.',
        'Check livestock kraals: move animals to dry elevated ground to prevent wet hoof-rot.',
      ],
      affectedEnterprises: ['Maize', 'Pfumvudza Basins', 'Granaries', 'Livestock'],
      shonaAlertSummary: 'Mvura zhinji ine mabhanan’ana nemhepo: Gadzirai mifuku yekutsausa mvura yemafashamo muminda.',
      ndebeleAlertSummary: 'Izulu elilamandla lemvula enengi: Vula imisele yokukhwelisa amanzi emasimini.',
    });
  }

  // 3. Lightning & Gale Wind Warning
  if (station.windSpeedKmh >= 15.0) {
    alerts.push({
      id: `alert-wind-${station.id}-${Date.now()}`,
      hazardType: 'LIGHTNING_GALE_WARNING',
      severity: 'WARNING',
      title: `Gale Force Wind & Severe Lightning Threat (${station.windSpeedKmh} km/h ${station.windDirection})`,
      summary: `Gusty wind squalls preceding thunderstorm detected by ${station.name} anemometer. High lightning strike index across communal lands.`,
      reportingStationName: station.name,
      distanceKm,
      triggerMetric: `Wind Speed: ${station.windSpeedKmh} km/h (${station.windDirection})`,
      timestamp: `Today at ${now}`,
      actionableFarmChecklist: [
        'Herd children and livestock indoors before dark storm clouds arrive.',
        'Avoid seeking shelter under lone tall trees or touching wire fence perimeters in fields.',
        'Anchor solar borehole pump arrays and nursery shade nets.',
      ],
      affectedEnterprises: ['Horticulture', 'Livestock', 'Granaries'],
      shonaAlertSummary: 'Mhepo ine mheni yakasimba: Chengetedzai zvipfuyo mumadanga uye musambomira pasi pemiti mirefu panguva yemheni.',
      ndebeleAlertSummary: 'Umoya omkhulu lezulu elilemidumo: Ngenisani izifuyo ezibayeni njalo lingemi phansi kwezihlahla ezinde.',
    });
  }

  // If station is currently calm, return at least 1 informative seasonal advisory
  if (alerts.length === 0) {
    alerts.push({
      id: `alert-advisory-${station.id}-${Date.now()}`,
      hazardType: 'SEVERE_STORM_HAIL',
      severity: 'ADVISORY',
      title: `Micro-Climate Baseline Normal: ${station.name}`,
      summary: `Atmospheric conditions stable (${station.airTempC}°C, ${station.rainfall7DaysMm}mm 7-day total). No extreme hazard flags active.`,
      reportingStationName: station.name,
      distanceKm,
      triggerMetric: `Soil Temp: ${station.soilTemp5cmC}°C • Moisture: ${station.soilMoistureSaturationPct}%`,
      timestamp: `Today at ${now}`,
      actionableFarmChecklist: [
        'Routine field scouting for Fall Armyworm (Mhungu).',
        'Maintain weed-free basins during vegetative growth.',
      ],
      affectedEnterprises: ['Maize', 'Pfumvudza Basins'],
      shonaAlertSummary: 'Mamiriro ekunze akatsiga parizvino. Rambai muchicherechedza zvipembenene muminda.',
      ndebeleAlertSummary: 'Umkhathi uzinzile okwamanje. Qhubekani lihlole izilwanyana emasimini.',
    });
  }

  return alerts;
}

/**
 * Pre-configured simulated scenarios for testing
 */
export const SIMULATED_EXTREME_SCENARIOS: Record<string, Omit<WeatherNotificationAlert, 'id' | 'timestamp'>> = {
  hail_storm: {
    hazardType: 'SEVERE_STORM_HAIL',
    severity: 'CRITICAL',
    title: 'EMERGENCY: Severe Hailstorm & Gale Force Squall Forecast (65mm / 2h)',
    summary: 'MSD Doppler Radar reports active supercell cloud heading rapidly toward your communal ward with marble-sized hail and 55 km/h gusts.',
    reportingStationName: 'Henderson Agro-Met Station',
    distanceKm: 9.2,
    triggerMetric: 'Radar Reflectivity: 58 dBZ • Hail Risk: 85%',
    actionableFarmChecklist: [
      'Cover high-value tomato nurseries with shade nets or straw thatch immediately.',
      'Open contour drainage ends to evacuate excess water and prevent basin siltation.',
      'Kraal all cattle and goats early away from unreinforced river banks.',
      'Stay indoors away from metal roofs and wire fences.',
    ],
    affectedEnterprises: ['Maize', 'Horticulture', 'Livestock', 'Pfumvudza Basins'],
    shonaAlertSummary: 'CHIZIVISO CHENJODZI: Mvura yechichando (chimvuramabwe) ine mhepo ine simba iri kuuya mumaawa maviri.',
    ndebeleAlertSummary: 'ISIXWAYISO ESIKHULU: Izulu lesiphepho lesiqhotho elilamandla likhangelelwe emasimini enu.',
  },
  heatwave_drought: {
    hazardType: 'EXTREME_HEATWAVE',
    severity: 'CRITICAL',
    title: 'CRITICAL HEATWAVE ALERT: 40.5°C Desiccation Wave in Lowveld',
    summary: 'Consecutive 4-day extreme heatwave exceeding 40°C with severe desiccating dry winds. Extreme crop moisture evaporation rate (7.2mm/day).',
    reportingStationName: 'Triangle Lowveld Agro-Met Node',
    distanceKm: 14.8,
    triggerMetric: 'Ambient Temp: 40.5°C • Solar: 1,020 W/m²',
    actionableFarmChecklist: [
      'Add 8cm thick mulch into planting basins to protect root temperature.',
      'Provide shaded shelters and double drinking water access for cattle to prevent heat exhaustion.',
      'Halt all midday fertilizer and chemical spraying (severe burn risk).',
      'Harvest mature sweet potato tubers to prevent baking in hot soils.',
    ],
    affectedEnterprises: ['Maize', 'Horticulture', 'Livestock', 'Pfumvudza Basins'],
    shonaAlertSummary: 'KUPISA KWAKANYANYISA: Zuva riri kupisa zvinopfuura 40°C. Dzivirirai zvirimwa nemashanga uye ipai zvipfuyo mumvuri nemvura yakawanda.',
    ndebeleAlertSummary: 'UKUTSHISA OKULANGABIZI: Ilanga lizatshisa kakhulu okwedlula 40°C. Faka utshani emasimini njalo unike izifuyo amanzi anele.',
  },
  winter_frost: {
    hazardType: 'WINTER_FROST_ALERT',
    severity: 'WARNING',
    title: 'BLACK FROST HAZARD: Night Surface Temperatures Dropping to -1.5°C',
    summary: 'Dry polar cold front settling into valley bottoms tonight. Freezing cell temperatures fatal to tomatoes, potatoes, and peppers.',
    reportingStationName: 'Marondera Grasslands AWS',
    distanceKm: 18.4,
    triggerMetric: 'Minimum Soil Temp: -1.5°C • Dew Point: -3.0°C',
    actionableFarmChecklist: [
      'Light smoke smudge piles (cow dung and damp grass) along field perimeter before 4:00 AM.',
      'Irrigate horticultural beds lightly at dusk: moist soil retains 3°C more heat than dry soil.',
      'Cover tomato and pepper beds with light grass canopies or plastic mulch.',
      'Provide warm bedding straw in goat kraals to prevent kid hypothermia.',
    ],
    affectedEnterprises: ['Horticulture', 'Livestock'],
    shonaAlertSummary: 'CHANDO CHINOPARADZA (Frost): Pfuukai utsi muminda yeHorticulture usiku uye diridzai manheru kudzivirira magwama echando.',
    ndebeleAlertSummary: 'UNGQWELE OLUBULALAYO: Khanyisani intuthu emasimini emibhida kusasa njalo nithisele kusihlwa ukulwa longqwele.',
  },
};
