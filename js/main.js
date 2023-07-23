import {MetronomeNoteDetector} from "./metronome-note-detector-main.js";
import {NoteGame} from "./note-game.js";

class GameStarter {
    constructor() {
        this.metronomeNoteDetector = new MetronomeNoteDetector();
        this.noteGame = new NoteGame(this);
        this.startStopButton = document.querySelector('#start-stop-btn');
        this.muteMetronomeImg = document.querySelector('#mute-metronome');
        this.currentLevel = this.noteGame.gameUI.gameProgress.getCurrentLevel();
    }

    init() {
        this.startStopButton.addEventListener('click', this.startStopGame.bind(this));
        document.body.addEventListener('dblclick', this.startStopGame.bind(this));
        const bpmInput = document.querySelector('#bpm-input');
        bpmInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.startStopGame();
            }
        });
        // Set bpm input to the current level which is always one higher than the last completed or the default value
        bpmInput.value = this.currentLevel;
        const noteGame = this.noteGame;
        // Level change
        bpmInput.addEventListener('change', (e) => {
            this.updateIsLevelAccomplishedColor(bpmInput);
            this.stopGame();
            this.hideGameElementsAndDisplayInstructions();
            noteGame.gameUI.clearStats();
            this.startStopButton.innerText = 'Start';
        });
        // stepUp and stepDown on input type number don't automatically fire the "change" event
        const changeEvent = new Event('change');
        document.getElementById('next-lvl-btn').addEventListener('click', () => {
            bpmInput.stepUp();
            bpmInput.dispatchEvent(changeEvent);
        });
        document.getElementById('previous-lvl-btn').addEventListener('click', () => {
            bpmInput.stepDown();
            bpmInput.dispatchEvent(changeEvent);
        });

        this.muteMetronomeImg.addEventListener('click', () => {
            this.metronomeNoteDetector.metronome.toggleMetronomeSound(this.muteMetronomeImg);
        });
    }

    updateIsLevelAccomplishedColor(bpmInput) {
        if (this.noteGame.gameUI.gameProgress.isLevelAccomplished(bpmInput.value)) {
            document.querySelector('header div').style.borderBottomColor = 'green';
        } else {
            document.querySelector('header div').style.borderBottomColor = null;
        }
    }

    startGame() {
        this.noteGame.init();
        this.metronomeNoteDetector.init();
        this.noteGame.frequencyBars = this.metronomeNoteDetector.frequencyBars;
        if (document.querySelector('#challenging-notes-preset').checked) {
            this.noteGame.presetChallengingNotes();
        }
        this.metronomeNoteDetector.start();
        document.querySelector('#game-progress-div').style.display = null;
        document.querySelector('#score').style.display = null;
        document.querySelector('#game-start-instruction details').open = false;
    }

    stopGame() {
        this.metronomeNoteDetector.stop();
        this.noteGame.stop();
        this.startStopButton.innerText = 'Resume';
        // Set false to not account error when user clicks pause
        this.noteGame.previousCombinationWasIncorrect = false;
    }

    startStopGame() {

        if (this.startStopButton.innerText === 'Start' || this.startStopButton.innerText === 'Resume') {
            if (this.metronomeNoteDetector.metronome.playSound === true) {
                this.metronomeNoteDetector.metronome.init();
                this.metronomeNoteDetector.metronome.startMetronome();
            } else {
                this.startGame();
                this.displayGameElementsAndRemoveInstructions();
                const gameStartInstructions = document.querySelector('#game-start-instruction');
                gameStartInstructions.innerHTML = gameStartInstructions.innerHTML.replace('begin', 'resume');
            }
            this.startStopButton.innerText = 'Pause';
        } else {
            this.stopGame();
            this.hideGameElementsAndDisplayInstructions();
        }
    }

    hideGameElementsAndDisplayInstructions() {
        document.querySelectorAll('.visible-when-game-on').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelector('#game-start-instruction').style.display = 'block';
    }

    displayGameElementsAndRemoveInstructions() {
        document.querySelectorAll('.visible-when-game-on').forEach(element => {
            element.style.display = 'block';
        });
        document.querySelector('#game-start-instruction').style.display = 'none';
    }
}

const game = new GameStarter();
game.init();