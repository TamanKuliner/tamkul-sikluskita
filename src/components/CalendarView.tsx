/**
 * External Calendar Integration & Waste Schedule Management
 * SiklusKita - Fahira Shanin Nadifa | Greeneration Circle 2026 | DKI Jakarta
 */

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  ExternalLink,
  Plus,
  CheckCircle2,
  CalendarDays,
  Bell,
  Sparkles,
} from "lucide-react";
import { ScheduleEvent } from "../types";
import { createGoogleCalendarUrl, downloadIcsFile } from "../utils/calendar";

interface CalendarViewProps {
  isDarkMode: boolean;
  events: ScheduleEvent[];
  onAddEvent: (event: ScheduleEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ isDarkMode, events, onAddEvent }) => {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("2026-09-21");
  const [newTime, setNewTime] = useState("08:30 - 10:30 WIB");
  const [newType, setNewType] = useState<ScheduleEvent["type"]>("BANK_SAMPAH");
  const [newLocation, setNewLocation] = useState("Bank Sampah Melati RW 04");
  const [newNeighborhood, setNewNeighborhood] = useState("Cilandak Barat");
  const [newDetails, setNewDetails] = useState("Setor sampah terpilah rumah tangga mingguan.");

  const filteredEvents = events.filter((ev) => {
    if (filterType === "ALL") return true;
    return ev.type === filterType;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const event: ScheduleEvent = {
      id: `EVT-${Date.now().toString(36).toUpperCase()}`,
      title: newTitle,
      date: newDate,
      time: newTime,
      type: newType,
      location: newLocation,
      neighborhood: newNeighborhood,
      details: newDetails,
    };

    onAddEvent(event);
    setShowAddModal(false);
    setNewTitle("");
  };

  const cardBase = isDarkMode
    ? "bg-slate-800/80 border-slate-700/80 text-slate-100"
    : "bg-white border-slate-200/80 text-slate-800 shadow-sm";

  return (
    <div className="space-y-6">
      {/* Top Banner Context */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkMode
          ? "bg-gradient-to-r from-blue-950/40 via-slate-900 to-emerald-950/30 border-blue-900/50"
          : "bg-gradient-to-r from-blue-50 via-white to-emerald-50 border-blue-100 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Integrasi Kalender Eksternal & Manajemen Jadwal Terpadu
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Sinkronisasikan jadwal penjemputan sampah organik, hari buka Bank Sampah, dan aerasi komposter langsung ke Google Calendar, Apple Calendar, atau unduh berkas standar iCal (.ics).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="open-add-event-btn"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm shadow-emerald-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Jadwalkan Penjemputan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "ALL", label: "Semua Jadwal" },
          { id: "BANK_SAMPAH", label: "Bank Sampah Anorganik" },
          { id: "COLLECTION_ORGANIC", label: "Penjemputan Organik" },
          { id: "COMPOST_TURNING", label: "Aerasi Kompos Komunal" },
          { id: "COLLECTION_PLASTIC", label: "Drive Pilah Plastik" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
              filterType === f.id
                ? "bg-blue-600 text-white font-semibold shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Schedule Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((event) => {
          const googleUrl = createGoogleCalendarUrl(event);

          return (
            <div
              key={event.id}
              className={`p-5 rounded-2xl border transition-all ${cardBase} space-y-3 hover:border-emerald-500/50`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    event.type === "BANK_SAMPAH"
                      ? "bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300"
                      : event.type === "COLLECTION_ORGANIC"
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                      : event.type === "COMPOST_TURNING"
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                      : "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300"
                  }`}>
                    {event.type.replace(/_/g, " ")}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 pt-1">
                    {event.title}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {event.date}
                  </div>
                  <div className="text-[10px] text-slate-400">{event.time}</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {event.details}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span className="truncate">{event.location} ({event.neighborhood})</span>
              </div>

              {/* Sync Actions */}
              <div className="pt-3 border-t dark:border-slate-700/80 flex items-center justify-between gap-2">
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Calendar</span>
                </a>

                <button
                  onClick={() => downloadIcsFile(event)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Unduh file .ics untuk Apple Calendar / Outlook"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh .ICS</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-6 rounded-2xl border ${cardBase} space-y-4 shadow-xl`}>
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-700">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-500" />
                <span>Tambah Jadwal / Penjemputan Baru</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Judul Kegiatan / Penjemputan:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Setor Minyak Jelantah & Botol PET"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Tanggal:</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Waktu (WIB):</label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Tipe Aktivitas:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                >
                  <option value="BANK_SAMPAH">Bank Sampah Anorganik</option>
                  <option value="COLLECTION_ORGANIC">Penjemputan Sampah Dapur (Organik)</option>
                  <option value="COMPOST_TURNING">Pembalikan & Aerasi Kompos RW</option>
                  <option value="COLLECTION_PLASTIC">Gerakan Pilah Botol & Kardus</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Lokasi / Titik Kumpul:</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Catatan & Detail:</label>
                <textarea
                  rows={2}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
