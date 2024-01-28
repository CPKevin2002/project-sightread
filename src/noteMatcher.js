class NoteMatcher {
    constructor(cursor, sheet) {
        this.cursor = cursor;
        this.cursor.show();
        
        this.sheet = sheet;
        // console.log("Number of instruments is", sheet.Instruments().length);
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
        const note = midiMessage.data[1];

        if (command === 144) { // 144 is MIDI 'note_on' message
            this.notesPressed.add(note);
        } else if (command === 128) { // 128 is MIDI 'note_off' message
            if (!this.notesPressed.has(note)) {
                throw new Error(`Note off event received for a note not in notesPressed: ${note}`);
            }
            this.notesPressed.delete(note);
        } else {
            console.log(`Received unknown MIDI message: ${command}`);
            // Handle unknown MIDI messages as needed
        }

        this.checkForNotes();
    }

    checkForNotes() {
        let targetNotes = this.cursor.NotesUnderCursor();
        console.log("printing half tones required");
        for (let note of targetNotes) {
            console.log(note.halfTone);
        }
    }

    isEnd() {
        return this.cursor.Iterator.EndReached;
    }

    isStart() {
        return this.cursor.Iterator.FrontReached;
    }
}

export default NoteMatcher;