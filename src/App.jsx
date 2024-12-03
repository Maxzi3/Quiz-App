import React, { useEffect, useReducer } from "react";

import Header from "./Components/Header";
import Main from "./Components/Main";
import Loader from "./Components/Loader";
import Error from "./Components/Error";
import Startscreen from "./Components/Startscreen";
import Question from "./Components/Question";
import NextButton from "./Components/NextButton";
import Progress from "./Components/Progress";
import FinshedScreen from "./Components/FinshedScreen";
import Footer from "./Components/Footer";
import Timer from "./Components/Timer";

const SECS_PER_QUESTION = 20;
const initialstate = {
  questions: [],
  // loading , ready, error, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "dataRecieved":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      return {
        ...initialstate,
        questions: state.questions,
        status: "ready",
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action Unknown");
  }
};
const App = () => {
  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialstate);
  const numQuestions = Array.isArray(questions) ? questions.length : 0;
  const maxPossiblePoints = Array.isArray(questions)
    ? questions.reduce((prev, cur) => prev + cur.points, 0)
    : 0;
  useEffect(() => {
    const fetchquestions = async () => {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();
        dispatch({ type: "dataRecieved", payload: data });
      } catch (error) {
        console.log(error);
        dispatch({ type: "dataFailed" });
      }
    };
    fetchquestions();
  }, []);
  return (
    <div className="app">
      <Header />
      <Main className="main">
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <Startscreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" &&
          questions.length > 0 &&
          index < questions.length && (
            <>
              <Progress
                index={index}
                numQuestions={numQuestions}
                points={points}
                maxPossiblePoints={maxPossiblePoints}
                answer={answer}
              />
              <Question
                Question={questions[index]}
                dispatch={dispatch}
                answer={answer}
              />
              <Footer>
                <Timer
                  dispatch={dispatch}
                  secondsRemaining={secondsRemaining}
                />
                <NextButton
                  dispatch={dispatch}
                  answer={answer}
                  numQuestions={numQuestions}
                  index={index}
                />
              </Footer>
            </>
          )}
        {status === "finished" && (
          <FinshedScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
};

export default App;
