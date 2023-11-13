import {GameProgress} from "../game-progress.js";
import {GameLevelHandler} from "./game-level-handler.js";

class GameProgressVisualizer {
    noteGame;

    constructor(noteGameInstance) {
        this.noteGame = noteGameInstance;
        this.gameLevelHandler = new GameLevelHandler(this);
        // The far left (0%) is always the max wrong combinations
        this.maxWrongCombinations = 0;
        // At the end of the progress bar, when there is no challenging notes left, the user has to do 10 correct
        // notes in a row to be able to have 100% progress. This is a counter of those last notes.
        this.lastNotesCorrectCount = 0;

        // If user wants to continue playing after 100% reached
        this.alreadyLeveledUp = false;
    }

    updateGameProgress(percentage, movingBarLabel) {
        // document.querySelector('#challenging-count').innerText = this.noteGame.combinations.size;
        const progressBar = document.querySelector('.meter span');

        progressBar.innerText = movingBarLabel;
        document.querySelector('#progress-bar-right-side-label').innerHTML = '0';

        let progressBarWidth = percentage > 100 ? 100 : percentage;
        progressBar.style.width = `${progressBarWidth}%`;
        if (percentage >= 100) {
            progressBar.style.borderRadius = '20px';
            if (!this.alreadyLeveledUp) {
                this.gameLevelHandler.leveledUp();
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

    updateGameStatsDisplay(correctCount, incorrectCount, maxWrongCombinations){
        document.querySelector('#correct-count').innerText = correctCount;
        document.querySelector('#incorrect-count').innerText = incorrectCount;
        document.querySelector('#progress-bar-left-side-label').innerHTML = maxWrongCombinations;
    }
}

export {GameProgressVisualizer}