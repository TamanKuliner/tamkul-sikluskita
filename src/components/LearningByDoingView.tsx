/**
 * SiklusKita - 10 Tutorial Learning by Doing Terpenting Cerdas Berdaya
 * Greeneration Circle 2026 | DKI Jakarta
 * Fahira Shanin Nadifa & Tim
 * 
 * Interactive Sandbox & Structured Actionable Curriculum
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Sparkles,
  Trophy,
  CheckCircle2,
  Layers,
  ShieldCheck,
  RefreshCw,
  Bell,
  Calendar,
  Cpu,
  Award,
  Globe2,
  ScanLine,
  ArrowRight,
  Check,
  Play,
  Search,
  RotateCcw,
  ExternalLink,
  Zap,
  Info,
  Sliders,
  Send,
  Eye,
  Droplets,
  Clock,
  Flame,
  Radio,
  Share2,
  FileBadge,
  Printer,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { LEARNING_TUTORIALS } from "../data/learningTutorialsData";
import { LearningTutorial, NavTab } from "../types";

interface LearningByDoingViewProps {
  isDarkMode: boolean;
  onNavigateTab: (tab: NavTab) => void;
  onAddLogSimulated?: (item: any) => void;
}

export const LearningByDoingView: React.FC<LearningByDoingViewProps> = ({
  isDarkMode,
  onNavigateTab,
}) => {
  // State for tutorial progress (persisted in localStorage)
  const [completedTutorialIds, setCompletedTutorialIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("siklukita_completed_tutorials");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return ["tut-01"];
        }
      }
    }
    return ["tut-01"];
  });

  const [activeTutorialId, setActiveTutorialId] = useState<string>("tut-01");
  const [activeTabMode, setActiveTabMode] = useState<"practice" | "curriculum">("practice");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Active tutorial object
  const activeTutorial = useMemo(() => {
    return (
      LEARNING_TUTORIALS.find((t) => t.id === activeTutorialId) ||
      LEARNING_TUTORIALS[0]
    );
  }, [activeTutorialId]);

  // Persist completed tutorials
  useEffect(() => {
    localStorage.setItem(
      "siklukita_completed_tutorials",
      JSON.stringify(completedTutorialIds)
    );
  }, [completedTutorialIds]);

  // Mark tutorial complete / toggle
  const toggleCompleteTutorial = (id: string) => {
    if (completedTutorialIds.includes(id)) {
      setCompletedTutorialIds((prev) => prev.filter((i) => i !== id));
    } else {
      setCompletedTutorialIds((prev) => [...prev, id]);
    }
  };

  // Reset all progress
  const handleResetProgress = () => {
    if (window.confirm("Apakah Anda yakin ingin mengatur ulang progres semua tutorial?")) {
      setCompletedTutorialIds([]);
    }
  };

  // Calculate XP and levels
  const totalXPEarned = useMemo(() => {
    return LEARNING_TUTORIALS.filter((t) =>
      completedTutorialIds.includes(t.id)
    ).reduce((sum, t) => sum + t.xpReward, 0);
  }, [completedTutorialIds]);

  const progressPercent = Math.round(
    (completedTutorialIds.length / LEARNING_TUTORIALS.length) * 100
  );

  const currentTier = useMemo(() => {
    if (completedTutorialIds.length === 10) return "Duta Sirkular Paripurna DKI";
    if (completedTutorialIds.length >= 7) return "Ahli Sirkular Madya";
    if (completedTutorialIds.length >= 4) return "Praktisi Sirkular Muda";
    if (completedTutorialIds.length >= 1) return "Pelopor Pemilah Pemula";
    return "Pendaftar Baru";
  }, [completedTutorialIds.length]);

  // Filtered tutorials list
  const filteredTutorials = useMemo(() => {
    return LEARNING_TUTORIALS.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRole =
        selectedRole === "all" || t.targetRole.includes(selectedRole);

      const matchCat =
        selectedCategory === "all" || t.category === selectedCategory;

      return matchSearch && matchRole && matchCat;
    });
  }, [searchQuery, selectedRole, selectedCategory]);

  // Styles
  const cardBg = isDarkMode
    ? "bg-slate-900/90 border-slate-800 text-slate-100"
    : "bg-white border-slate-200/90 text-slate-900";

  const cardInnerBg = isDarkMode
    ? "bg-slate-800/70 border-slate-700/70"
    : "bg-slate-50/90 border-slate-200/80";

  // Icon mapping helper
  const getTutorialIcon = (name: string) => {
    switch (name) {
      case "ScanLine":
        return <ScanLine className="w-4 h-4" />;
      case "Layers":
        return <Layers className="w-4 h-4" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4" />;
      case "RefreshCw":
        return <RefreshCw className="w-4 h-4" />;
      case "Bell":
        return <Bell className="w-4 h-4" />;
      case "Calendar":
        return <Calendar className="w-4 h-4" />;
      case "Cpu":
        return <Cpu className="w-4 h-4" />;
      case "Award":
        return <Award className="w-4 h-4" />;
      case "Globe2":
        return <Globe2 className="w-4 h-4" />;
      case "Trophy":
        return <Trophy className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 🚀 Hero Header: Learning By Doing Hub */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border relative overflow-hidden transition-all ${
          isDarkMode
            ? "bg-gradient-to-br from-emerald-950/70 via-slate-900 to-teal-950/50 border-emerald-900/60 shadow-xl"
            : "bg-gradient-to-br from-emerald-50 via-teal-50/40 to-cyan-50/50 border-emerald-200/80 shadow-md"
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Greeneration Circle 2026 • Kurikulum Interaktif
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                10 Modul Terpenting
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              10 Tutorial Learning by Doing: Cerdas &amp; Berdaya
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Kuasai seluruh ekosistem SiklusKita melalui praktek langsung
              (hands-on simulator): dari computer vision Gemini 3.8 Flash, sanitasi zero-contamination,
              kriptografi AES-256 E2EE, hingga mitigasi TPS3R dan valuasi ekonomi sirkular DKI Jakarta.
            </p>
          </div>

          {/* Progress & Badge Card */}
          <div className={`p-4 rounded-xl border flex-shrink-0 w-full lg:w-80 ${cardInnerBg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Progres Sertifikasi
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {completedTutorialIds.length} / 10 Selesai ({progressPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/70 dark:border-slate-700/70">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="font-semibold">{currentTier}</span>
              </div>
              <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                +{totalXPEarned} XP
              </div>
            </div>

            {/* Certificate Button */}
            {completedTutorialIds.length >= 7 && (
              <button
                onClick={() => setShowCertificateModal(true)}
                className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <FileBadge className="w-3.5 h-3.5" />
                <span>Lihat Sertifikat Digital ({completedTutorialIds.length}/10)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 🧭 Main Workspace Grid: Sidebar Navigator (Left) + Interactive Studio (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 10 Tutorial Master Catalog (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Filter & Search Bar */}
          <div className={`p-4 rounded-xl border space-y-3 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                Daftar 10 Modul
              </span>
              <button
                onClick={handleResetProgress}
                title="Reset semua progres tutorial"
                className="text-[11px] text-slate-400 hover:text-rose-500 transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari topik (PET, AES, B3, Kalender)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/80 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={() => setSelectedRole("all")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  selectedRole === "all"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                Semua Peran
              </button>
              <button
                onClick={() => setSelectedRole("Warga")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  selectedRole === "Warga"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                Warga
              </button>
              <button
                onClick={() => setSelectedRole("Operator")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  selectedRole === "Operator"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                Operator Bank Sampah
              </button>
              <button
                onClick={() => setSelectedRole("Koordinator")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  selectedRole === "Koordinator"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                Koordinator RW
              </button>
              <button
                onClick={() => setSelectedRole("Pengembang")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  selectedRole === "Pengembang"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                Developer
              </button>
            </div>
          </div>

          {/* Tutorial Cards Scroll List */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredTutorials.map((tut) => {
              const isSelected = tut.id === activeTutorialId;
              const isDone = completedTutorialIds.includes(tut.id);

              return (
                <div
                  key={tut.id}
                  onClick={() => setActiveTutorialId(tut.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20 " +
                        (isDarkMode ? "bg-emerald-950/30" : "bg-emerald-50/60")
                      : `${cardBg} hover:border-slate-300 dark:hover:border-slate-700`
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Order Number & Completion Badge */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompleteTutorial(tut.id);
                      }}
                      title={isDone ? "Klik untuk tandai belum selesai" : "Klik untuk tandai selesai"}
                      className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-xs transition cursor-pointer ${
                        isDone
                          ? "bg-emerald-500 text-white shadow-xs"
                          : isSelected
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-500/30"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:border-emerald-400"
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : tut.orderNumber}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 truncate">
                          {tut.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-2.5 h-2.5" />
                          {tut.estimatedMinutes}m
                        </span>
                      </div>

                      <h4
                        className={`text-xs font-bold leading-snug line-clamp-1 ${
                          isSelected
                            ? "text-emerald-800 dark:text-emerald-200"
                            : "text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {tut.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {tut.subtitle}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-800/50 text-[10px]">
                        <span className="text-slate-500">{tut.targetRole}</span>
                        <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                          +{tut.xpReward} XP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTutorials.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                Tidak ada tutorial yang cocok dengan kriteria pencarian.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Studio & Deep Guided Learning (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Tutorial Action Bar */}
          <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${cardBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    MODUL #{activeTutorial.orderNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeTutorial.category} • {activeTutorial.difficulty}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  {activeTutorial.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeTutorial.subtitle}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleCompleteTutorial(activeTutorial.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    completedTutorialIds.includes(activeTutorial.id)
                      ? "bg-emerald-500 text-white"
                      : "border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedTutorialIds.includes(activeTutorial.id)
                      ? "Telah Dikuasai"
                      : "Tandai Selesai"}
                  </span>
                </button>

                <button
                  onClick={() => onNavigateTab(activeTutorial.relatedNavTab)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1 cursor-pointer"
                  title="Buka modul aplikasi langsung"
                >
                  <span>Buka Fitur</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* View Mode Switcher: Hands-on Sandbox vs Detailed Curriculum */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs">
                <button
                  onClick={() => setActiveTabMode("practice")}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    activeTabMode === "practice"
                      ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Mode Praktek Interaktif (Hands-on)</span>
                </button>

                <button
                  onClick={() => setActiveTabMode("curriculum")}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    activeTabMode === "curriculum"
                      ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Kurikulum &amp; Teori Dasar</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Hadiah: +{activeTutorial.xpReward} XP</span>
              </div>
            </div>
          </div>

          {/* 🕹️ MAIN CONTENT: Either Interactive Sandbox or Step-by-Step Curriculum */}
          {activeTabMode === "practice" ? (
            <InteractiveSandbox
              tutorial={activeTutorial}
              isDarkMode={isDarkMode}
              onCompleted={() => {
                if (!completedTutorialIds.includes(activeTutorial.id)) {
                  setCompletedTutorialIds((prev) => [...prev, activeTutorial.id]);
                }
              }}
              onJumpToFeature={() => onNavigateTab(activeTutorial.relatedNavTab)}
            />
          ) : (
            <CurriculumGuide
              tutorial={activeTutorial}
              isDarkMode={isDarkMode}
              onNavigateTab={onNavigateTab}
            />
          )}

          {/* 🌟 Key Takeaway Callout */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isDarkMode
                ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-200"
                : "bg-emerald-50/80 border-emerald-200/80 text-emerald-900"
            }`}
          >
            <Zap className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider block">
                Prinsip Inti Keberdayaan (Key Takeaway):
              </span>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                "{activeTutorial.keyTakeaway}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 📜 Certificate of Completion Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-2xl rounded-2xl border p-6 sm:p-8 space-y-6 shadow-2xl relative ${cardBg}`}
          >
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto shadow-md">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Sertifikat Kompetensi Sirkular Cerdas
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Greeneration Circle 2026 • Task 2 Innovation Challenge: Designing Local Solutions
              </p>
            </div>

            <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/5 text-center space-y-3">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold block">
                Diberikan kepada Inovator &amp; Warga Teladan:
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Fahira Shanin Nadifa &amp; Warga Komunitas DKI Jakarta
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                Telah berhasil menyelesaikan rangkaian 10 Tutorial Learning-by-Doing
                meliputi AI Computer Vision, Protokol Sanitasi Zero-Contamination,
                Kriptografi AES-256 E2EE, Ketahanan Offline-First, Peringatan Dini TPS3R,
                dan Ekonomi Sirkular Berkelanjutan.
              </p>

              <div className="pt-3 border-t border-amber-500/20 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-500">
                <span>Verification Seal: SHA256-SK2026-9B3E-77AF</span>
                <span>•</span>
                <span>DKI Jakarta Municipal Circular Authority</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Sertifikat</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
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

/* ========================================================================= */
/* 🛠️ SUBCOMPONENT: Interactive Hands-On Practice Sandbox Simulator           */
/* ========================================================================= */

interface InteractiveSandboxProps {
  tutorial: LearningTutorial;
  isDarkMode: boolean;
  onCompleted: () => void;
  onJumpToFeature: () => void;
}

const InteractiveSandbox: React.FC<InteractiveSandboxProps> = ({
  tutorial,
  isDarkMode,
  onCompleted,
  onJumpToFeature,
}) => {
  const cardInnerBg = isDarkMode
    ? "bg-slate-800/70 border-slate-700/70"
    : "bg-slate-50/90 border-slate-200/80";

  // State specific to interactive mini-simulators
  const [activePreset, setActivePreset] = useState("pet_bottle");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // Sorting Bench state (Tut 2)
  const [sortingChecklist, setSortingChecklist] = useState({
    capRemoved: false,
    labelPeeled: false,
    rinsed: false,
    crushed: false,
  });

  // Crypto state (Tut 3)
  const [plaintextInput, setPlaintextInput] = useState(
    '{"householdId":"HH-CLD-0402","weightKg":2.5,"item":"PET"}'
  );
  const [encryptedHash, setEncryptedHash] = useState<string | null>(null);
  const [isTamperDetected, setIsTamperDetected] = useState(false);

  // Offline state (Tut 4)
  const [offlineActive, setOfflineActive] = useState(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState(2);

  // TPS3R state (Tut 5)
  const [saturationLevel, setSaturationLevel] = useState(84);
  const [alertDispatched, setAlertDispatched] = useState(false);

  // Calendar booking state (Tut 6)
  const [bookedDate, setBookedDate] = useState("2026-09-18");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Cloud scaling state (Tut 7)
  const [loadReqPerSec, setLoadReqPerSec] = useState(1200);

  // Circular Economy state (Tut 8)
  const [calcKg, setCalcKg] = useState(4.5);
  const [selectedMaterial, setSelectedMaterial] = useState("PET");
  const [redeemed, setRedeemed] = useState(false);

  // API Explorer state (Tut 9)
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  // Green Leader state (Tut 10)
  const [votedCandidate, setVotedCandidate] = useState<string | null>(null);
  const [commitmentSigned, setCommitmentSigned] = useState(false);

  // Run scanner simulation for Tutorial 1
  const handleRunScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      if (activePreset === "pet_bottle") {
        setScanResult({
          name: "Botol Plastik PET Bening Air Mineral 600ml",
          material: "Polyethylene Terephthalate (#1 PETE)",
          confidence: 97.4,
          cleanliness: 92,
          impurities: ["Tutup PP terpasang", "Label sablon PVC"],
        });
      } else if (activePreset === "cardboard") {
        setScanResult({
          name: "Kardus Karton Corrugated Box E-Commerce",
          material: "OCC Kraft Paperboard",
          confidence: 98.1,
          cleanliness: 89,
          impurities: ["Lakban plastik coklat", "Resi thermal"],
        });
      } else if (activePreset === "battery") {
        setScanResult({
          name: "Baterai Silinder Alkali AA/AAA Bekas",
          material: "Bahan Berbahaya & Beracun (B3 Kategori 2)",
          confidence: 98.8,
          cleanliness: 70,
          impurities: ["Residu kalium hidroksida pada kutub"],
        });
      } else {
        setScanResult({
          name: "Sisa Sayuran & Kulit Buah Pisang Dapur",
          material: "Organik Mudah Terurai (BSF Maggot Feedstock)",
          confidence: 96.5,
          cleanliness: 94,
          impurities: ["Kawat staples sayur"],
        });
      }
      onCompleted();
    }, 1200);
  };

  return (
    <div className={`p-5 sm:p-6 rounded-2xl border space-y-6 ${cardInnerBg}`}>
      {/* Sandbox Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Hands-on Sandbox: {tutorial.title}
          </h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Live Interactive Simulator
        </span>
      </div>

      {/* RENDER DEDICATED SIMULATOR BY PRACTICE TYPE */}
      {tutorial.interactivePracticeType === "scanner_vision" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Pilih sampel sampah municipal Jakarta di bawah ini, lalu jalankan inferensi multimodal
            Gemini Vision untuk mengevaluasi confidence score dan kemurnian polimer:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "pet_bottle", label: "🧴 Botol PET Air Mineral" },
              { id: "cardboard", label: "📦 Kardus Belanja Online" },
              { id: "battery", label: "🔋 Baterai Bekas (B3)" },
              { id: "organic", label: "🍌 Kulit Pisang & Sayur" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePreset(p.id);
                  setScanResult(null);
                }}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  activePreset === p.id
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex justify-center py-2">
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ScanLine className={`w-4 h-4 ${isScanning ? "animate-spin" : ""}`} />
              <span>{isScanning ? "Gemini Vision Menganalisis Polimer..." : "Jalankan Inferensi Gemini Vision"}</span>
            </button>
          </div>

          {/* Scanner Simulation Output */}
          {scanResult && (
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-white/90 dark:bg-slate-900/90 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                    Objek Terdeteksi
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {scanResult.name}
                  </h4>
                  <p className="text-xs font-mono text-slate-500">{scanResult.material}</p>
                </div>

                {/* Confidence Badge */}
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-500 font-mono">
                    {scanResult.confidence}%
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 block uppercase">
                    Confidence Tier: HIGH
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-semibold text-amber-600 dark:text-amber-400 block mb-1">
                  ⚠️ Kontaminan Sensorik Terdeteksi:
                </span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-300">
                  {scanResult.impurities.map((imp: string, idx: number) => (
                    <li key={idx}>{imp}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Tutorial 1 Berhasil: Anda telah mempraktikkan deteksi polimer dengan confidence score real-time!</span>
              </div>
            </div>
          )}
        </div>
      )}

      {tutorial.interactivePracticeType === "sorting_bench" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Lakukan 4 tindakan sanitasi fisik pada botol PET di bawah ini untuk mencapai standar kemurnian 100% dan memangkas volume sampah hingga 75%:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { key: "capRemoved", title: "1. Putar & Lepas Tutup PP #5", why: "Pemisahan float-sink di pabrik" },
              { key: "labelPeeled", title: "2. Kupas Label Plastik PVC Sablon", why: "Mencegah tinta merusak warna rPET" },
              { key: "rinsed", title: "3. Bilas Kilat dengan 30ml Air", why: "Menghilangkan gula dan bau asam" },
              { key: "crushed", title: "4. Injak / Pipihkan Botol Rata", why: "Menghemat 75% ruang angkut armada" },
            ].map((item) => {
              const isChecked = (sortingChecklist as any)[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => {
                    const next = { ...sortingChecklist, [item.key]: !isChecked };
                    setSortingChecklist(next);
                    if (next.capRemoved && next.labelPeeled && next.rinsed && next.crushed) {
                      onCompleted();
                    }
                  }}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300"
                      : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 hover:border-emerald-400"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{item.title}</span>
                    <span className="text-[10px] text-slate-500">{item.why}</span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition ${
                      isChecked ? "bg-emerald-500 text-white" : "border-2 border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Volume & Cleanliness Meter */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 grid grid-cols-2 gap-4 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Kemurnian Material</span>
              <span className="text-lg font-black text-emerald-500">
                {Object.values(sortingChecklist).filter(Boolean).length * 25}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Volume Ruang Tersisa</span>
              <span className="text-lg font-black text-teal-500">
                {sortingChecklist.crushed ? "25% (Hemat 75%)" : "100% (Penuh)"}
              </span>
            </div>
          </div>

          {Object.values(sortingChecklist).every(Boolean) && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Hebat! Botol kini berstatus Grade-A Super dan siap dibeli dengan harga tertinggi di Bank Sampah.</span>
            </div>
          )}
        </div>
      )}

      {tutorial.interactivePracticeType === "crypto_audit" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Ketik atau modifikasi data setoran sampah di bawah ini, lalu enkripsi menggunakan AES-256-GCM
            dan periksa segel kriptografi SHA-256 untuk mendeteksi manipulasi data (tampering):
          </p>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              Data Setoran Sampah (JSON Plaintext):
            </label>
            <textarea
              rows={2}
              value={plaintextInput}
              onChange={(e) => {
                setPlaintextInput(e.target.value);
                setEncryptedHash(null);
              }}
              className="w-full p-2.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const simulatedCipher =
                  "aes256gcm:" +
                  Array.from({ length: 32 }, () =>
                    Math.floor(Math.random() * 16).toString(16)
                  ).join("");
                setEncryptedHash(simulatedCipher);
                setIsTamperDetected(false);
                onCompleted();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
            >
              Enkripsi dengan AES-256 &amp; Buat Segel
            </button>

            <button
              onClick={() => {
                setIsTamperDetected(true);
              }}
              className="px-3 py-2 rounded-xl border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold cursor-pointer"
            >
              Simulasikan Manipulasi 1-Bit
            </button>
          </div>

          {encryptedHash && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 space-y-2 text-xs font-mono">
              <div className="text-slate-500">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Ciphertext AES-GCM-256:
                </span>
                <span className="break-all text-[11px] text-emerald-600 dark:text-emerald-400">
                  {encryptedHash}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span>Integritas Audit Trail:</span>
                {isTamperDetected ? (
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold">
                    ⚠️ MANIPULASI TERDETEKSI (HASH TIDAK COCOK)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ TERVERIFIKASI &amp; AMAN E2EE
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {tutorial.interactivePracticeType === "offline_sync" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Uji ketahanan offline-first dengan mematikan koneksi internet tiruan, menambahkan setoran di antrean lokal IndexedDB,
            lalu menyalakan koneksi kembali untuk rekonsiliasi data:
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70">
            <div>
              <span className="text-xs font-bold block">Status Jaringan Perangkat:</span>
              <span className={`text-xs font-semibold ${offlineActive ? "text-amber-500" : "text-emerald-500"}`}>
                {offlineActive ? "Mode Offline Aktif (Tanpa Internet)" : "Online (Terhubung ke Cloud)"}
              </span>
            </div>

            <button
              onClick={() => setOfflineActive(!offlineActive)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                offlineActive
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
              }`}
            >
              {offlineActive ? "Pulihkan Koneksi Online" : "Simulasikan Putus Jaringan"}
            </button>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Antrean Transaksi Offline (IndexedDB):</span>
              <span className="font-mono font-bold text-amber-500">{offlineQueueCount} Transaksi Pending</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOfflineQueueCount((prev) => prev + 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-medium cursor-pointer"
              >
                + Tambah Setoran Saat Offline
              </button>

              <button
                disabled={offlineActive || offlineQueueCount === 0}
                onClick={() => {
                  setOfflineQueueCount(0);
                  onCompleted();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                Sinkronkan Antrean ke Server
              </button>
            </div>
          </div>

          {offlineQueueCount === 0 && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Seluruh transaksi offline berhasil disinkronkan tanpa ada satu kilogram sampah pun yang tercecer!</span>
            </div>
          )}
        </div>
      )}

      {tutorial.interactivePracticeType === "tps3r_alert" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Geser persentase kapasitas TPS3R Cilandak. Saat melewati ambang batas 80%, sistem mitigasi proaktif akan
            memicu peringatan darurat dan merekomendasikan dispatch armada alternatif:
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">Kapasitas Muat TPS3R:</span>
              <span
                className={`font-bold font-mono text-sm ${
                  saturationLevel >= 80 ? "text-rose-500" : "text-emerald-500"
                }`}
              >
                {saturationLevel}% {saturationLevel >= 80 ? "(SATURASI KRITIS)" : "(NORMAL)"}
              </span>
            </div>

            <input
              type="range"
              min="40"
              max="98"
              value={saturationLevel}
              onChange={(e) => {
                setSaturationLevel(Number(e.target.value));
                setAlertDispatched(false);
              }}
              className="w-full accent-emerald-500"
            />
          </div>

          {saturationLevel >= 80 ? (
            <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                <Bell className="w-4 h-4 animate-bounce" />
                <span>Peringatan Dini AI: Risiko Timbulan Sampah Berlebih dalam 4 Jam!</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Rekomendasi AI: Alihkan pengangkutan organik ke Fasilitas Maggot RW 07 dan dispatch armada truk cadangan DLH.
              </p>
              <button
                onClick={() => {
                  setAlertDispatched(true);
                  onCompleted();
                }}
                disabled={alertDispatched}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {alertDispatched ? "✓ Armada Cadangan Telah Diberangkatkan" : "Konfirmasi Dispatch Armada Cadangan"}
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-600 dark:text-emerald-400">
              Operasional lancar. Kapasitas TPS3R masih mencukupi untuk 3 hari ke depan.
            </div>
          )}
        </div>
      )}

      {tutorial.interactivePracticeType === "smart_calendar" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Jadwalkan penjemputan sampah besar (kasur/elektronik) atau penyetoran bank sampah komunal Anda:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                Pilih Tanggal Penjemputan:
              </label>
              <input
                type="date"
                value={bookedDate}
                onChange={(e) => setBookedDate(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                Kategori Material:
              </label>
              <select className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90">
                <option>Anorganik Terpilah (PET, Kardus, Kaleng)</option>
                <option>Limbah Elektronik &amp; B3 Rumah Tangga</option>
                <option>Sisa Makanan Komunal untuk Maggot BSF</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setBookingConfirmed(true);
              onCompleted();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
          >
            Daftarkan ke Kalender Sirkular RW
          </button>

          {bookingConfirmed && (
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <span className="font-bold block">✓ Jadwal Berhasil Ditambahkan ({bookedDate})</span>
              <p className="text-[11px]">
                Notifikasi otomatis akan dikirim ke WhatsApp warga pada H-1 jam 19:00 WIB.
              </p>
            </div>
          )}
        </div>
      )}

      {tutorial.interactivePracticeType === "autoscale_simulator" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Tingkatkan volume request transaksi sampah warga untuk melihat bagaimana Cloud Run secara otomatis
            menambah jumlah kontainer aktif tanpa jeda:
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">Throughput Request Warga:</span>
              <span className="font-mono font-bold text-emerald-500">{loadReqPerSec} req/detik</span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="200"
              value={loadReqPerSec}
              onChange={(e) => {
                setLoadReqPerSec(Number(e.target.value));
                if (Number(e.target.value) >= 3000) onCompleted();
              }}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 grid grid-cols-3 gap-3 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Kontainer Aktif</span>
              <span className="text-lg font-black text-purple-500">
                {Math.max(2, Math.ceil(loadReqPerSec / 500))} Instans
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Rata-rata Latensi</span>
              <span className="text-lg font-black text-emerald-500">
                {Math.round(28 + (loadReqPerSec / 5000) * 15)} ms
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Availability SLA</span>
              <span className="text-lg font-black text-teal-500">99.98%</span>
            </div>
          </div>
        </div>
      )}

      {tutorial.interactivePracticeType === "circular_economy" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Kalkulasikan nilai konversi sampah ke Rupiah pasar Jakarta, reward poin, dan pencegahan emisi karbon CO2e:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                Material Terpilah:
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90"
              >
                <option value="ALUMINIUM">Kaleng Minuman Aluminium (Rp 14.000/kg)</option>
                <option value="PET">Botol Plastik PET Bening (Rp 4.500/kg)</option>
                <option value="KARTON">Kardus Karton OCC (Rp 2.200/kg)</option>
                <option value="ORGANIK">Sisa Sayur &amp; Buah Organik (Rp 1.200/kg)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                Bobot Setoran (kg):
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="50"
                value={calcKg}
                onChange={(e) => setCalcKg(Number(e.target.value))}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90"
              />
            </div>
          </div>

          {/* Results preview */}
          {(() => {
            const priceMap: Record<string, number> = {
              ALUMINIUM: 14000,
              PET: 4500,
              KARTON: 2200,
              ORGANIK: 1200,
            };
            const co2Map: Record<string, number> = {
              ALUMINIUM: 3.5,
              PET: 1.2,
              KARTON: 0.8,
              ORGANIK: 0.6,
            };
            const price = priceMap[selectedMaterial] || 3000;
            const co2Factor = co2Map[selectedMaterial] || 1;
            const totalRupiah = calcKg * price;
            const points = Math.round(calcKg * 15);
            const co2e = (calcKg * co2Factor).toFixed(2);

            return (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[9px] text-slate-400 block">Saldo Bank Sampah</span>
                    <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                      Rp {totalRupiah.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Reward Poin</span>
                    <span className="text-sm sm:text-base font-black text-amber-500">
                      +{points} Poin
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Cegah Karbon</span>
                    <span className="text-sm sm:text-base font-black text-teal-500">
                      {co2e} kg CO2e
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Tukar 50 poin dengan voucher listrik:</span>
                  <button
                    onClick={() => {
                      setRedeemed(true);
                      onCompleted();
                    }}
                    disabled={redeemed}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer disabled:opacity-50"
                  >
                    {redeemed ? "✓ Voucher Telah Diterbitkan" : "Tukarkan Poin Sekarang"}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {tutorial.interactivePracticeType === "open_api" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Uji coba request API publik SiklusKita untuk interoperabilitas dengan portal Satu Data Jakarta / JakOne:
          </p>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-bold">GET</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                /api/facilities/jakarta-selatan
              </span>
            </div>
            <div className="text-slate-500 text-[11px]">
              Headers: Authorization: Bearer sk_live_greeneration2026_dki
            </div>
          </div>

          <button
            onClick={() => {
              setApiResponse(
                JSON.stringify(
                  {
                    status: "success",
                    timestamp: new Date().toISOString(),
                    region: "Jakarta Selatan",
                    totalFacilities: 42,
                    totalDivertedTonsToday: 18.4,
                    apiProvider: "SiklusKita SPBE DLH DKI",
                  },
                  null,
                  2
                )
              );
              onCompleted();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
          >
            Kirim Request Uji Coba (Send Request)
          </button>

          {apiResponse && (
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto">
              <div className="text-slate-500 mb-1">// HTTP 200 OK • Content-Type: application/json</div>
              <pre>{apiResponse}</pre>
            </div>
          )}
        </div>
      )}

      {tutorial.interactivePracticeType === "green_leader" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Pilih inovator sirkular terbaik DKI Jakarta pada Greeneration Awarding 2026, lalu tandatangani
            komitmen digital RW Bebas Sampah:
          </p>

          <div className="space-y-2">
            {[
              {
                id: "cilandak",
                name: "Ibu Rahmawati (RW 04 Cilandak Barat)",
                desc: "Mengolah 92% sampah organik dapur menjadi pakan Maggot BSF dan kasgot urban farming.",
              },
              {
                id: "kemang",
                name: "Bapak Hendra (RW 02 Bangka Kemang)",
                desc: "Menginisiasi sistem pemilahan anorganik dry waste berbasis QR code dengan 140 KK.",
              },
            ].map((cand) => (
              <div
                key={cand.id}
                onClick={() => {
                  setVotedCandidate(cand.id);
                  onCompleted();
                }}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  votedCandidate === cand.id
                    ? "bg-amber-500/15 border-amber-500 text-slate-900 dark:text-white"
                    : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 hover:border-amber-400"
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{cand.name}</span>
                  <span className="text-[11px] text-slate-500">{cand.desc}</span>
                </div>
                <button
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    votedCandidate === cand.id
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {votedCandidate === cand.id ? "✓ Telah Dipilih" : "Beri Vote"}
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Komitmen Warga DKI 2026:
            </span>
            <button
              onClick={() => {
                setCommitmentSigned(true);
                onCompleted();
              }}
              disabled={commitmentSigned}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer disabled:opacity-50"
            >
              {commitmentSigned ? "✓ Komitmen Ditandatangani" : "Tandatangani Komitmen Digital"}
            </button>
          </div>
        </div>
      )}

      {/* Jump to production feature button */}
      <div className="pt-3 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Ingin mencoba fitur ini pada data riil aplikasi?
        </span>
        <button
          onClick={onJumpToFeature}
          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Buka Fitur Penuh</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 📖 SUBCOMPONENT: Detailed Curriculum & Step-by-Step Guide                */
/* ========================================================================= */

interface CurriculumGuideProps {
  tutorial: LearningTutorial;
  isDarkMode: boolean;
  onNavigateTab: (tab: NavTab) => void;
}

const CurriculumGuide: React.FC<CurriculumGuideProps> = ({
  tutorial,
  isDarkMode,
  onNavigateTab,
}) => {
  const cardInnerBg = isDarkMode
    ? "bg-slate-800/70 border-slate-700/70"
    : "bg-slate-50/90 border-slate-200/80";

  return (
    <div className="space-y-5">
      {/* Why It Matters & Legal Basis */}
      <div className={`p-5 rounded-2xl border space-y-3 ${cardInnerBg}`}>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>Latar Belakang &amp; Regulasi DKI Jakarta:</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {tutorial.whyItMatters}
        </p>

        <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/70 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-200">Dasar Hukum:</span>
          <span>{tutorial.perdaDKIReference}</span>
        </div>
      </div>

      {/* Core Concepts */}
      <div className={`p-5 rounded-2xl border space-y-3 ${cardInnerBg}`}>
        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
          Konsep Kunci yang Dikuasai:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tutorial.coreConcepts.map((c, i) => (
            <div
              key={i}
              className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 text-xs flex items-start gap-2"
            >
              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700 dark:text-slate-300">{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Steps Breakdown */}
      <div className={`p-5 rounded-2xl border space-y-4 ${cardInnerBg}`}>
        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
          Langkah Kerja Terstruktur:
        </h4>

        <div className="space-y-3">
          {tutorial.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Langkah {step.stepNumber}: {step.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {step.toolHint}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {step.instruction}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Target Hasil: </span>
                <span>{step.expectedOutcome}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
