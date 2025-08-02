// src/pages/SpeakingResults.jsx

import { useState } from "react";

const SpeakingResults = () => {
  const [evaluation, setEvaluation] = useState({
    fluency: "",
    grammar: "",
    vocabulary: "",
    pronunciation: "",
    feedback: "",
  });

  const handleChange = (e) => {
    setEvaluation({ ...evaluation, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Teacher Feedback:", evaluation);
    alert("Baholash yakunlandi.");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">📝 Speaking Evaluation</h1>
      <audio controls src="https://your-audio-link.ogg" className="w-full"></audio>
      <div className="grid gap-4">
        {["fluency", "grammar", "vocabulary", "pronunciation"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
        ))}
        <textarea
          name="feedback"
          placeholder="General Feedback"
          rows={4}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Submit Evaluation
        </button>
      </div>
    </div>
  );
};

export default SpeakingResults;
