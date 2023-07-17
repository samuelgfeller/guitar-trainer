const notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const strings = ['D', 'E', 'G', 'A', 'B'];
//
class NoteGame {
    constructor() {
        this.noteName = null;

        // Note combinations
        this.combinations = new Map();
        this.previousIncorrectCombination = false;
    }

    start() {
        // Event fired on each metronome beat
        document.addEventListener('metronome-beat', this.displayRandomNotes.bind(this));
        // Custom event when played note was detected
        document.addEventListener('note-detected', this.highlightNoteIfCorrect.bind(this));
    }

    stop() {
        document.removeEventListener('metronome-beat', this.displayRandomNotes.bind(this));
        document.removeEventListener('note-detected', this.highlightNoteIfCorrect.bind(this));
    }

    // Adjust the count of the previous combination that was incorrect
    adjustIncorrectPreviousCombinationCount() {
        const combination = this.previousIncorrectCombination;
        // If combination was wrong last time
        if (combination) {
            let combinationStats = this.combinations.get(combination);
            if (combinationStats) {
                combinationStats.incorrect += 1;
                // Reset to 0 after incorrect
                combinationStats.correct = 0;
            } else {
                // Create new combination stats object
                combinationStats = {
                    incorrect: 1,
                    correct: 0,
                };
                this.combinations.set(combination, combinationStats);
            }
        }
    }

    // Combination played correctly
    adjustCombinationCorrectCount(combination) {
        if (this.combinations.get(combination)) {
            const combinationStats = this.combinations.get(combination);
            if (combinationStats.correct >= 3) {
                this.combinations.delete(combination);
            } else {
                combinationStats.correct += 1;
                this.combinations.set(combination, combinationStats);
            }
        }
    }

    displayRandomNotes() {
        this.adjustIncorrectPreviousCombinationCount();
        console.log(this.combinations);
        // Reset color of note span
        // document.querySelector('#note-span').style.color = null;
        document.body.style.background = null;

        // Display random note and string
        let {noteName, stringName} = this.displayRandomNote();
        this.noteName = noteName;

        // Set incorrect by default, changed to false if correct note was played (in highlightNoteIfCorrect)
        this.previousIncorrectCombination = `${noteName}|${stringName}`;
    }

    highlightNoteIfCorrect(event) {
        // Check if detected note is the correct one
        if (this.noteName === event.detail.name) {
            // document.querySelector('#note-span').style.color = 'green';
            document.body.style.background = 'green';
            // Combination was correct meaning that its count should be adjusted or removed if over 3 times correct
            this.adjustCombinationCorrectCount(this.previousIncorrectCombination);
            // Mark that it was correct by setting value to false
            this.previousIncorrectCombination = false;
        }
    }

    getRandomElement(array) {
        // Helper function to get a random element from an array
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    /**
     * Displays random string and note returning the note
     * @return {{stringName: string, noteName: string}}
     */
    displayRandomNote() {
        let noteName, stringName;

        let combinationsAmount = this.combinations.size

        // Check if there are any combinations and increase likelihood of picking an element from the
        // combinations list as the number of elements increases
        // For one element, the likelihood is approximately 50%, and it approaches 100% as the number
        // of elements grows
        if (combinationsAmount > 0 && Math.random() < combinationsAmount / (combinationsAmount + 3)) {
            // Select a random combination note from the combinations list
            const combinationIndex = Math.floor(Math.random() * this.combinations.size);
            const combinationKey = [...this.combinations.keys()][combinationIndex];
            [noteName, stringName] = combinationKey.split('|');
        } else {
            // Select a fully random note and string
            noteName = this.getRandomElement(notes);
            stringName = this.getRandomElement(strings);
        }

        document.getElementById('note-span').innerHTML = noteName;
        document.getElementById('string-span').innerHTML = stringName;
        return {noteName: noteName, stringName: stringName};
    }
}

export {NoteGame};
