export class ArrayShuffler {
    static reShuffleAttempts = 0;
    static maxReShuffleAttempts = 200;

    /**
     * Shuffles an array ensuring that two indexes that were adjacent before are not adjacent after shuffling.
     * If it encounters two adjacent elements, it tries to reshuffle the entire array up to x times.
     * If after x attempts, there are still adjacent elements, it adds the remaining elements to the shuffled array.
     *
     * @param {Array} array - The array to shuffle.
     * @return {Array} - The shuffled array.
     */
    static shuffleArray(array) {
        // Initialize the shuffled array and a copy of the original array
        let shuffledArray = [];
        let remainingElements = [...array];
        let previousElement = null;

        // While there are elements in the remainingElements array
        while (remainingElements.length > 0) {
            // Select a random element from the remainingElements array
            let randomIndex = Math.floor(Math.random() * remainingElements.length);
            let currentElement = remainingElements[randomIndex];

            // If the shuffled array is empty or the current element is not adjacent to the previous one,
            // add the current element to the shuffled array
            if (!previousElement
                || (Math.abs(array.indexOf(currentElement) - array.indexOf(previousElement)) !== 1
                && currentElement[1] !== previousElement[1])
            ){
                shuffledArray.push(currentElement);
                remainingElements.splice(randomIndex, 1);
                previousElement = currentElement;
            }
                // If the current element is adjacent to the previous one and the reshuffle attempts is less than 10,
            // try to reshuffle the entire array
            else if (this.reShuffleAttempts < this.maxReShuffleAttempts) {
                this.reShuffleAttempts++;
                return this.shuffleArray(array);
            }
            // Break out of the loop if already 20 times reshuffled
            else {
                break;
            }
        }

        // If after x reshuffle attempts, there are still remaining elements, add them to the shuffled array
        if (this.reShuffleAttempts >= this.maxReShuffleAttempts && remainingElements.length > 0) {
            shuffledArray.push(...remainingElements);
        }

        console.debug(`Shuffled array (re-shuffled ${this.reShuffleAttempts} times)`, shuffledArray);
        // Reset the reshuffle attempts counter
        this.reShuffleAttempts = 0;

        // Return the shuffled array
        return shuffledArray;
    }
}