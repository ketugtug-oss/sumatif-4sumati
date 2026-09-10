import jsPDF from 'jspdf';
import { Question, ExamResult } from '../types/exam';

export function downloadQuestionsPDF(questions: Question[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 15;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > 280) {
      doc.addPage();
      y = 15;
      return true;
    }
    return false;
  };

  // Header Kop Surat
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA - DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(14);
  doc.text('SD NEGERI 3 LOLOAN TIMUR', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Kecamatan Negara, Kabupaten Jembrana, Provinsi Bali', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 1;
  doc.setLineWidth(0.2);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Judul Ujian
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('NASKAH SOAL TES SUMATIF KEMAMPUAN AKADEMIK', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(10);
  doc.text('MATA PELAJARAN: MATEMATIKA | KELAS V (LIMA)', pageWidth / 2, y, { align: 'center' });
  y += 7;

  // Kotak Identitas Siswa
  doc.setDrawColor(180, 180, 180);
  doc.rect(margin, y, contentWidth, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Nama Lengkap : ............................................................', margin + 3, y + 6);
  doc.text('Nomor Absen  : ............................................................', margin + 3, y + 13);
  doc.text('Hari / Tanggal : ..............................................', margin + 95, y + 6);
  doc.text('Waktu          : 90 Menit', margin + 95, y + 13);
  y += 24;

  // Petunjuk Umum
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PETUNJUK UMUM:', margin, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('1. Tulislah nama dan nomor absen pada lembar jawaban yang tersedia.', margin, y);
  y += 4;
  doc.text('2. Bacalah setiap butir soal dengan teliti sebelum menentukan jawaban.', margin, y);
  y += 4;
  doc.text('3. Kerjakan terlebih dahulu soal-soal yang Anda anggap lebih mudah.', margin, y);
  y += 7;

  // Render Soal per Bagian
  const pgQuestions = questions.filter(q => q.type === 'pg');
  const pgKompleks = questions.filter(q => q.type === 'pg_kompleks');
  const kategoriQuestions = questions.filter(q => q.type === 'kategori');
  const isianQuestions = questions.filter(q => q.type === 'isian');

  // Helper renderer
  const renderSectionHeader = (title: string, desc: string) => {
    checkPageBreak(15);
    doc.setFillColor(240, 244, 255);
    doc.rect(margin, y - 4, contentWidth, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(20, 60, 140);
    doc.text(title, margin + 2, y + 2);
    y += 8;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    doc.text(desc, margin + 2, y);
    y += 6;
    doc.setTextColor(0, 0, 0);
  };

  // BAGIAN A: PG
  renderSectionHeader('BAGIAN I: PILIHAN GANDA BIASA (20 SOAL)', 'Pilihlah salah satu jawaban yang paling tepat (A, B, C, atau D)!');

  pgQuestions.forEach((q, idx) => {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`${idx + 1}.`, margin, y);

    doc.setFont('helvetica', 'normal');
    const questionLines = doc.splitTextToSize(q.question, contentWidth - 8);
    doc.text(questionLines, margin + 6, y);
    y += questionLines.length * 4.5 + 2;

    if (q.options) {
      const optionLetters = ['A', 'B', 'C', 'D'];
      q.options.forEach((opt, optIdx) => {
        checkPageBreak(8);
        const optText = `${optionLetters[optIdx]}. ${opt}`;
        const optLines = doc.splitTextToSize(optText, contentWidth - 12);
        doc.text(optLines, margin + 8, y);
        y += optLines.length * 4 + 1;
      });
    }
    y += 3;
  });

  // BAGIAN B: PG KOMPLEKS
  renderSectionHeader('BAGIAN II: PILIHAN GANDA KOMPLEKS (5 SOAL)', 'Pilihlah SEMUA pilihan jawaban yang benar (jawaban benar lebih dari satu)!');

  pgKompleks.forEach((q, idx) => {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`${20 + idx + 1}.`, margin, y);

    doc.setFont('helvetica', 'normal');
    const questionLines = doc.splitTextToSize(q.question, contentWidth - 8);
    doc.text(questionLines, margin + 6, y);
    y += questionLines.length * 4.5 + 2;

    if (q.options) {
      q.options.forEach((opt) => {
        checkPageBreak(8);
        const optText = `[   ]  ${opt}`;
        const optLines = doc.splitTextToSize(optText, contentWidth - 12);
        doc.text(optLines, margin + 8, y);
        y += optLines.length * 4 + 1;
      });
    }
    y += 3;
  });

  // BAGIAN C: KATEGORI
  renderSectionHeader('BAGIAN III: PILIHAN GANDA KOMPLEKS KATEGORI (5 SOAL)', 'Berilah tanda centang atau tulis respon yang sesuai pada masing-masing pernyataan!');

  kategoriQuestions.forEach((q, idx) => {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`${25 + idx + 1}.`, margin, y);

    doc.setFont('helvetica', 'normal');
    const questionLines = doc.splitTextToSize(q.question, contentWidth - 8);
    doc.text(questionLines, margin + 6, y);
    y += questionLines.length * 4.5 + 2;

    if (q.statements) {
      q.statements.forEach((st, stIdx) => {
        checkPageBreak(10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        const stText = `(${String.fromCharCode(97 + stIdx)}) ${st.statement}`;
        const stLines = doc.splitTextToSize(stText, contentWidth - 38);
        doc.text(stLines, margin + 8, y);
        
        // Pilihan Benar / Salah
        const choiceLabels = st.options.join(' / ');
        doc.setFont('helvetica', 'bold');
        doc.text(`[ ${choiceLabels} ]`, pageWidth - margin - 32, y);
        y += Math.max(stLines.length * 4.5, 6);
      });
    }
    y += 3;
  });

  // BAGIAN D: ISIAN SINGKAT
  renderSectionHeader('BAGIAN IV: ISIAN SINGKAT (5 SOAL)', 'Jawablah pertanyaan berikut dengan singkat, tepat, dan jelas!');

  isianQuestions.forEach((q, idx) => {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`${30 + idx + 1}.`, margin, y);

    doc.setFont('helvetica', 'normal');
    const questionLines = doc.splitTextToSize(q.question, contentWidth - 8);
    doc.text(questionLines, margin + 6, y);
    y += questionLines.length * 4.5 + 3;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.text('Jawaban: ............................................................................................', margin + 8, y);
    y += 6;
  });

  // Save
  doc.save('Naskah_Soal_Matematika_KelasV_SDN3_Loloan_Timur.pdf');
}

