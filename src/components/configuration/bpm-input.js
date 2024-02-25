export class BpmInput {

    /**
     * Used by different initializers to show the bpm input
     */
    static addBpmInput() {
        document.querySelector('#header-center-container').innerHTML =
            `<img src="src/assets/images/arrow-left-icon.svg" alt="<" id="lower-bpm-btn" class="icon lvl-icon">
             <input type="number" min="0" value="60" id="bpm-input">
             <img src="src/assets/images/arrow-right-icon.svg" alt="<" id="higher-bpm-input" class="icon lvl-icon">`;

        // Add event listeners to step up or down input
        const bpmInput = document.querySelector('#bpm-input');
        // stepUp and stepDown on input type number don't automatically fire the "change" event
        const changeEvent = new Event('change');
        document.getElementById('higher-bpm-input').addEventListener('click', () => {
            bpmInput.stepUp();
            bpmInput.dispatchEvent(changeEvent);
        });
        document.getElementById('lower-bpm-btn').addEventListener('click', () => {
            bpmInput.stepDown();
            bpmInput.dispatchEvent(changeEvent);
        });
    }

    static removeBpmInput(){
        document.querySelector('#header-center-container').innerHTML = '';
    }
}