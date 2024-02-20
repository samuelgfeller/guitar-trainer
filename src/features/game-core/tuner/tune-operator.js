// Source https://github.com/qiuxiang/tuner
/**
 * Uses ScriptProcessorNode which is deprecated. Couldn't make it work, so this issue
 * https://github.com/qiuxiang/tuner/issues/18 is ignored for now as long as it works
 */
export class TuneOperator {
    constructor(a4 = 440) {
        this.middleA = a4 || 440;
        this.semitone = 69;
        this.bufferSize = 4096;
        this.noteStrings = [
            "C",
            "C♯ | D♭",
            "D",
            "D♯ | E♭",
            "E",
            "F",
            "F♯ | G♭",
            "G",
            "G♯ | A♭",
            "A",
            "A♯ | B♭",
            "B",
        ];
    }

    /**
     * getUserMedia can only be initialized after user action
     */
    initGetUserMedia() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!window.AudioContext) {
            return alert("AudioContext not supported");
        }

        // Older browsers might not implement mediaDevices at all, so we set an empty object first
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }

        // Some browsers partially implement mediaDevices. We can't just assign an object
        // with getUserMedia as it would overwrite existing properties.
        // Here, we will just add the getUserMedia property if it's missing.
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function (constraints) {
                // First get a hold of the legacy getUserMedia, if present
                const getUserMedia =
                    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                // Some browsers just don't implement it - return a rejected promise with an error
                // to keep a consistent interface
                if (!getUserMedia) {
                    alert("getUserMedia is not implemented in this browser");
                }

                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };
        }
    };

    startRecord() {
        const self = this;
        return new Promise((resolve, reject) => {
            navigator.mediaDevices
                .getUserMedia({audio: true})
                .then(function (stream) {
                    self.stream = stream; // Keep stream to remove mic access later
                    self.audioContext.createMediaStreamSource(stream).connect(self.analyser);
                    self.analyser.connect(self.scriptProcessor);
                    self.scriptProcessor.connect(self.audioContext.destination);
                    self.scriptProcessor.addEventListener("audioprocess", self.processAudio.bind(self));
                    // Resolve when recording started
                    resolve();
                })
                .catch(function (error) {
                    alert(error.name + ": " + error.message);
                    reject(error);
                });
        });
    };

    processAudio(event) {
        const self = this;
        const audioData = event.inputBuffer.getChannelData(0);

        // Calculate the amplitude or loudness of the audio data
        let amplitude = 0;
        for (let i = 0; i < audioData.length; i++) {
            amplitude += Math.abs(audioData[i]);
        }
        const frequency = self.pitchDetector.do(audioData);
        amplitude /= audioData.length;

        // If amplitude is not high enough, not trying to figure out note as its probably only background noise
        if (frequency && amplitude > (this.isMobile() ? 0.02 : 0.5)) {

            const note = self.getNote(frequency);
            document.querySelector('#audio-info-div2').textContent = self.noteStrings[note % 12];

            // console.log(frequency,self.noteStrings[note % 12]);
            const noteDetectedEvent = new CustomEvent("note-detected", {
                detail: {
                    name: self.noteStrings[note % 12],
                    value: note,
                    cents: self.getCents(frequency, note),
                    octave: Math.round(note / 12) - 1,
                    frequency: frequency,
                    amplitude: amplitude,
                }
            });
            document.dispatchEvent(noteDetectedEvent);
        }
    };

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    stopRecord() {
        if (this.scriptProcessor) {
            this.scriptProcessor.removeEventListener("audioprocess", this.processAudio);
            this.scriptProcessor.disconnect();
            this.scriptProcessor = null;
        }
        if (this.analyser) {
            this.analyser.disconnect();
            this.analyser = null;
        }
        if (this.audioContext) {
            void this.audioContext.close();
            this.audioContext = null;
        }

        // Stop microphone tracks
        if (this.stream) {
            const tracks = this.stream.getTracks();
            tracks.forEach((track) => track.stop());
            this.stream = null;
        }
    };


    stop() {
        this.stopRecord();
        this.stopOscillator();
    };

    start() {
        return new Promise((resolve, reject) => {
            this.audioContext = new window.AudioContext();
            this.analyser = this.audioContext.createAnalyser();
            this.scriptProcessor = this.audioContext.createScriptProcessor(
                this.bufferSize,
                1,
                1
            );

            const self = this;

            aubio().then(function (aubio) {
                self.pitchDetector = new aubio.Pitch(
                    "default",
                    self.bufferSize,
                    1,
                    self.audioContext.sampleRate
                );
                self.startRecord().then(resolve).catch(reject);
            }).catch(reject);
        });
    };

    /**
     * get musical note from frequency
     *
     * @param {number} frequency
     * @returns {number}
     */
    getNote(frequency) {
        const note = 12 * (Math.log(frequency / this.middleA) / Math.log(2));
        return Math.round(note) + this.semitone;
    };

    /**
     * get the musical note's standard frequency
     *
     * @param note
     * @returns {number}
     */
    getStandardFrequency(note) {
        return this.middleA * Math.pow(2, (note - this.semitone) / 12);
    };

    /**
     * get cents difference between given frequency and musical note's standard frequency
     *
     * @param {number} frequency
     * @param {number} note
     * @returns {number}
     */
    getCents(frequency, note) {
        return Math.floor(
            (1200 * Math.log(frequency / this.getStandardFrequency(note))) / Math.log(2)
        );
    };

    /**
     * play the musical note
     *
     * @param {number} frequency
     */
    play(frequency) {
        if (!this.oscillator) {
            this.oscillator = this.audioContext.createOscillator();
            this.oscillator.connect(this.audioContext.destination);
            this.oscillator.start();
        }
        this.oscillator.frequency.value = frequency;
    };

    stopOscillator() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
        }
    };
}