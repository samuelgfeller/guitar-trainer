import {DetectedNoteVerifier} from "../../../features/detected-note/detected-note-verifier.js?v=1.5.0";
import {NoteDisplayer} from "../../game-core/ui/note-displayer.js?v=1.5.0";
import {GameProgressVisualizer} from "../../../features/game-core/game-progress/game-progress-visualizer.js?v=1.5.0";
import {NoteOnFretboardGenerator} from "./note-on-fretboard-generator.js?v=1.5.0";
import {NoteOnFretboardProgressUpdater} from "./note-on-fretboard-progress-updater.js?v=1.5.0";

/**
 * Note display coordinator when playing the "game" which
 * means with metronome rhythm, progress bar and challenging
 * notes.
 * One level more is a higher metronome beat.
 */
export class NoteOnFretboardNoteHandler {
    challengingCombinations = new Map();
    correctNoteCount = 0;
    previousCombination;

    // At the end of the progress bar, when there is no challenging notes left, the user has to do
    // x amount (default 10) correct notes in a row to be able to have 100% progress. More at level begin.
    endLevelRequiredCorrectNotesAmount = 10;
    levelBeginRequiredCorrectNotesAmount = 20;
    // This is a counter of those last notes.
    // It is incremented by the event handler on a detected correct note.
    consecutiveEndOfLevelCorrectNotes = 0;

    noteMaxTimeInMs;
    timerInterval;
    timerInMs = 0;
    challengingNoteHandled = false;

    constructor() {
        this.noteOnFretboardProgressUpdater = new NoteOnFretboardProgressUpdater(this);
        this.noteGenerator = new NoteOnFretboardGenerator();
        this.detectedNoteVerifier = new DetectedNoteVerifier();
        // Create class-level arrow function properties for event listeners so that they can be removed
        this.displayRandomNotesHandler = this.displayNotes.bind(this);
        // Event handler that checks if note is correct. Updates attributes and calls functions of this coordinator.
        this.checkIfNoteCorrectHandler = this.detectedNoteVerifier.checkIfNoteIsCorrect.bind(this.detectedNoteVerifier);
        this.correctNoteEventHandler = this.correctNoteHandler.bind(this);
        // Reset game progress when level is reset or leveled up
        this.resetGameProgressHandler = this.resetGameProgress.bind(this);
        this.levelCompletionEventListenerCleanupHandler =
            this.removeResetGameProgressEventListenerAfterLevelCompletion.bind(this);
    }

    beingGame() {
        console.log('begin game called')
        // Event when the correct note was played
        document.addEventListener('correct-note-played', this.correctNoteEventHandler);
        // Custom event when played note was detected
        document.addEventListener('note-detected', this.checkIfNoteCorrectHandler);
        // Event when game progress should be reset
        document.addEventListener('reset-game-progress', this.resetGameProgressHandler);
        // Add event listener that removes the reset game progress event listener after the level completion modal
        // is closed (either when going to the next level or restart the current one)
        document.addEventListener('remove-progress-reset-event-listener-after-level-completion',
            this.levelCompletionEventListenerCleanupHandler);
    }

    endGame() {
        console.log('removing da shit')
        document.removeEventListener('correct-note-played', this.correctNoteEventHandler);
        document.removeEventListener('note-detected', this.checkIfNoteCorrectHandler);
        clearInterval(this.timerInterval);
        // Reset game process event handler cannot be removed here because it's called from the level-up
        // or reset functions that are called after the game is stopped.
        // It's removed in the function removeResetGameProgressEventListenerAfterLevelCompletion()
    }


    /**
     * @param {object} strings strings as key and all notes of string as value
     */
    setAvailableStrings(strings) {
        this.noteGenerator.noteShuffler.setStringsAndNotes(
            strings,
            ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
        )

        // Full progress bar is the total of shuffled notes
        this.noteOnFretboardProgressUpdater.notesAmountForFullProgressBar = this.noteGenerator.noteShuffler.shuffleNotesList();
        this.updateProgress();
    }

    // Set in note-on-fretboard-initializer init and level change event handler
    setLevelValue(levelValue) {
        // round to nearest integer
        this.noteMaxTimeInMs = Math.round(60 / levelValue * 1000);
    }

    setTimerForNote() {
        // Start the timer
        // Update time every 100ms
        this.timerInterval = setInterval(() => {
            if (this.timerInMs > this.noteMaxTimeInMs && this.challengingNoteHandled === false) {
                this.handleChallengingNote();
            }
            this.timerInMs += 100;
        }, 100);
    }

    displayNotes(firstCall = false) {
        // If the progress bar is not full yet, display the next note combination instantly if it is the first call,
        // otherwise wait 500ms before displaying the next note combination
        if (this.correctNoteCount < this.noteOnFretboardProgressUpdater.notesAmountForFullProgressBar) {
            if (firstCall === true) {
                this.displayNoteCombination();
            } else {
                // Color spans and detected note in green when correct
                document.querySelector('#note-span').style.color = 'green';
                // Add fill="green" to the #treble-clef-output svg paths below <g class="vf-notehead">
                document.querySelectorAll('#treble-clef-output .vf-notehead path').forEach(path => {
                    path.setAttribute('fill', 'green');
                });
                // Display the next combination after showing green color for 500ms
                setTimeout(() => {
                    this.displayNoteCombination();
                }, 500);
            }
        }
    }

