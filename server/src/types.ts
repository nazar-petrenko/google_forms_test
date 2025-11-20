export enum QuestionType {
  TEXT = 'TEXT',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  CHECKBOXES = 'CHECKBOXES',
  DATE = 'DATE',
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  isRequired: boolean;
  correctAnswer?: string[];
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Answer {
  questionId: string;
  value: string[];
}

export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
}

export interface CreateFormArgs {
  title: string;
  description?: string;
  questions: Array<Omit<Question, 'id'>>;
}

export interface SubmitResponseArgs {
  formId: string;
  answers: Answer[];
}

