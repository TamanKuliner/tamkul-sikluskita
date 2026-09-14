/**
 * Monthly Waste Disposal Quota & Proactive Predictive Notification Engine
 * SiklusKita - Greeneration Circle 2026 | DKI Jakarta
 * Fahira Shanin Nadifa & Tim
 * 
 * Regulated based on Pergub DKI Jakarta No. 77/2020 (Pengelolaan Sampah Lingkup RW)
 * & Jakstrada Target Pengurangan 30% dari Sumber.
 */

import React, { useState, useMemo, useEffect } from "react";
import {
  AlertTriangle,
  Bell,
  BellRing,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Sliders,
  Volume2,
  Send,
  Leaf,
  Clock,
  RotateCcw,
  Zap,
  Target,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Percent,
} from "lucide-react";
import { WasteLogEntry, SmartAlert } from "../types";
import { playCapacityAlertChime } from "../utils/capacityWatchAudio";

interface MonthlyQuotaPredictorProps {
  isDarkMode: boolean;
  wasteLogs: WasteLogEntry[];
  onAddWasteLog?: (log: WasteLogEntry) => void;
  onDispatchAlert?: (alert: SmartAlert) => void;
  onSendPushNotification?: (title: string, body: string) => void;
  notificationPermission?: NotificationPermission;
}

// Preset limits based on DKI Jakarta Household Scenarios
export const QUOTA_PRESETS = [
  {
    id: "minimalist",
    label: "Target Zero-Waste (1-2 Jiwa)",
    limitKg: 20,
    desc: "Target ambisius pengurangan dari sumber & komposting mandiri.",
  },
  {
    id: "standard_small",
    label: "Standar Pergub 77 (2-3 Jiwa)",
    limitKg: 30,
    desc: "Batas ideal rumah tangga standar DKI Jakarta (0.35 kg/orang/hari).",
  },
  {
    id: "standard_medium",
    label: "Standar RW 04 Cilandak (3-4 Jiwa)",
    limitKg: 35,
    desc: "Batas rata-rata rumah tangga percontohan Cilandak Barat.",
  },
  {
    id: "large_family",
    label: "Keluarga Besar (5+ Jiwa)",
    limitKg: 50,
    desc: "Batas atas rumah tangga multi-generasi dengan pemilahan intensif.",
  },
];

