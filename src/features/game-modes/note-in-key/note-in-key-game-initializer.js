import {NoteInKeyGameCoordinator} from "./note-in-key-game-coordinator.js?v=1.1";
import {LevelUpVisualizer} from "../../game-core/game-ui/level-up-visualizer.js?v=1.1";

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
            `Practice diatonic notes in any key`;
        document.querySelector('#game-instruction-text').innerHTML = `
            <p>A random string and major key will be generated and displayed.</p>
            <p>The note on the given string will be the note number 1 of the key.</p>
            <p>The goal is to play the note number diatonic to the key, on the given string.</p>
            <p>For example, if the key is C, the note number 4 is F. If the key is G, number 4 is C. <br>
            Refer to the fretboard roadmap below.</p>
            <p>Upon correctly playing the note, a new string and note number will be displayed.<p>
            <p>After successfully playing 20 notes, a new key is suggested. The key can also be changed anytime
            with the "reload" button.</p>
            <p>In the settings icon, you can adjust the difficulty among three levels that affect the 
            distance between the requested notes and note number 1 on the fretboard.</p>
            <p>Click "Play" to start or resume the game or double-tap this instruction.</p>
            <h3>Roadmaps</h3>
            <p>Low E string roadmap for the G key 
            (<a href="https://youtu.be/dYs_0Rx3CTI?si=ez3lOjaeHTXl8W-2&t=450">Source</a>):            
            <img src="https://i.imgur.com/fXpX6Uh.png" alt="https://youtu.be/dYs_0Rx3CTI?si=ez3lOjaeHTXl8W-2&t=450"></p>
            <p>A string roadmap for the D key 
            (<a href="https://youtu.be/dYs_0Rx3CTI?si=RGa0pX5z24TSZ2dH&t=623">Source</a>):            
            <img src="https://i.imgur.com/x3ROkRE.png" alt="https://youtu.be/dYs_0Rx3CTI?si=RGa0pX5z24TSZ2dH&t=623"></p>
            <p>I also recommend watching Paul Davids 
            <a href="https://www.youtube.com/watch?v=-YkiaALRb54&list=PLFT94I4UzgTMTeiGy4qn4bWzWAu6mHypz">
            Music Theory episodes</a>.</p>
            <p>And <a href="https://www.youtube.com/watch?v=kmAK4tRmLec">this video</a>
            on how to find the chords to any song on guitar from Andrew Clarke.</p>
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