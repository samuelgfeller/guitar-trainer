import {FretboardNoteGameInitializer} from "./fretboard-note-game-initializer.js?v=2.0.5";
import {
    NoteOnFretboardNoteHandler
} from "../../../components/game-modes/note-on-fretboard/note-on-fretboard-note-handler.js?v=2.0.5";

/**
 * Game mode "note-on-fretboard" core logic
 */
export class FretboardNoteGameCoordinator {
    // Create note displayer on note game coordinator init and not play() so that game can be paused and resumed
    /** @var {NoteOnFretboardNoteHandler} */
    noteOnFretboardNoteHandler = new NoteOnFretboardNoteHandler();

    constructor() {
        // Is initialized in core game coordinator
        this.fretboardNoteGameInitializer = new FretboardNoteGameInitializer(this);
        // Setup game components
        this.fretboardNoteGameInitializer.init();

    }

    destroy(){
        this.fretboardNoteGameInitializer.destroy();
        this.noteOnFretboardNoteHandler.destroy();
    }

    /**
     * Start fretboard note game
     // * @param {GameNoteDisplayer} noteDisplayerInstance instance provided if game was paused
     */
    play() {
        // Add challenging combinations (if checkbox checked)
        if (document.querySelector('#challenging-notes-preset input').checked) {
            const getTrebleClefChallengingNotes = document.querySelector('#fretboard-note-game-treble-clef input').checked;
            // this.noteDisplayer.challengingCombinations =
            //     FretboardGameChallengingNotesProvider.getChallengingNotes(getTrebleClefChallengingNotes);
        }

        this.noteOnFretboardNoteHandler.beingGame();
        this.noteOnFretboardNoteHandler.displayNotes(true);
    }

    stop() {
        // game stop event which calls this function may be called before game start (e.g. when levels are changed)
        if (this.noteOnFretboardNoteHandler) {
            this.noteOnFretboardNoteHandler.endGame();
        }
    }

}

