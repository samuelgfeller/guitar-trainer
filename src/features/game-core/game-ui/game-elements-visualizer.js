import {GameLevelTracker} from "../game-progress/game-level-tracker.js?v=489";

export class GameElementsVisualizer {
    static hideGameElementsAndDisplayInstructions() {
        document.querySelectorAll('.visible-when-game-on').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelector('#key-and-string-container').style.display = 'none';

        document.querySelector('#game-start-instruction').style.display = 'block';
    }

    static showGameElementsAndHideInstructions() {
        document.querySelector('#start-stop-btn').innerText = 'Pause';


        // Collapse game instructions
        // document.querySelector('#game-start-instruction details').open = false;

        // Display game elements and remove instructions
        document.querySelectorAll('.visible-when-game-on').forEach(element => {
            element.style.display = 'block';
        });
        document.querySelector('#game-start-instruction').style.display = 'none';
        document.querySelector('#key-and-string-container').style.display = null;
    }

    static showGameProgress(progressBarEnabled, scoreEnabled) {
        if (progressBarEnabled) {
            // Remove "display:none" on game progress and score
            document.querySelector('#game-progress-div').style.display = null;
        }
        if (scoreEnabled) {
            document.querySelector('#score').style.display = null;
        }
    }

    /**
     * Change color of the bottom line to indicated level is accomplished
     */
    static updateIsLevelAccomplishedColor(gameModeLevelKey) {
        const bpmInput = document.querySelector('#bpm-input');
        if (GameLevelTracker.isLevelAccomplished(bpmInput.value, gameModeLevelKey)) {
            document.querySelector('header div').style.borderBottomColor = 'green';
        } else {
            document.querySelector('header div').style.borderBottomColor = null;
        }
    }
}