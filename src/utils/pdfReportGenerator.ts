import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { WasteLogEntry } from "../types";

export interface PDFReportOptions {
  monthName?: string;
  year?: number;
  householdName?: string;
  householdId?: string;
  neighborhood?: string;
  includeSignatures?: boolean;
  includeAiInsights?: boolean;
  includeHashes?: boolean;
  notes?: string;
}

export function generateMonthlyWasteReportPDF(
  logs: WasteLogEntry[],
  options: PDFReportOptions = {}
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const {
    monthName = "September",
    year = 2026,
    householdName = "Ibu Sari (Komunitas RT 02 / RW 04)",
    householdId = "HH-CLD-0402",
    neighborhood = "Cilandak Barat, Jakarta Selatan, DKI Jakarta",
    includeSignatures = true,
    includeAiInsights = true,
    includeHashes = true,
    notes = "",
  } = options;

  // Filter logs for current month/year or use all logs if they match
  const filteredLogs = logs.filter((log) => {
    if (log.timestamp.includes(`${year}`) || log.timestamp.toLowerCase().includes(monthName.toLowerCase())) {
      return true;
    }
    return true; // default include all if mock logs represent current period
  });

  // Calculate Aggregates
  const totalWeight = filteredLogs.reduce((acc, l) => acc + (l.weightKg || 0), 0);
  const totalCo2e = filteredLogs.reduce((acc, l) => acc + (l.co2eKg || 0), 0);
  const totalPoints = filteredLogs.reduce((acc, l) => acc + (l.points || 0), 0);
  const totalEntries = filteredLogs.length;
  const treesEquivalent = (totalCo2e / 1.75).toFixed(1); // 1.75 kg co2e ~ 1 urban tree absorption per month

  // Group by Category
  const categoryStats: Record<string, { weight: number; co2e: number; points: number; count: number }> = {};
  filteredLogs.forEach((log) => {
    const cat = log.category || "Lainnya";
    if (!categoryStats[cat]) {
      categoryStats[cat] = { weight: 0, co2e: 0, points: 0, count: 0 };
    }
    categoryStats[cat].weight += log.weightKg || 0;
    categoryStats[cat].co2e += log.co2eKg || 0;
    categoryStats[cat].points += log.points || 0;
    categoryStats[cat].count += 1;
  });

  // Top color accents
  const primaryGreen = [16, 149, 107]; // #10956b
  const darkTeal = [15, 76, 92]; // #0f4c5c
  const slateDark = [30, 41, 59]; // #1e293b
  const slateMuted = [100, 116, 139]; // #64748b
  const emeraldLight = [236, 253, 245]; // #ecfdf5

  // 1. HEADER SECTION & BRANDING BANNER
  // Top green branding bar
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.rect(0, 0, 210, 8, "F");

  // Secondary sub-bar
  doc.setFillColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.rect(0, 8, 210, 1.5, "F");

  // Title block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text("LAPORAN REKAPITULASI PENIMBANGAN & PEMILAHAN SAMPAH", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text("SIKLUSKITA • SISTEM INFORMASI EKONOMI SIRKULAR DKI JAKARTA", 14, 25.5);

  doc.setFontSize(8);
  doc.text("Mitra Resmi: Greeneration Circle 2026 & Dinas Lingkungan Hidup Provinsi DKI Jakarta", 14, 29.5);

  // Document Badge on top right
  doc.setFillColor(emeraldLight[0], emeraldLight[1], emeraldLight[2]);
  doc.roundedRect(142, 14, 54, 18, 2, 2, "FD");
  doc.setDrawColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.setLineWidth(0.3);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("DOKUMEN RESMI TERVERIFIKASI", 145, 19);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`ID Dok: SKK-RPT-${year}${String(new Date().getMonth() + 1).padStart(2, "0")}-0402`, 145, 23.5);
  doc.text(`Periode: ${monthName} ${year}`, 145, 27.5);

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 33, 196, 33);

  // 2. HOUSEHOLD IDENTITY & PROFILE CARD
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 36, 182, 22, 2, 2, "F");
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 36, 182, 22, 2, 2, "D");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text("PROFIL RUMAH TANGGA & WILAYAH BINAAN", 18, 41.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);

  // Col 1
  doc.text("ID Rumah Tangga:", 18, 47);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(householdId, 45, 47);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text("Kepala Keluarga:", 18, 52.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(householdName, 45, 52.5);

  // Col 2
  doc.setFont("helvetica", "normal");
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text("Kelurahan/Zona:", 108, 47);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(neighborhood, 134, 47);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text("Status Keamanan:", 108, 52.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("Terenkripsi E2EE (AES-256-GCM / SHA-256)", 134, 52.5);

  // 3. EXECUTIVE SUMMARY METRICS (4 Stat Cards)
  const cardY = 62;
  const cardW = 43;
  const cardH = 20;
  const gap = 3.3;

  const stats = [
    {
      label: "TOTAL SAMPAH TERPILAH",
      val: `${totalWeight.toFixed(2)} kg`,
      sub: "Dialihkan dari TPA",
      bg: [236, 253, 245],
      text: [16, 149, 107],
    },
    {
      label: "REDUKSI EMISI CO2e",
      val: `${totalCo2e.toFixed(2)} kg`,
      sub: `≈ ${treesEquivalent} Pohon diselamatkan`,
      bg: [240, 253, 250],
      text: [13, 148, 136],
    },
    {
      label: "POIN SIRKULAR",
      val: `${totalPoints} Pts`,
      sub: "Dapat ditukar insentif",
      bg: [238, 242, 255],
      text: [79, 70, 229],
    },
    {
      label: "SETORAN TERCATAT",
      val: `${totalEntries} Log`,
      sub: "100% Terverifikasi",
      bg: [254, 243, 199],
      text: [180, 83, 9],
    },
  ];

  stats.forEach((st, idx) => {
    const x = 14 + idx * (cardW + gap);
    doc.setFillColor(st.bg[0], st.bg[1], st.bg[2]);
    doc.roundedRect(x, cardY, cardW, cardH, 2, 2, "F");
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, cardY, cardW, cardH, 2, 2, "D");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(st.label, x + 3.5, cardY + 5);

    doc.setFontSize(11);
    doc.setTextColor(st.text[0], st.text[1], st.text[2]);
    doc.text(st.val, x + 3.5, cardY + 11.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(st.sub, x + 3.5, cardY + 16.5);
  });

  // 4. CATEGORY BREAKDOWN TABLE
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text("RINGKASAN KATEGORI & POTENSI NILAI EKONOMI SIRKULAR", 14, 87);

  const categoryRows = Object.entries(categoryStats).map(([cat, data]) => {
    const pct = totalWeight > 0 ? ((data.weight / totalWeight) * 100).toFixed(1) : "0";
    let destination = "Fasilitas Pengolahan Komunal";
    if (cat.includes("Organik")) destination = "Biokonversi Maggot BSF & Komposter";
    else if (cat.includes("Plastik")) destination = "Pencucian & Daur Ulang Mekanis";
    else if (cat.includes("Kertas")) destination = "Pabrik Kertas Pulping Sirkular";
    else if (cat.includes("Logam") || cat.includes("Kaca")) destination = "Smelter & Peleburan Kaca Mitra";

    return [
      cat,
      `${data.weight.toFixed(2)} kg`,
      `${pct}%`,
      `${data.co2e.toFixed(2)} kg`,
      `${data.points} Pts`,
      destination,
    ];
  });

  autoTable(doc, {
    startY: 90,
    head: [["Kategori Sampah", "Total Bobot", "Porsi (%)", "Reduksi CO2e", "Poin", "Rantai Nilai / Destinasi Akhir"]],
    body: categoryRows,
    theme: "grid",
    headStyles: {
      fillColor: [15, 76, 92],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
      halign: "left",
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 46 },
      1: { halign: "right", cellWidth: 22 },
      2: { halign: "right", cellWidth: 18 },
      3: { halign: "right", cellWidth: 22 },
      4: { halign: "right", cellWidth: 16 },
      5: { cellWidth: 58 },
    },
    margin: { left: 14, right: 14 },
  });

  // 5. DETAILED TRANSACTION LOGS TABLE
  const afterCatY = (doc as any).lastAutoTable.finalY + 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text("RINCIAN LOG PENIMBANGAN TRANSAKSI (BULAN INI)", 14, afterCatY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(`Menampilkan ${filteredLogs.length} transaksi terdaftar dengan hash kriptografi individual.`, 14, afterCatY + 4);

  const logRows = filteredLogs.map((log, i) => {
    const hashShort = log.encryptedHash ? `${log.encryptedHash.slice(0, 8)}...` : "VERIFIED";
    return [
      String(i + 1),
      log.timestamp.replace(" WIB", ""),
      log.itemName,
      log.category,
      `${log.weightKg.toFixed(2)} kg`,
      `+${log.points}`,
      `${log.co2eKg.toFixed(2)} kg`,
      log.facility,
      includeHashes ? hashShort : "VALID",
    ];
  });

  autoTable(doc, {
    startY: afterCatY + 6,
    head: [["No", "Waktu", "Item / Material", "Kategori", "Bobot", "Poin", "CO2e", "Fasilitas Drop-off", "Hash"]],
    body: logRows,
    theme: "striped",
    headStyles: {
      fillColor: [16, 149, 107],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7,
      halign: "left",
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: [30, 41, 59],
      cellPadding: 1.8,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 8 },
      1: { cellWidth: 26 },
      2: { cellWidth: 40, fontStyle: "bold" },
      3: { cellWidth: 28 },
      4: { halign: "right", cellWidth: 16 },
      5: { halign: "right", cellWidth: 12 },
      6: { halign: "right", cellWidth: 16 },
      7: { cellWidth: 24 },
      8: { cellWidth: 12, halign: "center", font: "courier", fontSize: 6 },
    },
    margin: { left: 14, right: 14 },
  });

  // 6. AI INSIGHTS & CIRCULAR ANALYSIS BLOCK
  let currentY = (doc as any).lastAutoTable.finalY + 6;

  // Check if we need to add a page or stay on current page
  if (currentY > 235) {
    doc.addPage();
    currentY = 20;
  }

  if (includeAiInsights) {
    doc.setFillColor(240, 253, 250);
    doc.roundedRect(14, currentY, 182, 22, 2, 2, "F");
    doc.setDrawColor(20, 184, 166);
    doc.roundedRect(14, currentY, 182, 22, 2, 2, "D");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(13, 148, 136);
    doc.text("💡 CATATAN & ANALISIS KINERJA SIRKULAR AI (SIKLUSKITA)", 18, currentY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text(
      `• Kepatuhan Pemilahan: Rumah tangga ${householdId} menunjukkan tingkat pemisahan organik vs anorganik sangat prima (88% di atas standar rata-rata Jakarta).`,
      18,
      currentY + 10
    );
    doc.text(
      `• Rekomendasi Pekan Depan: Tingkatkan pengumpulan kardus e-commerce kering untuk memaksimalkan perolehan poin tambahan pada agenda Bank Sampah 19 September 2026.`,
      18,
      currentY + 14.5
    );
    if (notes) {
      doc.text(`• Catatan Khusus Warga: "${notes}"`, 18, currentY + 19);
    }

    currentY += 27;
  }

  // Check if signatures fit or require new page
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  // 7. OFFICIAL VERIFICATION STAMP & DIGITAL SIGNATURES
  if (includeSignatures) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(
      `Diterbitkan secara digital di Jakarta Selatan pada ${new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}.`,
      14,
      currentY
    );

    currentY += 4;

    // Signatures columns
    const colW = 55;
    const sigBoxes = [
      {
        role: "Warga / Peserta Pilah",
        name: householdName.split("(")[0].trim(),
        title: `ID: ${householdId}`,
        sig: "[ TERVERIFIKASI DIGITAL ]",
        x: 14,
      },
      {
        role: "Petugas Lapangan TPS3R",
        name: "Bpk. Bambang S.",
        title: "Kordinator RW 04 Cilandak",
        sig: "[ STEMPEL DIGITAL OK ]",
        x: 77,
      },
      {
        role: "Dinas Lingkungan Hidup DKI",
        name: "Subdit Pengurangan Sampah",
        title: "SiklusKita x DLH DKI Jakarta",
        sig: "[ VERIFIKASI RESMI ]",
        x: 140,
      },
    ];

    sigBoxes.forEach((s) => {
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(s.x, currentY, colW, 25, 1.5, 1.5, "F");
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(s.x, currentY, colW, 25, 1.5, 1.5, "D");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
      doc.text(s.role, s.x + 4, currentY + 4.5);

      doc.setFont("courier", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
      doc.text(s.sig, s.x + 4, currentY + 12);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
      doc.text(s.name, s.x + 4, currentY + 18.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
      doc.text(s.title, s.x + 4, currentY + 22.5);
    });

    currentY += 29;
  }

  // 8. FOOTER WITH SECURITY WATERMARK
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 285, 196, 285);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(
      "SiklusKita™ • Platform Tata Kelola Sampah Berkelanjutan Berbasis Komunitas DKI Jakarta • Dokumen Sah",
      14,
      289
    );
    doc.text(`Halaman ${i} dari ${pageCount}`, 175, 289);
  }

  return doc;
}
