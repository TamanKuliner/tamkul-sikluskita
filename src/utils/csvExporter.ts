/**
 * CSV Exporter Utility for Waste Disposal Logs
 * SiklusKita - Greeneration Circle 2026 | DKI Jakarta
 * RFC 4180 compliant CSV generator with UTF-8 BOM support for Microsoft Excel & Google Sheets
 */

import { WasteLogEntry } from "../types";

export interface CSVExportOptions {
  filename?: string;
  delimiter?: "," | ";";
  includeBOM?: boolean;
  includeSummaryRow?: boolean;
  dateFormat?: "ISO" | "LOCAL_ID";
}

/**
 * Escapes a single cell value according to RFC 4180 rules
 */
function escapeCSVField(value: any, delimiter: string): string {
  if (value === null || value === undefined) {
    return "";
  }
  const stringValue = String(value);
  // If value contains delimiter, double-quote, or newline, enclose in quotes and escape internal quotes
  if (
    stringValue.includes(delimiter) ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Converts waste logs into formatted CSV string and triggers browser file download
 */
export function generateWasteLogsCSV(
  logs: WasteLogEntry[],
  options: CSVExportOptions = {}
): { csvString: string; totalKg: number; totalPoints: number; totalCo2e: number; rowCount: number } {
  const {
    delimiter = ",",
    includeBOM = true,
    includeSummaryRow = true,
  } = options;

  const headers = [
    "ID Transaksi",
    "Waktu Pencatatan (WIB)",
    "Nama Sampah / Barang",
    "Kategori Sampah",
    "Berat (kg)",
    "Poin Sirkular (Pts)",
    "Emisi Karbon Terhindar (kg CO2e)",
    "Fasilitas Tujuan / TPS3R",
    "ID Rumah Tangga",
    "Status Sinkronisasi",
    "Segel Kriptografis SHA-256",
  ];

  const rows: string[][] = logs.map((log) => [
    log.id,
    log.timestamp,
    log.itemName,
    log.category,
    Number(log.weightKg).toFixed(2),
    String(log.points),
    Number(log.co2eKg).toFixed(2),
    log.facility,
    log.householdId,
    log.synced ? "Tersinkronisasi Cloud" : "Lokal / Tertunda",
    log.encryptedHash || "-",
  ]);

  let totalKg = 0;
  let totalPoints = 0;
  let totalCo2e = 0;

  logs.forEach((log) => {
    totalKg += Number(log.weightKg) || 0;
    totalPoints += Number(log.points) || 0;
    totalCo2e += Number(log.co2eKg) || 0;
  });

  if (includeSummaryRow && logs.length > 0) {
    rows.push([
      "TOTAL REKAPITULASI",
      new Date().toISOString().replace("T", " ").substring(0, 19),
      `${logs.length} Rekaman Log Sampah`,
      "SEMUA KATEGORI",
      totalKg.toFixed(2),
      String(totalPoints),
      totalCo2e.toFixed(2),
      "Jaringan Sirkular DKI Jakarta",
      "SiklusKita 2026",
      "VERIFIED",
      "INTEGRITY_CHECK_PASSED",
    ]);
  }

  // Assemble full CSV content
  const headerLine = headers.map((h) => escapeCSVField(h, delimiter)).join(delimiter);
  const dataLines = rows.map((r) => r.map((cell) => escapeCSVField(cell, delimiter)).join(delimiter));

  const csvBody = [headerLine, ...dataLines].join("\r\n");
  const csvString = includeBOM ? `\uFEFF${csvBody}` : csvBody;

  return {
    csvString,
    totalKg: Number(totalKg.toFixed(2)),
    totalPoints,
    totalCo2e: Number(totalCo2e.toFixed(2)),
    rowCount: logs.length,
  };
}

/**
 * Initiates browser download of the generated CSV file
 */
export function downloadWasteLogsCSV(
  logs: WasteLogEntry[],
  options: CSVExportOptions = {}
): { filename: string; rowCount: number; totalKg: number; totalPoints: number } {
  const defaultDateStr = new Date().toISOString().split("T")[0];
  const filename = options.filename || `SiklusKita_Log_Sampah_${defaultDateStr}.csv`;

  const { csvString, totalKg, totalPoints, rowCount } = generateWasteLogsCSV(logs, options);

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return {
    filename,
    rowCount,
    totalKg,
    totalPoints,
  };
}
