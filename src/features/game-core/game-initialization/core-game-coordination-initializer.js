import {CoreGameCoordinator} from "../game-start/core-game-coordinator.js?v=1.2.4";
import {
    FretboardNoteGameCoordinator
} from "../../game-modes/note-on-fretboard/fretboard-note-game-coordinator.js?v=1.2.4";
import {NoteInKeyGameCoordinator} from "../../game-modes/note-in-key/note-in-key-game-coordinator.js?v=1.2.4";
import {GameConfigurationManager} from "./game-configuration-manager.js?v=1.2.4";
import {GameElementsVisualizer} from "../game-ui/game-elements-visualizer.js?v=1.2.4";
import {MetronomePracticeCoordinator} from "../../game-modes/metronome/metronome-practice-coordinator.js?v=1.2.4";

export class CoreGameCoordinationInitializer {

    /**
     * @param {GameInitializer} gameInitializer
     */
    constructor(gameInitializer) {
        this.gameInitializer = gameInitializer;
        this.coreGameCoordinator = new CoreGameCoordinator(this);
    }

    /**
     * Set this.gameCoordinator to the right game mode
     * All game coordinators MUST implement destroy(), play() and stop() methods (setup is in constructor)
     */
    setCorrectAndInitGameCoordinator() {
        // Remove game mode specific elements / reset for new game mode
        if (this.coreGameCoordinator.gameCoordinator !== null) {
            this.coreGameCoordinator.gameCoordinator?.destroy();
            // Reset game area
            GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        }
        // Remove game mode options from previous game mode
        document.querySelector('#game-mode-options').innerHTML = '';
        // Make sure that the start button is enabled
        document.querySelector('#start-stop-btn').disabled = false;

        // Default values
        // Enable tuner that detects note to true as default value
        this.coreGameCoordinator.noteDetectorEnabled = true;

        // Figure out which game mode should be started
        // All game coordinators MUST implement a play() and stop() method.
        // Initialization is done in the constructor
        if (document.querySelector('#metronome-game-mode input').checked) {
            this.coreGameCoordinator.gameCoordinator = new MetronomePracticeCoordinator();
            this.coreGameCoordinator.noteDetectorEnabled = false;
            this.coreGameCoordinator.metronomeEnabled = true;
            this.coreGameCoordinator.scoreEnabled = false;
            this.coreGameCoordinator.progressBarEnabled = false;
        } else if (document.querySelector('#fretboard-note-game-mode input').checked) {
            this.coreGameCoordinator.gameCoordinator = new FretboardNoteGameCoordinator();
            this.coreGameCoordinator.metronomeEnabled = true;
            this.coreGameCoordinator.scoreEnabled = true;
            this.coreGameCoordinator.progressBarEnabled = true;
        } else if (document.querySelector('#note-in-key-game-mode input').checked) {
            this.coreGameCoordinator.gameCoordinator = new NoteInKeyGameCoordinator();
            this.coreGameCoordinator.metronomeEnabled = false;
            this.coreGameCoordinator.scoreEnabled = false;
            this.coreGameCoordinator.progressBarEnabled = true;
        } else {
            // If no game mode is selected, disable the play button
            document.querySelector('#start-stop-btn').disabled = true;
        }
        // All game coordinators MUST implement a play() and stop() method

        // Disable metronome and note detector if no guitar option is selected
        this.noGuitarOption();

        // Init game mode options after they have been added via instantiation of the correct gameModeCoordinator above
        GameConfigurationManager.initGameModeOptions();
    }

    noGuitarOption(){
        // Overwrite noteDetectorEnabled and metronomeEnabled if the user has selected "no guitar"
        const noGuitarCheckbox = document.querySelector('#no-guitar-option input');
        noGuitarCheckbox?.addEventListener('change', function () {
            disableNoteDetectorIfNoGuitarChecked();
        });
        const self = this;
        const disableNoteDetectorIfNoGuitarChecked = function() {
            if (noGuitarCheckbox?.checked) {
                self.coreGameCoordinator.metronomeEnabled = false;
                self.coreGameCoordinator.noteDetectorEnabled = false;
            }
        }
        disableNoteDetectorIfNoGuitarChecked();
    }


    /**
     * Start and stop game or metronome
     * Executed on click of start or stop button
     */
    startOrStopButtonActionHandler() {
        const startStopButton = document.querySelector('#start-stop-btn');

        // If the game is not running, start it. Otherwise, stop.
        if (startStopButton.src.includes('play') && startStopButton.disabled !== true) {
            // Start game event
            document.dispatchEvent(new Event('game-start'));
            this.coreGameCoordinator.manuallyPaused = false;
        } else {
            // When manually paused, don't start game again on visibility change
            this.coreGameCoordinator.manuallyPaused = true;
            // Game stop event
            document.dispatchEvent(new Event('game-stop'));
        }
    }
}