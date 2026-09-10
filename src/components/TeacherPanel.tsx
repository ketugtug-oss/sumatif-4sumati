import React, { useState } from 'react';
import { ExamResult, Question, TeacherSettings } from '../types/exam';
import { exportResultsToCSV, GOOGLE_APPS_SCRIPT_SAMPLE, syncResultToGoogleSheet } from '../utils/spreadsheetSync';
import { downloadQuestionsPDF, downloadResultCertificatePDF } from '../utils/pdfExport';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  ArrowLeft, 
  FileSpreadsheet, 
  FileDown, 
  Search, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  BookOpen, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink,
  Users,
  Award,
  BarChart3,
  Send,
  Plus
} from 'lucide-react';

interface TeacherPanelProps {
  results: ExamResult[];
  questions: Question[];
  settings: TeacherSettings;
  onUpdateSettings: (newSettings: TeacherSettings) => void;
  onDeleteResult: (id: string) => void;
  onClearAllResults: () => void;
  onClose: () => void;
  onAddSimulatedResult?: (result: ExamResult) => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({
  results,
  questions,
  settings,
  onUpdateSettings,
  onDeleteResult,
  onClearAllResults,
  onClose,
  onAddSimulatedResult,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Panel Tabs: 'rekap' | 'settings' | 'bank_soal'
  const [activeTab, setActiveTab] = useState<'rekap' | 'settings' | 'bank_soal'>('rekap');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'lulus' | 'belum_lulus'>('all');

  // Webhook settings state
  const [webhookUrlInput, setWebhookUrlInput] = useState(settings.spreadsheetWebhookUrl);
  const [allowReviewToggle, setAllowReviewToggle] = useState(settings.allowStudentReview);
  const [kktpInput, setKktpInput] = useState(settings.kktp.toString());
  const [autoSyncToggle, setAutoSyncToggle] = useState(settings.enableAutoSync);
  const [copiedCode, setCopiedCode] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Authentication Handler: Password must match "GURUADMIN"
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'GURUADMIN') {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Kata sandi salah! Pastikan Anda memasukkan kode akses guru yang benar.');
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedKktp = parseInt(kktpInput, 10) || 70;
    const updated: TeacherSettings = {
      spreadsheetWebhookUrl: webhookUrlInput.trim(),
      allowStudentReview: allowReviewToggle,
      kktp: parsedKktp,
      enableAutoSync: autoSyncToggle,
    };
    onUpdateSettings(updated);
    setSyncStatusMsg('Pengaturan berhasil disimpan!');
    setTimeout(() => setSyncStatusMsg(null), 3000);
  };

  // Test Webhook Connection
  const handleTestWebhook = async () => {
    if (!webhookUrlInput.trim()) {
      setSyncStatusMsg('Harap masukkan URL Webhook Google Spreadsheet terlebih dahulu.');
      return;
    }
    setIsSyncing(true);
    setSyncStatusMsg('Mengirim data uji coba ke Spreadsheet...');

    const testPayload: ExamResult = {
      id: `test-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      studentName: 'Siswa Uji Coba',
      attendanceNumber: '0',
      className: 'Kelas V',
      schoolName: 'SD NEGERI 3 LOLOAN TIMUR',
      totalQuestions: 35,
      correctAnswersCount: 30,
      wrongAnswersCount: 5,
      score: 86,
      isPassed: true,
      kktp: parseInt(kktpInput, 10) || 70,
      answers: {},
    };

    const res = await syncResultToGoogleSheet(testPayload, webhookUrlInput.trim());
    setIsSyncing(false);
    setSyncStatusMsg(res.message);
  };

  // Copy Google Apps Script code
  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_SAMPLE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Add simulated student for demonstration
  const handleAddDemoStudent = () => {
    if (!onAddSimulatedResult) return;
    const demoNames = [
      'Ni Luh Putu Ayu Wandira',
      'I Kadek Bagus Wira Sanjaya',
      'I Made Dwi Cahyadi',
      'Ni Komang Sri Lestari',
      'I Gede Wahyu Pratama',
    ];
    const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];
    const randomAbsen = Math.floor(Math.random() * 30 + 1).toString();
    const randomBenar = Math.floor(Math.random() * 15 + 20); // 20 to 35
    const randomSalah = 35 - randomBenar;
    const randomScore = Math.round((randomBenar / 35) * 100);

    const demoResult: ExamResult = {
      id: `demo-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      studentName: randomName,
      attendanceNumber: randomAbsen,
      className: 'Kelas V (Lima)',
      schoolName: 'SD NEGERI 3 LOLOAN TIMUR',
      totalQuestions: 35,
      correctAnswersCount: randomBenar,
      wrongAnswersCount: randomSalah,
      score: randomScore,
      isPassed: randomScore >= settings.kktp,
      kktp: settings.kktp,
      answers: {},
      syncedToSpreadsheet: true,
    };

    onAddSimulatedResult(demoResult);
  };

  // Filtered Results
  const filteredResults = results.filter(r => {
    const matchesSearch = 
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.attendanceNumber.includes(searchQuery);

    if (!matchesSearch) return false;

    if (filterStatus === 'lulus') return r.isPassed;
    if (filterStatus === 'belum_lulus') return !r.isPassed;
    return true;
  });

  // Calculate statistics
  const totalStudents = results.length;
  const passedStudents = results.filter(r => r.isPassed).length;
  const failedStudents = totalStudents - passedStudents;
  const passRate = totalStudents > 0 ? Math.round((passedStudents / totalStudents) * 100) : 0;
  const averageScore = totalStudents > 0
    ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / totalStudents)
    : 0;

