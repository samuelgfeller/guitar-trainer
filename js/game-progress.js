export class GameProgress {
    constructor(gameUI) {
        this.gameUI = gameUI;
        this.closeModalEventHandler = this.closeModalEvent.bind(this);
        this.nextLevelEventHandler = this.nextLevelEvent.bind(this);
    }

    leveledUp() {
        this.gameUI.noteGame.gameStarter.stopGame();
        document.querySelector('header div').style.borderBottomColor = 'green';
        this.addAccomplishedLevel(document.getElementById('bpm-input').value);

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
    }

    closeModalEvent() {
        this.closeModal();
    }

    closeModal() {
        let modal = document.getElementById('modal');
        document.getElementById('close-modal-btn').removeEventListener('click', this.closeModalEventHandler);
        document.getElementById('next-lvl-modal-btn').removeEventListener('click', this.nextLevelEventHandler);
        modal.remove();
    }

    nextLevelEvent() {

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

}