import {DetectedNoteVerifier} from "../detected-note/detected-note-verifier.js";
import {NoteCombinationVisualizer} from "../game-core/game-ui/note-combination-visualizer.js";

/**
 * Note displayer for "practice" mode, which means
 * without metronome beat, scores and challenging notes.
 * No time limit to play note and change happens after
 * the correct note has been played.
 */
export class PracticeNoteDisplayer {

    correctNoteCount = 0;
    notesAmountForFullProgressBar = 20;

    /**
     *
     * @param noteGenerator instance that contains a getNextCombination() method
     */
    constructor(noteGenerator) {
        this.noteGenerator = noteGenerator;
        this.detectedNoteVerifier = new DetectedNoteVerifier();

        // Create class-level arrow function properties for event listeners so that they can be removed
        this.displayNotesHandler = this.displayNotes.bind(this);
        // Event handler that checks if note is correct. Updates attributes and calls functions of this coordinator.
        this.checkIfNoteCorrectHandler = this.detectedNoteVerifier.checkIfNoteIsCorrect.bind(this.detectedNoteVerifier);
    }

    beingGame() {
        // Event fired each time a correct note has been played
        document.addEventListener('correct-note-played', this.displayNotesHandler);
        // Custom event when played note was detected
        document.addEventListener('note-detected', this.checkIfNoteCorrectHandler);
    }

    endGame() {
        document.removeEventListener('correct-note-played', this.displayNotesHandler);
        document.removeEventListener('note-detected', this.checkIfNoteCorrectHandler);
    }

    displayNotes(combination) {
        // console.log('displayNotes is called');
        // console.trace();
        setTimeout(() => {
            this.detectedNoteVerifier.correctNoteAccounted = false;
            NoteCombinationVisualizer.resetAllColors();

            let stringName, noteName;
            // Get the next combination
            if (combination && typeof combination === 'object' && 'noteName' in combination) {
                ({stringName, noteName} = combination);
            } else {
                ({stringName, noteName} = this.noteGenerator.getNextCombination());
            }
            // Note could be displayed as number
            let noteNumber = null;
            // Check if note is an object or a string
            if (typeof noteName === 'object') {
                noteNumber = noteName.number;
                noteName = noteName.noteName;
            }
            // Display next note and string
            NoteCombinationVisualizer.displayCombination(stringName, noteNumber ?? noteName);
            // console.debug(`Displaying combination ${stringName}|${noteName}`);
            this.detectedNoteVerifier.noteToPlay = noteName;
        }, 700);
    }

    updateProgressBar() {
        // Text inside the progress bar
        let movingBarLabel = '';
        let progressBarRightSideLabel = '';
        // Calculate percentage
        let percentage = 0;
        // If there are no more challenging notes, calculate the percentage via the amount of notes played correctly in a row

        // percentage = this.lastNotesCorrectCount / this.requiredCorrectLastNotes * 100;
        percentage = this.correctNoteCount / this.notesAmountForFullProgressBar * 100;
        movingBarLabel = this.correctNoteCount;
        // Set the right side of the progress bar to the amount or required correct notes
        progressBarRightSideLabel = this.notesAmountForFullProgressBar;


        this.gameProgressVisualizer.updateGameProgress(percentage, movingBarLabel, progressBarRightSideLabel);

    }
}