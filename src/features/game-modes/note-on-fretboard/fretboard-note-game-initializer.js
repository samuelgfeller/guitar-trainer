import {GameLevelTracker} from "../../game-core/game-progress/game-level-tracker.js?v=2.1.0";
import {GameElementsVisualizer} from "../../game-core/game-ui/game-elements-visualizer.js?v=2.1.0";
import {LevelUpVisualizer} from "../../game-core/game-ui/level-up-visualizer.js?v=2.1.0";
import {GameConfigurationManager} from "../../game-core/game-initialization/game-configuration-manager.js?v=2.1.0";
import {BpmInput} from "../../../components/configuration/bpm-input.js?v=2.1.0";
import {GameProgressVisualizer} from "../../game-core/game-progress/game-progress-visualizer.js?v=2.1.0";

export class FretboardNoteGameInitializer {

    /**
     * @param {FretboardNoteGameCoordinator} fretboardNoteGameCoordinator
     */
    constructor(fretboardNoteGameCoordinator) {
        this.fretboardNoteGameCoordinator = fretboardNoteGameCoordinator;
        this.levelLocalStorageKey = 'fretboard-note-game-accomplished-levels';
        // Needs to be in an attribute like this to have .bind(this) and be able to remove event listener
        this.levelUpEventHandler = this.levelUp.bind(this);
        // Needs to be in an attribute like this to have .bind(this) and be able to remove event listener
        this.fretboardNoteGameLevelChangeEventHandler = this.fretboardNoteGameLevelChangeEventHandler.bind(this);
    }

    init() {
        // Add level selection
        BpmInput.addBpmInput();
        this.initFretboardNoteGameLevelChangeEventListener();
        // Set levelValue of note handler after initializing the level value
        this.fretboardNoteGameCoordinator.noteOnFretboardNoteHandler.setLevelValue(document.querySelector('#bpm-input').value);

        document.addEventListener('leveled-up', this.levelUpEventHandler);

        this.addHtmlComponents();

        // Init strings options for them to be saved to localstorage
        // Other options are initialized in core-game-coordination-initializer
        GameConfigurationManager.initGameModeOptions('note-on-fretboard-game-strings-div');
        this.initStringOptionsEventListeners();
        // Must be after the string options have been initialized
        this.setAvailableStringsAndShuffleNotes();
    }

    initStringOptionsEventListeners() {
        // call this.setPossibleKeysOnStrings(); each time a string option is changed
        const stringOptions = document.querySelectorAll('#note-on-fretboard-game-strings-div input');
        stringOptions.forEach((stringOption) => {
            stringOption.addEventListener('change', () => {
                this.setAvailableStringsAndShuffleNotes();
                document.dispatchEvent(new Event('game-stop'));
                GameProgressVisualizer.hideProgress();
                document.dispatchEvent(new Event('reset-game-progress'));
            });
        });
    }

    setAvailableStringsAndShuffleNotes() {
        // Get the selected strings
        const selectedStringsCheckboxes = document.querySelectorAll('#note-on-fretboard-game-strings-div input:checked');
        const selectedStrings = Array.from(selectedStringsCheckboxes).map(input => input.value);

        if (selectedStrings.length === 0) {
            selectedStrings.push('E');
        }
        // If selected string is only one, add it again to the array to have at least 22 notes
        if (selectedStrings.length === 1) {
            selectedStrings.push(selectedStrings[0]);
        }

        console.debug('Available strings', selectedStrings);

        this.fretboardNoteGameCoordinator.noteOnFretboardNoteHandler.setAvailableStringsAndShuffleNotesList(selectedStrings);
        // NoteInKeyGameNoGuitar.availableNotesOnStrings = notesOnStrings;
    }

    /**
     * When game mode is changed, the initialized event listeners should be removed
     */
    destroy() {
        // Remove leveled up event handler
        document.removeEventListener('leveled-up', this.levelUpEventHandler);
        document.querySelector('header div').style.borderBottomColor = null;
        document.querySelector('#note-and-string-container').remove();
        document.querySelector('#note-on-fretboard-game-strings-div').remove();
        document.querySelector('#string-option-title').remove();
    }

    levelUp() {
        // Store accomplished game level
        let level = document.getElementById('bpm-input').value;
        GameLevelTracker.addAccomplishedLevel(level, this.levelLocalStorageKey);

        GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        document.dispatchEvent(new Event('reset-game-progress'));

        // Fire game-stop event and display modal
        LevelUpVisualizer.stopGameAndDisplayLeveledUpModal(
            'Level completed!',
            'Go to next level',
            this.goToNextLevel.bind(this),
            this.restartLevel.bind(this),
            () => {this.setAvailableStringsAndShuffleNotes()}
        );
    }

    restartLevel() {
        this.setAvailableStringsAndShuffleNotes();
        document.dispatchEvent(new Event('game-start'));
    }

    goToNextLevel() {
        console.log('goToNextLevel');
        let bpmInput = document.getElementById('bpm-input');
        bpmInput.stepUp();
        // stepUp on input type number doesn't automatically fire the "change" event.
        // And the change event automatically resets the game progress so this has to be called before it can be removed
        const changeEvent = new Event('change');
        // Dispatch event to trigger same processes than when level is changed manually
        bpmInput.dispatchEvent(changeEvent);
        GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        // No need to call reset game progress here because it's called in the bpm input change event handler
    }

