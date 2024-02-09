import {GameProgressUpdater} from "../game-core/game-progress/game-progress-updater.js?v=1.3.2";
import {DetectedNoteVerifier} from "../detected-note/detected-note-verifier.js?v=1.3.2";
import {NoteCombinationVisualizer} from "../game-core/game-ui/note-combination-visualizer.js?v=1.3.2";
import {GameProgressVisualizer} from "../game-core/game-progress/game-progress-visualizer.js?v=1.3.2";

/**
 * Note display coordinator when playing the "game" which
 * means with metronome rhythm, progress bar and challenging
 * notes.
 * One level more is a higher metronome beat.
 */
export class GameNoteDisplayer {
    challengingCombinations = new Map();
    incorrectCount = 0;
    correctCount = 0;
    previousCombination;
    previousCombinationWasIncorrect = false;

    // At the end of the progress bar, when there is no challenging notes left, the user has to do
    // x amount (default 10) correct notes in a row to be able to have 100% progress. More at level begin.
    endLevelRequiredCorrectNotesAmount = 10;
    levelBeginRequiredCorrectNotesAmount = 20;
    // This is a counter of those last notes.
    // It is incremented by the event handler on a detected correct note.
    consecutiveEndOfLevelCorrectNotes = 0;

    /**
     *
     * @param noteGenerator instance of a note generator that implements a getNextCombination() method
     */
    constructor(noteGenerator) {
        this.gameProgressUpdater = new GameProgressUpdater(this);
        this.noteGenerator = noteGenerator;
        this.detectedNoteVerifier = new DetectedNoteVerifier();
        // Create class-level arrow function properties for event listeners so that they can be removed
        this.displayRandomNotesHandler = this.displayNotes.bind(this);
        // Event handler that checks if note is correct. Updates attributes and calls functions of this coordinator.
        this.checkIfNoteCorrectHandler = this.detectedNoteVerifier.checkIfNoteIsCorrect.bind(this.detectedNoteVerifier);
        this.correctNoteEventHandler = this.correctNoteHandler.bind(this);
        // Reset game progress when level is reset or leveled up
        this.resetGameProgressHandler = this.resetGameProgress.bind(this);
        this.levelCompletionEventListenerCleanupHandler =
            this.removeResetGameProgressEventListenerAfterLevelCompletion.bind(this);
    }

    beingGame() {
        // Event fired on each metronome beat
        document.addEventListener('metronome-beat', this.displayRandomNotesHandler);
        // Custom event when played note was detected
        document.addEventListener('note-detected', this.checkIfNoteCorrectHandler);
        // Event when the correct note was played
        document.addEventListener('correct-note-played', this.correctNoteEventHandler);
        // Event when game progress should be reset
        document.addEventListener('reset-game-progress', this.resetGameProgressHandler);
        // Add event listener that removes the reset game progress event listener after the level completion modal
        // is closed (either when going to the next level or restart the current one)
        document.addEventListener('remove-progress-reset-event-listener-after-level-completion',
            this.levelCompletionEventListenerCleanupHandler);
    }

    endGame() {
        // Set the previous note to correct so that it doesn't count as failed when the game is paused
        this.previousCombinationWasIncorrect = false;
        document.removeEventListener('metronome-beat', this.displayRandomNotesHandler);
        document.removeEventListener('note-detected', this.checkIfNoteCorrectHandler);
        document.removeEventListener('correct-note-played', this.correctNoteEventHandler);
        // Reset game process event handler cannot be removed here because it's called from the level-up
        // or reset functions that are called after the game is stopped.
        // It's removed in the function removeResetGameProgressEventListenerAfterLevelCompletion()
    }

