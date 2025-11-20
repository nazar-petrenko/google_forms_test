import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateFormPage from "./pages/CreateFormPage";
import FillFormPage from "./pages/FillFormPage";
import ResponsesPage from "./pages/ResponsesPage";
import "./App.css"; 

export default function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <div className="header-left">
          <Link to="/" className="header-logo-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#673ab7">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </Link>
          <span className="header-title">Forms Lite</span>
        </div>
        
        <div className="header-right">
          <Link to="/forms/new" className="create-form-link">
            Create New Form
          </Link>
        </div>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forms/new" element={<CreateFormPage />} />
          <Route path="/forms/:id/fill" element={<FillFormPage />} />
          <Route path="/forms/:id/responses" element={<ResponsesPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}