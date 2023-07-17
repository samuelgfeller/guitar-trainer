import {Tuner} from "./tuner.js";

export const TunerApplication = function () {
    // Uses ScriptProcessorNode which is deprecated. Couldn't make it work with chat gpt so this issue
    // https://github.com/qiuxiang/tuner/issues/18 is ignored for now as long as it works
    this.tuner = new Tuner();
};

TunerApplication.prototype.start = function () {
    const self = this;

    self.tuner.init();
    self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount);

    // this.tuner.onNoteDetected = function (note) {
    //     self.update(note);
    // };
};

TunerApplication.prototype.update = function (note) {
    const noteOutput = document.getElementById("noteOutput");
    if (noteOutput) {
        noteOutput.textContent = note.name;
    }
    const { frequency, octave, cents, name } = note;
    console.log(`Name: ${name} Amp: ${note.amplitude} Fr: ${Math.round(frequency)}, Octave: ${octave}, Cents: (${cents})`);
};
