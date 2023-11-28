import {GameConfigurationManager} from "../../game-core/game-initialization/game-configuration-manager.js?v=1.1.1";

export class MetronomeCoordinator{

    constructor() {
        document.querySelector('#game-start-instruction').querySelector('h3').innerHTML = `Metronome`;
        document.querySelector('#game-instruction-text').innerHTML = `Click "Play" to start the metronome.`;
        GameConfigurationManager.showBpmInput();
    }

    play(){
        // Metronome started in main game coordinator
    }
    stop(){

    }
}