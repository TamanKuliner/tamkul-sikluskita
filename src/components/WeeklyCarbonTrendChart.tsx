/**
 * Weekly Carbon Trend Line Chart Component
 * Visualizes the user's weekly carbon savings progression over time using Recharts.
 * Greeneration Circle 2026 | SiklusKita DKI Jakarta
 */

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  Leaf,
  Calendar,
  Sparkles,
  Award,
  ArrowUpRight,
  Filter,
  Info,
  CheckCircle2,
} from "lucide-react";
import { WasteLogEntry } from "../types";

interface WeeklyCarbonTrendChartProps {
  wasteLogs: WasteLogEntry[];
  isDarkMode: boolean;
}

interface WeeklyDataPoint {
  weekLabel: string;
  weekRange: string;
  weeklySavings: number; // kg CO2e
  cumulativeSavings: number; // kg CO2e
  targetBenchmark: number; // DKI target standard
  organicSavings: number;
  recyclableSavings: number;
  wasteWeightKg: number;
}

// 8-week baseline history for Household HH-CLD-0402 leading into current week
const HISTORICAL_WEEKS: Omit<WeeklyDataPoint, "cumulativeSavings">[] = [
  {
    weekLabel: "Minggu 1",
    weekRange: "20 - 26 Jul",
    weeklySavings: 2.1,
    targetBenchmark: 3.5,
    organicSavings: 1.2,
    recyclableSavings: 0.9,
    wasteWeightKg: 1.9,
  },
  {
    weekLabel: "Minggu 2",
    weekRange: "27 Jul - 2 Agu",
    weeklySavings: 2.8,
    targetBenchmark: 3.5,
    organicSavings: 1.6,
    recyclableSavings: 1.2,
    wasteWeightKg: 2.4,
  },
  {
    weekLabel: "Minggu 3",
    weekRange: "3 - 9 Agu",
    weeklySavings: 3.4,
    targetBenchmark: 3.5,
    organicSavings: 1.9,
    recyclableSavings: 1.5,
    wasteWeightKg: 2.9,
  },
  {
    weekLabel: "Minggu 4",
    weekRange: "10 - 16 Agu",
    weeklySavings: 4.1,
    targetBenchmark: 3.5,
    organicSavings: 2.3,
    recyclableSavings: 1.8,
    wasteWeightKg: 3.5,
  },
  {
    weekLabel: "Minggu 5",
    weekRange: "17 - 23 Agu",
    weeklySavings: 3.9,
    targetBenchmark: 3.5,
    organicSavings: 2.1,
    recyclableSavings: 1.8,
    wasteWeightKg: 3.3,
  },
  {
    weekLabel: "Minggu 6",
    weekRange: "24 - 30 Agu",
    weeklySavings: 4.8,
    targetBenchmark: 3.5,
    organicSavings: 2.7,
    recyclableSavings: 2.1,
    wasteWeightKg: 4.1,
  },
  {
    weekLabel: "Minggu 7",
    weekRange: "31 Agu - 6 Sep",
    weeklySavings: 5.3,
    targetBenchmark: 3.5,
    organicSavings: 3.0,
    recyclableSavings: 2.3,
    wasteWeightKg: 4.6,
  },
];

