export class GameElementsVisualizer {
    static hideGameElementsAndDisplayInstructions() {
        document.querySelectorAll('.visible-when-game-on').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelector('#game-start-instruction').style.display = 'block';
    }

    static showGameElementsAndHideInstructions() {
        document.querySelector('#start-stop-btn').innerText = 'Pause';

        // Remove "display:none" on game progress and score
        document.querySelector('#game-progress-div').style.display = null;
        document.querySelector('#score').style.display = null;
        // Collapse game instructions
        document.querySelector('#game-start-instruction details').open = false;

        // Display game elements and remove instructions
        document.querySelectorAll('.visible-when-game-on').forEach(element => {
            element.style.display = 'block';
        });
        document.querySelector('#game-start-instruction').style.display = 'none';
    }
}