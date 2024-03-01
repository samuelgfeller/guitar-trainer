import {ModalHandler} from "../../../components/game-core/ui/modal-handler.js?v=2.1.4";

export class LevelUpVisualizer {
    /**
     * @param bodyText modal body
     * @param confirmButtonText green button text
     * @param goToNextLevelEventHandler event handler for green button
     * @param restartLevelEventHandler event handler for restart
     * @param closeModalEventHandler event handler when modal is closed without clicking on any button
     */
    static stopGameAndDisplayLeveledUpModal(
        bodyText,
        confirmButtonText,
        goToNextLevelEventHandler,
        restartLevelEventHandler,
        closeModalEventHandler = null
    ) {
        // Stop the game in the form of an event to avoid a circular dependency with core-game-coordinator
        document.dispatchEvent(new CustomEvent('game-stop', {'detail': 'level-up'})); // add details

        let header = `<h2>Congratulations 🎉</h2>`;
        let body = `<div>${bodyText}</div>`;
        let footer = `<button id="restart-modal-btn" class="grey-btn">Restart</button>
<button id="next-lvl-modal-btn" class="green-btn">${confirmButtonText}</button>`

        ModalHandler.displayModal(header, body, footer, closeModalEventHandler, 'lvl-up-modal');

        // Add event listeners (don't have to be removed as the entire modal box is removed from dom)
        document.getElementById('restart-modal-btn').addEventListener('click', restartLevelEventHandler);
        document.getElementById('restart-modal-btn').addEventListener('click', this.closeModalEvent.bind(this));

        document.getElementById('next-lvl-modal-btn').addEventListener('click', this.closeModalEvent.bind(this));
        document.getElementById('next-lvl-modal-btn').addEventListener('click', goToNextLevelEventHandler);
    }

    static closeModalEvent() {
        ModalHandler.closeModal();
    }
}