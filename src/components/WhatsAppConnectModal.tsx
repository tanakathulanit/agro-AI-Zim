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
  FileText,
  MapPin,
  ChevronRight,
  Download,
  Share2,
  Bookmark,
  UserCheck
} from 'lucide-react';
import { ZimbabweLocation } from '../data/zimbabweLocations';
import { 
  WHATSAPP_COMMUNITY_NETWORKS,
  WhatsAppCommunityNetwork,
  ADVISORY_TOPIC_OPTIONS,
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
  
  // Officer WhatsApp Contact State (saved locally by farmer)
  const [customOfficerNumber, setCustomOfficerNumber] = useState<string>('');
  const [customOfficerRole, setCustomOfficerRole] = useState<string>('Local Extension Officer');
  const [farmerName, setFarmerName] = useState<string>('');
  const [savedGroupLink, setSavedGroupLink] = useState<string>('');
  const [tempGroupLink, setTempGroupLink] = useState<string>('');
  const [showGroupInput, setShowGroupInput] = useState<boolean>(false);
  const [deliveryMode, setDeliveryMode] = useState<'officer' | 'universal'>('officer');
  
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic || 'Sowing Window & Dekad Rain');
  const [customQuery, setCustomQuery] = useState<string>(initialQuery || '');
  const [copiedSuccess, setCopiedSuccess] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Load saved preferences from localStorage
  useEffect(() => {
    try {
      const savedNumber = localStorage.getItem('farmers_dict_officer_whatsapp');
      if (savedNumber) setCustomOfficerNumber(savedNumber);

      const savedRole = localStorage.getItem('farmers_dict_officer_role');
      if (savedRole) setCustomOfficerRole(savedRole);

      const savedName = localStorage.getItem('farmers_dict_farmer_name');
      if (savedName) setFarmerName(savedName);

      const savedGroup = localStorage.getItem('farmers_dict_custom_group_link');
      if (savedGroup) {
        setSavedGroupLink(savedGroup);
        setTempGroupLink(savedGroup);
      }
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
    'General Agronomic Field Advisory'
  ];

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

  const handleSaveOfficerNumber = () => {
    try {
      if (customOfficerNumber) {
        localStorage.setItem('farmers_dict_officer_whatsapp', customOfficerNumber.trim());
      }
      if (customOfficerRole) {
        localStorage.setItem('farmers_dict_officer_role', customOfficerRole.trim());
      }
      if (farmerName) {
        localStorage.setItem('farmers_dict_farmer_name', farmerName.trim());
      }
    } catch {
      // ignore
    }
  };

  const handleSaveCustomGroupLink = () => {
    try {
      if (tempGroupLink.trim()) {
        localStorage.setItem('farmers_dict_custom_group_link', tempGroupLink.trim());
        setSavedGroupLink(tempGroupLink.trim());
        setShowGroupInput(false);
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
    handleSaveOfficerNumber();
    if (deliveryMode === 'officer' && customOfficerNumber.trim()) {
      const link = buildWhatsAppLink(customOfficerNumber, formattedInquiry);
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      const link = buildWhatsAppUniversalShare(formattedInquiry);
      window.open(link, '_blank', 'noopener,noreferrer');
    }
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
        <div className="bg-gradient-to-r from-emerald-800 via-[#128C7E] to-[#25D366] text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-xs flex items-center justify-center shadow-inner text-xl">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  WhatsApp Advisory Gateway
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
                  Direct & Universal Share
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
            <span>1. Direct Field Inquiry</span>
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
            <span>2. Community Broadcasts</span>
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
            <span>4. Quick Share & Offline</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: DIRECT FIELD INQUIRY */}
          {activeTab === 'hotline' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900">
                    Direct Agricultural WhatsApp Messaging
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    Generates a structured inquiry with your district telemetry, agro-ecological zone, and field question to send directly to your local extension officer, agronomist, or any WhatsApp group.
                  </p>
                </div>
              </div>

              {/* Delivery Mode Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Choose WhatsApp Destination:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setDeliveryMode('officer')}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition ${
                      deliveryMode === 'officer'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={deliveryMode === 'officer'}
                        onChange={() => setDeliveryMode('officer')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-bold text-slate-900">My Local Agricultural Officer</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 pl-5">
                      Send to your ward officer, lead farmer, or agronomist's WhatsApp number.
                    </p>
                  </div>

                  <div
                    onClick={() => setDeliveryMode('universal')}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition ${
                      deliveryMode === 'universal'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={deliveryMode === 'universal'}
                        onChange={() => setDeliveryMode('universal')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-bold text-slate-900">Universal Share (Any Contact / Group)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 pl-5">
                      No phone number required. Opens WhatsApp to select any chat, group, or status.
                    </p>
                  </div>
                </div>
              </div>

              {/* Local Extension Officer WhatsApp Input */}
              {deliveryMode === 'officer' && (
                <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Local Extension Officer / Agronomist Contact:</span>
                    </label>
                    {customOfficerNumber && (
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                        Saved on device
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 077 123 4567 or 263771234567"
                      value={customOfficerNumber}
                      onChange={(e) => setCustomOfficerNumber(e.target.value)}
                      onBlur={handleSaveOfficerNumber}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Title: e.g. Ward 12 Extension Officer"
                      value={customOfficerRole}
                      onChange={(e) => setCustomOfficerRole(e.target.value)}
                      onBlur={handleSaveOfficerNumber}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    💡 Tip: Enter the real phone number of your local ward extension officer, seed agronomist, or agro-dealer. It is saved in your browser for instant 1-tap messaging.
                  </p>
                </div>
              )}

              {/* Farmer Name & Topic Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name / Farm ID (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Baba Tinashe / Plot 4"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    onBlur={handleSaveOfficerNumber}
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
                  Field Details or Specific Question:
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
                  className="w-full sm:flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] active:bg-[#1DA851] text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {deliveryMode === 'officer' && customOfficerNumber.trim()
                      ? `Send to Officer on WhatsApp (${customOfficerNumber})`
                      : 'Open & Share in WhatsApp'}
                  </span>
                </button>

                <button
                  onClick={() => handleOpenUniversalShare(formattedInquiry)}
                  className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Share to any WhatsApp group or status"
                >
                  <Share2 className="w-4 h-4 text-slate-600" />
                  <span>Share to Group / Status</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: REGIONAL FARMER BROADCASTS */}
          {activeTab === 'groups' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
                <Users className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900">
                    Regional Agro-Climatic Advisory Networks
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    Broadcast agro-bulletins, Pfumvudza benchmarks, and livestock care notices directly to your real farming groups, cooperatives, or family members.
                  </p>
                </div>
              </div>

              {/* Custom Ward / Cooperative Group Manager */}
              <div className="p-4 rounded-2xl border border-dashed border-emerald-400 bg-emerald-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-emerald-950">
                      My Local Ward / Cooperative WhatsApp Group
                    </span>
                  </div>
                  {savedGroupLink && (
                    <a
                      href={savedGroupLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <span>Open Saved Group</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {!savedGroupLink || showGroupInput ? (
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] text-slate-600">
                      Paste the real invite link for your local ward, church guild, or cooperative WhatsApp group:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="https://chat.whatsapp.com/..."
                        value={tempGroupLink}
                        onChange={(e) => setTempGroupLink(e.target.value)}
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={handleSaveCustomGroupLink}
                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition"
                      >
                        Save
                      </button>
                      {savedGroupLink && (
                        <button
                          onClick={() => setShowGroupInput(false)}
                          className="px-2 py-1.5 text-slate-500 text-xs hover:text-slate-700"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-slate-600 truncate max-w-xs sm:max-w-md">
                      {savedGroupLink}
                    </span>
                    <button
                      onClick={() => setShowGroupInput(true)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 underline ml-2 shrink-0"
                    >
                      Change Link
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-slate-500">
                  ℹ️ This app never provides fake group invite links. Only enter links provided by your local leadership or cooperative.
                </p>
              </div>

              {/* Regional Networks List */}
              <div className="grid grid-cols-1 gap-3">
                {WHATSAPP_COMMUNITY_NETWORKS.map((network) => (
                  <div
                    key={network.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/10 transition shadow-xs flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap justify-between">
                        <h4 className="font-bold text-sm text-slate-900">{network.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {network.memberCount}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{network.description}</p>
                      <div className="text-[11px] text-emerald-800 font-semibold pt-0.5">
                        📍 {network.region}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-700 font-mono whitespace-pre-wrap border border-slate-100">
                      {network.sampleBroadcast}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleOpenUniversalShare(network.sampleBroadcast)}
                        className="flex-1 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Bulletin to WhatsApp</span>
                      </button>

                      <button
                        onClick={() => handleCopy(network.sampleBroadcast, network.id)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                        title="Copy bulletin text"
                      >
                        {copiedSuccess === network.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
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
                    A ready-to-broadcast WhatsApp daily summary formatted with markdown bolding, emojis, and local agronomic benchmarks for forward-sharing to family and farm cooperatives.
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
                {/* SVG Visual Share QR Code */}
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
                    <span className="text-xl">🌾</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Instant WhatsApp Sharing
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tap below to launch WhatsApp universal share directly to any contact or group
                  </p>
                  <button
                    onClick={() => handleOpenUniversalShare(dailyDigest)}
                    className="mt-3 px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 mx-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Launch WhatsApp Share</span>
                  </button>
                </div>
              </div>

              <div className="max-w-md mx-auto text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left">
                💡 <span className="font-bold text-slate-800">Field Advice:</span> Save your local ward extension officer, lead farmer, or seed agronomist's contact in your phone. You can then use this application's one-tap WhatsApp share to forward crop symptoms, rainfall logs, and fertilizer calculations directly without requiring cellular data for heavy web browsing.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Farmers Dictionary Zw WhatsApp Integration</span>
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
