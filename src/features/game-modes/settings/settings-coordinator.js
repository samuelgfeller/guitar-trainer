import {SettingsInitializer} from "./settings-initializer.js?v=2.2.2";

export class SettingsCoordinator {

    constructor() {
        this.initializer = new SettingsInitializer();
        this.initializer.addSettingsBodyHtml();
        this.initializer.addThemeSelectionEventListeners();
    }

    play() {

    }

    stop() {

    }

    destroy() {
        document.querySelector('#theme-selection').remove();
        this.initializer.removeThemeSelectionEventListeners();
    }
}