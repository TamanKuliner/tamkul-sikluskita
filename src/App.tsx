/**
 * SiklusKita - Intelligent Waste & Resource Infrastructure Platform (FULL VER)
 * Fahira Shanin Nadifa - Greeneration Circle 2026 - DKI Jakarta
 * Task 2 Innovation Program Challenge: Designing Local Solutions
 */

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { InfrastructureView } from "./components/InfrastructureView";
import { WasteScannerView } from "./components/WasteScannerView";
import { MonitoringView } from "./components/MonitoringView";
import { AlertsView } from "./components/AlertsView";
import { CalendarView } from "./components/CalendarView";
import { SecurityView } from "./components/SecurityView";
import { SyncView } from "./components/SyncView";
import { IntegrationsView } from "./components/IntegrationsView";
import { AwardingView } from "./components/AwardingView";
import { LearningByDoingView } from "./components/LearningByDoingView";

import {
  NavTab,
  WasteLogEntry,
  SmartAlert,
  ScheduleEvent,
  ConnectedDevice,
} from "./types";
import {
  INITIAL_WASTE_LOGS,
  INITIAL_ALERTS,
  INITIAL_SCHEDULE_EVENTS,
  SAMPLE_DEVICES,
} from "./data/mockData";
import { syncManager } from "./utils/syncManager";
import { Leaf, ShieldCheck, Cpu, RefreshCw } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("infrastructure");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("siklukita_theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [userPoints, setUserPoints] = useState<number>(380);
  const [userStreak, setUserStreak] = useState<number>(14);

  const [wasteLogs, setWasteLogs] = useState<WasteLogEntry[]>(INITIAL_WASTE_LOGS);
  const [alerts, setAlerts] = useState<SmartAlert[]>(INITIAL_ALERTS);
  const [events, setEvents] = useState<ScheduleEvent[]>(INITIAL_SCHEDULE_EVENTS);
  const [devices, setDevices] = useState<ConnectedDevice[]>(SAMPLE_DEVICES);
  const [offlineQueue, setOfflineQueue] = useState<WasteLogEntry[]>(() =>
    syncManager.getOfflineQueue()
  );
  const [isRefreshingAlerts, setIsRefreshingAlerts] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync theme to DOM html class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("siklukita_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("siklukita_theme", "light");
    }
  }, [isDarkMode]);

  // Sync Manager lifecycle & offline events
  useEffect(() => {
    const unsubscribe = syncManager.subscribe((event) => {
      if (event.type === "WASTE_LOG_ADDED") {
        setWasteLogs((prev) => [event.payload, ...prev]);
      } else if (event.type === "SCHEDULE_EVENT_ADDED") {
        setEvents((prev) => [event.payload, ...prev]);
      } else if (event.type === "QUEUE_UPDATED" || event.type === "QUEUE_CLEARED") {
        setOfflineQueue(syncManager.getOfflineQueue());
      }
    });

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleAddWasteLog = (log: WasteLogEntry) => {
    setWasteLogs((prev) => [log, ...prev]);
    setUserPoints((prev) => prev + log.points);
    if (isOffline) {
      syncManager.addToOfflineQueue(log);
      setOfflineQueue(syncManager.getOfflineQueue());
    } else {
      syncManager.broadcast("WASTE_LOG_ADDED", log);
    }
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleRefreshAlerts = async () => {
    setIsRefreshingAlerts(true);
    try {
      const res = await fetch("/api/ai/proactive-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tps3rSaturation: 84,
          pendingPickups: 11,
          region: "Jakarta Selatan (Cilandak/Pondok Labu)",
        }),
      });
      const data = await res.json();
      if (data.alerts && Array.isArray(data.alerts)) {
        setAlerts(data.alerts);
      }
    } catch (err) {
      console.error("Alerts refresh error:", err);
    } finally {
      setIsRefreshingAlerts(false);
    }
  };

  const handleDispatchAlert = (newAlert: SmartAlert) => {
    setAlerts((prev) => {
      if (prev.some((a) => a.id === newAlert.id || a.title === newAlert.title)) {
        return prev;
      }
      return [newAlert, ...prev];
    });
  };

  const handleAddEvent = (event: ScheduleEvent) => {
    setEvents((prev) => [event, ...prev]);
    syncManager.broadcast("SCHEDULE_EVENT_ADDED", event);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncManager.syncWithServer(isOffline);
      setOfflineQueue(syncManager.getOfflineQueue());
    } catch (err) {
      console.error("Manual sync failed:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearOfflineQueue = () => {
    syncManager.clearOfflineQueue();
    setOfflineQueue([]);
  };

  const handleAddDummyOfflineItem = () => {
    const dummy: WasteLogEntry = {
      id: `LOG-OFFLINE-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      itemName: "Kardus Paket Belanja Online (Kraft)",
      category: "Kertas / Karton",
      weightKg: 2.1,
      points: 25,
      co2eKg: 0.85,
      facility: "Bank Sampah Melati (RW 04)",
      householdId: "HH-CLD-0402",
      synced: false,
      encryptedHash: "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
    };
    syncManager.addToOfflineQueue(dummy);
    setOfflineQueue(syncManager.getOfflineQueue());
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      {/* Primary Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isOffline={isOffline}
        pendingOfflineCount={offlineQueue.length}
        unreadAlertsCount={alerts.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "infrastructure" && (
          <InfrastructureView isDarkMode={isDarkMode} />
        )}

        {activeTab === "scanner" && (
          <WasteScannerView
            isDarkMode={isDarkMode}
            onAddWasteLog={handleAddWasteLog}
            userPoints={userPoints}
            userStreak={userStreak}
          />
        )}

        {activeTab === "monitoring" && (
          <MonitoringView
            isDarkMode={isDarkMode}
            wasteLogs={wasteLogs}
            onAddWasteLog={handleAddWasteLog}
          />
        )}

        {activeTab === "alerts" && (
          <AlertsView
            isDarkMode={isDarkMode}
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onRefreshAlerts={handleRefreshAlerts}
            isRefreshing={isRefreshingAlerts}
            wasteLogs={wasteLogs}
            onAddWasteLog={handleAddWasteLog}
            onDispatchAlert={handleDispatchAlert}
          />
        )}

        {activeTab === "calendar" && (
          <CalendarView
            isDarkMode={isDarkMode}
            events={events}
            onAddEvent={handleAddEvent}
          />
        )}

        {activeTab === "security" && (
          <SecurityView isDarkMode={isDarkMode} />
        )}

        {activeTab === "sync" && (
          <SyncView
            isDarkMode={isDarkMode}
            devices={devices}
            isOfflineSimulated={isOffline}
            setIsOfflineSimulated={setIsOffline}
            pendingOfflineCount={offlineQueue.length}
            offlineQueue={offlineQueue}
            onManualSync={handleManualSync}
            isSyncing={isSyncing}
            onClearOfflineQueue={handleClearOfflineQueue}
            onAddDummyOfflineItem={handleAddDummyOfflineItem}
          />
        )}

        {activeTab === "integrations" && (
          <IntegrationsView isDarkMode={isDarkMode} />
        )}

        {activeTab === "awarding" && (
          <AwardingView
            isDarkMode={isDarkMode}
            onAddEventToCalendar={handleAddEvent}
          />
        )}

        {activeTab === "tutorials" && (
          <LearningByDoingView
            isDarkMode={isDarkMode}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Platform Professional Footer */}
      <footer className={`border-t py-6 px-4 sm:px-8 text-xs transition-colors ${
        isDarkMode
          ? "border-slate-800/80 bg-slate-900/60 text-slate-400"
          : "border-slate-200/80 bg-white/80 text-slate-500"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                SiklusKita Platform
              </span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Fahira Shanin Nadifa &amp; Tim
              </span>
              <span>•</span>
              <span>Greeneration Circle 2026</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Task 2 Innovation Program Challenge: Designing Local Solutions — DKI Jakarta Municipal Circular Infrastructure
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-purple-500" />
              <span>Cloud Auto-Scale SLA: 99.98%</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>AES-GCM-256 E2EE</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
