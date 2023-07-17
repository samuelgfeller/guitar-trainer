import {TunerApplication} from "./metronome-tuner-starter.js";
import {Metronome} from "./metronome.js";
import {displayRandomNote} from "./note-game.js";

export const Application = function () {
    const self = this;
    this.metronome = new Metronome();
    this.tuner = new TunerApplication();
    this.note = null;

    this.startButton = document.querySelector('#start-stop-btn');

    // On each metronome beat
    // this.metronome.onMetronomeBeat = function () {
    //     // Reset color of note span
    //     document.querySelector('#note-span').style.color = null;
    //
    //     // Display random note and string
    //     self.note = displayRandomNote();
    // }

    document.addEventListener('metronome-beat', (e) => {
        // Reset color of note span
        document.querySelector('#note-span').style.color = null;

        // Display random note and string
        self.note = displayRandomNote();
    });
    document.addEventListener('note-detected', (e) => {
        console.log(e.detail)
        if (self.note === e.detail.name){
            document.querySelector('#note-span').style.color = 'green';
        }
        self.tuner.update(e.detail);
    })

    // Check if note is correct
    // this.tuner.tuner.onNoteDetected = function (note) {
    //     if (self.note === note.name){
    //         document.querySelector('#note-span').style.color = 'green';
    //     }
    //     self.tuner.update(note);
    // }
}

Application.prototype.start = function () {
    // Start metronome
    this.startButton.addEventListener('click', this.startStopGame.bind(this));
    document.body.addEventListener('dblclick', this.startStopGame.bind(this));

    // Mute metronome
    const muteMetronomeSpan = document.querySelector('#mute-metronome');
    muteMetronomeSpan.addEventListener('click', this.metronome.toggleMetronomeSound);
}

Application.prototype.startStopGame = function () {
    let gameElements = document.querySelectorAll('.visible-when-game-on');

    // Start game
    if (this.startButton.innerText === 'Start') {
        // audioContext can only be set after a user action
        this.metronome.init();
        this.metronome.startMetronome();

        this.tuner.start();

        // Replace start button with stop button
        this.startButton.innerText = 'Stop';
        gameElements.forEach(element => {
            element.style.display = 'block';
        });
    } else {
        // Stop game
        this.metronome.stopMetronome();
        this.tuner.tuner.stop();
        // Replace stop button with start button
        this.startButton.innerText = 'Start';
        gameElements.forEach(element => {
            element.style.display = 'none';
        });
    }
}

const app = new Application();
app.start();