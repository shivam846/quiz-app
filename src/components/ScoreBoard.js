import React from "react";

const ScoreBoard = ({ current, total, score, highScore }) => {
  const progress = (current / total) * 100;

  return (
    <div className="scoreboard" role="region" aria-label="Scoreboard">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span aria-label={`Current question ${current} of ${total}`}>
          Question {current} of {total}
        </span>
        <span aria-label={`Your score is ${score}`}>
          Score: {score}
        </span>
        {highScore !== undefined && (
          <span aria-label={`Highest score achieved ${highScore}`}>
            High Score: {highScore}
          </span>
        )}
      </div>

      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
            transition: "width 0.5s ease-in-out",
          }}
        ></div>
      </div>
    </div>
  );
};

export default ScoreBoard;
