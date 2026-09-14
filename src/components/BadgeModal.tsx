/**
 * Badge Detail & Digital Passport Inspection Modal
 * Fahira Shanin Nadifa - Greeneration Circle 2026
 */

import React, { useState } from "react";
import {
  Trophy,
  Leaf,
  Sparkles,
  ShieldCheck,
  Flame,
  Users,
  Cpu,
  Target,
  Award,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  Share2,
  Download,
  Calendar,
  Zap,
  Scale,
  Recycle,
  Package,
} from "lucide-react";
import confetti from "canvas-confetti";
import { DigitalBadge } from "../types";

interface BadgeModalProps {
  badge: DigitalBadge;
  isDarkMode: boolean;
  onClose: () => void;
  onUnlockIfLocked?: (badge: DigitalBadge) => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({
  badge,
  isDarkMode,
  onClose,
  onUnlockIfLocked,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "leaf":
        return <Leaf className="w-10 h-10" />;
      case "sparkles":
        return <Sparkles className="w-10 h-10" />;
      case "trophy":
        return <Trophy className="w-10 h-10" />;
      case "shield":
        return <ShieldCheck className="w-10 h-10" />;
      case "flame":
        return <Flame className="w-10 h-10" />;
      case "users":
        return <Users className="w-10 h-10" />;
      case "cpu":
        return <Cpu className="w-10 h-10" />;
      case "target":
        return <Target className="w-10 h-10" />;
      case "scale":
        return <Scale className="w-10 h-10" />;
      case "calendar":
        return <Calendar className="w-10 h-10" />;
      case "recycle":
        return <Recycle className="w-10 h-10" />;
      case "package":
        return <Package className="w-10 h-10" />;
      case "zap":
        return <Zap className="w-10 h-10" />;
      default:
        return <Award className="w-10 h-10" />;
    }
  };

  const getMedallionGradient = () => {
    if (!badge.unlocked) {
      return "from-slate-600 to-slate-800 border-slate-600 text-slate-300";
    }
    if (badge.id === "badge-sustainability-impact") {
      return "from-emerald-400 via-teal-500 to-emerald-700 border-emerald-300 text-white shadow-xl shadow-emerald-500/40";
    }
    if (badge.id === "badge-most-innovative") {
      return "from-cyan-400 via-blue-500 to-indigo-600 border-cyan-200 text-white shadow-xl shadow-cyan-500/40";
    }
    if (badge.tier === "PLATINUM") {
      return "from-amber-300 via-yellow-500 to-amber-700 border-amber-200 text-slate-900 shadow-xl shadow-amber-500/40";
    }
    if (badge.tier === "GOLD") {
      return "from-amber-400 via-amber-500 to-yellow-600 border-amber-300 text-white shadow-lg shadow-amber-500/30";
    }
    return "from-slate-300 via-slate-400 to-slate-600 border-slate-200 text-white shadow-lg shadow-slate-500/25";
  };

  const copyHashToClipboard = () => {
    navigator.clipboard.writeText(badge.verificationHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const shareBadge = () => {
    const text = `🏆 Saya meraih lencana resmi '${badge.title}' (${badge.tag}) di Greeneration Circle 2026 bersama SiklusKita DKI Jakarta!`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  const handleCelebrate = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#06b6d4", "#ec4899"],
      });
    } catch {
      // safe fallback
    }
  };

  const cardBase = isDarkMode
    ? "bg-slate-900 border-slate-700 text-slate-100"
    : "bg-white border-slate-200 text-slate-900 shadow-2xl";

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`max-w-lg w-full rounded-3xl border ${cardBase} p-6 sm:p-8 space-y-6 relative my-8`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
        >
          ✕
        </button>

        {/* Digital Passport Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>GREENERATION CIRCLE DIGITAL PASSPORT</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            {badge.title}
          </h3>

          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="font-mono text-slate-400">#{badge.tag}</span>
            <span>•</span>
            <span className="font-bold text-amber-500">{badge.tier} MEDALLION</span>
            <span>•</span>
            <span className="text-slate-500">{badge.rarity}</span>
          </div>
        </div>

        {/* 3D Visual Medallion Display */}
        <div className="py-4 flex flex-col items-center justify-center">
          <div className="relative">
            <div
              className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${getMedallionGradient()} border-4 flex items-center justify-center transition-transform hover:scale-105 duration-300 ring-4 ring-black/10 dark:ring-white/10`}
            >
              {getBadgeIcon(badge.iconName)}
            </div>

            {/* Status seal stamp */}
            <div className="absolute -bottom-2 -right-2">
              {badge.unlocked ? (
                <div className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-[10px] uppercase flex items-center gap-1 shadow-md">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>VERIFIED</span>
                </div>
              ) : (
                <div className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-200 font-extrabold text-[10px] uppercase flex items-center gap-1 shadow-md">
                  <Lock className="w-3 h-3" />
                  <span>LOCKED</span>
                </div>
              )}
            </div>
          </div>

          {badge.unlocked && badge.unlockedAt && (
            <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Dianugerahkan Resmi: {badge.unlockedAt}</span>
            </div>
          )}
        </div>

        {/* Milestone Requirement & Description */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
              Deskripsi Penghargaan:
            </span>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed mt-0.5">
              {badge.description}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
              Syarat Capaian Milestone:
            </span>
            <p className="text-emerald-700 dark:text-emerald-300 font-medium leading-relaxed mt-0.5">
              {badge.milestoneRequirement}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-slate-500">Progres Capaian:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
              {badge.currentProgress.toLocaleString()} / {badge.targetProgress.toLocaleString()} {badge.unit}
            </span>
          </div>
        </div>

        {/* Unlocked Perks & Privileges */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Hak Istimewa & Manfaat Lencana:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {badge.perks.map((perk, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300 leading-tight">
                  {perk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cryptographic Verification E2EE Hash */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-[11px] font-mono">
          <div className="overflow-hidden">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
              E2EE Verification Hash
            </div>
            <div className="text-slate-600 dark:text-slate-300 truncate">
              {badge.verificationHash}
            </div>
          </div>
          <button
            onClick={copyHashToClipboard}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition cursor-pointer flex-shrink-0"
            title="Salin Hash Kriptografi"
          >
            {copiedHash ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Modal Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={shareBadge}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedShare ? "Teks Tersalin!" : "Bagikan Lencana"}</span>
            </button>

            {badge.unlocked && (
              <button
                onClick={handleCelebrate}
                className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Rayakan 🎉</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!badge.unlocked && onUnlockIfLocked && (
              <button
                onClick={() => {
                  onUnlockIfLocked(badge);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Buka Sekarang 🚀
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
