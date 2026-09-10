import { Question, StudentAnswer } from '../types/exam';

export interface QuestionGradingDetail {
  questionId: number;
  isCorrect: boolean;
  userAnswer: StudentAnswer;
  correctAnswer: any;
  explanation: string;
}

export interface ExamGradingResult {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  score: number; // 0 - 100
  isPassed: boolean;
  kktp: number;
  details: Record<number, QuestionGradingDetail>;
}

export function isAnswerGiven(q: Question, answer?: StudentAnswer): boolean {
  if (answer === undefined || answer === null) return false;

  if (q.type === 'pg') {
    return typeof answer === 'string' && answer.trim().length > 0;
  }

  if (q.type === 'pg_kompleks') {
    return Array.isArray(answer) && answer.length > 0;
  }

  if (q.type === 'kategori') {
    if (typeof answer !== 'object' || Array.isArray(answer)) return false;
    const statements = q.statements || [];
    // Must answer every single statement in the category
    return statements.every(st => answer[st.id] !== undefined && answer[st.id] !== '');
  }

  if (q.type === 'isian') {
    return typeof answer === 'string' && answer.trim().length > 0;
  }

  return false;
}

function normalizeIsianText(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '') // remove spaces
    .replace(/,/g, '.'); // normalize decimal comma to dot
}

export function gradeQuestion(q: Question, answer?: StudentAnswer): boolean {
  if (!answer) return false;

  if (q.type === 'pg') {
    return typeof answer === 'string' && answer.trim() === String(q.correctAnswer).trim();
  }

  if (q.type === 'pg_kompleks') {
    if (!Array.isArray(answer)) return false;
    const correctArr = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
    if (answer.length !== correctArr.length) return false;
    const sortedAns = [...answer].sort();
    const sortedCorr = [...correctArr].sort();
    return sortedAns.every((val, idx) => val === sortedCorr[idx]);
  }

  if (q.type === 'kategori') {
    if (typeof answer !== 'object' || Array.isArray(answer)) return false;
    const correctObj = q.correctAnswer as Record<string, string>;
    const statements = q.statements || [];
    return statements.every(st => {
      const userVal = answer[st.id];
      const correctVal = correctObj[st.id] || st.correctAnswer;
      return userVal === correctVal;
    });
  }

  if (q.type === 'isian') {
    if (typeof answer !== 'string') return false;
    const userNorm = normalizeIsianText(answer);
    const correctNorm = normalizeIsianText(String(q.correctAnswer));
    
    if (userNorm === correctNorm) return true;

    // Handle common unit variations e.g. "30 km/jam" vs "30", "7 cm" vs "7"
    const numberOnlyUser = userNorm.replace(/[^0-9./]/g, '');
    const numberOnlyCorrect = correctNorm.replace(/[^0-9./]/g, '');
    if (numberOnlyUser.length > 0 && numberOnlyUser === numberOnlyCorrect) {
      return true;
    }
    return false;
  }

  return false;
}

export function gradeExam(
  questions: Question[],
  answers: Record<number, StudentAnswer>,
  kktp = 70
): ExamGradingResult {
  let correctCount = 0;
  const details: Record<number, QuestionGradingDetail> = {};

  questions.forEach(q => {
    const ans = answers[q.id];
    const isCorrect = gradeQuestion(q, ans);
    if (isCorrect) {
      correctCount++;
    }
    details[q.id] = {
      questionId: q.id,
      isCorrect,
      userAnswer: ans,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    };
  });

  const totalQuestions = questions.length;
  const wrongCount = totalQuestions - correctCount;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = score >= kktp;

  return {
    totalQuestions,
    correctCount,
    wrongCount,
    score,
    isPassed,
    kktp,
    details
  };
}
