import {themes} from "./config-data.js?v=2.4.1";

export class ThemeSetter {
    static setThemeFromLocalStorage() {
        if (!localStorage.getItem('theme') || !localStorage.getItem('accent-color')){
            localStorage.setItem('theme', 'dark');
            localStorage.setItem('accent-color', themes['dark']['accent-color']['saddlebrown']);
        }
        this.setTheme(localStorage.getItem('theme'), localStorage.getItem('accent-color'));
    }

    static setTheme(theme, accentColorRgb) {
        const rgbArr = accentColorRgb.split(',');

        document.documentElement.style.setProperty('--accent-color', `rgb(${accentColorRgb})`);
        document.documentElement.style.setProperty('--r', rgbArr[0].trim());
        document.documentElement.style.setProperty('--g', rgbArr[1].trim());
        document.documentElement.style.setProperty('--b', rgbArr[2].trim());
        document.documentElement.style.setProperty('--background-color', themes[theme]['background-color']);
        document.documentElement.style.setProperty('--secondary-text-color', themes[theme]['secondary-text-color']);
        document.documentElement.style.setProperty('--primary-text-color', themes[theme]['primary-text-color']);
        document.documentElement.style.setProperty('--icon-filter', themes[theme]['icon-filter']);
        document.documentElement.style.setProperty('--modal-background-color', themes[theme]['modal-background-color']);
    }
}