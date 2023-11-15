// const notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
// const strings = ['D', 'E', 'G', 'A', 'B'];

import {NoteDisplayCoordinator} from "../../note-combination/note-display-coordinator.js?v=0.6";
import {FretboardGameChallengingNotesProvider} from "./fretboard-game-challenging-notes-provider.js?v=0.6";
import {NoteCombinationGenerator} from "../../note-combination/note-combination-generator.js";

/**
 * Game mode "note-on-fretboard" core logic
 */
export class FretboardNoteGameCoordinator {
    noteDisplayCoordinator;


    /**
     * Start fretboard note game
     */
    play() {
        this.noteDisplayCoordinator = new NoteDisplayCoordinator(
            new NoteCombinationGenerator(
                ['Ê', 'B', 'G', 'D', 'A', 'E'],
                ['C', 'C♯', 'D', 'D♭', 'D♯', 'E', 'E♭', 'F', 'F♯', 'G', 'G♭', 'G♯', 'A', 'A♭', 'A♯', 'B', 'B♭'],
            )
        );


        // Add challenging combinations (if checkbox checked)
        if (document.querySelector('#challenging-notes-preset input').checked) {
            const getTrebleClefChallengingNotes = document.querySelector('#display-in-treble-clef input').checked;
            this.noteDisplayCoordinator.challengingCombinations =
                FretboardGameChallengingNotesProvider.getChallengingNotes(getTrebleClefChallengingNotes);
        }

        this.noteDisplayCoordinator.beingGame()
    }

    stop() {
        this.noteDisplayCoordinator.endGame();
    }
}

