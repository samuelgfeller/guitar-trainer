import {NoteInKeyGameCoordinator} from "./note-in-key-game-coordinator.js?v=1.0.2";
import {LevelUpVisualizer} from "../../game-core/game-ui/level-up-visualizer.js?v=1.0.2";
import {GameConfigurationManager} from "../../game-core/game-initialization/game-configuration-manager.js?v=1.0.2";
import {GameProgressVisualizer} from "../../game-core/game-progress/game-progress-visualizer.js?v=1.0.2";
import {NoteInKeyGenerator} from "./note-in-key-generator.js?v=1.0.2";
import {PracticeNoteDisplayer} from "../../practice-note-combination/practice-note-displayer.js?v=1.0.2";

export class NoteInKeyGameInitializer {

    possibleKeysOnStrings = {
        // String name: [possible keys for string]
        'E': ['E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'C'],
        'A': ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F'],
    };
    possibleKeysOnStringsFullFretboard = {
        // String name: [possible keys for string]
        'E': ['E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯'],
        'A': ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯'],
    };


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

    initNoteInKeyGame() {
        // Add html components
        this.addHtmlComponents();
        // Init game mode options here as the option value is needed for the next initialization steps
        GameConfigurationManager.initGameModeOptions();

        // Init game components
        // Note in key generator initialized here in case the user clicks "pause" and wants to continue the game

        this.noteInKeyGameCoordinator.noteInKeyGenerator = new NoteInKeyGenerator();
        this.setPossibleKeysOnStrings();

        // Instantiate object with note displayer function that will be called when a new note should be displayed
        // after a correct one has been played.
        this.noteInKeyGameCoordinator.noteDisplayer = new PracticeNoteDisplayer(this.noteInKeyGameCoordinator.noteInKeyGenerator);
        // Has to be reloaded added after html component range slider as its value is needed
        this.noteInKeyGameCoordinator.reloadKeyAndString();

        // Level up event listener
        document.addEventListener('leveled-up', this.levelUpEventHandler);
    }


    reloadKeyAndStringEventHandler() {
        const gameIsRunning = this.noteInKeyGameCoordinator.gameIsRunning;
        // Pause game
        document.dispatchEvent(new Event('game-stop'));
        // Load new key on string
        this.noteInKeyGameCoordinator.reloadKeyAndString();

        if (gameIsRunning) {
            // Resume the game with the new key
            document.dispatchEvent(new Event('game-start'));
        } else{
            // If the game was not running, reset progress
            // Pause game, display instructions, hide current string and key and hide game progress
            // GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
            // document.querySelector('#current-key-and-string').style.display = 'none';
            GameProgressVisualizer.resetProgress();
        }
    }

    destroy() {
        // Remove contents from the center of the header
        document.querySelector('#header-center-container').innerHTML = '';

        document.removeEventListener('leveled-up', this.levelUpEventHandler);
        document.removeEventListener('reset-game-progress',
            this.noteInKeyGameCoordinator.noteDisplayer.resetGameProgressHandler);

        // Event listeners that were tied to html components don't need to be removed as the components are
        // removed or replaced when the game mode is changed
    }

    levelUp() {
        document.querySelector('#current-key-and-string').style.display = 'block';

        // Fire game-stop event and display modal
        LevelUpVisualizer.displayLeveledUpModal(
            'Practice completed!',
            'Go to next key',
            this.goToNextKey.bind(this),
            this.restartKey);
    }

    goToNextKey() {
        // Set game is running so that it starts automatically, the new key is loaded
        this.noteInKeyGameCoordinator.gameIsRunning = true;
        this.reloadKeyAndStringEventHandler();
    }

    restartKey() {
        document.dispatchEvent(new Event('reset-game-progress'));
        document.dispatchEvent(new Event('game-start'));
    }

    setPossibleKeysOnStrings() {
        this.noteInKeyGameCoordinator.noteInKeyGenerator.possibleStringsAndKeys =
            document.querySelector('#note-in-key-entire-fretboard-option input')?.checked ?
                this.possibleKeysOnStringsFullFretboard : this.possibleKeysOnStrings;
    }

    /**
     * Add html components and their event listeners for note in key game
     */
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
                    </div>
                    <label class='checkbox-button option-for-game-mode' id="note-in-key-entire-fretboard-option">
                        <input type='checkbox'>
                        <!--<span class="normal-font-size"></span>-->
                        <img src="src/assets/images/entire-fretboard-icon.svg" class="button-icon">
                    </label>`;
        // Add difficulty range slider event listener
        document.querySelector('#difficulty-range-slider')
            .addEventListener('change', this.reloadKeyAndStringEventHandler.bind(this));

        // Add note in key entire fretboard option event listener
        document.querySelector('#note-in-key-entire-fretboard-option input')
            .addEventListener('change', () =>{
                this.setPossibleKeysOnStrings();
                this.reloadKeyAndStringEventHandler();
            });

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
            <p>The second option in the settings is to enable notes after C on the E string and F on the A
            string which are impractical for chord grips on classical guitar </p>
            <p>Click "Play" to start or resume the game or double-tap this instruction.</p>
            <h3>Roadmaps</h3>
            <p>Low E string roadmap for the G key 
            (<a href="https://youtu.be/dYs_0Rx3CTI?si=ez3lOjaeHTXl8W-2&t=450">Source</a>):            
            <img src="https://i.imgur.com/fXpX6Uh.png" alt="https://youtu.be/dYs_0Rx3CTI?si=ez3lOjaeHTXl8W-2&t=450"></p>
            <p>A string roadmap for the D key 
            (<a href="https://youtu.be/dYs_0Rx3CTI?si=RGa0pX5z24TSZ2dH&t=623">Source</a>):            
            <img src="https://i.imgur.com/x3ROkRE.png" alt="https://youtu.be/dYs_0Rx3CTI?si=RGa0pX5z24TSZ2dH&t=623"></p>
            <p>These can be shifted up and down depending on the key.</p>
            <p>I also recommend watching Paul Davids 
            <a href="https://www.youtube.com/watch?v=-YkiaALRb54&list=PLFT94I4UzgTMTeiGy4qn4bWzWAu6mHypz">
            Music Theory episodes</a>.</p>
            <p>And <a href="https://www.youtube.com/watch?v=kmAK4tRmLec">this video</a>
            on how to find the chords to any song on guitar from Andrew Clarke that motivated me
            to create this tool.</p>
            `;
    }
}