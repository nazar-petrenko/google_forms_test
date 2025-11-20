import { useFormResponses } from '../hooks/useFormResponses';
import ResponsesView from './ResponsesView';
import "../styles/ResponsesPage.css";

export default function ResponsesPage() {
    const { state, actions } = useFormResponses();
    const { form, responses, isLoading, isError, ...viewProps } = state;
    
    if (isLoading) return <div className="loader">Loading responses...</div>;
    if (isError || !form || !responses) return <div className="error-page">Failed to load responses.</div>;

    return (
        <div className="responses-page-container">
            <div className="responses-header">
                <h1 className="form-main-title">{form.title}</h1>
            </div>
            <ResponsesView 
                form={form} 
                responses={responses}
                {...viewProps}
                onPrevious={actions.goToPrevious}
                onNext={actions.goToNext}
            />
        </div>
    );
}