import {GameProgressVisualizer} from "../../game-core/game-progress/game-progress-visualizer.js?v=1.2.4";

export class NoteInKeyGameNoGuitar {
    static initNoGuitarGameOption() {
        document.querySelector('#no-guitar-option input').addEventListener('click', () => {
            console.log('no guitar option changed');
            document.dispatchEvent(new Event('game-stop'));
            GameProgressVisualizer.resetProgress();
        });
    }

    static destroyNoGuitarGameOption() {
        document.querySelector('#game-container').classList.remove('no-guitar');
        // By removing the fretboard, the event listeners are also removed
        document.querySelector('#fretboard').remove();
    }

    static playNoGuitarNoteInKey() {
        if (document.querySelector('#no-guitar-option input')?.checked) {
            // Add no-guitar classname to game-container
            document.querySelector('#game-container').classList.add('no-guitar');
            this.addVirtualFretboard();
            this.addEventListenersToVirtualFretboard();
        }
    }


    static addVirtualFretboard() {
        document.querySelector('#game-container').insertAdjacentHTML('beforeend', `<div id="fretboard"></div>`);
        const fretboard = document.querySelector('#fretboard');
        let numberOfStrings = 6;
        let numberOfFrets = 12;

        for (let i = 1; i <= numberOfStrings; i++) {
            let string = document.createElement('div');
            string.className = 'string';
            string.id = 'string-' + i;

            for (let j = 1; j <= numberOfFrets; j++) {
                let fret = document.createElement('div');
                fret.className = 'fret';
                fret.id = 'fret-' + i + '-' + j;
                string.appendChild(fret);
            }

            let hr = document.createElement('hr');
            string.appendChild(hr);

            fretboard.appendChild(string);
        }

    }

    static addEventListenersToVirtualFretboard() {
        document.querySelectorAll('.fret').forEach(fret => {
            fret.addEventListener('click', function () {
                console.log('Fret clicked', fret.id);
            });
        });
    }
}