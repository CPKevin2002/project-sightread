const MIDI_STEPS_IN_OCTAVE = 12;
const MIDI_NOTE_OFF_MSG = 128;
const MIDI_NOTE_ON_MSG = 144;

class NoteMatcher {
    constructor(cursor, sheet, onCursorMove) {
        this.cursor = cursor;
        this.cursor.show();
        this.sheet = sheet;
        this.notesPressed = new Set();
        this.onCursorMove = onCursorMove;

        // Stats
        this.numWrongNotes = 0;
        this.numTotalNotes = 0; 

        // Request MIDI access and setup
        this.initializeMIDI();
        this.onMIDIEvent = this.onMIDIEvent.bind(this);
    }

    initializeMIDI() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
                .then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
        } else {
            console.error("WebMIDI is not supported in this browser.");
        }
    }

    onMIDISuccess(midiAccess) {
        // Connect to MIDI input devices
        const inputs = midiAccess.inputs.values();
        for (let input of inputs) {
            console.log("MIDI connection success");
            input.onmidimessage = this.onMIDIEvent.bind(this);
        }  
    }

    onMIDIFailure() {
        console.error("Failed to get MIDI access.");
    }

    onMIDIEvent(midiMessage) {
        console.log("MIDI event");
        const command = midiMessage.data[0];
        const note = midiMessage.data[1] - MIDI_STEPS_IN_OCTAVE;

        if (command === MIDI_NOTE_ON_MSG) {
            this.notesPressed.add(note);
        } else if (command === MIDI_NOTE_OFF_MSG) {
            if (this.notesPressed.has(note)) {
                this.notesPressed.delete(note);
            } else {
                console.log("Oops");
            }
           
        } else {
            console.log(`Received unknown MIDI message: ${command}`);
        }

        this.checkForNotes();
    }

    checkForNotes() {
        const targetNotes = this.cursor.NotesUnderCursor();
        console.log("printing half tones required", targetNotes.map(note => note.halfTone));
        console.log("current pressed keys", this.notesPressed);    
        const allNotesPressed = targetNotes.every(note => {
            return note.isRest() || note.IsGraceNote || this.notesPressed.has(note.halfTone);
        });
        if (allNotesPressed) {
            this.advanceMatcher();
        }
    }
    

    isEnd() {
        return this.cursor.Iterator.EndReached;
    }

    isStart() {
        return this.cursor.Iterator.FrontReached;
    }

    reset() {
        this.cursor.reset();
        if (this.onCursorMove) {
            this.onCursorMove();
        }
    }

    advanceMatcher() {
        this.cursor.next();
        if (this.onCursorMove) {
            console.log("Callback invoked");
            this.onCursorMove(); // Call the callback when the cursor moves
        }
    }

    showCursor() {
        this.cursor.show();
    }

    /* Functions for debugging */

    loopOverEntireSheet() {
        this.reset();
        let i = 0;
        let threshold = 2;
        while (i < threshold) {
            let targetNotes = this.cursor.NotesUnderCursor();
            console.log("printing half tones required");
            for (let note of targetNotes) {
                if (note.isRest()) {
                    console.log("skipped rest ", note.halfTone);
                    continue;
                } 
                
                if (note.IsGraceNote) {
                    console.log("skipped grace note", note.halfTone);
                    continue;
                }
                
                console.log("note halftone: ", note.halfTone);
            }
            i++;
            this.cursor.next();
        }
    }
}

export default NoteMatcher;