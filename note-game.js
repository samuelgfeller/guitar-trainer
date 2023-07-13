const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const strings = ['D', 'E', 'G', 'A', 'B'];

function getRandomNote() {
    const randomIndex = Math.floor(Math.random() * notes.length);
    return notes[randomIndex];
}
function getRandomString() {
    const randomIndex = Math.floor(Math.random() * strings.length);
    return strings[randomIndex];
}

export function displayRandomNote() {
    const noteSpan = document.getElementById('note-span');
    noteSpan.innerHTML = getRandomNote();
    document.getElementById('string-span').innerHTML = getRandomString();
}