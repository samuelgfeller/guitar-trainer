import {GameProgressVisualizer} from "../game-progress/game-progress-visualizer.js?v=2.2.1";

export class GameConfigurationManager {

    static toggleSettingsExpand() {
        if (document.getElementById('config-div').classList.contains('expanded')) {
            document.getElementById('settings-toggle-btn').src = 'src/assets/images/settings/bars-left-icon.svg';
        }else{
            document.getElementById('settings-toggle-btn').src = 'src/assets/images/settings/bars-right-icon.svg';
        }

        document.getElementById('config-div').classList.toggle('expanded');
        // Scroll to the top
        window.scrollTo(0, 0);
    }

    static addSettingsCloseEventListenerOnOutsideClick() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#config-div') && !e.target.closest('#settings-toggle-btn') && !e.target.closest('#modal')) {
                this.closeConfigCollapsible();
            }
        });
    }
    static closeConfigCollapsible(){
        document.getElementById('config-div').classList.remove('expanded');
        document.getElementById('settings-toggle-btn').src = 'src/assets/images/settings/bars-left-icon.svg';
    }

    static initGameModeSelection() {
        const gameModeSelection = document.querySelector('#game-mode-selection');
        const previouslySelectedGameModeId = localStorage.getItem('game-mode');
        // Check the input of the game mode from local storage
        if (previouslySelectedGameModeId) {
            document.querySelector(`#${previouslySelectedGameModeId}`)?.classList.add('selected');
        }else{
            // If there is no previously selected game mode, select settings mode
            document.querySelector('#settings-mode').classList.add('selected');
        }
        // If one of the game mode radio buttons is checked, the other should be unchecked
        for (const gameMode of gameModeSelection.querySelectorAll('button')) {
            gameMode.addEventListener('click', () => {
                // When one game mode is selected, uncheck all game modes
                gameModeSelection.querySelector('.selected')?.classList.remove('selected');
                // Add selected class to the clicked game mode
                gameMode.classList.add('selected');
                localStorage.setItem('game-mode', gameMode.id);
                // GameConfigurationOptionVisualHandler.updateModeOptions(gameMode.id);
                // If there was a game running, stop it
                document.dispatchEvent(new Event('game-stop'));
                // Fire game mode change event to init new game mode
                document.dispatchEvent(new Event('game-mode-change'));
                // Hide progress
                GameProgressVisualizer.hideProgress();
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

}