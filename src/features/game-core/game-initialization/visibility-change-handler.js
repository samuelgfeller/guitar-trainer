import {GameElementsVisualizer} from "../game-ui/game-elements-visualizer.js?v=1.1.1";

export class VisibilityChangeHandler {

    /**
     *
     * @param {CoreGameCoordinator} coreGameCoordinator
     */
    constructor(coreGameCoordinator) {
        this.coreGameCoordinator = coreGameCoordinator;
    }
    /**
        * When user quits the website (visibility change) the game should be stopped
        * and screen wake lock released. On return, game should be resumed (after countdown)
        * and wake lock requested.
        */
       initPauseAndResumeGameOnVisibilityChange() {
        let countdownInterval;
        document.addEventListener('visibilitychange', (e) => {
            // In case visibility change event was fired multiple times before count down finished
            clearInterval(countdownInterval);
            // Remove existing visibility change modal if there was one
            document.querySelector('#modal.visibility-change-modal')?.remove();
            // If not only metronome is playing (meaning the normal game)
            console.log(this.coreGameCoordinator.stopAndResumeAfterVisibilityChange);
            if (this.coreGameCoordinator.stopAndResumeAfterVisibilityChange === true) {
                // When visible after a visibility change event, start game after 3s and request wake lock
                if (document.visibilityState === 'visible') {
                    // Display time before restart modal box
                    let htmlString = `<div id="modal" class="visibility-change-modal">
                             <div id="modal-box">
                             <div id="modal-header">Time before restart</div>
                             <div id="modal-body"><h1 id="countdown">2s</h1></div>
                             </div></div>`;
                    // Insert at end of page content which is in <main></main>
                    document.querySelector('main').insertAdjacentHTML('beforeend', htmlString);
                    let secondsRemainingUntilStart = 2;
                    countdownInterval = setInterval(() => {
                        secondsRemainingUntilStart--;
                        if (secondsRemainingUntilStart > 0) {
                            document.getElementById('countdown').innerText = secondsRemainingUntilStart + 's';
                        } else {
                            document.getElementById('modal').remove();
                            // this.coreGameCoordinationInitializer.coreGameCoordinator.startGame();
                            clearInterval(countdownInterval);
                            // Game start event
                            document.dispatchEvent(new Event('game-start'));
                        }
                    }, 1000);
                } else {
                    // When not visible after visibility change event, pause game and disable wake lock
                    // this.coreGameCoordinationInitializer.coreGameCoordinator.stopGame();
                    // Stop game event
                    document.dispatchEvent(new Event('game-stop'));
                    GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
                }
            }
        });
    }
}