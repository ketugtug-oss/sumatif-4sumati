import React, { useEffect, useState } from 'react';
import { ExamResult, Question, TeacherSettings } from '../types/exam';
import { ExamGradingResult } from '../utils/grading';
import { downloadResultCertificatePDF } from '../utils/pdfExport';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  FileDown, 
  RefreshCw, 
  School, 
  Lock, 
  Unlock, 
  ChevronDown, 
  ChevronUp, 
  Award,
  Calendar,
  Clock,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface ExamResultStepProps {
  result: ExamResult;
  grading: ExamGradingResult;
  questions: Question[];
  settings: TeacherSettings;
  onRestart: () => void;
  onOpenTeacherPanel: () => void;
}

export const ExamResultStep: React.FC<ExamResultStepProps> = ({
  result,
  grading,
  questions,
  settings,
  onRestart,
  onOpenTeacherPanel,
}) => {
  const [showDetailedReview, setShowDetailedReview] = useState(false);
  const isPass = result.isPassed;

  // Trigger celebratory confetti on pass
  useEffect(() => {
    if (isPass) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback gracefully if canvas context restricted
      }
    }
  }, [isPass]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div 
        id="result-header-card"
        className={`bg-white border rounded-3xl p-6 sm:p-8 shadow-sm mb-8 text-center relative overflow-hidden ${
          isPass ? 'border-emerald-200' : 'border-amber-200'
        }`}
      >
        <div className={`absolute top-0 left-0 right-0 h-2.5 ${
          isPass 
            ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600' 
            : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500'
        }`} />

        <div className="flex justify-center mb-3">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-inner ${
            isPass ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
          }`}>
            {isPass ? <Trophy className="w-11 h-11" /> : <Award className="w-11 h-11" />}
          </div>
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 inline-block">
          TAHAP 3 — HASIL TES SUMATIF
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
          {isPass ? 'Selamat, Anda LULUS Tes Sumatif!' : 'Hasil Tes Telah Selesai Dinilai'}
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto mb-6">
          SD Negeri 3 Loloan Timur • Kelas V • Matematika (Tes Kemampuan Akademik)
        </p>

        {/* Big Score Card */}
        <div className="max-w-xs mx-auto mb-6">
          <div className={`p-6 rounded-2xl border ${
            isPass 
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900' 
              : 'bg-amber-50/70 border-amber-300 text-amber-900'
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider block mb-1">
              Nilai Akhir Ujian
            </span>
            <div className="text-5xl font-black tracking-tight mb-1">
              {result.score}
            </div>
            <span className="text-xs font-medium text-slate-500 block mb-3">
              Skala 0 - 100
            </span>
            
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold shadow-xs uppercase tracking-wide bg-white border">
              {isPass ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">LULUS (Memenuhi KKTP 70)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-700">BELUM LULUS (Di Bawah KKTP 70)</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Student Identity Overview */}
        <div className="max-w-xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">
              Nama Siswa
            </span>
            <strong className="text-slate-900 font-bold truncate block">
              {result.studentName}
            </strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">
              Nomor Absen
            </span>
            <strong className="text-slate-900 font-bold">
              #{result.attendanceNumber}
            </strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">
              Kelas
            </span>
            <strong className="text-slate-900 font-bold">
              {result.className}
            </strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">
              Batas KKTP
            </span>
            <strong className="text-slate-900 font-bold">
              {result.kktp}
            </strong>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto mt-4">
          <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
            <span className="text-[11px] text-slate-500 font-medium block">Total Soal</span>
            <span className="text-lg font-bold text-slate-900">{result.totalQuestions}</span>
          </div>
          <div className="bg-white border border-emerald-200 rounded-xl p-3 text-center">
            <span className="text-[11px] text-emerald-600 font-medium block">Jawaban Benar</span>
            <span className="text-lg font-bold text-emerald-600">{result.correctAnswersCount}</span>
          </div>
          <div className="bg-white border border-red-200 rounded-xl p-3 text-center">
            <span className="text-[11px] text-red-600 font-medium block">Jawaban Salah</span>
            <span className="text-lg font-bold text-red-600">{result.wrongAnswersCount}</span>
          </div>
        </div>

        {/* Action Buttons: Download PDF & Restart */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            id="btn-download-result-pdf"
            type="button"
            onClick={() => downloadResultCertificatePDF(result)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            Unduh Lembar Hasil (PDF)
          </button>

          <button
            id="btn-restart-exam"
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Kembali ke Halaman Awal
          </button>
        </div>
      </div>

      {/* Answer Review Section */}
      <div 
        id="answer-review-section"
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Kunci Jawaban & Pembahasan Soal
              </h2>
              <p className="text-xs text-slate-500">
                Fitur peninjauan soal setelah ujian
              </p>
            </div>
          </div>

          <div>
            {settings.allowStudentReview ? (
              <button
                id="btn-toggle-review"
                type="button"
                onClick={() => setShowDetailedReview(prev => !prev)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>{showDetailedReview ? 'Sembunyikan Pembahasan' : 'Buka Kunci Jawaban & Pembahasan'}</span>
                {showDetailedReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5" />
                Dinonaktifkan oleh Guru
              </span>
            )}
          </div>
        </div>

        {/* When teacher disabled student review */}
        {!settings.allowStudentReview && (
          <div className="py-6 text-center text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700 mb-1">
              Kunci Jawaban Belum Dibuka
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Sesuai kebijakan ujian sekolah, rincian kunci jawaban dan pembahasan soal dirahasiakan kecuali diaktifkan oleh Guru melalui Panel Guru.
            </p>
          </div>
        )}

        {/* When review is enabled & opened */}
        {settings.allowStudentReview && showDetailedReview && (
          <div className="pt-6 space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 leading-relaxed">
              <strong>Catatan Belajar:</strong> Pelajari pembahasan setiap soal di bawah ini untuk memahami konsep matematika dengan lebih mendalam.
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const detail = grading.details[q.id];
                const isCorrect = detail?.isCorrect ?? false;

                return (
                  <div
                    key={q.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isCorrect 
                        ? 'bg-emerald-50/30 border-emerald-200' 
                        : 'bg-red-50/30 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {q.topic} ({q.difficulty})
                        </span>
                      </div>

                      <div className="shrink-0">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Benar
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100/70 px-2.5 py-0.5 rounded-md">
                            <XCircle className="w-3.5 h-3.5" /> Salah
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm font-medium text-slate-900 mb-3">
                      {q.question}
                    </p>

                    {/* Answer comparison */}
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200 text-xs space-y-2 mb-3">
                      <div>
                        <span className="text-slate-400 font-semibold block">Jawaban Anda:</span>
                        <span className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
                          {formatUserAnswerDisplay(detail?.userAnswer)}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-semibold block">Kunci Jawaban Benar:</span>
                        <span className="font-bold text-emerald-700">
                          {formatCorrectAnswerDisplay(q.correctAnswer)}
                        </span>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-blue-50/60 rounded-xl p-3 text-xs text-slate-700 border border-blue-100">
                      <strong className="text-blue-900 font-bold block mb-1">
                        💡 Pembahasan:
                      </strong>
                      <p className="leading-relaxed text-slate-700">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer link to teacher panel */}
      <div className="text-center">
        <button
          type="button"
          onClick={onOpenTeacherPanel}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          Masuk ke Panel Guru &gt;
        </button>
      </div>
    </div>
  );
};

function formatUserAnswerDisplay(ans: any): string {
  if (ans === undefined || ans === null || ans === '') return '(Tidak dijawab)';
  if (Array.isArray(ans)) {
    return ans.length > 0 ? ans.join(', ') : '(Tidak memilih pilihan)';
  }
  if (typeof ans === 'object') {
    return Object.entries(ans)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ');
  }
  return String(ans);
}

function formatCorrectAnswerDisplay(ans: any): string {
  if (Array.isArray(ans)) {
    return ans.join(', ');
  }
  if (typeof ans === 'object') {
    return Object.entries(ans)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ');
  }
  return String(ans);
}
