/**
 * Badge System Section for AwardingView
 * Fahira Shanin Nadifa - Greeneration Circle 2026
 */

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Zap,
  RotateCcw,
  Sliders,
  Filter,
  Flame,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { DigitalBadge } from "../types";
import { loadSavedBadges, saveBadges, INITIAL_DIGITAL_BADGES } from "../data/mockBadges";
import { BadgeCard } from "./BadgeCard";
import { BadgeModal } from "./BadgeModal";

interface BadgeSystemSectionProps {
  isDarkMode: boolean;
}

export const BadgeSystemSection: React.FC<BadgeSystemSectionProps> = ({ isDarkMode }) => {
  const [badges, setBadges] = useState<DigitalBadge[]>(() => loadSavedBadges());
  const [selectedBadge, setSelectedBadge] = useState<DigitalBadge | null>(null);
  const [filterTab, setFilterTab] = useState<"ALL" | "AWARDS" | "UNLOCKED" | "LOCKED">("ALL");
  const [recentlyUnlockedBadgeId, setRecentlyUnlockedBadgeId] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    saveBadges(badges);
  }, [badges]);

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalCount = badges.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredBadges = badges.filter((b) => {
    if (filterTab === "AWARDS") return b.category === "AWARD_MILESTONE";
    if (filterTab === "UNLOCKED") return b.unlocked;
    if (filterTab === "LOCKED") return !b.unlocked;
    return true;
  });

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#06b6d4", "#ec4899", "#8b5cf6"],
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
    setRecentlyUnlockedBadgeId(badge.id);
    triggerCelebration();

    setTimeout(() => {
      setRecentlyUnlockedBadgeId(null);
    }, 4000);
  };

  const handleResetBadges = () => {
    setBadges(INITIAL_DIGITAL_BADGES);
    saveBadges(INITIAL_DIGITAL_BADGES);
  };

  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  return (
    <div id="badge-system-section" className="space-y-6">
      {/* Banner / Overview Box */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          isDarkMode
            ? "bg-gradient-to-r from-amber-950/30 via-slate-900 to-emerald-950/30 border-amber-500/30 shadow-xl"
            : "bg-gradient-to-r from-amber-50/80 via-white to-emerald-50/80 border-amber-200 shadow-md"
        } space-y-5`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Sistem Lencana Digital • Awarding Milestones</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Lencana Kehormatan Green Leader</span>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Buka dan pamerkan lencana digital resmi atas pencapaian milestone prestisius seperti{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">Best Sustainability Impact</strong>,{" "}
              <strong className="text-cyan-600 dark:text-cyan-400">Most Innovative Solution</strong>, dan{" "}
              <strong className="text-amber-600 dark:text-amber-400">Green Future Award</strong>. Setiap lencana dilengkapi segel integritas kriptografi E2EE yang dapat diverifikasi.
            </p>
          </div>

          {/* Progress & Milestone Overview Pill */}
          <div className="flex flex-wrap items-center gap-4 bg-white/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-center sm:text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Lencana Diraih
              </div>
              <div className="text-2xl font-black text-amber-500 flex items-center gap-1">
                <span>{unlockedCount}</span>
                <span className="text-sm font-semibold text-slate-400">/ {totalCount}</span>
              </div>
            </div>

            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="space-y-1 min-w-[140px]">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span>Kelengkapan</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{completionPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <span className="text-[9px] text-slate-400 block">Status: Platinum Green Leader</span>
            </div>
          </div>
        </div>

        {/* Recently Unlocked Alert Toast */}
        {recentlyUnlockedBadgeId && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>
                Selamat! Lencana baru berhasil dibuka dan tersimpan di Paspor Digital Anda.
              </span>
            </div>
            <button
              onClick={() => {
                const b = badges.find((x) => x.id === recentlyUnlockedBadgeId);
                if (b) setSelectedBadge(b);
              }}
              className="underline hover:text-emerald-600 dark:hover:text-emerald-300 font-bold cursor-pointer"
            >
              Lihat Detail Lencana
            </button>
          </div>
        )}

        {/* Filter Navigation Bar & Action Controls */}
        <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilterTab("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterTab === "ALL"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Semua Lencana ({totalCount})
            </button>

            <button
              onClick={() => setFilterTab("AWARDS")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                filterTab === "AWARDS"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Kategori Penghargaan (4)</span>
            </button>

            <button
              onClick={() => setFilterTab("UNLOCKED")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                filterTab === "UNLOCKED"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Terbuka ({unlockedCount})</span>
            </button>

            <button
              onClick={() => setFilterTab("LOCKED")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                filterTab === "LOCKED"
                  ? "bg-slate-700 text-white shadow-xs"
                  : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Terkunci ({totalCount - unlockedCount})</span>
            </button>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex items-center gap-2">
            {unlockedCount < totalCount && (
              <button
                onClick={() => {
                  const locked = badges.find((b) => !b.unlocked);
                  if (locked) handleClaimUnlock(locked);
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs shadow-emerald-600/20 cursor-pointer"
                title="Buka lencana berikutnya sebagai simulasi capaian milestone"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulasi Buka Milestone</span>
              </button>
            )}

            <button
              onClick={handleResetBadges}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition cursor-pointer"
              title="Reset lencana ke kondisi awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            isDarkMode={isDarkMode}
            onInspect={(b) => setSelectedBadge(b)}
            onClaimUnlock={(b) => handleClaimUnlock(b)}
          />
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div className={`p-8 rounded-2xl border text-center ${cardBase} space-y-2`}>
          <Lock className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="font-bold text-sm">Tidak ada lencana dalam filter ini</div>
          <p className="text-xs text-slate-500">
            Pilih tab 'Semua Lencana' untuk melihat seluruh koleksi penghargaan Anda.
          </p>
        </div>
      )}

      {/* Detail & Passport Modal */}
      {selectedBadge && (
        <BadgeModal
          badge={selectedBadge}
          isDarkMode={isDarkMode}
          onClose={() => setSelectedBadge(null)}
          onUnlockIfLocked={(b) => handleClaimUnlock(b)}
        />
      )}
    </div>
  );
};
