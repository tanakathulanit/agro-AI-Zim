import React, { useState, useMemo } from 'react';
import { 
  User, 
  MapPin, 
  Sprout, 
  Beef, 
  FileText, 
  Download, 
  Share2, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Droplets, 
  Layers, 
  Calendar, 
  DollarSign, 
  ChevronRight, 
  Clock, 
  HelpCircle,
  ExternalLink,
  Bot
} from 'lucide-react';
import { 
  FarmerProfile, 
  CropHolding, 
  LivestockHoldings, 
  loadFarmerProfile, 
  saveFarmerProfile, 
  clearFarmerProfile,
  createEmptyFarmerProfile, 
  generatePersonalizedAgritexAdvisory, 
  buildPersonalizedWhatsAppAdvisory,
  calculateDaysAfterPlanting 
} from '../data/farmerProfileData';
import { ZIMBABWE_LOCATIONS, ZimbabweLocation } from '../data/zimbabweLocations';
import { ALL_EXPANDED_CROPS } from '../data/allCropsDatabase';
import { downloadFarmerProfileAdvisoryPDF } from '../utils/pdfAdvisoryGenerator';
import { ZimbabweLiveFlag } from './ZimbabweLiveFlag';

interface Props {
  currentLocation: ZimbabweLocation;
  onSyncAppLocation?: (locationId: string) => void;
  onNavigateToAssistant?: (farmerContext: string) => void;
  onNavigateToPlanner?: (cropName: string) => void;
}

