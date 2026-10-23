import { jsPDF } from 'jspdf';
import { CropManual } from '../data/cropManualsDatabase';
import { RegisteredChemical } from '../data/registeredChemicalsDatabase';
import { CropRecommendation } from '../data/allCropsDatabase';
import { FarmerProfile, PersonalizedAdvisoryResult } from '../data/farmerProfileData';
import { CropCalendarPlan, formatFriendlyDate } from './calendarPlanner';
import { getChemicalDetailedManual } from '../data/chemicalManualsDatabase';

// Helper to draw standard Zimbabwe Agritex header on any page
function drawDocumentHeader(doc: jsPDF, title: string, subtitle?: string) {
  // Top green banner
  doc.setFillColor(6, 78, 59); // Emerald-900 / Forest Green
  doc.rect(0, 0, 210, 25, 'F');

  // Gold accent line
  doc.setFillColor(217, 119, 6); // Amber-600
  doc.rect(0, 25, 210, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('FARMERS DICTIONARY ZW • AGRONOMY TECHNICAL ADVISORY', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Independent Smallholder Advisory • Best Practice Field Guidelines & Agrochemical Registry', 14, 18);

  if (subtitle) {
    doc.setFont('helvetica', 'italic');
    doc.text(subtitle, 14, 22);
  }
}

// Helper to draw standard footer on any page
function drawDocumentFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 285, 196, 285);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Farmers Dictionary Zw • Independent Zimbabwe Agro-Advisory & Field Manuals • Connected to WhatsApp',
    14,
    290
  );

  doc.text(`Page ${pageNum} of ${totalPages}`, 180, 290, { align: 'right' });
}

// Helper to check if new page is needed
function ensurePageSpace(doc: jsPDF, currentY: number, neededHeight: number): number {
  if (currentY + neededHeight > 275) {
    doc.addPage();
    drawDocumentHeader(doc, 'TECHNICAL ADVISORY SHEET');
    return 35; // Top margin after header
  }
  return currentY;
}

