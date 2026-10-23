import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Share2, 
  Download, 
  Printer, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight, 
  FileText, 
  Layers, 
  Sprout, 
  Award,
  Calendar,
  CheckCircle2,
  Info,
  FlaskConical,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Droplet
} from 'lucide-react';
import { OFFICIAL_CROP_MANUALS, CropManual } from '../data/cropManualsDatabase';
import { REGISTERED_ZIMBABWE_CHEMICALS, RegisteredChemical } from '../data/registeredChemicalsDatabase';
import { ZimbabweLocation } from '../data/zimbabweLocations';
import { buildWhatsAppUniversalShare } from '../data/farmersDictionaryData';
import { downloadCropManualPDF, downloadChemicalDossierPDF } from '../utils/pdfAdvisoryGenerator';
import { getChemicalDetailedManual } from '../data/chemicalManualsDatabase';

interface CropManualsLibraryProps {
  currentLocation: ZimbabweLocation;
  onSelectCropForPlanner?: (cropName: string) => void;
}

export const CropManualsLibrary: React.FC<CropManualsLibraryProps> = ({
  currentLocation,
  onSelectCropForPlanner
}) => {
  // Top-level tab: manuals or registered agrochemicals
  const [activeTab, setActiveTab] = useState<'manuals' | 'chemicals'>('manuals');

  // Manuals filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedManual, setSelectedManual] = useState<CropManual | null>(OFFICIAL_CROP_MANUALS[0]);
  const [copiedManualId, setCopiedManualId] = useState<string | null>(null);

  // Chemicals filter states
  const [chemicalSearch, setChemicalSearch] = useState<string>('');
  const [chemicalCategory, setChemicalCategory] = useState<string>('all');
  const [chemicalToxicity, setChemicalToxicity] = useState<string>('all');
  const [selectedChemical, setSelectedChemical] = useState<RegisteredChemical | null>(REGISTERED_ZIMBABWE_CHEMICALS[0]);
  const [copiedChemicalId, setCopiedChemicalId] = useState<string | null>(null);
  const [chemicalManualLang, setChemicalManualLang] = useState<'en' | 'sn' | 'nd'>('en');

  const categories = [
    { id: 'all', label: 'All Manuals' },
    { id: 'Cereals & Grains', label: 'Cereals & Grains' },
    { id: 'Horticulture & Vegetables', label: 'Horticulture & Veg' },
    { id: 'Legumes & Oilseeds', label: 'Legumes & Soya' },
    { id: 'Cash Crops (Tobacco/Cotton)', label: 'Tobacco & Cotton' },
    { id: 'Crop Nutrition & Soils', label: 'Fertilizers & Nutrition' },
    { id: 'Crop Protection & Spraying', label: 'Sprays & Protection' }
  ];

  const chemicalCategories = [
    { id: 'all', label: 'All Categories' },
    { id: 'Insecticide', label: 'Insecticides & Acaricides' },
    { id: 'Herbicide', label: 'Herbicides & Weed Killers' },
    { id: 'Fungicide', label: 'Fungicides & Bactericides' },
    { id: 'Nematicide', label: 'Nematicides & Soil Disinfectants' },
    { id: 'Veterinary Dip & Health', label: 'Veterinary Dips & Animal Health' },
    { id: 'Suckericide & Adjuvant', label: 'Adjuvants & Stickers' }
  ];

  const chemicalToxicities = [
    { id: 'all', label: 'All Toxicity Classes' },
    { id: 'Green', label: '🟢 Green (Caution - IV)' },
    { id: 'Amber', label: '🟡 Amber (Dangerous - III)' },
    { id: 'Red', label: '🔴 Red (Poison - II)' },
    { id: 'Purple', label: '🟣 Purple (Very Toxic - I)' }
  ];

  // Filtered manuals
  const filteredManuals = useMemo(() => {
    return OFFICIAL_CROP_MANUALS.filter((manual) => {
      if (selectedCategory !== 'all' && manual.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = manual.title.toLowerCase().includes(q);
        const matchesSummary = manual.summary.toLowerCase().includes(q);
        const matchesCrops = manual.targetCrops.some(c => c.toLowerCase().includes(q));
        const matchesDirectives = manual.keyDirectives.some(d => d.toLowerCase().includes(q));

        return matchesTitle || matchesSummary || matchesCrops || matchesDirectives;
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  // Filtered chemicals
  const filteredChemicals = useMemo(() => {
    return REGISTERED_ZIMBABWE_CHEMICALS.filter((chem) => {
      if (chemicalCategory !== 'all' && chem.category !== chemicalCategory) {
        return false;
      }
      if (chemicalToxicity !== 'all' && !chem.toxicityClass.includes(chemicalToxicity)) {
        return false;
      }
      if (chemicalSearch.trim()) {
        const q = chemicalSearch.toLowerCase().trim();
        const matchesTrade = chem.tradeName.toLowerCase().includes(q);
        const matchesActive = chem.activeIngredient.toLowerCase().includes(q);
        const matchesReg = chem.registrationNumber.toLowerCase().includes(q);
        const matchesCrops = chem.approvedCrops.some(c => c.toLowerCase().includes(q));
        const matchesPests = chem.targetPestsWeedsDiseases.some(p => p.toLowerCase().includes(q));
        const matchesAdvisory = chem.agritexFieldAdvisory.toLowerCase().includes(q);

        return matchesTrade || matchesActive || matchesReg || matchesCrops || matchesPests || matchesAdvisory;
      }
      return true;
    });
  }, [chemicalSearch, chemicalCategory, chemicalToxicity]);

  const handleShareToWhatsApp = (manual: CropManual) => {
    const text = `📖 *FARMERS DICTIONARY ZW • TECHNICAL CROP MANUAL*
━━━━━━━━━━━━━━━━━━━━━
📘 *Title:* ${manual.title}
📋 *Technical Standard:* ${manual.edition}
🌱 *Target Crops:* ${manual.targetCrops.join(', ')}
📍 *Suitable Regions:* Regions ${manual.recommendedRegions.join(', ')}

📊 *Core Technical Specifications:*
• Plant Population: ${manual.plantPopulationPerHa}
• Seed Rate: ${manual.seedRatePerHa}
• Basal Fertilizer: ${manual.basalFertilizerRecommendation}
• Top Dressing: ${manual.topDressingRecommendation}
• Spray Program Highlight: ${manual.sprayProgramHighlight}
• Harvest Criteria: ${manual.harvestCriteria}

💡 *Top Agritex & Agronomy Directives:*
${manual.keyDirectives.map((d, i) => `${i + 1}. ${d}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━
_Powered by Farmers Dictionary Zw • Official National Agronomy Standards_`;

    const shareUrl = buildWhatsAppUniversalShare(text);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyManualSummary = (manual: CropManual) => {
    const text = `${manual.title} (${manual.edition})\nTarget Crops: ${manual.targetCrops.join(', ')}\nBasal: ${manual.basalFertilizerRecommendation}\nTop Dressing: ${manual.topDressingRecommendation}\nDirectives:\n${manual.keyDirectives.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedManualId(manual.id);
    setTimeout(() => setCopiedManualId(null), 2500);
  };

  const handleShareChemicalToWhatsApp = (chem: RegisteredChemical) => {
    const text = `🧪 *FARMERS DICTIONARY ZW • REGISTERED AGROCHEMICAL*
━━━━━━━━━━━━━━━━━━━━━
🔬 *Trade Name:* ${chem.tradeName}
📋 *Registration No:* ${chem.registrationNumber} (DR&SS Approved)
🏷️ *Category:* ${chem.category} | ${chem.toxicityClass}
🧪 *Active Ingredient:* ${chem.activeIngredient} (${chem.formulation})

🌾 *Approved Crops:* ${chem.approvedCrops.join(', ')}
🎯 *Target Pests / Diseases / Weeds:*
${chem.targetPestsWeedsDiseases.map(p => `• ${p}`).join('\n')}

💧 *Recommended Application Rates:*
• Per Hectare: ${chem.applicationRates.perHectare}
• Per 15L Knapsack: ${chem.applicationRates.knapsack15L}
• Water Volume: ${chem.applicationRates.waterVolumePerHa}

⏱️ *Safety Intervals:*
• Pre-Harvest Interval (PHI): *${chem.preHarvestIntervalDays} days*
• Re-Entry Interval: ${chem.reEntryIntervalHours} hours

💡 *Agritex Field Advisory:*
${chem.agritexFieldAdvisory}

━━━━━━━━━━━━━━━━━━━━━
_Farmers Dictionary Zw • DR&SS Pesticides Regulations Act (Chapter 18:12)_`;

    const shareUrl = buildWhatsAppUniversalShare(text);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyChemicalSummary = (chem: RegisteredChemical) => {
    const text = `${chem.tradeName} (${chem.registrationNumber})\nActive: ${chem.activeIngredient}\nRates: ${chem.applicationRates.perHectare} | Knapsack: ${chem.applicationRates.knapsack15L}\nPHI: ${chem.preHarvestIntervalDays} days\nApproved Crops: ${chem.approvedCrops.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedChemicalId(chem.id);
    setTimeout(() => setCopiedChemicalId(null), 2500);
  };

  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const handleDownloadManualPDF = (manual: CropManual) => {
    setIsGeneratingPdf(true);
    try {
      downloadCropManualPDF(manual, currentLocation.name);
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 800);
    }
  };

  const handleDownloadChemicalPDF = (chem: RegisteredChemical) => {
    setIsGeneratingPdf(true);
    try {
      downloadChemicalDossierPDF(chem, chemicalManualLang);
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 800);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              National Technical Repository
            </span>
            <span className="text-emerald-200/70 text-xs font-medium">
              DR&SS Official Standards • National Agronomy Handbooks • Agritex Approved
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Crop Production Manuals & Approved Agrochemicals
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Direct access to official Zimbabwe technical crop production handbooks, agronomy standards, and the Ministry of Agriculture's DR&SS directory of registered pesticides, herbicides, fungicides, and veterinary remedies.
          </p>

          {/* Sub-view switcher */}
          <div className="flex flex-wrap gap-2 pt-3">
            <button
              onClick={() => setActiveTab('manuals')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                activeTab === 'manuals'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Official Crop Production Manuals ({OFFICIAL_CROP_MANUALS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('chemicals')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                activeTab === 'chemicals'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>DR&SS Registered Agrochemicals Register ({REGISTERED_ZIMBABWE_CHEMICALS.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== VIEW 1: OFFICIAL CROP MANUALS ==================== */}
      {activeTab === 'manuals' && (
        <div className="space-y-6">
          {/* Controls Bar: Search & Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search manuals, crops, fertilizers, sprays..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Counts Badge */}
              <div className="text-xs text-slate-500 font-medium self-end md:self-center">
                Showing <strong className="text-slate-900">{filteredManuals.length}</strong> of {OFFICIAL_CROP_MANUALS.length} verified handbooks
              </div>
            </div>

            {/* Filter Pills */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dual Column Layout: Manuals List & Reader */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Manual Cards List (5 cols) */}
            <div className="lg:col-span-5 space-y-3 max-h-[850px] overflow-y-auto pr-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Verified Technical Handbooks
              </div>

              {filteredManuals.map((manual) => {
                const isSelected = selectedManual?.id === manual.id;

                return (
                  <div
                    key={manual.id}
                    onClick={() => setSelectedManual(manual)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {manual.category}
                        </span>

                        <span className="text-[10px] text-slate-400 font-medium">
                          {manual.edition}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {manual.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {manual.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100/80 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        {manual.targetCrops.slice(0, 2).map((crop) => (
                          <span key={crop} className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-medium">
                            {crop}
                          </span>
                        ))}
                        {manual.targetCrops.length > 2 && (
                          <span className="text-slate-400">+{manual.targetCrops.length - 2}</span>
                        )}
                      </div>

                      <span className="font-bold text-emerald-700 flex items-center gap-0.5">
                        Read Guide <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredManuals.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-700">No manuals found</h4>
                  <p className="text-xs text-slate-500">Try clearing your search query or category filters.</p>
                </div>
              )}
            </div>

            {/* Right Column: Active Manual Detailed Reader (7 cols) */}
            <div className="lg:col-span-7">
              {selectedManual ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                  {/* Manual Header & Actions */}
                  <div className="space-y-3 pb-5 border-b border-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-800 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                          {selectedManual.category}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {selectedManual.edition}
                        </span>
                      </div>

                      {/* Download PDF, WhatsApp Share & Copy Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadManualPDF(selectedManual)}
                          disabled={isGeneratingPdf}
                          className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                          title="Download official PDF technical manual"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isGeneratingPdf ? 'Exporting...' : 'Download PDF'}</span>
                        </button>

                        <button
                          onClick={() => handleShareToWhatsApp(selectedManual)}
                          className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          title="Share complete agronomy manual to WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share to WhatsApp</span>
                        </button>

                        <button
                          onClick={() => handleCopyManualSummary(selectedManual)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                          title="Copy summary"
                        >
                          {copiedManualId === selectedManual.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <span>Copy</span>
                          )}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {selectedManual.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {selectedManual.summary}
                    </p>

                    {/* Target Crops & Regional Suitability Tags */}
                    <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                      <div>
                        <span className="font-bold text-slate-500 uppercase text-[10px] block">Target Crops:</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {selectedManual.targetCrops.map(c => (
                            <span key={c} className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-500 uppercase text-[10px] block">Natural Regions:</span>
                        <div className="flex gap-1 mt-0.5">
                          {selectedManual.recommendedRegions.map(r => (
                            <span key={r} className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                              Region {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Agronomic Benchmarks Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plant Population</span>
                      <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">{selectedManual.plantPopulationPerHa}</span>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Seed Rate</span>
                      <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">{selectedManual.seedRatePerHa}</span>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Basal Fertilizer</span>
                      <span className="text-xs font-extrabold text-emerald-800 mt-0.5 block">{selectedManual.basalFertilizerRecommendation}</span>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Top Dressing</span>
                      <span className="text-xs font-extrabold text-blue-800 mt-0.5 block">{selectedManual.topDressingRecommendation}</span>
                    </div>
                  </div>

                  {/* Key Agronomy Directives (Agritex Technical Standards) */}
                  <div className="bg-emerald-50/80 border-l-4 border-emerald-600 rounded-r-2xl p-4 sm:p-5 space-y-2">
                    <div className="font-black text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Mandatory Technical Production Directives</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-800 leading-relaxed">
                      {selectedManual.keyDirectives.map((directive, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{directive}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Chemical Protection & Spray Highlight */}
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <span>🛡️ Official Chemical & Pest Spray Program:</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">
                      {selectedManual.sprayProgramHighlight}
                    </p>
                    <div className="text-[11px] text-amber-800 font-medium pt-1">
                      <strong>Harvest & Curing Requirement:</strong> {selectedManual.harvestCriteria}
                    </div>
                  </div>

                  {/* Full Technical Sections */}
                  <div className="space-y-4 pt-2">
                    <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-700" />
                      <span>Technical Chapters & Protocols</span>
                    </h4>

                    {selectedManual.sections.map((section, sIdx) => (
                      <div key={sIdx} className="border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 bg-white shadow-2xs">
                        <h5 className="font-bold text-sm text-slate-900">{section.heading}</h5>

                        {section.content && (
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {section.content}
                          </p>
                        )}

                        {section.bulletPoints && (
                          <ul className="space-y-1.5 text-xs text-slate-700 pt-1">
                            {section.bulletPoints.map((bp, bpIdx) => (
                              <li key={bpIdx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                                <span>{bp}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                  <p className="text-slate-500 text-sm">Select a manual from the left list to read technical directives.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== VIEW 2: REGISTERED AGROCHEMICALS & VETERINARY REGISTER ==================== */}
      {activeTab === 'chemicals' && (
        <div className="space-y-6">
          {/* Statutory Authority Callout */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg shrink-0">
                ⚖️
              </span>
              <div>
                <h4 className="font-black text-sm sm:text-base text-white">
                  Official Directory of Approved Agricultural Chemicals & Veterinary Remedies
                </h4>
                <p className="text-xs text-slate-300">
                  Ministry of Lands, Agriculture, Fisheries, Water and Rural Development • Department of Research & Specialist Services (DR&SS) - Pesticides Regulations Act (Chapter 18:12) & Department of Veterinary Services (DVS).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
              <span className="text-emerald-400 font-bold">DR&SS & DVS Certified</span>
            </div>
          </div>

          {/* Controls Bar: Search & Chemical Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={chemicalSearch}
                  onChange={(e) => setChemicalSearch(e.target.value)}
                  placeholder="Search trade name, active ingredient, pest, crop..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
                {chemicalSearch && (
                  <button
                    onClick={() => setChemicalSearch('')}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Chemical count */}
              <div className="text-xs text-slate-500 font-medium self-end md:self-center">
                Showing <strong className="text-slate-900">{filteredChemicals.length}</strong> of {REGISTERED_ZIMBABWE_CHEMICALS.length} approved remedies
              </div>
            </div>

            {/* Filter Pills */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5 text-xs">
              {/* Category Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Type:
                </span>
                {chemicalCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setChemicalCategory(c.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                      chemicalCategory === c.id
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Toxicity Class Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Toxicity Class:
                </span>
                {chemicalToxicities.map((tox) => (
                  <button
                    key={tox.id}
                    onClick={() => setChemicalToxicity(tox.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                      chemicalToxicity === tox.id
                        ? 'bg-slate-900 text-white ring-2 ring-emerald-500'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tox.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dual Column Layout: Chemicals List & Dossier Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Chemical Cards List (5 cols) */}
            <div className="lg:col-span-5 space-y-3 max-h-[850px] overflow-y-auto pr-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Approved Formulations & Remedies
              </div>

              {filteredChemicals.map((chem) => {
                const isSelected = selectedChemical?.id === chem.id;

                return (
                  <div
                    key={chem.id}
                    onClick={() => setSelectedChemical(chem)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: chem.hazardTriangleColor }}
                            title={`Toxicity: ${chem.toxicityClass}`}
                          />
                          <span className="text-[10px] font-mono text-slate-500 font-bold">
                            {chem.registrationNumber}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">
                          {chem.tradeName}
                        </h4>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        chem.category === 'Insecticide' ? 'bg-rose-100 text-rose-800' :
                        chem.category === 'Herbicide' ? 'bg-amber-100 text-amber-800' :
                        chem.category === 'Fungicide' ? 'bg-blue-100 text-blue-800' :
                        chem.category.includes('Veterinary') ? 'bg-purple-100 text-purple-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {chem.category}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="font-mono text-[11px] text-slate-700 font-medium">
                        🔬 {chem.activeIngredient}
                      </div>
                      <div className="text-slate-500 line-clamp-1">
                        🎯 {chem.targetPestsWeedsDiseases.slice(0, 2).join(', ')}
                        {chem.targetPestsWeedsDiseases.length > 2 && '...'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500">
                        PHI: <strong className="text-slate-800">{chem.preHarvestIntervalDays} days</strong>
                      </span>
                      <span className="font-bold text-emerald-700 flex items-center gap-0.5">
                        Inspect Dossier <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredChemicals.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
                  <FlaskConical className="w-8 h-8 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-700">No registered chemicals found</h4>
                  <p className="text-xs text-slate-500">Try adjusting your category, toxicity class, or search keywords.</p>
                </div>
              )}
            </div>

            {/* Right Column: Active Chemical Detailed Dossier (7 cols) */}
            <div className="lg:col-span-7">
              {selectedChemical ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                  {/* Chemical Header & Actions */}
                  <div className="space-y-3 pb-5 border-b border-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: selectedChemical.hazardTriangleColor }}
                        />
                        <span className="text-xs font-bold text-slate-700">
                          {selectedChemical.toxicityClass}
                        </span>
                        <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">
                          {selectedChemical.registrationNumber}
                        </span>
                      </div>

                      {/* Download PDF, WhatsApp Share & Copy */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadChemicalPDF(selectedChemical)}
                          disabled={isGeneratingPdf}
                          className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                          title="Download official DR&SS chemical dossier in PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isGeneratingPdf ? 'Exporting...' : 'Download PDF'}</span>
                        </button>

                        <button
                          onClick={() => handleShareChemicalToWhatsApp(selectedChemical)}
                          className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          title="Share dosage and safety guidelines to WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share to WhatsApp</span>
                        </button>

                        <button
                          onClick={() => handleCopyChemicalSummary(selectedChemical)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                        >
                          {copiedChemicalId === selectedChemical.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <span>Copy Dosage</span>
                          )}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {selectedChemical.tradeName}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Active Ingredient:</span>
                        <span className="font-mono font-bold text-slate-900 text-xs">{selectedChemical.activeIngredient}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Chemical Group & Formulation:</span>
                        <span className="font-semibold text-slate-800 text-xs">{selectedChemical.chemicalGroup} ({selectedChemical.formulation})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Registration Status:</span>
                        <span className="font-semibold text-slate-800 text-xs">Official DR&SS Certified Registry</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Statutory Register:</span>
                        <span className="font-semibold text-emerald-800 text-xs">Pesticides Regulations Act (18:12)</span>
                      </div>
                    </div>
                  </div>

                  {/* Application Rates Benchmark Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Commercial Rate</span>
                      <span className="text-sm font-extrabold text-emerald-950 mt-1 block">{selectedChemical.applicationRates.perHectare}</span>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                      <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">15L Knapsack Rate (Smallholder)</span>
                      <span className="text-sm font-extrabold text-blue-950 mt-1 block">{selectedChemical.applicationRates.knapsack15L}</span>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Water Volume / Ha</span>
                      <span className="text-sm font-extrabold text-amber-950 mt-1 block">{selectedChemical.applicationRates.waterVolumePerHa}</span>
                    </div>
                  </div>

                  {/* Safety & Withholding Intervals Strip */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs">
                        <Clock className="w-4 h-4 text-rose-600" />
                        <span>Pre-Harvest Interval (PHI):</span>
                      </div>
                      <div className="text-base font-black text-rose-950">
                        {selectedChemical.preHarvestIntervalDays === 0 ? '0 Days (Harvest Same Day)' : `${selectedChemical.preHarvestIntervalDays} Days Before Harvest`}
                      </div>
                      <p className="text-[11px] text-rose-800/80">
                        Do not pick or consume treated crops before this period expires.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                        <ShieldAlert className="w-4 h-4 text-slate-600" />
                        <span>Field Re-Entry Interval:</span>
                      </div>
                      <div className="text-base font-black text-slate-900">
                        {selectedChemical.reEntryIntervalHours === 0 ? 'Immediate Re-Entry' : `${selectedChemical.reEntryIntervalHours} Hours Wait`}
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Wait until spray deposit dries completely before entering field without PPE.
                      </p>
                    </div>
                  </div>

                  {/* Approved Crops & Target Pests */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                        Approved Crops & Livestock Specimens:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedChemical.approvedCrops.map((c) => (
                          <span key={c} className="bg-slate-100 text-slate-800 font-semibold px-2.5 py-1 rounded-xl text-xs border border-slate-200">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                        Target Pests, Weeds & Pathogens:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedChemical.targetPestsWeedsDiseases.map((p) => (
                          <span key={p} className="bg-rose-50 text-rose-900 font-semibold px-2.5 py-1 rounded-xl text-xs border border-rose-200">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Agritex Field Advisory & Mode of Action */}
                  <div className="bg-emerald-50/80 border-l-4 border-emerald-600 rounded-r-2xl p-4 sm:p-5 space-y-2">
                    <div className="font-black text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Agritex Extension Field Advisory</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {selectedChemical.agritexFieldAdvisory}
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-1">
                      <span className="font-bold text-slate-900 block">Biochemical Mode of Action:</span>
                      <p className="text-slate-700 leading-relaxed">{selectedChemical.modeOfAction}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="border border-amber-200 bg-amber-50/50 rounded-2xl p-3.5 space-y-1">
                        <span className="font-bold text-amber-950 block">Operator Safety Precautions:</span>
                        <p className="text-amber-900 leading-relaxed text-[11px]">{selectedChemical.safetyPrecautions}</p>
                      </div>

                      <div className="border border-red-200 bg-red-50/50 rounded-2xl p-3.5 space-y-1">
                        <span className="font-bold text-red-950 block">First Aid & Antidote:</span>
                        <p className="text-red-900 leading-relaxed text-[11px]">{selectedChemical.firstAidAntidote}</p>
                      </div>
                    </div>
                  </div>

                  {/* FULL DETAILED DR&SS TECHNICAL APPLICATION MANUAL (MULTILINGUAL) */}
                  {(() => {
                    const detailedManual = getChemicalDetailedManual(selectedChemical, chemicalManualLang);
                    return (
                      <div className="pt-6 border-t-2 border-emerald-900/10 space-y-5">
                        {/* Manual Header & Multilingual Language Switcher Bar */}
                        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg border border-emerald-700/40">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                                <BookOpen className="w-3 h-3 text-emerald-300" />
                                <span>Official DR&SS Field Manual</span>
                              </span>
                              <span className="text-[10px] font-mono font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">
                                {selectedChemical.registrationNumber}
                              </span>
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-white">
                              Detailed Technical Manual • {detailedManual.languageName}
                            </h4>
                            <p className="text-xs text-emerald-100/90 leading-relaxed max-w-xl">
                              Certified technical directives for {selectedChemical.tradeName} under the Pesticides Regulations Act (Chapter 18:12).
                            </p>
                          </div>

                          {/* Language Switcher Tabs: English, ChiShona, isiNdebele */}
                          <div className="flex items-center bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0">
                            {[
                              { code: 'en' as const, label: 'English', flag: '🇬🇧' },
                              { code: 'sn' as const, label: 'ChiShona', flag: '🇿🇼' },
                              { code: 'nd' as const, label: 'isiNdebele', flag: '🇿🇼' }
                            ].map((langTab) => (
                              <button
                                key={langTab.code}
                                type="button"
                                onClick={() => setChemicalManualLang(langTab.code)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                                  chemicalManualLang === langTab.code
                                    ? 'bg-emerald-500 text-white shadow-md'
                                    : 'text-emerald-100 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                <span>{langTab.flag}</span>
                                <span>{langTab.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Statutory Chemical Overview Box */}
                        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-xs text-slate-800 leading-relaxed font-medium">
                          {detailedManual.chemicalOverview}
                        </div>

                        {/* 8 Detailed Technical Manual Sections Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* 1. Knapsack Calibration */}
                          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
                            <h5 className="font-black text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                              <span>💧</span>
                              <span>{detailedManual.knapsackCalibration.title}</span>
                            </h5>
                            <p className="text-xs text-slate-700 leading-relaxed">{detailedManual.knapsackCalibration.content}</p>
                            {detailedManual.knapsackCalibration.bulletPoints && (
                              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                                {detailedManual.knapsackCalibration.bulletPoints.map((bp, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                                    <span>{bp}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          {/* 2. Field Application Directives */}
                          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
                            <h5 className="font-black text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🌾</span>
                              <span>{detailedManual.fieldApplicationDirectives.title}</span>
                            </h5>
                            <p className="text-xs text-slate-700 leading-relaxed">{detailedManual.fieldApplicationDirectives.content}</p>
                            {detailedManual.fieldApplicationDirectives.bulletPoints && (
                              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                                {detailedManual.fieldApplicationDirectives.bulletPoints.map((bp, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                                    <span>{bp}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          {/* 3. Safety & PPE */}
                          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
                            <h5 className="font-black text-xs text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🦺</span>
                              <span>{detailedManual.safetyAndPpe.title}</span>
                            </h5>
                            <p className="text-xs text-slate-700 leading-relaxed">{detailedManual.safetyAndPpe.content}</p>
                            {detailedManual.safetyAndPpe.bulletPoints && (
                              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                                {detailedManual.safetyAndPpe.bulletPoints.map((bp, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                                    <span>{bp}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          {/* 4. First Aid & Emergency */}
                          <div className="bg-white border border-rose-200 bg-rose-50/30 rounded-2xl p-4 shadow-2xs space-y-2">
                            <h5 className="font-black text-xs text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🚨</span>
                              <span>{detailedManual.firstAidAndEmergency.title}</span>
                            </h5>
                            <p className="text-xs text-slate-700 leading-relaxed">{detailedManual.firstAidAndEmergency.content}</p>
                            {detailedManual.firstAidAndEmergency.bulletPoints && (
                              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                                {detailedManual.firstAidAndEmergency.bulletPoints.map((bp, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                                    <span>{bp}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          {/* 5. Withholding & Harvest Re-Entry */}
                          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
                            <h5 className="font-black text-xs text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                              <span>⏱️</span>
                              <span>{detailedManual.withholdingAndIntervals.title}</span>
                            </h5>
                            <p className="text-xs text-slate-700 leading-relaxed">{detailedManual.withholdingAndIntervals.content}</p>
                            {detailedManual.withholdingAndIntervals.bulletPoints && (
                              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                                {detailedManual.withholdingAndIntervals.bulletPoints.map((bp, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                                    <span>{bp}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          {/* 6. Tank Mixing Compatibility */}
                          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
                            <h5 className="font-black text-xs text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🧪</span>
                              <span>{detailedManual.tankMixingCompatibility.title}</span>
                            </h5>
                            <p className="text-xs text-slate-700 leading-relaxed">{detailedManual.tankMixingCompatibility.content}</p>
                            {detailedManual.tankMixingCompatibility.bulletPoints && (
                              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                                {detailedManual.tankMixingCompatibility.bulletPoints.map((bp, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                                    <span>{bp}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          {/* 7. Safe Storage & Approved Disposal */}
                          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
                            <h5 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🔒</span>
                              <span>{detailedManual.storageAndDisposal.title}</span>
                            </h5>
                            <p className="text-xs text-slate-700 leading-relaxed">{detailedManual.storageAndDisposal.content}</p>
                            {detailedManual.storageAndDisposal.bulletPoints && (
                              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                                {detailedManual.storageAndDisposal.bulletPoints.map((bp, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                                    <span>{bp}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          {/* 8. Environmental, Aquatic & Honeybee Protection */}
                          <div className="bg-white border border-emerald-200 bg-emerald-50/30 rounded-2xl p-4 shadow-2xs space-y-2">
                            <h5 className="font-black text-xs text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🐝</span>
                              <span>{detailedManual.environmentalProtection.title}</span>
                            </h5>
                            <p className="text-xs text-slate-700 leading-relaxed">{detailedManual.environmentalProtection.content}</p>
                            {detailedManual.environmentalProtection.bulletPoints && (
                              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                                {detailedManual.environmentalProtection.bulletPoints.map((bp, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                                    <span>{bp}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                  <p className="text-slate-500 text-sm">Select an agrochemical from the left list to view rates, toxicity, and safety data.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
