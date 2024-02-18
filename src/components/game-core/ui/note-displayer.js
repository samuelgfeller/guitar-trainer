import {TrebleClefVisualizer} from "../../../features/treble-clef/treble-clef-visualizer.js?v=2.0.0";

export class NoteDisplayer {

    constructor(frequencyBarsController) {
        this.frequencyBarsController = frequencyBarsController;
    }

    updateFrequencyBarsFillStyle(color) {
        this.frequencyBarsController.updateFrequencyBarsFillStyle(color);
    }

    static displayCombinationWithNoteNumber(stringName, noteNumber, noteName = null){
        const noteSpan = document.getElementById('note-span');
        noteSpan.dataset.noteName = noteName;
        noteSpan.innerHTML = noteNumber;
        document.getElementById('string-span').innerHTML = stringName;
    }

    static displayCombinationWithNoteName(stringName, noteName, displayInTrebleClef = false, displayTrebleClefAndNoteName = false) {
        // Adds the treble-clef-enabled class if displayInTrebleClef is truthy, removes it otherwise
        document.getElementById('string-span').classList
            .toggle('treble-clef-enabled', displayInTrebleClef || displayTrebleClefAndNoteName);
        // Get trebleClefOutput if it exists
        const trebleClefOutput = document.getElementById('treble-clef-output');

        if (displayInTrebleClef || displayTrebleClefAndNoteName) {
            // Remove content of notspan if there were any
            document.getElementById('note-span').innerHTML = '';
            // If trebleClefOutput doesn't exist, create and insert it after noteSpan
            if (!trebleClefOutput) {
                document.getElementById('note-span')
                    .insertAdjacentHTML('afterend', '<div id="treble-clef-output"></div>');
            }

            TrebleClefVisualizer.displayCombinationInTrebleClef(stringName, noteName, displayTrebleClefAndNoteName);
        } else {
            document.getElementById('note-span').innerHTML = noteName;

            // If trebleClefOutput exists, remove it
            if (trebleClefOutput) {
                trebleClefOutput.remove();
            }
        }
        document.getElementById('string-span').innerHTML = stringName;
    }

    static setNoteSpanColorToIndicateChallenging() {
        // Display the combination in orange when challenging
        document.getElementById('string-span').style.color = '#a96f00';
        document.getElementById('note-span').style.color = '#a96f00';
        // If challenging, display frequency bars in orange when challenging
        // this.frequencyBars.canvasContext.fillStyle = '#a96f00';
    }

    static setColorsToIndicateCorrectlyPlayedNote() {
        document.querySelector('#note-span').style.color = 'green';
        // document.querySelector('#string-span').style.color = null;
        document.querySelector('#detected-note').style.color = 'green';

        // document.body.style.borderRight = '30px solid green';
        this.updateFrequencyBarsFillStyle('green');

    }

    static resetAllColors() {
        document.querySelector('#note-span').style.color = null;
        document.querySelector('#string-span').style.color = null;
        // Set the color of detected note to null if it exists
        const detectedNoteDiv = document.querySelector('#detected-note');
        if (detectedNoteDiv){
            detectedNoteDiv.style.color = null;
        }

        this.updateFrequencyBarsFillStyle('grey');
    }

    static resetDetectedNoteColor() {
        document.querySelector('#detected-note').style.color = null;
        // if (this.currentCombinationIsChallenging) {
        //     this.frequencyBars.canvasContext.fillStyle = '#a96f00';
        // } else {
        //     this.frequencyBars.canvasContext.fillStyle = 'grey';
        // }
    }

    /**
     * There should be only one instance of the frequencyBarsController.
     * It's not suitable to pass the dependency down to this visualizer,
     * and we want to use it in static classes, so the best solution is to
     * pass the color via event.
     * @param color
     */
    static updateFrequencyBarsFillStyle(color) {
        const event = new CustomEvent('updateFrequencyBarsFillStyle', {detail: color});
        document.dispatchEvent(event);
    }

}