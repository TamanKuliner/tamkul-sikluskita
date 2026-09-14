/**
 * Circular Impact Calculator Component
 * Calculates cumulative carbon savings and resource recovery metrics from waste logs.
 * Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState, useMemo } from "react";
import {
  Leaf,
  Recycle,
  Sparkles,
  TreeDeciduous,
  Zap,
  Car,
  TrendingUp,
  Droplets,
  Coins,
  Scale,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sliders,
  Award,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { WasteLogEntry } from "../types";

interface CircularImpactCalculatorProps {
  wasteLogs: WasteLogEntry[];
  isDarkMode: boolean;
}

// Conversions & Scientific Benchmarks (DKI Jakarta & IPCC Guidelines)
// 1 Tree absorbs ~21.77 kg CO2 / year
// 1 kWh Indonesian grid ~0.78 kg CO2e
// 1 km ICE car travel ~0.192 kg CO2e
// Paper recycling saves ~26 Liters of water per kg
// Organics bioconversion yields ~0.2 kg BSF larva protein + 0.5 L liquid fertilizer per kg
// Average scrap values: PET Rp 3,800/kg, Paper Rp 1,800/kg, Compost/Maggot Rp 2,500/kg
const TREE_CO2_YEAR_KG = 21.77;
const KWH_CO2_KG = 0.78;
const CAR_KM_CO2_KG = 0.192;
const WATER_SAVED_PER_KG_PAPER = 26;

export const CircularImpactCalculator: React.FC<CircularImpactCalculatorProps> = ({
  wasteLogs,
  isDarkMode,
}) => {
  // Projection simulation controls
  const [simulationExtraOrganicKg, setSimulationExtraOrganicKg] = useState<number>(0);
  const [simulationExtraPlasticKg, setSimulationExtraPlasticKg] = useState<number>(0);
  const [showBreakdownDetails, setShowBreakdownDetails] = useState<boolean>(false);
  const [timeHorizon, setTimeHorizon] = useState<"RECORDED" | "ANNUAL_PROJECTED">("RECORDED");
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Calculate cumulative baseline statistics from actual waste logs
  const baseStats = useMemo(() => {
    let totalWeightKg = 0;
    let totalCo2eAvoidedKg = 0;
    let totalPoints = 0;

    let organicWeightKg = 0;
    let plasticWeightKg = 0;
    let paperWeightKg = 0;
    let metalGlassWeightKg = 0;
    let hazardousWeightKg = 0;

    wasteLogs.forEach((log) => {
      const weight = log.weightKg || 0;
      const co2e = log.co2eKg || weight * 1.2;
      totalWeightKg += weight;
      totalCo2eAvoidedKg += co2e;
      totalPoints += log.points || 0;

      const catLower = (log.category || "").toLowerCase();
      if (catLower.includes("organik") || catLower.includes("makanan")) {
        organicWeightKg += weight;
      } else if (catLower.includes("plastik") || catLower.includes("pet") || catLower.includes("hdpe")) {
        plasticWeightKg += weight;
      } else if (catLower.includes("kertas") || catLower.includes("karton")) {
        paperWeightKg += weight;
      } else if (catLower.includes("logam") || catLower.includes("kaca")) {
        metalGlassWeightKg += weight;
      } else {
        hazardousWeightKg += weight;
      }
    });

    return {
      totalWeightKg,
      totalCo2eAvoidedKg,
      totalPoints,
      organicWeightKg,
      plasticWeightKg,
      paperWeightKg,
      metalGlassWeightKg,
      hazardousWeightKg,
      logCount: wasteLogs.length,
    };
  }, [wasteLogs]);

  // Combined stats with interactive simulation addition & annual projection factor
  const activeMetrics = useMemo(() => {
    const horizonMultiplier = timeHorizon === "ANNUAL_PROJECTED" ? 52 : 1; // 52 weeks in a year projection

    const effectiveOrganic = (baseStats.organicWeightKg + simulationExtraOrganicKg) * horizonMultiplier;
    const effectivePlastic = (baseStats.plasticWeightKg + simulationExtraPlasticKg) * horizonMultiplier;
    const effectivePaper = baseStats.paperWeightKg * horizonMultiplier;
    const effectiveMetal = baseStats.metalGlassWeightKg * horizonMultiplier;
    const effectiveHazardous = baseStats.hazardousWeightKg * horizonMultiplier;

    // Direct CO2e coefficients
    const organicCo2 = effectiveOrganic * 1.25; // avoided methane in anaerobic landfill
    const plasticCo2 = effectivePlastic * 1.42; // virgin petroleum displacement
    const paperCo2 = effectivePaper * 1.15; // avoided deforestation & energy
    const metalCo2 = effectiveMetal * 2.1;

    const totalWeight = effectiveOrganic + effectivePlastic + effectivePaper + effectiveMetal + effectiveHazardous;
    const totalCo2 = organicCo2 + plasticCo2 + paperCo2 + metalCo2;

    // Real-world equivalencies
    const treeEquiv = totalCo2 / TREE_CO2_YEAR_KG;
    const electricityKwhEquiv = totalCo2 / KWH_CO2_KG;
    const carKmEquiv = totalCo2 / CAR_KM_CO2_KG;
    const waterSavedLiters = effectivePaper * WATER_SAVED_PER_KG_PAPER;
    const bsfProteinKg = effectiveOrganic * 0.22;
    const compostPocLiters = effectiveOrganic * 0.55;
    const estimatedBottlesDiverted = Math.round((effectivePlastic / 0.025)); // avg 25g per bottle

    // Economic Circular Value Recovery
    const economicValueIdr = Math.round(
      effectivePlastic * 3800 +
      effectivePaper * 1800 +
      effectiveOrganic * 2200 +
      effectiveMetal * 6000
    );

    // Recovery efficiency percentage (organic + recyclables over total)
    const recoveryRate = totalWeight > 0 ? Math.min(100, Math.round(((totalWeight - effectiveHazardous) / totalWeight) * 100)) : 0;

    return {
      totalWeight,
      totalCo2,
      effectiveOrganic,
      effectivePlastic,
      effectivePaper,
      effectiveMetal,
      effectiveHazardous,
      treeEquiv,
      electricityKwhEquiv,
      carKmEquiv,
      waterSavedLiters,
      bsfProteinKg,
      compostPocLiters,
      estimatedBottlesDiverted,
      economicValueIdr,
      recoveryRate,
    };
  }, [baseStats, simulationExtraOrganicKg, simulationExtraPlasticKg, timeHorizon]);

  const copyImpactSummary = () => {
    const text = `🌿 Laporan Dampak Sirkular SiklusKita:
• Total Sampah Tereduksi: ${activeMetrics.totalWeight.toFixed(2)} kg
• Emisi Karbon Dicegah: ${activeMetrics.totalCo2.toFixed(2)} kg CO2e
• Setara Serapan: ${activeMetrics.treeEquiv.toFixed(1)} bibit pohon / tahun
• Hemat Air Bersih: ${activeMetrics.waterSavedLiters.toFixed(0)} Liter
• Potensi Nilai Sirkular: Rp ${activeMetrics.economicValueIdr.toLocaleString("id-ID")}
Terverifikasi oleh Sistem Pemantauan SiklusKita DKI Jakarta.`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  return (
    <div id="circular-impact-calculator" className={`p-6 rounded-3xl border ${cardBase} space-y-6 transition-all`}>
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-5 dark:border-slate-700/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Recycle className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Kalkulator Dampak Sirkular & Reduksi Karbon
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Konversi otomatis dari log pemilahan aktif menjadi estimasi pencegahan emisi gas rumah kaca (GRK) dan pemulihan sumber daya nyata.
          </p>
        </div>

        {/* View Mode & Share Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Horizon Selector */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-700/70 text-xs font-semibold">
            <button
              onClick={() => setTimeHorizon("RECORDED")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                timeHorizon === "RECORDED"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Data Log Aktual ({baseStats.logCount} log)
            </button>
            <button
              onClick={() => setTimeHorizon("ANNUAL_PROJECTED")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                timeHorizon === "ANNUAL_PROJECTED"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Proyeksi 1 Tahun</span>
            </button>
          </div>

          <button
            onClick={copyImpactSummary}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            title="Salin Ringkasan Dampak"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? "Tersalin!" : "Bagikan Dampak"}</span>
          </button>
        </div>
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Carbon Avoided */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Pencegahan Emisi
            </span>
            <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300">
              {activeMetrics.totalCo2.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">kg CO2e</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Menghindari pelepasan metana & gas rumah kaca
          </p>
        </div>

        {/* Metric 2: Total Landfill Waste Diverted */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-blue-500/10 border border-teal-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
              Pengalihan Sampah
            </span>
            <Scale className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-teal-700 dark:text-teal-300">
              {activeMetrics.totalWeight.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">kg</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Dialihkan dari beban TPA Bantargebang
          </p>
        </div>

        {/* Metric 3: Resource Recovery Rate */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10 border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Efisiensi Pemulihan
            </span>
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-300">
              {activeMetrics.recoveryRate}%
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Terserap Daur Ulang</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Hanya {(100 - activeMetrics.recoveryRate).toFixed(0)}% residu non-daur ulang
          </p>
        </div>

        {/* Metric 4: Estimated Economic Recovery Value */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-violet-500/10 border border-blue-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Nilai Sirkular
            </span>
            <Coins className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Rp</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-300">
              {activeMetrics.economicValueIdr.toLocaleString("id-ID")}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Nilai ekonomi bahan baku sekunder
          </p>
        </div>
      </div>

      {/* Real-World Equivalencies Display */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Dampak Riil Setara (Ekivalensi Lingkungan)</span>
          </div>
          <span className="text-[11px] text-slate-400">Standar IPCC & KLHK RI</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TreeDeciduous className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                {activeMetrics.treeEquiv.toFixed(1)} Pohon
              </div>
              <div className="text-[10px] text-slate-400">Serapan CO2 1 tahun</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                {activeMetrics.electricityKwhEquiv.toFixed(0)} kWh
              </div>
              <div className="text-[10px] text-slate-400">Penghematan energi listrik</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                {activeMetrics.waterSavedLiters.toFixed(0)} L
              </div>
              <div className="text-[10px] text-slate-400">Air bersih terselamatkan</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                {activeMetrics.carKmEquiv.toFixed(0)} km
              </div>
              <div className="text-[10px] text-slate-400">Jarak mobil bensin ditekan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Recovery Streams (Detailed Products) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Aliran Pemulihan Material & Produk Sirkular
          </h4>
          <button
            onClick={() => setShowBreakdownDetails(!showBreakdownDetails)}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 cursor-pointer hover:underline"
          >
            <span>{showBreakdownDetails ? "Sembunyikan Rincian" : "Lihat Rincian Aliran"}</span>
            {showBreakdownDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Stream 1: Organik & BSF Bioconversion */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-600 dark:text-emerald-400">Organik & Biokonversi</span>
              <span className="font-mono">{activeMetrics.effectiveOrganic.toFixed(1)} kg</span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Pakan Maggot BSF:</span>
                <span className="font-medium">~{activeMetrics.bsfProteinKg.toFixed(1)} kg larva protein</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pupuk Cair (POC):</span>
                <span className="font-medium">~{activeMetrics.compostPocLiters.toFixed(1)} Liter pupuk</span>
              </div>
            </div>
          </div>

          {/* Stream 2: Plastik rPET & Resin Recycler */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-teal-600 dark:text-teal-400">Plastik PET/HDPE</span>
              <span className="font-mono">{activeMetrics.effectivePlastic.toFixed(1)} kg</span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Botol Dicegah dari Laut:</span>
                <span className="font-medium">~{activeMetrics.estimatedBottlesDiverted} botol</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flake Daur Ulang Tekstil:</span>
                <span className="font-medium">~{(activeMetrics.effectivePlastic * 0.92).toFixed(1)} kg rPET</span>
              </div>
            </div>
          </div>

          {/* Stream 3: Kertas & Serat Selulosa */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-amber-600 dark:text-amber-400">Kardus & Kertas</span>
              <span className="font-mono">{activeMetrics.effectivePaper.toFixed(1)} kg</span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Pulp Daur Ulang:</span>
                <span className="font-medium">~{(activeMetrics.effectivePaper * 0.85).toFixed(1)} kg kertas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hemat Air Bersih:</span>
                <span className="font-medium">~{activeMetrics.waterSavedLiters.toFixed(0)} Liter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Breakdown Details */}
        {showBreakdownDetails && (
          <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2.5">
            <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Metodologi Perhitungan Standar Jakarta Climate Action Plan (JCAP)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              Setiap 1 kg sampah organik yang membusuk di TPA tanpa pengelolaan melepaskan rata-rata 1.25 kg CO2e berupa gas metana (CH4) yang 28x lebih berbahaya dibanding CO2. Dengan mengalihkan ke biokonversi BSF dan komposting, metana ditekan mendekati nol. Plastik yang didaur ulang menggantikan pelet minyak bumi mentah dengan rasio emisi 1:1.42.
            </p>
          </div>
        )}
      </div>

      {/* Interactive Simulation / What-If Scenario Slider */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-50 to-emerald-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/20 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Simulasi Skenario Tambahan (What-If Forecaster)
            </span>
          </div>
          {(simulationExtraOrganicKg > 0 || simulationExtraPlasticKg > 0) && (
            <button
              onClick={() => {
                setSimulationExtraOrganicKg(0);
                setSimulationExtraPlasticKg(0);
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer"
            >
              Reset Simulasi
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Slider 1: Tambahan Organik */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-600 dark:text-slate-300">
                Pilah Organik Tambahan:
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                +{simulationExtraOrganicKg} kg/pekan
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={simulationExtraOrganicKg}
              onChange={(e) => setSimulationExtraOrganicKg(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 kg</span>
              <span>10 kg</span>
              <span>20 kg/minggu</span>
            </div>
          </div>

          {/* Slider 2: Tambahan Plastik */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-600 dark:text-slate-300">
                Pilah Plastik Tambahan:
              </span>
              <span className="font-mono text-teal-600 dark:text-teal-400">
                +{simulationExtraPlasticKg} kg/pekan
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={simulationExtraPlasticKg}
              onChange={(e) => setSimulationExtraPlasticKg(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 kg</span>
              <span>5 kg</span>
              <span>10 kg/minggu</span>
            </div>
          </div>
        </div>

        {(simulationExtraOrganicKg > 0 || simulationExtraPlasticKg > 0) && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
            <span>
              🎉 Simulasi aktif: Tambahan {simulationExtraOrganicKg + simulationExtraPlasticKg} kg/pekan akan mencegah ekstra{" "}
              <strong>
                {((simulationExtraOrganicKg * 1.25 + simulationExtraPlasticKg * 1.42) * (timeHorizon === "ANNUAL_PROJECTED" ? 52 : 1)).toFixed(1)} kg CO2e
              </strong>{" "}
              emisi!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
