import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  X, 
  Send, 
  RotateCcw, 
  Signal, 
  BatteryMedium, 
  Smartphone, 
  MessageSquare,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const UssdTerminalSimulator: React.FC<Props> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'ussd' | 'sms'>('ussd');
  
  // USSD state
  const [ussdInput, setUssdInput] = useState<string>('*144#');
  const [screenText, setScreenText] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>(() => `sess_${Date.now()}`);
  const [historyText, setHistoryText] = useState<string>('');
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // SMS state
  const [smsQuery, setSmsQuery] = useState<string>('PFUMVUDZA 2');
  const [smsConversation, setSmsConversation] = useState<Array<{ sender: 'user' | 'gateway'; text: string; time: string }>>([
    {
      sender: 'gateway',
      text: 'FARMERS DICTIONARY ZW 2G SMS SERVICE: Reply PFUMVUDZA <plots>, PRICE <crop>, or ALERT for instant agro-alerts on any feature phone.',
      time: '08:00 AM'
    }
  ]);

  // Handle dialing initial USSD code or submitting submenu choice
  const handleUssdSubmit = async (customVal?: string) => {
    const inputVal = (customVal !== undefined ? customVal : ussdInput).trim();
    if (!inputVal) return;

    setIsLoading(true);
    try {
      let nextHistory = historyText;
      if (!isSessionActive) {
        // Dialing root
        nextHistory = '';
        const newSess = `ussd_${Date.now()}`;
        setSessionId(newSess);
      } else {
        nextHistory = historyText ? `${historyText}*${inputVal}` : inputVal;
      }

      const res = await fetch('/api/ussd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          serviceCode: '*144#',
          phoneNumber: '+263772123456',
          text: nextHistory
        })
      });

      const data = await res.json();
      if (data.success) {
        setScreenText(data.message);
        setHistoryText(nextHistory);
        if (data.type === 'END') {
          setIsSessionActive(false);
          setUssdInput('*144#');
        } else {
          setIsSessionActive(true);
          setUssdInput('');
        }
      } else {
        setScreenText(data.message || 'Connection timeout. Dial *144# again.');
        setIsSessionActive(false);
      }
    } catch {
      setScreenText('Network Error: Could not reach 2G USSD Gateway. Please check server.');
      setIsSessionActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    setIsSessionActive(false);
    setHistoryText('');
    setUssdInput('*144#');
    setScreenText('Econet / NetOne 2G Gateway Ready.\nEnter *144# and press SEND to dial.');
  };

  useEffect(() => {
    if (isOpen && !screenText) {
      handleResetSession();
    }
  }, [isOpen]);

  const handleSmsSend = async () => {
    const q = smsQuery.trim();
    if (!q) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSmsConversation(prev => [...prev, userMsg]);
    setSmsQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: '+263772987654',
          message: q
        })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setSmsConversation(prev => [
          ...prev,
          {
            sender: 'gateway',
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch {
      setSmsConversation(prev => [
        ...prev,
        {
          sender: 'gateway',
          text: 'SMS Gateway Error: Service temporarily unreachable.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                <span>Econet / NetOne 2G Gateway</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  *144# USSD
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Offline-first connectivity for rural 'mbudzi' phones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-slate-950 px-4 pt-2 border-b border-slate-800 text-xs font-bold">
          <button
            onClick={() => setMode('ussd')}
            className={`flex-1 py-2 text-center border-b-2 cursor-pointer transition ${
              mode === 'ussd'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            USSD Session (*144#)
          </button>
          <button
            onClick={() => setMode('sms')}
            className={`flex-1 py-2 text-center border-b-2 cursor-pointer transition ${
              mode === 'sms'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            2-Way SMS Gateway
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 flex-1 flex flex-col items-center">
          {mode === 'ussd' ? (
            /* Retro 2G Feature Phone Simulator */
            <div className="w-full max-w-[320px] bg-slate-950 border-4 border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col space-y-3">
              {/* Phone Status Bar */}
              <div className="flex items-center justify-between text-[10px] text-emerald-500/80 font-mono px-1">
                <span className="flex items-center gap-1">
                  <Signal className="w-3 h-3" />
                  <span>ECONET 2G</span>
                </span>
                <span>08:45 AM</span>
                <span className="flex items-center gap-1">
                  <BatteryMedium className="w-3 h-3" />
                  <span>85%</span>
                </span>
              </div>

              {/* Monochrome LCD Screen */}
              <div className="bg-[#8fae85] text-slate-950 font-mono rounded-xl p-3 text-xs min-h-[160px] max-h-[220px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner border border-[#7d9b74]">
                {screenText}
              </div>

              {/* Quick Input Bar */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={ussdInput}
                    onChange={(e) => setUssdInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUssdSubmit()}
                    placeholder={isSessionActive ? "Enter choice (1, 2, 3...)" : "*144#"}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => handleUssdSubmit()}
                    disabled={isLoading}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                  <button
                    onClick={handleResetSession}
                    title="Reset Call"
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Keypad Shortcuts */}
                {isSessionActive && (
                  <div className="grid grid-cols-4 gap-1.5 pt-1 text-[11px] font-mono font-bold">
                    {['1', '2', '3', '4'].map(num => (
                      <button
                        key={num}
                        onClick={() => handleUssdSubmit(num)}
                        className="py-1.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg transition cursor-pointer"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* SMS Gateway Chat View */
            <div className="w-full space-y-3">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 h-64 overflow-y-auto space-y-2.5 text-xs">
                {smsConversation.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-2.5 leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-0.5 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Sample SMS Quick Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
                <span className="text-slate-500 shrink-0 font-bold">Templates:</span>
                {['PFUMVUDZA 2', 'PRICE MAIZE', 'PRICE SOYA', 'ALERT ARMYWORM'].map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSmsQuery(t)}
                    className="shrink-0 bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2 py-1 rounded-md transition cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* SMS Input */}
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={smsQuery}
                  onChange={(e) => setSmsQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSmsSend()}
                  placeholder="Type SMS (e.g. PFUMVUDZA 2 or PRICE MAIZE)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  onClick={handleSmsSend}
                  disabled={isLoading}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 text-[10.5px] text-slate-400 flex items-center justify-between">
          <span>📡 Compatible with Africa's Talking & Econet USSD API</span>
          <span className="text-emerald-400 font-bold">2G / 3G / 4G Omnichannel</span>
        </div>
      </div>
    </div>
  );
};
