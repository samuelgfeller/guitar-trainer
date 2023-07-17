import {Metronome} from "./metronome.js";

export const MetronomeApp = function () {
    this.metronome = new Metronome();
}

MetronomeApp.prototype.start = () => {
    this.metronome.toggleMetronomeOn();
}

Metronome.prototype.toggleMetronomeSound = function () {
    if (muteMetronomeSpan.innerHTML === '🔊') {
        muteMetronomeSpan.innerHTML = '🔇';
        this.playSound = false;
    } else {
        muteMetronomeSpan.innerHTML = '🔊';
        this.playSound = true;
    }
}