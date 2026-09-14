/**
 * Visual Digital Badge Card Component
 * Fahira Shanin Nadifa - Greeneration Circle 2026
 */

import React from "react";
import {
  Trophy,
  Leaf,
  Sparkles,
  ShieldCheck,
  Flame,
  Users,
  Cpu,
  Target,
  Lock,
  CheckCircle2,
  ExternalLink,
  Award,
  Zap,
  Scale,
  Calendar,
  Recycle,
  Package,
} from "lucide-react";
import { DigitalBadge } from "../types";

interface BadgeCardProps {
  badge: DigitalBadge;
  isDarkMode: boolean;
  onInspect: (badge: DigitalBadge) => void;
  onClaimUnlock: (badge: DigitalBadge) => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  isDarkMode,
  onInspect,
  onClaimUnlock,
}) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "leaf":
        return <Leaf className="w-6 h-6" />;
      case "sparkles":
        return <Sparkles className="w-6 h-6" />;
      case "trophy":
        return <Trophy className="w-6 h-6" />;
      case "shield":
        return <ShieldCheck className="w-6 h-6" />;
      case "flame":
        return <Flame className="w-6 h-6" />;
      case "users":
        return <Users className="w-6 h-6" />;
      case "cpu":
        return <Cpu className="w-6 h-6" />;
      case "target":
        return <Target className="w-6 h-6" />;
      case "scale":
        return <Scale className="w-6 h-6" />;
      case "calendar":
        return <Calendar className="w-6 h-6" />;
      case "recycle":
        return <Recycle className="w-6 h-6" />;
      case "package":
        return <Package className="w-6 h-6" />;
      case "zap":
        return <Zap className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  // Color schemes based on category and tier
  const getMedallionStyle = () => {
    if (!badge.unlocked) {
      return {
        bg: isDarkMode ? "bg-slate-800/90 border-slate-700 text-slate-500" : "bg-slate-100 border-slate-300 text-slate-400",
        ring: "ring-1 ring-slate-400/20",
        glow: "",
        accent: "text-slate-400",
      };
    }

    if (badge.id === "badge-100kg-diverted") {
      return {
        bg: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 border-emerald-300 text-white shadow-lg shadow-emerald-500/30",
        ring: "ring-2 ring-emerald-400/60",
        glow: "from-emerald-500/25 to-teal-500/15",
        accent: "text-emerald-500",
      };
    }

    if (badge.id === "badge-zero-waste-month") {
      return {
        bg: "bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600 border-yellow-200 text-white shadow-lg shadow-amber-500/35",
        ring: "ring-2 ring-yellow-400/60",
        glow: "from-amber-500/30 to-orange-500/15",
        accent: "text-amber-500",
      };
    }

    if (badge.id === "badge-50kg-carbon-shield") {
      return {
        bg: "bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-700 border-cyan-300 text-white shadow-md shadow-cyan-500/30",
        ring: "ring-2 ring-cyan-400/50",
        glow: "from-cyan-500/20 to-blue-500/10",
        accent: "text-cyan-500",
      };
    }

    if (badge.id === "badge-sustainability-impact") {
      return {
        bg: "bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 border-emerald-300 text-white shadow-lg shadow-emerald-500/30",
        ring: "ring-2 ring-emerald-400/50",
        glow: "from-emerald-500/20 to-teal-500/10",
        accent: "text-emerald-500",
      };
    }

    if (badge.id === "badge-most-innovative") {
      return {
        bg: "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 border-cyan-200 text-white shadow-lg shadow-cyan-500/30",
        ring: "ring-2 ring-cyan-400/50",
        glow: "from-cyan-500/20 to-blue-500/10",
        accent: "text-cyan-500",
      };
    }

    if (badge.tier === "PLATINUM") {
      return {
        bg: "bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 border-amber-200 text-slate-900 shadow-lg shadow-amber-500/30",
        ring: "ring-2 ring-amber-400/60",
        glow: "from-amber-500/20 to-yellow-500/10",
        accent: "text-amber-500",
      };
    }

    if (badge.tier === "GOLD") {
      return {
        bg: "bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 border-amber-300 text-white shadow-md shadow-amber-500/25",
        ring: "ring-2 ring-amber-400/40",
        glow: "from-amber-500/15 to-orange-500/10",
        accent: "text-amber-500",
      };
    }

    return {
      bg: "bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 border-slate-200 text-white shadow-md shadow-slate-500/20",
      ring: "ring-2 ring-slate-400/40",
      glow: "from-slate-400/15 to-slate-600/10",
      accent: "text-slate-400",
    };
  };

  const medallion = getMedallionStyle();
  const progressPercent = Math.min(
    100,
    Math.round((badge.currentProgress / badge.targetProgress) * 100)
  );

  return (
    <div
      id={`badge-card-${badge.id}`}
      className={`group relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden p-5 ${
        badge.unlocked
          ? isDarkMode
            ? "bg-slate-800/85 border-slate-700 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5"
            : "bg-white border-slate-200/90 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10"
          : isDarkMode
          ? "bg-slate-900/40 border-slate-800 opacity-85 hover:opacity-100 hover:border-slate-700"
          : "bg-slate-50/70 border-slate-200/70 opacity-90 hover:opacity-100 hover:border-slate-300"
      }`}
    >
      {/* Background glow for unlocked badges */}
      {badge.unlocked && (
        <div
          className={`absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br ${medallion.glow} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
        />
      )}

      <div className="space-y-4 relative z-10">
        {/* Top Header: Rarity & Tier Tags */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                badge.tier === "PLATINUM"
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  : badge.tier === "GOLD"
                  ? "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
                  : "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30"
              }`}
            >
              {badge.tier}
            </span>
            <span
              className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
              }`}
            >
              {badge.rarity}
            </span>
          </div>

          {badge.unlocked ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Terbuka</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full border border-slate-400/20">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Terkunci</span>
            </span>
          )}
        </div>

        {/* Visual Medallion & Title Area */}
        <div className="flex items-center gap-3.5">
          {/* Circular 3D-styled Badge Emblem */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-105 ${medallion.bg} ${medallion.ring}`}
            >
              {getBadgeIcon(badge.iconName)}
            </div>
            {/* Small corner status badge */}
            <div className="absolute -bottom-1 -right-1">
              {badge.unlocked ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-slate-600 text-slate-200 flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  <Lock className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-0.5 overflow-hidden">
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-snug truncate">
              {badge.title}
            </h4>
            <div className="text-[11px] font-mono font-medium text-slate-400 truncate">
              #{badge.tag}
            </div>
            {badge.unlocked && badge.unlockedAt && (
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Diraih: {badge.unlockedAt}
              </div>
            )}
          </div>
        </div>

        {/* Description & Milestone Requirement */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {badge.description}
        </p>

        {/* Milestone Requirement & Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              Target Capaian:
            </span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {badge.currentProgress.toLocaleString()} / {badge.targetProgress.toLocaleString()} {badge.unit}
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700/80 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                badge.unlocked
                  ? badge.id === "badge-sustainability-impact"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : badge.id === "badge-most-innovative"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                    : "bg-gradient-to-r from-amber-400 to-yellow-500"
                  : "bg-slate-400 dark:bg-slate-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 relative z-10">
        <button
          onClick={() => onInspect(badge)}
          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition cursor-pointer py-1"
        >
          <span>Inspeksi Paspor</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {badge.unlocked ? (
          <button
            onClick={() => onInspect(badge)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20 flex items-center gap-1 transition cursor-pointer"
          >
            <Zap className="w-3 h-3 text-emerald-500" />
            <span>Klaim & Bagikan</span>
          </button>
        ) : (
          <button
            onClick={() => onClaimUnlock(badge)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-white text-xs font-bold shadow-xs shadow-amber-500/20 flex items-center gap-1 transition cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Buka Lencana</span>
          </button>
        )}
      </div>
    </div>
  );
};
