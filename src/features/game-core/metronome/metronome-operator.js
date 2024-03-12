/**
 * Source: https://github.com/grantjames/metronome
 */
export class MetronomeOperator {
    constructor() {
        this.audioContext = null;
        this.notesInQueue = [];         // notes that have been put into the web audio and may or may not have been played yet {note, time}
        this.currentBeatInBar = 0;
        this.beatsPerBar = 4;
        this.tempo = 60;
        this.lookahead = 25;          // How frequently to call scheduling function (in milliseconds)
        this.scheduleAheadTime = 0.1;   // How far ahead to schedule audio (sec)
        this.nextNoteTime = 0.0;     // when the next note is due
        this.isRunning = false;
        this.intervalID = null;
    }

    nextNote() {
        // Advance current note and time by a quarter note (crotchet if you're posh)
        let secondsPerBeat = 60.0 / this.tempo; // Notice this picks up the CURRENT tempo value to calculate beat length.
        this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time

        this.currentBeatInBar++;    // Advance the beat number, wrap to zero
        if (this.currentBeatInBar === this.beatsPerBar) {
            this.currentBeatInBar = 0;
        }
    }

    scheduleNote(beatNumber, time) {
        // push the note on the queue, even if we're not playing.
        this.notesInQueue.push({note: beatNumber, time: time});

        // create an oscillator
        const osc = this.audioContext.createOscillator();
        const envelope = this.audioContext.createGain();

        const firstBeat = beatNumber % this.beatsPerBar === 0;
        osc.frequency.value = firstBeat ? 1000 : 800;
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

        osc.connect(envelope);
        envelope.connect(this.audioContext.destination);

        osc.start(time);
        osc.stop(time + 0.03);

        const metronomeBeatEvent = new Event('metronome-beat');
        document.dispatchEvent(metronomeBeatEvent);
        // Flash color of the dotted bottom border
        const headerDiv = document.querySelector('header > div');
        if (firstBeat) {
            // Change the border color to a brighter color when the first beat of the bar is played
            // headerDiv.style.borderColor = `rgb(calc(var(--r) * 1.2), calc(var(--g) * 1.2), calc(var(--b) * 1.2))`;
            headerDiv.style.borderColor = `rgb(calc(var(--r) * 1), calc(var(--g) * 1.5), calc(var(--b) * 1))`;
        } else {
            headerDiv.style.borderColor = 'var(--accent-color)';
        }
        // Change the border color back to --background-light-accent-color after the sound has played
        this.borderColorTimeout = setTimeout(() => {
            document.querySelector('header > div').style.borderColor = `rgb(calc(var(--r) * 0.5), calc(var(--g) * 0.5), calc(var(--b) * 0.5)`;
        }, 100); // 30 milliseconds is the duration of the sound

    }

    scheduler() {
        // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.currentBeatInBar, this.nextNoteTime);
            this.nextNote();
        }
    }

    startMetronome() {
        if (this.isRunning) return;

        this.tempo = parseInt(document.getElementById('bpm-input').value);
        this.beatsPerBar = parseInt(document.getElementById('beats-per-bar-range-slider').value);

        if (this.audioContext == null) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        this.isRunning = true;

        this.currentBeatInBar = 0;
        this.nextNoteTime = this.audioContext.currentTime + 0.05;


        this.intervalID = setInterval(() => this.scheduler(), this.lookahead);

    }

    stopMetronome() {
        this.isRunning = false;
        clearInterval(this.intervalID);
        if (this.borderColorTimeout){
            clearTimeout(this.borderColorTimeout);
        }
        document.querySelector('header > div').style.borderColor = null;
    }

    /*
    startMetronome() {
            // this.playClickSound(); // Play the initial click sound
        //
        // const metronomeBeatEvent = new Event('metronome-beat');
        // document.dispatchEvent(metronomeBeatEvent);
        //
        // this.timerId = setInterval(() => {
        //     document.dispatchEvent(metronomeBeatEvent);
        //     console.log('metronome beat');
        //     this.playClickSound();
        // }, interval); // Start the metronome
        }

        stopMetronome(){
          clearInterval(this.timerId);
        this.timerId = null;
        }

    playClickSound() {
        // Play click sound only when metronome game mode is selected
        if (document.querySelector('#metronome-game-mode').classList.contains('selected')) {
            // Resume the audio context
            //  if (this.audioContext.state === 'suspended') {
            //      this.audioContext.resume();
            //  }
            console.log(this.audioContext);

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Set the oscillator type to 'square' for a sharper sound
            oscillator.type = 'sawtooth';
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

            // Disconnect the oscillator and gainNode after the sound has played
            oscillator.onended = () => {
                oscillator.disconnect();
                gainNode.disconnect();
            };
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
    }*/
}