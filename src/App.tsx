import React from "react";

import "./App.css";
import { CountdownProvider, useCountdown } from "./context/countdown-context";

function App() {
  const [state, dispatch] = useCountdown();
  const {
    status,
    countdownType,
    sesionLength,
    breakLength,
    remainingTime: { minutes, seconds },
  } = state;

  const countdownRef = React.useRef<null | NodeJS.Timeout>(null);
  const beepRef = React.useRef<null | HTMLAudioElement>(null);

  const onSessionClick = React.useCallback(
    (value: number) => {
      if (
        (status !== "idle" && status !== "stopped" && status !== "paused") ||
        value > 60 ||
        value <= 0
      )
        return;

      dispatch({
        type: "change-session-interval",
        payload: value,
      });
    },
    [status, dispatch]
  );

  const onBreakClick = React.useCallback(
    (value: number) => {
      if (
        (status !== "idle" && status !== "stopped" && status !== "paused") ||
        value > 60 ||
        value <= 0
      )
        return;

      dispatch({
        type: "change-break-interval",
        payload: value,
      });
    },
    [status, dispatch]
  );

  const handleStartAndPause = React.useCallback(() => {
    if (status === "counting") {
      dispatch({ type: "pause" });
      countdownRef.current && clearInterval(countdownRef.current);
      countdownRef.current = null;
    } else if (status === "idle" && countdownType === "break") {
      dispatch({ type: "start-break" });
    } else if (status === "paused") {
      dispatch({ type: "continue" });
    } else {
      dispatch({ type: "start-session" });
    }
  }, [status, countdownType, dispatch]);

  const handleReset = React.useCallback(() => {
    dispatch({ type: "reset" });
    beepRef.current?.load();
  }, [dispatch]);

  const addFirstZero = (value: number) => {
    if (Number.isNaN(value)) return;
    else if (value < 10) return `0${value}`;
    else return value;
  };

  React.useEffect(() => {
    if (status === "counting") {
      countdownRef.current = setInterval(() => {
        dispatch({ type: "update-remaining" });
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [status, dispatch]);

  React.useLayoutEffect(() => {
    if (status === "stopped") {
      dispatch({
        type: countdownType === "session" ? "start-break" : "start-session",
      });
      beepRef.current?.play();
    }
  }, [status, dispatch, countdownType]);

  return (
    <div className="app">
      <div className="title">
        <h1 className="no-margin">Pomodoro Clock</h1>
      </div>
      <div className="controls">
        <div className="break-ctrl">
          <h3 id="break-label" className="subtitle">
            Break Length
          </h3>
          <div className="inner-ctrl">
            <button
              id="break-decrement"
              className="button"
              onClick={() => onBreakClick(breakLength - 1)}
            >
              <i className="fas fa-caret-down"></i>
            </button>
            <h3 id="break-length" className="no-margin text">
              {breakLength}
            </h3>

            <button
              id="break-increment"
              className="button"
              onClick={() => onBreakClick(breakLength + 1)}
            >
              <i className="fas fa-caret-up"></i>
            </button>
          </div>
        </div>
        <div className="session-ctrl">
          <h3 id="session-label" className="subtitle">
            Session Length
          </h3>
          <div className="inner-ctrl">
            <button
              id="session-decrement"
              className="button"
              onClick={() => onSessionClick(sesionLength - 1)}
            >
              <i className="fas fa-caret-down"></i>
            </button>
            <h3 id="session-length" className="no-margin text">
              {sesionLength}
            </h3>
            <button
              id="session-increment"
              className="button"
              onClick={() => onSessionClick(sesionLength + 1)}
            >
              <i className="fas fa-caret-up"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="display-container">
        <div className="display">
          <h2 id="timer-label" className="session-title">
            {countdownType}
          </h2>
          <h2 id="time-left" className="time">
            {addFirstZero(minutes)}:{addFirstZero(seconds)}
          </h2>
        </div>
        <div className="buttons">
          <div className="play">
            <h5 className="btn-label">Play/Pause</h5>
            <button
              id="start_stop"
              className="button"
              onClick={handleStartAndPause}
            >
              <i className="fas fa-play"></i>
              <i className="fas fa-pause"></i>
            </button>
          </div>
          <div className="reset">
            <h5 className="btn-label">Reset</h5>
            <button id="reset" className="button" onClick={handleReset}>
              <i className="fas fa-sync"></i>
            </button>
          </div>
        </div>
        <audio
          ref={beepRef}
          id="beep"
          src="https://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3"
        />
      </div>
    </div>
  );
}

const AppWithContext = () => (
  <CountdownProvider>
    <App />
  </CountdownProvider>
);

export default AppWithContext;
