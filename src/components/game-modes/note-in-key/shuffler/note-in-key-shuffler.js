/*
Copilot task:

can you help me with creating a shuffling algorythm with a few rules.
Input is an array containing a string corresponding to a guitar string name in position 0 and an
object containing a noteName and fretPosition values like this: [ ['E', {"noteName": "E"," fretPosition": 0}],
['E', {"noteName": "F"," fretPosition": 1}], ['E', {"noteName": "F♯", "fretPosition": 2}], // etc... ]
Another input is previousElement which contains a an array with a string and object with noteName and
noteNumber which should be taken into consideration as if it was the previous element in the shuffled
array so the first element in the shuffled array must respect the conditions with this previous note.
The output is the shuffled array with array elements containing a string name and the noteName
[["E", "F♯"], ["E", "E"], //etc]  The shuffle conditions are the following
1. The index of the array elements from the input array must not be adjacent to the previous element in
the shuffled array. This means that element 1 from the input array must not be next to the element
0 or 2 in the shuffled array. The shuffled order could be 0, 2, 4, 1, 3 for instance but not 0, 1, 2, 3
2. There must not be 2 following elements in the shuffled array with the same noteName.
This is valid: [["E", "F♯"], ["E", "E"], ] this is invalid because the note name is the same [["E", "F♯"], ["A", "F♯"], ]
3. There is a given maxGap and this number represents the maximum allowed gap of the fret position
between 2 consecutive elements in the shuffled array. If the maxGap is 1, the element ['E', {"noteName": "F"," fretPosition": 1}] and must be after a note from any string but with the fretPosition 0, 1 or 2. The element ['A', {"noteName": "D"," fretPosition": 5}] is not permitted but ['A', {"noteName": "B"," fretPosition": 2}] is allowed.
If it is impossible to respect all the rules, the best possible combinations should be made with as
little discrepancies as possible. If the gap 1 is not possible, it could be tried with a higher gap 2,
then 3 etc. The entire thing can be shuffled multiple times as well and the best run taken.
Are my instructions clear or do you have questions? What approach would you take to develop this
algorythm and make the best output possible? Please do it with javascript and dont hesitate to ask
questions if you need to make decisions. This is a collaborative task between you and me.


if the input array is still not empty after 50 attempts, re shuffle the whole thing but keep track of the
score of how well it could be shuffled. do the whole thing 50 more times if it always fails to empty the
input array, take the best run with the least discrepancies where the gap and other conditions could be
respected the best. The gap cannot be increased by more than 2, if its still not possible to find an
element respecting the other conditions, the other two conditions may be ignored for that iteration to find a next element.
*/


/**
 * The NoteInKeyShuffler class provides a static method to shuffle an array of musical notes.
 * The shuffling respects certain conditions related to the adjacency of elements, the uniqueness of note names, and the gap between fret positions.
 * The class also keeps track of the best shuffled array and its score, which represents how well the array could be shuffled.
 */
export class NoteInKeyShuffler {
    static maxAttempts = 50; // The maximum number of attempts to shuffle the array
    static maxGapIncrease = 2; // The maximum increase of the gap between fret positions
    static bestScore = Infinity; // The score of the best shuffled array
    static bestShuffledArray = []; // The best shuffled array

    /**
     * Shuffles an array of musical notes.
     * The shuffling respects certain conditions related to the adjacency of elements,
     * the uniqueness of note names, and the gap between fret positions.
     * If it's not possible to find a valid element that respects all conditions,
     * the gap can be increased up to a certain limit, and then the other conditions can be ignored.
     * The method tries to shuffle the array up to a certain number of attempts, each time keeping
     * track of a score that represents how well the array could be shuffled.
     * The best shuffled array (with the lowest score) is kept and returned at the end.
     * @param {Array} inputArray - The array of musical notes to shuffle. Each element is an array
     * containing a string (the name of the guitar string) and an object (with properties noteName and fretPosition).
     * @param {Array} previousElement - The previous element to consider when shuffling. It's an array containing
     * a string (the name of the guitar string) and an object (with properties noteName and fretPosition).
     * @returns {Array} The best shuffled array.
     */
    static shuffleArray(inputArray, previousElement) {
        // The maximum allowed gap between the fret positions of two consecutive elements
        // in the shuffled array. It can be increased if it's not possible to find a valid element
        const originalMaxGap = parseInt(document.querySelector('#fret-gap-range-slider').value) ?? 2;
        let maxGap = originalMaxGap;
        // Reset bestShuffledArray
        this.bestShuffledArray = [];
        // Reset bestScore (the lower, the better score)
        this.bestScore = Infinity;

        for (let attempt = 0; attempt < this.maxAttempts; attempt++) {
            let shuffledArray = []; // The array to hold the shuffled elements
            let remainingElements = [...inputArray]; // The elements that have not been placed in the shuffled array yet
            let currentElement = previousElement; // The current element to consider when shuffling
            let score = 0; // The score of the current shuffled array

            // Try to place all elements from the input array into the shuffled array
            while (remainingElements.length > 0 && score < this.bestScore) {
                // Find all elements that respect the conditions
                let validElements = remainingElements.filter((element, index) => {
                    let prevIndex = inputArray.findIndex(e => e[0] === currentElement[0] && e[1].noteName === currentElement[1].noteName);
                    let gap = Math.abs(element[1].fretPosition - currentElement[1].fretPosition);
                    return Math.abs(prevIndex - index) > 1 && element[1].noteName !== currentElement[1].noteName && gap <= maxGap;
                });

                // If no valid elements are found, increase the gap or ignore the other conditions
                if (validElements.length === 0) {
                    if (maxGap < this.maxGapIncrease) {
                        maxGap++;
                        console.log('Increasing max gap to', maxGap, 'at element', currentElement);
                        score++;
                        continue;
                    } else {
                        score += remainingElements.length;
                        break;
                    }
                } else {
                    // Select a random valid element and add it to the shuffled array
                    let randomIndex = Math.floor(Math.random() * validElements.length);
                    let nextElement = validElements[randomIndex];
                    let gap = Math.abs(currentElement[1].fretPosition - nextElement[1].fretPosition)
                    shuffledArray.push([nextElement[0], nextElement[1].noteName, nextElement[1].fretPosition, gap]);
                    remainingElements = remainingElements.filter(element => element !== nextElement);
                    currentElement = nextElement;
                }
                maxGap = originalMaxGap; // Reset maxGap to its original value after each iteration

            }

            // If the current shuffled array is better than the best one so far, update the best shuffled array and its score
            if (score < this.bestScore) {
                this.bestScore = score;
                this.bestShuffledArray = shuffledArray;
            }
        }
        console.log(`Best shuffled array (score: ${this.bestScore})`, this.bestShuffledArray);

        // Return the best shuffled array
        return this.bestShuffledArray;
    }
}