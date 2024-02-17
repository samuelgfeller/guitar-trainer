import {DualRangeSlider} from "./dual-range-slider.js?v=1708178220";
import {NoteInKeyGenerator} from "../../../../features/game-modes/note-in-key/note-in-key-generator.js?v=1708178220";
import {availableNotesOnStrings} from "../../../configuration/string-and-note-names.js?v=1708178220";
import {ModalHandler} from "../../../game-core/ui/modal-handler.js?v=1708178220";

export class FretShapeSelector {

    noteInKeyGenerator = new NoteInKeyGenerator();

    constructor() {
    }

    initRoadmapSelector() {
        this.initFretShapeSelectorOptionButton();
        this.addRoadmapSelectorInstructions();

    }

    initFretShapeSelectorOptionButton() {
        document.querySelector('#custom-shape-option').addEventListener('click', () => {
            this.openFretShapeSelectorModal();
        });
    }

    openFretShapeSelectorModal() {
        let header = `<h2 class="normal-font-size">Shape selector</h2>`;
        let body = `<div id="roadmap-selector-instructions" class="text">
                        <p>Move slider below to select the range of frets with the shapes you want to practice.</p>
                    </div>`;
        let footer = `<!--<button id="restart-modal-btn">Restart</button><button id="next-lvl-modal-btn"></button>-->`

        // Open modal with fret shape selector
        ModalHandler.displayModal(header, body, null, null, 'big-modal');
        // Must be before the slider is added so that the slider init can highlight the selected are on load
        this.addFretSelectionFretboard();
        new DualRangeSlider().addSelectionSlider();
    }

    addRoadmapSelectorInstructions() {
        document.querySelector('main').insertAdjacentHTML('afterbegin', `
            
        `);
    }


    addFretSelectionFretboard() {
        document.querySelector('#roadmap-selector-instructions').insertAdjacentHTML('afterend', `
            <div id="fret-selection-container">
                <div id="fret-selection-fretboard-1" class="fretboard-for-shapes"></div>
                <div id="fret-selection-fretboard-2" class="fretboard-for-shapes inactive-fretboard"></div>
            </div>
            <div id="fretboard-switch-button-container" class="btn-container">
                <button id="move-fretboard-shape-button" class="normal-font-size btn">Move fretboard shapes</button>
            </div>
        `);

        const diatonicNotesOnStringsG = this.noteInKeyGenerator.getAvailableNotesOnStringsInDiatonicScale('G', availableNotesOnStrings);
        this.addVirtualFretboardHtml('fret-selection-fretboard-1', diatonicNotesOnStringsG);
        const diatonicNotesOnStringsD = this.noteInKeyGenerator.getAvailableNotesOnStringsInDiatonicScale('D', availableNotesOnStrings);
        this.addVirtualFretboardHtml('fret-selection-fretboard-2', diatonicNotesOnStringsD);

        document.getElementById('move-fretboard-shape-button').addEventListener('click', () => {
            const fretboard1 = document.getElementById('fret-selection-fretboard-1');
            const fretboard2 = document.getElementById('fret-selection-fretboard-2');

            fretboard1.classList.toggle('inactive-fretboard');
            fretboard2.classList.toggle('inactive-fretboard');
        });
    }

    addVirtualFretboardHtml(fretboardId, diatonicNotesOnStrings) {
        const fretboard = document.querySelector(`#${fretboardId}`);
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
                // Calculate the fret number from the right
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
                }
            }

            let hr = document.createElement('hr');
            string.appendChild(hr);
            fretboard.appendChild(string);

            stringIndex++;
        }
    }

    addDiatonicNoteNumberColor(element, noteNumber) {
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