/**
 * Personal Waste Reduction Goal Component
 * Allows users to set a monthly target for waste weight reduction/diversion
 * and track live progress with an interactive progress bar and pace insights.
 * Greeneration Circle 2026 | SiklusKita DKI Jakarta
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  Target,
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Award,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Leaf,
  Scale,
  ChevronRight,
  Flame,
} from "lucide-react";
import { WasteLogEntry } from "../types";

interface PersonalWasteGoalProps {
  wasteLogs: WasteLogEntry[];
  isDarkMode: boolean;
}

const PRESET_TARGETS = [
  { value: 10, label: "10 kg", desc: "Pemula (1-2 orang)" },
  { value: 15, label: "15 kg", desc: "Moderat (Keluarga kecil)" },
  { value: 20, label: "20 kg", desc: "Standar KK Jakarta" },
  { value: 25, label: "25 kg", desc: "Ambisius (3-4 orang)" },
  { value: 30, label: "30 kg", desc: "Zero Waste Hero" },
];

export const PersonalWasteGoal: React.FC<PersonalWasteGoalProps> = ({
  wasteLogs,
  isDarkMode,
}) => {
  // Read saved target from localStorage or default to 20 kg
  const [monthlyTargetKg, setMonthlyTargetKg] = useState<number>(() => {
    const saved = localStorage.getItem("siklukita_monthly_waste_target");
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 20; // Default 20 kg for DKI household target
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>(monthlyTargetKg.toString());
  const [inputError, setInputError] = useState<string | null>(null);
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);

  // Sync to localStorage whenever target changes
  const saveTarget = (newTarget: number) => {
    if (newTarget <= 0 || isNaN(newTarget)) {
      setInputError("Target harus bernilai angka lebih dari 0 kg");
      return;
    }
    setMonthlyTargetKg(newTarget);
    localStorage.setItem("siklukita_monthly_waste_target", newTarget.toString());
    setIsEditing(false);
    setInputError(null);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2500);
  };

  // Month & Day calculations (September 2026 context)
  const currentMonthName = "September 2026";
  const daysInMonth = 30;
  const currentDay = 12; // Current simulated date: 12 Sep 2026
  const daysRemaining = Math.max(0, daysInMonth - currentDay);
  const monthElapsedPercentage = Math.round((currentDay / daysInMonth) * 100);

  // Compute actual diverted weight from wasteLogs for the active period
  const progressStats = useMemo(() => {
    let totalDivertedKg = 0;
    let organicKg = 0;
    let plasticKg = 0;
    let paperKg = 0;
    let othersKg = 0;

    wasteLogs.forEach((log) => {
      const w = log.weightKg || 0;
      totalDivertedKg += w;

      const catLower = (log.category || "").toLowerCase();
      if (catLower.includes("organik") || catLower.includes("makanan")) {
        organicKg += w;
      } else if (catLower.includes("plastik") || catLower.includes("pet") || catLower.includes("hdpe")) {
        plasticKg += w;
      } else if (catLower.includes("kertas") || catLower.includes("karton")) {
        paperKg += w;
      } else {
        othersKg += w;
      }
    });

    const percentAchieved = monthlyTargetKg > 0 ? (totalDivertedKg / monthlyTargetKg) * 100 : 0;
    const remainingKg = Math.max(0, monthlyTargetKg - totalDivertedKg);
    const dailyPaceNeeded = daysRemaining > 0 ? remainingKg / daysRemaining : 0;
    const currentDailyPace = currentDay > 0 ? totalDivertedKg / currentDay : 0;
    const projectedMonthEnd = Number((currentDailyPace * daysInMonth).toFixed(1));

    return {
      totalDivertedKg: Number(totalDivertedKg.toFixed(2)),
      percentAchieved: Number(percentAchieved.toFixed(1)),
      remainingKg: Number(remainingKg.toFixed(2)),
      dailyPaceNeeded: Number(dailyPaceNeeded.toFixed(2)),
      currentDailyPace: Number(currentDailyPace.toFixed(2)),
      projectedMonthEnd,
      organicKg: Number(organicKg.toFixed(2)),
      plasticKg: Number(plasticKg.toFixed(2)),
      paperKg: Number(paperKg.toFixed(2)),
      othersKg: Number(othersKg.toFixed(2)),
      isGoalReached: totalDivertedKg >= monthlyTargetKg,
      surplusKg: Number(Math.max(0, totalDivertedKg - monthlyTargetKg).toFixed(2)),
    };
  }, [wasteLogs, monthlyTargetKg, daysRemaining, currentDay]);

  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  // Progress Bar width capped at 100% for visual width, but progressStats has actual percentage
  const visualBarPercent = Math.min(100, Math.max(0, progressStats.percentAchieved));

  // Category percentage shares for multi-color progress segment
  const total = progressStats.totalDivertedKg;
  const organicShare = total > 0 ? (progressStats.organicKg / total) * visualBarPercent : 0;
  const plasticShare = total > 0 ? (progressStats.plasticKg / total) * visualBarPercent : 0;
  const paperShare = total > 0 ? (progressStats.paperKg / total) * visualBarPercent : 0;
  const othersShare = total > 0 ? (progressStats.othersKg / total) * visualBarPercent : 0;

  return (
    <div
      id="personal-waste-reduction-goal-card"
      className={`p-6 rounded-3xl border ${cardBase} space-y-5 transition-all`}
    >
      {/* Header with Title and Edit Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 dark:border-slate-700/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Target Pengurangan Sampah Bulanan
            </h3>
            {progressStats.isGoalReached && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white animate-pulse">
                <Award className="w-3.5 h-3.5" />
                Target Tercapai!
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Tetapkan sasaran bobot sampah yang dialihkan dari TPA bulan ini ({currentMonthName}) dan pantau capaian secara langsung.
          </p>
        </div>

        {/* Action Button: Edit / Set Target */}
        <div className="flex items-center gap-2">
          {showSavedFeedback && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Target Tersimpan
            </span>
          )}
          <button
            id="btn-edit-waste-goal"
            onClick={() => {
              setCustomInput(monthlyTargetKg.toString());
              setIsEditing(!isEditing);
              setInputError(null);
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? "Tutup Editor" : "Ubah Sasaran Target"}</span>
          </button>
        </div>
      </div>

      {/* Target Setting / Customization Panel (Expandable) */}
      {isEditing && (
        <div
          id="target-customization-panel"
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 text-xs"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-500" />
              Pilih Sasaran Cepat atau Masukkan Target Khusus
            </span>
            <span className="text-[11px] text-slate-400">Satuan: Kilogram (kg)</span>
          </div>

          {/* Quick Presets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {PRESET_TARGETS.map((preset) => {
              const isSelected = monthlyTargetKg === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => {
                    setCustomInput(preset.value.toString());
                    saveTarget(preset.value);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="font-bold text-sm">{preset.label}</div>
                  <div
                    className={`text-[10px] mt-0.5 ${
                      isSelected ? "text-emerald-100" : "text-slate-400"
                    }`}
                  >
                    {preset.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Numeric Entry */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <label htmlFor="custom-goal-input" className="text-slate-600 dark:text-slate-400 font-medium">
              Atau masukkan bobot target kustom:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  id="custom-goal-input"
                  type="number"
                  min="1"
                  max="500"
                  step="0.5"
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value);
                    setInputError(null);
                  }}
                  className="w-28 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold text-center text-slate-800 dark:text-slate-100 focus:outline-emerald-500"
                  placeholder="20"
                />
                <span className="absolute right-3 top-1.5 text-slate-400 font-semibold pointer-events-none">
                  kg
                </span>
              </div>
              <button
                type="button"
                onClick={() => saveTarget(parseFloat(customInput))}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer shadow-xs"
              >
                Simpan Sasaran
              </button>
            </div>
            {inputError && (
              <span className="text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {inputError}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Highlights Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1: Target Bobot */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Sasaran Target
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {monthlyTargetKg}
            </span>
            <span className="text-xs font-semibold text-slate-500">kg / bulan</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{currentMonthName}</span>
          </div>
        </div>

        {/* Metric 2: Terpilah Saat Ini */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Terpilah & Tereduksi
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {progressStats.totalDivertedKg}
            </span>
            <span className="text-xs font-semibold text-emerald-500">kg</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Dari {wasteLogs.length} transaksi pemilahan
          </div>
        </div>

        {/* Metric 3: Persentase Tercapai */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pencapaian Target
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-2xl font-black ${
                progressStats.isGoalReached
                  ? "text-emerald-600 dark:text-emerald-400"
                  : progressStats.percentAchieved >= 50
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-amber-500"
              }`}
            >
              {progressStats.percentAchieved}%
            </span>
          </div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
            {progressStats.isGoalReached ? "100% Terpenuhi 🎉" : `${progressStats.remainingKg} kg tersisa`}
          </div>
        </div>

        {/* Metric 4: Kecepatan Harian Disarankan */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Ritme Harian
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {progressStats.isGoalReached ? "0" : progressStats.dailyPaceNeeded}
            </span>
            <span className="text-xs font-semibold text-blue-500">kg / hari</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {daysRemaining} hari tersisa di bulan ini
          </div>
        </div>
      </div>

      {/* Primary Progress Bar Section */}
      <div className="space-y-2">
        {/* Progress Bar Label & Percent */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
            <span>Progres Pengurangan Bobot</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              ({progressStats.totalDivertedKg} / {monthlyTargetKg} kg)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm font-mono text-slate-800 dark:text-slate-100">
              {progressStats.percentAchieved}%
            </span>
          </div>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div
          id="waste-goal-progress-track"
          className="relative h-4 w-full bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden p-0.5 border border-slate-200/80 dark:border-slate-600"
          role="progressbar"
          aria-valuenow={progressStats.totalDivertedKg}
          aria-valuemin={0}
          aria-valuemax={monthlyTargetKg}
          aria-label={`Progres pengurangan sampah ${progressStats.percentAchieved}%`}
        >
          {/* Multi-segment stacked fills for each category */}
          <div className="h-full w-full flex rounded-full overflow-hidden">
            {/* Organic Segment */}
            {organicShare > 0 && (
              <div
                style={{ width: `${organicShare}%` }}
                className="bg-emerald-500 transition-all duration-500 relative group"
                title={`Organik: ${progressStats.organicKg} kg`}
              />
            )}
            {/* Plastic Segment */}
            {plasticShare > 0 && (
              <div
                style={{ width: `${plasticShare}%` }}
                className="bg-teal-400 transition-all duration-500 relative group"
                title={`Plastik: ${progressStats.plasticKg} kg`}
              />
            )}
            {/* Paper Segment */}
            {paperShare > 0 && (
              <div
                style={{ width: `${paperShare}%` }}
                className="bg-amber-400 transition-all duration-500 relative group"
                title={`Kertas: ${progressStats.paperKg} kg`}
              />
            )}
            {/* Others Segment */}
            {othersShare > 0 && (
              <div
                style={{ width: `${othersShare}%` }}
                className="bg-indigo-400 transition-all duration-500 relative group"
                title={`Lainnya: ${progressStats.othersKg} kg`}
              />
            )}
          </div>

          {/* 50% Benchmark Indicator Needle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-400/50 pointer-events-none"
            style={{ left: "50%" }}
            title="50% Milestones"
          />
          {/* 75% Benchmark Indicator Needle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-400/50 pointer-events-none"
            style={{ left: "75%" }}
            title="75% Milestones"
          />
        </div>

        {/* Legend for Progress Bar Segments */}
        <div className="flex flex-wrap items-center justify-between text-[11px] pt-1 text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Organik ({progressStats.organicKg} kg)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />
              Plastik ({progressStats.plasticKg} kg)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              Kertas ({progressStats.paperKg} kg)
            </span>
            {progressStats.othersKg > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
                Lainnya ({progressStats.othersKg} kg)
              </span>
            )}
          </div>

          <div className="font-semibold text-slate-600 dark:text-slate-300">
            {progressStats.isGoalReached ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Surplus +{progressStats.surplusKg} kg di atas target!
              </span>
            ) : (
              <span>Kurang {progressStats.remainingKg} kg menuju sasaran</span>
            )}
          </div>
        </div>
      </div>

      {/* Motivational Status & Dynamic Guidance Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-slate-100 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            {progressStats.isGoalReached ? (
              <Award className="w-4 h-4" />
            ) : (
              <Flame className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-100">
              {progressStats.isGoalReached
                ? "Luar Biasa! Sasaran Pengurangan Sampah Bulan Ini Berhasil Ditembus 🎉"
                : progressStats.percentAchieved >= monthElapsedPercentage
                ? "Hebat! Laju Pemilahan Anda Sedang Berada di Jalur Positif (On Track)"
                : "Ayo Tingkatkan! Pilah Sisa Dapur & Botol Bekas Akhir Pekan Ini"}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              {progressStats.isGoalReached
                ? `Anda telah mengalihkan ${progressStats.totalDivertedKg} kg sampah dari beban TPA Bantargebang untuk bulan ${currentMonthName}.`
                : `Dengan memilah rata-rata ${progressStats.dailyPaceNeeded} kg per hari selama ${daysRemaining} hari ke depan, sasaran ${monthlyTargetKg} kg akan tercapai penuh.`}
            </p>
          </div>
        </div>

        {/* Projected Milestone Badge */}
        <div className="flex-shrink-0 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Proyeksi Akhir Bulan</div>
          <div className="text-sm font-black text-slate-800 dark:text-slate-100">
            ~{progressStats.projectedMonthEnd} kg
          </div>
        </div>
      </div>
    </div>
  );
};
