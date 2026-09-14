/**
 * Circular Economy Daily Insight Component
 * Fetches and displays a daily upcycling project and zero-waste tip powered by the Gemini 3.8 Flash AI API.
 * Fahira Shanin Nadifa & Tim | Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Sparkles,
  Bot,
  Recycle,
  Leaf,
  Clock,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
  Coins,
  MapPin,
  Flame,
  ArrowRight,
  Hammer,
  Check,
  Share2,
  Award,
  Layers,
  HelpCircle,
} from "lucide-react";
import { WasteLogEntry } from "../types";

interface CircularEconomyDailyInsightProps {
  wasteLogs: WasteLogEntry[];
  isDarkMode: boolean;
  currentCategoryFilter?: string | null;
}

export interface UpcyclingInsightData {
  date: string;
  topicTitle: string;
  wasteType: string;
  difficultyLevel: "MUDAH" | "MENENGAH" | "KREATIF";
  estimatedTimeMinutes: number;
  upcyclingIdea: {
    title: string;
    description: string;
    materialsNeeded: string[];
    steps: string[];
    resultProduct: string;
  };
  environmentalImpact: {
    co2SavedKg: number;
    divertedGrams: number;
    ecoFact: string;
  };
  economicValue: string;
  localJakartaContext: string;
  callToAction: string;
}

const CATEGORY_CHOICES = [
  { key: "Semua Kategori", label: "Semua Bahan" },
  { key: "Plastik", label: "Plastik (PET/HDPE)" },
  { key: "Organik", label: "Organik Dapur" },
  { key: "Kertas", label: "Kertas & Kardus" },
  { key: "Logam & Kaca", label: "Logam & Beling" },
];

export const CircularEconomyDailyInsight: React.FC<CircularEconomyDailyInsightProps> = ({
  wasteLogs,
  isDarkMode,
  currentCategoryFilter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua Kategori");
  const [insight, setInsight] = useState<UpcyclingInsightData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [engineSource, setEngineSource] = useState<string>("gemini-ai");
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [hasCompletedProject, setHasCompletedProject] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Sync category with external filter if passed
  useEffect(() => {
    if (currentCategoryFilter && currentCategoryFilter !== "ALL") {
      const match = CATEGORY_CHOICES.find((c) =>
        c.key.toLowerCase().includes(currentCategoryFilter.toLowerCase())
      );
      if (match) {
        setSelectedCategory(match.key);
      }
    }
  }, [currentCategoryFilter]);

  // Aggregate user's top recent waste items for prompt context
  const recentWasteContext = useMemo(() => {
    if (!wasteLogs || wasteLogs.length === 0) {
      return "Botol PET, Kardus E-Commerce, Sisa Sayuran Dapur";
    }
    const categories = Array.from(new Set(wasteLogs.map((l) => l.category))).slice(0, 3);
    return categories.join(", ");
  }, [wasteLogs]);

  // Fetch daily insight from server (Gemini AI API)
  const fetchInsight = useCallback(async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch("/api/ai/daily-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory,
          date: today,
          recentWasteTypes: recentWasteContext,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const result = await res.json();
      if (result.success && result.data) {
        setInsight(result.data);
        setEngineSource(result.source || "gemini-ai");
        setCompletedSteps({});
        setHasCompletedProject(false);
      }
    } catch (err) {
      console.warn("Failed to fetch daily circular insight:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, recentWasteContext]);

  useEffect(() => {
    fetchInsight();
  }, [fetchInsight]);

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleShareOrCopy = () => {
    if (!insight) return;
    const text = `🌱 Ide Sirkular Hari Ini: ${insight.topicTitle}\n` +
      `Bahan: ${insight.wasteType}\n` +
      `Hasil: ${insight.upcyclingIdea.resultProduct}\n` +
      `Penghematan: ${insight.economicValue}\n` +
      `SiklusKita Greeneration 2026`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const cardBase = isDarkMode
    ? "bg-slate-800/90 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/90 text-slate-900 shadow-xs";

  const renderDifficulty = (diff: string) => {
    switch (diff) {
      case "MUDAH":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
            Tingkat: Mudah
          </span>
        );
      case "KREATIF":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300">
            Tingkat: Kreatif &amp; Artistik
          </span>
        );
      case "MENENGAH":
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
            Tingkat: Menengah
          </span>
        );
    }
  };

  return (
    <div className={`p-6 rounded-2xl border ${cardBase} space-y-5 transition-all duration-300`}>
      {/* Top Bar: Title, Engine Badge, and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 dark:border-slate-700/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                <span>Circular Economy Daily Insight</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-linear-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  Gemini 3.8 Flash AI
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inspirasi harian pemanfaatan kembali (upcycling) limbah rumah tangga bernilai ekonomi &amp; ramah lingkungan
              </p>
            </div>
          </div>
        </div>

        {/* Refresh button & Share */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareOrCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Salin ringkasan ide sirkular"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copySuccess ? "Tersalin!" : "Bagikan"}</span>
          </button>

          <button
            onClick={fetchInsight}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all disabled:opacity-50 shadow-xs"
            title="Dapatkan ide baru dari Gemini AI"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Memuat..." : "Ide Baru"}</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 text-[11px] font-medium shrink-0 mr-1">Fokus Bahan:</span>
        {CATEGORY_CHOICES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap text-xs transition cursor-pointer ${
              selectedCategory === cat.key
                ? "bg-emerald-600 text-white shadow-xs font-semibold"
                : "bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Feature Content Card */}
      {insight && (
        <div className="space-y-4">
          {/* Topic Hero Card */}
          <div className="p-4 rounded-xl bg-linear-to-r from-emerald-500/5 via-teal-500/5 to-slate-500/5 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-slate-900/30 border border-emerald-500/20 dark:border-emerald-500/10 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Target Material:
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  {insight.wasteType}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {renderDifficulty(insight.difficultyLevel)}
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  <Clock className="w-3 h-3" />
                  {insight.estimatedTimeMinutes} Menit
                </span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {insight.topicTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {insight.upcyclingIdea.description}
            </p>
          </div>

          {/* Grid Layout: Left (Project Blueprint & Steps) vs Right (Impact & Local Context) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column (7 cols): Step-by-step DIY Blueprint */}
            <div className="lg:col-span-7 space-y-3.5">
              {/* Materials Pill List */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/50 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Hammer className="w-3.5 h-3.5 text-emerald-600" />
                  Alat &amp; Bahan Sederhana yang Diperlukan:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {insight.upcyclingIdea.materialsNeeded.map((mat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      • {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Numbered Steps */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Langkah Pembuatan Upcycling:</span>
                  <span>Klik langkah yang telah diselesaikan</span>
                </div>

                <div className="space-y-2">
                  {insight.upcyclingIdea.steps.map((step, idx) => {
                    const isDone = Boolean(completedSteps[idx]);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          isDone
                            ? "bg-emerald-500/10 border-emerald-500/30 text-slate-900 dark:text-white"
                            : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold transition-all ${
                            isDone
                              ? "bg-emerald-600 text-white"
                              : "border border-slate-300 dark:border-slate-600 text-slate-500"
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <p className={`text-xs leading-relaxed flex-1 ${isDone ? "line-through opacity-80" : ""}`}>
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Result Product Banner */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Hasil Akhir: <strong className="text-emerald-700 dark:text-emerald-300">{insight.upcyclingIdea.resultProduct}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setHasCompletedProject(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    hasCompletedProject
                      ? "bg-emerald-600 text-white cursor-default"
                      : "bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                  }`}
                >
                  {hasCompletedProject ? "✓ Telah Dibuat!" : "Tandai Selesai"}
                </button>
              </div>
            </div>

            {/* Right Column (5 cols): Environmental & Economic Metrics */}
            <div className="lg:col-span-5 space-y-3">
              {/* Eco & Financial Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Cegah Emisi</span>
                    <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                    {insight.environmentalImpact.co2SavedKg} <span className="text-xs font-normal">kg CO2e</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Dari TPA Bantar Gebang</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Limbah Dialihkan</span>
                    <Recycle className="w-3.5 h-3.5 text-teal-500" />
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                    {insight.environmentalImpact.divertedGrams} <span className="text-xs font-normal">gram</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Dimanfaatkan kembali</p>
                </div>
              </div>

              {/* Economic Value */}
              <div className="p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Nilai Manfaat Ekonomis:</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {insight.economicValue}
                </p>
              </div>

              {/* Local Jakarta Context */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Konteks Komunitas DKI Jakarta:</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {insight.localJakartaContext}
                </p>
              </div>

              {/* Scientific Eco Fact */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Fakta Lingkungan Sirkular:</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  "{insight.environmentalImpact.ecoFact}"
                </p>
              </div>

              {/* Motivation Call to Action */}
              <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs space-y-1 shadow-xs">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Aksi Nyata Hari Ini:</span>
                </div>
                <p className="text-emerald-50 leading-relaxed">
                  {insight.callToAction}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
