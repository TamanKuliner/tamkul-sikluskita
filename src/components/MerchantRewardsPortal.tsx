/**
 * Merchant Rewards Portal Component
 * Links to local DKI Jakarta sustainable businesses where users can redeem accrued Circular Credits.
 * Integrated into AwardingView - Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState, useMemo, useEffect } from "react";
import {
  Store,
  Coins,
  Tag,
  ShoppingBag,
  Coffee,
  Bus,
  MapPin,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Gift,
  QrCode,
  Search,
  Filter,
  ShieldCheck,
  Leaf,
  Clock,
  ArrowRight,
  Copy,
  Check,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Ticket,
} from "lucide-react";
import confetti from "canvas-confetti";
import { WasteLogEntry } from "../types";

export interface SustainableMerchant {
  id: string;
  businessName: string;
  category: "Zero-Waste & Curah" | "Kuliner & Cafe Ramah Lingkungan" | "Transportasi Rendah Emisi" | "Urban Farming & Kompos" | "Refill & Personal Care";
  dkiRegion: "Jakarta Selatan" | "Jakarta Pusat" | "Jakarta Barat" | "Jakarta Timur" | "Jakarta Utara";
  address: string;
  ecoCommitment: string;
  websiteUrl: string;
  googleMapsUrl: string;
  rewardTitle: string;
  rewardDescription: string;
  creditsRequired: number;
  rupiahValue: number;
  voucherCodePrefix: string;
  validityDays: number;
  partnerSince: string;
  isPopular?: boolean;
  isFeatured?: boolean;
}

export interface ClaimedVoucher {
  id: string;
  merchantId: string;
  businessName: string;
  rewardTitle: string;
  voucherCode: string;
  creditsSpent: number;
  rupiahValue: number;
  claimedAt: string;
  expiresAt: string;
  isUsed: boolean;
  category: string;
}

export const SUSTAINABLE_MERCHANTS_DKI: SustainableMerchant[] = [
  {
    id: "mch-01",
    businessName: "Saruga Package-Free Bulk Store",
    category: "Zero-Waste & Curah",
    dkiRegion: "Jakarta Selatan",
    address: "Jl. Taman Bintaro Barat No. 1, Pesanggrahan, Jakarta Selatan",
    ecoCommitment: "100% bebas kemasan plastik sachet & wadah sekali pakai; mendukung gaya hidup minim sampah",
    websiteUrl: "https://www.instagram.com/sarugaindonesia",
    googleMapsUrl: "https://maps.google.com/?q=Saruga+Package-Free+Store+Jakarta",
    rewardTitle: "Voucher Belanja Curah Rp 30.000",
    rewardDescription: "Potongan langsung belanja sabun, detergen ramah lingkungan, dan bumbu dapur curah menggunakan wadah sendiri.",
    creditsRequired: 90,
    rupiahValue: 30000,
    voucherCodePrefix: "SARUGA-CIRCULAR-30K",
    validityDays: 45,
    partnerSince: "Januari 2025",
    isPopular: true,
    isFeatured: true,
  },
  {
    id: "mch-02",
    businessName: "Burgreens Plant-Based & Eco Eatery Kemang",
    category: "Kuliner & Cafe Ramah Lingkungan",
    dkiRegion: "Jakarta Selatan",
    address: "Jl. Kemang Raya No. 1A, Bangka, Mampang Prapatan, Jakarta Selatan",
    ecoCommitment: "Menu 100% berbasis nabati organik lokal, nol limbah makanan (zero food waste) ke TPA via komposting BSF",
    websiteUrl: "https://burgreens.com",
    googleMapsUrl: "https://maps.google.com/?q=Burgreens+Kemang+Jakarta",
    rewardTitle: "Diskon Menu Nabati Rp 40.000",
    rewardDescription: "Voucher potongan makan di tempat untuk semua menu burger nabati dan salad organik nusantara.",
    creditsRequired: 130,
    rupiahValue: 40000,
    voucherCodePrefix: "BURGREENS-GREEN-40K",
    validityDays: 30,
    partnerSince: "Maret 2025",
    isPopular: true,
  },
  {
    id: "mch-03",
    businessName: "TransJakarta & Mikrotrans JakLingko",
    category: "Transportasi Rendah Emisi",
    dkiRegion: "Jakarta Pusat",
    address: "Seluruh Halte Koridor Utama & Rute Mikrotrans DKI Jakarta",
    ecoCommitment: "Armada bus listrik ramah lingkungan (e-bus TJ) mengurangi emisi gas buang karbon transportasi ibukota",
    websiteUrl: "https://transjakarta.co.id",
    googleMapsUrl: "https://maps.google.com/?q=Halte+Transjakarta+Harmoni+Jakarta",
    rewardTitle: "Subsidi Saldo Kartu JakLingko Rp 25.000",
    rewardDescription: "Top-up saldo transportasi publik terintegrasi untuk mobilitas rendah emisi harian warga Jakarta.",
    creditsRequired: 80,
    rupiahValue: 25000,
    voucherCodePrefix: "JAKLINGKO-SUB-25K",
    validityDays: 60,
    partnerSince: "November 2024",
    isPopular: true,
    isFeatured: true,
  },
  {
    id: "mch-04",
    businessName: "Siklus Refill Indonesia Jabodetabek",
    category: "Refill & Personal Care",
    dkiRegion: "Jakarta Selatan",
    address: "Layanan Mobile Van & Hub Cilandak - Pondok Labu, Jakarta Selatan",
    ecoCommitment: "Antar produk kebutuhan rumah tangga cair langsung ke rumah tanpa kemasan plastik sachet",
    websiteUrl: "https://siklus.com",
    googleMapsUrl: "https://maps.google.com/?q=Cilandak+Barat+Jakarta+Selatan",
    rewardTitle: "Voucher Isi Ulang Sabun & Shampo Rp 20.000",
    rewardDescription: "Refill sabun cuci piring, deterjen konsentrat, atau cairan pembersih lantai langsung ke jeriken Anda.",
    creditsRequired: 65,
    rupiahValue: 20000,
    voucherCodePrefix: "SIKLUS-REFILL-20K",
    validityDays: 30,
    partnerSince: "Februari 2025",
  },
  {
    id: "mch-05",
    businessName: "Kebun Kumala Urban Farm & Education Centre",
    category: "Urban Farming & Kompos",
    dkiRegion: "Jakarta Barat",
    address: "Jl. Kedoya Selatan No. 18, Kebon Jeruk, Jakarta Barat",
    ecoCommitment: "Pemberdayaan pertanian kota regenerative, daur ulang sisa sayuran pasar jadi media tanam subur",
    websiteUrl: "https://www.instagram.com/kebunkumala",
    googleMapsUrl: "https://maps.google.com/?q=Kebun+Kumala+Jakarta+Barat",
    rewardTitle: "Paket 3 Bibit Sayur Urban + Kompos Organik 3kg",
    rewardDescription: "Paket lengkap berkebun rumah ramah lingkungan untuk penghijauan pekarangan dan ketahanan pangan keluarga.",
    creditsRequired: 70,
    rupiahValue: 25000,
    voucherCodePrefix: "KUMALA-FARM-25K",
    validityDays: 60,
    partnerSince: "April 2025",
  },
  {
    id: "mch-06",
    businessName: "Kopi Kenangan (Gerakan Bawa Tumbler Citos)",
    category: "Kuliner & Cafe Ramah Lingkungan",
    dkiRegion: "Jakarta Selatan",
    address: "Cilandak Town Square Lt. GF, Jl. TB Simatupang, Jakarta Selatan",
    ecoCommitment: "Pengurangan 10.000+ cup plastik sekali pakai dengan insentif harga khusus bagi pelanggan bertumbler",
    websiteUrl: "https://kopikenangan.com",
    googleMapsUrl: "https://maps.google.com/?q=Cilandak+Town+Square+Jakarta",
    rewardTitle: "Voucher Minuman Kopi / Non-Kopi Rp 18.000",
    rewardDescription: "Berlaku untuk semua menu minuman dengan wadah tumbler reusable kesayangan Anda.",
    creditsRequired: 55,
    rupiahValue: 18000,
    voucherCodePrefix: "KENANGAN-TUMBLER-18K",
    validityDays: 30,
    partnerSince: "Januari 2025",
    isPopular: true,
  },
  {
    id: "mch-07",
    businessName: "Warung Beras & Sembako Curah 'Bumi Asri' Cempaka Putih",
    category: "Zero-Waste & Curah",
    dkiRegion: "Jakarta Pusat",
    address: "Jl. Cempaka Putih Tengah No. 42, Jakarta Pusat",
    ecoCommitment: "Kemitraan UMKM binaan JakPreneur bebas plastik kantong kresek, menggunakan wadah kain reusable",
    websiteUrl: "https://jakpreneur.jakarta.go.id",
    googleMapsUrl: "https://maps.google.com/?q=Cempaka+Putih+Jakarta+Pusat",
    rewardTitle: "Potongan Rp 35.000 Belanja Beras Organik",
    rewardDescription: "Potongan harga khusus pembelian beras merah, beras hitam, atau beras pandan wangi curah lokal.",
    creditsRequired: 110,
    rupiahValue: 35000,
    voucherCodePrefix: "BUMIASRI-SEMBAKO-35K",
    validityDays: 45,
    partnerSince: "Mei 2025",
  },
  {
    id: "mch-08",
    businessName: "Koinpack Circular Returnable Packaging Hub",
    category: "Refill & Personal Care",
    dkiRegion: "Jakarta Timur",
    address: "Jl. Pemuda No. 70, Rawamangun, Pulo Gadung, Jakarta Timur",
    ecoCommitment: "Sistem botol reusable bersirkulasi otomatis yang dapat dikembalikan untuk dicuci dan diisi ulang",
    websiteUrl: "https://koinpack.id",
    googleMapsUrl: "https://maps.google.com/?q=Rawamangun+Jakarta+Timur",
    rewardTitle: "Kupon Diskon Rp 25.000 Produk Sabun Botol Putar",
    rewardDescription: "Beli sabun dan detergen cair dalam botol tebal standar Koinpack yang dapat ditukar kapan saja.",
    creditsRequired: 75,
    rupiahValue: 25000,
    voucherCodePrefix: "KOINPACK-HUB-25K",
    validityDays: 45,
    partnerSince: "Juni 2025",
  },
];

interface MerchantRewardsPortalProps {
  wasteLogs?: WasteLogEntry[];
  isDarkMode: boolean;
}

export const MerchantRewardsPortal: React.FC<MerchantRewardsPortalProps> = ({
  wasteLogs = [],
  isDarkMode,
}) => {
  // Navigation tabs inside portal
  const [activePortalTab, setActivePortalTab] = useState<"catalog" | "myVouchers" | "aboutPartnership">("catalog");

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Accrued Credits Calculation
  const totalAccruedFromLogs = useMemo(() => {
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
    return 80; // Baseline redeemed
  });

  // Persisted claimed vouchers
  const [claimedVouchers, setClaimedVouchers] = useState<ClaimedVoucher[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("siklukita_claimed_vouchers");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    // Default initial sample voucher for immediate usability
    return [
      {
        id: "vouch-init-01",
        merchantId: "mch-03",
        businessName: "TransJakarta & Mikrotrans JakLingko",
        rewardTitle: "Subsidi Saldo Kartu JakLingko Rp 25.000",
        voucherCode: "JAKLINGKO-SUB-25K-79A4X",
        creditsSpent: 80,
        rupiahValue: 25000,
        claimedAt: "2026-09-08 14:22 WIB",
        expiresAt: "2026-11-07",
        isUsed: false,
        category: "Transportasi Rendah Emisi",
      },
    ];
  });

  // Effective available credits balance
  const currentAvailableCredits = Math.max(0, (totalAccruedFromLogs || 380) - spentCredits);

  // Redemption Modal State
  const [selectedMerchantForRedeem, setSelectedMerchantForRedeem] = useState<SustainableMerchant | null>(null);
  const [redeemedVoucherResult, setRedeemedVoucherResult] = useState<ClaimedVoucher | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync claimed vouchers to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("siklukita_claimed_vouchers", JSON.stringify(claimedVouchers));
    }
  }, [claimedVouchers]);

  // Sync spent credits to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("siklukita_spent_credits", spentCredits.toString());
    }
  }, [spentCredits]);

  // Filtered merchants based on category, region, and search term
  const filteredMerchants = useMemo(() => {
    return SUSTAINABLE_MERCHANTS_DKI.filter((m) => {
      const matchCat = selectedCategory === "ALL" || m.category === selectedCategory;
      const matchRegion = selectedRegion === "ALL" || m.dkiRegion === selectedRegion;
      const matchQuery =
        searchQuery.trim() === "" ||
        m.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.rewardTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.ecoCommitment.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchRegion && matchQuery;
    });
  }, [selectedCategory, selectedRegion, searchQuery]);

  // Handle actual redemption execution
  const executeRedeem = (merchant: SustainableMerchant) => {
    if (currentAvailableCredits < merchant.creditsRequired) {
      alert(`Kredit sirkular Anda belum mencukupi (${currentAvailableCredits} CC). Membutuhkan ${merchant.creditsRequired} CC.`);
      return;
    }

    const uniqueSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newVoucherCode = `${merchant.voucherCodePrefix}-${uniqueSuffix}`;

    const now = new Date();
    const expDate = new Date();
    expDate.setDate(now.getDate() + merchant.validityDays);

    const newVoucher: ClaimedVoucher = {
      id: `vouch-${Date.now()}`,
      merchantId: merchant.id,
      businessName: merchant.businessName,
      rewardTitle: merchant.rewardTitle,
      voucherCode: newVoucherCode,
      creditsSpent: merchant.creditsRequired,
      rupiahValue: merchant.rupiahValue,
      claimedAt: now.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      expiresAt: expDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      isUsed: false,
      category: merchant.category,
    };

    setSpentCredits((prev) => prev + merchant.creditsRequired);
    setClaimedVouchers((prev) => [newVoucher, ...prev]);
    setSelectedMerchantForRedeem(null);
    setRedeemedVoucherResult(newVoucher);

    setToastMessage(`Berhasil menukarkan ${merchant.creditsRequired} CC untuk ${merchant.rewardTitle}!`);
    setTimeout(() => setToastMessage(null), 5000);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#10b981", "#f59e0b", "#06b6d4", "#8b5cf6"],
      });
    } catch {
      // safe fallback
    }
  };

  const copyVoucherCode = (code: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Zero-Waste & Curah":
        return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
      case "Kuliner & Cafe Ramah Lingkungan":
        return <Coffee className="w-4 h-4 text-amber-500" />;
      case "Transportasi Rendah Emisi":
        return <Bus className="w-4 h-4 text-blue-500" />;
      case "Urban Farming & Kompos":
        return <Leaf className="w-4 h-4 text-teal-500" />;
      case "Refill & Personal Care":
      default:
        return <Store className="w-4 h-4 text-indigo-500" />;
    }
  };

  const cardBase = isDarkMode
    ? "bg-slate-900/90 border-slate-800 text-slate-100"
    : "bg-white border-slate-200/90 text-slate-800 shadow-sm";

  return (
    <div id="merchant-rewards-portal" className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[11px] px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main Portal Container */}
      <div className={`p-5 sm:p-7 rounded-3xl border ${cardBase} relative overflow-hidden space-y-6`}>
        {/* Header Ribbon & Title */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b pb-5 dark:border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <Store className="w-3.5 h-3.5 text-emerald-500" />
              <span>Merchant Rewards Portal • DKI Jakarta Eco-Network</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>Tukar Circular Credits di Bisnis Berkelanjutan DKI Jakarta</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Wujud nyata kolaborasi ekonomi sirkular <strong>Greeneration Circle 2026</strong> bersama UMKM &amp; unit usaha berkelanjutan se-Jabodetabek. Setiap kg sampah yang berhasil Anda pilah diubah menjadi voucher belanja sembako curah, kuliner nabati, isi ulang tanpa kemasan plastik, dan subsidi transportasi publik.
            </p>
          </div>

          {/* User Credits Balance Card */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 p-4 rounded-2xl bg-gradient-to-tr from-amber-500/15 via-emerald-500/10 to-teal-500/15 border border-amber-500/30 shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1 sm:justify-end">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                Saldo Circular Credits Anda
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400 mt-0.5 flex items-baseline sm:justify-end gap-1">
                <span>{currentAvailableCredits}</span>
                <span className="text-xs font-bold">CC</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Setara ≈ <strong className="text-emerald-600 dark:text-emerald-400">Rp {(currentAvailableCredits * 250).toLocaleString("id-ID")}</strong> nilai voucher
              </div>
            </div>

            <button
              onClick={() => setActivePortalTab("myVouchers")}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer shadow-xs"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Voucher Saya ({claimedVouchers.length})</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              id="tab-merchant-catalog"
              onClick={() => setActivePortalTab("catalog")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
                activePortalTab === "catalog"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Katalog Merchant Mitra ({SUSTAINABLE_MERCHANTS_DKI.length})</span>
            </button>

            <button
              id="tab-my-vouchers"
              onClick={() => setActivePortalTab("myVouchers")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
                activePortalTab === "myVouchers"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Voucher Aktif Saya ({claimedVouchers.length})</span>
            </button>

            <button
              id="tab-partnership-info"
              onClick={() => setActivePortalTab("aboutPartnership")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
                activePortalTab === "aboutPartnership"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kemitraan DKI &amp; Regulasi Pergub 77/2020</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1 CC didapat dari setiap 100g sampah terpilah</span>
          </div>
        </div>

        {/* TAB 1: CATALOGUE OF MERCHANTS */}
        {activePortalTab === "catalog" && (
          <div className="space-y-5">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari merchant, toko curah, menu nabati, atau lokasi di Jakarta..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filter Kategori Merchant"
                  className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Semua Kategori Usaha</option>
                  <option value="Zero-Waste & Curah">Zero-Waste &amp; Curah</option>
                  <option value="Kuliner & Cafe Ramah Lingkungan">Kuliner &amp; Cafe Ramah Lingkungan</option>
                  <option value="Transportasi Rendah Emisi">Transportasi Rendah Emisi</option>
                  <option value="Urban Farming & Kompos">Urban Farming &amp; Kompos</option>
                  <option value="Refill & Personal Care">Refill &amp; Personal Care</option>
                </select>

                {/* Region Filter */}
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  aria-label="Filter Wilayah DKI Jakarta"
                  className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Seluruh Wilayah DKI Jakarta</option>
                  <option value="Jakarta Selatan">Jakarta Selatan</option>
                  <option value="Jakarta Pusat">Jakarta Pusat</option>
                  <option value="Jakarta Barat">Jakarta Barat</option>
                  <option value="Jakarta Timur">Jakarta Timur</option>
                  <option value="Jakarta Utara">Jakarta Utara</option>
                </select>
              </div>
            </div>

            {/* Merchant Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMerchants.map((merchant) => {
                const canAfford = currentAvailableCredits >= merchant.creditsRequired;

                return (
                  <div
                    key={merchant.id}
                    id={`merchant-card-${merchant.id}`}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between hover:border-emerald-500/50 ${
                      merchant.isFeatured
                        ? "bg-gradient-to-br from-emerald-500/5 via-transparent to-amber-500/5 border-emerald-500/30"
                        : "bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800"
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="p-1.5 rounded-lg bg-emerald-500/10 shrink-0">
                            {getCategoryIcon(merchant.category)}
                          </span>
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {merchant.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {merchant.isPopular && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              Favorit Warga
                            </span>
                          )}
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            {merchant.dkiRegion}
                          </span>
                        </div>
                      </div>

                      {/* Merchant Name & Description */}
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                          {merchant.businessName}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          <span>{merchant.address}</span>
                        </p>
                      </div>

                      {/* Eco Commitment tag */}
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                        <Leaf className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          <strong>Komitmen Berkelanjutan:</strong> {merchant.ecoCommitment}
                        </span>
                      </div>

                      {/* Reward Box */}
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {merchant.rewardTitle}
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            Rp {merchant.rupiahValue.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {merchant.rewardDescription}
                        </p>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 mt-4 border-t dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={merchant.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 font-medium transition"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Profil Usaha</span>
                        </a>
                        <span>•</span>
                        <a
                          href={merchant.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 font-medium transition"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Peta Lokasi</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-medium">Kredit Diperlukan</span>
                          <span className="font-mono text-sm font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Coins className="w-3 h-3" />
                            {merchant.creditsRequired} CC
                          </span>
                        </div>

                        <button
                          id={`btn-open-redeem-${merchant.id}`}
                          onClick={() => setSelectedMerchantForRedeem(merchant)}
                          disabled={!canAfford}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                            canAfford
                              ? "bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                          }`}
                          title={canAfford ? "Tukarkan sekarang" : `Kredit kurang ${merchant.creditsRequired - currentAvailableCredits} CC`}
                        >
                          <span>{canAfford ? "Tukarkan" : "Kredit Kurang"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredMerchants.length === 0 && (
              <div className="p-8 text-center space-y-2 border border-dashed rounded-2xl border-slate-300 dark:border-slate-700">
                <Store className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Tidak ditemukan merchant mitra yang sesuai pencarian
                </p>
                <p className="text-xs text-slate-400">
                  Coba ubah kata kunci atau pilih opsi filter kategori/wilayah yang lain.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY CLAIMED VOUCHERS */}
        {activePortalTab === "myVouchers" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-emerald-500" />
                  <span>Daftar Voucher Sirkular Anda yang Siap Digunakan</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Tunjukkan kode voucher berikut ke kasir merchant mitra saat melakukan transaksi.
                </p>
              </div>

              <button
                onClick={() => setActivePortalTab("catalog")}
                className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
              >
                + Tukar Voucher Baru
              </button>
            </div>

            <div className="space-y-3">
              {claimedVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  id={`my-voucher-${voucher.id}`}
                  className="p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-white dark:bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                      <QrCode className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {voucher.rewardTitle}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                          Aktif
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {voucher.businessName}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                        <span>Ditukarkan: {voucher.claimedAt}</span>
                        <span>•</span>
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          Berlaku hingga: {voucher.expiresAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Voucher Code Box */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block">Kode Voucher:</span>
                      <div className="font-mono text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                        {voucher.voucherCode}
                      </div>
                    </div>

                    <button
                      onClick={() => copyVoucherCode(voucher.voucherCode)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PARTNERSHIP & REGULATORY CONTEXT */}
        {activePortalTab === "aboutPartnership" && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Dasar Kebijakan &amp; Kemitraan Ekonomi Sirkular DKI Jakarta
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Pergub DKI No. 77/2020
                </span>
                <p className="leading-relaxed">
                  Pengelolaan Sampah pada Lingkup Rukun Warga yang mewajibkan pemilahan sampah dari sumber dan memberikan skema insentif pengurangan retribusi kebersihan.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Verifikasi Kemitraan UMKM
                </span>
                <p className="leading-relaxed">
                  Seluruh merchant mitra terafiliasi resmi dengan program Greeneration Circle dan Dinas Lingkungan Hidup DKI Jakarta untuk memastikan integritas voucher.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Konversi Dampak Lingkungan
                </span>
                <p className="leading-relaxed">
                  Poin Circular Credits dihitung dari timbulan sampah yang tercegah masuk ke TPA Bantargebang dan telah diverifikasi menggunakan audit hash kriptografis.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal to Redeem */}
      {selectedMerchantForRedeem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-md p-6 rounded-3xl border ${cardBase} space-y-5 shadow-2xl relative`}>
            <button
              onClick={() => setSelectedMerchantForRedeem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600">
                <Coins className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Konfirmasi Penukaran Voucher
              </h3>
              <p className="text-xs text-slate-500">
                Anda akan menukarkan poin Circular Credits untuk voucher berikut:
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {selectedMerchantForRedeem.businessName}
              </span>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {selectedMerchantForRedeem.rewardTitle}
              </div>
              <p className="text-xs text-slate-500">
                {selectedMerchantForRedeem.rewardDescription}
              </p>
              <div className="pt-2 border-t dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400">Biaya Penukaran:</span>
                <span className="font-mono font-black text-amber-600 dark:text-amber-400">
                  {selectedMerchantForRedeem.creditsRequired} CC
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Sisa Saldo Setelah Ditukar:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {currentAvailableCredits - selectedMerchantForRedeem.creditsRequired} CC
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMerchantForRedeem(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                id="confirm-redeem-btn"
                onClick={() => executeRedeem(selectedMerchantForRedeem)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Konfirmasi Tukar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redemption Success Ticket Modal */}
      {redeemedVoucherResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-md p-6 rounded-3xl border ${cardBase} space-y-4 shadow-2xl relative`}>
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                <Gift className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Voucher Berhasil Ditukarkan!
              </h3>
              <p className="text-xs text-slate-500">
                Simpan kode voucher di bawah ini dan tunjukkan kepada merchant mitra saat bertransaksi:
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-emerald-500/50 text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {redeemedVoucherResult.businessName}
              </span>
              <div className="text-xl sm:text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                {redeemedVoucherResult.voucherCode}
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {redeemedVoucherResult.rewardTitle}
              </p>
              <div className="text-[10px] text-slate-400 pt-1">
                Berlaku hingga: <strong>{redeemedVoucherResult.expiresAt}</strong>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => copyVoucherCode(redeemedVoucherResult.voucherCode)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? "Tersalin!" : "Salin Kode"}</span>
              </button>
              <button
                onClick={() => {
                  setRedeemedVoucherResult(null);
                  setActivePortalTab("myVouchers");
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-sm"
              >
                Buka Voucher Saya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
