import React, { useState, useEffect } from 'react';

const MIDIConnection = () => {
  const [midiAccess, setMidiAccess] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [midiMessages, setMidiMessages] = useState([]); // State to store MIDI messages

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(
        (access) => {
          setMidiAccess(access);
          setIsConnected(true);

          access.onstatechange = (event) => {
            console.log(event.port.name, event.port.manufacturer, event.port.state);
          };

          const inputs = access.inputs.values();
          for (let input of inputs) {
            input.onmidimessage = getMIDIMessage;
          }
        },
        () => {
          console.log('Could not access MIDI devices.');
          setIsConnected(false);
        }
      );
    }
  }, []);

  const getMIDIMessage = (message) => {
    const command = message.data[0];
    const note = message.data[1];
    const velocity = (message.data.length > 2) ? message.data[2] : 0;

    // Update the midiMessages state with the new message
    setMidiMessages(prevMessages => [...prevMessages, `Command: ${command}, Note: ${note}, Velocity: ${velocity}`]);
  };

  return (
    <div>
      <h1>Testing MIDI connection</h1>
      {isConnected ? <p>MIDI connection successful!</p> : <p>Connecting to MIDI devices...</p>}

      <div>
        <h2>MIDI Messages:</h2>
        <ul>
          {midiMessages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MIDIConnection;
