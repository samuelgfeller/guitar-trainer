export class ArrayShuffler {
    static reShuffleAttempts = 0;
    static maxReShuffleAttempts = 20;

    // Attempts of how many times a new index is tried to be found that is not adjacent or equal to the previous one
    static newIndexAttempts = 0;
    static maxNewIndexAttempts = 50;
    static bestShuffle = [];

    static shuffledArray = [];
    static remainingElements = [];
    static previousElement = null;
    static array = [];
    static abortedLastShuffle = false;
    // Best shuffle score
    static bestShuffleScore = 0;

    /**
     * Shuffles an array ensuring that two indexes that were adjacent before are not adjacent after shuffling.
     * If it encounters two adjacent elements, it tries to reshuffle the entire array up to x times.
     * If after x attempts, there are still adjacent elements, it adds the remaining elements to the shuffled array.
     *
     * @param {Array} array - The array to shuffle.
     * @param {Array} previousCombination forbidden first combination
     * @return {Array} - The shuffled array.
     */
    static shuffleArray(array, previousCombination) {
        this.array = array;
        // Initialize the shuffled array and a copy of the original array
        this.remainingElements = [...array];
        this.newIndexAttempts = 0;
        // Set previous element to given or null
        this.previousElement = previousCombination ?? null;

        // While there are elements in the remainingElements array
        while (this.remainingElements.length > 0) {
            // Check if the current element is adjacent to the previous one and add it to the shuffled array
            // If the function was unable to add an element that isn't adjacent or equal to the previous one,
            // false is returned
            if (this.checkAndAddElementToArray() === false) {
                // Store the number of shuffled elements in the shuffledArray

                // Store best shuffle if it's better than the previous one
                if (this.shuffledArray.length > this.bestShuffleScore) {
                    this.bestShuffleScore = this.shuffledArray.length;

                    // Add the remaining elements to the shuffled array
                    this.shuffledArray.push(...this.remainingElements);
                    // Store current shuffle as it's the best one so far
                    this.bestShuffle = [...this.shuffledArray];
                    this.shuffledArray = [];

                    this.abortedLastShuffle = true;
                }

                // Reset instance variables
                this.newIndexAttempts = 0;
                this.shuffledArray = [];
                this.remainingElements = [...this.array];

                // If the current element is adjacent to the previous one and the reshuffle attempts are less than x,
                // try to reshuffle the entire array
                if (this.reShuffleAttempts < this.maxReShuffleAttempts) {
                    this.reShuffleAttempts++;
                    return this.shuffleArray(array, previousCombination);
                }
                // Break out of the loop if already max times reshuffled
                else {
                    break;
                }
            }
        }

        console.debug(`Shuffled array (re-shuffled ${this.reShuffleAttempts} times)`,
            this.shuffledArray);
        // Reset the reshuffle attempts counter
        this.reShuffleAttempts = 0;
        this.bestShuffleScore = 0;

        const shuffledArray = this.shuffledArray.length > 0 ? [...this.shuffledArray] : [...this.bestShuffle];
        this.shuffledArray = [];
        // Return the shuffled array
        return shuffledArray;
    }

    /**
     * Check if the current element is adjacent to the previous one and add it to the shuffled array
     * If the function was unable to add an element that isn't adjacent or equal to the previous one,
     * false is returned.
     * @return {boolean}
     */
    static checkAndAddElementToArray() {
        // Select a random element from the remainingElements array
        let randomIndex = Math.floor(Math.random() * this.remainingElements.length);
        let currentElement = this.remainingElements[randomIndex];

        // If the shuffled array is empty, the current element is not adjacent to the previous one,
        // or the note is not the same as before, add the current element to the shuffled array
        if (!this.previousElement
            // Check that combinations are not adjacent by checking the index difference notes in this.array follow each other
            || (Math.abs(this.array.indexOf(currentElement) - this.array.indexOf(this.previousElement)) !== 1
                && currentElement[1] !== this.previousElement[1])
        ) {
            this.shuffledArray.push(currentElement);
            this.remainingElements.splice(randomIndex, 1);
            this.previousElement = currentElement;
            this.newIndexAttempts = 0;
            return true;
        } else if (this.newIndexAttempts < this.maxNewIndexAttempts) {
            this.newIndexAttempts++;
            // Find another index for a new current element
            return this.checkAndAddElementToArray();
        } else {
            return false;
        }
    }
}