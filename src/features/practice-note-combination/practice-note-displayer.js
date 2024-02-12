import {DetectedNoteVerifier} from "../detected-note/detected-note-verifier.js?v=1.4.0";
import {GameProgressVisualizer} from "../game-core/game-progress/game-progress-visualizer.js?v=1.4.0";
import {NoteDisplayer} from "../../components/game-core/ui/note-displayer.js?v=1.4.0";

/**
 * Note displayer for "practice" mode, which means
 * without metronome beat, scores and challenging notes.
 * No time limit to play note and change happens after
 * the correct note has been played.
 */
export class PracticeNoteDisplayer {

    correctNoteCount = 0;

    /**
     *
     * @param noteGenerator instance that contains a getNextCombination() method
     * @param notesAmountForFullProgressBar
     */
    constructor(noteGenerator, notesAmountForFullProgressBar = 30) {
        this.noteGenerator = noteGenerator;
        this.detectedNoteVerifier = new DetectedNoteVerifier();
        this.notesAmountForFullProgressBar = notesAmountForFullProgressBar;

        // Create class-level arrow function properties for event listeners so that they can be removed
        this.displayNotesHandler = this.displayNotes.bind(this);
        // Event handler that checks if note is correct. Updates attributes and calls functions of this coordinator.
        this.checkIfNoteCorrectHandler = this.detectedNoteVerifier.checkIfNoteIsCorrect.bind(this.detectedNoteVerifier);
        // Reset game progress when level is reset or leveled up
        this.resetGameProgressHandler = this.resetGameProgress.bind(this);
        // Increase correct note count when correct note is played
        this.increaseCorrectNoteCountHandler = this.increaseCorrectNoteCount.bind(this);
    }


    beingGame() {
        // Event fired each time a correct note has been played
        document.addEventListener('correct-note-played', this.displayNotesHandler);
        // Correct count has to be in separate function than displayNotes for the case the game is paused and resumed
        document.addEventListener('correct-note-played', this.increaseCorrectNoteCountHandler);
        // Custom event when played note was detected
        document.addEventListener('note-detected', this.checkIfNoteCorrectHandler);
        // Event removed in destroy function of the game coordinator
        document.addEventListener('reset-game-progress', this.resetGameProgressHandler);
    }

    endGame() {
        document.removeEventListener('correct-note-played', this.displayNotesHandler);
        document.addEventListener('correct-note-played', this.increaseCorrectNoteCountHandler);
        document.removeEventListener('note-detected', this.checkIfNoteCorrectHandler);
    }

    increaseCorrectNoteCount() {
        this.correctNoteCount++;
    }

    displayNotes(combination, firstCall = false) {
        this.updateProgressBar();
        // Function to display the note combination
        const displayNoteCombination = () => {
            this.detectedNoteVerifier.correctNoteAccounted = false;
            NoteDisplayer.resetAllColors();

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
            NoteDisplayer.displayCombinationWithNoteNumber(stringName, noteNumber ?? noteName, noteName);
            // console.debug(`Displaying combination ${stringName}|${noteName}`);
            this.detectedNoteVerifier.noteToPlay = noteName;
        };

        // If the progress bar is not full yet, display the next note combination instantly if it is the first call,
        // otherwise wait 700ms before displaying the next note combination
        if (this.correctNoteCount <= this.notesAmountForFullProgressBar) {
            if (firstCall) {
                displayNoteCombination();
            } else {
                // Color spans and detected note in green when correct
                document.querySelector('#note-span').style.color = 'green';
                setTimeout(() => {
                    displayNoteCombination();
                }, 700);
            }
        }
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
        GameProgressVisualizer.updateGameProgress(percentage, movingBarLabel, progressBarRightSideLabel);
    }

    resetGameProgress() {
        this.correctNoteCount = 0;
        // call display notes to refresh key and progress bar
        // this.displayNotes();
        console.debug('reset game progress for note in key game called');
    }

}