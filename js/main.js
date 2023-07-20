import {MetronomeNoteDetector} from "./metronome-note-detector-main.js?v=3";
import {NoteGame} from "./note-game.js?=3";

// Get metronome and note detector app instance
const metronomeNoteDetector = new MetronomeNoteDetector();
const noteGame = new NoteGame();

const startStopButton = document.querySelector('#start-stop-btn');
// Start metronome and note detection
startStopButton.addEventListener('click', startStopGame);
document.body.addEventListener('dblclick', startStopGame);
document.querySelector('#bpm-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        startStopGame();
    }
});

// Mute / enable sound of metronome
const muteMetronomeImg = document.querySelector('#mute-metronome');
muteMetronomeImg.addEventListener('click', () => {
    // Has to be called in an anonymous function as "this" context in toggleMetronomeSound is important
    metronomeNoteDetector.metronome.toggleMetronomeSound(muteMetronomeImg);
});

function startGame() {
    // Start game (has to be started before metronome and note detection as it contains beat event listeners fired there)
    noteGame.start();
    // If preset checkbox is set, add those notes to the challenging combination
    if (document.querySelector('#challenging-notes-preset').checked) {
        noteGame.presetChallengingNotes();
    }
    // Start metronome and note detector
    metronomeNoteDetector.start();
    // Set the frequencyBars var in noteGame to change their color
    noteGame.frequencyBars = metronomeNoteDetector.frequencyBars;
}

function stopGame() {
    metronomeNoteDetector.stop();
    noteGame.stop();
}

function startStopGame() {
    // Toggle hide / show these elements
    let gameElements = document.querySelectorAll('.visible-when-game-on');
    const gameStartInstructions = document.querySelector('#game-start-instruction');

    // Start game
    if (startStopButton.innerText === 'Start' || startStopButton.innerText === 'Resume') {
        // Start only metronome if sound is on
        if (metronomeNoteDetector.metronome.playSound === true) {
            metronomeNoteDetector.metronome.init();
            metronomeNoteDetector.metronome.startMetronome();
        } else {
            startGame();
            // Show elements that are visible during the game
            gameElements.forEach(element => {
                element.style.display = 'block';
            });
            // Hide game start instructions
            gameStartInstructions.style.display = 'none';
            // Replace begin with resume as game is only paused when clicking "Pause"
            gameStartInstructions.innerText = gameStartInstructions.innerText.replace('begin', 'resume');
        }
        // Replace start button with stop button
        startStopButton.innerText = 'Pause';
    } else {
        stopGame();
        // Replace stop button with start button
        startStopButton.innerText = 'Resume';
        gameElements.forEach(element => {
            element.style.display = 'none';
        });
        // Show game start instructions
        gameStartInstructions.style.display = 'block';
    }
}

