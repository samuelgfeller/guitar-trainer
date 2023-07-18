export const Metronome = function () {
    this.audioContext = null;
    this.bpmInput = document.getElementById('bpm-input');
    this.timerId = null;
    this.playSound = false;
}

Metronome.prototype.init = function () {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

Metronome.prototype.startMetronome = function () {
    const self = this;
    const bpm = parseInt(this.bpmInput.value);
    const interval = 60000 / bpm; // Convert BPM to milliseconds

    this.playClickSound(); // Play the initial click sound

    const metronomeBeatEvent = new Event('metronome-beat');
    document.dispatchEvent(metronomeBeatEvent);

    this.timerId = setInterval(() => {
        document.dispatchEvent(metronomeBeatEvent);

        this.playClickSound();
    }, interval); // Start the metronome
}
Metronome.prototype.stopMetronome = function () {
    clearInterval(this.timerId);
    this.timerId = null;
}
Metronome.prototype.playClickSound = function () {
    if (this.playSound === true) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Set the oscillator type to 'square' for a sharper sound
        oscillator.type = 'square';

        // Set a lower frequency for a duller tone
        oscillator.frequency.value = 500;

        // Set the envelope of the sound
        const attackTime = 0.0001; // Time for the sound to reach its peak volume
        const releaseTime = 0.01; // Time for the sound to fade out

        gainNode.gain.setValueAtTime(1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(attackTime, this.audioContext.currentTime + releaseTime);

        // Start the oscillator and stop after a short duration
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + releaseTime);
    }
}

Metronome.prototype.toggleMetronomeSound = function (muteMetronomeSpan) {
    if (muteMetronomeSpan.innerHTML === '🔊') {
        muteMetronomeSpan.innerHTML = '🔇';
        this.playSound = false;
    } else {
        muteMetronomeSpan.innerHTML = '🔊';
        this.playSound = true;
    }
}