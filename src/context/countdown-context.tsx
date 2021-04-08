import React from "react";

interface ICountdownState {
  status: string;
  countdownType: string;
  sesionLength: number;
  breakLength: number;
  remainingTime: {
    minutes: number;
    seconds: number;
  };
}

type Actions =
  | { type: "start-session" }
  | { type: "start-break" }
  | { type: "pause" }
  | { type: "stop" }
  | { type: "continue" }
  | { type: "reset" }
  | { type: "change-break-interval"; payload: number }
  | { type: "change-session-interval"; payload: number }
  | { type: "update-remaining" };

const initialState: ICountdownState = {
  status: "idle",
  countdownType: "session",
  sesionLength: 25,
  breakLength: 5,
  remainingTime: {
    minutes: 25,
    seconds: 0,
  },
};

function countdownReducer(state: ICountdownState, action: Actions) {
  switch (action.type) {
    case "start-session": {
      return {
        ...state,
        remainingTime: {
          minutes: state.sesionLength,
          seconds: 0,
        },
        status: "counting",
        countdownType: "session",
      };
    }
    case "start-break": {
      return {
        ...state,
        remainingTime: {
          minutes: state.breakLength,
          seconds: 0,
        },
        status: "counting",
        countdownType: "break",
      };
    }
    case "continue": {
      return { ...state, status: "counting" };
    }
    case "pause": {
      return { ...state, status: "paused" };
    }
    case "reset": {
      return initialState;
    }
    case "change-break-interval": {
      return {
        ...state,
        breakLength: action.payload,
      };
    }
    case "change-session-interval": {
      return {
        ...state,
        sesionLength: action.payload,
        remainingTime: {
          ...state.remainingTime,
          minutes:
            state.status === "idle"
              ? action.payload
              : state.remainingTime.minutes,
        },
      };
    }
    case "update-remaining": {
      const { minutes, seconds } = state.remainingTime;

      if (seconds === 0 && minutes === 0)
        return {
          ...state,
          remainingTime: {
            minutes: 0,
            seconds: 0,
          },
          status: "stopped",
        };
      else if (seconds === 0)
        return {
          ...state,
          remainingTime: {
            minutes: minutes - 1,
            seconds: 59,
          },
        };
      else
        return {
          ...state,
          remainingTime: {
            minutes,
            seconds: seconds - 1,
          },
        };
    }
    default:
      throw new Error(`Unsoported action: ${action}`);
  }
}

const CountdownContext = React.createContext<
  [state: ICountdownState, dispatch: React.Dispatch<Actions>] | undefined
>(undefined);
CountdownContext.displayName = "CountdownContext";

export function CountdownProvider({
  children,
  ...otherProps
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(
    countdownReducer,
    initialState,
    (initialState: ICountdownState) => initialState
  );

  const value = [state, dispatch] as [
    state: ICountdownState,
    dispatch: React.Dispatch<Actions>
  ];

  return (
    <CountdownContext.Provider value={value} {...otherProps}>
      {children}
    </CountdownContext.Provider>
  );
}

export function useCountdown() {
  const context = React.useContext(CountdownContext);
  if (context === undefined) {
    throw new Error("useCountdown must be used in a CountdownProvider");
  }
  return context;
}
