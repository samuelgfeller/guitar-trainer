import {CoreGameCoordinator} from "../game-start/core-game-coordinator.js?v=1.3.1";
import {
    FretboardNoteGameCoordinator
} from "../../game-modes/note-on-fretboard/fretboard-note-game-coordinator.js?v=1.3.1";
import {NoteInKeyGameCoordinator} from "../../game-modes/note-in-key/note-in-key-game-coordinator.js?v=1.3.1";
import {GameConfigurationManager} from "./game-configuration-manager.js?v=1.3.1";
import {MetronomePracticeCoordinator} from "../../game-modes/metronome/metronome-practice-coordinator.js?v=1.3.1";

export class CoreGameCoordinationInitializer {

    constructor() {
        this.coreGameCoordinator = new CoreGameCoordinator(this);
    }

    /**
     * Set this.gameCoordinator to the right game mode
     * All game coordinators MUST implement destroy(), play() and stop() methods (setup is in constructor)
     */
    setCorrectAndInitGameCoordinator() {

        // Remove game mode options from previous game mode
        document.querySelector('#game-mode-options').innerHTML = '';
        // Make sure that the start button is enabled
        document.querySelector('#start-stop-btn').disabled = false;

        // Figure out which game mode should be started
        // All game coordinators MUST implement a play() and stop() method.
        // Initialization is done in the constructor
        if (document.querySelector('#metronome-game-mode input').checked) {
            this.coreGameCoordinator.gameCoordinator = new MetronomePracticeCoordinator();
            this.setMetronomeGameModeVariables();
        } else if (document.querySelector('#fretboard-note-game-mode input').checked) {
            this.coreGameCoordinator.gameCoordinator = new FretboardNoteGameCoordinator();
            this.setFretboardNoteGameModeVariables();
        } else if (document.querySelector('#note-in-key-game-mode input').checked) {
            this.coreGameCoordinator.gameCoordinator = new NoteInKeyGameCoordinator();
            // Needs to be in own function for no guitar change event handler
            this.setNoteInKeyGameModeVariables();
        } else {
            // If no game mode is selected, disable the play button
            document.querySelector('#start-stop-btn').disabled = true;
        }
        // All game coordinators MUST implement a play() and stop() method

        // Init game mode options after they have been added via instantiation of the correct gameModeCoordinator above
        GameConfigurationManager.initGameModeOptions();
    }

    setMetronomeGameModeVariables() {
        this.coreGameCoordinator.noteDetectorEnabled = false;
        this.coreGameCoordinator.metronomeEnabled = true;
        this.coreGameCoordinator.scoreEnabled = false;
        this.coreGameCoordinator.progressBarEnabled = false;
    }

    setFretboardNoteGameModeVariables() {
        this.coreGameCoordinator.metronomeEnabled = true;
        this.coreGameCoordinator.scoreEnabled = true;
        this.coreGameCoordinator.progressBarEnabled = true;
        this.coreGameCoordinator.noteDetectorEnabled = true;
    }

    setNoteInKeyGameModeVariables() {
        this.coreGameCoordinator.metronomeEnabled = false;
        this.coreGameCoordinator.scoreEnabled = false;
        this.coreGameCoordinator.progressBarEnabled = true;
        this.coreGameCoordinator.noteDetectorEnabled = true;
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