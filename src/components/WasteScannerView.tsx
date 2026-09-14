/**
 * AI Waste Scanner & Smart Behavioral Guidance Engine
 * SiklusKita - Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState, useRef } from "react";
import {
  Camera,
  UploadCloud,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Award,
  Leaf,
  ShieldCheck,
  RotateCw,
  Info,
  MapPin,
  HelpCircle,
  Flame,
} from "lucide-react";
import confetti from "canvas-confetti";
import { WasteAnalysisResult, WasteLogEntry } from "../types";
import { SAMPLE_SCANNER_PRESETS } from "../data/mockData";
import { encryptPayload, generateVerificationSeal } from "../utils/crypto";
import { QuickSortHelperWidget } from "./QuickSortHelperWidget";
import { SmartWasteClassifierPanel } from "./SmartWasteClassifierPanel";

interface WasteScannerViewProps {
  isDarkMode: boolean;
  onAddWasteLog: (log: WasteLogEntry) => void;
  userPoints: number;
  userStreak: number;
}

export const WasteScannerView: React.FC<WasteScannerViewProps> = ({
  isDarkMode,
  onAddWasteLog,
  userPoints,
  userStreak,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>("sample-pet");
  const [customImage, setCustomImage] = useState<string | null>(SAMPLE_SCANNER_PRESETS[0].sampleImage);
  const [manualQuery, setManualQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WasteAnalysisResult>({
    itemName: "Botol Plastik PET (Poli Etilena Tereftalat)",
    category: "Plastik (PET/HDPE)",
    recyclabilityPercent: 98,
    sortingInstructions: [
      "Bilas sisa minuman manis dengan sedikit air bersih",
      "Lepaskan segel label plastik & tutup botol terpisah",
      "Remas / injak botol hingga pipih untuk menghemat volume simpan",
      "Kumpulkan minimal 10 botol untuk disetor ke Bank Sampah SiklusKita",
    ],
    destinationFacility: "Bank Sampah Melati (RPTRA Cilandak Barat)",
    pointsEarned: 30,
    carbonOffsetKg: 0.62,
    tips: "Botol plastik PET bening memiliki nilai daur ulang tertinggi untuk diolah kembali menjadi benang rPET tekstil berkualitas.",
  });
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([0, 1]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result as string);
        setSelectedPreset(null);
        analyzeWaste(reader.result as string, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = SAMPLE_SCANNER_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPreset(preset.id);
      setCustomImage(preset.sampleImage);
      setManualQuery(preset.textQuery);
      analyzeWaste(null, preset.textQuery);
    }
  };

  const analyzeWaste = async (imageDataUrl: string | null, text: string) => {
    setIsAnalyzing(true);
    setDepositSuccess(false);

    try {
      const res = await fetch("/api/ai/identify-waste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imageDataUrl || undefined,
          textQuery: text || manualQuery,
          defaultPreset: selectedPreset || undefined,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setAnalysisResult(data.data);
        setCompletedSteps([0]); // Reset checklist to step 1 completed
      }
    } catch (err) {
      console.error("AI identification error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleStep = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter((i) => i !== idx));
    } else {
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  const handleApplyHelperTips = (tips: string[]) => {
    if (tips && tips.length > 0) {
      setAnalysisResult((prev) => ({
        ...prev,
        sortingInstructions: Array.from(new Set([...prev.sortingInstructions, ...tips])),
      }));
    }
  };

  const handleApplySmartSortingSteps = (steps: string[]) => {
    if (steps && steps.length > 0) {
      setAnalysisResult((prev) => ({
        ...prev,
        sortingInstructions: steps,
      }));
    }
  };

  const handleCommitDeposit = async () => {
    // Encrypt transaction before saving to circular audit ledger
    const plaintextRecord = JSON.stringify({
      item: analysisResult.itemName,
      category: analysisResult.category,
      points: analysisResult.pointsEarned,
      carbonKg: analysisResult.carbonOffsetKg,
      facility: analysisResult.destinationFacility,
      timestamp: new Date().toISOString(),
    });

    const encrypted = await encryptPayload(plaintextRecord);
    const newLog: WasteLogEntry = {
      id: `LOG-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      itemName: analysisResult.itemName,
      category: analysisResult.category,
      weightKg: analysisResult.category.includes("Organik") ? 1.5 : 0.6,
      points: analysisResult.pointsEarned,
      co2eKg: analysisResult.carbonOffsetKg,
      facility: analysisResult.destinationFacility,
      householdId: "HH-CLD-0402",
      synced: true,
      encryptedHash: encrypted.sha256Digest,
    };

    onAddWasteLog(newLog);
    setDepositSuccess(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#06b6d4", "#f59e0b", "#8b5cf6"],
      });
    } catch {
      // safe fallback if confetti fails
    }
  };

  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  return (
    <div className="space-y-6">
      {/* Top Behavioral Header with Streak & Points */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkMode
          ? "bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/30 border-emerald-900/50"
          : "bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-white border-emerald-100 shadow-sm"
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <Camera className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                AI Waste Scanner & Smart Behavioral Guidance
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Hilangkan kebingungan memilah sampah di rumah tangga. Scan atau unggah foto untuk identifikasi otomatis jenis sampah, petunjuk penanganan langkah-demi-langkah, dan akumulasi poin sirkular terenkripsi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Saldo Poin Kamu</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{userPoints} Poin</div>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Streak Pilah</div>
                <div className="text-sm font-bold text-amber-600 dark:text-amber-400">{userStreak} Hari</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Photo / Camera Input & Presets */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border ${cardBase} space-y-4`}>
          <div className="flex items-center justify-between border-b pb-3 dark:border-slate-700">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Input Objek Sampah</span>
            </h3>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              Multimodal Vision
            </span>
          </div>

          {/* Image Display Area */}
          <div className="relative aspect-video sm:aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/60 flex items-center justify-center group shadow-inner">
            {customImage ? (
              <img
                src={customImage}
                alt="Waste Item"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4">
                <Camera className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Arahkan kamera atau unggah foto</p>
              </div>
            )}

            {/* Target Reticle Overlay */}
            <div className="absolute inset-4 border border-white/30 rounded-xl pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
              </div>
              <div className="flex justify-between">
                <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
              </div>
            </div>

            {/* Scan pulse indicator if analyzing */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                <RotateCw className="w-8 h-8 animate-spin text-emerald-400 mb-2" />
                <span className="text-xs font-semibold tracking-wide">
                  Gemini 3.8 Flash Menganalisis Sampah...
                </span>
                <span className="text-[10px] text-emerald-300 mt-0.5">Memeriksa kategori & panduan daur ulang</span>
              </div>
            )}
          </div>

          {/* Action buttons: Upload File & Camera */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              id="upload-image-btn"
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Unggah Gambar</span>
            </button>

            <button
              id="camera-scan-btn"
              onClick={() => {
                // Prompt user camera or re-analyze current
                analyzeWaste(customImage, manualQuery || "Botol Sampah Plastik PET");
              }}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition shadow-sm shadow-emerald-600/20 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Pindai Sekarang</span>
            </button>
          </div>

          {/* Quick Presets for Instant One-Click Testing */}
          <div className="space-y-2 pt-2 border-t dark:border-slate-700">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Preset Sampah Domestik Jakarta:</span>
              <span className="text-[10px]">Klik untuk tes instan</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_SCANNER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`p-2 rounded-xl text-left border text-xs transition-all ${
                    selectedPreset === preset.id
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium shadow-xs"
                      : "border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="truncate font-semibold text-[11px]">{preset.label}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">{preset.category}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: AI Classification Result & Behavioral Checklist */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Classification Card */}
          <div className={`p-5 rounded-2xl border ${cardBase} space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 dark:border-slate-700">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Hasil Identifikasi AI
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {analysisResult.itemName}
                </h3>
              </div>
              <span className={`self-start sm:self-auto px-2.5 py-1 rounded-full text-xs font-semibold ${
                analysisResult.category.includes("Organik")
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : analysisResult.category.includes("Kertas")
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  : analysisResult.category.includes("B3")
                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                  : "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300"
              }`}>
                {analysisResult.category}
              </span>
            </div>

            {/* Impact Metric Chips */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Tingkat Daur Ulang</span>
                <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {analysisResult.recyclabilityPercent}%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Reward Poin</span>
                <span className="text-sm sm:text-base font-bold text-amber-500">
                  +{analysisResult.pointsEarned} Poin
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Pencegahan Karbon</span>
                <span className="text-sm sm:text-base font-bold text-teal-600 dark:text-teal-400">
                  {analysisResult.carbonOffsetKg} kg CO2e
                </span>
              </div>
            </div>

            {/* Step-by-Step Actionable Sorting Guide */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Panduan Pemilahan di Rumah (Checklist Aksi):
                </h4>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {completedSteps.length} dari {analysisResult.sortingInstructions.length} langkah
                </span>
              </div>

              <div className="space-y-2">
                {analysisResult.sortingInstructions.map((instruction, idx) => {
                  const isChecked = completedSteps.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? "bg-emerald-500/10 border-emerald-500/40 text-slate-800 dark:text-slate-100"
                          : "bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isChecked
                          ? "bg-emerald-500 text-white"
                          : "border border-slate-300 dark:border-slate-600 text-slate-400"
                      }`}>
                        {isChecked ? "✓" : idx + 1}
                      </div>
                      <span className={`text-xs ${isChecked ? "font-medium line-through opacity-80" : ""}`}>
                        {instruction}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Destination Facility */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Tujuan Penyaluran / Fasilitas:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {analysisResult.destinationFacility}
                </span>
              </div>
            </div>

            {/* Circular Tips */}
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p>{analysisResult.tips}</p>
            </div>

            {/* Commit Deposit Action */}
            <div className="pt-2">
              {depositSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>
                      Setoran berhasil diverifikasi & tercatat di Buku Kas Sirkular! (+{analysisResult.pointsEarned} Poin)
                    </span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
              ) : (
                <button
                  id="commit-deposit-btn"
                  onClick={handleCommitDeposit}
                  className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Klaim +{analysisResult.pointsEarned} Poin & Catat ke Buku Sirkular E2EE</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🧠 Smart Waste Classifier Panel (Gemini Vision Model with Real-Time Confidence Scores & Specific Sorting Instructions) */}
      <SmartWasteClassifierPanel
        isDarkMode={isDarkMode}
        activeImage={customImage}
        activeQuery={manualQuery || analysisResult.itemName}
        presetId={selectedPreset}
        onApplySortingSteps={handleApplySmartSortingSteps}
      />

      {/* 💡 Floating Quick Sort Helper Widget (Context-sensitive tips by category) */}
      <QuickSortHelperWidget
        currentCategory={analysisResult.category}
        currentItemName={analysisResult.itemName}
        isDarkMode={isDarkMode}
        onApplyTipsToInstructions={handleApplyHelperTips}
      />
    </div>
  );
};
