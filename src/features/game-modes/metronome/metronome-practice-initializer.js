import {MetronomePracticeTimer} from "./metronome-practice-timer.js?v=2.4.2";
import {LevelUpVisualizer} from "../../game-core/game-ui/level-up-visualizer.js?v=2.4.2";
import {BpmInput} from "../../../components/configuration/bpm-input.js?v=2.4.2";

export class MetronomePracticeInitializer {
    // Changed in metronome-practice-coordinator
    gameRunning = false;

    constructor() {
        this.levelUpEventHandler = this.levelUp.bind(this);
    }

    initMetronomePractice() {
        this.addOptionsHtml();
        document.querySelector('#game-start-instruction').innerHTML = '';
        // Creating a separate div after game-start-instructions for the metronome exercises as #game-start-instruction
        // is hidden when the game is running, which shouldn't happen for the metronome.
        document.querySelector('#game-start-instruction').insertAdjacentHTML('beforebegin', `
        <div class="game-instructions" id="metronome-instructions">
        <details open>
                    <summary><h3>Metronome</h3></summary>
                    <div>
                        <p>Click <img class="icon" src="src/assets/images/play-icon.svg" alt="play"> or double tap blank 
                        space to start the metronome.</p>
                        <p>Select an exercise by clicking on the title.</p>
                        <p>To track the practice time, you can set a timer below. The metronome pauses when the timer runs out.
                         To start the timer for an exercise, select it and then click on the timer in the top right 
                         corner of the exercise or press the play button.</p>
                        <p>Exercise timer: <input id="exercise-timer-input" type="number">min</p>
                    </div>
                </details>
                </div>
        `);
        BpmInput.addBpmInput();
        this.initBpmAndBeatsPerParInputForMetronome();
        this.initTimerInputForExercises();
        this.addExercisesHtml();
        this.addExerciseEventListeners();
        document.addEventListener('leveled-up', this.levelUpEventHandler);
    }

    destroy() {
        document.querySelector('#exercise-container')?.remove();
        document.removeEventListener('leveled-up', this.levelUpEventHandler);
        document.querySelector('#metronome-instructions').remove();
    }

    levelUp() {
        const selectedExercise = document.querySelector('.selected-exercise');
        // Restart timer
        const restartTimer = () => {
            MetronomePracticeTimer.resetTimerForNewExercise(selectedExercise, true);
        }

        const goToNextExercise = () => {
            // Simulate click on exercise div next to the currently selected one
            selectedExercise.nextElementSibling.click();
        }

        // Fire game-stop event and display modal
        LevelUpVisualizer.stopGameAndDisplayLeveledUpModal(
            `Practice completed!`,
            'Next exercise',
            goToNextExercise, restartTimer
        );

    }

    // Cannot be in timer class as it needs the gameRunning attribute
    initTimerInputForExercises() {
        const exerciseTimerInput = document.querySelector('#exercise-timer-input');
        // Load value from localStorage
        exerciseTimerInput.value = localStorage.getItem('exercise-timer') ?? '';
        // Init change event listener for exercise timer input
        exerciseTimerInput.addEventListener('change', (e) => {
            // Reset timer for new exercise
            MetronomePracticeTimer.resetTimerForNewExercise(
                document.querySelector('.selected-exercise'), this.gameRunning
            );

            // Save value to localStorage
            localStorage.setItem('exercise-timer', exerciseTimerInput.value);
        });
    }

    addOptionsHtml() {
        // Add game mode options (have to be added before the other initializations as they might depend on options)
        document.querySelector('#game-mode-options').innerHTML = `
                                               <!-- For simplicity, the no-guitar option has the same id for all game modes and 
                             the core-game-coordination-initializer sets the metronomeEnabled and noteDetectorEnabled values -->
                            <div id="metronome-beat-range-slider-container" class="game-option-range-slider">
                                                <span>Beats/4</span>
                                                <div class="option-for-game-mode">
                                                    <input type="range" min='1' max='8' value='1' step='1' class="ignore-default-local-storage"
                                                           list="beat-level-options" id="beats-per-bar-range-slider"/>
                                                    <datalist class="range-level-options" id="beat-level-options">
                                                        <option value="1" label="1"></option>
                                                        <option value="2" label="2"></option>
                                                        <option value="3" label="3"></option>
                                                        <option value="4" label="4"></option>
                                                        <option value="5" label="5"></option>
                                                        <option value="6" label="6"></option>
                                                        <option value="7" label="7"></option>
                                                        <option value="8" label="8"></option>
                                                    </datalist>
                                                </div> 
                                                 </div>`;
    }

