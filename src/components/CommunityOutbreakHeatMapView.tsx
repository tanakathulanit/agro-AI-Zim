import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Flame, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Bug, 
  Leaf, 
  Activity, 
  Search, 
  Plus, 
  ChevronRight, 
  X, 
  Radio, 
  CheckCircle2, 
  Compass, 
  Filter, 
  Layers, 
  RefreshCw,
  Users,
  Eye,
  Sliders,
  ExternalLink,
  Info
} from 'lucide-react';
import { 
  CommunityOutbreakReport, 
  getCommunityOutbreaks, 
  saveCommunityOutbreak, 
  incrementCommunityConfirmation, 
  calculateDistanceKm 
} from '../data/communityOutbreakData';
import { ZimbabweLocation, ZIMBABWE_LOCATIONS } from '../data/zimbabweLocations';
import { REAL_PEST_DISEASE_DATABASE, PestDiseaseRecord } from '../data/plantPestDiseaseDatabase';

interface Props {
  currentLocationName: string;
  selectedLocation?: ZimbabweLocation;
  isOfflineMode?: boolean;
  onNavigateToScannerWithRecord?: (pestRecordId: string) => void;
  onNavigateToChemicalRegister?: (chemicalBrandName: string) => void;
}

// Bounding box for Zimbabwe in geographic coordinates
const ZIM_BOUNDS = {
  minLat: -22.5, // Southern border (Limpopo / Beitbridge)
  maxLat: -15.5, // Northern border (Zambezi / Kariba)
  minLng: 25.1,  // Western border (Victoria Falls)
  maxLng: 33.3,  // Eastern border (Mutare / Chipinge)
};

// Major agricultural hub reference markers in Zimbabwe for spatial context
const REFERENCE_TOWNS = [
  { name: 'Harare', lat: -17.82, lng: 31.05, label: 'Harare (Capital)' },
  { name: 'Bulawayo', lat: -20.15, lng: 28.58, label: 'Bulawayo' },
  { name: 'Mazowe', lat: -17.52, lng: 30.97, label: 'Mazowe' },
  { name: 'Chinhoyi', lat: -17.36, lng: 30.20, label: 'Chinhoyi' },
  { name: 'Marondera', lat: -18.18, lng: 31.55, label: 'Marondera' },
  { name: 'Mutare', lat: -18.97, lng: 32.65, label: 'Mutare' },
  { name: 'Gweru', lat: -19.45, lng: 29.82, label: 'Gweru' },
  { name: 'Masvingo', lat: -20.07, lng: 30.83, label: 'Masvingo' },
  { name: 'Chiredzi', lat: -21.05, lng: 31.67, label: 'Chiredzi' },
  { name: 'Gokwe', lat: -18.21, lng: 28.93, label: 'Gokwe' },
  { name: 'Lupane', lat: -18.93, lng: 27.76, label: 'Lupane' },
  { name: 'Gwanda', lat: -20.94, lng: 29.00, label: 'Gwanda' },
  { name: 'Chipinge', lat: -20.20, lng: 32.62, label: 'Chipinge' },
];

