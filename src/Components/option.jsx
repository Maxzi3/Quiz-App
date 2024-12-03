import React from "react";

const option = ({ Question, dispatch, answer }) => {
  const hasanswered = answer !== null;
  return (
    <div>
      <ul className="options">
        {Question.options.map((option, index) => (
          <button
            className={`btn btn-option ${index === answer ? "answer" : ""} ${
              hasanswered
                ? index === Question.correctOption
                  ? "correct"
                  : "wrong"
                : ""
            }`}
            key={option}
            disabled={hasanswered}
            onClick={() => dispatch({ type: "newAnswer", payload: index })}
          >
            {option}
          </button>
        ))}
      </ul>
    </div>
  );
};

export default option;
