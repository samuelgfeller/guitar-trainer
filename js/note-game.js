import {GameUI} from "./game-ui.js?v=5";
import {NotesProvider} from "./notes-provider.js?v=5";
import {TrebleClefDisplayer} from "./treble-clef-displayer.js?v=5";

// const notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
// const strings = ['D', 'E', 'G', 'A', 'B'];

class NoteGame {
    frequencyBars;
    previousCombination;
    previousCombinationWasIncorrect;
    // Challenging note combinations
    combinations = new Map();
    noteToPlay = null;
    correctCount = 0;
    incorrectCount = 0;
    // When a correct note is played, it should only be accounted once. The note-detected event may fire multiple
    // times for the same correct note
    correctNoteAccounted = false;
    currentCombinationIsChallenging = false;
    displayInTrebleClef = false;
    displayTrebleClefNoteName = false;

    constructor(gameStarter) {
        // Create class-level arrow function properties for event listeners so that they can be removed
        this.displayRandomNotesHandler = this.displayNotes.bind(this);
        this.checkIfNoteCorrectHandler = this.checkIfNoteCorrect.bind(this);
        this.notesProvider = new NotesProvider();
        this.gameUI = new GameUI(this);
        this.gameStarter = gameStarter;
        this.trebleClefDisplayer = new TrebleClefDisplayer(this);
    }

