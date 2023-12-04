import {GameConfigurationManager} from "../../game-core/game-initialization/game-configuration-manager.js?v=1.1.5";

export class MetronomePracticeInitializer {
    // Changed in metronome-practice-coordinator
    gameRunning = false;

    initMetronomePractice() {
        document.querySelector('#game-start-instruction').querySelector('h3').innerHTML = `Metronome`;
        document.querySelector('#game-instruction-text').innerHTML =
            `<p>Click <img class="icon" src="src/assets/images/play-icon.svg"> or double tap blank space to start the metronome.</p>
            <p>Select an exercise by clicking on the title. The metronome bpm value is stored for each exercise.</p>`
        GameConfigurationManager.showBpmInput();
        this.initBpmInputForMetronome();
        this.addExercisesHtml();
        this.addExerciseEventListeners();
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
                    <img src="src/assets/images/checkmark-icon.svg" alt="x">
                    <div class="video-overlay">
                       <h3 class="overlay-text">${nameCapitalized}</h3>
                    </div>
                    <video controls>
                        <source src="src/assets/videos/exercises/${fileName}" type="video/mp4">
                        Video not supported.
                    </video>
                </div>`;
    }

    addExercisesHtml() {
        document.querySelector('#game-start-instruction').insertAdjacentHTML('afterend', `
            <div id="exercise-container">
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
                    The snippets are parts of the awesome video <a href="https://www.youtube.com/watch?v=zPiFuqT3XqU" 
            target="_blank">The Only Exercises You Need</a> by BeatrixGuitar
                </details>
            </div>

        `);
    }

    addExerciseEventListeners() {
        let exerciseDivs = document.querySelectorAll('.exercise-grid > div');
        let bpmInput = document.querySelector('#bpm-input');
        // Loop over exercises
        exerciseDivs.forEach((exercise) => {
            exercise.addEventListener('click', (e) => {
                if (e.target === exercise.querySelector('video')) {
                    // If the user clicks on video tag, don't select exercise
                    return;
                }

                // Remove selected class from the previously selected by default if there is one
                const previouslySelected = document.querySelector('.selected-exercise')
                previouslySelected?.classList.remove('selected-exercise');

                // If another exercise was selected or the exercise was unselected,
                // dispatch change event on bpm input and pause video
                const dispatchChangeEventAndPauseVideo = () =>
                {
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
                    let savedBpm = localStorage.getItem(exercise.id + '-bpm');
                    if (savedBpm) {
                        bpmInput.value = savedBpm;
                    }
                    dispatchChangeEventAndPauseVideo();
                } else if (previouslySelected.id === exercise.id) {
                    // If already selected exercise is clicked, the selected class should not be added
                    // and the initial metronome bpm value loaded
                    bpmInput.value = localStorage.getItem('metronome-bpm') ?? '60';
                    dispatchChangeEventAndPauseVideo();
                }
            });
        });
    }

    initBpmInputForMetronome() {
        const bpmInput = document.querySelector('#bpm-input');
        // Set bpm input value to the one from local storage
        bpmInput.value = localStorage.getItem('metronome-bpm') ?? '60';
        // Store new value in localstorage
        bpmInput.addEventListener('change', (e) => {
            const selectedExercise = document.querySelector('.selected-exercise');

            if (selectedExercise) {
                localStorage.setItem(`${selectedExercise.id}-bpm`, e.target.value);
            } else {
                // Save current BPM value to localStorage
                localStorage.setItem('metronome-bpm', e.target.value);
            }
            if (this.gameRunning) {
                // Update metronome bpm
                document.dispatchEvent(new Event('game-stop'));
                document.dispatchEvent(new Event('game-start'));
            }
        });
    }
}