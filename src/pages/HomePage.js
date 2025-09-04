import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Welcome to the Quiz App</h1>
        <p className="home-subtitle">
          Test your knowledge with fun multiple-choice questions!
        </p>
        <button onClick={startQuiz} className="home-start-btn">
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default HomePage;
