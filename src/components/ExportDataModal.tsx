/**
 * Export Data Modal Component
 * Generates and downloads customizable CSV files of the user's historical waste disposal logs.
 * Fahira Shanin Nadifa & Tim | Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState, useMemo } from "react";
import {
  X,
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  Table,
  Layers,
  Settings2,
  ShieldCheck,
  FileText,
  Sparkles,
} from "lucide-react";
import { WasteLogEntry } from "../types";
import { downloadWasteLogsCSV, generateWasteLogsCSV } from "../utils/csvExporter";

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredLogs: WasteLogEntry[];
  allLogs: WasteLogEntry[];
  isDarkMode: boolean;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
  isOpen,
  onClose,
  filteredLogs,
  allLogs,
  isDarkMode,
}) => {
  const [dataScope, setDataScope] = useState<"FILTERED" | "ALL">("FILTERED");
  const [delimiter, setDelimiter] = useState<"," | ";">(",");
  const [includeSummaryRow, setIncludeSummaryRow] = useState<boolean>(true);
  const [includeBOM, setIncludeBOM] = useState<boolean>(true);
  const [customFilename, setCustomFilename] = useState<string>(
    `SiklusKita_Log_Sampah_${new Date().toISOString().split("T")[0]}.csv`
  );
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<boolean>(false);

  const selectedLogs = useMemo(() => {
    return dataScope === "FILTERED" ? filteredLogs : allLogs;
  }, [dataScope, filteredLogs, allLogs]);

  const stats = useMemo(() => {
    let totalKg = 0;
    let totalPts = 0;
    let totalCo2e = 0;
    selectedLogs.forEach((l) => {
      totalKg += Number(l.weightKg) || 0;
      totalPts += Number(l.points) || 0;
      totalCo2e += Number(l.co2eKg) || 0;
    });
    return {
      count: selectedLogs.length,
      totalKg: totalKg.toFixed(2),
      totalPts,
      totalCo2e: totalCo2e.toFixed(2),
    };
  }, [selectedLogs]);

  // Preview snippet of the first 3 rows
  const previewSnippet = useMemo(() => {
    const { csvString } = generateWasteLogsCSV(selectedLogs.slice(0, 3), {
      delimiter,
      includeBOM: false,
      includeSummaryRow: false,
    });
    return csvString.split("\r\n").slice(0, 4);
  }, [selectedLogs, delimiter]);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    try {
      downloadWasteLogsCSV(selectedLogs, {
        filename: customFilename.endsWith(".csv") ? customFilename : `${customFilename}.csv`,
        delimiter,
        includeBOM,
        includeSummaryRow,
      });

      setDownloadSuccessToast(true);
      setTimeout(() => {
        setDownloadSuccessToast(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Gagal mengekspor CSV:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const cardBase = isDarkMode
    ? "bg-slate-900 border-slate-700 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className={`w-full max-w-2xl rounded-2xl border ${cardBase} shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                <span>Ekspor Data Log Sampah (CSV)</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                  RFC 4180
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unduh berkas tabular terstruktur untuk pencatatan pribadi di Microsoft Excel atau Google Sheets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Summary Stats Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Jumlah Baris Log</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-100 font-mono">
                {stats.count}
              </span>
              <span className="text-[10px] text-slate-400 block">Transaksi</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Total Berat</span>
              <span className="text-base font-bold text-teal-600 dark:text-teal-400 font-mono">
                {stats.totalKg}
              </span>
              <span className="text-[10px] text-slate-400 block">Kilogram</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Poin Sirkular</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                +{stats.totalPts}
              </span>
              <span className="text-[10px] text-slate-400 block">Reward Pts</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Emisi Terhindar</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-100 font-mono">
                {stats.totalCo2e}
              </span>
              <span className="text-[10px] text-slate-400 block">kg CO2e</span>
            </div>
          </div>

          {/* Scope Selector */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-teal-600" />
              <span>Cakupan Data yang Diekspor:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDataScope("FILTERED")}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  dataScope === "FILTERED"
                    ? "border-teal-500 bg-teal-500/10 text-teal-900 dark:text-teal-100"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Data Filter Aktif</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-200 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-semibold">
                    {filteredLogs.length} Item
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Mengekspor data sesuai kategori yang sedang dipilih di filter bar.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDataScope("ALL")}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  dataScope === "ALL"
                    ? "border-teal-500 bg-teal-500/10 text-teal-900 dark:text-teal-100"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Seluruh Riwayat (Total)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                    {allLogs.length} Item
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Mengekspor keseluruhan riwayat log sampah dari awal pencatatan.
                </p>
              </button>
            </div>
          </div>

          {/* Configuration Settings */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/40 space-y-3.5">
            <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Format &amp; Kompatibilitas Lembar Kerja:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Delimiter */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 dark:text-slate-400">Pemisah Kolom (Delimiter):</label>
                <select
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                >
                  <option value=",">Koma (,) - Standar Internasional &amp; Google Sheets</option>
                  <option value=";">Titik Koma (;) - Rekomendasi Excel Regional Indonesia</option>
                </select>
              </div>

              {/* Filename */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 dark:text-slate-400">Nama Berkas CSV:</label>
                <input
                  type="text"
                  value={customFilename}
                  onChange={(e) => setCustomFilename(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>
            </div>

            {/* Checkbox toggles */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeSummaryRow}
                  onChange={(e) => setIncludeSummaryRow(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>Sertakan baris Total Rekapitulasi di akhir berkas</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeBOM}
                  onChange={(e) => setIncludeBOM(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>UTF-8 BOM (Mencegah karakter rusak di MS Excel)</span>
              </label>
            </div>
          </div>

          {/* Quick Raw CSV Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold flex items-center gap-1">
                <Table className="w-3.5 h-3.5 text-teal-600" />
                Pratinjau Format Baris CSV:
              </span>
              <span className="font-mono text-[10px]">Menampilkan {Math.min(3, selectedLogs.length)} baris sampel</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[10px] overflow-x-auto border border-slate-800 space-y-1 max-h-32">
              {previewSnippet.map((line, idx) => (
                <div key={idx} className={idx === 0 ? "text-teal-400 font-bold" : "text-slate-300"}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Security & Verification Guarantee */}
          <div className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/20 flex items-center gap-2.5 text-[11px] text-slate-600 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Setiap baris data mencakup <strong>Segel Kriptografis SHA-256</strong> untuk validasi integritas audit sirkular DKI Jakarta.
            </span>
          </div>

          {/* Success Toast */}
          {downloadSuccessToast && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Berkas CSV Berhasil Diunduh! Silakan periksa folder Download Anda.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            Batal
          </button>

          <button
            id="btn-confirm-download-csv"
            type="button"
            onClick={handleExport}
            disabled={isExporting || selectedLogs.length === 0}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? "Menyiapkan Berkas..." : `Unduh Berkas CSV (${stats.count} Baris)`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
