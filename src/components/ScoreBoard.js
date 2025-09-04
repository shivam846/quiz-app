import React from "react";

const ScoreBoard = ({ current, total, score }) => {
  const progress = (current / total) * 100;

  return (
    <div className="scoreboard">
      <span>Question {current} of {total}</span>
      <span>Score: {score}</span>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default ScoreBoard;
