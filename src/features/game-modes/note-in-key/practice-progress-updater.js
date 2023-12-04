import {GameProgressVisualizer} from "./game-progress-visualizer.js?v=1.1.5";

export class GameProgressUpdater {

    maxWrongCombinations = 0;

    /**
     * @param {GameNoteDisplayer} noteDisplayCoordinator
     */
    constructor(noteDisplayCoordinator) {
        this.noteDisplayCoordinator = noteDisplayCoordinator;
        this.gameProgressVisualizer = new GameProgressVisualizer();
    }

    updateGameStats() {
        this.gameProgressVisualizer.displayGameStats(
            this.noteDisplayCoordinator.correctCount,
            this.noteDisplayCoordinator.incorrectCount,
            this.maxWrongCombinations
        );
    }

    /**
     * Calculate and update progress bar
     */
    calculateAndUpdatePracticeProgress() {
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

    /**
     * After a level is completed, the game progress is reset to 0% and stats are reset to 0.
     */
    resetGameProgress() {
        this.noteDisplayCoordinator.combinations = new Map();
        this.maxWrongCombinations = 0;
        this.noteDisplayCoordinator.incorrectCount = 0;
        this.noteDisplayCoordinator.correctCount = 0;
        this.noteDisplayCoordinator.lastNotesCorrectCount = 0;
        this.gameProgressVisualizer.resetProgress();
        this.updateGameStats(); // Also refreshes the new stats visually
    }
}