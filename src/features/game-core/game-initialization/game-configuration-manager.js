import {GameElementsVisualizer} from "../game-ui/game-elements-visualizer.js";
import {GameConfigurationOptionVisualHandler} from "../game-ui/game-configuration-option-visual-handler.js";

export class GameConfigurationManager {

    static toggleSettingsExpand() {
        document.getElementById('config-div').classList.toggle('expanded');
    }

    static storeAndLoadConfigValuesInLocalStorage() {
        // Init all config input switches (game modes and options)
        const settingSwitches = document.querySelectorAll('#config-div label');
        for (const setting of settingSwitches) {
            const input = setting.querySelector('input');
            // Event listener to save setting switch in localstorage when changed
            setting.addEventListener('change', () => {
                this.storeItemInLocalStorage(setting.id, input.checked);
                // If checked checkbox is a game mode, hide or display, according options
                if (setting.id.includes('game-mode')) {
                    GameConfigurationOptionVisualHandler.updateModeOptions(setting.id);
                    // If there was a game running, stop it
                    document.dispatchEvent(new Event('game-stop'));
                    // Fire game mode change event to init new game mode
                    document.dispatchEvent(new Event('game-mode-change'));
                }
            });
            // Set the input checked state with the one from local storage
            if ((localStorage.getItem(setting.id) ?? '0') === '1') {
                input.checked = true;
            }
        }

        // Only one game mode can be selected at a time
        this.setupSingleChoiceCheckbox(document.querySelectorAll('#game-mode-selection label'));

        // Init all config input range sliders
        const settingRangeSliders = document.querySelectorAll('#config-div input[type=range]');
        for (const setting of settingRangeSliders) {
            // Event listener to save setting range slider in localstorage when changed
            setting.addEventListener('change', () => {
                this.storeItemInLocalStorage(setting.id, setting.value);
            });
            // Set the input value with the one from local storage
            setting.value = localStorage.getItem(setting.id) ?? setting.value;
        }

        // Load game mode options on page load
        const selectedGameMode = document.querySelector('#game-mode-selection label input:checked')
        if (selectedGameMode) {
            GameConfigurationOptionVisualHandler.updateModeOptions(selectedGameMode.closest('label').id);
        }
    }

    /**
     * @param {string} itemId
     * @param {boolean|string} value
     */
    static storeItemInLocalStorage(itemId, value) {
        if (typeof value !== 'string') {
            localStorage.setItem(itemId, value ? '1' : '0');
        } else {
            localStorage.setItem(itemId, value);
        }
    }

    /**
     * @param labelCollection Input checkboxes are inside labels
     */
    static setupSingleChoiceCheckbox(labelCollection) {
        // If one of the game mode radio buttons is checked, the other should be unchecked
        for (const label of labelCollection) {
            label.addEventListener('change', () => {
                for (const gameModeLabel of labelCollection) {
                    // Uncheck all game mode radio buttons
                    gameModeLabel.querySelector('input').checked = false;
                    this.storeItemInLocalStorage(gameModeLabel.id, '0');
                }
                // The radio button that was clicked should be checked
                label.querySelector('input').checked = true;
                this.storeItemInLocalStorage(label.id, '1');
            });
        }
    }

    static initBpmInputChangeListener(coreGameCoordinator) {
        const bpmInput = document.querySelector('#bpm-input');

        // Set bpm input to the current level which is always one higher than the last completed or the default value
        // bpmInput.value = GameLevelTracker.getCurrentLevel();

        // Level change event listener and handler
        bpmInput.addEventListener('change', (e) => {
            coreGameCoordinator.stopGame();
            GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
            // Reset game progress in the form of an event to avoid having to need game progress instance here
            document.dispatchEvent(new Event('reset-game-progress'));
            document.querySelector('#start-stop-btn').innerText = 'Play';
        });

        // stepUp and stepDown on input type number don't automatically fire the "change" event
        const changeEvent = new Event('change');
        document.getElementById('next-lvl-btn').addEventListener('click', () => {
            bpmInput.stepUp();
            bpmInput.dispatchEvent(changeEvent);
        });
        document.getElementById('previous-lvl-btn').addEventListener('click', () => {
            bpmInput.stepDown();
            bpmInput.dispatchEvent(changeEvent);
        });
    }

}