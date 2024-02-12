import {FrequencyBarsVisualizer} from "./frequency-bars-visualizer.js?v=1.4.0";

export class FrequencyBarsController {

    constructor(frequencyData) {
        this.frequencyBarsVisualizer = new FrequencyBarsVisualizer();
        this.frequencyData = frequencyData;

        // Listen for the updateFrequencyBarsFillStyle event
        document.addEventListener('updateFrequencyBarsFillStyle', (event) => {
            this.frequencyBarsVisualizer.canvasContext.fillStyle = event.detail;
        });
    }

    updateFrequencyBars(tuneOperator) {
        if (tuneOperator.analyser) {
            tuneOperator.analyser.getByteFrequencyData(this.frequencyData);
            this.frequencyBarsVisualizer.update(this.frequencyData);
        }
        // requestAnimationFrame(this.updateFrequencyBars.bind(this));
        requestAnimationFrame(() => this.updateFrequencyBars(tuneOperator));
    };

    static addFrequencyBarsAndDetectedNoteToDom() {
        document.querySelector('#game-container').insertAdjacentHTML('beforeend',
            `<div id="detected-note-div">
                    <p id="detected-note"></p>
                </div>
                <canvas id="frequency-bars"></canvas>`);
    }
    static removeFrequencyBarsAndDetectedNoteFromDom() {
        document.querySelector('#frequency-bars')?.remove();
        document.querySelector('#detected-note-div')?.remove();
    }
}