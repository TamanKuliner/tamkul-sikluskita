/**
 * SiklusKita - Intelligent Waste & Resource Infrastructure Platform
 * Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 * Types definition
 */

export type NavTab =
  | "infrastructure"
  | "scanner"
  | "monitoring"
  | "alerts"
  | "calendar"
  | "security"
  | "sync"
  | "analytics"
  | "integrations"
  | "awarding"
  | "tutorials";

export interface AwardCategory {
  id: string;
  title: string;
  badge: string;
  iconName: string;
  description: string;
  criteria: string[];
  nomineesCount: number;
}

export interface GreenLeaderProject {
  id: string;
  title: string;
  leaderName: string;
  region: string;
  categoryNomination: string;
  summary: string;
  impactMetrics: {
    wasteDivertedKg: number;
    householdsEngaged: number;
    co2eAvoidedKg: number;
  };
  status: "FINALIST" | "NOMINEE";
  votes: number;
}

export interface ResourceAllocationData {
  predictedSurgePercentage: number;
  recommendedFleetAllocation: number;
  bsfMaggotFacilityCapacityKg: number;
  communalCompostAerationScheduleHours: number;
  autoScalingWorkerPods: number;
  efficiencyScorePercent: number;
  carbonAvertedKgEstimated: number;
  operationalCostSavingsPercent: number;
  strategicRecommendation: string;
}

export interface WasteAnalysisResult {
  itemName: string;
  category: "Plastik (PET/HDPE)" | "Organik / Sisa Makanan" | "Kertas & Karton" | "Logam & Kaca" | "B3 & Residu";
  recyclabilityPercent: number;
  sortingInstructions: string[];
  destinationFacility: string;
  pointsEarned: number;
  carbonOffsetKg: number;
  tips: string;
}

export interface WasteLogEntry {
  id: string;
  timestamp: string;
  itemName: string;
  category: string;
  weightKg: number;
  points: number;
  co2eKg: number;
  facility: string;
  householdId: string;
  synced: boolean;
  encryptedHash: string;
}

export interface SmartAlert {
  id: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  message: string;
  suggestedAction: string;
  timestamp: string;
  affectedZone: string;
  acknowledged?: boolean;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "08:00 - 10:30 WIB"
  type: "COLLECTION_PLASTIC" | "COLLECTION_ORGANIC" | "BANK_SAMPAH" | "COMPOST_TURNING" | "WORKSHOP";
  location: string;
  neighborhood: string; // e.g. "RW 04 Cilandak Barat"
  details: string;
  syncedToGoogle?: boolean;
}

export interface ConnectedDevice {
  id: string;
  deviceName: string;
  ip: string;
  status: "ONLINE" | "SYNCED" | "OFFLINE";
  lastSeen: string;
  os: string;
  isCurrentDevice?: boolean;
}

export interface SecurityAuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  rawPayloadSnippet: string;
  sha256Hash: string;
  signature: string;
  verified: boolean;
}

export interface ExternalServiceStatus {
  name: string;
  status: "ACTIVE" | "DEGRADED" | "STANDBY";
  latencyMs: number;
  endpoint?: string;
  details?: string;
}

export interface FunnelMetric {
  stage: string;
  description: string;
  percentage: number;
  usersCount: number;
  targetPercentage: number;
}

export interface DigitalBadge {
  id: string;
  title: string;
  category: "AWARD_MILESTONE" | "SUSTAINABILITY" | "INNOVATION" | "COMMUNITY";
  tier: "PLATINUM" | "GOLD" | "SILVER" | "BRONZE";
  rarity: "Legendaris" | "Istimewa" | "Langka" | "Umum";
  iconName:
    | "trophy"
    | "leaf"
    | "sparkles"
    | "shield"
    | "flame"
    | "users"
    | "cpu"
    | "target"
    | "scale"
    | "calendar"
    | "recycle"
    | "award"
    | "package"
    | "zap";
  tag: string;
  description: string;
  milestoneRequirement: string;
  currentProgress: number;
  targetProgress: number;
  unit: string;
  unlocked: boolean;
  unlockedAt?: string;
  verificationHash: string;
  perks: string[];
}

export interface BankSampahFacility {
  id: string;
  name: string;
  type: "BANK_SAMPAH" | "TPS3R" | "ORGANIC_CENTER" | "DROPBOX_B3";
  typeLabel: string;
  address: string;
  neighborhood: string;
  distanceKm: number;
  capacityPercent: number;
  operatingHours: string;
  operatingDays: string;
  contactPhone: string;
  accepts: string[];
  lat: number;
  lng: number;
  x: number;
  y: number;
  status: "OPEN" | "FULL_SOON" | "CLOSED";
  historicalDropOffCount: number;
  historicalTotalKg: number;
  rating: number;
  verifiedByDlh: boolean;
}

