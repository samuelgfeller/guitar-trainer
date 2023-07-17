export const Metronome = function () {
    this.audioContext = null;
    this.startButton = document.getElementById('start-stop-btn');
    this.bpmInput = document.getElementById('bpm-input');
    this.timerId = null;
    this.playSound = true;

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

    // startButton.disabled =  true;
}
Metronome.prototype.stopMetronome = function () {
    clearInterval(this.timerId);
    this.timerId = null;
}
Metronome.prototype.playClickSound = function () {
    if (this.playSound === true) {
        const oscillator = this.audioContext.createOscillator();
        oscillator.connect(this.audioContext.destination);
        oscillator.frequency.value = 200; // Adjust the pitch of the click sound if needed
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1); // Adjust the duration of the click sound if needed
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