export const MonthlyQuotaPredictor: React.FC<MonthlyQuotaPredictorProps> = ({
  isDarkMode,
  wasteLogs,
  onAddWasteLog,
  onDispatchAlert,
  onSendPushNotification,
  notificationPermission = "default",
}) => {
  // Monthly limit state persisted in localStorage
  const [monthlyLimitKg, setMonthlyLimitKg] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("siklukita_monthly_limit_kg");
      if (saved) {
        const num = parseFloat(saved);
        if (!isNaN(num) && num > 0) return num;
      }
    }
    return 35; // Default: 35 kg per month
  });

  const [showConfig, setShowConfig] = useState(false);
  const [mitigationApplied, setMitigationApplied] = useState(false);
  const [hasDispatchedInitialAlert, setHasDispatchedInitialAlert] = useState(false);
  const [toastFeedback, setToastFeedback] = useState<string | null>(null);

  // Save limit to localStorage
  useEffect(() => {
    localStorage.setItem("siklukita_monthly_limit_kg", monthlyLimitKg.toString());
  }, [monthlyLimitKg]);

  // Current calendar metadata (September 2026)
  // September has 30 days. Current date in metadata is Sept 13, 2026.
  const totalDaysInMonth = 30;
  const currentDayOfMonth = 13; // 13 September 2026
  const daysElapsed = Math.max(1, currentDayOfMonth);
  const daysRemaining = Math.max(1, totalDaysInMonth - currentDayOfMonth);

  // Calculate stats from historical waste logs
  const stats = useMemo(() => {
    // Current month waste calculation (all logs in Sept 2026)
    let totalKg = 0;
    let categoryMap: Record<string, number> = {
      "Organik / Sisa Makanan": 0,
      "Plastik (PET/HDPE)": 0,
      "Kertas & Karton": 0,
      "Lainnya": 0,
    };

    wasteLogs.forEach((log) => {
      totalKg += log.weightKg || 0;
      if (log.category.includes("Organik")) {
        categoryMap["Organik / Sisa Makanan"] += log.weightKg || 0;
      } else if (log.category.includes("Plastik")) {
        categoryMap["Plastik (PET/HDPE)"] += log.weightKg || 0;
      } else if (log.category.includes("Kertas")) {
        categoryMap["Kertas & Karton"] += log.weightKg || 0;
      } else {
        categoryMap["Lainnya"] += log.weightKg || 0;
      }
    });

    // If mitigation simulation is active, subtract 5.0 kg of organic waste
    const effectiveCurrentKg = mitigationApplied
      ? Math.max(1, totalKg - 5.0)
      : totalKg;

    // Daily run-rate (burn-rate)
    const dailyRate = effectiveCurrentKg / daysElapsed;

    // Projected end of month total
    const projectedTotal = effectiveCurrentKg + dailyRate * daysRemaining;

    // Quota metrics
    const currentUsagePercent = Math.round((effectiveCurrentKg / monthlyLimitKg) * 100);
    const projectedUsagePercent = Math.round((projectedTotal / monthlyLimitKg) * 100);
    const overageKg = Math.max(0, projectedTotal - monthlyLimitKg);

    // Day of breach calculation
    let estimatedBreachDay = 30;
    if (dailyRate > 0) {
      estimatedBreachDay = Math.min(30, Math.ceil(monthlyLimitKg / dailyRate));
    }
    const daysUntilBreach = Math.max(1, estimatedBreachDay - currentDayOfMonth);

    // Determine highest contributing category
    let topCategory = "Organik / Sisa Makanan";
    let maxCategoryKg = 0;
    Object.entries(categoryMap).forEach(([cat, kg]) => {
      if (kg > maxCategoryKg) {
        maxCategoryKg = kg;
        topCategory = cat;
      }
    });

    // Severity level
    let severity: "CRITICAL" | "WARNING" | "SAFE" = "SAFE";
    if (projectedUsagePercent >= 100 || currentUsagePercent >= 85) {
      severity = "CRITICAL";
    } else if (projectedUsagePercent >= 80) {
      severity = "WARNING";
    } else {
      severity = "SAFE";
    }

    return {
      currentKg: Math.round(effectiveCurrentKg * 100) / 100,
      dailyRate: Math.round(dailyRate * 100) / 100,
      projectedTotal: Math.round(projectedTotal * 100) / 100,
      currentUsagePercent,
      projectedUsagePercent,
      overageKg: Math.round(overageKg * 100) / 100,
      estimatedBreachDay,
      daysUntilBreach,
      topCategory,
      categoryMap,
      severity,
      logCount: wasteLogs.length,
    };
  }, [wasteLogs, monthlyLimitKg, daysElapsed, daysRemaining, currentDayOfMonth, mitigationApplied]);

  // Dispatch proactive alert to parent system if critical breach is imminent
  useEffect(() => {
    if (!hasDispatchedInitialAlert && stats.severity === "CRITICAL" && onDispatchAlert) {
      const dynamicAlert: SmartAlert = {
        id: `ALT-QUOTA-PREDICTIVE-${Date.now()}`,
        severity: "CRITICAL",
        title: `Peringatan Proaktif: Kuota Sampah Bulanan Diproyeksikan Terlampaui!`,
        message: `Berdasarkan ${stats.logCount} riwayat setoran (${stats.currentKg} kg dalam ${daysElapsed} hari), rata-rata timbulan Anda adalah ${stats.dailyRate} kg/hari. Diproyeksikan mencapai ${stats.projectedTotal} kg pada akhir September (kuota: ${monthlyLimitKg} kg). Kuota diprediksi habis pada tanggal ${stats.estimatedBreachDay} September 2026 (${stats.daysUntilBreach} hari lagi).`,
        suggestedAction: `Lakukan pengomposan mandiri untuk kategori ${stats.topCategory} dan bawa sampah anorganik ke Bank Sampah Melati sebelum tanggal ${stats.estimatedBreachDay} September.`,
        timestamp: "Prediksi AI Terkini",
        affectedZone: "Batas Kuota Rumah Tangga Cilandak Barat",
      };
      onDispatchAlert(dynamicAlert);
      setHasDispatchedInitialAlert(true);
    }
  }, [stats, hasDispatchedInitialAlert, onDispatchAlert, daysElapsed, monthlyLimitKg]);

  // Trigger audio chime and push notification warning
  const handleTriggerProactiveNotification = () => {
    playCapacityAlertChime(stats.severity === "CRITICAL" ? "CRITICAL" : "WARNING");

    const title =
      stats.severity === "CRITICAL"
        ? "⚠️ Peringatan Dini: Kuota Sampah Bulanan Menipis!"
        : "📊 Laporan Proaktif SiklusKita: Proyeksi Kuota Sampah";

    const body =
      stats.severity === "CRITICAL"
        ? `Laju timbulan harian ${stats.dailyRate} kg/hari. Diproyeksikan mencapai ${stats.projectedTotal} kg (Batas: ${monthlyLimitKg} kg). Diprediksi tembus batas pada ${stats.estimatedBreachDay} September!`
        : `Timbulan terkini ${stats.currentKg} kg (${stats.currentUsagePercent}% dari kuota ${monthlyLimitKg} kg). Pertahankan pola pemilahan Anda.`;

    if (onSendPushNotification) {
      onSendPushNotification(title, body);
    } else if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        new Notification(title, { body, icon: "/favicon.ico" });
      } catch (e) {
        console.warn(e);
      }
    }

    setToastFeedback(`Notifikasi Push Berhasil Dikirim: ${title}`);
    setTimeout(() => setToastFeedback(null), 4500);
  };

  // Quick test: Add simulated new disposal
  const handleQuickAddTestLog = () => {
    if (!onAddWasteLog) return;
    const now = new Date();
    const timeString = `2026-09-13 ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")} WIB`;
    const newLog: WasteLogEntry = {
      id: `log-test-${Date.now()}`,
      timestamp: timeString,
      itemName: "Sisa Makanan Dapur & Kardus Belanja (+3.2 kg)",
      category: "Organik / Sisa Makanan",
      weightKg: 3.2,
      points: 40,
      co2eKg: 3.8,
      facility: "TPS3R Lingkungan RW 04 Cilandak",
      householdId: "HH-CLD-0402",
      synced: true,
      encryptedHash: "test-hash-" + Math.random().toString(36).substring(2, 10),
    };
    onAddWasteLog(newLog);
    setToastFeedback("Data setoran uji coba (+3.2 kg) berhasil ditambahkan! Proyeksi kuota otomatis diperbarui.");
    setTimeout(() => setToastFeedback(null), 4000);
  };

  const cardBase = isDarkMode
    ? "bg-slate-900/90 border-slate-800 text-slate-100"
    : "bg-white border-slate-200/90 text-slate-800 shadow-sm";

  return (
    <div className="space-y-4">
      {/* Toast Feedback */}
      {toastFeedback && (
        <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{toastFeedback}</span>
          </div>
          <button
            onClick={() => setToastFeedback(null)}
            className="text-[11px] px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 🚀 Main Proactive Predictive Card */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border transition-all relative overflow-hidden ${
          stats.severity === "CRITICAL"
            ? isDarkMode
              ? "bg-gradient-to-br from-rose-950/60 via-slate-900 to-amber-950/40 border-rose-800/60 shadow-lg shadow-rose-950/20"
              : "bg-gradient-to-br from-rose-50 via-amber-50/40 to-white border-rose-200/90 shadow-md"
            : stats.severity === "WARNING"
            ? isDarkMode
              ? "bg-gradient-to-br from-amber-950/50 via-slate-900 to-slate-900 border-amber-800/60"
              : "bg-gradient-to-br from-amber-50 via-orange-50/30 to-white border-amber-200/90"
            : isDarkMode
            ? "bg-gradient-to-br from-emerald-950/40 via-slate-900 to-teal-950/30 border-emerald-800/50"
            : "bg-gradient-to-br from-emerald-50 via-teal-50/30 to-white border-emerald-200/90"
        }`}
      >
        {/* Decorative Top Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                stats.severity === "CRITICAL"
                  ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                  : stats.severity === "WARNING"
                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {stats.severity === "CRITICAL" ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                  Peringatan Proaktif AI: Risiko Kuota Terlampaui
                </>
              ) : stats.severity === "WARNING" ? (
                <>
                  <BellRing className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  Perhatian: Laju Timbulan Mendekati Batas Maksimal
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Terkendali: Pola Timbulan Sesuai Target Kuota
                </>
              )}
            </span>

            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Pergub DKI 77/2020 • Jakstrada 30%
            </span>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Atur target kuota bulanan rumah tangga"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Batas: {monthlyLimitKg} kg</span>
              {showConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              onClick={handleTriggerProactiveNotification}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                stats.severity === "CRITICAL"
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
              }`}
              title="Kirim notifikasi push dan bunyikan peringatan audio"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Push Alert</span>
            </button>
          </div>
        </div>

        {/* Prediction Headline & Detailed Warning */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {stats.severity === "CRITICAL" ? (
                <>
                  Diproyeksikan Melebihi Kuota pada{" "}
                  <span className="text-rose-600 dark:text-rose-400 underline decoration-wavy decoration-rose-500">
                    {stats.estimatedBreachDay} September 2026
                  </span>{" "}
                  ({stats.daysUntilBreach} hari lagi)!
                </>
              ) : stats.severity === "WARNING" ? (
                <>
                  Laju Timbulan Mencapai {stats.projectedUsagePercent}% dari Kuota Bulanan
                </>
              ) : (
                <>
                  Pola Timbulan Hemat: Proyeksi Akhir Bulan {stats.projectedTotal} kg / {monthlyLimitKg} kg
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Berdasarkan <span className="font-bold text-slate-900 dark:text-white">{stats.logCount} riwayat setoran sampah</span> selama 13 hari pertama September 2026, 
              akumulasi sampah rumah tangga Anda mencapai{" "}
              <span className="font-bold text-slate-900 dark:text-white">{stats.currentKg} kg</span> (rata-rata{" "}
              <span className="font-bold text-slate-900 dark:text-white">{stats.dailyRate} kg/hari</span>). Jika laju ini berlanjut selama 17 hari ke depan, 
              total timbulan diproyeksikan mencapai{" "}
              <span className={`font-bold ${stats.severity === "CRITICAL" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                {stats.projectedTotal} kg
              </span>{" "}
              {stats.overageKg > 0 ? (
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  (Melampaui batas kuota sebesar +{stats.overageKg} kg atau {stats.projectedUsagePercent}%)
                </span>
              ) : (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  (Aman, tersisa ruang {Math.round((monthlyLimitKg - stats.projectedTotal) * 10) / 10} kg)
                </span>
              )}.
            </p>

            {/* Quick Stat Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <div className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Hari Berjalan: <strong>13/30 Hari</strong></span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                <span>Laju Harian: <strong>{stats.dailyRate} kg/hari</strong></span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-500" />
                <span>Penyumbang Terbesar: <strong>{stats.topCategory}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Metrics Dial / Radial Summary */}
          <div className="lg:col-span-4 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/90 text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Proyeksi Penggunaan Kuota Bulanan
            </span>

            <div className="relative flex items-center justify-center py-2">
              <div className="text-center">
                <span
                  className={`text-3xl sm:text-4xl font-black font-mono tracking-tight block ${
                    stats.severity === "CRITICAL"
                      ? "text-rose-600 dark:text-rose-400"
                      : stats.severity === "WARNING"
                      ? "text-amber-500"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {stats.projectedUsagePercent}%
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {stats.projectedTotal} kg / {monthlyLimitKg} kg
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">Tercatat Saat Ini:</span>
              <span className="font-bold font-mono">{stats.currentKg} kg ({stats.currentUsagePercent}%)</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Estimasi Tembus Batas:</span>
              <span
                className={`font-bold font-mono ${
                  stats.severity === "CRITICAL" ? "text-rose-600 dark:text-rose-400" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {stats.severity === "CRITICAL" ? `${stats.estimatedBreachDay} Sept 2026` : "Tidak Tembus"}
              </span>
            </div>
          </div>
        </div>

        {/* 📊 High-Precision Visual Projection Bar */}
        <div className="mt-5 space-y-2 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                Timbulan Riil Saat Ini ({stats.currentKg} kg)
              </span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" />
                Proyeksi 17 Hari ke Depan (+{(stats.projectedTotal - stats.currentKg).toFixed(1)} kg)
              </span>
              {stats.overageKg > 0 && (
                <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
                  Kelebihan Kuota (+{stats.overageKg} kg)
                </span>
              )}
            </div>

            <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
              Batas Maksimal Kuota: {monthlyLimitKg} kg
            </span>
          </div>

          {/* Dual Multi-Segment Progress Bar */}
          <div className="relative w-full h-4 rounded-full bg-slate-200 dark:bg-slate-700/90 overflow-hidden shadow-inner flex">
            {/* Current Recorded bar */}
            <div
              className="h-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${Math.min(100, (stats.currentKg / monthlyLimitKg) * 100)}%` }}
              title={`Tercatat: ${stats.currentKg} kg`}
            />

            {/* Projected Safe Addition bar */}
            <div
              className={`h-full transition-all duration-700 ${
                stats.projectedUsagePercent > 100 ? "bg-amber-400" : "bg-teal-400"
              }`}
              style={{
                width: `${Math.min(
                  Math.max(0, 100 - (stats.currentKg / monthlyLimitKg) * 100),
                  ((stats.projectedTotal - stats.currentKg) / monthlyLimitKg) * 100
                )}%`,
              }}
              title={`Proyeksi Lanjutan: +${(stats.projectedTotal - stats.currentKg).toFixed(1)} kg`}
            />

            {/* Overflow Overage bar if > 100% */}
            {stats.projectedUsagePercent > 100 && (
              <div
                className="h-full bg-rose-500 transition-all duration-700 animate-pulse"
                style={{
                  width: `${Math.min(30, ((stats.projectedTotal - monthlyLimitKg) / monthlyLimitKg) * 100)}%`,
                }}
                title={`Kelebihan Kuota: +${stats.overageKg} kg`}
              />
            )}
          </div>

          {/* Legend Markers */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
            <span>0 kg</span>
            <span>25% ({Math.round(monthlyLimitKg * 0.25)} kg)</span>
            <span>50% ({Math.round(monthlyLimitKg * 0.5)} kg)</span>
            <span>75% ({Math.round(monthlyLimitKg * 0.75)} kg)</span>
            <span className="text-slate-900 dark:text-white font-bold">100% ({monthlyLimitKg} kg)</span>
          </div>
        </div>

        {/* 🛠️ Proactive AI Mitigation Actions & Interactive Simulations */}
        <div className="mt-5 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/60 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Rekomendasi Intervensi Proaktif AI (Hindari Pelanggaran Kuota)
              </h4>
            </div>

            {/* Interactive Simulation Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMitigationApplied(!mitigationApplied)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  mitigationApplied
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Leaf className="w-3.5 h-3.5" />
                <span>{mitigationApplied ? "✓ Simulasi Kompos Aktif (-5 kg)" : "Simulasi Kompos Mandiri (-5 kg)"}</span>
              </button>

              <button
                onClick={handleQuickAddTestLog}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                title="Tambah setoran uji coba 3.2 kg untuk menguji sensitivitas model prediksi"
              >
                <PlusCircle className="w-3.5 h-3.5 text-teal-500" />
                <span>Uji Setor +3.2 kg</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  1. Biokonversi Organik Mandiri
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-semibold">-4.5 kg</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                Sisa dapur menyumbang {Math.round((stats.categoryMap["Organik / Sisa Makanan"] / (stats.currentKg || 1)) * 100)}% timbulan. Alihkan ke biokonversi maggot BSF Pondok Labu untuk memotong timbulan residu secara drastis.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400">
                  2. Pipihkan &amp; Setor ke Bank Sampah
                </span>
                <span className="text-[10px] font-mono text-cyan-600 font-semibold">+35 Poin</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                Botol plastik PET &amp; kardus kemasan belanja jangan dibuang ke tempat sampah umum. Setorkan terpilah ke Bank Sampah Melati RW 04 setiap hari Minggu.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-500/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400">
                  3. Audit Belanja Anti-Food Waste
                </span>
                <span className="text-[10px] font-mono text-purple-600 font-semibold">Zero Residu</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                Gunakan wadah guna ulang untuk belanja pasar dan buat menu mingguan terjadwal guna menekan potensi makanan basi sebelum sempat dikonsumsi.
              </p>
            </div>
          </div>
        </div>

        {/* ⚙️ Expandable Quota Configuration Panel */}
        {showConfig && (
          <div className="mt-4 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Konfigurasi Kuota Batas Timbulan Sampah Bulanan
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pilih acuan standar atau sesuaikan dengan jumlah anggota keluarga Anda
                </p>
              </div>
              <button
                onClick={() => setMonthlyLimitKg(35)}
                className="text-xs text-slate-400 hover:text-emerald-500 flex items-center gap-1 cursor-pointer"
                title="Kembalikan ke standar 35 kg"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Standar</span>
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {QUOTA_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setMonthlyLimitKg(preset.limitKg)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    monthlyLimitKg === preset.limitKg
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 shadow-xs"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{preset.label}</span>
                    <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {preset.limitKg} kg
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {preset.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Custom Slider */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Sesuaikan Batas Kustom Manual:
                </span>
                <span className="font-black font-mono text-sm text-emerald-600 dark:text-emerald-400">
                  {monthlyLimitKg} kg / bulan
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="80"
                step="1"
                value={monthlyLimitKg}
                onChange={(e) => setMonthlyLimitKg(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>15 kg (Ultra Minimalis)</span>
                <span>35 kg (Standar RW 04)</span>
                <span>80 kg (Keluarga Besar)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
