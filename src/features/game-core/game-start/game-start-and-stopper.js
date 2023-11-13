import {GameInitializer} from "./game-initializer.js?v=0.6";
import {ScreenWakeLockManager} from "../../screen-wake-lock-manager.js?v=0.6";
import {MetronomeNoteDetector} from "../metronome-note-detector-main.js?v=0.6";
import {FretboardNoteGameCoordinator} from "../../game-modes/note-on-fretboard/fretboard-note-game-coordinator.js?v=0.6";
import {CoreGameCoordinator} from "./core-game-coordinator.js";

export class GameStartAndStopper {

    constructor() {
        this.metronomeNoteDetector = new MetronomeNoteDetector();
        this.noteGame = new FretboardNoteGameCoordinator(this);
        this.startStopButton = document.querySelector('#start-stop-btn');
        this.wakeLock = new ScreenWakeLockManager();
        this.gameInitializer = new GameInitializer(this);
        this.coreGameCoordinator = new CoreGameCoordinator(this.gameInitializer);
    }

    /**
     * Start and stop game or metronome
     * Executed on click of start or stop button
     */
    startStopGame() {
        // If the game is not running, start it. Otherwise, stop.
        if (this.startStopButton.innerText === 'Play') {
            // In case settings div is expanded, collapse it
            document.getElementById('settings-div').classList.remove('expanded');

            if (document.querySelector('#metronome-mode input').checked) {
                // If play sound is true, only start metronome and not the whole game
                this.metronomeNoteDetector.metronome.setupAudioContext();
                this.metronomeNoteDetector.metronome.startMetronome();
                this.gameInitializer.onlyMetronome = true;
                this.startStopButton.innerText = 'Pause';
            } else {
                // Start game
                this.coreGameCoordinator.startGame();
                this.gameInitializer.onlyMetronome = false;
            }
        } else {
            this.gameInitializer.gameManuallyPaused = true;
            this.coreGameCoordinator.stopGame();
            // Hide game elements and display instructions (not inside stopGame() for when level is accomplished)
            this.gameInitializer.hideGameElementsAndDisplayInstructions();
        }
    }

    /**
     * Game start
     */
    startGame() {
        this.startStopButton.innerText = 'Pause';

        this.noteGame.play();
        this.metronomeNoteDetector.init();
        this.noteGame.frequencyBars = this.metronomeNoteDetector.frequencyBars;
        this.noteGame.displayInTrebleClef = document.querySelector('#display-in-treble-clef input').checked;
        this.noteGame.displayTrebleClefNoteName = document.querySelector('#display-note-name-treble-clef input').checked;
        this.noteGame.playNoteInKey = document.querySelector('#play-note-in-key input').checked;

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
        this.startStopButton.innerText = 'Play';
        // Set false to not account error when user clicks pause
        this.noteGame.previousCombinationWasIncorrect = false;
        this.wakeLock.releaseWakeLock();
    }
}