import {CoreGameCoordinator} from "../game-start/core-game-coordinator.js";
import {FretboardNoteGameCoordinator} from "../../game-modes/note-on-fretboard/fretboard-note-game-coordinator.js";
import {NoteInKeyGameCoordinator} from "../../game-modes/note-in-key/note-in-key-game-coordinator.js";

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
     * All game coordinators MUST implement a play() and stop() method
     */
    setCorrectAndInitGameCoordinator() {
        // Figure out which game mode should be started
        if (document.querySelector('#metronome-game-mode input').checked) {
            // new MetronomeOperator().startMetronome();
        } else if (document.querySelector('#fretboard-note-game-mode input').checked) {
            const fretboardNoteGameCoordinator = new FretboardNoteGameCoordinator();
            fretboardNoteGameCoordinator.fretboardNoteGameInitializer.init();
            // Game mode coordinator needs to be init once when the mode is selected
            this.coreGameCoordinator.gameCoordinator = fretboardNoteGameCoordinator;
            this.coreGameCoordinator.metronomeEnabled = true;
            this.coreGameCoordinator.scoreEnabled = true;
        } else if (document.querySelector('#note-in-key-game-mode input').checked) {
            this.coreGameCoordinator.gameCoordinator = new NoteInKeyGameCoordinator();
        } else {
            // Default
            this.coreGameCoordinator.gameCoordinator = new FretboardNoteGameCoordinator();
        }
        // All game coordinators MUST implement a play() and stop() method
    }

    /**
     * Start and stop game or metronome
     * Executed on click of start or stop button
     */
    startOrStopButtonActionHandler() {
        this.startStopButton = document.querySelector('#start-stop-btn');

        // If the game is not running, start it. Otherwise, stop.
        if (this.startStopButton.innerText === 'Play') {
            // In case settings div is expanded, collapse it
            document.getElementById('config-div').classList.remove('expanded');

            if (document.querySelector('#metronome-game-mode input').checked) {
                // If play sound is true, only start metronome and not the whole game
                this.coreGameCoordinator.metronomeOperator.setupAudioContext();
                this.coreGameCoordinator.metronomeOperator.startMetronome();

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

}