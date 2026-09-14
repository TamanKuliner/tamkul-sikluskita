/**
 * SiklusKita Navigation Bar
 * Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 */

import React from "react";
import {
  Cpu,
  ScanLine,
  Activity,
  Bell,
  Calendar,
  ShieldCheck,
  RefreshCw,
  BarChart3,
  Globe2,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Sparkles,
  Trophy,
  GraduationCap,
} from "lucide-react";
import { NavTab } from "../types";

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isOfflineSimulated: boolean;
  setIsOfflineSimulated: (offline: boolean) => void;
  unreadAlertsCount: number;
  isSyncing: boolean;
  onManualSync: () => void;
  pendingOfflineCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  isOfflineSimulated,
  setIsOfflineSimulated,
  unreadAlertsCount,
  isSyncing,
  onManualSync,
  pendingOfflineCount,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "infrastructure", label: "Infrastruktur AI", icon: <Cpu className="w-4 h-4" />, badge: "Auto-Scale" },
    { id: "scanner", label: "AI Scanner", icon: <ScanLine className="w-4 h-4" />, badge: "Vision" },
    { id: "monitoring", label: "Monitoring", icon: <Activity className="w-4 h-4" /> },
    {
      id: "alerts",
      label: "Peringatan Dini",
      icon: <Bell className="w-4 h-4" />,
      badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : undefined,
    },
    { id: "calendar", label: "Kalender", icon: <Calendar className="w-4 h-4" /> },
    { id: "security", label: "Keamanan E2EE", icon: <ShieldCheck className="w-4 h-4" />, badge: "AES-256" },
    {
      id: "sync",
      label: "Sinkronisasi",
      icon: <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />,
      badge: pendingOfflineCount > 0 ? `${pendingOfflineCount} antrean` : "Live",
    },
    { id: "analytics", label: "Analitik", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "integrations", label: "Integrasi API", icon: <Globe2 className="w-4 h-4" /> },
    { id: "awarding", label: "Awarding 2026", icon: <Trophy className="w-4 h-4 text-amber-500" />, badge: "🏆 12 Des" },
    {
      id: "tutorials",
      label: "10 Tutorial",
      icon: <GraduationCap className="w-4 h-4 text-emerald-500" />,
      badge: "Hands-on",
    },
  ];

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-200 ${
      isDarkMode
        ? "bg-slate-900/90 border-slate-800 text-slate-100"
        : "bg-white/95 border-emerald-100 text-slate-800"
    }`}>
      {/* Top micro-bar for initiative context */}
      <div className={`px-4 py-1 text-xs border-b flex items-center justify-between transition-colors ${
        isDarkMode
          ? "bg-slate-950/60 border-slate-800/60 text-slate-400"
          : "bg-emerald-50/80 border-emerald-100/60 text-emerald-800"
      }`}>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Greeneration Circle 2026
          </span>
          <span className="hidden sm:inline font-medium text-[11px]">
            DKI Jakarta • Task 2 Innovation Program: Designing Local Solutions
          </span>
          <span className="hidden md:inline text-slate-400 dark:text-slate-500">|</span>
          <span className="font-semibold text-[11px] whitespace-nowrap">Fahira Shanin Nadifa &amp; Tim</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Offline Simulator Switch */}
          <button
            id="toggle-offline-mode-btn"
            onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
            title="Klik untuk simulasi mode offline tanpa koneksi internet"
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              isOfflineSimulated
                ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
            }`}
          >
            {isOfflineSimulated ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-500 animate-pulse" />
                <span>Mode Offline Aktif</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-emerald-500" />
                <span>Online (Cloud Connected)</span>
              </>
            )}
          </button>

          {/* Quick sync action */}
          <button
            id="quick-sync-btn"
            onClick={onManualSync}
            disabled={isSyncing || isOfflineSimulated}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition ${
              isOfflineSimulated
                ? "opacity-50 cursor-not-allowed"
                : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin text-emerald-500" : ""}`} />
            <span className="hidden lg:inline">{isSyncing ? "Menyinkronkan..." : "Sinkron"}</span>
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
                  SiklusKita
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase tracking-wider">
                  Full Ver
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Infrastruktur Cerdas Alokasi Sumber Daya & Ekonomi Sirkular
              </p>
            </div>
          </div>

          {/* Quick Global Actions */}
          <div className="flex items-center gap-2">
            {/* E2EE indicator badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px]">E2EE Aktif</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
              className={`p-2 rounded-xl border transition-all ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? isDarkMode
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                    : isDarkMode
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                      isActive
                        ? isDarkMode
                          ? "bg-emerald-400/30 text-emerald-200"
                          : "bg-emerald-800 text-emerald-100"
                        : item.id === "alerts" && unreadAlertsCount > 0
                        ? "bg-rose-500 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
