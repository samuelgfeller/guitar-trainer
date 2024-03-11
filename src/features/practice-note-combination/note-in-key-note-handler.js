import {DetectedNoteVerifier} from "../detected-note/detected-note-verifier.js?v=2.3.1";
import {GameProgressVisualizer} from "../game-core/game-progress/game-progress-visualizer.js?v=2.3.1";
import {NoteDisplayer} from "../../components/game-core/ui/note-displayer.js?v=2.3.1";

/**
 * Note displayer for "practice" mode, which means
 * without metronome beat, scores and challenging notes.
 * No time limit to play note and change happens after
 * the correct note has been played.
 */
export class NoteInKeyNoteHandler {

    correctNoteCount = 0;

    notUpdateCorrectCount = false;

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

    /**
     * Resume or start game
     */
    beingGame() {
        // Correct count has to be in separate function than displayNotes for the case the game is paused and resumed
        document.addEventListener('correct-note-played', this.increaseCorrectNoteCountHandler);
        // Event fired each time a correct note has been played
        document.addEventListener('correct-note-played', this.displayNotesHandler);
        // Custom event when played note was detected
        document.addEventListener('note-detected', this.checkIfNoteCorrectHandler);
        // Event removed in destroy function and this is good enough as when pausing and resuming the game multiple
        // times, js does not add multiple duplicate named event handlers
        // https://www.js-craft.io/blog/javascript-addeventlistener-will-not-duplicate-named-functions/
        document.addEventListener('reset-game-progress', this.resetGameProgressHandler);

        this.updateProgressBar();
    }

    /**
     * Pause game
     */
    endGame() {
        document.removeEventListener('correct-note-played', this.displayNotesHandler);
        document.removeEventListener('correct-note-played', this.increaseCorrectNoteCountHandler);
        document.removeEventListener('note-detected', this.checkIfNoteCorrectHandler);
        // rest-game-progress event listener is removed in destroy function
        // https://www.js-craft.io/blog/javascript-addeventlistener-will-not-duplicate-named-functions/
    }

    /**
     * When game mode is changed and everything has to be cleaned up
     */
    destroy(){
        document.removeEventListener('reset-game-progress', this.resetGameProgressHandler);
    }

    increaseCorrectNoteCount() {
        if (this.notUpdateCorrectCount === false) {
            this.correctNoteCount++;
        } else {
            this.notUpdateCorrectCount = false;
        }

        this.updateProgressBar();
    }

    /**
     * Display the next note combination.
     * The solution for the given first note is not beautiful for type safety. It Should be changed.
     * @param combination an object with stringName and noteName which is either a string (first note)
     * or an object with noteName and number
     */
    displayNotes(combination) {
        // Determine the string and note to display
        let stringName, noteName;
        // Get the next combination
        if (combination && typeof combination === 'object' && 'noteName' in combination) {
            ({stringName, noteName} = combination);
            // Not update correct count if the combination is given as it's the first one
            // this.notUpdateCorrectCount = true;
        } else {
            ({stringName, noteName} = this.noteGenerator.getNextCombination());
        }
        // Function to display the note combination
        const displayNoteCombination = () => {
            this.detectedNoteVerifier.correctNoteAccounted = false;
            NoteDisplayer.resetAllColors();

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
            // If notUpdateCorrectCount is true, it means the combination is given as an argument, and thus
            // it's the first combination and there should not be a delay
            if (this.notUpdateCorrectCount) {
                displayNoteCombination();
            } else {
                // Color spans and detected note in green when correct
                document.querySelector('#note-span').style.color = 'green';
                setTimeout(() => {
                    displayNoteCombination();
                }, 500);
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

    resetGameProgress(e) {
        this.correctNoteCount = 0;
        // console.log(e.detail);
        // call display notes to refresh key and progress bar
        // this.displayNotes();
        console.debug('reset game progress for note in key game called');
    }

}