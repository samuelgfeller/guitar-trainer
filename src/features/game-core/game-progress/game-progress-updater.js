import {GameProgressVisualizer} from "./game-progress-visualizer.js";

export class GameProgressUpdater {
    // At the end of the progress bar, when there is no challenging notes left, the user has to do 10 correct
    // notes in a row to be able to have 100% progress. This is a counter of those last notes.
    consecutiveEndOfLevelCorrectNotes = 0;

    constructor(endLevelRequiredCorrectNotesAmount, levelBeginRequiredCorrectNotesAmount) {
        this.gameProgressVisualizer = new GameProgressVisualizer();
        this.endLevelRequiredCorrectNotesAmount = endLevelRequiredCorrectNotesAmount;
        this.levelBeginRequiredCorrectNotesAmount = levelBeginRequiredCorrectNotesAmount;
    }

    /**
     * Update game progress bar and stats
     * @param challengingCombinationsCount current progress that will be displayed in progress bar
     * @param correctCount correct total played in that session
     * @param incorrectCount incorrect total played in that session
     */
    updateGameProgress(challengingCombinationsCount, correctCount, incorrectCount) {

        // Update max wrong combinations to the actual value if it's greater than the previous max.
        if (challengingCombinationsCount > this.maxWrongCombinations) {
            this.maxWrongCombinations = challengingCombinationsCount;
        }
        // Update game stats after setting the actual maxWrongCombinations
        this.gameProgressVisualizer.updateGameStatsDisplay(correctCount, incorrectCount, this.maxWrongCombinations);

        // Text inside the progress bar
        let movingBarLabel = '';
        let progressBarRightSideLabel = '';
        // Calculate percentage
        let percentage = 0;
        // If there are no more challenging notes, calculate the percentage via the amount of notes played correctly in a row
        if (challengingCombinationsCount === 0) {
            let requiredCorrectNotesAmount = this.endLevelRequiredCorrectNotesAmount;
            if (this.maxWrongCombinations === 0) {
                // If there were no wrong combination, it's the beginning of the level. For the level to be not too
                // easy in the beginning, the required correct notes amount is higher.
                requiredCorrectNotesAmount = this.levelBeginRequiredCorrectNotesAmount;
            }
            // percentage = this.lastNotesCorrectCount / this.requiredCorrectLastNotes * 100;
            percentage = this.consecutiveEndOfLevelCorrectNotes / requiredCorrectNotesAmount * 100;
            movingBarLabel = this.consecutiveEndOfLevelCorrectNotes;
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

        this.gameProgressVisualizer.updateGameProgress(percentage, movingBarLabel, progressBarRightSideLabel);
    }
}