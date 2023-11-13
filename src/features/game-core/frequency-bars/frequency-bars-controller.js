import {FrequencyBarsVisualizer} from "./frequency-bars-visualizer.js";
import {MetronomeOperator} from "../note-detector/metronome/metronome-operator.js";
import {TuneOperator} from "../note-detector/tuner/tune-operator.js";

export class FrequencyBarsController {

    constructor(frequencyData) {
        // Uses ScriptProcessorNode which is deprecated. Couldn't make it work with chat gpt so this issue
        // https://github.com/qiuxiang/tuner/issues/18 is ignored for now as long as it works
        this.tuneOperator = new TuneOperator();
        this.metronome = new MetronomeOperator();
        this.frequencyBars = new FrequencyBarsVisualizer("#frequency-bars");
        this.frequencyData = frequencyData;
    }

    updateFrequencyBars() {
        if (this.tuneOperator.analyser) {
            this.tuneOperator.analyser.getByteFrequencyData(this.frequencyData);
            this.frequencyBars.update(this.frequencyData);
        }
        requestAnimationFrame(this.updateFrequencyBars.bind(this));
    };
}