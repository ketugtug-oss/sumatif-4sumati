export type QuestionType = 'pg' | 'pg_kompleks' | 'kategori' | 'isian';
export type Difficulty = 'Mudah' | 'Sedang' | 'Sukar';

export interface CategoryStatement {
  id: string;
  statement: string;
  options: string[]; // e.g., ['Benar', 'Salah'] or ['Sesuai', 'Tidak Sesuai']
  correctAnswer: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  topic: string;
  difficulty: Difficulty;
  question: string;
  options?: string[]; // for 'pg' and 'pg_kompleks'
  statements?: CategoryStatement[]; // for 'kategori'
  correctAnswer: string | string[] | Record<string, string>; // pg: string, pg_kompleks: string[], kategori: { [statementId]: string }, isian: string or string[]
  explanation: string;
  points?: number;
}

export interface StudentIdentity {
  fullName: string;
  attendanceNumber: string;
  className: string;
  schoolName: string;
}

export type StudentAnswer = 
  | string // for 'pg' or 'isian'
  | string[] // for 'pg_kompleks'
  | Record<string, string>; // for 'kategori'

export interface ExamResult {
  id: string;
  timestamp: string;
  studentName: string;
  attendanceNumber: string;
  className: string;
  schoolName: string;
  totalQuestions: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  score: number; // 0 - 100
  isPassed: boolean; // >= KKTP (70)
  kktp: number;
  answers: Record<number, StudentAnswer>;
  syncedToSpreadsheet?: boolean;
}

export interface TeacherSettings {
  allowStudentReview: boolean;
  kktp: number;
  spreadsheetWebhookUrl: string;
  enableAutoSync: boolean;
}