    displayNotes() {
        this.adjustIncorrectPreviousCombinationCount();

        this.updateProgress();

        // Reset correct note accounted
        this.detectedNoteVerifier.correctNoteAccounted = false;
        // console.debug(`Previous combination: ${this.previousCombination}`);

        // Reset color of note span
        NoteCombinationVisualizer.resetAllColors();
        // console.log('Displaying notes', this.noteGenerator.getNextCombination(
        //             this.challengingCombinations,
        //             this.previousCombination
        //         ));
        // Get the next combination
        let {stringName, noteName} = this.noteGenerator.getNextCombination(
            this.challengingCombinations,
            this.previousCombination
        );
        // Note could be displayed as number
        let noteNumber = null;
        // Check if note is an object or a string
        if (typeof noteName === 'object') {
            noteNumber = noteName.number;
            noteName = noteName.noteName;
        }

        // Display next note and string and if with treble clef
        NoteCombinationVisualizer.displayCombinationWithNoteName(stringName, noteNumber ?? noteName,
            document.querySelector('#fretboard-note-game-treble-clef input').checked,
            document.querySelector('#fretboard-note-game-treble-clef-and-name input').checked
            );
        // console.debug(`Displaying combination ${stringName}|${noteName}`);
        this.detectedNoteVerifier.noteToPlay = noteName;

        // Set incorrect by default, changed to false if correct note was played (in highlightNoteIfCorrect)
        this.previousCombinationWasIncorrect = true;
        this.previousCombination = `${stringName}|${noteName}`;
    }

    /**
     * Update stats and progress on correct note
     */
    correctNoteHandler() {
        console.log('handling correct note event')
        // Combination was correct meaning that its count should be adjusted or removed if over 3 times correct
        this.adjustCombinationCorrectCount();
        // Mark that it was correct by setting value to false
        this.previousCombinationWasIncorrect = false;
        this.correctCount++;
        // Update game progress
        // If there are no combinations left to show, increase the consecutive end-of-level correct notes
        if (this.challengingCombinations.size === 0) {
            this.consecutiveEndOfLevelCorrectNotes++;
        }
        this.updateProgress();
    }

    updateProgress() {
        this.gameProgressUpdater.calculateAndUpdateGameProgress(this.challengingCombinations.size);
    }

    // Adjust the count of the previous combination that was incorrect
    adjustIncorrectPreviousCombinationCount() {
        // If a combination was wrong last time
        if (this.previousCombinationWasIncorrect) {
            this.incorrectCount++;
            // Reset consecutive end-of-level correct notes correct to 0 when there was an error
            this.consecutiveEndOfLevelCorrectNotes = 0;
            let combinationStats = this.challengingCombinations.get(this.previousCombination);
            if (combinationStats) {
                combinationStats.incorrect += 1;
                // Reset to 0 after incorrect
                combinationStats.correct = 0;
            } else {
                // Create new combination stats object
                combinationStats = {incorrect: 1, correct: 0};
                this.challengingCombinations.set(this.previousCombination, combinationStats);
            }
        }
    }

    // Combination played correctly
    adjustCombinationCorrectCount() {
        if (this.challengingCombinations.get(this.previousCombination)) {
            const combinationStats = this.challengingCombinations.get(this.previousCombination);
            if (combinationStats.correct >= 3) {
                this.challengingCombinations.delete(this.previousCombination);
            } else {
                combinationStats.correct += 1;
                this.challengingCombinations.set(this.previousCombination, combinationStats);
            }
        }
    }


    /**
     * Reset game progress event handler cannot be removed at the end of the game as the
     * user clicks on "go to next level" in the modal box displayed after the game is stopped.
     * The same goes for restart, the progress should be reset after endGame() is called.
     */
    removeResetGameProgressEventListenerAfterLevelCompletion() {
        // Remove event listener after it's called once
        document.removeEventListener('reset-game-progress', this.resetGameProgressHandler);
        // Remove the handler that points to this function itself
        document.removeEventListener('remove-progress-reset-event-listener-after-level-completion',
            this.levelCompletionEventListenerCleanupHandler);
    }

    resetGameProgress() {
        this.challengingCombinations = new Map();
        this.gameProgressUpdater.maxWrongCombinations = 0;
        this.incorrectCount = 0;
        this.correctCount = 0;
        this.consecutiveEndOfLevelCorrectNotes = 0;
        GameProgressVisualizer.resetProgress();
        console.log('reset game progress called fretboard')
        this.gameProgressUpdater.updateGameStats(); // Also refreshes the new stats visually
    }
}