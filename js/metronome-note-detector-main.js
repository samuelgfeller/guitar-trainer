import {Metronome} from "./metronome.js?v=0.6";
import {Tuner} from "./tuner.js?v=0.6";
import {FrequencyBars} from "./frequency-bars.js?v=0.6";

export const MetronomeNoteDetector = function () {
    // Uses ScriptProcessorNode which is deprecated. Couldn't make it work with chat gpt so this issue
    // https://github.com/qiuxiang/tuner/issues/18 is ignored for now as long as it works
    this.tuner = new Tuner();
    this.metronome = new Metronome();
    this.frequencyBars = new FrequencyBars("#frequency-bars");
    this.frequencyData = null;
}

MetronomeNoteDetector.prototype.init = function () {
    // Start metronome audioContext can only be set after a user action
    this.metronome.init();
    // Start tuner
    this.tuner.init();

    // Set frequencyData instance variable
    this.frequencyData = new Uint8Array(this.tuner.analyser.frequencyBinCount);
    this.updateFrequencyBars();
}
MetronomeNoteDetector.prototype.start = function () {
    this.metronome.startMetronome();
}

MetronomeNoteDetector.prototype.stop = function () {
    // Stop metronome and note detection
    this.metronome.stopMetronome();
    this.tuner.stop();
}

MetronomeNoteDetector.prototype.updateFrequencyBars = function () {
    if (this.tuner.analyser) {
        this.tuner.analyser.getByteFrequencyData(this.frequencyData);
        this.frequencyBars.update(this.frequencyData);
    }
    requestAnimationFrame(this.updateFrequencyBars.bind(this));
};