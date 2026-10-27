import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  Printer, 
  Download, 
  Phone, 
  Lock, 
  Scale, 
  CheckCircle2, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import { 
  TERMS_OF_SERVICE_DATA, 
  PRIVACY_POLICY_DATA, 
  USSD_GATEWAY_ARCHITECTURE_DATA, 
  LegalDocument 
} from '../data/transparencyLegalContent';

interface Props {
  isOpen: boolean;
  initialDoc?: 'terms' | 'privacy' | 'ussd';
  onClose: () => void;
}

export const TransparencyDocumentModal: React.FC<Props> = ({ 
  isOpen, 
  initialDoc = 'terms', 
  onClose 
}) => {
  const [selectedDocId, setSelectedDocId] = useState<'terms' | 'privacy' | 'ussd'>(initialDoc);

  React.useEffect(() => {
    if (initialDoc) {
      setSelectedDocId(initialDoc);
    }
  }, [initialDoc]);

  if (!isOpen) return null;

  const currentDoc: LegalDocument = 
    selectedDocId === 'terms' ? TERMS_OF_SERVICE_DATA :
    selectedDocId === 'privacy' ? PRIVACY_POLICY_DATA :
    USSD_GATEWAY_ARCHITECTURE_DATA;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    let fullText = `${currentDoc.title}\n`;
    fullText += `Effective Date: ${currentDoc.effectiveDate} | Version: ${currentDoc.version} | Jurisdiction: ${currentDoc.jurisdiction}\n\n`;
    fullText += '='.repeat(80) + '\n\n';

    currentDoc.sections.forEach((sec, idx) => {
      fullText += `${sec.heading}\n`;
      fullText += '-'.repeat(sec.heading.length) + '\n';
      fullText += `${sec.content}\n\n`;
    });

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `farmers_dictionary_${currentDoc.id}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-950 text-white p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
              {selectedDocId === 'terms' ? <Scale className="w-5 h-5 text-emerald-400" /> :
               selectedDocId === 'privacy' ? <Lock className="w-5 h-5 text-teal-400" /> :
               <Phone className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  Transparency & Technical Governance Documentation
                </h3>
              </div>
              <p className="text-[11px] text-slate-400">
                Farmers Dictionary Zw • Independent Agro-Advisory Network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadText}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              title="Download Document as Text (.txt)"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Navigation Tabs - Clean, No Word Count Badges */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 pt-2 flex items-center gap-2 overflow-x-auto text-xs font-bold shrink-0">
          <button
            onClick={() => setSelectedDocId('terms')}
            className={`px-4 py-2.5 rounded-t-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap border-b-2 ${
              selectedDocId === 'terms'
                ? 'bg-white text-slate-900 border-emerald-600'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setSelectedDocId('privacy')}
            className={`px-4 py-2.5 rounded-t-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap border-b-2 ${
              selectedDocId === 'privacy'
                ? 'bg-white text-slate-900 border-emerald-600'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setSelectedDocId('ussd')}
            className={`px-4 py-2.5 rounded-t-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap border-b-2 ${
              selectedDocId === 'ussd'
                ? 'bg-white text-slate-900 border-emerald-600'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-amber-600" />
            <span>USSD Gateway (*144#) Protocol</span>
          </button>
        </div>

        {/* Document Meta Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between text-xs text-slate-600 shrink-0 gap-2">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              {currentDoc.title}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
            <span>Jurisdiction: {currentDoc.jurisdiction}</span>
            <span>•</span>
            <span>Version: {currentDoc.version}</span>
            <span>•</span>
            <span>Effective Date: {currentDoc.effectiveDate}</span>
          </div>
        </div>

        {/* Scrollable Document Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7 text-slate-800 text-sm leading-relaxed bg-white selection:bg-emerald-100">
          {currentDoc.sections.map((section, idx) => (
            <section key={idx} className="space-y-2 border-b border-slate-100 pb-5 last:border-b-0">
              <h4 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="text-emerald-700 font-mono text-sm">{idx + 1}.</span>
                <span>{section.heading.replace(/^\d+\.\s*/, '')}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed font-normal">
                {section.content}
              </p>
            </section>
          ))}

          {/* Document Certification Footnote */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-xs text-emerald-950 mt-8">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-extrabold text-emerald-900 block">
                Independent Transparency & Non-Affiliation Declaration
              </span>
              <p className="text-[11.5px] text-emerald-800 leading-relaxed">
                Farmers Dictionary Zw is an independent agricultural intelligence and advisory network. All agronomic algorithms, conservation farming formulas, and telecommunication specifications are published for open transparency and education. References to registered agrochemicals, seed varieties, commodity markets, or telecommunications protocols do not constitute endorsement by, nor an official partnership with, any third-party corporate or statutory entity.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 text-[11px]">
            © 2026 Farmers Dictionary Zw • Independent Agro-Advisory Network
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer shadow-sm"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
