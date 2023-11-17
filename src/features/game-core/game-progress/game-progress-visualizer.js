export class GameProgressVisualizer {
    alreadyLeveledUp = false;
    constructor() {
    }

    updateGameProgress(percentage, movingBarLabel) {
        // document.querySelector('#challenging-count').innerText = this.noteGame.combinations.size;
        const progressBar = document.querySelector('.meter span');

        progressBar.innerText = movingBarLabel;
        document.querySelector('#progress-bar-right-side-label').innerHTML = '0';

        let progressBarWidth = percentage > 100 ? 100 : percentage;
        progressBar.style.width = `${progressBarWidth}%`;
        if (percentage >= 100) {
            progressBar.style.borderRadius = '20px';
            // Check if already leveled up for the case updateGameProgress is called twice times
            console.log(!this.alreadyLeveledUp)
            if (!this.alreadyLeveledUp) {
                // Dispatch leveled up event
                this.alreadyLeveledUp = true;
                document.dispatchEvent(new Event('leveled-up'));
            }
        } else {
            progressBar.style.borderRadius = null;
            this.alreadyLeveledUp = false;
        }
        // Remove span content of progress bar if its 0
        if (progressBarWidth === 0) {
            progressBar.innerText = '';
        }
    }

    resetProgress() {
        document.querySelector('#game-progress-div').style.display = 'none';
        document.querySelector('#score').style.display = 'none';
    }

    displayGameStats(correctCount, incorrectCount, maxWrongCombinations) {
        document.querySelector('#correct-count').innerText = correctCount;
        document.querySelector('#incorrect-count').innerText = incorrectCount;
        document.querySelector('#progress-bar-left-side-label').innerHTML = maxWrongCombinations;
    }
}