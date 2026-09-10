import React, { useState } from 'react';
import { StudentIdentity, Question } from '../types/exam';
import { 
  GraduationCap, 
  User, 
  ListOrdered, 
  ArrowRight, 
  FileDown, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  School,
  Clock
} from 'lucide-react';
import { downloadQuestionsPDF } from '../utils/pdfExport';

interface StudentIdentityStepProps {
  onStartExam: (identity: StudentIdentity) => void;
  questions: Question[];
  onOpenTeacherPanel: () => void;
}

export const StudentIdentityStep: React.FC<StudentIdentityStepProps> = ({
  onStartExam,
  questions,
  onOpenTeacherPanel,
}) => {
  const [fullName, setFullName] = useState('');
  const [attendanceNumber, setAttendanceNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Harap masukkan Nama Lengkap siswa terlebih dahulu.');
      return;
    }
    if (!attendanceNumber.trim()) {
      setError('Harap masukkan Nomor Absen siswa terlebih dahulu.');
      return;
    }

    const num = parseInt(attendanceNumber, 10);
    if (isNaN(num) || num < 1 || num > 60) {
      setError('Nomor absen harus berupa angka antara 1 sampai 60.');
      return;
    }

    setError(null);
    onStartExam({
      fullName: fullName.trim(),
      attendanceNumber: attendanceNumber.trim(),
      className: 'Kelas V (Lima)',
      schoolName: 'SD NEGERI 3 LOLOAN TIMUR',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Top Header Card */}
      <div 
        id="school-banner-card"
        className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 mb-8 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />
        
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shadow-inner">
            <School className="w-9 h-9" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 tracking-wide uppercase">
          <ShieldCheck className="w-3.5 h-3.5" /> Ujian Sumatif Kurikulum Merdeka
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
          SD NEGERI 3 LOLOAN TIMUR
        </h1>
        <p className="text-sm font-medium text-slate-500 mb-4">
          Kecamatan Negara, Kabupaten Jembrana, Bali
        </p>

        <div className="inline-flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold">
            Kelas: V (Lima)
          </span>
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-semibold">
            Mata Pelajaran: Matematika
          </span>
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold">
            Materi: Tes Kemampuan Akademik
          </span>
          <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold">
            KKTP: 70
          </span>
        </div>
      </div>

      {/* Main Grid: Info + Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Exam Rules & PDF Download */}
        <div className="md:col-span-5 space-y-6">
          <div 
            id="exam-information-box"
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Struktur Soal Ujian (35 Soal)
            </h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-slate-800 font-semibold">20 Soal Pilihan Ganda</strong>
                  <br />
                  <span className="text-xs text-slate-500">1 pilihan jawaban benar (A, B, C, D)</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-slate-800 font-semibold">5 Soal PG Kompleks</strong>
                  <br />
                  <span className="text-xs text-slate-500">Lebih dari 1 pilihan jawaban benar</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-slate-800 font-semibold">5 Soal Kategori Pernyataan</strong>
                  <br />
                  <span className="text-xs text-slate-500">Respon Benar/Salah & Sesuai/Tidak</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-slate-800 font-semibold">5 Soal Isian Singkat</strong>
                  <br />
                  <span className="text-xs text-slate-500">Ketikkan angka atau jawaban ringkas</span>
                </span>
              </li>
            </ul>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Soal dan pilihan jawaban diacak otomatis.</span>
            </div>
          </div>

          {/* Download PDF button */}
          <div 
            id="download-question-card"
            className="bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-100 rounded-2xl p-5"
          >
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Perlu Lembar Soal Cetak?
            </h3>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Unduh seluruh 35 butir soal dalam format PDF standar sekolah lengkap dengan kop resmi dan kolom isian.
            </p>
            <button
              id="btn-download-questions-pdf"
              type="button"
              onClick={() => downloadQuestionsPDF(questions)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-blue-600" />
              Unduh File Soal (PDF)
            </button>
          </div>
        </div>

        {/* Right Column: Student Identity Form (Tahap 1) */}
        <div className="md:col-span-7">
          <div 
            id="student-identity-card"
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  TAHAP 1
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Identitas Siswa
                </h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                1/3
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Silakan lengkapi data diri Anda dengan benar sebelum memulai pengerjaan tes. Data ini wajib diisi.
            </p>

            {error && (
              <div 
                id="form-error-banner"
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2.5 animate-in fade-in"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Field 1: Nama Lengkap */}
              <div>
                <label 
                  htmlFor="input-student-fullname"
                  className="block text-sm font-bold text-slate-800 mb-1.5"
                >
                  Nama Lengkap Siswa <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="input-student-fullname"
                    type="text"
                    required
                    placeholder="Contoh: I Putu Arya Pratama"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Isikan nama sesuai dengan buku absen kelas.
                </p>
              </div>

              {/* Field 2: Nomor Absen */}
              <div>
                <label 
                  htmlFor="input-student-attendance"
                  className="block text-sm font-bold text-slate-800 mb-1.5"
                >
                  Nomor Absen <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <ListOrdered className="w-5 h-5" />
                  </div>
                  <input
                    id="input-student-attendance"
                    type="number"
                    min="1"
                    max="60"
                    required
                    placeholder="Contoh: 12"
                    value={attendanceNumber}
                    onChange={(e) => setAttendanceNumber(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Masukkan nomor urut absen Anda (angka 1 - 60).
                </p>
              </div>

              {/* Readonly School & Class Fields */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                    Kelas
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    V (Lima)
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                    Mata Pelajaran
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    Matematika
                  </span>
                </div>
              </div>

              {/* Submit Button: Mulai Tes */}
              <div className="pt-4">
                <button
                  id="btn-start-exam"
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base rounded-xl shadow-md shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <GraduationCap className="w-5 h-5" />
                  Mulai Tes Sekarang
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Discreet Teacher Portal Link in Footer */}
      <div className="mt-12 text-center">
        <button
          id="btn-open-teacher-login"
          type="button"
          onClick={onOpenTeacherPanel}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          Panel Guru & Rekap Nilai
        </button>
      </div>
    </div>
  );
};
