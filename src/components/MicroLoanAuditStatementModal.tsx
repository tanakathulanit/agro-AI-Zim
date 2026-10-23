import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  X,
  Award,
  DollarSign,
  Scale
} from 'lucide-react';
import { PostHarvestResult, PostHarvestInputAnalysis } from '../utils/agroCalculators';
import { ZimbabweLocation } from '../data/zimbabweLocations';
import { exportCropAuditToCsv } from '../utils/reportExport';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  postHarvestInput: PostHarvestInputAnalysis;
  postHarvestResult: PostHarvestResult;
  location: ZimbabweLocation;
}

export const MicroLoanAuditStatementModal: React.FC<Props> = ({
  isOpen,
  onClose,
  postHarvestInput,
  postHarvestResult,
  location,
}) => {
  const [borrowerName, setBorrowerName] = useState<string>('Mavis Mutasa');
  const [nationalId, setNationalId] = useState<string>('63-1829402-H-42');
  const [farmWard, setFarmWard] = useState<string>('Ward 4 (Chinyika Communal)');
  const [targetBank, setTargetBank] = useState<string>('AFC Land & Development Bank of Zimbabwe');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    exportCropAuditToCsv(postHarvestInput, postHarvestResult, location, borrowerName);
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Modal Action Header (Hidden in Print) */}
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">
                Micro-Loan Agricultural Audit Statement
              </h4>
              <p className="text-[11px] text-slate-300">
                Official input-yield record for micro-finance institutions & loan applications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/20"
            >
              <Download className="w-3.5 h-3.5" />
              Download CSV
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Borrower Customization Inputs Bar (Hidden in Print) */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs print:hidden shrink-0">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Farmer Name</label>
            <input
              type="text"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-900"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block">National ID No.</label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-900"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Ward / Village</label>
            <input
              type="text"
              value={farmWard}
              onChange={(e) => setFarmWard(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-900"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Target Institution</label>
            <select
              value={targetBank}
              onChange={(e) => setTargetBank(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-900"
            >
              <option value="AFC Land & Development Bank of Zimbabwe">AFC Land Bank (Zimbabwe)</option>
              <option value="CABS Microfinance Division">CABS Microfinance</option>
              <option value="Steward Bank Agribusiness">Steward Bank</option>
              <option value="CBZ Agro-Yield Scheme">CBZ Agro-Yield</option>
              <option value="EmpowerBank Youth Agribusiness">EmpowerBank</option>
              <option value="Microplan Financial Services">Microplan</option>
            </select>
          </div>
        </div>

        {/* Printable Formal Audit Document Body */}
        <div 
          id="printable-loan-statement" 
          className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-slate-900 font-sans space-y-6 print:p-0 print:overflow-visible"
        >
          {/* Formal Letterhead */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800">
                  FARMERS DICTIONARY ZW • SMALLHOLDER AGRIBUSINESS AUDIT
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  INPUT VS. YIELD FINANCIAL AUDIT STATEMENT
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Smallholder Farm Business Records & Repayment Capacity Summary
                </p>
              </div>

              {/* Verified Records Badge */}
              <div className="text-center shrink-0 border-2 border-emerald-800 bg-emerald-50 rounded-xl p-2.5 min-w-[130px]">
                <ShieldCheck className="w-6 h-6 mx-auto text-emerald-800 mb-0.5" />
                <div className="text-[9px] font-black uppercase text-emerald-950 tracking-wider">
                  FARM AUDIT RECORD
                </div>
                <div className="text-[8px] text-emerald-800 font-mono">
                  REF: FDZ-REC-{Date.now().toString().slice(-6)}
                </div>
              </div>
            </div>

            {/* Target Financial Institution Banner */}
            <div className="mt-4 p-2.5 bg-slate-100 rounded-lg text-xs flex flex-wrap items-center justify-between gap-2 text-slate-700">
              <span>Prepared for Submission to: <strong className="text-slate-900">{targetBank}</strong></span>
              <span className="font-mono text-[11px]">Audit Date: {currentDate}</span>
            </div>
          </div>

          {/* Section 1: Farmer & Farm Holding Profile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Farmer / Borrower</span>
              <span className="font-black text-slate-900 text-sm block">{borrowerName}</span>
              <span className="text-[10px] text-slate-500 font-mono">ID: {nationalId}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Location & Ward</span>
              <span className="font-bold text-slate-800 block">{farmWard}</span>
              <span className="text-[10px] text-slate-500">{location.district}, {location.province}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Agro-Ecological Zone</span>
              <span className="font-bold text-emerald-800 block">Region {location.naturalRegion}</span>
              <span className="text-[10px] text-slate-500">Avg Rain: {location.annualRainfallAvgMm} mm/yr</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Enterprise & Area</span>
              <span className="font-bold text-slate-900 block">{postHarvestInput.cropName}</span>
              <span className="text-[10px] text-slate-500 font-semibold">{postHarvestInput.totalAreaHa} Hectare ({postHarvestInput.totalAreaHa <= 0.1 ? 'Pfumvudza Plot' : 'Field'})</span>
            </div>
          </div>

          {/* Section 2: Production Output & Realized Harvest */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white inline-flex items-center justify-center text-[10px]">1</span>
              Harvest Realized & Market Inflow
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Production Metric</th>
                    <th className="p-2.5">Audited Quantity</th>
                    <th className="p-2.5">Unit Commodity Price</th>
                    <th className="p-2.5 text-right">Total Realized Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">
                      Clean Grain Harvest (50kg Bags)
                    </td>
                    <td className="p-2.5 font-black text-emerald-800">
                      {postHarvestInput.actualHarvestBags50kg} Bags ({(postHarvestInput.actualHarvestBags50kg * 50) / 1000} Tonnes)
                    </td>
                    <td className="p-2.5 text-slate-700">
                      ${postHarvestInput.actualSellingPricePerBagUsd.toFixed(2)} USD / bag
                    </td>
                    <td className="p-2.5 text-right font-black text-slate-900 text-sm">
                      ${postHarvestResult.totalRevenueUsd.toFixed(2)} USD
                    </td>
                  </tr>
                  <tr className="bg-slate-50/60 font-semibold">
                    <td className="p-2.5 text-slate-600" colSpan={3}>
                      Local Currency Benchmark Conversion (1.00 USD = 28.50 ZiG)
                    </td>
                    <td className="p-2.5 text-right text-emerald-800 font-bold">
                      ZiG {postHarvestResult.totalRevenueZig.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Itemized Variable Operating Costs */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white inline-flex items-center justify-center text-[10px]">2</span>
              Itemized Variable Input Costs (Verified)
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Input Item</th>
                    <th className="p-2.5">Input Specification & Supplier</th>
                    <th className="p-2.5 text-right">Cost (USD)</th>
                    <th className="p-2.5 text-right">Cost (ZiG)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">Certified Seed</td>
                    <td className="p-2.5 text-slate-600">Certified Hybrid Seed (Thiram/Metalaxyl treated)</td>
                    <td className="p-2.5 text-right font-semibold">${postHarvestInput.seedCostUsd.toFixed(2)}</td>
                    <td className="p-2.5 text-right text-slate-500 font-mono">ZiG {(postHarvestInput.seedCostUsd * 28.5).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">Basal Fertilizer (Compound D)</td>
                    <td className="p-2.5 text-slate-600">Compound D (7:14:7) Basal placement</td>
                    <td className="p-2.5 text-right font-semibold">${postHarvestInput.compoundDFertilizerCostUsd.toFixed(2)}</td>
                    <td className="p-2.5 text-right text-slate-500 font-mono">ZiG {(postHarvestInput.compoundDFertilizerCostUsd * 28.5).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">Top Dressing Fertilizer (AN)</td>
                    <td className="p-2.5 text-slate-600">Ammonium Nitrate (AN 34.5% N)</td>
                    <td className="p-2.5 text-right font-semibold">${postHarvestInput.anTopDressingCostUsd.toFixed(2)}</td>
                    <td className="p-2.5 text-right text-slate-500 font-mono">ZiG {(postHarvestInput.anTopDressingCostUsd * 28.5).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">Agrochemicals & Protection</td>
                    <td className="p-2.5 text-slate-600">Karate Zeon / Fungicide</td>
                    <td className="p-2.5 text-right font-semibold">${postHarvestInput.chemicalsAgrochemicalsCostUsd.toFixed(2)}</td>
                    <td className="p-2.5 text-right text-slate-500 font-mono">ZiG {(postHarvestInput.chemicalsAgrochemicalsCostUsd * 28.5).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">Labor & Transport Haulage</td>
                    <td className="p-2.5 text-slate-600">Pfumvudza basin digging & market haulage</td>
                    <td className="p-2.5 text-right font-semibold">${postHarvestInput.laborAndHaulageCostUsd.toFixed(2)}</td>
                    <td className="p-2.5 text-right text-slate-500 font-mono">ZiG {(postHarvestInput.laborAndHaulageCostUsd * 28.5).toFixed(2)}</td>
                  </tr>
                  <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                    <td className="p-2.5 uppercase" colSpan={2}>Total Variable Production Outlays</td>
                    <td className="p-2.5 text-right text-rose-700 text-sm">${postHarvestResult.totalVariableCostsUsd.toFixed(2)}</td>
                    <td className="p-2.5 text-right text-rose-700 font-mono">ZiG {postHarvestResult.totalVariableCostsZig.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Bank Micro-Loan Financial Assessment Ratios */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white inline-flex items-center justify-center text-[10px]">3</span>
              Financial Performance & Repayment Ratios
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">Net Gross Margin</span>
                <span className="text-xl font-black text-emerald-950">${postHarvestResult.netGrossMarginUsd.toFixed(2)}</span>
                <span className="text-[10px] text-emerald-700 block font-mono">ZiG {postHarvestResult.netGrossMarginZig.toLocaleString()}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Return on Investment</span>
                <span className="text-xl font-black text-slate-900">+{postHarvestResult.returnOnInvestmentPct}%</span>
                <span className="text-[10px] text-slate-500 block">Surplus Cash Flow</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Cost Per 50kg Bag</span>
                <span className="text-xl font-black text-slate-900">${postHarvestResult.costPerBagUsd.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 block">vs $9.20 Zim Benchmark</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Breakeven Yield</span>
                <span className="text-xl font-black text-slate-900">{postHarvestResult.breakEvenYieldBags} Bags</span>
                <span className="text-[10px] text-emerald-700 font-bold block">
                  +{postHarvestInput.actualHarvestBags50kg - postHarvestResult.breakEvenYieldBags} Bags Profit Buffer
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950 text-white rounded-xl text-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-extrabold text-white text-xs block">
                    Credit Rating: {postHarvestResult.efficiencyGrade}
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Nitrogen Use Efficiency of {postHarvestResult.nitrogenUseEfficiencyKgPerKg} kg/kg N demonstrates high agronomic management. Repayment risk assessed as LOW.
                  </p>
                </div>
              </div>
              <span className="bg-emerald-500 text-slate-950 px-2.5 py-1 rounded font-black text-xs shrink-0">
                RECOMMENDED FOR LOAN
              </span>
            </div>
          </div>

          {/* Section 5: Farmer Self-Declaration & Agronomy Review */}
          <div className="border-t-2 border-slate-900 pt-5 mt-6 text-xs">
            <div className="grid grid-cols-2 gap-8">
              {/* Farmer / Agronomy Technical Assessor Box */}
              <div className="space-y-4">
                <span className="font-black text-slate-900 uppercase block tracking-wider">
                  Lead Farmer / Farm Manager Self-Declaration
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  I hereby certify that the above farm records accurately reflect the input application rates, seasonal management practices, and harvested yields achieved for the stated enterprise plot.
                </p>
                <div className="pt-6 border-b border-dashed border-slate-400 flex justify-between text-[11px] text-slate-400">
                  <span>Borrower / Manager Signature</span>
                  <span>Date & Phone</span>
                </div>
              </div>

              {/* Financial Institution Loan Officer Box */}
              <div className="space-y-4">
                <span className="font-black text-slate-900 uppercase block tracking-wider">
                  Bank / Micro-Finance Credit Officer Decision
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Based on debt-service margin of ${postHarvestResult.netGrossMarginUsd.toFixed(2)}, borrower demonstrates sufficient cash buffer for seasonal input facility.
                </p>
                <div className="pt-6 border-b border-dashed border-slate-400 flex justify-between text-[11px] text-slate-400">
                  <span>Credit Officer Signature</span>
                  <span>Branch Stamp / Approval</span>
                </div>
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="mt-5 p-2.5 bg-slate-100 rounded-lg text-[10px] text-slate-500 border border-slate-200">
              <strong>Notice:</strong> This statement is an independent agribusiness record summary prepared using Farmers Dictionary Zw tools for farmer self-accounting and lender review. It is not an official government certificate or statutory endorsement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
