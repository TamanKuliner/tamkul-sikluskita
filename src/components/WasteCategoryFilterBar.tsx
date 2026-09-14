/**
 * Waste Category Filter Bar Component
 * Provides interactive toggle filters to isolate specific waste categories
 * (Plastic, Organic, Paper, Metal & Glass, Hazardous B3) across all dashboard visualizations.
 * Greeneration Circle 2026 | SiklusKita DKI Jakarta
 */

import React from "react";
import {
  Layers,
  Leaf,
  Package,
  FileText,
  Boxes,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  Check,
  X,
  Sparkles,
  Info,
} from "lucide-react";
import { WasteLogEntry } from "../types";

export type WasteCategoryFilterKey =
  | "ALL"
  | "ORGANIC"
  | "PLASTIC"
  | "PAPER"
  | "METAL_GLASS"
  | "HAZARDOUS";

export interface CategoryOption {
  key: WasteCategoryFilterKey;
  label: string;
  shortLabel: string;
  subLabel: string;
  color: string;
  darkColor: string;
  bgActiveLight: string;
  bgActiveDark: string;
  borderActive: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    key: "ALL",
    label: "Semua Kategori",
    shortLabel: "Semua",
    subLabel: "Seluruh Aliran Limbah",
    color: "#4f46e5",
    darkColor: "#818cf8",
    bgActiveLight: "bg-indigo-50 text-indigo-700 border-indigo-500",
    bgActiveDark: "dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-500",
    borderActive: "ring-indigo-500",
    icon: Layers,
  },
  {
    key: "ORGANIC",
    label: "Organik / Sisa Makanan",
    shortLabel: "Organik",
    subLabel: "Dapur & Biokonversi",
    color: "#10b981",
    darkColor: "#34d399",
    bgActiveLight: "bg-emerald-50 text-emerald-800 border-emerald-500",
    bgActiveDark: "dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-500",
    borderActive: "ring-emerald-500",
    icon: Leaf,
  },
  {
    key: "PLASTIC",
    label: "Plastik (PET/HDPE)",
    shortLabel: "Plastik",
    subLabel: "Botol & Wadah Bersih",
    color: "#0284c7",
    darkColor: "#38bdf8",
    bgActiveLight: "bg-sky-50 text-sky-800 border-sky-500",
    bgActiveDark: "dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-500",
    borderActive: "ring-sky-500",
    icon: Package,
  },
  {
    key: "PAPER",
    label: "Kertas & Karton",
    shortLabel: "Kertas/Karton",
    subLabel: "Kardus & Buku Kering",
    color: "#f59e0b",
    darkColor: "#fbbf24",
    bgActiveLight: "bg-amber-50 text-amber-800 border-amber-500",
    bgActiveDark: "dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-500",
    borderActive: "ring-amber-500",
    icon: FileText,
  },
  {
    key: "METAL_GLASS",
    label: "Logam & Kaca",
    shortLabel: "Logam/Kaca",
    subLabel: "Kaleng & Botol Kaca",
    color: "#8b5cf6",
    darkColor: "#a78bfa",
    bgActiveLight: "bg-purple-50 text-purple-800 border-purple-500",
    bgActiveDark: "dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-500",
    borderActive: "ring-purple-500",
    icon: Boxes,
  },
  {
    key: "HAZARDOUS",
    label: "B3 & Residu",
    shortLabel: "B3/Residu",
    subLabel: "Limbah Berbahaya",
    color: "#f43f5e",
    darkColor: "#fb7185",
    bgActiveLight: "bg-rose-50 text-rose-800 border-rose-500",
    bgActiveDark: "dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-500",
    borderActive: "ring-rose-500",
    icon: AlertTriangle,
  },
];

/**
 * Check if a waste log belongs to a category filter key
 */