// ==========================================
// 1. CROP PRODUCTION MANUAL PDF
// ==========================================
export function downloadCropManualPDF(manual: CropManual, locationName?: string) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = 34;

  drawDocumentHeader(doc, manual.title, `Standard: ${manual.edition} • DR&SS Agronomy Guidelines`);

  // Document Title Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 28, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  const titleLines = doc.splitTextToSize(manual.title, 175);
  doc.text(titleLines, 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Technical Standard: ${manual.edition} • Category: ${manual.category}`, 18, y + 17);
  doc.text(`Target Crops: ${manual.targetCrops.join(', ')} • Regions: Natural Regions ${manual.recommendedRegions.join(', ')}`, 18, y + 23);

  y += 33;

  // Summary section
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, y, 182, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(20, 83, 45);
  doc.text('EXECUTIVE AGRONOMY SUMMARY:', 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  const summaryLines = doc.splitTextToSize(manual.summary, 174);
  doc.text(summaryLines, 18, y + 10);

  y += 25;

  // Core Technical Specifications Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CORE AGRONOMIC SPECIFICATIONS & INPUT DIRECTIVES', 14, y);
  y += 4;

  const specs = [
    { label: 'Plant Population / Ha', value: manual.plantPopulationPerHa },
    { label: 'Certified Seed Rate / Ha', value: manual.seedRatePerHa },
    { label: 'Basal Fertilizer Program', value: manual.basalFertilizerRecommendation },
    { label: 'Top Dressing Nitrogen', value: manual.topDressingRecommendation },
    { label: 'Spray Program Highlight', value: manual.sprayProgramHighlight },
    { label: 'Harvesting & Curing Criteria', value: manual.harvestCriteria },
  ];

  specs.forEach((item, index) => {
    y = ensurePageSpace(doc, y, 12);
    
    // Alternating rows
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 3, 182, 10, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(item.label, 17, y + 3);

    doc.setFont('helvetica', 'normal');
    const valLines = doc.splitTextToSize(item.value, 115);
    doc.text(valLines, 75, y + 3);

    y += Math.max(9, valLines.length * 4.5);
  });

  y += 4;

  // Mandatory Technical Directives
  y = ensurePageSpace(doc, y, 35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('MANDATORY PRODUCTION DIRECTIVES (AGRITEX EXTENSION STANDARDS)', 14, y);
  y += 4;

  manual.keyDirectives.forEach((dir, i) => {
    y = ensurePageSpace(doc, y, 12);
    doc.setFillColor(240, 253, 244);
    doc.circle(18, y + 2, 2.5, 'F');
    doc.setTextColor(22, 101, 52);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(`${i + 1}`, 16.8, y + 3.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    const dirLines = doc.splitTextToSize(dir, 165);
    doc.text(dirLines, 23, y + 3);
    y += dirLines.length * 4.2 + 2;
  });

  // Technical Chapters / Sections
  manual.sections.forEach((sec) => {
    y = ensurePageSpace(doc, y, 25);
    y += 4;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, y - 3, 182, 8, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(sec.heading, 17, y + 2);
    y += 9;

    if (sec.content) {
      y = ensurePageSpace(doc, y, 15);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const cLines = doc.splitTextToSize(sec.content, 178);
      doc.text(cLines, 16, y);
      y += cLines.length * 4.2 + 2;
    }

    if (sec.bulletPoints) {
      sec.bulletPoints.forEach((bp) => {
        y = ensurePageSpace(doc, y, 10);
        doc.setTextColor(16, 185, 129);
        doc.setFont('helvetica', 'bold');
        doc.text('•', 17, y);

        doc.setTextColor(51, 65, 85);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        const bpLines = doc.splitTextToSize(bp, 170);
        doc.text(bpLines, 22, y);
        y += bpLines.length * 4.2 + 1.5;
      });
    }
  });

  // Footer for all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    drawDocumentFooter(doc, p, pageCount);
  }

  const cleanName = manual.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 35);
  doc.save(`Crop_Manual_${cleanName}.pdf`);
}

// ==========================================
// 2. REGISTERED CHEMICAL DOSSIER PDF
// ==========================================
export function downloadChemicalDossierPDF(chem: RegisteredChemical, lang: 'en' | 'sn' | 'nd' = 'en') {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = 34;

  const manual = getChemicalDetailedManual(chem, lang);

  drawDocumentHeader(
    doc, 
    chem.tradeName, 
    `Registration No: ${chem.registrationNumber} • DR&SS Certified • Language: ${manual.languageName}`
  );

  // Chemical Header Badge Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(chem.tradeName, 18, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Active Ingredient: ${chem.activeIngredient} (${chem.formulation})`, 18, y + 15);
  doc.text(`Chemical Group: ${chem.chemicalGroup} • DR&SS Official Registry`, 18, y + 21);
  doc.text(`Toxicity Class: ${chem.toxicityClass} • Category: ${chem.category}`, 18, y + 27);

  y += 37;

  // Rate Benchmark Strip (3 visual boxes)
  const boxWidth = 58;
  // Box 1: Ha Rate
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, y, boxWidth, 22, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52);
  doc.text('COMMERCIAL RATE / HA', 18, y + 6);
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  const haLines = doc.splitTextToSize(chem.applicationRates.perHectare, 52);
  doc.text(haLines, 18, y + 12);

  // Box 2: 15L Knapsack Rate
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(14 + boxWidth + 4, y, boxWidth, 22, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 64, 175);
  doc.text('15L KNAPSACK RATE (SMALLHOLDER)', 18 + boxWidth + 4, y + 6);
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  const knapLines = doc.splitTextToSize(chem.applicationRates.knapsack15L, 52);
  doc.text(knapLines, 18 + boxWidth + 4, y + 12);

  // Box 3: Water Volume / PHI
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(14 + (boxWidth + 4) * 2, y, boxWidth, 22, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14);
  doc.text('SAFETY INTERVAL (PHI)', 18 + (boxWidth + 4) * 2, y + 6);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`${chem.preHarvestIntervalDays} Days Before Harvest`, 18 + (boxWidth + 4) * 2, y + 13);
  doc.setFontSize(7.5);
  doc.text(`Re-Entry: ${chem.reEntryIntervalHours} hours`, 18 + (boxWidth + 4) * 2, y + 18);

  y += 28;

  // Approved Crops & Target Pests
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('APPROVED CROPS & TARGET PESTS / WEEDS / DISEASES', 14, y);
  y += 4;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 14, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Approved Crops:', 18, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(chem.approvedCrops.join(', '), 45, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Target Organisms:', 18, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const targetText = doc.splitTextToSize(chem.targetPestsWeedsDiseases.join('; '), 145);
  doc.text(targetText, 45, y + 10);

  y += 18;

  // Agritex Advisory Callout
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(110, 231, 183);
  doc.roundedRect(14, y, 182, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 95, 70);
  doc.text('AGRONOMY FIELD ADVISORY NOTE:', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const advLines = doc.splitTextToSize(chem.agritexFieldAdvisory, 172);
  doc.text(advLines, 18, y + 12);

  y += 27;

  // Detailed Technical Manual Sections in Selected Language
  const manualSections = [
    manual.knapsackCalibration,
    manual.fieldApplicationDirectives,
    manual.safetyAndPpe,
    manual.firstAidAndEmergency,
    manual.withholdingAndIntervals,
    manual.tankMixingCompatibility,
    manual.storageAndDisposal,
    manual.environmentalProtection
  ];

  manualSections.forEach((section) => {
    y = ensurePageSpace(doc, y, 22);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(20, 83, 45);
    doc.text(section.title, 14, y);
    y += 4;

    if (section.content) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      const cLines = doc.splitTextToSize(section.content, 180);
      doc.text(cLines, 14, y);
      y += (cLines.length * 3.8) + 2;
    }

    if (section.bulletPoints && section.bulletPoints.length > 0) {
      section.bulletPoints.forEach((bp) => {
        y = ensurePageSpace(doc, y, 10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(30, 41, 59);
        const bpLines = doc.splitTextToSize(`• ${bp}`, 178);
        doc.text(bpLines, 16, y);
        y += (bpLines.length * 3.6) + 1;
      });
      y += 2;
    }
  });

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    drawDocumentFooter(doc, p, pageCount);
  }

  const cleanName = chem.tradeName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  doc.save(`Chemical_Dossier_${cleanName}_${lang.toUpperCase()}.pdf`);
}

