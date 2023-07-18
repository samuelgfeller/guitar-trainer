const notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const strings = ['D', 'E', 'G', 'A', 'B'];

class NoteGame {
    frequencyBars;
    previousCombination;
    previousCombinationWasIncorrect;
    // Challenging note combinations
    combinations = new Map();
    noteToPlay = null;

    constructor() {
        // Create class-level arrow function properties for event listeners so that they can be removed
        this.displayRandomNotesHandler = this.displayRandomNotes.bind(this);
        this.checkIfNoteCorrectHandler = this.checkIfNoteCorrect.bind(this);
    }

    start() {
      // Event fired on each metronome beat
      document.addEventListener('metronome-beat', this.displayRandomNotesHandler);
      // Custom event when played note was detected
      document.addEventListener('note-detected', this.checkIfNoteCorrectHandler);
    }

    stop() {
      document.removeEventListener('metronome-beat', this.displayRandomNotesHandler);
      document.removeEventListener('note-detected', this.checkIfNoteCorrectHandler);
    }

    // Adjust the count of the previous combination that was incorrect
    adjustIncorrectPreviousCombinationCount() {
        // If combination was wrong last time
        if (this.previousCombinationWasIncorrect) {
            let combinationStats = this.combinations.get(this.previousCombination);
            if (combinationStats) {
                combinationStats.incorrect += 1;
                // Reset to 0 after incorrect
                combinationStats.correct = 0;
            } else {
                // Create new combination stats object
                combinationStats = {incorrect: 1, correct: 0};
                this.combinations.set(this.previousCombination, combinationStats);
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
        document.querySelector('#note-span').style.color = null;
        document.querySelector('#detected-note').style.color = null;
        this.frequencyBars ? this.frequencyBars.canvasContext.fillStyle = 'grey' : null;

        // Display random note and string
        let {noteName, stringName} = this.displayRandomNote();
        this.noteToPlay = noteName;

        // Set incorrect by default, changed to false if correct note was played (in highlightNoteIfCorrect)
        this.previousCombinationWasIncorrect = true;
        this.previousCombination = `${stringName}|${noteName}`;
    }

    checkIfNoteCorrect(event) {
        // Check if detected note is the correct one
        if (this.noteToPlay === event.detail.name) {
            document.querySelector('#note-span').style.color = 'green';
            document.querySelector('#detected-note').style.color = 'green';
            // document.body.style.borderRight = '30px solid green';
            this.frequencyBars.canvasContext.fillStyle = 'green';
            // Combination was correct meaning that its count should be adjusted or removed if over 3 times correct
            this.adjustCombinationCorrectCount(this.previousCombination);
            // Mark that it was correct by setting value to false
            this.previousCombinationWasIncorrect = false;
        } else {
            // If incorrect note is played, remove green color from frequency canvas and detected note
            document.querySelector('#detected-note').style.color = null;
            this.frequencyBars.canvasContext.fillStyle = 'grey';
        }
        // Display the detected note in the GUI
        this.updateDetectedNoteAndCents(event.detail);
    }

    updateDetectedNoteAndCents(noteInfos) {
        const detectedNote = document.querySelector('#detected-note');
        detectedNote.innerHTML = noteInfos.name;
        // Convert the cent value to a percentage for the bar width
        const percentage = Math.abs(noteInfos.cents) / 2;

        if (noteInfos.cents < 0) {
            detectedNote.style.setProperty('--left-bar-width', `${percentage}vw`);
            detectedNote.style.setProperty('--right-bar-width', '0');
        } else if (noteInfos.cents > 0) {
            detectedNote.style.setProperty('--left-bar-width', '0');
            detectedNote.style.setProperty('--right-bar-width', `${percentage}vw`);
        } else {
            detectedNote.style.setProperty('--left-bar-width', '0');
            detectedNote.style.setProperty('--right-bar-width', '0');
        }

        // Set the width of the bar based on the cent value and its sign
        detectedNote.setAttribute('data-cent', noteInfos.cents); // Set the cent value as a data attribute

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
            [stringName, noteName] = combinationKey.split('|');
            // Display frequency bars in orange when challenging
            this.frequencyBars.canvasContext.fillStyle = '#a96f00';
        } else {
            // Select a fully random note and string
            noteName = this.getRandomElement(notes);
            stringName = this.getRandomElement(strings);
        }

        // If the same note was played previously, display another combination as the tuner may detect the
        // correct note even if it wasn't played this time.
        if (this.previousCombination) {
            const [previousStringName, previousNoteName] = this.previousCombination.split('|');
            if (previousNoteName === noteName) {
                // Call itself to show another note
                return this.displayRandomNote();
            }
        }

        document.getElementById('note-span').innerHTML = noteName;
        document.getElementById('string-span').innerHTML = stringName;
        return {stringName: stringName, noteName: noteName};
    }
}

export {NoteGame};
