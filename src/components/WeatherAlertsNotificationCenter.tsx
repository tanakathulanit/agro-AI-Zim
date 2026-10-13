import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  CloudRain, 
  Sun, 
  Volume2, 
  VolumeX, 
  Radio, 
  Send, 
  Sparkles, 
  Flame, 
  Snowflake, 
  Wind,
  Check,
  ChevronRight,
  X
} from 'lucide-react';
import { 
  WeatherNotificationAlert, 
  evaluateWeatherHazards, 
  sendNativePushNotification, 
  playAlertChime, 
  SIMULATED_EXTREME_SCENARIOS, 
  AlertSeverity 
} from '../utils/extremeWeatherAlerts';
import { WeatherStation } from '../data/weatherStations';
import { ZimbabweLocation } from '../data/zimbabweLocations';

interface Props {
  closestStation: WeatherStation;
  currentLocation: ZimbabweLocation;
  distanceKm: number;
}

export const WeatherAlertsNotificationCenter: React.FC<Props> = ({
  closestStation,
  currentLocation,
  distanceKm,
}) => {
  const [alerts, setAlerts] = useState<WeatherNotificationAlert[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [selectedAlert, setSelectedAlert] = useState<WeatherNotificationAlert | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Evaluate hazards whenever closest station or location changes
  useEffect(() => {
    const computedAlerts = evaluateWeatherHazards(closestStation, currentLocation, distanceKm);
    setAlerts(computedAlerts);
  }, [closestStation, currentLocation, distanceKm]);

  // Request browser push notification permission
  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      setToastMessage('Browser push notifications are not supported by this browser.');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setToastMessage('Push notifications enabled! You will receive urgent weather alerts.');
        // Send a test welcome push notification
        new Notification('Hurudza Weather Alerts Activated', {
          body: `Subscribed to micro-climate emergency alerts from ${closestStation.name} (${distanceKm}km away).`,
          icon: '/icon.svg',
        });
      } else if (permission === 'denied') {
        setToastMessage('Notification permission denied in browser settings.');
      }
    } catch (err) {
      console.warn('Permission request error:', err);
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Trigger a simulated extreme weather alert
  const triggerSimulation = async (scenarioKey: 'hail_storm' | 'heatwave_drought' | 'winter_frost') => {
    const scenario = SIMULATED_EXTREME_SCENARIOS[scenarioKey];
    const newAlert: WeatherNotificationAlert = {
      ...scenario,
      id: `sim-${scenarioKey}-${Date.now()}`,
      timestamp: `Simulated at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      isRead: false,
    };

    // Prepend to alerts list
    setAlerts(prev => [newAlert, ...prev]);
    setSelectedAlert(newAlert);
    setIsPanelOpen(true);

    // Play chime sound if not muted
    if (!isAudioMuted) {
      playAlertChime(newAlert.severity);
    }

    // Attempt native push notification
    const pushSent = await sendNativePushNotification(newAlert);
    setToastMessage(
      pushSent 
        ? `Native push alert dispatched for ${newAlert.title}` 
        : `Extreme weather alert triggered: ${newAlert.title}`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter(a => a.severity === 'WARNING').length;
  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <>
      {/* Header Notification Center Trigger Button */}
      <div className="relative inline-block">
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className={`relative p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
            criticalCount > 0
              ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500 animate-pulse shadow-sm'
              : warningCount > 0
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
          title="Weather Emergency Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">
            {criticalCount > 0 ? 'Extreme Weather Alert' : 'Weather Alerts'}
          </span>
          {unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-rose-700 text-[10px] font-black flex items-center justify-center shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Slide-over / Modal Notification Drawer */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/50 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    Extreme Weather Push Notification Hub
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Telemetry: {closestStation.name} ({distanceKm} km from farm)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  title={isAudioMuted ? 'Unmute alert sirens' : 'Mute alert sirens'}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                >
                  {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-bold"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Push Permission Action Bar */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                <span className="font-semibold text-slate-700">Push Status:</span>
                <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                  notificationPermission === 'granted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : notificationPermission === 'denied'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                }`}>
                  {notificationPermission === 'granted' ? 'Native Notifications Active' : 'Permission Required'}
                </span>
              </div>

              {notificationPermission !== 'granted' && (
                <button
                  onClick={requestPushPermission}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1"
                >
                  <Bell className="w-3 h-3" /> Enable Browser Push
                </button>
              )}
            </div>

            {/* Test Simulation Buttons Bar */}
            <div className="p-3 bg-amber-50/60 border-b border-amber-200 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-amber-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Simulate Extreme Weather Scenarios:
                </span>
                <span className="text-[10px] text-amber-800 font-semibold">Instant Telemetry Test</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => triggerSimulation('hail_storm')}
                  className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-rose-300 text-rose-900 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <CloudRain className="w-3 h-3 text-rose-600" /> Severe Hailstorm (65mm)
                </button>
                <button
                  onClick={() => triggerSimulation('heatwave_drought')}
                  className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <Flame className="w-3 h-3 text-amber-600" /> 40.5°C Heatwave
                </button>
                <button
                  onClick={() => triggerSimulation('winter_frost')}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-blue-300 text-blue-900 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <Snowflake className="w-3 h-3 text-blue-600" /> Black Frost (-1.5°C)
                </button>
              </div>
            </div>

            {/* Alerts Feed Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100/50">
              {alerts.map((alert) => {
                const isSelected = selectedAlert?.id === alert.id;
                const isCritical = alert.severity === 'CRITICAL';
                const isWarning = alert.severity === 'WARNING';

                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-white shadow-md'
                        : isCritical
                          ? 'border-rose-400 bg-rose-50/70 hover:bg-rose-50'
                          : isWarning
                            ? 'border-amber-400 bg-amber-50/70 hover:bg-amber-50'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        isCritical
                          ? 'bg-rose-600 text-white'
                          : isWarning
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-emerald-100 text-emerald-800 font-bold'
                      }`}>
                        {alert.severity} HAZARD
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {alert.timestamp}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                      {alert.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {alert.summary}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-2 border-t border-slate-200/80">
                      <span className="font-mono text-slate-500">
                        Trigger: <strong className="text-slate-800">{alert.triggerMetric}</strong>
                      </span>
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                        View Protection Checklist <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Detailed Expanded Checklist if selected */}
                    {isSelected && (
                      <div className="mt-4 pt-3 border-t border-slate-200 space-y-3 animate-in fade-in text-xs">
                        {/* Shona / Ndebele Translation Box */}
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 space-y-1.5">
                          <div>
                            <span className="font-bold text-amber-950 text-[11px] block">
                              Chiziviso cheMamiriro ekunze (Shona):
                            </span>
                            <p className="text-amber-900 text-[11px] italic">
                              "{alert.shonaAlertSummary}"
                            </p>
                          </div>
                          <div>
                            <span className="font-bold text-amber-950 text-[11px] block">
                              Isixwayiso Somkhathi (Ndebele):
                            </span>
                            <p className="text-amber-900 text-[11px] italic">
                              "{alert.ndebeleAlertSummary}"
                            </p>
                          </div>
                        </div>

                        {/* Action Checklist */}
                        <div>
                          <span className="font-bold text-slate-800 block mb-1.5 uppercase tracking-wider text-[11px]">
                            Immediate Smallholder Farm Action Checklist:
                          </span>
                          <ul className="space-y-1.5">
                            {alert.actionableFarmChecklist.map((task, idx) => (
                              <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                                <span className="text-slate-800">{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Weather alerts continuously synced via local AWS telemetry.
              </span>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
              >
                Close Alerts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transient Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};
