import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pages/ReadingTestMock.css";

const Passage1 = ({ onSubmit }) => {
  const [passage, setPassage] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  // Ma'lumotlarni olish
  useEffect(() => {
    axios
      .get("/api/reading-tests/2/passage/1")
      .then((res) => {
        setPassage(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Xatolik yuz berdi:", err);
        setLoading(false);
      });
  }, []);

  // Javob o'zgarganda natijani qayta hisoblash
  useEffect(() => {
    if (!passage || !onSubmit) return;

    let correctCount = 0;

    passage.questions.forEach((q) => {
      const userAnswer = answers[q.id]?.toString().trim().toLowerCase();
      const correctAnswer = q.correct_answer?.toString().trim().toLowerCase();

      if (userAnswer && correctAnswer && userAnswer === correctAnswer) {
        correctCount++;
      }
    });

    onSubmit(correctCount);
  }, [answers, passage, onSubmit]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  if (loading || !passage) {
    return <div className="reading-test-container">Yuklanmoqda...</div>;
  }

  return (
    <div className="reading-test-container">
      <div className="reading-test-wrapper">
        <div className="header">
          <div className="header-content">
            <h1 className="header-title">{passage.title}</h1>
            <div className="header-info">Passage 1</div>
          </div>
        </div>

        <div className="main-content">
          <div className="passage-section">
            <div className="passage-header">
              <div className="passage-badge">Passage 1</div>
              <p className="passage-instruction">{passage.instruction}</p>
            </div>
            <div className="passage-content">
              <div className="passage-text" style={{ whiteSpace: "pre-line" }}>
                {passage.text}
              </div>
            </div>
          </div>

          <div className="questions-section">
            <div className="questions-header">
              <div className="questions-badge">Savollar</div>
            </div>

            <div className="questions-list">
              {passage.questions.map((q) => (
                <div key={q.id} className="question-item">
                  {q.instruction && (
                    <p className="questions-instruction">{q.instruction}</p>
                  )}

                  <div className="question-header">
                    <span className="question-number">{q.question_number}</span>
                    <p className="question-text">{q.question_text}</p>
                  </div>

                  <div className="question-options">
                    {q.options && q.options.length > 0 ? (
                      q.options.map((opt, index) => (
                        <label key={index} className="option-label">
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={(e) =>
                              handleAnswerChange(q.id, e.target.value)
                            }
                            className="option-input"
                          />
                          <span className="option-text">{opt}</span>
                        </label>
                      ))
                    ) : (
                      <input
                        type="text"
                        className="summary-input"
                        placeholder="Javobingizni kiriting"
                        value={answers[q.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(q.id, e.target.value)
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passage1;
