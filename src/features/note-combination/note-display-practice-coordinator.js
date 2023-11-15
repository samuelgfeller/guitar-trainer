import {DetectedNoteVerifier} from "../detected-note/detected-note-verifier.js";
import {NoteCombinationVisualizer} from "../game-core/game-ui/note-combination-visualizer.js";

export class NoteDisplayPracticeCoordinator {
    constructor(noteGenerator) {
        this.noteGenerator = noteGenerator;
        this.detectedNoteVerifier = new DetectedNoteVerifier();

        // Create class-level arrow function properties for event listeners so that they can be removed
        this.displayNotesHandler = this.displayNotes.bind(this);
        // Event handler that checks if note is correct. Updates attributes and calls functions of this coordinator.
        this.checkIfNoteCorrectHandler = this.detectedNoteVerifier.checkIfNoteIsCorrect.bind(this.detectedNoteVerifier);
    }

    beingGame() {
        // Event fired each time a correct note has been played
        document.addEventListener('correct-note-played', this.displayNotesHandler);
        // Custom event when played note was detected
        document.addEventListener('note-detected', this.checkIfNoteCorrectHandler);
    }

    endGame() {
        document.addEventListener('correct-note-played', this.displayNotesHandler);
        document.removeEventListener('note-detected', this.checkIfNoteCorrectHandler);
    }

    displayNotes(combination) {
        // this.detectedNoteVerifier.correctNoteAccounted = false;
        // NoteCombinationVisualizer.resetAllColors();

        let stringName, noteName;
        // Get the next combination
        if (combination) {
            ({stringName, noteName} = combination);
        } else {
            ({stringName, noteName} = this.noteGenerator.getNextCombination());
        }
        // Note could be displayed as number
        let noteNumber = null;
        // Check if note is an object or a string
        if (typeof noteName === 'object') {
            noteNumber = noteName.number;
            noteName = noteName.noteName;
        }
        console.log(stringName, noteName);
        // Display next note and string
        NoteCombinationVisualizer.displayCombination(stringName, noteNumber ?? noteName);
        // console.debug(`Displaying combination ${stringName}|${noteName}`);
        this.detectedNoteVerifier.noteToPlay = noteName;
    }
}