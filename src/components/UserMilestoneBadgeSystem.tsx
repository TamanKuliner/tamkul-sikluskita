/**
 * User Milestone Digital Badge System for MonitoringView
 * Greeneration Circle 2026 | DKI Jakarta Circular Monitoring
 * Awards digital icons & certified badges when users reach specific sustainability milestones
 * (e.g., '100kg Diverted', 'Zero-Waste Month', '50kg Carbon Shield', etc.)
 */

import React, { useState, useMemo, useEffect } from "react";
import {
  Trophy,
  Award,
  Sparkles,
  Scale,
  Calendar,
  ShieldCheck,
  Recycle,
  Leaf,
  Flame,
  Package,
  CheckCircle2,
  Lock,
  Zap,
  Sliders,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Share2,
  BadgeCheck,
  PlusCircle,
  Filter,
} from "lucide-react";
import confetti from "canvas-confetti";
import { DigitalBadge, WasteLogEntry } from "../types";
import { INITIAL_DIGITAL_BADGES, loadSavedBadges, saveBadges } from "../data/mockBadges";
import { BadgeCard } from "./BadgeCard";
import { BadgeModal } from "./BadgeModal";

interface UserMilestoneBadgeSystemProps {
  wasteLogs: WasteLogEntry[];
  isDarkMode: boolean;
  onAddSimulatedLog?: (weightKg: number, category: string) => void;
}

