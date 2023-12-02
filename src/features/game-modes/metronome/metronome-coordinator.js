import {MetronomePracticeInitializer} from "./metronome-practice-initializer.js?v=489";

export class MetronomeCoordinator{

    constructor() {
        new MetronomePracticeInitializer().initMetronomePractice();
    }

    play(){
        // Metronome started in main game coordinator
    }
    stop(){

    }
    destroy(){
        document.querySelector('#exercise-container').remove();
    }
}