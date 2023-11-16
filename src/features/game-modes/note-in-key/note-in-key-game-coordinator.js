import {NoteInKeyGenerator} from "./note-in-key-generator.js";
import {NoteDisplayPracticeCoordinator} from "../../note-combination/note-display-practice-coordinator.js";

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

    noteDisplayCoordinator;


    constructor() {
    }


    play() {
        // Always check the practice mode input as there is no function to test note in key game
        document.querySelector('#practice-mode input').checked = true;

        const noteInKeyGenerator = new NoteInKeyGenerator(this.possibleKeysOnStrings);
        let {keyString, keyNote} = noteInKeyGenerator.getNewStringAndKey();
        console.log(`Key String: ${keyString} Key Note: ${keyNote}`);

        document.getElementById('info-above-string-and-key').innerHTML =
            `<img src="src/assets/images/reload-icon.svg" class="icon" alt="reload" id="reload-key-btn">String: <b>${keyString}</b> Key: <b>${keyNote}</b>`;

        document.getElementById('reload-key-btn').addEventListener('click', () => {
            document.dispatchEvent(new Event('gameStop'));
            // let {keyString, keyNote} = noteInKeyGenerator.getNewStringAndKey();
            // noteInKeyGenerator.loadNotesAndStrings(keyString, keyNote);
            document.dispatchEvent(new Event('gameStart'));
        });

        noteInKeyGenerator.loadNotesAndStrings(keyString, keyNote);
        this.noteDisplayCoordinator = new NoteDisplayPracticeCoordinator(noteInKeyGenerator);
        this.noteDisplayCoordinator.detectedNoteVerifier.displayCorrectNoteName = true;
        // Set first note to first note of the key
        this.noteDisplayCoordinator.displayNotes({stringName: keyString, noteName: {noteName: keyNote, number: 1}});

        this.noteDisplayCoordinator.beingGame();

        // Display random note number in key every 5 seconds
        // this.interval = setInterval(() => {
        //     const {stringToPlayNote, noteNumber} = this.generatator.getRandomNoteNumberInKey(notesAndStrings);
        //     console.log(`String: ${stringToPlayNote}, Note Number: ${noteNumber}`);
        //     NoteCombinationVisualizer.displayCombination(stringToPlayNote, noteNumber);
        // }, 5000);

    }

    stop() {
        this.noteDisplayCoordinator.endGame();
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