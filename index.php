<?php
$version = '1.2.3';
// Uncomment the following 2 lines and load any page of the app once before committing changes
// require __DIR__ . '/JsImportVersionAdder.php';
// (new JsImportVersionAdder())->addVersionToJsImports($version);

// Easier for development when testing on mobile often
// (new JsImportVersionAdder())->addVersionToJsImports(mt_rand(1, 1000));
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="src/assets/styles/modal.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/style.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/note-in-key.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/fretboard-note-game.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/progress-bar.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/range-slider.css?v=<?= $version ?>">
    <link rel="stylesheet" href="src/assets/styles/metronome-practice.css?v=<?= $version ?>">
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
        <span class="normal-font-size label-text options-title-span">Options</span>
        <div id="game-mode-options">
            <!--  Options added at instantiation of game mode coordinator -->
        </div>
    </div>
</div>
<header>
    <div>
        <!--<label for="bpm-input">Metronome BPM</label>-->
        <img src="src/assets/images/settings-icon.svg" id="settings-toggle-btn" class="icon">
        <div class="center-flexbox" id="header-center-container">
            <!--  Content added at instantiation of game mode coordinator -->
            <p>Guitar Trainer</p>
        </div>
        <img class="icon" id="start-stop-btn" src="src/assets/images/play-icon.svg">
    </div>
</header>
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

    <div id="game-start-instruction">
        <details open>
            <summary><h3>Instructions</h3></summary>
            <div id="game-instruction-text">
                <p>Click on the settings icon in the header to select a game mode.</p>
                <p>For certain game modes, there are different options such as displaying notes on a
                    treble clef staff or to change the difficulty.</p>
                <p><b>Available game modes: </b></p>
                <ol style="list-style-position: inside;">
                    <li>Plain metronome</li>
                    <li>Play given note on fretboard
                    <li>Play note number in the given key
                </ol>
                <p>You have to allow microphone access when it is asked so that the game can work.
                    It will detect what note you're playing.</p>

            </div>
        </details>
    </div>
    <div id="key-and-string-container" style="display: none">
        <div>
            <span class="label">String</span>
            <span class="note-value-span" id="string-span"></span>
        </div>
        <div>
            <span class="label">Note</span>
            <span class="note-value-span" id="note-span"></span>
            <div id="treble-clef-output"></div>
        </div>
    </div>
    <div class="visible-when-game-on" id="detected-note-div">
        <p id="detected-note"></p>
    </div>
    <canvas class="visible-when-game-on" id="frequency-bars"></canvas>
</main>
<script type="module" src="src/features/game-core/game-loader.js?v=<?= $version ?>"></script>
<!--<script type="module" src="js/test/tests-main.js?v=--><?php
//= $version ?><!--"></script>-->
</body>
</html>