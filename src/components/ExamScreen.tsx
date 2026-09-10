import React, { useState, useEffect } from 'react';
import { Question, StudentAnswer, StudentIdentity } from '../types/exam';
import { isAnswerGiven } from '../utils/grading';
import { downloadQuestionsPDF } from '../utils/pdfExport';
import { 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  LayoutGrid, 
  CheckCircle2, 
  AlertCircle, 
  FileDown, 
  School,
  X,
  Clock,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface ExamScreenProps {
  identity: StudentIdentity;
  questions: Question[];
  rawQuestions: Question[]; // original unshuffled for PDF
  answers: Record<number, StudentAnswer>;
  onAnswerChange: (questionId: number, answer: StudentAnswer) => void;
  onSubmitExam: () => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  identity,
  questions,
  rawQuestions,
  answers,
  onAnswerChange,
  onSubmitExam,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPaletteModal, setShowPaletteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [validationAlert, setValidationAlert] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;

  // Calculate answered count
  const answeredQuestionIds = questions
    .filter(q => isAnswerGiven(q, answers[q.id]))
    .map(q => q.id);

  const answeredCount = answeredQuestionIds.length;
  const progressPercent = Math.round((answeredCount / totalQ) * 100);

  // Check unanswered questions
  const unansweredIndices = questions
    .map((q, idx) => ({ q, displayNum: idx + 1 }))
    .filter(item => !isAnswerGiven(item.q, answers[item.q.id]));

  const allAnswered = unansweredIndices.length === 0;

  // Handlers for single choice (pg)
  const handleSelectOption = (option: string) => {
    onAnswerChange(currentQ.id, option);
    setValidationAlert(null);
  };

  // Handlers for multiple choice (pg_kompleks)
  const handleToggleMultiOption = (option: string) => {
    const current = (Array.isArray(answers[currentQ.id]) ? answers[currentQ.id] : []) as string[];
    let updated: string[];
    if (current.includes(option)) {
      updated = current.filter(item => item !== option);
    } else {
      updated = [...current, option];
    }
    onAnswerChange(currentQ.id, updated);
    setValidationAlert(null);
  };

  // Handlers for statement matrix (kategori)
  const handleSelectCategory = (statementId: string, value: string) => {
    const current = (typeof answers[currentQ.id] === 'object' && !Array.isArray(answers[currentQ.id]) 
      ? answers[currentQ.id] 
      : {}) as Record<string, string>;

    const updated = {
      ...current,
      [statementId]: value,
    };
    onAnswerChange(currentQ.id, updated);
    setValidationAlert(null);
  };

  // Handlers for short answer (isian)
  const handleIsianChange = (text: string) => {
    onAnswerChange(currentQ.id, text);
    setValidationAlert(null);
  };

  // Submission validation
  const handleAttemptSubmit = () => {
    if (!allAnswered) {
      const missingList = unansweredIndices.map(item => item.displayNum).join(', ');
      setValidationAlert(
        `Anda belum dapat mengirim ujian. Masih ada ${unansweredIndices.length} nomor yang belum dijawab: Soal No. ${missingList}. Harap lengkapi semua soal!`
      );
      setShowPaletteModal(true);
      return;
    }
    setValidationAlert(null);
    setShowConfirmModal(true);
  };

  const getQuestionTypeLabel = (type: Question['type']) => {
    switch (type) {
      case 'pg':
        return 'Pilihan Ganda (1 Jawaban)';
      case 'pg_kompleks':
        return 'Pilihan Ganda Kompleks (Bisa > 1 Jawaban)';
      case 'kategori':
        return 'Pernyataan Respon Kategori';
      case 'isian':
        return 'Isian Singkat';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Top Bar: Identity & Progress */}
      <header 
        id="exam-top-bar"
        className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-6 sticky top-2 z-20 backdrop-blur-md bg-white/95"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-800">
                  {identity.fullName}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-blue-100/70 text-blue-800 text-[11px] font-bold">
                  Absen #{identity.attendanceNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                SDN 3 Loloan Timur • Kelas V • Matematika
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Timer Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-slate-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>

            {/* Quick PDF button */}
            <button
              id="btn-exam-download-pdf"
              type="button"
              onClick={() => downloadQuestionsPDF(rawQuestions)}
              title="Unduh Naskah Soal PDF"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-600" />
              PDF Soal
            </button>

            {/* Question Palette button */}
            <button
              id="btn-open-palette"
              type="button"
              onClick={() => setShowPaletteModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Daftar Soal</span>
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {currentIndex + 1}
              </span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="pt-3">
          <div className="flex justify-between items-center text-xs font-medium mb-1.5">
            <span className="text-slate-600">
              Progres Pengerjaan: <strong className="text-blue-700 font-bold">{answeredCount}</strong> dari {totalQ} Soal ({progressPercent}%)
            </span>
            <span className="text-slate-400">
              {allAnswered ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Siap Dikirim
                </span>
              ) : (
                `${unansweredIndices.length} soal tersisa`
              )}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Validation warning banner */}
      {validationAlert && (
        <div 
          id="unanswered-warning-banner"
          className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-start gap-3 shadow-xs"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-bold mb-1">Periksa Kembali Jawaban Anda</p>
            <p className="text-xs sm:text-sm">{validationAlert}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setValidationAlert(null)}
            className="text-amber-500 hover:text-amber-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Question Card (Tahap 2) */}
      <main 
        id="current-question-card"
        className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-8 mb-6 relative"
      >
        {/* Question Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-sm">
              {currentIndex + 1}
            </span>
            <span className="text-sm font-bold text-slate-800">
              Soal Nomor {currentIndex + 1} dari {totalQ}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
              {currentQ.topic}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
              {getQuestionTypeLabel(currentQ.type)}
            </span>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <p className="text-base sm:text-lg text-slate-900 font-medium leading-relaxed">
            {currentQ.question}
          </p>
        </div>

        {/* Answer Options according to type */}

        {/* 1. PILIHAN GANDA (pg) */}
        {currentQ.type === 'pg' && currentQ.options && (
          <div className="space-y-3" role="radiogroup" aria-label="Pilihan jawaban">
            {currentQ.options.map((opt, optIndex) => {
              const letter = ['A', 'B', 'C', 'D'][optIndex] || String.fromCharCode(65 + optIndex);
              const isSelected = answers[currentQ.id] === opt;
              return (
                <button
                  id={`option-${currentQ.id}-${letter}`}
                  key={optIndex}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500 text-blue-950 font-medium'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {letter}
                  </span>
                  <span className="pt-0.5 text-sm sm:text-base leading-snug">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 2. PILIHAN GANDA KOMPLEKS (pg_kompleks) */}
        {currentQ.type === 'pg_kompleks' && currentQ.options && (
          <div className="space-y-3">
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-medium flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Petunjuk: Pilihan jawaban benar dapat lebih dari satu. Berikan tanda centang pada semua pilihan yang menurut Anda benar.</span>
            </div>

            {currentQ.options.map((opt, optIndex) => {
              const selectedList = (Array.isArray(answers[currentQ.id]) ? answers[currentQ.id] : []) as string[];
              const isChecked = selectedList.includes(opt);
              return (
                <button
                  id={`multi-option-${currentQ.id}-${optIndex}`}
                  key={optIndex}
                  type="button"
                  onClick={() => handleToggleMultiOption(opt)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isChecked
                      ? 'bg-indigo-50/70 border-indigo-500 shadow-xs ring-1 ring-indigo-500 text-indigo-950 font-medium'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border shrink-0 transition-colors mt-0.5 ${
                    isChecked
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-300 text-transparent'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm sm:text-base leading-snug">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. PILIHAN GANDA KOMPLEKS KATEGORI (kategori) */}
        {currentQ.type === 'kategori' && currentQ.statements && (
          <div className="space-y-4">
            <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-900 font-medium flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Pilihlah respon yang tepat untuk masing-masing baris pernyataan berikut:</span>
            </div>

            <div className="space-y-3">
              {currentQ.statements.map((st, sIndex) => {
                const currentAnswerObj = (typeof answers[currentQ.id] === 'object' && !Array.isArray(answers[currentQ.id])
                  ? answers[currentQ.id]
                  : {}) as Record<string, string>;
                const userChoice = currentAnswerObj[st.id];

                return (
                  <div 
                    key={st.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-2.5 flex-1">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(97 + sIndex)}
                      </span>
                      <p className="text-sm text-slate-800 font-medium leading-snug">
                        {st.statement}
                      </p>
                    </div>

                    {/* Choice Buttons for Statement */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {st.options.map(opt => {
                        const isChosen = userChoice === opt;
                        return (
                          <button
                            id={`kategori-${currentQ.id}-${st.id}-${opt}`}
                            key={opt}
                            type="button"
                            onClick={() => handleSelectCategory(st.id, opt)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                              isChosen
                                ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. ISIAN SINGKAT (isian) */}
        {currentQ.type === 'isian' && (
          <div className="space-y-3">
            <label 
              htmlFor={`input-isian-${currentQ.id}`}
              className="block text-sm font-bold text-slate-700"
            >
              Jawaban Anda:
            </label>
            <div className="relative max-w-md">
              <input
                id={`input-isian-${currentQ.id}`}
                type="text"
                value={(typeof answers[currentQ.id] === 'string' ? answers[currentQ.id] : '') as string}
                onChange={(e) => handleIsianChange(e.target.value)}
                placeholder="Ketikkan jawaban ringkas di sini..."
                className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 font-semibold text-base focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <p className="text-xs text-slate-500">
              Tips: Masukkan angka atau teks singkat sesuai pertanyaan (tanpa tanda kutip).
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <footer 
        id="exam-bottom-navigation"
        className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
      >
        {/* Tombol Sebelumnya */}
        <button
          id="btn-prev-question"
          type="button"
          disabled={currentIndex === 0}
          onClick={() => {
            if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
          }}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
            currentIndex === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 active:bg-slate-100'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Sebelumnya
        </button>

        {/* Middle Quick Info: Answered Status */}
        <div className="flex items-center gap-2">
          {isAnswerGiven(currentQ, answers[currentQ.id]) ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Soal Ini Sudah Terjawab
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5" /> Belum Dijawab
            </span>
          )}
        </div>

        {/* Tombol Berikutnya & Selesai/Kirim Jawaban */}
        <div className="flex items-center gap-2">
          {currentIndex < totalQ - 1 ? (
            <button
              id="btn-next-question"
              type="button"
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Berikutnya
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-finish-exam"
              type="button"
              onClick={handleAttemptSubmit}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                allAnswered
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              <Send className="w-4 h-4" />
              Selesai / Kirim Jawaban
            </button>
          )}
        </div>
      </footer>

      {/* Floating Finish Button when all answered & not on last page */}
      {allAnswered && currentIndex !== totalQ - 1 && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleAttemptSubmit}
            className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Semua 35 Soal Sudah Terisi! Klik di sini untuk Kirim Jawaban
          </button>
        </div>
      )}

      {/* MODAL 1: Question Palette (Daftar Nomor Soal) */}
      {showPaletteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div 
            id="question-palette-modal"
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Nomor Soal
                </h3>
                <p className="text-xs text-slate-500">
                  Klik pada nomor soal untuk langsung berpindah ke soal tersebut.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPaletteModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 py-3 text-xs border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
                <span className="text-slate-600 font-medium">Sudah Terjawab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-blue-600 ring-2 ring-blue-300" />
                <span className="text-slate-600 font-medium">Sedang Dibuka</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-white border border-slate-300" />
                <span className="text-slate-600 font-medium">Belum Dijawab</span>
              </div>
            </div>

            {/* Grid 35 Numbers */}
            <div className="py-4 overflow-y-auto grid grid-cols-5 sm:grid-cols-7 gap-2.5 flex-1">
              {questions.map((q, idx) => {
                const isAnswered = isAnswerGiven(q, answers[q.id]);
                const isActive = idx === currentIndex;

                return (
                  <button
                    id={`palette-num-${idx + 1}`}
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowPaletteModal(false);
                      setValidationAlert(null);
                    }}
                    className={`h-11 rounded-xl text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 ring-offset-1'
                        : isAnswered
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Footer action inside modal */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Terjawab: {answeredCount} / {totalQ}
              </span>
              <button
                type="button"
                onClick={() => setShowPaletteModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Confirmation Dialog (Tahap 2 Konfirmasi) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div 
            id="submit-confirmation-modal"
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              Apakah Anda yakin ingin mengirim jawaban?
            </h3>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Anda telah menjawab seluruh <strong>35 butir soal</strong>. Setelah jawaban dikirim, lembar ujian akan dinilai secara otomatis dan hasil tes Anda akan langsung ditampilkan.
            </p>

            <div className="bg-slate-50 rounded-xl p-3.5 text-xs text-slate-600 mb-6 text-left space-y-1 border border-slate-200">
              <div className="flex justify-between">
                <span>Nama Siswa:</span>
                <strong className="text-slate-800">{identity.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Nomor Absen:</span>
                <strong className="text-slate-800">{identity.attendanceNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span>Durasi Pengerjaan:</span>
                <strong className="text-slate-800">{formatTime(elapsedSeconds)}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                id="btn-cancel-submit"
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cek Lagi
              </button>
              <button
                id="btn-confirm-submit"
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  onSubmitExam();
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                Ya, Kirim Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
