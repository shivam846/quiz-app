import React, { useState, useEffect, useCallback } from "react";
import QuestionCard from "../components/QuestionCard";
import ScoreBoard from "../components/ScoreBoard";
import Results from "../components/Results";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timedOutQuestions, setTimedOutQuestions] = useState([]);
  const [questionTimers, setQuestionTimers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  // Fetch questions from API
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `https://opentdb.com/api.php?amount=10&type=multiple`;
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
      setQuestionTimers(new Array(formattedQuestions.length).fill(30)); // initialize timer per question
      setLoading(false);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load questions. Please try again.");
      setLoading(false);
    }
  }, []);

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Handle answer selection
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

  // Navigation handlers
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
      setTimeLeft(questionTimers[currentIndex - 1]);
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
    setSelectedAnswers([]);
    setTimedOutQuestions([]);
    setQuestionTimers(new Array(questions.length).fill(30));
    setScore(0);
    setCurrentIndex(0);
    setShowResults(false);
    fetchQuestions();
  };

  // Timer effect
  useEffect(() => {
    if (showResults || loading) return;

    // If already timed out, no timer needed
    if (timedOutQuestions.includes(currentIndex)) return;

    const timer = setInterval(() => {
      setQuestionTimers((prevTimers) => {
        const newTimers = [...prevTimers];
        if (newTimers[currentIndex] <= 1) {
          // Time ran out
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

  // Loading / Error handling
  if (loading) return <p className="center-text">Loading questions...</p>;
  if (error)
    return (
      <div className="center-text">
        <p className="text-red-600">{error}</p>
        <button onClick={fetchQuestions} className="retry-btn">Retry</button>
      </div>
    );

  return (
    <div className="container">
      {!showResults ? (
        <>
          <ScoreBoard
            current={currentIndex + 1}
            total={questions.length}
            score={score}
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
        </>
      ) : (
        <Results
          questions={questions}
          selectedAnswers={selectedAnswers}
          score={score}
          handleRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default QuizPage;
