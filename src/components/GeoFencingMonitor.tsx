import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Bell, 
  Play, 
  Pause, 
  Compass, 
  BatteryMedium, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  Layers,
  Volume2,
  RefreshCw
} from 'lucide-react';

export interface LivestockAnimal {
  id: string;
  tagNumber: string;
  name: string;
  breed: string;
  type: 'Cattle' | 'Goat';
  x: number; // percentage 0-100 on map
  y: number; // percentage 0-100 on map
  speedKmh: number;
  batteryPct: number;
  status: 'Safe' | 'Warning' | 'Breached';
  lastPing: string;
  heading: string;
}

export const INITIAL_HERD: LivestockAnimal[] = [
  {
    id: 'cow-1',
    tagNumber: 'ZIM-VET-042',
    name: 'Mashona Cow (Nyika)',
    breed: 'Mashona Indigenous',
    type: 'Cattle',
    x: 48,
    y: 52,
    speedKmh: 0.8,
    batteryPct: 94,
    status: 'Safe',
    lastPing: 'Just now',
    heading: 'NE',
  },
  {
    id: 'cow-2',
    tagNumber: 'ZIM-VET-019',
    name: 'Brahman Cross (Shumba)',
    breed: 'Brahman x Tuli',
    type: 'Cattle',
    x: 72,
    y: 35,
    speedKmh: 1.4,
    batteryPct: 88,
    status: 'Warning',
    lastPing: '1 min ago',
    heading: 'E',
  },
  {
    id: 'cow-3',
    tagNumber: 'ZIM-VET-077',
    name: 'Heifer (Rudo)',
    breed: 'Mashona Indigenous',
    type: 'Cattle',
    x: 35,
    y: 60,
    speedKmh: 0.4,
    batteryPct: 78,
    status: 'Safe',
    lastPing: '2 mins ago',
    heading: 'S',
  },
  {
    id: 'goat-1',
    tagNumber: 'ZIM-GT-104',
    name: 'Boer Buck (Mbada)',
    breed: 'Boer Goat',
    type: 'Goat',
    x: 42,
    y: 70,
    speedKmh: 0.9,
    batteryPct: 91,
    status: 'Safe',
    lastPing: 'Just now',
    heading: 'NW',
  },
  {
    id: 'goat-2',
    tagNumber: 'ZIM-GT-112',
    name: 'Matabele Doe (Chipo)',
    breed: 'Matabele Indigenous',
    type: 'Goat',
    x: 30,
    y: 75,
    speedKmh: 0.6,
    batteryPct: 85,
    status: 'Safe',
    lastPing: '3 mins ago',
    heading: 'W',
  },
];

