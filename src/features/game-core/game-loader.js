import {GameInitializer} from "./game-initialization/game-initializer.js?v=2.1.0";

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
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameLoader();
    game.run();
});