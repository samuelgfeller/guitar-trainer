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
const muteMetronomeSpan = document.querySelector('#mute-metronome');
muteMetronomeSpan.addEventListener('click', () => {
    // Has to be called in an anonymous function as "this" context in toggleMetronomeSound is important
    metronomeNoteDetector.metronome.toggleMetronomeSound(muteMetronomeSpan);
});

function startGame() {
    // Start game (has to be started before metronome and note detection as it contains beat event listeners fired there)
    noteGame.start();
    // Start metronome and note detector
    metronomeNoteDetector.start();
    noteGame.frequencyBars = metronomeNoteDetector.frequencyBars;
    if(document.querySelector('#challenging-notes-preset').checked){
        presetChallengingNotes();
    }
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
    if (startStopButton.innerText === 'Start') {
        startGame();
        // Replace start button with stop button
        startStopButton.innerText = 'Pause';
        // Show elements that are visible during the game
        gameElements.forEach(element => {
            element.style.display = 'block';
        });
        // Hide game start instructions
        gameStartInstructions.style.display = 'none';
        // Replace begin with resume as game is only paused when clicking "Pause"
        gameStartInstructions.innerText = gameStartInstructions.innerText.replace('begin', 'resume');
    } else {
        stopGame();
        // Replace stop button with start button
        startStopButton.innerText = 'Start';
        gameElements.forEach(element => {
            element.style.display = 'none';
        });
        // Show game start instructions
        gameStartInstructions.style.display = 'block';
    }
}

function presetChallengingNotes() {
    // Challenging combinations string|note
    let challengingCombinations = ['E|C♯', 'E|D', 'E|D♯', 'A|F♯', 'A|G', 'A|G♯', 'D|A', 'D|A♯', 'D|B',
        'D|C', 'D|C♯', 'G|D♯', 'G|E', 'G|F', 'G|F♯', 'B|G', 'B|G♯', 'B|A', 'B|A♯'];
    challengingCombinations.forEach((combination) => {
        noteGame.combinations.set(combination, {incorrect: 1, correct: 0});
    });
}