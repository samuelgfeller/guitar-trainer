import {GameElementsVisualizer} from "../game-ui/game-elements-visualizer.js?v=0.6";
import {GameLevelTracker} from "./game-level-tracker.js";

export class GameLevelHandler {
    /**
     * @param {GameProgressVisualizer} gameProgressVisualizer
     */
    constructor(gameProgressVisualizer) {
        this.gameProgressVisualizer = gameProgressVisualizer;
        this.closeModalEventHandler = this.closeModalEvent.bind(this);
        this.goToNextLevelEventHandler = this.goToNextLevelEvent.bind(this);
    }

    static leveledUp() {
        // Stop the game in the form of an event to avoid a circular dependency with core-game-coordinator
        document.dispatchEvent(new Event('game-stop'));

        document.querySelector('header div').style.borderBottomColor = 'green';


        // this.gameProgressVisualizer.alreadyLeveledUp = true;

        let header = `<h2>Congratulations 🎉</h2>`;
        let body = `<div>Level completed!</div>`;
        let footer = `<button id="close-modal-btn">Close</button><button id="next-lvl-modal-btn">Go to next level</button>`
        // Display modal box
        let htmlString = `<div id="modal">
      <div id="modal-box">
      <div id="modal-header">${header}</div>
      <div id="modal-body">${body}</div>
      <div id="modal-footer">${footer}</div>
      </div></div>`;
        // Insert at end of page content which is in <main></main>
        document.getElementById('score').insertAdjacentHTML('beforeend', htmlString);

        // Add event listeners
        document.getElementById('close-modal-btn').addEventListener('click', this.closeModalEventHandler);
        document.getElementById('next-lvl-modal-btn').addEventListener('click', this.goToNextLevelEventHandler);
        document.getElementById('modal').addEventListener('click', this.closeModalEventHandler);
    }
}