import React, { useState } from 'react';
import { 
  ZimbabweLocation 
} from '../data/zimbabweLocations';
import { 
  MASTER_CROPS, 
  CropRecommendation 
} from '../data/agronomyData';
import { 
  calculatePredictedYield, 
  analyzePostHarvestPerformance, 
  analyzeLivestockPerformance,
  YieldPredictionResult,
  PostHarvestResult,
  LivestockPostHarvestResult
} from '../utils/agroCalculators';
import { 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Droplet, 
  Bug, 
  Sparkles, 
  Award, 
  AlertCircle, 
  CheckCircle2,
  Calendar,
  Layers,
  Scale,
  Download,
  FileText,
  Printer,
  Building2
} from 'lucide-react';
import { exportCropAuditToCsv, exportLivestockAuditToCsv } from '../utils/reportExport';
import { MicroLoanAuditStatementModal } from './MicroLoanAuditStatementModal';

interface Props {
  selectedLocation: ZimbabweLocation;
  preselectedCrop?: CropRecommendation;
}

export const YieldAndInputAnalysis: React.FC<Props> = ({ 
  selectedLocation,
  preselectedCrop 
}) => {
  const [activeTab, setActiveTab] = useState<'predictive' | 'postHarvestCrop' | 'postHarvestLivestock'>('predictive');
  const [isLoanModalOpen, setIsLoanModalOpen] = useState<boolean>(false);

  // Predictive State
  const [selectedCropId, setSelectedCropId] = useState<string>(
    preselectedCrop?.cropId || 'maize_medium'
  );
  const currentCrop = MASTER_CROPS.find(c => c.cropId === selectedCropId) || MASTER_CROPS[0];
  const [farmAreaPreset, setFarmAreaPreset] = useState<'pfumvudza_1' | 'pfumvudza_2' | 'ha_1' | 'ha_2'>('pfumvudza_1');
  const [rainfallMm, setRainfallMm] = useState<number>(selectedLocation.currentSeasonRainfallMm);
  const [fertilizerCompliance, setFertilizerCompliance] = useState<number>(100); // 100%
  const [pestInfestation, setPestInfestation] = useState<'none' | 'light' | 'moderate' | 'severe'>('light');
  const [weedingSchedule, setWeedingSchedule] = useState<'optimal' | 'delayed_2w' | 'delayed_4w'>('optimal');
  const [isPfumvudza, setIsPfumvudza] = useState<boolean>(true);

  const getAreaHa = () => {
    switch (farmAreaPreset) {
      case 'pfumvudza_1': return 0.0625; // 1/16 ha (approx 62m x 16m)
      case 'pfumvudza_2': return 0.125;  // 2 plots
      case 'ha_1': return 1.0;
      case 'ha_2': return 2.0;
    }
  };

  const yieldPrediction: YieldPredictionResult = calculatePredictedYield({
    crop: currentCrop,
    location: selectedLocation,
    farmAreaHa: getAreaHa(),
    rainfallReceivedMm: rainfallMm,
    inputCompliancePercent: fertilizerCompliance,
    pestSeverity: pestInfestation,
    weedingTimeliness: weedingSchedule,
    isPfumvudzaTechnique: isPfumvudza,
  });

  // Post-Harvest Crop Audit State
  const [actualBags, setActualBags] = useState<number>(18);
  const [actualPricePerBag, setActualPricePerBag] = useState<number>(14.50);
  const [seedCost, setSeedCost] = useState<number>(12.00);
  const [compoundDCost, setCompoundDCost] = useState<number>(38.00);
  const [anCost, setAnCost] = useState<number>(35.00);
  const [pesticideCost, setPesticideCost] = useState<number>(7.50);
  const [laborCost, setLaborCost] = useState<number>(15.00);
  const [appliedNitrogenKg, setAppliedNitrogenKg] = useState<number>(24);

  const postHarvestCropResult: PostHarvestResult = analyzePostHarvestPerformance({
    cropName: currentCrop.name,
    totalAreaHa: getAreaHa(),
    actualHarvestBags50kg: actualBags,
    actualSellingPricePerBagUsd: actualPricePerBag,
    seedCostUsd: seedCost,
    compoundDFertilizerCostUsd: compoundDCost,
    anTopDressingCostUsd: anCost,
    chemicalsAgrochemicalsCostUsd: pesticideCost,
    laborAndHaulageCostUsd: laborCost,
    appliedNitrogenKg,
  });

  // Livestock Post-Harvest Audit State
  const [herdSize, setHerdSize] = useState<number>(12);
  const [feedLicksCost, setFeedLicksCost] = useState<number>(120);
  const [vetDippingCost, setVetDippingCost] = useState<number>(65);
  const [herdingLaborCost, setHerdingLaborCost] = useState<number>(90);
  const [calvesBorn, setCalvesBorn] = useState<number>(8);
  const [mortality, setMortality] = useState<number>(1);
  const [livestockSalesUsd, setLivestockSalesUsd] = useState<number>(950);
  const [initialHerdValuation, setInitialHerdValuation] = useState<number>(4800);
  const [finalHerdValuation, setFinalHerdValuation] = useState<number>(5400);

  const livestockResult: LivestockPostHarvestResult = analyzeLivestockPerformance({
    livestockType: 'Cattle',
    headCount: herdSize,
    feedAndLicksCostUsd: feedLicksCost,
    dippingAndVetCostUsd: vetDippingCost,
    laborAndShelterCostUsd: herdingLaborCost,
    calvesOrKidsBorn: calvesBorn,
    mortalityCount: mortality,
    salesRevenueUsd: livestockSalesUsd,
    initialHerdValuationUsd: initialHerdValuation,
    finalHerdValuationUsd: finalHerdValuation,
  });

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('predictive')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'predictive'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          1. Pre-Harvest Yield Predictive Model
        </button>

        <button
          onClick={() => setActiveTab('postHarvestCrop')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'postHarvestCrop'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4 text-emerald-600" />
          2. Post-Harvest Crop Input-Yield Audit
        </button>

        <button
          onClick={() => setActiveTab('postHarvestLivestock')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'postHarvestLivestock'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="text-sm">🐂</span>
          3. Livestock Input & Enterprise Analysis
        </button>
      </div>

      {/* TAB 1: PREDICTIVE MODELING */}
      {activeTab === 'predictive' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                Zimbabwe Agro-Climatic Production Model
              </h4>

              {/* Crop Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Target Crop
                </label>
                <select
                  value={selectedCropId}
                  onChange={(e) => setSelectedCropId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                >
                  {MASTER_CROPS.map((c) => (
                    <option key={c.cropId} value={c.cropId}>
                      {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Plot Scale */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Plot Scale
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setFarmAreaPreset('pfumvudza_1')}
                    className={`p-2 rounded-lg border font-semibold text-left transition ${
                      farmAreaPreset === 'pfumvudza_1'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    1 Pfumvudza Plot
                    <span className="block text-[10px] text-slate-400 font-normal">1/16 Ha (1,456 basins)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFarmAreaPreset('pfumvudza_2')}
                    className={`p-2 rounded-lg border font-semibold text-left transition ${
                      farmAreaPreset === 'pfumvudza_2'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    2 Pfumvudza Plots
                    <span className="block text-[10px] text-slate-400 font-normal">1/8 Ha (2,912 basins)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFarmAreaPreset('ha_1')}
                    className={`p-2 rounded-lg border font-semibold text-left transition ${
                      farmAreaPreset === 'ha_1'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    1.0 Full Hectare
                    <span className="block text-[10px] text-slate-400 font-normal">Commercial field</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFarmAreaPreset('ha_2')}
                    className={`p-2 rounded-lg border font-semibold text-left transition ${
                      farmAreaPreset === 'ha_2'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    2.0 Hectares
                    <span className="block text-[10px] text-slate-400 font-normal">Medium holding</span>
                  </button>
                </div>
              </div>

              {/* Rainfall Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-blue-500" />
                    Seasonal Rainfall Received
                  </span>
                  <span className="font-bold text-emerald-800 font-mono">{rainfallMm} mm</span>
                </div>
                <input
                  type="range"
                  min={250}
                  max={1200}
                  step={10}
                  value={rainfallMm}
                  onChange={(e) => setRainfallMm(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>250mm (Severe Drought)</span>
                  <span>Avg: {selectedLocation.annualRainfallAvgMm}mm</span>
                  <span>1200mm (Heavy)</span>
                </div>
              </div>

              {/* Fertilizer Compliance */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700">
                    Fertilizer Applied (% of Agritex Standard)
                  </span>
                  <span className="font-bold text-slate-900">{fertilizerCompliance}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={120}
                  step={5}
                  value={fertilizerCompliance}
                  onChange={(e) => setFertilizerCompliance(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>20% (Low basal only)</span>
                  <span>100% (Standard)</span>
                  <span>120% (Intensive)</span>
                </div>
              </div>

              {/* Pest Severity */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Observed Pest / Disease Infestation (e.g. Fall Armyworm)
                </label>
                <div className="grid grid-cols-4 gap-1 text-[11px]">
                  {(['none', 'light', 'moderate', 'severe'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setPestInfestation(sev)}
                      className={`py-1.5 px-2 rounded-lg border font-semibold capitalize transition ${
                        pestInfestation === sev
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pfumvudza Conservation Practice Switch */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Pfumvudza / Intwasa Basins & Mulch
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Adds +18% moisture retention resilience
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isPfumvudza}
                  onChange={(e) => setIsPfumvudza(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                    Model Forecast Output
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Predicted Harvest: {currentCrop.name}
                  </h3>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  yieldPrediction.confidenceRating === 'High'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {yieldPrediction.confidenceRating} Reliability
                </span>
              </div>

              {/* Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-emerald-50/60 border border-emerald-200/70 p-4 rounded-xl text-center">
                  <span className="text-xs text-emerald-700 font-semibold block mb-0.5">
                    Expected 50kg Bags
                  </span>
                  <div className="text-3xl font-black text-emerald-950">
                    {yieldPrediction.predictedTotalBags50kg}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Standard 50kg grain bags
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                  <span className="text-xs text-slate-500 font-semibold block mb-0.5">
                    Yield Rate (Ton/Ha)
                  </span>
                  <div className="text-3xl font-black text-slate-900">
                    {yieldPrediction.predictedYieldTonHa}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Max Potential: {yieldPrediction.potentialMaxYieldTonHa} t/ha
                  </span>
                </div>

                <div className="bg-blue-50/60 border border-blue-200/70 p-4 rounded-xl text-center">
                  <span className="text-xs text-blue-700 font-semibold block mb-0.5">
                    Est. Market Value
                  </span>
                  <div className="text-3xl font-black text-blue-950">
                    ${yieldPrediction.predictedGrossValueUsd}
                  </div>
                  <span className="text-[10px] text-blue-600 font-medium">
                    ZiG {(yieldPrediction.predictedGrossValueUsd * 28.5).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Penalties & Bonus Breakdown Table */}
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Yield Limiting Factors & Resilience Modifiers
              </h5>
              <div className="overflow-x-auto border border-slate-200 rounded-xl mb-4 text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Agronomic Parameter</th>
                      <th className="p-3">Current Condition</th>
                      <th className="p-3 text-right">Yield Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Moisture & Rainfall Balance</td>
                      <td className="p-3 text-slate-600">{rainfallMm}mm received (Req: {currentCrop.rainfallRequirementMm.min}mm)</td>
                      <td className={`p-3 text-right font-bold ${yieldPrediction.waterStressPenaltyPct > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {yieldPrediction.waterStressPenaltyPct > 0 ? `-${yieldPrediction.waterStressPenaltyPct}%` : 'Optimal'}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Nutrient & Fertilizer Application</td>
                      <td className="p-3 text-slate-600">{fertilizerCompliance}% of recommended basal + top dressing</td>
                      <td className={`p-3 text-right font-bold ${yieldPrediction.nutrientDeficitPenaltyPct > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {yieldPrediction.nutrientDeficitPenaltyPct > 0 ? `-${yieldPrediction.nutrientDeficitPenaltyPct}%` : 'Full Potential'}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Pest Infestation Pressure</td>
                      <td className="p-3 text-slate-600 capitalize">{pestInfestation} pest level</td>
                      <td className={`p-3 text-right font-bold ${yieldPrediction.pestInfestationPenaltyPct > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        {yieldPrediction.pestInfestationPenaltyPct > 0 ? `-${yieldPrediction.pestInfestationPenaltyPct}%` : '0%'}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Pfumvudza Conservation Practice</td>
                      <td className="p-3 text-slate-600">{isPfumvudza ? 'Potholing & Organic Mulching' : 'Conventional tillage'}</td>
                      <td className="p-3 text-right font-bold text-emerald-700">
                        {isPfumvudza ? `+${yieldPrediction.pfumvudzaBonusPct}% Protected` : '0%'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Actionable Commentary */}
              <div className="p-4 bg-emerald-950 text-white rounded-xl text-xs flex items-start gap-3">
                <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-300 block mb-0.5">
                    Agritex Agronomic Action Directive
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {yieldPrediction.advisoryCommentary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POST-HARVEST CROP EFFICIENCY AUDIT */}
      {activeTab === 'postHarvestCrop' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-700" />
              Harvest Record & Input Expenses
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Actual Bags Harvested</label>
                <input
                  type="number"
                  min={1}
                  value={actualBags}
                  onChange={(e) => setActualBags(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Selling Price ($/bag)</label>
                <input
                  type="number"
                  step="0.5"
                  min={1}
                  value={actualPricePerBag}
                  onChange={(e) => setActualPricePerBag(parseFloat(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="text-xs space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Input Costs Breakdown (USD)</span>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Certified Seed Cost:</span>
                <input
                  type="number"
                  value={seedCost}
                  onChange={(e) => setSeedCost(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded p-1.5 text-right font-semibold"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Basal Fert (Compound D):</span>
                <input
                  type="number"
                  value={compoundDCost}
                  onChange={(e) => setCompoundDCost(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded p-1.5 text-right font-semibold"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Top Dressing (AN/Urea):</span>
                <input
                  type="number"
                  value={anCost}
                  onChange={(e) => setAnCost(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded p-1.5 text-right font-semibold"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Chemicals & Pesticides:</span>
                <input
                  type="number"
                  value={pesticideCost}
                  onChange={(e) => setPesticideCost(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded p-1.5 text-right font-semibold"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Labor & Transport:</span>
                <input
                  type="number"
                  value={laborCost}
                  onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded p-1.5 text-right font-semibold"
                />
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                <span className="text-slate-600">Applied Nitrogen (kg N):</span>
                <input
                  type="number"
                  value={appliedNitrogenKg}
                  onChange={(e) => setAppliedNitrogenKg(parseFloat(e.target.value) || 1)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded p-1.5 text-right font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Efficiency Report Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Post-Harvest Performance Audit
                </span>
                <h4 className="text-lg font-extrabold text-slate-900">
                  Gross Margin & Input Efficiency Metrics
                </h4>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => exportCropAuditToCsv({
                    cropName: currentCrop.name,
                    totalAreaHa: getAreaHa(),
                    actualHarvestBags50kg: actualBags,
                    actualSellingPricePerBagUsd: actualPricePerBag,
                    seedCostUsd: seedCost,
                    compoundDFertilizerCostUsd: compoundDCost,
                    anTopDressingCostUsd: anCost,
                    chemicalsAgrochemicalsCostUsd: pesticideCost,
                    laborAndHaulageCostUsd: laborCost,
                    appliedNitrogenKg,
                  }, postHarvestCropResult, selectedLocation)}
                  title="Export detailed spreadsheet for personal records or accounting"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-300"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  Export CSV
                </button>

                <button
                  onClick={() => setIsLoanModalOpen(true)}
                  title="Generate official bank-ready statement for micro-finance loan application"
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Bank Loan Statement (PDF)
                </button>

                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                  {postHarvestCropResult.efficiencyGrade}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block">Total Revenue</span>
                <div className="text-xl font-black text-slate-900">${postHarvestCropResult.totalRevenueUsd}</div>
                <span className="text-[10px] text-slate-500 font-mono">ZiG {postHarvestCropResult.totalRevenueZig.toLocaleString()}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block">Total Variable Costs</span>
                <div className="text-xl font-black text-rose-700">${postHarvestCropResult.totalVariableCostsUsd}</div>
                <span className="text-[10px] text-slate-500 font-mono">ZiG {postHarvestCropResult.totalVariableCostsZig.toLocaleString()}</span>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-emerald-700 font-semibold block">Net Gross Margin</span>
                <div className="text-xl font-black text-emerald-950">${postHarvestCropResult.netGrossMarginUsd}</div>
                <span className="text-[10px] text-emerald-700 font-bold">ROI: +{postHarvestCropResult.returnOnInvestmentPct}%</span>
              </div>

              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                <span className="text-[10px] text-blue-700 font-semibold block">Cost Per Bag</span>
                <div className="text-xl font-black text-blue-950">${postHarvestCropResult.costPerBagUsd}</div>
                <span className="text-[10px] text-blue-700">Profit: +${postHarvestCropResult.profitPerBagUsd}</span>
              </div>
            </div>

            {/* Benchmark Comparison Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Agronomic Metric</th>
                    <th className="p-3">Your Farm Result</th>
                    <th className="p-3">Zim Smallholder Benchmark</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-medium text-slate-800">Production Cost / 50kg Bag</td>
                    <td className="p-3 font-bold text-emerald-800">${postHarvestCropResult.costPerBagUsd}</td>
                    <td className="p-3 text-slate-600">$9.20 (National average)</td>
                    <td className="p-3 text-right font-bold text-emerald-700">
                      {postHarvestCropResult.costPerBagUsd < 9.20 ? 'Competitive' : 'Above Average'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-800">Nitrogen Use Efficiency (NUE)</td>
                    <td className="p-3 font-bold text-slate-900">{postHarvestCropResult.nitrogenUseEfficiencyKgPerKg} kg grain / kg N</td>
                    <td className="p-3 text-slate-600">25 - 35 kg grain / kg N</td>
                    <td className="p-3 text-right font-bold text-emerald-700">High Utilization</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-800">Breakeven Yield Required</td>
                    <td className="p-3 font-bold text-slate-900">{postHarvestCropResult.breakEvenYieldBags} bags</td>
                    <td className="p-3 text-slate-600">Target: &gt; 8 bags</td>
                    <td className="p-3 text-right font-bold text-emerald-700">Surpassed (+{actualBags - postHarvestCropResult.breakEvenYieldBags} bags profit)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl text-xs leading-relaxed">
              <span className="font-bold text-emerald-400 block mb-1">Agronomy Evaluation:</span>
              {postHarvestCropResult.efficiencyAdvice}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVESTOCK ENTERPRISE INPUT ANALYSIS */}
      {activeTab === 'postHarvestLivestock' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span>🐂</span> Livestock Inputs (Beef / Goats)
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Herd Size (Head)</label>
                <input
                  type="number"
                  min={1}
                  value={herdSize}
                  onChange={(e) => setHerdSize(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Calves/Kids Born</label>
                <input
                  type="number"
                  min={0}
                  value={calvesBorn}
                  onChange={(e) => setCalvesBorn(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="text-xs space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Annual Input Expenses (USD)</span>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Winter Protein Licks & Salt:</span>
                <input
                  type="number"
                  value={feedLicksCost}
                  onChange={(e) => setFeedLicksCost(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded p-1.5 text-right font-semibold"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Dipping, Vaccines & Vet:</span>
                <input
                  type="number"
                  value={vetDippingCost}
                  onChange={(e) => setVetDippingCost(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded p-1.5 text-right font-semibold"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Herding Labor & Kraal:</span>
                <input
                  type="number"
                  value={herdingLaborCost}
                  onChange={(e) => setHerdingLaborCost(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded p-1.5 text-right font-semibold"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Mortality Loss (Head):</span>
                <input
                  type="number"
                  value={mortality}
                  onChange={(e) => setMortality(parseInt(e.target.value) || 0)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded p-1.5 text-right font-semibold text-rose-600"
                />
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                <span className="text-slate-600">Live Sales Income:</span>
                <input
                  type="number"
                  value={livestockSalesUsd}
                  onChange={(e) => setLivestockSalesUsd(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded p-1.5 text-right font-semibold text-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Livestock Efficiency Output */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Livestock Production Efficiency
                </span>
                <h4 className="text-lg font-extrabold text-slate-900">
                  Herd Margin & Weaning Survival
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportLivestockAuditToCsv({
                    livestockType: 'Cattle',
                    headCount: herdSize,
                    feedAndLicksCostUsd: feedLicksCost,
                    dippingAndVetCostUsd: vetDippingCost,
                    laborAndShelterCostUsd: herdingLaborCost,
                    calvesOrKidsBorn: calvesBorn,
                    mortalityCount: mortality,
                    salesRevenueUsd: livestockSalesUsd,
                    initialHerdValuationUsd: initialHerdValuation,
                    finalHerdValuationUsd: finalHerdValuation,
                  }, livestockResult, selectedLocation)}
                  title="Export livestock production and veterinary input audit to CSV"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-300"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  Export Livestock CSV
                </button>

                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                  Survival: {livestockResult.weaningSurvivalRatePct}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block">Total Vet & Feed</span>
                <div className="text-xl font-black text-slate-900">${livestockResult.totalInputCostUsd}</div>
                <span className="text-[10px] text-slate-500">${livestockResult.costPerHeadUsd} / head</span>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-emerald-700 font-semibold block">Net Enterprise Profit</span>
                <div className="text-xl font-black text-emerald-950">${livestockResult.netEnterpriseProfitUsd}</div>
                <span className="text-[10px] text-emerald-700">Capital Return: +{livestockResult.returnOnCapitalPct}%</span>
              </div>

              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                <span className="text-[10px] text-blue-700 font-semibold block">Calf/Kid Crop</span>
                <div className="text-xl font-black text-blue-950">{calvesBorn - mortality} Weaned</div>
                <span className="text-[10px] text-blue-700">{calvesBorn} born, {mortality} died</span>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                <span className="text-[10px] text-amber-700 font-semibold block">Asset Growth</span>
                <div className="text-xl font-black text-amber-950">+${finalHerdValuation - initialHerdValuation}</div>
                <span className="text-[10px] text-amber-700">Herd capital growth</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-950 text-white rounded-xl text-xs leading-relaxed">
              <span className="font-bold text-emerald-400 block mb-1">Veterinary Department Assessment:</span>
              {livestockResult.commentary}
            </div>
          </div>
        </div>
      )}

      {/* Micro-Loan Agricultural Performance Audit Statement Modal */}
      <MicroLoanAuditStatementModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        postHarvestInput={{
          cropName: currentCrop.name,
          totalAreaHa: getAreaHa(),
          actualHarvestBags50kg: actualBags,
          actualSellingPricePerBagUsd: actualPricePerBag,
          seedCostUsd: seedCost,
          compoundDFertilizerCostUsd: compoundDCost,
          anTopDressingCostUsd: anCost,
          chemicalsAgrochemicalsCostUsd: pesticideCost,
          laborAndHaulageCostUsd: laborCost,
          appliedNitrogenKg,
        }}
        postHarvestResult={postHarvestCropResult}
        location={selectedLocation}
      />
    </div>
  );
};
