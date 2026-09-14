/**
 * Awarding Greeneration Circle 2026 Feature View
 * Fahira Shanin Nadifa - Greeneration Circle 2026 - DKI Jakarta
 */

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Award,
  Sparkles,
  Calendar,
  Clock,
  Heart,
  Share2,
  CheckCircle2,
  ArrowRight,
  Download,
  ExternalLink,
  ShieldCheck,
  Leaf,
  Users,
  Star,
  Target,
  FileBadge,
  ChevronRight,
  Flame,
} from "lucide-react";
import confetti from "canvas-confetti";
import { AwardCategory, GreenLeaderProject, ScheduleEvent } from "../types";
import { createGoogleCalendarUrl, downloadIcsFile } from "../utils/calendar";
import { BadgeSystemSection } from "./BadgeSystemSection";

interface AwardingViewProps {
  isDarkMode: boolean;
  onAddEventToCalendar?: (event: ScheduleEvent) => void;
}

export const AwardingView: React.FC<AwardingViewProps> = ({ isDarkMode, onAddEventToCalendar }) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("ALL");
  const [votedProjects, setVotedProjects] = useState<Record<string, boolean>>({});
  const [projectVotes, setProjectVotes] = useState<Record<string, number>>({
    "proj-sikluskita": 428,
    "proj-biokompos": 312,
    "proj-mangrove": 284,
    "proj-ecodrop": 245,
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // Milestone Events definition
  const presentationEvent: ScheduleEvent = {
    id: "evt-awarding-01",
    title: "Presentasi Akhir Project Greeneration Circle 2026",
    date: "2026-12-05",
    time: "09:00 - 16:00 WIB",
    type: "COLLECTION_PLASTIC",
    location: "Auditorium Graha Greeneration / Live Hybrid",
    neighborhood: "DKI Jakarta & Nasional",
    details:
      "Presentasi hasil implementasi mini project oleh para Green Leaders, berbagi pembelajaran lapangan, dan validasi dampak nyata bersama dewan juri ahli.",
  };

  const awardingCeremonyEvent: ScheduleEvent = {
    id: "evt-awarding-02",
    title: "Malam Penganugerahan Awarding Greeneration Circle 2026",
    date: "2026-12-12",
    time: "13:00 - 17:30 WIB",
    type: "BANK_SAMPAH",
    location: "Grand Ballroom Jakarta & Live Broadcast",
    neighborhood: "DKI Jakarta",
    details:
      "Momen puncak penutup rangkaian Greeneration Circle untuk mengapresiasi dedikasi, inovasi, dan dampak seluruh Green Leaders. Pengumuman pemenang Green Future Award, Best Sustainability Impact, Most Innovative Solution, dan penyerahan hibah akselerasi.",
  };

  // Time remaining calculation to Dec 5 and Dec 12, 2026
  const [daysToPresentation, setDaysToPresentation] = useState<number>(84);
  const [daysToAwarding, setDaysToAwarding] = useState<number>(91);

  useEffect(() => {
    const now = new Date().getTime();
    const presDate = new Date("2026-12-05T09:00:00+07:00").getTime();
    const awardDate = new Date("2026-12-12T13:00:00+07:00").getTime();

    const diffPres = Math.max(0, Math.ceil((presDate - now) / (1000 * 60 * 60 * 24)));
    const diffAward = Math.max(0, Math.ceil((awardDate - now) / (1000 * 60 * 60 * 24)));

    setDaysToPresentation(diffPres);
    setDaysToAwarding(diffAward);
  }, []);

  const awardCategories: AwardCategory[] = [
    {
      id: "green-future",
      title: "Green Future Award",
      badge: "Kategori Utama",
      iconName: "trophy",
      description:
        "Penghargaan tertinggi bagi mini project dengan visi keberlanjutan paling komprehensif, memiliki roadmap jangka panjang terukur, dan skalabilitas adaptasi tinggi untuk kota berkelanjutan masa depan.",
      criteria: [
        "Visi jangka panjang & potensi replikasi di kota lain",
        "Kematangan model sirkular hulu ke hilir",
        "Ketahanan infrastruktur dan keterlibatan lintas pemangku kepentingan",
      ],
      nomineesCount: 4,
    },
    {
      id: "best-impact",
      title: "Best Sustainability Impact",
      badge: "Dampak Nyata",
      iconName: "leaf",
      description:
        "Diberikan kepada proyek yang membuktikan reduksi jejak lingkungan paling signifikan: pengalihan tonase sampah dari TPA, pencegahan emisi CO2e terverifikasi, dan efisiensi konversi material.",
      criteria: [
        "Volume sampah teralihkan dari TPA (kg/hari)",
        "Pencegahan emisi gas rumah kaca terverifikasi",
        "Rasio keberhasilan pemilahan di tingkat rumah tangga",
      ],
      nomineesCount: 5,
    },
    {
      id: "most-innovative",
      title: "Most Innovative Solution",
      badge: "Inovasi & Teknologi",
      iconName: "sparkles",
      description:
        "Apresiasi bagi terobosan solusi cerdas yang mengintegrasikan teknologi terdepan (AI prediktif, computer vision, cloud auto-scaling, dan sistem keamanan data E2EE) untuk memecahkan problem lokal secara efektif.",
      criteria: [
        "Kebaruan teknologi dan arsitektur sistem cerdas",
        "Ketepatan integrasi AI dalam otomatisasi alokasi sumber daya",
        "Kemudahan adopsi bagi masyarakat pengguna",
      ],
      nomineesCount: 4,
    },
    {
      id: "community-champion",
      title: "Community Empowerment Champion",
      badge: "Pemberdayaan Warga",
      iconName: "users",
      description:
        "Mengapresiasi dedikasi luar biasa dalam merangkul komunitas akar rumput, mengedukasi kader lingkungan RT/RW, dan menciptakan perubahan perilaku pilah sampah yang berkesinambungan.",
      criteria: [
        "Tingkat keterlibatan warga dan keluarga aktif",
        "Pemberdayaan pengelola Bank Sampah & pemulung",
        "Keberlanjutan kebiasaan (habit loop) di lingkungan pilot",
      ],
      nomineesCount: 6,
    },
  ];

  const nominatedProjects: GreenLeaderProject[] = [
    {
      id: "proj-sikluskita",
      title: "SiklusKita - Intelligent Waste & Resource Infrastructure",
      leaderName: "Fahira Shanin Nadifa & Tim",
      region: "DKI Jakarta (Pilot: Cilandak & Pondok Labu)",
      categoryNomination: "Most Innovative Solution & Best Sustainability Impact",
      summary:
        "Platform cerdas pengoptimal alokasi sumber daya sampah otomatis berbasis AI prediktif, computer vision scanner, cloud auto-scaling 99.98% SLA, dan keamanan data E2EE AES-256 untuk memangkas timbulan sampah 10.600 ton/hari Jakarta.",
      impactMetrics: {
        wasteDivertedKg: 14800,
        householdsEngaged: 1240,
        co2eAvoidedKg: 11248,
      },
      status: "FINALIST",
      votes: projectVotes["proj-sikluskita"] || 428,
    },
    {
      id: "proj-biokompos",
      title: "BioKompos Komunal & BSF Feed Hub",
      leaderName: "Rizky Ramadhan & Tim",
      region: "Kota Bandung & Cimahi",
      categoryNomination: "Best Sustainability Impact",
      summary:
        "Desentralisasi pengolahan sisa makanan restoran dan pasar induk menjadi pakan maggot BSF protein tinggi serta kompos cair terstandarisasi untuk kelompok tani urban.",
      impactMetrics: {
        wasteDivertedKg: 8900,
        householdsEngaged: 650,
        co2eAvoidedKg: 7450,
      },
      status: "FINALIST",
      votes: projectVotes["proj-biokompos"] || 312,
    },
    {
      id: "proj-mangrove",
      title: "Mangrove Blue Carbon & Marine Guard",
      leaderName: "Annisa Larasati",
      region: "Kepulauan Seribu, DKI Jakarta",
      categoryNomination: "Green Future Award",
      summary:
        "Konservasi sabuk hijau mangrove pesisir pulau terluar dipadukan dengan pemantau sensor IoT salinitas air dan edukasi pemilahan sampah plastik laut nelayan.",
      impactMetrics: {
        wasteDivertedKg: 5200,
        householdsEngaged: 420,
        co2eAvoidedKg: 8900,
      },
      status: "FINALIST",
      votes: projectVotes["proj-mangrove"] || 284,
    },
    {
      id: "proj-ecodrop",
      title: "EcoDrop Campus Reverse Vending Network",
      leaderName: "Dimas Arya Pratama",
      region: "Surabaya, Jawa Timur",
      categoryNomination: "Most Innovative Solution",
      summary:
        "Jaringan tempat sampah pintar penukaran botol plastik instan dengan insentif kuota internet dan poin kantin ramah lingkungan bagi mahasiswa.",
      impactMetrics: {
        wasteDivertedKg: 4600,
        householdsEngaged: 980,
        co2eAvoidedKg: 3890,
      },
      status: "FINALIST",
      votes: projectVotes["proj-ecodrop"] || 245,
    },
  ];

  const handleSupportVote = (projectId: string) => {
    if (votedProjects[projectId]) return;

    setProjectVotes((prev) => ({
      ...prev,
      [projectId]: (prev[projectId] || 0) + 1,
    }));

    setVotedProjects((prev) => ({
      ...prev,
      [projectId]: true,
    }));

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#06b6d4", "#ec4899"],
      });
    } catch {
      // safe fallback
    }
  };

  const copyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSyncToCalendar = (evt: ScheduleEvent) => {
    if (onAddEventToCalendar) {
      onAddEventToCalendar(evt);
    }
    // Also download .ics
    downloadIcsFile(evt);
  };

  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  return (
    <div className="space-y-8">
      {/* Hero Header with Golden Glow */}
      <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 transition-all ${
        isDarkMode
          ? "bg-gradient-to-br from-amber-950/40 via-slate-900 to-emerald-950/40 border-amber-500/30 shadow-2xl shadow-amber-950/20"
          : "bg-gradient-to-br from-amber-50/90 via-emerald-50/50 to-white border-amber-200 shadow-lg shadow-amber-500/5"
      }`}>
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Puncak Apresiasi & Penganugerahan</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="#badge-system-section"
                className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Lencana Digital</span>
              </a>

              <button
                onClick={copyShareLink}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? "Tautan Tersalin!" : "Bagikan Info Awarding"}</span>
              </button>

              <button
                onClick={() => setShowCertModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm shadow-amber-500/20 cursor-pointer"
              >
                <FileBadge className="w-3.5 h-3.5" />
                <span>Sertifikat Green Leader</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <span>🏆 AWARDING GREENERATION CIRCLE 2026</span>
            </h1>
            <p className="text-base sm:text-lg font-medium text-emerald-600 dark:text-emerald-400">
              Setiap perjalanan yang penuh dedikasi layak mendapatkan apresiasi. 💚
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              Awarding merupakan tahap penutup dalam rangkaian Greeneration Circle yang menjadi momen untuk mengapresiasi perjalanan, inovasi, dan dampak yang telah dihasilkan oleh para <strong>Green Leaders</strong> melalui implementasi mini project di wilayah masing-masing.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Pada tahap ini, setiap tim akan mempresentasikan hasil project yang telah dijalankan, berbagi pembelajaran, serta berkesempatan memperoleh berbagai kategori penghargaan sebagai bentuk apresiasi atas kontribusi mereka.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-500/20 max-w-2xl">
            <Leaf className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>
              Perjalanan belum selesai. Nantikan momen ketika setiap ide, kerja keras, dan dampak nyata mendapatkan apresiasi yang layak. 🌱
            </span>
          </div>
        </div>
      </div>

      {/* Official Timeline & Countdown Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <span>📅 Timeline Resmi Awarding Greeneration Circle 2026</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Catat dua tanggal krusial dan sinkronisasikan langsung ke aplikasi kalender Anda
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Milestone 1: 5 Desember 2026 */}
          <div className={`p-5 rounded-2xl border ${cardBase} space-y-4 relative overflow-hidden transition-all hover:border-emerald-500/50`}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                  Tahap 1: Evaluasi & Sharing
                </span>
                <h3 className="text-lg font-bold pt-2 text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>🗓 5 Desember 2026</span>
                </h3>
                <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Presentasi Akhir Project
                </div>
              </div>

              {/* Countdown badge */}
              <div className="text-right">
                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                  {daysToPresentation} Hari
                </div>
                <div className="text-[10px] text-slate-400">Menuju Presentasi</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Setiap tim Green Leader mempresentasikan hasil implementasi mini project di hadapan dewan juri ahli dan sesama peserta, mengupas data dampak nyata, efektivitas alokasi sumber daya, serta pembelajaran strategis dari lapangan.
            </p>

            <div className="pt-2 border-t dark:border-slate-700/70 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>09:00 - 16:00 WIB • Hybrid Live Presentation</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={createGoogleCalendarUrl(presentationEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Calendar</span>
                </a>
                <button
                  onClick={() => handleSyncToCalendar(presentationEvent)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.ICS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Milestone 2: 12 Desember 2026 */}
          <div className={`p-5 rounded-2xl border ${cardBase} space-y-4 relative overflow-hidden transition-all hover:border-amber-500/60 shadow-xs`}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  Tahap 2: Grand Ceremony
                </span>
                <h3 className="text-lg font-bold pt-2 text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>🗓 12 Desember 2026</span>
                </h3>
                <div className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  Awarding Greeneration Circle
                </div>
              </div>

              {/* Countdown badge */}
              <div className="text-right">
                <div className="text-2xl font-extrabold text-amber-500">
                  {daysToAwarding} Hari
                </div>
                <div className="text-[10px] text-slate-400">Menuju Penganugerahan</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Momen puncak penganugerahan penghargaan bagi para inovator muda lingkungan. Pengumuman para pemenang kategori penghargaan, perayaan dampak keberlanjutan bersama mitra nasional, dan penyerahan hibah akselerasi skala lanjutan.
            </p>

            <div className="pt-2 border-t dark:border-slate-700/70 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>13:00 - 17:30 WIB • Malam Apresiasi Akbar</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={createGoogleCalendarUrl(awardingCeremonyEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Calendar</span>
                </a>
                <button
                  onClick={() => handleSyncToCalendar(awardingCeremonyEvent)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.ICS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🏅 Award Categories Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>🏅 Kategori Penghargaan (Award Categories)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bentuk apresiasi resmi Greeneration Circle atas kontribusi dan terobosan nyata para Green Leaders
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            4 Kategori Utama & Kategori Khusus
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {awardCategories.map((category) => (
            <div
              key={category.id}
              className={`p-5 rounded-2xl border transition-all ${cardBase} space-y-3 flex flex-col justify-between hover:border-amber-500/50`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    {category.badge}
                  </span>
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                    {category.id === "green-future" && <Trophy className="w-4 h-4" />}
                    {category.id === "best-impact" && <Leaf className="w-4 h-4" />}
                    {category.id === "most-innovative" && <Sparkles className="w-4 h-4" />}
                    {category.id === "community-champion" && <Users className="w-4 h-4" />}
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {category.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="pt-3 border-t dark:border-slate-700/80 space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Kriteria Penilaian:
                </span>
                <ul className="text-[11px] space-y-1 text-slate-600 dark:text-slate-300">
                  {category.criteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🎖️ Visual Digital Badge System Section */}
      <BadgeSystemSection isDarkMode={isDarkMode} />

      {/* 🌟 Green Leaders & Finalist Projects Showcase */}
      <div className={`p-6 rounded-2xl border ${cardBase} space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Showcase Proyek Finalis & Green Leaders
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dukungan dan apresiasi Anda memberikan dorongan semangat bagi para penggerak solusi lokal
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              Live Endorsement Active
            </span>
          </div>
        </div>

        {/* Featured Card: SiklusKita - Fahira Shanin Nadifa */}
        <div className={`p-6 rounded-2xl border transition-all ${
          isDarkMode
            ? "bg-gradient-to-r from-emerald-950/30 via-slate-900 to-amber-950/20 border-emerald-500/40"
            : "bg-gradient-to-r from-emerald-50/80 via-white to-amber-50/60 border-emerald-300 shadow-md"
        } space-y-4`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-white tracking-wide">
                  ⭐ Top Finalist • DKI Jakarta
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
                  Most Innovative Solution
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40">
                  Best Sustainability Impact
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                SiklusKita - Intelligent Waste & Resource Infrastructure
              </h3>
              <div className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <span>Green Leader: <strong>Fahira Shanin Nadifa &amp; Tim</strong></span>
                <span>•</span>
                <span>Task 2 Innovation Challenge — DKI Jakarta</span>
              </div>
            </div>

            {/* Voting / Support Action Button */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xl font-bold text-amber-500">
                  {projectVotes["proj-sikluskita"]}
                </div>
                <div className="text-[10px] text-slate-400">Apresiasi Warga</div>
              </div>
              <button
                id="vote-sikluskita-btn"
                onClick={() => handleSupportVote("proj-sikluskita")}
                disabled={votedProjects["proj-sikluskita"]}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                  votedProjects["proj-sikluskita"]
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-white shadow-md shadow-emerald-600/20"
                }`}
              >
                <Heart className={`w-4 h-4 ${votedProjects["proj-sikluskita"] ? "fill-white" : ""}`} />
                <span>{votedProjects["proj-sikluskita"] ? "Telah Didukung 💚" : "Dukung Proyek Ini"}</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Inovasi platform infrastruktur cerdas yang secara otomatis mengoptimalkan efisiensi alokasi armada penjemputan sampah, kapasitas biokonversi larva BSF maggot, dan aerasi komposter komunal di DKI Jakarta melalui AI analitik prediktif, computer vision, pemantauan sistem real-time, skalabilitas cloud auto-scaling (SLA 99.98%), serta proteksi privasi warga berstandar enkripsi solid AES-GCM 256-bit E2EE.
          </p>

          {/* Metrics Highlight Pills */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Dampak Sampah Teralihkan</span>
              <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
                14.8 Ton
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Area Pilot Cilandak</span>
            </div>

            <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Keluarga Terlibat Aktif</span>
              <span className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">
                1,240 KK
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Partisipasi Pilah</span>
            </div>

            <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Emisi Karbon Dicegah</span>
              <span className="text-sm sm:text-base font-bold text-teal-600 dark:text-teal-400">
                11,248 kg CO2e
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Audit Terverifikasi E2EE</span>
            </div>
          </div>
        </div>

        {/* Peer Finalists Showcase Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Rekan Finalis Green Leaders Se-Indonesia
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nominatedProjects.filter((p) => p.id !== "proj-sikluskita").map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      {proj.region}
                    </span>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-amber-500" />
                      <span>{projectVotes[proj.id] || proj.votes}</span>
                    </span>
                  </div>

                  <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {proj.title}
                  </h5>

                  <div className="text-[11px] text-slate-500">
                    Oleh: <strong>{proj.leaderName}</strong>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {proj.summary}
                  </p>
                </div>

                <div className="pt-2 border-t dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400">
                    {proj.impactMetrics.wasteDivertedKg.toLocaleString()} kg teralihkan
                  </div>

                  <button
                    onClick={() => handleSupportVote(proj.id)}
                    disabled={votedProjects[proj.id]}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      votedProjects[proj.id]
                        ? "bg-slate-200 dark:bg-slate-700 text-slate-500"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    {votedProjects[proj.id] ? "Didukung" : "Dukung 💚"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rubric Evaluation Criteria Simulator */}
      <div className={`p-6 rounded-2xl border ${cardBase} space-y-4`}>
        <div className="flex items-center justify-between border-b pb-3 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <span>Rubrik & Bobot Penilaian Dewan Juri Greeneration Circle</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Standar evaluasi objektif dalam menentukan penerima penghargaan pada 12 Desember 2026
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Bobot Total: 100%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>1. Dampak Terukur</span>
              <span className="text-emerald-600 font-mono">35%</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Volume sampah teralihkan dari TPA, pencegahan emisi karbon, dan efisiensi biaya nyata.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>2. Inovasi & Teknologi</span>
              <span className="text-blue-600 font-mono">25%</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Kecerdasan AI, otomatisasi alokasi, skalabilitas cloud, dan integritas keamanan data E2EE.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>3. Keterlibatan Warga</span>
              <span className="text-purple-600 font-mono">25%</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tingkat partisipasi rumah tangga, habit loop berkelanjutan, dan kemitraan bank sampah.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>4. Presentasi & Rencana</span>
              <span className="text-amber-600 font-mono">15%</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Kejelasan paparan 5 Des, kemampuan refleksi pembelajaran, dan kelayakan jangka panjang.
            </p>
          </div>
        </div>
      </div>

      {/* Digital Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`max-w-2xl w-full p-6 sm:p-8 rounded-3xl border ${cardBase} space-y-6 shadow-2xl relative`}>
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>

            {/* Certificate Frame */}
            <div className="p-6 sm:p-8 rounded-2xl border-4 border-double border-amber-500/40 bg-gradient-to-b from-amber-500/5 via-transparent to-emerald-500/5 text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8 text-amber-500" />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest font-bold text-amber-600 dark:text-amber-400">
                  GREENERATION CIRCLE 2026
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  CERTIFICATE OF FINALIST & EXCELLENCE
                </h3>
              </div>

              <p className="text-xs text-slate-500">Dengan bangga dianugerahkan kepada:</p>

              <div className="text-2xl sm:text-3xl font-bold font-serif text-emerald-700 dark:text-emerald-400 border-b-2 border-amber-500/30 pb-2 max-w-md mx-auto">
                Fahira Shanin Nadifa &amp; Tim
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                <p>
                  Atas dedikasi, kepemimpinan inovatif, dan dampak keberlanjutan luar biasa melalui proyek:
                </p>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  "SiklusKita: Intelligent Waste & Resource Infrastructure Platform"
                </p>
                <p className="text-[11px] text-slate-400">
                  Task 2 Innovation Program Challenge: Designing Local Solutions — DKI Jakarta
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t dark:border-slate-800">
                <div className="text-left">
                  <span>Jadwal: 12 Desember 2026</span>
                  <div className="text-emerald-500 font-semibold">Verified Green Leader</div>
                </div>

                <div className="text-right">
                  <span>Segel Integritas E2EE:</span>
                  <div className="text-slate-600 dark:text-slate-300">SHA256: 8f434346648...99x</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 text-white font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh / Cetak Sertifikat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
