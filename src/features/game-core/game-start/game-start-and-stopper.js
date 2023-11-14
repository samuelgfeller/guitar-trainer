import {GameInitializer} from "./game-initializer.js?v=0.6";
import {CoreGameCoordinator} from "./core-game-coordinator.js?v=0.6";

export class GameStartAndStopper {

    /**
     * @param {GameInitializer} gameInitializer
     */
    constructor(gameInitializer) {
        this.gameInitializer = gameInitializer;
        this.coreGameCoordinator = new CoreGameCoordinator(this.gameInitializer);
    }

    /**
     * Start and stop game or metronome
     * Executed on click of start or stop button
     */
    startStopGame() {
        this.startStopButton = document.querySelector('#start-stop-btn');

        // If the game is not running, start it. Otherwise, stop.
        if (this.startStopButton.innerText === 'Play') {
            // In case settings div is expanded, collapse it
            document.getElementById('config-div').classList.remove('expanded');

            if (document.querySelector('#metronome-mode input').checked) {
                // If play sound is true, only start metronome and not the whole game
                this.coreGameCoordinator.metronomeOperator.setupAudioContext();
                this.coreGameCoordinator.metronomeOperator.startMetronome();

                this.gameInitializer.onlyMetronome = true;
                this.startStopButton.innerText = 'Pause';
            } else {
                // Start game
                this.coreGameCoordinator.startGame();
                this.gameInitializer.onlyMetronome = false;
            }
        } else {
            this.gameInitializer.gameManuallyPaused = true;
            this.coreGameCoordinator.stopGame();
            // Hide game elements and display instructions (not inside stopGame() for when level is accomplished)
            this.gameInitializer.hideGameElementsAndDisplayInstructions();
        }
    }
}