    init() {
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
            this.incorrectCount++;
            console.debug(`Combination ${this.previousCombination} not played.`)
            // Reset last correct notes in a row to 0 when there was an error
            this.gameUI.lastNotesCorrectCount = 0;
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

    displayNotes() {
        this.adjustIncorrectPreviousCombinationCount();
        this.gameUI.updateGameProgress();
        this.correctNoteAccounted = false;
        // console.debug(`Previous combination: ${this.previousCombination}`);
        // Reset color of note span
        document.querySelector('#note-span').style.color = null;
        document.querySelector('#string-span').style.color = null;
        document.querySelector('#detected-note').style.color = null;
        this.frequencyBars ? this.frequencyBars.canvasContext.fillStyle = 'grey' : null;

        // Display next note and string
        let {noteName, stringName} = this.prepareNextCombination();
        this.noteToPlay = noteName;

        // Set incorrect by default, changed to false if correct note was played (in highlightNoteIfCorrect)
        this.previousCombinationWasIncorrect = true;
        this.previousCombination = `${stringName}|${noteName}`;
    }

    checkIfNoteCorrect(event) {
        // Check if detected note is the correct one (includes as sharp / flats are the same semitone)
        let playedNote = event.detail.name;
        let [sharp, flat] = playedNote.includes(' | ') ? playedNote.split(' | ') : [playedNote, playedNote];
        // console.log(`noteToPlay: ${this.noteToPlay}\nSharp: ${sharp}\nFlat: ${flat}\n${this.noteToPlay === flat}`);
        if (this.noteToPlay === sharp || this.noteToPlay === flat) {
            document.querySelector('#note-span').style.color = 'green';
            // document.querySelector('#string-span').style.color = null;
            document.querySelector('#detected-note').style.color = 'green';
            // document.body.style.borderRight = '30px solid green';
            this.frequencyBars.canvasContext.fillStyle = 'green';
            // A correct note should only be accounted once but event listener catches same note multiple times
            if (!this.correctNoteAccounted) {
                // Combination was correct meaning that its count should be adjusted or removed if over 3 times correct
                this.adjustCombinationCorrectCount(this.previousCombination);
                // Mark that it was correct by setting value to false
                this.previousCombinationWasIncorrect = false;
                this.correctCount++;
                this.correctNoteAccounted = true;
                // Update game progress right when correct note was played
                if (this.combinations.size === 0) {
                    this.gameUI.lastNotesCorrectCount++;
                }
                this.gameUI.updateGameProgress();
            }
        } else {
            // If incorrect note is played, remove green color from frequency canvas and detected note
            document.querySelector('#detected-note').style.color = null;
            // if (this.currentCombinationIsChallenging) {
            //     this.frequencyBars.canvasContext.fillStyle = '#a96f00';
            // } else {
            //     this.frequencyBars.canvasContext.fillStyle = 'grey';
            // }
        }
        // Display the detected note in the GUI
        this.gameUI.updateDetectedNoteAndCents(event.detail);
    }


    /**
     * Displays random string and note returning the note
     * @return {{stringName: string, noteName: string}}
     */
    attemptToDisplayNextCombinationCount = 0;

    prepareNextCombination() {
        // If this function was already called more than 500 times, it is assumed, that it'd be stuck
        // in an infinite loop caused by the challenging note and next combination being the same or
        // other reasons that I may not have predicted yet.
        if (this.attemptToDisplayNextCombinationCount > 200) {
            this.notesProvider.incrementShuffledNotesIndex();
            console.debug(`There were over 200 failed attempts to display next combination. \n`
                + `The shuffled notes index was incremented.`);
            return this.prepareNextCombination();
        }
        let noteName, stringName, combination;

        let combinationsAmount = this.combinations.size;

        // Check if there are any combinations and increase likelihood of picking an element from the
        // combinations list as the number of elements increases
        // For one element, the likelihood is approximately 50%, and it approaches 100% as the number
        // of elements grows
        if (combinationsAmount > 0 && Math.random() < combinationsAmount / (combinationsAmount + 3)) {
            // Select a random combination note from the challenging combinations list
            const combinationIndex = Math.floor(Math.random() * this.combinations.size);
            combination = [...this.combinations.keys()][combinationIndex];
            [stringName, noteName] = combination.split('|');
            this.currentCombinationIsChallenging = true;
        } else {
            this.currentCombinationIsChallenging = false;
            combination = this.notesProvider.getNextNoteCombination();
            [stringName, noteName] = combination.split('|');
        }

        // Since we are mixing combinations from notesProvider and challenging combinations, there may be
        // same consecutive notes or half a tone appart on the same string, so it's tested here and
        // if it's the case the function is called again.
        if (this.previousCombination && this.notesProvider.isHalfToneDifference(this.previousCombination, combination)) {
            console.debug(`Previous combination ${this.previousCombination} and current ${combination}` +
                ` not over half a tone difference so a new combination is displayed. Challenging count: ${combinationsAmount}`);

            // To prevent infinite loops when e.g. the next note combination from note provider is A|D and the
            // only challenging note is also A|D, there is a count on how many times this function is called;
            // Once this count exceeds the given limit, the current combination is displayed regardless
            // if it's the same note on a different string or not half a tone appart
            this.attemptToDisplayNextCombinationCount++;
            if (this.attemptToDisplayNextCombinationCount > 200) {
                console.debug(`Next combination displayed even if not half tone appart or same note. Attempts over 200.`)
            } else {
                // Call function again to try to find a combination that is half a tone appart (in challenging or vice versa)
                return this.prepareNextCombination();
            }
        }
        if (this.currentCombinationIsChallenging === false) {
            // Otherwise and if combination stems from notesProvider, the index is incremented
            // or wrap around if necessary
            this.notesProvider.incrementShuffledNotesIndex();
        } else {
            // If challenging, display frequency bars in orange when challenging
            // this.frequencyBars.canvasContext.fillStyle = '#a96f00';
            // Display combination in orange when challenging
            document.getElementById('string-span').style.color = '#a96f00';
            document.getElementById('note-span').style.color = '#a96f00';
        }

        // Reset the attempts to display next combination counter
        this.attemptToDisplayNextCombinationCount = 0;
        this.displayCombination(stringName, noteName);
        console.debug(`Displaying ${this.currentCombinationIsChallenging ? `challenging ` : ``}combination ${combination}`);
        return {stringName: stringName, noteName: noteName};
    }

    displayCombination(stringName, noteName) {
        if (this.displayInTrebleClef === true) {
            this.trebleClefDisplayer.displayCombinationInTrebleClef(stringName, noteName);
        } else {
            document.getElementById('note-span').innerHTML = noteName;
        }
        document.getElementById('string-span').innerHTML = stringName;
    }

    presetChallengingNotes() {
        // Challenging combinations string|note
        let challengingCombinationsTrebleClef = ['E|E', 'E|F', 'E|F♯', 'E|G', 'E|G♯', 'E|A', 'E|A♯', 'E|B',
            'E|C♯', 'E|D', 'E|D♯', 'Ê|C♯', 'Ê|D', 'Ê|D♯', 'A|F♯', 'A|G', 'A|G♯', 'D|A♯', 'D|B',
            'D|C', 'D|C♯', 'G|D♯', 'G|E', 'G|F', 'G|F♯', 'B|G', 'B|G♯', 'B|A', 'B|A♯'];
        let challengingCombinations = ['E|C♯', 'Ê|D', 'E|D♯', 'A|F♯', 'A|G', 'A|G♯', 'D|A', 'D|A♯', 'D|B',
            'D|C', 'D|C♯', 'G|D♯', 'G|E', 'G|F', 'G|F♯', 'B|G', 'B|G♯', 'B|A', 'B|A♯'];
        if (this.displayInTrebleClef === true){
            challengingCombinations = challengingCombinationsTrebleClef;
        }
        challengingCombinations.forEach((combination) => {
            this.combinations.set(combination, {incorrect: 1, correct: 0});
        });
    }
}

export {NoteGame};
