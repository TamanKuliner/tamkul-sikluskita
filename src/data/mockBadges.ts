/**
 * Digital Badges & Achievement Milestones Data
 * Greeneration Circle 2026 - Awarding Milestone Badges
 * Fahira Shanin Nadifa - Task 2 Designing Local Solutions
 */

import { DigitalBadge } from "../types";

export const INITIAL_DIGITAL_BADGES: DigitalBadge[] = [
  {
    id: "badge-100kg-diverted",
    title: "100kg Diverted",
    category: "SUSTAINABILITY",
    tier: "GOLD",
    rarity: "Istimewa",
    iconName: "scale",
    tag: "DIVERTED-100KG",
    description:
      "Prestasi monumental pemilahan rumah tangga: Berhasil mengalihkan akumulasi 100 kg sampah bernilai sirkular dari beban TPA Bantargebang ke fasilitas daur ulang dan komposting berizin.",
    milestoneRequirement: "Alihkan akumulasi total 100 kg sampah terpilah (Organik, Anorganik, Kertas) ke Bank Sampah atau TPS3R.",
    currentProgress: 104.2,
    targetProgress: 100,
    unit: "kg sampah",
    unlocked: true,
    unlockedAt: "12 September 2026",
    verificationHash: "sha256:4d7a8e91c2b3f405167a89bcde1234567890abcdef1234567890abcdef123456",
    perks: [
      "Medali Digital Emas '100kg Diverted' di Profil & Paspor Warga",
      "Bebas Iuran Retribusi Kebersihan Lingkungan 1 Bulan",
      "Voucher Belanja Sembako Ramah Lingkungan Rp 100.000",
      "Prioritas Penjemputan Khusus Sampah Terpilah RW",
    ],
  },
  {
    id: "badge-zero-waste-month",
    title: "Zero-Waste Month",
    category: "SUSTAINABILITY",
    tier: "PLATINUM",
    rarity: "Legendaris",
    iconName: "calendar",
    tag: "ZERO-WASTE-30D",
    description:
      "Bulan Emas Nol-Residu: Berhasil mempertahankan kebiasaan hidup minim sampah dan pencatatan pemilahan aktif 100% konsisten selama 30 hari penuh dalam satu bulan kalender.",
    milestoneRequirement: "Pertahankan catatan 30 hari aktif pemilahan di sumber tanpa mengirim residu tanpa pilah ke TPA.",
    currentProgress: 28,
    targetProgress: 30,
    unit: "hari konsisten",
    unlocked: false,
    verificationHash: "sha256:pending_day_30_consecutive_verification_seal",
    perks: [
      "Plakat Digital Kehormatan Warga Nol Residu DKI Jakarta",
      "Status 'Rumah Tangga Teladan Lingkungan' Terverifikasi DLH",
      "Paket Starter Kit Urban Composter Biopori Komunal",
      "Undangan VIP Gala Penganugerahan Greeneration 2026",
    ],
  },
  {
    id: "badge-50kg-carbon-shield",
    title: "50kg Carbon Shield",
    category: "SUSTAINABILITY",
    tier: "GOLD",
    rarity: "Istimewa",
    iconName: "shield",
    tag: "CARBON-SHIELD-50",
    description:
      "Pelindung Atmosfer Ibu Kota: Berhasil mencegah emisi kumulatif minimal 50 kg CO₂e melalui daur ulang presisi dan pencegahan pembusukan anaerobik.",
    milestoneRequirement: "Cegah akumulasi minimal 50 kg emisi gas rumah kaca (CO₂e) dari sampah rumah tangga.",
    currentProgress: 52.8,
    targetProgress: 50,
    unit: "kg CO₂e",
    unlocked: true,
    unlockedAt: "11 September 2026",
    verificationHash: "sha256:6e5d4c3b2a109876543210fedcba9876543210fedcba9876543210fedcba9876",
    perks: [
      "Sertifikat Digital Kredit Karbon Mikro Terverifikasi",
      "Aura Biru Ozon Proteksi Lingkungan pada Avatar Warga",
      "Akses Laporan Jejak Emisi Karbon Terinci Pemprov DKI",
    ],
  },
  {
    id: "badge-plastic-diet-master",
    title: "Plastic Diet Master",
    category: "SUSTAINABILITY",
    tier: "SILVER",
    rarity: "Langka",
    iconName: "recycle",
    tag: "PLASTIC-DIET-25",
    description:
      "Penyelamat Perairan Teluk Jakarta: Sukses mengalihkan 25 kg sampah plastik bernilai tinggi (PET botol bening & HDPE) ke sirkuit daur ulang botol-ke-botol.",
    milestoneRequirement: "Setorkan 25 kg sampah plastik terpilah bersih ke Bank Sampah terdekat.",
    currentProgress: 26.4,
    targetProgress: 25,
    unit: "kg plastik",
    unlocked: true,
    unlockedAt: "10 September 2026",
    verificationHash: "sha256:9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
    perks: [
      "Diskon 20% Pembelian Produk Daur Ulang Mitra UMKM",
      "Lencana Digital Sahabat Laut Jakarta",
      "Bonus 50 Poin Sirkular Tambahan",
    ],
  },
  {
    id: "badge-first-step-diverter",
    title: "First Step Diverter",
    category: "COMMUNITY",
    tier: "BRONZE",
    rarity: "Umum",
    iconName: "package",
    tag: "INIT-5-LOGS",
    description:
      "Langkah Awal Perubahan Berkelanjutan: Berhasil mencatatkan 5 transaksi penyetoran sampah terpilah pertama yang terverifikasi secara kriptografis.",
    milestoneRequirement: "Catat minimal 5 log pemilahan sampah terverifikasi di aplikasi SiklusKita.",
    currentProgress: 5,
    targetProgress: 5,
    unit: "log tercatat",
    unlocked: true,
    unlockedAt: "08 September 2026",
    verificationHash: "sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    perks: [
      "Lencana Pembuka Ekosistem Sirkular",
      "Akses Fitur AI Scanner Multimodal Tanpa Batas",
    ],
  },
  {
    id: "badge-sustainability-impact",
    title: "Best Sustainability Impact",
    category: "AWARD_MILESTONE",
    tier: "PLATINUM",
    rarity: "Legendaris",
    iconName: "leaf",
    tag: "AWARD-IMPACT-2026",
    description:
      "Dianugerahkan kepada inovator yang membuktikan reduksi sampah terukur di atas 10.000 kg dan mencegah emisi gas rumah kaca >10.000 kg CO2e.",
    milestoneRequirement: "Alihkan >10 Ton sampah dari TPA Bantargebang dan buktikan reduksi karbon terverifikasi.",
    currentProgress: 14800,
    targetProgress: 10000,
    unit: "kg sampah",
    unlocked: true,
    unlockedAt: "12 September 2026",
    verificationHash: "sha256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    perks: [
      "Plakat Digital Resmi Greeneration Circle 2026",
      "Prioritas Seleksi Hibah Akselerasi Solusi Lokal",
      "Gelar 'Sustainability Champion' di Profil Warga",
      "Akses Eksklusif Forum Mitra Recycler Nasional",
    ],
  },
  {
    id: "badge-most-innovative",
    title: "Most Innovative Solution",
    category: "AWARD_MILESTONE",
    tier: "PLATINUM",
    rarity: "Legendaris",
    iconName: "sparkles",
    tag: "AWARD-INNOV-2026",
    description:
      "Apresiasi tertinggi untuk implementasi arsitektur cerdas: integrasi AI analitik prediktif, computer vision, cloud auto-scaling, dan enkripsi E2EE solid.",
    milestoneRequirement: "Rancang & aktifkan 4 pilar arsitektur cerdas: AI model, auto-scaling, E2EE, dan real-time sync.",
    currentProgress: 4,
    targetProgress: 4,
    unit: "pilar sistem",
    unlocked: true,
    unlockedAt: "12 September 2026",
    verificationHash: "sha256:a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
    perks: [
      "Trofi Kehormatan 'Tech for Nature Innovation'",
      "Showcase Solusi di Smart City Forum DKI Jakarta",
      "Lencana Terverifikasi Sistem Kriptografi E2EE",
      "Undangan Khusus Sesi Presentasi Akhir 5 Des",
    ],
  },
  {
    id: "badge-green-future",
    title: "Green Future Award",
    category: "AWARD_MILESTONE",
    tier: "PLATINUM",
    rarity: "Legendaris",
    iconName: "trophy",
    tag: "AWARD-FUTURE-2026",
    description:
      "Penghargaan pamungkas untuk roadmap sirkular komprehensif berdaya jangkau tinggi yang mempercepat transisi Jakarta menuju Net Zero Waste 2030.",
    milestoneRequirement: "Raih minimal 400 dukungan warga di ajang Awarding dan selesaikan rencana aksi kota berkelanjutan.",
    currentProgress: 428,
    targetProgress: 400,
    unit: "dukungan warga",
    unlocked: true,
    unlockedAt: "12 September 2026",
    verificationHash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    perks: [
      "Medali Kehormatan Green Future Pioneer",
      "Mentoring Langsung Bersama Dewan Juri Ahli",
      "Rekomendasi Implementasi Kebijakan Dinas LH",
      "Tiket Kehormatan Malam Penganugerahan 12 Des",
    ],
  },
  {
    id: "badge-e2ee-guardian",
    title: "E2EE Privacy Guardian",
    category: "INNOVATION",
    tier: "GOLD",
    rarity: "Istimewa",
    iconName: "shield",
    tag: "CYBER-SEC-256",
    description:
      "Keberhasilan mengamankan seluruh transaksi pemilahan rumah tangga dengan enkripsi end-to-end AES-GCM 256-bit dan buku kas audit digital.",
    milestoneRequirement: "Lakukan audit kriptografi dan validasi integritas hash transaksi tanpa anomali.",
    currentProgress: 3,
    targetProgress: 3,
    unit: "audit segel",
    unlocked: true,
    unlockedAt: "12 September 2026",
    verificationHash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    perks: [
      "Segel Keamanan Data Tingkat Tinggi",
      "Status Rumah Tangga Aman & Terproteksi",
      "Validasi Kepatuhan Standar Privasi Warga",
    ],
  },
  {
    id: "badge-ai-scanner-master",
    title: "AI Vision Scanner Master",
    category: "INNOVATION",
    tier: "GOLD",
    rarity: "Istimewa",
    iconName: "cpu",
    tag: "AI-VISION-PRO",
    description:
      "Menyelesaikan pemindaian dan klasifikasi sampah terpilah menggunakan kecerdasan buatan multimodal secara presisi di level rumah tangga.",
    milestoneRequirement: "Pindai & kategorikan minimal 10 jenis sampah dengan AI Scanner.",
    currentProgress: 12,
    targetProgress: 10,
    unit: "sampel dipindai",
    unlocked: true,
    unlockedAt: "12 September 2026",
    verificationHash: "sha256:d41d8cd98f00b204e9800998ecf8427e0a4f5c9e2b0e9a59b626f2ec52e4f012",
    perks: [
      "Multiplier Bonus Poin Sirkular +15%",
      "Akses Model Pengenalan Sampah Presisi Tinggi",
      "Lencana Identifikasi Pemilah Pintar",
    ],
  },
  {
    id: "badge-streak-pioneer",
    title: "Consistency Streak Champion",
    category: "COMMUNITY",
    tier: "GOLD",
    rarity: "Istimewa",
    iconName: "flame",
    tag: "STREAK-14-DAYS",
    description:
      "Ketekunan konsisten mempertahankan kebiasaan memilah sampah setiap hari selama minimal 14 hari berturut-turut.",
    milestoneRequirement: "Capai 14 hari streak pemilahan aktif tanpa terputus.",
    currentProgress: 14,
    targetProgress: 14,
    unit: "hari aktif",
    unlocked: true,
    unlockedAt: "12 September 2026",
    verificationHash: "sha256:3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2",
    perks: [
      "Aura Api Semangat Hijau pada Avatar",
      "Bonus 100 Poin Sirkular Tambahan Tiap Minggu",
      "Status Panutan Pilah Lingkungan RW 04",
    ],
  },
  {
    id: "badge-community-champion",
    title: "Community Empowerment Hero",
    category: "COMMUNITY",
    tier: "SILVER",
    rarity: "Langka",
    iconName: "users",
    tag: "COMMUNITY-1000",
    description:
      "Menggerakkan lebih dari 1.000 keluarga dan kader Bank Sampah untuk aktif bergotong-royong dalam pemilahan sampah di sumber.",
    milestoneRequirement: "Gerakkan 1.000 kepala keluarga dalam jaringan pilot lingkungan.",
    currentProgress: 1240,
    targetProgress: 1000,
    unit: "kepala keluarga",
    unlocked: true,
    unlockedAt: "11 September 2026",
    verificationHash: "sha256:2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    perks: [
      "Duta Lingkungan Komunitas Greeneration",
      "Pin Kehormatan Penggerak Bank Sampah",
      "Sertifikat Kolaborasi Warga",
    ],
  },
  {
    id: "badge-zero-waste-advocate",
    title: "Zero Food-Waste Pioneer",
    category: "SUSTAINABILITY",
    tier: "SILVER",
    rarity: "Langka",
    iconName: "target",
    tag: "ZERO-FOOD-WASTE",
    description:
      "Mengoptimalkan pemrosesan limbah organik rumah tangga melalui biokonversi maggot BSF dan komposter hingga mencapai 80% daur nutrisi tanah.",
    milestoneRequirement: "Setorkan minimal 100 kg sisa organik ke pusat biokonversi BSF.",
    currentProgress: 118,
    targetProgress: 100,
    unit: "kg organik",
    unlocked: true,
    unlockedAt: "10 September 2026",
    verificationHash: "sha256:0b9c2625dc21ef05f6ad44edd614c26f60e0129504265a409f66b412988824b4",
    perks: [
      "Pasokan Pupuk Organik Cair Gratis Tiap Bulan",
      "Lencana Rumah Tangga Minim Residu",
      "Voucher Bibit Tanaman Urban Farming",
    ],
  },
  {
    id: "badge-circular-master-2030",
    title: "Circular City Master 2030",
    category: "AWARD_MILESTONE",
    tier: "PLATINUM",
    rarity: "Legendaris",
    iconName: "trophy",
    tag: "MASTER-2030-LOCK",
    description:
      "Tantangan bergengsi tingkat lanjut: Replikasi sistem ke 5 wilayah kota DKI Jakarta dan capai 50% target pengalihan sampah daerah.",
    milestoneRequirement: "Kumpulkan total 2.000 poin sirkular dan perluas operasional ke minimal 3 kecamatan tambahan.",
    currentProgress: 380,
    targetProgress: 2000,
    unit: "poin sirkular",
    unlocked: false,
    verificationHash: "sha256:pending_verification_until_expansion_goal_met",
    perks: [
      "Trofi Emas Kehormatan Gubernur DKI Jakarta",
      "Akselerasi Hibah Penuh Rp 100 Juta",
      "Status Dewan Penasihat Muda Lingkungan Hidup",
    ],
  },
];

const BADGE_STORAGE_KEY = "sikluskita_digital_badges_v2";

export function loadSavedBadges(): DigitalBadge[] {
  if (typeof window === "undefined") return INITIAL_DIGITAL_BADGES;
  try {
    const raw = localStorage.getItem(BADGE_STORAGE_KEY);
    if (!raw) return INITIAL_DIGITAL_BADGES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Merge to ensure newly introduced milestone badges exist
      const existingIds = new Set(parsed.map((b: DigitalBadge) => b.id));
      const missing = INITIAL_DIGITAL_BADGES.filter((b) => !existingIds.has(b.id));
      return [...parsed, ...missing];
    }
  } catch (err) {
    console.warn("Failed to parse saved badges:", err);
  }
  return INITIAL_DIGITAL_BADGES;
}

export function saveBadges(badges: DigitalBadge[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(badges));
  } catch (err) {
    console.warn("Failed to persist badges:", err);
  }
}
