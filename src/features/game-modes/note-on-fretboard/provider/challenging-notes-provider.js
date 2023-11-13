export class ChallengingNotesProvider {

    constructor() {
    }

    /**
     * Get challenging notes
     *
     * @param {boolean} displayInTrebleClef
     * @return {Map<any, any>}
     */
    getChallengingNotes(displayInTrebleClef) {
        if (document.querySelector('#challenging-notes-preset input').checked) {

            // Challenging combinations string|note
            let challengingCombinationsTrebleClef = ['E|E', 'E|F', 'E|F♯', 'E|G', 'E|G♯', 'E|A', 'E|A♯', 'E|B',
                'E|C♯', 'E|D', 'E|D♯', 'Ê|C♯', 'Ê|D', 'Ê|D♯', 'A|F♯', 'A|G', 'A|G♯', 'D|A♯', 'D|B',
                'D|C', 'D|C♯', 'G|D♯', 'G|E', 'G|F', 'G|F♯', 'B|G', 'B|G♯', 'B|A', 'B|A♯'];
            let challengingCombinations = ['E|C♯', 'Ê|D', 'E|D♯', 'A|F♯', 'A|G', 'A|G♯', 'D|A', 'D|A♯', 'D|B',
                'D|C', 'D|C♯', 'G|D♯', 'G|E', 'G|F', 'G|F♯', 'B|G', 'B|G♯', 'B|A', 'B|A♯'];
            if (displayInTrebleClef === true) {
                challengingCombinations = challengingCombinationsTrebleClef;
            }
            let combinations = new Map();
            challengingCombinations.forEach((combination) => {
                combinations.set(combination, {incorrect: 1, correct: 0});
            });
            return combinations;
        }
        return new Map();
    }
}