export const GeoFencingMonitor: React.FC = () => {
  const [herd, setHerd] = useState<LivestockAnimal[]>(INITIAL_HERD);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [selectedAnimal, setSelectedAnimal] = useState<LivestockAnimal>(INITIAL_HERD[1]);
  const [alerts, setAlerts] = useState<string[]>([
    'System active: GPS ear-tags communicating via LoRaWAN / GSM base station.',
    'Caution: Brahman Bull #019 is approaching Eastern Crop Perimeter fence.',
  ]);
  const [fenceRadius, setFenceRadius] = useState<'Standard (500m)' | 'Expanded (1.2km)' | 'Strict Kraal (150m)'>('Standard (500m)');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Simulation tick
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setHerd(prevHerd =>
        prevHerd.map(animal => {
          // slight random drift
          const dx = (Math.random() - 0.48) * 1.8;
          const dy = (Math.random() - 0.48) * 1.8;
          let newX = Math.max(10, Math.min(90, animal.x + dx));
          let newY = Math.max(15, Math.min(85, animal.y + dy));

          // Check zones:
          // Crop Field is top right: x > 75 and y < 40 -> Breached!
          // Highway/River is x > 85 or y < 15 -> Warning/Breached!
          let status: 'Safe' | 'Warning' | 'Breached' = 'Safe';

          if (newX > 75 && newY < 42) {
            status = 'Breached';
          } else if (newX > 68 && newY < 50) {
            status = 'Warning';
          } else if (newY > 78 && newX < 25) {
            status = 'Warning'; // Swamp/river boundary
          }

          return {
            ...animal,
            x: Number(newX.toFixed(1)),
            y: Number(newY.toFixed(1)),
            speedKmh: Number((Math.random() * 1.5 + 0.3).toFixed(1)),
            status,
            lastPing: 'Just now',
          };
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Keep selected animal in sync
  useEffect(() => {
    const updated = herd.find(a => a.id === selectedAnimal.id);
    if (updated) setSelectedAnimal(updated);
  }, [herd, selectedAnimal.id]);

  const triggerMockBreach = () => {
    setHerd(prev =>
      prev.map(a => {
        if (a.id === 'cow-2') {
          return {
            ...a,
            x: 84,
            y: 28,
            status: 'Breached',
            speedKmh: 3.2,
          };
        }
        return a;
      })
    );
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts(prev => [
      `🚨 CRITICAL BREACH at ${time}: Brahman Cross (Shumba #019) broke through East Fence into Maize Field!`,
      ...prev.slice(0, 5),
    ]);
  };

  const resetHerdPositions = () => {
    setHerd(INITIAL_HERD);
    setSelectedAnimal(INITIAL_HERD[0]);
    setAlerts([
      'Herd telemetry reset to homestead pasture baseline.',
      'All 5 ear-tags responsive with full satellite signal.',
    ]);
  };

  const breachedCount = herd.filter(a => a.status === 'Breached').length;
  const warningCount = herd.filter(a => a.status === 'Warning').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h3 className="font-bold text-lg text-white">HerdWatch GPS & Geo-Fencing Telemetry</h3>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-400/30">
              Live LoRaWAN Veld Link
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Real-time livestock position monitoring, pasture boundary compliance & theft/crop protection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              isSimulating 
                ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40 hover:bg-amber-500/30' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isSimulating ? 'Pause Tracker' : 'Resume Telemetry'}
          </button>

          <button
            onClick={triggerMockBreach}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1 shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Simulate Fence Breach
          </button>

          <button
            onClick={resetHerdPositions}
            title="Reset positions"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Critical Alert Banner if breach occurs */}
      {breachedCount > 0 && (
        <div className="bg-rose-600 text-white px-5 py-3 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-bold text-sm">
                BOUNDARY VIOLATION: {breachedCount} Animal(s) Straying in Restricted Maize Zone!
              </p>
              <p className="text-xs text-rose-100">
                Automated SMS alert dispatched to registered herdman. Mobilize recovery team immediately.
              </p>
            </div>
          </div>
          <button
            onClick={resetHerdPositions}
            className="bg-white text-rose-700 px-3 py-1 text-xs font-bold rounded shadow hover:bg-rose-50"
          >
            Acknowledge & Recall
          </button>
        </div>
      )}

      {/* Main Grid: Map & Telemetry Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: The Pasture Geospatial Map */}
        <div className="lg:col-span-8 p-5 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-600">
            <span className="font-semibold flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-700" />
              Chinyika Communal Grazing Veld & Homestead Block (Zone IIa)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Scale: 1:5,000</span>
              <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px]">
                Fence: {fenceRadius}
              </span>
            </div>
          </div>

          {/* Interactive Map Canvas Container */}
          <div className="relative w-full aspect-[16/10] bg-emerald-950 rounded-xl overflow-hidden border-2 border-slate-300 shadow-inner select-none">
            {/* Topographic Background Patterns */}
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#059669 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px'
              }}
            />

            {/* Allowed Grazing Paddock (Green Polygon) */}
            <div 
              className="absolute left-[20%] top-[25%] w-[55%] h-[58%] border-2 border-emerald-400/80 bg-emerald-800/30 rounded-3xl pointer-events-none transition-all"
              style={{ boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)' }}
            >
              <span className="absolute top-2 left-3 text-[10px] uppercase font-bold text-emerald-300 tracking-wider bg-emerald-950/80 px-2 py-0.5 rounded">
                Safe Pasture (Sweet Veld)
              </span>
            </div>

            {/* Homestead & Kraal Zone (Bottom Left) */}
            <div className="absolute left-[8%] bottom-[8%] w-[22%] h-[24%] border-2 border-blue-400/70 bg-blue-900/30 rounded-xl pointer-events-none">
              <span className="absolute top-1 left-2 text-[10px] font-bold text-blue-300 bg-blue-950/80 px-1.5 py-0.5 rounded">
                Homestead & Kraal
              </span>
            </div>

            {/* Restricted Crop Field (Top Right - Red Zone) */}
            <div className="absolute right-[4%] top-[6%] w-[28%] h-[42%] border-2 border-dashed border-rose-500 bg-rose-950/40 rounded-xl pointer-events-none">
              <div className="absolute top-2 right-2 text-rose-300 text-[10px] font-bold uppercase tracking-wider bg-rose-950/90 px-2 py-0.5 rounded border border-rose-500/40 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                Maize Crop Field (No Grazing)
              </div>
            </div>

            {/* Riverbed Corridor (Bottom Right) */}
            <div className="absolute right-[8%] bottom-[6%] w-[32%] h-[24%] border border-amber-500/60 bg-amber-950/30 rounded-2xl pointer-events-none">
              <span className="absolute bottom-1 right-2 text-[10px] text-amber-300 font-semibold bg-amber-950/80 px-2 py-0.5 rounded">
                Riverbed / Mud Silt Corridor
              </span>
            </div>

            {/* Render Animals on Map */}
            {herd.map((animal) => {
              const isSelected = animal.id === selectedAnimal.id;
              const isBreach = animal.status === 'Breached';
              const isWarn = animal.status === 'Warning';

              return (
                <div
                  key={animal.id}
                  onClick={() => setSelectedAnimal(animal)}
                  style={{
                    left: `${animal.x}%`,
                    top: `${animal.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute cursor-pointer group transition-all duration-700 ease-out z-20"
                >
                  {/* Pulse Ring for Alert Animals */}
                  {(isBreach || isWarn) && (
                    <span 
                      className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${
                        isBreach ? 'bg-rose-500' : 'bg-amber-400'
                      }`} 
                    />
                  )}

                  {/* Animal Icon Node */}
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 transition-transform ${
                      isSelected ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                    } ${
                      isBreach 
                        ? 'bg-rose-600 text-white border-white' 
                        : isWarn 
                          ? 'bg-amber-500 text-slate-900 border-white' 
                          : 'bg-emerald-500 text-white border-emerald-200'
                    }`}
                  >
                    {animal.type === 'Cattle' ? '🐂' : '🐐'}
                  </div>

                  {/* Animal Hover Label */}
                  <div className={`absolute left-1/2 -translate-x-1/2 top-8 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-bold shadow-lg pointer-events-none transition ${
                    isSelected ? 'opacity-100 bg-slate-900 text-white border border-slate-700' : 'opacity-0 group-hover:opacity-100 bg-black/80 text-white'
                  }`}>
                    {animal.name.split(' ')[0]} ({animal.tagNumber})
                  </div>
                </div>
              );
            })}

            {/* Map Legend */}
            <div className="absolute left-3 bottom-3 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-2 text-[10px] text-slate-200 space-y-1">
              <div className="font-semibold text-slate-400 mb-1">Geographic Legend</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Permitted Veld Pasture</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span>Restricted Crop Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span>Warning Riverbed Buffer</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 text-center">
              <div className="text-xs text-emerald-700 font-medium">Safe in Perimeter</div>
              <div className="text-lg font-bold text-emerald-900">
                {herd.filter(a => a.status === 'Safe').length} / {herd.length}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-2.5 text-center">
              <div className="text-xs text-amber-700 font-medium">Boundary Caution</div>
              <div className="text-lg font-bold text-amber-900">{warningCount}</div>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-2.5 text-center">
              <div className="text-xs text-rose-700 font-medium">Active Breaches</div>
              <div className="text-lg font-bold text-rose-900">{breachedCount}</div>
            </div>
          </div>
        </div>

        {/* Right: Selected Animal Details & Incident Log */}
        <div className="lg:col-span-4 p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
              <span>Selected Animal Telemetry</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                selectedAnimal.status === 'Breached'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : selectedAnimal.status === 'Warning'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {selectedAnimal.status.toUpperCase()}
              </span>
            </h4>

            {/* Animal Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-xl">
                  {selectedAnimal.type === 'Cattle' ? '🐂' : '🐐'}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{selectedAnimal.name}</div>
                  <div className="text-xs text-slate-500 font-mono">Tag: {selectedAnimal.tagNumber}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <div className="text-slate-400 text-[10px]">Breed</div>
                  <div className="font-semibold text-slate-800">{selectedAnimal.breed}</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <div className="text-slate-400 text-[10px]">Speed / Heading</div>
                  <div className="font-semibold text-slate-800">{selectedAnimal.speedKmh} km/h ({selectedAnimal.heading})</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <div className="text-slate-400 text-[10px]">Solar Battery</div>
                  <div className="font-semibold text-emerald-700 flex items-center gap-1">
                    <BatteryMedium className="w-3.5 h-3.5" /> {selectedAnimal.batteryPct}%
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <div className="text-slate-400 text-[10px]">Last Satellite Fix</div>
                  <div className="font-semibold text-slate-800">{selectedAnimal.lastPing}</div>
                </div>
              </div>
            </div>

            {/* Herd Selector Chips */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-slate-600 mb-2">Switch Monitored Animal:</div>
              <div className="flex flex-wrap gap-1.5">
                {herd.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAnimal(a)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                      a.id === selectedAnimal.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {a.name.split(' ')[0]} ({a.tagNumber.split('-')[2]})
                  </button>
                ))}
              </div>
            </div>

            {/* Perimeter Configuration */}
            <div className="border-t border-slate-100 pt-3 mb-4">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Geo-Fence Radius Preset
              </label>
              <select
                value={fenceRadius}
                onChange={(e) => setFenceRadius(e.target.value as any)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Standard (500m)">Standard Communal Veld (500m radius)</option>
                <option value="Expanded (1.2km)">Expanded Wet Season Range (1.2km)</option>
                <option value="Strict Kraal (150m)">Night Kraal Protection Mode (150m strict)</option>
              </select>
            </div>
          </div>

          {/* Real-time Alerts Feed */}
          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span className="flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-emerald-700" />
                Live Incident & Audit Trail
              </span>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`text-[10px] flex items-center gap-1 ${soundEnabled ? 'text-emerald-700' : 'text-slate-400'}`}
              >
                <Volume2 className="w-3 h-3" />
                {soundEnabled ? 'Alarm On' : 'Muted'}
              </button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto text-[11px]">
              {alerts.map((alt, idx) => (
                <div 
                  key={idx}
                  className={`p-2 rounded-lg border leading-relaxed ${
                    alt.includes('CRITICAL') || alt.includes('🚨')
                      ? 'bg-rose-50 border-rose-200 text-rose-800 font-medium'
                      : alt.includes('Caution')
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {alt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
