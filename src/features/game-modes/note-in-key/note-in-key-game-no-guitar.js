import {GameProgressVisualizer} from "../../game-core/game-progress/game-progress-visualizer.js?v=1708178220";

export class NoteInKeyGameNoGuitar {
    static diatonicNotesOnStrings;
    static availableNotesOnStrings;

    static initNoGuitarGameOption(noteInKeyGameCoordinator) {
        document.querySelector('#no-guitar-option input').addEventListener('click', () => {
            console.log('no guitar option changed');

            document.dispatchEvent(new Event('game-stop'));
            GameProgressVisualizer.hideProgress();
            noteInKeyGameCoordinator.reloadKeyAndString();

            if (document.querySelector('#no-guitar-option input').checked) {
                // Add no-guitar classname to game-container
                document.querySelector('#game-container').classList.add('no-guitar');
            } else {
                this.destroyNoGuitarGameOption();
            }
        });
    }

    static destroyNoGuitarGameOption() {
        document.querySelector('#game-container').classList.remove('no-guitar');
        // By removing the fretboard, the event listeners are also removed
        document.querySelector('#virtual-fretboard')?.remove();
    }

    static playNoGuitarNoteInKey(diatonicNotesOnStrings, keyString, keyNote) {
        this.diatonicNotesOnStrings = diatonicNotesOnStrings;
        this.keyString = keyString;
        this.keyNote = keyNote;

        if (document.querySelector('#no-guitar-option input')?.checked) {

            // If the fretboard already exists, remove it before adding it again in case the string options changed
            if (document.querySelector('#virtual-fretboard')) {
                this.destroyNoGuitarGameOption();
            }

            // Add no-guitar classname to game-container
            document.querySelector('#game-container').classList.add('no-guitar');
            this.addVirtualFretboard();
            this.addEventListenersToVirtualFretboard();
        }
    }


    static addVirtualFretboard() {
        document.querySelector('#game-container').insertAdjacentHTML('beforeend', `<div id="virtual-fretboard"></div>`);
        const fretboard = document.querySelector('#virtual-fretboard');
        /**
         * diatonicNotesOnStrings looks like this.
         * Object is for e.g. {noteName: "G", number: 3}:
         *
         * E = Array(3) [{noteName: "G", number: 3}, Object, Object]
         * A = Array(3) [Object, Object, Object]
         * D = Array(3) [Object, Object, Object]
         * G = Array(3) [Object, Object, Object]
         * B = Array(3) [Object, Object, Object]
         * E2 = Array(3) [Object, Object, Object]
         */
        let stringIndex = 0;
        // Construct fretboard with available notes on strings
        for (const [stringName, notes] of Object.entries(this.availableNotesOnStrings)) {
            let string = document.createElement('div');
            string.className = 'string';
            string.dataset.stringName = stringName;

            // Create a new div for the string name
            let stringNameDiv = document.createElement('div');
            let stringNameSpan = document.createElement('span');
            stringNameDiv.className = 'string-name';
            // Set the text content to the string name
            stringNameSpan.textContent = stringName;
            // Set the noteName data attribute to the first note of the string
            stringNameSpan.dataset.noteName = stringName;
            // Append the string name div to the string div
            stringNameDiv.appendChild(stringNameSpan);
            string.appendChild(stringNameDiv);

            // Reverse the note array to so that the fretboard starts on the right side
            let reversedNotes = [...notes].reverse();
            // Remove the last note from the reversed array copy as it's the string name
            reversedNotes.pop();

            // Store the total number of frets on the string to place indicator helpers
            let totalFrets = reversedNotes.length;

            for (const index in reversedNotes) {
                let fretPosition = document.createElement('div');
                fretPosition.className = 'fret-position';
                fretPosition.dataset.noteName = reversedNotes[index];
                string.appendChild(fretPosition);

                // Highlight key note
                if (reversedNotes[index] === this.keyNote && stringName === this.keyString) {
                    let keyNoteIndicator = document.createElement('span');
                    keyNoteIndicator.className = 'key-note-indicator';
                    fretPosition.appendChild(keyNoteIndicator);
                }

                // If the fret index is 3, 5, 7, or 9 and the string is the first string, add a circle to the fret
                // Calculate the fret number from the right
                let fretNumberFromRight = totalFrets - parseInt(index);
                // If the fret number from the right is 3, 5, 7, or 9 and the string is the first string, add a circle to the fret
                if ([3, 5, 7, 9].includes(fretNumberFromRight) && stringIndex === 0) {
                    let fretHelper = document.createElement('span');
                    fretHelper.className = 'fret-helper';
                    fretPosition.appendChild(fretHelper);
                }
            }

            // If note number 1 is the open string, color the string letter to green
            if (stringName === this.keyString && this.keyNote === stringName) {
                stringNameSpan.style.color = 'green';
            }

            let hr = document.createElement('hr');
            string.appendChild(hr);
            fretboard.appendChild(string);

            stringIndex++;
        }
    }

    static addEventListenersToVirtualFretboard() {
        // Add event listeners to the frets
        document.querySelectorAll('.fret-position').forEach(fret => {
            fret.addEventListener('click', this.noteClickedEventHandler);
        });
        // Add event listeners to the strings
        document.querySelectorAll('.string-name').forEach(string => {
            string.addEventListener('click', this.noteClickedEventHandler);
        });
    }

    static wrongColorTimeout;

    static noteClickedEventHandler(event) {
        // Clear the wrong color timeout
        clearTimeout(this.wrongColorTimeout);

        // If event.target contains a data-attribute note name take that as fret (either normal fret or open string)
        const fret = event.target.dataset.noteName ? event.target : event.target.closest('.fret-position');
        // If fret indicator helper is clicked, get the note name from the parent fret
        const noteName = fret.dataset.noteName;
        const stringName = event.target.closest('.string').dataset.stringName;
        // Output note and string name to console
        console.log(`Note ${noteName} on string ${stringName} clicked`);
        // Check if the pressed note was correct
        if (document.querySelector('#note-span').dataset.noteName === noteName
            && document.querySelector('#string-span').textContent === stringName) {
            document.dispatchEvent(new Event('correct-note-played'));
            // Remove the fret-clicked class from previously clicked frets
            document.querySelector('.fret-clicked')?.classList.remove('fret-clicked');
            // Add the fret-clicked class to the clicked fret
            fret.classList.add('fret-clicked');
        } else {
            // Color note-span orange for 700ms before reverting to default
            document.querySelector('#note-span').style.color = '#a96f00';
            this.wrongColorTimeout = setTimeout(() => {
                document.querySelector('#note-span').style.color = null;
            }, 2000);
        }
    }
}