import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Droplets, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  HelpCircle, 
  Compass, 
  Sprout, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Scale, 
  ShieldCheck, 
  ShieldAlert, 
  Printer, 
  Copy, 
  Check, 
  Flame, 
  Sun, 
  CloudRain, 
  FlaskConical, 
  Hammer, 
  Wheat, 
  Share2,
  CalendarRange,
  Download
} from 'lucide-react';
import { ZimbabweLocation } from '../data/zimbabweLocations';
import { 
  SoilTextureType, 
  NaturalRegionCode, 
  SOIL_TEXTURE_DATABASE, 
  CROPS_SOIL_CONFIG, 
  calculateCustomFertilizer, 
  deriveWaterRetentionStrategy, 
  RIBBON_TEST_STEPS 
} from '../data/soilAssessmentData';
import { downloadSoilAssessmentPDF } from '../utils/pdfAdvisoryGenerator';
import { useTranslation } from '../context/LanguageContext';

interface Props {
  selectedLocation: ZimbabweLocation;
  onNavigateToPlanner?: (cropId: string) => void;
  onNavigateToCropAdvisor?: () => void;
}

export const SoilQualityAssessment: React.FC<Props> = ({
  selectedLocation,
  onNavigateToPlanner,
  onNavigateToCropAdvisor,
}) => {
  const { t, isShona, isNdebele } = useTranslation();

  // State: Soil texture selection
  const [selectedTexture, setSelectedTexture] = useState<SoilTextureType>('loam');

  // State: Natural Region override (defaults to the location's natural region)
  const [selectedRegion, setSelectedRegion] = useState<NaturalRegionCode>(
    (selectedLocation.naturalRegion as NaturalRegionCode) || 'IIa'
  );

  // State: Crop selection
  const [selectedCropId, setSelectedCropId] = useState<string>('maize');

  // State: Farm scale
  const [plotCount, setPlotCount] = useState<number>(1); // Standard Pfumvudza plots (1444 basins each)
  const [farmScaleUnit, setFarmScaleUnit] = useState<'pfumvudza' | 'hectare' | 'acre'>('pfumvudza');

  // State: Interactive Ribbon & Feel Test Wizard Modal / Drawer
  const [showRibbonWizard, setShowRibbonWizard] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(0);

  // State: Copy summary feedback
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Active texture metadata
  const textureDetails = useMemo(() => {
    return SOIL_TEXTURE_DATABASE[selectedTexture];
  }, [selectedTexture]);

  // Fertilizer recommendations calculation
  const fertilizerResult = useMemo(() => {
    return calculateCustomFertilizer(selectedTexture, selectedRegion, selectedCropId, plotCount);
  }, [selectedTexture, selectedRegion, selectedCropId, plotCount]);

  // Water retention strategy calculation
  const waterStrategy = useMemo(() => {
    return deriveWaterRetentionStrategy(selectedTexture, selectedRegion);
  }, [selectedTexture, selectedRegion]);

  // Handle Wizard selection
  const handleWizardSelectTexture = (texture: SoilTextureType) => {
    setSelectedTexture(texture);
    setShowRibbonWizard(false);
    setWizardStep(0);
  };

  // Copy assessment to clipboard
  const handleCopySummary = () => {
    const text = `FARMERS DICTIONARY ZW • SOIL QUALITY & AGRO-DOSING ASSESSMENT
Location: ${selectedLocation.name}, ${selectedLocation.province} (Natural Region ${selectedRegion})
Soil Texture: ${textureDetails.name} (${textureDetails.shonaName})
Target Crop: ${CROPS_SOIL_CONFIG[selectedCropId]?.name || 'Maize'}
Farm Scale: ${plotCount} Pfumvudza Plot(s) (${plotCount * 1444} basins total)

1. BASAL FERTILIZER APPLICATION:
- Product: ${fertilizerResult.basalProductName}
- Rate: ${fertilizerResult.basalKgPerHa} kg/ha (${fertilizerResult.basalBags50kgPerHa} bags of 50kg/ha)
- Basin Dosing: ${fertilizerResult.basalBottleCapDose} (${fertilizerResult.basalPerBasinGrams}g per basin)
- Placement: ${fertilizerResult.basalPlacementDepthCm}
- Timing: ${fertilizerResult.basalTiming}

2. TOP DRESSING (AMMONIUM NITRATE / UREA):
- Product: ${fertilizerResult.topProductName}
- Rate: ${fertilizerResult.topKgPerHa} kg/ha (${fertilizerResult.topBags50kgPerHa} bags of 50kg/ha)
- Total per basin: ${fertilizerResult.topBottleCapDose} (${fertilizerResult.topPerBasinGrams}g per basin)
- Split Schedule:
${fertilizerResult.splitSchedule.map(s => `  * Split ${s.splitNumber} (${s.timingDap}): ${s.bottleCapText} [${s.weatherTrigger}]`).join('\n')}

3. ORGANIC SOIL BUILDER & WATER RETENTION:
- Kraal Manure / Compost: ${fertilizerResult.kraalManureHandfulsPerBasin} handful(s) per basin (~500g)
- Water Holding Capacity: ${waterStrategy.waterHoldingCapacityLabel}
- Dry Spell Security: ${waterStrategy.drySpellSafetyDays} days of moisture reserve without rain
- Mulch Blanket: ${waterStrategy.mulchProtocol.recommendedDepthCm} cm depth of ${waterStrategy.mulchProtocol.materials.slice(0, 2).join(', ')}
${fertilizerResult.termitariaAnthillGuidance ? `- Anthill Practice: ${fertilizerResult.termitariaAnthillGuidance}` : ''}
${fertilizerResult.leachingHazardWarning ? `Warning: ${fertilizerResult.leachingHazardWarning}` : ''}

Generated via Farmers Dictionary Zw • Verified Agritex & CSRI Extension Standards`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  const handleShareToWhatsApp = () => {
    const text = `🧪 *FARMERS DICTIONARY ZW • SOIL & FERTILIZER PROTOCOL*
━━━━━━━━━━━━━━━━━━━━━
📍 *Location:* ${selectedLocation.name} (Natural Region ${selectedRegion})
🌱 *Soil Texture:* ${textureDetails.name} (${textureDetails.shonaName} / ${textureDetails.ndebeleName})
🌽 *Target Crop:* ${CROPS_SOIL_CONFIG[selectedCropId]?.name || 'Maize'}

1️⃣ *BASAL DRESSING (${fertilizerResult.basalProductName}):*
• Rate: ${fertilizerResult.basalKgPerHa} kg/ha (${fertilizerResult.basalBags50kgPerHa} bags of 50kg/ha)
• Pfumvudza Basin Dose: ${fertilizerResult.basalBottleCapDose} (${fertilizerResult.basalPerBasinGrams}g per basin)
• Placement: ${fertilizerResult.basalPlacementDepthCm}
• Timing: ${fertilizerResult.basalTiming}

2️⃣ *TOP-DRESSING (${fertilizerResult.topProductName}):*
• Rate: ${fertilizerResult.topKgPerHa} kg/ha (${fertilizerResult.topBags50kgPerHa} bags of 50kg/ha)
• Total per basin: ${fertilizerResult.topBottleCapDose} (${fertilizerResult.topPerBasinGrams}g per basin)
• Splits: ${fertilizerResult.splitSchedule.map(s => `Split ${s.splitNumber} at ${s.timingDap}: ${s.bottleCapText}`).join('; ')}

3️⃣ *WATER RETENTION & ORGANIC MATTERS:*
• Kraal Manure / Compost: ${fertilizerResult.kraalManureHandfulsPerBasin} handful(s) per basin (~500g)
• Dry Spell Security: ${waterStrategy.drySpellSafetyDays} days moisture reserve
• Mulch Depth: ${waterStrategy.mulchProtocol.recommendedDepthCm} cm

━━━━━━━━━━━━━━━━━━━━━
_Powered by Farmers Dictionary Zw • Agritex Precision Dosing_`;

    const encoded = encodeURIComponent(text.trim());
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    try {
      downloadSoilAssessmentPDF({
        districtName: selectedLocation.name,
        naturalRegion: selectedRegion,
        dominantSoil: textureDetails.name,
        textureName: textureDetails.name,
        textureShona: textureDetails.shonaName,
        textureNdebele: textureDetails.ndebeleName,
        cropName: CROPS_SOIL_CONFIG[selectedCropId]?.name || 'Maize',
        basalProduct: fertilizerResult.basalProductName,
        basalRateKg: fertilizerResult.basalKgPerHa,
        basalBottleCaps: fertilizerResult.basalBottleCapDose,
        basalGramsPerBasin: fertilizerResult.basalPerBasinGrams,
        basalPlacement: fertilizerResult.basalPlacementDepthCm,
        basalTiming: fertilizerResult.basalTiming,
        topProduct: fertilizerResult.topProductName,
        topRateKg: fertilizerResult.topKgPerHa,
        topBottleCaps: fertilizerResult.topBottleCapDose,
        topGramsPerBasin: fertilizerResult.topPerBasinGrams,
        splitSchedule: fertilizerResult.splitSchedule.map(s => ({
          splitNumber: s.splitNumber,
          timingDap: s.timingDap,
          bottleCapText: s.bottleCapText,
          rateKgHa: Math.round(fertilizerResult.topKgPerHa * (s.ratePct / 100))
        })),
        kraalManureHandfuls: fertilizerResult.kraalManureHandfulsPerBasin,
        drySpellDays: waterStrategy.drySpellSafetyDays,
        mulchDepthCm: waterStrategy.mulchProtocol.recommendedDepthCm,
        mulchMaterials: waterStrategy.mulchProtocol.materials,
        phRating: selectedRegion === 'I' || selectedRegion === 'IIa' ? 'Acidic (pH 4.8 - 5.5)' : 'Slightly Acidic to Neutral (pH 5.8 - 6.5)',
        limeRecommendationKg: selectedRegion === 'I' || selectedRegion === 'IIa' ? 500 : 0,
        warningNote: fertilizerResult.leachingHazardWarning || undefined
      });
    } catch (err) {
      console.error('Failed to export soil advisory PDF', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-7xl mx-auto pb-12">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Soil Quality & Agronomic Dosing Engine
              </span>
              <span className="text-amber-200/70 text-xs font-medium">
                Agritex & CSRI Precision Fertilizer Standards
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {isShona 
                ? 'Ongororo yeHutano hweIvhu neFetereza' 
                : isNdebele 
                  ? 'Ukuhlolwa Komhlabathi Lokulondoloza Amanzi' 
                  : 'Soil Quality, Fertilizer & Moisture Advisor'}
            </h1>

            <p className="text-sm text-stone-300 leading-relaxed">
              Tailored specifically for Zimbabwe smallholders. Input your soil texture to unlock exact 
              Pfumvudza basin fertilizer dosing (beer bottle cap measurements), leaching mitigation protocols, 
              and in-situ water retention strategies customized to your Natural Region micro-climate.
            </p>
          </div>

          {/* Quick Location & Region Pill */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shrink-0 space-y-1.5">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
              Active Location & Micro-Climate
            </span>
            <div className="text-base font-bold text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{selectedLocation.name}, {selectedLocation.province}</span>
            </div>
            <div className="text-xs text-stone-300">
              Calibrated for <strong className="text-emerald-300 font-bold">Natural Region {selectedRegion}</strong>
            </div>
          </div>
        </div>

        {/* Action Header Strip */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-stone-300">
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <FlaskConical className="w-3.5 h-3.5" /> No Lab Required
            </span>
            <span>•</span>
            <span>Calibrated with Pfumvudza 15×15×15cm Basins</span>
            <span>•</span>
            <span>Anti-Scorch Dry Spell Protocol</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRibbonWizard(true)}
              className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-xl font-bold transition flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {isShona ? 'Bvunza Bvunzo yeIvhu (Ribbon Test)' : 'Field Ribbon Test Guide'}
            </button>
            <button
              onClick={handleCopySummary}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition flex items-center gap-1.5"
              title="Copy complete assessment report"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSummary ? 'Copied to Clipboard' : 'Copy Summary'}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              title="Download official Soil Quality & Fertilizer Protocol PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Exporting...' : 'Download PDF Advisory'}</span>
            </button>
            <button
              onClick={handleShareToWhatsApp}
              className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Share soil fertilizer recipe to WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share to WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* PRIMARY CONTROLS PANEL */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-6">
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Step 1: Select Your Field Soil Texture (Ivhu reMumunda)
          </h2>

          {/* 3 Texture Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SANDY */}
            <button
              type="button"
              onClick={() => setSelectedTexture('sandy')}
              className={`p-5 rounded-2xl border-2 text-left transition relative flex flex-col justify-between ${
                selectedTexture === 'sandy'
                  ? 'border-amber-600 bg-amber-50/70 shadow-sm ring-2 ring-amber-500/20'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-lg">
                    Light / Granitic Sandveld
                  </span>
                  {selectedTexture === 'sandy' && (
                    <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                </div>

                <div className="text-base font-extrabold text-slate-900">
                  Sandy Soil
                </div>

                <div className="text-xs font-semibold text-amber-800">
                  {SOIL_TEXTURE_DATABASE.sandy.shonaName}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  Coarse-grained, gritty feel. Drains very rapidly, low organic carbon, and prone to rapid nutrient leaching.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Water Holding:</span>
                  <strong className="text-amber-800">60 - 95 mm/m</strong>
                </div>
                <div className="flex justify-between">
                  <span>Infiltration:</span>
                  <strong className="text-emerald-700">Rapid (&gt;35 mm/h)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Leaching Risk:</span>
                  <strong className="text-red-700 font-bold">Extreme</strong>
                </div>
              </div>
            </button>

            {/* LOAM */}
            <button
              type="button"
              onClick={() => setSelectedTexture('loam')}
              className={`p-5 rounded-2xl border-2 text-left transition relative flex flex-col justify-between ${
                selectedTexture === 'loam'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                    Medium / Balanced Loam
                  </span>
                  {selectedTexture === 'loam' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  )}
                </div>

                <div className="text-base font-extrabold text-slate-900">
                  Loam Soil
                </div>

                <div className="text-xs font-semibold text-emerald-800">
                  {SOIL_TEXTURE_DATABASE.loam.shonaName}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  Crumbly, soft floury feel. Balanced sand, silt, and clay. High nutrient absorption and excellent moisture retention.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200/60 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Water Holding:</span>
                  <strong className="text-emerald-800 font-bold">120 - 165 mm/m</strong>
                </div>
                <div className="flex justify-between">
                  <span>Infiltration:</span>
                  <strong className="text-emerald-700">Moderate (20 mm/h)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Leaching Risk:</span>
                  <strong className="text-slate-700">Moderate</strong>
                </div>
              </div>
            </button>

            {/* CLAY */}
            <button
              type="button"
              onClick={() => setSelectedTexture('clay')}
              className={`p-5 rounded-2xl border-2 text-left transition relative flex flex-col justify-between ${
                selectedTexture === 'clay'
                  ? 'border-stone-800 bg-stone-100/80 shadow-sm ring-2 ring-stone-500/20'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-stone-800 bg-stone-200 px-2.5 py-0.5 rounded-lg">
                    Heavy / Red Clay & Vertisol
                  </span>
                  {selectedTexture === 'clay' && (
                    <CheckCircle2 className="w-5 h-5 text-stone-800 shrink-0" />
                  )}
                </div>

                <div className="text-base font-extrabold text-slate-900">
                  Clay Soil (Munyakwe)
                </div>

                <div className="text-xs font-semibold text-stone-800">
                  {SOIL_TEXTURE_DATABASE.clay.shonaName}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  Dense, sticky when wet, rock-hard when dry. High cation retention (CEC) and maximum water capacity; slow infiltration.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-300 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Water Holding:</span>
                  <strong className="text-stone-900 font-bold">165 - 220 mm/m</strong>
                </div>
                <div className="flex justify-between">
                  <span>Infiltration:</span>
                  <strong className="text-amber-800 font-semibold">Slow (6 mm/h)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Leaching Risk:</span>
                  <strong className="text-emerald-700 font-bold">Very Low</strong>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* SECONDARY PARAMETERS GRID: Region, Crop, Scale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-slate-100">
          {/* Natural Region */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                Zimbabwe Natural Region
              </span>
              <span className="text-[10px] text-slate-500">Auto-detected: Region {selectedLocation.naturalRegion}</span>
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as NaturalRegionCode)}
              className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="I">Region I (Eastern Highlands: &gt;1000mm, high leaching, acidic)</option>
              <option value="IIa">Region IIa (Northern Highveld: 750-1000mm, intensive cropping)</option>
              <option value="IIb">Region IIb (Highveld: 700-800mm, moderate dry spells)</option>
              <option value="III">Region III (Mid-altitude: 500-700mm, severe mid-season dry spells)</option>
              <option value="IV">Region IV (Lowveld/Semi-arid: 450-650mm, drought-prone, high heat)</option>
              <option value="V">Region V (Arid Lowveld: &lt;450mm, erratic rainfall, extreme evaporation)</option>
            </select>
          </div>

          {/* Crop Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Wheat className="w-3.5 h-3.5 text-amber-600" />
              Target Crop (Chirimwa)
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="maize">Maize (Chibage / Umumbu) - High Feeder</option>
              <option value="sorghum_millet">Sorghum & Pearl Millet (Mapfunde / Mhunga) - Drought Hardy</option>
              <option value="legumes">Groundnuts & Soya Beans (Nzungu / Soya) - Nitrogen Fixer</option>
              <option value="sunflower">Sunflower (Pfurunzi / Imbonoswane) - Deep Taproot</option>
              <option value="horticulture">Horticulture Vegetables & Tomatoes (Muriwo)</option>
            </select>
          </div>

          {/* Plot Count / Scale */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-blue-600" />
                Pfumvudza Plot Units
              </span>
              <span className="text-[10px] text-slate-500">1 plot = 1,444 basins</span>
            </label>
            <div className="flex items-center gap-2">
              <select
                value={plotCount}
                onChange={(e) => setPlotCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value={1}>1 Pfumvudza Plot (1,444 basins • 624 m² / Family Food Security)</option>
                <option value={2}>2 Pfumvudza Plots (2,888 basins • Grain + Legumes)</option>
                <option value={3}>3 Pfumvudza Plots (4,332 basins • Standard National Package)</option>
                <option value={5}>5 Pfumvudza Plots (7,220 basins • Commercial Smallholder)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SOIL WATER & DIAGNOSTIC GAUGE STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Water Security Gauge */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500 flex items-center justify-between">
            <span>Dry Spell Water Security</span>
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{waterStrategy.drySpellSafetyDays}</span>
            <span className="text-xs font-extrabold text-slate-600">Rainless Days</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                waterStrategy.drySpellSafetyDays >= 12 
                  ? 'bg-emerald-600' 
                  : waterStrategy.drySpellSafetyDays >= 7 
                    ? 'bg-amber-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, (waterStrategy.drySpellSafetyDays / 18) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block">
            Moisture buffer in Region {selectedRegion} with 15cm mulch
          </span>
        </div>

        {/* Water Holding Capacity */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500 flex items-center justify-between">
            <span>Water Holding Capacity</span>
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900">{textureDetails.waterHoldingCapacityMmPerM.average}</span>
            <span className="text-xs font-extrabold text-slate-600">mm / meter soil</span>
          </div>
          <span className="text-xs text-slate-600 font-semibold block">
            Range: {textureDetails.waterHoldingCapacityMmPerM.min} - {textureDetails.waterHoldingCapacityMmPerM.max} mm/m
          </span>
          <span className="text-[11px] text-slate-500 block">
            Plant-available capillary moisture in rooting zone
          </span>
        </div>

        {/* Infiltration & Drainage */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500 flex items-center justify-between">
            <span>Infiltration Speed</span>
            <CloudRain className="w-3.5 h-3.5 text-teal-600" />
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900">{textureDetails.infiltrationRateMmPerHour}</span>
            <span className="text-xs font-extrabold text-slate-600">mm / hour</span>
          </div>
          <span className="text-xs font-bold text-emerald-700 block">
            Speed: {textureDetails.infiltrationSpeedCategory} ({textureDetails.drainageRate})
          </span>
          <span className="text-[11px] text-slate-500 block">
            Surface intake rate during heavy downpours
          </span>
        </div>

        {/* Nutrient Retention (CEC) */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500 flex items-center justify-between">
            <span>Nutrient Uptake Efficiency</span>
            <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900">{fertilizerResult.nitrogenEfficiencyRatingPct}%</span>
            <span className="text-xs font-extrabold text-slate-600">Efficiency</span>
          </div>
          <span className="text-xs text-slate-700 font-semibold block">
            Cation Exchange: {textureDetails.cecRangeCmol}
          </span>
          <span className="text-[11px] text-slate-500 block">
            Leaching Risk: <strong className={selectedTexture === 'sandy' ? 'text-red-700' : 'text-emerald-700'}>{textureDetails.nutrientLeachingRisk}</strong>
          </span>
        </div>
      </div>

      {/* LEACHING OR WATERLOGGING WARNING BANNER */}
      {fertilizerResult.leachingHazardWarning && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-red-900">
              Critical Leaching Advisory for {selectedLocation.name} (Region {selectedRegion})
            </h4>
            <p className="text-xs text-red-800 leading-relaxed">
              {fertilizerResult.leachingHazardWarning}
            </p>
          </div>
        </div>
      )}

      {/* CORE RECOMMENDATIONS 2-COLUMN GRID: FERTILIZER vs WATER RETENTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLUMN 1: CUSTOMIZED FERTILIZER APPLICATION MATRIX (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4" />
                  Agritex Precision Nutrition
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Customized Fertilizer Rates for {CROPS_SOIL_CONFIG[selectedCropId]?.name}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 block font-medium">Plot Cost Estimate</span>
                <span className="text-base font-black text-emerald-800">${fertilizerResult.plotTotals.estimatedCostUsd} USD</span>
              </div>
            </div>

            {/* SECTION A: BASAL DRESSING */}
            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  1. Basal Dressing (Kufukira Mbeu)
                </span>
                <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg">
                  {fertilizerResult.basalProductName}
                </span>
              </div>

              {/* Dosing Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-3 border border-amber-200">
                  <span className="text-[11px] text-slate-500 block font-medium">Pfumvudza Basin Dose</span>
                  <span className="text-sm font-black text-amber-900 block mt-0.5">
                    {fertilizerResult.basalPerBasinGrams} g / basin
                  </span>
                  <span className="text-[10px] text-amber-700 font-bold block mt-1">
                    {fertilizerResult.basalBottleCapDose}
                  </span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-amber-200">
                  <span className="text-[11px] text-slate-500 block font-medium">Plot Total ({plotCount} plot)</span>
                  <span className="text-sm font-black text-slate-900 block mt-0.5">
                    {fertilizerResult.plotTotals.basalKg} kg
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {Number((fertilizerResult.plotTotals.basalKg / 50).toFixed(2))} × 50kg bag(s)
                  </span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-amber-200">
                  <span className="text-[11px] text-slate-500 block font-medium">Per Hectare Rate</span>
                  <span className="text-sm font-black text-slate-900 block mt-0.5">
                    {fertilizerResult.basalKgPerHa} kg/ha
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {fertilizerResult.basalBags50kgPerHa} bags (50kg)
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-700 space-y-1 bg-white/70 rounded-xl p-3 border border-amber-100">
                <div className="font-bold text-amber-950 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-amber-600" /> Placement & Depth Instructions:
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {fertilizerResult.basalPlacementDepthCm}. <em>Never place seeds in direct contact with fertilizer granules to prevent fertilizer scorch.</em>
                </p>
                <div className="text-[11px] text-slate-500 pt-1">
                  <strong>Timing:</strong> {fertilizerResult.basalTiming}
                </div>
              </div>
            </div>

            {/* SECTION B: TOP DRESSING SPLIT SCHEDULE */}
            <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                  2. Top Dressing (Kupfapfaidza AN / Nitrogen)
                </span>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg">
                  {fertilizerResult.topProductName}
                </span>
              </div>

              {/* Total Top Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-3 border border-emerald-200">
                  <span className="text-[11px] text-slate-500 block font-medium">Total Top per Basin</span>
                  <span className="text-sm font-black text-emerald-900 block mt-0.5">
                    {fertilizerResult.topPerBasinGrams} g / basin
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                    {fertilizerResult.topBottleCapDose}
                  </span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-emerald-200">
                  <span className="text-[11px] text-slate-500 block font-medium">Plot Total ({plotCount} plot)</span>
                  <span className="text-sm font-black text-slate-900 block mt-0.5">
                    {fertilizerResult.plotTotals.topKg} kg
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {Number((fertilizerResult.plotTotals.topKg / 50).toFixed(2))} × 50kg bag(s)
                  </span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-emerald-200">
                  <span className="text-[11px] text-slate-500 block font-medium">Per Hectare Rate</span>
                  <span className="text-sm font-black text-slate-900 block mt-0.5">
                    {fertilizerResult.topKgPerHa} kg/ha
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {fertilizerResult.topBags50kgPerHa} bags (50kg)
                  </span>
                </div>
              </div>

              {/* Micro-dosing Split Timeline */}
              <div className="space-y-2.5 pt-1">
                <span className="text-xs font-extrabold text-slate-800 block">
                  Synchronized Micro-Dosing Splits ({selectedTexture.toUpperCase()} SOIL PROTOCOL):
                </span>

                <div className="space-y-2">
                  {fertilizerResult.splitSchedule.map((split) => (
                    <div 
                      key={split.splitNumber}
                      className="bg-white rounded-xl p-3.5 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-700 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                            SPLIT {split.splitNumber} ({split.ratePct}%)
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {split.timingDap}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {split.bottleCapText} ({split.basinGrams}g per basin)
                        </p>
                      </div>

                      <div className="sm:max-w-xs text-right sm:text-left bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-900 block">
                          Weather Trigger:
                        </span>
                        <span className="text-[11px] text-emerald-800 leading-snug block">
                          {split.weatherTrigger}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION C: ORGANIC SOIL BUILDER & ANTHILL / LIME AMENDMENTS */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <Hammer className="w-3.5 h-3.5 text-stone-700" />
                3. Soil Organic Carbon & Mineral Amelioration
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-3 border border-stone-200">
                  <span className="text-[11px] text-slate-500 block font-medium">Kraal Manure / Compost</span>
                  <span className="text-sm font-extrabold text-stone-900 block mt-0.5">
                    {fertilizerResult.kraalManureHandfulsPerBasin} handful(s) (~500g) per basin
                  </span>
                  <span className="text-[10px] text-slate-600 block mt-1">
                    {fertilizerResult.plotTotals.manureWheelbarrows} wheelbarrows total per plot ({fertilizerResult.kraalManureTonPerHa} t/ha)
                  </span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-stone-200">
                  <span className="text-[11px] text-slate-500 block font-medium">Agricultural Lime (Dolomite)</span>
                  <span className="text-sm font-extrabold text-stone-900 block mt-0.5">
                    {fertilizerResult.dolomiteLimeRequired 
                      ? `${fertilizerResult.dolomiteLimeRateTonPerHa} t/ha (${fertilizerResult.dolomiteLimeBasinGrams}g/basin)` 
                      : 'Not strictly required (pH optimal)'}
                  </span>
                  <span className="text-[10px] text-slate-600 block mt-1">
                    {fertilizerResult.dolomiteLimeRequired 
                      ? 'Counters aluminum toxicity & soil acidity in sandy/high-rainfall zones' 
                      : 'Test soil pH if yield has stalled below 2t/ha'}
                  </span>
                </div>
              </div>

              {/* Termitaria (Chulu) Note for Sandy Soils */}
              {fertilizerResult.termitariaAnthillGuidance && (
                <div className="bg-amber-100/60 rounded-xl p-3 border border-amber-300 text-xs text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    Traditional Termitaria (Chulu) Practice for Sandy Soils:
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    {fertilizerResult.termitariaAnthillGuidance}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUMN 2: WATER RETENTION & IN-SITU CONSERVATION MASTERPLAN (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                <Droplets className="w-4 h-4" />
                In-Situ Conservation Agriculture
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Water Retention Masterplan
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Customized for {textureDetails.name} under Natural Region {selectedRegion} evaporation.
              </p>
            </div>

            {/* PILLAR 1: MULCH BLANKET */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  1. Pfumvudza Mulch Blanket
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                  {waterStrategy.mulchProtocol.recommendedDepthCm} cm Depth
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {waterStrategy.mulchProtocol.benefit}
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                <strong>Recommended Materials:</strong> {waterStrategy.mulchProtocol.materials.join(', ')}.
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                Rule: {waterStrategy.mulchProtocol.criticalRule}
              </div>
            </div>

            {/* PILLAR 2: BASIN MICRO-CATCHMENT */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-600" />
                2. In-Situ Rainwater Harvesting
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                {waterStrategy.harvestingTechnique.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {waterStrategy.harvestingTechnique.method}
              </p>
              <div className="text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                <strong>Basin Dimensions:</strong> {waterStrategy.harvestingTechnique.dimensions}
              </div>
              <p className="text-[11px] text-slate-500 italic">
                {waterStrategy.harvestingTechnique.agritexDiagramDescription}
              </p>
            </div>

            {/* PILLAR 3: SOIL TEXTURE AMENDMENT */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Hammer className="w-3.5 h-3.5 text-amber-600" />
                3. Soil Texture Structure Amendment
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                {waterStrategy.soilStructureAmendment.strategyName}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {waterStrategy.soilStructureAmendment.instructions}
              </p>
              <div className="text-[11px] text-amber-800 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                <strong>Impact Duration:</strong> {waterStrategy.soilStructureAmendment.permanence}
              </div>
            </div>

            {/* PILLAR 4: DRY SPELL EMERGENCY PROTOCOL */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-700" />
                4. {waterStrategy.drySpellBufferPlan.title}
              </span>
              <ul className="space-y-1.5 text-xs text-amber-900">
                {waterStrategy.drySpellBufferPlan.actionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-amber-600 font-bold shrink-0">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ACTION FOOTER */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              {onNavigateToPlanner && (
                <button
                  onClick={() => onNavigateToPlanner(selectedCropId)}
                  className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <CalendarRange className="w-3.5 h-3.5" />
                  Load into Planting Planner
                </button>
              )}

              {onNavigateToCropAdvisor && (
                <button
                  onClick={onNavigateToCropAdvisor}
                  className="w-full py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  Explore Crop Advisor
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE 3-STEP FIELD RIBBON TEST MODAL */}
      {showRibbonWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">
                  Agritex Field Manual
                </span>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-amber-600" />
                  3-Minute Soil Texture Field Test (The Ribbon & Squeeze Method)
                </h3>
              </div>
              <button
                onClick={() => setShowRibbonWizard(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You do not need a laboratory test to determine whether your soil is Sandy, Loam, or Clay. 
              Take a small handful of topsoil (10cm depth) from your field, moisten it with clean water, 
              and follow these 3 field steps:
            </p>

            {/* Steps Container */}
            <div className="space-y-4">
              {RIBBON_TEST_STEPS.map((step, idx) => (
                <div 
                  key={step.stepNumber}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-black flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      {step.title}
                    </h4>
                    <span className="text-xs text-slate-500 italic">
                      ({step.shonaTitle})
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                    <strong>Instructions:</strong> {step.instruction}
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      What do you observe?
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.criteria.map((crit, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => {
                            if (crit.leadsToTexture !== 'continue') {
                              handleWizardSelectTexture(crit.leadsToTexture);
                            }
                          }}
                          className={`p-3 rounded-xl border text-left text-xs transition space-y-1 ${
                            crit.leadsToTexture !== 'continue'
                              ? 'border-emerald-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/50'
                              : 'border-slate-200 bg-white hover:bg-slate-100'
                          }`}
                        >
                          <div className="font-bold text-slate-900">
                            {crit.observation}
                          </div>
                          <div className={`text-[11px] font-semibold ${
                            crit.leadsToTexture !== 'continue' ? 'text-emerald-700' : 'text-slate-500'
                          }`}>
                            → {crit.nextActionOrResult}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                Clicking any confirmed diagnosis will auto-apply the texture.
              </span>
              <button
                type="button"
                onClick={() => setShowRibbonWizard(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
