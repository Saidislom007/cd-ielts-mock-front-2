import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Section1.css';

const Section1 = ({ onSubmit }) => {
  const [data, setData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const testId = 2;

  useEffect(() => {
    axios
      .get(`api/listening-tests/${testId}/section/1/`)
      .then((res) => setData(res.data))
      .catch((err) => console.error('Error fetching section 1:', err));
  }, []);

  const handleInputChange = (e, number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [number]: e.target.value,
    }));
  };

  const checkCorrect = (number, correctAnswer) => {
    const userValue = (userAnswers[number] || '').trim().toLowerCase();
    const correctVariants = correctAnswer
      .replace(/"/g, '')
      .split(',')
      .map((s) => s.trim().toLowerCase());
    return correctVariants.includes(userValue);
  };

  const handleSubmit = () => {
    setSubmitted(true);

    const table = data.questions[0]?.table;
    if (!table || !table.answers) return;

    let count = 0;
    table.answers.forEach((ans) => {
      if (checkCorrect(ans.number, ans.correct_answer)) {
        count++;
      }
    });

    setCorrectCount(count);

    if (onSubmit) {
      onSubmit(count);
    }
  };

  const renderTableCell = (text) => {
    const regex = /\[\[(\d+)]]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      parts.push(text.slice(lastIndex, match.index));
      const number = match[1];
      parts.push(
        <input
          key={number}
          type="text"
          placeholder={`Q${number}`}
          className="border border-gray-300 p-1 mx-1 rounded w-24"
          value={userAnswers[number] || ''}
          disabled={submitted}
          onChange={(e) => handleInputChange(e, number)}
        />
      );
      lastIndex = regex.lastIndex;
    }

    parts.push(text.slice(lastIndex));
    return parts;
  };

  if (!data) return <div>Loading...</div>;

  const table = data.questions[0]?.table;

  return (
    <div className="section-container">
      <h2 className="section-title">Section 1</h2>

      {data.audio_file && (
        <audio controls src={data.audio_file} className="audio-player" />
      )}

      <p className="instruction-text">{data.instruction}</p>

      {table && (
        <div className="table-container">
          <table className="table-listening">
            <thead>
              <tr>
                {table.columns.map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row.id}>
                  {row.row_data.map((cell, idx) => (
                    <td key={idx}>{renderTableCell(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Section1;
