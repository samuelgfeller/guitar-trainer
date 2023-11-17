<?php

require __DIR__ . '/JsImportVersionAdder.php';
(new JsImportVersionAdder())->addVersionToJsImports('0.6');
?>
<!doctype html>
<html lang="en">
<head>
    <!--<base href="/guitar-trainer/src/">-->
    <!--<base href="/">-->
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="src/assets/styles/modal.css?v=6">
    <link rel="stylesheet" href="src/assets/styles/style.css?v=6">
    <link rel="stylesheet" href="src/assets/styles/progress-bar.css?v=5">
    <link rel="stylesheet" href="src/assets/styles/range-slider.css">
    <link rel="icon" type="image/x-icon" href="guitar.ico">
    <script src="https://cdn.jsdelivr.net/npm/aubiojs@0.1.1/build/aubio.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vexflow@4.2.2/build/cjs/vexflow.js"></script>
    <!--<script src="lib/aubio.js"></script>-->
    <title>Guitar trainer</title>
</head>
<body>

<div id="config-div">
    <!-- Additional div necessary to have options and game modes on separate lines with smooth animation -->
    <div id="config-inner-div">
        <span class="normal-font-size label-text">Game modes</span>
        <div id="game-mode-selection">
            <label class='checkbox-button' id="metronome-game-mode">
                <input type='checkbox'>
                <img src="src/assets/images/metronome-icon.svg" class="button-icon">
            </label>
            <label class='checkbox-button' id="fretboard-note-game-mode">
                <input type='checkbox'>
                <img src="src/assets/images/guitar-fretboard-icon.svg" class="button-icon">
            </label>
            <label class='checkbox-button' id="note-in-key-game-mode">
                <input type='checkbox'>
                <img src="src/assets/images/key-icon.png" class="button-icon">
            </label>
        </div>
        <!-- Game mode options in HTML as they may be used by multiple modes -->
        <span class="normal-font-size label-text" id="options-title-span">Options</span>
        <div id="options-for-game-modes">
            <!-- Fretboard note game options -->
            <label class='checkbox-button option-for-game-mode' id="display-in-treble-clef">
                <input type='checkbox'>
                <!--<span class="normal-font-size"></span>-->
                <img src="src/assets/images/treble-clef-icon.svg" class="button-icon">
            </label>
            <label class='checkbox-button option-for-game-mode' id="display-note-name-and-treble-clef">
                <input type='checkbox'>
                <div style="display: flex; align-items: center">
                    <img src="src/assets/images/treble-clef-icon.svg" class="button-icon">
                    <span class="normal-font-size">+ name</span>
                </div>
            </label>
            <label class='checkbox-button option-for-game-mode' id="challenging-notes-preset">
                <input type="checkbox" class="start-stop-btn" alt="Preset challenging notes">
                <img src="src/assets/images/challenging-icon.svg" class="button-icon">
            </label>

            <!-- Practice note in key game mode options -->
            <!--<label class='checkbox-button option-for-game-mode' id="note-in-key-test-mode">-->
            <!--    <input type='checkbox'>-->
            <!--    <span class="normal-font-size">Test mode</span>-->
            <!--    <img src="src/assets/images/icon.svg" class="button-icon">-->
            <!--</label>-->

            <div id="difficulty-range-slider-container" class="option-for-game-mode">
                <input type='range' min='1' max='3' value='1' step='1'
                       list="level-options" id="difficulty-range-slider"/>
                <datalist id="level-options">
                    <option value="1" label="Lvl 1"></option>
                    <option value="2" label="Lvl 2"></option>
                    <option value="3" label="Lvl 3"></option>
                </datalist>

            </div>
        </div>
    </div>
</div>
<header>
    <div>
        <!--<label for="bpm-input">Metronome BPM</label>-->
        <img src="src/assets/images/settings-icon.svg" id="settings-toggle-btn" class="icon">
        <div class="center-flexbox">
            <!--<img src="src/assets/images/next-level.svg" alt="<" id="previous-lvl-btn" class="icon lvl-icon">-->
            <img src="src/assets/images/arrow-left-icon.svg" alt="<" id="previous-lvl-btn" class="icon lvl-icon">
            <input type="number" min="0" value="17" id="bpm-input">
            <img src="src/assets/images/arrow-right-icon.svg" alt="<" id="next-lvl-btn" class="icon lvl-icon">
            <!--<img src="src/assets/images/next-level.svg" alt=">" id="next-lvl-btn" class="icon lvl-icon">-->
        </div>
        <button class="start-stop-btn" id="start-stop-btn">Play</button>
    </div>
</header>
<main>
    <!--<div id="progress-bar-title-div">-->
    <!--    <span>Challenging notes count</span>-->
    <!--</div>-->
    <div id="game-progress-div" style="display: none">
        <span id="progress-bar-left-side-label">0</span>
        <div class="meter">
            <span style="width: 0"></span>
        </div>
        <span id="progress-bar-right-side-label">0</span>
    </div>
    <div id="score" style="display:none;">
        <span id="incorrect-count"></span><span id="correct-count"></span>
    </div>
    <div id="game-start-instruction">
        <details open>
            <summary><h3>Game instructions</h3></summary>
            <p>Click "Play" to start or resume the game, or simply double-click anywhere on the screen.</p>
            <p>When you fail to play a note correctly, it gets added to the challenging notes list.</p>
            <p>The challenging notes have a higher chance of reappearing in the game to help you focus on learning
                them.</p>
            <p>The progress bar represents the number of challenging notes that still need to be "learned"
                correctly.</p>
            <p>Each time you play a challenging note correctly when it appears 3 times in a row, the progress bar
                advances.</p>
            <p>After mastering all challenging notes, 10 additional notes have to be played correctly to fill the
                progress bar to 100% and complete the level.</p>
        </details>
    </div>
    <div class="visible-when-game-on" id="info-above-string-and-key"></div>
    <div class="visible-when-game-on">
        <span class="label">String</span>
        <span class="note-value-span" id="string-span"></span>
    </div>
    <div class="visible-when-game-on">
        <span class="label">Note</span>
        <span class="note-value-span" id="note-span"></span>
        <div id="treble-clef-output"></div>
    </div>
    <div class="visible-when-game-on" id="detected-note-div">
        <!--<span id="left-cents-bar"></span>-->
        <p id="detected-note"></p>
        <!--<span id="right-cents-bar"></span>-->
    </div>
    <canvas class="visible-when-game-on" id="frequency-bars"></canvas>
</main>
<script type="module" src="src/features/game-core/game-loader.js?v=<?= mt_rand(1, 1000) ?>"></script>
<!--<script type="module" src="js/test/tests-main.js?v=--><?php
//= mt_rand(1, 1000) ?><!--"></script>-->
</body>
</html>