import {GameProgress} from "./game-progress.js?v=0.6";

class GameUI {
    noteGame;

    constructor(noteGameInstance) {
        this.noteGame = noteGameInstance;
        this.gameProgress = new GameProgress(this);
        // The far left (0%) is always the max wrong combinations
        this.maxWrongCombinations = 0;
        // At the end of the progress bar, when there is no challenging notes left, the user has to do 10 correct
        // notes in a row to be able to have 100% progress. This is a counter of those last notes.
        this.lastNotesCorrectCount = 0;
        // Amount of required notes to be played correctly in a row
        this.requiredCorrectLastNotes = 10;
        this.requiredCorrectNotesBeginning = 20;
        // If user wants to continue playing after 100% reached
        this.alreadyLeveledUp = false;
    }

    updateGameProgress() {
        // document.querySelector('#challenging-count').innerText = this.noteGame.combinations.size;
        const progressBar = document.querySelector('.meter span');
        const challengingCombinationsCount = this.noteGame.combinations.size;

        // Update max wrong combinations to the actual value if it's greater than the previous max.
        if (challengingCombinationsCount > this.maxWrongCombinations) {
            this.maxWrongCombinations = challengingCombinationsCount;
        }
        // Update game stats after setting the actual maxWrongCombinations
        this.updateGameStatsDisplay();

        // Set percentage
        let percentage = 0;
        // If there are no more challenging notes, calculate percentage with last correct notes count
        if (challengingCombinationsCount === 0) {
            let requiredCorrectNotesAmount = this.requiredCorrectLastNotes;
            if (this.maxWrongCombinations === 0) {
                // If there were no wrong combination it's the beginning of the level. For it to be not too
                // easy, the required correct notes is increased to 20 instead of 10
                requiredCorrectNotesAmount = this.requiredCorrectNotesBeginning;
            }
            // percentage = this.lastNotesCorrectCount / this.requiredCorrectLastNotes * 100;
            percentage = this.lastNotesCorrectCount / requiredCorrectNotesAmount * 100;
            progressBar.innerText = this.lastNotesCorrectCount;
            // Set the right side of the progress bar to the amount or required correct notes
            document.querySelector('#min-errors').innerHTML = requiredCorrectNotesAmount;
        } else {
            // If there are challenging notes, the percentage is max wrongs minus
            percentage = ((this.maxWrongCombinations - challengingCombinationsCount) / this.maxWrongCombinations) * 100;
            // Display actual challenging combinations in progress bar span when not currently max
            if (challengingCombinationsCount !== this.maxWrongCombinations) {
                progressBar.innerText = challengingCombinationsCount;
            }
            // Set the right side of the progress bar to 0 to indicate that the first goal is to get to 0 challenging notes
            document.querySelector('#min-errors').innerHTML = '0';
        }

        let progressBarWidth = percentage > 100 ? 100 : percentage;
        progressBar.style.width = `${progressBarWidth}%`;
        if (percentage >= 100) {
            progressBar.style.borderRadius = '20px';
            if (!this.alreadyLeveledUp) {
                this.gameProgress.leveledUp();
            }
        } else {
            progressBar.style.borderRadius = null;
            this.alreadyLeveledUp = false;
        }
        // Remove span content of progress bar if its 0
        if (progressBarWidth === 0){
            progressBar.innerText = '';
        }
    }

    clearStats(){
        this.noteGame.combinations = new Map();
        this.maxWrongCombinations = 0;
        this.noteGame.incorrectCount = 0;
        this.noteGame.correctCount = 0;
        this.lastNotesCorrectCount = 0;
        document.querySelector('#game-progress-div').style.display = 'none';
        document.querySelector('#score').style.display = 'none';
        this.updateGameStatsDisplay();
    }

    updateGameStatsDisplay(){
        document.querySelector('#correct-count').innerText = this.noteGame.correctCount;
        document.querySelector('#incorrect-count').innerText = this.noteGame.incorrectCount;
        document.querySelector('#max-errors').innerHTML = this.maxWrongCombinations;
    }

    updateDetectedNoteAndCents(noteInfos) {
        const detectedNote = document.querySelector('#detected-note');
        detectedNote.innerHTML = noteInfos.name;
        // Convert the cent value to a percentage for the bar width
        const percentage = Math.abs(noteInfos.cents) / 2;

        if (noteInfos.cents < 0) {
            detectedNote.style.setProperty('--left-bar-width', `${percentage}vw`);
            detectedNote.style.setProperty('--right-bar-width', '0');
        } else if (noteInfos.cents > 0) {
            detectedNote.style.setProperty('--left-bar-width', '0');
            detectedNote.style.setProperty('--right-bar-width', `${percentage}vw`);
        } else {
            detectedNote.style.setProperty('--left-bar-width', '0');
            detectedNote.style.setProperty('--right-bar-width', '0');
        }

        // Set the width of the bar based on the cent value and its sign
        detectedNote.setAttribute('data-cent', noteInfos.cents); // Set the cent value as a data attribute
    }
}

export {GameUI}