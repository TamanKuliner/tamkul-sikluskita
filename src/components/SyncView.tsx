/**
 * Cross-Device Real-Time Sync & Offline Outbox Manager View
 * SiklusKita - Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState } from "react";
import {
  RefreshCw,
  Smartphone,
  Laptop,
  Tablet,
  Wifi,
  WifiOff,
  Database,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { ConnectedDevice, WasteLogEntry } from "../types";
import { syncManager } from "../utils/syncManager";

interface SyncViewProps {
  isDarkMode: boolean;
  devices: ConnectedDevice[];
  isOfflineSimulated: boolean;
  setIsOfflineSimulated: (offline: boolean) => void;
  pendingOfflineCount: number;
  offlineQueue: WasteLogEntry[];
  onManualSync: () => void;
  isSyncing: boolean;
  onClearOfflineQueue: () => void;
  onAddDummyOfflineItem: () => void;
}

export const SyncView: React.FC<SyncViewProps> = ({
  isDarkMode,
  devices,
  isOfflineSimulated,
  setIsOfflineSimulated,
  pendingOfflineCount,
  offlineQueue,
  onManualSync,
  isSyncing,
  onClearOfflineQueue,
  onAddDummyOfflineItem,
}) => {
  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  return (
    <div className="space-y-6">
      {/* Top Banner Context */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkMode
          ? "bg-gradient-to-r from-cyan-950/40 via-slate-900 to-emerald-950/30 border-cyan-900/50"
          : "bg-gradient-to-r from-cyan-50 via-white to-emerald-50 border-cyan-100 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Sinkronisasi Data Real-Time Antar Perangkat & Dukungan Offline
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Memastikan data mutasi pemilahan, saldo poin sirkular, dan jadwal tugas selalu tersinkronisasi mulus lintas smartphone, tablet petugas TPS3R, dan web console secara instan via BroadcastChannel & WebSockets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="trigger-full-sync-btn"
              onClick={onManualSync}
              disabled={isSyncing || isOfflineSimulated}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm ${
                isOfflineSimulated
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20 cursor-pointer"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Menyinkronkan Data..." : "Sinkronisasi Sekarang"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Offline Toggle Card */}
        <div className={`p-4 rounded-xl border ${cardBase} space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Status Konektivitas</span>
            {isOfflineSimulated ? (
              <WifiOff className="w-4 h-4 text-amber-500 animate-pulse" />
            ) : (
              <Wifi className="w-4 h-4 text-emerald-500" />
            )}
          </div>
          <div className="text-lg font-bold">
            {isOfflineSimulated ? "Mode Offline Aktif" : "Online Terhubung"}
          </div>
          <p className="text-[11px] text-slate-400">
            {isOfflineSimulated
              ? "Semua perubahan disimpan dalam antrean lokal offline outbox."
              : "Terhubung langsung ke server cloud run & node sinkronisasi."}
          </p>
          <button
            id="toggle-offline-card-btn"
            onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
            className={`w-full mt-2 py-2 px-3 rounded-lg text-xs font-semibold transition ${
              isOfflineSimulated
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
            }`}
          >
            {isOfflineSimulated ? "Pulihkan Koneksi (Kembali Online)" : "Simulasikan Mode Offline"}
          </button>
        </div>

        {/* Pending Queue Count */}
        <div className={`p-4 rounded-xl border ${cardBase} space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Antrean Offline Outbox</span>
            <Database className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-lg font-bold">
            {pendingOfflineCount} Transaksi
          </div>
          <p className="text-[11px] text-slate-400">
            Akan otomatis di-batch kirim saat koneksi internet kembali pulih.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={onAddDummyOfflineItem}
              className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1"
            >
              <PlusCircle className="w-3 h-3" />
              <span>+ Log Offline</span>
            </button>
            {pendingOfflineCount > 0 && (
              <button
                onClick={onClearOfflineQueue}
                className="py-1.5 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-[11px] font-semibold"
                title="Hapus antrean"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Latency & Protocol */}
        <div className={`p-4 rounded-xl border ${cardBase} space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Protokol & Latensi</span>
            <ArrowUpDown className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
            32 ms • BroadcastChannel
          </div>
          <p className="text-[11px] text-slate-400">
            Sinkronisasi instan antar-tab browser & WebSocket gateway Jakarta.
          </p>
          <div className="text-[10px] text-emerald-500 font-mono mt-2">
            ✓ Delta-state compression active
          </div>
        </div>
      </div>

      {/* Connected Devices Registry */}
      <div className={`p-5 rounded-2xl border ${cardBase} space-y-4`}>
        <div className="flex items-center justify-between border-b pb-3 dark:border-slate-700">
          <div>
            <h3 className="font-semibold text-sm">Perangkat Terhubung & Tersinkronisasi ({devices.length})</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daftar sesi aktif yang berbagi status buku kas sirkular dan jadwal secara real-time
            </p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
            All Synced
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {devices.map((device) => {
            const isPhone = device.deviceName.toLowerCase().includes("iphone") || device.deviceName.toLowerCase().includes("mobile");
            const isTab = device.deviceName.toLowerCase().includes("tab");

            return (
              <div
                key={device.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {isPhone ? (
                      <Smartphone className="w-4 h-4" />
                    ) : isTab ? (
                      <Tablet className="w-4 h-4" />
                    ) : (
                      <Laptop className="w-4 h-4" />
                    )}
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    device.status === "ONLINE"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                  }`}>
                    {device.status}
                  </span>
                </div>

                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>{device.deviceName}</span>
                    {device.isCurrentDevice && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500 text-white font-semibold">
                        KONSOL INI
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">{device.ip}</div>
                </div>

                <div className="pt-2 border-t dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>OS: {device.os}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{device.lastSeen}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offline Outbox Queue Detail Table */}
      {offlineQueue.length > 0 && (
        <div className={`p-5 rounded-2xl border ${cardBase} space-y-3`}>
          <div className="flex items-center justify-between border-b pb-3 dark:border-slate-700">
            <div>
              <h3 className="font-semibold text-sm">Daftar Antrean Transaksi Offline (Outbox Queue)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Akan otomatis di-dispatch ke server saat koneksi terhubung kembali
              </p>
            </div>
            <button
              onClick={onClearOfflineQueue}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
            >
              Kosongkan Antrean
            </button>
          </div>

          <div className="space-y-2">
            {offlineQueue.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-bold">{item.itemName}</span>
                  <span className="text-[11px] text-slate-400 ml-2">({item.category})</span>
                  <div className="text-[10px] text-slate-500">Disimpan lokal: {item.timestamp}</div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-amber-600">+{item.points} Poin</span>
                  <span className="text-[10px] text-slate-400 block">Menunggu Sinkronisasi</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
