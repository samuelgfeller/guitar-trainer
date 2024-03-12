import {MetronomePracticeInitializer} from "./metronome-practice-initializer.js?v=2.4.1";
import {MetronomePracticeTimer} from "./metronome-practice-timer.js?v=2.4.1";

export class MetronomePracticeCoordinator {

    constructor() {
        this.metronomePracticeInitializer = new MetronomePracticeInitializer();
        this.metronomePracticeInitializer.initMetronomePractice();
    }

    play(){
        // Metronome started in main game coordinator

        // When bpm is changed, the metronome is restarted if the game is running
        this.metronomePracticeInitializer.gameRunning = true;
        // Start timer for selected exercise
        MetronomePracticeTimer.startCountDownTimer();
    }
    stop(){
        this.metronomePracticeInitializer.gameRunning = false;
        MetronomePracticeTimer.pauseCountDownTimer();
    }
    destroy(){
        this.metronomePracticeInitializer.destroy();
    }
}