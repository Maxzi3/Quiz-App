import React from "react";
import Option from "./option";

const Question = ({ Question, dispatch, answer }) => {
  return (
    <div>
      <h4>{Question.question}</h4>
      <Option Question={Question} dispatch={dispatch} answer={answer} />
    </div>
  );
};

export default Question;
