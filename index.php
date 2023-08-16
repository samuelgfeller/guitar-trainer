<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="css/modal.css?v=1">
    <link rel="stylesheet" href="css/style.css?v=4">
    <link rel="stylesheet" href="css/progress-bar.css?v=1">
    <link rel="icon" type="image/x-icon" href="img/guitar.ico">
    <script src="https://cdn.jsdelivr.net/npm/aubiojs@0.1.1/build/aubio.min.js"></script>
    <!--<script src="lib/aubio.js"></script>-->
    <title>Guitar trainer</title>
</head>
<body>
<input type="checkbox" class="start-stop-btn" id="challenging-notes-preset" alt="Preset challenging notes">
<!--<label for="challenging-notes-preset">Preset challenging notes</label>-->
<header>
    <div>
        <!--<label for="bpm-input">Metronome BPM</label>-->
        <img src="img/mute-icon.svg" id="mute-metronome" class="icon">
        <div class="center-flexbox">
            <img src="img/next-level.svg" alt="<" id="previous-lvl-btn" class="icon lvl-icon">
            <input type="number" min="0" value="17" id="bpm-input">
            <img src="img/next-level.svg" alt=">" id="next-lvl-btn" class="icon lvl-icon">
        </div>
        <button class="btn" id="start-stop-btn">Start</button>
    </div>
</header>
<main>
    <!--<div id="progress-bar-title-div">-->
    <!--    <span>Challenging notes count</span>-->
    <!--</div>-->
    <div id="game-progress-div" style="display: none">
        <span id="max-errors">0</span>
        <div class="meter">
            <span style="width: 0"></span>
        </div>
        <span id="min-errors">0</span>
    </div>
    <div id="score" style="display:none;">
        <span id="incorrect-count"></span><span id="correct-count"></span>
    </div>
    <div id="game-start-instruction">
        <details open>
            <summary><h3>Game instructions</h3></summary>
            <p>Click "Start" to begin the game, or simply double-click anywhere on the screen.</p>
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
    <div class="visible-when-game-on">
        <span class="label">String</span>
        <span class="note-value-span" id="string-span"></span>
    </div>
    <div class="visible-when-game-on">
        <span class="label">Note</span>
        <span class="note-value-span" id="note-span"></span>
    </div>
    <div class="visible-when-game-on" id="detected-note-div">
        <!--<span id="left-cents-bar"></span>-->
        <p id="detected-note"></p>
        <!--<span id="right-cents-bar"></span>-->
    </div>
    <canvas class="visible-when-game-on" id="frequency-bars"></canvas>
</main>
<script type="module" src="js/game-starter.js?v=<?= mt_rand(1, 1000) ?>"></script>
<!--<script type="module" src="js/test/tests-main.js?v=--><?php
//= mt_rand(1, 1000) ?><!--"></script>-->
</body>
</html>