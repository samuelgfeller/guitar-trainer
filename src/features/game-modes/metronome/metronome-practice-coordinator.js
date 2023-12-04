import {MetronomePracticeInitializer} from "./metronome-practice-initializer.js?v=1.1.5";

export class MetronomePracticeCoordinator {

    constructor() {
        this.metronomePracticeInitializer = new MetronomePracticeInitializer();
        this.metronomePracticeInitializer.initMetronomePractice();
    }

    play(){
        // Metronome started in main game coordinator

        // When bpm is changed, the metronome is restarted if the game is running
        this.metronomePracticeInitializer.gameRunning = true;
    }
    stop(){
        this.metronomePracticeInitializer.gameRunning = false;
    }
    destroy(){
        document.querySelector('#exercise-container').remove();
    }
}