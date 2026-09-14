/**
 * Quick Sort Helper Floating Widget
 * Context-sensitive preparation & recycling tips based on the currently scanned waste category.
 * Fahira Shanin Nadifa & Tim | Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  Lightbulb,
  X,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Droplets,
  Scissors,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Info,
  Check,
  PackageCheck,
  Flame,
} from "lucide-react";

export type HelperWasteCategory =
  | "PLASTIC"
  | "ORGANIC"
  | "PAPER"
  | "METAL_GLASS"
  | "HAZARDOUS";

interface CategoryQuickTips {
  id: HelperWasteCategory;
  name: string;
  badgeLabel: string;
  accentColor: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
  textLight: string;
  textDark: string;
  prepHeadline: string;
  prepSteps: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  fatalMistakes: string[];
  cleanlinessStandard: string;
  economicValueEstimate: string;
  recommendedStorage: string;
  tps3rCompatibility: string;
}

const CATEGORY_TIPS_DATABASE: Record<HelperWasteCategory, CategoryQuickTips> = {
  PLASTIC: {
    id: "PLASTIC",
    name: "Plastik (PET, HDPE & Film)",
    badgeLabel: "Plastik",
    accentColor: "#0ea5e9",
    bgLight: "bg-sky-50",
    bgDark: "dark:bg-sky-950/40",
    borderLight: "border-sky-200",
    borderDark: "dark:border-sky-800",
    textLight: "text-sky-700",
    textDark: "dark:text-sky-300",
    prepHeadline: "Cara Menyiapkan Plastik Agar Lolos Standar Bank Sampah",
    prepSteps: [
      {
        title: "Bilas Bersih dari Residu Gula & Minyak",
        description: "Gunakan air bilasan sisa cucian piring (hemat air) untuk membuang endapan manis dan lemak.",
        icon: Droplets,
      },
      {
        title: "Kupas Label Plastik PVC & Segel Tutup",
        description: "Lepaskan stiker merek/label shrink-wrap karena jenis plastiknya berbeda (PVC tidak larut di rPET).",
        icon: Scissors,
      },
      {
        title: "Pipihkan / Injak Hingga Rata",
        description: "Remas botol atau galon kecil hingga kempes untuk menghemat volume wadah simpan rumah hingga 65%.",
        icon: Layers,
      },
      {
        title: "Pisahkan Tutup Botol (PP) dari Badan (PET)",
        description: "Tutup botol menggunakan plastik PP bernilai jual terpisah; simpan dalam wadah botol tutup khusus.",
        icon: PackageCheck,
      },
    ],
    fatalMistakes: [
      "Mencampur sedotan plastik kotor berminyak ke dalam karung botol PET bersih.",
      "Menyetor botol dalam kondisi masih berisi cairan (menambah bobot palsu dan ditolak Bank Sampah).",
      "Membakar sisa plastik kresek hitam (melepaskan gas dioksin beracun karsinogenik).",
    ],
    cleanlinessStandard: "Kering 95%, bebas lumut, dan bebas minyak goreng.",
    economicValueEstimate: "Rp 3.500 - Rp 5.200 / kg (Botol PET Bening)",
    recommendedStorage: "Karung jaring atau kardus kering berventilasi.",
    tps3rCompatibility: "Diterima 100% di Bank Sampah Melati & Aggregator Recycler Jakarta Selatan.",
  },
  ORGANIC: {
    id: "ORGANIC",
    name: "Organik & Sisa Makanan Dapur",
    badgeLabel: "Organik",
    accentColor: "#10b981",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-950/40",
    borderLight: "border-emerald-200",
    borderDark: "dark:border-emerald-800",
    textLight: "text-emerald-700",
    textDark: "dark:text-emerald-300",
    prepHeadline: "Prosedur Pemilahan Organik Segar untuk Biokonversi BSF",
    prepSteps: [
      {
        title: "Tiriskan Kuah & Minyak Berlebih",
        description: "Gunakan saringan wastafel; cairan berlebih memicu fermentasi anaerobik berbau busuk.",
        icon: Droplets,
      },
      {
        title: "Cacah Sisa Sayur & Kulit Buah Tebal",
        description: "Potong sisa kulit nanas, semangka, atau batang sayur 2-3 cm agar larva Maggot BSF cepat melahapnya.",
        icon: Scissors,
      },
      {
        title: "Singkirkan Benda Keras & Kontaminan Non-Organik",
        description: "Pastikan bebas dari tusuk gigi, staples bungkus nasi, karet gelang, tulang sapi besar, atau puntung rokok.",
        icon: AlertTriangle,
      },
      {
        title: "Taburkan Sedikit Serbuk Kayu / Dedak Bekas",
        description: "Bila disimpan lebih dari 24 jam, tabur sekam atau serbuk kayu untuk menjaga rasio C/N dan kelembaban.",
        icon: Layers,
      },
    ],
    fatalMistakes: [
      "Memasukkan kotoran hewan peliharaan (anjing/kucing) ke dalam komposter biokonversi pangan.",
      "Mencampur plastik kresek bungkus lauk ke dalam ember organik.",
      "Membiarkan wadah terbuka hingga dihinggapi lalat hijau rumah (bukan lalat tentara hitam BSF).",
    ],
    cleanlinessStandard: "Bebas bahan sintetis, tidak terkontaminasi sabun pembersih kimia.",
    economicValueEstimate: "Tukar poin insentif SiklusKita + gratis pupuk cair organik (POC).",
    recommendedStorage: "Ember tertutup berlubang aerasi atau komposter biopori.",
    tps3rCompatibility: "Prioritas harian untuk Reaktor Maggot BSF TPS3R Cilandak Barat.",
  },
  PAPER: {
    id: "PAPER",
    name: "Kertas, Karton & Kardus Paket",
    badgeLabel: "Kertas/Karton",
    accentColor: "#f59e0b",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-950/40",
    borderLight: "border-amber-200",
    borderDark: "dark:border-amber-800",
    textLight: "text-amber-700",
    textDark: "dark:text-amber-300",
    prepHeadline: "Panduan Pengemasan Kardus & Kertas Kering Bernilai Tinggi",
    prepSteps: [
      {
        title: "Pastikan Kering Sempurna 100%",
        description: "Kertas basah memicu pembusukan serat selulosa dan ditolak oleh pabrik pulp daur ulang.",
        icon: Droplets,
      },
      {
        title: "Lepaskan Lakban Cokelat & Resi Paket Plastik",
        description: "Kupas perekat isolasi dan stiker resi pengiriman berpelapis plastik pada kardus belanja online.",
        icon: Scissors,
      },
      {
        title: "Lepaskan Klip Logam & Staples Tebal",
        description: "Cabut staples besi pada tumpukan dokumen sebelum disatukan.",
        icon: Layers,
      },
      {
        title: "Bongkar Lipatan & Ikat Tali Rami / Rafia",
        description: "Pipihkan kardus menjadi lembaran datar dan ikat bundel per 5 kg untuk memudahkan penimbangan.",
        icon: PackageCheck,
      },
    ],
    fatalMistakes: [
      "Mencampur kertas minyak bungkus nasi atau kotak pizza berminyak (minyak merusak proses bubur kertas).",
      "Memasukkan kertas struk kasir termal (mengandung zat kimia bisphenol/BPA berbahaya).",
      "Mencampur cangkir kertas sekali pakai yang berlapis lapisan plastik PE kedap air.",
    ],
    cleanlinessStandard: "Kering, bebas noda minyak/lemak makanan, dan bebas lakban plastik.",
    economicValueEstimate: "Rp 2.000 - Rp 3.200 / kg (Kardus Coklat Gelombang)",
    recommendedStorage: "Tumpuk mendatar di area indoor kering terhindar dari tampias hujan.",
    tps3rCompatibility: "Diterima penuh di seluruh jaringan Bank Sampah RW & Sudin LH.",
  },
  METAL_GLASS: {
    id: "METAL_GLASS",
    name: "Logam, Kaleng & Botol Kaca",
    badgeLabel: "Logam & Kaca",
    accentColor: "#64748b",
    bgLight: "bg-slate-100",
    bgDark: "dark:bg-slate-800/80",
    borderLight: "border-slate-300",
    borderDark: "dark:border-slate-700",
    textLight: "text-slate-800",
    textDark: "dark:text-slate-200",
    prepHeadline: "Prosedur Penanganan Aman Kaleng Minuman & Pecah Belah Kaca",
    prepSteps: [
      {
        title: "Keluarkan Seluruh Isi & Bilas Bersih",
        description: "Bilas sisa saus kaleng, minyak sarden, atau minuman manis agar tidak mengundang semut dan lalat.",
        icon: Droplets,
      },
      {
        title: "Injak Kaleng Alumunium Hingga Gepeng",
        description: "Kaleng minuman ringan berbahan aluminium murni sangat bernilai tinggi; pipihkan agar hemat tempat.",
        icon: Layers,
      },
      {
        title: "Bungkus Khusus Bila Terdapat Beling Pecah",
        description: "Bila botol kaca pecah, bungkus rapat dengan koran bekas & beri tulisan 'AWAS KACA PECAH' demi keselamatan petugas.",
        icon: AlertTriangle,
      },
      {
        title: "Lepaskan Tutup Kaleng yang Tajam",
        description: "Tekuk tutup kaleng ke arah dalam agar tidak melukai tangan pekerja pemilah.",
        icon: Scissors,
      },
    ],
    fatalMistakes: [
      "Membuang pecahan kaca terbuka langsung ke kantong plastik tipis (risiko cedera fatal kurir sampah).",
      "Mencampur kaleng cat pelapis tembok berbahan timbal dengan kaleng minuman konsumsi.",
      "Memasukkan kaca cermin atau keramik porselen (titik lebur berbeda dari botol kaca soda-lime).",
    ],
    cleanlinessStandard: "Bilas bersih, kering, tidak berkarat berat.",
    economicValueEstimate: "Rp 12.000 - Rp 15.000 / kg (Aluminium Kaleng Minuman)",
    recommendedStorage: "Ember kaleng terpisah atau kotak kontainer plastik tebal.",
    tps3rCompatibility: "Diterima di Bank Sampah Induk Jakarta Selatan.",
  },
  HAZARDOUS: {
    id: "HAZARDOUS",
    name: "B3 Rumah Tangga & Limbah Elektronik",
    badgeLabel: "B3 & Residu",
    accentColor: "#ef4444",
    bgLight: "bg-rose-50",
    bgDark: "dark:bg-rose-950/40",
    borderLight: "border-rose-200",
    borderDark: "dark:border-rose-800",
    textLight: "text-rose-700",
    textDark: "dark:text-rose-300",
    prepHeadline: "Protokol Isolasi Limbah B3 Rumah Tangga DKI Jakarta",
    prepSteps: [
      {
        title: "Tutup Kedua Kutub Baterai dengan Selotip",
        description: "Tempelkan isolasi bening pada kutub positif & negatif baterai lithium/alkalin untuk mencegah percikan korsleting.",
        icon: Layers,
      },
      {
        title: "Simpan dalam Wadah Kedap Anti-Korosi",
        description: "Gunakan toples kaca atau kotak plastik tebal tertutup khusus bertuliskan 'B3 RUMAH TANGGA'.",
        icon: ShieldCheck,
      },
      {
        title: "Jangan Pecahkan Lampu Neon / TL Tabung",
        description: "Lampu neon mengandung uap merkuri beracun; simpan utuh dalam kardus pembungkus aslinya.",
        icon: AlertTriangle,
      },
      {
        title: "Jangan Buang Obat Kedaluwarsa ke Kloset",
        description: "Hancurkan tablet, campur dengan tanah/kopi bekas, dan kemas tertutup agar tidak mencemari air tanah.",
        icon: Droplets,
      },
    ],
    fatalMistakes: [
      "Mencampur baterai bekas ke dalam kantong sampah organik atau membakarnya di pekarangan (dapat meledak).",
      "Menuang minyak jelantah sisa gorengan ke selokan got (menyebabkan penyumbatan lemak & pencemaran sungai).",
      "Membuang botol aerosol obat nyamuk yang belum benar-benar kosong ke tempat penampungan umum.",
    ],
    cleanlinessStandard: "Tersegel utuh, tidak bocor, tersimpan di tempat kering sejuk jauh dari jangkauan anak.",
    economicValueEstimate: "Pencegahan pencemaran air tanah + poin kepatuhan lingkungan.",
    recommendedStorage: "Wadah plastik tebal tertutup berlabel merah 'LIMBAH B3'.",
    tps3rCompatibility: "Wajib disalurkan ke Drop-box B3 Resmi Sudin Lingkungan Hidup DKI.",
  },
};

// Map scanner category string to internal helper category key
export function mapCategoryToHelperKey(categoryString: string): HelperWasteCategory {
  const c = (categoryString || "").toLowerCase();
  if (c.includes("organik") || c.includes("makanan") || c.includes("sayur") || c.includes("buah")) {
    return "ORGANIC";
  }
  if (c.includes("kertas") || c.includes("karton") || c.includes("kardus") || c.includes("buku")) {
    return "PAPER";
  }
  if (c.includes("logam") || c.includes("kaca") || c.includes("kaleng") || c.includes("botol kaca") || c.includes("besi")) {
    return "METAL_GLASS";
  }
  if (c.includes("b3") || c.includes("residu") || c.includes("baterai") || c.includes("elektronik") || c.includes("lampu")) {
    return "HAZARDOUS";
  }
  return "PLASTIC";
}

interface QuickSortHelperWidgetProps {
  currentCategory: string;
  currentItemName?: string;
  isDarkMode: boolean;
  onApplyTipsToInstructions?: (tips: string[]) => void;
}

export const QuickSortHelperWidget: React.FC<QuickSortHelperWidgetProps> = ({
  currentCategory,
  currentItemName,
  isDarkMode,
  onApplyTipsToInstructions,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<HelperWasteCategory>("PLASTIC");
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [appliedNotification, setAppliedNotification] = useState<boolean>(false);

  // Automatically sync with the currently scanned item category
  useEffect(() => {
    const mapped = mapCategoryToHelperKey(currentCategory);
    setSelectedCategoryKey(mapped);
  }, [currentCategory]);

  const currentTips = useMemo(() => {
    return CATEGORY_TIPS_DATABASE[selectedCategoryKey] || CATEGORY_TIPS_DATABASE.PLASTIC;
  }, [selectedCategoryKey]);

  const isCurrentScannedCategory = useMemo(() => {
    return mapCategoryToHelperKey(currentCategory) === selectedCategoryKey;
  }, [currentCategory, selectedCategoryKey]);

  const toggleCheck = (stepIdx: number) => {
    const key = `${selectedCategoryKey}-${stepIdx}`;
    setCheckedSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleApplyTips = () => {
    if (onApplyTipsToInstructions) {
      const tipStrings = currentTips.prepSteps.map((s) => `${s.title}: ${s.description}`);
      onApplyTipsToInstructions(tipStrings);
    }
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 3000);
  };

  const completedCount = useMemo(() => {
    return currentTips.prepSteps.filter((_, idx) => checkedSteps[`${selectedCategoryKey}-${idx}`]).length;
  }, [currentTips, checkedSteps, selectedCategoryKey]);

  const cardBase = isDarkMode
    ? "bg-slate-900/95 border-slate-700/80 text-slate-100 backdrop-blur-md shadow-2xl"
    : "bg-white/95 border-slate-200/90 text-slate-900 backdrop-blur-md shadow-2xl";

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-[calc(100vw-2rem)] sm:max-w-md">
      {/* 1. COLLAPSED FLOATING TRIGGER PILL */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border ${
            isDarkMode
              ? "bg-slate-900/90 hover:bg-slate-800 border-teal-500/40 text-slate-100 shadow-teal-950/40"
              : "bg-white/95 hover:bg-slate-50 border-teal-500/30 text-slate-900 shadow-teal-500/10"
          }`}
          title="Buka Quick Sort Helper untuk panduan pemilahan cepat"
        >
          {/* Animated Icon with Glow */}
          <div className="relative">
            <div className="p-2 rounded-xl bg-teal-500 text-white shadow-md shadow-teal-500/30">
              <Lightbulb className="w-4 h-4" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500" />
            </span>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight">Quick Sort Helper</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                {currentTips.badgeLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[190px]">
              {currentItemName ? `Tips daur ulang ${currentItemName}` : "Tips pemilahan kategori ini"}
            </p>
          </div>

          <ChevronUp className="w-4 h-4 text-slate-400 ml-1" />
        </button>
      )}

      {/* 2. EXPANDED CONTEXT-SENSITIVE FLOATING HELPER PANEL */}
      {isOpen && (
        <div
          className={`rounded-2xl border ${cardBase} w-[92vw] sm:w-[420px] max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/70 dark:bg-slate-950/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500 text-white shadow-xs">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                  <span>Quick Sort Helper</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                    Live Tips
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Panduan persiapan pemilahan agar lolos standar daur ulang
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Tutup Widget"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Banner: Shows current scan detection & category switcher */}
          <div className="p-3 bg-teal-500/5 dark:bg-teal-950/30 border-b border-teal-500/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-500" />
                <span>Konteks Hasil Scan:</span>
                <span className="font-bold text-teal-700 dark:text-teal-300 truncate max-w-[150px]">
                  {currentCategory}
                </span>
              </span>
              {isCurrentScannedCategory && (
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Sesuai Scan
                </span>
              )}
            </div>

            {/* Category Quick Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {(Object.keys(CATEGORY_TIPS_DATABASE) as HelperWasteCategory[]).map((catKey) => {
                const item = CATEGORY_TIPS_DATABASE[catKey];
                const isSelected = selectedCategoryKey === catKey;
                const isCurrent = mapCategoryToHelperKey(currentCategory) === catKey;

                return (
                  <button
                    key={catKey}
                    onClick={() => setSelectedCategoryKey(catKey)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap text-[11px] transition cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? "bg-teal-600 text-white shadow-xs font-semibold"
                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{item.badgeLabel}</span>
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
            {/* Headline for active category */}
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTips.accentColor }} />
                {currentTips.prepHeadline}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Selesaikan 4 langkah berikut agar sampah siap disetor ke fasilitas sirkular:
              </p>
            </div>

            {/* Preparation Steps Interactive Checklist */}
            <div className="space-y-2">
              {currentTips.prepSteps.map((step, idx) => {
                const isChecked = Boolean(checkedSteps[`${selectedCategoryKey}-${idx}`]);
                const StepIcon = step.icon;

                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                      isChecked
                        ? "bg-emerald-500/10 border-emerald-500/40 text-slate-900 dark:text-white"
                        : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-emerald-600 text-white"
                          : "border border-slate-300 dark:border-slate-600 text-transparent"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>

                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5">
                        <StepIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span className={`font-semibold text-xs ${isChecked ? "line-through opacity-80" : ""}`}>
                          {step.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checklist Progress Indicator */}
            <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                Progres Kesiapan Sampah:
              </span>
              <span className="font-bold text-teal-700 dark:text-teal-300">
                {completedCount} dari {currentTips.prepSteps.length} Selesai
              </span>
            </div>

            {/* Fatal Contamination Mistakes Warning */}
            <div className="p-3 rounded-xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300 font-bold text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Hindari Kesalahan Fatal Ini (Penyebab Ditolak):</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 pl-4 list-disc">
                {currentTips.fatalMistakes.map((mistake, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Acceptance Specs: Cleanliness, Price, and Destination */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block">Standar Kebersihan</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 block leading-tight">
                  {currentTips.cleanlinessStandard}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block">Estimasi Nilai Sirkular</span>
                <span className="font-medium text-teal-600 dark:text-teal-400 font-semibold block leading-tight">
                  {currentTips.economicValueEstimate}
                </span>
              </div>
            </div>

            {/* Destination & Wadah Simpan */}
            <div className="p-2.5 rounded-xl bg-teal-500/5 border border-teal-500/20 text-[11px] space-y-1 text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1 font-semibold text-teal-800 dark:text-teal-200">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Rekomendasi Wadah Simpan:</span>
              </div>
              <p>{currentTips.recommendedStorage}</p>
              <p className="text-[10px] text-slate-400 pt-0.5">{currentTips.tps3rCompatibility}</p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                // Reset checks for active category
                const updated = { ...checkedSteps };
                currentTips.prepSteps.forEach((_, idx) => {
                  delete updated[`${selectedCategoryKey}-${idx}`];
                });
                setCheckedSteps(updated);
              }}
              className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium cursor-pointer transition"
            >
              Reset Checklist
            </button>

            <button
              onClick={handleApplyTips}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{appliedNotification ? "Tips Diterapkan!" : "Terapkan ke Panduan"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