// ==========================================
// 3. SOIL QUALITY & FERTILIZER ADVISORY PDF
// ==========================================
export interface SoilPDFData {
  districtName: string;
  naturalRegion: string;
  dominantSoil: string;
  textureName: string;
  textureShona: string;
  textureNdebele: string;
  cropName: string;
  basalProduct: string;
  basalRateKg: number;
  basalBottleCaps: string;
  basalGramsPerBasin: number;
  basalPlacement: string;
  basalTiming: string;
  topProduct: string;
  topRateKg: number;
  topBottleCaps: string;
  topGramsPerBasin: number;
  splitSchedule: { splitNumber: number; timingDap: string; bottleCapText: string; rateKgHa: number }[];
  kraalManureHandfuls: number;
  drySpellDays: number;
  mulchDepthCm: number;
  mulchMaterials: string[];
  phRating: string;
  limeRecommendationKg: number;
  warningNote?: string;
}

export function downloadSoilAssessmentPDF(data: SoilPDFData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = 34;

  drawDocumentHeader(
    doc,
    'SOIL QUALITY & FERTILIZER PROTOCOL',
    `${data.districtName} • Natural Region ${data.naturalRegion} • Texture: ${data.textureName}`
  );

  // Summary Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`Soil Quality Assessment: ${data.textureName} (${data.textureShona} / ${data.textureNdebele})`, 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Location: ${data.districtName} (Agro-Ecological Natural Region ${data.naturalRegion})`, 18, y + 14);
  doc.text(`Selected Target Crop: ${data.cropName} • Soil pH Status: ${data.phRating}`, 18, y + 19);
  doc.text(`Water Retention Reserve: ${data.drySpellDays} Days Dry-Spell Security • Mulch Depth: ${data.mulchDepthCm}cm`, 18, y + 24);

  y += 33;

  // 1. BASAL FERTILIZATION SECTION
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(14, y, 182, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(6, 95, 70);
  doc.text(`1. BASAL FERTILIZER DRESSING (${data.basalProduct})`, 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`• Recommended Hectare Rate: ${data.basalRateKg} kg/ha (approx ${Math.ceil(data.basalRateKg / 50)} bags of 50kg)`, 18, y + 14);
  doc.text(`• Standard Pfumvudza Plot Dose: ${data.basalBottleCaps} (${data.basalGramsPerBasin}g per basin)`, 18, y + 19);
  doc.text(`• Basin Placement: ${data.basalPlacement}`, 18, y + 24);
  doc.text(`• Application Timing: ${data.basalTiming}`, 18, y + 29);

  y += 39;

  // 2. TOP DRESSING NITROGEN SECTION
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(14, y, 182, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 64, 175);
  doc.text(`2. TOP-DRESSING NITROGEN REGIME (${data.topProduct})`, 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`• Total Top-Dressing Rate: ${data.topRateKg} kg/ha (approx ${Math.ceil(data.topRateKg / 50)} bags of 50kg)`, 18, y + 14);
  doc.text(`• Total Basin Dosing: ${data.topBottleCaps} (${data.topGramsPerBasin}g total nitrogen per basin)`, 18, y + 19);
  doc.text('• Precision Split Schedule:', 18, y + 24);

  data.splitSchedule.forEach((split, sIdx) => {
    doc.text(`   - Split ${split.splitNumber} at ${split.timingDap}: ${split.bottleCapText} (${split.rateKgHa} kg/ha)`, 22, y + 29 + sIdx * 5);
  });

  y += 44;

  // 3. ORGANIC MATTER & WATER RETENTION
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(14, y, 182, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(146, 64, 14);
  doc.text('3. ORGANIC MATTER, KRAAL MANURE & WATER RETENTION STRATEGY', 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`• Kraal Manure / Decomposed Compost: ${data.kraalManureHandfuls} handful(s) per Pfumvudza basin (~500g)`, 18, y + 14);
  doc.text(`• Mulch Blanket Requirement: ${data.mulchDepthCm} cm depth of ${data.mulchMaterials.join(', ')}`, 18, y + 19);
  doc.text(`• Soil Moisture Security: Conserves root moisture through ${data.drySpellDays} days of continuous dry spell`, 18, y + 24);

  y += 35;

  // 4. SOIL ACIDITY & WARNINGS
  if (data.limeRecommendationKg > 0 || data.warningNote) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(14, y, 182, 22, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(153, 27, 27);
    doc.text('SOIL ACIDITY & EXTENSION CAUTION NOTE:', 18, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(127, 29, 29);
    if (data.limeRecommendationKg > 0) {
      doc.text(`• Agricultural Lime Requirement: Apply ${data.limeRecommendationKg} kg/ha calcitic/dolomitic lime 2 months ahead of planting.`, 18, y + 12);
    }
    if (data.warningNote) {
      const warnLines = doc.splitTextToSize(data.warningNote, 172);
      doc.text(warnLines, 18, y + 17);
    }
    y += 27;
  }

  // Official Stamp Box
  y = ensurePageSpace(doc, y, 25);
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, y, 182, 22, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('AGRONOMY ASSESSMENT & NUTRIENT MANAGEMENT SUMMARY', 18, y + 5);
  doc.setFont('helvetica', 'italic');
  doc.text('Generated via Farmers Dictionary Zw • Guidelines for smallholder conservation agriculture (Pfumvudza / Intwasa)', 18, y + 11);
  doc.text('Calculated according to standard soil research benchmarks. Independent advisory only.', 18, y + 16);

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    drawDocumentFooter(doc, p, pageCount);
  }

  doc.save(`Soil_Advisory_${data.districtName}_${data.textureName}.pdf`);
}

// ==========================================
// 4. CROP ZERO-TO-MATURITY SCHEDULE PDF
// ==========================================
export function downloadCropSchedulePDF(crop: CropRecommendation, locationName: string, region: string) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = 34;

  drawDocumentHeader(
    doc,
    `CROP CALENDAR: ${crop.name}`,
    `${locationName} • Natural Region ${region} • Maturity: ${crop.maturityDays} Days`
  );

  // Header Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(crop.name, 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Recommended Varieties: ${crop.recommendedVarieties.join(', ')}`, 18, y + 13);
  doc.text(`Rainfall Requirement: ${crop.rainfallRequirementMm.min} - ${crop.rainfallRequirementMm.max} mm • Maturity: ${crop.maturityDays} Days`, 18, y + 18);
  doc.text(`Expected Yield: ${crop.expectedYieldTonPerHa.avg} t/ha (${crop.pfumvudzaYieldBags.avg} bags/crates per Pfumvudza plot)`, 18, y + 23);

  y += 33;

  // Planting Trigger Alert
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, y, 182, 14, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(22, 101, 52);
  doc.text('OPTIMAL SOWING TRIGGER CONDITION:', 18, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(crop.plantingTriggerCondition, 18, y + 10);

  y += 19;

  // Zero-To-Maturity Steps Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ZERO-TO-MATURITY STEP-BY-STEP INPUT SCHEDULE', 14, y);
  y += 4;

  crop.zeroToMaturitySchedule.forEach((step, sIdx) => {
    y = ensurePageSpace(doc, y, 32);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 26, 1.5, 1.5, 'FD');

    // Step Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Step ${sIdx + 1}: ${step.stage} (${step.timingDap})`, 18, y + 6);

    // Cost pill
    doc.setFontSize(8);
    doc.setTextColor(22, 101, 52);
    doc.text(`Est. Cost: $${step.estimatedCostUsd.toFixed(2)} USD`, 160, y + 6);

    // Task & Input
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const taskLines = doc.splitTextToSize(`Task: ${step.task}`, 172);
    doc.text(taskLines, 18, y + 11);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`Input: ${step.brandName} | Rate: ${step.applicationRate} | Pfumvudza: ${step.pfumvudzaPlotRate}`, 18, y + 17);

    // Advisory
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(180, 83, 9);
    const advLines = doc.splitTextToSize(`Warning: ${step.criticalAdvisory}`, 172);
    doc.text(advLines, 18, y + 22);

    y += 29;
  });

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    drawDocumentFooter(doc, p, pageCount);
  }

  const cleanName = crop.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  doc.save(`Crop_Schedule_${cleanName}.pdf`);
}

