import {NoteInKeyGameNoGuitar} from "./note-in-key-game-no-guitar.js?v=2.3.2";
import {NoteInKeyGameInitializer} from "./note-in-key-game-initializer.js?v=2.3.2";

export class NoteInKeyGameCoordinator {
    string;
    key;

    // Class responsible for displaying the note and the string with all the verification and progress logic
    /** @var {NoteInKeyNoteHandler} */
    noteHandler;
    // Instance created in initialization
    noteInKeyGenerator;

    gameIsRunning = false;

    timer = 0;
    timerInterval = null;

    constructor() {
        // Setup this game mode
        this.noteInkeyGameInitializer = new NoteInKeyGameInitializer(this);

        this.noteInkeyGameInitializer.initNoteInKeyGame();
    }

    play() {
        this.gameIsRunning = true;

        // Show current key and string
        document.querySelector('#current-key-and-string').style.display = 'block';

        // After the correct number has been played, replace number with note name - or not
        this.noteHandler.detectedNoteVerifier.displayCorrectNoteName = false;

        // Manually call displayNotes because the first combination should be the note of the key
        this.displayFirstNoteOfKey();

        // Init event listeners that will automatically call displayNotes() when correct note has been played
        this.noteHandler.beingGame();

        // Start no guitar game if no guitar option is checked
        NoteInKeyGameNoGuitar.playNoGuitarNoteInKey(this.noteInKeyGenerator.diatonicNotesOnStrings, this.keyString, this.keyNote);

        document.querySelector('#scale-roadmaps').style.display = 'none';

        // Start the timer
        this.timerInterval = setInterval(() => {
            this.timer += 1;
        }, 1000);
    }

    stop() {
        // Pause timer
        clearInterval(this.timerInterval);

        this.noteHandler?.endGame();
        this.gameIsRunning = false;
        // Hide current key and string
        document.querySelector('#current-key-and-string').style.display = 'none';
        if (document.querySelector('#virtual-fretboard')) {
            document.querySelector('#virtual-fretboard').style.display = 'none';
        }
        document.querySelector('#scale-roadmaps').style.display = null;
    }

    destroy() {
        this.noteInkeyGameInitializer.destroy();
        this.noteHandler.destroy();
        NoteInKeyGameNoGuitar.destroyNoGuitarGameOption();
    }

    /**
     * Manually call displayNotes because the first combination should be the note of the key
     */
    displayFirstNoteOfKey() {
        // Manually call displayNotes because the first combination should be the note of the key
        this.noteHandler.displayNotes({
            stringName: this.keyString,
            noteName: {noteName: this.keyNote, number: 1}
        }, true);
    }

    reloadKeyAndString(newKey = true) {
        console.log('reload key and string in note in key game');

        // Reset selected fretboard pattern
        this.noteInKeyGenerator.selectedFretboardPattern = null;

        // Get new string and key if newKey is truthy (either false on level restart or event object on key change)
        if (newKey !== false) {
            const {keyString, keyNoteObject} = this.noteInKeyGenerator.getNewStringAndKey();
            this.keyString = keyString;
            this.keyNote = keyNoteObject.noteName;
            this.KeyNoteObject = keyNoteObject;
        }

        // Prepare the attribute containing the notes on strings that may be displayed (diatonic to key, difficulty)
        this.noteInKeyGenerator.loadShuffledCombinations(this.keyString, this.KeyNoteObject);
        console.log('key reloaded');
        // Display current key and string
        document.getElementById('current-key-and-string').innerHTML =
            `String: <b>${this.keyString}</b> Key: <b>${this.keyNote}</b>`;
        document.dispatchEvent(new Event('reset-game-progress'));
    }
}