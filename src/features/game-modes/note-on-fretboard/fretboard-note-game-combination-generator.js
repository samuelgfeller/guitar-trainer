import {NoteShuffler} from "../../shuffler/note-shuffler.js?v=1.0.2";
import {NoteCombinationVisualizer} from "../../game-core/game-ui/note-combination-visualizer.js?v=1.0.2";

export class FretboardNoteGameCombinationGenerator {
    constructor(strings, notes) {
        this.noteShuffler = new NoteShuffler(strings, notes);
    }

    /**
     * Displays random string and note returning the note
     * @return {{stringName: string, noteName: string}}
     */
    attemptToDisplayNextCombinationCount = 0;

    /**
     * Returns the next combination that should be displayed
     * and changes the colors of the spans when challenging
     *
     * @param combinations combination that should be displayed
     * @param previousCombination previous combination that was displayed
     * @return {*|{stringName: *, noteName: *}}
     */
    getNextCombination(combinations, previousCombination) {
        // If this function was already called more than 200 times, it's assumed that it'd be stuck
        // in an infinite loop caused by the challenging note and next combination being the same or
        // other reasons that I may not have predicted.
        if (this.attemptToDisplayNextCombinationCount > 200) {
            this.noteShuffler.incrementShuffledCombinationsIndex();
            console.debug(`There were over 200 failed attempts to display next combination. \n`
                + `The shuffled notes index was incremented.`);
            return this.getNextCombination(combinations, previousCombination);
        }
        let noteName, stringName, combination;

        let combinationAmount = combinations.size;

        // if the current combination is shown more often because it was played
        // wrongly, it's considered challenging and the index of the shuffled notes is not incremented
        let currentCombinationIsChallenging = false;

        // Check if there are any combinations and increase the likelihood of picking an element from the
        // combination list as the number of elements increases.
        // For one element, the likelihood is approximately 50%, and it approaches 100% as the number
        // of elements grows
        if (combinationAmount > 0 && Math.random() < combinationAmount / (combinationAmount + 3)) {
            // Select a random combination note from the challenging combinations list
            const combinationIndex = Math.floor(Math.random() * combinations.size);
            // console.log('combinations keys:', [...combinations.keys()])
            combination = [...combinations.keys()][combinationIndex];
            [stringName, noteName] = combination.split('|');
            currentCombinationIsChallenging = true;
        } else {
            currentCombinationIsChallenging = false;
            combination = this.noteShuffler.getNextNoteCombination();
            [stringName, noteName] = combination.split('|');
        }

        // Since we are mixing combinations from notesProvider and challenging combinations, there may be
        // same consecutive notes or half a tone appart on the same string, so it's tested here and
        // if it's the case, the function is called again.
        if (previousCombination && this.noteShuffler.isHalfToneDifference(previousCombination, combination)) {
            console.debug(`Previous combination ${previousCombination} and current ${combination}` +
                ` not over half a tone difference so a new combination is displayed. Challenging count: ${combinationAmount}`);

            // To prevent infinite loops when e.g. the next note combination from note provider is A|D and the
            // only challenging note is also A|D, there is a count on how many times this function is called;
            // Once this count exceeds the given limit, the current combination is displayed regardless
            // if it's the same note on a different string or not half a tone appart
            this.attemptToDisplayNextCombinationCount++;
            if (this.attemptToDisplayNextCombinationCount > 200) {
                console.debug(`Next combination displayed even if not half tone appart or same note. Attempts over 200.`)
            } else {
                // Call function again to try to find a combination that is half a tone appart (in challenging or vice versa)
                return this.getNextCombination(combinations, previousCombination);
            }
        }
        if (currentCombinationIsChallenging === false) {
            // Otherwise and if the combination stems from noteShuffler, the index is incremented
            // or wrapped around if necessary
            this.noteShuffler.incrementShuffledCombinationsIndex();
        } else {
            // Color spans to orange
            NoteCombinationVisualizer.setNoteSpanColorToIndicateChallenging();
        }

        // Reset the attempts to display next combination counter
        this.attemptToDisplayNextCombinationCount = 0;
        return {stringName: stringName, noteName: noteName};
    }
}