    /**
     * Returns HTML for the exercise div
     * @param {string} name lowercase name spaces separated by dashes
     * @param {string} fileName name of the video file
     * @return {string}
     */
    getExerciseDiv(name, fileName) {
        // Capitalize name and remove dashes
        const nameWithoutDashes = name.replace('-', ' ');
        // Capitalize first letter and attach rest of the word to it
        const nameCapitalized = nameWithoutDashes.charAt(0).toUpperCase() + nameWithoutDashes.slice(1);
        return `<div tabindex="0" id="${name}-exercise">
                    <h4>${nameCapitalized}</h4>
                   <span ></span>
                    <div class="video-overlay">
                       <h3 class="overlay-text">${nameCapitalized}</h3>
                    </div>
                    <video controls>
                        <source src="src/assets/videos/exercises/${fileName}" type="video/mp4">
                        <source src="src/assets/videos/exercises/nonweboptimized/${fileName}" type="video/mp4">
                        Video not supported.
                    </video>
                </div>`;
    }

    addExercisesHtml() {
        document.querySelector('#metronome-instructions').insertAdjacentHTML('afterend', `
            <div id="exercise-container">
                <span class="exercise-timer" id="exercise-timer"></span>
                <details open>
                    <summary><h3>Right-hand exercises</h3></summary>
                    <div class="exercise-grid">
                        ${this.getExerciseDiv('balancing', '1-balancing.mp4')}
                        ${this.getExerciseDiv('string-changing', '2-string-changing.mp4')}
                        ${this.getExerciseDiv('highlighting', '3-highlighting.mp4')}
                        ${this.getExerciseDiv('arpeggio', '4-arpeggio.mp4')}
                        ${this.getExerciseDiv('rasgueado', '5-rasgueado.mp4')}
                        ${this.getExerciseDiv('tremolo', '6-tremolo.mp4')}         
                    </div>    
                </details>
                <details open>
                    <summary><h3>Left-hand exercises</h3></summary>
                    <div class="exercise-grid">
                        ${this.getExerciseDiv('spider-walk', '7-spider-walk.mp4')}
                        ${this.getExerciseDiv('hammer-on', '8-hammer-on.mp4')}
                        ${this.getExerciseDiv('pull-of', '9-pull-off.mp4')}
                        ${this.getExerciseDiv('bar-chords', '10-bar-chords.mp4')}
                        ${this.getExerciseDiv('stretching', '11-stretching.mp4')}
                    </div>    
                </details>
                <details>
                    <summary><h3>Source</h3></summary>
                    The snippets are parts of the video <a href="https://www.youtube.com/watch?v=zPiFuqT3XqU" 
            target="_blank">The Only Exercises You Need</a> by BeatrixGuitar
                </details>
            </div>

        `);
    }

    addExerciseEventListeners() {
        let exerciseDivs = document.querySelectorAll('.exercise-grid > div');
        // Loop over exercises
        exerciseDivs.forEach((exercise) => {
            // Add event listener to each exercise (bind this and give exercise as first argument)
            exercise.addEventListener('click', this.handleExerciseChangeEvent.bind(this, exercise));
        });

        // Dispatch game-start or game-stop event when click on exercise-timer
        document.querySelector('#exercise-timer').addEventListener('click', () => {
            if (this.gameRunning) {
                document.dispatchEvent(new Event('game-stop'));
            } else {
                document.dispatchEvent(new Event('game-start'));
            }
        });
    }

