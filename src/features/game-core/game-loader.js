import {GameInitializer} from "./game-initialization/game-initializer.js";

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