<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="icon" type="image/x-icon" href="img/guitar.ico">
    <script src="https://cdn.jsdelivr.net/npm/aubiojs@0.1.1/build/aubio.min.js"></script>
    <!--<script src="lib/aubio.js"></script>-->
    <title>Guitar trainer</title>
</head>
<body>
    <input type="checkbox" class="start-stop-btn" id="challenging-notes-preset">
<label for="challenging-notes-preset">Preset challenging notes</label>
<header>
    <!--<label for="bpm-input">Metronome BPM</label>-->
    <span id="mute-metronome">🔇</span>
    <input type="number" value="100" id="bpm-input">
    <button class="btn" id="start-stop-btn">Start</button>
</header>
<main>
    <canvas class="visible-when-game-on" id="frequency-bars"></canvas>
    <div id="game-start-instruction">Click start or double click anywhere to begin the game</div>
    <div class="visible-when-game-on">
        <span >String</span>
        <span class="note-value-span" id="string-span"></span>
    </div>
    <div class="visible-when-game-on">
        <span>Note</span>
        <span class="note-value-span" id="note-span"></span>
    </div>
    <div class="visible-when-game-on" id="detected-note-div">
        <!--<span id="left-cents-bar"></span>-->
        <p id="detected-note"></p>
        <!--<span id="right-cents-bar"></span>-->
    </div>
</main>
<script type="module" src="js/main.js?v=<?= mt_rand(1, 1000) ?>"></script>
</body>
</html>