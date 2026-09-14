/**
 * Waste Infrastructure Map with D3.js Visualization
 * Greeneration Circle 2026 | DKI Jakarta Circular Monitoring
 * Visualizes Bank Sampah facilities, live status, household location,
 * and historical waste drop-off density demand hotspots.
 */

import React, { useState, useMemo, useRef, useEffect } from "react";
import * as d3 from "d3";
import {
  MapPin,
  Flame,
  Layers,
  Building2,
  Navigation,
  Clock,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Info,
  Maximize2,
  Search,
  ChevronRight,
  Filter,
  Check,
  TrendingUp,
  X,
  Plus,
  Recycle,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { BankSampahFacility, DropOffHotspot, SuggestedAlternativeFacility } from "../types";
import { CapacityWatchBanner } from "./CapacityWatchBanner";
import { playCapacityAlertChime } from "../utils/capacityWatchAudio";
import {
  MOCK_BANK_SAMPAH_FACILITIES,
  MOCK_DROP_OFF_HOTSPOTS,
  USER_CURRENT_LOCATION,
  MAP_ROADS,
  MAP_DISTRICT_LABELS,
} from "../data/mockWasteMapData";

interface WasteInfrastructureMapProps {
  isDarkMode: boolean;
}

export const WasteInfrastructureMap: React.FC<WasteInfrastructureMapProps> = ({ isDarkMode }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // State for map interactions
  const [facilities, setFacilities] = useState<BankSampahFacility[]>(MOCK_BANK_SAMPAH_FACILITIES);
  const [hotspots, setHotspots] = useState<DropOffHotspot[]>(MOCK_DROP_OFF_HOTSPOTS);
  const [selectedFacility, setSelectedFacility] = useState<BankSampahFacility | null>(
    MOCK_BANK_SAMPAH_FACILITIES[0]
  );
  const [hoveredHotspot, setHoveredHotspot] = useState<DropOffHotspot | null>(null);
  const [hoveredFacility, setHoveredFacility] = useState<BankSampahFacility | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Capacity Watch Real-Time State
  const [activeRerouteFacility, setActiveRerouteFacility] = useState<BankSampahFacility | null>(null);
  const [isLiveTelemetry, setIsLiveTelemetry] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [lastTelemetryPing, setLastTelemetryPing] = useState<string>("Baru saja");

  // Layer toggles
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [showRadius, setShowRadius] = useState<boolean>(true);
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Zoom and Pan
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Simulation Feedback state
  const [simulatedDropAlert, setSimulatedDropAlert] = useState<string | null>(null);
  const [animatingRippleId, setAnimatingRippleId] = useState<string | null>(null);

  // D3 Color Scales for Hotspot Intensity
  const densityColorScale = useMemo(() => {
    return d3
      .scaleLinear<string>()
      .domain([0.4, 0.65, 0.85, 1.0])
      .range(["#fef08a", "#fb923c", "#ef4444", "#991b1b"])
      .clamp(true);
  }, []);

  // Filtered facilities
  const filteredFacilities = useMemo(() => {
    return facilities.filter((fac) => {
      const matchType =
        filterType === "ALL"
          ? true
          : filterType === "OPEN_ONLY"
          ? fac.status === "OPEN"
          : filterType === "CAPACITY_SAFE"
          ? fac.capacityPercent < 75 && fac.status === "OPEN"
          : fac.type === filterType;
      const matchSearch =
        fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.accepts.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchType && matchSearch;
    });
  }, [facilities, filterType, searchQuery]);

  // Capacity Watch: Identify user's nearest Bank Sampah facility
  const nearestFacility = useMemo(() => {
    const list = facilities.filter((f) => f.type === "BANK_SAMPAH" || f.type === "TPS3R");
    return [...list].sort((a, b) => a.distanceKm - b.distanceKm)[0] || facilities[0];
  }, [facilities]);

  // Capacity Watch: Recommend alternative facilities with low capacity and proximity
  const capacityAlternatives = useMemo<SuggestedAlternativeFacility[]>(() => {
    const candidates = facilities.filter(
      (f) => f.id !== nearestFacility.id && f.status !== "CLOSED"
    );

    return candidates
      .map((fac) => {
        const headroom = 100 - fac.capacityPercent;
        const proximityScore = Math.max(0, 10 - fac.distanceKm * 3);
        const headroomScore = headroom * 0.5;
        const suitabilityScore = proximityScore + headroomScore + (fac.verifiedByDlh ? 5 : 0);

        const reasons: string[] = [];
        if (fac.capacityPercent <= 50) reasons.push("Kapasitas sangat longgar (<50%)");
        else if (fac.capacityPercent <= 70) reasons.push("Daya tampung aman");
        if (fac.distanceKm <= 1.0) reasons.push("Jarak dekat (<1 km)");
        if (fac.verifiedByDlh) reasons.push("Terverifikasi DLH DKI");

        return {
          facility: fac,
          distanceKm: fac.distanceKm,
          travelTimeMinutes: Math.max(2, Math.round(fac.distanceKm * 4)),
          capacityHeadroomPercent: headroom,
          suitabilityScore,
          reasons,
        };
      })
      .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
      .slice(0, 3);
  }, [facilities, nearestFacility]);

  // Real-time IoT Telemetry Auto-Tick
  useEffect(() => {
    if (!isLiveTelemetry) return;

    const interval = setInterval(() => {
      setLastTelemetryPing("Baru saja (Real-time IoT)");

      setFacilities((prev) =>
        prev.map((f) => {
          if (f.status === "CLOSED") return f;
          const delta = (Math.random() - 0.48) * 0.8;
          const newCap = Math.max(12, Math.min(97, Math.round((f.capacityPercent + delta) * 10) / 10));
          return {
            ...f,
            capacityPercent: Math.round(newCap),
          };
        })
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [isLiveTelemetry]);

  // Capacity Watch: Handler to activate rerouting on map to alternative location
  const handleSelectAlternative = (facility: BankSampahFacility) => {
    setActiveRerouteFacility(facility);
    setSelectedFacility(facility);

    // Smoothly pan map towards target
    const targetX = facility.x;
    const targetY = facility.y;
    const midX = (USER_CURRENT_LOCATION.x + targetX) / 2;
    const midY = (USER_CURRENT_LOCATION.y + targetY) / 2;
    const newOffsetX = (420 - midX) * 0.6;
    const newOffsetY = (280 - midY) * 0.6;

    setPanOffset({ x: newOffsetX, y: newOffsetY });
    setZoomLevel(1.15);

    setSimulatedDropAlert(
      `Rute pengalihan aktif! Dialihkan ke ${facility.name} (${facility.distanceKm} km • ${facility.capacityPercent}% muatan). Bebas antrean!`
    );
    setTimeout(() => setSimulatedDropAlert(null), 5000);
  };

  const handleResetReroute = () => {
    setActiveRerouteFacility(null);
    handleResetView();
  };

  const handleSimulateCapacity = (targetCapacity: number) => {
    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id === nearestFacility.id) {
          return {
            ...f,
            capacityPercent: targetCapacity,
            status: targetCapacity >= 85 ? "FULL_SOON" : "OPEN",
          };
        }
        return f;
      })
    );

    setLastTelemetryPing("Baru saja (Uji Telemetry)");

    if (targetCapacity >= 85) {
      if (soundEnabled) {
        playCapacityAlertChime("CRITICAL");
      }
      setSimulatedDropAlert(
        `⚠️ Peringatan Capacity Watch: ${nearestFacility.name} mencapai ${targetCapacity}% kapasitas. Rekomendasi alternatif siap di peta.`
      );
    } else if (targetCapacity >= 75) {
      if (soundEnabled) {
        playCapacityAlertChime("WARNING");
      }
      setSimulatedDropAlert(
        `Peringatan Dini: ${nearestFacility.name} mulai padat (${targetCapacity}%).`
      );
    } else {
      setSimulatedDropAlert(
        `Kapasitas ${nearestFacility.name} normal (${targetCapacity}%). Beban aman.`
      );
    }

    setTimeout(() => setSimulatedDropAlert(null), 4500);
  };

  // Handle Zoom In / Out / Reset
  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, Number((z + 0.25).toFixed(2))));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.75, Number((z - 0.25).toFixed(2))));
  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedFacility(MOCK_BANK_SAMPAH_FACILITIES[0]);
  };

  // Mouse Drag for Pan
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // Only drag if not clicking directly on a button/interactive element
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Live Drop-off Simulation in nearest hotspot
  const handleSimulateNewDropOff = () => {
    const targetHotspotId = "hotspot-01"; // RW 04 Cilandak
    setAnimatingRippleId(targetHotspotId);

    setHotspots((prev) =>
      prev.map((h) => {
        if (h.id === targetHotspotId) {
          const updatedKg = h.totalKgWeekly + 8.5;
          const updatedCount = h.dropOffCount + 1;
          return {
            ...h,
            totalKgWeekly: updatedKg,
            dropOffCount: updatedCount,
            intensityScore: Math.min(1.0, h.intensityScore + 0.02),
          };
        }
        return h;
      })
    );

    // Also update capacity of Bank Sampah Melati
    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id === "bs-melati-rw04") {
          return {
            ...f,
            capacityPercent: Math.min(96, f.capacityPercent + 2),
            historicalTotalKg: f.historicalTotalKg + 8.5,
            historicalDropOffCount: f.historicalDropOffCount + 1,
          };
        }
        return f;
      })
    );

    setSimulatedDropAlert(
      "Drop-off baru berhasil disimulasikan di RW 04 (+8.5 kg)! Kepadatan hotspot terupdate."
    );
    setTimeout(() => setAnimatingRippleId(null), 1800);
    setTimeout(() => setSimulatedDropAlert(null), 4500);
  };

  // Compute metrics for top summary
  const summaryMetrics = useMemo(() => {
    const openCount = facilities.filter((f) => f.status === "OPEN").length;
    const totalWeeklyKg = hotspots.reduce((acc, h) => acc + h.totalKgWeekly, 0);
    const nearestFac = [...facilities].sort((a, b) => a.distanceKm - b.distanceKm)[0];
    const highestHotspot = [...hotspots].sort((a, b) => b.totalKgWeekly - a.totalKgWeekly)[0];

    return {
      openCount,
      totalWeeklyKg,
      nearestFac,
      highestHotspot,
    };
  }, [facilities, hotspots]);

  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  return (
    <div
      id="waste-infrastructure-map-section"
      className={`p-6 rounded-3xl border ${cardBase} space-y-6 transition-all relative overflow-hidden`}
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-5 border-slate-200 dark:border-slate-700/60 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                  Peta Infrastruktur Sirkular & Hotspot Penyetoran
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500" />
                  D3.js Density Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualisasi spasial lokasi Bank Sampah dan titik drop-off terdekat berbasis densitas historis penyetoran sampah warga.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Simulation Trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-simulate-hotspot-drop"
            onClick={handleSimulateNewDropOff}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer active:scale-95"
            title="Simulasikan transaksi penyetoran sampah baru di hotspot terdekat"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulasi Drop-off Baru (+8.5 kg)</span>
          </button>

          <button
            id="btn-reset-map-view"
            onClick={handleResetView}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition cursor-pointer"
            title="Reset Posisi Peta"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Overview Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Fasilitas Buka
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {summaryMetrics.openCount}
            </span>
            <span className="text-xs text-slate-500">/ {facilities.length} Lokasi</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Fasilitas Terdekat
          </div>
          <div className="mt-1 flex items-baseline gap-1.5 truncate">
            <span className="text-xl font-black text-slate-800 dark:text-slate-200">
              {nearestFacility.distanceKm} km
            </span>
            <span className="text-[10px] text-emerald-600 truncate">
              {nearestFacility.name.split(" ")[2] || "Melati"}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-slate-400">
            <AlertTriangle className={`w-3 h-3 ${nearestFacility.capacityPercent >= 85 ? "text-rose-500" : nearestFacility.capacityPercent >= 75 ? "text-amber-500" : "text-emerald-500"}`} />
            <span>Capacity Watch</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`text-xl font-black ${
                nearestFacility.capacityPercent >= 85
                  ? "text-rose-600 dark:text-rose-400 animate-pulse"
                  : nearestFacility.capacityPercent >= 75
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {nearestFacility.capacityPercent}%
            </span>
            <span className="text-xs text-slate-500">
              {nearestFacility.capacityPercent >= 85
                ? "🚨 Penuh"
                : nearestFacility.capacityPercent >= 75
                ? "⚠️ Padat"
                : "🟢 Aman"}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-teal-500 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-500" />
            <span>Volume Drop-off</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5 truncate">
            <span className="text-xl font-black text-teal-600 dark:text-teal-400">
              {summaryMetrics.totalWeeklyKg.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-slate-500 truncate">kg / pekan</span>
          </div>
        </div>
      </div>

      {/* 🚨 Real-time Capacity Watch Alert Banner & Alternative Facility Rerouting */}
      <CapacityWatchBanner
        isDarkMode={isDarkMode}
        nearestFacility={nearestFacility}
        alternatives={capacityAlternatives}
        activeRerouteFacility={activeRerouteFacility}
        onSelectAlternative={handleSelectAlternative}
        onResetReroute={handleResetReroute}
        isLiveTelemetry={isLiveTelemetry}
        setIsLiveTelemetry={setIsLiveTelemetry}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onSimulateCapacity={handleSimulateCapacity}
        lastTelemetryPing={lastTelemetryPing}
      />

      {/* Map Interactive Toolbar & Layer Switches */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
        {/* Layer Checkboxes */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mr-1">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>Lapisan:</span>
          </span>

          <button
            id="toggle-layer-hotspots"
            onClick={() => setShowHotspots(!showHotspots)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              showHotspots
                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 border border-transparent"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Hotspot Kepadatan</span>
          </button>

          <button
            id="toggle-layer-radius"
            onClick={() => setShowRadius(!showRadius)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              showRadius
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 border border-transparent"
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Radius Jarak</span>
          </button>

          <button
            id="toggle-layer-roads"
            onClick={() => setShowRoads(!showRoads)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              showRoads
                ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 border border-transparent"
            }`}
          >
            <span>Jalur & Sungai</span>
          </button>
        </div>

        {/* Filter Type Dropdown & Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-44">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Bank Sampah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-emerald-500"
          >
            <option value="ALL">Semua Fasilitas</option>
            <option value="OPEN_ONLY">Hanya Buka</option>
            <option value="CAPACITY_SAFE">Kapasitas Aman (&lt;75%)</option>
            <option value="BANK_SAMPAH">Bank Sampah Unit</option>
            <option value="TPS3R">TPS3R Terpadu</option>
            <option value="ORGANIC_CENTER">Pusat Biokonversi BSF</option>
            <option value="DROPBOX_B3">Drop-box B3</option>
          </select>
        </div>
      </div>

      {/* Notification Toast for simulated drop */}
      {simulatedDropAlert && (
        <div className="p-3 rounded-xl bg-emerald-600/90 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{simulatedDropAlert}</span>
          </div>
          <button onClick={() => setSimulatedDropAlert(null)} className="p-1 hover:bg-emerald-700 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Map Canvas Area + Facility Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* SVG Interactive Canvas (col-span-8) */}
        <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 shadow-inner group">
          {/* Zoom / Pan Controls Overlay */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-1 shadow-lg">
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Perbesar Peta (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Perkecil Peta (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="h-px bg-slate-700 my-0.5" />
            <button
              onClick={handleResetView}
              className="p-1.5 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition text-[10px] font-mono font-bold"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
          </div>

          {/* Map Compass & Coordinates Legend */}
          <div className="absolute bottom-3 left-3 z-20 pointer-events-none bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl px-2.5 py-1.5 text-[10px] text-slate-400 flex items-center gap-3">
            <div className="flex items-center gap-1 font-mono text-emerald-400">
              <Navigation className="w-3 h-3 text-emerald-400 -rotate-45" />
              <span>UTARA</span>
            </div>
            <span>•</span>
            <span>Cilandak Barat & Pondok Labu (JakSel)</span>
          </div>

          {/* SVG Map Document */}
          <svg
            ref={svgRef}
            viewBox="0 0 840 560"
            className="w-full h-[400px] sm:h-[480px] select-none cursor-grab active:cursor-grabbing bg-slate-950"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <defs>
              {/* Radial Gradients for Demand Hotspots */}
              {hotspots.map((hotspot) => {
                const color = densityColorScale(hotspot.intensityScore);
                return (
                  <radialGradient
                    key={`grad-${hotspot.id}`}
                    id={`hotspot-grad-${hotspot.id}`}
                    cx="50%"
                    cy="50%"
                    r="50%"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={0.7} />
                    <stop offset="40%" stopColor={color} stopOpacity={0.45} />
                    <stop offset="75%" stopColor={color} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </radialGradient>
                );
              })}

              {/* User Beacon Halo */}
              <radialGradient id="user-beacon-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="60%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </radialGradient>

              {/* Map Grid Pattern */}
              <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.6" />
              </pattern>
            </defs>

            {/* Transformed Layer Group for Zoom and Pan */}
            <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
              {/* Background Map Grid */}
              <rect x="0" y="0" width="840" height="560" fill="#090d16" />
              <rect x="0" y="0" width="840" height="560" fill="url(#map-grid)" />

              {/* Arterial Roads & Waterways */}
              {showRoads && (
                <g id="roads-group" opacity="0.75">
                  {/* Kali Krukut (River) */}
                  <path
                    d={MAP_ROADS[4]}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.65"
                  />
                  <text x="440" y="70" fill="#38bdf8" fontSize="9" fontWeight="bold" opacity="0.8">
                    Kali Krukut
                  </text>

                  {/* Main Roads */}
                  {MAP_ROADS.slice(0, 4).map((roadD, i) => (
                    <g key={`road-${i}`}>
                      <path
                        d={roadD}
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      <path
                        d={roadD}
                        fill="none"
                        stroke="#334155"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </g>
                  ))}

                  {/* Road Labels */}
                  <text x="490" y="325" fill="#94a3b8" fontSize="10" fontWeight="bold" opacity="0.85">
                    Jl. TB Simatupang (Arteri Selatan)
                  </text>
                  <text x="180" y="240" fill="#94a3b8" fontSize="9" fontWeight="bold" transform="rotate(-75 180,240)" opacity="0.85">
                    Jl. RS Fatmawati Raya
                  </text>
                  <text x="360" y="200" fill="#94a3b8" fontSize="9" opacity="0.8">
                    Jl. Cilandak Barat Raya
                  </text>
                </g>
              )}

              {/* District Labels */}
              <g id="district-labels">
                {MAP_DISTRICT_LABELS.map((lbl, i) => (
                  <text
                    key={i}
                    x={lbl.x}
                    y={lbl.y}
                    fill="#475569"
                    fontSize="12"
                    fontWeight="800"
                    letterSpacing="1.5"
                    opacity="0.45"
                    textAnchor="middle"
                  >
                    {lbl.text.toUpperCase()}
                  </text>
                ))}
              </g>

              {/* Distance Radius Circles from User Location */}
              {showRadius && (
                <g id="radius-rings-group">
                  {/* 500m ring */}
                  <circle
                    cx={USER_CURRENT_LOCATION.x}
                    cy={USER_CURRENT_LOCATION.y}
                    r="80"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    opacity="0.35"
                  />
                  <text
                    x={USER_CURRENT_LOCATION.x + 85}
                    y={USER_CURRENT_LOCATION.y - 6}
                    fill="#10b981"
                    fontSize="9"
                    fontWeight="bold"
                    opacity="0.75"
                  >
                    500 m
                  </text>

                  {/* 1 km ring */}
                  <circle
                    cx={USER_CURRENT_LOCATION.x}
                    cy={USER_CURRENT_LOCATION.y}
                    r="160"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    opacity="0.25"
                  />
                  <text
                    x={USER_CURRENT_LOCATION.x + 165}
                    y={USER_CURRENT_LOCATION.y - 6}
                    fill="#10b981"
                    fontSize="9"
                    fontWeight="bold"
                    opacity="0.75"
                  >
                    1.0 km
                  </text>

                  {/* 1.5 km ring */}
                  <circle
                    cx={USER_CURRENT_LOCATION.x}
                    cy={USER_CURRENT_LOCATION.y}
                    r="240"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    opacity="0.15"
                  />
                  <text
                    x={USER_CURRENT_LOCATION.x + 245}
                    y={USER_CURRENT_LOCATION.y - 6}
                    fill="#10b981"
                    fontSize="9"
                    fontWeight="bold"
                    opacity="0.65"
                  >
                    1.5 km
                  </text>
                </g>
              )}

              {/* Route line to selected facility */}
              {selectedFacility && (
                <g id="route-line-group">
                  <line
                    x1={USER_CURRENT_LOCATION.x}
                    y1={USER_CURRENT_LOCATION.y}
                    x2={selectedFacility.x}
                    y2={selectedFacility.y}
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    className="animate-pulse"
                    opacity="0.8"
                  />
                  {/* Midpoint Distance Badge */}
                  <g
                    transform={`translate(${
                      (USER_CURRENT_LOCATION.x + selectedFacility.x) / 2
                    }, ${(USER_CURRENT_LOCATION.y + selectedFacility.y) / 2})`}
                  >
                    <rect
                      x="-26"
                      y="-11"
                      width="52"
                      height="22"
                      rx="8"
                      fill="#064e3b"
                      stroke="#10b981"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {selectedFacility.distanceKm} km
                    </text>
                  </g>
                </g>
              )}

              {/* Demand Hotspots (Density Heatmap Layer) */}
              {showHotspots && (
                <g id="hotspots-layer">
                  {hotspots.map((hotspot) => {
                    const isHovered = hoveredHotspot?.id === hotspot.id;
                    const isRippling = animatingRippleId === hotspot.id;

                    return (
                      <g
                        key={hotspot.id}
                        className="cursor-pointer transition-transform"
                        onMouseEnter={(e) => {
                          setHoveredHotspot(hotspot);
                          setTooltipPos({ x: e.clientX, y: e.clientY });
                        }}
                        onMouseLeave={() => setHoveredHotspot(null)}
                      >
                        {/* Heat Gradient Density Bubble */}
                        <circle
                          cx={hotspot.x}
                          cy={hotspot.y}
                          r={hotspot.radius * (isHovered ? 1.2 : 1)}
                          fill={`url(#hotspot-grad-${hotspot.id})`}
                          className="transition-all duration-300"
                        />

                        {/* Density Core Dot */}
                        <circle
                          cx={hotspot.x}
                          cy={hotspot.y}
                          r={isHovered ? 6 : 4}
                          fill={densityColorScale(hotspot.intensityScore)}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          opacity="0.9"
                        />

                        {/* Animated ripple on simulated drop */}
                        {isRippling && (
                          <circle
                            cx={hotspot.x}
                            cy={hotspot.y}
                            r="65"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2.5"
                            className="animate-ping"
                          />
                        )}

                        {/* Hotspot Micro Label */}
                        <text
                          x={hotspot.x}
                          y={hotspot.y + hotspot.radius + 12}
                          fill="#cbd5e1"
                          fontSize="9"
                          fontWeight="600"
                          textAnchor="middle"
                          opacity={isHovered ? 1 : 0.75}
                          className="pointer-events-none"
                        >
                          {hotspot.totalKgWeekly} kg/pekan
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* User Current Household Beacon */}
              <g
                id="user-location-marker"
                transform={`translate(${USER_CURRENT_LOCATION.x}, ${USER_CURRENT_LOCATION.y})`}
                className="cursor-pointer"
              >
                {/* Expanding Halo */}
                <circle cx="0" cy="0" r="32" fill="url(#user-beacon-grad)" className="animate-pulse" />
                <circle cx="0" cy="0" r="14" fill="#047857" stroke="#34d399" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="5" fill="#ffffff" />

                {/* User Flag Tag */}
                <g transform="translate(16, -14)">
                  <rect
                    x="0"
                    y="0"
                    width="100"
                    height="24"
                    rx="8"
                    fill="#064e3b"
                    stroke="#10b981"
                    strokeWidth="1.2"
                    className="shadow-md"
                  />
                  <text x="8" y="16" fill="#ecfdf5" fontSize="10" fontWeight="bold">
                    📍 Lokasi Anda (RW 04)
                  </text>
                </g>
              </g>

              {/* Capacity Watch Reroute Diversion Line */}
              {activeRerouteFacility && (
                <g id="capacity-watch-reroute-path">
                  {/* Underglow aura */}
                  <path
                    d={`M ${USER_CURRENT_LOCATION.x} ${USER_CURRENT_LOCATION.y} Q ${
                      (USER_CURRENT_LOCATION.x + activeRerouteFacility.x) / 2 + 30
                    } ${
                      (USER_CURRENT_LOCATION.y + activeRerouteFacility.y) / 2 - 25
                    } ${activeRerouteFacility.x} ${activeRerouteFacility.y}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="10"
                    strokeOpacity="0.3"
                    strokeLinecap="round"
                  />

                  {/* Animated dashed line */}
                  <path
                    d={`M ${USER_CURRENT_LOCATION.x} ${USER_CURRENT_LOCATION.y} Q ${
                      (USER_CURRENT_LOCATION.x + activeRerouteFacility.x) / 2 + 30
                    } ${
                      (USER_CURRENT_LOCATION.y + activeRerouteFacility.y) / 2 - 25
                    } ${activeRerouteFacility.x} ${activeRerouteFacility.y}`}
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="3.5"
                    strokeDasharray="8 6"
                    className="animate-reroute-flow"
                    strokeLinecap="round"
                  />

                  {/* Midpoint Info Pill */}
                  {(() => {
                    const midX = (USER_CURRENT_LOCATION.x + activeRerouteFacility.x) / 2 + 15;
                    const midY = (USER_CURRENT_LOCATION.y + activeRerouteFacility.y) / 2 - 12;
                    return (
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x="-75"
                          y="-13"
                          width="150"
                          height="26"
                          rx="8"
                          fill="#064e3b"
                          stroke="#34d399"
                          strokeWidth="1.5"
                          className="shadow-xl"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill="#ecfdf5"
                          fontSize="9.5"
                          fontWeight="bold"
                        >
                          🧭 Rute: {activeRerouteFacility.distanceKm} km (~{Math.max(2, Math.round(activeRerouteFacility.distanceKm * 4))} mnt)
                        </text>
                      </g>
                    );
                  })()}
                </g>
              )}

              {/* Bank Sampah Facility Pins */}
              <g id="facilities-layer">
                {filteredFacilities.map((fac) => {
                  const isSelected = selectedFacility?.id === fac.id;
                  const isHovered = hoveredFacility?.id === fac.id;
                  const isNearestWatch = fac.id === nearestFacility.id && nearestFacility.capacityPercent >= 75;
                  const isRerouteTarget = activeRerouteFacility?.id === fac.id;

                  // Color based on status
                  const pinColor =
                    isRerouteTarget
                      ? "#34d399"
                      : fac.status === "OPEN"
                      ? "#10b981"
                      : fac.status === "FULL_SOON" || fac.capacityPercent >= 85
                      ? "#ef4444"
                      : fac.capacityPercent >= 75
                      ? "#f59e0b"
                      : "#ef4444";

                  return (
                    <g
                      key={fac.id}
                      transform={`translate(${fac.x}, ${fac.y})`}
                      onClick={() => setSelectedFacility(fac)}
                      onMouseEnter={(e) => {
                        setHoveredFacility(fac);
                        setTooltipPos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => setHoveredFacility(null)}
                      className="cursor-pointer group"
                    >
                      {/* Selection Ring */}
                      {isSelected && (
                        <circle
                          cx="0"
                          cy="0"
                          r="22"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                          className="animate-spin"
                          style={{ animationDuration: "8s" }}
                        />
                      )}

                      {/* Capacity Watch Warning Flag on Overloaded Nearest Facility */}
                      {isNearestWatch && (
                        <g transform="translate(0, -28)">
                          <rect
                            x="-46"
                            y="0"
                            width="92"
                            height="18"
                            rx="6"
                            fill={nearestFacility.capacityPercent >= 85 ? "#991b1b" : "#b45309"}
                            stroke={nearestFacility.capacityPercent >= 85 ? "#f87171" : "#fbbf24"}
                            strokeWidth="1"
                            className="animate-pulse shadow-md"
                          />
                          <text x="0" y="12" textAnchor="middle" fill="#fef2f2" fontSize="8.5" fontWeight="bold">
                            ⚠️ {nearestFacility.capacityPercent}% Padat
                          </text>
                        </g>
                      )}

                      {/* Capacity Watch Star Recommendation Badge */}
                      {isRerouteTarget && (
                        <g transform="translate(0, -28)">
                          <rect
                            x="-58"
                            y="0"
                            width="116"
                            height="18"
                            rx="6"
                            fill="#065f46"
                            stroke="#34d399"
                            strokeWidth="1.2"
                            className="shadow-md"
                          />
                          <text x="0" y="12" textAnchor="middle" fill="#ecfdf5" fontSize="8.5" fontWeight="bold">
                            ⭐ Alternatif Disarankan
                          </text>
                        </g>
                      )}

                      {/* Pin Glow on hover or target */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isRerouteTarget ? 18 : isSelected ? 16 : isHovered ? 14 : 11}
                        fill={pinColor}
                        fillOpacity="0.25"
                        className={isRerouteTarget ? "animate-pulse" : ""}
                      />

                      {/* Main Pin Circle */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 11 : 9}
                        fill={pinColor}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all duration-200 group-hover:scale-110"
                      />

                      {/* Inner Icon Dot */}
                      <circle cx="0" cy="0" r="3" fill="#ffffff" />

                      {/* Mini Badge for Capacity */}
                      <g transform="translate(12, -10)">
                        <rect
                          x="0"
                          y="0"
                          width="58"
                          height="18"
                          rx="6"
                          fill="#0f172a"
                          stroke={pinColor}
                          strokeWidth="0.8"
                          opacity="0.9"
                        />
                        <text x="6" y="12" fill="#f8fafc" fontSize="8.5" fontWeight="bold">
                          {fac.capacityPercent}% Isi
                        </text>
                      </g>

                      {/* Facility Name Label */}
                      <text
                        x="0"
                        y="22"
                        textAnchor="middle"
                        fill={isSelected ? "#34d399" : isRerouteTarget ? "#6ee7b7" : "#e2e8f0"}
                        fontSize="9.5"
                        fontWeight="700"
                        className="pointer-events-none drop-shadow"
                      >
                        {fac.name.length > 18 ? fac.name.substring(0, 18) + "…" : fac.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>

          {/* Floating Hotspot Tooltip */}
          {hoveredHotspot && (
            <div
              className="absolute pointer-events-none z-30 p-3 rounded-xl bg-slate-900/95 border border-amber-500/50 text-white shadow-2xl backdrop-blur-md text-xs space-y-1.5 max-w-xs"
              style={{
                left: "20px",
                top: "20px",
              }}
            >
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>Hotspot Kepadatan Drop-off</span>
              </div>
              <div className="font-semibold text-slate-100">{hoveredHotspot.name}</div>
              <div className="text-[11px] text-slate-300">
                Wilayah: <span className="text-white font-medium">{hoveredHotspot.neighborhood}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[10px]">
                <div>
                  <span className="text-slate-400 block">Total Drop-off:</span>
                  <span className="font-bold text-emerald-400 text-xs">
                    {hoveredHotspot.totalKgWeekly} kg / pekan
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Transaksi:</span>
                  <span className="font-bold text-slate-200 text-xs">
                    {hoveredHotspot.dropOffCount} kali
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-slate-300 pt-0.5">
                Sampah Dominan:{" "}
                <span className="text-amber-300 font-medium">
                  {hoveredHotspot.dominantWasteType}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Facility Inspector & Details Card (col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedFacility ? (
            <div
              id="selected-facility-inspector"
              className={`p-5 rounded-2xl border transition-all space-y-4 ${
                isDarkMode
                  ? "bg-slate-900/80 border-slate-700/80"
                  : "bg-slate-50/90 border-slate-200/90"
              }`}
            >
              {/* Header with Type & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {selectedFacility.typeLabel}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1.5 leading-snug">
                    {selectedFacility.name}
                  </h4>
                </div>

                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex-shrink-0 ${
                    selectedFacility.status === "OPEN" && selectedFacility.capacityPercent < 75
                      ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                      : selectedFacility.capacityPercent >= 85
                      ? "bg-rose-500/15 text-rose-600 border-rose-500/30 animate-pulse"
                      : selectedFacility.capacityPercent >= 75
                      ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                      : selectedFacility.status === "OPEN"
                      ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                      : "bg-rose-500/15 text-rose-600 border-rose-500/30"
                  }`}
                >
                  {selectedFacility.capacityPercent >= 85
                    ? `Kapasitas Penuh (${selectedFacility.capacityPercent}%)`
                    : selectedFacility.capacityPercent >= 75
                    ? `Mulai Padat (${selectedFacility.capacityPercent}%)`
                    : selectedFacility.status === "OPEN"
                    ? `Buka (${selectedFacility.capacityPercent}%)`
                    : "Tutup"}
                </span>
              </div>

              {/* Capacity Watch Dedicated Context Banner */}
              {activeRerouteFacility?.id === selectedFacility.id ? (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Fasilitas Alternatif Terpilih (Capacity Watch)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Pengalihan rute aktif dari fasilitas utama ({nearestFacility.name}) yang sedang padat. Tersedia sisa kapasitas{" "}
                    <span className="font-bold text-emerald-600 dark:text-emerald-300">
                      {100 - selectedFacility.capacityPercent}%
                    </span>{" "}
                    untuk menyetor sampah Anda tanpa antrean.
                  </p>
                </div>
              ) : selectedFacility.id === nearestFacility.id && selectedFacility.capacityPercent >= 75 ? (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Peringatan Beban Muatan ({selectedFacility.capacityPercent}%)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Lokasi ini mendekati kapasitas maksimal. Kami menyarankan pengalihan ke titik alternatif yang memiliki ruang tampung lebih luas.
                  </p>
                  {capacityAlternatives[0] && (
                    <button
                      onClick={() => handleSelectAlternative(capacityAlternatives[0].facility)}
                      className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <span>Alihkan ke {capacityAlternatives[0].facility.name.split(" ")[2] || "RPTRA"} ({capacityAlternatives[0].distanceKm} km)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : null}

              {/* Distance and Address */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{selectedFacility.distanceKm} km dari rumah Anda</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    (~{Math.round(selectedFacility.distanceKm * 4)} mnt jalan kaki)
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  {selectedFacility.address}
                </p>
              </div>

              {/* Operating Hours & Contact */}
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>
                    {selectedFacility.operatingDays} ({selectedFacility.operatingHours})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{selectedFacility.contactPhone}</span>
                </div>
              </div>

              {/* Capacity Meter Bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Kapasitas Penampungan:</span>
                  <span
                    className={`font-black ${
                      selectedFacility.capacityPercent > 80
                        ? "text-rose-500"
                        : selectedFacility.capacityPercent > 60
                        ? "text-amber-500"
                        : "text-emerald-500"
                    }`}
                  >
                    {selectedFacility.capacityPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedFacility.capacityPercent > 80
                        ? "bg-rose-500"
                        : selectedFacility.capacityPercent > 60
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${selectedFacility.capacityPercent}%` }}
                  />
                </div>
              </div>

              {/* Accepted Waste Chips */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Jenis Sampah Diterima:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFacility.accepts.map((mat, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700/60"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Historical Track Record */}
              <div className="p-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Total Sampah Terolah</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedFacility.historicalTotalKg.toLocaleString("id-ID")} kg
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Total Transaksi</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedFacility.historicalDropOffCount} drop-off
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Verifikasi DLH</div>
                  <div className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resmi</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  id="btn-navigate-facility"
                  onClick={() => {
                    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedFacility.name + " " + selectedFacility.address
                    )}`;
                    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Rute Navigasi</span>
                </button>

                <button
                  id="btn-primary-point"
                  onClick={() => {
                    setSimulatedDropAlert(
                      `${selectedFacility.name} berhasil ditetapkan sebagai titik setor utama Anda!`
                    );
                    setTimeout(() => setSimulatedDropAlert(null), 4000);
                  }}
                  className="py-2 px-3 rounded-xl border border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Pilih Lokasi</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-400">
              Pilih salah satu pin Bank Sampah pada peta untuk melihat detail kapasitas dan jadwal operasional.
            </div>
          )}

          {/* Quick List of Nearby Facilities */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Daftar Fasilitas di Sekitar Anda ({filteredFacilities.length})</span>
              <span className="text-[10px] text-slate-400">Urut jarak terdekat</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {filteredFacilities.map((f) => {
                const isSelected = selectedFacility?.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFacility(f)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between text-xs ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold truncate">{f.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        <span>{f.distanceKm} km • {f.neighborhood}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          f.status === "OPEN"
                            ? "bg-emerald-500/15 text-emerald-600"
                            : f.status === "FULL_SOON"
                            ? "bg-amber-500/15 text-amber-600"
                            : "bg-rose-500/15 text-rose-600"
                        }`}
                      >
                        {f.status === "OPEN" ? "Buka" : f.status === "FULL_SOON" ? "Penuh" : "Tutup"}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">{f.capacityPercent}% Muatan</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Map Legend Footer */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold text-slate-500 dark:text-slate-400">Keterangan Peta:</span>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Bank Sampah Buka</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-300">Kapasitas Penuh (&gt;75%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-300">Tutup Sementara</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-emerald-300" />
            <span className="text-slate-600 dark:text-slate-300">Lokasi Rumah Warga</span>
          </div>
        </div>

        {/* Hotspot Intensity Gradient Bar */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Densitas Drop-off:</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-yellow-600 font-bold">Rendah</span>
            <div className="w-20 h-2.5 rounded-full bg-gradient-to-r from-yellow-300 via-orange-500 to-red-600 shadow-inner" />
            <span className="text-[10px] text-red-600 font-bold">Tinggi</span>
          </div>
        </div>
      </div>
    </div>
  );
};
