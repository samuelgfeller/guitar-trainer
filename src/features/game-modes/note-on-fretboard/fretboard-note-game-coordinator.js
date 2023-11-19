// const notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
// const strings = ['D', 'E', 'G', 'A', 'B'];

import {GameNoteDisplayer} from "../../game-note-combination/game-note-displayer.js?v=0.6";
import {FretboardGameChallengingNotesProvider} from "./fretboard-game-challenging-notes-provider.js?v=0.6";
import {FretboardNoteGameCombinationGenerator} from "./fretboard-note-game-combination-generator.js";
import {FretboardNoteGameInitializer} from "./fretboard-note-game-initializer.js";

/**
 * Game mode "note-on-fretboard" core logic
 */
export class FretboardNoteGameCoordinator {
    noteDisplayer;

    constructor() {
        // Is initialized in core game coordinator
        this.fretboardNoteGameInitializer = new FretboardNoteGameInitializer();
    }


    /**
     * Start fretboard note game
     * @param {GameNoteDisplayer} noteDisplayerInstance instance provided if game was paused
     */
    play(noteDisplayerInstance) {
        if (!noteDisplayerInstance) {
            this.noteDisplayer = new GameNoteDisplayer(
                new FretboardNoteGameCombinationGenerator(
                    ['Ê', 'B', 'G', 'D', 'A', 'E'],
                    ['C', 'C♯', 'D', 'D♭', 'D♯', 'E', 'E♭', 'F', 'F♯', 'G', 'G♭', 'G♯', 'A', 'A♭', 'A♯', 'B', 'B♭'],
                )
            );
        }

        // Add challenging combinations (if checkbox checked)
        if (document.querySelector('#challenging-notes-preset input').checked) {
            const getTrebleClefChallengingNotes = document.querySelector('#display-in-treble-clef input').checked;
            this.noteDisplayer.challengingCombinations =
                FretboardGameChallengingNotesProvider.getChallengingNotes(getTrebleClefChallengingNotes);
        }

        this.noteDisplayer.beingGame()
    }

    stop() {
        // game stop event which calls this function may be called before game start (e.g. when levels are changed)
        if (this.noteDisplayer) {
            this.noteDisplayer.endGame();
        }
    }

}

