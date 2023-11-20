
export class LevelUpVisualizer {
    static displayLeveledUpModal(bodyText, confirmButtonText, goToNextLevelEventHandler, restartLevelEventHandler) {
        // Stop the game in the form of an event to avoid a circular dependency with core-game-coordinator
        document.dispatchEvent(new Event('game-stop'));

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

        // Add event listeners (don't have to be removed as the entire modal box is removed from dom)
        document.getElementById('restart-modal-btn').addEventListener('click', restartLevelEventHandler);
        document.getElementById('restart-modal-btn').addEventListener('click', this.closeModalEvent.bind(this));

        document.getElementById('next-lvl-modal-btn').addEventListener('click', goToNextLevelEventHandler);
        document.getElementById('next-lvl-modal-btn').addEventListener('click', this.closeModalEvent.bind(this));
    }

    static closeModalEvent() {
        this.closeModal();
    }

    static closeModal() {
        let modal = document.getElementById('modal');
        // Event listeners don't need to be removed as entire dom element is removed
        modal.remove();
        // Both restart and next level event handlers should reset the game progress and after its done event listener that resets the game progress
        document.dispatchEvent(new Event('remove-progress-reset-event-listener-after-level-completion'));
    }
}