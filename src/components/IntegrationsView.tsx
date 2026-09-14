/**
 * External API Integrations Hub & Seamless Gateway
 * SiklusKita - Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState } from "react";
import {
  Cable,
  CheckCircle2,
  ExternalLink,
  Code2,
  Send,
  Zap,
  Copy,
  Server,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";

interface IntegrationsViewProps {
  isDarkMode: boolean;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({ isDarkMode }) => {
  const [activeApiTest, setActiveApiTest] = useState<string>("predict");
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isCallingApi, setIsCallingApi] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const apis = [
    {
      id: "dlh-dki",
      name: "DLH DKI Jakarta Smart Waste Open Gateway",
      description:
        "Pelaporan metrik pemilahan sampah harian rumah tangga DKI & validasi kepatuhan Pergub No. 77 Tahun 2020.",
      status: "CONNECTED",
      endpoint: "https://api.lingkunganhidup.jakarta.go.id/v2/waste-metrics",
      auth: "OAuth 2.0 Bearer (Gov-Cert)",
      protocol: "REST / JSON",
    },
    {
      id: "jakarta-satu",
      name: "Jakarta Satu Geoportal GIS Integration",
      description:
        "Sinkronisasi titik spasial TPS3R, Bank Sampah unit, dan rute navigasi armada motor listrik terpilah.",
      status: "CONNECTED",
      endpoint: "https://jakartasatu.jakarta.go.id/geoserver/wfs",
      auth: "API Key (Spatial Service)",
      protocol: "WFS / GeoJSON",
    },
    {
      id: "gemini-flash",
      name: "Google Gemini 3.8 Flash Multimodal AI",
      description:
        "Klasifikasi visual sampah domestik dan pemodelan prediktif beban timbulan sampah Jakarta Selatan.",
      status: "ACTIVE",
      endpoint: "/api/ai/predict-workload & /api/ai/identify-waste",
      auth: "Server-Side Secret Key",
      protocol: "Antigravity GenAI SDK",
    },
    {
      id: "green-fleet",
      name: "Mitra Logistik Armada Hijau (EV Dispatch)",
      description:
        "Pemesanan kurir motor listrik roda tiga untuk penjemputan sampah anorganik terpilah volume besar.",
      status: "CONNECTED",
      endpoint: "https://api.greenfleet.id/v1/dispatch/schedule",
      auth: "Webhook HMAC SHA-256",
      protocol: "Webhooks",
    },
    {
      id: "calendar-rfc",
      name: "External Calendar Sync (RFC 5545 / iCal & Google)",
      description:
        "Sinkronisasi jadwal penjemputan dan pembalikan kompos komunal ke perangkat kalender warga.",
      status: "ACTIVE",
      endpoint: "webcal://siklukita.jakarta.go.id/calendar/feed.ics",
      auth: "Public Tokenized Feed",
      protocol: "iCalendar / RFC 5545",
    },
    {
      id: "crypto-vault",
      name: "Web Crypto E2EE Ledger Service",
      description:
        "Enkripsi client-side AES-GCM 256-bit dan tanda tangan integritas audit bukti setoran sampah.",
      status: "ACTIVE",
      endpoint: "Local Subsystem / Web Crypto API",
      auth: "Hardware-backed Key (SubtleCrypto)",
      protocol: "W3C Cryptographic Standard",
    },
  ];

  const handleTestApi = async (endpointKey: string) => {
    setIsCallingApi(true);
    setActiveApiTest(endpointKey);

    try {
      if (endpointKey === "predict") {
        const res = await fetch("/api/ai/predict-workload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            region: "Jakarta Selatan (Pilot: Cilandak/Pondok Labu)",
            currentTonnage: 15.2,
            activeHouseholds: 1240,
            surgeScenario: "normal",
          }),
        });
        const data = await res.json();
        setTestResponse(JSON.stringify(data, null, 2));
      } else if (endpointKey === "alerts") {
        const res = await fetch("/api/ai/proactive-alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tps3rSaturation: 82,
            pendingPickups: 9,
            region: "Jakarta Selatan",
          }),
        });
        const data = await res.json();
        setTestResponse(JSON.stringify(data, null, 2));
      } else {
        const res = await fetch("/api/sync");
        const data = await res.json();
        setTestResponse(JSON.stringify(data, null, 2));
      }
    } catch (err: any) {
      setTestResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsCallingApi(false);
    }
  };

  const copySampleKey = () => {
    navigator.clipboard.writeText("sk_live_siklukita_jakarta_2026_nadifa_prod_99x");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  return (
    <div className="space-y-6">
      {/* Top Banner Context */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkMode
          ? "bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/30 border-purple-900/50"
          : "bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-purple-100 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400">
                <Cable className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Integrasi API Eksternal & Gateway Layanan Terbuka
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Menghubungkan ekosistem SiklusKita dengan API Dinas Lingkungan Hidup DKI, Jakarta Satu Geoportal, armada kurir motor listrik, dan kalender eksternal guna memperluas fungsionalitas dan skalabilitas platform.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>6/6 Active API Bridges</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Integrated APIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apis.map((api) => (
          <div
            key={api.id}
            className={`p-4 rounded-xl border ${cardBase} space-y-3 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                  {api.status}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{api.protocol}</span>
              </div>

              <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 mt-2">
                {api.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {api.description}
              </p>
            </div>

            <div className="pt-2 border-t dark:border-slate-700/70 text-[10px] space-y-1 font-mono text-slate-400">
              <div className="truncate">
                <span className="text-slate-500">Auth:</span> {api.auth}
              </div>
              <div className="truncate text-emerald-500">
                <span className="text-slate-500">Path:</span> {api.endpoint}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive API Sandbox & Live Tester */}
      <div className={`p-5 rounded-2xl border ${cardBase} space-y-4`}>
        <div className="flex items-center justify-between border-b pb-3 dark:border-slate-700">
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-500" />
              <span>Interactive API Playground & Gateway Tester</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kirim request langsung ke backend Express platform untuk menguji latensi dan respon JSON
            </p>
          </div>
          <button
            onClick={copySampleKey}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center gap-1 cursor-pointer font-mono"
          >
            <Copy className="w-3 h-3" />
            <span>{copiedKey ? "Tersalin!" : "Salin API Token"}</span>
          </button>
        </div>

        {/* Action buttons for Testing */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleTestApi("predict")}
            disabled={isCallingApi}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeApiTest === "predict"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <Send className="w-3 h-3" />
            <span>POST /api/ai/predict-workload</span>
          </button>

          <button
            onClick={() => handleTestApi("alerts")}
            disabled={isCallingApi}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeApiTest === "alerts"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <Send className="w-3 h-3" />
            <span>POST /api/ai/proactive-alerts</span>
          </button>

          <button
            onClick={() => handleTestApi("sync")}
            disabled={isCallingApi}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeApiTest === "sync"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <Send className="w-3 h-3" />
            <span>GET /api/sync</span>
          </button>
        </div>

        {/* Live Response Viewer */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>HTTP Status: 200 OK • Content-Type: application/json</span>
            <span>Latency: ~45ms</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs max-h-64 overflow-y-auto border border-slate-800">
            {isCallingApi ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Zap className="w-4 h-4 text-purple-400 animate-spin" />
                <span>Menghubungi Endpoint Gateway...</span>
              </div>
            ) : testResponse ? (
              <pre className="whitespace-pre-wrap">{testResponse}</pre>
            ) : (
              <div className="text-slate-500 italic">
                Klik salah satu endpoint di atas untuk mengeksekusi request HTTP dan memeriksa format respon JSON.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
