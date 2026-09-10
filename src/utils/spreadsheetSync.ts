import { ExamResult } from '../types/exam';

export interface SpreadsheetRow {
  timestamp: string;
  studentName: string;
  className: string;
  attendanceNumber: string;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  score: number;
  status: string; // 'LULUS' | 'BELUM LULUS'
  schoolName: string;
}

export function formatResultForSpreadsheet(result: ExamResult): SpreadsheetRow {
  return {
    timestamp: result.timestamp,
    studentName: result.studentName,
    className: result.className || 'Kelas V',
    attendanceNumber: result.attendanceNumber,
    correctAnswersCount: result.correctAnswersCount,
    wrongAnswersCount: result.wrongAnswersCount,
    score: result.score,
    status: result.isPassed ? 'LULUS' : 'BELUM LULUS',
    schoolName: result.schoolName || 'SD NEGERI 3 LOLOAN TIMUR',
  };
}

/**
 * Sends test result to Google Apps Script Webhook
 */
export async function syncResultToGoogleSheet(
  result: ExamResult,
  webhookUrl: string
): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || !webhookUrl.trim().startsWith('http')) {
    return {
      success: false,
      message: 'URL Webhook Google Spreadsheet belum dikonfigurasi di Panel Guru.'
    };
  }

  const payload = formatResultForSpreadsheet(result);

  try {
    // We send payload as JSON string or URLSearchParams.
    // Google Apps Script doPost(e) usually parses JSON or form data.
    // We use mode: 'no-cors' fallback if needed, or standard fetch
    await fetch(webhookUrl.trim(), {
      method: 'POST',
      mode: 'no-cors', // Avoid CORS block on Google Apps Script redirection
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'Data berhasil disinkronisasi ke Google Spreadsheet.'
    };
  } catch (error: any) {
    console.error('Failed to sync to Google Sheet webhook:', error);
    return {
      success: false,
      message: error?.message || 'Gagal terhubung ke Google Spreadsheet webhook.'
    };
  }
}

/**
 * Export results as downloadable CSV with UTF-8 BOM for Microsoft Excel compatibility
 */
export function exportResultsToCSV(results: ExamResult[], filename = 'Rekap_Nilai_SDN3_Loloan_Timur.csv'): void {
  if (results.length === 0) return;

  const headers = [
    'No',
    'Tanggal & Waktu',
    'Nama Siswa',
    'No Absen',
    'Kelas',
    'Sekolah',
    'Jumlah Benar',
    'Jumlah Salah',
    'Nilai Akhir (0-100)',
    'Status Kelulusan (KKTP 70)'
  ];

  const rows = results.map((r, index) => [
    index + 1,
    `"${r.timestamp}"`,
    `"${r.studentName.replace(/"/g, '""')}"`,
    `"${r.attendanceNumber}"`,
    `"${r.className}"`,
    `"${r.schoolName}"`,
    r.correctAnswersCount,
    r.wrongAnswersCount,
    r.score,
    `"${r.isPassed ? 'LULUS' : 'BELUM LULUS'}"`
  ]);

  const csvContent = '\uFEFF' + [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Provides a ready-to-deploy Google Apps Script snippet for teachers
 */
export const GOOGLE_APPS_SCRIPT_SAMPLE = `// ============================================================
// SKRIP GOOGLE APPS SCRIPT UNTUK REKAP OTOMATIS KE SPREADSHEET
// SD NEGERI 3 LOLOAN TIMUR - TES SUMATIF KELAS V
// ============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Pastikan baris judul (header) sudah ada
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Tanggal & Waktu",
        "Nama Siswa",
        "Kelas",
        "Nomor Absen",
        "Jumlah Benar",
        "Jumlah Salah",
        "Nilai Akhir",
        "Status Kelulusan",
        "Sekolah"
      ]);
      // Format header agar rapi
      sheet.getRange(1, 1, 1, 9).setBackground("#2563eb").setFontColor("#ffffff").setFontWeight("bold");
    }
    
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("id-ID"),
      data.studentName || "-",
      data.className || "Kelas V",
      data.attendanceNumber || "-",
      data.correctAnswersCount || 0,
      data.wrongAnswersCount || 0,
      data.score || 0,
      data.status || "-",
      data.schoolName || "SD NEGERI 3 LOLOAN TIMUR"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Data berhasil disimpan" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
