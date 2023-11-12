export class GameInitializer {
    constructor(gameStarter) {
        this.gameStarter = gameStarter;
        this.startStopButton = document.querySelector('#start-stop-btn');
        // When only metronome should be played and not the whole game (when sound on before pressing start)
        this.onlyMetronome = false;
        this.gameManuallyPaused = false;
    }

    initSettings() {
        // Settings toggle button
        document.getElementById('settings-toggle-btn').addEventListener('click', (e) => {
            this.toggleSettingsExpand();
        });
        const settingSwitches = document.querySelectorAll('#settings-div label');
        for (const setting of settingSwitches) {
            const input = setting.querySelector('input');
            // Event listener to save setting switch in localstorage when changed
            setting.addEventListener('click', () => {
                localStorage.setItem(setting.id, input.checked ? '1' : '0');
            });
            // Set the input checked state with the one from local storage
            if ((localStorage.getItem(setting.id) ?? '0') === '1') {
                input.checked = true;
            }
        }
    }

    initGameStartStopEventListeners() {
        // Start / stop button event listener
        this.startStopButton.addEventListener('click', this.gameStarter.startStopGame.bind(this.gameStarter));
        // Self has to be used in the following as we loose the "this" context in the event listener anonymous func
        let self = this;
        // Start on double click anywhere in the body
        document.addEventListener('dblclick', function (e) {
            // Check if the target is <body> or if a parent of the target is <main>
            if (e.target === document.body || e.target.closest('main')) {
                self.gameStarter.startStopGame();
            }
        });
        // Start with Enter key press on bpm input
        document.querySelector('#bpm-input').addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.gameStarter.startStopGame();
            }
        });
    }

    initBpmInputChangeListener() {
        const bpmInput = document.querySelector('#bpm-input');

        // Set bpm input to the current level which is always one higher than the last completed or the default value
        bpmInput.value = this.gameStarter.noteGame.gameUI.gameProgress.getCurrentLevel();

        // Level change event listener
        bpmInput.addEventListener('change', (e) => {
            updateIsLevelAccomplishedColor(bpmInput);
            this.gameStarter.stopGame();
            this.hideGameElementsAndDisplayInstructions();
            this.gameStarter.noteGame.gameUI.clearStats();
            this.startStopButton.innerText = 'Play';
        });
        // stepUp and stepDown on input type number don't automatically fire the "change" event
        const changeEvent = new Event('change');
        document.getElementById('next-lvl-btn').addEventListener('click', () => {
            bpmInput.stepUp();
            bpmInput.dispatchEvent(changeEvent);
        });
        document.getElementById('previous-lvl-btn').addEventListener('click', () => {
            bpmInput.stepDown();
            bpmInput.dispatchEvent(changeEvent);
        });

        /**
         * Change color of the bottom line to indicated level is accomplished
         * @param bpmInput
         */
        const updateIsLevelAccomplishedColor = (bpmInput) => {
            if (this.gameStarter.noteGame.gameUI.gameProgress.isLevelAccomplished(bpmInput.value)) {
                document.querySelector('header div').style.borderBottomColor = 'green';
            } else {
                document.querySelector('header div').style.borderBottomColor = null;
            }
        }
    }

    /**
     * When user quits the website (visibility change) the game should be stopped
     * and screen wake lock released. On return, game should be resumed (after countdown)
     * and wake lock requested.
     */
    initPauseAndResumeGameOnVisibilityChange() {
        let countdownInterval;
        document.addEventListener('visibilitychange', (e) => {
            // In case visibility change event was fired multiple times before 3s countdown
            clearInterval(countdownInterval);
            document.getElementById('modal')?.remove();
            // If not only metronome is playing (meaning the normal game)
            if (this.onlyMetronome !== true && this.gameManuallyPaused === false) {
                // When visible after a visibility change event, start game after 3s and request wake lock
                if (document.visibilityState === 'visible') {
                    // Display time before restart modal box
                    let htmlString = `<div id="modal">
                          <div id="modal-box">
                          <div id="modal-header">Time before restart</div>
                          <div id="modal-body"><h1 id="countdown">3s</h1></div>
                          </div></div>`;
                    // Insert at end of page content which is in <main></main>
                    document.getElementById('score').insertAdjacentHTML('beforeend', htmlString);
                    let secondsRemainingUntilStart = 3;
                    countdownInterval = setInterval(() => {
                        secondsRemainingUntilStart--;
                        if (secondsRemainingUntilStart > 0) {
                            document.getElementById('countdown').innerText = secondsRemainingUntilStart + 's';
                        } else {
                            document.getElementById('modal').remove();
                            this.gameStarter.startGame();
                            clearInterval(countdownInterval);
                        }
                    }, 1000);
                } else {
                    // When not visible after event, pause game and disable wake lock
                    this.gameStarter.stopGame();
                    this.gameStarter.gameInitializer.hideGameElementsAndDisplayInstructions();
                }
            }
        });
    }

    hideGameElementsAndDisplayInstructions() {
        document.querySelectorAll('.visible-when-game-on').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelector('#game-start-instruction').style.display = 'block';
    }
    toggleSettingsExpand() {
        document.getElementById('settings-div').classList.toggle('expanded');
    }
}