export function downloadResultCertificatePDF(result: ExamResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Header Sekolah
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('SD NEGERI 3 LOLOAN TIMUR', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Kecamatan Negara, Kabupaten Jembrana, Bali | NPSN: 50100788', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 1;
  doc.setLineWidth(0.2);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Judul Lembar Hasil
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(29, 78, 216);
  doc.text('LEMBAR HASIL TES SUMATIF RESMI', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Mata Pelajaran: Matematika | Materi: Tes Kemampuan Akademik', pageWidth / 2, y, { align: 'center' });
  y += 9;

  // Kotak Identitas Siswa
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 40, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('DATA IDENTITAS SISWA', margin + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const leftCol = margin + 6;
  const rightCol = margin + 85;

  doc.text('Nama Lengkap', leftCol, y + 15);
  doc.text(`: ${result.studentName}`, leftCol + 30, y + 15);

  doc.text('Nomor Absen', leftCol, y + 23);
  doc.text(`: ${result.attendanceNumber}`, leftCol + 30, y + 23);

  doc.text('Kelas', leftCol, y + 31);
  doc.text(`: ${result.className || 'Kelas V (Lima)'}`, leftCol + 30, y + 31);

  doc.text('Waktu Selesai', rightCol, y + 15);
  doc.text(`: ${result.timestamp}`, rightCol + 26, y + 15);

  doc.text('KKTP Minimum', rightCol, y + 23);
  doc.text(`: ${result.kktp || 70} Poin`, rightCol + 26, y + 23);

  doc.text('Sekolah', rightCol, y + 31);
  doc.text(`: ${result.schoolName || 'SDN 3 Loloan Timur'}`, rightCol + 26, y + 31);

  y += 48;

  // Kotak Nilai Besar
  const isPass = result.isPassed;
  const scoreBoxColor = isPass ? [240, 253, 244] : [254, 242, 242]; // green / red
  const strokeColor = isPass ? [34, 197, 94] : [239, 68, 68];
  
  doc.setFillColor(scoreBoxColor[0], scoreBoxColor[1], scoreBoxColor[2]);
  doc.setDrawColor(strokeColor[0], strokeColor[1], strokeColor[2]);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 48, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(isPass ? 22 : 185, isPass ? 101 : 28, isPass ? 52 : 28);
  doc.text('HASIL EVALUASI CAPAIAN PEMBELAJARAN', pageWidth / 2, y + 9, { align: 'center' });

  // Angka Skor Besar
  doc.setFontSize(36);
  doc.text(`${result.score}`, pageWidth / 2, y + 26, { align: 'center' });
  doc.setFontSize(10);
  doc.text('/ 100 Poin', pageWidth / 2, y + 33, { align: 'center' });

  // Badge Status
  const statusText = isPass ? 'MEMENUHI KKTP (LULUS)' : 'BELUM MEMENUHI KKTP (BELUM LULUS)';
  doc.setFontSize(11);
  doc.text(statusText, pageWidth / 2, y + 42, { align: 'center' });

  y += 56;

  // Rincian Pengerjaan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('RINCIAN JAWABAN TES:', margin, y);
  y += 6;

  // Tabel Statistik Mini
  const tableWidth = pageWidth - margin * 2;
  const colW = tableWidth / 4;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, tableWidth, 18, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Total Soal', margin + colW * 0 + colW / 2, y + 6, { align: 'center' });
  doc.text('Jawaban Benar', margin + colW * 1 + colW / 2, y + 6, { align: 'center' });
  doc.text('Jawaban Salah', margin + colW * 2 + colW / 2, y + 6, { align: 'center' });
  doc.text('KKTP Batas Lulus', margin + colW * 3 + colW / 2, y + 6, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`${result.totalQuestions || 35}`, margin + colW * 0 + colW / 2, y + 13, { align: 'center' });
  
  doc.setTextColor(22, 163, 74);
  doc.text(`${result.correctAnswersCount}`, margin + colW * 1 + colW / 2, y + 13, { align: 'center' });
  
  doc.setTextColor(220, 38, 38);
  doc.text(`${result.wrongAnswersCount}`, margin + colW * 2 + colW / 2, y + 13, { align: 'center' });
  
  doc.setTextColor(15, 23, 42);
  doc.text(`${result.kktp || 70}`, margin + colW * 3 + colW / 2, y + 13, { align: 'center' });

  y += 28;

  // Catatan Guru & Tanda Tangan
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  const noteText = isPass 
    ? '* Selamat! Anda telah mencapai Kriteria Ketercapaian Tujuan Pembelajaran (KKTP). Pertahankan dan tingkatkan prestasi belajarmu.'
    : '* Perlu pendampingan belajar dan penguatan materi terkait operasi hitung pecahan dan penalaran bangun ruang sebelum tes remedial.';
  doc.text(doc.splitTextToSize(noteText, tableWidth), margin, y);

  y += 18;

  // Kolom Tanda Tangan
  const sigDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const signX = pageWidth - margin - 60;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(`Negara, ${sigDate}`, signX, y);
  y += 5;
  doc.text('Guru Mata Pelajaran Matematika', signX, y);
  y += 20;
  doc.setFont('helvetica', 'bold');
  doc.text('( .................................................... )', signX, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('NIP. .................................................', signX, y);

  // Download PDF
  doc.save(`Hasil_Tes_${result.studentName.replace(/\s+/g, '_')}_Absen${result.attendanceNumber}.pdf`);
}
