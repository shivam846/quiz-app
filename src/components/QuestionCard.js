import React from "react";

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
  const selectOption = (option) => {
    if (selectedOption || isTimedOut) return; // allow selection only if not answered & not timed out
    handleAnswer(option);
  };

  return (
    <div className="card">
      <h2 className="question-text">{question.question}</h2>

      {question.options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => selectOption(option)}
          disabled={selectedOption !== null || isTimedOut}
          className={`option-btn ${
            selectedOption === option ? "option-selected" : ""
          }`}
        >
          {option}
        </button>
      ))}

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
        <p className="selected-info">
          Your Answer: {selectedOption}
        </p>
      )}

      {/* Navigation buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <button
          onClick={handlePrevious}
          className="next-btn"
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <button onClick={handleSkip} className="next-btn">
          Skip
        </button>
        <button onClick={handleNext} className="next-btn">
          {currentIndex + 1 === totalQuestions ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
