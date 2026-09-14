/**
 * Infrastructure & AI Predictive Workload Allocation View
 * Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState } from "react";
import {
  Cpu,
  TrendingUp,
  Server,
  Zap,
  Truck,
  Leaf,
  DollarSign,
  AlertCircle,
  Play,
  RotateCcw,
  Shield,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { ResourceAllocationData } from "../types";
import { PILOT_REGIONS } from "../data/mockData";

interface InfrastructureViewProps {
  isDarkMode: boolean;
}

export const InfrastructureView: React.FC<InfrastructureViewProps> = ({ isDarkMode }) => {
  const [selectedRegion, setSelectedRegion] = useState("Jakarta Selatan (Pilot: Cilandak/Pondok Labu)");
  const [tonnage, setTonnage] = useState(14.8);
  const [households, setHouseholds] = useState(1240);
  const [scenario, setScenario] = useState<"normal" | "holiday_feast" | "plastic_drive" | "rain_storm">("normal");
  const [isLoading, setIsLoading] = useState(false);
  const [allocationResult, setAllocationResult] = useState<ResourceAllocationData>({
    predictedSurgePercentage: 18,
    recommendedFleetAllocation: 14,
    bsfMaggotFacilityCapacityKg: 7696,
    communalCompostAerationScheduleHours: 24,
    autoScalingWorkerPods: 5,
    efficiencyScorePercent: 94.8,
    carbonAvertedKgEstimated: 11248,
    operationalCostSavingsPercent: 34.2,
    strategicRecommendation:
      "Alokasi sumber daya optimal. Keseimbangan beban kerja armada penjemputan dan TPS3R terjaga pada efisiensi 94.8% dengan biaya operasional terkendali.",
  });

  const runPrediction = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/predict-workload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region: selectedRegion,
          currentTonnage: tonnage,
          activeHouseholds: households,
          surgeScenario: scenario,
          activeFleetCount: 12,
        }),
      });
      const json = await res.json();
      if (json.data) {
        setAllocationResult(json.data);
      }
    } catch (err) {
      console.error("Failed to run predictive allocation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  return (
    <div className="space-y-6">
      {/* Top Banner Context */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkMode
          ? "bg-gradient-to-r from-emerald-950/50 via-slate-900 to-teal-950/40 border-emerald-900/60"
          : "bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-emerald-100 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Software Infrastruktur & Manajemen Beban Kerja AI
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Mengoptimalkan alokasi armada penjemputan, kapasitas biokonversi maggot BSF, dan komposter rotary drum di DKI Jakarta secara otomatis dan terukur. Didukung analitik prediktif cloud auto-scaling dengan jaminan ketersediaan 99.98% & efisiensi biaya operasional hingga 34.2%.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Cluster Kube-AutoScaler: Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Top Telemetry Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`p-4 rounded-xl border ${cardBase}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Efisiensi Alokasi</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {allocationResult.efficiencyScorePercent}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">Auto-Optimized</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Keseimbangan beban TPS3R & Bank Sampah
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${cardBase}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Penghematan Biaya</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {allocationResult.operationalCostSavingsPercent}%
            </span>
            <span className="text-xs text-blue-600 font-medium">vs Konvensional</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Reduksi konsumsi BBM & rute jemput kosong
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${cardBase}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Auto-Scaler Pods</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
              {allocationResult.autoScalingWorkerPods} Pods
            </span>
            <span className="text-xs text-purple-500 font-medium">Cloud Kubernetes</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Skalabilitas dinamis sesuai surge timbulan
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${cardBase}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">CO2e Tereduksi (Est.)</span>
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-teal-600 dark:text-teal-400">
              {allocationResult.carbonAvertedKgEstimated.toLocaleString()} kg
            </span>
            <span className="text-xs text-teal-600 font-medium">CO2e</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Pengalihan sisa organik & plastik dari TPA
          </p>
        </div>
      </div>

      {/* Main Interactive Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Parameter Controls & Simulation */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border ${cardBase} space-y-5`}>
          <div className="flex items-center justify-between border-b pb-3 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h3 className="font-semibold text-sm">Simulasi Parameter & Analitik Beban</h3>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              DKI Benchmark
            </span>
          </div>

          <div className="space-y-4">
            {/* Region Select */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Wilayah Operasional DKI Jakarta
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className={`w-full text-xs rounded-xl px-3 py-2.5 border transition ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-700 text-slate-100 focus:border-emerald-500"
                    : "bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-600"
                }`}
              >
                <option value="Jakarta Selatan (Pilot: Cilandak/Pondok Labu)">
                  Jakarta Selatan (Pilot: Cilandak & Pondok Labu)
                </option>
                <option value="Jakarta Pusat (Menteng & Tanah Abang)">
                  Jakarta Pusat (Menteng & Tanah Abang)
                </option>
                <option value="Jakarta Timur (Duren Sawit & Jatinegara)">
                  Jakarta Timur (Duren Sawit & Jatinegara)
                </option>
                <option value="Jakarta Barat (Kebon Jeruk & Kembangan)">
                  Jakarta Barat (Kebon Jeruk & Kembangan)
                </option>
                <option value="Jakarta Utara (Kelapa Gading & Penjaringan)">
                  Jakarta Utara (Kelapa Gading & Penjaringan)
                </option>
              </select>
            </div>

            {/* Operational Scenario */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Kondisi Skenario Lapangan
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "normal", label: "Normal Rutin", desc: "Volume harian stabil" },
                  { id: "holiday_feast", label: "Pesta / Hari Raya", desc: "Surge organik +65%" },
                  { id: "plastic_drive", label: "Pilah Kardus & Botol", desc: "Surge anorganik +40%" },
                  { id: "rain_storm", label: "Musim Hujan Deras", desc: "Aerasi dipercepat" },
                ].map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setScenario(sc.id as any)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      scenario === sc.id
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xs">{sc.label}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{sc.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders for Tonnage & Households */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Input Timbulan Sampah:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{tonnage} Ton / Hari</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="35"
                  step="0.5"
                  value={tonnage}
                  onChange={(e) => setTonnage(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Partisipasi Rumah Tangga:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{households.toLocaleString()} KK</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="4000"
                  step="50"
                  value={households}
                  onChange={(e) => setHouseholds(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            {/* Run Button */}
            <button
              id="run-ai-optimizer-btn"
              onClick={runPrediction}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Menganalisis Beban Kerja via Gemini 3.8 Flash...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Jalankan Analitik Prediktif & Optimalkan Alokasi</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Optimization Output & Dynamic Auto-scaling */}
        <div className="lg:col-span-7 space-y-4">
          {/* Recommendation Banner */}
          <div className={`p-4 rounded-2xl border ${
            isDarkMode
              ? "bg-emerald-950/30 border-emerald-800/60 text-slate-200"
              : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
          }`}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-emerald-700 dark:text-emerald-300">
                    Rekomendasi Strategis AI SiklusKita
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 font-mono">
                    Surge: {allocationResult.predictedSurgePercentage >= 0 ? "+" : ""}
                    {allocationResult.predictedSurgePercentage}%
                  </span>
                </div>
                <p className="leading-relaxed">{allocationResult.strategicRecommendation}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Allocation Grid */}
          <div className={`p-5 rounded-2xl border ${cardBase} space-y-4`}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Hasil Alokasi Sumber Daya Terukur
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <Truck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Armada Dispatc</span>
                </div>
                <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {allocationResult.recommendedFleetAllocation} Unit
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Motor Listrik & Truk Ringan</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Kapasitas BSF Maggot</span>
                </div>
                <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {allocationResult.bsfMaggotFacilityCapacityKg.toLocaleString()} kg/hari
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Pakan Biokonversi Organik</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
                  <span>Interval Aerasi Kompos</span>
                </div>
                <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Tiap {allocationResult.communalCompostAerationScheduleHours} Jam
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Mencegah Bau & Gas Metana</div>
              </div>
            </div>

            {/* Topology / Cluster Health */}
            <div className="pt-2 border-t dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Topologi Node Infrastruktur Komputasi Cloud Run
                </span>
                <span className="text-[10px] font-mono text-emerald-500">
                  Uptime 99.98% • Latency 38ms
                </span>
              </div>

              {/* Dynamic Pods Visualizer */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const isActive = idx < allocationResult.autoScalingWorkerPods;
                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        isActive
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                          : "bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-40"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                        <span className="text-[10px] font-mono font-semibold">Pod #{idx + 1}</span>
                      </div>
                      <span className="text-[9px] block">
                        {isActive ? "ACTIVE LOAD" : "STANDBY"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DKI Regional Workload Saturation Breakdown */}
      <div className={`p-5 rounded-2xl border ${cardBase} space-y-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Distribusi Beban Kerja 5 Wilayah DKI Jakarta</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Status saturasi TPS3R, Bank Sampah, dan armada penjemputan terpilah per kotamadya
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Total Timbulan: 10,600+ Ton/Hari
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PILOT_REGIONS.map((region) => (
            <div
              key={region.id}
              className={`p-3.5 rounded-xl border transition-all ${
                region.id === "jaksel-pilot"
                  ? "border-emerald-500/60 bg-emerald-500/5 dark:bg-emerald-950/20"
                  : "border-slate-200 dark:border-slate-700/70"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-xs text-slate-800 dark:text-slate-100">
                    {region.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{region.zone}</div>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                  region.id === "jaksel-pilot"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}>
                  {region.status}
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Saturasi Kapasitas TPS3R:</span>
                  <span className="font-semibold">{region.saturation}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      region.saturation > 80 ? "bg-rose-500" : region.saturation > 50 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${region.saturation}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-2 border-t dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>{region.householdsActive} Rumah Tangga</span>
                <span>{region.tps3rCount} TPS3R • {region.bankSampahCount} Bank Sampah</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
