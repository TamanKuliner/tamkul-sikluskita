/**
 * System Performance & Circular Monitoring Dashboard
 * Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState, useMemo } from "react";
import {
  Activity,
  BarChart2,
  MapPin,
  TrendingUp,
  Recycle,
  Leaf,
  Users,
  Building2,
  Clock,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  SlidersHorizontal,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { JAKARTA_STATISTICS, CIRCULAR_FACILITIES } from "../data/mockData";
import { WasteLogEntry } from "../types";
import { CircularImpactCalculator } from "./CircularImpactCalculator";
import { WeeklyCarbonTrendChart } from "./WeeklyCarbonTrendChart";
import { HouseholdWasteDonutChart } from "./HouseholdWasteDonutChart";
import {
  WasteCategoryFilterBar,
  WasteCategoryFilterKey,
  matchesCategoryFilter,
} from "./WasteCategoryFilterBar";
import { PersonalWasteGoal } from "./PersonalWasteGoal";
import { DailyWasteReductionGoal } from "./DailyWasteReductionGoal";
import { WeeklySustainabilitySummary } from "./WeeklySustainabilitySummary";
import { RecyclingMilestoneCard } from "./RecyclingMilestoneCard";
import { UserMilestoneBadgeSystem } from "./UserMilestoneBadgeSystem";
import { AIWasteTrendPredictor } from "./AIWasteTrendPredictor";
import { WasteProductionForecast } from "./WasteProductionForecast";
import { CircularEconomyDailyInsight } from "./CircularEconomyDailyInsight";
import { WasteInfrastructureMap } from "./WasteInfrastructureMap";
import { MonthlyReportDownloadModal } from "./MonthlyReportDownloadModal";
import { ExportDataModal } from "./ExportDataModal";
import { EnvironmentalImpactBadges } from "./EnvironmentalImpactBadges";
import { WasteWallet } from "./WasteWallet";
import { CommunityLeaderboard } from "./CommunityLeaderboard";
import { generateMonthlyWasteReportPDF } from "../utils/pdfReportGenerator";
import { downloadWasteLogsCSV } from "../utils/csvExporter";

interface MonitoringViewProps {
  isDarkMode: boolean;
  wasteLogs: WasteLogEntry[];
  onAddWasteLog?: (log: WasteLogEntry) => void;
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({
  isDarkMode,
  wasteLogs,
  onAddWasteLog,
}) => {
  const [activeFacilityFilter, setActiveFacilityFilter] = useState<string>("ALL");
  const [selectedFacility, setSelectedFacility] = useState<any>(CIRCULAR_FACILITIES[0]);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isGeneratingQuickPdf, setIsGeneratingQuickPdf] = useState<boolean>(false);
  const [quickDownloadToast, setQuickDownloadToast] = useState<boolean>(false);

  // CSV Export states
  const [isExportCsvModalOpen, setIsExportCsvModalOpen] = useState<boolean>(false);
  const [isQuickExportingCsv, setIsQuickExportingCsv] = useState<boolean>(false);
  const [quickCsvToast, setQuickCsvToast] = useState<boolean>(false);

  // Waste category filter states
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState<WasteCategoryFilterKey[]>(["ALL"]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);

  const handleToggleCategory = (key: WasteCategoryFilterKey) => {
    if (key === "ALL") {
      setSelectedCategoryFilters(["ALL"]);
      return;
    }

    if (isMultiSelectMode) {
      let updated: WasteCategoryFilterKey[];
      if (selectedCategoryFilters.includes(key)) {
        updated = selectedCategoryFilters.filter((k) => k !== key);
        if (updated.length === 0) updated = ["ALL"];
      } else {
        updated = selectedCategoryFilters.filter((k) => k !== "ALL").concat(key);
      }
      setSelectedCategoryFilters(updated);
    } else {
      // Single category isolation mode: clicking the currently active one clears back to ALL
      if (selectedCategoryFilters.length === 1 && selectedCategoryFilters[0] === key) {
        setSelectedCategoryFilters(["ALL"]);
      } else {
        setSelectedCategoryFilters([key]);
      }
    }
  };

  const handleResetFilters = () => {
    setSelectedCategoryFilters(["ALL"]);
  };

  // Derive isolated waste logs according to active filters
  const filteredWasteLogs = useMemo(() => {
    if (selectedCategoryFilters.includes("ALL") || selectedCategoryFilters.length === 0) {
      return wasteLogs;
    }
    return wasteLogs.filter((log) =>
      selectedCategoryFilters.some((catKey) => matchesCategoryFilter(log.category, catKey))
    );
  }, [wasteLogs, selectedCategoryFilters]);

  const handleQuickDownload = async () => {
    try {
      setIsGeneratingQuickPdf(true);
      await new Promise((resolve) => setTimeout(resolve, 350));
      const doc = generateMonthlyWasteReportPDF(filteredWasteLogs, {
        monthName: "September",
        year: 2026,
        householdName: "Ibu Sari (Komunitas RT 02 / RW 04)",
        householdId: "HH-CLD-0402",
        neighborhood: "Cilandak Barat, Jakarta Selatan, DKI Jakarta",
        includeSignatures: true,
        includeAiInsights: true,
        includeHashes: true,
      });
      doc.save("Laporan_Sirkular_September_2026_HH-CLD-0402.pdf");
      setQuickDownloadToast(true);
      setTimeout(() => setQuickDownloadToast(false), 4500);
    } catch (error) {
      console.error("Gagal mengunduh laporan PDF:", error);
    } finally {
      setIsGeneratingQuickPdf(false);
    }
  };

  const handleQuickExportCsv = async () => {
    try {
      setIsQuickExportingCsv(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      downloadWasteLogsCSV(filteredWasteLogs);
      setQuickCsvToast(true);
      setTimeout(() => setQuickCsvToast(false), 4500);
    } catch (error) {
      console.error("Gagal mengekspor data CSV:", error);
    } finally {
      setIsQuickExportingCsv(false);
    }
  };

  const filteredFacilities = CIRCULAR_FACILITIES.filter((fac) => {
    if (activeFacilityFilter === "ALL") return true;
    return fac.type.toLowerCase().includes(activeFacilityFilter.toLowerCase());
  });

  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  return (
    <div className="space-y-6">
      {/* Top Banner Context */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkMode
          ? "bg-gradient-to-r from-teal-950/40 via-slate-900 to-emerald-950/30 border-teal-900/50"
          : "bg-gradient-to-r from-teal-50 via-white to-emerald-50 border-teal-100 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400">
                <Activity className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Dasbor Monitoring Performa Sistem & Ekonomi Sirkular DKI Jakarta
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Pemantauan menyeluruh dan intuitif terhadap laju pemilahan sampah, kapasitas penampungan TPS3R/Bank Sampah, serta dampak nyata penurunan beban TPA Bantar Gebang.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="hidden sm:inline-flex px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30">
              Target 2030: -30% Emisi
            </span>

            {/* Quick Export CSV Button */}
            <button
              id="btn-quick-export-csv"
              onClick={handleQuickExportCsv}
              disabled={isQuickExportingCsv}
              title="Unduh langsung file CSV log sampah untuk pencatatan pribadi di Excel"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 active:scale-95 text-white shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isQuickExportingCsv ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyiapkan CSV...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Ekspor Data (CSV)</span>
                </>
              )}
            </button>

            {/* Quick Download PDF Button */}
            <button
              id="btn-quick-download-pdf"
              onClick={handleQuickDownload}
              disabled={isGeneratingQuickPdf}
              title="Unduh langsung ringkasan PDF log sampah bulan September 2026"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingQuickPdf ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyiapkan PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Laporan PDF</span>
                </>
              )}
            </button>

            {/* Configure CSV Export / Report Modal Button */}
            <button
              id="btn-configure-csv-export"
              onClick={() => setIsExportCsvModalOpen(true)}
              title="Kustomisasi opsi pemisah dan kolom ekspor CSV"
              className="p-2 rounded-xl border border-teal-500/30 bg-white/80 dark:bg-slate-800/80 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CSV Download Success Toast */}
        {quickCsvToast && (
          <div
            id="quick-csv-toast"
            className="mt-3.5 p-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-800 dark:text-teal-200 flex items-center justify-between text-xs font-medium animate-in fade-in"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <div>
                <span className="font-bold">Data CSV Berhasil Diekspor!</span> File rekapitulasi log sampah (
                {filteredWasteLogs.length} rekaman) tersimpan di perangkat Anda untuk pencatatan pribadi di Excel atau Spreadsheet.
              </div>
            </div>
            <button
              onClick={() => setQuickCsvToast(false)}
              className="text-xs text-teal-700 dark:text-teal-300 font-semibold hover:underline ml-2"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Success Toast Banner */}
        {quickDownloadToast && (
          <div
            id="quick-download-toast"
            className="mt-3.5 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 flex items-center justify-between text-xs font-medium animate-in fade-in"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">Laporan PDF Berhasil Diunduh!</span> File rekapitulasi sampah bulanan
                (September 2026) tersimpan di perangkat Anda.
              </div>
            </div>
            <button
              onClick={() => setQuickDownloadToast(false)}
              className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold hover:underline ml-2"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* High-Level Impact Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`p-4 rounded-xl border ${cardBase}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Timbulan Harian Jakarta</span>
            <Building2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              10,600+
            </span>
            <span className="text-xs text-slate-500 font-medium">Ton / Hari</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">11.2 juta penduduk DKI Jakarta</p>
        </div>

        <div className={`p-4 rounded-xl border ${cardBase}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Tingkat Pilah Sumber</span>
            <Recycle className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-teal-600 dark:text-teal-400">
              {JAKARTA_STATISTICS.sourceSeparationCurrent}%
            </span>
            <span className="text-xs text-teal-600 font-medium">Sedang Tumbuh</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Target SiklusKita: 38% di area pilot</p>
        </div>

        <div className={`p-4 rounded-xl border ${cardBase}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Dampak Tereduksi Pilot</span>
            <Leaf className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              3.4 Ton
            </span>
            <span className="text-xs text-emerald-600 font-medium">/ Hari</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Area Cilandak & Pondok Labu</p>
        </div>

        <div className={`p-4 rounded-xl border ${cardBase}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Rumah Tangga Aktif</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
              1,240
            </span>
            <span className="text-xs text-blue-600 font-medium">Kepala Keluarga</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Target 6 bulan: 1,000 KK (Tercapai!)</p>
        </div>
      </div>

      {/* 🎛️ Interactive Waste Category Toggle Filters (Isolate Plastic, Organic, Paper, Metal & Glass, Hazardous) */}
      <WasteCategoryFilterBar
        wasteLogs={wasteLogs}
        isDarkMode={isDarkMode}
        selectedCategories={selectedCategoryFilters}
        onToggleCategory={handleToggleCategory}
        onResetFilters={handleResetFilters}
        isMultiSelectMode={isMultiSelectMode}
        onToggleMultiSelectMode={() => setIsMultiSelectMode((prev) => !prev)}
      />

      {/* 🎯 Daily Waste Reduction Goal & Real-Time Progress Bar */}
      <DailyWasteReductionGoal
        wasteLogs={filteredWasteLogs}
        isDarkMode={isDarkMode}
        onAddWasteLog={onAddWasteLog}
      />

      {/* 💰 Waste Wallet & Circular Credits Redemption (Accrued recycling points & partner merchant offers) */}
      <WasteWallet wasteLogs={wasteLogs} isDarkMode={isDarkMode} />

      {/* 🏆 Community Leaderboard (Relative performance rankings among local households using anonymized participation data) */}
      <CommunityLeaderboard wasteLogs={wasteLogs} isDarkMode={isDarkMode} />

      {/* 🎯 Personal Waste Reduction Goal & Monthly Progress Tracker */}
      <PersonalWasteGoal wasteLogs={filteredWasteLogs} isDarkMode={isDarkMode} />

      {/* 🌳 Weekly Sustainability Summary (Analyzes waste diverted & calculates equivalent trees saved / carbon offset) */}
      <WeeklySustainabilitySummary wasteLogs={filteredWasteLogs} isDarkMode={isDarkMode} />

      {/* 🏆 Recycling Milestone Card - Displays unlockable achievements based on historical waste reduction metrics */}
      <RecyclingMilestoneCard
        wasteLogs={filteredWasteLogs}
        isDarkMode={isDarkMode}
        onAddWasteLog={onAddWasteLog}
      />

      {/* 🏅 Digital Milestone Badge System (Awards digital icons for milestones: 100kg Diverted, Zero-Waste Month, etc.) */}
      <UserMilestoneBadgeSystem wasteLogs={filteredWasteLogs} isDarkMode={isDarkMode} />

      {/* 🌿 Circular Impact Calculator (Cumulative Carbon & Resource Recovery from Waste Logs) */}
      <CircularImpactCalculator wasteLogs={filteredWasteLogs} isDarkMode={isDarkMode} />

      {/* 📈 Weekly Carbon Savings Trend Line Chart (Recharts) */}
      <WeeklyCarbonTrendChart wasteLogs={filteredWasteLogs} isDarkMode={isDarkMode} />

      {/* 🍩 Visual Breakdown of Household Waste Types (Recharts Donut Chart) */}
      <HouseholdWasteDonutChart
        wasteLogs={filteredWasteLogs}
        isDarkMode={isDarkMode}
        activeCategoryFilter={selectedCategoryFilters.length === 1 ? selectedCategoryFilters[0] : null}
        onSelectCategoryFilter={(key) => handleToggleCategory(key as any)}
      />

      {/* 🏅 Real-World Environmental Impact Badges (Dynamically calculated based on waste category filters) */}
      <EnvironmentalImpactBadges
        wasteLogs={filteredWasteLogs}
        allLogs={wasteLogs}
        activeCategories={selectedCategoryFilters}
        isDarkMode={isDarkMode}
        onSelectCategory={handleToggleCategory}
      />

      {/* 💡 Circular Economy Daily Insight (Daily Upcycling Project & Zero-Waste Tips by Gemini AI) */}
      <CircularEconomyDailyInsight
        wasteLogs={filteredWasteLogs}
        isDarkMode={isDarkMode}
        currentCategoryFilter={selectedCategoryFilters.length === 1 ? selectedCategoryFilters[0] : null}
      />

      {/* 🔮 Waste Production Forecast (Gemini 3.8 Flash AI API Projection & Disposal Needs) */}
      <WasteProductionForecast wasteLogs={filteredWasteLogs} isDarkMode={isDarkMode} />

      {/* 🤖 AI Waste Trend Predictor (4-Week Accumulation Forecasting & Seasonal Mitigation) */}
      <AIWasteTrendPredictor wasteLogs={filteredWasteLogs} isDarkMode={isDarkMode} />

      {/* 🗺️ Interactive Waste Infrastructure Map with D3.js (Bank Sampah Locations, Status, & Drop-off Density Hotspots) */}
      <WasteInfrastructureMap isDarkMode={isDarkMode} />

      {/* Composition & Circular Chain Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Jakarta Municipal Waste Composition (Slide 2) */}
        <div className={`lg:col-span-6 p-5 rounded-2xl border ${cardBase} space-y-4`}>
          <div className="flex items-center justify-between border-b pb-3 dark:border-slate-700">
            <div>
              <h3 className="font-semibold text-sm">Komposisi Sampah Domestik DKI Jakarta</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sumber: DLH DKI Jakarta & Jakarta Climate Action Plan</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
              BPS 2024
            </span>
          </div>

          <div className="space-y-3">
            {JAKARTA_STATISTICS.composition.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.type}</span>
                  </span>
                  <span className="font-bold">{item.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>{item.notes}</span>
                  <span>Est. {((item.percentage / 100) * 10600).toFixed(0)} Ton/hari</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-200">
            <span className="font-bold">Insight Penting:</span> 52% sampah Jakarta adalah organik. Dengan solusi biokonversi BSF Maggot & komposting skala RW dari SiklusKita, separuh beban timbulan tidak perlu mencemari TPA Bantar Gebang.
          </div>
        </div>

        {/* Right: Circular Stakeholder System Flow (Slide 4 & 5) */}
        <div className={`lg:col-span-6 p-5 rounded-2xl border ${cardBase} space-y-4`}>
          <div className="flex items-center justify-between border-b pb-3 dark:border-slate-700">
            <div>
              <h3 className="font-semibold text-sm">Alur Ekosistem Sirkular (Connecting the Link)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upstream → Midstream → Downstream</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Verified Recovery
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-emerald-600 uppercase">1. Upstream (Kebijakan)</span>
                <div className="font-bold">Pemda DKI Jakarta & Regulasi Pergub 77/2020</div>
                <div className="text-[11px] text-slate-400">Pemberian regulasi, infrastruktur TPS3R & integrasi data</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-emerald-600 uppercase">2. Midstream (Perilaku Warga)</span>
                <div className="font-bold text-emerald-700 dark:text-emerald-300">SiklusKita: Behavioral Layer & Connector</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">Memandu 1,240 KK memilah di sumber lewat AI Scanner & reward</div>
              </div>
              <Activity className="w-5 h-5 text-emerald-500 flex-shrink-0 animate-pulse" />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-teal-600 uppercase">3. Midstream (Koleksi & Verifikasi)</span>
                <div className="font-bold">Bank Sampah Melati & Pengelola Kompos RW</div>
                <div className="text-[11px] text-slate-400">Penimbangan akurat, pencatatan E2EE & pengolahan larva BSF</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-blue-600 uppercase">4. Downstream (End Market Recycler)</span>
                <div className="font-bold">Mitra Industri Daur Ulang Plastik & Pabrik Pakan</div>
                <div className="text-[11px] text-slate-400">Menghasilkan bijih rPET tekstil & pelet pakan hewani berprotein tinggi</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Facility Network & Interactive Map Node View */}
      <div className={`p-5 rounded-2xl border ${cardBase} space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-sm">Jaringan Fasilitas Sirkular DKI Jakarta</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monitoring langsung kapasitas penampungan Bank Sampah, Biokonversi Maggot, dan TPS3R
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "ALL", label: "Semua Fasilitas" },
              { id: "Bank Sampah", label: "Bank Sampah" },
              { id: "Organik", label: "Pusat Organik / BSF" },
              { id: "TPS3R", label: "TPS3R" },
              { id: "B3", label: "Drop-box B3" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFacilityFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition ${
                  activeFacilityFilter === f.id
                    ? "bg-emerald-600 text-white font-medium"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredFacilities.map((facility) => {
            const isSelected = selectedFacility?.id === facility.id;
            return (
              <div
                key={facility.id}
                onClick={() => setSelectedFacility(facility)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                    : "border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {facility.type}
                  </span>
                  <span className={`text-[10px] font-bold ${
                    facility.status === "SURGE_WARNING" ? "text-amber-500" : "text-emerald-500"
                  }`}>
                    {facility.status === "SURGE_WARNING" ? "Penuh 88%" : "Buka"}
                  </span>
                </div>

                <div className="font-semibold text-xs mt-2 text-slate-800 dark:text-slate-100 truncate">
                  {facility.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  <span>{facility.distanceKm} km • {facility.address}</span>
                </div>

                <div className="mt-3 pt-2 border-t dark:border-slate-700/60">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">Kapasitas Muatan:</span>
                    <span className="font-semibold">{facility.capacityPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        facility.capacityPercent > 80
                          ? "bg-rose-500"
                          : facility.capacityPercent > 60
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${facility.capacityPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Circular Audit Ledger Stream */}
        <div className="pt-2 border-t dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Transaksi Terkini (Buku Kas Sirkular):
              </span>
              <span className="text-[10px] text-emerald-600 font-mono">Terenkripsi E2EE SHA-256</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-export-csv-ledger"
                onClick={() => setIsExportCsvModalOpen(true)}
                className="self-start sm:self-auto px-2.5 py-1 rounded-lg text-xs font-medium border border-teal-500/30 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Ekspor CSV</span>
              </button>

              <button
                id="btn-export-pdf-ledger"
                onClick={() => setIsReportModalOpen(true)}
                className="self-start sm:self-auto px-2.5 py-1 rounded-lg text-xs font-medium border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Laporan PDF</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {wasteLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{log.itemName}</span>
                    <span className="text-[10px] text-slate-400 ml-2">({log.category})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      +{log.points} Pts
                    </span>
                    <span className="text-[10px] text-slate-400 block">{log.weightKg} kg</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                    {log.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Monthly Report Download & Preview Modal */}
      <MonthlyReportDownloadModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        wasteLogs={wasteLogs}
        isDarkMode={isDarkMode}
      />

      {/* CSV Export Data Modal for Personal Record-Keeping */}
      <ExportDataModal
        isOpen={isExportCsvModalOpen}
        onClose={() => setIsExportCsvModalOpen(false)}
        filteredLogs={filteredWasteLogs}
        allLogs={wasteLogs}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
