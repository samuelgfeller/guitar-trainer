import {GameLevelTracker} from "../../game-core/game-progress/game-level-tracker.js";
import {GameElementsVisualizer} from "../../game-core/game-ui/game-elements-visualizer.js";
import {LevelUpVisualizer} from "../../game-core/game-ui/level-up-visualizer.js";

export class FretboardNoteGameInitializer {
    levelLocalStorageKey = 'fretboard-note-game-level';

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
        document.querySelector('#bpm-input')
            .removeEventListener('change', this.updateIsLevelAccomplishedColor);
    }

    updateIsLevelAccomplishedColor() {
        GameElementsVisualizer.updateIsLevelAccomplishedColor('fretboard-note-game-level');
    }

    levelUp() {
        // Store accomplished game level
        let level = document.getElementById('bpm-input').value;
        GameLevelTracker.addAccomplishedLevel(level, this.levelLocalStorageKey);
        // Fire game-stop event and display modal
        LevelUpVisualizer.displayLeveledUpModal('Level completed!', 'Go to next level', this.goToNextLevel.bind(this), this.restartLevel);
    }

    goToNextLevel() {
        console.log('goToNextLevel');
        let bpmInput = document.getElementById('bpm-input');
        bpmInput.stepUp();
        // stepUp on input type number doesn't automatically fire the "change" event
        const changeEvent = new Event('change');
        bpmInput.dispatchEvent(changeEvent);
        GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        console.log('reset game progrress dispatcheed')
        document.dispatchEvent(new Event('reset-game-progress'));
    }

    restartLevel(){
        GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        // document.dispatchEvent(new Event('reset-game-progress'))
    }

}
