import { Link } from 'react-router-dom';
import { useFormFiller } from '../hooks/useFormFiller';
import { type Question } from '../app/api/generatedApi';
import "../styles/FillFormPage.css";

export default function FillFormPage() {
  const { state, actions } = useFormFiller();
  const { form, answers, errors, submissionResult, isLoading, isError, isSubmitting } = state;
  const { handleAnswerChange, handleSubmit } = actions;

  if (isLoading) return <div className="loader">Loading form...</div>;
  if (isError || !form) return <div className="error-page">Error loading form.</div>;

  if (submissionResult) {
    return (
      <div className="fill-form-container">
        <div className="results-card">
          <h2>Form submitted successfully!</h2>
          {submissionResult.total > 0 && (
            <p className="score-text">
              Your score: <strong>{submissionResult.score}</strong> out of <strong>{submissionResult.total}</strong>
            </p>
          )}
          <Link to="/" className="back-to-home-btn">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fill-form-container">
      <div className="form-header">
        <h1 className="form-title">{form.title}</h1>
        {form.description && <p className="form-description">{form.description}</p>}
        <p className="required-notice">* Required field</p>
      </div>

      <form className="fill-form-body" onSubmit={handleSubmit} noValidate>
        {form.questions.map((q: Question) => (
          <div key={q.id} className={`question-block ${errors[q.id] ? 'block-error' : ''}`}>
            <label className="question-text">
              {q.text} {q.isRequired && <span className="required-star">*</span>}
            </label>
            
            {q.type === 'TEXT' && 
              <input 
                type="text" 
                className="text-input" 
                onChange={e => handleAnswerChange(q.id, e.target.value, q.type)} 
              />
            }

            {q.type === 'DATE' && 
              <input 
                type="date" 
                className="date-input" 
                onChange={e => handleAnswerChange(q.id, e.target.value, q.type)} 
              />
            }
            
            {q.type === 'MULTIPLE_CHOICE' && q.options?.map((opt: string) => (
              <label key={opt} className="choice-option">{opt}
                <input 
                  type="radio" 
                  name={q.id} 
                  value={opt} 
                  onChange={e => handleAnswerChange(q.id, e.target.value, q.type)} 
                />
                <span className="checkmark radio"></span>
              </label>
            ))}

            {q.type === 'CHECKBOXES' && q.options?.map((opt: string) => (
              <label key={opt} className="choice-option">{opt}
                <input 
                  type="checkbox" 
                  value={opt} 
                  checked={answers[q.id]?.includes(opt) || false} 
                  onChange={e => handleAnswerChange(q.id, e.target.value, q.type)} 
                />
                <span className="checkmark"></span>
              </label>
            ))}

            {errors[q.id] && <p className="error-message">{errors[q.id]}</p>}
          </div>
        ))}
        <button className="submit-form-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}