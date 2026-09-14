/**
 * Capacity Watch Banner & Real-Time Alert System
 * Greeneration Circle 2026 | DKI Jakarta Circular Infrastructure
 * Monitors nearest Bank Sampah real-time capacity and suggests optimal alternative locations on the map.
 */

import React, { useState } from "react";
import {
  AlertTriangle,
  Radio,
  Navigation,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Volume2,
  VolumeX,
  RefreshCw,
  Sliders,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { BankSampahFacility, SuggestedAlternativeFacility } from "../types";

interface CapacityWatchBannerProps {
  isDarkMode: boolean;
  nearestFacility: BankSampahFacility;
  alternatives: SuggestedAlternativeFacility[];
  activeRerouteFacility: BankSampahFacility | null;
  onSelectAlternative: (facility: BankSampahFacility) => void;
  onResetReroute: () => void;
  isLiveTelemetry: boolean;
  setIsLiveTelemetry: (active: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onSimulateCapacity: (capacity: number) => void;
  lastTelemetryPing: string;
}

export const CapacityWatchBanner: React.FC<CapacityWatchBannerProps> = ({
  isDarkMode,
  nearestFacility,
  alternatives,
  activeRerouteFacility,
  onSelectAlternative,
  onResetReroute,
  isLiveTelemetry,
  setIsLiveTelemetry,
  soundEnabled,
  setSoundEnabled,
  onSimulateCapacity,
  lastTelemetryPing,
}) => {
  const [isSimDrawerOpen, setIsSimDrawerOpen] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const isCritical = nearestFacility.capacityPercent >= 85;
  const isWarning = nearestFacility.capacityPercent >= 75 && !isCritical;
  const isApproachingFull = isCritical || isWarning;

  // Banner background styling
  const bannerBg = isCritical
    ? isDarkMode
      ? "bg-gradient-to-r from-rose-950/70 via-red-950/40 to-slate-900/90 border-rose-600/50 text-rose-100"
      : "bg-gradient-to-r from-rose-50 via-amber-50/50 to-white border-rose-300 text-rose-950 shadow-md"
    : isWarning
    ? isDarkMode
      ? "bg-gradient-to-r from-amber-950/70 via-orange-950/40 to-slate-900/90 border-amber-500/50 text-amber-100"
      : "bg-gradient-to-r from-amber-50 via-yellow-50/50 to-white border-amber-300 text-amber-950 shadow-md"
    : isDarkMode
    ? "bg-slate-900/60 border-slate-800 text-slate-200"
    : "bg-emerald-50/50 border-emerald-200/80 text-emerald-950";

  return (
    <div
      id="capacity-watch-container"
      className={`rounded-2xl border transition-all duration-300 relative overflow-hidden ${bannerBg} ${
        isCritical ? "ring-1 ring-rose-500/30 shadow-lg" : ""
      }`}
    >
      {/* Real-Time Ambient Indicator Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-[11px]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <Radio
              className={`w-3.5 h-3.5 ${
                isLiveTelemetry
                  ? isCritical
                    ? "text-rose-500 animate-pulse"
                    : isWarning
                    ? "text-amber-500 animate-pulse"
                    : "text-emerald-500 animate-pulse"
                  : "text-slate-400"
              }`}
            />
            <span
              className={
                isCritical
                  ? "text-rose-600 dark:text-rose-400"
                  : isWarning
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }
            >
              Capacity Watch IoT Telemetry
            </span>
          </div>

          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline text-slate-500 dark:text-slate-400">
            Node: <span className="font-mono font-medium">JKT-IOT-RW04-A1</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 dark:text-slate-400">
            Sinkronisasi: <span className="font-medium">{lastTelemetryPing}</span>
          </span>
        </div>

        {/* Quick controls: Sound, Simulation, Telemetry Toggle */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-capacity-audio"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1 rounded-lg border text-xs transition cursor-pointer flex items-center gap-1 ${
              soundEnabled
                ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                : "border-slate-300 dark:border-slate-700 text-slate-400 bg-transparent"
            }`}
            title={soundEnabled ? "Notifikasi Suara Aktif" : "Notifikasi Suara Nonaktif"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[10px] hidden md:inline">{soundEnabled ? "Audio On" : "Muted"}</span>
          </button>

          <button
            id="btn-toggle-sim-drawer"
            onClick={() => setIsSimDrawerOpen(!isSimDrawerOpen)}
            className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 transition cursor-pointer"
            title="Buka panel simulasi kapasitas real-time"
          >
            <Sliders className="w-3 h-3 text-emerald-500" />
            <span>Simulasi Telemetry</span>
            {isSimDrawerOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Interactive Simulation Drawer (Collapsible) */}
      {isSimDrawerOpen && (
        <div className="p-3 bg-slate-100/90 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-xs space-y-2.5 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Uji Skenario Real-Time Capacity Watch:</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pilih skenario beban muatan untuk menguji notifikasi peringatan kapasitas dan rekomendasi rute alternatif di peta.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Live Auto-Tick:</span>
              <button
                id="btn-toggle-live-tick"
                onClick={() => setIsLiveTelemetry(!isLiveTelemetry)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                  isLiveTelemetry
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                {isLiveTelemetry ? "AKTIF (8s)" : "PAUSED"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              id="sim-btn-normal"
              onClick={() => onSimulateCapacity(60)}
              className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                nearestFacility.capacityPercent <= 70
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 font-bold"
                  : "border-slate-300 dark:border-slate-700 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <div className="text-[10px] uppercase tracking-wide opacity-75">Skenario 1</div>
              <div className="text-xs font-bold">🟢 Normal (60%)</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Daya tampung aman</div>
            </button>

            <button
              id="sim-btn-warning"
              onClick={() => onSimulateCapacity(82)}
              className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                nearestFacility.capacityPercent > 70 && nearestFacility.capacityPercent < 85
                  ? "border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-200 font-bold"
                  : "border-slate-300 dark:border-slate-700 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <div className="text-[10px] uppercase tracking-wide opacity-75">Skenario 2</div>
              <div className="text-xs font-bold">⚠️ Padat (82%)</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Mulai mendekati batas</div>
            </button>

            <button
              id="sim-btn-critical"
              onClick={() => onSimulateCapacity(92)}
              className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                nearestFacility.capacityPercent >= 85
                  ? "border-rose-500 bg-rose-500/15 text-rose-800 dark:text-rose-200 font-bold"
                  : "border-slate-300 dark:border-slate-700 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <div className="text-[10px] uppercase tracking-wide opacity-75">Skenario 3</div>
              <div className="text-xs font-bold">🚨 Hampir Penuh (92%)</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Peringatan darurat & reroute</div>
            </button>

            <button
              id="sim-btn-empty"
              onClick={() => {
                onSimulateCapacity(32);
                onResetReroute();
              }}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition cursor-pointer"
            >
              <div className="text-[10px] uppercase tracking-wide opacity-75">Skenario 4</div>
              <div className="text-xs font-bold">🚛 Kosongkan Truk (32%)</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Armada DLH angkut muatan</div>
            </button>
          </div>
        </div>
      )}

      {/* Main Alert Body */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* If nearest facility is approaching full capacity */}
        {isApproachingFull ? (
          <div className="space-y-4">
            {/* Top alert banner row */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-2xl flex-shrink-0 text-white shadow-md ${
                    isCritical
                      ? "bg-gradient-to-br from-rose-600 to-red-700 shadow-rose-600/30 animate-pulse"
                      : "bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30"
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      {isCritical
                        ? "Peringatan Capacity Watch: Bank Sampah Terdekat Mendekati Kapasitas Penuh!"
                        : "Peringatan Dini: Bank Sampah Terdekat Mulai Padat"}
                    </h4>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase border ${
                        isCritical
                          ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40"
                          : "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40"
                      }`}
                    >
                      {nearestFacility.capacityPercent}% Terisi
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                    Fasilitas terdekat Anda,{" "}
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {nearestFacility.name}
                    </span>{" "}
                    ({nearestFacility.distanceKm} km dari rumah Anda), terpantau via sensor IoT sedang menampung{" "}
                    <span className="font-bold">{nearestFacility.capacityPercent}% kapasitas</span>. Timbulan sampah anorganik
                    yang tinggi berpotensi menimbulkan antrean panjang atau penolakan setoran sementara.
                  </p>
                </div>
              </div>

              {/* Real-time Status Gauge Card */}
              <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-black/10 dark:border-white/10 flex-shrink-0 sm:min-w-[200px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Muatan Saat Ini:</span>
                  <span
                    className={`font-black text-sm ${
                      isCritical ? "text-rose-600" : "text-amber-600"
                    }`}
                  >
                    {nearestFacility.capacityPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCritical ? "bg-rose-600" : "bg-amber-500"
                    }`}
                    style={{ width: `${nearestFacility.capacityPercent}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Sisa Ruang: {100 - nearestFacility.capacityPercent}%</span>
                  <span className="font-bold text-rose-500">Est. Penuh: ~35 mnt</span>
                </div>
              </div>
            </div>

            {/* Recommended Alternatives Header & Action Cards */}
            <div className="pt-2 border-t border-black/5 dark:border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Saran Lokasi Alternatif (Kapasitas Aman & Buka):</span>
                </div>

                {activeRerouteFacility && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Rute aktif: {activeRerouteFacility.name.split(" ")[2] || activeRerouteFacility.name}
                    </span>
                    <button
                      onClick={onResetReroute}
                      className="text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
                    >
                      Batal Pengalihan
                    </button>
                  </div>
                )}
              </div>

              {/* Cards Grid of Suggested Alternative Facilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {alternatives.map((item, idx) => {
                  const isCurrentReroute = activeRerouteFacility?.id === item.facility.id;
                  const isLowestCapacity = idx === 0;

                  return (
                    <div
                      key={item.facility.id}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 relative ${
                        isCurrentReroute
                          ? "bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md"
                          : "bg-white/80 dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-700/80 hover:border-emerald-400"
                      }`}
                    >
                      {isLowestCapacity && (
                        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wide shadow-xs flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Paling Direkomendasikan</span>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              {item.facility.typeLabel}
                            </span>
                            <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
                              {item.facility.name}
                            </h5>
                          </div>
                          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                            {item.distanceKm} km
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                          <Navigation className="w-3 h-3 text-emerald-500" />
                          <span>~{item.travelTimeMinutes} menit perjalanan</span>
                          <span>•</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            Sisa ruang: {item.capacityHeadroomPercent}%
                          </span>
                        </div>

                        {/* Capacity meter bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${item.facility.capacityPercent}%` }}
                          />
                        </div>

                        {/* Material accepts chips */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.facility.accepts.slice(0, 3).map((acc, aIdx) => (
                            <span
                              key={aIdx}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              {acc}
                            </span>
                          ))}
                          {item.facility.accepts.length > 3 && (
                            <span className="text-[9px] text-slate-400">
                              +{item.facility.accepts.length - 3} lainnya
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CTA Button to View on Map & Reroute */}
                      <button
                        id={`btn-reroute-to-${item.facility.id}`}
                        onClick={() => onSelectAlternative(item.facility)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-98 shadow-xs ${
                          isCurrentReroute
                            ? "bg-emerald-600 text-white hover:bg-emerald-500"
                            : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-300 dark:border-emerald-700"
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>
                          {isCurrentReroute
                            ? "✓ Rute Ditampilkan di Peta"
                            : "Lihat di Peta & Buat Rute"}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Normal Capacity State */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                    Kapasitas Bank Sampah Terdekat Aman ({nearestFacility.capacityPercent}%)
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Optimal
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {nearestFacility.name}
                  </span>{" "}
                  (0.35 km) memiliki ruang tampung luas. Anda dapat menyetor sampah hari ini tanpa antrean.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                id="btn-test-surge"
                onClick={() => onSimulateCapacity(88)}
                className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Uji coba simulasi lonjakan muatan untuk memicu alert Capacity Watch"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Tes Simulasi Penuh (&gt;85%)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