    initFretboardNoteGameLevelChangeEventListener() {
        const bpmInput = document.querySelector('#bpm-input');

        // Set bpm input to the current level which is always one higher than the last completed or the default value
        bpmInput.value = GameLevelTracker.getCurrentLevel(this.levelLocalStorageKey);


        // Level change event listener and handler
        bpmInput.addEventListener('change', this.fretboardNoteGameLevelChangeEventHandler);
    }

    fretboardNoteGameLevelChangeEventHandler() {
        document.dispatchEvent(new Event('game-stop'));
        GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        GameElementsVisualizer.togglePlayPauseButton('stop');
        // Reset game progress in the form of an event to avoid having to need game progress instance here
        document.dispatchEvent(new Event('reset-game-progress'));

        this.fretboardNoteGameCoordinator.noteOnFretboardNoteHandler.setLevelValue(document.querySelector('#bpm-input').value);

        // Update color to indicate that level is accomplished on bpm change event
        GameElementsVisualizer.updateIsLevelAccomplishedColor(this.levelLocalStorageKey);
    }

    addHtmlComponents() {
        document.querySelector('#game-mode-options').innerHTML = `
                         <label class='checkbox-button option-for-game-mode' id="fretboard-note-game-treble-clef">
                             <input type='checkbox'>
                             <!--<span class="normal-font-size"></span>-->
                             <img src="src/assets/images/treble-clef-icon.svg" class="button-icon">
                         </label>
                         <label class='checkbox-button option-for-game-mode' id="fretboard-note-game-treble-clef-and-name">
                             <input type='checkbox'>
                             <div style="display: flex; align-items: center">
                                 <img src="src/assets/images/treble-clef-icon.svg" class="button-icon">
                                 <span class="normal-font-size">+ name</span>
                             </div>
                         </label>
                         <label class='checkbox-button option-for-game-mode' id="challenging-notes-preset">
                             <input type="checkbox" alt="Preset challenging notes">
                             <img src="src/assets/images/challenging-icon.svg" class="button-icon">
                         </label>`;

        // Game instructions
        document.querySelector('#game-start-instruction').querySelector('h3').innerHTML = `Fretboard note game`;
        document.querySelector('#game-instruction-text').innerHTML = `
                 <p>The number in the header corresponds to the metronome tempo (bpm) which will be the 
                 frequency in which a new string and note will be displayed. Each bpm higher is one level higher.</p>
                 <p>The goal is to play the note on the given string before time runs out.</p>
                 <p>If it's too fast, lower the tempo to a rhythm that suits you.</p>
                 <p>When you fail to play a note correctly, it gets added to the challenging notes list.</p>
                 <p>The challenging notes have a higher chance of reappearing in the game to help you focus on learning
                     them.</p>
                 <p>The progress bar represents (on the left side) the number of challenging notes that still need to be 
                 "learned" correctly until reaching 0 (on the right side). </p>
                 <p>Each time you play a challenging note correctly 3 times, the progress bar advances.</p>
                 <p>After mastering all challenging notes, 10 additional notes have to be played correctly to fill the
                     progress bar to 100% and complete the level.</p>
                 <p>Click <img class="icon" src="src/assets/images/play-icon.svg"> to start or resume the game, 
                 or double-click a blank area.</p>
                 `;
        document.querySelector('main').insertAdjacentHTML('beforeend', `<div id="note-and-string-container" style="display: none">
                     <div>
                         <span class="label">String</span>
                         <span class="note-value-span" id="string-span"></span>
                     </div>
                     <div>
                         <span class="label">Note</span>
                         <span class="note-value-span" id="note-span"></span>
                         <div id="treble-clef-output"></div>
                     </div>
                 </div>`);

        document.querySelector('#game-mode-options').insertAdjacentHTML('afterend', `
                            <span class="normal-font-size label-text options-title-span" id="string-option-title">Strings</span>
                            <div id="note-on-fretboard-game-strings-div">
                            <label class='checkbox-button option-for-game-mode' id="note-on-fretboard-e-string-option">
                                <input type='checkbox' value="E">
                                <span class="normal-font-size">E</span>
                            </label>
                            <label class='checkbox-button option-for-game-mode' id="note-on-fretboard-a-string-option">
                                <input type='checkbox' value="A">
                                <span class="normal-font-size">A</span>
                            </label>
                            <label class='checkbox-button option-for-game-mode' id="note-on-fretboard-d-string-option">
                                <input type='checkbox' value="D">
                                <span class="normal-font-size">D</span>
                            </label>
                            <label class='checkbox-button option-for-game-mode' id="note-on-fretboard-g-string-option">
                                <input type='checkbox' value="G">
                                <span class="normal-font-size">G</span>
                            </label>
                            <label class='checkbox-button option-for-game-mode' id="note-on-fretboard-b-string-option">
                                <input type='checkbox' value="B">
                                <span class="normal-font-size">B</span>
                            </label>
                            <label class='checkbox-button option-for-game-mode' id="note-on-fretboard-e2-string-option">
                                <input type='checkbox' value="E2">
                                <span class="normal-font-size">E2</span>
                            </label>
                            </div>
        `)
    }
}
