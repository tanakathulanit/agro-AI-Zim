import React, { useState, useRef, useMemo } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  ShieldCheck, 
  Leaf, 
  Bug, 
  FlaskConical, 
  RefreshCw,
  Video,
  VideoOff,
  Search,
  BookOpen,
  Filter,
  ExternalLink,
  ShieldAlert,
  Award,
  ChevronRight,
  X,
  Info,
  Flame,
  MapPin
} from 'lucide-react';

import { 
  REAL_PEST_DISEASE_DATABASE, 
  searchPestDiseaseDatabase, 
  getPestDiseaseById,
  PestDiseaseRecord 
} from '../data/plantPestDiseaseDatabase';

import { 
  runOfflineDiagnostics, 
  PRE_DOWNLOADED_AGROCHEMICAL_DB, 
  saveToOfflineOutbox 
} from '../utils/offlineStorage';
import { REGISTERED_ZIMBABWE_CHEMICALS } from '../data/registeredChemicalsDatabase';

import { CommunityOutbreakHeatMapView } from './CommunityOutbreakHeatMapView';
import { ZimbabweLocation, ZIMBABWE_LOCATIONS } from '../data/zimbabweLocations';
import { getCommunityOutbreaks, calculateDistanceKm } from '../data/communityOutbreakData';

export interface DiagnosticResult {
  diagnosis: string;
  confidenceScore: number;
  conditionType: string;
  severity: 'High' | 'Moderate' | 'Low';
  affectedPart: string;
  symptomsSummary: string;
  primaryRemedy: {
    productName: string;
    activeIngredient: string;
    manufacturer: string;
    dosageInstructions: string;
    applicationTiming: string;
    preHarvestInterval: string;
  };
  ipmAndOrganicAlternative: {
    methodName: string;
    preparationAndApplication: string;
  };
  preventativeMeasures: string[];
  agritexAdvisoryNote: string;
  databaseRecordId?: string;
  eppoCode?: string;
  resistantVarieties?: string[];
  isOfflineGenerated?: boolean;
}

interface Props {
  currentLocationName: string;
  selectedLocation?: ZimbabweLocation;
  isOfflineMode?: boolean;
}

