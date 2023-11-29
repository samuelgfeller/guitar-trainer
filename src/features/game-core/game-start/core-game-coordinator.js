import {MetronomeOperator} from "../metronome/metronome-operator.js?v=1.1.3";
import {TuneOperator} from "../tuner/tune-operator.js?v=1.1.3";
import {FrequencyBarsController} from "../frequency-bars/frequency-bars-controller.js?v=1.1.3";
import {GameElementsVisualizer} from "../game-ui/game-elements-visualizer.js?v=1.1.3";
import {ScreenWakeLocker} from "../wake-lock/screen-wake-locker.js?v=1.1.3";

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


    /**
     * @param {CoreGameCoordinationInitializer} coreGameCoordinationInitializer
     */
    constructor(coreGameCoordinationInitializer) {
        // Inject instance as an attribute there is changed
        this.coreGameCoordinationInitializer = coreGameCoordinationInitializer;

        // Listen for game stop event to stop game
        document.addEventListener('game-stop', this.stopGame.bind(this));
        document.addEventListener('game-start', this.startGame.bind(this));

        this.screenWakeLocker = new ScreenWakeLocker();
    }

    startGame() {
        // Init game core game logic such as metronome, note detector
        this.startCoreGameFunctionalities();

        // Start game module
        this.gameCoordinator.play();

        this.gameRunning = true;

        if (this.metronomeEnabled) {
            // This gets the game moving and has to be after the game module has been properly started
            this.metronomeOperator.startMetronome();
        }

        document.querySelector('#start-stop-btn').innerText = 'Pause';
        // In case settings div is expanded, collapse it
        document.getElementById('config-div').classList.remove('expanded');
        // Display progress bar and score
        GameElementsVisualizer.showGameProgress(this.progressBarEnabled, this.scoreEnabled);
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
        }
        // Stop game if there is a game coordinator (not the case when changing level before game start)
        if (this.gameCoordinator !== null) {
            this.gameCoordinator.stop();
        }
        console.log(event.detail);
        if (!event.detail?.includes('visibility-change') && !event.detail?.includes('level-up')) {
            // Hide game elements and display instructions only when not after level up or visibility change
            GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        }
        if (event.detail?.includes('level-up')) {
            this.stopAndResumeAfterVisibilityChange = false;
        }
        if (!event.detail?.includes('visibility-change')) {
            this.gameRunning = false;
        }

        document.querySelector('#start-stop-btn').innerText = 'Play';

        this.screenWakeLocker.releaseWakeLock();
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
        this.coreGameCoordinationInitializer.gameInitializer.stopAndResumeAfterVisibilityChange = false;

        if (this.noteDetectorEnabled) {
            // Start tuner
            this.tuneOperator.initGetUserMedia();
            this.tuneOperator.start();

            // Set frequencyData instance variable
            let frequencyData = new Uint8Array(this.tuneOperator.analyser.frequencyBinCount);
            new FrequencyBarsController(frequencyData).updateFrequencyBars(this.tuneOperator);

            GameElementsVisualizer.showGameElementsAndHideInstructions();

            // Prevent screen from getting dark on mobile
            void this.screenWakeLocker.requestWakeLock();

            // Set if the game should start automatically after visibility change event
            this.coreGameCoordinationInitializer.gameInitializer.stopAndResumeAfterVisibilityChange = true;
        }
    }
}