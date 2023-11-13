import {GameInitializer} from "./game-initializer.js?v=0.6";
import {FretboardNoteGameLoader} from "../../game-modes/note-on-fretboard/fretboard-note-game-loader.js?v=0.6";
import {CoreGameCoordinator} from "./core-game-coordinator.js";

export class GameLoader {
    constructor() {
        // Init game core game logic
        this.gameInitializer = new GameInitializer(this);
    }

    /**
     * Init event listeners to start the game
     */
    run() {
        this.gameInitializer.initGame();
        new CoreGameCoordinator(this.gameInitializer).startGame();
    }


}