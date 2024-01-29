class NoteMatcher {
    constructor(cursor, sheet) {
        this.cursor = cursor;
        this.cursor.show();
        
        this.sheet = sheet;
        this.notesPressed = new Set();

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
            input.onmidimessage = this.onMIDIEvent.bind(this);
        }
    }

    onMIDIFailure() {
        console.error("Failed to get MIDI access.");
        // Handle the error according to your application's needs
    }

    onMIDIEvent(midiMessage) {
       
        const command = midiMessage.data[0];
        const note = midiMessage.data[1] - 12;

        if (command === 144) { // 144 is MIDI 'note_on' message
            this.notesPressed.add(note);
        } else if (command === 128) { // 128 is MIDI 'note_off' message
            if (this.notesPressed.has(note)) {
                this.notesPressed.delete(note);
                // throw new Error(`Note off event received for a note not in notesPressed: ${note}`);
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
            this.cursor.next();
        }
        // this.notesPressed.clear();
    }
    

    isEnd() {
        return this.cursor.Iterator.EndReached;
    }

    isStart() {
        return this.cursor.Iterator.FrontReached;
    }

    reset() {
        this.cursor.reset();
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