export const WeeklyCarbonTrendChart: React.FC<WeeklyCarbonTrendChartProps> = ({
  wasteLogs,
  isDarkMode,
}) => {
  const [viewMode, setViewMode] = useState<"WEEKLY" | "CUMULATIVE" | "SPLIT">("WEEKLY");
  const [timeRange, setTimeRange] = useState<"ALL" | "LAST_4">("ALL");

  // Compute this current active week (Minggu 8: 7 - 13 Sep 2026) dynamically from wasteLogs
  const trendData = useMemo(() => {
    let currentWeekCarbon = 0;
    let currentWeekOrganic = 0;
    let currentWeekRecyclable = 0;
    let currentWeekWeight = 0;

    wasteLogs.forEach((log) => {
      const co2 = log.co2eKg || (log.weightKg * 1.2);
      currentWeekCarbon += co2;
      currentWeekWeight += log.weightKg || 0;

      const catLower = (log.category || "").toLowerCase();
      if (catLower.includes("organik") || catLower.includes("makanan")) {
        currentWeekOrganic += co2;
      } else {
        currentWeekRecyclable += co2;
      }
    });

    // Base fallback if logs are empty
    if (currentWeekCarbon === 0) {
      currentWeekCarbon = 4.17;
      currentWeekOrganic = 2.45;
      currentWeekRecyclable = 1.72;
      currentWeekWeight = 3.45;
    }

    const currentWeekPoint: Omit<WeeklyDataPoint, "cumulativeSavings"> = {
      weekLabel: "Minggu 8 (Kini)",
      weekRange: "7 - 13 Sep",
      weeklySavings: Number(currentWeekCarbon.toFixed(2)),
      targetBenchmark: 3.5,
      organicSavings: Number(currentWeekOrganic.toFixed(2)),
      recyclableSavings: Number(currentWeekRecyclable.toFixed(2)),
      wasteWeightKg: Number(currentWeekWeight.toFixed(2)),
    };

    const fullSeriesRaw = [...HISTORICAL_WEEKS, currentWeekPoint];

    // Calculate running cumulative savings
    let runningSum = 0;
    const fullSeries: WeeklyDataPoint[] = fullSeriesRaw.map((pt) => {
      runningSum += pt.weeklySavings;
      return {
        ...pt,
        cumulativeSavings: Number(runningSum.toFixed(2)),
      };
    });

    if (timeRange === "LAST_4") {
      return fullSeries.slice(-4);
    }
    return fullSeries;
  }, [wasteLogs, timeRange]);

  // Key stats
  const latestWeek = trendData[trendData.length - 1];
  const previousWeek = trendData[trendData.length - 2] || latestWeek;
  const wowGrowthPercent = previousWeek.weeklySavings > 0
    ? Math.round(((latestWeek.weeklySavings - previousWeek.weeklySavings) / previousWeek.weeklySavings) * 100)
    : 0;
  const bestWeekRecord = Math.max(...trendData.map((d) => d.weeklySavings));
  const totalCumulativeRecorded = trendData[trendData.length - 1]?.cumulativeSavings || 0;

  // Colors adapted for dark/light themes
  const strokeGrid = isDarkMode ? "#334155" : "#e2e8f0";
  const strokeText = isDarkMode ? "#94a3b8" : "#64748b";
  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  return (
    <div
      id="weekly-carbon-trend-chart-card"
      className={`p-6 rounded-3xl border ${cardBase} space-y-6 transition-all`}
    >
      {/* Top Header & Chart Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4 dark:border-slate-700">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Tren Mingguan Reduksi Karbon
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Pantau konsistensi pengurangan jejak emisi rumah tangga Anda per pekan dibandingkan target standar DLH DKI Jakarta (3.5 kg CO₂e/minggu).
          </p>
        </div>

        {/* View Mode Switcher & Time Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Pills */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-700/70 text-xs font-semibold">
            <button
              onClick={() => setViewMode("WEEKLY")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === "WEEKLY"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Per Minggu
            </button>
            <button
              onClick={() => setViewMode("CUMULATIVE")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === "CUMULATIVE"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Kumulatif Total
            </button>
            <button
              onClick={() => setViewMode("SPLIT")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === "SPLIT"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Organik vs Anorganik
            </button>
          </div>

          {/* Time Filter Pill */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-700/70 text-xs font-semibold">
            <button
              onClick={() => setTimeRange("ALL")}
              className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                timeRange === "ALL"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              8 Pekan
            </button>
            <button
              onClick={() => setTimeRange("LAST_4")}
              className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                timeRange === "LAST_4"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              4 Pekan Terakhir
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pekan Ini (Kini)
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {latestWeek.weeklySavings}
            </span>
            <span className="text-xs font-semibold text-emerald-500">kg CO₂e</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px]">
            {wowGrowthPercent >= 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" />
                +{wowGrowthPercent}% vs pekan lalu
              </span>
            ) : (
              <span className="text-amber-500 font-bold">
                {wowGrowthPercent}% vs pekan lalu
              </span>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Akumulasi
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
              {totalCumulativeRecorded}
            </span>
            <span className="text-xs font-semibold text-slate-500">kg CO₂e</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Setara {(totalCumulativeRecorded / 21.77).toFixed(1)} serapan bibit pohon
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Rekor Tertinggi
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-black text-amber-500">
              {bestWeekRecord}
            </span>
            <span className="text-xs font-semibold text-amber-500">kg CO₂e</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-500" />
            <span>Pekan ke-7 (31 Agu - 6 Sep)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Target Standar DKI
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
              3.5
            </span>
            <span className="text-xs font-semibold text-blue-500">kg/minggu</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Terlampaui +{Math.round(((latestWeek.weeklySavings - 3.5) / 3.5) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Main Recharts Line Chart Container */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={trendData}
            margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={strokeGrid} vertical={false} />

            <XAxis
              dataKey="weekLabel"
              stroke={strokeText}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: strokeGrid }}
            />

            <YAxis
              stroke={strokeText}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit={viewMode === "CUMULATIVE" ? " kg" : " kg"}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as WeeklyDataPoint;
                  return (
                    <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[200px]">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="font-bold text-white">{data.weekLabel}</span>
                        <span className="text-[10px] text-slate-400">{data.weekRange}</span>
                      </div>

                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between items-center text-emerald-400">
                          <span>Reduksi Mingguan:</span>
                          <span className="font-mono font-bold">{data.weeklySavings} kg CO₂e</span>
                        </div>
                        <div className="flex justify-between items-center text-blue-400">
                          <span>Akumulasi Kumulatif:</span>
                          <span className="font-mono font-bold">{data.cumulativeSavings} kg CO₂e</span>
                        </div>
                        <div className="flex justify-between items-center text-amber-300">
                          <span>Organik (Metana dicegah):</span>
                          <span className="font-mono">{data.organicSavings} kg</span>
                        </div>
                        <div className="flex justify-between items-center text-teal-300">
                          <span>Anorganik Daur Ulang:</span>
                          <span className="font-mono">{data.recyclableSavings} kg</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800 text-[10px]">
                          <span>Volume Terpilah:</span>
                          <span>{data.wasteWeightKg} kg</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ fontSize: "11px", paddingTop: "0px" }}
            />

            {/* Target benchmark dashed horizontal guide line */}
            {viewMode !== "CUMULATIVE" && (
              <ReferenceLine
                y={3.5}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{
                  value: "Target DKI: 3.5 kg/pekan",
                  fill: "#f59e0b",
                  fontSize: 10,
                  position: "top",
                }}
              />
            )}

            {/* Weekly Mode */}
            {viewMode === "WEEKLY" && (
              <>
                <Area
                  type="monotone"
                  dataKey="weeklySavings"
                  name="Reduksi Emisi (kg CO₂e)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#carbonGradient)"
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: isDarkMode ? "#0f172a" : "#ffffff" }}
                  activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="targetBenchmark"
                  name="Target Standar DKI (3.5 kg)"
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                />
              </>
            )}

            {/* Cumulative Mode */}
            {viewMode === "CUMULATIVE" && (
              <>
                <Area
                  type="monotone"
                  dataKey="cumulativeSavings"
                  name="Total Akumulasi Emisi Dicegah (kg CO₂e)"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#cumulativeGradient)"
                  dot={{ r: 4, fill: "#0284c7", strokeWidth: 2, stroke: isDarkMode ? "#0f172a" : "#ffffff" }}
                  activeDot={{ r: 6, stroke: "#0284c7", strokeWidth: 2 }}
                />
              </>
            )}

            {/* Split Stream Mode */}
            {viewMode === "SPLIT" && (
              <>
                <Line
                  type="monotone"
                  dataKey="organicSavings"
                  name="Organik / Biokonversi BSF"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#10b981" }}
                />
                <Line
                  type="monotone"
                  dataKey="recyclableSavings"
                  name="Plastik & Kertas Daur Ulang"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#06b6d4" }}
                />
                <Line
                  type="monotone"
                  dataKey="weeklySavings"
                  name="Total Mingguan"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Insight Callout */}
      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>
            <strong>Wawasan Tren Sirkular:</strong> Tren pemilahan Anda meningkat konsisten sebesar <strong>+98.6%</strong> sejak Pekan 1. Konsistensi ini melampaui target penurunan gas rumah kaca sektor limbah perkotaan DKI Jakarta.
          </span>
        </div>
      </div>
    </div>
  );
};
