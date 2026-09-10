import { ExamResult, StudentIdentity, StudentAnswer, TeacherSettings } from '../types/exam';

const STORAGE_KEYS = {
  RESULTS: 'sdn3_loloantimur_exam_results_v1',
  SETTINGS: 'sdn3_loloantimur_teacher_settings_v1',
  ACTIVE_IDENTITY: 'sdn3_loloantimur_active_identity_v1',
  ACTIVE_ANSWERS: 'sdn3_loloantimur_active_answers_v1',
  ACTIVE_ORDER: 'sdn3_loloantimur_active_order_v1',
};

export const DEFAULT_TEACHER_SETTINGS: TeacherSettings = {
  allowStudentReview: false, // Default is hidden per prompt requirements
  kktp: 70,
  spreadsheetWebhookUrl: '',
  enableAutoSync: true,
};

export function getStoredResults(): ExamResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading exam results from localStorage:', e);
    return [];
  }
}

export function saveExamResult(result: ExamResult): void {
  try {
    const existing = getStoredResults();
    // Add new result at top
    const updated = [result, ...existing.filter(r => r.id !== result.id)];
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving exam result to localStorage:', e);
  }
}

export function deleteExamResult(id: string): void {
  try {
    const existing = getStoredResults();
    const updated = existing.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting exam result:', e);
  }
}

export function clearAllExamResults(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.RESULTS);
  } catch (e) {
    console.error('Error clearing exam results:', e);
  }
}

export function getTeacherSettings(): TeacherSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_TEACHER_SETTINGS;
    return { ...DEFAULT_TEACHER_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_TEACHER_SETTINGS;
  }
}

export function saveTeacherSettings(settings: TeacherSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving teacher settings:', e);
  }
}

export function getActiveIdentity(): StudentIdentity | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_IDENTITY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveActiveIdentity(identity: StudentIdentity | null): void {
  try {
    if (identity) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_IDENTITY, JSON.stringify(identity));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_IDENTITY);
    }
  } catch (e) {
    console.error('Error saving active identity:', e);
  }
}

export function getActiveAnswers(): Record<number, StudentAnswer> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_ANSWERS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveActiveAnswers(answers: Record<number, StudentAnswer>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ANSWERS, JSON.stringify(answers));
  } catch (e) {
    console.error('Error saving active answers:', e);
  }
}

export function clearActiveSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_IDENTITY);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ORDER);
  } catch (e) {
    console.error('Error clearing active session:', e);
  }
}
