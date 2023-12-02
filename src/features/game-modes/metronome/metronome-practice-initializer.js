import {GameConfigurationManager} from "../../game-core/game-initialization/game-configuration-manager.js?v=489";

export class MetronomePracticeInitializer {
    initMetronomePractice() {
        document.querySelector('#game-start-instruction').querySelector('h3').innerHTML = `Metronome`;
        document.querySelector('#game-instruction-text').innerHTML =
            `<p>Click "Play" or double tap blank space to start the metronome.</p>
            <p>Select an exercise by clicking on the title. The metronome bpm value is stored for each exercise.</p>`
        GameConfigurationManager.showBpmInput();
        this.initBpmInputForMetronome();
        this.addExercisesHtml();
        this.addExerciseEventListeners();
    }

    addExercisesHtml() {
        document.querySelector('#game-start-instruction').insertAdjacentHTML('afterend', `
            <div id="exercise-container">
                <details open>
                    <summary><h3>Right-hand exercises</h3></summary>
                    <div class="exercise-grid">
                        <div tabindex="0" id="balancing-exercise">
                            <h4>Balancing</h4>
                            <video controls>
                                <source src="src/assets/videos/exercises/1-balancing.mp4" type="video/mp4">
                                Video not supported.
                            </video>
                        </div>
                        <!--string-changing-->
                        <div tabindex="0" id="string-changing-exercise">
                            <h4>String changing</h4>
                            <video controls>
                                <source src="src/assets/videos/exercises/2-string-changing.mp4" type="video/mp4">
                            </video>
                        </div>
                        <!--highlighting-->
                        <div tabindex="0" id="highlighting-exercise">
                            <h4>Highlighting</h4>
                            <video controls>
                                <source src="src/assets/videos/exercises/3-highlighting.mp4" type="video/mp4">
                            </video>
                        </div>
                        <!--arpeggio-->
                        <div tabindex="0" id="arpeggio-exercise">
                            <h4>Arpeggio</h4>
                            <video controls>
                                <source src="src/assets/videos/exercises/4-arpeggio.mp4" type="video/mp4">
                            </video>
                        </div>
                        <div tabindex="0" id="rasgueado-exercise">
                            <h4>Rasgueado</h4>
                            <video controls>
                                <source src="src/assets/videos/exercises/5-rasgueado.mp4" type="video/mp4">
                            </video>
                        </div>
                        <div tabindex="0" id="tremolo-exercise">
                            <h4>Arpeggio</h4>
                            <video controls>
                                <source src="src/assets/videos/exercises/6-tremolo.mp4" type="video/mp4">
                            </video>
                        </div>                        
                    </div>    
                </details>
                <details open>
                    <summary><h3>Left-hand exercises</h3></summary>
                    <div class="exercise-grid">
                        <div tabindex="0" id="spider-walk-exercise">
                            <h4>Spider walk</h4>
                            <video controls>
                                <source src="src/assets/videos/exercises/7-spider-walk.mp4" type="video/mp4">
                            </video>
                        </div>    
                        <div tabindex="0" id="hammer-on-exercise">
                            <h4>Hammer on</h4>
                            <video controls>
                                <source src="src/assets/videos/exercises/8-hammer-on.mp4" type="video/mp4">
                            </video>
                        </div>    
                        <div tabindex="0" id="pull-of-exercise">
                            <h4>Pull of</h4>
                            <video controls>
                                <source src="src/assets/videos/exercises/9-pull-off.mp4" type="video/mp4">
                            </video>
                        </div>    
                        <div tabindex="0" id="bar-chords-exercise">
                            <h4>Bar chords</h4>
                            <video controls>
                                <source src="src/assets/videos/exercises/10-bar-chords.mp4" type="video/mp4">
                            </video>
                        </div>    
                        <div tabindex="0" id="stretching-exercise">
                            <h4>Stretching</h4>
                            <video controls>
                                <source src="src/assets/videos/exercises/11-stretching.mp4" type="video/mp4">
                            </video>
                        </div>    
                    </div>    
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
                // Remove selected class from previously selected if there is one
                const previouslySelected = document.querySelector('.selected-exercise')
                previouslySelected?.classList.remove('selected-exercise');
                // Check if user clicks on the same exercise that was already selected
                if (!previouslySelected || previouslySelected.id !== exercise.id) {
                    // Only add selected class if there was either no previously selected exercise or if the user
                    // clicked on other exercise (otherwise it should just stay unselected)
                    exercise.classList.add('selected-exercise');
                    // Load BPM value for clicked exercise from localStorage
                    let savedBpm = localStorage.getItem(exercise.id + '-bpm');
                    if (savedBpm) {
                        bpmInput.value = savedBpm;
                    }
                } else {
                    // If already selected exercise is clicked, the selected class should not be added
                    //  and the initial metronome bpm value loaded
                    bpmInput.value = localStorage.getItem('metronome-bpm') ?? '60';
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
        });
    }
}