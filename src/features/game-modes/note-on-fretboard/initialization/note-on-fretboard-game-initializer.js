import {BpmInput} from "../../../../components/configuration/bpm-input.js?v=2.1.1";
import {GameConfigurationManager} from "../../../game-core/game-initialization/game-configuration-manager.js?v=2.1.1";
import {availableNotesOnStrings} from "../../../../components/configuration/config-data.js?v=2.1.1";
import {GameLevelTracker} from "../../../game-core/game-progress/game-level-tracker.js?v=2.1.1";
import {NoteOnFretboardEventListenerAdder} from "./note-on-fretboard-event-listener-adder.js?v=2.1.1";

export class NoteOnFretboardGameInitializer {

    /**
     * @param {FretboardNoteGameCoordinator} fretboardNoteGameCoordinator
     */
    constructor(fretboardNoteGameCoordinator) {
        this.fretboardNoteGameCoordinator = fretboardNoteGameCoordinator;
        this.levelLocalStorageKey = 'fretboard-note-game-accomplished-levels';

        this.eventListenerAdder = new NoteOnFretboardEventListenerAdder(this);
    }

    init() {
        // Add level selection
        BpmInput.addBpmInput();

        // Set bpm input to the current level which is always one higher than the last completed or the default value
        document.querySelector('#bpm-input').value = GameLevelTracker.getCurrentLevel(this.levelLocalStorageKey);
        this.eventListenerAdder.addBpmInputEventListener();

        // Set levelValue of note handler after initializing the level value
        this.fretboardNoteGameCoordinator.noteOnFretboardNoteHandler
            .setLevelValue(document.querySelector('#bpm-input').value);

        this.eventListenerAdder.addLevelUpEventListener();

        this.addHtmlComponents();
        this.eventListenerAdder.addSelectRangeButtonEventListener();

        // Init strings options for them to be saved to localstorage
        // Other options are initialized in core-game-coordination-initializer
        GameConfigurationManager.initGameModeOptions('note-on-fretboard-game-strings-div');
        this.eventListenerAdder.addStringOptionsEventListeners();
        // Add event listener when notes have to be reshuffled
        this.eventListenerAdder.addReShuffleNotesEventListener();

        // Must be after the string options have been initialized
        this.setAvailableStringsAndShuffleNotes();
    }
    /**
     * When game mode is changed, the initialized event listeners should be removed
     */
    destroy() {
        // Remove leveled up event handler
        this.eventListenerAdder.removeEventListeners();
        document.querySelector('header div').style.borderBottomColor = null;
        document.querySelector('#note-and-string-container').remove();
        document.querySelector('#note-on-fretboard-game-strings-div').remove();
        document.querySelector('#string-option-title').remove();
        BpmInput.removeBpmInput();
    }


    setAvailableStringsAndShuffleNotes() {
        // Get the selected strings
        const selectedStringsCheckboxes = document.querySelectorAll('#note-on-fretboard-game-strings-div input:checked');
        // Creat array with the name of the selected strings
        const selectedStringNames = Array.from(selectedStringsCheckboxes).map(input => input.value);

        // Using the spread operator to create a copy otherwise it would be a reference,
        // and the original object would be modified
        let notesOnStrings = {...availableNotesOnStrings};

        // Only keep the selected strings in the notesOnStrings object
        for (let string in notesOnStrings) {
            if (!selectedStringNames.includes(string) && Object.keys(notesOnStrings).length > 1) {
                delete notesOnStrings[string];
            }
        }

        // If selected string is only one, add it again to the array to have at least 22 notes
        // if (selectedStringNames.length === 1) {
        //     selectedStringNames.push(selectedStringNames[0]);
        // }

        this.fretboardNoteGameCoordinator.noteOnFretboardNoteHandler.setAvailableStringsAndShuffleNotesList(notesOnStrings);
        // NoteInKeyGameNoGuitar.availableNotesOnStrings = notesOnStrings;
    }



    addHtmlComponents() {
        document.querySelector('#game-mode-options').innerHTML = `
                    <label class='checkbox-button option-for-game-mode' id="select-range-option">
                        <span class="normal-font-size">Select range</span>
                    </label>      
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
                                <input type='checkbox' value="E" checked>
                                <span class="normal-font-size">E</span>
                            </label>
                            <label class='checkbox-button option-for-game-mode' id="note-on-fretboard-a-string-option">
                                <input type='checkbox' value="A" checked>
                                <span class="normal-font-size">A</span>
                            </label>
                            <label class='checkbox-button option-for-game-mode' id="note-on-fretboard-d-string-option">
                                <input type='checkbox' value="D" checked>
                                <span class="normal-font-size">D</span>
                            </label>
                            <label class='checkbox-button option-for-game-mode' id="note-on-fretboard-g-string-option">
                                <input type='checkbox' value="G" checked>
                                <span class="normal-font-size">G</span>
                            </label>
                            <label class='checkbox-button option-for-game-mode' id="note-on-fretboard-b-string-option">
                                <input type='checkbox' value="B" checked>
                                <span class="normal-font-size">B</span>
                            </label>
                            <label class='checkbox-button option-for-game-mode' id="note-on-fretboard-e2-string-option">
                                <input type='checkbox' value="E2" checked>
                                <span class="normal-font-size">E2</span>
                            </label>
                            </div>
        `)
    }

}
