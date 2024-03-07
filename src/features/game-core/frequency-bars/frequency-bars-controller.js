import {FrequencyBarsVisualizer} from "./frequency-bars-visualizer.js?v=2.2.2";

export class FrequencyBarsController {
    frequencyData = null;

    frequencyBarsVisualizer = null;

    constructor() {
        this.frequencyBarsFillStyleEventHandlerVar = this.frequencyBarsFillStyleEventHandler.bind(this);
    }

    frequencyBarsFillStyleEventHandler(event) {
        this.frequencyBarsVisualizer.canvasContext.fillStyle = event.detail;
    }


    updateFrequencyBars(tuneOperator) {
        // requestAnimationFrame calls the function on the next frame but shouldn't if the game is paused
        if (!this.frequencyBarsVisualizer) {
            return;
        }
        if (tuneOperator.analyser) {
            tuneOperator.analyser.getByteFrequencyData(this.frequencyData);
            this.frequencyBarsVisualizer.update(this.frequencyData);
        }
        // console.log('updateFrequencyBars');
        // requestAnimationFrame(this.updateFrequencyBars.bind(this));
        requestAnimationFrame(() => this.updateFrequencyBars(tuneOperator));
    };

    addFrequencyBarsAndDetectedNoteToDom() {
        document.querySelector('#game-container').insertAdjacentHTML('beforeend',
            `<div id="detected-note-div">
                    <p id="detected-note"></p>
                </div>
                <canvas id="frequency-bars"></canvas>`);
        this.frequencyBarsVisualizer = new FrequencyBarsVisualizer();
        document.addEventListener('update-frequency-bars-fill-style', this.frequencyBarsFillStyleEventHandlerVar);
    }

    removeFrequencyBarsAndDetectedNoteFromDom() {
        document.querySelector('#frequency-bars')?.remove();
        document.querySelector('#detected-note-div')?.remove();
        this.frequencyBarsVisualizer = null;
        document.removeEventListener('update-frequency-bars-fill-style', this.frequencyBarsFillStyleEventHandlerVar);
    }
}