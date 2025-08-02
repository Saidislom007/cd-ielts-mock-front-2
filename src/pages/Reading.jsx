import React, { useState } from "react";
import Passage1 from "../components/Passage1";
import Passage2 from "../components/Passage2";
import Passage3 from "../components/Passage3";
import "./m.css";

const Reading = () => {
  const [results, setResults] = useState({
    passage1: null,
    passage2: null,
    passage3: null,
  });

  // Har bir passage tugagach chaqiriladi
  const handlePassageResult = (passageKey, correctCount) => {
    setResults((prev) => ({
      ...prev,
      [passageKey]: correctCount,
    }));
  };

  // Tugmani bosganda, barcha passage natijalari yig'iladi va yuboriladi
  const handleFinalSubmit = () => {
    const isAllCompleted = Object.values(results).every((val) => val !== null);


    const total =
      (results.passage1 || 0) +
      (results.passage2 || 0) +
      (results.passage3 || 0);

    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("Foydalanuvchi ma'lumoti topilmadi.");
      return;
    }

    const user = JSON.parse(userData);
    const userId = user.id;

    fetch("http://192.168.0.27:8000/api/user/test-results/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userId,
        reading_correct_answers: total,
        listening_correct_answers: 0,
        speaking_score: 0,
        writing_score: 0,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Xatolik yuz berdi.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Natija muvaffaqiyatli yuborildi:", data);
        alert("Test natijalaringiz muvaffaqiyatli yuborildi!");
        // Masalan: navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Yuborishda xatolik:", error);
        alert("Serverga yuborishda xatolik yuz berdi.");
      });
  };

  return (
    <div className="main">
      <div className="passage1">
        <Passage1 onSubmit={(count) => handlePassageResult("passage1", count)} />
      </div>
      <div className="passage2">
        <Passage2 onSubmit={(count) => handlePassageResult("passage2", count)} />
      </div>
      <div className="passage3">
        <Passage3 onSubmit={(count) => handlePassageResult("passage3", count)} />
      </div>

      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <button className="nav-button" onClick={handleFinalSubmit}>
          Umumiy natijani yuborish
        </button>
      </div>
    </div>
  );
};

export default Reading;
