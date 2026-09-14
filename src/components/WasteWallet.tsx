/**
 * Waste Wallet & Circular Credits Redemption Component
 * Displays accrued Circular Credits earned from recycling waste
 * with breakdown of partner merchant redemption options in a clean list view with iconography.
 * SiklusKita - Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState, useMemo } from "react";
import {
  Wallet,
  Coins,
  Store,
  Tag,
  Coffee,
  ShoppingBag,
  Bus,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Receipt,
  Gift,
  ExternalLink,
  Info,
  Clock,
  QrCode,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { WasteLogEntry } from "../types";

export interface MerchantRedemptionOption {
  id: string;
  merchantName: string;
  category: "Kuliner & Kopi" | "Sembako & Belanja" | "Transportasi Hijau" | "Produk Kompos & Kebun";
  title: string;
  description: string;
  creditsRequired: number;
  valueRupiah: number;
  iconType: "coffee" | "shopping" | "bus" | "store";
  location: string;
  voucherCode: string;
  expiresInDays: number;
  popular?: boolean;
}

export const PARTNER_MERCHANTS: MerchantRedemptionOption[] = [
  {
    id: "red-01",
    merchantName: "Kopi Kenangan Berkelanjutan - Cilandak Town Square",
    category: "Kuliner & Kopi",
    title: "Voucher Diskon Rp 15.000 (Bawa Tumbler Sendiri)",
    description: "Berlaku untuk semua varian kopi susu dengan wadah reusable ramah lingkungan.",
    creditsRequired: 60,
    valueRupiah: 15000,
    iconType: "coffee",
    location: "Citos & Pondok Labu",
    voucherCode: "CITOS-CIRCULAR-15K",
    expiresInDays: 30,
    popular: true,
  },
  {
    id: "red-02",
    merchantName: "Toko Sembako Curah 'Bumi Lestari' RW 04",
    category: "Sembako & Belanja",
    title: "Potongan Rp 25.000 Pembelian Beras & Minyak Curah",
    description: "Voucher potongan harga belanja bahan pokok tanpa kemasan sachet plastik sekali pakai.",
    creditsRequired: 100,
    valueRupiah: 25000,
    iconType: "shopping",
    location: "Jl. Cilandak Barat No. 12",
    voucherCode: "BUMI-CURAH-25K",
    expiresInDays: 45,
    popular: true,
  },
  {
    id: "red-03",
    merchantName: "TransJakarta & Mikrotrans JakLingko",
    category: "Transportasi Hijau",
    title: "Top-up Saldo Kartu JakLingko Rp 20.000",
    description: "Subsidi tiket perjalanan ramah emisi koridor Fatmawati - Ragunan - Blok M.",
    creditsRequired: 80,
    valueRupiah: 20000,
    iconType: "bus",
    location: "Halte Busway Cilandak & Lebak Bulus",
    voucherCode: "JAKLINGKO-GREEN-20K",
    expiresInDays: 60,
  },
  {
    id: "red-04",
    merchantName: "Pusat Bibit & Kompos TPS3R RW 04",
    category: "Produk Kompos & Kebun",
    title: "1 Karung (5 kg) Kompos Organik Premium + 2 Bibit Sayur",
    description: "Hasil olahan biokonversi sisa dapur mandiri untuk penghijauan pekarangan rumah.",
    creditsRequired: 50,
    valueRupiah: 20000,
    iconType: "store",
    location: "Rumah Kompos RW 04 Cilandak",
    voucherCode: "KOMPOS-RW04-5KG",
    expiresInDays: 90,
  },
  {
    id: "red-05",
    merchantName: "Bakmi Ayam Hijau 'Sari Rasa' Cipete",
    category: "Kuliner & Kopi",
    title: "Voucher Makan Gratis Es Teh Manis & Pangsit Goreng",
    description: "Mitra kuliner lokal yang telah menghentikan sedotan plastik dan memilah sisa makanan.",
    creditsRequired: 40,
    valueRupiah: 10000,
    iconType: "coffee",
    location: "Jl. Cipete Raya Selatan",
    voucherCode: "SARIRASA-TEH-10K",
    expiresInDays: 30,
  },
  {
    id: "red-06",
    merchantName: "Super Indo Fatmawati (Zero-Waste Corner)",
    category: "Sembako & Belanja",
    title: "Kupon Belanja Rp 50.000 Produk Segar & Buah Lokal",
    description: "Khusus untuk pembelian buah nusantara dan sayuran segar kemasan daun pisang.",
    creditsRequired: 200,
    valueRupiah: 50000,
    iconType: "shopping",
    location: "Jl. RS Fatmawati Raya",
    voucherCode: "SUPERINDO-SEGAR-50K",
    expiresInDays: 60,
  },
];

interface WasteWalletProps {
  wasteLogs: WasteLogEntry[];
  isDarkMode: boolean;
}

export const WasteWallet: React.FC<WasteWalletProps> = ({ wasteLogs, isDarkMode }) => {
  // Calculate total accrued circular credits from historical recycling logs
  const totalAccruedCredits = useMemo(() => {
    return wasteLogs.reduce((acc, log) => acc + (log.points || 0), 0);
  }, [wasteLogs]);

  // Track spent credits persisted in localStorage
  const [spentCredits, setSpentCredits] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("siklukita_spent_credits");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0) return parsed;
      }
    }
    return 80; // Default: already claimed JakLingko top-up
  });

  // Current available balance
  const availableCredits = Math.max(0, totalAccruedCredits - spentCredits);

  // Filter merchant category
  const [selectedMerchantCategory, setSelectedMerchantCategory] = useState<string>("ALL");
  const [redeemedModalOption, setRedeemedModalOption] = useState<MerchantRedemptionOption | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredMerchants = useMemo(() => {
    if (selectedMerchantCategory === "ALL") return PARTNER_MERCHANTS;
    return PARTNER_MERCHANTS.filter((m) => m.category === selectedMerchantCategory);
  }, [selectedMerchantCategory]);

  const handleRedeem = (option: MerchantRedemptionOption) => {
    if (availableCredits < option.creditsRequired) {
      alert(
        `Kredit sirkular Anda belum mencukupi (${availableCredits} CC). Diperlukan ${option.creditsRequired} CC untuk menukar voucher ini. Silakan terus setor dan pilah sampah Anda!`
      );
      return;
    }

    const newSpent = spentCredits + option.creditsRequired;
    setSpentCredits(newSpent);
    if (typeof window !== "undefined") {
      localStorage.setItem("siklukita_spent_credits", newSpent.toString());
    }

    setRedeemedModalOption(option);
    setSuccessToast(`Berhasil menukarkan ${option.creditsRequired} Circular Credits untuk ${option.title}!`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const getMerchantIcon = (iconType: string) => {
    switch (iconType) {
      case "coffee":
        return <Coffee className="w-5 h-5 text-amber-500" />;
      case "shopping":
        return <ShoppingBag className="w-5 h-5 text-emerald-500" />;
      case "bus":
        return <Bus className="w-5 h-5 text-blue-500" />;
      case "store":
      default:
        return <Store className="w-5 h-5 text-teal-500" />;
    }
  };

  const cardBase = isDarkMode
    ? "bg-slate-900/90 border-slate-800 text-slate-100"
    : "bg-white border-slate-200/90 text-slate-800 shadow-sm";

  return (
    <div id="waste-wallet-container" className="space-y-4">
      {/* Toast feedback */}
      {successToast && (
        <div
          id="waste-wallet-toast"
          className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-fadeIn"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-[11px] px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main Waste Wallet Card */}
      <div
        id="waste-wallet-card"
        className={`p-5 sm:p-6 rounded-2xl border transition-all ${cardBase} relative overflow-hidden`}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-md">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Waste Wallet &amp; Circular Credits
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Bank Sampah RW 04
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reward insentif ekonomi sirkular dari setiap kg sampah terpilah yang Anda setorkan
              </p>
            </div>
          </div>

          {/* Quick Balance Pills */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                Saldo Tersedia
              </div>
              <div className="text-2xl font-black font-mono mt-0.5 flex items-baseline gap-1">
                <span>{availableCredits}</span>
                <span className="text-xs font-semibold">CC</span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <div className="text-[10px] font-medium text-slate-400">Total Terkumpul</div>
              <div className="text-base font-bold font-mono mt-0.5">
                {totalAccruedCredits} <span className="text-xs font-normal">CC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Estimasi Nilai Rupiah</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              Rp {(availableCredits * 250).toLocaleString("id-ID")}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">1 CC ≈ Rp 250 mitra</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Kredit Ditukarkan</span>
            <span className="text-base font-bold text-slate-700 dark:text-slate-200 font-mono">
              {spentCredits} CC
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">1 transaksi voucher</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Total Setoran Sampah</span>
            <span className="text-base font-bold text-teal-600 dark:text-teal-400 font-mono">
              {wasteLogs.length} Kali
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Riwayat terverifikasi</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Mitra Komunitas Aktif</span>
            <span className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono">
              {PARTNER_MERCHANTS.length} Merchant
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Cilandak &amp; Jakarta</span>
          </div>
        </div>

        {/* Filter Merchant Categories */}
        <div className="pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Pilihan Penukaran Merchant Mitra Lingkungan (Redemption Options)
              </h4>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
              {["ALL", "Kuliner & Kopi", "Sembako & Belanja", "Transportasi Hijau", "Produk Kompos & Kebun"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedMerchantCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedMerchantCategory === cat
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {cat === "ALL" ? "Semua Merchant" : cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Simple List View with Iconography */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/40">
            {filteredMerchants.map((merchant) => {
              const canAfford = availableCredits >= merchant.creditsRequired;

              return (
                <div
                  key={merchant.id}
                  id={`merchant-option-${merchant.id}`}
                  className="p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Left: Iconography & Merchant Details */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                        merchant.iconType === "coffee"
                          ? "bg-amber-500/15 border border-amber-500/30"
                          : merchant.iconType === "shopping"
                          ? "bg-emerald-500/15 border border-emerald-500/30"
                          : merchant.iconType === "bus"
                          ? "bg-blue-500/15 border border-blue-500/30"
                          : "bg-teal-500/15 border border-teal-500/30"
                      }`}
                    >
                      {getMerchantIcon(merchant.iconType)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {merchant.title}
                        </span>
                        {merchant.popular && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            Paling Populer
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {merchant.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                        {merchant.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Store className="w-3 h-3 text-slate-400" />
                          <strong className="text-slate-700 dark:text-slate-300">{merchant.merchantName}</strong>
                        </span>
                        <span>•</span>
                        <span>{merchant.location}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Masa berlaku {merchant.expiresInDays} hari
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Credits Cost & Redeem Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <div className="flex items-center sm:justify-end gap-1 font-black font-mono text-base sm:text-lg text-amber-600 dark:text-amber-400">
                        <Coins className="w-4 h-4" />
                        <span>{merchant.creditsRequired} CC</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Senilai Rp {merchant.valueRupiah.toLocaleString("id-ID")}
                      </div>
                    </div>

                    <button
                      id={`btn-redeem-${merchant.id}`}
                      onClick={() => handleRedeem(merchant)}
                      disabled={!canAfford}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        canAfford
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                      }`}
                      title={canAfford ? "Tukarkan sekarang" : `Kredit kurang ${merchant.creditsRequired - availableCredits} CC`}
                    >
                      <span>{canAfford ? "Tukarkan Voucher" : "Kredit Kurang"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Kredit terverifikasi otomatis via smart-contract hash di setiap setoran sampah Anda.</span>
          </div>
          <div className="text-slate-400">
            Pergub DKI No. 77/2020 • Insentif Retribusi &amp; Circular Economy
          </div>
        </div>
      </div>

      {/* Redemption Success Modal */}
      {redeemedModalOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className={`w-full max-w-md p-6 rounded-2xl border ${cardBase} space-y-4 shadow-2xl relative`}
          >
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                <Gift className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Penukaran Voucher Berhasil!
              </h3>
              <p className="text-xs text-slate-500">
                Tunjukkan kode voucher berikut kepada kasir merchant mitra saat bertransaksi:
              </p>
            </div>

            {/* Voucher ticket display */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-emerald-500/40 text-center space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                {redeemedModalOption.merchantName}
              </span>
              <div className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                {redeemedModalOption.voucherCode}
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {redeemedModalOption.title}
              </p>
              <div className="text-[10px] text-slate-400">
                Berlaku hingga 30 hari ke depan • Sekali pakai
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Sisa Saldo Anda:</span>
                <span className="font-bold text-amber-600 font-mono">{availableCredits} CC</span>
              </div>
              <button
                onClick={() => setRedeemedModalOption(null)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-sm"
              >
                Selesai &amp; Simpan Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
