import {GameLevelTracker} from "../../game-core/game-progress/game-level-tracker.js?v=1.2.1";
import {GameElementsVisualizer} from "../../game-core/game-ui/game-elements-visualizer.js?v=1.2.1";
import {LevelUpVisualizer} from "../../game-core/game-ui/level-up-visualizer.js?v=1.2.1";
import {GameConfigurationManager} from "../../game-core/game-initialization/game-configuration-manager.js?v=1.2.1";

export class FretboardNoteGameInitializer {
    constructor() {
        this.levelLocalStorageKey = 'fretboard-note-game-accomplished-levels';
        // Needs to be in an attribute like this to have .bind(this) and be able to remove event listener
        this.levelUpEventHandler = this.levelUp.bind(this);
        // Needs to be in an attribute like this to have .bind(this) and be able to remove event listener
        this.bpmInputChangeEventHandlerVar = this.bpmInputChangeEventHandler.bind(this);
    }

    init() {
        GameConfigurationManager.showBpmInput();
        this.initBpmInputForFretboardNoteGame();

        document.addEventListener('leveled-up', this.levelUpEventHandler);

        document.querySelector('#game-mode-options').innerHTML = `
                    <label class='checkbox-button option-for-game-mode' id="fretboard-note-game-treble-clef">
                        <input type='checkbox'>
                        <!--<span class="normal-font-size"></span>-->
                        <img src="src/assets/images/treble-clef-icon.svg" class="button-icon">
                    </label>
                    <label class='checkbox-button option-for-game-mode' id="fretboard-note-game-treble-clef-and-name">
                        <input type='checkbox'>
                        <div style="display: flex; align-items: center">
                            <img src="src/assets/images/treble-clef-icon.svg" class="button-icon">
                            <span class="normal-font-size">+ name</span>
                        </div>
                    </label>
                    <label class='checkbox-button option-for-game-mode' id="challenging-notes-preset">
                        <input type="checkbox" alt="Preset challenging notes">
                        <img src="src/assets/images/challenging-icon.svg" class="button-icon">
                    </label>`;

        // Game instructions
        document.querySelector('#game-start-instruction').querySelector('h3').innerHTML =
            `Fretboard note game`;
        document.querySelector('#game-instruction-text').innerHTML = `
            <p>The number in the header corresponds to the metronome tempo (bpm) which will be the 
            frequency in which a new string and note will be displayed. Each bpm higher is one level higher.</p>
            <p>The goal is to play the note on the given string before time runs out.</p>
            <p>If it's too fast, lower the tempo to a rhythm that suits you.</p>
            <p>When you fail to play a note correctly, it gets added to the challenging notes list.</p>
            <p>The challenging notes have a higher chance of reappearing in the game to help you focus on learning
                them.</p>
            <p>The progress bar represents (on the left side) the number of challenging notes that still need to be 
            "learned" correctly until reaching 0 (on the right side). </p>
            <p>Each time you play a challenging note correctly 3 times, the progress bar advances.</p>
            <p>After mastering all challenging notes, 10 additional notes have to be played correctly to fill the
                progress bar to 100% and complete the level.</p>
            <p>Click <img class="icon" src="src/assets/images/play-icon.svg"> to start or resume the game, 
            or double-click a blank area.</p>
            `;
    }

    /**
     * When game mode is changed, the initialized event listeners should be removed
     */
    destroy() {
        document.querySelector('#bpm-input')
            .removeEventListener('change', this.bpmInputChangeEventHandlerVar);
        // Remove leveled up event handler
        document.removeEventListener('leveled-up', this.levelUpEventHandler);
        document.querySelector('header div').style.borderBottomColor = null;

        // These would have to be changed to arrow attributes to be able to remove them levelUp.bind(this) doesnt work
        // document.removeEventListener('leveled-up', this.levelUp.bind(this));
        // document.removeEventListener('go-to-next-level', this.goToNextLevel.bind(this));

    }

    levelUp() {
        // Store accomplished game level
        let level = document.getElementById('bpm-input').value;
        GameLevelTracker.addAccomplishedLevel(level, this.levelLocalStorageKey);
        // Fire game-stop event and display modal
        LevelUpVisualizer.stopGameAndDisplayLeveledUpModal(
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
        // Dispatch event to trigger same processes than when level is changed manually
        bpmInput.dispatchEvent(changeEvent);
        GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        // No need to call reset game progress here because it's called in the bpm input change event handler
    }

    restartLevel() {
        GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        document.dispatchEvent(new Event('reset-game-progress'));
    }


    initBpmInputForFretboardNoteGame() {
        const bpmInput = document.querySelector('#bpm-input');

        // Set bpm input to the current level which is always one higher than the last completed or the default value
        bpmInput.value = GameLevelTracker.getCurrentLevel(this.levelLocalStorageKey);


        // Level change event listener and handler
        bpmInput.addEventListener('change', this.bpmInputChangeEventHandlerVar);
    }

    bpmInputChangeEventHandler(){
        document.dispatchEvent(new Event('game-stop'));
        GameElementsVisualizer.hideGameElementsAndDisplayInstructions();
        GameElementsVisualizer.togglePlayPauseButton('stop');
        // Reset game progress in the form of an event to avoid having to need game progress instance here
        document.dispatchEvent(new Event('reset-game-progress'));

        // Update color to indicate that level is accomplished on bpm change event
        GameElementsVisualizer.updateIsLevelAccomplishedColor(this.levelLocalStorageKey);
    }
}