  // IF NOT AUTHENTICATED: Show Password Login Form
  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16">
        <div 
          id="teacher-login-card"
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
          
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mb-1">
            Panel Guru & Administrator
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            SD Negeri 3 Loloan Timur • Kelola Rekap Ujian & Nilai
          </p>

          {authError && (
            <div 
              id="auth-error-banner"
              className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 text-left"
            >
              <XCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label 
                htmlFor="input-teacher-password"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Kata Sandi Akses Guru
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="input-teacher-password"
                  type="password"
                  required
                  placeholder="Masukkan kata sandi guru..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <button
              id="btn-submit-teacher-login"
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Buka Panel Guru
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              id="btn-back-to-student-mode"
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Halaman Siswa
            </button>
          </div>
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED: Full Teacher Dashboard
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Header */}
      <div 
        id="teacher-dashboard-header"
        className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900">
                PANEL GURU & ADMINISTRATOR
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500">
              SD Negeri 3 Loloan Timur • Tes Sumatif Matematika Kelas V
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-export-csv"
            type="button"
            onClick={() => exportResultsToCSV(results)}
            disabled={results.length === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              results.length === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Unduh Rekap Spreadsheet (CSV)
          </button>

          <button
            id="btn-teacher-close"
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Ke Beranda Siswa
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          id="tab-rekap-btn"
          type="button"
          onClick={() => setActiveTab('rekap')}
          className={`inline-flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === 'rekap'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Rekap Nilai Siswa ({results.length})
        </button>

        <button
          id="tab-settings-btn"
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`inline-flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          Pengaturan & Google Spreadsheet
        </button>

        <button
          id="tab-bank-soal-btn"
          type="button"
          onClick={() => setActiveTab('bank_soal')}
          className={`inline-flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === 'bank_soal'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Bank Soal ({questions.length})
        </button>
      </div>

      {/* TAB 1: REKAP NILAI SISWA */}
      {activeTab === 'rekap' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold uppercase">Total Siswa</span>
                <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {totalStudents}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Mengerjakan Tes
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold uppercase">Rata-Rata Nilai</span>
                <Award className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-600">
                {averageScore}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Skala 0 - 100
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-emerald-600 mb-1">
                <span className="text-xs font-semibold uppercase">Siswa Lulus</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                {passedStudents}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Memenuhi KKTP {settings.kktp}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold uppercase">Tingkat Kelulusan</span>
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {passRate}%
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {failedStudents} siswa belum lulus
              </span>
            </div>
          </div>

          {/* Table Controls: Search, Filter, Clear */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="input-search-student"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama siswa atau no. absen..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                id="select-filter-status"
                value={filterStatus}
                onChange={(e: any) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="lulus">Hanya LULUS (≥ KKTP)</option>
                <option value="belum_lulus">Hanya BELUM LULUS (&lt; KKTP)</option>
              </select>

              <button
                id="btn-add-demo-student"
                type="button"
                onClick={handleAddDemoStudent}
                title="Tambah data simulasi siswa untuk uji coba"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Simulasi Siswa
              </button>

              {results.length > 0 && (
                <button
                  id="btn-clear-all-results"
                  type="button"
                  onClick={() => {
                    if (window.confirm('Hapus seluruh rekap nilai siswa? Tindakan ini tidak dapat dibatalkan.')) {
                      onClearAllResults();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus Semua
                </button>
              )}
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table id="rekap-nilai-table" className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">No</th>
                    <th className="py-3.5 px-4">Waktu Ujian</th>
                    <th className="py-3.5 px-4">Nama Siswa</th>
                    <th className="py-3.5 px-4 text-center">Absen</th>
                    <th className="py-3.5 px-4 text-center">Kelas</th>
                    <th className="py-3.5 px-4 text-center">Benar</th>
                    <th className="py-3.5 px-4 text-center">Salah</th>
                    <th className="py-3.5 px-4 text-center">Nilai</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResults.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        Belum ada data nilai siswa yang tersimpan. Klik "Simulasi Siswa" atau minta siswa mengerjakan ujian.
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map((r, idx) => (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{r.timestamp}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{r.studentName}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">#{r.attendanceNumber}</td>
                        <td className="py-3.5 px-4 text-center text-slate-600">{r.className}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-600">{r.correctAnswersCount}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-red-600">{r.wrongAnswersCount}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-extrabold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                            {r.score}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            r.isPassed 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {r.isPassed ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                LULUS
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-amber-600" />
                                BELUM LULUS
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              id={`btn-download-pdf-${r.id}`}
                              type="button"
                              onClick={() => downloadResultCertificatePDF(r)}
                              title="Unduh Lembar Hasil PDF Siswa"
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              <FileDown className="w-4 h-4" />
                            </button>
                            <button
                              id={`btn-delete-row-${r.id}`}
                              type="button"
                              onClick={() => onDeleteResult(r.id)}
                              title="Hapus Baris Ini"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PENGATURAN & GOOGLE SPREADSHEET */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Settings */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" />
                Konfigurasi Ujian & Kunci Jawaban
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Kelola hak akses siswa terhadap kunci jawaban dan ambang kelulusan KKTP.
              </p>

              <form onSubmit={handleSaveSettings} className="space-y-5">
                {/* Setting 1: Izinkan Siswa Melihat Kunci Jawaban */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <label 
                        htmlFor="toggle-student-review"
                        className="block text-xs font-bold text-slate-800"
                      >
                        Izinkan Siswa Melihat Kunci Jawaban & Pembahasan
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Jika dimatikan, siswa hanya akan melihat nilai akhir dan status kelulusan (kunci jawaban tetap dirahasiakan).
                      </p>
                    </div>
                    <input
                      id="toggle-student-review"
                      type="checkbox"
                      checked={allowReviewToggle}
                      onChange={(e) => setAllowReviewToggle(e.target.checked)}
                      className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Setting 2: KKTP Nilai Kelulusan */}
                <div>
                  <label 
                    htmlFor="input-kktp"
                    className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1"
                  >
                    Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
                  </label>
                  <input
                    id="input-kktp"
                    type="number"
                    min="50"
                    max="100"
                    value={kktpInput}
                    onChange={(e) => setKktpInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Standar ketuntasan nilai di SD Negeri 3 Loloan Timur (default: 70).
                  </p>
                </div>

                {/* Setting 3: Webhook Google Spreadsheet */}
                <div>
                  <label 
                    htmlFor="input-webhook-url"
                    className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1"
                  >
                    URL Webhook Google Spreadsheet (Apps Script)
                  </label>
                  <input
                    id="input-webhook-url"
                    type="url"
                    value={webhookUrlInput}
                    onChange={(e) => setWebhookUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Setiap kali siswa menyelesaikan tes, data akan otomatis diposting ke URL ini.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    id="btn-save-settings"
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>

                  <button
                    id="btn-test-webhook"
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={isSyncing}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {isSyncing ? 'Menguji...' : 'Uji Webhook'}
                  </button>
                </div>

                {syncStatusMsg && (
                  <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{syncStatusMsg}</span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column: Google Apps Script Instructions & Code */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Panduan Hubungkan ke Google Sheet
                </h2>
                <button
                  id="btn-copy-apps-script"
                  type="button"
                  onClick={handleCopyScript}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Salin Kode Skrip
                    </>
                  )}
                </button>
              </div>

              <ol className="text-xs text-slate-600 space-y-3 mb-4 list-decimal pl-4 leading-relaxed">
                <li>
                  Buka Google Spreadsheet baru Anda di Google Drive (misalnya beri nama <strong>"Rekap Tes Sumatif SDN 3 Loloan Timur"</strong>).
                </li>
                <li>
                  Klik menu <strong>Extensions (Ekstensi) &gt; Apps Script</strong>.
                </li>
                <li>
                  Hapus kode bawaan dan tempel (paste) kode skrip yang sudah disalin di bawah ini.
                </li>
                <li>
                  Klik tombol <strong>Deploy (Terapkan) &gt; New Deployment (Penerapan baru)</strong>. Pilih jenis <strong>Web App (Aplikasi Web)</strong>.
                </li>
                <li>
                  Pada bagian <em>"Who has access" (Siapa yang memiliki akses)</em>, pilih <strong>Anyone (Siapa saja)</strong>, lalu klik <strong>Deploy</strong>.
                </li>
                <li>
                  Salin <strong>Web App URL</strong> yang dihasilkan ke kolom URL Webhook di samping dan klik <strong>Simpan Perubahan</strong>.
                </li>
              </ol>

              {/* Code Snippet Box */}
              <div className="relative bg-slate-900 rounded-xl p-4 overflow-x-auto max-h-64 font-mono text-[11px] text-slate-200 border border-slate-800">
                <pre>{GOOGLE_APPS_SCRIPT_SAMPLE}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BANK SOAL */}
      {activeTab === 'bank_soal' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Daftar Bank Soal Ujian (35 Butir)
              </h2>
              <p className="text-xs text-slate-500">
                Kurikulum Merdeka SD Kelas V • Mata Pelajaran Matematika
              </p>
            </div>

            <button
              id="btn-download-questions-teacher"
              type="button"
              onClick={() => downloadQuestionsPDF(questions)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <FileDown className="w-4 h-4" />
              Unduh Seluruh Soal (PDF)
            </button>
          </div>

          {/* List of Questions */}
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div 
                key={q.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Topik: {q.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                      {q.difficulty}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                      Tipe: {q.type}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-900">
                  {q.question}
                </p>

                {/* Options preview */}
                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => (
                      <div 
                        key={oIdx}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700"
                      >
                        <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                      </div>
                    ))}
                  </div>
                )}

                {/* Correct answer & Explanation */}
                <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                  <div className="text-emerald-700 font-bold">
                    Kunci Jawaban: {typeof q.correctAnswer === 'object' ? JSON.stringify(q.correctAnswer) : String(q.correctAnswer)}
                  </div>
                  <div className="text-slate-600">
                    <strong className="text-slate-800">Pembahasan:</strong> {q.explanation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
