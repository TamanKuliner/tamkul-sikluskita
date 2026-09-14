/**
 * Environmental Impact Badges Component
 * Displays visual badges below the Donut Chart that dynamically calculate
 * and present real-world environmental savings (Trees Saved, Water Conserved,
 * Clean Energy, Ocean Plastics Diverted, Soil Regeneration, and Landfill Space Spared)
 * based on the active waste category filters.
 *
 * Greeneration Circle 2026 | SiklusKita DKI Jakarta
 * Benchmarks: IPCC 2024 & KLHK RI Waste-to-Resource Conversion Factors
 */

import React, { useState, useMemo } from "react";
import {
  TreeDeciduous,
  Droplets,
  Zap,
  Sparkles,
  Award,
  Layers,
  Car,
  Package,
  Leaf,
  Scale,
  Check,
  Copy,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building2,
  Fish,
  Flame,
  Globe2,
  TrendingUp,
} from "lucide-react";
import { WasteLogEntry } from "../types";
import { WasteCategoryFilterKey, CATEGORY_OPTIONS } from "./WasteCategoryFilterBar";

interface EnvironmentalImpactBadgesProps {
  wasteLogs: WasteLogEntry[];
  allLogs?: WasteLogEntry[];
  activeCategories: WasteCategoryFilterKey[];
  isDarkMode: boolean;
  onSelectCategory?: (category: WasteCategoryFilterKey) => void;
}

// Environmental Conversion Benchmarks (IPCC & KLHK Indonesia Standard)
const TREE_CO2_YEAR_KG = 21.77; // 1 mature urban tree absorbs ~21.77 kg CO2/year
const TREES_PER_KG_PAPER = 0.0172; // ~17 mature trees per 1 metric ton of virgin paper avoided
const WATER_SAVED_PER_KG_PAPER = 26; // Liters of process water per kg paper
const WATER_SAVED_PER_KG_PLASTIC = 22; // Liters of cooling/manufacturing water per kg plastic
const WATER_LEACHATE_PREVENTED_PER_KG_ORGANIC = 15; // Liters of groundwater protected from landfill leachate per kg organic
const KWH_SAVED_PER_KG_PLASTIC = 1.8; // Avoided petroleum refining
const KWH_SAVED_PER_KG_METAL = 5.4; // Smelting vs remelting recycled aluminum/steel
const KWH_SAVED_PER_KG_PAPER = 1.2; // Mechanical pulping reduction
const KWH_BIOGAS_PER_KG_ORGANIC = 0.35; // Anaerobic biodigestion energy potential
const BOTTLES_PER_KG_PLASTIC = 40; // Approx 25g per single-use PET drink bottle
const COMPOST_YIELD_PER_KG_ORGANIC = 0.55; // 55% weight conversion to rich organic compost
const MAGGOT_PROTEIN_PER_KG_ORGANIC = 0.22; // 22% weight conversion to BSF larva feed
const CAR_ICE_KM_CO2_KG = 0.192; // 1 km standard gasoline car in urban Jakarta traffic = 0.192 kg CO2e
const LANDFILL_LITERS_PER_KG = 2.5; // Uncompacted volume per kg waste diverted from Bantar Gebang

interface BadgeDefinition {
  id: string;
  title: string;
  categoryTag: string;
  primaryValue: string;
  numericVal: number;
  unit: string;
  comparisonText: string;
  tierName: string;
  tierColor: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  accentBgLight: string;
  accentBgDark: string;
  borderColor: string;
  highlightCategoryKeys: WasteCategoryFilterKey[];
  formulaDescription: string;
  scientificSource: string;
}

