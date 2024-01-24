import React, { useState, useEffect } from 'react';

const MIDIConnection = () => {
  const [midiAccess, setMidiAccess] = useState(null);

  useEffect(() => {
    // Check for Web MIDI support.
    if (navigator.requestMIDIAccess) {
      // Request MIDI access
      navigator.requestMIDIAccess().then(
        (access) => {
          // Successfully retrieved MIDI access object
          setMidiAccess(access);

          // Handle MIDI connections and disconnections
          access.onstatechange = (event) => {
            console.log(event.port.name, event.port.manufacturer, event.port.state);
          };

          // Access inputs and connect them to your application
          const inputs = access.inputs.values();
          for (let input of inputs) {
            input.onmidimessage = getMIDIMessage;
          }
        },
        () => {
          console.log('Could not access MIDI devices.');
        }
      );
    }
  }, []);

  // Function to handle incoming MIDI messages
  const getMIDIMessage = (message) => {
    const command = message.data[0];
    const note = message.data[1];
    const velocity = (message.data.length > 2) ? message.data[2] : 0;

    console.log(`MIDI message received. Command: ${command}, Note: ${note}, Velocity: ${velocity}`);
    // Do something with the MIDI input, like updating the state
  };

  return (
    <div>
      {/* Your UI components here */}
    </div>
  );
};

export default MIDIConnection;
