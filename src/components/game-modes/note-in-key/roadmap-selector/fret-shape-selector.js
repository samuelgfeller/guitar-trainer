import {DualRangeSlider} from "./dual-range-slider.js?v=2.0.4";
import {NoteInKeyGenerator} from "../../../../features/game-modes/note-in-key/note-in-key-generator.js?v=2.0.4";
import {availableNotesOnStrings} from "../../../configuration/config-data.js?v=2.0.4";
import {ModalHandler} from "../../../game-core/ui/modal-handler.js?v=2.0.4";

export class FretShapeSelector {

    static noteInKeyGenerator = new NoteInKeyGenerator();

    constructor() {
    }

    /**
     * @param {number|string} fretboardShapeNumber
     */
    static openFretShapeSelectorModal(fretboardShapeNumber = 1) {
        fretboardShapeNumber = parseInt(fretboardShapeNumber);

        let header = `<h2 class="normal-font-size">Shape 
<span id="fretboard-number-span">${fretboardShapeNumber}</span> selector</h2>`;
        let body = `<div id="roadmap-selector-instructions" class="text">
                        <p>Move slider below to select the range of frets with the shape you want to practice.</p>
                    </div>`;
        let footer = `<button id="move-fretboard-shape-button" class="normal-font-size btn">Shape ${fretboardShapeNumber === 1 ? 2 : 1}</button>
                        <button id="save-modal-btn" class="normal-font-size btn">Save selection</button>`

        // Close modal handler
        const closeModalHandler = () => {
            document.dispatchEvent(new Event('reload-key-and-string'));
        }
        // Open modal with fret shape selector
        ModalHandler.displayModal(header, body, footer, closeModalHandler, 'big-modal');
        // Must be before the slider is added so that the slider init can highlight the selected are on load
        this.addFretSelectionFretboard(fretboardShapeNumber);
        DualRangeSlider.addSelectionSlider();

        document.getElementById('save-modal-btn').addEventListener('click', () => {
            ModalHandler.closeModalAndCallGivenEventHandler();
        });
    }

    /**
     * @param {number} fretboardShapeNumber
     */
    static addFretSelectionFretboard(fretboardShapeNumber) {
        document.querySelector('#roadmap-selector-instructions').insertAdjacentHTML('afterend', `
            <div id="fret-selection-container">
                <div id="fret-selection-fretboard-1" data-fretboard-nr="1" 
                class="fretboard-for-shapes ${fretboardShapeNumber !== 1 ? `inactive-fretboard` : ``}"></div>
                <div id="fret-selection-fretboard-2" data-fretboard-nr="2" 
                class="fretboard-for-shapes ${fretboardShapeNumber !== 2 ? `inactive-fretboard` : ``}"></div>
            </div>
        `);

        const diatonicNotesOnStringsG = this.noteInKeyGenerator.getAvailableNotesOnStringsInDiatonicScale('G', availableNotesOnStrings);
        const note1PositionsF1 = this.addVirtualFretboardHtml('fret-selection-fretboard-1', diatonicNotesOnStringsG);
        // Add shapes from the first fretboard to the local storage
        localStorage.setItem('fret-shape-1-key-positions', JSON.stringify(note1PositionsF1));
        const diatonicNotesOnStringsD = this.noteInKeyGenerator.getAvailableNotesOnStringsInDiatonicScale('D', availableNotesOnStrings);
        const note1PositionsF2 = this.addVirtualFretboardHtml('fret-selection-fretboard-2', diatonicNotesOnStringsD);
        localStorage.setItem('fret-shape-2-key-positions', JSON.stringify(note1PositionsF2));
        document.getElementById('move-fretboard-shape-button').addEventListener('click', () => {
            const fretboard1 = document.getElementById('fret-selection-fretboard-1');
            const fretboard2 = document.getElementById('fret-selection-fretboard-2');

            fretboard1.classList.toggle('inactive-fretboard');
            fretboard2.classList.toggle('inactive-fretboard');

            const currentFretboardNr = fretboard1.classList.contains('inactive-fretboard') ? '2' : '1';

            document.getElementById('fretboard-number-span').textContent = currentFretboardNr;
            document.getElementById('move-fretboard-shape-button').textContent = `Shape ${currentFretboardNr === '1' ? '2' : '1'}`;

            DualRangeSlider.setSliderValuesFromLocalStorage();
        });
    }

    static addVirtualFretboardHtml(fretboardId, diatonicNotesOnStrings) {
        const fretboard = document.querySelector(`#${fretboardId}`);
        // Store the total number of frets on the string to place indicator helpers and scrollIntoView on mobile
        let totalFrets = availableNotesOnStrings[Object.keys(availableNotesOnStrings)[0]].length - 1;
        fretboard.dataset.totalFrets = totalFrets.toString();

        let noteOnePositions = {};

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
            // Add note number of open string name
            let noteObject = diatonicNotesOnStrings[stringName].find(
                noteObject => noteObject.noteName === stringName || noteObject.noteName === 'E' && stringName === 'E2'
            );
            if (noteObject) {
                this.addDiatonicNoteNumberColor(stringNameSpan, noteObject.number);
            }
            stringNameDiv.dataset.fretNumber = '0';
            // Append the string name div to the string div
            stringNameDiv.appendChild(stringNameSpan);
            string.appendChild(stringNameDiv);

            // Reverse the note array to so that the fretboard starts on the right side
            let reversedNotes = [...notes].reverse();
            // Remove the last note from the reversed array copy as it's the string name
            reversedNotes.pop();

            for (const index in reversedNotes) {
                // Calculate the fret number where 1 is on the right
                let fretNumberFromRight = totalFrets - parseInt(index);

                let fretPosition = document.createElement('div');
                fretPosition.classList.add('fret-position');
                fretPosition.dataset.fretNumber = fretNumberFromRight.toString();
                fretPosition.dataset.noteName = reversedNotes[index];
                string.appendChild(fretPosition);

                // Display note number in diatonic-note-number span if the current note name is in the diatonic scale
                let noteObject = diatonicNotesOnStrings[stringName].find(noteObject => noteObject.noteName === reversedNotes[index]);
                if (noteObject) {
                    let diatonicNoteNumber = document.createElement('span');
                    this.addDiatonicNoteNumberColor(diatonicNoteNumber, noteObject.number);
                    fretPosition.appendChild(diatonicNoteNumber);
                    if (noteObject.number === 1) {
                        // There can only be one key note on a string
                        noteOnePositions[stringName] = fretNumberFromRight;
                    }
                }
            }

            let hr = document.createElement('hr');
            string.appendChild(hr);
            fretboard.appendChild(string);

            stringIndex++;
        }
        return noteOnePositions;
    }

    static addDiatonicNoteNumberColor(element, noteNumber) {
        element.classList.add('diatonic-note-number');
        if ([1, 4, 5].includes(noteNumber)) {
            element.classList.add('diatonic-major');
        } else if ([2, 3, 6].includes(noteNumber)) {
            element.classList.add('diatonic-minor');
        } else if (noteNumber === 7) {
            element.classList.add('diatonic-diminished');
        }
        element.textContent = noteNumber;
    }
}