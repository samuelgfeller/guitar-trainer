import {MetronomeOperator} from "../metronome/metronome-operator.js?v=1.6.1";
import {TuneOperator} from "../tuner/tune-operator.js?v=1.6.1";
import {FrequencyBarsController} from "../frequency-bars/frequency-bars-controller.js?v=1.6.1";
import {GameElementsVisualizer} from "../game-ui/game-elements-visualizer.js?v=1.6.1";
import {ScreenWakeLocker} from "../wake-lock/screen-wake-locker.js?v=1.6.1";

export class CoreGameCoordinator {
    metronomeOperator = new MetronomeOperator();
    tuneOperator = new TuneOperator();

    // Game coordinator that implement setup(), destroy(), play() and stop() methods
    gameCoordinator = null;
    noteDetectorEnabled = false;

    // With metronome
    metronomeEnabled = false;
    // Counter for correct / incorrect notes played
    scoreEnabled = false;
    progressBarEnabled = false;

    // When only metronome should be played and not the whole game (when sound on before pressing start)
    stopAndResumeAfterVisibilityChange = true;
    gameRunning = false;
    manuallyPaused = false;

    constructor(coreGameInitializer) {
        this.coreGameInitializer = coreGameInitializer;
        // Listen for game stop event to stop game
        document.addEventListener('game-stop', this.stopGame.bind(this));
        document.addEventListener('game-start', this.startGame.bind(this));

        this.boundCorrectNoteButtonEventHandler = this.correctNoteButtonEventHandler.bind(this);

        this.screenWakeLocker = new ScreenWakeLocker();
    }

    startGame() {
        // Init game core game logic such as metronome, note detector
        this.startCoreGameFunctionalities();
        // Start game module
        this.gameCoordinator.play();

        this.gameRunning = true;

        // Disable metronome and note detector if no guitar option is selected
        this.noGuitarOption();

        // Start metronome only if tuner is fully started (if it needs to)
        this.startTuner().then(() => {
            if (this.metronomeEnabled) {
                // This gets the game moving and has to be after the game module has been properly started
                this.metronomeOperator.startMetronome();
            }
        });

        GameElementsVisualizer.togglePlayPauseButton('start');

        // In case settings div is expanded, collapse it
        document.getElementById('config-div').classList.remove('expanded');
        // Display progress bar and score
        GameElementsVisualizer.showGameProgress(this.progressBarEnabled, this.scoreEnabled);

        document.querySelector('#simulate-correct-note')?.addEventListener('click', this.boundCorrectNoteButtonEventHandler);
    }

    correctNoteButtonEventHandler() {
        document.dispatchEvent(new Event('correct-note-played'));
    }


    /**
     * Game stop
     */
    stopGame(event) {
        if (this.metronomeEnabled) {
            this.metronomeOperator.stopMetronome();
        }
        if (this.noteDetectorEnabled) {
            this.tuneOperator.stop();
            FrequencyBarsController.removeFrequencyBarsAndDetectedNoteFromDom();
        }
        // Stop game if there is a game coordinator (not the case when changing level before game start)
        if (this.gameCoordinator !== null) {
            this.gameCoordinator.stop();
        }
        if (!event.detail?.includes('visibility-change')) {
            // Hide game elements and display instructions only when not after level up or visibility change
            GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        }
        if (event.detail?.includes('level-up')) {
            // Game should not be started automatically after visibility change on level up
            this.manuallyPaused = true;
        }
        if (!event.detail?.includes('visibility-change')) {
            this.gameRunning = false;
        }

        GameElementsVisualizer.togglePlayPauseButton('stop');

        this.screenWakeLocker.releaseWakeLock();

        document.querySelector('#simulate-correct-note')?.removeEventListener('click', this.boundCorrectNoteButtonEventHandler);
    }

    startTuner() {
        if (this.noteDetectorEnabled) {
            // Start tuner
            this.tuneOperator.initGetUserMedia();
            return this.tuneOperator.start().then(() => {
                // Show frequency bars
                FrequencyBarsController.addFrequencyBarsAndDetectedNoteToDom();
                console.log('frequency bars added')
                // Set frequencyData instance variable
                let frequencyData = new Uint8Array(this.tuneOperator.analyser.frequencyBinCount);
                new FrequencyBarsController(frequencyData).updateFrequencyBars(this.tuneOperator);
            });
        }
        // If noteDetectorEnabled is false, return a resolved promise
        return Promise.resolve();
    }

    /**
     * Start metronome for the rhythm and note detector
     */
    startCoreGameFunctionalities() {
        if (this.metronomeEnabled) {
            // Start metronome audioContext can only be set after a user action
            this.metronomeOperator.setupAudioContext();
        }
        // Default value
        this.stopAndResumeAfterVisibilityChange = false;
        GameElementsVisualizer.showGameElementsAndHideInstructions();
        if (this.noteDetectorEnabled) {

            // Prevent screen from getting dark on mobile
            void this.screenWakeLocker.requestWakeLock();

            // If note detector enabled, game should start automatically after visibility change event
            this.stopAndResumeAfterVisibilityChange = true;
        }
    }

    noGuitarOption() {
        // Overwrite noteDetectorEnabled and metronomeEnabled if the user has selected "no guitar"
        const noGuitarCheckbox = document.querySelector('#no-guitar-option input');
        noGuitarCheckbox?.addEventListener('change', function () {
            toggleNoteDetectorIfNoGuitarChecked();
        });
        const self = this;
        const toggleNoteDetectorIfNoGuitarChecked = function () {
            if (noGuitarCheckbox?.checked) {
                self.metronomeEnabled = false;
                self.noteDetectorEnabled = false;
            } else {
                // Init game core game logic such as metronome, note detector
                self.coreGameInitializer.setNoteInKeyGameModeVariables();
            }
        }
        toggleNoteDetectorIfNoGuitarChecked();
    }
}