/**
 * Household Waste Composition Donut Chart Component
 * Visual breakdown of waste types collected by the household using Recharts.
 * Greeneration Circle 2026 | SiklusKita DKI Jakarta
 */

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Sector,
} from "recharts";
import {
  PieChart as PieIcon,
  Leaf,
  Package,
  FileText,
  Boxes,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Scale,
  CloudSun,
  Award,
  Info,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { WasteLogEntry } from "../types";

interface HouseholdWasteDonutChartProps {
  wasteLogs: WasteLogEntry[];
  isDarkMode: boolean;
  activeCategoryFilter?: string | null;
  onSelectCategoryFilter?: (key: string) => void;
}

type MetricMode = "WEIGHT" | "CO2E" | "COUNT";

interface CategoryData {
  name: string;
  shortName: string;
  categoryKey: string;
  value: number; // dynamically mapped based on activeMetric
  weightKg: number;
  co2eKg: number;
  count: number;
  points: number;
  percentage: number;
  color: string;
  darkColor: string;
  gradientFrom: string;
  gradientTo: string;
  icon: React.ComponentType<{ className?: string }>;
  destination: string;
  dkiBenchmarkPct: number; // Comparison with DKI 2024 municipal average
  tips: string;
}

// Color scheme aligned with circular waste streams
const CATEGORY_CONFIG: Record<
  string,
  {
    shortName: string;
    color: string;
    darkColor: string;
    gradientFrom: string;
    gradientTo: string;
    icon: React.ComponentType<{ className?: string }>;
    destination: string;
    dkiBenchmarkPct: number;
    tips: string;
  }
> = {
  "Organik / Sisa Makanan": {
    shortName: "Organik",
    color: "#10b981", // Emerald 500
    darkColor: "#34d399",
    gradientFrom: "#10b981",
    gradientTo: "#059669",
    icon: Leaf,
    destination: "Biokonversi Maggot BSF & Bioreaktor Kompos RW 04",
    dkiBenchmarkPct: 52.3,
    tips: "Telah dialihkan dari pembusukan anaerobik di TPA Bantar Gebang.",
  },
  "Plastik (PET/HDPE)": {
    shortName: "Plastik",
    color: "#0284c7", // Sky 600
    darkColor: "#38bdf8",
    gradientFrom: "#0284c7",
    gradientTo: "#0369a1",
    icon: Package,
    destination: "Pencucian & Daur Ulang Mekanis (Bank Sampah Melati)",
    dkiBenchmarkPct: 20.4,
    tips: "Pilah bersih & pipihkan untuk menghemat ruang tampung wadah.",
  },
  "Kertas & Karton": {
    shortName: "Kertas/Karton",
    color: "#f59e0b", // Amber 500
    darkColor: "#fbbf24",
    gradientFrom: "#f59e0b",
    gradientTo: "#d97706",
    icon: FileText,
    destination: "Pabrik Kertas Sirkular Mitra & Bank Sampah Induk",
    dkiBenchmarkPct: 15.8,
    tips: "Jaga tetap kering dan ikat rapi agar bernilai jual maksimal.",
  },
  "Logam & Kaca": {
    shortName: "Logam & Kaca",
    color: "#8b5cf6", // Purple 500
    darkColor: "#a78bfa",
    gradientFrom: "#8b5cf6",
    gradientTo: "#7c3aed",
    icon: Boxes,
    destination: "Drop-box Logam Komunal & Peleburan Kaca Bersih",
    dkiBenchmarkPct: 4.8,
    tips: "Cuci residu cairan sebelum drop-off untuk sterilisasi higienis.",
  },
  "B3 & Residu": {
    shortName: "B3 & Residu",
    color: "#f43f5e", // Rose 500
    darkColor: "#fb7185",
    gradientFrom: "#f43f5e",
    gradientTo: "#e11d48",
    icon: AlertTriangle,
    destination: "Drop-box B3 RT/RW & Pengolahan Berlisensi Pemprov",
    dkiBenchmarkPct: 6.7,
    tips: "Simpan dalam wadah terisolasi aman dari jangkauan anak-anak.",
  },
};

// Render active enlarged shape on slice hover
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props;

  return (
    <g>
      {/* Soft outer glow halo */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 2}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        fillOpacity={0.25}
      />
      {/* Main expanded sector */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 3}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export const HouseholdWasteDonutChart: React.FC<HouseholdWasteDonutChartProps> = ({
  wasteLogs,
  isDarkMode,
  activeCategoryFilter,
  onSelectCategoryFilter,
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>("WEIGHT");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [timeFilter, setTimeFilter] = useState<"ALL" | "MONTH" | "WEEK">("ALL");

  // Filter logs according to selected time frame
  const filteredLogs = useMemo(() => {
    if (timeFilter === "ALL") return wasteLogs;
    if (timeFilter === "MONTH") {
      // 2026-09
      return wasteLogs.filter((l) => l.timestamp.includes("2026-09") || l.timestamp.includes("September"));
    }
    // WEEK (last 7 days / recent items)
    return wasteLogs.slice(0, 5);
  }, [wasteLogs, timeFilter]);

  // Aggregate stats by waste category
  const { chartData, totalMetricValue, totalWeightKg, totalCo2eKg, totalLogsCount, dominantCategory } =
    useMemo(() => {
      const categoryTotals: Record<
        string,
        { weightKg: number; co2eKg: number; count: number; points: number }
      > = {};

      // Initialize with standard categories
      Object.keys(CATEGORY_CONFIG).forEach((cat) => {
        categoryTotals[cat] = { weightKg: 0, co2eKg: 0, count: 0, points: 0 };
      });

      // Aggregate filtered logs
      filteredLogs.forEach((log) => {
        const cat = log.category || "Organik / Sisa Makanan";
        // Match or fallback to nearest category
        let matchedKey = Object.keys(CATEGORY_CONFIG).find(
          (k) => k.toLowerCase() === cat.toLowerCase() || cat.toLowerCase().includes(k.toLowerCase())
        );
        if (!matchedKey) {
          if (cat.includes("Plastik")) matchedKey = "Plastik (PET/HDPE)";
          else if (cat.includes("Organik")) matchedKey = "Organik / Sisa Makanan";
          else if (cat.includes("Kertas")) matchedKey = "Kertas & Karton";
          else if (cat.includes("Logam") || cat.includes("Kaca")) matchedKey = "Logam & Kaca";
          else matchedKey = "B3 & Residu";
        }

        if (!categoryTotals[matchedKey]) {
          categoryTotals[matchedKey] = { weightKg: 0, co2eKg: 0, count: 0, points: 0 };
        }

        categoryTotals[matchedKey].weightKg += log.weightKg || 0;
        categoryTotals[matchedKey].co2eKg += log.co2eKg || 0;
        categoryTotals[matchedKey].count += 1;
        categoryTotals[matchedKey].points += log.points || 0;
      });

      // If user logs have no data in some categories, ensure at least categories with weight > 0 are shown,
      // or if all 0, provide clean baseline representation based on household logs
      const rawCategories = Object.entries(categoryTotals);
      const totalWeight = rawCategories.reduce((acc, [, d]) => acc + d.weightKg, 0);
      const totalCo2 = rawCategories.reduce((acc, [, d]) => acc + d.co2eKg, 0);
      const totalCount = rawCategories.reduce((acc, [, d]) => acc + d.count, 0);

      // Determine active value based on selected metric mode
      const parsedData: CategoryData[] = rawCategories
        .map(([name, data]) => {
          const config = CATEGORY_CONFIG[name] || {
            shortName: name,
            color: "#64748b",
            darkColor: "#94a3b8",
            gradientFrom: "#64748b",
            gradientTo: "#475569",
            icon: Boxes,
            destination: "Fasilitas Komunal",
            dkiBenchmarkPct: 10,
            tips: "Pastikan pemilahan dilakukan secara rutin.",
          };

          let value = 0;
          if (metricMode === "WEIGHT") value = Number(data.weightKg.toFixed(2));
          else if (metricMode === "CO2E") value = Number(data.co2eKg.toFixed(2));
          else value = data.count;

          return {
            name,
            shortName: config.shortName,
            categoryKey: name,
            value,
            weightKg: Number(data.weightKg.toFixed(2)),
            co2eKg: Number(data.co2eKg.toFixed(2)),
            count: data.count,
            points: data.points,
            percentage: 0, // calculated next
            color: isDarkMode ? config.darkColor : config.color,
            darkColor: config.darkColor,
            gradientFrom: config.gradientFrom,
            gradientTo: config.gradientTo,
            icon: config.icon,
            destination: config.destination,
            dkiBenchmarkPct: config.dkiBenchmarkPct,
            tips: config.tips,
          };
        })
        .filter((d) => d.value > 0); // show active streams

      // Fallback if empty
      const activeTotalValue = parsedData.reduce((acc, d) => acc + d.value, 0);

      // Calculate percentages
      parsedData.forEach((item) => {
        item.percentage =
          activeTotalValue > 0 ? Number(((item.value / activeTotalValue) * 100).toFixed(1)) : 0;
      });

      // Sort descending by value
      parsedData.sort((a, b) => b.value - a.value);

      const dominant = parsedData[0] || null;

      return {
        chartData: parsedData,
        totalMetricValue: activeTotalValue,
        totalWeightKg: totalWeight,
        totalCo2eKg: totalCo2,
        totalLogsCount: totalCount,
        dominantCategory: dominant,
      };
    }, [filteredLogs, metricMode, isDarkMode]);

  const activeCategory = chartData[activeIndex] || chartData[0] || null;

  // Synchronize activeIndex when activeCategoryFilter changes from parent
  React.useEffect(() => {
    if (!activeCategoryFilter || activeCategoryFilter === "ALL") return;
    const targetIdx = chartData.findIndex((item) => {
      const k = item.categoryKey.toLowerCase();
      if (activeCategoryFilter === "ORGANIC") return k.includes("organik");
      if (activeCategoryFilter === "PLASTIC") return k.includes("plastik");
      if (activeCategoryFilter === "PAPER") return k.includes("kertas");
      if (activeCategoryFilter === "METAL_GLASS") return k.includes("logam") || k.includes("kaca");
      if (activeCategoryFilter === "HAZARDOUS") return k.includes("b3") || k.includes("residu");
      return false;
    });
    if (targetIdx !== -1) {
      setActiveIndex(targetIdx);
    }
  }, [activeCategoryFilter, chartData]);

  const cardBase = isDarkMode
    ? "bg-slate-800/90 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-900 shadow-sm";

  return (
    <div
      id="household-waste-donut-section"
      className={`p-5 sm:p-6 rounded-2xl border transition-all ${cardBase}`}
    >
      {/* Top Header & Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4 dark:border-slate-700/70">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <PieIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  Komposisi Sampah Rumah Tangga (Donut Breakdown)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  ID: HH-CLD-0402
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Proporsi jenis sampah terpilah aktual keluarga Ibu Sari berdasarkan catatan penimbangan
              </p>
            </div>
          </div>
        </div>

        {/* Metric Mode Toggle & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl border border-slate-200 dark:border-slate-600 text-xs">
            <button
              onClick={() => setTimeFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                timeFilter === "ALL"
                  ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setTimeFilter("MONTH")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                timeFilter === "MONTH"
                  ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setTimeFilter("WEEK")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                timeFilter === "WEEK"
                  ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Pekan Ini
            </button>
          </div>

          {/* Metric Selector (Weight / CO2e / Count) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl border border-slate-200 dark:border-slate-600 text-xs">
            <button
              id="metric-btn-weight"
              onClick={() => setMetricMode("WEIGHT")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                metricMode === "WEIGHT"
                  ? "bg-teal-600 text-white shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Bobot (kg)</span>
            </button>
            <button
              id="metric-btn-co2e"
              onClick={() => setMetricMode("CO2E")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                metricMode === "CO2E"
                  ? "bg-teal-600 text-white shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              <CloudSun className="w-3.5 h-3.5" />
              <span>CO2e (kg)</span>
            </button>
            <button
              id="metric-btn-count"
              onClick={() => setMetricMode("COUNT")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                metricMode === "COUNT"
                  ? "bg-teal-600 text-white shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Setoran (Qty)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid: Donut Chart on Left, Deep Inspection & Benchmarks on Right */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Recharts Donut Canvas with Center KPI Label */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          <div className="w-full h-72 sm:h-80 relative flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as CategoryData;
                        return (
                          <div
                            className={`p-3 rounded-xl border shadow-xl text-xs z-50 transition-all ${
                              isDarkMode
                                ? "bg-slate-900/95 border-slate-700 text-slate-100"
                                : "bg-white/95 border-slate-200 text-slate-800"
                            }`}
                          >
                            <div className="flex items-center gap-2 font-bold mb-1">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: data.color }}
                              />
                              <span>{data.name}</span>
                            </div>
                            <div className="space-y-0.5 text-[11px]">
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Porsi Terpilah:</span>
                                <span className="font-bold text-teal-600 dark:text-teal-400">
                                  {data.percentage}%
                                </span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Total Bobot:</span>
                                <span className="font-semibold">{data.weightKg.toFixed(2)} kg</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Reduksi Emisi:</span>
                                <span className="font-semibold text-emerald-600">
                                  {data.co2eKg.toFixed(2)} kg CO2e
                                </span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Frekuensi Drop-off:</span>
                                <span className="font-semibold">{data.count} kali setoran</span>
                              </div>
                            </div>
                            <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
                              <Info className="w-3 h-3 text-teal-500" />
                              <span>Klik segmen untuk detail fasilitas</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={112}
                    paddingAngle={3}
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onClick={(_, index) => {
                      setActiveIndex(index);
                      if (onSelectCategoryFilter && chartData[index]) {
                        let key = "ALL";
                        const k = chartData[index].categoryKey.toLowerCase();
                        if (k.includes("organik")) key = "ORGANIC";
                        else if (k.includes("plastik")) key = "PLASTIC";
                        else if (k.includes("kertas")) key = "PAPER";
                        else if (k.includes("logam") || k.includes("kaca")) key = "METAL_GLASS";
                        else if (k.includes("b3")) key = "HAZARDOUS";
                        onSelectCategoryFilter(key);
                      }
                    }}
                    cursor="pointer"
                    animationDuration={800}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={isDarkMode ? "#1e293b" : "#ffffff"}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 text-xs">
                <Boxes className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                <span>Belum ada data pemilahan tercatat</span>
              </div>
            )}

            {/* Centered Floating Summary Badge in the Donut Hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                {metricMode === "WEIGHT"
                  ? "Total Bobot"
                  : metricMode === "CO2E"
                  ? "Total Reduksi"
                  : "Total Transaksi"}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                {metricMode === "WEIGHT"
                  ? `${totalMetricValue.toFixed(2)}`
                  : metricMode === "CO2E"
                  ? `${totalMetricValue.toFixed(2)}`
                  : `${totalMetricValue}`}
              </span>
              <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 -mt-0.5">
                {metricMode === "WEIGHT" ? "Kilogram" : metricMode === "CO2E" ? "kg CO2e" : "Setoran"}
              </span>
            </div>
          </div>

          {/* Donut interactive helper note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Arahkan kursor atau sentuh irisan donut untuk menyorot kategori</span>
          </div>
        </div>

        {/* Right Column: Selected Category Deep Inspector & DKI Comparison */}
        <div className="lg:col-span-6 space-y-4">
          {activeCategory ? (
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isDarkMode
                  ? "bg-slate-900/80 border-slate-700/80"
                  : "bg-slate-50/90 border-slate-200/80"
              }`}
            >
              {/* Category Title & Badge */}
              <div className="flex items-center justify-between gap-2 border-b pb-3 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: activeCategory.color }}
                  >
                    <activeCategory.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base leading-tight">
                      {activeCategory.name}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {activeCategory.count} entri tercatat di buku kas sirkular
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-black" style={{ color: activeCategory.color }}>
                    {activeCategory.percentage}%
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Proporsi Pilah
                  </span>
                </div>
              </div>

              {/* 3 Metrics Mini Cards for Active Category */}
              <div className="grid grid-cols-3 gap-2 mt-3.5">
                <div className="p-2.5 rounded-xl border bg-white dark:bg-slate-800/80 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-medium">Bobot Fisik</span>
                  <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                    {activeCategory.weightKg.toFixed(2)} kg
                  </span>
                </div>
                <div className="p-2.5 rounded-xl border bg-white dark:bg-slate-800/80 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-medium">Reduksi Emisi</span>
                  <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {activeCategory.co2eKg.toFixed(2)} kg
                  </span>
                </div>
                <div className="p-2.5 rounded-xl border bg-white dark:bg-slate-800/80 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-medium">Poin Reward</span>
                  <span className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">
                    +{activeCategory.points} Pts
                  </span>
                </div>
              </div>

              {/* Circular Destination & Value Chain Info */}
              <div className="mt-3.5 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-teal-800 dark:text-teal-200">
                      Rantai Sirkular & Destinasi Daur Ulang:
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      {activeCategory.destination}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison with DKI Jakarta Municipal Benchmark */}
              <div className="mt-3.5 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">
                    Perbandingan Komposisi: Rumah Tangga vs DKI Jakarta
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {activeCategory.percentage}% (RT) vs {activeCategory.dkiBenchmarkPct}% (DKI)
                  </span>
                </div>

                {/* Comparative Double Gauge */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(activeCategory.percentage, 100)}%`,
                        backgroundColor: activeCategory.color,
                      }}
                      title={`Proporsi Rumah Tangga: ${activeCategory.percentage}%`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ backgroundColor: activeCategory.color }}
                      />
                      <span>Rumah Tangga ({activeCategory.percentage}%)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                      <span>Rata-rata DKI 2024 ({activeCategory.dkiBenchmarkPct}%)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">Pilih kategori untuk melihat analisis detail</div>
          )}
        </div>
      </div>

      {/* Bottom Category Legend & Fast Selection Cards */}
      <div className="mt-6 pt-4 border-t dark:border-slate-700/70">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Rincian Seluruh Jenis Sampah Terpilah
          </span>
          <span className="text-[11px] text-slate-400">
            {chartData.length} Jenis Sampah Aktif • Total {totalWeightKg.toFixed(2)} kg
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {chartData.map((item, idx) => {
            const isSelected = idx === activeIndex;
            const Icon = item.icon;
            return (
              <button
                key={item.categoryKey}
                onClick={() => {
                  setActiveIndex(idx);
                  if (onSelectCategoryFilter) {
                    let key = "ALL";
                    const k = item.categoryKey.toLowerCase();
                    if (k.includes("organik")) key = "ORGANIC";
                    else if (k.includes("plastik")) key = "PLASTIC";
                    else if (k.includes("kertas")) key = "PAPER";
                    else if (k.includes("logam") || k.includes("kaca")) key = "METAL_GLASS";
                    else if (k.includes("b3")) key = "HAZARDOUS";
                    onSelectCategoryFilter(key);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "ring-2 ring-teal-500 border-transparent bg-teal-50/70 dark:bg-teal-950/40 shadow-xs"
                    : isDarkMode
                    ? "bg-slate-800/60 border-slate-700/70 hover:bg-slate-700/50"
                    : "bg-slate-50/80 border-slate-200/80 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-bold truncate">{item.shortName}</span>
                  </div>
                  <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-sm font-extrabold" style={{ color: item.color }}>
                      {item.percentage}%
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.weightKg.toFixed(1)} kg
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                    {item.count} drop-off
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
