import {NoteInKeyGenerator} from "./note-in-key-generator.js";
import {PracticeNoteDisplayer} from "../../practice-note-combination/practice-note-displayer.js";

export class NoteInKeyGameCoordinator {
    string;
    key;
    interval;

    // allNotes = ['C', 'C♯', 'D', 'D♭', 'D♯', 'E', 'E♭', 'F', 'F♯', 'G', 'G♭', 'G♯', 'A', 'A♭', 'A♯', 'B', 'B♭']
    allNotes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']


    possibleKeysOnStrings = {
        // String name: [possible keys for string]
        'E': ['E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'C'],
        'A': ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F'],
    };

    noteDisplayer;


    constructor() {
    }


    play() {
        const noteInKeyGenerator = new NoteInKeyGenerator(this.possibleKeysOnStrings);
        let {keyString, keyNote} = noteInKeyGenerator.getNewStringAndKey();

        document.getElementById('info-above-string-and-key').innerHTML =
            `<img src="src/assets/images/reload-icon.svg" class="icon" alt="reload" id="reload-key-btn">String: <b>${keyString}</b> Key: <b>${keyNote}</b>`;

        // Reload key button event listener
        document.getElementById('reload-key-btn').addEventListener('click', this.reloadKey);

        // Prepare the attribute containing the notes on strings that may be displayed (diatonic to key, difficulty)
        noteInKeyGenerator.loadNotesAndStrings(keyString, keyNote);

        // Instantiate object with note displayer function that will be called when new note should be displayed
        // after a correct one has been played.
        this.noteDisplayer = new PracticeNoteDisplayer(noteInKeyGenerator);
        // After the correct number has been played, replace number with note name - or not
        this.noteDisplayer.detectedNoteVerifier.displayCorrectNoteName = false;

        // Manually call displayNotes because the first combination should be the note of the key
        this.noteDisplayer.displayNotes({stringName: keyString, noteName: {noteName: keyNote, number: 1}});

        // Level up event listener
        document.addEventListener('leveled-up', this.levelUp.bind(this));

        // Init event listeners that will automatically call displayNotes() when correct note has been played
        this.noteDisplayer.beingGame();
    }

    stop() {
        this.noteDisplayer.endGame();
    }

    levelUp() {

    }

    reloadKey() {
        document.dispatchEvent(new Event('game-stop'));
        document.dispatchEvent(new Event('game-start'));
    }

    //
    // beingGame() {
    //     // Event fired on each metronome beat
    //     document.addEventListener('metronome-beat', this.displayRandomNotesHandler);
    //     // Custom event when played note was detected
    //     document.addEventListener('note-detected', this.checkIfNoteCorrectHandler);
    // }
    //
    // endGame() {
    //     document.removeEventListener('metronome-beat', this.displayRandomNotesHandler);
    //     document.removeEventListener('note-detected', this.checkIfNoteCorrectHandler);
    // }


    /**
     * game manager
     */


}