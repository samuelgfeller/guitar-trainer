const notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const strings = ['D', 'E', 'G', 'A', 'B'];

export const NoteGame = function () {
}

export function getRandomNote() {
    const randomIndex = Math.floor(Math.random() * notes.length);
    return notes[randomIndex];
}
export function getRandomString() {
    const randomIndex = Math.floor(Math.random() * strings.length);
    return strings[randomIndex];
}

export function displayRandomNote() {
    const note = getRandomNote();
    const noteSpan = document.getElementById('note-span');
    noteSpan.innerHTML = note;
    document.getElementById('string-span').innerHTML = getRandomString();
    return note;
}