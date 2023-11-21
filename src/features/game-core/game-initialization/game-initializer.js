import {GameElementsVisualizer} from "../game-ui/game-elements-visualizer.js?v=1.1";
import {GameConfigurationManager} from "./game-configuration-manager.js?v=1.1";
import {CoreGameCoordinationInitializer} from "./core-game-coordination-initializer.js?v=1.1";

export class GameInitializer {
    constructor() {
        this.coreGameCoordinationInitializer = new CoreGameCoordinationInitializer(this);
        this.startStopButton = document.querySelector('#start-stop-btn');
        // When only metronome should be played and not the whole game (when sound on before pressing start)
        this.onlyMetronome = false;
        this.gameManuallyPaused = false;
    }

    /**
     * First entry point of the game when the game is loaded
     */
    initGame(){
        // Init start stop button
        this.initGameStartStopEventListeners();

        // Init pause / resume game on visibility change
        this.initPauseAndResumeGameOnVisibilityChange();
        // Init settings toggle btn
        document.getElementById('settings-toggle-btn').addEventListener('click', (e) => {
                    GameConfigurationManager.toggleSettingsExpand();
                });
        // Init game mode selection
        GameConfigurationManager.initGameModeSelection();

        // Set the correct game coordinator for the selected game mode (has to be after initGameModeSelection)
        this.coreGameCoordinationInitializer.setCorrectAndInitGameCoordinator();

        document.addEventListener('game-mode-change', (e) => {
            this.coreGameCoordinationInitializer.setCorrectAndInitGameCoordinator();
        });
    }

    initGameStartStopEventListeners() {
        // Start / stop button event listener
        this.startStopButton.addEventListener('click', this.coreGameCoordinationInitializer.startOrStopButtonActionHandler.bind(this.coreGameCoordinationInitializer));
        // Self has to be used in the following as we loose the "this" context in the event listener anonymous func
        let self = this;
        // Start on double click anywhere in the body

        document.addEventListener('dblclick', function (e) {
            // Check if the target is <body> or if a parent of the target is <main> (to avoid catching dblclicks in
            // header, but only if the modal is not open)
            if ((e.target === document.body || e.target.closest('main'))
                && (e.target.id !== 'modal' && !e.target.closest('#modal'))) {
                self.coreGameCoordinationInitializer.startOrStopButtonActionHandler();
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
                          <div id="modal-body"><h1 id="countdown">2s</h1></div>
                          </div></div>`;
                    // Insert at end of page content which is in <main></main>
                    document.getElementById('score').insertAdjacentHTML('beforeend', htmlString);
                    let secondsRemainingUntilStart = 2;
                    countdownInterval = setInterval(() => {
                        secondsRemainingUntilStart--;
                        if (secondsRemainingUntilStart > 0) {
                            document.getElementById('countdown').innerText = secondsRemainingUntilStart + 's';
                        } else {
                            document.getElementById('modal').remove();
                            this.coreGameCoordinationInitializer.coreGameCoordinator.startGame();
                            clearInterval(countdownInterval);
                        }
                    }, 1000);
                } else {
                    // When not visible after event, pause game and disable wake lock
                    this.coreGameCoordinationInitializer.coreGameCoordinator.stopGame();
                    GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
                }
            }
        });
    }
}