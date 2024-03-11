import {themes} from "../../../components/configuration/config-data.js?v=2.3.1";
import {ThemeSetter} from "../../../components/configuration/theme-setter.js?v=2.3.1";

export class SettingsInitializer {


    addSettingsBodyHtml() {
        document.querySelector('#header-center-container').innerHTML = `<p>Guitar Trainer</p>`;
        document.querySelector('#game-start-instruction').innerHTML = `
    <details open>
                <summary><h3>Instructions</h3></summary>
                <div id="game-instruction-text">
                    <p>Click on the settings icon in the header to select a game mode.</p>
                    <p><b>Available game modes: </b></p>
                    <ol style="list-style-position: inside;">
                        <li>Plain metronome with exercises
                        <li>Play given note on fretboard
                        <li>Play note number in the given key
                    </ol>
                    <p>You have to allow microphone access when it is asked so that the game can work.
                        It will detect what note you're playing.</p>
                </div>
            </details>
            <div id="theme-selection"><h3>Theme selection</h3>
                <div class="theme-selection-grid">
                    ${this.getThemeSelectionHtml()}
    </div>
    </div>`;
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