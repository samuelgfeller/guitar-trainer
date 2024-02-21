export class DualRangeSlider {
    static addSelectionSlider() {
        document.querySelector('#roadmap-selector-instructions').insertAdjacentHTML('beforeend', `
                <div id="dual-range-slider-wrapper">
                <div class="dual-range-slider-container normal-font-size">
                    <div class="slider-track normal-font-size"></div>
                    <input type="range" class="normal-font-size" min="0" max="11" value="2" id="slider-1">
                    <input type="range" class="normal-font-size" min="0" max="11" value="6" id="slider-2">
                </div>
                </div>
            `);
        // Set values of sliders to the saved values in the local storage
        this.setSliderValuesFromLocalStorage();

        // Add selection slider event listeners
        this.addSelectionSliderEventListeners();
    }

    static setSliderValuesFromLocalStorage() {
        const fretboardNr = document.querySelector(`.fretboard-for-shapes:not(.inactive-fretboard)`).dataset.fretboardNr;
        const savedFretRange = localStorage.getItem(`fret-range-${fretboardNr}`);
        if (savedFretRange) {
            const { lowerLimit, upperLimit } = JSON.parse(savedFretRange);
            document.getElementById('slider-1').value = lowerLimit;
            document.getElementById('slider-2').value = upperLimit;
            // Trigger the event listeners to update the fretboard
            document.getElementById('slider-1').dispatchEvent(new Event('input'));
            document.getElementById('slider-2').dispatchEvent(new Event('input'));
        }
    }


    static addSelectionSliderEventListeners() {
        let sliderOne = document.getElementById("slider-1");
        let sliderTwo = document.getElementById("slider-2");
        let minGap = 1;
        let sliderTrack = document.querySelector(".slider-track");
        let sliderMaxValue = document.getElementById("slider-1").max;

        sliderOne.addEventListener("input", handleSlideOneEvent);
        sliderTwo.addEventListener("input", handleSlideTwoEvent);

        function handleSlideOneEvent(e = null) {
            if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
                sliderOne.value = parseInt(sliderTwo.value) - minGap;
            }
            handleSliderChangeEvent(e);
        }

        function handleSlideTwoEvent(e = null) {
            if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
                sliderTwo.value = parseInt(sliderOne.value) + minGap;
            }
            handleSliderChangeEvent(e);
        }

        function scrollFretIntoView(e, sliderOne, sliderTwo, totalFrets) {
            // Adjust the scrollIntoView call based on the slider that triggered the event
            if (e && e.target.id === 'slider-1') {
                const oneFretBeforeValue = parseInt(sliderOne.value) > 0
                    ? parseInt(sliderOne.value) - 1 : parseInt(sliderOne.value);
                const oneFretBefore = document.querySelector(
                    `.fretboard-for-shapes:not(.inactive-fretboard) [data-fret-number="${oneFretBeforeValue}"]`);
                oneFretBefore.scrollIntoView({behavior: 'smooth', block: 'center'});
            } else if (e && e.target.id === 'slider-2') {
                const oneFretAfterValue = parseInt(sliderTwo.value) < totalFrets
                    ? parseInt(sliderTwo.value) + 1 : parseInt(sliderTwo.value);
                const oneFretAfter = document.querySelector(
                    `.fretboard-for-shapes:not(.inactive-fretboard) [data-fret-number="${oneFretAfterValue}"]`);
                oneFretAfter.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        }

        function handleSliderChangeEvent(e = null) {
            let percent1 = (sliderOne.value / sliderMaxValue) * 100;
            let percent2 = (sliderTwo.value / sliderMaxValue) * 100;
            sliderTrack.style.background =
                `linear-gradient(to left, var(--slider-track-color) ${percent1}%, 
                var(--slider-color) ${percent1}% , var(--slider-color) ${percent2}%, var(--slider-track-color) ${percent2}%)`;

            // Save the fret range in the local storage
            const fretboardNr = document.querySelector(`.fretboard-for-shapes:not(.inactive-fretboard)`).dataset.fretboardNr;
            localStorage.setItem(`fret-range-${fretboardNr}`, JSON.stringify({ lowerLimit: sliderOne.value, upperLimit: sliderTwo.value }));

            // Loop over the frets
            let totalFrets = document.querySelector('#fret-selection-fretboard-1').dataset.totalFrets;

            // Loop over frets
            for (let i = 0; i <= totalFrets; i++) {
                let fretPositions = document.querySelectorAll(`[data-fret-number="${i}"]`);

                for (let fretPosition of fretPositions) {
                    if (i >= sliderOne.value && i <= sliderTwo.value) {
                        fretPosition.style.backgroundColor = 'rgba(194,93,20,0.4)';
                        scrollFretIntoView(e, sliderOne, sliderTwo, totalFrets);
                    } else {
                        fretPosition.style.backgroundColor = '';
                    }
                }
            }
        }

        handleSlideOneEvent();
        handleSlideTwoEvent();
    }
}