import {GameLevelTracker} from "../../../game-core/game-progress/game-level-tracker.js?v=2.1.5";
import {GameElementsVisualizer} from "../../../game-core/game-ui/game-elements-visualizer.js?v=2.1.5";
import {LevelUpVisualizer} from "../../../game-core/game-ui/level-up-visualizer.js?v=2.1.5";

export class NoteOnFretboardEventHandler{

    /**
     * @param {NoteOnFretboardEventListenerAdder} noteOnFretboardEventListenerAdder
     */
    constructor(noteOnFretboardEventListenerAdder) {
        this.noteOnFretboardEventListenerAdder = noteOnFretboardEventListenerAdder;
        this.levelLocalStorageKey = noteOnFretboardEventListenerAdder.noteOnFretboardGameInitializer.levelLocalStorageKey;
    }

    levelUp() {
        // Store accomplished game level
        let level = document.getElementById('bpm-input').value;
        GameLevelTracker.addAccomplishedLevel(level, this.levelLocalStorageKey);

        GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        document.dispatchEvent(new Event('reset-game-progress'));

        // Fire game-stop event and display modal
        LevelUpVisualizer.stopGameAndDisplayLeveledUpModal(
            'Level completed!',
            'Go to next level',
            this.goToNextLevel.bind(this),
            this.restartLevel.bind(this),
            () => {
                this.noteOnFretboardEventListenerAdder.noteOnFretboardGameInitializer.setAvailableStringsAndShuffleNotes()
            }
        );
    }

    restartLevel() {
        this.noteOnFretboardEventListenerAdder.noteOnFretboardGameInitializer.setAvailableStringsAndShuffleNotes();
        document.dispatchEvent(new Event('game-start'));
    }

    goToNextLevel() {
        console.log('goToNextLevel');
        let bpmInput = document.getElementById('bpm-input');
        bpmInput.stepUp();
        // stepUp on input type number doesn't automatically fire the "change" event.
        // And the change event automatically resets the game progress so this has to be called before it can be removed
        const changeEvent = new Event('change');
        // Dispatch event to trigger same processes than when level is changed manually
        bpmInput.dispatchEvent(changeEvent);
        GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        // No need to call reset game progress here because it's called in the bpm input change event handler
    }

    levelChangeEventHandler() {
        document.dispatchEvent(new Event('game-stop'));
        GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        GameElementsVisualizer.togglePlayPauseButton('stop');
        // Reset game progress in the form of an event to avoid having to need game progress instance here
        document.dispatchEvent(new Event('reset-game-progress'));

        this.noteOnFretboardEventListenerAdder.noteOnFretboardGameInitializer.fretboardNoteGameCoordinator
            .noteOnFretboardNoteHandler.setLevelValue(document.querySelector('#bpm-input').value);

        // Update color to indicate that level is accomplished on bpm change event
        GameElementsVisualizer.updateIsLevelAccomplishedColor(this.levelLocalStorageKey);
    }

    shuffleNotesEventHandler(){
        this.noteOnFretboardEventListenerAdder.noteOnFretboardGameInitializer.setAvailableStringsAndShuffleNotes();
    }

}