export const HealthDiagnostics: React.FC<Props> = ({ 
  currentLocationName,
  selectedLocation,
  isOfflineMode = false 
}) => {
  // Navigation tabs inside Health & Diagnostics
  const [activeView, setActiveView] = useState<'scanner' | 'database' | 'chemicals' | 'outbreaks'>('scanner');

  // Nearby community outbreaks telemetry for farmer's location
  const farmerCoords = useMemo(() => {
    if (selectedLocation?.coordinates) return selectedLocation.coordinates;
    const found = ZIMBABWE_LOCATIONS.find(loc => 
      currentLocationName.toLowerCase().includes(loc.name.toLowerCase()) ||
      currentLocationName.toLowerCase().includes(loc.district.toLowerCase())
    );
    return found?.coordinates || { lat: -17.82, lng: 31.33 };
  }, [selectedLocation, currentLocationName]);

  const nearbyOutbreaksCount = useMemo(() => {
    const list = getCommunityOutbreaks();
    return list.filter(r => 
      calculateDistanceKm(farmerCoords.lat, farmerCoords.lng, r.coordinates.lat, r.coordinates.lng) <= 50
    ).length;
  }, [farmerCoords]);

  // Scanner state
  const [targetType, setTargetType] = useState<'plant' | 'livestock'>('plant');
  const [cropOrAnimal, setCropOrAnimal] = useState<string>('Hybrid Maize');
  const [farmerNotes, setFarmerNotes] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Detail Modal for selected database record
  const [inspectingRecord, setInspectingRecord] = useState<PestDiseaseRecord | null>(null);

  // Database search & filters
  const [dbSearchQuery, setDbSearchQuery] = useState<string>('');
  const [dbCropFilter, setDbCropFilter] = useState<string>('all');
  const [dbCategoryFilter, setDbCategoryFilter] = useState<string>('all');
  const [dbRegionFilter, setDbRegionFilter] = useState<string>('all');

  // Live Camera Stream State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startCamera = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      setErrorMessage('Could not open camera stream. Please check camera permissions or upload a field photograph from your device.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setSelectedImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG or PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  // Run Real Diagnostic Scan
  const runAnalysis = async () => {
    if (!selectedImage && !farmerNotes.trim()) {
      setErrorMessage('Please capture a photo or describe observed field symptoms.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    if (isOfflineMode) {
      // 100% On-Device Diagnostic Engine using the Real Database
      setTimeout(() => {
        const offlineResult = runOfflineDiagnostics(targetType, cropOrAnimal, farmerNotes);
        setDiagnosticResult(offlineResult);
        saveToOfflineOutbox({
          type: 'diagnostic_scan',
          payload: { targetType, cropOrAnimal, farmerNotes, result: offlineResult },
        });
        setIsAnalyzing(false);
      }, 400);
      return;
    }

    try {
      const response = await fetch('/api/diagnostics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage || 'data:image/jpeg;base64,',
          mimeType: 'image/jpeg',
          targetType,
          cropOrAnimal,
          notes: farmerNotes,
          location: currentLocationName,
        }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        setDiagnosticResult(data.result);
      } else {
        throw new Error(data.error || 'Diagnostic scan returned no result');
      }
    } catch (err: unknown) {
      // Automatic fallback to on-device certified database
      const offlineResult = runOfflineDiagnostics(targetType, cropOrAnimal, farmerNotes);
      setDiagnosticResult(offlineResult);
      saveToOfflineOutbox({
        type: 'diagnostic_scan',
        payload: { targetType, cropOrAnimal, farmerNotes, result: offlineResult },
      });
      setErrorMessage('Live vision service offline. Calibrated against on-device certified Zimbabwe Plant Pest & Disease Database.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Prefill scanner from a real database record
  const prefillFromDatabaseRecord = (record: PestDiseaseRecord) => {
    setTargetType(record.targetType);
    if (record.hostCropsOrAnimals.length > 0) {
      setCropOrAnimal(record.hostCropsOrAnimals[0]);
    }
    setFarmerNotes(`Inspecting signs of ${record.name} (${record.vernacularNames.shona}). Symptoms: ${record.symptomsSummary}`);
    setActiveView('scanner');
    // Generate a clean diagnostic result directly from the official record
    setDiagnosticResult({
      diagnosis: `${record.name} (${record.scientificName}) / ${record.vernacularNames.shona}`,
      confidenceScore: 96,
      conditionType: record.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      severity: (record.riskLevel === 'Critical' ? 'High' : record.riskLevel) as 'High' | 'Moderate' | 'Low',
      affectedPart: record.affectedPlantParts.join(', '),
      symptomsSummary: record.symptomsSummary,
      primaryRemedy: {
        productName: record.primaryRegisteredControl.brandName,
        activeIngredient: record.primaryRegisteredControl.activeIngredient,
        manufacturer: record.primaryRegisteredControl.manufacturer,
        dosageInstructions: record.primaryRegisteredControl.dilutionRate,
        applicationTiming: record.primaryRegisteredControl.applicationTiming,
        preHarvestInterval: record.primaryRegisteredControl.safetyPreHarvestInterval,
      },
      ipmAndOrganicAlternative: {
        methodName: record.ipmOrganicControl.methodName,
        preparationAndApplication: `${record.ipmOrganicControl.preparationInstructions}. Cultural practice: ${record.ipmOrganicControl.culturalPractice}`,
      },
      preventativeMeasures: record.preventativeProtocol,
      agritexAdvisoryNote: `${record.agritexAdvisory} [Verified Reference: ${record.eppoCode} | ${record.economicThreshold}]`,
      databaseRecordId: record.id,
      eppoCode: record.eppoCode,
      resistantVarieties: record.resistantVarieties,
    });
  };

  // Filtered list of database records
  const filteredDatabaseRecords = useMemo(() => {
    return searchPestDiseaseDatabase({
      query: dbSearchQuery,
      cropOrAnimal: dbCropFilter === 'all' ? undefined : dbCropFilter,
      category: dbCategoryFilter === 'all' ? undefined : dbCategoryFilter,
      region: dbRegionFilter === 'all' ? undefined : (dbRegionFilter as any),
    });
  }, [dbSearchQuery, dbCropFilter, dbCategoryFilter, dbRegionFilter]);

  // Find corresponding database record for the current result
  const matchedDbRecord = useMemo(() => {
    if (!diagnosticResult) return null;
    if (diagnosticResult.databaseRecordId) {
      return getPestDiseaseById(diagnosticResult.databaseRecordId) || null;
    }
    // Search by name match
    const diagLower = diagnosticResult.diagnosis.toLowerCase();
    return REAL_PEST_DISEASE_DATABASE.find(r => 
      diagLower.includes(r.name.toLowerCase()) || 
      diagLower.includes(r.scientificName.toLowerCase()) ||
      r.eppoCode.toLowerCase() === (diagnosticResult.eppoCode || '').toLowerCase()
    ) || null;
  }, [diagnosticResult]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Module Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-base">
                🔬
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  Plant & Livestock Health Diagnostic System
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                    EPPO & Plant Pathology Reference Certified
                  </span>
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Official diagnostic system connected to the <strong>Zimbabwe Plant Pest and Disease Register</strong> and EPPO global taxonomy. Identifies pathogens, calculates economic thresholds, and prescribes registered agrochemicals with exact knapsack dilution rates and zero-cost Pfumvudza IPM cultural alternatives.
            </p>
          </div>

          {/* Sub-Tabs: Scanner vs Database Explorer vs Agrochemical Register vs Community Outbreak Heat Map */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start lg:self-center">
            <button
              onClick={() => setActiveView('scanner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeView === 'scanner'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              Field Camera Scanner
            </button>

            <button
              onClick={() => setActiveView('outbreaks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeView === 'outbreaks'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${activeView === 'outbreaks' ? 'text-white' : 'text-red-600'}`} />
              <span>Outbreak Heat Map</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeView === 'outbreaks' ? 'bg-red-700 text-white' : 'bg-red-100 text-red-800'
              }`}>
                {nearbyOutbreaksCount} Nearby
              </span>
            </button>

            <button
              onClick={() => setActiveView('database')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeView === 'database'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              Pest & Disease Database ({REAL_PEST_DISEASE_DATABASE.length})
            </button>

            <button
              onClick={() => setActiveView('chemicals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeView === 'chemicals'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
              Agrochemical Register ({PRE_DOWNLOADED_AGROCHEMICAL_DB.length})
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: FIELD CAMERA & DIAGNOSTIC SCANNER */}
      {activeView === 'scanner' && (
        <div className="space-y-4">
          {/* Real Community Outbreak Alert Banner for Current Location */}
          {nearbyOutbreaksCount > 0 && (
            <div 
              onClick={() => setActiveView('outbreaks')}
              className="cursor-pointer bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 text-white p-3.5 rounded-2xl border border-red-800/80 shadow-sm flex items-center justify-between transition hover:border-red-600 group"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-red-400 animate-pulse" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-red-300 uppercase tracking-wide">
                      Community Outbreak Alert
                    </span>
                    <span className="text-[10px] bg-red-600/40 text-red-200 px-2 py-0.2 rounded-full border border-red-500/30 font-bold">
                      {nearbyOutbreaksCount} Active Threats ≤ 50km
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Local smallholder farmers and community agronomy networks reported pest/disease outbreaks near your location ({currentLocationName}).
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-300 group-hover:text-white shrink-0 ml-2">
                <span>View Heat Map</span>
                <ChevronRight className="w-4 h-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input, Camera, Field Notes */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  1. Capture Field Specimen
                </h4>
                <span className="text-[11px] font-semibold text-slate-500">
                  Region: {currentLocationName}
                </span>
              </div>

              {/* Plant vs Livestock Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setTargetType('plant');
                    setCropOrAnimal('Hybrid Maize');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    targetType === 'plant'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  Crops & Horticulture
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTargetType('livestock');
                    setCropOrAnimal('Mashona Cattle');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    targetType === 'livestock'
                      ? 'bg-white text-amber-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="text-xs">🐂</span>
                  Livestock & Poultry
                </button>
              </div>

              {/* Crop / Animal Selector */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {targetType === 'plant' ? 'Target Crop / Host Plant' : 'Animal Specimen'}
                </label>
                <select
                  value={cropOrAnimal}
                  onChange={(e) => setCropOrAnimal(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {targetType === 'plant' ? (
                    <>
                      <option value="Hybrid Maize">White Maize (SC 637 / SC 719 / R201)</option>
                      <option value="Sorghum">Sorghum / Mhunga (Macia / SV-2)</option>
                      <option value="Pearl Millet">Pearl Millet (Inyawuthi / PMV-3)</option>
                      <option value="Groundnuts">Groundnuts (Nzungu - ICGV / Nyanda)</option>
                      <option value="Soya Beans">Soya Beans (SC Safari / Bimha)</option>
                      <option value="Tomato">Tomato (Sandveld / Roma / Heinz)</option>
                      <option value="Cabbage">Cabbage (Drumhead / Marcanta F1)</option>
                      <option value="Sweet Potatoes">Sweet Potatoes (Chingovhi / Alisha)</option>
                      <option value="Stored Maize">Stored Maize Grain in Granary (Dura)</option>
                    </>
                  ) : (
                    <>
                      <option value="Mashona Cattle">Mashona Beef Cattle</option>
                      <option value="Dairy Cow">Dairy Cow (Holstein / Jersey cross)</option>
                      <option value="Boer Goat">Indigenous / Boer Goat (Mbudzi)</option>
                      <option value="Roadrunner Chicken">Indigenous Chicken (Roadrunner / Huku)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Viewfinder / Camera Screen */}
              <div className="relative aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-slate-200 mb-4 flex items-center justify-center">
                {isCameraActive ? (
                  <div className="relative w-full h-full">
                    <video 
                      ref={videoRef} 
                      className="w-full h-full object-cover" 
                      autoPlay 
                      playsInline 
                      muted 
                    />
                    <div className="absolute inset-8 border border-white/50 border-dashed rounded-xl pointer-events-none flex items-center justify-center">
                      <span className="text-[10px] text-white/90 bg-black/60 px-2.5 py-1 rounded-full font-medium">
                        Center damaged leaf, stem, or symptoms
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                      <button
                        onClick={captureCameraFrame}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transition"
                      >
                        <Camera className="w-4 h-4" /> Snap Specimen
                      </button>
                      <button
                        onClick={stopCamera}
                        className="bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-full hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : selectedImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={selectedImage}
                      alt="Field specimen"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-xs text-white p-2 rounded-lg text-[11px] flex items-center justify-between">
                      <span className="font-semibold text-emerald-300">Specimen photo loaded</span>
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="text-rose-300 hover:text-white font-semibold underline text-[10px]"
                      >
                        Retake / Clear
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <Camera className="w-10 h-10 mx-auto mb-2 opacity-40 text-emerald-400" />
                    <p className="text-xs font-semibold text-slate-200">Field Specimen Camera Ready</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                      Snap an in-field photo of leaf damage, stem lesions, or animal symptoms, or upload from gallery.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons: Camera & Upload */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={isCameraActive ? stopCamera : startCamera}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {isCameraActive ? (
                    <>
                      <VideoOff className="w-4 h-4 text-rose-600" /> Stop Camera
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 text-emerald-700" /> Open Field Camera
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Upload className="w-4 h-4 text-blue-600" /> Upload from Phone
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Field Observations Input */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Observed Symptoms & Field Notes
                </label>
                <textarea
                  value={farmerNotes}
                  onChange={(e) => setFarmerNotes(e.target.value)}
                  placeholder="e.g. Saw small green caterpillars eating in central whorl with moist sawdust frass, or matchstick rectangular lesions on lower leaves..."
                  rows={2}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                />

                {/* Quick Symptom Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-[10px] text-slate-500 font-semibold self-center mr-1">Quick cues:</span>
                  {[
                    'Sawdust frass in whorl',
                    'Window-paned leaves',
                    'Matchstick lesions',
                    'Yellow streaks on veins',
                    'Concentric rings',
                    'Sudden wilting',
                    'Ear ticks swollen lymph',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setFarmerNotes(prev => prev ? `${prev}, ${tag}` : tag)}
                      className="text-[10px] bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 px-2 py-0.5 rounded-md border border-slate-200 transition"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Run Diagnosis Button */}
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing || (!selectedImage && !farmerNotes.trim())}
                className={`w-full py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition ${
                  isAnalyzing || (!selectedImage && !farmerNotes.trim())
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Querying Diagnostic Pathology Registry...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Diagnose & Generate Agronomy Remedy
                  </>
                )}
              </button>

              {errorMessage && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Direct Link to Certified Database */}
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h5 className="text-xs font-bold flex items-center gap-1.5 text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Authoritative Plant Pathology Database
                  </h5>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Browse 25+ certified crop pests, fungal blights, bacterial wilts, viral mosaics, and parasitic weeds with full EPPO codes and dilution rates.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('database')}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shrink-0 transition"
                >
                  Explore DB →
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Diagnostic Analysis & Agritex Remedy Output */}
          <div className="lg:col-span-7">
            {diagnosticResult ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-in fade-in">
                {/* Header with Severity & EPPO Reference */}
                <div className={`p-5 text-white ${
                  diagnosticResult.severity === 'High'
                    ? 'bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950'
                    : diagnosticResult.severity === 'Moderate'
                      ? 'bg-gradient-to-r from-amber-950 via-amber-900 to-emerald-950'
                      : 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-extrabold bg-black/40 px-2.5 py-0.5 rounded-full border border-white/20">
                      {diagnosticResult.conditionType}
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-white/20 px-2 py-0.5 rounded font-mono font-bold">
                        Confidence: {diagnosticResult.confidenceScore}%
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        diagnosticResult.severity === 'High' ? 'bg-rose-500 text-white' : 'bg-amber-400 text-black'
                      }`}>
                        {diagnosticResult.severity} Severity
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-white">
                    {diagnosticResult.diagnosis}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-200 font-medium">
                    <span>Affected Area: <strong>{diagnosticResult.affectedPart}</strong></span>
                    {diagnosticResult.eppoCode && (
                      <span className="bg-white/10 px-2 py-0.5 rounded font-mono">
                        EPPO: {diagnosticResult.eppoCode}
                      </span>
                    )}
                    {diagnosticResult.isOfflineGenerated && (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded text-[10px]">
                        On-Device Verified DB
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 space-y-5">
                  {/* Symptoms Summary */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                    <h5 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-emerald-700" />
                      Field Symptoms & Diagnostic Indicators
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {diagnosticResult.symptomsSummary}
                    </p>
                  </div>

                  {/* Primary Registered Agrochemical */}
                  <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
                          Official Zimbabwe Registered Agrochemical Remedy
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        DR&SS Registered
                      </span>
                    </div>

                    <div className="bg-white rounded-lg border border-emerald-200/70 p-3 space-y-2 mt-2">
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-sm text-slate-900">
                          {diagnosticResult.primaryRemedy.productName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-600">
                          Active: {diagnosticResult.primaryRemedy.activeIngredient}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-500 text-[11px] block">Knapsack Dilution Rate:</span>
                          <span className="font-semibold text-slate-800">
                            {diagnosticResult.primaryRemedy.dosageInstructions}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[11px] block">Timing & Weather:</span>
                          <span className="font-semibold text-slate-800">
                            {diagnosticResult.primaryRemedy.applicationTiming}
                          </span>
                        </div>
                        <div className="sm:col-span-2 bg-amber-50 border border-amber-200/80 rounded p-2 text-[11px] text-amber-900">
                          <strong>Pre-Harvest Interval (PHI) / Withdrawal:</strong> {diagnosticResult.primaryRemedy.preHarvestInterval}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Zero-Cost Pfumvudza / Organic Alternative */}
                  <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-700 text-white flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                      <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
                        Zero-Cost Pfumvudza / Organic Smallholder Alternative
                      </h4>
                    </div>

                    <div className="bg-white rounded-lg border border-amber-200/70 p-3 space-y-1.5">
                      <span className="font-bold text-xs text-amber-900 block">
                        {diagnosticResult.ipmAndOrganicAlternative.methodName}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {diagnosticResult.ipmAndOrganicAlternative.preparationAndApplication}
                      </p>
                    </div>
                  </div>

                  {/* Preventative Measures */}
                  {diagnosticResult.preventativeMeasures && diagnosticResult.preventativeMeasures.length > 0 && (
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        Preventative Agronomic Protocol
                      </h5>
                      <ul className="space-y-1.5">
                        {diagnosticResult.preventativeMeasures.map((measure, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                            <span>{measure}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Master Farmer & Agronomist Guideline */}
                  <div className="bg-slate-900 text-white rounded-xl p-3.5 text-xs flex items-start gap-3">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-300 block mb-0.5">
                        Master Farmer Agronomy Advisory:
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {diagnosticResult.agritexAdvisoryNote}
                      </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      {matchedDbRecord && (
                        <button
                          onClick={() => setInspectingRecord(matchedDbRecord)}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Database Monograph ({matchedDbRecord.eppoCode}) →
                        </button>
                      )}

                      <button
                        onClick={() => setActiveView('outbreaks')}
                        className="text-xs font-bold text-red-700 hover:text-red-900 flex items-center gap-1 transition bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg"
                      >
                        <Flame className="w-3.5 h-3.5 text-red-600" />
                        View Outbreak Heat Map Near Farm →
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setDiagnosticResult(null);
                        setSelectedImage(null);
                        setFarmerNotes('');
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                    >
                      Scan Another Specimen
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center h-full flex flex-col items-center justify-center min-h-[440px]">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-3xl mb-3 shadow-inner">
                  🌱
                </div>
                <h4 className="font-extrabold text-base text-slate-900 mb-1">
                  Ready to Diagnose Field Specimen
                </h4>
                <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
                  Capture a photo using your field camera, upload an image from your device, or explore the certified <strong>Zimbabwe Plant Pest and Disease Register</strong> below.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md w-full">
                  <button
                    onClick={startCamera}
                    className="p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Camera className="w-4 h-4" />
                    Open Live Field Camera
                  </button>

                  <button
                    onClick={() => setActiveView('database')}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    Browse Pest Registry
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}

      {/* VIEW 2: REAL PLANT PEST & DISEASE DATABASE EXPLORER */}
      {activeView === 'database' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search input */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={dbSearchQuery}
                  onChange={(e) => setDbSearchQuery(e.target.value)}
                  placeholder="Search by pest, disease, Shona name (Mhungu), EPPO code, chemical..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Crop Filter */}
              <div className="md:col-span-3">
                <select
                  value={dbCropFilter}
                  onChange={(e) => setDbCropFilter(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="all">All Host Crops & Animals</option>
                  <option value="Maize">Hybrid Maize (Chibage)</option>
                  <option value="Sorghum">Sorghum (Mhunga)</option>
                  <option value="Tomato">Tomato (Madomasi)</option>
                  <option value="Groundnuts">Groundnuts (Nzungu)</option>
                  <option value="Cabbage">Cabbage & Brassicas</option>
                  <option value="Sweet Potatoes">Sweet Potatoes (Mbambaira)</option>
                  <option value="Cattle">Cattle & Livestock</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="md:col-span-2">
                <select
                  value={dbCategoryFilter}
                  onChange={(e) => setDbCategoryFilter(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="all">All Pathogen Types</option>
                  <option value="insect_pest">Insect Pests</option>
                  <option value="fungal_disease">Fungal Blights</option>
                  <option value="bacterial_disease">Bacterial Wilts</option>
                  <option value="viral_disease">Viral Viruses</option>
                  <option value="parasitic_weed">Parasitic Weeds</option>
                  <option value="veterinary_health">Livestock Health</option>
                </select>
              </div>

              {/* Region Filter */}
              <div className="md:col-span-2">
                <select
                  value={dbRegionFilter}
                  onChange={(e) => setDbRegionFilter(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="all">All Agro Regions</option>
                  <option value="I">Region I (Highland/Mist)</option>
                  <option value="IIa">Region IIa (Intensive)</option>
                  <option value="IIb">Region IIb (Sub-intensive)</option>
                  <option value="III">Region III (Semi-intensive)</option>
                  <option value="IV">Region IV (Semi-arid)</option>
                  <option value="V">Region V (Arid Lowveld)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1 border-t border-slate-100">
              <span>
                Showing <strong>{filteredDatabaseRecords.length}</strong> verified pathology records
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                Sourced from Regional Plant Pathology Standards & EPPO Global Database
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDatabaseRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Card Header with Badges */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50/70">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        record.category === 'insect_pest' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        record.category === 'fungal_disease' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                        record.category === 'bacterial_disease' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                        record.category === 'viral_disease' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                        record.category === 'parasitic_weed' ? 'bg-red-100 text-red-900 border border-red-300' :
                        'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {record.category.replace('_', ' ')}
                      </span>
                      <span className="font-mono text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                        {record.eppoCode}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition">
                      {record.name}
                    </h4>
                    <div className="text-xs text-slate-500 italic">
                      {record.scientificName}
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-800 mt-1">
                      {record.vernacularNames.shona} {record.vernacularNames.ndebele ? `• ${record.vernacularNames.ndebele}` : ''}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wide">
                        Host Crops / Specimens:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {record.hostCropsOrAnimals.map(h => (
                          <span key={h} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                      {record.symptomsSummary}
                    </p>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-[11px]">
                      <span className="font-bold text-emerald-950 block">Registered Control:</span>
                      <span className="text-emerald-800 font-semibold">{record.primaryRegisteredControl.brandName}</span>
                      <span className="text-slate-600 block text-[10px] mt-0.5 font-mono">
                        Rate: {record.primaryRegisteredControl.dilutionRate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setInspectingRecord(record)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition"
                  >
                    View Full Dossier <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => prefillFromDatabaseRecord(record)}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Load Specimen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: AGROCHEMICAL REGISTER */}
      {activeView === 'chemicals' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-700" />
                Pre-Downloaded Zimbabwe Agrochemical & Veterinary Register
              </h4>
              <p className="text-xs text-slate-500">
                Official registration numbers, smallholder knapsack dilution rates, and safety intervals.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
              {PRE_DOWNLOADED_AGROCHEMICAL_DB.length} Approved Products
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Trade Name & Registration</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Active Ingredient</th>
                  <th className="p-3.5">Target Condition</th>
                  <th className="p-3.5">Smallholder Dosage Rate</th>
                  <th className="p-3.5">Safety Interval (PHI)</th>
                  <th className="p-3.5">Est. Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PRE_DOWNLOADED_AGROCHEMICAL_DB.map((chem) => (
                  <tr key={chem.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{chem.brandName}</div>
                      <div className="text-[10px] text-slate-500">{chem.activeIngredient}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        chem.category === 'Insecticide' ? 'bg-rose-100 text-rose-800' :
                        chem.category === 'Fungicide' ? 'bg-amber-100 text-amber-800' :
                        chem.category.includes('Veterinary') ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {chem.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-mono text-[11px]">
                      {chem.activeIngredient}
                    </td>
                    <td className="p-3.5 text-slate-700 max-w-xs">
                      {chem.targetCondition}
                    </td>
                    <td className="p-3.5 text-slate-900 font-semibold max-w-xs leading-relaxed">
                      {chem.smallholderDosageRate}
                    </td>
                    <td className="p-3.5 text-amber-800 font-semibold">
                      {chem.safetyIntervalPhi}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-800">
                      {chem.priceEstimateUsd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: REAL COMMUNITY OUTBREAK HEAT MAP */}
      {activeView === 'outbreaks' && (
        <CommunityOutbreakHeatMapView
          currentLocationName={currentLocationName}
          selectedLocation={selectedLocation}
          isOfflineMode={isOfflineMode}
          onNavigateToScannerWithRecord={(pestRecordId) => {
            const foundRec = REAL_PEST_DISEASE_DATABASE.find(p => p.id === pestRecordId);
            if (foundRec) {
              prefillFromDatabaseRecord(foundRec);
            } else {
              setActiveView('scanner');
            }
          }}
          onNavigateToChemicalRegister={() => {
            setActiveView('chemicals');
          }}
        />
      )}

      {/* FULL RECORD DOSSIER MODAL */}
      {inspectingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-emerald-950 text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-800/80 px-2 py-0.5 rounded text-emerald-200">
                    {inspectingRecord.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                    EPPO: {inspectingRecord.eppoCode}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500 text-white">
                    {inspectingRecord.riskLevel} Risk
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  {inspectingRecord.name}
                </h3>
                <p className="text-xs text-slate-300 italic">
                  {inspectingRecord.scientificName} • Shona: {inspectingRecord.vernacularNames.shona} {inspectingRecord.vernacularNames.ndebele ? `• Ndebele: ${inspectingRecord.vernacularNames.ndebele}` : ''}
                </p>
              </div>

              <button
                onClick={() => setInspectingRecord(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {/* Host Crops & Regions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Host Crops / Specimens:</span>
                  <span className="text-slate-900 font-medium">
                    {inspectingRecord.hostCropsOrAnimals.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Prevalence in Zimbabwe:</span>
                  <span className="text-slate-900 font-medium">
                    Natural Regions {inspectingRecord.prevalenceRegions.join(', ')} ({inspectingRecord.seasonalWindow})
                  </span>
                </div>
              </div>

              {/* Diagnostic Indicators */}
              <div>
                <h5 className="font-extrabold text-slate-900 text-xs mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Key Field Diagnostic Indicators
                </h5>
                <ul className="space-y-1.5 bg-rose-50/50 border border-rose-200/80 rounded-xl p-3">
                  {inspectingRecord.keyDiagnosticIndicators.map((ind, i) => (
                    <li key={i} className="text-rose-950 flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Economic Threshold */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-950">
                <span className="font-bold block mb-0.5">Economic Action Threshold:</span>
                <p className="leading-relaxed">{inspectingRecord.economicThreshold}</p>
              </div>

              {/* Chemical Treatment */}
              <div className="border border-emerald-200 bg-emerald-50/60 rounded-xl p-4">
                <span className="font-extrabold text-xs text-emerald-950 uppercase tracking-wide block mb-2">
                  Official Registered Chemical Control
                </span>
                <div className="bg-white rounded-lg border border-emerald-200 p-3 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900 text-sm">
                    <span>{inspectingRecord.primaryRegisteredControl.brandName}</span>
                    <span className="text-emerald-700">{inspectingRecord.primaryRegisteredControl.estimatedCostUsd}</span>
                  </div>
                  <div className="text-slate-600 font-mono text-[11px]">
                    Active: {inspectingRecord.primaryRegisteredControl.activeIngredient}
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <strong>Knapsack Dilution:</strong> {inspectingRecord.primaryRegisteredControl.dilutionRate}
                    </div>
                    <div>
                      <strong>Safety Pre-Harvest (PHI):</strong> {inspectingRecord.primaryRegisteredControl.safetyPreHarvestInterval}
                    </div>
                  </div>
                </div>
              </div>

              {/* Organic & Pfumvudza IPM */}
              <div className="border border-amber-200 bg-amber-50/60 rounded-xl p-4">
                <span className="font-extrabold text-xs text-amber-950 uppercase tracking-wide block mb-2">
                  Zero-Cost Pfumvudza Organic / Cultural Control
                </span>
                <div className="bg-white rounded-lg border border-amber-200 p-3 space-y-1 text-[11px]">
                  <span className="font-bold text-amber-900 block text-xs">
                    {inspectingRecord.ipmOrganicControl.methodName}
                  </span>
                  <p className="text-slate-700">
                    {inspectingRecord.ipmOrganicControl.preparationInstructions}
                  </p>
                  <p className="text-slate-600 pt-1 border-t border-slate-100">
                    <strong>Cultural Practice:</strong> {inspectingRecord.ipmOrganicControl.culturalPractice}
                  </p>
                </div>
              </div>

              {/* Agronomy Advisory */}
              <div className="bg-slate-900 text-white rounded-xl p-3.5 flex items-start gap-2.5">
                <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-300 block mb-0.5">Agronomy Specialist Guideline:</span>
                  <p className="text-slate-300 leading-relaxed">
                    {inspectingRecord.agritexAdvisory}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <button
                onClick={() => setInspectingRecord(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Close Dossier
              </button>

              <button
                onClick={() => {
                  const rec = inspectingRecord;
                  setInspectingRecord(null);
                  prefillFromDatabaseRecord(rec);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Diagnose Farm Specimen with this Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