    displayNoteCombination() {
        this.challengingNoteHandled = false;
        this.updateProgress();

        // Reset correct note accounted
        this.detectedNoteVerifier.correctNoteAccounted = false;
        // console.debug(`Previous combination: ${this.previousCombination}`);

        // Reset color of note span
        NoteDisplayer.resetAllColors();
        // Get the next combination which is either a challenging combination or new one from the shuffled list,
        // and it should not be within half a tone of the previous combination
        let {stringName, noteName} = this.noteGenerator.getNextCombination(
            this.challengingCombinations,
            this.previousCombination
        );
        console.log(`Displaying combination ${stringName}|${noteName}`)
        // Display next note and string and if with treble clef
        NoteDisplayer.displayCombinationWithNoteName(stringName, noteName,
            document.querySelector('#fretboard-note-game-treble-clef input').checked,
            document.querySelector('#fretboard-note-game-treble-clef-and-name input').checked
        );
        // console.debug(`Displaying combination ${stringName}|${noteName}`);
        this.detectedNoteVerifier.noteToPlay = noteName;

        // Set incorrect by default, changed to false if correct note was played (in highlightNoteIfCorrect)
        this.previousCombination = `${stringName}|${noteName}`;
        this.timerInMs = 0;
        // Clear previous interval and set new one
        clearInterval(this.timerInterval);
        this.setTimerForNote();
    }

    /**
     * Update stats and progress on correct note
     */
    correctNoteHandler() {
        console.log('handling correct note event')
        // Combination was correct meaning that its count should be adjusted or removed if over 3 times correct
        this.adjustCombinationCorrectCount();
        this.correctNoteCount++;
        // Update game progress
        // If there are no combinations left to show, increase the consecutive end-of-level correct notes
        if (this.challengingCombinations.size === 0) {
            this.consecutiveEndOfLevelCorrectNotes++;
        }
        this.updateProgress();

        // Display new note combination
        this.displayNotes();
    }

    updateProgress() {
        this.noteOnFretboardProgressUpdater.updateProgressBar(this.correctNoteCount);
    }

    handleChallengingNote() {
        this.challengingNoteHandled = true;
        this.incorrectNoteCount++;
        // Reset consecutive end-of-level correct notes correct to 0 when there was an error
        // this.consecutiveEndOfLevelCorrectNotes = 0;
        NoteDisplayer.setNoteSpanColorToIndicateChallenging();

        let combinationStats = this.challengingCombinations.get(this.previousCombination);
        if (combinationStats) {
            combinationStats.incorrect += 1;

            // Add the number of times the combination was played correctly to the amount for full progress bar
            this.noteOnFretboardProgressUpdater.notesAmountForFullProgressBar += combinationStats.correct;

            // Reset to 0 after incorrect
            combinationStats.correct = 0;
        } else {
            // Create new combination stats object
            combinationStats = {incorrect: 1, correct: 0};
            this.challengingCombinations.set(this.previousCombination, combinationStats);
            // Add 3 to the
            this.noteOnFretboardProgressUpdater.notesAmountForFullProgressBar += 3;
        }
        this.updateProgress();
    }

    // Combination played correctly, add info to stat object to keep track of how many times challenging
    // note was played correctly in a row.
    adjustCombinationCorrectCount() {
        if (this.challengingCombinations.get(this.previousCombination)) {
            const combinationStats = this.challengingCombinations.get(this.previousCombination);
            if (combinationStats.correct >= 3) {
                this.challengingCombinations.delete(this.previousCombination);
                // Color string span to green to indicate that note was played correctly 3 times in a row
                document.querySelector('#string-span').style.color = 'green';
            } else if (this.challengingNoteHandled === false) {
                combinationStats.correct += 1;
                this.challengingCombinations.set(this.previousCombination, combinationStats);
            }
        }
    }


    /**
     * Reset game progress event handler cannot be removed at the end of the game as the
     * user clicks on "go to next level" in the modal box displayed after the game is stopped.
     * The same goes for restart, the progress should be reset after endGame() is called.
     */
    removeResetGameProgressEventListenerAfterLevelCompletion() {
        // Remove event listener after it's called once
        document.removeEventListener('reset-game-progress', this.resetGameProgressHandler);
        // Remove the handler that points to this function itself
        document.removeEventListener('remove-progress-reset-event-listener-after-level-completion',
            this.levelCompletionEventListenerCleanupHandler);
    }

    resetGameProgress() {
        this.challengingCombinations = new Map();
        this.noteOnFretboardProgressUpdater.maxWrongCombinations = 0;
        this.incorrectNoteCount = 0;
        this.correctNoteCount = 0;
        this.consecutiveEndOfLevelCorrectNotes = 0;
        GameProgressVisualizer.hideProgress();
        console.log('reset game progress called fretboard')
    }
}