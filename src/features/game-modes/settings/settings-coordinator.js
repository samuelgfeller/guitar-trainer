export class SettingsCoordinator {

    constructor() {
        document.querySelector('#header-center-container').innerHTML = `<p>Guitar Trainer</p>`;
        document.querySelector('#game-start-instruction').insertAdjacentHTML('afterbegin',
            `
<details open>
            <summary><h3>Instructions</h3></summary>
            <div id="game-instruction-text">
                <p>Click on the settings icon in the header to select a game mode.</p>
                <p><b>Available game modes: </b></p>
                <ol style="list-style-position: inside;">
                    <li>Plain metronome with exercises
                    <li>Play given note on fretboard
                    <li>Play note number in the given key
                </ol>
                <p>You have to allow microphone access when it is asked so that the game can work.
                    It will detect what note you're playing.</p>
            </div>
        </details>
<div id="theme-settings"><h3>Theme settings</h3>
<div class="theme-settings-grid">

<div class="theme-setting-option" data-theme="dark" data-color="saddlebrown">
    <div class="color-preview" style="background: linear-gradient(-45deg, saddlebrown 50%, #0e0e0e 50%)"></div>
    <span>Saddlebrown</span>
</div>
<div class="theme-setting-option" data-theme="dark" data-color="darkslateblue">
    <div class="color-preview" style="background: linear-gradient(-45deg, #005d72 50%, #0e0e0e 50%)"></div>
    <span>#005d72</span>
</div>
<div class="theme-setting-option" data-theme="dark" data-color="#005d72">
    <div class="color-preview" style="background: linear-gradient(-45deg, darkslateblue 50%, #0e0e0e 50%)"></div>
    <span>Darkslateblue</span>
</div>
<div class="theme-setting-option" data-theme="dark" data-color="saddlebrown">
    <div class="color-preview" style="background: linear-gradient(-45deg, saddlebrown 50%, #0e0e0e 50%)"></div>
    <span>Saddlebrown</span>
</div>
<div class="theme-setting-option" data-theme="dark" data-color="darkslateblue">
    <div class="color-preview" style="background: linear-gradient(-45deg, #005d72 50%, #0e0e0e 50%)"></div>
    <span>#005d72</span>
</div>
<div class="theme-setting-option" data-theme="dark" data-color="#005d72">
    <div class="color-preview" style="background: linear-gradient(-45deg, darkslateblue 50%, #0e0e0e 50%)"></div>
    <span>Darkslateblue</span>
</div>

<div class="theme-setting-option" data-theme="dark" data-color="#005d72">
    <div class="color-preview" style="background: linear-gradient(-45deg, darkslateblue 50%, floralwhite 50%)"></div>
    <span>Darkslateblue</span>
</div>



</div>


</div>`);
    }

    play() {

    }

    stop() {

    }

    destroy() {
        document.querySelector('#theme-settings').remove();
    }
}