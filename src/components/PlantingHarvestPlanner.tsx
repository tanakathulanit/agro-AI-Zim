import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Droplets, 
  Sparkles, 
  Clock, 
  Bell, 
  BellRing, 
  CheckCircle2, 
  AlertTriangle, 
  CloudRain, 
  Sun, 
  Download, 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Compass, 
  ShieldCheck, 
  Info, 
  Volume2, 
  CalendarRange, 
  Leaf, 
  Trash2,
  CalendarCheck2,
  Check,
  Flame,
  ArrowRight,
  RotateCcw,
  Share2,
  FileText
} from 'lucide-react';
import { ZimbabweLocation } from '../data/zimbabweLocations';
import { MASTER_CROPS, CropRecommendation } from '../data/agronomyData';
import { REGION_CLIMATIC_CYCLES } from '../data/climaticCycles';
import { CropRotationAssistant } from './CropRotationAssistant';
import { 
  CropCalendarPlan, 
  PlannerReminder, 
  generateCropCalendarPlan, 
  exportCalendarToIcs, 
  formatFriendlyDate, 
  getDaysDifferenceFromToday,
  addDaysToDate,
  getSavedReminders,
  saveReminders,
  buildPlantingHarvestWhatsAppShare
} from '../utils/calendarPlanner';
import { downloadPlantingHarvestPlanPDF } from '../utils/pdfAdvisoryGenerator';
import { buildWhatsAppUniversalShare } from '../data/farmersDictionaryData';

interface Props {
  selectedLocation: ZimbabweLocation;
  preselectedCrop?: CropRecommendation;
}

