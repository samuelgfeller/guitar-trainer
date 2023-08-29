import {MetronomeNoteDetector} from "./metronome-note-detector-main.js?v=5";
import {NoteGame} from "./note-game.js?v=5";
import {GameInitializer} from "./game-initializer.js?v=5";
import {ScreenWakeLockManager} from "./screen-wake-lock-manager.js?v=5";

class GameStarter {
    constructor() {
        this.metronomeNoteDetector = new MetronomeNoteDetector();
        this.noteGame = new NoteGame(this);
        this.startStopButton = document.querySelector('#start-stop-btn');
        this.muteMetronomeImg = document.querySelector('#mute-metronome');
        this.wakeLock = new ScreenWakeLockManager();
        this.gameInitializer = new GameInitializer(this);
    }

    /**
     * Init event listeners to start the game
     */
    init() {
        // Init start stop button
        this.gameInitializer.initGameStartStopEventListeners();
        // Init bpm input listeners
        this.gameInitializer.initBpmInputChangeListener();
        // Init pause / resume game on visibility change
        this.gameInitializer.initPauseAndResumeGameOnVisibilityChange();
        // Init mute metronome toggle button
        this.muteMetronomeImg.addEventListener('click', () => {
            this.metronomeNoteDetector.metronome.toggleMetronomeSound(this.muteMetronomeImg);
        });
    }

    /**
     * Start and stop game or metronome
     */
    startStopGame() {
        if (this.startStopButton.innerText === 'Start' || this.startStopButton.innerText === 'Resume') {
            if (this.metronomeNoteDetector.metronome.playSound === true) {
                // If play sound is true, only start metronome and not whole game
                this.metronomeNoteDetector.metronome.init();
                this.metronomeNoteDetector.metronome.startMetronome();
                this.gameInitializer.onlyMetronome = true;
                this.startStopButton.innerText = 'Pause';
            } else {
                // Start game
                this.startGame();
                this.gameInitializer.onlyMetronome = false;
            }
        } else {
            this.gameInitializer.gameManuallyPaused = true;
            this.stopGame();
            // Hide game elements and display instructions (not inside stopGame() for when level is accomplished)
            this.gameInitializer.hideGameElementsAndDisplayInstructions();
        }
    }

    /**
     * Game start
     */
    startGame() {
        this.startStopButton.innerText = 'Pause';
        this.noteGame.init();
        this.metronomeNoteDetector.init();
        this.noteGame.frequencyBars = this.metronomeNoteDetector.frequencyBars;
        if (document.querySelector('#challenging-notes-preset').checked) {
            this.noteGame.presetChallengingNotes();
        }
        if (document.querySelector('#display-in-treble-clef').checked) {
            this.noteGame.displayInTrebleClef = true;
        }

        this.metronomeNoteDetector.start();
        // Remove "display:none" on game progress and score
        document.querySelector('#game-progress-div').style.display = null;
        document.querySelector('#score').style.display = null;
        // Collapse game instructions
        document.querySelector('#game-start-instruction details').open = false;

        // Display game elements and remove instructions
        document.querySelectorAll('.visible-when-game-on').forEach(element => {
            element.style.display = 'block';
        });
        document.querySelector('#game-start-instruction').style.display = 'none';
        // Change the word "begin" in the game instructions
        const gameStartInstructions = document.querySelector('#game-start-instruction');
        gameStartInstructions.innerHTML = gameStartInstructions.innerHTML.replace('begin', 'resume');
        // Prevent screen from getting dark on mobile
        void this.wakeLock.requestWakeLock();
        // To know if game should start automatically after visibility change event, keep manually paused in var
        this.gameInitializer.gameManuallyPaused = false;
    }

    /**
     * Game stop
     */
    stopGame() {
        this.metronomeNoteDetector.stop();
        this.noteGame.stop();
        this.startStopButton.innerText = 'Resume';
        // Set false to not account error when user clicks pause
        this.noteGame.previousCombinationWasIncorrect = false;
        this.wakeLock.releaseWakeLock();
    }
}

const game = new GameStarter();
game.init();