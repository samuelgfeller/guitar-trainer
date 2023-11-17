import {GameElementsVisualizer} from "./game-elements-visualizer.js";

export class LevelUpVisualizer {

    static closeModalEventHandler = this.closeModalEvent.bind(this);
    static restartLevelEventHandler;
    static goToNextLevelEventHandler;

    static displayLeveledUpModal(bodyText, confirmButtonText, goToNextLevelEventHandler, restartLevelEventHandler) {
        // Stop the game in the form of an event to avoid a circular dependency with core-game-coordinator
        document.dispatchEvent(new Event('game-stop'));

        document.querySelector('header div').style.borderBottomColor = 'green';


        // this.gameProgressVisualizer.alreadyLeveledUp = true;

        let header = `<h2>Congratulations 🎉</h2>`;
        let body = `<div>${bodyText}</div>`;
        let footer = `<button id="restart-modal-btn">Restart</button><button id="next-lvl-modal-btn">${confirmButtonText}</button>`
        // Display modal box
        let htmlString = `<div id="modal">
          <div id="modal-box">
          <div id="modal-header">${header}</div>
          <div id="modal-body">${body}</div>
          <div id="modal-footer">${footer}</div>
          </div></div>`;
        // Insert at end of page content which is in <main></main>
        document.querySelector('main').insertAdjacentHTML('beforeend', htmlString);

        this.goToNextLevelEventHandler = goToNextLevelEventHandler;
        this.restartLevelEventHandler = restartLevelEventHandler;

        // Add event listeners
        document.getElementById('restart-modal-btn').addEventListener('click', this.closeModalEventHandler);
        document.getElementById('restart-modal-btn').addEventListener('click', this.restartLevelEventHandler);
        document.getElementById('next-lvl-modal-btn').addEventListener('click', this.goToNextLevelEventHandler);
        document.getElementById('modal').addEventListener('click', this.closeModalEventHandler);
    }

    static closeModalEvent() {
        this.closeModal();
    }

    static closeModal() {
        let modal = document.getElementById('modal');
        document.getElementById('restart-modal-btn').removeEventListener('click', this.closeModalEventHandler);
        document.getElementById('next-lvl-modal-btn').removeEventListener('click', this.goToNextLevelEventHandler);
        document.getElementById('modal').removeEventListener('click', this.closeModalEventHandler);
        modal.remove();
        // Remove restart level handler when modal is closed
        // document.getElementById('restart-modal-btn').removeEventListener('click', this.restartLevelEventHandler);
        // setTimeout(() => {
        // }, 500);
    }
}