import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  Users, 
  PhoneCall, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  QrCode, 
  HelpCircle,
  FileText,
  MapPin,
  ChevronRight,
  Download
} from 'lucide-react';
import { ZimbabweLocation } from '../data/zimbabweLocations';
import { 
  AGRITEX_OFFICIAL_HOTLINES, 
  WHATSAPP_COMMUNITY_GROUPS, 
  buildWhatsAppLink, 
  buildWhatsAppUniversalShare,
  generateWhatsAppInquiryMessage,
  generateWhatsAppDailyDigest
} from '../data/farmersDictionaryData';
import { downloadDailyDigestPDF } from '../utils/pdfAdvisoryGenerator';

interface WhatsAppConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: ZimbabweLocation;
  initialTopic?: string;
  initialQuery?: string;
}

export const WhatsAppConnectModal: React.FC<WhatsAppConnectModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  initialTopic,
  initialQuery
}) => {
  const [activeTab, setActiveTab] = useState<'hotline' | 'groups' | 'digest' | 'qr'>('hotline');
  
  // Hotline Form State
  const [selectedHotlineNum, setSelectedHotlineNum] = useState<string>(AGRITEX_OFFICIAL_HOTLINES[0].number);
  const [isCustomNumber, setIsCustomNumber] = useState<boolean>(false);
  const [customOfficerNumber, setCustomOfficerNumber] = useState<string>('');
  const [farmerName, setFarmerName] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic || 'Sowing Window & Dekad Rain');
  const [customQuery, setCustomQuery] = useState<string>(initialQuery || '');
  const [copiedSuccess, setCopiedSuccess] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Load custom officer number and farmer name from localStorage
  useEffect(() => {
    try {
      const savedNumber = localStorage.getItem('farmers_dict_officer_whatsapp');
      if (savedNumber) setCustomOfficerNumber(savedNumber);

      const savedName = localStorage.getItem('farmers_dict_farmer_name');
      if (savedName) setFarmerName(savedName);
    } catch {
      // ignore localStorage errors
    }
  }, []);

  // Update initial query if changed from parent
  useEffect(() => {
    if (initialTopic) setSelectedTopic(initialTopic);
    if (initialQuery) setCustomQuery(initialQuery);
  }, [initialTopic, initialQuery]);

  if (!isOpen) return null;

  const topicsList = [
    'Sowing Window & Dekad Rain',
    'Pfumvudza Basins & Mulch Protocol',
    'Fertilizer Dosing (Compound D & AN Splits)',
    'Pest / Disease Diagnosis (Send Photo)',
    'Livestock Dipping & Tick Prevention',
    'GMB Depot Delivery & Moisture Requirements',
    'Farmers Dictionary Term Clarification',
    'General Agritex Agronomic Advisory'
  ];

  const effectiveNumber = isCustomNumber ? customOfficerNumber : selectedHotlineNum;

  const formattedInquiry = generateWhatsAppInquiryMessage({
    topic: selectedTopic,
    districtName: currentLocation.name,
    naturalRegion: currentLocation.naturalRegion,
    farmerName: farmerName.trim() || undefined,
    queryDetails: customQuery.trim() || undefined
  });

  const dailyDigest = generateWhatsAppDailyDigest({
    name: currentLocation.name,
    naturalRegion: currentLocation.naturalRegion,
    province: currentLocation.province
  });

  const handleSavePreferences = () => {
    try {
      if (customOfficerNumber) {
        localStorage.setItem('farmers_dict_officer_whatsapp', customOfficerNumber);
      }
      if (farmerName) {
        localStorage.setItem('farmers_dict_farmer_name', farmerName);
      }
    } catch {
      // ignore
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSuccess(label);
    setTimeout(() => setCopiedSuccess(null), 3000);
  };

  const handleOpenWhatsAppChat = () => {
    handleSavePreferences();
    const link = buildWhatsAppLink(effectiveNumber, formattedInquiry);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleOpenUniversalShare = (text: string) => {
    const link = buildWhatsAppUniversalShare(text);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadDigestPDF = () => {
    setIsGeneratingPdf(true);
    try {
      downloadDailyDigestPDF(
        `DAILY AGRO-ADVISORY: ${currentLocation.name}`,
        dailyDigest,
        currentLocation.name,
        currentLocation.naturalRegion
      );
    } catch (err) {
      console.error('Failed to export daily digest PDF', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-emerald-900/10 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with authentic WhatsApp Green Gradient */}
        <div className="bg-gradient-to-r from-emerald-700 via-[#128C7E] to-[#25D366] text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-xs flex items-center justify-center shadow-inner text-xl">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Connect to WhatsApp
                </h3>
                <span className="bg-emerald-950/40 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Farmers Dictionary Zw
                </span>
              </div>
              <p className="text-xs text-emerald-100 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{currentLocation.name} (Region {currentLocation.naturalRegion})</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  Live Helpline & Groups
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-3 sm:px-6 py-2 gap-1 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('hotline')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'hotline'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>1. Agritex WhatsApp Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('groups')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'groups'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. Farmer WhatsApp Groups</span>
          </button>

          <button
            onClick={() => setActiveTab('digest')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'digest'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>3. Daily Field Digest</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'qr'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>4. QR Code & Offline</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: AGRITEX DIRECT WHATSAPP CHAT */}
          {activeTab === 'hotline' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900">
                    Official Zimbabwe Agritex & DVS Direct WhatsApp Gateway
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    Opens WhatsApp with your pre-filled district telemetry, soil zone, and inquiry so extension officers can provide pinpoint advisory without long back-and-forth messages.
                  </p>
                </div>
              </div>

              {/* Recipient Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select WhatsApp Contact or Extension Officer:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AGRITEX_OFFICIAL_HOTLINES.map((h, i) => (
                    <label
                      key={h.number}
                      className={`flex items-start gap-2.5 p-3 rounded-2xl border text-xs cursor-pointer transition ${
                        !isCustomNumber && selectedHotlineNum === h.number
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="hotline"
                        checked={!isCustomNumber && selectedHotlineNum === h.number}
                        onChange={() => {
                          setIsCustomNumber(false);
                          setSelectedHotlineNum(h.number);
                        }}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">{h.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{h.display}</div>
                        <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {h.badge}
                        </span>
                      </div>
                    </label>
                  ))}

                  {/* Custom Local Extension Officer Number */}
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-2xl border text-xs cursor-pointer transition ${
                      isCustomNumber
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hotline"
                      checked={isCustomNumber}
                      onChange={() => setIsCustomNumber(true)}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">My Local Ward Agritex Officer</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Custom WhatsApp Number</div>
                      <input
                        type="text"
                        placeholder="e.g. 0771234567 or +26377..."
                        value={customOfficerNumber}
                        onChange={(e) => {
                          setIsCustomNumber(true);
                          setCustomOfficerNumber(e.target.value);
                        }}
                        className="mt-1.5 w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Farmer Name & Topic Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name / Farm ID (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Baba Tinashe / Farm 12"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Inquiry Topic:
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {topicsList.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Details or Problem Description:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. My maize leaves show yellowing between veins. Basins were dug in September, planted SC513 after 30mm rain..."
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-sans"
                />
              </div>

              {/* Message Live Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Message Preview (Sent to WhatsApp)</span>
                  </span>
                  <button
                    onClick={() => handleCopy(formattedInquiry, 'preview')}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
                  >
                    {copiedSuccess === 'preview' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-[#ECE5DD] border border-[#d1c7bc] rounded-2xl p-3.5 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
                  {formattedInquiry}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <button
                  onClick={handleOpenWhatsAppChat}
                  className="w-full sm:flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] active:bg-[#1DA851] text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Open & Send in WhatsApp</span>
                </button>

                <button
                  onClick={() => handleOpenUniversalShare(formattedInquiry)}
                  className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-1.5"
                  title="Share to any WhatsApp group or status"
                >
                  <ExternalLink className="w-4 h-4 text-slate-600" />
                  <span>Share to Group / Status</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: REGIONAL FARMER WHATSAPP GROUPS */}
          {activeTab === 'groups' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
                <Users className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900">
                    Verified Zimbabwean Smallholder Farmer WhatsApp Communities
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    Connect with fellow producers in your agro-ecological region to exchange daily farm-gate pricing, bulk transport deals, kraal manure sourcing, and Agritex alerts.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {WHATSAPP_COMMUNITY_GROUPS.map((group) => (
                  <div
                    key={group.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/20 transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900">{group.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {group.memberCount}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{group.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="font-semibold text-emerald-800">{group.region}</span>
                        <span>•</span>
                        <span>Mod: {group.agritexModerator}</span>
                      </div>
                    </div>

                    <a
                      href={group.defaultInviteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
                    >
                      <span>Join WhatsApp Group</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DAILY AGRICULTURAL DIGEST */}
          {activeTab === 'digest' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900">
                    Daily WhatsApp Agro-Bulletin for {currentLocation.name}
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    A ready-to-broadcast WhatsApp daily summary formatted with markdown bolding, emojis, and local Agritex benchmarks for forward-sharing to family and farm cooperatives.
                  </p>
                </div>
              </div>

              <div className="bg-[#ECE5DD] border border-[#d1c7bc] rounded-2xl p-4 text-xs font-mono text-slate-900 whitespace-pre-wrap leading-relaxed shadow-inner max-h-72 overflow-y-auto">
                {dailyDigest}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                <button
                  onClick={() => handleOpenUniversalShare(dailyDigest)}
                  className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Broadcast to WhatsApp</span>
                </button>

                <button
                  onClick={handleDownloadDigestPDF}
                  disabled={isGeneratingPdf}
                  className="py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Download Daily Digest as formatted PDF"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingPdf ? 'Exporting...' : 'Download PDF'}</span>
                </button>

                <button
                  onClick={() => handleCopy(dailyDigest, 'digest')}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedSuccess === 'digest' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: QR CODE & OFFLINE ADVISORY */}
          {activeTab === 'qr' && (
            <div className="space-y-4 text-center py-2">
              <div className="max-w-xs mx-auto bg-slate-50 border-2 border-dashed border-emerald-400 rounded-3xl p-6 shadow-sm flex flex-col items-center">
                {/* SVG Mock QR Code */}
                <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-inner border border-slate-200 flex flex-col items-center justify-center relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-950 fill-current">
                    {/* Corner boxes */}
                    <rect x="5" y="5" width="28" height="28" rx="4" />
                    <rect x="9" y="9" width="20" height="20" fill="white" />
                    <rect x="13" y="13" width="12" height="12" />

                    <rect x="67" y="5" width="28" height="28" rx="4" />
                    <rect x="71" y="9" width="20" height="20" fill="white" />
                    <rect x="75" y="13" width="12" height="12" />

                    <rect x="5" y="67" width="28" height="28" rx="4" />
                    <rect x="9" y="71" width="20" height="20" fill="white" />
                    <rect x="13" y="75" width="12" height="12" />

                    {/* Data dots */}
                    <rect x="38" y="8" width="6" height="6" />
                    <rect x="48" y="12" width="6" height="6" />
                    <rect x="56" y="8" width="6" height="6" />
                    <rect x="38" y="24" width="6" height="6" />
                    <rect x="48" y="20" width="6" height="6" />

                    <rect x="10" y="38" width="6" height="6" />
                    <rect x="22" y="44" width="6" height="6" />
                    <rect x="16" y="52" width="6" height="6" />

                    <rect x="38" y="38" width="24" height="24" rx="4" fill="#047857" />
                    <circle cx="50" cy="50" r="7" fill="white" />

                    <rect x="68" y="38" width="6" height="6" />
                    <rect x="76" y="44" width="6" height="6" />
                    <rect x="84" y="52" width="6" height="6" />

                    <rect x="38" y="68" width="6" height="6" />
                    <rect x="48" y="76" width="6" height="6" />
                    <rect x="56" y="70" width="6" height="6" />
                    <rect x="68" y="68" width="6" height="6" />
                    <rect x="80" y="76" width="6" height="6" />
                    <rect x="72" y="84" width="6" height="6" />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xl">💬</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Scan with Phone Camera
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instantly starts WhatsApp chat with Farmers Dictionary Zw Helpline
                  </p>
                  <div className="mt-2 text-xs font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full inline-block">
                    +263 77 210 0254
                  </div>
                </div>
              </div>

              <div className="max-w-md mx-auto text-xs text-slate-500 leading-relaxed">
                💡 <span className="font-bold text-slate-700">Offline Field Tip:</span> Save the number <strong>+263 77 210 0254</strong> to your phone contacts as <em>"Farmers Dictionary Zw"</em>. You can then forward field voice notes, crop photos, and coordinate input deliveries directly over WhatsApp even with minimal mobile data!
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Farmers Dictionary Zw WhatsApp Service</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
