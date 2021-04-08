//@ts-nocheck
import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: false,
      counting: false,
      breakLength: 5,
      sessionLength: 25,
      mins: null,
      secs: null,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleStartAndPause = this.handleStartAndPause.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  async handleStartAndPause() {
    await this.setState((state) => ({
      counting: state.counting ? false : true,
    }));
    let counting = this.state.counting;

    const timer = () => {
      if (this.state.mins == 0 && this.state.secs == 0) {
        if (this.state.break) {
          this.setState((state) => ({
            break: false,
            count: state.sessionLength * 60 + 1,
          }));
        } else {
          this.setState((state) => ({
            break: true,
            count: state.breakLength * 60 + 1,
          }));
        }
        document.getElementById("beep").play();
      }
      this.setState((state) => ({
        count: !!state.count
          ? state.count - 1
          : state.mins == null
          ? state.sessionLength * 60 - 1
          : state.mins * 60 - 1,
      }));
      this.setState((state) => ({
        mins: Math.floor(state.count / 60),
        secs: state.count % 60,
      }));
    };

    if (counting) {
      this.setState({
        interval: setInterval(timer, 1000),
      });
    } else {
      clearInterval(this.state.interval);
      this.setState((state) => ({
        count: state.count + 1,
      }));
    }
  }

  handleReset() {
    this.setState({
      break: false,
      counting: false,
      breakLength: 5,
      sessionLength: 25,
      mins: null,
      secs: null,
    });
    clearInterval(this.state.interval);
    document.getElementById("beep").load();
  }

  handleClick(e) {
    let action = e.currentTarget.id;

    if (!this.state.counting) {
      switch (action) {
        case "break-decrement":
          this.setState((state) => {
            if (state.breakLength > 1) {
              return {
                breakLength: state.breakLength - 1,
                mins: null,
                secs: null,
              };
            }
          });
          break;
        case "break-increment":
          this.setState((state) => {
            if (state.breakLength < 60) {
              return {
                breakLength: state.breakLength + 1,
                mins: null,
                secs: null,
              };
            }
          });
          break;
        case "session-decrement":
          this.setState((state) => {
            if (state.sessionLength > 1) {
              return {
                sessionLength: state.sessionLength - 1,
                mins: null,
                secs: null,
              };
            }
          });
          break;
        case "session-increment":
          this.setState((state) => {
            if (state.sessionLength < 60) {
              return {
                sessionLength: state.sessionLength + 1,
                mins: null,
                secs: null,
              };
            }
          });
          break;
        default:
          break;
      }
    }
  }
  render() {
    const title = this.state.break ? "Break" : "Session";
    const time = () => {
      let mins =
        this.state.mins == null ? this.state.sessionLength : this.state.mins;
      let secs = this.state.secs;

      mins = mins == null ? "00" : mins < 10 ? `0${mins}` : mins;
      secs = secs == null ? "00" : secs < 10 ? `0${secs}` : secs;

      return `${mins}:${secs}`;
    };
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
                onClick={this.handleClick}
              >
                <i className="fas fa-caret-down"></i>
              </button>
              <h3 id="break-length" className="no-margin text">
                {this.state.breakLength}
              </h3>

              <button
                id="break-increment"
                className="button"
                onClick={this.handleClick}
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
                onClick={this.handleClick}
              >
                <i className="fas fa-caret-down"></i>
              </button>
              <h3 id="session-length" className="no-margin text">
                {this.state.sessionLength}
              </h3>
              <button
                id="session-increment"
                className="button"
                onClick={this.handleClick}
              >
                <i className="fas fa-caret-up"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="display-container">
          <div className="display">
            <h2 id="timer-label" className="session-title">
              {title}
            </h2>
            <h2 id="time-left" className="time">
              {time()}
            </h2>
          </div>
          <div className="buttons">
            <div className="play">
              <h5 className="btn-label">Play/Pause</h5>
              <button
                id="start_stop"
                className="button"
                onClick={this.handleStartAndPause}
              >
                <i className="fas fa-play"></i>
                <i className="fas fa-pause"></i>
              </button>
            </div>
            <div className="reset">
              <h5 className="btn-label">Reset</h5>
              <button id="reset" className="button" onClick={this.handleReset}>
                <i className="fas fa-sync"></i>
              </button>
            </div>
          </div>
          <audio id="beep" src="https://goo.gl/65cBl1" />
        </div>
      </div>
    );
  }
}

export default App;
