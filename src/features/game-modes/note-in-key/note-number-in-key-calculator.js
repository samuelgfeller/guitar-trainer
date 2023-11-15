class NoteNumberInKeyCalculator{
    constructor(){
    }

    calculate(key, noteName){
        return (noteName - key + 12) % 12;
    }
}