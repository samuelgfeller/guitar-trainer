import {Metronome} from "./metronome.js";
import {Tuner} from "./tuner.js?v=2";

export const MetronomeNoteDetector = function () {
    // Uses ScriptProcessorNode which is deprecated. Couldn't make it work with chat gpt so this issue
    // https://github.com/qiuxiang/tuner/issues/18 is ignored for now as long as it works
    this.tuner = new Tuner();
    this.metronome = new Metronome();
}

MetronomeNoteDetector.prototype.start = function () {
    // Start metronome audioContext can only be set after a user action
    this.metronome.init();
    this.metronome.startMetronome();
    // Start tuner
    this.tuner.init();
    this.tuner.frequencyData = new Uint8Array(this.tuner.analyser.frequencyBinCount);

    // Mute metronome
    const muteMetronomeSpan = document.querySelector('#mute-metronome');
    muteMetronomeSpan.addEventListener('click', () => {
        this.metronome.toggleMetronomeSound(muteMetronomeSpan);
    });
}

MetronomeNoteDetector.prototype.stop = function () {
    // Stop metronome and note detection
    this.metronome.stopMetronome();
    this.tuner.stop();
}
