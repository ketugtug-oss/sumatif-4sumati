import { useState, useEffect } from 'react';
import { 
  StudentIdentity, 
  Question, 
  StudentAnswer, 
  ExamResult, 
  TeacherSettings 
} from './types/exam';
import { DEFAULT_QUESTIONS } from './data/questions';
import { prepareShuffledExam } from './utils/shuffle';
import { gradeExam, ExamGradingResult } from './utils/grading';
import { 
  getStoredResults, 
  saveExamResult, 
  deleteExamResult, 
  clearAllExamResults, 
  getTeacherSettings, 
  saveTeacherSettings,
  getActiveIdentity,
  saveActiveIdentity,
  getActiveAnswers,
  saveActiveAnswers,
  clearActiveSession
} from './utils/storage';
import { syncResultToGoogleSheet } from './utils/spreadsheetSync';

import { StudentIdentityStep } from './components/StudentIdentityStep';
import { ExamScreen } from './components/ExamScreen';
import { ExamResultStep } from './components/ExamResultStep';
import { TeacherPanel } from './components/TeacherPanel';
import { School, ShieldCheck } from 'lucide-react';

export default function App() {
  // Application Stage: 'identity' | 'exam' | 'result' | 'teacher'
  const [currentStage, setCurrentStage] = useState<'identity' | 'exam' | 'result' | 'teacher'>('identity');
  
  // Student State
  const [studentIdentity, setStudentIdentity] = useState<StudentIdentity | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<Record<number, StudentAnswer>>({});
  
  // Exam Result State
  const [latestResult, setLatestResult] = useState<ExamResult | null>(null);
  const [latestGrading, setLatestGrading] = useState<ExamGradingResult | null>(null);

  // Persistence State
  const [storedResults, setStoredResults] = useState<ExamResult[]>([]);
  const [teacherSettings, setTeacherSettings] = useState<TeacherSettings>(getTeacherSettings());

  // Initialize from storage on mount
  useEffect(() => {
    setStoredResults(getStoredResults());
    setTeacherSettings(getTeacherSettings());

    // Restore active session if student previously started
    const savedIdentity = getActiveIdentity();
    const savedAnswers = getActiveAnswers();
    if (savedIdentity) {
      setStudentIdentity(savedIdentity);
      setStudentAnswers(savedAnswers);
      // Start with shuffled questions
      setExamQuestions(prepareShuffledExam(DEFAULT_QUESTIONS));
      setCurrentStage('exam');
    }
  }, []);

  // TAHAP 1 -> TAHAP 2: Start Exam
  const handleStartExam = (identity: StudentIdentity) => {
    setStudentIdentity(identity);
    saveActiveIdentity(identity);

    // Shuffle questions and options for this specific exam attempt
    const shuffled = prepareShuffledExam(DEFAULT_QUESTIONS);
    setExamQuestions(shuffled);
    
    // Reset answers
    setStudentAnswers({});
    saveActiveAnswers({});

    setCurrentStage('exam');
  };

  // Answer change handler during exam
  const handleAnswerChange = (questionId: number, answer: StudentAnswer) => {
    setStudentAnswers(prev => {
      const updated = { ...prev, [questionId]: answer };
      saveActiveAnswers(updated);
      return updated;
    });
  };

  // TAHAP 2 -> TAHAP 3: Submit and Grade Exam
  const handleSubmitExam = async () => {
    if (!studentIdentity) return;

    // Grade the exam
    const grading = gradeExam(examQuestions, studentAnswers, teacherSettings.kktp);
    setLatestGrading(grading);

    // Build ExamResult record
    const resultRecord: ExamResult = {
      id: `exam-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      studentName: studentIdentity.fullName,
      attendanceNumber: studentIdentity.attendanceNumber,
      className: studentIdentity.className || 'Kelas V',
      schoolName: studentIdentity.schoolName || 'SD NEGERI 3 LOLOAN TIMUR',
      totalQuestions: grading.totalQuestions,
      correctAnswersCount: grading.correctCount,
      wrongAnswersCount: grading.wrongCount,
      score: grading.score,
      isPassed: grading.isPassed,
      kktp: grading.kktp,
      answers: studentAnswers,
      syncedToSpreadsheet: false,
    };

    // Save locally
    saveExamResult(resultRecord);
    setStoredResults(getStoredResults());
    setLatestResult(resultRecord);

    // Clear active session to prevent double submission
    clearActiveSession();

    // TAHAP 4: Automatically sync to Google Spreadsheet if webhook configured
    if (teacherSettings.enableAutoSync && teacherSettings.spreadsheetWebhookUrl) {
      syncResultToGoogleSheet(resultRecord, teacherSettings.spreadsheetWebhookUrl)
        .then(res => {
          if (res.success) {
            resultRecord.syncedToSpreadsheet = true;
            saveExamResult(resultRecord);
            setStoredResults(getStoredResults());
          }
        })
        .catch(err => {
          console.warn('Auto sync error:', err);
        });
    }

    // Transition to Stage 3
    setCurrentStage('result');
  };

  // Restart / Go back to Identity step
  const handleRestart = () => {
    clearActiveSession();
    setStudentIdentity(null);
    setStudentAnswers({});
    setLatestResult(null);
    setLatestGrading(null);
    setCurrentStage('identity');
  };

  // Teacher settings updater
  const handleUpdateSettings = (newSettings: TeacherSettings) => {
    saveTeacherSettings(newSettings);
    setTeacherSettings(newSettings);
  };

  // Delete single result
  const handleDeleteResult = (id: string) => {
    deleteExamResult(id);
    setStoredResults(getStoredResults());
  };

  // Clear all results
  const handleClearAllResults = () => {
    clearAllExamResults();
    setStoredResults([]);
  };

  // Add demo result
  const handleAddDemoResult = (demo: ExamResult) => {
    saveExamResult(demo);
    setStoredResults(getStoredResults());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Global Navigation Bar */}
      <nav 
        id="global-navbar"
        className="w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold shadow-sm">
            <School className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-none block">
              SD NEGERI 3 LOLOAN TIMUR
            </span>
            <span className="text-[11px] text-slate-500 font-medium leading-none">
              CBT Tes Sumatif Matematika Kelas V
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentStage === 'teacher' ? (
            <button
              id="btn-nav-exit-teacher"
              type="button"
              onClick={() => setCurrentStage('identity')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Mode Siswa
            </button>
          ) : (
            <button
              id="btn-nav-enter-teacher"
              type="button"
              onClick={() => setCurrentStage('teacher')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Panel Guru</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main View Router */}
      <div className="flex-1 flex flex-col">
        {currentStage === 'identity' && (
          <StudentIdentityStep
            questions={DEFAULT_QUESTIONS}
            onStartExam={handleStartExam}
            onOpenTeacherPanel={() => setCurrentStage('teacher')}
          />
        )}

        {currentStage === 'exam' && studentIdentity && (
          <ExamScreen
            identity={studentIdentity}
            questions={examQuestions}
            rawQuestions={DEFAULT_QUESTIONS}
            answers={studentAnswers}
            onAnswerChange={handleAnswerChange}
            onSubmitExam={handleSubmitExam}
          />
        )}

        {currentStage === 'result' && latestResult && latestGrading && (
          <ExamResultStep
            result={latestResult}
            grading={latestGrading}
            questions={examQuestions}
            settings={teacherSettings}
            onRestart={handleRestart}
            onOpenTeacherPanel={() => setCurrentStage('teacher')}
          />
        )}

        {currentStage === 'teacher' && (
          <TeacherPanel
            results={storedResults}
            questions={DEFAULT_QUESTIONS}
            settings={teacherSettings}
            onUpdateSettings={handleUpdateSettings}
            onDeleteResult={handleDeleteResult}
            onClearAllResults={handleClearAllResults}
            onClose={() => setCurrentStage('identity')}
            onAddSimulatedResult={handleAddDemoResult}
          />
        )}
      </div>

      {/* Global Footer */}
      <footer className="py-6 px-4 text-center text-xs text-slate-400 border-t border-slate-200 mt-auto bg-white/60">
        <p>
          © {new Date().getFullYear()} SD Negeri 3 Loloan Timur • Sistem Tes Sumatif Kurikulum Merdeka • Kelas V Matematika
        </p>
      </footer>
    </div>
  );
}
