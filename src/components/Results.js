import React from "react";

const Results = ({ questions, selectedAnswers, score, handleRestart }) => {
  return (
    <div className="card">
      <h2 className="results-title">Quiz Completed!</h2>
      <p className="results-score">Your Score: {score} / {questions.length}</p>

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
