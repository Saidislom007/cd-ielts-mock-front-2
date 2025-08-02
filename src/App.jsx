// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Reading from "./pages/Reading";
import Writing from "./pages/Writing";
import SpeakingPage from "./pages/Speaking";
import Listening from "./pages/Listening";
import SpeakingResults from "./pages/SpeakingResults";
import WritingEvaluation from "./pages/WritingEvaluation";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/speaking" element={<SpeakingPage />} />
        <Route path="/listening" element={<Listening />} />
        <Route path="/speaking-results" element={<SpeakingResults />} />
        <Route path="/writing-evaluation" element={<WritingEvaluation />} />
      </Routes>
    </BrowserRouter>
  );
}
