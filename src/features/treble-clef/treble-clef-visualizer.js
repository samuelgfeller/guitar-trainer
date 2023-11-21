export class TrebleClefVisualizer {

    static displayCombinationInTrebleClef(stringName, noteName, alsoDisplayNoteName = false) {

        // document.getElementById('note-span').innerHTML = noteName;
        // Empty output
        const output = document.getElementById('treble-clef-output');
        output.innerHTML = '';
        const originalNoteName = noteName;
        // Remove non-ascii chars as vexflow doesn't work with the ♯ and ♭ chars
        noteName = noteName.replace("♯", '#');
        noteName = noteName.replace("♭", 'b');
        // After replacing non-ascii chars, get octave
        let octave = this.getTrebleClefStaffOctaveWithStringAndNoteName(stringName, noteName);


        const {Factory, renderer} = Vex.Flow;
        // noteName = 'D#';
        // octave = 6;
        // noteName = 'E';
        // octave = 3;

        // Create a VexFlow renderer attached to the DIV element with id="output"
        const vf = new Factory({renderer: {elementId: 'treble-clef-output'}});
        const score = vf.EasyScore();
        const system = vf.System();
        // noteName = 'C';
        // noteName = 'B@';
        // Create a 4/4 treble stave and add a voice
        const stave = system.addStave({
            voices: [
                // Top voice has 4 quarter notes with stems up.
                // score.voice(score.notes(`B4/4/r,${noteName}${octave}/h, B4/4/r`)),
                score.voice(score.notes(`${noteName}${octave}/w`)),
                // score.voice(score.notes(`${noteName}4/q, B4`, {stem: 'up'})),
            ]
        }).addClef('treble');

        // stave.context.setStrokeStyle('blue');
        stave.context.setFillStyle('darkgrey');
        stave.context.setViewBox(0, 5, 100, 130); //size
        // stave.context.scale(2,2);
        // I tried the following but none of the options work
        // stave.context.setLedgerLineStyle('white');
        // stave.setLedgerLineStyle('white');

        // Set the note color to white
        const voice = system.getVoices()[0]; // Get the first voice
        const notes = voice.getTickables();
        notes.forEach(note => {
            note.setStyle({
                strokeStyle: '#bcbcbc',
                fillStyle: '#bcbcbc',
            });
        });

        // Draw it!
        vf.draw();

        if (alsoDisplayNoteName) {
            output.innerHTML = output.innerHTML + originalNoteName;
        }
    }

    /**
     * This function returns the corresponding octave on the treble clef staff
     * from the given guitar string and note name.
     * The highest note on the staff is the D# on the high E string
     * which is octave 6. Lowest is the E on the low E string (octave 3).
     * @param stringName {string} - The name of the guitar string (e.g., 'E', 'A', 'D', etc.).
     * @param noteName {string} - The name of the note (e.g., 'C', 'F#', 'G', etc.).
     * @return octave {number} - The octave of the note on the treble clef staff.
     */
    static getTrebleClefStaffOctaveWithStringAndNoteName(stringName, noteName) {
        // Define the mapping of note names to semitones from C.
        const semitonesFromCMapping = {
            'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
            'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7,
            'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
        };

        const semitonesFromC = semitonesFromCMapping[noteName];
        switch (stringName) {
            // Low E
            case 'E':
                // If note greater or equal E, then the lowest octave 3 is returned
                if (semitonesFromC >= semitonesFromCMapping['E']) {
                    return 3;
                }
                // If notes between C and D# are one octave higher: 4
                return 4;

            case 'A':
                // If note is greater or equal A on A string, octave is 3
                if (semitonesFromC >= semitonesFromCMapping['A']) {
                    return 3;
                }
                // C and greater is octave 4
                return 4;
            case 'D':
                // If note is or D or higher the octave is 4
                if (semitonesFromC >= semitonesFromCMapping['D']) {
                    return 4;
                }
                // C and higher is octave 5
                return 5;
            case 'G':
                // G until B is octave 4 on the G-string
                if (semitonesFromC >= semitonesFromCMapping['G']) {
                    return 4;
                }
                // After C, octave is 5
                return 5;
            case 'B':
                // B is still octave 4 but after C its octave 5 on the B-string
                if (semitonesFromC >= semitonesFromCMapping['B']) {
                    return 4;
                }
                // After C, octave is 5
                return 5;
            // High E
            case 'E2':
                // If string is high E and note is E or higher, it's the 5th octave after C it's the 6th
                if (semitonesFromC >= semitonesFromCMapping['E']) {
                    return 5;
                }
                // After C on the high E string octave is 6
                return 6;
        }

    }
}