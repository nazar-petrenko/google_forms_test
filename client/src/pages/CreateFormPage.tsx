import { useFormBuilder } from '../hooks/useFormBuilder';
import { useCreateFormMutation } from "../app/api/enhancedApi"; 
import { QuestionType } from '../app/api/generatedApi';
import '../styles/CreateFormPage.css';

export default function CreateFormPage() {
  const { state, actions } = useFormBuilder();

  return (
    <div className="create-form-page">
      <div className="form-header-card">
        <input
          className={`form-title-input ${state.errors.title ? 'input-error' : ''}`}
          placeholder="Form Title"
          value={state.title}
          onChange={(e) => actions.setTitle(e.target.value)}
        />
        {state.errors.title && <p className="error-message">{state.errors.title}</p>}
        <textarea
          className="form-description-input"
          placeholder="Form Description"
          value={state.description}
          onChange={(e) => actions.setDescription(e.target.value)}
        />
      </div>

      {state.questions.map((q) => (
        <div key={q.id} className="question-card">
          <div className="question-header">
            <div className="question-input-container">
              <input
                className={`question-text-input ${state.errors.questions?.[q.id] ? 'input-error' : ''}`}
                placeholder="Question Text"
                value={q.text}
                onChange={(e) => actions.updateQuestionField(q.id, 'text', e.target.value)}
              />
              {state.errors.questions?.[q.id] && <p className="error-message">{state.errors.questions[q.id]}</p>}
            </div>
            <div className="select-wrapper">
              <select className="question-type-select" value={q.type} onChange={(e) => actions.changeQuestionType(q.id, e.target.value as QuestionType)}>
                <option value={QuestionType.Text}>Short Answer</option>
                <option value={QuestionType.MultipleChoice}>Multiple Choice</option>
                <option value={QuestionType.Checkboxes}>Checkboxes</option>
                <option value={QuestionType.Date}>Date</option>
              </select>
            </div>
          </div>
          
          <div className="question-body">
            {(q.type === QuestionType.MultipleChoice || q.type === QuestionType.Checkboxes) && q.options?.map((opt, i) => (
              <div key={i} className="option-row">
                <span className="option-icon">{q.type === QuestionType.MultipleChoice ? "○" : "□"}</span>
                <div className="option-input-container">
                  <input
                    className={`option-input ${state.errors.options?.[q.id]?.[i] ? 'input-error' : ''}`}
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => actions.updateOption(q.id, i, e.target.value)}
                  />
                  {state.errors.options?.[q.id]?.[i] && <p className="error-message">{state.errors.options[q.id][i]}</p>}
                </div>
                <button className="remove-option-btn" onClick={() => actions.removeOption(q.id, i)}>&times;</button>
              </div>
            ))}
            {(q.type === QuestionType.MultipleChoice || q.type === QuestionType.Checkboxes) && (
              <button className="add-option-btn" onClick={() => actions.addOption(q.id)}>Add option</button>
            )}

             {(q.type === QuestionType.MultipleChoice || q.type === QuestionType.Checkboxes) && q.options && q.options.some(opt => opt.trim() !== '') && (
              <div className="correct-answer-section">
                <p>Select correct answer(s):</p>
                {q.options.filter(opt => opt.trim() !== '').map((opt, i) => (
                  <div key={i} className="option-row-correct">
                    <button 
                      className={`correct-answer-icon ${q.correctAnswer?.includes(opt) ? 'selected' : ''}`}
                      onClick={() => actions.setCorrectAnswer(q.id, opt)}
                    >
                      ✓
                    </button>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="question-footer">
            <button className="remove-question-btn" onClick={() => actions.removeQuestion(q.id)}>
              <svg focusable="false" width="24" height="24" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
            </button>
            <div className="footer-divider"></div>
            <div className="required-toggle-wrapper">
              <span>Required</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={q.isRequired} 
                  onChange={(e) => actions.updateQuestionField(q.id, 'isRequired', e.target.checked)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      ))}
      
      <div className="form-actions">
        <button className="add-question-btn" onClick={actions.addQuestion}>+ Add Question</button>
        <button className="save-form-btn" onClick={actions.saveForm} disabled={state.isLoading}>
          {state.isLoading ? 'Saving...' : 'Save Form'}
        </button>
      </div>
    </div>
  );
}