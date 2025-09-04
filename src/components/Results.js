import React, { useEffect, useState } from "react";

const Results = ({ questions, selectedAnswers, score, handleRestart }) => {
  const [highScore, setHighScore] = useState(0);

  // Load high score from localStorage on mount
  useEffect(() => {
    const storedHighScore = parseInt(localStorage.getItem("highScore") || "0", 10);
    if (score > storedHighScore) {
      localStorage.setItem("highScore", score);
      setHighScore(score);
    } else {
      setHighScore(storedHighScore);
    }
  }, [score]);

  return (
    <div className="card">
      <h2 className="results-title">Quiz Completed!</h2>
      <p className="results-score">Your Score: {score} / {questions.length}</p>
      <p className="results-score">High Score: {highScore} / {questions.length}</p>

      {questions.map((q, idx) => (
        <div key={idx} className="results-item">
          <p>{q.question}</p>
          <p>
            Your Answer:{" "}
            <span className={selectedAnswers[idx] === q.correct ? "correct-answer" : "wrong-answer"}>
              {selectedAnswers[idx]}
            </span>
          </p>
          {selectedAnswers[idx] !== q.correct && (
            <p className="correct-answer">Correct Answer: {q.correct}</p>
          )}
        </div>
      ))}

      <button onClick={handleRestart} className="restart-btn">
        Restart Quiz
      </button>
    </div>
  );
};

export default Results;
