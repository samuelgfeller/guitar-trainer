import {DetectedNoteVisualizer} from "./detected-note-visualizer.js?v=1.2.6";
import {NoteCombinationVisualizer} from "../game-core/game-ui/note-combination-visualizer.js?v=1.2.6";

export class DetectedNoteVerifier {
    // Variable is set in note-combination-coordinator each time new note is displayed
    noteToPlay = null;
    // When a correct note is played, it should only be accounted once. The note-detected event may fire multiple
    // times for the same correct note
    correctNoteAccounted = false;

    displayCorrectNoteName = false;

    checkIfNoteIsCorrect(event) {
        // Check if detected note is the correct one (includes as sharp / flats are the same semitone)
        let playedNote = event.detail.name;
        let [sharp, flat] = playedNote.includes(' | ') ? playedNote.split(' | ') : [playedNote, playedNote];
        // console.log(`noteToPlay: ${this.noteToPlay}\nSharp: ${sharp}\nFlat: ${flat}\n${this.noteToPlay === flat}`);
        // console.log(`noteToPlay: ${this.noteToPlay} playedNote: ${playedNote}`);
        // C# and Db are the same note
        if (this.noteToPlay === sharp || this.noteToPlay === flat) {
            console.log('Correct note played', this.noteToPlay);
            // Color spans and detected note in green when correct
            NoteCombinationVisualizer.setColorsToIndicateCorrectlyPlayedNote();

            // A correct note should only be accounted once, but event listener catches the same note multiple times
            if (!this.correctNoteAccounted) {
                this.correctNoteAccounted = true;
                if (this.displayCorrectNoteName) {
                    document.getElementById('note-span').innerHTML = this.noteToPlay;
                }
                // Dispatch the correct-note-played event
                console.log('correct note played and correctNoteAccounted = false')
                document.dispatchEvent(new Event('correct-note-played'));
            }
        } else {
            // If an incorrect note is played, remove green color from frequency canvas and detected note
            NoteCombinationVisualizer.resetDetectedNoteColor();
        }
        // Display the detected note in the GUI
        DetectedNoteVisualizer.updateDetectedNoteAndCents(event.detail);
    }
}