import {NoteCombinationCalculator} from "../note-combination/note-combination-calculator.js?v=0.6";
import {NoteCombinationVisualizer} from "../note-combination/note-combination-visualizer.js?v=0.6";
import {DetectedNoteVisualizer} from "./detected-note-visualizer.js?v=0.6";

export class DetectedNoteVerifier {
    // Variable is set in note-combination-coordinator each time new note is displayed
    noteToPlay = null;
    // When a correct note is played, it should only be accounted once. The note-detected event may fire multiple
    // times for the same correct note
    correctNoteAccounted = false;

    correctCount = 0;

    constructor(noteDisplayCoordinator) {
        this.noteDisplayCoordinator = noteDisplayCoordinator;
    }

    checkIfNoteIsCorrect(event) {
        // Check if detected note is the correct one (includes as sharp / flats are the same semitone)
        let playedNote = event.detail.name;
        let [sharp, flat] = playedNote.includes(' | ') ? playedNote.split(' | ') : [playedNote, playedNote];
        // console.log(`noteToPlay: ${this.noteToPlay}\nSharp: ${sharp}\nFlat: ${flat}\n${this.noteToPlay === flat}`);
        // console.log(`noteToPlay: ${this.noteToPlay} playedNote: ${playedNote}`);
        // C# and Db are the same note
        if (this.noteToPlay === sharp || this.noteToPlay === flat) {
            // Color spans and detected note in green when correct
            NoteCombinationVisualizer.setColorsToIndicateCorrectlyPlayedNote();

            // A correct note should only be accounted once, but event listener catches the same note multiple times
            if (!this.correctNoteAccounted) {
                // Combination was correct meaning that its count should be adjusted or removed if over 3 times correct
                this.noteDisplayCoordinator.adjustCombinationCorrectCount();
                // Mark that it was correct by setting value to false
                this.noteDisplayCoordinator.previousCombinationWasIncorrect = false;
                this.noteDisplayCoordinator.correctCount++;
                this.correctNoteAccounted = true;
                // Update game progress
                // If there are no combinations left to show, increase the consecutive end-of-level correct notes
                if (this.noteDisplayCoordinator.challengingCombinations.size === 0) {
                    this.noteDisplayCoordinator.consecutiveEndOfLevelCorrectNotes++;
                }
                this.noteDisplayCoordinator.updateProgress();
            }
        } else {
            // If an incorrect note is played, remove green color from frequency canvas and detected note
            NoteCombinationVisualizer.resetDetectedNoteColor();
        }
        // Display the detected note in the GUI
        DetectedNoteVisualizer.updateDetectedNoteAndCents(event.detail);
    }
}