export const PlantingHarvestPlanner: React.FC<Props> = ({
  selectedLocation,
  preselectedCrop,
}) => {
  // State
  const [selectedCropId, setSelectedCropId] = useState<string>(
    preselectedCrop?.cropId || 'maize_medium'
  );

  // Default sowing date: Set to optimal season window for the region
  const regionCycle = REGION_CLIMATIC_CYCLES[selectedLocation.naturalRegion] || REGION_CLIMATIC_CYCLES['IIa'];
  
  // Choose an intelligent default sowing date (e.g. 2026-11-20 for highveld summer)
  const defaultSowingDate = useMemo(() => {
    const year = 2026;
    if (selectedLocation.naturalRegion === 'I') return `${year}-11-05`;
    if (selectedLocation.naturalRegion === 'IIa') return `${year}-11-20`;
    if (selectedLocation.naturalRegion === 'IIb') return `${year}-11-25`;
    if (selectedLocation.naturalRegion === 'III') return `${year}-12-01`;
    if (selectedLocation.naturalRegion === 'IV') return `${year}-12-05`;
    return `${year}-12-10`;
  }, [selectedLocation.naturalRegion]);

  const [sowingDate, setSowingDate] = useState<string>(defaultSowingDate);
  const [farmingSystem, setFarmingSystem] = useState<
    'rainfed_pfumvudza' | 'conventional_rainfed' | 'supplementary_irrigation' | 'full_irrigation'
  >('rainfed_pfumvudza');

  // Sub-view Tab inside Planner
  const [activePlannerTab, setActivePlannerTab] = useState<'timeline' | 'reminders' | 'calendar_grid' | 'climatic' | 'rotation'>('timeline');

  // Selected date filter in calendar view
  const [selectedCalendarMonth, setSelectedCalendarMonth] = useState<number>(10); // 0-11: Nov = 10, Dec = 11, etc.
  const [selectedCalendarYear, setSelectedCalendarYear] = useState<number>(2026);
  const [activeMilestoneDetailId, setActiveMilestoneDetailId] = useState<string | null>(null);

  // Reminders state
  const [persistedReminders, setPersistedReminders] = useState<PlannerReminder[]>([]);
  const [audioFeedbackSuccess, setAudioFeedbackSuccess] = useState<string | null>(null);

  // Custom reminder modal
  const [showAddReminderModal, setShowAddReminderModal] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDate, setCustomDate] = useState<string>(sowingDate);
  const [customType, setCustomType] = useState<'fertilization' | 'irrigation' | 'scouting' | 'custom'>('fertilization');
  const [customDosage, setCustomDosage] = useState<string>('');

  // Find active crop
  const activeCrop = useMemo(() => {
    return MASTER_CROPS.find(c => c.cropId === selectedCropId) || MASTER_CROPS[0];
  }, [selectedCropId]);

  // Generate complete calendar plan
  const plan: CropCalendarPlan = useMemo(() => {
    return generateCropCalendarPlan(activeCrop, selectedLocation, sowingDate, farmingSystem);
  }, [activeCrop, selectedLocation, sowingDate, farmingSystem]);

  // Export & Sharing state
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [copiedPlanSuccess, setCopiedPlanSuccess] = useState<boolean>(false);

  const handleDownloadPlanPdf = () => {
    setIsGeneratingPdf(true);
    try {
      downloadPlantingHarvestPlanPDF(plan);
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 800);
    }
  };

  const handleSharePlanWhatsApp = () => {
    const text = buildPlantingHarvestWhatsAppShare(plan, selectedLocation);
    const shareUrl = buildWhatsAppUniversalShare(text);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyPlanToClipboard = () => {
    const text = buildPlantingHarvestWhatsAppShare(plan, selectedLocation);
    navigator.clipboard.writeText(text);
    setCopiedPlanSuccess(true);
    setTimeout(() => setCopiedPlanSuccess(false), 2500);
  };

  // Load reminders on mount and sync
  useEffect(() => {
    const saved = getSavedReminders();
    if (saved && saved.length > 0) {
      setPersistedReminders(saved);
    } else {
      setPersistedReminders(plan.reminders);
      saveReminders(plan.reminders);
    }
  }, [plan.cropId, plan.sowingDate]);

  // Toggle Reminder Completed
  const handleToggleReminderDone = (id: string) => {
    const updated = persistedReminders.map(r => {
      if (r.id === id) {
        return { ...r, isCompleted: !r.isCompleted };
      }
      return r;
    });
    setPersistedReminders(updated);
    saveReminders(updated);
  };

  // Toggle Reminder Notification Active
  const handleToggleReminderActive = (id: string) => {
    const updated = persistedReminders.map(r => {
      if (r.id === id) {
        return { ...r, reminderActive: !r.reminderActive };
      }
      return r;
    });
    setPersistedReminders(updated);
    saveReminders(updated);
  };

  // Delete reminder
  const handleDeleteReminder = (id: string) => {
    const updated = persistedReminders.filter(r => r.id !== id);
    setPersistedReminders(updated);
    saveReminders(updated);
  };

  // Trigger sound / audio test
  const handleTestChime = (reminderTitle: string) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch {
      // Audio fallback
    }

    setAudioFeedbackSuccess(`Notification reminder tested: "${reminderTitle}"`);
    setTimeout(() => setAudioFeedbackSuccess(null), 3500);

    // If browser supports notifications, dispatch a notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Farmers Dictionary Zw Reminder', {
        body: reminderTitle,
        icon: '/pwa-192x192.png',
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  // Handle Add Custom Reminder
  const handleAddCustomReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;

    const newReminder: PlannerReminder = {
      id: `custom-rem-${Date.now()}`,
      title: customTitle,
      type: customType,
      scheduledDate: customDate,
      stageDap: `${getDaysDifferenceFromToday(customDate)} days from today`,
      dosageInstructions: customDosage || 'Standard farmer practice',
      criticalAlert: 'Scheduled by farmer for regional timing compliance.',
      isCompleted: false,
      reminderActive: true,
      cropName: activeCrop.name,
      locationName: selectedLocation.name,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newReminder, ...persistedReminders];
    setPersistedReminders(updated);
    saveReminders(updated);
    setShowAddReminderModal(false);
    setCustomTitle('');
    setCustomDosage('');
  };

  // Quick preset sowing date change
  const handleQuickSowDate = (daysOffset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    setSowingDate(d.toISOString().split('T')[0]);
  };

  // Days left to harvest
  const daysUntilHarvest = getDaysDifferenceFromToday(plan.projectedHarvestDate);

  // Month navigation for Calendar Grid
  const handlePrevMonth = () => {
    if (selectedCalendarMonth === 0) {
      setSelectedCalendarMonth(11);
      setSelectedCalendarYear(selectedCalendarYear - 1);
    } else {
      setSelectedCalendarMonth(selectedCalendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedCalendarMonth === 11) {
      setSelectedCalendarMonth(0);
      setSelectedCalendarYear(selectedCalendarYear + 1);
    } else {
      setSelectedCalendarMonth(selectedCalendarMonth + 1);
    }
  };

  // Calendar days generation for grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(selectedCalendarYear, selectedCalendarMonth, 1).getDay();
    const daysInMonth = new Date(selectedCalendarYear, selectedCalendarMonth + 1, 0).getDate();
    
    // We want Monday as day 0 in traditional agricultural calendars
    const startOffset = (firstDay + 6) % 7; 
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Empty slots before 1st
    for (let i = 0; i < startOffset; i++) {
      days.push({ dateStr: '', dayNum: 0, isCurrentMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = String(selectedCalendarMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateStr = `${selectedCalendarYear}-${monthStr}-${dayStr}`;
      days.push({ dateStr, dayNum: d, isCurrentMonth: true });
    }

    return days;
  }, [selectedCalendarYear, selectedCalendarMonth]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Agricultural Broadcast & Regional Context Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5">
                <CalendarRange className="w-3.5 h-3.5" />
                Planting & Harvest Seasonal Planner
              </span>
              <span className="text-emerald-200/70 text-xs">
                Region {selectedLocation.naturalRegion} Micro-Climate Engine
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {regionCycle.regionTitle}
            </h2>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Synchronized with the natural 4-season agricultural cycle (
              <span className="text-emerald-300 font-semibold">Chirimo</span> • <span className="text-teal-300 font-semibold">Zhizha</span> • <span className="text-amber-300 font-semibold">Matsutso</span> • <span className="text-blue-300 font-semibold">Chando</span>
              ). Automatic calculations for Pfumvudza fertilizer placement, vegetative growth, and critical tasseling irrigation intervals.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] text-emerald-300 block font-medium">Optimal Planting Window</span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {regionCycle.optimalPlantingWindow.earliestDate} - {regionCycle.optimalPlantingWindow.latestRecommendedDate}
              </span>
              <span className="text-[10px] text-slate-300 mt-1 block">Trigger: {regionCycle.optimalPlantingWindow.rainTriggerMm3Days}mm in 3 days</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] text-amber-300 block font-medium">Mid-Season Dry Spell</span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {regionCycle.criticalDrySpellRiskWindow.period}
              </span>
              <span className="text-[10px] text-amber-200 mt-1 block">Risk: {regionCycle.criticalDrySpellRiskWindow.probabilityPct}% likelihood</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-teal-300 block font-medium">Current Season Phase</span>
              <span className="text-sm font-bold text-white block mt-0.5 truncate">
                {plan.currentSeasonPhase}
              </span>
              <span className="text-[10px] text-teal-200 mt-1 block">Dekad Index: {selectedLocation.dekadRainIndex}/100</span>
            </div>
          </div>
        </div>

        {/* Audio feedback banner */}
        {audioFeedbackSuccess && (
          <div className="mt-4 p-3 bg-emerald-500/30 border border-emerald-400/40 rounded-xl text-xs text-white flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-300" />
              <span>{audioFeedbackSuccess}</span>
            </div>
            <button 
              onClick={() => setAudioFeedbackSuccess(null)}
              className="text-white hover:text-emerald-200 text-xs px-2 py-0.5"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Configuration Bar: Crop, Sowing Date, Farming System */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              Select Target Enterprise / Crop
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {MASTER_CROPS.map((c) => (
                <option key={c.cropId} value={c.cropId}>
                  {c.name} ({c.shonaName || c.category}) • {c.maturityDays} Days
                </option>
              ))}
            </select>
          </div>

          {/* Sowing Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
              Sowing / Planting Date
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setSowingDate(defaultSowingDate)}
                title="Reset to Regional Optimal Planting Date"
                className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-[11px] font-bold shrink-0 transition"
              >
                Optimal
              </button>
            </div>
          </div>

          {/* Farming Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
              Farming & Moisture System
            </label>
            <select
              value={farmingSystem}
              onChange={(e) => setFarmingSystem(e.target.value as typeof farmingSystem)}
              className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="rainfed_pfumvudza">Pfumvudza Basins + Mulch (Rainfed)</option>
              <option value="conventional_rainfed">Conventional Ploughed (Rainfed)</option>
              <option value="supplementary_irrigation">Supplementary Irrigation (Borehole / Weir)</option>
              <option value="full_irrigation">Full Irrigation Scheme (Drip / Furrow)</option>
            </select>
          </div>

          {/* Action: Export to PDF, WhatsApp, Calendar, Add Reminder */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPlanPdf}
              disabled={isGeneratingPdf}
              className="py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Download official Agritex Planting & Harvest Schedule in PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Exporting...' : 'Export PDF'}</span>
            </button>

            <button
              onClick={handleSharePlanWhatsApp}
              className="py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              title="Share full planting calendar and DAP milestones to WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => exportCalendarToIcs(plan)}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              title="Sync calendar with phone / Google Calendar (.ics)"
            >
              <CalendarRange className="w-3.5 h-3.5 text-slate-600" />
              <span>Sync .ics</span>
            </button>

            <button
              onClick={() => setShowAddReminderModal(true)}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              title="Add a custom reminder for this season"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Reminder</span>
            </button>
          </div>
        </div>

        {/* Life-Cycle Status Progress Strip */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600">Growth Duration:</span>
              <span className="text-emerald-800">{activeCrop.maturityDays} Days Total</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, (plan.currentDap / plan.totalDurationDays) * 100))}%` }}
              />
            </div>
          </div>

          <div className="text-xs">
            <span className="text-slate-500 block">Sowing Date:</span>
            <span className="font-bold text-slate-800">{formatFriendlyDate(sowingDate)}</span>
          </div>

          <div className="text-xs">
            <span className="text-slate-500 block">Projected Harvest Window:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {formatFriendlyDate(plan.projectedHarvestDate)}
            </span>
          </div>

          <div className="text-xs">
            <span className="text-slate-500 block">Status Relative to Today:</span>
            <span className="font-bold text-slate-800">
              {daysUntilHarvest > 0 
                ? `${daysUntilHarvest} days to harvest` 
                : daysUntilHarvest === 0 
                  ? 'Harvest Day Today!' 
                  : 'Harvest completed'}
            </span>
          </div>
        </div>

        {/* Quick Action Export Strip for WhatsApp & PDF */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
              🌾
            </span>
            <div>
              <h5 className="font-black text-xs sm:text-sm text-emerald-950">
                Official Seasonal Calendar Export & Field Sharing
              </h5>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Export full Pfumvudza fertilizer dates, growth phases, and harvest benchmarks to official PDF dossier or WhatsApp.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPlanPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              title="Download official DR&SS/Agritex planting and harvest plan in PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Plan'}</span>
            </button>

            <button
              onClick={handleSharePlanWhatsApp}
              className="px-3.5 py-2 bg-[#25D366] hover:bg-[#1EBE5D] active:bg-[#169C4B] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Share planting milestones and input dosages directly to WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share to WhatsApp</span>
            </button>

            <button
              onClick={handleCopyPlanToClipboard}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              {copiedPlanSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <span>Copy Plan</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActivePlannerTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activePlannerTab === 'timeline'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CalendarRange className="w-3.5 h-3.5" />
          1. Agronomic Lifecycle Timeline ({plan.milestones.length})
        </button>

        <button
          onClick={() => setActivePlannerTab('reminders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activePlannerTab === 'reminders'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          2. Fertilization & Irrigation Reminders ({persistedReminders.length})
        </button>

        <button
          onClick={() => setActivePlannerTab('calendar_grid')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activePlannerTab === 'calendar_grid'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck2 className="w-3.5 h-3.5" />
          3. Monthly Calendar Grid
        </button>

        <button
          onClick={() => setActivePlannerTab('climatic')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activePlannerTab === 'climatic'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          4. Region {selectedLocation.naturalRegion} Climatic Cycles
        </button>

        <button
          onClick={() => setActivePlannerTab('rotation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activePlannerTab === 'rotation'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          5. Crop Rotation Assistant (Soil Health & N-Fixing)
        </button>
      </div>

      {/* TAB 1: AGRONOMIC LIFECYCLE TIMELINE */}
      {activePlannerTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Milestones calibrated for {selectedLocation.name} (Region {selectedLocation.naturalRegion})</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Fertilization</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Irrigation</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Sowing / Prep</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Scouting & Thinning</span>
            </div>
          </div>

          <div className="relative border-l-2 border-emerald-200 ml-4 pl-6 space-y-6">
            {plan.milestones.map((ms) => {
              const daysDiff = getDaysDifferenceFromToday(ms.date);
              const isPast = daysDiff < 0;
              const isToday = daysDiff === 0;

              // Type badge styles
              let badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';
              let icon = <Clock className="w-3.5 h-3.5" />;
              if (ms.type === 'fertilization') {
                badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
                icon = <Sparkles className="w-3.5 h-3.5 text-amber-600" />;
              } else if (ms.type === 'irrigation') {
                badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
                icon = <Droplets className="w-3.5 h-3.5 text-blue-600" />;
              } else if (ms.type === 'planting') {
                badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                icon = <Leaf className="w-3.5 h-3.5 text-emerald-600" />;
              } else if (ms.type === 'scouting') {
                badgeColor = 'bg-violet-50 text-violet-800 border-violet-200';
                icon = <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />;
              } else if (ms.type === 'harvest') {
                badgeColor = 'bg-yellow-50 text-yellow-900 border-yellow-200';
                icon = <CalendarCheck2 className="w-3.5 h-3.5 text-yellow-700" />;
              }

              return (
                <div 
                  key={ms.id} 
                  className={`relative bg-white rounded-2xl p-5 border transition-all ${
                    isToday 
                      ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' 
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Timeline bullet node */}
                  <div 
                    className={`absolute -left-[31px] top-6 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                      isPast 
                        ? 'bg-slate-400' 
                        : isToday 
                          ? 'bg-emerald-600 ring-4 ring-emerald-100' 
                          : ms.type === 'fertilization' 
                            ? 'bg-amber-500' 
                            : ms.type === 'irrigation' 
                              ? 'bg-blue-500' 
                              : 'bg-emerald-500'
                    }`} 
                  />

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${badgeColor} flex items-center gap-1`}>
                          {icon}
                          {ms.stageName}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {formatFriendlyDate(ms.date)}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({ms.dayOffset >= 0 ? `+${ms.dayOffset}` : ms.dayOffset} DAP)
                        </span>
                        {isToday && (
                          <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md animate-pulse">
                            TODAY
                          </span>
                        )}
                        {isPast && (
                          <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" /> Completed Period
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 mt-1">
                        {ms.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ms.description}
                      </p>
                    </div>

                    {/* Quick test alarm button */}
                    <button
                      onClick={() => handleTestChime(ms.title)}
                      title="Test Audio Reminder Alert"
                      className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition shrink-0 flex items-center gap-1 text-xs font-semibold self-start"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Alert Test</span>
                    </button>
                  </div>

                  {/* Agritex Dosage & Technical Protocol */}
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50/70 -mx-5 -mb-5 p-4 rounded-b-2xl">
                    <div>
                      <span className="text-[11px] text-slate-500 block font-semibold">Recommended Input / Product</span>
                      <span className="font-bold text-slate-800">{ms.recommendedInput}</span>
                      <span className="text-[10px] text-slate-500 block">{ms.brandName}</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 block font-semibold">Pfumvudza Dosage Rate</span>
                      <span className="font-bold text-emerald-800">{ms.dosage}</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 block font-semibold flex items-center gap-1">
                        <Info className="w-3 h-3 text-amber-600" />
                        Agritex Critical Advisory
                      </span>
                      <span className="text-slate-700 text-[11px] leading-tight block mt-0.5">
                        {ms.agritexAdvisory}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: REMINDERS & ALERTS MANAGER (FERTILIZATION & IRRIGATION) */}
      {activePlannerTab === 'reminders' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Active Fertilization & Irrigation Farm Reminders
              </h3>
              <p className="text-xs text-slate-500">
                Never miss a split top-dressing or silking moisture window. Stored offline and persistent on this device.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddReminderModal(true)}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Custom Reminder
              </button>
            </div>
          </div>

          {/* Reminders List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {persistedReminders.map((rem) => {
              const daysDiff = getDaysDifferenceFromToday(rem.scheduledDate);
              const isDueToday = daysDiff === 0;
              const isOverdue = daysDiff < 0 && !rem.isCompleted;

              let typeColor = 'bg-amber-50 text-amber-800 border-amber-200';
              let icon = <Sparkles className="w-4 h-4 text-amber-600" />;
              if (rem.type === 'irrigation') {
                typeColor = 'bg-blue-50 text-blue-800 border-blue-200';
                icon = <Droplets className="w-4 h-4 text-blue-600" />;
              } else if (rem.type === 'planting') {
                typeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                icon = <Leaf className="w-4 h-4 text-emerald-600" />;
              } else if (rem.type === 'harvest') {
                typeColor = 'bg-yellow-50 text-yellow-900 border-yellow-200';
                icon = <CalendarCheck2 className="w-4 h-4 text-yellow-700" />;
              }

              return (
                <div
                  key={rem.id}
                  className={`bg-white rounded-2xl p-5 border transition-all ${
                    rem.isCompleted
                      ? 'border-slate-200 bg-slate-50/60 opacity-75'
                      : isDueToday
                        ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : isOverdue
                          ? 'border-rose-400 bg-rose-50/20'
                          : 'border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleReminderDone(rem.id)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition shrink-0 mt-0.5 ${
                          rem.isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-emerald-500 bg-white'
                        }`}
                        title={rem.isCompleted ? 'Mark as Pending' : 'Mark as Done'}
                      >
                        {rem.isCompleted && <Check className="w-4 h-4" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeColor} flex items-center gap-1`}>
                            {icon}
                            {rem.type.toUpperCase()}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            {formatFriendlyDate(rem.scheduledDate)}
                          </span>
                          {isDueToday && (
                            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                              TODAY
                            </span>
                          )}
                          {isOverdue && (
                            <span className="bg-rose-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                              OVERDUE
                            </span>
                          )}
                        </div>

                        <h4 className={`text-sm font-extrabold text-slate-900 ${rem.isCompleted ? 'line-through text-slate-400' : ''}`}>
                          {rem.title}
                        </h4>

                        <span className="text-[11px] text-slate-500 block">
                          Stage: {rem.stageDap}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTestChime(rem.title)}
                        title="Test Alarm Audio"
                        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReminder(rem.id)}
                        title="Remove Reminder"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dosage & Technique */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                    <div className="font-semibold text-slate-700">
                      Dosage Instructions:
                    </div>
                    <div className="text-slate-600 font-medium">
                      {rem.dosageInstructions}
                    </div>
                    {rem.criticalAlert && (
                      <div className="text-[11px] text-amber-800 font-medium flex items-center gap-1 pt-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                        {rem.criticalAlert}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Irrigation Schedule Table (If irrigated) */}
          {plan.irrigationSchedule.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    Recommended Irrigation Application Schedule ({farmingSystem.replace('_', ' ')})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Water pulses timed to crop evapotranspiration (ETc) and critical silking thresholds.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Growth Stage</th>
                      <th className="py-2.5 px-3">Water Depth</th>
                      <th className="py-2.5 px-3">Frequency</th>
                      <th className="py-2.5 px-3">Application Technique</th>
                      <th className="py-2.5 px-3">Yield Risk If Missed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {plan.irrigationSchedule.map((irrig) => (
                      <tr key={irrig.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          {formatFriendlyDate(irrig.date)}
                        </td>
                        <td className="py-2.5 px-3 text-blue-900 font-semibold">
                          {irrig.stage} ({irrig.dap} DAP)
                        </td>
                        <td className="py-2.5 px-3 font-extrabold text-blue-700">
                          {irrig.waterAmountMm} mm
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {irrig.frequency}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {irrig.method}
                        </td>
                        <td className="py-2.5 px-3 text-rose-700 font-medium">
                          {irrig.criticalRiskIfNotDone}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MONTHLY CALENDAR GRID */}
      {activePlannerTab === 'calendar_grid' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
          {/* Calendar Header with Month Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {monthNames[selectedCalendarMonth]} {selectedCalendarYear}
              </h3>
              <p className="text-xs text-slate-500">
                Monthly view of operations for {activeCrop.name} in {selectedLocation.name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-500 pb-2 border-b border-slate-100">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div className="text-amber-700">Sat</div>
            <div className="text-emerald-700">Sun</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cd, index) => {
              if (!cd.isCurrentMonth) {
                return (
                  <div key={`empty-${index}`} className="h-24 bg-slate-50/40 rounded-xl border border-transparent" />
                );
              }

              // Check if any milestone matches this date
              const dayMilestones = plan.milestones.filter(m => m.date === cd.dateStr);
              const isToday = cd.dateStr === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={cd.dateStr}
                  onClick={() => {
                    if (dayMilestones.length > 0) {
                      setActiveMilestoneDetailId(dayMilestones[0].id);
                    }
                  }}
                  className={`h-24 p-2 rounded-xl border flex flex-col justify-between transition-all ${
                    dayMilestones.length > 0 
                      ? 'cursor-pointer hover:shadow-md hover:border-emerald-400 bg-white' 
                      : 'bg-white hover:bg-slate-50/50'
                  } ${
                    isToday 
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isToday ? 'text-emerald-700 font-extrabold' : 'text-slate-700'}`}>
                      {cd.dayNum}
                    </span>
                    {dayMilestones.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>

                  {/* Badges inside day box */}
                  <div className="space-y-1 overflow-hidden">
                    {dayMilestones.map((ms) => {
                      let color = 'bg-slate-100 text-slate-800';
                      if (ms.type === 'fertilization') color = 'bg-amber-100 text-amber-900';
                      else if (ms.type === 'irrigation') color = 'bg-blue-100 text-blue-900';
                      else if (ms.type === 'planting') color = 'bg-emerald-100 text-emerald-900';
                      else if (ms.type === 'harvest') color = 'bg-yellow-100 text-yellow-950';

                      return (
                        <div
                          key={ms.id}
                          className={`text-[9px] font-bold px-1 py-0.5 rounded truncate ${color}`}
                          title={`${ms.title} (${ms.stageName})`}
                        >
                          {ms.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Milestone Details Popup / Box */}
          {activeMilestoneDetailId && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start justify-between gap-4 animate-in fade-in">
              {(() => {
                const ms = plan.milestones.find(m => m.id === activeMilestoneDetailId);
                if (!ms) return null;
                return (
                  <>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {ms.stageName}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {formatFriendlyDate(ms.date)} ({ms.dayOffset} DAP)
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900">{ms.title}</h4>
                      <p className="text-xs text-slate-700">{ms.description}</p>
                      <p className="text-xs text-emerald-900 font-semibold">Dosage: {ms.dosage}</p>
                    </div>

                    <button
                      onClick={() => setActiveMilestoneDetailId(null)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-3 py-1.5 bg-white border border-emerald-200 rounded-xl"
                    >
                      Close Details
                    </button>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: REGION CLIMATIC CYCLES & MICROCLIMATE ANALYSIS */}
      {activePlannerTab === 'climatic' && (
        <div className="space-y-6">
          {/* Traditional 4 Seasons Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Natural Climatic Cycles & Traditional Agricultural Seasons
              </h3>
              <p className="text-xs text-slate-500">
                Traditional knowledge harmonized with modern Meteorological Services Department (MSD) decadal models.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {regionCycle.seasons.map((season, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-800">{season.localName}</span>
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                      {season.months}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{season.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{season.description}</p>

                  <div className="pt-2 border-t border-slate-200/60 text-[11px] space-y-1">
                    <div className="text-slate-500">
                      <span className="font-semibold text-slate-700">Temp Range:</span> {season.temperatureRangeC}
                    </div>
                    <div className="text-emerald-900 font-medium">
                      <span className="font-semibold">Action:</span> {season.agroAction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Rainfall & Evapotranspiration Analysis */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Monthly Precipitation vs. Evapotranspiration (ET0) Curve
              </h3>
              <p className="text-xs text-slate-500">
                Shows average monthly rainfall (mm) and daily crop water demand for Region {selectedLocation.naturalRegion}.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {regionCycle.monthlyClimaticData.map((m) => (
                <div key={m.monthCode} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                  <span className="text-xs font-extrabold text-slate-800 block">{m.monthCode}</span>
                  <span className="text-sm font-black text-emerald-700 block">{m.avgRainfallMm} mm</span>
                  <span className="text-[10px] text-slate-500 block">ET0: {m.evapotranspirationEt0MmPerDay}mm/d</span>
                  <div className="pt-1 border-t border-slate-200">
                    <span className={`text-[10px] font-bold block ${m.drySpellRiskPct > 30 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      Dry Risk: {m.drySpellRiskPct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Dry Spell Advisory */}
          <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-200 flex flex-col md:flex-row items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-800 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-amber-950">
                Mid-Season Dry Spell Vulnerability Period: {regionCycle.criticalDrySpellRiskWindow.period}
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed">
                {regionCycle.criticalDrySpellRiskWindow.mitigationStrategy}
              </p>
              <div className="text-xs text-amber-800 font-semibold pt-1">
                Irrigation Recommendation: {regionCycle.irrigationGuidance.waterSavingTechnique}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CROP ROTATION ASSISTANT */}
      {activePlannerTab === 'rotation' && (
        <CropRotationAssistant
          selectedLocation={selectedLocation}
          onApplyCropToPlanner={(cropId) => {
            setSelectedCropId(cropId);
            setActivePlannerTab('timeline');
          }}
        />
      )}

      {/* Modal: Add Custom Reminder */}
      {showAddReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BellRing className="w-4 h-4 text-emerald-600" />
                Add Personalized Farm Reminder
              </h3>
              <button
                onClick={() => setShowAddReminderModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reminder Title / Operation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Apply Top Dressing AN on Section B"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    required
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value as typeof customType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="fertilization">Fertilization</option>
                    <option value="irrigation">Irrigation</option>
                    <option value="scouting">Scouting & Pest Spray</option>
                    <option value="custom">Other Farm Task</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dosage / Input Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., 10g beer-bottle-cap of AN per basin after shower."
                  value={customDosage}
                  onChange={(e) => setCustomDosage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddReminderModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
