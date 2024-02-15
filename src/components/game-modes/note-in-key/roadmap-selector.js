import {availableNotesOnStrings} from "../../configuration/string-and-note-names.js?v=1.6.1";
import {NoteInKeyGenerator} from "../../../features/game-modes/note-in-key/note-in-key-generator.js?v=1.6.1";

export class RoadmapSelector {

    noteInKeyGenerator = new NoteInKeyGenerator();

    constructor() {
    }

    initRoadmapSelector() {
        this.addFretSelectionFretboard();
        this.addSelectionSlider();
    }

    addSelectionSlider() {
        document.querySelector('main').insertAdjacentHTML('afterbegin', `
            <div class="dual-range-slider-container normal-font-size">
                <div class="slider-track normal-font-size"></div>
                <input type="range" class="normal-font-size" min="0" max="11" value="2" id="slider-1">
                <input type="range" class="normal-font-size" min="0" max="11" value="6" id="slider-2">
            </div>
        `);

        let sliderOne = document.getElementById("slider-1");
        let sliderTwo = document.getElementById("slider-2");
        let displayValOne = document.getElementById("range2");
        let displayValTwo = document.getElementById("range1");
        let minGap = 0;
        let sliderTrack = document.querySelector(".slider-track");
        let sliderMaxValue = document.getElementById("slider-1").max;

        sliderOne.addEventListener("input", slideOneEventHandler);
        sliderTwo.addEventListener("input", slideTwoEventHandler);

        function slideOneEventHandler() {
            if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
                sliderOne.value = parseInt(sliderTwo.value) - minGap;
            }
            fillColor();
        }

        function slideTwoEventHandler() {
            if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
                sliderTwo.value = parseInt(sliderOne.value) + minGap;
            }
            fillColor();
        }

        function fillColor() {
            let percent1 = (sliderOne.value / sliderMaxValue) * 100;
            let percent2 = (sliderTwo.value / sliderMaxValue) * 100;
            sliderTrack.style.background = `linear-gradient(to left, #dadae5 ${percent1}% , saddlebrown ${percent1}% , saddlebrown ${percent2}%, #dadae5 ${percent2}%)`;


            // Color all frets that are within the range of the sliders
            document.querySelectorAll('.fret, .string-name').forEach(fret => {
                let fretNumber = parseInt(fret.dataset.fretNumber);
                if (fretNumber >= sliderOne.value && fretNumber <= sliderTwo.value) {
                    fret.style.backgroundColor = 'rgba(139,69,19,0.32)';
                } else {
                    fret.style.backgroundColor = '';
                }
            });
        }

        slideOneEventHandler();
        slideTwoEventHandler();
    }


    addFretSelectionFretboard() {
        document.querySelector('main').insertAdjacentHTML('afterbegin', `
            <div id="fret-selection-container">
                <div id="fret-selection-fretboard-1" class="fretboard-for-shapes"></div>
                <div id="fret-selection-fretboard-2" style="display: none" class="fretboard-for-shapes"></div>
            </div>
            <div id="fretboard-switch-button-container">
                <button id="move-fretboard-shape-button" class="normal-font-size">Move fretboard shapes</button>
            </div>
        `);

        const diatonicNotesOnStringsG = this.noteInKeyGenerator.getAvailableNotesOnStringsInDiatonicScale('G', availableNotesOnStrings);
        this.addVirtualFretboardHtml('fret-selection-fretboard-1', diatonicNotesOnStringsG);
        const diatonicNotesOnStringsD = this.noteInKeyGenerator.getAvailableNotesOnStringsInDiatonicScale('D', availableNotesOnStrings);
        this.addVirtualFretboardHtml('fret-selection-fretboard-2', diatonicNotesOnStringsD);

        document.getElementById('move-fretboard-shape-button').addEventListener('click', () => {
            const fretboard1 = document.getElementById('fret-selection-fretboard-1');
            const fretboard2 = document.getElementById('fret-selection-fretboard-2');
            if (fretboard1.style.display === 'none') {
                fretboard1.style.display = null;
                fretboard2.style.display = 'none';
            } else {
                fretboard1.style.display = 'none';
                fretboard2.style.display = null;
            }
        });
    }

    addVirtualFretboardHtml(fretboardId, diatonicNotesOnStrings) {
        const fretboard = document.querySelector(`#${fretboardId}`);

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
            // Set the text content to the string name
            stringNameSpan.textContent = stringName;
            // Set the noteName data attribute to the first note of the string
            stringNameSpan.dataset.noteName = stringName;
            stringNameDiv.dataset.fretNumber = '0';
            // Append the string name div to the string div
            stringNameDiv.appendChild(stringNameSpan);
            string.appendChild(stringNameDiv);

            // Reverse the note array to so that the fretboard starts on the right side
            let reversedNotes = [...notes].reverse();
            // Remove the last note from the reversed array copy as it's the string name
            reversedNotes.pop();

            // Store the total number of frets on the string to place indicator helpers
            let totalFrets = reversedNotes.length;


            for (const index in reversedNotes) {
                // Calculate the fret number from the right
                let fretNumberFromRight = totalFrets - parseInt(index);

                let fret = document.createElement('div');
                fret.classList.add('fret');
                fret.dataset.fretNumber = fretNumberFromRight.toString();
                fret.dataset.noteName = reversedNotes[index];
                string.appendChild(fret);

                // Display note number in diatonic-note-number span if the current note name is in the diatonic scale
                let noteObject = diatonicNotesOnStrings[stringName].find(noteObject => noteObject.noteName === reversedNotes[index]);
                if (noteObject) {
                    let diatonicNoteNumber = document.createElement('span');
                    diatonicNoteNumber.classList.add('diatonic-note-number');
                    if ([1, 4, 5].includes(noteObject.number)) {
                        diatonicNoteNumber.classList.add('diatonic-major');
                    } else if ([2, 3, 6].includes(noteObject.number)) {
                        diatonicNoteNumber.classList.add('diatonic-minor');
                    } else if (noteObject.number === 7) {
                        diatonicNoteNumber.classList.add('diatonic-diminished');
                    }
                    diatonicNoteNumber.textContent = noteObject.number;
                    fret.appendChild(diatonicNoteNumber);
                }

                // If the fret index is 3, 5, 7, or 9 and the string is the first string, add a circle to the fret

                // If the fret number from the right is 3, 5, 7, or 9 and the string is the first string, add a circle to the fret
                // if ([3, 5, 7, 9].includes(fretNumberFromRight) && stringIndex === 0) {
                //     let fretHelper = document.createElement('span');
                //     fretHelper.className = 'fret-helper';
                //     fret.appendChild(fretHelper);
                // }
            }

            let hr = document.createElement('hr');
            string.appendChild(hr);
            fretboard.appendChild(string);

            stringIndex++;
        }
    }
}