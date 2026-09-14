/**
 * Proactive AI Early Warning & Push Notification System
 * SiklusKita - Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Sparkles,
  Send,
  Clock,
  MapPin,
  ShieldAlert,
  Volume2,
  RefreshCw,
  Calendar,
  Zap,
} from "lucide-react";
import { SmartAlert, WasteLogEntry } from "../types";
import { MonthlyQuotaPredictor } from "./MonthlyQuotaPredictor";

interface AlertsViewProps {
  isDarkMode: boolean;
  alerts: SmartAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onRefreshAlerts: () => void;
  isRefreshing: boolean;
  wasteLogs?: WasteLogEntry[];
  onAddWasteLog?: (log: WasteLogEntry) => void;
  onDispatchAlert?: (alert: SmartAlert) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  isDarkMode,
  alerts,
  onAcknowledgeAlert,
  onRefreshAlerts,
  isRefreshing,
  wasteLogs = [],
  onAddWasteLog,
  onDispatchAlert,
}) => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const requestPushPermission = async () => {
    if (typeof Notification !== "undefined") {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === "granted") {
          sendTestPushNotification(
            "Push Notification SiklusKita Aktif!",
            "Anda akan menerima peringatan dini proaktif & pengingat jadwal setor sampah otomatis."
          );
        }
      } catch (err) {
        console.warn("Notification error:", err);
      }
    } else {
      setToastMessage("Browser Notification API disimulasikan secara in-app.");
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const sendTestPushNotification = (title: string, body: string) => {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body,
          icon: "/favicon.ico",
        });
      } catch {
        // In iframe context fallback
      }
    }
    setToastMessage(`[Push Notification Sent]: ${title} - ${body}`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const automatedTasks = [
    {
      id: "task-01",
      title: "Pengingat Setor Bank Sampah Melati",
      schedule: "H-1 Sebelum Hari Minggu 08:00 WIB",
      status: "AUTOMATED_ACTIVE",
      type: "Anorganik (Plastik & Kertas)",
      note: "Mengirim push notification ke warga agar botol & kardus sudah dipipihkan.",
    },
    {
      id: "task-02",
      title: "Jadwal Aerasi Kompos Putar Rotary RW 04",
      schedule: "Setiap 24 Jam (Pukul 09:00 WIB)",
      status: "AUTOMATED_ACTIVE",
      type: "Organik & Biokonversi",
      note: "Mengingatkan kader lingkungan untuk memeriksa tingkat kelembaban tumpukan.",
    },
    {
      id: "task-03",
      title: "Pengosongan Ember Sampah Dapur Malam",
      schedule: "Harian 20:00 WIB",
      status: "AUTOMATED_ACTIVE",
      type: "Food Waste Preventer",
      note: "Mendorong pemisahan sebelum tidur agar tidak menimbulkan bau atau belatung liar.",
    },
  ];

  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  return (
    <div className="space-y-6">
      {/* Push Notification Simulator Banner if triggered */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white shadow-lg flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Volume2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Top Banner Context */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkMode
          ? "bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/30 border-amber-900/50"
          : "bg-gradient-to-r from-amber-50 via-white to-rose-50 border-amber-100 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Sistem Peringatan Dini Pintar & Notifikasi Proaktif AI
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Mendeteksi potensi bottleneck sebelum terjadi: overload kapasitas TPS3R, anomali kelembaban komposter organik, dan kemacetan rute penjemputan armada secara proaktif.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="refresh-ai-alerts-btn"
              onClick={onRefreshAlerts}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Menganalisis Telemetri..." : "Deteksi Ulang AI"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Push Notification Permission & Test Bar */}
      <div className={`p-4 rounded-xl border ${cardBase} flex flex-col sm:flex-row items-center justify-between gap-3`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            <Volume2 className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-semibold">Status Notifikasi Push Perangkat:</div>
            <div className="text-slate-400 text-[11px]">
              {notificationPermission === "granted"
                ? "Izin Aktif — Pengingat jadwal tugas & alert otomatis tersinkron"
                : "Aktifkan notifikasi push browser untuk pengingat jadwal pemilahan"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {notificationPermission !== "granted" ? (
            <button
              id="request-push-perm-btn"
              onClick={requestPushPermission}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
            >
              Aktifkan Push Notifikasi
            </button>
          ) : (
            <button
              id="send-test-push-btn"
              onClick={() =>
                sendTestPushNotification(
                  "[Pengingat] Hari Ini Jadwal Setor Bank Sampah",
                  "Jangan lupa membawa botol PET & kardus ke Balai RW 04 Cilandak sebelum 11:30 WIB."
                )
              }
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Tes Notifikasi Push</span>
            </button>
          )}
        </div>
      </div>

      {/* 🔮 Proactive Monthly Waste Quota & Disposal Limit Early Warning System */}
      <MonthlyQuotaPredictor
        isDarkMode={isDarkMode}
        wasteLogs={wasteLogs}
        onAddWasteLog={onAddWasteLog}
        onDispatchAlert={onDispatchAlert}
        onSendPushNotification={sendTestPushNotification}
        notificationPermission={notificationPermission}
      />

      {/* Active AI Proactive Alerts List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Peringatan Dini Proaktif Terdeteksi ({alerts.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Gemini Anomaly Engine</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => {
            const isCritical = alert.severity === "CRITICAL";
            const isWarning = alert.severity === "WARNING";

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCritical
                    ? "bg-rose-500/10 border-rose-500/40 text-slate-900 dark:text-slate-100"
                    : isWarning
                    ? "bg-amber-500/10 border-amber-500/40 text-slate-900 dark:text-slate-100"
                    : "bg-blue-500/10 border-blue-500/40 text-slate-900 dark:text-slate-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl mt-0.5 ${
                      isCritical
                        ? "bg-rose-500 text-white"
                        : isWarning
                        ? "bg-amber-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}>
                      {isCritical ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : isWarning ? (
                        <ShieldAlert className="w-4 h-4" />
                      ) : (
                        <Info className="w-4 h-4" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm">{alert.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          isCritical
                            ? "bg-rose-200 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                            : isWarning
                            ? "bg-amber-200 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                            : "bg-blue-200 dark:bg-blue-950 text-blue-800 dark:text-blue-300"
                        }`}>
                          {alert.severity}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {alert.message}
                      </p>

                      <div className="mt-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          Aksi Solutif Rekomendasi AI:
                        </span>{" "}
                        <span className="text-slate-700 dark:text-slate-200">
                          {alert.suggestedAction}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-2 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{alert.affectedZone}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{alert.timestamp}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="p-1.5 rounded-lg bg-white/60 dark:bg-slate-800 hover:bg-white text-slate-500 hover:text-emerald-600 text-xs flex-shrink-0 transition"
                    title="Tandai Selesai / Tangani"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Automated Task Scheduling & Habit Reminder Matrix */}
      <div className={`p-5 rounded-2xl border ${cardBase} space-y-4`}>
        <div className="flex items-center justify-between border-b pb-3 dark:border-slate-700">
          <div>
            <h3 className="font-semibold text-sm">Sistem Pengingat Jadwal Tugas Otomatis</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Membangun habit loop pemilahan berulang (Slide 10: "Make It a Habit with Trigger & Reminders")
            </p>
          </div>
          <Calendar className="w-4 h-4 text-emerald-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {automatedTasks.map((task) => (
            <div
              key={task.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/40 space-y-2"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {task.type}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">AKTIF</span>
              </div>

              <div className="font-semibold text-xs text-slate-800 dark:text-slate-100">
                {task.title}
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" />
                <span>{task.schedule}</span>
              </div>

              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1 border-t dark:border-slate-800">
                {task.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
