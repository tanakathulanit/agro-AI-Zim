import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, 
  Leaf, 
  Sprout, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  DollarSign, 
  Info, 
  Compass, 
  ArrowRight, 
  BookOpen, 
  Award, 
  SlidersHorizontal,
  ChevronRight,
  Zap,
  HelpCircle,
  Plus,
  Flame,
  Check
} from 'lucide-react';
import { ZimbabweLocation } from '../data/zimbabweLocations';
import { 
  ROTATION_CROPS_DATABASE, 
  CERTIFIED_ROTATION_SEQUENCES, 
  CertifiedRotationSequence, 
  RotationCropItem, 
  getRotationsForRegion, 
  evaluateCustomRotationSequence 
} from '../data/cropRotationData';
import { useTranslation } from '../context/LanguageContext';

interface Props {
  selectedLocation: ZimbabweLocation;
  onApplyCropToPlanner?: (cropId: string) => void;
}

export const CropRotationAssistant: React.FC<Props> = ({
  selectedLocation,
  onApplyCropToPlanner,
}) => {
  const { t, isShona, isNdebele } = useTranslation();

  // Active view: 'certified_sequences' or 'custom_builder'
  const [activeViewMode, setActiveViewMode] = useState<'certified' | 'builder'>('certified');

  // Currently selected sequence for detailed inspection
  const regionSequences = useMemo(() => {
    return getRotationsForRegion(selectedLocation.naturalRegion);
  }, [selectedLocation.naturalRegion]);

  const [selectedSequenceId, setSelectedSequenceId] = useState<string>(
    regionSequences[0]?.id || CERTIFIED_ROTATION_SEQUENCES[0].id
  );

  // Custom Rotation Builder state
  const [customStep1Crop, setCustomStep1Crop] = useState<string>('maize_cereal');
  const [customStep2Crop, setCustomStep2Crop] = useState<string>('soya_beans');
  const [customStep3Crop, setCustomStep3Crop] = useState<string>('sunflower_mbeu');

  // Success toast when a sequence is applied
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  // Active inspected sequence
  const currentSequence = useMemo(() => {
    return (
      regionSequences.find(s => s.id === selectedSequenceId) ||
      CERTIFIED_ROTATION_SEQUENCES.find(s => s.id === selectedSequenceId) ||
      regionSequences[0] ||
      CERTIFIED_ROTATION_SEQUENCES[0]
    );
  }, [selectedSequenceId, regionSequences]);

  // Dynamic evaluation of custom sequence
  const customEvaluation = useMemo(() => {
    return evaluateCustomRotationSequence([customStep1Crop, customStep2Crop, customStep3Crop]);
  }, [customStep1Crop, customStep2Crop, customStep3Crop]);

  const handleApplySequenceCrop = (cropId: string, cropName: string) => {
    const cropMeta = ROTATION_CROPS_DATABASE.find(c => c.id === cropId);
    const targetMasterCropId = cropMeta?.associatedMasterCropId || 'maize_medium';
    if (onApplyCropToPlanner) {
      onApplyCropToPlanner(targetMasterCropId);
    }
    setAppliedToast(`✓ ${cropName} loaded into your Active Seasonal Planner!`);
    setTimeout(() => setAppliedToast(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Toast Notification */}
      {appliedToast && (
        <div className="bg-emerald-950 text-white text-xs px-4 py-2.5 rounded-xl border border-emerald-700 shadow-md flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">{appliedToast}</span>
          </div>
          <button onClick={() => setAppliedToast(null)} className="text-emerald-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Banner: Regional Soil Health & Nitrogen Restorative Context */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl p-6 text-white border border-emerald-800/60 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                {isShona 
                  ? 'Mubatsiri weKutenderedza Zvirimwa' 
                  : isNdebele 
                  ? 'Umcebisi Wokutshintshanisa Izilimo' 
                  : 'Crop Rotation & Soil Health Assistant'}
              </span>
              <span className="bg-white/10 text-slate-300 text-xs px-2.5 py-1 rounded-lg">
                Region {selectedLocation.naturalRegion} • {selectedLocation.district}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isShona
                ? 'Kurudzira Hutano hweIvhu neKugadzira Nitrogen Mumunda'
                : isNdebele
                ? 'Vuselela Umhlabathi Wensimu Nge-Nitrogen Yemvelo'
                : `Sequential Crop Rotations for Region ${selectedLocation.naturalRegion} Soils`}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Monocropping maize year after year depletes 75-90 kg N/ha, acidifies granitic soils, and breeds Fall Armyworm (*Mhungu*) and Witchweed (*Striga/Bise*). Integrating biological nitrogen-fixing legumes (Soybeans, Groundnuts, Cowpeas, Nyimo) and deep taproot scavengers restores soil structure, cuts fertilizer costs, and boosts subsequent grain yields by 40-60%.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-emerald-200">
              <span><strong>Dominant Soil:</strong> {selectedLocation.dominantSoil}</span>
              <span>•</span>
              <span><strong>Soil pH:</strong> {selectedLocation.soilPh}</span>
              <span>•</span>
              <span><strong>Avg Rain:</strong> {selectedLocation.annualRainfallAvgMm}mm/yr</span>
            </div>
          </div>

          {/* View Mode Toggle Button */}
          <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700 flex flex-col sm:flex-row gap-1 self-start lg:self-center shrink-0">
            <button
              onClick={() => setActiveViewMode('certified')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeViewMode === 'certified'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Certified Agritex Rotations ({regionSequences.length})
            </button>

            <button
              onClick={() => setActiveViewMode('builder')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeViewMode === 'builder'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Custom Rotation Planner
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: CERTIFIED REGIONAL ROTATION SEQUENCES */}
      {activeViewMode === 'certified' && (
        <div className="space-y-6">
          {/* Sequence Selection Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {regionSequences.map((seq) => {
              const isSelected = selectedSequenceId === seq.id;
              return (
                <button
                  key={seq.id}
                  onClick={() => setSelectedSequenceId(seq.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-700 shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-700'}`} />
                  <span>{seq.title.split('(')[0]}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    +{seq.overallNitrogenGainKgPerHa}kg N/ha
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Inspected Sequence Detailed Card */}
          {currentSequence && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Header Details */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Agritex Certified • {currentSequence.durationYears}-Year Cycle
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {currentSequence.primaryObjective}
                    </span>
                  </div>

                  <h4 className="text-xl font-extrabold text-slate-900">
                    {currentSequence.title}
                  </h4>
                  <p className="text-xs text-emerald-800 italic font-semibold">
                    Shona: {currentSequence.shonaTitle} • Ndebele: {currentSequence.ndebeleTitle}
                  </p>
                  <p className="text-xs text-slate-600 max-w-3xl pt-1 leading-relaxed">
                    {currentSequence.summaryDescription}
                  </p>
                </div>

                {/* Score & Savings Badges */}
                <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2 text-right">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">Estimated Fertilizer Savings</span>
                    <span className="text-lg font-black text-emerald-900">${currentSequence.estimatedFertilizerSavingsUsd} USD / ha</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">Saves ~{currentSequence.bagsOfAnSaved} bags Ammonium Nitrate (AN)</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-right flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Soil Health Rating:</span>
                    <span className="text-sm font-black text-slate-900">{currentSequence.soilHealthIndex} / 100</span>
                  </div>
                </div>
              </div>

              {/* Sequential Flow Visualization (Step 1 -> Step 2 -> Step 3) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-700" />
                    Rotational Progression & Nitrogen Exchange Flow
                  </h5>
                  <span className="text-[11px] text-slate-500 font-medium">Sequential planting by seasonal window</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                  {currentSequence.steps.map((step, idx) => {
                    const isNFixer = step.nitrogenImpactKg > 0;
                    return (
                      <div 
                        key={idx}
                        className={`rounded-2xl p-5 border relative flex flex-col justify-between transition hover:shadow-md ${
                          isNFixer 
                            ? 'bg-emerald-50/70 border-emerald-300 shadow-xs' 
                            : 'bg-slate-50/80 border-slate-200'
                        }`}
                      >
                        {/* Step Marker Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${
                            isNFixer 
                              ? 'bg-emerald-700 text-white' 
                              : 'bg-slate-800 text-white'
                          }`}>
                            STEP {idx + 1}
                          </span>

                          <span className={`text-xs font-black font-mono px-2 py-0.5 rounded-full ${
                            isNFixer 
                              ? 'bg-emerald-200 text-emerald-900 border border-emerald-300' 
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {isNFixer ? `+${step.nitrogenImpactKg} kg N/ha` : `${step.nitrogenImpactKg} kg N/ha`}
                          </span>
                        </div>

                        {/* Crop Title */}
                        <div className="space-y-1 mb-3">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">
                            {step.seasonLabel}
                          </span>
                          <h6 className="text-base font-extrabold text-slate-900 leading-snug">
                            {step.cropName}
                          </h6>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span>{step.category}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">{step.feederType}</span>
                          </div>
                        </div>

                        {/* Benefits breakdown */}
                        <div className="space-y-2 text-xs border-t border-slate-200/80 pt-3 mt-auto">
                          <div>
                            <span className="text-[11px] font-bold text-slate-700 block">Agronomic Benefit:</span>
                            <p className="text-slate-600 text-[11px] leading-relaxed">{step.keyBenefit}</p>
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-slate-700 block">Soil Profile Impact:</span>
                            <p className="text-slate-600 text-[11px] leading-relaxed">{step.soilImpact}</p>
                          </div>

                          <div className="pt-2">
                            <button
                              onClick={() => handleApplySequenceCrop(step.cropId, step.cropName)}
                              className="w-full py-1.5 px-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                              title="Set this crop in your main Planting Planner"
                            >
                              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                              Plan This Crop in Seasonal Planner
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Official Agritex Advisory Note */}
              <div className="bg-slate-900 text-white rounded-2xl p-4.5 flex items-start gap-3.5 border border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="font-extrabold text-emerald-300 text-xs uppercase tracking-wide block">
                    Agritex Extension Officer Rotational Protocol
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentSequence.agritexAdvisory}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CUSTOM ROTATION PLANNER & SOIL BUILDER */}
      {activeViewMode === 'builder' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-emerald-700" />
              Custom Crop Rotation Planner & Nitrogen Calculator
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Select 3 sequential crops to evaluate continuous nutrient extraction, Rhizobia nitrogen deposit rates, and weed/pest suppression on your farm.
            </p>
          </div>

          {/* Crop Pickers for Step 1, 2, 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 Selector */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Year 1 Crop (Starting Season):
              </label>
              <select
                value={customStep1Crop}
                onChange={(e) => setCustomStep1Crop(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {ROTATION_CROPS_DATABASE.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.shonaName}) • {c.feederType}
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-slate-500 pt-1">
                {ROTATION_CROPS_DATABASE.find(c => c.id === customStep1Crop)?.soilHealthRole}
              </div>
            </div>

            {/* Step 2 Selector */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Year 2 Crop (Follow-up Season):
              </label>
              <select
                value={customStep2Crop}
                onChange={(e) => setCustomStep2Crop(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {ROTATION_CROPS_DATABASE.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.shonaName}) • {c.feederType}
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-slate-500 pt-1">
                {ROTATION_CROPS_DATABASE.find(c => c.id === customStep2Crop)?.soilHealthRole}
              </div>
            </div>

            {/* Step 3 Selector */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Year 3 Crop (Concluding / Restorative Season):
              </label>
              <select
                value={customStep3Crop}
                onChange={(e) => setCustomStep3Crop(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {ROTATION_CROPS_DATABASE.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.shonaName}) • {c.feederType}
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-slate-500 pt-1">
                {ROTATION_CROPS_DATABASE.find(c => c.id === customStep3Crop)?.soilHealthRole}
              </div>
            </div>
          </div>

          {/* Dynamic Evaluation Dashboard */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h5 className="text-sm font-extrabold text-emerald-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                Agronomic Analysis Results for Custom Sequence
              </h5>
              <span className="text-xs text-slate-400">
                Region {selectedLocation.naturalRegion} Evaluation
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[11px] block">Soil Health Score</span>
                <span className={`text-xl font-black mt-0.5 block ${
                  customEvaluation.soilHealthScore >= 80 ? 'text-emerald-400' : customEvaluation.soilHealthScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {customEvaluation.soilHealthScore} / 100
                </span>
                <span className="text-[10px] text-slate-400">
                  {customEvaluation.soilHealthScore >= 80 ? 'High Biological Vitality' : 'Nutrient Risk'}
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[11px] block">Net Nitrogen Balance</span>
                <span className={`text-xl font-black mt-0.5 block ${
                  customEvaluation.overallNitrogenBalanceKg >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {customEvaluation.overallNitrogenBalanceKg >= 0 ? `+${customEvaluation.overallNitrogenBalanceKg}` : customEvaluation.overallNitrogenBalanceKg} kg N/ha
                </span>
                <span className="text-[10px] text-slate-400">Atmospheric N2 Fixation</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[11px] block">Fertilizer Savings</span>
                <span className="text-xl font-black text-emerald-400 mt-0.5 block">
                  ${customEvaluation.fertilizerSavingsUsd} USD
                </span>
                <span className="text-[10px] text-slate-400">~{customEvaluation.bagsOfAnSaved} bags AN saved</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[11px] block">Striga / Weed Control</span>
                <span className={`text-xl font-black mt-0.5 block ${
                  customEvaluation.strigaControlRating === 'Excellent' ? 'text-emerald-400' : customEvaluation.strigaControlRating === 'Good' ? 'text-teal-400' : 'text-amber-400'
                }`}>
                  {customEvaluation.strigaControlRating}
                </span>
                <span className="text-[10px] text-slate-400">Witchweed suppression</span>
              </div>
            </div>

            {/* Warnings & Recommendations */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              {customEvaluation.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 bg-rose-950/60 border border-rose-800/60 p-2.5 rounded-xl text-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{w}</span>
                </div>
              ))}

              {customEvaluation.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2 bg-emerald-950/60 border border-emerald-800/60 p-2.5 rounded-xl text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Practical Smallholder Soil Health Protocol Guide */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          Agritex Field Master Principles for Crop Rotation in Zimbabwe
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              1. Inspecting Legume Nodulation
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              At 6 weeks after emergence, gently dig up 3 legume root systems. Slice nodules with a clean pocketknife: active nitrogen-fixing nodules show a <strong>deep pink/red interior (leghaemoglobin)</strong>. White or pale green nodules indicate poor Rhizobium inoculation.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              2. Striga asiatica (Bise/Isona) Decoys
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              In sandy Midlands and Lowveld soils, rotating Groundnuts, Cowpeas, or Sunflower stimulates <strong>suicidal germination</strong> of dormant Striga seeds. Striga seeds sprout but cannot penetrate the legume roots and die, depleting the seed bank.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              3. Pfumvudza Permanent Basins
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Keep the exact same Pfumvudza basin positions year after year. When rotating from Maize to Legumes, the legume thrives on residual Compound D. When rotating back to Maize, the maize absorbs 40-70 kg N/ha of free biological nitrogen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
