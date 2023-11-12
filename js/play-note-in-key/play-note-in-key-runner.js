/**
 * Class PlayNoteInKeyRunner
 */
class PlayNoteInKeyRunner {
    string;
    key;

    constructor(noteGame, notesProvider) {
        this.noteGame = noteGame;
    }

    possibleKeys = {
        // String name: [possible keys for string]
        'E': ['E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'C'],
        'A': ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F'],
    };

    /**
     * Return random string and random key from that string
     */
    reloadStringAndKey() {
        const strings = Object.keys(this.possibleKeys);
        this.string = strings[Math.floor(Math.random() * strings.length)];
        // Keys for given string
        const keys = this.possibleKeys[this.string];
        // Get random key from possible keys for string
        this.key = keys[Math.floor(Math.random() * keys.length)];
        console.log(`Key String: ${this.string}, Key Note: ${this.key}`);
    }

    displayRandomNoteNumberInKey() {
        // Random note between 1 and 7
        const noteNumber = Math.floor(Math.random() * 7) + 1;
        const strings = Object.keys(this.possibleKeys);
        const stringToPlayNote = strings[Math.floor(Math.random() * strings.length)];

        console.log(`String: ${stringToPlayNote}, Note Number: ${noteNumber}`);
    }

    /**
     * game manager
     */
    runGame() {
        this.reloadStringAndKey();
        // Display random note number in key every 5 seconds
        setInterval(() => {
            this.displayRandomNoteNumberInKey();
        }, 5000);
    }

}