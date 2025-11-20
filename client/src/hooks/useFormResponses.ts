import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  useGetFormByIdQuery, 
  useGetResponsesQuery
} from '../app/api/enhancedApi';

import type { 
  GetFormByIdQuery, 
  GetResponsesQuery 
} from '../app/api/generatedApi';

type Form = NonNullable<GetFormByIdQuery['form']>;
type ApiResponse = GetResponsesQuery['responses'][number];

const areArraysEqual = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((value, index) => value === sorted2[index]);
};

export function useFormResponses() {
  const { id: formId } = useParams<{ id: string }>();

  const { 
    data: formData, 
    isLoading: isLoadingForm, 
    isError: isFormError 
  } = useGetFormByIdQuery(
    { id: formId! }, 
    { skip: !formId }
  );
  
  const { 
    data: responsesData, 
    isLoading: isLoadingResponses, 
    isError: isResponsesError 
  } = useGetResponsesQuery( 
    { formId: formId! }, 
    { skip: !formId }
  );
  
  const form = formData?.form;
  const responses = responsesData?.responses;

  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);

  const goToPrevious = () => setCurrentResponseIndex(prev => Math.max(0, prev - 1));
  const goToNext = () => setCurrentResponseIndex(prev => Math.min((responses?.length || 1) - 1, prev + 1));

  const questionsMap = useMemo(() => 
    new Map(form?.questions.map((q) => [q.id, q])), 
    [form?.questions]
  );
  
  const currentResponse = responses?.[currentResponseIndex];

  const { score, total } = useMemo(() => {
    if (!currentResponse || questionsMap.size === 0) return { score: 0, total: 0 };
    
    let currentScore = 0;
    const questionsWithCorrectAnswer = Array.from(questionsMap.values())
      .filter(q => q.correctAnswer && q.correctAnswer.length > 0);
    
    questionsWithCorrectAnswer.forEach(question => {
      const userAnswer = currentResponse.answers.find(a => a.questionId === question.id)?.value || [];
      if (areArraysEqual(userAnswer, question.correctAnswer as string[])) {
        currentScore++;
      }
    });

    return { score: currentScore, total: questionsWithCorrectAnswer.length };
  }, [currentResponse, questionsMap]);

  return {
    state: {
      form,
      responses,
      currentResponse,
      currentResponseIndex,
      questionsMap,
      score,
      total,
      isLoading: isLoadingForm || isLoadingResponses,
      isError: isFormError || isResponsesError,
    },
    actions: {
      goToPrevious,
      goToNext,
    }
  };
}