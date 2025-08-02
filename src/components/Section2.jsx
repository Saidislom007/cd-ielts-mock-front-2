import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Section2.css';

const Section2 = ({ onSubmit }) => {
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    axios
      .get('http://192.168.0.27:8000/api/listening-tests/2/section/2/')
      .then((res) => setData(res.data))
      .catch((err) => console.error('Error fetching Section 2:', err));
  }, []);

  const isMultiSelect = (qNumber) => [17, 18, 19, 20].includes(qNumber);

  const handleSelect = (qNumber, option) => {
    const existing = answers[qNumber] || [];
    let updated;

    if (isMultiSelect(qNumber)) {
      updated = existing.includes(option)
        ? existing.filter((opt) => opt !== option)
        : [...existing, option].slice(0, 1); // Max 2 tanlash
    } else {
      updated = [option];
    }

    setAnswers((prev) => ({
      ...prev,
      [qNumber]: updated,
    }));
  };

  const isCorrect = (question) => {
    const correct = question.correct_answer
      .split(',')
      .map((s) => s.trim().replace(/"/g, ''));

    const userAns = answers[question.question_number] || [];

    return (
      correct.length === userAns.length &&
      correct.every((ans) => userAns.includes(ans))
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);

    const correct = data.questions.filter((q) => isCorrect(q)).length;
    setCorrectCount(correct);

    // Natijani parent componentga yuborish uchun
    if (onSubmit) {
      onSubmit(correct);
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="section2-container">
      <h2 className="section2-title">Section 2</h2>

      {data.audio_file && (
        <audio controls className="section2-audio">
          <source src={data.audio_file} type="audio/mpeg" />
        </audio>
      )}

      <p className="section2-instruction">{data.instruction}</p>

      {data.questions.map((q) => (
        <div key={q.id} className="section2-question">
          <p className="section2-question-text">
            <strong>Q{q.question_number}.</strong>{' '}
            {q.question_text !== '" "' ? q.question_text : ''}
          </p>

          {q.instruction && (
            <p className="section2-question-instruction">{q.instruction}</p>
          )}

          <div className="section2-options">
            {q.options.map((opt, idx) => (
              <label key={idx} className="option-label">
                <input
                  type={isMultiSelect(q.question_number) ? 'checkbox' : 'radio'}
                  name={`q-${q.question_number}`}
                  value={opt}
                  checked={(answers[q.question_number] || []).includes(opt)}
                  onChange={() => handleSelect(q.question_number, opt)}
                  disabled={submitted}
                />
                {opt}
              </label>
            ))}
          </div>

          
        </div>
      ))}

      
    </div>
  );
};

export default Section2;
