# sheet_generator/services.py
from music21 import stream, note, instrument, key, scale
import random

# Tonic music generation (i.e. for each key,):
# 1. Generate descending/ascending scales
# 2. Generate melodies with varying degrees of jumps/accidentals
# 3. Generate random music 

def generate_random_music():

    # Create a music stream
    s = stream.Stream()
    s.insert(0, instrument.fromString('Piano'))

    # Generate 5 random notes
    for _ in range(20):
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


def generate_scale_in_key(key_signature, start, end):
    # Create a music21 key object based on the key_signature string provided
    music_key = key.Key(key_signature)
    
    # Create a scale object based on the key - it could be major or minor
    if music_key.mode == 'major':
        scl = scale.MajorScale(music_key.tonic)
    else:
        scl = scale.MinorScale(music_key.tonic)
    
    # Create a stream to hold the notes
    s = stream.Stream()
    
    # Add the key signature to the stream
    s.append(music_key)
    
    # Generate the ascending scale from start to end
    ascending_notes = scl.getPitches(start, end)
    for p in ascending_notes:
        n = note.Note(p)
        s.append(n)
    
    # Output the stream to a MusicXML file
    s.write('musicxml', fp=f'{key_signature}_scale.musicxml')
