/**
 * Agricultural Input vs Yield Financial Report Exporter
 * Generates CSV files and printable Micro-Loan Financial Statements for banks.
 */

import { PostHarvestResult, PostHarvestInputAnalysis, LivestockPostHarvestResult, LivestockPostHarvestInput } from './agroCalculators';
import { ZimbabweLocation } from '../data/zimbabweLocations';

/**
 * Generates and triggers download of a CSV audit report for smallholder crop performance
 */
export function exportCropAuditToCsv(
  input: PostHarvestInputAnalysis,
  result: PostHarvestResult,
  location: ZimbabweLocation,
  farmerName = 'Smallholder Farmer'
) {
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `Agritex_Crop_Audit_${location.district}_${dateStr}.csv`;

  const rows: string[][] = [
    ['FARMERS DICTIONARY ZW - SMART AGRO-ADVISORY SYSTEM'],
    ['SMALLHOLDER INPUT VS YIELD AUDIT REPORT (FINANCIAL STATEMENT)'],
    ['Generated For:', 'Micro-Loan Application & Personal Record Keeping'],
    ['Date of Audit:', dateStr],
    ['Farmer / Borrower Name:', farmerName],
    ['District & Province:', `${location.name}, ${location.district}, ${location.province}`],
    ['Agro-Ecological Region:', `Natural Farming Region ${location.naturalRegion}`],
    ['Target Enterprise:', input.cropName],
    ['Hectares / Area Farmed:', `${input.totalAreaHa} Ha`],
    ['Currency Exchange Benchmark:', '1.00 USD = 28.50 ZiG'],
    [''],
    ['--- 1. HARVEST & PRODUCTION OUTPUT ---'],
    ['Metric', 'Value', 'Unit', 'Notes'],
    ['Total Harvested', String(input.actualHarvestBags50kg), '50kg Grain Bags', 'Clean, dry grain at 12.5% moisture'],
    ['Equivalent Weight', String((input.actualHarvestBags50kg * 50) / 1000), 'Metric Tonnes', 'Standard commodity conversion'],
    ['Selling Price Achieved', `$${input.actualSellingPricePerBagUsd.toFixed(2)}`, 'USD per 50kg bag', `ZiG ${(input.actualSellingPricePerBagUsd * 28.5).toFixed(2)}`],
    ['Gross Revenue (USD)', `$${result.totalRevenueUsd.toFixed(2)}`, 'USD', 'Total market intake'],
    ['Gross Revenue (ZiG)', `ZiG ${result.totalRevenueZig.toLocaleString()}`, 'ZiG', 'Zimbabwe Gold equivalent'],
    [''],
    ['--- 2. ITEMIZED VARIABLE INPUT EXPENSES ---'],
    ['Input Category', 'Cost (USD)', 'Cost (ZiG)', 'Agritex Placement Rate'],
    ['Certified Hybrid Seed', `$${input.seedCostUsd.toFixed(2)}`, `ZiG ${(input.seedCostUsd * 28.5).toFixed(2)}`, 'Certified Hybrid seed (treated)'],
    ['Basal Fertilizer (Compound D)', `$${input.compoundDFertilizerCostUsd.toFixed(2)}`, `ZiG ${(input.compoundDFertilizerCostUsd * 28.5).toFixed(2)}`, 'Compound D 7:14:7 basal placement'],
    ['Top Dressing Fertilizer (AN)', `$${input.anTopDressingCostUsd.toFixed(2)}`, `ZiG ${(input.anTopDressingCostUsd * 28.5).toFixed(2)}`, 'Ammonium Nitrate (AN 34.5% N)'],
    ['Agrochemicals & Crop Protection', `$${input.chemicalsAgrochemicalsCostUsd.toFixed(2)}`, `ZiG ${(input.chemicalsAgrochemicalsCostUsd * 28.5).toFixed(2)}`, 'Insecticide / Fungicide protective sprays'],
    ['Labor & Transport Haulage', `$${input.laborAndHaulageCostUsd.toFixed(2)}`, `ZiG ${(input.laborAndHaulageCostUsd * 28.5).toFixed(2)}`, 'Land prep, Pfumvudza digging & haulage'],
    ['TOTAL VARIABLE INPUT COSTS', `$${result.totalVariableCostsUsd.toFixed(2)}`, `ZiG ${result.totalVariableCostsZig.toLocaleString()}`, 'All operating production outlays'],
    [''],
    ['--- 3. PROFITABILITY & MICRO-LOAN RATIOS ---'],
    ['Financial Indicator', 'Result Value', 'National Benchmark', 'Credit Assessment'],
    ['Net Gross Margin (Profit USD)', `$${result.netGrossMarginUsd.toFixed(2)}`, '> $150.00 / plot', result.netGrossMarginUsd > 0 ? 'Surplus Cash Flow' : 'Deficit'],
    ['Net Gross Margin (Profit ZiG)', `ZiG ${result.netGrossMarginZig.toLocaleString()}`, '-', 'ZiG local currency return'],
    ['Return on Investment (ROI)', `${result.returnOnInvestmentPct}%`, 'Target: > 45%', result.returnOnInvestmentPct >= 45 ? 'High Repayment Capacity' : 'Moderate'],
    ['Production Cost per 50kg Bag', `$${result.costPerBagUsd.toFixed(2)}`, '$9.20 (Zim National Average)', result.costPerBagUsd <= 9.20 ? 'Competitive Low-Cost Producer' : 'Higher Cost'],
    ['Net Profit per Bag', `$${result.profitPerBagUsd.toFixed(2)}`, 'Target: > $4.50', 'Buffer against price shocks'],
    ['Breakeven Harvest Yield', `${result.breakEvenYieldBags} bags`, 'Target: < 9 bags', `Surplus over breakeven: +${input.actualHarvestBags50kg - result.breakEvenYieldBags} bags`],
    ['Nitrogen Use Efficiency (NUE)', `${result.nitrogenUseEfficiencyKgPerKg} kg/kg N`, '25 - 35 kg grain / kg N', 'Agronomic technical efficiency score'],
    ['Agro-Efficiency Grade', result.efficiencyGrade, 'Master Farmer Certified', 'Bank Credit Worthiness Recommendation'],
    [''],
    ['Extension Verification:', result.efficiencyAdvice.replace(/,/g, ';')],
    ['Signature of Extension Officer:', '___________________________', 'Date:', '_________________'],
    ['Bank Loan Officer Sign-off:', '___________________________', 'Decision:', 'APPROVED / REVIEW'],
  ];

  const csvContent = rows
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and triggers download of a CSV audit report for livestock performance
 */
export function exportLivestockAuditToCsv(
  input: LivestockPostHarvestInput,
  result: LivestockPostHarvestResult,
  location: ZimbabweLocation,
  farmerName = 'Livestock Keeper'
) {
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `Agritex_Livestock_Audit_${location.district}_${dateStr}.csv`;

  const rows: string[][] = [
    ['FARMERS DICTIONARY ZW - SMART AGRO-ADVISORY SYSTEM'],
    ['LIVESTOCK PRODUCTION & ENTERPRISE AUDIT REPORT'],
    ['Generated For:', 'Micro-Finance Loan Records & Vet Compliance'],
    ['Date:', dateStr],
    ['Farmer Name:', farmerName],
    ['District & Province:', `${location.name}, ${location.district}`],
    ['Livestock Enterprise:', input.livestockType],
    ['Herd Headcount:', `${input.headCount} Head`],
    [''],
    ['--- INPUT COSTS ---'],
    ['Expense Category', 'Cost (USD)', 'Notes'],
    ['Winter Protein Licks & Salt', `$${input.feedAndLicksCostUsd.toFixed(2)}`, 'Veld maintenance blocks'],
    ['Dipping, Vaccines & Vet Drugs', `$${input.dippingAndVetCostUsd.toFixed(2)}`, 'Decatix dip & clostridial vaccines'],
    ['Herding Labor & Kraal Upkeep', `$${input.laborAndShelterCostUsd.toFixed(2)}`, 'Predator protection labor'],
    ['TOTAL PRODUCTION COSTS', `$${result.totalInputCostUsd.toFixed(2)}`, 'Total operating inputs'],
    ['Cost per Head of Livestock', `$${result.costPerHeadUsd.toFixed(2)}`, 'Average annual maintenance per animal'],
    [''],
    ['--- FINANCIAL PERFORMANCE ---'],
    ['Sales Income Realized', `$${input.salesRevenueUsd.toFixed(2)}`, 'Animals marketed'],
    ['Herd Capital Asset Growth', `$${(input.finalHerdValuationUsd - input.initialHerdValuationUsd).toFixed(2)}`, 'Growth in herd inventory valuation'],
    ['Net Enterprise Profit', `$${result.netEnterpriseProfitUsd.toFixed(2)}`, 'Operating cash & asset margin'],
    ['Weaning Survival Rate', `${result.weaningSurvivalRatePct}%`, 'Benchmark: > 85% survival'],
    ['Return on Livestock Capital', `${result.returnOnCapitalPct}%`, 'Annual asset return'],
    [''],
    ['Veterinary Assessment:', result.commentary.replace(/,/g, ';')],
  ];

  const csvContent = rows
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
