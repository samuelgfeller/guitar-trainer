import {GameProgressUpdater} from "../game-core/game-progress/game-progress-updater.js?v=0.6";
import {DetectedNoteVerifier} from "../detected-note/detected-note-verifier.js?v=0.6";
import {NoteCombinationCalculator} from "./note-combination-calculator.js?v=0.6";
import {NoteCombinationVisualizer} from "./note-combination-visualizer.js?v=0.6";

export class NoteDisplayCoordinator {
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


    constructor(strings, notes,) {
        this.gameProgressUpdater = new GameProgressUpdater(this);
        this.noteCombinationCalculator = new NoteCombinationCalculator(strings, notes);
        this.detectedNoteVerifier = new DetectedNoteVerifier(this);
        // Create class-level arrow function properties for event listeners so that they can be removed
        this.displayRandomNotesHandler = this.displayNotes.bind(this);
        // Event handler that checks if note is correct. Updates attributes and calls functions of this coordinator.
        this.checkIfNoteCorrectHandler = this.detectedNoteVerifier.checkIfNoteIsCorrect.bind(this.detectedNoteVerifier);
    }

    beingGame() {
        // Event fired on each metronome beat
        document.addEventListener('metronome-beat', this.displayRandomNotesHandler);
        // Custom event when played note was detected
        document.addEventListener('note-detected', this.checkIfNoteCorrectHandler);
    }

    endGame() {
        document.removeEventListener('metronome-beat', this.displayRandomNotesHandler);
        document.removeEventListener('note-detected', this.checkIfNoteCorrectHandler);
    }

    displayNotes() {
        this.adjustIncorrectPreviousCombinationCount();

        this.updateProgress();

        // Reset correct note accounted
        this.detectedNoteVerifier.correctNoteAccounted = false;
        // console.debug(`Previous combination: ${this.previousCombination}`);

        // Reset color of note span
        NoteCombinationVisualizer.resetAllColors();

        // Get the next combination
        let {noteName, stringName} = this.noteCombinationCalculator.prepareAndGetNextCombination(
            this.challengingCombinations,
            this.previousCombination
        );
        // Display next note and string
        NoteCombinationVisualizer.displayCombination(stringName, noteName);
        // console.debug(`Displaying combination ${stringName}|${noteName}`);
        this.detectedNoteVerifier.noteToPlay = noteName;

        // Set incorrect by default, changed to false if correct note was played (in highlightNoteIfCorrect)
        this.previousCombinationWasIncorrect = true;
        this.previousCombination = `${stringName}|${noteName}`;
    }

    updateProgress() {
        this.gameProgressUpdater.updateGameProgress(this.challengingCombinations.size);
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
}