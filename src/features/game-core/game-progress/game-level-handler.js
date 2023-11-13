export class GameLevelHandler {
    constructor(gameUI) {
        this.gameUI = gameUI;
        this.closeModalEventHandler = this.closeModalEvent.bind(this);
        this.nextLevelEventHandler = this.nextLevelEvent.bind(this);
        this.defaultStartingLevel = 13;
    }

    leveledUp() {
        this.gameUI.noteGame.gameStarter.gameCoordinator.stopGame();
        document.querySelector('header div').style.borderBottomColor = 'green';
        this.addAccomplishedLevel(document.getElementById('bpm-input').value);
        this.gameUI.alreadyLeveledUp = true;

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
        document.getElementById('next-lvl-modal-btn').addEventListener('click', this.nextLevelEventHandler);
        document.getElementById('modal').addEventListener('click', this.closeModalEventHandler);
    }

    closeModalEvent() {
        this.closeModal();
    }

    closeModal() {
        let modal = document.getElementById('modal');
        document.getElementById('close-modal-btn').removeEventListener('click', this.closeModalEventHandler);
        document.getElementById('next-lvl-modal-btn').removeEventListener('click', this.nextLevelEventHandler);
        document.getElementById('modal').removeEventListener('click', this.closeModalEventHandler);
        modal.remove();
    }

    nextLevelEvent() {
        this.gameUI.clearStats();
        let bpmInput = document.getElementById('bpm-input');
        bpmInput.stepUp();
        // stepUp on input type number doesn't automatically fire the "change" event
        const changeEvent = new Event('change');
        bpmInput.dispatchEvent(changeEvent);
        this.gameUI.noteGame.gameStarter.gameInitializer.hideGameElementsAndDisplayInstructions();
    }

    // Store the accomplished levels in localStorage
    storeAccomplishedLevels(levels) {
        localStorage.setItem('accomplishedLevels', JSON.stringify(levels));
    }

    // Add an accomplished level to the list in localStorage
    addAccomplishedLevel(level) {
        let levels = this.getAccomplishedLevels();
        if (!levels.includes(level)) {
            levels.push(level);
            this.storeAccomplishedLevels(levels);
        }
    }

    // Get the list of accomplished levels from localStorage
    getAccomplishedLevels() {
        let levels = localStorage.getItem('accomplishedLevels');
        if (levels) {
            return JSON.parse(levels);
        } else {
            return [];
        }
    }

    // Check if a level is accomplished
    isLevelAccomplished(level) {
        let levels = this.getAccomplishedLevels();
        return levels.includes(level);
    }

    /**
     * Get the current level which is always one higher than the last completed or the default value
     * @return {number}
     */
    getCurrentLevel(){
        let levels = this.getAccomplishedLevels();
        if (Array.isArray(levels) && levels.length > 0) {
            return parseInt(levels[levels.length - 1]) + 1;
        }
        // Return default level
        return this.defaultStartingLevel;
    }

}