import {NoteInKeyGameInitializer} from "./note-in-key-game-initializer.js?v=1.1.2";

export class NoteInKeyGameCoordinator {
    string;
    key;

    // Class responsible for displaying the note and the string with all the verification and progress logic
    noteDisplayer;
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
        this.noteDisplayer.detectedNoteVerifier.displayCorrectNoteName = false;

        // Manually call displayNotes because the first combination should be the note of the key
        this.displayFirstNoteOfKey();

        // Init event listeners that will automatically call displayNotes() when correct note has been played
        this.noteDisplayer.beingGame();
        // Start the timer
        this.timerInterval = setInterval(() => {
            this.timer += 1;
        }, 1000);
    }

    stop() {
        // Pause timer
        clearInterval(this.timerInterval);

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
        this.noteInKeyGenerator.loadShuffledCombinations(keyString, keyNote);
        console.log('key reloaded');
        // Display current key and string
        document.getElementById('current-key-and-string').innerHTML =
            `String: <b>${this.keyString}</b> Key: <b>${this.keyNote}</b>`;
        document.dispatchEvent(new Event('reset-game-progress'));
    }
}