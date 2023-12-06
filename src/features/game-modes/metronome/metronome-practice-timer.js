export class MetronomePracticeTimer {
    timer = null;

    static resetTimerForNewExercise(selectedExercise, gameRunning = false) {
        // Init var with as default value the timer for the right-hand exercises
        let exerciseTimer = document.querySelector('#exercise-timer');
        // Remove timer
        exerciseTimer.innerHTML = '';
        // Pause timer
        clearInterval(this.timer);

        if (selectedExercise === null) {
            // Return after timer is removed if no selected exercise
            return;
        }

        // Place exercise timer above the selected exercise
        // selectedExercise.parentNode.insertBefore(exerciseTimer, selectedExercise);
        // Place exercise timer inside the selected exercise
        selectedExercise.appendChild(exerciseTimer);

        // Set timer to the value from the input
        const exerciseTimerInputValue = document.querySelector('#exercise-timer-input').value;

        if (exerciseTimerInputValue && parseInt(exerciseTimerInputValue) !== 0) {
            exerciseTimer.innerHTML = exerciseTimerInputValue + ':00'
        }

        if (gameRunning) {
            // Start timer for selected exercise
            this.startCountDownTimer();
        }
    }
    static secondsToMinutesAndSeconds(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secondsLeft = seconds % 60;
        // Add leading zero if seconds < 10
        if (secondsLeft < 10) {
            secondsLeft = '0' + secondsLeft;
        }
        return minutes + ':' + secondsLeft;
    }

    static startCountDownTimer() {
        // If no exercise is selected, return
        const selectedExercise = document.querySelector('.selected-exercise');

        if (selectedExercise === null) {
            return;
        }
        // Get the correct exercise timer
        const exerciseTimer = document.querySelector('#exercise-timer');
        const exerciseTimerValue = exerciseTimer.innerHTML;

        // If no timer is set, return
        if (exerciseTimerValue === '') {
            return;
        }

        const exerciseTimerMinutes = exerciseTimerValue.split(':')[0];
        const exerciseTimerSeconds = exerciseTimerValue.split(':')[1];
        let exerciseTimerSecondsLeft = exerciseTimerMinutes * 60 + parseInt(exerciseTimerSeconds);

        // Start timer
        this.timer = setInterval(() => {
            exerciseTimerSecondsLeft--;
            // Update timer
            exerciseTimer.innerHTML = this.secondsToMinutesAndSeconds(exerciseTimerSecondsLeft);
            // Stop timer if time is up
            if (exerciseTimerSecondsLeft <= 0) {
                clearInterval(this.timer);
                // Dispatch level-up event
                document.dispatchEvent(new Event('leveled-up'));
                console.log('leveled-up');
            }
        }, 1000);
    }

    static pauseCountDownTimer() {
        // If no exercise is selected, return
        const selectedExercise = document.querySelector('.selected-exercise');
        if (selectedExercise === null) {
            return;
        }
        // Pause timer
        clearInterval(this.timer);
    }
}