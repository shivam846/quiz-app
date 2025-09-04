import React, { useState, useEffect, useCallback } from "react";
import QuestionCard from "../components/QuestionCard";
import ScoreBoard from "../components/ScoreBoard";
import Results from "../components/Results";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState("easy"); // Default difficulty
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timedOutQuestions, setTimedOutQuestions] = useState([]);
  const [questionTimers, setQuestionTimers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("quizHighScore")) || 0
  );

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      if (!data.results || data.results.length === 0)
        throw new Error("No questions found from API");

      const formattedQuestions = data.results.map((q) => ({
        question: decodeHtml(q.question),
        options: shuffleArray([
          ...q.incorrect_answers.map((ans) => decodeHtml(ans)),
          decodeHtml(q.correct_answer),
        ]),
        correct: decodeHtml(q.correct_answer),
      }));

      setQuestions(formattedQuestions);
      setQuestionTimers(new Array(formattedQuestions.length).fill(30));
      setSelectedAnswers([]);
      setTimedOutQuestions([]);
      setCurrentIndex(0);
      setScore(0);
      setShowResults(false);
      setTimeLeft(30);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load questions. Please try again.");
      setLoading(false);
    }
  }, [difficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswer = useCallback(
    (answer) => {
      if (selectedAnswers[currentIndex] || timedOutQuestions.includes(currentIndex)) return;

      const updatedAnswers = [...selectedAnswers];
      updatedAnswers[currentIndex] = answer;
      setSelectedAnswers(updatedAnswers);

      if (answer === questions[currentIndex].correct) {
        setScore((prev) => prev + 1);
      }
    },
    [currentIndex, questions, selectedAnswers, timedOutQuestions]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(questionTimers[currentIndex + 1]);
    } else {
      setShowResults(true);
    }
  }, [currentIndex, questions.length, questionTimers]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTimeLeft(
        timedOutQuestions.includes(currentIndex - 1)
          ? 0
          : questionTimers[currentIndex - 1]
      );
    }
  };

  const handleSkip = () => {
    if (!selectedAnswers[currentIndex]) {
      const updatedAnswers = [...selectedAnswers];
      updatedAnswers[currentIndex] = "Skipped";
      setSelectedAnswers(updatedAnswers);
    }
    handleNext();
  };

  const handleRestart = () => {
    fetchQuestions();
  };

  // Timer effect
  useEffect(() => {
    if (showResults || loading) return;
    if (timedOutQuestions.includes(currentIndex)) return;

    const timer = setInterval(() => {
      setQuestionTimers((prevTimers) => {
        const newTimers = [...prevTimers];
        if (newTimers[currentIndex] <= 1) {
          if (!selectedAnswers[currentIndex]) {
            const updatedAnswers = [...selectedAnswers];
            updatedAnswers[currentIndex] = "No Answer";
            setSelectedAnswers(updatedAnswers);
            setTimedOutQuestions((prev) => [...prev, currentIndex]);
          }
          handleNext();
          newTimers[currentIndex] = 0;
        } else {
          newTimers[currentIndex] -= 1;
        }
        setTimeLeft(newTimers[currentIndex]);
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, showResults, loading, selectedAnswers, handleNext, timedOutQuestions]);

  // Update high score after quiz ends
  useEffect(() => {
    if (showResults && score > highScore) {
      setHighScore(score);
      localStorage.setItem("quizHighScore", score);
    }
  }, [showResults, score, highScore]);

  // Difficulty selector with ARIA & keyboard accessibility
  const DifficultySelector = () => (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <label style={{ marginRight: "10px", fontWeight: "600" }}>Difficulty:</label>
      {["easy", "medium", "hard"].map((level) => (
        <button
          key={level}
          onClick={() => setDifficulty(level)}
          aria-pressed={difficulty === level}
          aria-label={`Select ${level} difficulty`}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setDifficulty(level); }}
          style={{
            margin: "0 5px",
            padding: "8px 16px",
            borderRadius: "6px",
            border: difficulty === level ? "2px solid #3b82f6" : "1px solid #d1d5db",
            backgroundColor: difficulty === level ? "#bae6fd" : "#fff",
            cursor: "pointer",
          }}
        >
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </button>
      ))}
    </div>
  );

  if (loading) return <p className="center-text">Loading questions...</p>;
  if (error)
    return (
      <div className="center-text">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchQuestions}
          className="retry-btn"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fetchQuestions(); }}
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="container">
      <DifficultySelector />
      {!showResults ? (
        <>
          <ScoreBoard
            current={currentIndex + 1}
            total={questions.length}
            score={score}
            highScore={highScore}
          />

          {/* Timer */}
          <div className="timer-container">
            Time Left: {timeLeft}s
            <div className="timer-bar">
              <div
                className="timer-fill"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Fade-in question */}
          <div key={currentIndex} className="fade-in">
            <QuestionCard
              question={questions[currentIndex]}
              handleAnswer={handleAnswer}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              handleSkip={handleSkip}
              selectedOption={selectedAnswers[currentIndex] || null}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              isTimedOut={timedOutQuestions.includes(currentIndex)}
            />
          </div>
        </>
      ) : (
        <Results
          questions={questions}
          selectedAnswers={selectedAnswers}
          score={score}
          highScore={highScore}
          handleRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default QuizPage;