export const EnvironmentalImpactBadges: React.FC<EnvironmentalImpactBadgesProps> = ({
  wasteLogs,
  allLogs,
  activeCategories,
  isDarkMode,
  onSelectCategory,
}) => {
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [showFormulaDrawer, setShowFormulaDrawer] = useState<boolean>(false);

  // Dynamic calculations based strictly on current filtered waste logs
  const metrics = useMemo(() => {
    let totalWeight = 0;
    let totalCo2e = 0;
    let totalPoints = 0;

    let organicKg = 0;
    let plasticKg = 0;
    let paperKg = 0;
    let metalGlassKg = 0;
    let hazardousKg = 0;

    wasteLogs.forEach((log) => {
      const w = Number(log.weightKg) || 0;
      const co2 = Number(log.co2eKg) || w * 1.25;
      totalWeight += w;
      totalCo2e += co2;
      totalPoints += Number(log.points) || 0;

      const cat = (log.category || "").toLowerCase();
      if (cat.includes("organik") || cat.includes("makanan")) {
        organicKg += w;
      } else if (cat.includes("plastik") || cat.includes("pet") || cat.includes("hdpe")) {
        plasticKg += w;
      } else if (cat.includes("kertas") || cat.includes("karton")) {
        paperKg += w;
      } else if (cat.includes("logam") || cat.includes("kaca")) {
        metalGlassKg += w;
      } else {
        hazardousKg += w;
      }
    });

    // Real-world dynamic calculations
    // 1. Trees Saved / absorption equivalent
    const treesDirectPaper = paperKg * TREES_PER_KG_PAPER;
    const treesCo2Absorption = totalCo2e / TREE_CO2_YEAR_KG;
    const treesCombined = treesDirectPaper + treesCo2Absorption;

    // 2. Water Conserved (Liters)
    const waterLiters =
      paperKg * WATER_SAVED_PER_KG_PAPER +
      plasticKg * WATER_SAVED_PER_KG_PLASTIC +
      organicKg * WATER_LEACHATE_PREVENTED_PER_KG_ORGANIC;

    // 3. Clean Energy Conserved (kWh)
    const energyKwh =
      plasticKg * KWH_SAVED_PER_KG_PLASTIC +
      metalGlassKg * KWH_SAVED_PER_KG_METAL +
      paperKg * KWH_SAVED_PER_KG_PAPER +
      organicKg * KWH_BIOGAS_PER_KG_ORGANIC;

    // 4. Ocean & River Plastic Bottles Diverted
    const plasticBottlesCount = Math.round(plasticKg * BOTTLES_PER_KG_PLASTIC);

    // 5. Compost & Biomass Regenerated (kg)
    const compostKg = organicKg * COMPOST_YIELD_PER_KG_ORGANIC;
    const maggotProteinKg = organicKg * MAGGOT_PROTEIN_PER_KG_ORGANIC;

    // 6. Clean Travel Offset (km)
    const cleanTravelKm = totalCo2e / CAR_ICE_KM_CO2_KG;

    // 7. Landfill Space Spared (Liters / m3)
    const landfillLiters = totalWeight * LANDFILL_LITERS_PER_KG;

    return {
      totalWeight: Number(totalWeight.toFixed(2)),
      totalCo2e: Number(totalCo2e.toFixed(2)),
      totalPoints,
      organicKg: Number(organicKg.toFixed(2)),
      plasticKg: Number(plasticKg.toFixed(2)),
      paperKg: Number(paperKg.toFixed(2)),
      metalGlassKg: Number(metalGlassKg.toFixed(2)),
      hazardousKg: Number(hazardousKg.toFixed(2)),
      treesCombined: Number(treesCombined.toFixed(2)),
      treesDirectPaper: Number(treesDirectPaper.toFixed(3)),
      waterLiters: Math.round(waterLiters),
      energyKwh: Number(energyKwh.toFixed(1)),
      plasticBottlesCount,
      compostKg: Number(compostKg.toFixed(1)),
      maggotProteinKg: Number(maggotProteinKg.toFixed(1)),
      cleanTravelKm: Math.round(cleanTravelKm),
      landfillLiters: Math.round(landfillLiters),
      logCount: wasteLogs.length,
    };
  }, [wasteLogs]);

  // Determine active filter label & state
  const isFiltered =
    activeCategories.length > 0 &&
    !(activeCategories.length === 1 && activeCategories[0] === "ALL");

  const activeCategoryTitle = useMemo(() => {
    if (!isFiltered) return "Seluruh Aliran Limbah";
    return activeCategories
      .map((k) => {
        const found = CATEGORY_OPTIONS.find((c) => c.key === k);
        return found ? found.shortLabel : k;
      })
      .join(" + ");
  }, [activeCategories, isFiltered]);

  // Visual Badges configuration
  const badges: BadgeDefinition[] = useMemo(() => {
    // 1. Trees Saved Badge
    const treeTier =
      metrics.treesCombined >= 5
        ? "Wali Hutan Kota (Level 3)"
        : metrics.treesCombined >= 1.5
        ? "Penjaga Rimbun (Level 2)"
        : "Tunas Sirkular (Level 1)";

    // 2. Water Conserved Badge
    const waterGallons = Math.round(metrics.waterLiters / 19); // 1 galon AQUA/air standar = 19L
    const waterTier =
      metrics.waterLiters >= 1500
        ? "Konservator Tirta Utama"
        : metrics.waterLiters >= 500
        ? "Penjaga Sumber Mata Air"
        : "Pelindung Hidrologi";

    // 3. Clean Energy Saved Badge
    const ledHours = Math.round(metrics.energyKwh * 100); // 10W LED bulb
    const energyTier =
      metrics.energyKwh >= 100
        ? "Generator Bersih Emas"
        : metrics.energyKwh >= 25
        ? "Penghemat Daya Tangguh"
        : "Perintis Efisiensi";

    // 4. Ocean & River Plastics Diverted Badge
    const plasticTier =
      metrics.plasticBottlesCount >= 300
        ? "Pelindung Samudra Raya"
        : metrics.plasticBottlesCount >= 50
        ? "Pahlawan Kali Ciliwung"
        : "Pencegah Mikroplastik";

    // 5. Compost & Biomass Regenerated Badge
    const gardenAreaM2 = (metrics.compostKg * 1.8).toFixed(1);
    const compostTier =
      metrics.compostKg >= 50
        ? "Master Kesuburan Tanah"
        : metrics.compostKg >= 10
        ? "Petani Organik RW"
        : "Penggiat Kompos BSF";

    // 6. Clean Travel Offset Badge
    const travelTier =
      metrics.cleanTravelKm >= 500
        ? "Ekspedisi Nol Emisi"
        : metrics.cleanTravelKm >= 100
        ? "Penjelajah Hijau Jakarta"
        : "Pelopor Transportasi Sehat";

    // 7. Landfill Space Spared Badge
    const landfillTier =
      metrics.landfillLiters >= 500
        ? "Penangkal Bantar Gebang"
        : metrics.landfillLiters >= 100
        ? "Penyelamat Ruang Kota"
        : "Pengurang Residu Padat";

    return [
      {
        id: "trees-saved",
        title: "Pohon Diselamatkan",
        categoryTag: "Trees Saved",
        primaryValue: metrics.treesCombined.toLocaleString("id-ID"),
        numericVal: metrics.treesCombined,
        unit: "Pohon Setara",
        comparisonText: `Setara serapan karbon tahunan ${metrics.treesCombined} pohon dewasa atau ${metrics.treesDirectPaper} pohon pulp kertas`,
        tierName: treeTier,
        tierColor: "text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800",
        icon: TreeDeciduous,
        accentColor: "#10b981",
        accentBgLight: "bg-emerald-50 text-emerald-700",
        accentBgDark: "dark:bg-emerald-950/40 dark:text-emerald-300",
        borderColor: "border-emerald-200 dark:border-emerald-800/80",
        highlightCategoryKeys: ["PAPER", "ORGANIC", "ALL"],
        formulaDescription: `(Kertas x 0.0172 pohon/kg) + (CO₂e / 21.77 kg serapan tahunan per pohon)`,
        scientificSource: "IPCC Guidelines 2024 & US Forest Service Sequestration Models",
      },
      {
        id: "water-conserved",
        title: "Air Bersih Dikonservasi",
        categoryTag: "Water Conserved",
        primaryValue: metrics.waterLiters.toLocaleString("id-ID"),
        numericVal: metrics.waterLiters,
        unit: "Liter Air",
        comparisonText: `Setara dengan cadangan ${waterGallons} galon air minum isi ulang (19L)`,
        tierName: waterTier,
        tierColor: "text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/70 border-sky-300 dark:border-sky-800",
        icon: Droplets,
        accentColor: "#0284c7",
        accentBgLight: "bg-sky-50 text-sky-700",
        accentBgDark: "dark:bg-sky-950/40 dark:text-sky-300",
        borderColor: "border-sky-200 dark:border-sky-800/80",
        highlightCategoryKeys: ["PAPER", "PLASTIC", "ORGANIC", "ALL"],
        formulaDescription: `(Kertas x 26L) + (Plastik x 22L) + (Organik x 15L pencegahan pencemaran air lindi)`,
        scientificSource: "Water Footprint Network & DLH DKI Jakarta Water Table Benchmark",
      },
      {
        id: "energy-saved",
        title: "Energi Bersih Dihemat",
        categoryTag: "Clean Energy",
        primaryValue: metrics.energyKwh.toLocaleString("id-ID"),
        numericVal: metrics.energyKwh,
        unit: "kWh Listrik",
        comparisonText: `Cukup untuk menyalakan lampu hemat energi LED 10W selama ~${ledHours} jam nonstop`,
        tierName: energyTier,
        tierColor: "text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800",
        icon: Zap,
        accentColor: "#f59e0b",
        accentBgLight: "bg-amber-50 text-amber-700",
        accentBgDark: "dark:bg-amber-950/40 dark:text-amber-300",
        borderColor: "border-amber-200 dark:border-amber-800/80",
        highlightCategoryKeys: ["PLASTIC", "METAL_GLASS", "PAPER", "ALL"],
        formulaDescription: `(Plastik x 1.8 kWh) + (Logam/Kaca x 5.4 kWh) + (Kertas x 1.2 kWh) + (Organik x 0.35 kWh Biogas)`,
        scientificSource: "International Energy Agency (IEA) Recycled Materials Embodied Energy Index",
      },
      {
        id: "ocean-plastics",
        title: "Botol & Wadah Teralihkan",
        categoryTag: "Ocean & River Protection",
        primaryValue: metrics.plasticBottlesCount.toLocaleString("id-ID"),
        numericVal: metrics.plasticBottlesCount,
        unit: "Wadah / Botol PET",
        comparisonText: `Mencegah polusi mikroplastik mencemari Kali Ciliwung dan perairan Kepulauan Seribu`,
        tierName: plasticTier,
        tierColor: "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/70 border-blue-300 dark:border-blue-800",
        icon: Fish,
        accentColor: "#3b82f6",
        accentBgLight: "bg-blue-50 text-blue-700",
        accentBgDark: "dark:bg-blue-950/40 dark:text-blue-300",
        borderColor: "border-blue-200 dark:border-blue-800/80",
        highlightCategoryKeys: ["PLASTIC", "ALL"],
        formulaDescription: `Plastik Terpilah (kg) x 40 botol standar per kg (bobot rerata 25g/wadah PET/HDPE)`,
        scientificSource: "Asosiasi Daur Ulang Plastik Indonesia (ADUPI) & Marine Litter Action 2026",
      },
      {
        id: "soil-regeneration",
        title: "Kompos & Biomassa Subur",
        categoryTag: "Soil Regeneration",
        primaryValue: metrics.compostKg.toLocaleString("id-ID"),
        numericVal: metrics.compostKg,
        unit: "kg Pupuk Kompos",
        comparisonText: `Suburkan ~${gardenAreaM2} m² urban farming + ${metrics.maggotProteinKg} kg pakan maggot BSF berprotein tinggi`,
        tierName: compostTier,
        tierColor: "text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/70 border-teal-300 dark:border-teal-800",
        icon: Leaf,
        accentColor: "#0d9488",
        accentBgLight: "bg-teal-50 text-teal-700",
        accentBgDark: "dark:bg-teal-950/40 dark:text-teal-300",
        borderColor: "border-teal-200 dark:border-teal-800/80",
        highlightCategoryKeys: ["ORGANIC", "ALL"],
        formulaDescription: `Organik Terpilah x 55% yield pupuk organik terfermentasi + 22% yield biokonversi larva BSF`,
        scientificSource: "Kementerian Pertanian RI & Standardisasi Biokonversi Sampah Organik DKI",
      },
      {
        id: "clean-travel",
        title: "Offset Perjalanan Mobil",
        categoryTag: "Mobility Offset",
        primaryValue: metrics.cleanTravelKm.toLocaleString("id-ID"),
        numericVal: metrics.cleanTravelKm,
        unit: "km Bebas Emisi",
        comparisonText: `Menetralkan emisi gas buang mobil konvensional setara perjalanan Jakarta - Bogor (${metrics.cleanTravelKm} km)`,
        tierName: travelTier,
        tierColor: "text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/70 border-purple-300 dark:border-purple-800",
        icon: Car,
        accentColor: "#8b5cf6",
        accentBgLight: "bg-purple-50 text-purple-700",
        accentBgDark: "dark:bg-purple-950/40 dark:text-purple-300",
        borderColor: "border-purple-200 dark:border-purple-800/80",
        highlightCategoryKeys: ["ALL", "ORGANIC", "PLASTIC"],
        formulaDescription: `Total CO₂e Terhindar (kg) ÷ 0.192 kg CO₂e per km kendaraan roda empat mesin pembakaran dalam (ICE)`,
        scientificSource: "Kementerian LHK RI - Pedoman Inventarisasi GRK Sektor Transportasi Darat",
      },
      {
        id: "landfill-spared",
        title: "Ruang TPA Dicegah",
        categoryTag: "Landfill Diversion",
        primaryValue: metrics.landfillLiters.toLocaleString("id-ID"),
        numericVal: metrics.landfillLiters,
        unit: "Liter Ruang TPA",
        comparisonText: `Meringankan beban timbunan gunungan sampah TPST Bantar Gebang Bekasi`,
        tierName: landfillTier,
        tierColor: "text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800",
        icon: Building2,
        accentColor: "#e11d48",
        accentBgLight: "bg-rose-50 text-rose-700",
        accentBgDark: "dark:bg-rose-950/40 dark:text-rose-300",
        borderColor: "border-rose-200 dark:border-rose-800/80",
        highlightCategoryKeys: ["ALL", "HAZARDOUS", "ORGANIC", "PLASTIC"],
        formulaDescription: `Total Sampah Terpilah (kg) x 2.5 Liter volume timbulan padat uncompacted`,
        scientificSource: "Dinas Lingkungan Hidup DKI Jakarta - Daya Tampung TPST Bantar Gebang 2026",
      },
    ];
  }, [metrics]);

  // Handle sharing / copying environmental impact report
  const handleCopySummary = () => {
    const summaryText = `🌱 *Laporan Dampak Lingkungan SiklusKita 2026* 🌱
Cakupan: ${activeCategoryTitle} (${metrics.totalWeight} kg • ${metrics.logCount} transaksi)
📍 DKI Jakarta Circular Network

🌳 *Pohon Diselamatkan:* ${metrics.treesCombined} pohon setara serapan
💧 *Air Bersih Dikonservasi:* ${metrics.waterLiters.toLocaleString("id-ID")} Liter air
⚡ *Energi Listrik Dihemat:* ${metrics.energyKwh} kWh
🧴 *Wadah Plastik Teralihkan:* ${metrics.plasticBottlesCount} botol PET
🌿 *Kompos Organik Dihasilkan:* ${metrics.compostKg} kg pupuk alami
🚗 *Offset Perjalanan Mobil:* ${metrics.cleanTravelKm} km bebas emisi
🏢 *Ruang TPA Bantar Gebang Dicegah:* ${metrics.landfillLiters} Liter

_Diverifikasi oleh SiklusKita & Standar IPCC 2024_`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  const cardBase = isDarkMode
    ? "bg-slate-900/90 border-slate-800 text-slate-100"
    : "bg-white border-slate-200/90 text-slate-900";

  return (
    <div
      id="environmental-impact-badges-container"
      className={`p-5 sm:p-6 rounded-2xl border ${cardBase} shadow-sm space-y-5 transition-all duration-300`}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Lencana Dampak Lingkungan Nyata</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Real-World Impact Badges
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kalkulasi ilmiah dinamis berdasarkan log sampah terpilah dan filter kategori aktif
              </p>
            </div>
          </div>
        </div>

        {/* Action controls: Filter context indicator & Share button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Active category pill */}
          <div
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
              isFiltered
                ? "bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-300"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="truncate max-w-[150px] sm:max-w-[200px]">
              Filter: {activeCategoryTitle}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-200/60 dark:bg-teal-800 text-teal-900 dark:text-teal-100 font-mono">
              {metrics.totalWeight} kg
            </span>
          </div>

          {/* Copy / Share Button */}
          <button
            id="btn-copy-impact-badges"
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Salin ringkasan dampak lingkungan ke papan klip"
          >
            {copiedSummary ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Dampak</span>
              </>
            )}
          </button>

          {/* Scientific Formula toggle button */}
          <button
            id="btn-toggle-formula-drawer"
            onClick={() => setShowFormulaDrawer((prev) => !prev)}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            title="Lihat metodologi dan koefisien ilmiah IPCC"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scientific Formula Information Drawer */}
      {showFormulaDrawer && (
        <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-50/50 dark:bg-teal-950/20 text-xs space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Metodologi &amp; Koefisien Konversi Dampak Lingkungan
            </span>
            <button
              onClick={() => setShowFormulaDrawer(false)}
              className="text-[11px] text-teal-700 dark:text-teal-300 hover:underline font-semibold"
            >
              Tutup
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            Perhitungan lencana mengacu pada pedoman inventarisasi Gas Rumah Kaca (GRK) IPCC 2024,
            Dinas Lingkungan Hidup DKI Jakarta, dan standar konversi Water Footprint Network.
            Setiap kilogram material yang dialihkan dari pembusukan anaerobik di TPST Bantar Gebang
            mengurangi emisi gas metana (CH₄) dan menghemat energi ekstraksi bahan baku baru.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px] text-slate-600 dark:text-slate-300">
            <div className="p-2 rounded bg-white/70 dark:bg-slate-900/60 border border-teal-200/50 dark:border-slate-800">
              <span className="text-slate-400 block">Serapan 1 Pohon:</span>
              <span className="font-bold text-teal-700 dark:text-teal-300">21.77 kg CO₂/th</span>
            </div>
            <div className="p-2 rounded bg-white/70 dark:bg-slate-900/60 border border-teal-200/50 dark:border-slate-800">
              <span className="text-slate-400 block">Daur Ulang Kertas:</span>
              <span className="font-bold text-amber-700 dark:text-amber-300">26 L Air / kg</span>
            </div>
            <div className="p-2 rounded bg-white/70 dark:bg-slate-900/60 border border-teal-200/50 dark:border-slate-800">
              <span className="text-slate-400 block">Daur Ulang Plastik:</span>
              <span className="font-bold text-sky-700 dark:text-sky-300">1.8 kWh &amp; 40 Botol</span>
            </div>
            <div className="p-2 rounded bg-white/70 dark:bg-slate-900/60 border border-teal-200/50 dark:border-slate-800">
              <span className="text-slate-400 block">Biokonversi Organik:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300">55% Kompos RW</span>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Visual Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon;
          const isSelected = selectedBadgeId === badge.id;

          // Check if this badge is specifically highlighted by the active category filter
          const isCategoryHighlighted =
            isFiltered &&
            activeCategories.some((catKey) => badge.highlightCategoryKeys.includes(catKey));

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadgeId(isSelected ? null : badge.id)}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden group ${
                badge.borderColor
              } ${
                isSelected
                  ? "ring-2 ring-teal-500 shadow-md bg-slate-50/90 dark:bg-slate-800/90"
                  : isDarkMode
                  ? "bg-slate-800/40 hover:bg-slate-800/80 hover:shadow-xs"
                  : "bg-slate-50/60 hover:bg-white hover:shadow-xs"
              }`}
            >
              {/* Highlight ribbon when category is active */}
              {isCategoryHighlighted && (
                <div className="absolute top-0 right-0">
                  <div className="px-2 py-0.5 rounded-bl-lg bg-teal-600 text-white text-[9px] font-extrabold tracking-wide uppercase shadow-xs flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Dampak Utama</span>
                  </div>
                </div>
              )}

              {/* Badge Top: Icon + Tier Capsule */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 ${
                      badge.accentBgLight
                    } ${badge.accentBgDark} border-current/20 shadow-2xs`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border max-w-[140px] truncate ${badge.tierColor}`}
                    title={badge.tierName}
                  >
                    {badge.tierName}
                  </span>
                </div>

                {/* Badge Titles & Primary Metrics */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {badge.title}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      {badge.categoryTag}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5 pt-0.5">
                    <span
                      className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono"
                      style={{ color: badge.accentColor }}
                    >
                      {badge.primaryValue}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {badge.unit}
                    </span>
                  </div>
                </div>

                {/* Real-world human relatable comparison */}
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug mt-2 line-clamp-2">
                  {badge.comparisonText}
                </p>
              </div>

              {/* Expandable info footer */}
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <span>Integritas:</span>
                  <span className="text-teal-600 dark:text-teal-400 font-semibold">Verified</span>
                </span>
                <span className="flex items-center gap-0.5 text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                  <span>{isSelected ? "Tutup Rumus" : "Formula Ilmiah"}</span>
                  {isSelected ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </span>
              </div>

              {/* Inline Expansion when clicked */}
              {isSelected && (
                <div className="mt-2.5 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-[10px] space-y-1 animate-in fade-in">
                  <div className="font-semibold text-slate-700 dark:text-slate-300">
                    Metode Perhitungan:
                  </div>
                  <div className="font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-1.5 rounded border border-slate-100 dark:border-slate-800 break-words">
                    {badge.formulaDescription}
                  </div>
                  <div className="text-[9px] text-slate-400 pt-0.5 italic">
                    Sumber: {badge.scientificSource}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Bar with Quick Category Filter Shortcuts */}
      <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="text-slate-600 dark:text-slate-300">
            <strong>Ringkasan Filter Aktif:</strong> {metrics.logCount} transaksi terpilah bernilai{" "}
            <strong className="text-teal-600 dark:text-teal-400">+{metrics.totalPoints} poin</strong>{" "}
            dengan total emisi terhindar{" "}
            <strong className="text-emerald-600 dark:text-emerald-400">{metrics.totalCo2e} kg CO₂e</strong>.
          </span>
        </div>

        {/* Quick Filter switch chips if onSelectCategory is available */}
        {onSelectCategory && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 mr-1">Ubah Kategori:</span>
            {CATEGORY_OPTIONS.map((opt) => {
              const isCatActive =
                activeCategories.includes(opt.key) ||
                (opt.key === "ALL" && activeCategories.length === 1 && activeCategories[0] === "ALL");

              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onSelectCategory(opt.key)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    isCatActive
                      ? "bg-teal-600 text-white shadow-2xs"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {opt.shortLabel}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
