import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {connect, Provider} from 'react-redux'

const titleEl = document.querySelector('title')
const audioEl = document.querySelector('audio')

const formatTime = seconds => {
  const padZeros = n => (n < 10 ? '0' : '') + n
  const timeMinutes = Math.floor(seconds / 60)
  const timeSeconds = padZeros(seconds % 60)
  return `${timeMinutes}:${timeSeconds}`
}

const app = (state = {
    seconds: 25 * 60,
    running: false,
    resting: false,
    pomodoros: 0,
  }, action) => {
  switch (action.type) {
    case 'DECREMENT':
      return {...state, seconds: state.seconds - 1}
    case 'TOGGLE_RUNNING':
      return {...state, running: !state.running}
    case 'TOGGLE_RESTING':
      const resting = !state.resting
      return {...state, resting, seconds: resting ? 5 * 60 : 25 * 60}
    case 'RESET':
      return {...state, seconds: state.resting ? 5 * 60 : 25 * 60}
    case 'INCREMENT_POMODOROS':
      return {...state, pomodoros: state.pomodoros + 1}
    default:
      return state
  }
}

const decrement = () => ({type: 'DECREMENT'})
const toggleRunning = () => ({type: 'TOGGLE_RUNNING'})
const toggleResting = () => ({type: 'TOGGLE_RESTING'})
const reset = () => ({type: 'RESET'})
const incrementPomodoros = () => ({type: 'INCREMENT_POMODOROS'})

class App extends Component {
  componentDidMount() {
    this.intervalId = setInterval(() => {
      const {
        seconds, running, resting, decrement, toggleResting, incrementPomodoros
      } = this.props

      if (running) {
        if (seconds === 0) {
          if (!resting) {
            incrementPomodoros()
          }
          audioEl.play()
          toggleResting()
        } else {
          decrement()
        }
      }
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const {
      seconds, time, running, pomodoros,
      decrement, toggleRunning, toggleResting, reset
    } = this.props

    titleEl.textContent = time

    return (
      <div className="text-center">
        <h1>Pomodoros: {pomodoros}</h1>
        <h2>{time}</h2>
        <div className="btn-group">
          <button
            onClick={reset}
            className="btn btn-default btn-lg">
            <i className="glyphicon glyphicon-step-backward"></i>
          </button>
          <button
            onClick={toggleRunning}
            className="btn btn-default btn-lg">
            <i className={`glyphicon glyphicon-${running ? 'pause' : 'play'}`}></i>
          </button>
          <button 
            onClick={toggleResting}
            className="btn btn-default btn-lg">
            <i className="glyphicon glyphicon-step-forward"></i>
          </button>
        </div>
      </div>
    )
  }
}

App = connect(
  ({seconds, running, resting, pomodoros}) => ({
    time: formatTime(seconds), seconds, running, resting, pomodoros
  }),
  {decrement, toggleRunning, toggleResting, reset, incrementPomodoros}
)(App)

const store = createStore(app)
const root = <Provider store={store}><App /></Provider>
const rootEl = document.querySelector('#root')
const render = () => ReactDOM.render(root, rootEl)
render()
