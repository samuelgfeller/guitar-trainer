import {NoteInKeyGameCoordinator} from "./note-in-key-game-coordinator.js?v=2.3.0";
import {LevelUpVisualizer} from "../../game-core/game-ui/level-up-visualizer.js?v=2.3.0";
import {GameConfigurationManager} from "../../game-core/game-initialization/game-configuration-manager.js?v=2.3.0";
import {GameProgressVisualizer} from "../../game-core/game-progress/game-progress-visualizer.js?v=2.3.0";
import {NoteInKeyGenerator} from "./note-in-key-generator.js?v=2.3.0";
import {NoteInKeyNoteHandler} from "../../practice-note-combination/note-in-key-note-handler.js?v=2.3.0";
import {NoteInKeyGameNoGuitar} from "./note-in-key-game-no-guitar.js?v=2.3.0";
import {GameElementsVisualizer} from "../../game-core/game-ui/game-elements-visualizer.js?v=2.3.0";
import {
    FretPatternSelector
} from "../../../components/game-modes/note-in-key/pattern-selector/fret-pattern-selector.js?v=2.3.0";


export class NoteInKeyGameInitializer {
    // Possible keys
    // availableNotesOnStrings = {
    //     // String name: [possible keys for string]
    //     'E': ['E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'C'],
    //     'A': ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F'],
    //     'D': ['D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯'],
    //     'G': ['G', 'G♯', 'A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯'],
    //     'B': ['B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G'],
    //     'E2': ['E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'C'],
    // };
    availableNotesOnStrings = {
        // String name: [possible keys for string]
        'E': ['E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯'],
        'A': ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯'],
        'D': ['D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'C', 'C♯'],
        'G': ['G', 'G♯', 'A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯'],
        'B': ['B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯'],
        'E2': ['E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯'],
    };

    notesAmountToFinishOnePractice = 30;

    /**
     * Setup and destroy note in key game
     *
     * @param {NoteInKeyGameCoordinator} noteInKeyGameCoordinator
     */
    constructor(noteInKeyGameCoordinator) {
        this.noteInKeyGameCoordinator = noteInKeyGameCoordinator;
        // Needs to be in an attribute like this to have .bind(this) and be able to remove event listener
        this.levelUpEventHandler = this.levelUp.bind(this);
        // Needs to be in an attribute like this to have .bind(this) and be able to remove event listener
        this.reloadKeyAndStringEventHandlerVar = this.reloadKeyAndStringEventHandler.bind(this);
    }

    initNoteInKeyGame() {
        // Add html components
        this.addHtmlComponents();
        // Init game mode options here as the option value is needed for the next initialization steps
        GameConfigurationManager.initGameModeOptions();
        // Init string options
        GameConfigurationManager.initGameModeOptions('note-in-key-game-strings-div');
        this.initStringOptionsEventListeners();

        // Init game components
        // Note in key generator initialized here in case the user clicks "pause" and wants to continue the game

        this.noteInKeyGameCoordinator.noteInKeyGenerator = new NoteInKeyGenerator();
        this.setAvailableNotesOnStrings();

        // Instantiate object with note displayer function that will be called when a new note should be displayed
        // after a correct one has been played.
        this.noteInKeyGameCoordinator.noteHandler = new NoteInKeyNoteHandler(
            this.noteInKeyGameCoordinator.noteInKeyGenerator, this.notesAmountToFinishOnePractice
        );
        // Has to be reloaded added after html component range slider as its value is needed
        this.noteInKeyGameCoordinator.reloadKeyAndString();

        // Level up event listener
        document.addEventListener('leveled-up', this.levelUpEventHandler);

        // Init no guitar game option
        if (document.querySelector('#no-guitar-option input')) {
            NoteInKeyGameNoGuitar.initNoGuitarGameOption(this.noteInKeyGameCoordinator);
        }

        // Add event listener to reload key button, so it can be called from static functions (passing the
        // function via parameter causes the function to lose the "this" context)
        document.addEventListener('reload-key-and-string', this.reloadKeyAndStringEventHandlerVar);
    }

    initStringOptionsEventListeners() {
        // call this.setPossibleKeysOnStrings(); each time a string option is changed
        const stringOptions = document.querySelectorAll('#note-in-key-game-strings-div input');
        stringOptions.forEach((stringOption) => {
            stringOption.addEventListener('change', () => {
                this.setAvailableNotesOnStrings();
                this.reloadKeyAndStringEventHandler();
            });
        });
    }

    reloadKeyAndStringEventHandler(newKey = true) {
        console.trace('reloadKeyAndStringEventHandler');
        const gameIsRunning = this.noteInKeyGameCoordinator.gameIsRunning;
        // Pause game
        document.dispatchEvent(new Event('game-stop'));
        // Load new key on string
        this.noteInKeyGameCoordinator.reloadKeyAndString(newKey);

        if (gameIsRunning) {
            // Resume the game with the new key
            document.dispatchEvent(new Event('game-start'));
        } else {
            // If the game was not running, reset progress
            // Pause game, display instructions, hide current string and key and hide game progress
            // GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
            // document.querySelector('#current-key-and-string').style.display = 'none';
            GameProgressVisualizer.hideProgress();
        }
    }

    destroy() {
        // Remove contents from the center of the header
        document.querySelector('#header-center-container').innerHTML = '';

        document.removeEventListener('leveled-up', this.levelUpEventHandler);

        document.getElementById('header-center-container').removeEventListener('click',
            this.reloadKeyAndStringEventHandlerVar);

        document.removeEventListener('reload-key-and-string', this.reloadKeyAndStringEventHandlerVar);

        // Remove string options
        document.querySelector('#note-in-key-game-strings-div')?.remove();
        document.querySelector('#string-option-title')?.remove();
        document.querySelector('#scale-roadmaps')?.remove();

        document.querySelector('#note-and-string-container')?.remove();

        // Event listeners that were tied to html components that are not removed or replaced on game mode change
        // don't need to be removed as that removes the event listeners from the html components as well
    }

    levelUp() {
        document.querySelector('#current-key-and-string').style.display = 'block';
        // Remove the 30 times 500ms that are waited to show that the note was played right with the green color
        const timer = this.noteInKeyGameCoordinator.timer - (this.notesAmountToFinishOnePractice * 0.5);
        const minutes = Math.floor(timer / 60);
        // Outputs the rest of seconds that could not be added to full minutes
        const seconds = timer % 60;
        console.debug('Level up note in key game');

        GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        document.dispatchEvent(new CustomEvent('reset-game-progress'));
        GameProgressVisualizer.hideProgress();

        // Fire game-stop event and display modal
        LevelUpVisualizer.stopGameAndDisplayLeveledUpModal(
            `Practice completed in ${minutes} min and ${seconds} sec!`,
            'Go to next key',
            this.goToNextKey.bind(this),
            this.restartKey.bind(this));
        // Reset timer
        this.noteInKeyGameCoordinator.timer = 0;
    }

    goToNextKey() {
        // Set game is running so that it starts automatically, the new key is loaded
        this.noteInKeyGameCoordinator.gameIsRunning = true;
        this.reloadKeyAndStringEventHandler();
    }

    restartKey() {
        this.reloadKeyAndStringEventHandler(false)
        document.dispatchEvent(new Event('game-start'));
    }

    setAvailableNotesOnStrings() {
        // Using the spread operator to create a copy of this.possibleKeysOnStrings otherwise it would
        // be a reference, and the original object would be modified
        let notesOnStrings = {...this.availableNotesOnStrings};

        // Remove strings that were not selected from notesOnStrings
        const strings = document.querySelectorAll('#note-in-key-game-strings-div input');

        strings.forEach((string) => {
            // Remove string and keys if the string was not selected
            // Except if there are not more than 2 elements left in the object (2 strings required by generator)
            if (!string.checked && Object.keys(notesOnStrings).length > 2) {
                delete notesOnStrings[string.value];
            }
        });
        console.debug('Possible keys on strings', notesOnStrings);

        this.noteInKeyGameCoordinator.noteInKeyGenerator.availableNotesOnStrings = notesOnStrings;
        NoteInKeyGameNoGuitar.availableNotesOnStrings = notesOnStrings;

    }

    /**
     * Add html components and their event listeners for note in key game
     */
    addHtmlComponents() {
        // Add game mode options (have to be added before the other initializations as they might depend on options)
        document.querySelector('#game-mode-options').innerHTML = `
                                       <!-- For simplicity, the no-guitar option has the same id for all game modes and 
                     the core-game-coordination-initializer sets the metronomeEnabled and noteDetectorEnabled values -->
                    <label class='checkbox-button option-for-game-mode' id="no-guitar-option">
                        <input type='checkbox'>
                        <!--<span class="normal-font-size"></span>-->
                        <img src="src/assets/images/no-guitar-icon.svg" class="button-icon">
                    </label>
                    <label class='checkbox-button option-for-game-mode custom-pattern-option' id="pattern-1-option">
                        <input type='checkbox' data-fretboard-nr="1">
                        <span class="normal-font-size">Pattern 1</span>
                    </label>
                    <label class='checkbox-button option-for-game-mode custom-pattern-option' id="pattern-2-option">
                        <input type='checkbox' data-fretboard-nr="2">
                        <span class="normal-font-size">Pattern 2</span>
                    </label>
                    <!-- Event listener added in fret-pattern-selector -->
                    <label class='checkbox-button option-for-game-mode' id="select-custom-pattern-option">
                        <span class="normal-font-size">Select range</span>
                    </label>      
                    <div id="fret-gap-range-slider-container">
                    <span>Max gap</span>
                    <div  class="option-for-game-mode">
                        <input type="range" min='1' max='5' value='2' step='1'
                               list="level-options" id="fret-gap-range-slider"/>
                        <datalist id="level-options">
                            <option value="1" label="1"></option>
                            <option value="2" label="2"></option>
                            <option value="3" label="3"></option>
                            <option value="3" label="4"></option>
                            <option value="5" label="5"></option>
                        </datalist>
                    </div> 
                     </div>            
                    `;
        document.querySelector('#game-mode-options').insertAdjacentHTML('afterend', `
                    <span class="normal-font-size label-text options-title-span" id="string-option-title">Strings</span>
                    <div id="note-in-key-game-strings-div">
                    <label class='checkbox-button option-for-game-mode' id="note-in-key-e-string-option">
                        <input type='checkbox' value="E" checked>
                        <span class="normal-font-size">E</span>
                    </label>
                    <label class='checkbox-button option-for-game-mode' id="note-in-key-a-string-option">
                        <input type='checkbox' value="A" checked>
                        <span class="normal-font-size">A</span>
                    </label>
                    <label class='checkbox-button option-for-game-mode' id="note-in-key-d-string-option">
                        <input type='checkbox' value="D" checked>
                        <span class="normal-font-size">D</span>
                    </label>
                    <label class='checkbox-button option-for-game-mode' id="note-in-key-g-string-option">
                        <input type='checkbox' value="G" checked>
                        <span class="normal-font-size">G</span>
                    </label>
                    <label class='checkbox-button option-for-game-mode' id="note-in-key-b-string-option">
                        <input type='checkbox' value="B" checked>
                        <span class="normal-font-size">B</span>
                    </label>
                    <label class='checkbox-button option-for-game-mode' id="note-in-key-e2-string-option">
                        <input type='checkbox' value="E2" checked>
                        <span class="normal-font-size">E2</span>
                    </label>
                    </div>
`);

        // Add difficulty range slider event listener
        document.querySelector('#fret-gap-range-slider').addEventListener('change', this.reloadKeyAndStringEventHandler.bind(this));

        // Add event listeners for always the same key options
        this.addCustomPatternChoiceEventListeners();

        document.querySelector('#header-center-container').innerHTML =
            `<img src="src/assets/images/reload-icon.svg" id="reload-key-btn"> Reload key`;


        // Has to be added before key and string are reloaded as they depend on this div existence
        // Add current-key-and-string if it doesn't already exist
        document.querySelector('#game-progress-div').insertAdjacentHTML('afterend',
            `<span id="current-key-and-string"></span>`);

        const reloadKeyButton = document.getElementById('header-center-container');
        reloadKeyButton.style.cursor = "pointer";
        // Reload key button event listener
        reloadKeyButton.addEventListener('click', this.reloadKeyAndStringEventHandlerVar);

        // Game instructions
        document.querySelector('#game-start-instruction').innerHTML =
            `
        <details open>
              <summary><h3>Practice diatonic notes in any key</h3></summary>
              <div id="game-instruction-text">
                  <p>A random string and major key will be generated and displayed.</p>
                  <p>The note on the given string will be the note number 1 of the key.</p>
                  <p>The goal is to play the note number diatonic to the key, on the given string.</p>
                  <p>For example, if the key is C, the note number 4 is F. If the key is G, number 4 is C. <br>
                  Refer to the patterns below.</p>
                  <p>Upon correctly playing the note, a new string and note number will be displayed.<p>
                  <p>After successfully playing 30 notes, a new key is suggested. The key can also be changed anytime
                  with the "reload" button.</p>
                  <p>In the settings icon, you can select a range of frets to practice on. The "pattern" of the 
                  note positions on the strings will be kept while playing, but it may be shifted up or down the 
                  fretboard depending on the note 1 position. 
                  </p>
                  <p>Click <img class="icon" src="src/assets/images/play-icon.svg"> to start or resume the game 
                  or double-tap this instruction.</p>           
                  <p>I recommend watching Paul Davids 
                  <a href="https://www.youtube.com/watch?v=-YkiaALRb54&list=PLFT94I4UzgTMTeiGy4qn4bWzWAu6mHypz">
                  Music Theory episodes</a>.</p>
                  <p>And <a href="https://www.youtube.com/watch?v=kmAK4tRmLec">this video</a>
                  on how to find the chords to any song on guitar from Andrew Clarke that motivated me
                  to create this tool.</p>
              </div>
        </details>`

        document.querySelector('#game-start-instruction').insertAdjacentHTML('afterend',
            `<div id="scale-roadmaps">
           <details open>
              <summary><h3>Patterns</h3></summary>
              <img src="src/assets/images/roadmaps/G-heptatonic-scale-numbered.svg" class="roadmap-image" alt="roadmap">
                <img src="src/assets/images/roadmaps/D-heptatonic-scale-numbered.svg" class="roadmap-image">
            </details>
        </div>`);


        document.querySelector('main').insertAdjacentHTML('beforeend',
            `<div id="note-and-string-container" style="display: none">
                <div>
                    <span class="label">String</span>
                    <span class="note-value-span" id="string-span"></span>
                </div>
                <div>
                    <span class="label">Note</span>
                    <span class="note-value-span" id="note-span"></span>
                </div>
            </div>`);
    }

    addCustomPatternChoiceEventListeners() {
        const customPatternOption = document.querySelectorAll('.custom-pattern-option');
        // If one of the key options is checked, the other should be unchecked
        for (const option of customPatternOption) {
            option.addEventListener('change', () => {
                const input = option.querySelector('input');
                // If the checkbox was not checked before
                if (input.checked) {
                    // When one game mode is selected, uncheck all game modes
                    // for (const disabledOption of customPatternOption) {
                    //     disabledOption.querySelector('input').checked = false;
                    //     // Fire change event so that option value is stored in local storage
                    //     disabledOption.querySelector('input').dispatchEvent(new Event('change'));
                    // }
                    // // The radio button that was clicked should be checked only if it was not checked before
                    // input.checked = true;
                    // input.dispatchEvent(new Event('change'));

                    // If the fret range has not been defined yet, and the user selects a pattern,
                    // automatically open popup on the selected pattern
                    if (!localStorage.getItem(`note-in-key-fret-range-${input.dataset.fretboardNr}`)) {
                        FretPatternSelector.openFretPatternSelectorModal(parseInt(input.dataset.fretboardNr));
                    }
                }
                this.reloadKeyAndStringEventHandler();
            });
        }
        document.querySelector('#select-custom-pattern-option').addEventListener('click', () => {
            // If both are checked, it defaults to the first one
            const checkedPatternInput = document.querySelector('.custom-pattern-option input[type="checkbox"]:checked');
            let fretboardNr = 1;
            if (checkedPatternInput) {
                fretboardNr = checkedPatternInput.dataset.fretboardNr;
            }
            FretPatternSelector.openFretPatternSelectorModal(fretboardNr);
        });
    }
}