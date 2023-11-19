import {GameLevelTracker} from "../../game-core/game-progress/game-level-tracker.js";
import {GameElementsVisualizer} from "../../game-core/game-ui/game-elements-visualizer.js";
import {LevelUpVisualizer} from "../../game-core/game-ui/level-up-visualizer.js";

export class FretboardNoteGameInitializer {
    constructor() {
        this.levelLocalStorageKey = 'fretboard-note-game-level';
    }

    init() {
        // Set bpmInput value to current level for this game mode
        const bpmInput = document.querySelector('#bpm-input');

        // Set bpm input to the current level which is always one higher than the last completed or the default value
        bpmInput.value = GameLevelTracker.getCurrentLevel(this.levelLocalStorageKey);

        // Update color to indicate that level is accomplished on bpm change event
        bpmInput.addEventListener('change', this.updateIsLevelAccomplishedColor);
        console.log('leveldup event listner added')
        document.addEventListener('leveled-up', this.levelUp.bind(this));
    }

    /**
     * When game mode is changed, the initialized event listeners should be removed
     */
    destroy() {
        // document.querySelector('#bpm-input')
        //     .removeEventListener('change', this.updateIsLevelAccomplishedColor);
        // // These would have to be changed to arrow attributes to be able to remove them levelUp.bind(this) doesnt work
        // document.removeEventListener('leveled-up', this.levelUp.bind(this));
        // document.removeEventListener('go-to-next-level', this.goToNextLevel.bind(this));
    }

    updateIsLevelAccomplishedColor() {
        GameElementsVisualizer.updateIsLevelAccomplishedColor('fretboard-note-game-level');
    }

    levelUp() {
        // Store accomplished game level
        let level = document.getElementById('bpm-input').value;
        GameLevelTracker.addAccomplishedLevel(level, this.levelLocalStorageKey);
        // Fire game-stop event and display modal
        LevelUpVisualizer.displayLeveledUpModal(
            'Level completed!',
            'Go to next level',
            this.goToNextLevel.bind(this),
            this.restartLevel);
    }

    goToNextLevel() {
        console.log('goToNextLevel');
        let bpmInput = document.getElementById('bpm-input');
        bpmInput.stepUp();
        // stepUp on input type number doesn't automatically fire the "change" event.
        // And the change event automatically resets the game progress so this has to be called before it can be removed
        const changeEvent = new Event('change');
        bpmInput.dispatchEvent(changeEvent);
        GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        // document.dispatchEvent(new Event('go-to-next-level'));
        // No need to call reset game progress here because it's called in the bpm input change event handler
    }

    restartLevel() {
        GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        // Game progress is reset each time beginGame is called as a new instance of display notes is created with
        // new default attributes
        // document.dispatchEvent(new Event('reset-game-progress'))
    }

}
