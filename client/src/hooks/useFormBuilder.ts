import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateFormMutation } from "../app/api/enhancedApi"; 
import { type QuestionInput, QuestionType } from "../app/api/generatedApi"; 

export interface UiQuestion extends Omit<QuestionInput, 'options'> {
  id: string;
  options?: string[];
}

type FormErrors = {
  title?: string;
  questions?: { [id: string]: string };
  options?: { [id: string]: { [index: number]: string } };
};

export function useFormBuilder() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<UiQuestion[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const [createForm, { isLoading }] = useCreateFormMutation();


  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: "",
        type: QuestionType.Text, 
        isRequired: false,
        correctAnswer: [],
      },
    ]);
  };
  
  const updateQuestionField = (id: string, field: keyof UiQuestion, value: any) => {
    setQuestions(prev => prev.map(q => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const changeQuestionType = (id:string, newType: QuestionType) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === id) {
        const newQuestionData = { ...q, type: newType, correctAnswer: [] };
        if ((newType === QuestionType.MultipleChoice || newType === QuestionType.Checkboxes) && !q.options) {
          return { ...newQuestionData, options: [''] };
        }
        if (newType === QuestionType.Text || newType === QuestionType.Date) {
          const { options, ...rest } = newQuestionData;
          return rest;
        }
        return newQuestionData;
      }
      return q;
    }));
  };
  
  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };
    
  const addOption = (questionId: string) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, options: [...(q.options || []), ""] } : q
    ));
  };

  const updateOption = (questionId: string, index: number, value: string) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId && q.options
        ? { ...q, options: q.options.map((opt, i) => (i === index ? value : opt)) }
        : q
    ));
  };
  
  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId && q.options) {
        if (q.options.length === 1) return q; // Не видаляємо останню опцію
        return { ...q, options: q.options.filter((_, i) => i !== optionIndex) };
      }
      return q;
    }));
  };
    
  const setCorrectAnswer = (questionId: string, optionValue: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const currentCorrect = q.correctAnswer || [];
        if (q.type === QuestionType.MultipleChoice) {
          return { ...q, correctAnswer: [optionValue] };
        }
        if (q.type === QuestionType.Checkboxes) {
          const newCorrect = currentCorrect.includes(optionValue)
            ? currentCorrect.filter(ans => ans !== optionValue)
            : [...currentCorrect, optionValue];
          return { ...q, correctAnswer: newCorrect };
        }
      }
      return q;
    }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = "Form title is required";
    
    const questionErrors: { [id: string]: string } = {};
    const optionErrors: { [id: string]: { [index: number]: string } } = {};

    questions.forEach(q => {
      if (!q.text.trim()) questionErrors[q.id] = "Question text is required";
      if (q.options) {
        q.options.forEach((opt, index) => {
          if (!opt.trim()) {
            if (!optionErrors[q.id]) optionErrors[q.id] = {};
            optionErrors[q.id][index] = "Option cannot be empty";
          }
        });
      }
    });

    if(Object.keys(questionErrors).length > 0) newErrors.questions = questionErrors;
    if(Object.keys(optionErrors).length > 0) newErrors.options = optionErrors;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    
  const saveForm = async () => {
    if (!validate()) return;
    
    try {
      const questionsForApi: QuestionInput[] = questions.map(({ id, ...rest }) => ({
        ...rest,
        options: rest.options?.filter(o => o.trim() !== '') || [], 
      }));
      
      await createForm({ title, description, questions: questionsForApi }).unwrap();
      navigate('/');
    } catch (err: any) {
      console.error('Error creating form:', err);
      alert(`Error creating form: ${err.data?.errors[0]?.message || err.message}`);
    }
  };

  return {
    state: {
      title,
      description,
      questions,
      errors,
      isLoading,
    },
    actions: {
      setTitle,
      setDescription,
      addQuestion,
      removeQuestion,
      updateQuestionField,
      changeQuestionType,
      addOption,
      updateOption,
      removeOption,
      setCorrectAnswer,
      saveForm,
    }
  };
}