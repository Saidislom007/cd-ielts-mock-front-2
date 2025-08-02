import React, { useEffect, useState } from "react";
import "./Section3.css";

const Section3 = ({ onSubmit }) => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    fetch("http://192.168.0.27:8000/api/listening-tests/2/section/3/")
      .then((response) => response.json())
      .then((data) => {
        setSection(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API error:", error);
        setLoading(false);
      });
  }, []);

  const handleAnswerChange = (qNumber, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qNumber]: value,
    }));
  };

  const isCorrect = (question) => {
    const correctAnswers = question.correct_answer
      .replace(/"/g, "")
      .split(",")
      .map((s) => s.trim().toLowerCase());

    const userAnswer = (userAnswers[question.question_number] || "").trim().toLowerCase();

    return correctAnswers.includes(userAnswer);
  };

  const handleSubmit = () => {
    setSubmitted(true);

    const correct = section.questions.filter((q) => isCorrect(q)).length;
    setCorrectCount(correct);

    // Natijani parent componentga uzatish
    if (onSubmit) {
      onSubmit(correct);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!section) return <p>Error loading section data.</p>;

  return (
    <div className="listening-section">
      <h2 className="section-title">Section {section.section_number}</h2>

      {section.audio_file && (
        <audio controls className="audio-player">
          <source src={section.audio_file} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}

      {section.instruction && (
        <p className="section-instruction">{section.instruction}</p>
      )}

      <div className="question-list">
        {section.questions.map((question) => (
          <div key={question.id} className="question-card">
            {question.instruction && (
              <p className="question-instruction">{question.instruction}</p>
            )}

            <p className="question-number">
              Question {question.question_number}
            </p>

            {question.question_text.trim() &&
              !(question.question_number >= 21 && question.question_number <= 26) && (
                <p className="question-text">{question.question_text}</p>
              )}

            <ul className="options-list">
              {question.options?.map((option, idx) => (
                <li key={idx}>
                  <label>
                    <input
                      type="radio"
                      name={`q${question.question_number}`}
                      value={option}
                      disabled={submitted}
                      checked={userAnswers[question.question_number] === option}
                      onChange={() =>
                        handleAnswerChange(question.question_number, option)
                      }
                    />
                    {option}
                  </label>
                </li>
              ))}
            </ul>

            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section3;
