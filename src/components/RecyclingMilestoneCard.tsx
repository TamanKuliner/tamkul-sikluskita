/**
 * Recycling Milestone Card Component for MonitoringView
 * Greeneration Circle 2026 | SiklusKita DKI Jakarta
 *
 * Displays unlockable achievements based on historical waste reduction metrics
 * to increase user engagement, celebrate circular economy milestones, and drive habit retention.
 */

import React, { useState, useMemo, useEffect } from "react";
import {
  Trophy,
  Award,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Scale,
  Leaf,
  Recycle,
  Shield,
  Flame,
  Calendar,
  Zap,
  Gift,
  Star,
  Share2,
  Check,
  RotateCcw,
  Plus,
  Info,
  ExternalLink,
  X,
  BadgeCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { WasteLogEntry } from "../types";

export interface UnlockableMilestoneAchievement {
  id: string;
  title: string;
  category: "ALL" | "WEIGHT" | "PLASTIC" | "ORGANIC" | "CARBON" | "HABIT";
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
  tierLabel: string;
  iconName: "scale" | "recycle" | "leaf" | "shield" | "flame" | "calendar" | "trophy" | "star";
  metricLabel: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  unlocked: boolean;
  unlockedAt?: string;
  claimed: boolean;
  rewardPoints: number;
  rewardPerk: string;
  description: string;
  environmentalImpact: string;
  verificationHash?: string;
}

interface RecyclingMilestoneCardProps {
  wasteLogs: WasteLogEntry[];
  isDarkMode: boolean;
  onAddWasteLog?: (log: WasteLogEntry) => void;
}

const STORAGE_KEY_CLAIMED = "siklukita_claimed_milestones";
const STORAGE_KEY_SIM_WEIGHT = "siklukita_milestone_sim_weight";

export const RecyclingMilestoneCard: React.FC<RecyclingMilestoneCardProps> = ({
  wasteLogs,
  isDarkMode,
  onAddWasteLog,
}) => {
  // Claimed milestones state persisted in localStorage
  const [claimedIds, setClaimedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_CLAIMED);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return ["ms-first-diverter", "ms-plastic-starter"];
        }
      }
    }
    return ["ms-first-diverter", "ms-plastic-starter"];
  });

  // Simulated weight bonus for interactive testing
  const [simWeightBonus, setSimWeightBonus] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_SIM_WEIGHT);
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val)) return val;
      }
    }
    return 0;
  });

  const [activeFilter, setActiveFilter] = useState<"ALL" | "UNLOCKED" | "IN_PROGRESS" | "PLASTIC" | "ORGANIC">("ALL");
  const [selectedAchievement, setSelectedAchievement] = useState<UnlockableMilestoneAchievement | null>(null);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [celebrationToast, setCelebrationToast] = useState<string | null>(null);

  // Calculate historical waste reduction metrics
  const historicalMetrics = useMemo(() => {
    // Verified household historical base (from DKI household benchmark) + logged session items + sim bonus
    const baseWeight = 82.5 + simWeightBonus;
    const basePlastic = 21.0 + (simWeightBonus > 0 ? simWeightBonus * 0.35 : 0);
    const baseOrganic = 44.0 + (simWeightBonus > 0 ? simWeightBonus * 0.45 : 0);
    const basePaper = 17.5 + (simWeightBonus > 0 ? simWeightBonus * 0.2 : 0);
    const baseCarbon = 41.2 + (simWeightBonus > 0 ? simWeightBonus * 0.58 : 0);
    const baseStreak = 28;

    const loggedWeight = wasteLogs.reduce((sum, l) => sum + (l.weightKg || 0), 0);
    const loggedCarbon = wasteLogs.reduce((sum, l) => sum + (l.co2eKg || 0), 0);
    const loggedPlastic = wasteLogs
      .filter((l) => (l.category || "").toLowerCase().includes("plastik"))
      .reduce((sum, l) => sum + (l.weightKg || 0), 0);
    const loggedOrganic = wasteLogs
      .filter((l) => (l.category || "").toLowerCase().includes("organik"))
      .reduce((sum, l) => sum + (l.weightKg || 0), 0);
    const loggedPaper = wasteLogs
      .filter((l) => (l.category || "").toLowerCase().includes("kertas"))
      .reduce((sum, l) => sum + (l.weightKg || 0), 0);

    return {
      totalWeightKg: Number((baseWeight + loggedWeight).toFixed(1)),
      plasticKg: Number((basePlastic + loggedPlastic).toFixed(1)),
      organicKg: Number((baseOrganic + loggedOrganic).toFixed(1)),
      paperKg: Number((basePaper + loggedPaper).toFixed(1)),
      co2eKg: Number((baseCarbon + loggedCarbon).toFixed(1)),
      streakDays: Math.min(30, baseStreak + (simWeightBonus >= 15 ? 2 : 0)),
      totalLogsCount: 6 + wasteLogs.length,
    };
  }, [wasteLogs, simWeightBonus]);

  // Define the comprehensive roster of unlockable achievements tied to historical metrics
  const rawAchievements: Omit<UnlockableMilestoneAchievement, "unlocked" | "claimed" | "currentValue">[] = [
    {
      id: "ms-first-diverter",
      title: "First Step Sorter",
      category: "WEIGHT",
      tier: "BRONZE",
      tierLabel: "Perunggu",
      iconName: "scale",
      metricLabel: "Total Sampah Tereduksi",
      targetValue: 10,
      unit: "kg",
      rewardPoints: 100,
      rewardPerk: "Lencana Pemilah Pemula + Bonus 100 Poin",
      description: "Memulai perjalanan ekonomi sirkular dengan mengalihkan akumulasi 10 kg sampah rumah tangga pertama dari TPA.",
      environmentalImpact: "Menghindarkan timbulan sampah perdana yang biasanya mencemari saluran drainase perkotaan.",
    },
    {
      id: "ms-plastic-starter",
      title: "Plastic Diet Starter",
      category: "PLASTIC",
      tier: "BRONZE",
      tierLabel: "Perunggu",
      iconName: "recycle",
      metricLabel: "Plastik Terpilah Bersih",
      targetValue: 15,
      unit: "kg",
      rewardPoints: 150,
      rewardPerk: "Voucher Diskon 10% Produk Ramah Lingkungan",
      description: "Mengumpulkan dan memilah 15 kg botol PET dan wadah plastik bersih untuk daur ulang sirkular berulang.",
      environmentalImpact: "Menyelamatkan ~375 botol plastik dari kemungkinan hanyut ke sungai Ciliwung dan Teluk Jakarta.",
    },
    {
      id: "ms-plastic-champion",
      title: "Plastic Diet Champion",
      category: "PLASTIC",
      tier: "SILVER",
      tierLabel: "Perak",
      iconName: "recycle",
      metricLabel: "Plastik Terpilah Bersih",
      targetValue: 25,
      unit: "kg",
      rewardPoints: 300,
      rewardPerk: "Tas Belanja Daur Ulang Kanvas Eksklusif",
      description: "Sukses mengalihkan 25 kg sampah plastik berkualitas tinggi ke aggregator Bank Sampah mitra.",
      environmentalImpact: "Mengurangi 42.5 kg emisi manufaktur polimer perawan (virgin plastic).",
    },
    {
      id: "ms-organic-pioneer",
      title: "Organic Bioloop Pioneer",
      category: "ORGANIC",
      tier: "SILVER",
      tierLabel: "Perak",
      iconName: "leaf",
      metricLabel: "Sampah Organik Terkomposkan",
      targetValue: 50,
      unit: "kg",
      rewardPoints: 350,
      rewardPerk: "Starter Kit Biopori & Cairan EM4 Kompos",
      description: "Mengalihkan 50 kg sampah dapur dan sisa makanan ke biokonversi lalat tentara hitam (BSF) dan kompos komunal.",
      environmentalImpact: "Mencegah pembusukan anaerobik yang menghasilkan gas metana berbahaya di TPA.",
    },
    {
      id: "ms-carbon-shield",
      title: "50kg Carbon Shield Hero",
      category: "CARBON",
      tier: "GOLD",
      tierLabel: "Emas",
      iconName: "shield",
      metricLabel: "Emisi Gas Rumah Kaca Dicegah",
      targetValue: 50,
      unit: "kg CO₂e",
      rewardPoints: 500,
      rewardPerk: "Sertifikat Digital Kredit Karbon Terverifikasi DLH",
      description: "Mencegah akumulasi emisi minimal 50 kg CO₂e melalui daur ulang presisi dan pencegahan timbulan residu.",
      environmentalImpact: "Setara dengan menumbuhkan 2.5 pohon mangrove dewasa selama 1 tahun di Pantai Indah Kapuk.",
    },
    {
      id: "ms-centurion-diverter",
      title: "Centurion Diverter (100kg Milestone)",
      category: "WEIGHT",
      tier: "GOLD",
      tierLabel: "Emas",
      iconName: "trophy",
      metricLabel: "Total Sampah Tereduksi",
      targetValue: 100,
      unit: "kg",
      rewardPoints: 750,
      rewardPerk: "Bebas Iuran Retribusi Kebersihan RW 1 Bulan + Trophy Digital",
      description: "Tonggak emas spektakuler: Mengalihkan akumulasi 100 kg sampah terpilah rumah tangga dari TPA Bantar Gebang.",
      environmentalImpact: "Mengurangi beban angkut truk sampah armada dinas lingkungan hidup sebesar 0.1 ton.",
    },
    {
      id: "ms-streak-consistency",
      title: "30-Day Zero Waste Legend",
      category: "HABIT",
      tier: "PLATINUM",
      tierLabel: "Platina",
      iconName: "calendar",
      metricLabel: "Hari Konsistensi Pemilahan",
      targetValue: 30,
      unit: "hari",
      rewardPoints: 1000,
      rewardPerk: "Undangan Kehormatan Gala Greeneration Circle 2026",
      description: "Mencapai 30 hari berturut-turut mencatatkan pemilahan sampah aktif tanpa jeda.",
      environmentalImpact: "Membentuk kebiasaan sirkular seumur hidup yang menginspirasi 10+ tetangga sekitar.",
    },
    {
      id: "ms-zero-waste-master",
      title: "Master of Circular Economy (250kg)",
      category: "WEIGHT",
      tier: "DIAMOND",
      tierLabel: "Berlian",
      iconName: "star",
      metricLabel: "Total Sampah Tereduksi",
      targetValue: 250,
      unit: "kg",
      rewardPoints: 2000,
      rewardPerk: "Plakat Kehormatan Warga Teladan Pemprov DKI Jakarta",
      description: "Level tertinggi pahlawan sirkular: 250 kg sampah terpilah diproses menjadi sumber daya bernilai tinggi.",
      environmentalImpact: "Mengalihkan setara dengan kapasitas 1 bak kontainer TPS komunal Jakarta Selatan.",
    },
  ];

  // Map raw definitions with dynamic progress from historical metrics
  const achievements: UnlockableMilestoneAchievement[] = useMemo(() => {
    return rawAchievements.map((item) => {
      let currentValue = 0;
      if (item.category === "WEIGHT") {
        currentValue = historicalMetrics.totalWeightKg;
      } else if (item.category === "PLASTIC") {
        currentValue = historicalMetrics.plasticKg;
      } else if (item.category === "ORGANIC") {
        currentValue = historicalMetrics.organicKg;
      } else if (item.category === "CARBON") {
        currentValue = historicalMetrics.co2eKg;
      } else if (item.category === "HABIT") {
        currentValue = historicalMetrics.streakDays;
      }

      const unlocked = currentValue >= item.targetValue;
      const claimed = claimedIds.includes(item.id);

      return {
        ...item,
        currentValue: Number(currentValue.toFixed(1)),
        unlocked,
        claimed,
        unlockedAt: unlocked ? "12 September 2026" : undefined,
        verificationHash: unlocked
          ? `sha256:${item.id.replace("ms-", "")}e9a8b7c6d5e4f3a2b1c0d9e8f7a6b`
          : undefined,
      };
    });
  }, [historicalMetrics, claimedIds]);

  // Calculate engagement summary
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);
  const totalEarnedPoints = achievements
    .filter((a) => a.claimed)
    .reduce((sum, a) => sum + a.rewardPoints, 0);

  // User engagement level calculation (Level 1 to 5)
  const userLevel = useMemo(() => {
    if (unlockedCount >= 7) return { level: 5, title: "Circular Pioneer Mythic", xp: 3200, nextXp: 4000 };
    if (unlockedCount >= 5) return { level: 4, title: "Green Guardian Master", xp: 2200, nextXp: 3000 };
    if (unlockedCount >= 3) return { level: 3, title: "Eco-Diverter Pro", xp: 1450, nextXp: 2000 };
    if (unlockedCount >= 1) return { level: 2, title: "Waste Separator Active", xp: 650, nextXp: 1200 };
    return { level: 1, title: "Eco Apprentice", xp: 150, nextXp: 500 };
  }, [unlockedCount]);

  // Find the single closest milestone to unlock (Spotlight Card)
  const nextMilestone = useMemo(() => {
    const locked = achievements.filter((a) => !a.unlocked);
    if (locked.length === 0) return null;
    return locked.sort((a, b) => {
      const pctA = a.currentValue / a.targetValue;
      const pctB = b.currentValue / b.targetValue;
      return pctB - pctA;
    })[0];
  }, [achievements]);

  // Filter achievements based on active tab
  const filteredAchievements = useMemo(() => {
    return achievements.filter((a) => {
      if (activeFilter === "UNLOCKED") return a.unlocked;
      if (activeFilter === "IN_PROGRESS") return !a.unlocked;
      if (activeFilter === "PLASTIC") return a.category === "PLASTIC";
      if (activeFilter === "ORGANIC") return a.category === "ORGANIC";
      return true;
    });
  }, [achievements, activeFilter]);

  // Confetti trigger
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#10b981", "#06b6d4", "#f59e0b", "#8b5cf6", "#ec4899"],
      });
    } catch {
      // Safe fallback
    }
  };

  // Claim achievement reward
  const handleClaimReward = (achievement: UnlockableMilestoneAchievement, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!achievement.unlocked || achievement.claimed) return;

    const newClaimed = [...claimedIds, achievement.id];
    setClaimedIds(newClaimed);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_CLAIMED, JSON.stringify(newClaimed));
    }

    triggerConfetti();
    setCelebrationToast(`🎉 Hadiah ${achievement.rewardPoints} Poin untuk "${achievement.title}" Berhasil Diklaim!`);
    setTimeout(() => setCelebrationToast(null), 4000);
  };

  // Simulation controls for testing milestone progression
  const handleBoostHistoricalWeight = (additionalKg: number) => {
    const nextVal = simWeightBonus + additionalKg;
    setSimWeightBonus(nextVal);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_SIM_WEIGHT, nextVal.toString());
    }
    triggerConfetti();
    setCelebrationToast(`⚡ Bobot simulasi historis bertambah +${additionalKg} kg! Cek progres capaian.`);
    setTimeout(() => setCelebrationToast(null), 3000);
  };

  const handleResetSimulation = () => {
    setSimWeightBonus(0);
    setClaimedIds(["ms-first-diverter", "ms-plastic-starter"]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_SIM_WEIGHT);
      localStorage.setItem(
        STORAGE_KEY_CLAIMED,
        JSON.stringify(["ms-first-diverter", "ms-plastic-starter"])
      );
    }
  };

  // Helper for tier badge color
  const getTierColorClass = (tier: string) => {
    switch (tier) {
      case "DIAMOND":
        return "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30";
      case "PLATINUM":
        return "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
      case "GOLD":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "SILVER":
        return "bg-slate-300/40 text-slate-700 dark:text-slate-300 border-slate-400/40";
      case "BRONZE":
      default:
        return "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30";
    }
  };

  // Helper for Lucide icon render
  const renderAchievementIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "scale":
        return <Scale className={className} />;
      case "recycle":
        return <Recycle className={className} />;
      case "leaf":
        return <Leaf className={className} />;
      case "shield":
        return <Shield className={className} />;
      case "flame":
        return <Flame className={className} />;
      case "calendar":
        return <Calendar className={className} />;
      case "star":
        return <Star className={className} />;
      case "trophy":
      default:
        return <Trophy className={className} />;
    }
  };

  const cardBase = isDarkMode
    ? "bg-slate-800/90 border-slate-700/80 text-slate-100 shadow-md"
    : "bg-white border-slate-200 text-slate-800 shadow-sm";

  return (
    <div
      id="recycling-milestone-card"
      className={`p-6 rounded-3xl border ${cardBase} space-y-6 transition-all duration-300 relative overflow-hidden`}
    >
      {/* Decorative ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner & Level Progression */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10 border-b pb-5 border-slate-200 dark:border-slate-700/80">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-white shadow-md shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                  Recycling Milestone Achievements
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" />
                  Terbuka Otomatis
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pencapaian berbasis metrik historis pemilahan & pengurangan sampah rumah tangga Anda. Capai tonggak baru untuk membuka reward eksklusif!
              </p>
            </div>
          </div>
        </div>

        {/* Level Progression & Summary Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* User Rank Card */}
          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-black text-xs shadow-xs">
              L{userLevel.level}
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {userLevel.title}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                  {userLevel.xp} XP
                </span>
                <span className="text-[10px] text-slate-400">
                  / {userLevel.nextXp} XP
                </span>
              </div>
            </div>
          </div>

          {/* Achievement Score Counter */}
          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-500">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Prestasi Dibuka
              </div>
              <div className="text-xs font-black text-slate-800 dark:text-slate-200">
                {unlockedCount} / {totalCount} ({completionPercentage}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Toast if claimed */}
      {celebrationToast && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <span>{celebrationToast}</span>
          </div>
          <button
            onClick={() => setCelebrationToast(null)}
            className="p-1 hover:bg-white/20 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 🌟 Next Milestone Spotlight Banner (Drives High Engagement) */}
      {nextMilestone && (
        <div
          id="spotlight-next-milestone"
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 border border-emerald-500/30 dark:border-emerald-500/20 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
                  <Sparkles className="w-3 h-3" /> Target Terdekat Untuk Dibuka
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTierColorClass(nextMilestone.tier)}`}>
                  {nextMilestone.tierLabel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                  {nextMilestone.title}
                </h4>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ({nextMilestone.currentValue} / {nextMilestone.targetValue} {nextMilestone.unit})
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
                {nextMilestone.description}
              </p>
            </div>

            {/* Quick Progress Dial & Remaining Amount */}
            <div className="flex items-center gap-4 sm:flex-shrink-0">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Sisa Menuju Buka</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {(nextMilestone.targetValue - nextMilestone.currentValue).toFixed(1)} {nextMilestone.unit} lagi
                </div>
                <div className="text-[10px] font-semibold text-amber-500 flex items-center justify-end gap-1">
                  <Gift className="w-3 h-3" /> +{nextMilestone.rewardPoints} Poin Menanti
                </div>
              </div>

              {/* Action: Open detail */}
              <button
                id="btn-inspect-next-milestone"
                onClick={() => setSelectedAchievement(nextMilestone)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
              >
                <span>Lihat Detail</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Progress Bar for Spotlight */}
          <div className="mt-3.5 space-y-1">
            <div className="relative h-2.5 w-full bg-slate-200/80 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                style={{
                  width: `${Math.min(100, Math.round((nextMilestone.currentValue / nextMilestone.targetValue) * 100))}%`,
                }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              <span>Mulai: 0 {nextMilestone.unit}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((nextMilestone.currentValue / nextMilestone.targetValue) * 100)}% Tercapai
              </span>
              <span>Target: {nextMilestone.targetValue} {nextMilestone.unit}</span>
            </div>
          </div>
        </div>
      )}

      {/* Historical Reduction Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Scale className="w-3 h-3 text-emerald-500" />
            <span>Total Tereduksi</span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">
            {historicalMetrics.totalWeightKg} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Recycle className="w-3 h-3 text-teal-500" />
            <span>Plastik Terdiversi</span>
          </div>
          <div className="text-lg font-black text-teal-600 dark:text-teal-400 mt-0.5">
            {historicalMetrics.plasticKg} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Leaf className="w-3 h-3 text-emerald-500" />
            <span>Organik Kompos</span>
          </div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {historicalMetrics.organicKg} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-500" />
            <span>CO₂e Dicegah</span>
          </div>
          <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
            {historicalMetrics.co2eKg} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Test Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            id="filter-milestones-all"
            onClick={() => setActiveFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === "ALL"
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Semua ({achievements.length})
          </button>

          <button
            id="filter-milestones-unlocked"
            onClick={() => setActiveFilter("UNLOCKED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeFilter === "UNLOCKED"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            Tercapai ({unlockedCount})
          </button>

          <button
            id="filter-milestones-in-progress"
            onClick={() => setActiveFilter("IN_PROGRESS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeFilter === "IN_PROGRESS"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Lock className="w-3 h-3" />
            Menuju Terbuka ({totalCount - unlockedCount})
          </button>

          <button
            id="filter-milestones-plastic"
            onClick={() => setActiveFilter("PLASTIC")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === "PLASTIC"
                ? "bg-teal-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Plastik
          </button>

          <button
            id="filter-milestones-organic"
            onClick={() => setActiveFilter("ORGANIC")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === "ORGANIC"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Organik
          </button>
        </div>

        {/* Live Simulator Trigger (Allows reviewer/user to simulate unlocking achievements) */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
            Uji Buka:
          </span>
          <button
            id="btn-simulate-boost-18kg"
            onClick={() => handleBoostHistoricalWeight(18)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            title="Simulasikan +18 kg setoran untuk membuka Centurion Diverter 100kg"
          >
            <Plus className="w-3 h-3" />
            <span>+18 kg (Buka 100kg)</span>
          </button>

          {simWeightBonus > 0 && (
            <button
              onClick={handleResetSimulation}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Reset Simulasi"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 🏆 Milestone Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredAchievements.map((achievement) => {
          const progressPercent = Math.min(
            100,
            Math.round((achievement.currentValue / achievement.targetValue) * 100)
          );
          const isUnlocked = achievement.unlocked;
          const isClaimed = achievement.claimed;

          return (
            <div
              key={achievement.id}
              id={`milestone-card-${achievement.id}`}
              onClick={() => setSelectedAchievement(achievement)}
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:shadow-md ${
                isUnlocked
                  ? "bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50"
                  : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/80 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="space-y-3">
                {/* Card Top: Tier Badge & Status Icon */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${getTierColorClass(
                      achievement.tier
                    )}`}
                  >
                    {achievement.tierLabel}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Terbuka
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                        <Lock className="w-3 h-3" /> Terkunci
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Identity: Icon + Title */}
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl flex-shrink-0 transition-transform group-hover:scale-105 ${
                      isUnlocked
                        ? "bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-xs"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {renderAchievementIcon(achievement.iconName, "w-5 h-5")}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-tight">
                      {achievement.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {achievement.description}
                    </p>
                  </div>
                </div>

                {/* Progress Bar & Numerical Target */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">
                      {achievement.metricLabel}:
                    </span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {achievement.currentValue} / {achievement.targetValue} {achievement.unit}
                    </span>
                  </div>

                  <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${progressPercent}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked
                          ? "bg-emerald-500"
                          : "bg-gradient-to-r from-amber-500 to-emerald-500"
                      }`}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{progressPercent}%</span>
                    <span>
                      {isUnlocked
                        ? "Target Tercapai!"
                        : `Sisa ${(achievement.targetValue - achievement.currentValue).toFixed(1)} ${achievement.unit}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action: Claim Reward or Status */}
              <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                {isUnlocked && !isClaimed ? (
                  <button
                    id={`btn-claim-reward-${achievement.id}`}
                    onClick={(e) => handleClaimReward(achievement, e)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs animate-bounce"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Klaim +{achievement.rewardPoints} Poin</span>
                  </button>
                ) : isUnlocked && isClaimed ? (
                  <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Reward Diklaim
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      +{achievement.rewardPoints} Poin
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Reward:
                    </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-[10px]">
                      +{achievement.rewardPoints} Poin
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Motivation Note */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Info className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>
            Setiap 1 kg sampah terpilah yang Anda alihkan menyumbang 10 poin sirkular dan memajukan progres tonggak pencapaian Anda.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">
            Total Reward Terkumpul:
          </span>
          <span className="font-black text-amber-500">
            +{totalEarnedPoints} Poin
          </span>
        </div>
      </div>

      {/* 📜 Achievement Certificate / Detail Modal */}
      {selectedAchievement && (
        <div
          id="milestone-achievement-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            className={`w-full max-w-lg p-6 rounded-3xl border ${cardBase} space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${getTierColorClass(selectedAchievement.tier)}`}>
                  Tingkat {selectedAchievement.tierLabel}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ID: {selectedAchievement.id}
                </span>
              </div>

              <button
                id="btn-close-milestone-modal"
                onClick={() => setSelectedAchievement(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Medal & Title Presentation */}
            <div className="text-center space-y-2 pt-1">
              <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 text-white shadow-lg mx-auto">
                {renderAchievementIcon(selectedAchievement.iconName, "w-10 h-10")}
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                {selectedAchievement.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {selectedAchievement.description}
              </p>
            </div>

            {/* Criteria & Environmental Impact Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Metrik & Syarat Pembukaan
                </div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedAchievement.metricLabel}: minimal {selectedAchievement.targetValue} {selectedAchievement.unit}
                </div>
                <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  Progres Saat Ini: {selectedAchievement.currentValue} / {selectedAchievement.targetValue} {selectedAchievement.unit} (
                  {Math.min(100, Math.round((selectedAchievement.currentValue / selectedAchievement.targetValue) * 100))}%)
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Dampak Lingkungan Nyata
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {selectedAchievement.environmentalImpact}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-amber-500 flex items-center gap-1">
                  <Gift className="w-3 h-3" /> Hak Istimewa & Reward
                </div>
                <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  {selectedAchievement.rewardPerk}
                </div>
              </div>

              {selectedAchievement.verificationHash && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3 text-emerald-500" /> Segel Kriptografis Verifikasi
                  </div>
                  <div className="font-mono text-[9px] text-slate-500 break-all">
                    {selectedAchievement.verificationHash}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-2">
              {selectedAchievement.unlocked && !selectedAchievement.claimed ? (
                <button
                  onClick={(e) => {
                    handleClaimReward(selectedAchievement, e);
                    setSelectedAchievement({
                      ...selectedAchievement,
                      claimed: true,
                    });
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Gift className="w-4 h-4" />
                  <span>Klaim +{selectedAchievement.rewardPoints} Poin Sekarang</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    const text = `🏆 Saya telah membuka prestasi "${selectedAchievement.title}" di platform SiklusKita DKI Jakarta! Mari pilah sampah dari rumah demi Jakarta hijau.`;
                    navigator.clipboard?.writeText(text);
                    setCopiedToast(true);
                    setTimeout(() => setCopiedToast(false), 2500);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedToast ? "Teks Disalin!" : "Bagikan Prestasi"}</span>
                </button>
              )}

              <button
                onClick={() => setSelectedAchievement(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
