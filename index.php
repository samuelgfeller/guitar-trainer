<?php

$version = '2.3.1';

// If config/env.php exists, contains the 'env' key, and it's set to 'dev' add version to js imports
if (file_exists(__DIR__ . '/config/env.php')) {
    $config = require __DIR__ . '/config/env.php';
    if (array_key_exists('env', $config) && $config['env'] === 'dev') {
        // $version = time();
        require __DIR__ . '/JsImportVersionAdder.php';
        (new JsImportVersionAdder())->addVersionToJsImports($version);
    }
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width,
          user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="src/assets/styles/modal.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/style.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/note-in-key.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/fretboard-note-game.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/progress-bar.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/range-slider.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/metronome-practice.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/virtual-fretboard.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/fret-selection.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/dual-range-slider.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/theme-selection.css?v=<?= $version ?>">
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
            <button class='stay-active-button' id="settings-mode">
                <img src="src/assets/images/settings-icon.svg" class="button-icon">
            </button>
            <button class='stay-active-button' id="metronome-game-mode">
                <img src="src/assets/images/metronome-icon.svg" class="button-icon">
            </button>
            <button class='stay-active-button' id="fretboard-note-game-mode">
                <img src="src/assets/images/guitar-fretboard-icon.svg" class="button-icon">
            </button>
            <button class='stay-active-button' id="note-in-key-game-mode">
                <img src="src/assets/images/key-icon.png" class="button-icon">
            </button>
        </div>
        <span class="normal-font-size label-text options-title-span">Options</span>
        <div id="game-mode-options">
            <!--  Options added at instantiation of game mode coordinator -->
        </div>
    </div>
</div>
<header>
    <div>
        <!--<label for="bpm-input">Metronome BPM</label>-->
        <img src="src/assets/images/settings/bars-left-icon.svg" id="settings-toggle-btn" class="icon">
        <div class="center-flexbox" id="header-center-container">
            <!--  Content added at instantiation of game mode coordinator -->
            <p>Guitar Trainer</p>
        </div>
        <img class="icon" id="start-stop-btn" src="src/assets/images/play-icon.svg">
    </div>
</header>
<!--<button id="simulate-correct-note" style="font-size: 16px; background: #3c4143;margin: 20px auto 0; display: block; border:none">Play correct note</button>-->
<main id="game-container">
    <!--<div id="progress-bar-title-div">-->
    <!--    <span>Challenging notes count</span>-->
    <!--</div>-->
    <div id="game-progress-div" style="display: none">
        <div id="progress-bar-container">
            <span id="progress-bar-left-side-label">0</span>
            <div class="meter">
                <span style="width: 0"></span>
            </div>
            <span id="progress-bar-right-side-label">0</span>
        </div>
        <div id="score" style="display:none;">
            <span id="incorrect-count"></span><span id="correct-count"></span>
        </div>
    </div>

    <div id="game-start-instruction"></div>
</main>
<script type="module" src="src/features/game-core/game-loader.js?v=<?= $version ?>"></script>
<!--<script type="module" src="js/test/tests-main.js?v=--><?php
//= $version ?><!--"></script>-->
</body>
</html>