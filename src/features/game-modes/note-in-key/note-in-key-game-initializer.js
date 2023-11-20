import {NoteInKeyGameCoordinator} from "./note-in-key-game-coordinator.js?v=1.0";
import {LevelUpVisualizer} from "../../game-core/game-ui/level-up-visualizer.js?v=1.0";

export class NoteInKeyGameInitializer {

    /**
     * Setup and destroy note in key game
     *
     * @param {NoteInKeyGameCoordinator} noteInKeyGameCoordinator
     */
    constructor(noteInKeyGameCoordinator) {
        this.noteInKeyGameCoordinator = noteInKeyGameCoordinator;
        // Needs to be in an attribute like this to have .bind(this) and be able to remove event listener
        this.levelUpEventHandler = this.levelUp.bind(this);
    }

    initNoteInKeyGame(){
        // Level up event listener
        document.addEventListener('leveled-up', this.levelUpEventHandler);
    }

    addHtmlComponents() {
        // Add game mode options (have to be added before the other initializations as they might depend on options)
        document.querySelector('#game-mode-options').innerHTML = `
                    <div id="difficulty-range-slider-container" class="option-for-game-mode">
                        <input type='range' min='1' max='3' value='1' step='1'
                               list="level-options" id="difficulty-range-slider"/>
                        <datalist id="level-options">
                            <option value="1" label="Lvl 1"></option>
                            <option value="2" label="Lvl 2"></option>
                            <option value="3" label="Lvl 3"></option>
                        </datalist>
                    </div>`;

        //
        document.querySelector('#header-center-container').innerHTML =
            `<img src="src/assets/images/reload-icon.svg" id="reload-key-btn"> Reload key`;


        // Has to be added before key and string are reloaded as they depend on this div existence
        document.querySelector('#game-progress-div').insertAdjacentHTML('afterend',
            `<span id="current-key-and-string"></span>`);

        const reloadKeyButton = document.getElementById('header-center-container');
        reloadKeyButton.style.cursor = "pointer";
        // Reload key button event listener
        reloadKeyButton.addEventListener('click', this.reloadKeyAndStringEventHandler.bind(this));

        // Game instructions
        document.querySelector('#game-start-instruction').querySelector('h3').innerHTML =
            `Play notes in key practice`;
        document.querySelector('#game-instruction-text').innerHTML = `
            <p>A random string and key will be generated and displayed.</p>
            <p>The note on the given string will be the note number 1 of the key.</p>
            <p>The goal is to play the given note number diatonic to the key, on the given string.</p>
            <p>For example, if the key is C, the note number 4 will be F.</p>
            <p>Each time you play the note correctly, a new string and note number will be displayed.<p>
            <p>After 20 correctly played notes, a new key is suggested, but it can be reloaded with the "reload" button</p>
            <p>On the setting icon, the difficulty can be changed between three levels. They affect
            the distance between the requested notes on the fretboard.</p>
            <p>Click "Play to start or resume the game or double-click this instruction.</p>
            `;
    }
    reloadKeyAndStringEventHandler() {
        // Pause game
        document.dispatchEvent(new Event('game-stop'));
        // Load new key on string
        this.noteInKeyGameCoordinator.reloadKeyAndString();
        // Resume the game with the new key
        document.dispatchEvent(new Event('game-start'));
    }

    destroy() {
        // Remove contents from the center of the header
        document.querySelector('#header-center-container').innerHTML = '';

        document.removeEventListener('leveled-up', this.levelUpEventHandler);
        document.removeEventListener('reset-game-progress',
        this.noteInKeyGameCoordinator.noteDisplayer.resetGameProgressHandler);
    }

    levelUp() {
        document.querySelector('#current-key-and-string').style.display = 'block';

        // Fire game-stop event and display modal
        LevelUpVisualizer.displayLeveledUpModal(
            'Key practice completed!',
            'Go to next key',
            this.goToNextKey.bind(this),
            this.restartKey);
    }

    goToNextKey(){
        console.log('goToNextKey');
        this.reloadKeyAndStringEventHandler();
    }
    restartKey(){
        document.dispatchEvent(new Event('reset-game-progress'));
        document.dispatchEvent(new Event('game-start'));
    }
}