export interface CapacityWatchNotification {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityType: string;
  currentCapacityPercent: number;
  thresholdPercent: number;
  severity: "WARNING" | "CRITICAL";
  timestamp: string;
  suggestedAlternatives: SuggestedAlternativeFacility[];
}

export interface SuggestedAlternativeFacility {
  facility: BankSampahFacility;
  distanceKm: number;
  travelTimeMinutes: number;
  capacityHeadroomPercent: number;
  suitabilityScore: number;
  reasons: string[];
}

export interface DropOffHotspot {
  id: string;
  name: string;
  neighborhood: string;
  dropOffCount: number;
  totalKgWeekly: number;
  dominantWasteType: string;
  intensityScore: number;
  radius: number;
  lat: number;
  lng: number;
  x: number;
  y: number;
}

export interface SmartClassifierProbability {
  label: string;
  category: string;
  confidencePercent: number;
  isPrimary: boolean;
}

export interface SpecificSortingStep {
  stepNumber: number;
  title: string;
  instruction: string;
  urgency: "WAJIB" | "DIREKOMENDASIKAN" | "OPSIONAL";
  whyItMatters: string;
  completed?: boolean;
}

export interface SmartClassifierResult {
  itemName: string;
  scientificName?: string;
  primaryCategory: "Plastik (PET/HDPE)" | "Organik / Sisa Makanan" | "Kertas & Karton" | "Logam & Kaca" | "B3 & Residu";
  overallConfidence: number; // 0 to 100
  confidenceTier: "HIGH" | "MODERATE" | "LOW";
  classProbabilities: SmartClassifierProbability[];
  materialGrade: string; // e.g. "PET (Polyethylene Terephthalate) #1 Clear"
  contaminantStatus: {
    level: "BERSIH" | "KONTAMINASI_RINGAN" | "KONTAMINASI_SEDANG" | "KONTAMINASI_BERAT";
    cleanlinessPercent: number;
    detectedImpurities: string[];
    riskWarning?: string;
  };
  visionAttributes: {
    capPresent: boolean;
    labelDetected: boolean;
    fluidResidue: boolean;
    isCompacted: boolean;
    colorTransparency: string;
  };
  specificSortingInstructions: SpecificSortingStep[];
  destinationFacility: {
    name: string;
    type: string;
    distanceKm: number;
    dropOffRecommendation: string;
  };
  economicValue: {
    pricePerKgRp: number;
    estimatedValueRp: number;
    estimatedWeightGrams: number;
  };
  environmentalImpact: {
    carbonOffsetKg: number;
    waterSavedLiters: number;
    pointsEarned: number;
  };
  circularTips: string;
  source: "gemini-vision" | "algorithmic-vision-heuristic";
  modelVersion: string;
}

export type TutorialCategory =
  | "AI & Computer Vision"
  | "Sanitasi & Pemilahan"
  | "Keamanan Data & Kriptografi"
  | "Resiliensi Offline-First"
  | "Mitigasi & Peringatan Dini"
  | "Logistik Sirkular"
  | "Cloud & Auto-Scaling"
  | "Ekonomi Sirkular & Insentif"
  | "Integrasi Sistem & Webhook"
  | "Kepemimpinan Komunitas";

export interface TutorialPracticeAction {
  id: string;
  label: string;
  description: string;
  completed: boolean;
}

export interface LearningTutorialStep {
  stepNumber: number;
  title: string;
  instruction: string;
  actionPrompt: string;
  toolHint: string;
  expectedOutcome: string;
}

export interface LearningTutorial {
  id: string;
  orderNumber: number;
  title: string;
  subtitle: string;
  category: TutorialCategory;
  targetRole: "Warga / Rumah Tangga" | "Operator Bank Sampah" | "Pengembang Sistem" | "Koordinator RW";
  difficulty: "Pemula" | "Menengah" | "Mahir";
  estimatedMinutes: number;
  xpReward: number;
  iconName: string;
  badgeCode: string;
  whyItMatters: string;
  coreConcepts: string[];
  perdaDKIReference: string;
  steps: LearningTutorialStep[];
  interactivePracticeType:
    | "scanner_vision"
    | "sorting_bench"
    | "crypto_audit"
    | "offline_sync"
    | "tps3r_alert"
    | "smart_calendar"
    | "autoscale_simulator"
    | "circular_economy"
    | "open_api"
    | "green_leader";
  keyTakeaway: string;
  relatedNavTab: NavTab;
}

