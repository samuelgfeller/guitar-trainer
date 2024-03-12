import {
    GameConfigurationManager
} from "../../features/game-core/game-initialization/game-configuration-manager.js?v=2.3.3";

export class MicSensitivityOption {
    static addMicSensitivityOption() {
        if (!document.getElementById('mic-sensitivity-option-title')
            && !document.getElementById('mic-sensitivity-option')) {
            document.querySelector('#config-inner-div').insertAdjacentHTML('beforeend', `
            <details>
                <summary class="normal-font-size label-text options-title-span" id="mic-sensitivity-option-title">
                    Mic sensitivity</summary>
            
            <div id="mic-sensitivity-option">
                <span>Low</span>
                <input type="range" min="1" max="70" step="1" value="15" id="sensitivity-range-slider"/>
                <span>High</span>
            </div>
            </details>
            `);
            GameConfigurationManager.setupGameModeOptionsStateAndValue([document.querySelector('#mic-sensitivity-option')]);
        }
    }

    static removeMicSensitivityOption() {
        document.querySelector('#mic-sensitivity-option-title')?.closest('details')?.remove();
        document.getElementById('mic-sensitivity-option-title')?.remove();
        document.getElementById('mic-sensitivity-option')?.remove();
    }
}