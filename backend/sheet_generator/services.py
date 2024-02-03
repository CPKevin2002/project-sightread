# sheet_generator/services.py
from music21 import stream, note
import random

def generate_random_music():
    # Create a music stream
    s = stream.Stream()

    # Generate 5 random notes
    for _ in range(5):
        # Generate a random note
        n = note.Note()
        # Randomize the note pitch
        n.pitch.midi = random.randint(60, 72)  # C4 to C5
        # Add the note to the stream
        s.append(n)

    # Convert the stream to a MusicXML string
    music_xml = s.write('musicxml')

    # Read the content of the file as a string
    with open(music_xml, 'r') as file:
        music_xml_content = file.read()

    return music_xml_content
