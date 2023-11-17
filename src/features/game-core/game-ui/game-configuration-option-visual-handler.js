import {GameLevelTracker} from "../game-progress/game-level-tracker.js";

export class GameConfigurationOptionVisualHandler {

    /**
     * Different game modes can have different options
     */
    static updateModeOptions(settingId) {
        this.hideAllGameModeOptions();
        if (settingId === 'fretboard-note-game-mode') {
            this.fretboardNoteGameModeSettings();
        }
        if (settingId === 'note-in-key-game-mode') {
            this.noteInKeyGameModeSettings();
        }
        if (settingId === 'note-in-key-game-mode') {
            // There are no options
        }
    }

    /**
     * Before displaying game mode options, hide all of them in case
     * there were some before the game mode has been selected.
     */
    static hideAllGameModeOptions() {
        document.querySelector('#options-title-span').style.display = 'none';
        this.toggleCheckboxOptions(false, [
            // Fretboard note game options
            'display-in-treble-clef',
            'display-note-name-and-treble-clef',
            'challenging-notes-preset',
            // Note in key game options
            'difficulty-range-slider-container',
            //'note-in-key-test-mode',
        ]);
    }

    static fretboardNoteGameModeSettings() {
        // Challenging notes preset is done in the fretboard game mode coordinator itself
        // Display checkboxes for fretboard note game
        this.toggleCheckboxOptions(true, [
                'display-in-treble-clef',
                'display-note-name-and-treble-clef',
                'challenging-notes-preset',
            ]
            // If new are added, they have to be added to hideAllGameModeOptions as well
        );
    }

    static noteInKeyGameModeSettings() {
        // Display practice checkbox
        //this.toggleCheckboxOptions(true, ['note-in-key-test-mode']);

        // Show options title
        document.querySelector('#options-title-span').style.display = null;

        // Showing the range is different from checkboxes
        document.getElementById('difficulty-range-slider-container').style.display = 'inline-block';

        // If new options are added, they have to be added to hideAllGameModeOptions as well
    }

    static toggleCheckboxOptions(show, optionIds) {
        for (const optionId of optionIds) {
            const element = document.getElementById(optionId);
            if (element) {
                if (show) {
                    element.style.display = 'inline-flex';
                } else {
                    // Display none is default, so remove display inline-flex
                    element.style.display = null;
                }
            } else {
                console.error(`Element with id "${optionId}" does not exist.`);
            }
        }
        // If options should be shown, remove display none on option title
        if (show){
            document.querySelector('#options-title-span').style.display = null;
        }
    }
}