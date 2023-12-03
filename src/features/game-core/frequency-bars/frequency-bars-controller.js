import {FrequencyBarsVisualizer} from "./frequency-bars-visualizer.js?v=256";

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

}