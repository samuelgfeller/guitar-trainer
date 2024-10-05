import {themes} from "../../../components/configuration/config-data.js?v=2.4.4";
import {ThemeSetter} from "../../../components/configuration/theme-setter.js?v=2.4.4";

export class SettingsInitializer {


    addSettingsBodyHtml() {
        document.querySelector('#header-center-container').innerHTML = `<p>Guitar Trainer</p>`;
        document.querySelector('#game-start-instruction').innerHTML = `
        <h3>Available game modes</h3>
                <div id="landing-page-game-mode-choice">
                     <!--All game mode buttons inside a div with a description and the id of the real button 
                     as data attribute-->
                     <div>
                        <button class='stay-active-button' data-id="metronome-game-mode">
                           <img src="src/assets/images/metronome-icon.svg" class="button-icon">
                        </button>
                        <span>Metronome and exercises</span>
                     </div>
                     <div>
                        <button class='stay-active-button' data-id="fretboard-note-game-mode">
                            <img src="src/assets/images/guitar-fretboard-icon.svg" class="button-icon">
                        </button>
                        <span>Play given note on fretboard</span>
                     </div>
                     <div>
                        <button class='stay-active-button' data-id="note-in-key-game-mode">
                            <img src="src/assets/images/key-icon.png" class="button-icon">
                        </button>
                        <span>Play given note position in key</span>
                     </div>
                </div>
            <div id="theme-selection"><h3>Theme</h3>
                <div class="theme-selection-grid">
                    ${this.getThemeSelectionHtml()}
            </div>
            </div>
                <p id="footer-text">Project <a href="https://github.com/samuelgfeller/guitar-trainer" target="_blank">source code</a> 
                &nbsp|&nbsp <span id="clear-localstorage-button">Clear localstorage</span></p>
        `;
        this.addLandingPageGameModeChoiceEventListeners();
        document.getElementById('clear-localstorage-button').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear local storage? All settings and selected options will be lost.')) {
                localStorage.clear();
                location.reload();
            }
        });
    }

    addLandingPageGameModeChoiceEventListeners() {
        document.querySelectorAll('#landing-page-game-mode-choice > div')
            .forEach((gameModeDiv) => {
                gameModeDiv.addEventListener('click', (e) => {
                    document.getElementById(gameModeDiv.querySelector('.stay-active-button').dataset.id).click();
                });
            });
    }

    getThemeSelectionHtml() {
        let themeSelectionHtml = '';

        for (const theme in themes) {
            for (const [accentColorName, accentColorRgb] of Object.entries(themes[theme]['accent-color'])) {
                themeSelectionHtml += `
        <div class="theme-setting-option" data-theme="${theme}" data-color-rgb="${accentColorRgb}">
            <div class="color-preview" style="background: linear-gradient(-45deg, rgb(${accentColorRgb}) 50%, ${themes[theme]['background-color']} 50%)"></div>
            <span>${accentColorName.charAt(0).toUpperCase() + accentColorName.slice(1)}</span>
        </div>`;
            }
        }
        return themeSelectionHtml;
    }

    addThemeSelectionEventListeners() {
        document.querySelectorAll('.theme-setting-option').forEach((themeSettingOption) => {
            themeSettingOption.addEventListener('click', this.setThemeEventHandler);
        });
    }

    setThemeEventHandler(e) {
        let theme = e.target.closest('.theme-setting-option').dataset.theme;
        let color = e.target.closest('.theme-setting-option').dataset.colorRgb;

        ThemeSetter.setTheme(theme, color);

        // Save the theme in local storage
        localStorage.setItem('theme', theme);
        localStorage.setItem('accent-color', color);
    }

    removeThemeSelectionEventListeners() {
        document.querySelectorAll('.theme-setting-option').forEach((themeSettingOption) => {
            themeSettingOption.removeEventListener('click', this.setThemeEventHandler);
        });
    }
}