export const FarmerProfileView: React.FC<Props> = ({
  currentLocation,
  onSyncAppLocation,
  onNavigateToAssistant,
  onNavigateToPlanner
}) => {
  const [profile, setProfile] = useState<FarmerProfile>(() => loadFarmerProfile() || createEmptyFarmerProfile(currentLocation.id));
  const [activeTab, setActiveTab] = useState<'advisory' | 'location' | 'crops' | 'livestock'>('advisory');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // New crop modal / inline state
  const [isAddingCrop, setIsAddingCrop] = useState<boolean>(false);
  const [editingCropId, setEditingCropId] = useState<string | null>(null);
  const [newCropForm, setNewCropForm] = useState<Omit<CropHolding, 'id'>>({
    cropId: 'maize_medium',
    cropName: 'Hybrid White Maize',
    vernacularName: 'Chibage (SC 719)',
    variety: 'Seed Co SC 719',
    areaPlanted: 1,
    areaUnit: 'pfumvudza_plots',
    sowingDate: new Date().toISOString().split('T')[0],
    growthStage: 'vegetative',
    irrigationStatus: 'rainfed',
    expectedYieldBagsOrTonnes: 24,
    notes: 'Standard Pfumvudza plot (1,444 basins) with grass mulch blanket.'
  });

  // Calculate live personalized advisory
  const personalizedAdvisory = useMemo(() => {
    return generatePersonalizedAgritexAdvisory(profile);
  }, [profile]);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleSave = () => {
    const success = saveFarmerProfile(profile);
    if (success) {
      triggerToast('Farmer Profile & Agritex recommendations saved successfully!');
    } else {
      triggerToast('Failed to save profile. Please check storage permissions.');
    }
  };

  const handleClearProfile = () => {
    if (window.confirm('Clear all manually entered profile data? This will reset your profile to empty so you can enter your details afresh.')) {
      clearFarmerProfile();
      const empty = createEmptyFarmerProfile(currentLocation.id);
      setProfile(empty);
      triggerToast('Profile cleared. You can now enter your details manually.');
    }
  };

  const handleDistrictChange = (districtId: string) => {
    const targetLoc = ZIMBABWE_LOCATIONS.find(l => l.id === districtId);
    if (!targetLoc) return;

    const updated: FarmerProfile = {
      ...profile,
      districtId: targetLoc.id,
      districtName: targetLoc.name,
      province: targetLoc.province,
      naturalRegion: targetLoc.naturalRegion as 'I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V',
    };
    setProfile(updated);
    saveFarmerProfile(updated);

    if (onSyncAppLocation) {
      onSyncAppLocation(targetLoc.id);
    }
    triggerToast(`Location updated to ${targetLoc.name} (Region ${targetLoc.naturalRegion}) & synced with app.`);
  };

  const handleShareToWhatsApp = () => {
    const text = buildPersonalizedWhatsAppAdvisory(profile, personalizedAdvisory);
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank', 'noopener,noreferrer');
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      await new Promise(r => setTimeout(r, 150));
      downloadFarmerProfileAdvisoryPDF(profile, personalizedAdvisory);
      triggerToast('Personalized Agritex Advisory PDF downloaded!');
    } catch (err) {
      console.error('PDF export failed:', err);
      triggerToast('Failed to generate PDF dossier.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Crop management handlers
  const handleOpenAddCrop = () => {
    setEditingCropId(null);
    setNewCropForm({
      cropId: 'maize_medium',
      cropName: 'Hybrid White Maize',
      vernacularName: 'Chibage (SC 719)',
      variety: 'Seed Co SC 719',
      areaPlanted: 1,
      areaUnit: 'pfumvudza_plots',
      sowingDate: new Date().toISOString().split('T')[0],
      growthStage: 'vegetative',
      irrigationStatus: 'rainfed',
      expectedYieldBagsOrTonnes: 24,
      notes: ''
    });
    setIsAddingCrop(true);
  };

  const handleSelectStandardCrop = (cropId: string) => {
    const found = ALL_EXPANDED_CROPS.find(c => c.cropId === cropId);
    if (!found) return;

    setNewCropForm(prev => ({
      ...prev,
      cropId: found.cropId,
      cropName: found.name,
      vernacularName: found.shonaName ? `${found.shonaName} / ${found.ndebeleName || ''}` : found.name,
      variety: found.recommendedVarieties?.[0] || 'Certified High-Yield Variety',
      expectedYieldBagsOrTonnes: found.pfumvudzaYieldBags?.avg || 15
    }));
  };

  const handleSaveCrop = () => {
    let updatedCrops: CropHolding[];
    if (editingCropId) {
      updatedCrops = profile.activeCrops.map(c => 
        c.id === editingCropId ? { ...newCropForm, id: editingCropId } : c
      );
      triggerToast(`Updated crop ${newCropForm.cropName}`);
    } else {
      const newEntry: CropHolding = {
        ...newCropForm,
        id: `crop-${Date.now()}`
      };
      updatedCrops = [...profile.activeCrops, newEntry];
      triggerToast(`Added ${newCropForm.cropName} to active production profile`);
    }

    const updatedProfile = { ...profile, activeCrops: updatedCrops };
    setProfile(updatedProfile);
    saveFarmerProfile(updatedProfile);
    setIsAddingCrop(false);
    setEditingCropId(null);
  };

  const handleEditCrop = (crop: CropHolding) => {
    setEditingCropId(crop.id);
    setNewCropForm({
      cropId: crop.cropId,
      cropName: crop.cropName,
      vernacularName: crop.vernacularName || '',
      variety: crop.variety,
      areaPlanted: crop.areaPlanted,
      areaUnit: crop.areaUnit,
      sowingDate: crop.sowingDate,
      growthStage: crop.growthStage,
      irrigationStatus: crop.irrigationStatus,
      expectedYieldBagsOrTonnes: crop.expectedYieldBagsOrTonnes,
      notes: crop.notes || ''
    });
    setIsAddingCrop(true);
  };

  const handleDeleteCrop = (cropId: string) => {
    const updatedCrops = profile.activeCrops.filter(c => c.id !== cropId);
    const updatedProfile = { ...profile, activeCrops: updatedCrops };
    setProfile(updatedProfile);
    saveFarmerProfile(updatedProfile);
    triggerToast('Crop removed from farm holdings.');
  };

  const handleLivestockChange = <K extends keyof LivestockHoldings>(key: K, value: LivestockHoldings[K]) => {
    const updatedLivestock = {
      ...profile.livestock,
      [key]: value
    };
    const updatedProfile = {
      ...profile,
      livestock: updatedLivestock
    };
    setProfile(updatedProfile);
    saveFarmerProfile(updatedProfile);
  };

  const isDippingOverdue = profile.livestock.cattleDippingStatus === 'overdue';
  const isDippingThisWeek = profile.livestock.cattleDippingStatus === 'due_this_week';

  return (
    <div className="space-y-6">
      {/* Toast notification banner */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-emerald-100 border border-emerald-500/50 shadow-2xl px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{saveToast}</span>
        </div>
      )}

      {/* Profile Master Header Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
                <User className="w-3.5 h-3.5" />
                <span>Personalized Agritex Farmer Profile & Settings</span>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-slate-950/70 border border-slate-700/60 flex items-center shadow-inner">
                <ZimbabweLiveFlag size="sm" showPulseBadge={true} showCountryLabel={true} />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              {profile.farmerName?.trim() || 'Manual Farmer Profile'}
              {profile.farmName?.trim() && (
                <span className="text-base sm:text-lg font-normal text-emerald-300/80">({profile.farmName})</span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Tailoring real-time extension advice, Pfumvudza basin dosing, dipping protocols, and crop stage directives for your exact enterprise.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleSave}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold transition shadow-lg flex items-center gap-2 cursor-pointer"
              title="Save current profile to local storage"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Download Personalized Agritex Advisory Report in PDF format"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>{isGeneratingPdf ? 'Generating...' : 'PDF Dossier'}</span>
            </button>

            <button
              onClick={handleShareToWhatsApp}
              className="px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] active:bg-[#1DA851] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
              title="Share full customized advisory to WhatsApp extension group"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedShare ? 'Opening...' : 'WhatsApp'}</span>
            </button>

            <button
              onClick={handleClearProfile}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              title="Clear profile (manual entry)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Farm Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-6 text-xs">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Land Location</span>
            <div className="font-bold text-white text-sm flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{profile.districtName}</span>
            </div>
            <span className="text-[10px] text-emerald-300/90 font-medium">Region {profile.naturalRegion} • {profile.province}</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Land Holding</span>
            <div className="font-bold text-white text-sm flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{profile.totalLandSize} {profile.landSizeUnit.replace('_', ' ')}</span>
            </div>
            <span className="text-[10px] text-slate-400 truncate block">{profile.resettlementModel}</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Active Crops</span>
            <div className="font-bold text-white text-sm flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{profile.activeCrops.length} Registered</span>
            </div>
            <span className="text-[10px] text-emerald-300/90 truncate block">
              {profile.activeCrops.map(c => c.cropName.split(' ')[0]).join(', ') || 'None in ground'}
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Livestock Holdings</span>
            <div className="font-bold text-white text-sm flex items-center gap-1">
              <Beef className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{profile.livestock.cattleHeadcount} Cattle • {profile.livestock.poultryHeadcount} Poultry</span>
            </div>
            <span className={`text-[10px] font-bold ${isDippingOverdue ? 'text-red-400' : isDippingThisWeek ? 'text-amber-300' : 'text-emerald-300'}`}>
              Dipping: {profile.livestock.cattleDippingStatus.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Soil & Water</span>
            <div className="font-bold text-white text-xs truncate">
              {profile.soilTexture.replace('_', ' ').toUpperCase()}
            </div>
            <span className="text-[10px] text-teal-300 font-medium truncate block">
              Water: {profile.waterSource.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('advisory')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'advisory'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>1. Tailored Agritex Advisory Hub</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-bold">Live</span>
        </button>

        <button
          onClick={() => setActiveTab('location')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'location'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span>2. Land Location & Agro-Ecological Region</span>
        </button>

        <button
          onClick={() => setActiveTab('crops')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'crops'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sprout className="w-4 h-4 text-emerald-500" />
          <span>3. Crops Under Production</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            {profile.activeCrops.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('livestock')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'livestock'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Beef className="w-4 h-4 text-emerald-500" />
          <span>4. Livestock Holdings & Dipping</span>
          {isDippingOverdue && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          )}
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: TAILORED AGRITEX ADVISORY HUB */}
      {/* ============================================================== */}
      {activeTab === 'advisory' && (
        <div className="space-y-6">
          {/* Manual Entry Notification if profile hasn't been named yet */}
          {!profile.farmerName?.trim() && (
            <div className="bg-amber-500/10 border-2 border-dashed border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-800 shrink-0 mt-0.5">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-950">
                    Manual Profile Entry (No Pre-Installed Profile)
                  </h4>
                  <p className="text-xs text-amber-900/90 mt-0.5 max-w-xl">
                    There are no pre-installed farmer profiles. Please enter your farmer name, district, active crops, and livestock under the tabs to tailor your Agritex advisory.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('location')}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0 cursor-pointer"
              >
                Enter Farm Details →
              </button>
            </div>
          )}

          {/* Status & Action Banner */}
          <div className={`rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            personalizedAdvisory.urgencyLevel === 'Critical Action'
              ? 'bg-red-50 border-red-200 text-red-900'
              : personalizedAdvisory.urgencyLevel === 'High Attention'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl shrink-0 ${
                personalizedAdvisory.urgencyLevel === 'Critical Action'
                  ? 'bg-red-600 text-white'
                  : personalizedAdvisory.urgencyLevel === 'High Attention'
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-700 text-white'
              }`}>
                {personalizedAdvisory.urgencyLevel === 'Critical Action' ? (
                  <ShieldAlert className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Agritex Diagnostic Protocol
                </div>
                <div className="font-black text-sm sm:text-base">
                  {personalizedAdvisory.urgencyLevel}: Recommended Actions for {profile.farmName}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Calibrated for Natural Region {profile.naturalRegion} ({profile.districtName}) • Soil: {profile.soilTexture.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {onNavigateToAssistant && (
                <button
                  onClick={() => {
                    const ctx = `Farmer: ${profile.farmerName}, Farm: ${profile.farmName}, District: ${profile.districtName} (Region ${profile.naturalRegion}), Soil: ${profile.soilTexture}, Crops: ${profile.activeCrops.map(c => `${c.cropName} (${c.growthStage})`).join(', ')}, Livestock: ${profile.livestock.cattleHeadcount} cattle (Dipping: ${profile.livestock.cattleDippingStatus})`;
                    onNavigateToAssistant(ctx);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  title="Ask the AI Extension Officer using this specific farm profile"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ask AI Officer with Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Pfumvudza Input Package Requirements Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Calculated Input Package for {profile.totalLandSize} {profile.landSizeUnit.replace('_', ' ')}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Precision Pfumvudza / Intwasa input distribution required for zero-wastage optimal grain yield.
                </p>
              </div>
              <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold shrink-0">
                DR&SS Approved Formula
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Basal Fertilizer</span>
                <span className="text-lg font-black text-slate-900 block my-0.5">
                  {personalizedAdvisory.pfumvudzaInputPackage.compoundDRequiredBags50kg} <span className="text-xs font-normal">bags</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Compound D (50kg)</span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Top Dressing</span>
                <span className="text-lg font-black text-emerald-700 block my-0.5">
                  {personalizedAdvisory.pfumvudzaInputPackage.anTopDressingRequiredBags50kg} <span className="text-xs font-normal">bags</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Ammonium Nitrate (50kg)</span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Certified Seed</span>
                <span className="text-lg font-black text-slate-900 block my-0.5">
                  {personalizedAdvisory.pfumvudzaInputPackage.certifiedSeedKg} <span className="text-xs font-normal">kg</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Certified Hybrid/OPV</span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Kraal Manure</span>
                <span className="text-lg font-black text-amber-700 block my-0.5">
                  {personalizedAdvisory.pfumvudzaInputPackage.kraalManureTonsEstimated} <span className="text-xs font-normal">tons</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Well-decomposed</span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Mulch Blanket</span>
                <span className="text-lg font-black text-slate-900 block my-0.5">
                  {personalizedAdvisory.pfumvudzaInputPackage.mulchBalesRequired} <span className="text-xs font-normal">bales</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Grass / stover (5cm)</span>
              </div>
            </div>
          </div>

          {/* Active Crop Directives Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Crop Phenological Stage Directives ({personalizedAdvisory.cropStageDirectives.length} Active)</span>
              </h3>
              <button
                onClick={() => setActiveTab('crops')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Manage Crops</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {personalizedAdvisory.cropStageDirectives.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                <Sprout className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No crops registered under production yet. Add your maize, sorghum, beans, or horticultural crops to receive stage-by-stage instructions.
                </p>
                <button
                  onClick={handleOpenAddCrop}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register First Crop</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalizedAdvisory.cropStageDirectives.map((cropDirective, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {cropDirective.stage}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">
                          {cropDirective.cropName}
                        </h4>
                        <span className="text-xs text-slate-500">Variety: {cropDirective.variety}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-700 block">
                          {cropDirective.daysAfterPlanting} Days
                        </span>
                        <span className="text-[10px] text-slate-400">After Sowing</span>
                      </div>
                    </div>

                    {/* Stage actions */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Agritex Directives</span>
                      <ul className="text-xs text-slate-700 space-y-1">
                        {cropDirective.recommendedActions.map((act, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {cropDirective.nutritionDose && (
                      <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-xs text-amber-900">
                        <span className="font-bold block text-[11px] text-amber-800">Target Fertilizer Dose:</span>
                        <span>{cropDirective.nutritionDose}</span>
                      </div>
                    )}

                    {cropDirective.sprayAlert && (
                      <div className="bg-red-50 border border-red-200/70 rounded-xl p-2.5 text-xs text-red-900">
                        <span className="font-bold block text-[11px] text-red-800">Pest Scout Alert:</span>
                        <span>{cropDirective.sprayAlert}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Livestock Directives & Soil Directives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Livestock Directives */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Beef className="w-4 h-4 text-emerald-600" />
                  <span>Livestock Veterinary Directives</span>
                </h4>
                <button
                  onClick={() => setActiveTab('livestock')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Manage
                </button>
              </div>

              {personalizedAdvisory.livestockDirectives.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No livestock holdings recorded.</p>
              ) : (
                <div className="space-y-2.5">
                  {personalizedAdvisory.livestockDirectives.map((ld, lIdx) => (
                    <div 
                      key={lIdx}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        ld.urgency === 'urgent'
                          ? 'bg-red-50 border-red-200 text-red-900'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px]">{ld.category}</span>
                        {ld.urgency === 'urgent' && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-600 text-white font-black">
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="leading-relaxed">{ld.directive}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Soil & Water Conservation Directives */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>Soil Nutrition & Water Resilience</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {profile.soilTexture.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2">
                {personalizedAdvisory.soilAndBasalDirectives.map((sd, sIdx) => (
                  <div key={sIdx} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/50 text-xs text-amber-950">
                    <span className="font-bold block text-[11px] text-amber-900">Soil Management:</span>
                    <span>{sd}</span>
                  </div>
                ))}

                {personalizedAdvisory.waterAndClimaticDirectives.map((wd, wIdx) => (
                  <div key={wIdx} className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-200/50 text-xs text-teal-950">
                    <span className="font-bold block text-[11px] text-teal-900">Moisture Conservation:</span>
                    <span>{wd}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: LAND LOCATION & NATURAL REGION */}
      {/* ============================================================== */}
      {activeTab === 'location' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Specific Land Location & Natural Farming Region</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select your exact district across Zimbabwe's 10 provinces. This automatically adjusts your agro-ecological rainfall threshold, sowing triggers, and Pfumvudza fertilizer recipes.
              </p>
            </div>
            <div className="shrink-0 p-2.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-md flex items-center">
              <ZimbabweLiveFlag size="md" showPulseBadge={true} showCountryLabel={true} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Farmer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Farmer Full Name
              </label>
              <input
                type="text"
                value={profile.farmerName}
                onChange={e => setProfile({ ...profile, farmerName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. Mavis Mutasa"
              />
            </div>

            {/* Farm / Plot Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Farm / Plot Name
              </label>
              <input
                type="text"
                value={profile.farmName}
                onChange={e => setProfile({ ...profile, farmName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. Kufara Family Plot"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp Phone Number
              </label>
              <input
                type="text"
                value={profile.phoneNumber}
                onChange={e => setProfile({ ...profile, phoneNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. 077 123 4567"
              />
            </div>

            {/* District Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                District / Farming Station
              </label>
              <select
                value={profile.districtId}
                onChange={e => handleDistrictChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
              >
                {ZIMBABWE_LOCATIONS.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.province}) — Region {loc.naturalRegion}
                  </option>
                ))}
              </select>
            </div>

            {/* Ward or Village */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ward / Village / Communal Area
              </label>
              <input
                type="text"
                value={profile.wardOrVillage}
                onChange={e => setProfile({ ...profile, wardOrVillage: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. Ward 4 (Chinyika Communal)"
              />
            </div>

            {/* Resettlement Model */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Farming Enterprise Model
              </label>
              <select
                value={profile.resettlementModel}
                onChange={e => setProfile({ ...profile, resettlementModel: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
              >
                <option value="Pfumvudza Communal">Pfumvudza Communal Smallholder</option>
                <option value="A1 Resettlement">A1 Resettlement (Self-Contained / Villagized)</option>
                <option value="A2 Commercial">A2 Medium to Large Commercial</option>
                <option value="Peri-Urban Horticulture">Peri-Urban Horticulture & Plots</option>
                <option value="Old Resettlement">Old Resettlement Scheme</option>
              </select>
            </div>

            {/* Total Land Size */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Land Size
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={profile.totalLandSize}
                  onChange={e => setProfile({ ...profile, totalLandSize: Number(e.target.value) || 1 })}
                  className="w-1/2 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <select
                  value={profile.landSizeUnit}
                  onChange={e => setProfile({ ...profile, landSizeUnit: e.target.value as any })}
                  className="w-1/2 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
                >
                  <option value="pfumvudza_plots">Pfumvudza Plots (0.06ha)</option>
                  <option value="hectares">Hectares (ha)</option>
                  <option value="acres">Acres</option>
                </select>
              </div>
            </div>

            {/* Dominant Soil Texture */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dominant Soil Texture
              </label>
              <select
                value={profile.soilTexture}
                onChange={e => setProfile({ ...profile, soilTexture: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
              >
                <option value="sandy">Granitic Sandveld (Sandy / Jecha)</option>
                <option value="red_clay">Fersiallitic Red Clay (Chidhaka Chitsvuku)</option>
                <option value="loam">Balanced Sandy Loam (Ivhu reGoromondo)</option>
                <option value="black_vertisol">Black Vertisol / Cotton Soil (Dope)</option>
              </select>
            </div>

            {/* Primary Water Source */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Water Supply
              </label>
              <select
                value={profile.waterSource}
                onChange={e => setProfile({ ...profile, waterSource: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
              >
                <option value="rainfed">100% Rainfed Dryland</option>
                <option value="pfumvudza_catchment">Pfumvudza Rainwater Catchment Pits</option>
                <option value="borehole_drip">Solar Borehole + Drip Irrigation</option>
                <option value="river_dam_canal">River / Weir / Dam Gravity Canal</option>
                <option value="sand_abstraction">River Sand Bed Abstraction</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Changes to land location immediately update the live Agritex advisory recommendations.
            </span>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Location Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: CROPS UNDER PRODUCTION */}
      {/* ============================================================== */}
      {activeTab === 'crops' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Current Crops Under Production ({profile.activeCrops.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Register crops planted or planned for this season to receive customized weeding, top-dressing splits, pest control, and harvesting directives.
              </p>
            </div>

            <button
              onClick={handleOpenAddCrop}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Crop</span>
            </button>
          </div>

          {/* Add / Edit Crop Modal / Form */}
          {isAddingCrop && (
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-700" />
                  <span>{editingCropId ? 'Edit Crop Holding' : 'Register New Crop Under Production'}</span>
                </h4>
                <button
                  onClick={() => setIsAddingCrop(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                >
                  Cancel
                </button>
              </div>

              {/* Standard crop pre-loader */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Quick Select from Zimbabwe Approved Crops Database:
                </label>
                <select
                  onChange={e => handleSelectStandardCrop(e.target.value)}
                  defaultValue=""
                  className="w-full px-3 py-2 text-xs border border-emerald-300 rounded-xl bg-white font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="" disabled>-- Pick a crop to autofill varieties & agronomics --</option>
                  {ALL_EXPANDED_CROPS.map(c => (
                    <option key={c.cropId} value={c.cropId}>
                      {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Crop Name</label>
                  <input
                    type="text"
                    value={newCropForm.cropName}
                    onChange={e => setNewCropForm({ ...newCropForm, cropName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                    placeholder="e.g. Hybrid White Maize"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vernacular Name (Shona / Ndebele)</label>
                  <input
                    type="text"
                    value={newCropForm.vernacularName || ''}
                    onChange={e => setNewCropForm({ ...newCropForm, vernacularName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                    placeholder="e.g. Chibage / Umumbu"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Variety / Seed Spec</label>
                  <input
                    type="text"
                    value={newCropForm.variety}
                    onChange={e => setNewCropForm({ ...newCropForm, variety: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                    placeholder="e.g. Seed Co SC 719"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Area Planted</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0.1"
                      step="0.5"
                      value={newCropForm.areaPlanted}
                      onChange={e => setNewCropForm({ ...newCropForm, areaPlanted: Number(e.target.value) || 1 })}
                      className="w-1/2 px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                    />
                    <select
                      value={newCropForm.areaUnit}
                      onChange={e => setNewCropForm({ ...newCropForm, areaUnit: e.target.value as any })}
                      className="w-1/2 px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none font-medium"
                    >
                      <option value="pfumvudza_plots">Pfumvudza Plots</option>
                      <option value="hectares">Hectares</option>
                      <option value="acres">Acres</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sowing / Planting Date</label>
                  <input
                    type="date"
                    value={newCropForm.sowingDate}
                    onChange={e => setNewCropForm({ ...newCropForm, sowingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Phenological Stage</label>
                  <select
                    value={newCropForm.growthStage}
                    onChange={e => setNewCropForm({ ...newCropForm, growthStage: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none font-medium"
                  >
                    <option value="land_prep">Basin Digging & Land Prep (-10 to 0 DAP)</option>
                    <option value="germination">Germination & Emergence (0 to 14 DAP)</option>
                    <option value="vegetative">Vegetative Knee-Height (15 to 45 DAP)</option>
                    <option value="flowering_tasseling">Flowering / Tasseling / Silking (45 to 75 DAP)</option>
                    <option value="grain_filling">Grain Filling / Podding (75 to 110 DAP)</option>
                    <option value="harvesting">Physiological Maturity & Harvest (110+ DAP)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Water / Irrigation Status</label>
                  <select
                    value={newCropForm.irrigationStatus}
                    onChange={e => setNewCropForm({ ...newCropForm, irrigationStatus: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none font-medium"
                  >
                    <option value="rainfed">Rainfed Dryland</option>
                    <option value="supplementary">Supplementary Irrigation</option>
                    <option value="irrigated">Full Drip / Overhead Irrigated</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expected Yield Target</label>
                  <input
                    type="number"
                    min="1"
                    value={newCropForm.expectedYieldBagsOrTonnes}
                    onChange={e => setNewCropForm({ ...newCropForm, expectedYieldBagsOrTonnes: Number(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                    placeholder="e.g. 24 (bags/plots) or tonnes"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">Field Notes / Observations</label>
                  <input
                    type="text"
                    value={newCropForm.notes || ''}
                    onChange={e => setNewCropForm({ ...newCropForm, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                    placeholder="e.g. Applied 1 beer bottle cap Compound D at planting; heavy mulch blanket."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-200">
                <button
                  onClick={() => setIsAddingCrop(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-emerald-100 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCrop}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm"
                >
                  {editingCropId ? 'Save Changes' : 'Confirm & Register Crop'}
                </button>
              </div>
            </div>
          )}

          {/* Active Crops List */}
          <div className="space-y-3">
            {profile.activeCrops.map(crop => {
              const dap = calculateDaysAfterPlanting(crop.sowingDate);
              return (
                <div 
                  key={crop.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">
                        {crop.cropName}
                      </h4>
                      {crop.vernacularName && (
                        <span className="text-xs text-slate-500 font-medium">
                          ({crop.vernacularName})
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        {crop.growthStage.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {crop.irrigationStatus.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span><strong>Variety:</strong> {crop.variety}</span>
                      <span><strong>Area:</strong> {crop.areaPlanted} {crop.areaUnit.replace('_', ' ')}</span>
                      <span><strong>Sowing Date:</strong> {crop.sowingDate} ({dap} Days After Sowing)</span>
                      <span><strong>Target Yield:</strong> {crop.expectedYieldBagsOrTonnes} bags/tonnes</span>
                    </div>

                    {crop.notes && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{crop.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {onNavigateToPlanner && (
                      <button
                        onClick={() => onNavigateToPlanner(crop.cropName)}
                        className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition"
                        title="View planting & harvest calendar for this crop"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleEditCrop(crop)}
                      className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
                      title="Edit crop specs"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteCrop(crop.id)}
                      className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 transition"
                      title="Remove crop from farm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: LIVESTOCK HOLDINGS & DIPPING */}
      {/* ============================================================== */}
      {activeTab === 'livestock' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <Beef className="w-5 h-5 text-emerald-600" />
              <span>Livestock Holdings & Veterinary Protocol</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure cattle headcounts, tick dipping frequency (mandatory 5-5-4 dipping regime in high-risk seasons), small ruminants, and indigenous roadrunner poultry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cattle & Draft Animals */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Beef className="w-4 h-4 text-emerald-600" />
                  <span>Cattle & Draft Oxen</span>
                </h4>
                <span className="text-xs font-black text-slate-700">
                  {profile.livestock.cattleHeadcount} Head
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cattle Headcount</label>
                  <input
                    type="number"
                    min="0"
                    value={profile.livestock.cattleHeadcount}
                    onChange={e => handleLivestockChange('cattleHeadcount', Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tick Dipping Status</label>
                  <select
                    value={profile.livestock.cattleDippingStatus}
                    onChange={e => handleLivestockChange('cattleDippingStatus', e.target.value as any)}
                    className={`w-full px-3 py-2 border rounded-xl bg-white font-bold outline-none ${
                      isDippingOverdue
                        ? 'border-red-400 text-red-700 bg-red-50'
                        : isDippingThisWeek
                        ? 'border-amber-400 text-amber-700 bg-amber-50'
                        : 'border-emerald-300 text-emerald-800'
                    }`}
                  >
                    <option value="up_to_date">Up-to-Date (Dipped within 7-14 days)</option>
                    <option value="due_this_week">Due This Week (Scheduled at local dip tank)</option>
                    <option value="overdue">OVERDUE (High tick / Theileriosis risk)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Working Draft Oxen (Pairs)</label>
                  <input
                    type="number"
                    min="0"
                    value={profile.livestock.draftOxenPairs}
                    onChange={e => handleLivestockChange('draftOxenPairs', Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                    placeholder="Pairs of oxen (Mombe dzekurimisa)"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Last Dip Tank Attendance</label>
                  <input
                    type="date"
                    value={profile.livestock.lastDippingDate || ''}
                    onChange={e => handleLivestockChange('lastDippingDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Last Anthrax / Blackleg Vaccine Date</label>
                  <input
                    type="date"
                    value={profile.livestock.lastAnthraxBlacklegVaccine || ''}
                    onChange={e => handleLivestockChange('lastAnthraxBlacklegVaccine', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Small Ruminants & Poultry */}
            <div className="space-y-4">
              {/* Goats & Sheep */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-slate-900 text-sm">Goats & Sheep (Small Ruminants)</h4>
                  <span className="font-black text-slate-700">{profile.livestock.goatSheepHeadcount} Head</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Headcount</label>
                  <input
                    type="number"
                    min="0"
                    value={profile.livestock.goatSheepHeadcount}
                    onChange={e => handleLivestockChange('goatSheepHeadcount', Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                  />
                </div>
              </div>

              {/* Poultry & Roadrunners */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-slate-900 text-sm">Poultry & Roadrunners (Huku dzekumusha)</h4>
                  <span className="font-black text-slate-700">{profile.livestock.poultryHeadcount} Birds</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Birds</label>
                  <input
                    type="number"
                    min="0"
                    value={profile.livestock.poultryHeadcount}
                    onChange={e => handleLivestockChange('poultryHeadcount', Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                  />
                </div>
              </div>

              {/* Pigs */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-slate-900 text-sm">Pigs (Piggery)</h4>
                  <span className="font-black text-slate-700">{profile.livestock.pigsHeadcount} Head</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Headcount</label>
                  <input
                    type="number"
                    min="0"
                    value={profile.livestock.pigsHeadcount}
                    onChange={e => handleLivestockChange('pigsHeadcount', Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Livestock numbers calibrate veterinary disease prophylaxis and organic kraal manure yield calculations.
            </span>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Livestock Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
