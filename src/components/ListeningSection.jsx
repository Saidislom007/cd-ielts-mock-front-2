import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListeningSection = ({ testId, sectionNumber }) => {
  const [data, setData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/listening-tests/${testId}/section/${sectionNumber}/`)
      .then(res => setData(res.data))
      .catch(err => console.error(`Section ${sectionNumber} error:`, err));
  }, [testId, sectionNumber]);

  const handleInput = (e, number) => {
    setUserAnswers(prev => ({
      ...prev,
      [number]: e.target.value
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const checkAnswer = (number, correct) => {
    const user = (userAnswers[number] || '').trim().toLowerCase();
    const correctOptions = correct.replace(/"/g, '').split(',').map(opt => opt.trim().toLowerCase());
    return correctOptions.includes(user);
  };

  const renderCell = (text) => {
    const regex = /\[\[(\d+)]]/g;
    const parts = [];
    let last = 0, match;

    while ((match = regex.exec(text)) !== null) {
      parts.push(text.slice(last, match.index));
      const number = match[1];
      parts.push(
        <input
          key={number}
          type="text"
          className="border p-1 w-20 mx-1 rounded"
          disabled={submitted}
          onChange={(e) => handleInput(e, number)}
        />
      );
      last = regex.lastIndex;
    }
    parts.push(text.slice(last));
    return parts;
  };

  if (!data) return <div>Loading Section {sectionNumber}...</div>;

  const table = data.questions[0]?.table;

  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold mb-2">Section {sectionNumber}</h2>
      {data.audio_file && (
        <audio controls src={data.audio_file} className="mb-3 w-full" />
      )}
      <p className="mb-4 italic">{data.instruction}</p>

      {table && (
        <table className="table-auto w-full text-sm border mb-4">
          <thead>
            <tr>
              {table.columns.map((col, idx) => (
                <th key={idx} className="border p-2 bg-gray-100">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.id}>
                {row.row_data.map((cell, idx) => (
                  <td key={idx} className="border p-2">{renderCell(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Section {sectionNumber}
        </button>
      ) : (
        <div className="mt-4 space-y-1">
          {table.answers.map(ans => (
            <p key={ans.id}>
              [[{ans.number}]]: <strong>{userAnswers[ans.number] || '—'}</strong>{' '}
              | To‘g‘ri: <strong>{ans.correct_answer}</strong>{' '}
              {checkAnswer(ans.number, ans.correct_answer) ? (
                <span className="text-green-600">✅</span>
              ) : (
                <span className="text-red-600">❌</span>
              )}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListeningSection;