export const CommunityOutbreakHeatMapView: React.FC<Props> = ({
  currentLocationName,
  selectedLocation,
  isOfflineMode = false,
  onNavigateToScannerWithRecord,
  onNavigateToChemicalRegister
}) => {
  // Active reports state
  const [reports, setReports] = useState<CommunityOutbreakReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CommunityOutbreakReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmittingReport, setIsSubmittingReport] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [radiusFilterKm, setRadiusFilterKm] = useState<number>(50); // 10, 25, 50, 100, 0 = all
  const [severityFilter, setSeverityFilter] = useState<'all' | 'Critical' | 'High' | 'Moderate'>('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState<'all' | 'plant' | 'livestock'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showHeatLayer, setShowHeatLayer] = useState<boolean>(true);
  const [showRadiusRings, setShowRadiusRings] = useState<boolean>(true);

  // Modal for new report submission
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [formPestId, setFormPestId] = useState<string>('faw-001');
  const [formHost, setFormHost] = useState<string>('Hybrid Maize');
  const [formSeverity, setFormSeverity] = useState<'Critical' | 'High' | 'Moderate'>('High');
  const [formLocationName, setFormLocationName] = useState<string>(selectedLocation?.name || 'Goromonzi / Domboshava');
  const [formDistrict, setFormDistrict] = useState<string>(selectedLocation?.district || 'Goromonzi');
  const [formProvince, setFormProvince] = useState<string>(selectedLocation?.province || 'Mashonaland East');
  const [formRegion, setFormRegion] = useState<'I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V'>(selectedLocation?.naturalRegion || 'IIa');
  const [formAcreage, setFormAcreage] = useState<string>('1.5 hectares (3 Pfumvudza plots)');
  const [formSymptoms, setFormSymptoms] = useState<string>('');
  const [formActionTaken, setFormActionTaken] = useState<string>('');
  const [formReporterName, setFormReporterName] = useState<string>('Baba Farai (Smallholder Farmer)');
  const [formReporterRole, setFormReporterRole] = useState<'Smallholder Farmer' | 'Master Farmer' | 'Qualified Agronomist' | 'Veterinary Field Officer'>('Smallholder Farmer');

  // Canvas refs for Heat Map
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Resolve farmer current GPS coordinates
  const farmerCoords = useMemo(() => {
    if (selectedLocation?.coordinates) {
      return selectedLocation.coordinates;
    }
    // Match by name in ZIMBABWE_LOCATIONS
    const found = ZIMBABWE_LOCATIONS.find(loc => 
      currentLocationName.toLowerCase().includes(loc.name.toLowerCase()) ||
      currentLocationName.toLowerCase().includes(loc.district.toLowerCase())
    );
    return found?.coordinates || { lat: -17.82, lng: 31.33 }; // Default Goromonzi
  }, [selectedLocation, currentLocationName]);

  const selectedReportDistance = useMemo(() => {
    if (!selectedReport) return 0;
    if (selectedReport.distanceKm !== undefined) return selectedReport.distanceKm;
    return calculateDistanceKm(
      farmerCoords.lat,
      farmerCoords.lng,
      selectedReport.coordinates.lat,
      selectedReport.coordinates.lng
    );
  }, [selectedReport, farmerCoords]);

  // Load outbreaks from local storage and optionally sync with backend
  const loadOutbreaks = useCallback(async () => {
    setIsLoading(true);
    // Always start with local certified store
    const localData = getCommunityOutbreaks();
    setReports(localData);

    // If online, attempt to fetch latest from server
    if (!isOfflineMode && typeof fetch !== 'undefined') {
      try {
        const res = await fetch(`/api/outbreaks?lat=${farmerCoords.lat}&lng=${farmerCoords.lng}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setReports(json.data);
          }
        }
      } catch (err) {
        console.warn('Backend outbreaks endpoint offline, using certified on-device community database:', err);
      }
    }
    setIsLoading(false);
  }, [farmerCoords, isOfflineMode]);

  useEffect(() => {
    loadOutbreaks();
  }, [loadOutbreaks]);

  // Convert lat/lng to percentage coordinates on the Zimbabwe map canvas
  const coordsToMapPercent = useCallback((lat: number, lng: number) => {
    // Latitude decreases as you go south, so invert Y
    const xPercent = ((lng - ZIM_BOUNDS.minLng) / (ZIM_BOUNDS.maxLng - ZIM_BOUNDS.minLng)) * 100;
    const yPercent = ((ZIM_BOUNDS.maxLat - lat) / (ZIM_BOUNDS.maxLat - ZIM_BOUNDS.minLat)) * 100;
    return {
      x: Math.max(2, Math.min(98, xPercent)),
      y: Math.max(2, Math.min(98, yPercent))
    };
  }, []);

  // Filtered reports with distances calculated from farmer
  const processedReports = useMemo(() => {
    return reports.map(r => {
      const distanceKm = calculateDistanceKm(
        farmerCoords.lat, 
        farmerCoords.lng, 
        r.coordinates.lat, 
        r.coordinates.lng
      );
      const isWithinRadius = radiusFilterKm === 0 || distanceKm <= radiusFilterKm;
      return {
        ...r,
        distanceKm,
        isWithinRadius
      };
    }).filter(r => {
      // Radius filter
      if (radiusFilterKm > 0 && r.distanceKm > radiusFilterKm) {
        return false;
      }
      // Severity filter
      if (severityFilter !== 'all' && r.severity !== severityFilter) {
        return false;
      }
      // Target type filter
      if (targetTypeFilter !== 'all' && r.targetType !== targetTypeFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.pestName.toLowerCase().includes(q) ||
          r.scientificName.toLowerCase().includes(q) ||
          r.vernacularName.shona.toLowerCase().includes(q) ||
          r.vernacularName.ndebele.toLowerCase().includes(q);
        const matchesLocation = r.locationName.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q) ||
          r.province.toLowerCase().includes(q);
        const matchesHost = r.affectedHost.toLowerCase().includes(q);
        if (!matchesName && !matchesLocation && !matchesHost) return false;
      }
      return true;
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [reports, farmerCoords, radiusFilterKm, severityFilter, targetTypeFilter, searchQuery]);

  // Overall nearby stats
  const stats = useMemo(() => {
    const within15km = reports.filter(r => 
      calculateDistanceKm(farmerCoords.lat, farmerCoords.lng, r.coordinates.lat, r.coordinates.lng) <= 15
    );
    const within50km = reports.filter(r => 
      calculateDistanceKm(farmerCoords.lat, farmerCoords.lng, r.coordinates.lat, r.coordinates.lng) <= 50
    );
    const criticalNearby = within50km.filter(r => r.severity === 'Critical');
    const totalConfirmations = reports.reduce((acc, curr) => acc + curr.communityConfirmations, 0);

    return {
      totalInDatabase: reports.length,
      within15kmCount: within15km.length,
      within50kmCount: within50km.length,
      criticalNearbyCount: criticalNearby.length,
      totalConfirmations,
      closestReport: processedReports[0] || null
    };
  }, [reports, farmerCoords, processedReports]);

  // Render the Heat Map on HTML5 Canvas using Gaussian radial blur
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !showHeatLayer) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match display
    const width = canvas.width = canvas.parentElement?.clientWidth || 800;
    const height = canvas.height = canvas.parentElement?.clientHeight || 560;

    ctx.clearRect(0, 0, width, height);

    // Draw Heat Intensity Points
    processedReports.forEach(report => {
      const pos = coordsToMapPercent(report.coordinates.lat, report.coordinates.lng);
      const pixelX = (pos.x / 100) * width;
      const pixelY = (pos.y / 100) * height;

      // Base radius by containmentRadius and confirmations
      const baseRadius = Math.max(30, Math.min(90, (report.containmentRadiusKm * 2.2) + Math.min(25, report.communityConfirmations * 1.5)));
      
      // Heat intensity based on severity
      let alpha = 0.55;
      let centerColor = 'rgba(239, 68, 68, 0.75)'; // Critical: deep red
      let midColor = 'rgba(249, 115, 22, 0.45)';   // Orange
      let outerColor = 'rgba(234, 179, 8, 0)';

      if (report.severity === 'High') {
        alpha = 0.45;
        centerColor = 'rgba(249, 115, 22, 0.70)';
        midColor = 'rgba(234, 179, 8, 0.35)';
      } else if (report.severity === 'Moderate') {
        alpha = 0.35;
        centerColor = 'rgba(234, 179, 8, 0.60)';
        midColor = 'rgba(34, 197, 94, 0.25)';
      }

      const gradient = ctx.createRadialGradient(pixelX, pixelY, 2, pixelX, pixelY, baseRadius);
      gradient.addColorStop(0, centerColor);
      gradient.addColorStop(0.4, midColor);
      gradient.addColorStop(1, outerColor);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(pixelX, pixelY, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    });

  }, [processedReports, showHeatLayer, coordsToMapPercent]);

  // Confirm / Upvote Sighting
  const handleConfirmSighting = async (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = incrementCommunityConfirmation(reportId);
    if (updated) {
      setReports(prev => prev.map(r => r.id === reportId ? updated : r));
      if (selectedReport?.id === reportId) {
        setSelectedReport(updated);
      }
      setToastMessage(`✓ Community confirmation logged! Thank you for strengthening Zimbabwe's early warning network.`);
      setTimeout(() => setToastMessage(null), 4500);

      // Attempt server sync
      if (!isOfflineMode) {
        try {
          await fetch(`/api/outbreaks/${reportId}/confirm`, { method: 'POST' });
        } catch {
          // offline handled
        }
      }
    }
  };

  // Submit new field outbreak from the community
  const handleSubmitNewReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSymptoms.trim()) {
      alert('Please describe observed field symptoms.');
      return;
    }

    setIsSubmittingReport(true);
    const pestMeta = REAL_PEST_DISEASE_DATABASE.find(p => p.id === formPestId);
    
    // Determine coordinates from location selection or farmer coords
    const matchedLoc = ZIMBABWE_LOCATIONS.find(l => 
      formLocationName.toLowerCase().includes(l.name.toLowerCase()) ||
      formDistrict.toLowerCase().includes(l.district.toLowerCase())
    );
    const coords = matchedLoc?.coordinates || farmerCoords;

    const newReport: CommunityOutbreakReport = {
      id: `outbreak-${Date.now()}`,
      pestOrDiseaseId: formPestId,
      pestName: pestMeta?.name || 'Fall Armyworm',
      scientificName: pestMeta?.scientificName || 'Spodoptera frugiperda',
      vernacularName: pestMeta?.vernacularNames || { shona: 'Mhungu', ndebele: 'Isihlava' },
      category: pestMeta?.category || 'insect_pest',
      targetType: pestMeta?.targetType || 'plant',
      affectedHost: formHost,
      severity: formSeverity,
      locationName: formLocationName,
      district: formDistrict,
      province: formProvince,
      naturalRegion: formRegion,
      coordinates: coords,
      reportedBy: formReporterName,
      reporterRole: formReporterRole,
      reportedAt: 'Just now',
      reportedDateEpoch: Date.now(),
      affectedAreaSummary: formAcreage,
      symptomsObserved: formSymptoms,
      containmentActionTaken: formActionTaken || 'Scouted field; applied recommended cultural controls and contacted extension officer.',
      recommendedImmediateControl: {
        chemicalOrMethod: pestMeta?.primaryRegisteredControl.brandName || 'Karate Zeon 5CS',
        dosageRate: pestMeta?.primaryRegisteredControl.dilutionRate || '15-20ml per 15L knapsack',
        ipmAlternative: pestMeta?.ipmOrganicControl.methodName || 'Wood ash + sand whorl placement'
      },
      verifiedBySpecialist: formReporterRole === 'Qualified Agronomist' || formReporterRole === 'Veterinary Field Officer',
      specialistName: formReporterRole.includes('Agronomist') || formReporterRole.includes('Officer') ? formReporterName : undefined,
      communityConfirmations: 1,
      status: 'Active Outbreak',
      containmentRadiusKm: formSeverity === 'Critical' ? 22 : formSeverity === 'High' ? 15 : 10
    };

    saveCommunityOutbreak(newReport);
    setReports(prev => [newReport, ...prev]);
    setSelectedReport(newReport);
    setIsReportModalOpen(false);
    setIsSubmittingReport(false);
    setToastMessage(`✓ Outbreak reported successfully! Your report is now live on the Zimbabwe Agro Heat Map.`);
    setTimeout(() => setToastMessage(null), 5000);

    // Sync to backend if online
    if (!isOfflineMode) {
      try {
        await fetch('/api/outbreaks/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReport)
        });
      } catch {
        // offline handled
      }
    }
  };

  const farmerPos = coordsToMapPercent(farmerCoords.lat, farmerCoords.lng);

  return (
    <div className="space-y-5">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="bg-emerald-900 text-white text-xs px-4 py-2.5 rounded-xl border border-emerald-700 shadow-md flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-300 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header Card & Threat Telemetry */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-8 h-8 rounded-lg bg-red-100 border border-red-300 text-red-700 flex items-center justify-center font-bold text-base shadow-xs">
                <Flame className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  Community Outbreak Heat Map
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-200">
                    Real Farmer Inputs • Zimbabwe Nationwide
                  </span>
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Crowdsourced pathogen surveillance engine powered by verified smallholder farmers, Master Farmers, and Agritex field extension officers across all 10 provinces. Monitors spatial vectors, calculates proximity radii from your farm, and triggers immediate containment advisories.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Report Field Outbreak
            </button>
            <button
              onClick={loadOutbreaks}
              disabled={isLoading}
              title="Refresh Reports"
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Proximity Telemetry Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className={`p-3 rounded-xl border ${
            stats.within15kmCount > 0 
              ? 'bg-red-50/70 border-red-200' 
              : 'bg-emerald-50/70 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
              <span className={stats.within15kmCount > 0 ? 'text-red-800' : 'text-emerald-800'}>
                Within 15km of Your Farm
              </span>
              <Radio className={`w-3.5 h-3.5 ${stats.within15kmCount > 0 ? 'text-red-600 animate-pulse' : 'text-emerald-600'}`} />
            </div>
            <div className="text-xl font-black text-slate-900">
              {stats.within15kmCount} {stats.within15kmCount === 1 ? 'Outbreak' : 'Outbreaks'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {stats.within15kmCount > 0 ? 'Immediate containment recommended' : 'Zero critical vectors detected within 15km'}
            </div>
          </div>

          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/60">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 mb-1">
              <span>Within 50km Radius</span>
              <Activity className="w-3.5 h-3.5 text-amber-700" />
            </div>
            <div className="text-xl font-black text-slate-900">
              {stats.within50kmCount} Reported
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {stats.criticalNearbyCount} critical severity in your district
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/80">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
              <span>Nearest Threat Distance</span>
              <Compass className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <div className="text-xl font-black text-slate-900">
              {stats.closestReport ? `${stats.closestReport.distanceKm} km` : 'N/A'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">
              {stats.closestReport ? `${stats.closestReport.pestName} (${stats.closestReport.locationName})` : 'No active threats in radius'}
            </div>
          </div>

          <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900 mb-1">
              <span>Community Verifications</span>
              <Users className="w-3.5 h-3.5 text-emerald-700" />
            </div>
            <div className="text-xl font-black text-slate-900">
              {stats.totalConfirmations} Confirmations
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Across {stats.totalInDatabase} active field reports nationwide
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Proximity Radius Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              Radius from Farm:
            </span>
            {[
              { label: '15 km', value: 15 },
              { label: '25 km', value: 25 },
              { label: '50 km', value: 50 },
              { label: '100 km', value: 100 },
              { label: 'All Zimbabwe', value: 0 }
            ].map(r => (
              <button
                key={r.value}
                onClick={() => setRadiusFilterKm(r.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  radiusFilterKm === r.value
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pest, crop, district..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Secondary Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500">Filter By:</span>
            
            {/* Target Type */}
            <select
              value={targetTypeFilter}
              onChange={e => setTargetTypeFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-none focus:border-emerald-600"
            >
              <option value="all">All Hosts (Plant & Livestock)</option>
              <option value="plant">Crops Only (Maize, Tomatoes, Sorghum...)</option>
              <option value="livestock">Livestock Only (Cattle, Goats, Poultry...)</option>
            </select>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-none focus:border-emerald-600"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical Only (Emergency)</option>
              <option value="High">High Severity</option>
              <option value="Moderate">Moderate Severity</option>
            </select>
          </div>

          {/* Map Layer Toggles */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-slate-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={showHeatLayer}
                onChange={e => setShowHeatLayer(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Heat Gradient Layer</span>
            </label>
            <label className="flex items-center gap-1.5 text-slate-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={showRadiusRings}
                onChange={e => setShowRadiusRings(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Proximity Circles</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Visualizer: Heat Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Zimbabwe Heat Map Canvas */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-md text-white relative overflow-hidden flex flex-col">
          {/* Map Header info */}
          <div className="flex items-center justify-between mb-2 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">
                Live Agro-Ecological Map • Zimbabwe National Grid
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <span>Showing: <strong>{processedReports.length}</strong> outbreak clusters</span>
              {radiusFilterKm > 0 && (
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  ≤ {radiusFilterKm}km radius
                </span>
              )}
            </div>
          </div>

          {/* Interactive Map Visual Area */}
          <div 
            ref={mapContainerRef}
            className="relative w-full h-[480px] sm:h-[540px] rounded-xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 overflow-hidden select-none"
          >
            {/* Background SVG Grid & Natural Regions outline of Zimbabwe */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Stylized Zimbabwe Provincial / Agro-Ecological boundary contour */}
              <path 
                d="M 12% 28% Q 30% 12% 52% 16% T 88% 25% Q 94% 48% 90% 70% T 70% 90% Q 42% 95% 26% 82% T 10% 50% Z" 
                fill="rgba(16, 185, 129, 0.04)" 
                stroke="rgba(16, 185, 129, 0.3)" 
                strokeWidth="1.5" 
                strokeDasharray="4,4"
              />

              {/* Major Agro-ecological Natural Regions label indications */}
              <text x="82%" y="38%" fill="rgba(52, 211, 153, 0.4)" fontSize="10" fontWeight="bold">Region I (High Rainfall)</text>
              <text x="56%" y="24%" fill="rgba(52, 211, 153, 0.4)" fontSize="10" fontWeight="bold">Region IIa / IIb (Highveld)</text>
              <text x="44%" y="54%" fill="rgba(251, 191, 36, 0.4)" fontSize="10" fontWeight="bold">Region III (Midlands)</text>
              <text x="24%" y="42%" fill="rgba(249, 115, 22, 0.4)" fontSize="10" fontWeight="bold">Region IV (Semi-Arid)</text>
              <text x="64%" y="84%" fill="rgba(239, 68, 68, 0.4)" fontSize="10" fontWeight="bold">Region V (Lowveld / Arid)</text>
            </svg>

            {/* Dynamic Heat Map Canvas Layer */}
            {showHeatLayer && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
            )}

            {/* Reference Towns for Zimbabwe orientation */}
            {REFERENCE_TOWNS.map(town => {
              const pos = coordsToMapPercent(town.lat, town.lng);
              return (
                <div
                  key={town.name}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 opacity-60" />
                  <span className="text-[9px] text-slate-400/80 font-mono tracking-tight mt-0.5">
                    {town.name}
                  </span>
                </div>
              );
            })}

            {/* Concentric Proximity Radius Rings centered around farmer's farm */}
            {showRadiusRings && (
              <>
                {/* 15 km ring */}
                <div
                  style={{ 
                    left: `${farmerPos.x}%`, 
                    top: `${farmerPos.y}%`,
                    width: '70px',
                    height: '70px'
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/30 bg-emerald-400/5 pointer-events-none z-10"
                />
                {/* 50 km ring */}
                <div
                  style={{ 
                    left: `${farmerPos.x}%`, 
                    top: `${farmerPos.y}%`,
                    width: '180px',
                    height: '180px'
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/20 pointer-events-none z-10 border-dashed"
                />
              </>
            )}

            {/* Farmer Current Location Pin */}
            <div
              style={{ left: `${farmerPos.x}%`, top: `${farmerPos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group flex flex-col items-center"
            >
              <div className="relative">
                <span className="absolute -inset-2 rounded-full bg-cyan-400/30 animate-ping" />
                <div className="relative w-6 h-6 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center shadow-lg">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="bg-cyan-950/90 text-cyan-200 border border-cyan-500/50 text-[10px] font-extrabold px-2 py-0.5 rounded-md mt-1 shadow-md whitespace-nowrap">
                ★ YOUR FARM ({selectedLocation?.district || 'Goromonzi'})
              </div>
            </div>

            {/* Interactive Outbreak Markers */}
            {processedReports.map(report => {
              const pos = coordsToMapPercent(report.coordinates.lat, report.coordinates.lng);
              const isSelected = selectedReport?.id === report.id;
              const isCritical = report.severity === 'Critical';
              const isHigh = report.severity === 'High';

              let pinColor = 'bg-amber-500 text-slate-950 border-amber-300';
              if (isCritical) {
                pinColor = 'bg-red-600 text-white border-red-300';
              } else if (isHigh) {
                pinColor = 'bg-orange-500 text-white border-orange-300';
              }

              return (
                <div
                  key={report.id}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onClick={() => setSelectedReport(report)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform duration-200 hover:scale-125 ${
                    isSelected ? 'scale-125 z-40' : ''
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Pulsing ring for spreading critical outbreaks */}
                    {report.status === 'Spreading' && (
                      <span className="absolute -inset-1.5 rounded-full bg-red-500/40 animate-ping" />
                    )}

                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-md ${pinColor} ${
                      isSelected ? 'ring-4 ring-white/80' : ''
                    }`}>
                      {report.targetType === 'livestock' ? (
                        <ShieldAlert className="w-3 h-3" />
                      ) : report.category === 'insect_pest' ? (
                        <Bug className="w-3 h-3" />
                      ) : (
                        <Leaf className="w-3 h-3" />
                      )}
                    </div>

                    {/* Tag label */}
                    <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 whitespace-nowrap shadow-sm border ${
                      isSelected
                        ? 'bg-white text-slate-900 border-white font-extrabold'
                        : 'bg-slate-900/85 text-slate-200 border-slate-700'
                    }`}>
                      {report.pestName} ({report.distanceKm}km)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-bold text-slate-300">Heat Density:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
                <span>Critical Outbreak (High spread velocity)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
                <span>High Severity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span>Moderate Infestation</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span>Your Selected Location</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Outbreak Detail Inspector & Field Containment */}
        <div className="lg:col-span-4 space-y-4">
          {selectedReport ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 animate-fade-in">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      selectedReport.severity === 'Critical' 
                        ? 'bg-red-100 text-red-800 border border-red-300' 
                        : selectedReport.severity === 'High'
                        ? 'bg-orange-100 text-orange-800 border border-orange-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {selectedReport.severity.toUpperCase()} ALERT
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {selectedReport.status}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 leading-tight">
                    {selectedReport.pestName}
                  </h4>
                  <p className="text-xs text-slate-500 italic">
                    {selectedReport.scientificName} • {selectedReport.vernacularName.shona}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Distance from farm badge */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                selectedReportDistance <= 15
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : selectedReportDistance <= 50
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">
                      {selectedReportDistance} km from Your Farm
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Location: {selectedReport.locationName} ({selectedReport.district}, Region {selectedReport.naturalRegion})
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-white border shadow-xs">
                    {selectedReportDistance <= 15 ? 'HIGH RISK' : selectedReportDistance <= 50 ? 'MEDIUM' : 'LOW RISK'}
                  </span>
                </div>
              </div>

              {/* Field Symptoms & Sourced community info */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-700">Host Crop/Animal:</span>{' '}
                  <span className="text-slate-900 font-semibold">{selectedReport.affectedHost}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Affected Scope:</span>{' '}
                  <span className="text-slate-600">{selectedReport.affectedAreaSummary}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Observed Field Symptoms:</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    "{selectedReport.symptomsObserved}"
                  </p>
                </div>
              </div>

              {/* Verified Community Source info */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-emerald-950">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    {selectedReport.verifiedByAgritex ? 'Agritex Extension Verified' : 'Community Field Report'}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-normal">{selectedReport.reportedAt}</span>
                </div>
                <p className="text-emerald-900 text-[11px]">
                  Reported by <strong>{selectedReport.reportedBy}</strong> ({selectedReport.reporterRole})
                  {selectedReport.agritexOfficerName && (
                    <span> • Certified by <em>{selectedReport.agritexOfficerName}</em></span>
                  )}
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-800">
                    <strong>{selectedReport.communityConfirmations}</strong> local farmers verified this sighting
                  </span>
                  <button
                    onClick={(e) => handleConfirmSighting(selectedReport.id, e)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition shadow-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    I Spotted This Too (+1)
                  </button>
                </div>
              </div>

              {/* Immediate Containment Advisory */}
              <div className="bg-slate-900 text-white rounded-xl p-3 text-xs space-y-2">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  Prescribed Immediate Containment
                </div>
                <div className="space-y-1 text-[11px]">
                  <div>
                    <span className="text-slate-400">Chemical Protocol:</span>{' '}
                    <strong className="text-slate-100">{selectedReport.recommendedImmediateControl.chemicalOrMethod}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Dosage:</span>{' '}
                    <span className="text-slate-300">{selectedReport.recommendedImmediateControl.dosageRate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Pfumvudza IPM:</span>{' '}
                    <span className="text-slate-300">{selectedReport.recommendedImmediateControl.ipmAlternative}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  {onNavigateToScannerWithRecord && selectedReport.pestOrDiseaseId && (
                    <button
                      onClick={() => onNavigateToScannerWithRecord(selectedReport.pestOrDiseaseId)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 rounded-lg transition text-center"
                    >
                      Pre-load in Diagnostic Scanner
                    </button>
                  )}
                  {onNavigateToChemicalRegister && (
                    <button
                      onClick={() => onNavigateToChemicalRegister(selectedReport.recommendedImmediateControl.chemicalOrMethod)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold py-1.5 rounded-lg transition text-center border border-slate-700"
                    >
                      Check Agrochemical Stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6 text-slate-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Click Any Outbreak Cluster on the Heat Map
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Select any glowing outbreak pin or cluster on the map to inspect full community input notes, Agritex verification credentials, proximity to your farm, and verified containment chemicals.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Report An Outbreak In Your Ward
                </button>
              </div>
            </div>
          )}

          {/* Quick List of Closest Community Reports */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
            <h5 className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
              <span>Nearest Outbreaks to Your Farm</span>
              <span className="text-[10px] text-slate-500 font-normal">Sorted by distance</span>
            </h5>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {processedReports.slice(0, 5).map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedReport(item)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    selectedReport?.id === item.id
                      ? 'bg-slate-900 text-white border-slate-800'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-0.5">
                    <span className="truncate pr-2">{item.pestName}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono shrink-0 ${
                      item.distanceKm <= 15
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-200 text-slate-800'
                    }`}>
                      {item.distanceKm} km
                    </span>
                  </div>
                  <div className="text-[10px] opacity-75 flex items-center justify-between">
                    <span>{item.locationName}</span>
                    <span>{item.communityConfirmations} confirms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Community Outbreak Submission Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-600" />
                  Report Field Outbreak (Community Input)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your report alerts surrounding smallholder farmers and Agritex officers to contain the spread.
                </p>
              </div>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewReport} className="space-y-3.5 text-xs">
              {/* Pathogen / Pest Selection */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pest or Pathogen Observed:
                </label>
                <select
                  value={formPestId}
                  onChange={e => setFormPestId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                >
                  {REAL_PEST_DISEASE_DATABASE.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.vernacularNames.shona}) - {p.category.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Host Crop / Livestock & Severity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Affected Crop / Animal:
                  </label>
                  <input
                    type="text"
                    value={formHost}
                    onChange={e => setFormHost(e.target.value)}
                    placeholder="e.g. Hybrid Maize SC 719"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Severity Level:
                  </label>
                  <select
                    value={formSeverity}
                    onChange={e => setFormSeverity(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Critical">Critical (Immediate Quarantine / Heavy Loss)</option>
                    <option value="High">High (Rapid Spread Across Plots)</option>
                    <option value="Moderate">Moderate (Early Inception / Spotty)</option>
                  </select>
                </div>
              </div>

              {/* Location details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Village / Ward Name:
                  </label>
                  <input
                    type="text"
                    value={formLocationName}
                    onChange={e => setFormLocationName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    District:
                  </label>
                  <select
                    value={formDistrict}
                    onChange={e => {
                      const dist = e.target.value;
                      setFormDistrict(dist);
                      const loc = ZIMBABWE_LOCATIONS.find(l => l.district === dist);
                      if (loc) {
                        setFormProvince(loc.province);
                        setFormRegion(loc.naturalRegion);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  >
                    {ZIMBABWE_LOCATIONS.map(l => (
                      <option key={l.id} value={l.district}>
                        {l.district} ({l.province})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Acreage Affected */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Estimated Area / Livestock Affected:
                </label>
                <input
                  type="text"
                  value={formAcreage}
                  onChange={e => setFormAcreage(e.target.value)}
                  placeholder="e.g. 2 hectares / 6 Pfumvudza basins / 18 cattle"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              {/* Symptoms Observed */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Symptoms & Field Damage Observed:
                </label>
                <textarea
                  rows={2}
                  value={formSymptoms}
                  onChange={e => setFormSymptoms(e.target.value)}
                  placeholder="Describe leaf perforations, discoloration, frass, animal swelling, or mortality..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              {/* Action Taken */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Containment Action Taken (Optional):
                </label>
                <input
                  type="text"
                  value={formActionTaken}
                  onChange={e => setFormActionTaken(e.target.value)}
                  placeholder="e.g. Sprayed Karate Zeon 5CS; rogued infected plants"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Reporter Info */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Reporter Name:
                  </label>
                  <input
                    type="text"
                    value={formReporterName}
                    onChange={e => setFormReporterName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Your Role in Community:
                  </label>
                  <select
                    value={formReporterRole}
                    onChange={e => setFormReporterRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Smallholder Farmer">Smallholder Farmer</option>
                    <option value="Master Farmer">Master Farmer</option>
                    <option value="Agritex Extension Officer">Agritex Extension Officer</option>
                    <option value="Veterinary Field Officer">Veterinary Field Officer</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isSubmittingReport ? 'Broadcasting...' : 'Broadcast Outbreak Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
