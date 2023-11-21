import {NoteInKeyGenerator} from "./note-in-key-generator.js?v=1.1";
import {PracticeNoteDisplayer} from "../../practice-note-combination/practice-note-displayer.js?v=1.1";
import {NoteInKeyGameInitializer} from "./note-in-key-game-initializer.js?v=1.1";

export class NoteInKeyGameCoordinator {
    string;
    key;

    possibleKeysOnStrings = {
        // String name: [possible keys for string]
        'E': ['E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'C'],
        'A': ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F'],
    };

    // Class responsible for displaying the note and the string with all the verification and progress logic
    noteDisplayer;
    // Instance created in initialization
    noteInKeyGenerator;

    gameIsRunning = false;

    constructor() {
        // Setup this game mode
        this.noteInkeyGameInitializer = new NoteInKeyGameInitializer(this);
        // Note in key generator initialized here in case the user clicks "pause" and wants to continue the game
        this.noteInKeyGenerator = new NoteInKeyGenerator(this.possibleKeysOnStrings);
        // Instantiate object with note displayer function that will be called when a new note should be displayed
        // after a correct one has been played.
        this.noteDisplayer = new PracticeNoteDisplayer(this.noteInKeyGenerator);
        this.noteInkeyGameInitializer.addHtmlComponents();
        // Has to be reloaded added after html component range slider as its value is needed
        this.reloadKeyAndString();
        this.noteInkeyGameInitializer.initNoteInKeyGame();
    }

    play() {
        this.gameIsRunning = true;

        // Show current key and string
        document.querySelector('#current-key-and-string').style.display = 'block';

        // After the correct number has been played, replace number with note name - or not
        this.noteDisplayer.detectedNoteVerifier.displayCorrectNoteName = false;

        // Manually call displayNotes because the first combination should be the note of the key
        this.displayFirstNoteOfKey();

        // Init event listeners that will automatically call displayNotes() when correct note has been played
        this.noteDisplayer.beingGame();
    }

    stop() {
        this.noteDisplayer?.endGame();
        this.gameIsRunning = false;
        // Hide current key and string
        document.querySelector('#current-key-and-string').style.display = 'none';
    }

    destroy() {
        this.noteInkeyGameInitializer.destroy();
    }

    /**
     * Manually call displayNotes because the first combination should be the note of the key
     */
    displayFirstNoteOfKey() {
        // Manually call displayNotes because the first combination should be the note of the key
        this.noteDisplayer.displayNotes({stringName: this.keyString, noteName: {noteName: this.keyNote, number: 1}});
    }

    reloadKeyAndString() {
        // Get new string and key
        let {keyString, keyNote} = this.noteInKeyGenerator.getNewStringAndKey();
        this.keyNote = keyNote;
        this.keyString = keyString;
        // Prepare the attribute containing the notes on strings that may be displayed (diatonic to key, difficulty)
        this.noteInKeyGenerator.loadNotesAndStrings(keyString, keyNote);
        console.log('key reloaded');
        // Display current key and string
        document.getElementById('current-key-and-string').innerHTML =
            `String: <b>${this.keyString}</b> Key: <b>${this.keyNote}</b>`;
        document.dispatchEvent(new Event('reset-game-progress'));

        // if (this.gameIsRunning){
        //     this.displayFirstNoteOfKey();
        // }
    }
}