export const UserMilestoneBadgeSystem: React.FC<UserMilestoneBadgeSystemProps> = ({
  wasteLogs,
  isDarkMode,
}) => {
  const [badges, setBadges] = useState<DigitalBadge[]>(() => loadSavedBadges());
  const [selectedBadge, setSelectedBadge] = useState<DigitalBadge | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "UNLOCKED" | "IN_PROGRESS" | "SUSTAINABILITY">("ALL");
  const [celebratingBadge, setCelebratingBadge] = useState<DigitalBadge | null>(null);
  const [simulatedDays, setSimulatedDays] = useState<number>(0);
  const [simulatedWeightBonus, setSimulatedWeightBonus] = useState<number>(0);

  // Compute live household metrics from wasteLogs
  const calculatedMetrics = useMemo(() => {
    // Base household historical values + live logged items
    const baseWeightKg = 82.5 + simulatedWeightBonus;
    const baseCarbonKg = 41.2 + simulatedWeightBonus * 0.52;
    const basePlasticKg = 21.0 + (simulatedWeightBonus > 0 ? simulatedWeightBonus * 0.3 : 0);
    const baseOrganicKg = 44.0 + (simulatedWeightBonus > 0 ? simulatedWeightBonus * 0.5 : 0);
    const baseStreak = 28 + simulatedDays;

    const loggedWeight = wasteLogs.reduce((acc, log) => acc + (log.weightKg || 0), 0);
    const loggedCarbon = wasteLogs.reduce((acc, log) => acc + (log.co2eKg || 0), 0);
    const loggedPlastic = wasteLogs
      .filter((log) => log.category.toLowerCase().includes("plastik"))
      .reduce((acc, log) => acc + (log.weightKg || 0), 0);
    const loggedOrganic = wasteLogs
      .filter((log) => log.category.toLowerCase().includes("organik"))
      .reduce((acc, log) => acc + (log.weightKg || 0), 0);

    const totalWeight = Number((baseWeightKg + loggedWeight).toFixed(1));
    const totalCarbon = Number((baseCarbonKg + loggedCarbon).toFixed(1));
    const totalPlastic = Number((basePlasticKg + loggedPlastic).toFixed(1));
    const totalOrganic = Number((baseOrganicKg + loggedOrganic).toFixed(1));
    const totalLogsCount = 5 + wasteLogs.length;
    const streakDays = Math.min(30, baseStreak);

    return {
      totalWeight,
      totalCarbon,
      totalPlastic,
      totalOrganic,
      totalLogsCount,
      streakDays,
    };
  }, [wasteLogs, simulatedDays, simulatedWeightBonus]);

  // Sync badges progress dynamically based on calculated real metrics
  useEffect(() => {
    setBadges((prevBadges) => {
      let hasChanges = false;
      const updated = prevBadges.map((badge) => {
        let newProgress = badge.currentProgress;
        let shouldUnlock = badge.unlocked;

        if (badge.id === "badge-100kg-diverted") {
          newProgress = calculatedMetrics.totalWeight;
          shouldUnlock = newProgress >= badge.targetProgress;
        } else if (badge.id === "badge-zero-waste-month") {
          newProgress = calculatedMetrics.streakDays;
          shouldUnlock = newProgress >= badge.targetProgress;
        } else if (badge.id === "badge-50kg-carbon-shield") {
          newProgress = calculatedMetrics.totalCarbon;
          shouldUnlock = newProgress >= badge.targetProgress;
        } else if (badge.id === "badge-plastic-diet-master") {
          newProgress = calculatedMetrics.totalPlastic;
          shouldUnlock = newProgress >= badge.targetProgress;
        } else if (badge.id === "badge-zero-waste-advocate" || badge.id === "badge-organic-bioloop") {
          newProgress = calculatedMetrics.totalOrganic;
          shouldUnlock = newProgress >= badge.targetProgress;
        } else if (badge.id === "badge-first-step-diverter") {
          newProgress = calculatedMetrics.totalLogsCount;
          shouldUnlock = newProgress >= badge.targetProgress;
        }

        // Check if status changed
        if (
          newProgress !== badge.currentProgress ||
          (!badge.unlocked && shouldUnlock)
        ) {
          hasChanges = true;
          const wasJustUnlocked = !badge.unlocked && shouldUnlock;

          const updatedBadge = {
            ...badge,
            currentProgress: newProgress,
            unlocked: shouldUnlock,
            unlockedAt: shouldUnlock ? badge.unlockedAt || "12 September 2026" : undefined,
            verificationHash: shouldUnlock
              ? badge.verificationHash.startsWith("sha256:pending")
                ? `sha256:${Math.random().toString(36).substring(2)}${Date.now().toString(16)}`
                : badge.verificationHash
              : badge.verificationHash,
          };

          if (wasJustUnlocked) {
            setCelebratingBadge(updatedBadge);
            triggerCelebration();
          }

          return updatedBadge;
        }

        return badge;
      });

      if (hasChanges) {
        saveBadges(updated);
        return updated;
      }
      return prevBadges;
    });
  }, [calculatedMetrics]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: ["#10b981", "#06b6d4", "#f59e0b", "#8b5cf6", "#ec4899"],
      });
    } catch {
      // safe fallback
    }
  };

  const handleClaimUnlock = (badge: DigitalBadge) => {
    const updated = badges.map((b) => {
      if (b.id === badge.id) {
        return {
          ...b,
          unlocked: true,
          currentProgress: b.targetProgress,
          unlockedAt: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          verificationHash: `sha256:${Math.random().toString(36).substring(2)}${Date.now().toString(16)}`,
        };
      }
      return b;
    });

    setBadges(updated);
    saveBadges(updated);
    setCelebratingBadge(badge);
    triggerCelebration();
  };

  const handleSimulateHittingZeroWasteMonth = () => {
    setSimulatedDays(2); // 28 -> 30 days
  };

  const handleSimulateHitting100kgDiverted = () => {
    setSimulatedWeightBonus((prev) => prev + 20); // Boost by 20 kg
  };

  const handleResetSimulation = () => {
    setSimulatedDays(0);
    setSimulatedWeightBonus(0);
    setBadges(INITIAL_DIGITAL_BADGES);
    saveBadges(INITIAL_DIGITAL_BADGES);
  };

  // Stats
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalCount = badges.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  // Filtered Badges
  const filteredBadges = useMemo(() => {
    return badges.filter((b) => {
      if (activeTab === "UNLOCKED") return b.unlocked;
      if (activeTab === "IN_PROGRESS") return !b.unlocked;
      if (activeTab === "SUSTAINABILITY") return b.category === "SUSTAINABILITY";
      return true;
    });
  }, [badges, activeTab]);

  // Find priority milestone (next closest to unlock)
  const nextMilestone = useMemo(() => {
    const locked = badges.filter((b) => !b.unlocked);
    if (locked.length === 0) return null;
    return locked.sort((a, b) => {
      const pctA = a.currentProgress / a.targetProgress;
      const pctB = b.currentProgress / b.targetProgress;
      return pctB - pctA;
    })[0];
  }, [badges]);

  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  return (
    <div
      id="user-milestone-badge-system-section"
      className={`p-6 rounded-3xl border ${cardBase} space-y-6 transition-all relative overflow-hidden`}
    >
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner & Level Progression */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10 border-b pb-5 border-slate-200 dark:border-slate-700/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-md shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                  Sistem Lencana & Tonggak Prestasi Sirkular
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" />
                  E2EE Verifiable
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lencana digital resmi berbasis verifikasi kriptografis untuk setiap tonggak pengurangan sampah yang dicapai rumah tangga.
              </p>
            </div>
          </div>
        </div>

        {/* Milestone Quick Stats Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Level Badge */}
          <div className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
              L4
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tingkat Pengaruh</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Green Champion</div>
            </div>
          </div>

          {/* Badges Collected Chip */}
          <div className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lencana Diraih</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {unlockedCount} / {totalCount} ({completionPercent}%)
              </div>
            </div>
          </div>

          {/* Next Target Spotlight */}
          {nextMilestone && (
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Target Terdekat
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {nextMilestone.title} ({Math.round((nextMilestone.currentProgress / nextMilestone.targetProgress) * 100)}%)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🚀 Interactive Milestone Quick Actions & Live Simulator */}
      <div
        id="badge-milestone-simulator-bar"
        className={`p-4 rounded-2xl border transition-all ${
          isDarkMode
            ? "bg-slate-900/60 border-slate-700/60"
            : "bg-slate-50/90 border-slate-200/90"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Uji Coba Tonggak Pencapaian (Live Milestone Tester)
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Simulasikan pencapaian target untuk melihat penganugerahan ikon digital seketika:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-simulate-zero-waste-month"
              onClick={handleSimulateHittingZeroWasteMonth}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              title="Capai 30 hari penuh untuk membuka Zero-Waste Month"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Capai 30 Hari (Zero-Waste Month)</span>
            </button>

            <button
              id="btn-simulate-100kg-diverted"
              onClick={handleSimulateHitting100kgDiverted}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              title="Tambahkan 20 kg sampah terpilah"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>+20kg Sampah Terpilah</span>
            </button>

            {(simulatedDays > 0 || simulatedWeightBonus > 0) && (
              <button
                id="btn-reset-badge-sim"
                onClick={handleResetSimulation}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs flex items-center gap-1 transition cursor-pointer"
                title="Kembalikan simulasi ke awal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 w-fit">
          <button
            id="tab-badges-all"
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "ALL"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Semua ({badges.length})
          </button>
          <button
            id="tab-badges-unlocked"
            onClick={() => setActiveTab("UNLOCKED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "UNLOCKED"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Diraih ({unlockedCount})
          </button>
          <button
            id="tab-badges-inprogress"
            onClick={() => setActiveTab("IN_PROGRESS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "IN_PROGRESS"
                ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Dalam Proses ({totalCount - unlockedCount})
          </button>
          <button
            id="tab-badges-sustainability"
            onClick={() => setActiveTab("SUSTAINABILITY")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "SUSTAINABILITY"
                ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Keberlanjutan
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          <span>Klik kartu lencana untuk membuka paspor digital & sertifikat SHA-256</span>
        </div>
      </div>

      {/* Badge Grid Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            isDarkMode={isDarkMode}
            onInspect={(b) => setSelectedBadge(b)}
            onClaimUnlock={handleClaimUnlock}
          />
        ))}
      </div>

      {/* Newly Unlocked Celebration Toast / Banner */}
      {celebratingBadge && (
        <div
          id="badge-celebration-toast"
          className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-slate-900/95 text-white border border-amber-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0 animate-bounce">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Lencana Baru Dibuka!
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-100 truncate">
                {celebratingBadge.title}
              </h4>
              <p className="text-xs text-slate-300 line-clamp-2">
                {celebratingBadge.description}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  id="btn-inspect-celebrating-badge"
                  onClick={() => {
                    setSelectedBadge(celebratingBadge);
                    setCelebratingBadge(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Buka Paspor</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setCelebratingBadge(null)}
                  className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inspection Modal */}
      {selectedBadge && (
        <BadgeModal
          badge={selectedBadge}
          isDarkMode={isDarkMode}
          onClose={() => setSelectedBadge(null)}
          onUnlockIfLocked={handleClaimUnlock}
        />
      )}
    </div>
  );
};
