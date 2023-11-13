import {
    FretboardNoteGameCoordinator
} from "../../game-modes/note-on-fretboard/fretboard-note-game-coordinator.js?v=0.6";
import {FrequencyBarsController} from "../frequency-bars/frequency-bars-controller.js";
import {TuneOperator} from "../note-detector/tuner/tune-operator.js";
import {MetronomeOperator} from "../note-detector/metronome/metronome-operator.js";
import {FrequencyBarsVisualizer} from "../frequency-bars/frequency-bars-visualizer.js";
import {ScreenWakeLockController} from "../screen-wake-lock-manager.js";

export class CoreGameCoordinator {
    metronomeOperator = new MetronomeOperator();
    tuneOperator = new TuneOperator();

    // Game coordinator that implements a play() and stop() method
    gameCoordinator = null;

    constructor(gameInitializer) {
        // Inject instance as an attribute there is changed
        this.gameInitializer = gameInitializer;
    }

    /**
     * Set this.gameCoordinator to the right game mode
     * All game coordinators MUST implement a play() and stop() method
     */
    setGameCoordinator() {
        // Figure out which game mode should be started
        if (document.querySelector('#metronome-mode input').checked) {
            // new MetronomeOperator().startMetronome();
        }

        if (document.querySelector('#fretboard-note-game-mode input').checked) {
            this.gameCoordinator = new FretboardNoteGameCoordinator();
        }

        if (document.querySelector('#note-in-key-game-mode input').checked) {
            this.gameCoordinator = new NoteInKeyGameCoordinator();
        }
        // All game coordinators MUST implement a play() and stop() method, "combinations" map attribute
    }

    startGame() {
        // Init game core game logic such as metronome, note detector
        this.startCoreGameFunctionalities();

        this.setGameCoordinator();
        // Start game
        this.gameCoordinator.play();
    }

    /**
     * Start metronome for the rhythm and note detector
     */
    startCoreGameFunctionalities() {
        // Start metronome audioContext can only be set after a user action
        this.metronomeOperator.setupAudioContext();
        // Start tuner
        this.tuneOperator.start();

        // Set frequencyData instance variable
        let frequencyData = new Uint8Array(this.tuneOperator.analyser.frequencyBinCount);
        new FrequencyBarsController(frequencyData).updateFrequencyBars();

        // This gets the game moving
        this.metronomeOperator.startMetronome();

        this.changeToRunningGameUI();

        // Prevent screen from getting dark on mobile
        void new ScreenWakeLockController().requestWakeLock();
        // To know if game should start automatically after visibility change event, keep manually paused in var
        this.gameInitializer.gameManuallyPaused = false;

        /* const frequencyBars = new FrequencyBarsVisualizer("#frequency-bars");
        //
        // this.noteGame.displayInTrebleClef = document.querySelector('#display-in-treble-clef input').checked;
        // this.noteGame.displayTrebleClefNoteName = document.querySelector('#display-note-name-treble-clef input').checked;
        //
        //
        // // Original
        // this.metronomeNoteDetector.init();
        // this.noteGame.frequencyBars = this.metronomeNoteDetector.frequencyBars;
        // this.noteGame.displayInTrebleClef = document.querySelector('#display-in-treble-clef input').checked;
        // this.noteGame.displayTrebleClefNoteName = document.querySelector('#display-note-name-treble-clef input').checked;
        //
        // this.metronomeNoteDetector.start();
        // // Remove "display:none" on game progress and score
        // document.querySelector('#game-progress-div').style.display = null;
        // document.querySelector('#score').style.display = null;
        // // Collapse game instructions
        // document.querySelector('#game-start-instruction details').open = false;
        //
        // // Display game elements and remove instructions
        // document.querySelectorAll('.visible-when-game-on').forEach(element => {
        //     element.style.display = 'block';
        // });
        // document.querySelector('#game-start-instruction').style.display = 'none';
        // // Prevent screen from getting dark on mobile
        // void this.wakeLock.requestWakeLock();
        // // To know if game should start automatically after visibility change event, keep manually paused in var
        // this.gameInitializer.gameManuallyPaused = false;
        */
    }

    /**
     * Change GUI when game is running
     */
    changeToRunningGameUI() {
        document.querySelector('#start-stop-btn').innerText = 'Pause';

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
    }

    /**
     * Game stop
     */
    stopGame() {
        this.metronomeOperator.stopMetronome();
        this.tuneOperator.stop();

        // Stop game
        this.gameCoordinator.stop();

        document.querySelector('#start-stop-btn').innerText = 'Play';

        new ScreenWakeLockController().releaseWakeLock();
    }

}