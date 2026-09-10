import { Question } from '../types/exam';

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function prepareShuffledExam(questions: Question[]): Question[] {
  // Shuffle order of questions
  const shuffledQuestions = shuffleArray(questions);

  // For each question, if it's 'pg' or 'pg_kompleks', also shuffle options
  return shuffledQuestions.map(q => {
    if ((q.type === 'pg' || q.type === 'pg_kompleks') && q.options) {
      return {
        ...q,
        options: shuffleArray(q.options),
      };
    }
    return q;
  });
}
