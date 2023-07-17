const notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const strings = ['D', 'E', 'G', 'A', 'B'];

class NoteGame {
  constructor() {
    this.noteName = null;
  }

  start() {
    // Event fired on each metronome beat
    document.addEventListener('metronome-beat', this.displayRandomNotes.bind(this));
    // Custom event when played note was detected
    document.addEventListener('note-detected', this.highlightNoteIfCorrect.bind(this));
  }

  stop() {
    document.removeEventListener('metronome-beat', this.displayRandomNotes.bind(this));
    document.removeEventListener('note-detected', this.highlightNoteIfCorrect.bind(this));
  }

  displayRandomNotes() {
    console.log('caught');
    // Reset color of note span
    document.querySelector('#note-span').style.color = null;

    // Display random note and string
    this.noteName = this.displayRandomNote();
  }

  highlightNoteIfCorrect(event) {
    if (this.noteName === event.detail.name) {
      document.querySelector('#note-span').style.color = 'green';
    }
  }

  getRandomNote() {
    const randomIndex = Math.floor(Math.random() * notes.length);
    return notes[randomIndex];
  }

  getRandomString() {
    const randomIndex = Math.floor(Math.random() * strings.length);
    return strings[randomIndex];
  }

    /**
     * Displays random string and note returning the note
     * @return {string}
     */
  displayRandomNote() {
    const note = this.getRandomNote();
    const noteSpan = document.getElementById('note-span');
    noteSpan.innerHTML = note;
    document.getElementById('string-span').innerHTML = this.getRandomString();
    return note;
  }
}

export { NoteGame };
