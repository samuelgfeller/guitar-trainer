export class DetectedNoteVisualizer {
    constructor() {
    }

    static updateDetectedNoteAndCents(noteInfos) {
        const detectedNote = document.querySelector('#detected-note');
        if (!detectedNote) {
            // #detected-note is removed when game stops (e.g. when level up)
            return;
        }
        detectedNote.innerHTML = noteInfos.name;
        // Convert the cent value to a percentage for the bar width
        const percentage = Math.abs(noteInfos.cents) / 2;

        if (noteInfos.cents < 0) {
            detectedNote.style.setProperty('--left-bar-width', `${percentage}vw`);
            detectedNote.style.setProperty('--right-bar-width', '0');
        } else if (noteInfos.cents > 0) {
            detectedNote.style.setProperty('--left-bar-width', '0');
            detectedNote.style.setProperty('--right-bar-width', `${percentage}vw`);
        } else {
            detectedNote.style.setProperty('--left-bar-width', '0');
            detectedNote.style.setProperty('--right-bar-width', '0');
        }

        // Set the width of the bar based on the cent value and its sign
        detectedNote.setAttribute('data-cent', noteInfos.cents); // Set the cent value as a data attribute
    }
}