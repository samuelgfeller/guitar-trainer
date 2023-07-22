import {MetronomeNoteDetector} from "./metronome-note-detector-main.js";
import {NoteGame} from "./note-game.js";

class GameStarter {
    constructor() {
        this.metronomeNoteDetector = new MetronomeNoteDetector();
        this.noteGame = new NoteGame(this);
        this.startStopButton = document.querySelector('#start-stop-btn');
        this.muteMetronomeImg = document.querySelector('#mute-metronome');
    }

    init() {
        this.startStopButton.addEventListener('click', this.startStopGame.bind(this));
        document.body.addEventListener('dblclick', this.startStopGame.bind(this));
        const bpmInput = document.querySelector('#bpm-input');
        bpmInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.startStopGame();
            }
        });
        this.updateIsLevelAccomplishedColor(bpmInput);
        bpmInput.addEventListener('change', (e) => {
            this.updateIsLevelAccomplishedColor(bpmInput);
        });

        this.muteMetronomeImg.addEventListener('click', () => {
            this.metronomeNoteDetector.metronome.toggleMetronomeSound(this.muteMetronomeImg);
        });
    }

    updateIsLevelAccomplishedColor(bpmInput){
        if (this.noteGame.gameUI.gameProgress.isLevelAccomplished(bpmInput.value)){
            document.querySelector('header div').style.borderBottomColor = 'green';
        }else{
            document.querySelector('header div').style.borderBottomColor = null;
        }
    }

    startGame() {
        this.noteGame.init();
        this.metronomeNoteDetector.init();
        this.noteGame.frequencyBars = this.metronomeNoteDetector.frequencyBars;
        if (document.querySelector('#challenging-notes-preset').checked) {
            this.noteGame.presetChallengingNotes();
        }
        this.metronomeNoteDetector.start();
        document.querySelector('#game-progress-div').style.display = null;
        document.querySelector('#game-start-instruction details').open = false;
    }

    stopGame() {
        this.metronomeNoteDetector.stop();
        this.noteGame.stop();
    }

    startStopGame() {
        let gameElements = document.querySelectorAll('.visible-when-game-on');
        const gameStartInstructions = document.querySelector('#game-start-instruction');

        if (this.startStopButton.innerText === 'Start' || this.startStopButton.innerText === 'Resume') {
            if (this.metronomeNoteDetector.metronome.playSound === true) {
                this.metronomeNoteDetector.metronome.init();
                this.metronomeNoteDetector.metronome.startMetronome();
            } else {
                this.startGame();
                gameElements.forEach(element => {
                    element.style.display = 'block';
                });
                gameStartInstructions.style.display = 'none';
                gameStartInstructions.innerHTML = gameStartInstructions.innerHTML.replace('begin', 'resume');
            }
            this.startStopButton.innerText = 'Pause';
        } else {
            this.stopGame();
            this.startStopButton.innerText = 'Resume';
            gameElements.forEach(element => {
                element.style.display = 'none';
            });
            gameStartInstructions.style.display = 'block';
        }
    }
}

const game = new GameStarter();
game.init();