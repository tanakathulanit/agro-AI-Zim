import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  CheckCircle, 
  RefreshCw,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { ZimbabweLocation } from '../data/zimbabweLocations';

interface Props {
  currentLocation: ZimbabweLocation;
}

export const AgritexAssistant: React.FC<Props> = ({ currentLocation }) => {
  const [question, setQuestion] = useState<string>('');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Mhoroi / Salibonani! I am your **Hurudza Smart Agro-Advisor**. I specialize in Zimbabwe smallholder agriculture, Pfumvudza conservation practices, Agritex input standards, and pest solutions across Natural Regions I to V. Ask me anything about your farm in ${currentLocation.name}.`,
    },
  ]);
  const [isAsking, setIsAsking] = useState<boolean>(false);

  const sampleQuestions = [
    'When should I apply Ammonium Nitrate top dressing if rainfall is delayed?',
    'Which small grain variety is best for drought resilience in Region IV / V?',
    'How do I treat Fall Armyworm with zero-cost wood ash in Pfumvudza basins?',
    'What are the GMB Grade A delivery requirements for white maize?',
  ];

  const handleAsk = async (queryText?: string) => {
    const q = (queryText || question).trim();
    if (!q || isAsking) return;

    setConversation(prev => [...prev, { role: 'user', text: q }]);
    setQuestion('');
    setIsAsking(true);

    try {
      const response = await fetch('/api/advisory/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          context: {
            location: currentLocation.name,
            district: currentLocation.district,
            naturalRegion: currentLocation.naturalRegion,
            annualRainfall: currentLocation.annualRainfallAvgMm,
            dominantSoil: currentLocation.dominantSoil,
            soilPh: currentLocation.soilPh,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.answer) {
        setConversation(prev => [...prev, { role: 'assistant', text: data.answer }]);
      } else {
        throw new Error(data.error || 'Failed to get answer');
      }
    } catch (err) {
      setConversation(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `**Hurudza Advisory Protocol:** For ${currentLocation.name} (Region ${currentLocation.naturalRegion}), ensure Pfumvudza basins receive minimum 25mm planting rain before sowing. Apply Compound D basal covered by 2cm soil, and scout weekly for Fall Armyworm using Agricura Karate Zeon or wood ash.`,
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[560px]">
      {/* Header */}
      <div className="p-4 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Hurudza Agritex Advisor</h4>
            <span className="text-[10px] text-emerald-300">
              Context: {currentLocation.name} • Natural Region {currentLocation.naturalRegion}
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-800/80 text-emerald-200 px-2.5 py-1 rounded-full font-semibold">
          AI Agronomist Active
        </span>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-emerald-700" />
          Quick Ask:
        </span>
        {sampleQuestions.map((sq, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(sq)}
            className="shrink-0 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg px-2.5 py-1 text-slate-700 font-medium transition truncate max-w-xs"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40 text-xs">
        {conversation.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-700 text-white rounded-br-none shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm whitespace-pre-line'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isAsking && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 text-slate-500 rounded-bl-none flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Consulting Agritex & Met Services agronomy database...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder={`Ask about Pfumvudza, inputs, pests, or market selling in ${currentLocation.district}...`}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={() => handleAsk()}
          disabled={!question.trim() || isAsking}
          className={`p-2.5 rounded-xl font-bold transition flex items-center justify-center ${
            !question.trim() || isAsking
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
