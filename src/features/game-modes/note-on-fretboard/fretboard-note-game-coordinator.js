// const notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
// const strings = ['D', 'E', 'G', 'A', 'B'];

import {GameNoteDisplayer} from "../../game-note-combination/game-note-displayer.js?v=489";
import {FretboardGameChallengingNotesProvider} from "./fretboard-game-challenging-notes-provider.js?v=489";
import {FretboardNoteGameCombinationGenerator} from "./fretboard-note-game-combination-generator.js?v=489";
import {FretboardNoteGameInitializer} from "./fretboard-note-game-initializer.js?v=489";

/**
 * Game mode "note-on-fretboard" core logic
 */
export class FretboardNoteGameCoordinator {
    noteDisplayer;

    constructor() {
        // Is initialized in core game coordinator
        this.fretboardNoteGameInitializer = new FretboardNoteGameInitializer();
        // Setup game components
        this.fretboardNoteGameInitializer.init();
        // Create note displayer on note game coordinator init and not play() so that game can be paused and resumed
        this.noteDisplayer = new GameNoteDisplayer(
            new FretboardNoteGameCombinationGenerator(
                ['E2', 'B', 'G', 'D', 'A', 'E'],
                ['C', 'C♯', 'D', 'D♭', 'D♯', 'E', 'E♭', 'F', 'F♯', 'G', 'G♭', 'G♯', 'A', 'A♭', 'A♯', 'B', 'B♭'],
            )
        );
    }

    destroy(){
        this.fretboardNoteGameInitializer.destroy();
    }

    /**
     * Start fretboard note game
     // * @param {GameNoteDisplayer} noteDisplayerInstance instance provided if game was paused
     */
    play() {
        // Add challenging combinations (if checkbox checked)
        if (document.querySelector('#challenging-notes-preset input').checked) {
            const getTrebleClefChallengingNotes = document.querySelector('#fretboard-note-game-treble-clef input').checked;
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

