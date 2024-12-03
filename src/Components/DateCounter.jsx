import { type } from "@testing-library/user-event/dist/type";
import { useReducer, useState } from "react";
const initailstate = { count: 0, step: 1 };
const redcucer = (state, action) => {
  // if (action.type === "inc") return state + 1;
  // if (action.type === "dec") return state - 1;
  // if (action.type === "setcount") return state + action.payload;
  switch (action.type) {
    case "inc":
      return { ...state, count: state.count + 1 };

    case "dec":
      return { ...state, count: state.count - 1 };

    case "setcount":
      return { ...state, count: action.payload };
    case "setstep":
      return { ...state, step: action.payload };
    case "reset":
      return initailstate;
    default:
      throw new Error("Unknown");
  }
};
function DateCounter() {
  // const [count, setCount] = useState(0);
  // const [step, setStep] = useState(1);
  const [state, dispatch] = useReducer(redcucer, initailstate);
  const { count, step } = state;

  // This mutates the date object.
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  const dec = function () {
    // setCount((count) => count - 1);
    // setCount((count) => count - step);
    dispatch({ type: "dec" });
  };

  const inc = function () {
    // setCount((count) => count + 1);
    // setCount((count) => count + step);
    dispatch({ type: "inc" });
  };

  const defineCount = function (e) {
    // setCount(Number(e.target.value));
    dispatch({ type: "setcount", payload: Number(e.target.value) });
  };

  const defineStep = function (e) {
    dispatch({ type: "setstep", payload: Number(e.target.value) });
    // setStep(Number(e.target.value));
  };

  const reset = function () {
    dispatch({ type: "reset" });
    // setCount(0);
    // setStep(1);
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
