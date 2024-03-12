import {GameConfigurationManager} from "./game-configuration-manager.js?v=2.4.0";
import {CoreGameCoordinationInitializer} from "./core-game-coordination-initializer.js?v=2.4.0";
import {VisibilityChangeHandler} from "./visibility-change-handler.js?v=2.4.0";
import {GameElementsVisualizer} from "../game-ui/game-elements-visualizer.js?v=2.4.0";
import {ThemeSetter} from "../../../components/configuration/theme-setter.js?v=2.4.0";

export class GameInitializer {
    constructor() {
        this.coreGameCoordinationInitializer = new CoreGameCoordinationInitializer(this);
    }

    /**
     * First entry point of the game when the game is loaded
     */
    initGame() {
        // Init start stop button
        this.initGameStartStopBtnEventListeners();

        ThemeSetter.setThemeFromLocalStorage();

        // Init pause / resume game on visibility change
        new VisibilityChangeHandler(this.coreGameCoordinationInitializer.coreGameCoordinator).initPauseAndResumeGameOnVisibilityChange();
        // Init settings toggle btn
        document.getElementById('settings-toggle-btn').addEventListener('click', (e) => {
            GameConfigurationManager.toggleSettingsExpand();
        });
        // When the user clicks outside the settings area, the options should close
        GameConfigurationManager.addSettingsCloseEventListenerOnOutsideClick();
        // Init game mode selection
        GameConfigurationManager.initGameModeSelection();

        // Set the correct game coordinator for the selected game mode (has to be after initGameModeSelection)
        this.coreGameCoordinationInitializer.setCorrectAndInitGameCoordinator();

        document.addEventListener('game-mode-change', (e) => {
            // Remove game mode specific elements / reset for new game mode
            if (this.coreGameCoordinationInitializer.coreGameCoordinator.gameCoordinator !== null) {
                this.coreGameCoordinationInitializer.coreGameCoordinator.gameCoordinator?.destroy();
                // Reset game area
                GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
            }
            this.coreGameCoordinationInitializer.setCorrectAndInitGameCoordinator();
        });
    }

    initGameStartStopBtnEventListeners() {
        // Start / stop button event listener
        document.querySelector('#start-stop-btn').addEventListener('click',
            this.coreGameCoordinationInitializer.startOrStopButtonActionHandler.bind(this.coreGameCoordinationInitializer)
        );
        // Self has to be used in the following as we loose the "this" context in the event listener anonymous func
        let self = this;
        // Start on double click anywhere in the body

        document.addEventListener('dblclick', function (e) {
            // Check if the target is <body> or if a parent of the target is <main> (to avoid catching dblclicks in
            // header, but only if the modal is not open)
            if ((e.target === document.body || e.target.closest('main'))
                && (e.target.id !== 'modal' && !e.target.closest('#modal') && e.target.nodeName !== 'INPUT')
                && !e.target.closest('#virtual-fretboard')) {
                self.coreGameCoordinationInitializer.startOrStopButtonActionHandler();
            }
        });
    }
}