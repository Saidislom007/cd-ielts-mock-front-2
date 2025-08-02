import { useState, useEffect } from "react";
import "./writingEvaluation.css";


const TELEGRAM_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

const WritingEvaluation = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [evaluation, setEvaluation] = useState({
    taskResponse: "",
    coherence: "",
    lexical: "",
    grammar: "",
    feedback: "",
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("writing_essay_submissions")) || [];
    setSubmissions(data);
  }, []);

  const handleChange = (e) => {
    setEvaluation({ ...evaluation, [e.target.name]: e.target.value });
  };

  const calculateOverall = () => {
    const scores = [
      parseFloat(evaluation.taskResponse),
      parseFloat(evaluation.coherence),
      parseFloat(evaluation.lexical),
      parseFloat(evaluation.grammar),
    ];
    const validScores = scores.filter((s) => !isNaN(s));
    if (validScores.length === 0) return "";
    const sum = validScores.reduce((a, b) => a + b, 0);
    return (sum / validScores.length).toFixed(1);
  };

  const handleSubmit = async () => {
    if (selectedIndex === null) return;
    const submission = submissions[selectedIndex];
    const overall = calculateOverall();

    const message = `
📝 *IELTS Writing Evaluation*

✍️ *Task 1*:
${submission.task1}

✍️ *Task 2*:
${submission.task2}

📊 *Admin Feedback*:
Task Response: ${evaluation.taskResponse}
Coherence & Cohesion: ${evaluation.coherence}
Lexical Resource: ${evaluation.lexical}
Grammar: ${evaluation.grammar}

💬 *General Feedback*: 
${evaluation.feedback}

🏁 *Overall Band*: ${overall}
    `;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    alert("✅ Baholash telegramga yuborildi!");
    setEvaluation({
      taskResponse: "",
      coherence: "",
      lexical: "",
      grammar: "",
      feedback: "",
    });
    setSelectedIndex(null);
  };

  const handleDelete = (index) => {
    const updated = [...submissions];
    updated.splice(index, 1);
    localStorage.setItem("writing_essay_submissions", JSON.stringify(updated));
    setSubmissions(updated);
    setSelectedIndex(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📋 Writing Evaluation Panel</h1>

      {submissions.length === 0 ? (
        <p className="text-center text-gray-500">Hech qanday yozuv topilmadi.</p>
      ) : (
        <div className="space-y-8">
          {submissions.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 border rounded-lg shadow ${
                selectedIndex === idx ? "bg-blue-50" : "bg-white"
              }`}
            >
              <p className="text-gray-700 mb-2"><strong>Task 1:</strong> {item.task1?.slice(0, 150)}...</p>
              <p className="text-gray-700 mb-2"><strong>Task 2:</strong> {item.task2?.slice(0, 150)}...</p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setSelectedIndex(idx)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Baholash
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  O‘chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedIndex !== null && (
        <div className="mt-10 p-6 bg-gray-100 border rounded-xl space-y-4">
          <h2 className="text-xl font-semibold">🔎 Baholash formasi</h2>
          {["taskResponse", "coherence", "lexical", "grammar"].map((key) => (
            <input
              key={key}
              type="number"
              name={key}
              value={evaluation[key]}
              onChange={handleChange}
              placeholder={key.replace(/^\w/, (c) => c.toUpperCase())}
              className="block w-full border p-2 rounded mb-2"
              min={0}
              max={9}
              step={0.5}
            />
          ))}
          <textarea
            name="feedback"
            value={evaluation.feedback}
            onChange={handleChange}
            rows={4}
            placeholder="Umumiy izoh..."
            className="w-full border p-3 rounded"
          />
          <div className="mt-4 flex justify-between items-center">
            <div className="text-lg font-bold text-green-700">
              Overall Band: {calculateOverall()}
            </div>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-3 rounded-lg"
            >
              ✅ Yuborish Telegramga
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingEvaluation;
