import {displayRandomNote} from "./note-game.js";

let audioContext = null;
const startButton = document.getElementById('submit-btn');
const bpmInput = document.getElementById('bpm-input');
let timerId = null;
let playSound = true;

let gameElements = document.querySelectorAll('.visible-when-game-on');

startButton.addEventListener('click', startButtonClickHanlder);
document.body.addEventListener('dblclick', startButtonClickHanlder);
function startButtonClickHanlder(){
    if (timerId === null) {
        startMetronome();
        startButton.innerText = 'Stop';
        gameElements.forEach(element => {
            element.style.display = 'block';
        });
    } else {
        stopMetronome();
        startButton.innerText = 'Start';
        gameElements.forEach(element => {
            element.style.display = 'none';
        });
    }
}
// Mute metronome
const muteMetronomeSpan = document.querySelector('#mute-metronome');
muteMetronomeSpan.addEventListener('click', () => {
    if (muteMetronomeSpan.innerHTML === '🔊') {
        muteMetronomeSpan.innerHTML = '🔇';
        playSound = false;
    } else {
        muteMetronomeSpan.innerHTML = '🔊';
        playSound = true;
    }
});

function startMetronome() {
    const bpm = parseInt(bpmInput.value);
    const interval = 60000 / bpm; // Convert BPM to milliseconds
    if (audioContext === null) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    playClickSound(); // Play the initial click sound
    timerId = setInterval(() => {
        playClickSound();
    }, interval); // Start the metronome
    // startButton.disabled =  true;
}

function stopMetronome() {
    clearInterval(timerId);
    timerId = null;
    startButton.disabled = false;
}

function playClickSound() {
    // Game specific
    displayRandomNote();
    if (playSound === true) {
        const oscillator = audioContext.createOscillator();
        oscillator.connect(audioContext.destination);
        oscillator.frequency.value = 200; // Adjust the pitch of the click sound if needed
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1); // Adjust the duration of the click sound if needed
    }
}