    handleExerciseChangeEvent(exercise, e) {
        const bpmInput = document.querySelector('#bpm-input');
        const beatsPerBarRangeSlider = document.querySelector('#beats-per-bar-range-slider');

        if (e.target === exercise.querySelector('video') || e.target === exercise.querySelector('#exercise-timer')) {
            // If the user clicks on video tag, don't deselect exercise
            return;
        }

        // Remove selected class from the previously selected by default if there is one
        const previouslySelected = document.querySelector('.selected-exercise')
        previouslySelected?.classList.remove('selected-exercise');

        // If another exercise was selected or the exercise was unselected,
        // dispatch change event on bpm input and pause video
        const dispatchChangeEventAndPauseVideo = () => {
            bpmInput.dispatchEvent(new Event('change'));
            // Pause video
            previouslySelected?.querySelector('video')?.pause();
        }

        // Check if user clicks on the same exercise that was already selected (except if it's the video tag)
        // Add selected-exercise to the clicked exercise
        if (!previouslySelected || previouslySelected.id !== exercise.id) {
            // Only add selected class if there was either no previously selected exercise or if the user
            // clicked on new exercise (otherwise it should just stay unselected)
            exercise.classList.add('selected-exercise');
            // Load BPM value for clicked exercise from localStorage
            let savedMetronomeValues = this.getExerciseBpmAndBeatsPerBarJson(exercise.id);
            if (savedMetronomeValues) {
                bpmInput.value = savedMetronomeValues['bpm'];
                beatsPerBarRangeSlider.value = savedMetronomeValues['beatsPerBar'];
            }
            dispatchChangeEventAndPauseVideo();
            MetronomePracticeTimer.resetTimerForNewExercise(exercise, this.gameRunning);
        } else if (previouslySelected.id === exercise.id) {
            // If already selected exercise is clicked, the selected class should not be added
            // and the initial metronome bpm value loaded
            this.setDefaultMetronomeBpmAndBeatsPerBar();

            // Dispatch game-stop event
            document.dispatchEvent(new Event('game-stop'));
            dispatchChangeEventAndPauseVideo();
            MetronomePracticeTimer.resetTimerForNewExercise(null, this.gameRunning);
        }
    }

    getExerciseBpmAndBeatsPerBarJson(exerciseId) {
        return JSON.parse(localStorage.getItem(exerciseId));
    }

    saveBpmAndBeatsPerBarInLocalstorage(exerciseId) {
        const bpm = document.querySelector('#bpm-input').value;
        const beatsPerBar = document.querySelector('#beats-per-bar-range-slider').value;
        localStorage.setItem(exerciseId, JSON.stringify({'bpm': bpm, 'beatsPerBar': beatsPerBar}));
    }

    setDefaultMetronomeBpmAndBeatsPerBar() {
        const bpmInput = document.querySelector('#bpm-input');
        const beatsPerBarRangeSlider = document.querySelector('#beats-per-bar-range-slider');

        let savedMetronomeValues = this.getExerciseBpmAndBeatsPerBarJson('metronome-bpm');
        savedMetronomeValues = savedMetronomeValues ?? {bpm: 60, beatsPerBar: 4};
        bpmInput.value = savedMetronomeValues['bpm'];
        beatsPerBarRangeSlider.value = savedMetronomeValues['beatsPerBar'];
    }

    initBpmAndBeatsPerParInputForMetronome() {
        const bpmInput = document.querySelector('#bpm-input');
        // Set bpm input value to the one from local storage
        this.setDefaultMetronomeBpmAndBeatsPerBar();
        // Store new value in localstorage
        bpmInput.addEventListener('change', (e) => {
            const selectedExercise = document.querySelector('.selected-exercise');

            if (selectedExercise) {
                // localStorage.setItem(`${selectedExercise.id}`, e.target.value);
                this.saveBpmAndBeatsPerBarInLocalstorage(selectedExercise.id);
            } else {
                // Save current BPM value to general metronome-bpm value localStorage
                this.saveBpmAndBeatsPerBarInLocalstorage('metronome-bpm');
                // localStorage.setItem('metronome-bpm', e.target.value);
            }
            if (this.gameRunning) {
                // Update metronome bpm
                document.dispatchEvent(new Event('game-stop'));
                document.dispatchEvent(new Event('game-start'));
            }
        });

        const beatsPerBarRangeSlider = document.querySelector('#beats-per-bar-range-slider');
        // Default values already set above
        // Store new value for each exercise in localstorage when changed
        beatsPerBarRangeSlider.addEventListener('change', (e) => {
            const selectedExercise = document.querySelector('.selected-exercise');
            if (selectedExercise) {
                this.saveBpmAndBeatsPerBarInLocalstorage(selectedExercise.id);
            } else {
                this.saveBpmAndBeatsPerBarInLocalstorage('metronome-bpm');
            }
            if (this.gameRunning) {
                // Update metronome bpm
                document.dispatchEvent(new Event('game-stop'));
                document.dispatchEvent(new Event('game-start'));
            }
        });

    }
}