export function matchesCategoryFilter(
  logCategory: string,
  filterKey: WasteCategoryFilterKey
): boolean {
  if (filterKey === "ALL") return true;
  const c = (logCategory || "").toLowerCase();
  switch (filterKey) {
    case "ORGANIC":
      return (
        c.includes("organik") ||
        c.includes("makanan") ||
        c.includes("buah") ||
        c.includes("sayur") ||
        c.includes("daun") ||
        c.includes("kompos") ||
        c.includes("pepaya")
      );
    case "PLASTIC":
      return (
        c.includes("plastik") ||
        c.includes("pet") ||
        c.includes("hdpe") ||
        c.includes("botol") ||
        c.includes("kresek") ||
        c.includes("gelas plastik")
      );
    case "PAPER":
      return (
        c.includes("kertas") ||
        c.includes("karton") ||
        c.includes("kardus") ||
        c.includes("buku") ||
        c.includes("duplex") ||
        c.includes("surat kabar")
      );
    case "METAL_GLASS":
      return (
        c.includes("logam") ||
        c.includes("kaca") ||
        c.includes("kaleng") ||
        c.includes("besi") ||
        c.includes("alumunium") ||
        c.includes("botol kaca")
      );
    case "HAZARDOUS":
      return (
        c.includes("b3") ||
        c.includes("residu") ||
        c.includes("elektronik") ||
        c.includes("baterai") ||
        c.includes("lampu") ||
        c.includes("medis")
      );
    default:
      return true;
  }
}

interface WasteCategoryFilterBarProps {
  wasteLogs: WasteLogEntry[];
  isDarkMode: boolean;
  selectedCategories: WasteCategoryFilterKey[];
  onToggleCategory: (key: WasteCategoryFilterKey) => void;
  onResetFilters: () => void;
  isMultiSelectMode: boolean;
  onToggleMultiSelectMode: () => void;
}

