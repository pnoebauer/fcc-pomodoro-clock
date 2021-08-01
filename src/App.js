import React from 'react';
import './App.css';

const msPerInterval = 1000;

const defaultState = {
	breakLength: 5,
	sessionLength: 1,
	lapsedTime: 0,
	mode: 'session',
};

const lengthLimits = {
	min: 1,
	max: 60,
};

class App extends React.Component {
	constructor(props) {
		super(props);
		this.audioRef = React.createRef();
		this.state = {...defaultState};
	}

	tick = () => {
		this.setState(
			prevState => ({
				lapsedTime: prevState.lapsedTime + 1,
			}),
			() => {
				// once the timer is at zero, play the beep sound, reset lapsedTime to zero, and change the mode
				if (this.remainingSeconds() < 0) {
					this.audioRef.current.play();
					setTimeout(() => this.audioRef.current.load(), 5000);

					this.setState(prevState => ({
						lapsedTime: 0,
						mode: prevState.mode === 'session' ? 'break' : 'session',
					}));
				}
			}
		);
	};

	startStopTimer = () => {
		// if an interval is currently running, clear it (stops the timer)
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
			// if no interval is running (timer is stoped), then start a new one
		} else {
			this.intervalId = setInterval(() => this.tick(), msPerInterval);
		}
	};

	// method to convert lapsedTime (runs once every msPerInterval)
	passedSeconds = () => (this.state.lapsedTime / 1000) * msPerInterval;

	remainingSeconds = () => {
		// retrieve totalDuration based on the current mode
		const totalDuration =
			this.state.mode === 'session'
				? this.state.sessionLength * 60
				: this.state.breakLength * 60;

		const remainingSeconds = totalDuration - this.passedSeconds();

		return remainingSeconds;
	};

	// convert number of seconds to a mm:ss string
	remainingTime = () => {
		const totalSeconds = this.remainingSeconds();

		const minutes = Math.floor(totalSeconds / 60).toLocaleString('en-US', {
			minimumIntegerDigits: 2,
		});
		// const seconds = Math.floor(totalSeconds % 60).toFixed(2);
		const seconds = Math.floor(totalSeconds % 60).toLocaleString('en-US', {
			minimumIntegerDigits: 2,
			// useGrouping: false,
		});

		return `${minutes}:${seconds}`;
	};

	resetClock = () => {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}

		// rewind the audio element
		this.audioRef.current.load();

		// reset state to its default
		this.setState({
			...defaultState,
		});
	};

	handleDecrementClick = e => {
		const key = e.currentTarget.name;

		this.setState(prevState => ({
			[key]: prevState[key] <= lengthLimits.min ? prevState[key] : prevState[key] - 1,
		}));
	};

	handleIncrementClick = e => {
		const key = e.currentTarget.name;

		this.setState(prevState => ({
			[key]: prevState[key] >= lengthLimits.max ? prevState[key] : prevState[key] + 1,
		}));
	};

	render() {
		const remainingTime = this.remainingTime();

		return (
			<div
				className='container-fluid bg-dark'
				style={{position: 'fixed', top: '0', left: '0', right: '0', bottom: '0'}}
			>
				<h1 className='text-center text-light' id='header'>
					Pomodoro clock
				</h1>

				<div className='d-flex justify-content-around text-light mt-1'>
					<div className='text-center' id='break-control-container'>
						<div className='text-center' id='break-label'>
							Break Length
						</div>
						<div className='p-2 btn-group mt-0'>
							<button
								className='btn btn-primary text-center m-auto'
								id='break-decrement'
								name='breakLength'
								onClick={this.handleDecrementClick}
							>
								-
							</button>
							<div className='btn text-center m-auto' id='break-length'>
								{this.state.breakLength}
							</div>
							<button
								className='btn btn-primary m-auto'
								id='break-increment'
								name='breakLength'
								onClick={this.handleIncrementClick}
							>
								+
							</button>
						</div>
					</div>

					<div className='text-center' id='session-control-container'>
						<div className='text-center' id='session-label'>
							Session Length
						</div>
						<div className='p-2 btn-group mt-0'>
							<button
								className='btn btn-primary text-center m-auto'
								id='session-decrement'
								name='sessionLength'
								onClick={this.handleDecrementClick}
							>
								-
							</button>
							<div className='btn text-center m-auto' id='session-length'>
								{this.state.sessionLength}
							</div>
							<button
								className='btn btn-primary m-auto'
								id='session-increment'
								name='sessionLength'
								onClick={this.handleIncrementClick}
							>
								+
							</button>
						</div>
					</div>
				</div>

				<div
					className='border clock mx-auto text-light'
					id='start_stop'
					onClick={this.startStopTimer}
				>
					<div className='session-container text-center'>
						<div id='timer-label'>
							{this.state.mode === 'session' ? 'Current Session' : 'Current Break'}
						</div>
						<div id='time-left'>{console.log(remainingTime, 'rem') || remainingTime}</div>
						<audio
							id='beep'
							preload='auto'
							ref={this.audioRef}
							src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'
						/>
						{/* <div>{this.state.lapsedTime}</div> */}
					</div>
				</div>

				<div className='d-flex justify-content-center mt-2'>
					<button
						className='btn btn-primary text-center'
						id='reset'
						onClick={this.resetClock}
					>
						Reset
					</button>
				</div>
			</div>
		);
	}
}

export default App;
