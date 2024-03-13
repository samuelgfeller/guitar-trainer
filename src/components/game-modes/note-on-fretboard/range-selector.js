import {DualRangeSlider} from "../note-in-key/pattern-selector/dual-range-slider.js?v=2.4.3";
import {ModalHandler} from "../../game-core/ui/modal-handler.js?v=2.4.3";
import {availableNotesOnStrings} from "../../configuration/config-data.js?v=2.4.3";

export class RangeSelector {

    constructor() {
    }

    static openRangeSelectorModal() {
        let header = `<h2 class="normal-font-size">Fretboard range selector</h2>`;
        let body = `<div id="selector-instructions" class="text">
                        <p>Move slider below to select the range of frets to practice.</p>
                    </div>`;
        let footer = `<button id="save-modal-btn" class="normal-font-size btn">Save selection</button>`;

        // Close modal handler
        const closeModalHandler = () => {
            document.dispatchEvent(new Event('game-stop'));
            document.dispatchEvent(new Event('note-on-fretboard-reshuffle-notes'));
        }
        // Open modal with fret pattern selector
        ModalHandler.displayModal(header, body, footer, closeModalHandler, 'big-modal');
        // Must be before the slider is added so that the slider init can highlight the selected are on load
        this.addFretSelectionFretboard();

        // If there is no value saved in the local storage, set the default values
        if(!localStorage.getItem(`note-on-fretboard-range`)){
            DualRangeSlider.defaultMinValue = 0;
            DualRangeSlider.defaultMaxValue = 11;
        }

        DualRangeSlider.addSelectionSlider(
            this.saveFretRangeInLocalStorage,
            localStorage.getItem(`note-on-fretboard-range`),
            0
        );


        document.getElementById('save-modal-btn').addEventListener('click', () => {
            ModalHandler.closeModalAndCallGivenEventHandler();
        });
    }

    static addFretSelectionFretboard() {
        document.querySelector('#selector-instructions').insertAdjacentHTML('afterend', `
            <div class="fret-selection-container">
                <div id="fretboard-range-selection-virtual-fretboard" class="virtual-fretboard-selector"></div>
            </div>
        `);

        this.addVirtualFretboardHtml();
        // Add patterns from the first fretboard to the local storage
        // localStorage.setItem('fretboard-range-selection', JSON.stringify(note1PositionsF1));

    }

    static addVirtualFretboardHtml() {
        const fretboard = document.querySelector(`#fretboard-range-selection-virtual-fretboard`);
        // Store the total number of frets on the string to place indicator helpers and scrollIntoView on mobile

        let totalFrets = availableNotesOnStrings[Object.keys(availableNotesOnStrings)[0]].length - 1;
        fretboard.dataset.totalFrets = totalFrets.toString();

        let stringIndex = 0;
        // Construct fretboard with available notes on strings
        for (const [stringName, notes] of Object.entries(availableNotesOnStrings)) {
            let string = document.createElement('div');
            string.className = 'string';
            string.dataset.stringName = stringName;

            // Create a new div for the string name
            let stringNameDiv = document.createElement('div');
            let stringNameSpan = document.createElement('span');
            stringNameDiv.className = 'string-name';
            // Set the noteName data attribute to the first note of the string
            stringNameSpan.dataset.noteName = stringName;

            // Set the text content to the string name (overwritten if diatonic note number)
            stringNameSpan.textContent = stringName;

            stringNameDiv.dataset.fretPosition = '0';
            // Append the string name div to the string div
            stringNameDiv.appendChild(stringNameSpan);
            string.appendChild(stringNameDiv);

            // Reverse the note array to so that the fretboard starts on the right side
            let reversedNotes = [...notes].reverse();
            // Remove the last note from the reversed array copy as it's the string name
            reversedNotes.pop();

            for (const index in reversedNotes) {
                // Calculate the fret number where 1 is on the right
                let fretPositionFromRight = totalFrets - parseInt(index);

                let fretPosition = document.createElement('div');
                fretPosition.classList.add('fret-position');
                fretPosition.dataset.fretPosition = fretPositionFromRight.toString();
                fretPosition.dataset.noteName = reversedNotes[index];
                string.appendChild(fretPosition);

                let noteNameSpan = document.createElement('span');
                noteNameSpan.classList.add('note-name-span');
                noteNameSpan.textContent = reversedNotes[index];
                fretPosition.appendChild(noteNameSpan);
            }

            let hr = document.createElement('hr');
            string.appendChild(hr);
            fretboard.appendChild(string);

            stringIndex++;
        }
    }

    static saveFretRangeInLocalStorage(lowerLimit, upperLimit) {
        localStorage.setItem(`note-on-fretboard-range`, JSON.stringify({
            lowerLimit: lowerLimit,
            upperLimit: upperLimit
        }));
    }
}