export class DualRangeSlider {
    static defaultMinValue = 2;
    static defaultMaxValue = 6;

    /**
     * @param {function} saveFretRangeInLocalStorageFunction
     * @param {string} savedFretRange
     */
    static addSelectionSlider(saveFretRangeInLocalStorageFunction, savedFretRange, minSliderGap = 1) {
        document.querySelector('#selector-instructions').insertAdjacentHTML('beforeend', `
                <div id="dual-range-slider-wrapper">
                <div class="dual-range-slider-container normal-font-size">
                    <div class="slider-track normal-font-size"></div>
                    <input type="range" class="normal-font-size" min="0" max="11" value="${this.defaultMinValue}" id="slider-1">
                    <input type="range" class="normal-font-size" min="0" max="11" value="${this.defaultMaxValue}" id="slider-2">
                </div>
                </div>
            `);
        // Set the slider values from the local storage right after the sliders are added
        this.setSliderValuesFromLocalStorage(savedFretRange);
        // Add selection slider event listeners
        this.addSelectionSliderEventListeners(saveFretRangeInLocalStorageFunction, minSliderGap);
    }

    static setSliderValuesFromLocalStorage(savedFretRange) {
        if (savedFretRange) {
            const {lowerLimit, upperLimit} = JSON.parse(savedFretRange);
            document.getElementById('slider-1').value = lowerLimit;
            document.getElementById('slider-2').value = upperLimit;
            // Trigger the event listeners to update the fretboard
            document.getElementById('slider-1').dispatchEvent(new Event('input'));
            document.getElementById('slider-2').dispatchEvent(new Event('input'));
        }
    }

    /**
     * @param {function} saveFretRangeInLocalStorageFunction
     */
    static addSelectionSliderEventListeners(saveFretRangeInLocalStorageFunction, minSliderGap = 1) {
        let sliderOne = document.getElementById("slider-1");
        let sliderTwo = document.getElementById("slider-2");
        let minGap = minSliderGap;
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
                    `.fretboard-for-patterns:not(.inactive-fretboard) [data-fret-position="${oneFretBeforeValue}"],
            #fretboard-range-selection-virtual-fretboard [data-fret-position="${oneFretBeforeValue}"]`);
                oneFretBefore.scrollIntoView({behavior: 'smooth', block: 'center'});
            } else if (e && e.target.id === 'slider-2') {
                const oneFretAfterValue = parseInt(sliderTwo.value) < totalFrets
                    ? parseInt(sliderTwo.value) + 1 : parseInt(sliderTwo.value);
                const oneFretAfter = document.querySelector(
                    `.fretboard-for-patterns:not(.inactive-fretboard) [data-fret-position="${oneFretAfterValue}"],
                                #fretboard-range-selection-virtual-fretboard [data-fret-position="${oneFretAfterValue}`);
                oneFretAfter.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        }

        function handleSliderChangeEvent(e = null) {
            console.log('slider change event');
            let percent1 = (sliderOne.value / sliderMaxValue) * 100;
            let percent2 = (sliderTwo.value / sliderMaxValue) * 100;
            sliderTrack.style.background =
                `linear-gradient(to left, var(--slider-track-color) ${percent1}%, 
                var(--slider-color) ${percent1}% , var(--slider-color) ${percent2}%, var(--slider-track-color) ${percent2}%)`;

            // Save the fret range in the local storage
            saveFretRangeInLocalStorageFunction(sliderOne.value, sliderTwo.value);

            // Loop over the frets
            let totalFrets = document.querySelector('[data-total-frets]').dataset.totalFrets;

            // Loop over frets
            for (let i = 0; i <= totalFrets; i++) {
                let fretPositions = document.querySelectorAll(`[data-fret-position="${i}"]`);

                for (let fretPosition of fretPositions) {
                    if (i >= sliderOne.value && i <= sliderTwo.value) {
                        fretPosition.style.backgroundColor = 'rgba(var(--r), var(--g), var(--b), 0.7)';
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