// ==========================================
// 5. DEKAD PLANTING & AGRO-CLIMATIC ADVISORY PDF
// ==========================================
export interface DekadAdvisoryPDFData {
  districtName: string;
  naturalRegion: string;
  province?: string;
  dekadLabel: string;
  dekadPeriod: string;
  rainfallIndex: number;
  isFavorable: boolean;
  statusHeadline: string;
  summaryMessage: string;
  cumulativeRainMm: number;
  forecastRainMm: number;
  soilMoistureScore: number;
  temperatureC: number;
  favorableCrops: { name: string; badge: string; reason: string }[];
  actionChecklist: string[];
}

export function downloadDekadAdvisoryPDF(data: DekadAdvisoryPDFData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = 34;

  drawDocumentHeader(
    doc,
    `DEKAD PLANTING ADVISORY: ${data.dekadLabel}`,
    `${data.districtName} (${data.province || 'Zimbabwe'}) • Natural Region ${data.naturalRegion}`
  );

  // Status Banner Box
  if (data.isFavorable) {
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(110, 231, 183);
  } else {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
  }
  doc.roundedRect(14, y, 182, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(data.isFavorable ? 6 : 153, data.isFavorable ? 95 : 27, data.isFavorable ? 70 : 27);
  doc.text(`STATUS: ${data.statusHeadline.toUpperCase()}`, 18, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Effective Dekad Window: ${data.dekadLabel} (${data.dekadPeriod})`, 18, y + 15);
  doc.text(`Location: ${data.districtName} • Agro-Ecological Region ${data.naturalRegion} • Rainfall Index: ${data.rainfallIndex}/100`, 18, y + 21);
  const msgLines = doc.splitTextToSize(data.summaryMessage, 172);
  doc.text(msgLines, 18, y + 27);

  y += 37;

  // Key Telemetry Strip (4 metric boxes)
  const boxW = 43;
  const metrics = [
    { label: 'Rainfall Index', val: `${data.rainfallIndex} / 100`, sub: data.isFavorable ? 'Adequate Sowing' : 'Deficit Reserve' },
    { label: 'Cumulative Rain', val: `${data.cumulativeRainMm} mm`, sub: 'Seasonal to-date' },
    { label: '7-Day Rain Forecast', val: `${data.forecastRainMm} mm`, sub: 'Met Department' },
    { label: 'Soil Root Moisture', val: `${data.soilMoistureScore}%`, sub: `${data.temperatureC}°C ambient` },
  ];

  metrics.forEach((m, idx) => {
    const bx = 14 + idx * (boxW + 3.3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(bx, y, boxW, 22, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, bx + 4, y + 6);

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(m.val, bx + 4, y + 13);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(m.sub, bx + 4, y + 18);
  });

  y += 28;

  // Favorable Crops Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('AGRITEX CROP SOWING SUITABILITY FOR THIS WINDOW', 14, y);
  y += 4;

  if (data.favorableCrops.length > 0) {
    data.favorableCrops.forEach((c) => {
      y = ensurePageSpace(doc, y, 16);
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(14, y, 182, 14, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(22, 101, 52);
      doc.text(`• ${c.name}`, 18, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`[${c.badge}] - ${c.reason}`, 18, y + 11);

      y += 16;
    });
  } else {
    y = ensurePageSpace(doc, y, 16);
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(14, y, 182, 14, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(146, 64, 14);
    doc.text('No crops currently recommended for sowing. Maintain soil mulch and wait for a 25-30mm cumulative rainfall event.', 18, y + 8);
    y += 18;
  }

  y += 4;

  // Action Protocol Checklist
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ACTION PROTOCOL & FIELD DIRECTIVES', 14, y);
  y += 4;

  data.actionChecklist.forEach((act, aIdx) => {
    y = ensurePageSpace(doc, y, 12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`${aIdx + 1}.`, 16, y + 3);

    doc.setFont('helvetica', 'normal');
    const actLines = doc.splitTextToSize(act, 168);
    doc.text(actLines, 22, y + 3);
    y += actLines.length * 4.2 + 2;
  });

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    drawDocumentFooter(doc, p, pageCount);
  }

  const cleanName = data.districtName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Dekad_Advisory_${cleanName}_${data.dekadLabel.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

// ==========================================
// 6. DAILY AGRICULTURAL DIGEST PDF
// ==========================================
export function downloadDailyDigestPDF(title: string, digestBody: string, locationName: string, region: string) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = 34;

  drawDocumentHeader(
    doc,
    title,
    `District: ${locationName} • Natural Region ${region} • Daily Extension Bulletin`
  );

  // Clean the digest text (strip markdown asterisks and formatting)
  const cleanBody = digestBody
    .replace(/\*/g, '')
    .replace(/━━━━━━━━━━━━━━━━━━━━━/g, '------------------------------------------------------------')
    .replace(/_/g, '');

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(title, 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Official Farmers Dictionary Zw Daily Broadcast • Issued for ${locationName} (Region ${region})`, 18, y + 13);

  y += 24;

  // Body text formatted
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const lines = doc.splitTextToSize(cleanBody, 180);
  lines.forEach((line: string) => {
    y = ensurePageSpace(doc, y, 6);
    if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.') || line.trim().startsWith('4.')) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(6, 95, 70);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
    }
    doc.text(line, 15, y);
    y += 4.5;
  });

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    drawDocumentFooter(doc, p, pageCount);
  }

  const cleanName = locationName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Daily_Agricultural_Digest_${cleanName}.pdf`);
}

// ==========================================
// 7. PERSONALIZED FARMER PROFILE & AGRITEX ADVISORY DOSSIER
// ==========================================
export function downloadFarmerProfileAdvisoryPDF(profile: FarmerProfile, advisory: PersonalizedAdvisoryResult) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = 34;

  drawDocumentHeader(
    doc,
    'TAILORED AGRONOMY FARM ADVISORY & INPUT DOSSIER',
    `Farmer: ${profile.farmerName} • ${profile.farmName} • ${profile.districtName} (Region ${profile.naturalRegion})`
  );

  // Identity & Land Profile Banner
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`FARM ENTERPRISE PROFILE: ${profile.farmName.toUpperCase()}`, 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Farmer: ${profile.farmerName}  |  Phone: ${profile.phoneNumber}  |  ID: ${profile.nationalIdNumber || 'N/A'}`, 18, y + 12);
  doc.text(`Location: ${profile.districtName}, ${profile.province}  |  Ward/Village: ${profile.wardOrVillage}`, 18, y + 17);
  doc.text(`Agro-Ecological Region: Natural Region ${profile.naturalRegion}  |  Model: ${profile.resettlementModel}`, 18, y + 22);
  doc.text(`Total Enterprise Land: ${profile.totalLandSize} ${profile.landSizeUnit.replace('_', ' ')}  |  Soil: ${profile.soilTexture.replace('_', ' ').toUpperCase()}  |  Water: ${profile.waterSource.replace('_', ' ').toUpperCase()}`, 18, y + 27);

  y += 36;

  // Urgency & Status Bar
  const isUrgent = advisory.urgencyLevel === 'Critical Action';
  const isAttention = advisory.urgencyLevel === 'High Attention';
  doc.setFillColor(isUrgent ? 254 : isAttention ? 255 : 240, isUrgent ? 242 : isAttention ? 251 : 253, isUrgent ? 242 : isAttention ? 235 : 244);
  doc.setDrawColor(isUrgent ? 248 : isAttention ? 252 : 187, isUrgent ? 113 : isAttention ? 211 : 247, isUrgent ? 113 : isAttention ? 77 : 208);
  doc.roundedRect(14, y, 182, 11, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(isUrgent ? 185 : isAttention ? 161 : 6, isUrgent ? 28 : isAttention ? 98 : 95, isUrgent ? 28 : isAttention ? 7 : 70);
  doc.text(`AGRONOMY STATUS ADVISORY: ${advisory.urgencyLevel.toUpperCase()} • Generated on ${advisory.generatedDate}`, 18, y + 7);

  y += 16;

  // Pfumvudza Input Package Requirements (5 metric boxes)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('CALCULATED PFUMVUDZA INPUT & FERTILITY REQUIREMENTS', 14, y);
  y += 4;

  const pkg = advisory.pfumvudzaInputPackage;
  const boxW = 34;
  const boxes = [
    { label: 'Basal Compound D', val: `${pkg.compoundDRequiredBags50kg} bags`, sub: '50kg (7:14:7)' },
    { label: 'Top Dressing AN', val: `${pkg.anTopDressingRequiredBags50kg} bags`, sub: '50kg (34.5% N)' },
    { label: 'Certified Seed', val: `${pkg.certifiedSeedKg} kg`, sub: 'Hybrid / OPV' },
    { label: 'Kraal Manure', val: `${pkg.kraalManureTonsEstimated} tons`, sub: 'Well-decomposed' },
    { label: 'Mulch Bales', val: `${pkg.mulchBalesRequired} bales`, sub: 'Grass / stover' },
  ];

  boxes.forEach((b, i) => {
    const bx = 14 + i * (boxW + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(bx, y, boxW, 20, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(b.label, bx + 3, y + 5);

    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(b.val, bx + 3, y + 12);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(b.sub, bx + 3, y + 17);
  });

  y += 26;

  // Active Crops in Ground
  y = ensurePageSpace(doc, y, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`REGISTERED CROPS UNDER PRODUCTION (${advisory.cropStageDirectives.length} ENTERPRISES)`, 14, y);
  y += 4;

  if (advisory.cropStageDirectives.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('No active crops registered in the farmer profile.', 14, y + 4);
    y += 10;
  } else {
    advisory.cropStageDirectives.forEach((c) => {
      y = ensurePageSpace(doc, y, 28);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(14, y, 182, 24, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(6, 95, 70);
      doc.text(`${c.cropName} (${c.variety})`, 18, y + 6);

      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Stage: ${c.stage}  •  DAP: ${c.daysAfterPlanting} Days After Sowing`, 130, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      const actionText = c.recommendedActions[0] || 'Observe regular scouting and weed-free basin perimeter.';
      const actLines = doc.splitTextToSize(`Action: ${actionText}`, 174);
      doc.text(actLines, 18, y + 12);

      if (c.nutritionDose) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(180, 83, 9);
        doc.text(`Nutrition Dose: ${c.nutritionDose}`, 18, y + 18);
      }
      if (c.sprayAlert) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(185, 28, 28);
        doc.text(`Pest Alert: ${c.sprayAlert}`, 18, y + 22);
      }

      y += 28;
    });
  }

  // Livestock Directives & Veterinary Protocols
  y = ensurePageSpace(doc, y, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('LIVESTOCK HOLDINGS & VETERINARY PROTOCOLS', 14, y);
  y += 4;

  if (advisory.livestockDirectives.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('No livestock holdings registered in profile.', 14, y + 4);
    y += 10;
  } else {
    advisory.livestockDirectives.forEach((l) => {
      y = ensurePageSpace(doc, y, 16);
      doc.setFillColor(l.urgency === 'urgent' ? 254 : 248, l.urgency === 'urgent' ? 242 : 250, l.urgency === 'urgent' ? 242 : 252);
      doc.setDrawColor(l.urgency === 'urgent' ? 248 : 226, l.urgency === 'urgent' ? 113 : 232, l.urgency === 'urgent' ? 113 : 240);
      doc.roundedRect(14, y, 182, 14, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(l.urgency === 'urgent' ? 185 : 15, l.urgency === 'urgent' ? 28 : 23, l.urgency === 'urgent' ? 28 : 42);
      doc.text(l.category.toUpperCase(), 18, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      const dirLines = doc.splitTextToSize(l.directive, 174);
      doc.text(dirLines, 18, y + 10);

      y += 17;
    });
  }

  // Soil & Moisture Resilience Directives
  y = ensurePageSpace(doc, y, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`SOIL MANAGEMENT & WATER DIRECTIVES (${profile.districtName} • REGION ${profile.naturalRegion})`, 14, y);
  y += 4;

  const combinedSoilWater = [...advisory.soilAndBasalDirectives, ...advisory.waterAndClimaticDirectives];
  combinedSoilWater.forEach((d) => {
    y = ensurePageSpace(doc, y, 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    const split = doc.splitTextToSize(`• ${d}`, 180);
    doc.text(split, 15, y);
    y += (split.length * 4) + 1;
  });

  // Endorsement Box
  y = ensurePageSpace(doc, y, 22);
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 18, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('FARM ENTERPRISE AGRONOMY SUMMARY & ADVISORY', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Advisory calibrated for smallholder productivity, conservation agriculture (Pfumvudza), and climate resilience.', 18, y + 11);
  doc.text(`Generated via Farmers Dictionary Zw • Independent advisory summary for 2026/2027 Season`, 18, y + 15);

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    drawDocumentFooter(doc, p, pageCount);
  }

  const cleanName = profile.farmerName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Farmer_Profile_Advisory_${cleanName}.pdf`);
}

// ==========================================
// 8. PLANTING & HARVEST PLANNER PDF EXPORT
// ==========================================
export function downloadPlantingHarvestPlanPDF(plan: CropCalendarPlan) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = 34;

  drawDocumentHeader(
    doc, 
    `PLANTING & HARVEST PLAN: ${plan.cropName.toUpperCase()}`, 
    `Location: ${plan.location.name} (Natural Region ${plan.location.naturalRegion}) • Sowing: ${formatFriendlyDate(plan.sowingDate)}`
  );

  // Enterprise Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  const cropTitle = `${plan.cropName} ${plan.shonaName ? `(${plan.shonaName})` : ''} ${plan.ndebeleName ? `• ${plan.ndebeleName}` : ''}`;
  doc.text(cropTitle, 18, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`District: ${plan.location.district} (${plan.location.province}) • Natural Region ${plan.location.naturalRegion}`, 18, y + 15);
  doc.text(`Sowing Date: ${formatFriendlyDate(plan.sowingDate)} • Projected Harvest Window: ${formatFriendlyDate(plan.projectedHarvestDate)}`, 18, y + 21);
  doc.text(`Total Growth Duration: ${plan.totalDurationDays} Days • Production System: ${plan.farmingSystem.replace(/_/g, ' ').toUpperCase()}`, 18, y + 27);
  doc.text(`Current Season Phase: ${plan.currentSeasonPhase} • Dekad Moisture Index: ${plan.location.dekadRainIndex}/100`, 18, y + 33);

  y += 41;

  // Key Milestones Strip (3 visual summary cards)
  const boxWidth = 58;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, y, boxWidth, 22, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(22, 101, 52);
  doc.text('PLANTING & BASAL WINDOW', 18, y + 6);
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${formatFriendlyDate(plan.sowingDate)} (0 DAP)`, 18, y + 12);
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text('Basal Compound D placement', 18, y + 17);

  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(14 + boxWidth + 4, y, boxWidth, 22, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(30, 64, 175);
  doc.text('VEGETATIVE TOP-DRESSING', 18 + boxWidth + 4, y + 6);
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('28 to 35 DAP (Knee-Height)', 18 + boxWidth + 4, y + 12);
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text('Ammonium Nitrate on moist soil', 18 + boxWidth + 4, y + 17);

  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(14 + (boxWidth + 4) * 2, y, boxWidth, 22, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(146, 64, 14);
  doc.text('ESTIMATED HARVEST', 18 + (boxWidth + 4) * 2, y + 6);
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${formatFriendlyDate(plan.projectedHarvestDate)}`, 18 + (boxWidth + 4) * 2, y + 12);
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text('Target grain moisture < 12.5%', 18 + (boxWidth + 4) * 2, y + 17);

  y += 28;

  // Step-by-Step Agronomy Timeline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('CHRONOLOGICAL DAY-AFTER-PLANTING (DAP) MILESTONES & INPUT PROTOCOL', 14, y);
  y += 5;

  plan.milestones.forEach((m, idx) => {
    y = ensurePageSpace(doc, y, 26);

    const isFert = m.type === 'fertilization';
    const isPest = m.type === 'scouting';
    const isSow = m.type === 'planting';

    doc.setFillColor(
      isFert ? 240 : isPest ? 254 : isSow ? 236 : 248, 
      isFert ? 253 : isPest ? 242 : isSow ? 253 : 250, 
      isFert ? 244 : isPest ? 242 : isSow ? 245 : 252
    );
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 23, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    const dapText = m.dayOffset >= 0 ? `+${m.dayOffset} DAP` : `${m.dayOffset} DAP`;
    doc.text(`${idx + 1}. ${m.title} [${formatFriendlyDate(m.date)} • ${dapText}]`, 18, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    const descText = doc.splitTextToSize(`Task: ${m.description}`, 174);
    doc.text(descText[0], 18, y + 9.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(20, 83, 45);
    doc.text(`Recommended Input: ${m.recommendedInput || 'Standard Agritex practice'} (${m.dosage || 'Standard placement'})`, 18, y + 14);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.8);
    doc.setTextColor(146, 64, 14);
    const adv = doc.splitTextToSize(`Advisory: ${m.agritexAdvisory}`, 174);
    doc.text(adv[0], 18, y + 18.5);

    y += 26;
  });

  // Fertilizer & Nutrition Matrix
  if (plan.fertilizationSchedule.length > 0) {
    y = ensurePageSpace(doc, y, 35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('PRECISION NUTRIENT & FERTILIZATION SCHEDULE', 14, y);
    y += 5;

    plan.fertilizationSchedule.forEach((f) => {
      y = ensurePageSpace(doc, y, 16);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(14, y, 182, 14, 1, 1, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${f.fertilizerName} (${formatFriendlyDate(f.date)} • ${f.dap} DAP)`, 18, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text(`Rate / Ha: ${f.dosagePerHectare} • Pfumvudza Plot: ${f.dosagePerPlot}`, 18, y + 9.5);
      doc.text(`Method: ${f.applicationTechnique} (${f.timingRule})`, 18, y + 13);

      y += 16;
    });
  }

  // Farm Schedule Verification Box
  y = ensurePageSpace(doc, y, 22);
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 18, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('FARM PLANNER & AGRONOMIC RECORD SUMMARY', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Calibrated against regional agro-ecological guidelines for ${plan.location.name} (${plan.location.district}).`, 18, y + 11);
  doc.text('Lead Farmer / Record Keeper: ___________________________   Date: _______________   Reference: [FDZ-PLAN]', 18, y + 15);

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    drawDocumentFooter(doc, p, pageCount);
  }

  const cleanCrop = plan.cropName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 25);
  const cleanDistrict = plan.location.district.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Planting_Harvest_Plan_${cleanCrop}_${cleanDistrict}.pdf`);
}


