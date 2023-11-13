import {NotesProvider} from "../notes-provider.js?v=0.6";

class TestNotesProvider {
    constructor() {
        this.notesProvider = new NotesProvider();
    }

    testSetNotesList() {
        // Check if the notesList has been populated with the correct number of combinations
        const expectedCombinations = 55; // 5 strings * 12 notes
        const actualCombinations = this.notesProvider.notesList.length;
        console.log(`Number of combinations in notesList: ${actualCombinations}`);
        console.log(`Expected combinations: ${expectedCombinations}`);
        console.log(`Notes list is correct: ${actualCombinations === expectedCombinations}`);
    }

    testShuffleNotes() {
        // Check if the shuffledNotes array has the correct number of combinations
        const expectedCombinations = 55; // 5 strings * 12 notes
        const actualCombinations = this.notesProvider.shuffledNotes.length;
        console.log(this.notesProvider.shuffledNotes);
        console.log(`Number of combinations in shuffledNotes: ${actualCombinations}`);
        console.log(`Expected combinations: ${expectedCombinations}`);
        console.log(`Shuffled notes array is correct: ${actualCombinations === expectedCombinations}`);

        // Check if there are no succeeding notes that are the same or half a tone higher or lower
        let isValid = true;
        for (let i = 0; i < this.notesProvider.shuffledNotes.length - 1; i++) {
            const currentNote = this.notesProvider.shuffledNotes[i];
            const nextNote = this.notesProvider.shuffledNotes[i + 1];
            if (this.notesProvider.isHalfToneDifference(currentNote, nextNote) || currentNote === nextNote) {
                isValid = false;
                break;
            }
        }
        console.log(`Shuffled notes are valid: ${isValid}`);
    }

    runTests() {
        console.log('Running tests...');
        this.testSetNotesList();
        this.testShuffleNotes();
        console.log('Tests completed.');
    }
}

export {TestNotesProvider}
