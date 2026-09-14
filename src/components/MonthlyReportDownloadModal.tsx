import React, { useState } from "react";
import {
  FileDown,
  FileText,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Sparkles,
  X,
  Printer,
  ExternalLink,
  ChevronRight,
  Download,
  Award,
} from "lucide-react";
import { WasteLogEntry } from "../types";
import { generateMonthlyWasteReportPDF, PDFReportOptions } from "../utils/pdfReportGenerator";

interface MonthlyReportDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  wasteLogs: WasteLogEntry[];
  isDarkMode: boolean;
}

export const MonthlyReportDownloadModal: React.FC<MonthlyReportDownloadModalProps> = ({
  isOpen,
  onClose,
  wasteLogs,
  isDarkMode,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("September 2026");
  const [includeSignatures, setIncludeSignatures] = useState<boolean>(true);
  const [includeAiInsights, setIncludeAiInsights] = useState<boolean>(true);
  const [includeHashes, setIncludeHashes] = useState<boolean>(true);
  const [customNotes, setCustomNotes] = useState<string>(
    "Pencatatan resmi program pemilahan mandiri RT 02 / RW 04 Cilandak Barat menuju target Jakarta Bebas Sampah 2030."
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Compute summary values for preview
  const totalWeight = wasteLogs.reduce((acc, l) => acc + (l.weightKg || 0), 0);
  const totalCo2e = wasteLogs.reduce((acc, l) => acc + (l.co2eKg || 0), 0);
  const totalPoints = wasteLogs.reduce((acc, l) => acc + (l.points || 0), 0);
  const treeEquiv = (totalCo2e / 1.75).toFixed(1);

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      // Small simulated delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 350));

      const options: PDFReportOptions = {
        monthName: "September",
        year: 2026,
        householdName: "Ibu Sari (Komunitas RT 02 / RW 04)",
        householdId: "HH-CLD-0402",
        neighborhood: "Cilandak Barat, Jakarta Selatan, DKI Jakarta",
        includeSignatures,
        includeAiInsights,
        includeHashes,
        notes: customNotes,
      };

      const doc = generateMonthlyWasteReportPDF(wasteLogs, options);
      const filename = `Laporan_Sirkular_${selectedMonth.replace(/\s+/g, "_")}_HH-CLD-0402.pdf`;
      doc.save(filename);

      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    } catch (err) {
      console.error("Gagal men-generate PDF:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenPreview = () => {
    try {
      const options: PDFReportOptions = {
        monthName: "September",
        year: 2026,
        householdName: "Ibu Sari (Komunitas RT 02 / RW 04)",
        householdId: "HH-CLD-0402",
        neighborhood: "Cilandak Barat, Jakarta Selatan, DKI Jakarta",
        includeSignatures,
        includeAiInsights,
        includeHashes,
        notes: customNotes,
      };

      const doc = generateMonthlyWasteReportPDF(wasteLogs, options);
      const blobUrl = doc.output("bloburl");
      window.open(blobUrl as unknown as string, "_blank");
    } catch (err) {
      console.error("Gagal membuka pratinjau PDF:", err);
    }
  };

  return (
    <div
      id="monthly-pdf-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="monthly-pdf-modal-content"
        className={`w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDarkMode
            ? "bg-slate-900 border-slate-700 text-slate-100"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isDarkMode
              ? "bg-gradient-to-r from-teal-950/50 to-slate-900 border-slate-800"
              : "bg-gradient-to-r from-teal-50 to-emerald-50/70 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/30">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">Unduh Laporan Rekapitulasi Sampah Bulanan</h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Format PDF Resmi
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dokumen terstruktur rekapitulasi setoran & reduksi emisi berstandar DLH DKI Jakarta
              </p>
            </div>
          </div>

          <button
            id="close-pdf-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Success Banner if just downloaded */}
          {downloadSuccess && (
            <div
              id="pdf-download-success-banner"
              className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-between animate-in fade-in"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-xs font-medium">
                  <span className="font-bold">Laporan PDF Berhasil Diunduh!</span> File tersimpan di folder unduhan
                  perangkat Anda.
                </div>
              </div>
              <button
                onClick={() => setDownloadSuccess(false)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline ml-2"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Quick Metrics Summary Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pratinjau Ringkasan Periode Ini ({selectedMonth})
              </span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                ID Dok: SKK-RPT-202609-0402
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/60 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 block">Total Terpilah</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {totalWeight.toFixed(2)} kg
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Semua kategori</span>
              </div>

              <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/60 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 block">Reduksi Emisi</span>
                <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                  {totalCo2e.toFixed(2)} kg
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 block mt-0.5">
                  ≈ {treeEquiv} Pohon
                </span>
              </div>

              <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/60 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 block">Poin Diperoleh</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  +{totalPoints} Pts
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Insentif aktif</span>
              </div>

              <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/60 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 block">Jumlah Log</span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {wasteLogs.length} Entri
                </span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">100% E2EE Valid</span>
              </div>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Pengaturan & Kelengkapan Dokumen
            </span>

            <div className="space-y-2.5">
              {/* Option 1: Period Selection */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Periode Waktu Laporan
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Pilih rentang bulan rekapitulasi data penimbangan
                    </span>
                  </div>
                </div>
                <select
                  id="pdf-report-month-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="text-xs font-medium rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="September 2026">September 2026 (Bulan Berjalan)</option>
                  <option value="Agustus 2026">Agustus 2026</option>
                  <option value="Juli 2026">Juli 2026</option>
                  <option value="Semua Riwayat (Q3 2026)">Semua Riwayat (Q3 2026)</option>
                </select>
              </div>

              {/* Option 2: Signatures & Verification Seal */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer hover:border-teal-500/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Stempel & Tanda Tangan Digital Resmi
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Sertakan blok pengesahan Koordinator TPS3R & Dinas Lingkungan Hidup DKI
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeSignatures}
                  onChange={(e) => setIncludeSignatures(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
              </label>

              {/* Option 3: AI Insights */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer hover:border-teal-500/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Analisis Kinerja Sirkular AI SiklusKita
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Evaluasi otomatis rasio pemisahan & saran optimasi pekan mendatang
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeAiInsights}
                  onChange={(e) => setIncludeAiInsights(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
              </label>

              {/* Option 4: Transaction Cryptographic Hash */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer hover:border-teal-500/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Potongan Hash Kriptografi Individual
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Tampilkan kode hash unik SHA-256 untuk setiap transaksi sebagai audit trail
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeHashes}
                  onChange={(e) => setIncludeHashes(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
              </label>
            </div>

            {/* Custom Notes Input */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Catatan / Keterangan Tambahan pada Dokumen (Opsional)
              </label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={2}
                placeholder="Tambahkan catatan khusus untuk RT/RW atau Bank Sampah..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Structure Preview Guide */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Struktur Format PDF yang Dihasilkan:
            </div>
            <p className="text-[11px] leading-relaxed">
              Kop Resmi DLH DKI Jakarta & Greeneration Circle • Data Profil KK & Zona Binaan • 4 Kartu KPI Eksekutif •
              Tabel Komposisi & Rantai Nilai Akhir • Rincian Log Penimbangan Berkala • Rekomendasi Sirkular AI • Blok
              Stempel & Tanda Tangan Digital Terverifikasi.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div
          className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}
        >
          <button
            id="pdf-preview-tab-btn"
            onClick={handleOpenPreview}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Pratinjau di Tab Baru
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>

            <button
              id="confirm-download-pdf-btn"
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memproses PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh PDF Resmi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
