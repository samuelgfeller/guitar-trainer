export class MetronomeOperator {
    constructor() {
        this.audioContext = null;
        this.timerId = null;
    }

    setupAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    startMetronome() {
        const bpm = parseInt(document.getElementById('bpm-input').value);
        const interval = 60000 / bpm; // Convert BPM to milliseconds

        this.playClickSound(); // Play the initial click sound

        const metronomeBeatEvent = new Event('metronome-beat');
        document.dispatchEvent(metronomeBeatEvent);

        this.timerId = setInterval(() => {
            document.dispatchEvent(metronomeBeatEvent);

            this.playClickSound();
        }, interval); // Start the metronome
    }

    stopMetronome() {
        clearInterval(this.timerId);
        this.timerId = null;
    }

    playClickSound() {
        if (document.querySelector('#metronome-game-mode input').checked) {
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

    toggleMetronomeSound(muteMetronomeBtn) {
        const muteMetronomeIcon = muteMetronomeBtn.querySelector('img');
        if (muteMetronomeIcon.src.includes('sound-on-icon.svg')) {
            muteMetronomeIcon.src = 'img/mute-icon.svg';
            this.playSound = false;
        } else {
            muteMetronomeIcon.src = 'img/sound-on-icon.svg';
            this.playSound = true;
        }
    }
}