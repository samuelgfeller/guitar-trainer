export class MetronomePracticeTimer {
    timer = null;

    static resetTimerForNewExercise(selectedExercise) {
        // Init var with as default value the timer for the right-hand exercises
        let exerciseTimer = document.querySelector('#right-hand-exercise-timer');
        // Remove timer for both hands
        exerciseTimer.innerHTML = '';
        document.querySelector('#left-hand-exercise-timer').innerHTML = '';
        if (selectedExercise === null) {
            // Remove timer for both hands if no exercise is selected and stop timer
            clearInterval(this.timer);
            return;
        }
        // If the left-hand exercise timer is closer to the selected exercise, use that one
        if (selectedExercise.closest('details').querySelector('#left-hand-exercise-timer')) {
            exerciseTimer = document.querySelector('#left-hand-exercise-timer');
        }
        // Set timer to the value from the input
        const exerciseTimerInputValue = document.querySelector('#exercise-timer-input').value;

        if (exerciseTimerInputValue && parseInt(exerciseTimerInputValue) !== 0) {
            exerciseTimer.innerHTML = exerciseTimerInputValue + ':00'
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
        const exerciseTimer = selectedExercise.closest('details').querySelector('.exercise-timer');
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