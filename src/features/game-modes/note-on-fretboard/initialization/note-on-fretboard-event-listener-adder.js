import {GameProgressVisualizer} from "../../../game-core/game-progress/game-progress-visualizer.js?v=2.3.3";
import {NoteOnFretboardEventHandler} from "./note-on-fretboard-event-handler.js?v=2.3.3";
import {RangeSelector} from "../../../../components/game-modes/note-on-fretboard/range-selector.js?v=2.3.3";

export class NoteOnFretboardEventListenerAdder {

    /**
     * @param {NoteOnFretboardGameInitializer} noteOnFretboardGameInitializer
     */
    constructor(noteOnFretboardGameInitializer) {
        this.noteOnFretboardGameInitializer = noteOnFretboardGameInitializer;
        this.eventHandler = new NoteOnFretboardEventHandler(this);
        // Needs to be in an attribute like this to have .bind(this) and be able to remove event listener
        this.levelUpEventHandler = this.eventHandler.levelUp.bind(this.eventHandler);
        this.shuffleNotesEventHandler = this.eventHandler.shuffleNotesEventHandler.bind(this.eventHandler);
        this.levelChangeEventHandler = this.eventHandler.levelChangeEventHandler.bind(this.eventHandler);
    }

    removeEventListeners(){
        document.removeEventListener('leveled-up', this.levelUpEventHandler);
        document.removeEventListener('note-on-fretboard-reshuffle-notes', this.shuffleNotesEventHandler);
    }

    addLevelUpEventListener(){
        document.addEventListener('leveled-up', this.levelUpEventHandler);
    }

    addReShuffleNotesEventListener(){
        document.addEventListener('note-on-fretboard-reshuffle-notes', this.shuffleNotesEventHandler);
    }

    addStringOptionsEventListeners() {
        // call this.setPossibleKeysOnStrings(); each time a string option is changed
        const stringOptions = document.querySelectorAll('#note-on-fretboard-game-strings-div input');
        stringOptions.forEach((stringOption) => {
            stringOption.addEventListener('change', () => {
                this.noteOnFretboardGameInitializer.setAvailableStringsAndShuffleNotes();
                document.dispatchEvent(new Event('game-stop'));
                GameProgressVisualizer.hideProgress();
                document.dispatchEvent(new Event('reset-game-progress'));
            });
        });
    }

    addBpmInputEventListener(){
        // Add level change event listener when bpm input is changed
        // Doesn't need to be removed as destroy function removes html element
        document.querySelector('#bpm-input')
            .addEventListener('change', this.eventHandler.levelChangeEventHandler.bind(this.eventHandler));
    }

    addSelectRangeButtonEventListener() {
        document.querySelector('#select-range-option').addEventListener('click', () => {
            RangeSelector.openRangeSelectorModal();
        });
    }

}