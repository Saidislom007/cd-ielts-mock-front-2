import React, { useEffect, useState } from "react";
import "./Section4.css";

const Section4 = ({ onSubmit }) => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    fetch("http://192.168.0.27:8000/api/listening-tests/2/section/4/")
      .then((res) => res.json())
      .then((data) => {
        setSection(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching section 4:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (qNumber, value) => {
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

    const userAnswer = (userAnswers[question.question_number] || "")
      .trim()
      .toLowerCase();

    return correctAnswers.includes(userAnswer);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = section.questions.filter((q) => isCorrect(q)).length;
    setCorrectCount(correct);
    if (onSubmit) onSubmit(correct);
  };

  const renderQuestionText = (text, qNumber) => {
    const parts = text.split(/\[\[\d+\]\]/g); // matnni ajratamiz
    const matches = text.match(/\[\[\d+\]\]/g) || []; // input joylari

    const elements = [];

    parts.forEach((part, i) => {
      elements.push(<span key={`text-${i}`}>{part}</span>);

      if (i < matches.length) {
        elements.push(
          <input
            key={`input-${i}`}
            type="text"
            className="inline-input mx-1 border-b border-gray-500 focus:outline-none w-24"
            value={userAnswers[qNumber] || ""}
            onChange={(e) => handleChange(qNumber, e.target.value)}
            disabled={submitted}
            placeholder={`Q${qNumber}`}
          />
        );
      }
    });

    return elements;
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

      <div className="questions">
        {section.questions.map((q) => (
          <div key={q.id} className="mb-6">
            {q.instruction && (
              <p className="question-instruction">{q.instruction}</p>
            )}
            <p className="question-text">
              {renderQuestionText(q.question_text, q.question_number)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section4;