export const WasteCategoryFilterBar: React.FC<WasteCategoryFilterBarProps> = ({
  wasteLogs,
  isDarkMode,
  selectedCategories,
  onToggleCategory,
  onResetFilters,
  isMultiSelectMode,
  onToggleMultiSelectMode,
}) => {
  // Aggregate weight and count for each category button
  const categoryStats = React.useMemo(() => {
    const stats: Record<WasteCategoryFilterKey, { weightKg: number; count: number; co2eKg: number }> = {
      ALL: { weightKg: 0, count: 0, co2eKg: 0 },
      ORGANIC: { weightKg: 0, count: 0, co2eKg: 0 },
      PLASTIC: { weightKg: 0, count: 0, co2eKg: 0 },
      PAPER: { weightKg: 0, count: 0, co2eKg: 0 },
      METAL_GLASS: { weightKg: 0, count: 0, co2eKg: 0 },
      HAZARDOUS: { weightKg: 0, count: 0, co2eKg: 0 },
    };

    wasteLogs.forEach((log) => {
      const weight = log.weightKg || 0;
      const co2 = log.co2eKg || weight * 1.2;

      stats.ALL.weightKg += weight;
      stats.ALL.count += 1;
      stats.ALL.co2eKg += co2;

      if (matchesCategoryFilter(log.category, "ORGANIC")) {
        stats.ORGANIC.weightKg += weight;
        stats.ORGANIC.count += 1;
        stats.ORGANIC.co2eKg += co2;
      }
      if (matchesCategoryFilter(log.category, "PLASTIC")) {
        stats.PLASTIC.weightKg += weight;
        stats.PLASTIC.count += 1;
        stats.PLASTIC.co2eKg += co2;
      }
      if (matchesCategoryFilter(log.category, "PAPER")) {
        stats.PAPER.weightKg += weight;
        stats.PAPER.count += 1;
        stats.PAPER.co2eKg += co2;
      }
      if (matchesCategoryFilter(log.category, "METAL_GLASS")) {
        stats.METAL_GLASS.weightKg += weight;
        stats.METAL_GLASS.count += 1;
        stats.METAL_GLASS.co2eKg += co2;
      }
      if (matchesCategoryFilter(log.category, "HAZARDOUS")) {
        stats.HAZARDOUS.weightKg += weight;
        stats.HAZARDOUS.count += 1;
        stats.HAZARDOUS.co2eKg += co2;
      }
    });

    return stats;
  }, [wasteLogs]);

  const isAllSelected = selectedCategories.includes("ALL") || selectedCategories.length === 0;

  // Compute active filtered aggregate
  const activeAggregate = React.useMemo(() => {
    if (isAllSelected) {
      return categoryStats.ALL;
    }

    let weightKg = 0;
    let count = 0;
    let co2eKg = 0;

    wasteLogs.forEach((log) => {
      const isIncluded = selectedCategories.some((cat) =>
        matchesCategoryFilter(log.category, cat)
      );
      if (isIncluded) {
        weightKg += log.weightKg || 0;
        count += 1;
        co2eKg += log.co2eKg || (log.weightKg || 0) * 1.2;
      }
    });

    return { weightKg, count, co2eKg };
  }, [selectedCategories, isAllSelected, wasteLogs, categoryStats]);

  const cardBase = isDarkMode
    ? "bg-slate-800/90 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-900 shadow-sm";

  return (
    <div
      id="waste-category-filter-section"
      className={`p-4 sm:p-5 rounded-2xl border transition-all ${cardBase}`}
    >
      {/* Top Header: Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3.5 dark:border-slate-700/70">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                Filter Interaktif Aliran Sampah
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                {isAllSelected ? "Semua Aliran Aktif" : `${selectedCategories.length} Kategori Terisolasi`}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Klik kategori di bawah untuk mengisolasi visualisasi grafik emisi, target, kalkulator, dan riwayat
            </p>
          </div>
        </div>

        {/* Multi-Select Mode Switch & Reset */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="multi-select-mode-toggle"
            onClick={onToggleMultiSelectMode}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
              isMultiSelectMode
                ? "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700 shadow-xs font-semibold"
                : isDarkMode
                ? "bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700"
                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70"
            }`}
            title="Aktifkan untuk memilih lebih dari satu kategori bersamaan"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isMultiSelectMode ? "bg-teal-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            <span>Mode Multi-Pilih</span>
          </button>

          {!isAllSelected && (
            <button
              id="reset-waste-filter-btn"
              onClick={onResetFilters}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Toggle Button Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-3.5">
        {CATEGORY_OPTIONS.map((cat) => {
          const isSelected =
            cat.key === "ALL" ? isAllSelected : selectedCategories.includes(cat.key);
          const stats = categoryStats[cat.key];
          const Icon = cat.icon;

          return (
            <button
              key={cat.key}
              id={`filter-chip-${cat.key.toLowerCase()}`}
              onClick={() => onToggleCategory(cat.key)}
              className={`group relative p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? `${cat.bgActiveLight} ${cat.bgActiveDark} ring-2 ${cat.borderActive} shadow-xs font-semibold`
                  : isDarkMode
                  ? "bg-slate-900/50 border-slate-700/70 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600"
                  : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100/90 hover:border-slate-300"
              }`}
            >
              {/* Active Selection Badge */}
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: isDarkMode ? cat.darkColor : cat.color }}
                  />
                  <span className="text-xs font-bold truncate">{cat.shortLabel}</span>
                </div>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full flex items-center justify-center bg-current text-white dark:text-slate-900 text-[10px] shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Weight & Log Quantity Metric Display */}
              <div>
                <div className="flex items-baseline justify-between gap-1">
                  <span
                    className="text-sm font-extrabold tracking-tight"
                    style={{
                      color: isSelected
                        ? isDarkMode
                          ? cat.darkColor
                          : cat.color
                        : undefined,
                    }}
                  >
                    {stats.weightKg.toFixed(2)} kg
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {stats.count} log
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                  {cat.subLabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Filter State Banner when isolated */}
      {!isAllSelected && (
        <div
          id="active-filter-notification"
          className="mt-3.5 p-3 rounded-xl bg-teal-500/10 border border-teal-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-teal-900 dark:text-teal-100 transition-all animate-in fade-in"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <div>
              <span className="font-bold">Visualisasi Dasbor Terisolasi:</span>{" "}
              <span>
                Menampilkan{" "}
                <strong>
                  {selectedCategories
                    .map((k) => CATEGORY_OPTIONS.find((c) => c.key === k)?.shortLabel)
                    .filter(Boolean)
                    .join(", ")}
                </strong>{" "}
                ({activeAggregate.weightKg.toFixed(2)} kg terakumulasi • {activeAggregate.count} setoran • {activeAggregate.co2eKg.toFixed(2)} kg CO2e)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-teal-700 dark:text-teal-300 font-medium hidden md:inline">
              Grafik, kalkulator & proyeksi di bawah otomatis tersinkron
            </span>
            <button
              onClick={onResetFilters}
              className="p-1 rounded-md hover:bg-teal-500/20 text-teal-700 dark:text-teal-300"
              title="Batalkan isolasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
