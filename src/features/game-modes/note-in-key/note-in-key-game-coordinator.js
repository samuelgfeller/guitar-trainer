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

    constructor() {
    }


    play() {
        console.log('helloo');
        const noteInKeyGenerator = new NoteInKeyGenerator(this.possibleKeysOnStrings);
        let {keyString, keyNote} = noteInKeyGenerator.getNewStringAndKey();
        console.log(`Key String: ${keyString}, Key Note: ${keyNote}`);
        document.getElementById('info-above-string-and-key').innerText = `String: ${keyString}, Key: ${keyNote}`;
        noteInKeyGenerator.loadNotesAndStrings(keyString, keyNote);
        const noteDisplayCoordinator = new NoteDisplayPracticeCoordinator(noteInKeyGenerator);
        // Set first note to first note of the key
        noteDisplayCoordinator.displayNotes({stringName: keyString, noteName: {noteName: keyNote, number: 1}});

        noteDisplayCoordinator.beingGame();

        // Display random note number in key every 5 seconds
        // this.interval = setInterval(() => {
        //     const {stringToPlayNote, noteNumber} = this.generatator.getRandomNoteNumberInKey(notesAndStrings);
        //     console.log(`String: ${stringToPlayNote}, Note Number: ${noteNumber}`);
        //     NoteCombinationVisualizer.displayCombination(stringToPlayNote, noteNumber);
        // }, 5000);

    }

    stop() {
        clearInterval(this.interval);
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