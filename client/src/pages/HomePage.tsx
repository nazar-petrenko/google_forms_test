import { Link } from 'react-router-dom';
import { useHomePageLogic } from '../hooks/useHomePageLogic';
import type { Form } from '../app/api/generatedApi'; 
import '../styles/HomePage.css';

export default function HomePage() {

  const { forms, error, isLoading } = useHomePageLogic();

  if (isLoading) return <div className="home-page-container">Loading forms...</div>;
  if (error) return <div className="home-page-container">Error fetching forms. Please try again later.</div>;

  return (
    <div className="home-page-container">
      <h1 className="home-header">Recent forms</h1>

      {forms && forms.length > 0 ? (
        <div className="forms-grid">
          {forms.map((form:Form) => (
            <div className="form-card" key={form.id}>
              <div className="card-content">
                <div className="card-title">{form.title}</div>
                <p className="card-description">
                  {form.description || "No description provided."}
                </p>
              </div>
              <div className="card-footer">
                <Link className="card-link" to={`/forms/${form.id}/fill`}>
                  Fill Out
                </Link>
                <Link className="card-link" to={`/forms/${form.id}/responses`}>
                  View Responses
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>You haven't created any forms yet.</p>
          <p>Click "Create New Form" in the header to get started!</p>
        </div>
      )}
    </div>
  );
}