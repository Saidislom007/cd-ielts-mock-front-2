import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pages/ReadingTestMock.css";

const Passage3 = ({ onSubmit }) => {
  const [passage, setPassage] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  // Ma'lumotni yuklash
  useEffect(() => {
    axios
      .get("/api/reading-tests/2/passage/3")
      .then((res) => {
        setPassage(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Xatolik:", err);
        setLoading(false);
      });
  }, []);

  // Javoblar o'zgarganida natijani hisoblash
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
            <div className="header-info">Passage 3</div>
          </div>
        </div>

        <div className="main-content">
          {/* Matn */}
          <div className="passage-section">
            <div className="passage-header">
              <div className="passage-badge">Passage 3</div>
              <p className="passage-instruction">{passage.instruction}</p>
            </div>
            <div className="passage-content">
              <div className="passage-text" style={{ whiteSpace: "pre-line" }}>
                {passage.text}
              </div>
            </div>
          </div>

          {/* Savollar */}
          <div className="questions-section">
            <div className="questions-header">
              <div className="questions-badge">
                Questions {passage.questions[0]?.question_number} -{" "}
                {passage.questions.at(-1)?.question_number}
              </div>
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
                    {q.options && Array.isArray(q.options) ? (
                      q.options.map((opt, idx) => (
                        <label key={idx} className="option-label">
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

            {/* Summary bo‘limi */}
            {passage.summary && (
              <div className="summary-section">
                <div className="summary-badge">Summary</div>
                <p className="summary-instruction">
                  Complete the summary below. Use NO MORE THAN TWO WORDS.
                </p>
                <div className="summary-content">
                  <p className="summary-text">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: passage.summary.replace(
                          /\[\[([0-9]+)\]\]/g,
                          (_, idx) =>
                            `<input type="text" class="summary-input" placeholder="Gap ${idx}" disabled />`
                        ),
                      }}
                    />
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passage3;
