import {GameStartAndStopper} from "./game-start-and-stopper.js?v=0.6";
import {GameElementsVisualizer} from "../game-ui/game-elements-visualizer.js?v=0.6";
import {GameConfigurationManager} from "../game-ui/game-configuration-manager.js";

export class GameInitializer {
    constructor() {
        this.gameStartAndStopper = new GameStartAndStopper(this);
        this.startStopButton = document.querySelector('#start-stop-btn');
        // When only metronome should be played and not the whole game (when sound on before pressing start)
        this.onlyMetronome = false;
        this.gameManuallyPaused = false;
    }

    initGame(){
        // Init start stop button
        this.initGameStartStopEventListeners();
        // Init bpm input listeners
        GameConfigurationManager.initBpmInputChangeListener(this.gameStartAndStopper.coreGameCoordinator);
        // Init pause / resume game on visibility change
        this.initPauseAndResumeGameOnVisibilityChange();
        this.initSettings();
        // Init start stop
    }

    /**
     * Init behaviour of configuration (settings) area
     */
    initSettings() {
        // Settings toggle button
        document.getElementById('settings-toggle-btn').addEventListener('click', (e) => {
            GameConfigurationManager.toggleSettingsExpand();
        });

        GameConfigurationManager.storeAndLoadConfigValuesInLocalStorage();
    }

    initGameStartStopEventListeners() {
        // Start / stop button event listener
        this.startStopButton.addEventListener('click', this.gameStartAndStopper.startStopGame.bind(this.gameStartAndStopper));
        // Self has to be used in the following as we loose the "this" context in the event listener anonymous func
        let self = this;
        // Start on double click anywhere in the body
        document.addEventListener('dblclick', function (e) {
            // Check if the target is <body> or if a parent of the target is <main>
            if (e.target === document.body || e.target.closest('main')) {
                self.gameStartAndStopper.startStopGame();
            }
        });
        // Start with Enter key press on bpm input
        document.querySelector('#bpm-input').addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.gameStartAndStopper.startStopGame();
            }
        });
    }

    /**
     * When user quits the website (visibility change) the game should be stopped
     * and screen wake lock released. On return, game should be resumed (after countdown)
     * and wake lock requested.
     */
    initPauseAndResumeGameOnVisibilityChange() {
        let countdownInterval;
        document.addEventListener('visibilitychange', (e) => {
            // In case visibility change event was fired multiple times before 3s countdown
            clearInterval(countdownInterval);
            document.getElementById('modal')?.remove();
            // If not only metronome is playing (meaning the normal game)
            if (this.onlyMetronome !== true && this.gameManuallyPaused === false) {
                // When visible after a visibility change event, start game after 3s and request wake lock
                if (document.visibilityState === 'visible') {
                    // Display time before restart modal box
                    let htmlString = `<div id="modal">
                          <div id="modal-box">
                          <div id="modal-header">Time before restart</div>
                          <div id="modal-body"><h1 id="countdown">3s</h1></div>
                          </div></div>`;
                    // Insert at end of page content which is in <main></main>
                    document.getElementById('score').insertAdjacentHTML('beforeend', htmlString);
                    let secondsRemainingUntilStart = 3;
                    countdownInterval = setInterval(() => {
                        secondsRemainingUntilStart--;
                        if (secondsRemainingUntilStart > 0) {
                            document.getElementById('countdown').innerText = secondsRemainingUntilStart + 's';
                        } else {
                            document.getElementById('modal').remove();
                            this.gameStartAndStopper.coreGameCoordinator.startGame();
                            clearInterval(countdownInterval);
                        }
                    }, 1000);
                } else {
                    // When not visible after event, pause game and disable wake lock
                    this.gameStartAndStopper.coreGameCoordinator.stopGame();
                    GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
                }
            }
        });
    }

    hideGameElementsAndDisplayInstructions() {
        document.querySelectorAll('.visible-when-game-on').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelector('#game-start-instruction').style.display = 'block';
    }

}