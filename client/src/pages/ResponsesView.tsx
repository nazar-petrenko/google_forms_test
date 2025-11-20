import type { Form, Response as ApiResponse, Question } from '../app/api/generatedApi';

type ResponsesViewProps = {
  form: Form;
  responses: ApiResponse[];
  currentResponseIndex: number;
  score: number;
  total: number;
  questionsMap: Map<string, Question>;
  onPrevious: () => void;
  onNext: () => void;
};

const areArraysEqual = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    return [...arr1].sort().every((value, index) => value === [...arr2].sort()[index]);
};

export default function ResponsesView({ 
  form, 
  responses, 
  currentResponseIndex, 
  score, 
  total,
  questionsMap,
  onPrevious, 
  onNext 
}: ResponsesViewProps) {
  
  if (responses.length === 0) {
    return (
      <div className="empty-state-card">
        <h2>No responses yet</h2>
        <p>As soon as someone fills out your form, the responses will appear here.</p>
      </div>
    );
  }
  
  const currentResponse = responses[currentResponseIndex];

  return (
    <>
      <div className="response-nav-header">
        <button className="nav-arrow-btn" onClick={onPrevious} disabled={currentResponseIndex === 0}>&lt;</button>
        <span className="response-count-text">{currentResponseIndex + 1} of {responses.length}</span>
        <button className="nav-arrow-btn" onClick={onNext} disabled={currentResponseIndex === responses.length - 1}>&gt;</button>
      </div>
      
      <div className="response-content-card">
        {total > 0 && (
          <div className="score-header">
            <strong>Score: {score} / {total}</strong>
          </div>
        )}

        {Array.from(questionsMap.values()).map((question) => {
          const userAnswerObj = currentResponse.answers.find(a => a.questionId === question.id);
          const userAnswer = userAnswerObj?.value || [];
          const hasCorrectAnswer = !!question.correctAnswer && question.correctAnswer.length > 0;
          const isCorrect = hasCorrectAnswer && areArraysEqual(userAnswer, question.correctAnswer as string[]);

          return (
            <div key={question.id} className={`answer-block ${hasCorrectAnswer ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
              <p className="question-text-response">{question.text}</p>
              <p className="answer-text-response">{userAnswer.join(', ') || <em>(no answer provided)</em>}</p>
              {hasCorrectAnswer && !isCorrect && (
                <div className="correct-answer-hint">
                  <strong>Correct answer: </strong>
                  <span>{question.correctAnswer?.join(', ')}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}