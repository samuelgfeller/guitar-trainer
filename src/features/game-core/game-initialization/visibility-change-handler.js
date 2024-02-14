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
            if (this.coreGameCoordinator.stopAndResumeAfterVisibilityChange === true &&
                this.coreGameCoordinator.manuallyPaused === false &&
                this.coreGameCoordinator.gameRunning === true) {
                // When visible after a visibility change event, start game after 3s and request wake lock
                if (document.visibilityState === 'visible') {
                    // Display time before restart modal box
                    let htmlString = `<div id="modal" class="visibility-change-modal">
                             <div id="modal-box">
                             <div id="modal-header"></div>
                             <div id="modal-body">Time before restart<br><h1 id="countdown">1s</h1></div>
                             </div></div>`;
                    // Insert at end of page content which is in <main></main>
                    document.querySelector('main').insertAdjacentHTML('beforeend', htmlString);
                    document.getElementById('string-span').innerHTML = '';
                    document.getElementById('note-span').innerHTML = '';

                    let secondsRemainingUntilStart = 1;
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
                    document.dispatchEvent(new CustomEvent('game-stop', {'detail': 'visibility-change'}));
                }
            }
        });
    }
}