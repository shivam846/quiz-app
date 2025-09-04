import React, { useEffect, useRef, useState } from "react";

const QuestionCard = ({
  question,
  handleAnswer,
  handleNext,
  handlePrevious,
  handleSkip,
  selectedOption,
  currentIndex,
  totalQuestions,
  isTimedOut,
}) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const optionRefs = useRef([]);

  // Handle keyboard navigation for options
  const handleKeyDown = (e) => {
    if (isTimedOut || selectedOption) return;

    switch (e.key) {
      case "ArrowDown":
        setFocusedIndex((prev) => (prev + 1) % question.options.length);
        optionRefs.current[(focusedIndex + 1) % question.options.length].focus();
        break;
      case "ArrowUp":
        setFocusedIndex((prev) => (prev - 1 + question.options.length) % question.options.length);
        optionRefs.current[(focusedIndex - 1 + question.options.length) % question.options.length].focus();
        break;
      case "Enter":
      case " ":
        selectOption(question.options[focusedIndex]);
        break;
      default:
        break;
    }
  };

  const selectOption = (option) => {
    if (selectedOption || isTimedOut) return;
    handleAnswer(option);
  };

  useEffect(() => {
    // Reset focus when question changes
    setFocusedIndex(0);
    if (optionRefs.current[0]) optionRefs.current[0].focus();
  }, [question]);

  return (
    <div className="card fade-in" onKeyDown={handleKeyDown} tabIndex={0} aria-live="polite">
      <h2 className="question-text">{question.question}</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
        {question.options.map((option, idx) => (
          <button
            key={idx}
            ref={(el) => (optionRefs.current[idx] = el)}
            onClick={() => selectOption(option)}
            disabled={selectedOption !== null || isTimedOut}
            className={`option-btn ${selectedOption === option ? "option-selected" : ""}`}
            aria-pressed={selectedOption === option}
            aria-label={`Answer option ${idx + 1}: ${option}`}
          >
            {option}
          </button>
        ))}
      </div>

      {isTimedOut && !selectedOption && (
        <p className="wrong-answer" style={{ marginTop: "10px" }}>
          Time's up! You cannot select an answer now.
        </p>
      )}

      {selectedOption === "Skipped" && (
        <p className="wrong-answer" style={{ marginTop: "10px" }}>
          Question Skipped
        </p>
      )}

      {selectedOption && selectedOption !== "Skipped" && (
        <p className="selected-info" style={{ marginTop: "10px" }}>
          Your Answer: {selectedOption}
        </p>
      )}

      {/* Navigation buttons */}
      <div
        style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}
      >
        <button
          onClick={handlePrevious}
          className="next-btn"
          disabled={currentIndex === 0}
          aria-label="Previous Question"
        >
          Previous
        </button>
        <button
          onClick={handleSkip}
          className="next-btn"
          aria-label="Skip Question"
        >
          Skip
        </button>
        <button
          onClick={handleNext}
          className="next-btn"
          aria-label={currentIndex + 1 === totalQuestions ? "Finish Quiz" : "Next Question"}
        >
          {currentIndex + 1 === totalQuestions ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
