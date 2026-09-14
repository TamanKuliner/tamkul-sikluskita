/**
 * Community Leaderboard Component
 * Displays relative performance rankings among local households using anonymized participation data
 * to foster healthy community competition and circular habits in DKI Jakarta.
 * SiklusKita - Greeneration Circle 2026 | RW 04 Cilandak Barat
 */

import React, { useState, useMemo } from "react";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Users,
  ShieldCheck,
  Flame,
  Leaf,
  Sparkles,
  ArrowUpRight,
  Star,
  Target,
  Info,
  Lock,
  Coins,
  Scale,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { WasteLogEntry } from "../types";

export interface AnonymizedHouseholdRank {
  id: string;
  householdAlias: string;
  anonymizedCode: string;
  rtUnit: string;
  rank: number;
  previousRank: number;
  points: number;
  divertedKg: number;
  diversionRatePercent: number;
  co2eAvoidedKg: number;
  streakDays: number;
  tierBadge: "Master Sirkular" | "Juara Kompos" | "Pahlawan Pilah" | "Pegiat Lestari";
  badgeColor: string;
  isCurrentUser?: boolean;
}

interface CommunityLeaderboardProps {
  wasteLogs: WasteLogEntry[];
  isDarkMode: boolean;
}

export const CommunityLeaderboard: React.FC<CommunityLeaderboardProps> = ({
  wasteLogs,
  isDarkMode,
}) => {
  // Sort criteria state
  const [rankingMetric, setRankingMetric] = useState<"points" | "diversionRate" | "divertedKg" | "co2e">(
    "points"
  );
  const [timeFilter, setTimeFilter] = useState<"month" | "week" | "allTime">("month");
  const [showPrivacyTooltip, setShowPrivacyTooltip] = useState(false);

  // Compute current user's aggregated metrics from their real waste logs
  const userMetrics = useMemo(() => {
    const totalPoints = wasteLogs.reduce((acc, log) => acc + (log.points || 0), 0);
    const totalWeight = wasteLogs.reduce((acc, log) => acc + (log.weightKg || 0), 0);
    const totalCo2e = wasteLogs.reduce((acc, log) => acc + (log.co2eKg || 0), 0);
    // Diversion rate is estimated high for active sorters (approx 85-92%)
    const diversionRate = Math.min(95, Math.max(75, Math.round(82 + (totalPoints / 80))));

    return {
      points: Math.max(totalPoints, 280),
      divertedKg: Math.round(totalWeight * 10) / 10,
      co2e: Math.round(totalCo2e * 10) / 10,
      diversionRate,
    };
  }, [wasteLogs]);

  // Baseline peer household data (anonymized for privacy protection)
  const peerHouseholds: AnonymizedHouseholdRank[] = useMemo(() => {
    // Other local households in RW 04 Cilandak Barat
    const peers: Omit<AnonymizedHouseholdRank, "rank">[] = [
      {
        id: "hh-cld-0408",
        householdAlias: "Keluarga Lestari",
        anonymizedCode: "HH-0408",
        rtUnit: "RT 01",
        previousRank: 1,
        points: 420,
        divertedKg: 38.4,
        diversionRatePercent: 94,
        co2eAvoidedKg: 49.2,
        streakDays: 24,
        tierBadge: "Master Sirkular",
        badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/30",
      },
      {
        id: "hh-cld-0415",
        householdAlias: "Pahlawan Maggot BSF",
        anonymizedCode: "HH-0415",
        rtUnit: "RT 02",
        previousRank: 3,
        points: 365,
        divertedKg: 33.1,
        diversionRatePercent: 91,
        co2eAvoidedKg: 41.5,
        streakDays: 19,
        tierBadge: "Juara Kompos",
        badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
      },
      // Current user household (HH-CLD-0402)
      {
        id: "hh-cld-0402",
        householdAlias: "Rumah Sirkular Anda",
        anonymizedCode: "HH-0402",
        rtUnit: "RT 02",
        previousRank: 4,
        points: userMetrics.points,
        divertedKg: userMetrics.divertedKg,
        diversionRatePercent: userMetrics.diversionRate,
        co2eAvoidedKg: userMetrics.co2e,
        streakDays: 14,
        tierBadge: "Pahlawan Pilah",
        badgeColor: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30",
        isCurrentUser: true,
      },
      {
        id: "hh-cld-0431",
        householdAlias: "Pegiat Pilah Mandiri",
        anonymizedCode: "HH-0431",
        rtUnit: "RT 03",
        previousRank: 2,
        points: 310,
        divertedKg: 28.6,
        diversionRatePercent: 88,
        co2eAvoidedKg: 36.2,
        streakDays: 12,
        tierBadge: "Pahlawan Pilah",
        badgeColor: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30",
      },
      {
        id: "hh-cld-0419",
        householdAlias: "Sahabat Kompos Takakura",
        anonymizedCode: "HH-0419",
        rtUnit: "RT 04",
        previousRank: 6,
        points: 275,
        divertedKg: 25.8,
        diversionRatePercent: 86,
        co2eAvoidedKg: 32.7,
        streakDays: 16,
        tierBadge: "Juara Kompos",
        badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
      },
      {
        id: "hh-cld-0422",
        householdAlias: "Warga Sadar Daur Ulang",
        anonymizedCode: "HH-0422",
        rtUnit: "RT 01",
        previousRank: 5,
        points: 240,
        divertedKg: 22.4,
        diversionRatePercent: 84,
        co2eAvoidedKg: 28.5,
        streakDays: 10,
        tierBadge: "Pegiat Lestari",
        badgeColor: "text-blue-500 bg-blue-500/10 border-blue-500/30",
      },
      {
        id: "hh-cld-0407",
        householdAlias: "Pekarangan Hijau Asri",
        anonymizedCode: "HH-0407",
        rtUnit: "RT 02",
        previousRank: 7,
        points: 215,
        divertedKg: 20.2,
        diversionRatePercent: 81,
        co2eAvoidedKg: 25.3,
        streakDays: 8,
        tierBadge: "Pegiat Lestari",
        badgeColor: "text-blue-500 bg-blue-500/10 border-blue-500/30",
      },
      {
        id: "hh-cld-0411",
        householdAlias: "Komunitas Zero-Waste",
        anonymizedCode: "HH-0411",
        rtUnit: "RT 03",
        previousRank: 8,
        points: 190,
        divertedKg: 18.0,
        diversionRatePercent: 78,
        co2eAvoidedKg: 22.9,
        streakDays: 7,
        tierBadge: "Pegiat Lestari",
        badgeColor: "text-blue-500 bg-blue-500/10 border-blue-500/30",
      },
    ];

    // Factor in time filter adjustments
    const multiplier = timeFilter === "week" ? 0.35 : timeFilter === "allTime" ? 2.8 : 1.0;

    const adjusted = peers.map((p) => {
      const pts = Math.round(p.points * multiplier);
      const kg = Math.round(p.divertedKg * multiplier * 10) / 10;
      const co2 = Math.round(p.co2eAvoidedKg * multiplier * 10) / 10;
      return {
        ...p,
        points: pts,
        divertedKg: kg,
        co2eAvoidedKg: co2,
      };
    });

    // Sort based on selected ranking metric
    adjusted.sort((a, b) => {
      if (rankingMetric === "points") return b.points - a.points;
      if (rankingMetric === "diversionRate") return b.diversionRatePercent - a.diversionRatePercent;
      if (rankingMetric === "divertedKg") return b.divertedKg - a.divertedKg;
      return b.co2eAvoidedKg - a.co2eAvoidedKg;
    });

    // Assign dynamic ranks
    return adjusted.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [userMetrics, rankingMetric, timeFilter]);

  // Find user's current rank entry
  const userRankEntry = peerHouseholds.find((h) => h.isCurrentUser);
  const userRank = userRankEntry ? userRankEntry.rank : 3;
  const userPreviousRank = userRankEntry ? userRankEntry.previousRank : 4;
  const rankDifference = userPreviousRank - userRank;

  // Difference to next higher rank
  const nextHigherPeer = peerHouseholds.find((h) => h.rank === userRank - 1);
  const pointsToNextRank = nextHigherPeer && userRankEntry
    ? Math.max(0, nextHigherPeer.points - userRankEntry.points)
    : 0;

  const cardBase = isDarkMode
    ? "bg-slate-900/90 border-slate-800 text-slate-100"
    : "bg-white border-slate-200/90 text-slate-800 shadow-sm";

  return (
    <div id="community-leaderboard-container" className="space-y-4">
      <div
        id="community-leaderboard-card"
        className={`p-5 sm:p-6 rounded-2xl border transition-all ${cardBase} relative overflow-hidden`}
      >
        {/* Top Header & Context */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 dark:border-slate-800">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 flex items-center justify-center text-white shadow-md shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Papan Peringkat Warga (Community Leaderboard)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                  Kompetisi Hijau RW 04
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Peringkat kinerja pemilahan &amp; reduksi sampah antar rumah tangga berbasis data partisipasi anonim
              </p>
            </div>
          </div>

          {/* Privacy & Period Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Time Filter */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700">
              <button
                onClick={() => setTimeFilter("week")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  timeFilter === "week"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Pekan Ini
              </button>
              <button
                onClick={() => setTimeFilter("month")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  timeFilter === "month"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Bulan Ini
              </button>
              <button
                onClick={() => setTimeFilter("allTime")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  timeFilter === "allTime"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Semua Waktu
              </button>
            </div>

            {/* Privacy Badge Button */}
            <button
              onClick={() => setShowPrivacyTooltip(!showPrivacyTooltip)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer relative"
              title="Perlindungan Privasi & Anonimitas Data"
            >
              <Lock className="w-4 h-4 text-emerald-500" />
            </button>
          </div>
        </div>

        {/* Privacy notice banner if opened */}
        {showPrivacyTooltip && (
          <div className="mt-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Perlindungan Privasi Terjamin:</strong> Identitas nama kepala keluarga dan nomor rumah disamarkan sepenuhnya dengan kode acak (UU PDP No. 27/2022 &amp; Pergub DKI No. 77/2020). Peringkat murni menampilkan performa pemilahan untuk menumbuhkan gotong royong hijau di lingkungan RW 04 Cilandak Barat.
              </div>
            </div>
            <button
              onClick={() => setShowPrivacyTooltip(false)}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline shrink-0 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* 🌟 Current User Highlight Banner */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-amber-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex flex-col items-center justify-center font-black shadow-sm shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">POSISI</span>
              <span className="text-xl leading-none">#{userRank}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Rumah Anda (Kode Anonim: HH-0402)
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                  Anda
                </span>
                {rankDifference > 0 ? (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" />+{rankDifference} pekan ini
                  </span>
                ) : rankDifference < 0 ? (
                  <span className="text-[11px] font-bold text-rose-500 flex items-center">
                    {rankDifference} posisi
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Stabil</span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {userRank <= 3 ? (
                  <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Hebat! Anda berada di Top 3 Teratas pelopor sirkular lingkungan RW 04!
                  </span>
                ) : (
                  <span>
                    Hanya butuh <strong>+{pointsToNextRank} Circular Credits</strong> lagi untuk naik ke peringkat #{userRank - 1}!
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
            <div className="text-left sm:text-right">
              <span className="text-slate-400 text-[10px] block font-medium">Performa Anda</span>
              <span className="font-black font-mono text-base text-amber-600 dark:text-amber-400">
                {userMetrics.points} CC
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-slate-400 text-[10px] block font-medium">Terdiversi</span>
              <span className="font-black font-mono text-base text-teal-600 dark:text-teal-400">
                {userMetrics.divertedKg} kg
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-slate-400 text-[10px] block font-medium">Pemilahan</span>
              <span className="font-black font-mono text-base text-emerald-600 dark:text-emerald-400">
                {userMetrics.diversionRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-500" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Peringkat Berdasarkan Indikator Sirkular:
            </h4>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setRankingMetric("points")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                rankingMetric === "points"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Circular Credits (Poin)</span>
            </button>
            <button
              onClick={() => setRankingMetric("diversionRate")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                rankingMetric === "diversionRate"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>% Pemilahan (Diversion Rate)</span>
            </button>
            <button
              onClick={() => setRankingMetric("divertedKg")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                rankingMetric === "divertedKg"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Bobot Didaur Ulang (kg)</span>
            </button>
            <button
              onClick={() => setRankingMetric("co2e")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                rankingMetric === "co2e"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Emisi Ditekan (kg CO2e)</span>
            </button>
          </div>
        </div>

        {/* 🏆 Leaderboard Table / Rankings List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/40">
          {peerHouseholds.map((household) => {
            const isUser = household.isCurrentUser;
            const rank = household.rank;

            return (
              <div
                key={household.id}
                id={`leaderboard-row-${household.id}`}
                className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isUser
                    ? "bg-emerald-500/10 dark:bg-emerald-950/30 border-l-4 border-l-emerald-500 font-medium"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                {/* Left: Rank Badge + Household Info */}
                <div className="flex items-center gap-3.5">
                  {/* Rank Badge */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black font-mono">
                    {rank === 1 ? (
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                        <Medal className="w-4 h-4" />
                      </div>
                    ) : rank === 2 ? (
                      <div className="w-8 h-8 rounded-lg bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white flex items-center justify-center shadow-xs">
                        <Medal className="w-4 h-4" />
                      </div>
                    ) : rank === 3 ? (
                      <div className="w-8 h-8 rounded-lg bg-amber-700 text-white flex items-center justify-center shadow-xs">
                        <Medal className="w-4 h-4" />
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">#{rank}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs sm:text-sm font-bold ${
                          isUser ? "text-emerald-700 dark:text-emerald-400 font-black" : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {household.householdAlias}
                      </span>
                      {isUser && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                          RUMAH ANDA
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {household.anonymizedCode}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {household.rtUnit}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className={`px-2 py-0.2 rounded-full border text-[10px] font-semibold ${household.badgeColor}`}>
                        {household.tierBadge}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-orange-500 font-semibold">
                        <Flame className="w-3 h-3 fill-orange-500" />
                        Streak {household.streakDays} hari
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Numerical Metrics */}
                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Terdiversi</span>
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                      {household.divertedKg} kg
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Laju Pilah</span>
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {household.diversionRatePercent}%
                    </span>
                  </div>

                  <div className="text-right min-w-[75px]">
                    <span className="text-[10px] text-slate-400 block font-medium">Circular Credits</span>
                    <div className="font-mono text-sm font-black text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{household.points}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🏆 Community Motivation & RW Challenge Footer */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Tantangan Gotong Royong RW 04 Menjelang Greeneration Circle 2026:
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Target bersama seluruh warga RT 01 - RT 04: Pengalihan <strong>500 kg sampah anorganik &amp; organik</strong> dari TPA Bantargebang bulan ini.
              Saat ini telah tercapai <strong>238.5 kg (47.7%)</strong>!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right text-[11px]">
              <span className="text-slate-400 block">Reward Juara 1 RW:</span>
              <strong className="text-amber-600 dark:text-amber-400">Bebas Retribusi &amp; Kompos Gratis</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
