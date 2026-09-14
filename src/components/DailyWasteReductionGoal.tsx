/**
 * Daily Waste Reduction Goal Widget
 * Greeneration Circle 2026 | SiklusKita DKI Jakarta
 *
 * Allows users to set a daily weight target for waste reduction and displays
 * a real-time progress bar indicating how close they are to reaching their daily goal.
 */

import React, { useState, useMemo } from "react";
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
  Plus,
  Zap,
  Clock,
  Flame,
} from "lucide-react";
import { WasteLogEntry } from "../types";

interface DailyWasteReductionGoalProps {
  wasteLogs: WasteLogEntry[];
  isDarkMode: boolean;
  onAddWasteLog?: (log: WasteLogEntry) => void;
}

const PRESET_DAILY_TARGETS = [
  { value: 0.5, label: "0.5 kg", desc: "Minimalis (1 Orang)" },
  { value: 1.0, label: "1.0 kg", desc: "Keluarga Kecil (2 Orang)" },
  { value: 1.5, label: "1.5 kg", desc: "Standar KK Jakarta" },
  { value: 2.0, label: "2.0 kg", desc: "Ambisius (Zero-Waste)" },
  { value: 2.5, label: "2.5 kg", desc: "Keluarga Besar (4+ Org)" },
];

export const DailyWasteReductionGoal: React.FC<DailyWasteReductionGoalProps> = ({
  wasteLogs,
  isDarkMode,
  onAddWasteLog,
}) => {
  // Read saved daily target from localStorage or default to 1.5 kg
  const [dailyTargetKg, setDailyTargetKg] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("siklukita_daily_waste_target");
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    }
    return 1.5; // Default DKI standard daily reduction target
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>(dailyTargetKg.toString());
  const [inputError, setInputError] = useState<string | null>(null);
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);
  const [quickAddFeedback, setQuickAddFeedback] = useState<string | null>(null);

  // Today date reference (supporting simulated Sept 2026 or real current date)
  const todayDateString = useMemo(() => {
    // Check if logs contain 2026-09-12 or 2026-09-13
    const hasSept2026 = wasteLogs.some(
      (l) => l.timestamp.includes("2026-09-12") || l.timestamp.includes("2026-09-13")
    );
    if (hasSept2026) {
      return "2026-09-12";
    }
    return new Date().toISOString().slice(0, 10);
  }, [wasteLogs]);

  // Save new daily target to localStorage
  const saveDailyTarget = (newTarget: number) => {
    if (newTarget <= 0 || isNaN(newTarget)) {
      setInputError("Target harian harus lebih dari 0 kg");
      return;
    }
    if (newTarget > 50) {
      setInputError("Maksimal target harian rumah tangga adalah 50 kg");
      return;
    }
    setDailyTargetKg(newTarget);
    if (typeof window !== "undefined") {
      localStorage.setItem("siklukita_daily_waste_target", newTarget.toString());
    }
    setIsEditing(false);
    setInputError(null);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  // Filter logs for today and compute metrics
  const todayMetrics = useMemo(() => {
    // Match today's date in timestamp, or if added in current session
    const todayLogs = wasteLogs.filter((log) => {
      return (
        log.timestamp.includes(todayDateString) ||
        log.timestamp.includes(new Date().toISOString().slice(0, 10)) ||
        log.timestamp.includes("Baru saja") ||
        log.timestamp.includes("Hari Ini")
      );
    });

    let totalWeightKg = 0;
    let organicKg = 0;
    let plasticKg = 0;
    let paperKg = 0;
    let othersKg = 0;
    let totalPoints = 0;
    let totalCo2e = 0;

    todayLogs.forEach((log) => {
      const w = log.weightKg || 0;
      totalWeightKg += w;
      totalPoints += log.points || 0;
      totalCo2e += log.co2eKg || 0;

      const cat = (log.category || "").toLowerCase();
      if (cat.includes("organik") || cat.includes("makanan")) {
        organicKg += w;
      } else if (cat.includes("plastik") || cat.includes("pet") || cat.includes("hdpe")) {
        plasticKg += w;
      } else if (cat.includes("kertas") || cat.includes("karton")) {
        paperKg += w;
      } else {
        othersKg += w;
      }
    });

    const percentAchieved = dailyTargetKg > 0 ? (totalWeightKg / dailyTargetKg) * 100 : 0;
    const remainingKg = Math.max(0, dailyTargetKg - totalWeightKg);
    const surplusKg = Math.max(0, totalWeightKg - dailyTargetKg);
    const isGoalReached = totalWeightKg >= dailyTargetKg;

    return {
      todayLogs,
      totalWeightKg: Number(totalWeightKg.toFixed(2)),
      percentAchieved: Number(percentAchieved.toFixed(1)),
      remainingKg: Number(remainingKg.toFixed(2)),
      surplusKg: Number(surplusKg.toFixed(2)),
      isGoalReached,
      organicKg: Number(organicKg.toFixed(2)),
      plasticKg: Number(plasticKg.toFixed(2)),
      paperKg: Number(paperKg.toFixed(2)),
      othersKg: Number(othersKg.toFixed(2)),
      totalPoints,
      totalCo2e: Number(totalCo2e.toFixed(2)),
    };
  }, [wasteLogs, dailyTargetKg, todayDateString]);

  // Visual capped bar percentage
  const visualBarPercent = Math.min(100, Math.max(0, todayMetrics.percentAchieved));

  // Category shares for the multi-segment progress bar
  const total = todayMetrics.totalWeightKg;
  const organicShare = total > 0 ? (todayMetrics.organicKg / total) * visualBarPercent : 0;
  const plasticShare = total > 0 ? (todayMetrics.plasticKg / total) * visualBarPercent : 0;
  const paperShare = total > 0 ? (todayMetrics.paperKg / total) * visualBarPercent : 0;
  const othersShare = total > 0 ? (todayMetrics.othersKg / total) * visualBarPercent : 0;

  // Quick preset logger to allow live testing of progress bar
  const handleQuickAdd = (itemName: string, category: string, weightKg: number, points: number) => {
    if (!onAddWasteLog) return;

    const newLog: WasteLogEntry = {
      id: `log-quick-${Date.now()}`,
      timestamp: `${todayDateString} ${new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })} WIB`,
      itemName,
      category,
      weightKg,
      points,
      co2eKg: Number((weightKg * 1.35).toFixed(2)),
      facility: "Bank Sampah Melati RW 04",
      householdId: "HH-CLD-0402",
      synced: true,
      encryptedHash: "quick-logged-client-e2ee-hash",
    };

    onAddWasteLog(newLog);
    setQuickAddFeedback(`+${weightKg} kg (${itemName}) berhasil dicatat!`);
    setTimeout(() => setQuickAddFeedback(null), 3000);
  };

  const cardBase = isDarkMode
    ? "bg-slate-800/90 border-slate-700/80 text-slate-100 shadow-md"
    : "bg-white border-slate-200 text-slate-800 shadow-sm";

  return (
    <div
      id="daily-waste-reduction-goal-widget"
      className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 space-y-5 ${cardBase}`}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 dark:border-slate-700/80">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Daily Waste Reduction Goal
            </h3>

            {todayMetrics.isGoalReached ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs animate-pulse">
                <Award className="w-3.5 h-3.5" />
                Target Hari Ini Tercapai!
              </span>
            ) : todayMetrics.percentAchieved >= 70 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Mendekati Target ({todayMetrics.percentAchieved}%)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5" />
                {todayMetrics.percentAchieved}% Terpenuhi
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Tetapkan target bobot pengurangan sampah harian Anda dan pantau progres pencapaian hari ini secara real-time.
          </p>
        </div>

        {/* Action Controls: Edit Target */}
        <div className="flex items-center gap-2">
          {showSavedToast && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Target Tersimpan
            </span>
          )}

          <button
            id="btn-edit-daily-target"
            onClick={() => {
              setCustomInput(dailyTargetKg.toString());
              setIsEditing(!isEditing);
              setInputError(null);
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer text-slate-700 dark:text-slate-300"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isEditing ? "Tutup Editor" : "Ubah Target Harian"}</span>
          </button>
        </div>
      </div>

      {/* Target Setting / Customization Panel (Expandable) */}
      {isEditing && (
        <div
          id="daily-target-customization-panel"
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 text-xs animate-in slide-in-from-top duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-500" />
              Pilih Target Cepat atau Masukkan Nilai Kustom:
            </span>
            <span className="text-[11px] text-slate-400">Satuan: Kilogram (kg / hari)</span>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {PRESET_DAILY_TARGETS.map((preset) => {
              const isSelected = dailyTargetKg === preset.value;
              return (
                <button
                  key={preset.value}
                  id={`btn-preset-target-${preset.value}`}
                  type="button"
                  onClick={() => {
                    setCustomInput(preset.value.toString());
                    saveDailyTarget(preset.value);
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

          {/* Custom Decimal/Numeric Input */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label
              htmlFor="daily-target-custom-input"
              className="text-slate-600 dark:text-slate-400 font-medium"
            >
              Atau masukkan bobot target harian kustom:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  id="daily-target-custom-input"
                  type="number"
                  min="0.1"
                  max="50"
                  step="0.1"
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value);
                    setInputError(null);
                  }}
                  className="w-28 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold text-center text-slate-800 dark:text-slate-100 focus:outline-emerald-500 text-xs"
                  placeholder="1.5"
                />
                <span className="absolute right-3 top-1.5 text-slate-400 font-semibold pointer-events-none text-xs">
                  kg
                </span>
              </div>

              <button
                id="btn-save-daily-target"
                type="button"
                onClick={() => saveDailyTarget(parseFloat(customInput))}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer shadow-xs text-xs"
              >
                Simpan Target
              </button>

              <button
                type="button"
                onClick={() => {
                  setCustomInput("1.5");
                  saveDailyTarget(1.5);
                }}
                className="p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
                title="Reset ke default 1.5 kg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
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

      {/* Highlights Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1: Target Harian */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Target className="w-3 h-3 text-emerald-500" />
            <span>Target Harian</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {dailyTargetKg}
            </span>
            <span className="text-xs font-semibold text-slate-500">kg / hari</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Hari Ini ({todayDateString})</span>
          </div>
        </div>

        {/* Metric 2: Terpilah Hari Ini */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Leaf className="w-3 h-3" />
            <span>Terpilah Hari Ini</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {todayMetrics.totalWeightKg}
            </span>
            <span className="text-xs font-semibold text-emerald-600/80">kg</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {todayMetrics.todayLogs.length} setoran tercatat
          </div>
        </div>

        {/* Metric 3: Persentase Capaian */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Capaian Target</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
              {todayMetrics.percentAchieved}%
            </span>
          </div>
          <div className="text-[11px] font-semibold mt-1">
            {todayMetrics.isGoalReached ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Tercapai (+{todayMetrics.surplusKg} kg)
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">
                Sisa: {todayMetrics.remainingKg} kg
              </span>
            )}
          </div>
        </div>

        {/* Metric 4: Poin & Dampak Hari Ini */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>Poin & Reduksi CO₂e</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-amber-500">
              +{todayMetrics.totalPoints}
            </span>
            <span className="text-xs font-semibold text-slate-500">poin</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {todayMetrics.totalCo2e} kg CO₂e dicegah
          </div>
        </div>
      </div>

      {/* 📊 Dedicated Daily Progress Bar */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <span>Progress Menuju Target Harian:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              {todayMetrics.totalWeightKg} kg / {dailyTargetKg} kg
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`font-black text-sm font-mono ${
                todayMetrics.isGoalReached
                  ? "text-emerald-600 dark:text-emerald-400"
                  : todayMetrics.percentAchieved >= 70
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {todayMetrics.percentAchieved}%
            </span>
          </div>
        </div>

        {/* Outer Progress Track */}
        <div
          id="daily-goal-progress-track"
          className="relative h-5 w-full bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-600 shadow-inner"
          role="progressbar"
          aria-valuenow={todayMetrics.totalWeightKg}
          aria-valuemin={0}
          aria-valuemax={dailyTargetKg}
          aria-label={`Progres pengurangan sampah harian ${todayMetrics.percentAchieved}%`}
        >
          {/* Subtle guide tick marks (25%, 50%, 75%) */}
          <div className="absolute inset-0 flex justify-between px-1 pointer-events-none z-10 opacity-30">
            <div className="h-full w-px bg-slate-400" style={{ left: "25%" }} />
            <div className="h-full w-px bg-slate-400" style={{ left: "50%" }} />
            <div className="h-full w-px bg-slate-400" style={{ left: "75%" }} />
          </div>

          {/* Multi-category stacked progress bar or gradient */}
          <div className="h-full w-full flex rounded-full overflow-hidden">
            {organicShare > 0 && (
              <div
                style={{ width: `${organicShare}%` }}
                className="bg-emerald-500 transition-all duration-500 relative group"
                title={`Organik: ${todayMetrics.organicKg} kg`}
              />
            )}
            {plasticShare > 0 && (
              <div
                style={{ width: `${plasticShare}%` }}
                className="bg-teal-400 transition-all duration-500 relative group"
                title={`Plastik: ${todayMetrics.plasticKg} kg`}
              />
            )}
            {paperShare > 0 && (
              <div
                style={{ width: `${paperShare}%` }}
                className="bg-amber-400 transition-all duration-500 relative group"
                title={`Kertas: ${todayMetrics.paperKg} kg`}
              />
            )}
            {othersShare > 0 && (
              <div
                style={{ width: `${othersShare}%` }}
                className="bg-purple-400 transition-all duration-500 relative group"
                title={`Lainnya: ${todayMetrics.othersKg} kg`}
              />
            )}

            {/* Fallback clean fill if categories are 0 but weight exists */}
            {todayMetrics.totalWeightKg > 0 &&
              organicShare === 0 &&
              plasticShare === 0 &&
              paperShare === 0 &&
              othersShare === 0 && (
                <div
                  style={{ width: `${visualBarPercent}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                />
              )}
          </div>
        </div>

        {/* Legend / Category Shares & Milestones */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Organik: {todayMetrics.organicKg} kg</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <span>Plastik: {todayMetrics.plasticKg} kg</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Kertas: {todayMetrics.paperKg} kg</span>
            </div>
            {todayMetrics.othersKg > 0 && (
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span>Lainnya: {todayMetrics.othersKg} kg</span>
              </div>
            )}
          </div>

          <div className="font-semibold text-slate-700 dark:text-slate-300">
            {todayMetrics.isGoalReached ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                🎉 Selamat! Target pengurangan hari ini berhasil dilampaui!
              </span>
            ) : (
              <span>Kurang {todayMetrics.remainingKg} kg lagi untuk capai 100%</span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Quick Add / Log Simulator (Enables immediate testing of progress bar) */}
      {onAddWasteLog && (
        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Catat Cepat Setoran Hari Ini (Uji Bar Progres Langsung):</span>
            </div>

            {quickAddFeedback && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 animate-in fade-in">
                ✓ {quickAddFeedback}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              id="quick-add-plastic"
              onClick={() =>
                handleQuickAdd(
                  "Botol Minum Plastik PET (10 pcs)",
                  "Plastik (PET/HDPE)",
                  0.35,
                  25
                )
              }
              className="p-2 rounded-xl border border-teal-200 dark:border-teal-900/50 bg-teal-50/60 dark:bg-teal-950/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-800 dark:text-teal-200 text-left transition cursor-pointer flex items-center justify-between gap-1 text-xs"
            >
              <div>
                <div className="font-bold">+0.35 kg Plastik</div>
                <div className="text-[10px] text-teal-600 dark:text-teal-400">Botol PET bersih</div>
              </div>
              <Plus className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
            </button>

            <button
              id="quick-add-organic"
              onClick={() =>
                handleQuickAdd(
                  "Sisa Makanan Dapur & Sayuran",
                  "Organik / Sisa Makanan",
                  0.65,
                  20
                )
              }
              className="p-2 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-left transition cursor-pointer flex items-center justify-between gap-1 text-xs"
            >
              <div>
                <div className="font-bold">+0.65 kg Organik</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Kompos / Maggot</div>
              </div>
              <Plus className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            </button>

            <button
              id="quick-add-paper"
              onClick={() =>
                handleQuickAdd(
                  "Kardus Paket Belanja Online",
                  "Kertas & Karton",
                  0.5,
                  15
                )
              }
              className="p-2 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-left transition cursor-pointer flex items-center justify-between gap-1 text-xs"
            >
              <div>
                <div className="font-bold">+0.50 kg Kertas</div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400">Kardus & duplex</div>
              </div>
              <Plus className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            </button>

            <button
              id="quick-add-large"
              onClick={() =>
                handleQuickAdd(
                  "Galon Plastik & Kumpulan Kaleng",
                  "Plastik (PET/HDPE)",
                  1.0,
                  50
                )
              }
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left transition cursor-pointer flex items-center justify-between gap-1 text-xs"
            >
              <div>
                <div className="font-bold">+1.00 kg Setoran Besar</div>
                <div className="text-[10px] text-slate-500">Lonjakan capaian</div>
              </div>
              <Plus className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
