import {
    FretboardNoteGameCoordinator
} from "../../game-modes/note-on-fretboard/fretboard-note-game-coordinator.js?v=0.6";
import {MetronomeOperator} from "../metronome/metronome-operator.js?v=0.6";
import {TuneOperator} from "../tuner/tune-operator.js?v=0.6";
import {FrequencyBarsController} from "../frequency-bars/frequency-bars-controller.js?v=0.6";
import {GameElementsVisualizer} from "../game-ui/game-elements-visualizer.js?v=0.6";
import {ScreenWakeLocker} from "../wake-lock/screen-wake-locker.js?v=0.6";
import {NoteInKeyGameCoordinator} from "../../game-modes/note-in-key/note-in-key-game-coordinator.js";

export class CoreGameCoordinator {
    metronomeOperator = new MetronomeOperator();
    tuneOperator = new TuneOperator();

    // Game coordinator that implements a play() and stop() method
    gameCoordinator = null;

    // With metronome
    metronomeEnabled = false;
    // Counter for correct / incorrect notes played
    scoreEnabled = false;


    /**
     * @param {CoreGameCoordinationInitializer} coreGameCoordinationInitializer
     */
    constructor(coreGameCoordinationInitializer) {
        // Inject instance as an attribute there is changed
        this.coreGameCoordinationInitializer = coreGameCoordinationInitializer;

        // Listen for game stop event to stop game
        document.addEventListener('game-stop', this.stopGame.bind(this));
        document.addEventListener('game-start', this.startGame.bind(this));

        this.screenWakeLocker = new ScreenWakeLocker();
    }


    startGame() {
        // Init game core game logic such as metronome, note detector
        this.startCoreGameFunctionalities();

        // Start game module todo implement pause and resume
        this.gameCoordinator.play();

        console.log('metronome enabled: ',this.metronomeEnabled)
        if (this.metronomeEnabled) {
            // This gets the game moving and has to be after the game module has been properly started
            this.metronomeOperator.startMetronome();
        }

        // Only show when not practice mode
        GameElementsVisualizer.showGameProgress(this.scoreEnabled);

    }


    /**
     * Game stop
     */
    stopGame() {
        this.metronomeOperator.stopMetronome();
        this.tuneOperator.stop();

        // Stop game if there is a game coordinator (not the case when changing level before game start)
        if (this.gameCoordinator !== null) {
            this.gameCoordinator.stop();
        }

        document.querySelector('#start-stop-btn').innerText = 'Play';

        this.screenWakeLocker.releaseWakeLock();
    }

    /**
     * Start metronome for the rhythm and note detector
     */
    startCoreGameFunctionalities() {
        // Start metronome audioContext can only be set after a user action
        this.metronomeOperator.setupAudioContext();
        // Start tuner
        this.tuneOperator.initGetUserMedia();
        this.tuneOperator.start();

        // Set frequencyData instance variable
        let frequencyData = new Uint8Array(this.tuneOperator.analyser.frequencyBinCount);
        new FrequencyBarsController(frequencyData).updateFrequencyBars(this.tuneOperator);

        GameElementsVisualizer.showGameElementsAndHideInstructions();

        // Prevent screen from getting dark on mobile
        void this.screenWakeLocker.requestWakeLock();
        // To know if game should start automatically after visibility change event, keep manually paused in var
        this.coreGameCoordinationInitializer.gameInitializer.gameManuallyPaused = false;

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
}