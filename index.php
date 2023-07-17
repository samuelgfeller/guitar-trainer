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
<header>
    <!--<label for="bpm-input">Metronome BPM</label>-->
    <span id="mute-metronome">🔊</span>
    <input type="number" value="20" id="bpm-input">
    <button id="start-stop-btn">Start</button>
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

    <p id="noteOutput"></p>

</main>
<script type="module" src="js/main.js?v=<?= mt_rand(1, 1000) ?>"></script>
</body>
</html>
<?php
$incorrectNotes = [];

$previousIncorrectNote = 'A';
$previousIncorrectString = 'A';

if (isset($incorrectNotes[$previousIncorrectNote][$previousIncorrectString])){
    $incorrectNotes[$previousIncorrectNote][$previousIncorrectString]++;
}else{
    $incorrectNotes[$previousIncorrectNote][$previousIncorrectString] = 1;
}

// var_dump($incorrectNotes);