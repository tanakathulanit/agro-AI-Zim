import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  Database, 
  UploadCloud, 
  HardDrive 
} from 'lucide-react';
import { getOfflineOutbox, clearSyncedOutboxItems, OfflineQueueItem } from '../utils/offlineStorage';

interface Props {
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  onSyncComplete?: () => void;
}

export const OfflineManagerBanner: React.FC<Props> = ({
  isSimulatedOffline,
  onToggleSimulatedOffline,
  onSyncComplete,
}) => {
  const [actualOnline, setActualOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [outboxItems, setOutboxItems] = useState<OfflineQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setActualOnline(true);
    const handleOffline = () => setActualOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load of outbox
    setOutboxItems(getOfflineOutbox());

    // Polling outbox every 3s
    const pollInterval = setInterval(() => {
      setOutboxItems(getOfflineOutbox());
    }, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(pollInterval);
    };
  }, []);

  const isEffectivelyOffline = isSimulatedOffline || !actualOnline;

  const handleTriggerSync = () => {
    if (isEffectivelyOffline) {
      setSyncFeedback('Cannot sync while offline. Restore connectivity to transmit outbox queue.');
      setTimeout(() => setSyncFeedback(null), 4000);
      return;
    }

    setIsSyncing(true);
    setTimeout(() => {
      clearSyncedOutboxItems();
      setOutboxItems([]);
      setIsSyncing(false);
      setSyncFeedback('All offline diagnostic scans & community posts synchronized successfully with cloud server!');
      if (onSyncComplete) onSyncComplete();
      setTimeout(() => setSyncFeedback(null), 5000);
    }, 1200);
  };

  return (
    <div className={`transition-all duration-300 border-b text-xs ${
      isEffectivelyOffline
        ? 'bg-amber-950 text-amber-100 border-amber-900 py-2.5 px-4'
        : 'bg-emerald-950/60 text-slate-200 border-emerald-900/60 py-2 px-4'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Status indicator */}
        <div className="flex items-center gap-2.5">
          {isEffectivelyOffline ? (
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0">
              <WifiOff className="w-3.5 h-3.5 animate-pulse" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <Wifi className="w-3.5 h-3.5" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-xs">
                {isEffectivelyOffline 
                  ? 'OFFLINE MODE ACTIVE' 
                  : 'ONLINE & CLOUD CONNECTED'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                isEffectivelyOffline 
                  ? 'bg-amber-400 text-amber-950' 
                  : 'bg-emerald-500/30 text-emerald-300'
              }`}>
                {isEffectivelyOffline ? 'Pre-Downloaded Database' : 'Live Sync'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {isEffectivelyOffline
                ? 'All diagnostic tools, historical weather, soil profiles, and cached market prices are available offline.'
                : 'Real-time telemetry and cloud sync active. Ready for field use.'}
            </p>
          </div>
        </div>

        {/* Action Controls & Queue Info */}
        <div className="flex items-center gap-2.5 text-xs">
          {outboxItems.length > 0 && (
            <span className="bg-amber-500/30 border border-amber-400/40 text-amber-200 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              {outboxItems.length} Pending Outbox
            </span>
          )}

          {/* Sync Button */}
          {outboxItems.length > 0 && !isEffectivelyOffline && (
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync Outbox Now
            </button>
          )}

          {/* Simulated Offline Toggle */}
          <button
            onClick={onToggleSimulatedOffline}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition flex items-center gap-1.5 ${
              isSimulatedOffline
                ? 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400'
                : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/20'
            }`}
          >
            {isSimulatedOffline ? (
              <>
                <Wifi className="w-3 h-3" /> Restore Online
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" /> Simulate Offline
              </>
            )}
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-white/10 text-[11px] text-emerald-300 flex items-center gap-1.5 animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{syncFeedback}</span>
        </div>
      )}
    </div>
  );
};
