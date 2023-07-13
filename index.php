<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="icon" type="image/x-icon" href="img/guitar.ico">
    <title>Guitar trainer</title>
</head>
<body>
<header>
    <!--<label for="bpm-input">Metronome BPM</label>-->
    <span id="mute-metronome">🔊</span>
    <input type="number" value="60" id="bpm-input">
    <button id="submit-btn">Start</button>
</header>
<main>
    <div>
        <span class="visible-when-game-on">String</span>
        <span class="note-value-span visible-when-game-on" id="string-span"></span>
    </div>
    <div>
        <span class="visible-when-game-on">Note</span>
        <span class="note-value-span visible-when-game-on" id="note-span"></span>
    </div>
</main>
<script type="module" src="metronome.js?v=<?= mt_rand(1, 1000) ?>"></script>
</body>
</html>
<?php