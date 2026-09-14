/**
 * External Calendar Integration Utilities
 * Google Calendar URL & .ics iCalendar exporter
 * SiklusKita - Fahira Shanin Nadifa | Greeneration Circle 2026
 */

import { ScheduleEvent } from "../types";

export function createGoogleCalendarUrl(event: ScheduleEvent): string {
  const [startHour, endHour] = event.time.split("-").map((t) => t.trim().replace(" WIB", ""));
  const dateFormatted = event.date.replace(/-/g, "");

  const startIso = `${dateFormatted}T${startHour.replace(":", "")}00Z`;
  const endIso = endHour
    ? `${dateFormatted}T${endHour.replace(":", "")}00Z`
    : `${dateFormatted}T100000Z`;

  const title = encodeURIComponent(`[SiklusKita] ${event.title}`);
  const details = encodeURIComponent(
    `${event.details}\n\nLokasi: ${event.location} (${event.neighborhood})\nProgram Inovasi: SiklusKita - Greeneration Circle 2026 DKI Jakarta`
  );
  const location = encodeURIComponent(`${event.location}, DKI Jakarta`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}&sf=true&output=xml`;
}

export function downloadIcsFile(event: ScheduleEvent) {
  const dateFormatted = event.date.replace(/-/g, "");
  const [startHour, endHour] = event.time.split("-").map((t) => t.trim().replace(" WIB", ""));
  const startIso = `${dateFormatted}T${startHour.replace(":", "")}00Z`;
  const endIso = endHour
    ? `${dateFormatted}T${endHour.replace(":", "")}00Z`
    : `${dateFormatted}T100000Z`;

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SiklusKita//Greeneration Circle 2026//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:sikluskita-${event.id}-${Date.now()}@greeneration.id`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:[SiklusKita] ${event.title}`,
    `DESCRIPTION:${event.details.replace(/\n/g, "\\n")}\\nLokasi: ${event.location}`,
    `LOCATION:${event.location}, DKI Jakarta`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Pengingat 30 Menit Jadwal SiklusKita",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsLines], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `sikluskita-${event.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
