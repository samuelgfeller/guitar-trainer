import {GameProgressVisualizer} from "./game-progress-visualizer.js?v=2.4.1";

/**
 * Progress update for games that use the metronome and have challenging
 * combinations
 */
export class GameProgressUpdaterOld {

    maxWrongCombinations = 0;

    /**
     * @param {NoteOnFretboardNoteHandler} noteDisplayCoordinator
     */
    constructor(noteDisplayCoordinator) {
        this.noteDisplayCoordinator = noteDisplayCoordinator;
    }

    updateGameStats() {
        GameProgressVisualizer.displayGameStats(
            this.noteDisplayCoordinator.correctNoteCount,
            this.noteDisplayCoordinator.incorrectNoteCount,
            this.maxWrongCombinations
        );
    }

    /**
     * Calculate and update game progress bar and stats with challenging combination
     * @param challengingCombinationsCount current progress that will be displayed in progress bar
     */
    calculateAndUpdateGameProgress(challengingCombinationsCount) {

        // Update max wrong combinations to the actual value if it's greater than the previous max.
        if (challengingCombinationsCount > this.maxWrongCombinations) {
            this.maxWrongCombinations = challengingCombinationsCount;
        }
        // Update game stats after setting the actual maxWrongCombinations
        this.updateGameStats();

        // Text inside the progress bar
        let movingBarLabel = '';
        let progressBarRightSideLabel = '';
        // Calculate percentage
        let percentage = 0;
        // If there are no more challenging notes, calculate the percentage via the amount of notes played correctly in a row
        if (challengingCombinationsCount === 0) {
            let requiredCorrectNotesAmount = this.noteDisplayCoordinator.endLevelRequiredCorrectNotesAmount;
            if (this.maxWrongCombinations === 0) {
                // If there were no wrong combination, it's the beginning of the level. For the level to be not too
                // easy in the beginning, the required correct notes amount is higher.
                requiredCorrectNotesAmount = this.noteDisplayCoordinator.levelBeginRequiredCorrectNotesAmount;
            }
            // percentage = this.lastNotesCorrectCount / this.requiredCorrectLastNotes * 100;
            percentage = this.noteDisplayCoordinator.consecutiveEndOfLevelCorrectNotes / requiredCorrectNotesAmount * 100;
            movingBarLabel = this.noteDisplayCoordinator.consecutiveEndOfLevelCorrectNotes;
            // Set the right side of the progress bar to the amount or required correct notes
            progressBarRightSideLabel = requiredCorrectNotesAmount;
        } // If there are challenging notes meaning, an end of level stage is not reached
        else {
            // The percentage is max wrongs minus the current wrongs divided by max wrongs times 100
            percentage = ((this.maxWrongCombinations - challengingCombinationsCount) / this.maxWrongCombinations) * 100;
            // Display number of currently challenging combinations in progress bar span when not currently max
            if (challengingCombinationsCount !== this.maxWrongCombinations) {
                movingBarLabel = challengingCombinationsCount;
            }
            // Set the right side of the progress bar to 0 to indicate that the first goal is to get to 0 challenging notes
            progressBarRightSideLabel = '0';
        }

        if (percentage === 100){
            document.querySelector('header div').style.borderBottomColor = 'green';
        }

        GameProgressVisualizer.updateGameProgress(percentage, movingBarLabel, progressBarRightSideLabel);
    }


    // goToNextLevel() {
    //     this.resetGameProgress();
    //     let bpmInput = document.getElementById('bpm-input');
    //     bpmInput.stepUp();
    //     // stepUp on input type number doesn't automatically fire the "change" event
    //     const changeEvent = new Event('change');
    //     bpmInput.dispatchEvent(changeEvent);
    //     GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
    // }

    /**
     * After a level is completed, the game progress is reset to 0% and stats are reset to 0.
     */
    // resetGameProgress(){
    //     this.noteDisplayCoordinator.combinations = new Map();
    //     this.maxWrongCombinations = 0;
    //     this.noteDisplayCoordinator.incorrectCount = 0;
    //     this.noteDisplayCoordinator.correctCount = 0;
    //     this.noteDisplayCoordinator.lastNotesCorrectCount = 0;
    //     this.gameProgressVisualizer.resetProgress();
    //     this.updateGameStats(); // Also refreshes the new stats visually
    // }
}