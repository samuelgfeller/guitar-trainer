import {GameInitializer} from "./game-initializer.js?v=0.6";

export class GameLoader {
    constructor() {
        // Init game core game logic
        this.gameInitializer = new GameInitializer();
    }

    /**
     * Init event listeners to start the game
     */
    run() {
        this.gameInitializer.initGame();
    }
}

const game = new GameLoader();
game.run();