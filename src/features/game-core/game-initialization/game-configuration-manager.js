import {GameProgressVisualizer} from "../game-progress/game-progress-visualizer.js?v=1.3.1";

export class GameConfigurationManager {

    static toggleSettingsExpand() {
        document.getElementById('config-div').classList.toggle('expanded');
        // Scroll to the top
        window.scrollTo(0, 0);
    }

    static initGameModeSelection() {
        const gameModeSelection = document.querySelector('#game-mode-selection');
        const previouslySelectedGameModeId = localStorage.getItem('game-mode');
        // Check the input of the game mode from local storage
        if (previouslySelectedGameModeId) {
            document.querySelector(`#${previouslySelectedGameModeId} input`).checked = true;
        }
        // If one of the game mode radio buttons is checked, the other should be unchecked
        for (const gameMode of gameModeSelection.querySelectorAll('label')) {
            gameMode.addEventListener('change', () => {
                // When one game mode is selected, uncheck all game modes
                for (const gameModeLabel of gameModeSelection.querySelectorAll('label')) {
                    gameModeLabel.querySelector('input').checked = false;
                }
                // The radio button that was clicked should be checked
                gameMode.querySelector('input').checked = true;
                localStorage.setItem('game-mode', gameMode.id);
                // GameConfigurationOptionVisualHandler.updateModeOptions(gameMode.id);
                // If there was a game running, stop it
                document.dispatchEvent(new Event('game-stop'));
                // Fire game mode change event to init new game mode
                document.dispatchEvent(new Event('game-mode-change'));
                // Hide progress
                GameProgressVisualizer.resetProgress();
            });
        }
    }

    /**
     * Sets up game mode options based on the user's previous choices stored in the local storage.
     * And if input is changed, it saves the new value in the local storage.
     */
    static initGameModeOptions(optionsContainerId = 'game-mode-options') {
        const gameModeOptions = document.getElementById(optionsContainerId);
        // Toggle visibility of game mode options title
        if (gameModeOptions.children.length === 0) {
            document.querySelector('.options-title-span').style.display = 'none';
            return;
        } else {
            document.querySelector('.options-title-span').style.display = null;
        }

        this.setupGameModeOptionsStateAndValue(gameModeOptions.children);
    }

    /**
     * Sets up game mode options based on the user's previous choices stored in the local storage.
     * And if input is changed, it saves the new value in the local storage.
     */
    static setupGameModeOptionsStateAndValue(gameModeOptions) {
        // Loop over game mode options (children of #game-mode-options) that may contain inputs of different types
        for (const gameModeOption of gameModeOptions) {
            // Get the inputs of type checkbox
            const gameModeCheckboxInput = gameModeOption.querySelector('input[type=checkbox]');
            if (gameModeCheckboxInput) {
                // Set the input checked state with the one from local storage
                if ((localStorage.getItem(gameModeOption.id) ?? '0') === '1') {
                    gameModeCheckboxInput.checked = true;
                }
                // Init the event listener that saves the value when checkbox input is changed
                gameModeCheckboxInput.addEventListener('change', () => {
                    localStorage.setItem(gameModeOption.id, gameModeCheckboxInput.checked ? '1' : '0');
                });
            }
            // Set the range slider value with the one from local storage
            const gameModeRangeInput = gameModeOption.querySelector('input[type=range]');
            if (gameModeRangeInput) {
                // Set the range input value to the one from local storage
                if (localStorage.getItem(gameModeOption.id)) {
                    gameModeRangeInput.value = localStorage.getItem(gameModeOption.id);
                }
                // Set up the event listener that saves the value when range value is changed
                gameModeRangeInput.addEventListener('input', () => {
                    localStorage.setItem(gameModeOption.id, gameModeRangeInput.value);
                });
            }
            // If options of other types are added, they have to be initialized like the ones above here
        }
    }

    /**
     * Used by different initializers to show the bpm input
     */
    static showBpmInput() {
        document.querySelector('#header-center-container').innerHTML =
            `<img src="src/assets/images/arrow-left-icon.svg" alt="<" id="lower-bpm-btn" class="icon lvl-icon">
             <input type="number" min="0" value="60" id="bpm-input">
             <img src="src/assets/images/arrow-right-icon.svg" alt="<" id="higher-bpm-input" class="icon lvl-icon">`;

        // Add event listeners to step up or down input
        const bpmInput = document.querySelector('#bpm-input');
        // stepUp and stepDown on input type number don't automatically fire the "change" event
        const changeEvent = new Event('change');
        document.getElementById('higher-bpm-input').addEventListener('click', () => {
            bpmInput.stepUp();
            bpmInput.dispatchEvent(changeEvent);
        });
        document.getElementById('lower-bpm-btn').addEventListener('click', () => {
            bpmInput.stepDown();
            bpmInput.dispatchEvent(changeEvent);
        });
    }
}