import {MetronomeNoteDetector} from "./metronome-note-detector-main.js?v=2";
import {NoteGame} from "./note-game.js?=2";

// Get metronome and note detector app instance
const metronomeNoteDetector = new MetronomeNoteDetector();
const noteGame = new NoteGame();

const startStopButton = document.querySelector('#start-stop-btn');
// Start metronome and note detection
startStopButton.addEventListener('click', startStopGame);
document.body.addEventListener('dblclick', startStopGame);

function startGame(){
    // Start game (has to be started before metronome and note detection as it contains event listeners fired there)
    noteGame.start();
    // Start metronome and note detector
    metronomeNoteDetector.start();
}

function stopGame(){
    metronomeNoteDetector.stop();
    noteGame.stop();
}

function startStopGame(){
    let gameElements = document.querySelectorAll('.visible-when-game-on');

    // Start game
    if (startStopButton.innerText === 'Start') {
        startGame();
        // Replace start button with stop button
        startStopButton.innerText = 'Stop';
        gameElements.forEach(element => {
            element.style.display = 'block';
        });
    } else {
        stopGame();
        // Replace stop button with start button
        startStopButton.innerText = 'Start';
        gameElements.forEach(element => {
            element.style.display = 'none';
        });
    }
}