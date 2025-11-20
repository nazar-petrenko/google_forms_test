import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  useGetFormByIdQuery, 
  useSubmitResponseMutation 
} from '../app/api/enhancedApi';
import { type Question, QuestionType } from '../app/api/generatedApi';

type AnswersState = Record<string, string[]>;
type ErrorState = Record<string, string>;

export function useFormFiller() {
  const { id: formId } = useParams<{ id: string }>();

  const { data: formData, isLoading, isError } = useGetFormByIdQuery({ id: formId! }, { skip: !formId });
  const form = formData?.form; 

  const [submitResponse, { isLoading: isSubmitting }] = useSubmitResponseMutation();

  const [answers, setAnswers] = useState<AnswersState>({});
  const [errors, setErrors] = useState<ErrorState>({});
  const [submissionResult, setSubmissionResult] = useState<{ score: number; total: number } | null>(null);

  const handleAnswerChange = (questionId: string, value: string, type: QuestionType) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      if (type === QuestionType.Checkboxes) {
        const currentValues = newAnswers[questionId] || [];
        newAnswers[questionId] = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
      } else {
        newAnswers[questionId] = [value];
      }
      return newAnswers;
    });

    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    if (!form) return false;
    const newErrors: ErrorState = {};
    form.questions.forEach((q) => {
      if (q.isRequired) {
        const answer = answers[q.id];
        if (!answer || answer.length === 0 || !answer[0].trim()) {
          newErrors[q.id] = "This field is required";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !form) return;
    
    try {
      const answersForApi = Object.entries(answers)
        .filter(([, value]) => value.length > 0)
        .map(([questionId, value]) => ({ questionId, value }));
        
      await submitResponse({ formId: formId!, answers: answersForApi }).unwrap();

      let score = 0;
      const questionsWithCorrectAnswer = form.questions.filter(q => q.correctAnswer && q.correctAnswer.length > 0);

      questionsWithCorrectAnswer.forEach((q) => {
        const userAnswer = [...(answers[q.id] || [])].sort();
        const correctAnswer = [...(q.correctAnswer || [])].sort();
        
        if (JSON.stringify(userAnswer) === JSON.stringify(correctAnswer)) {
          score++;
        }
      });

      setSubmissionResult({ score, total: questionsWithCorrectAnswer.length });

    } catch (err: any) {
      console.error('Failed to submit form:', err);
      alert(`Error submitting form: ${err.data?.errors[0]?.message || err.message}`);
    }
  };

  return {
    state: {
      form,
      answers,
      errors,
      submissionResult,
      isLoading,
      isError,
      isSubmitting,
    },
    actions: {
      handleAnswerChange,
      handleSubmit,
    }
  };
}