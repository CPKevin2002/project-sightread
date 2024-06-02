# sheet_generator/services.py
from music21 import stream, note, instrument, key, scale
from django.conf import settings
import random, os, subprocess
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import SimpleUploadedFile
import uuid


"""
Compress a .musicxml file to a compressed .mxl file format
Returns the bytes for the .mxl
"""
def compress_music_xml_file(uncompressed_file_path: str) -> bytes:
    unique_id = uuid.uuid4().hex
    temp_output_path = os.path.join(os.path.dirname(uncompressed_file_path), f'temp_output_{unique_id}.mxl')
    command = f'\'{settings.MUSESCORE_PATH}\' -o {temp_output_path} {uncompressed_file_path}'
    try:
        subprocess.run(command, shell=True, check=True)
        with open(temp_output_path, 'rb') as f:
            file_data = f.read()
        # Clean up
        os.remove(uncompressed_file_path)
        os.remove(temp_output_path)
        return file_data
    except subprocess.CalledProcessError as e:
        raise Exception(f"Error during file conversion: {str(e)}")

# Tonic music generation (i.e. for each key,):
# 1. Generate descending/ascending scales
# 2. Generate melodies with varying degrees of jumps/accidentals
# 3. Generate random music 

def generate_random_music(num_notes=20, low=60, high=72):
    s = stream.Stream()
    s.insert(0, instrument.fromString('Piano'))

    for _ in range(num_notes):
        n = note.Note()
        n.pitch.midi = random.randint(low, high)
        s.append(n)
    
    # Output the stream to a MusicXML file
    music_xml_path = s.write(fp=None)
    return compress_music_xml_file(music_xml_path)


def generate_scale_in_key(key_signature, start, end):
    music_key = key.Key(key_signature)
    if music_key.mode == 'major':
        scl = scale.MajorScale(music_key.tonic)
    else:
        scl = scale.MinorScale(music_key.tonic)
    s = stream.Stream()
    s.append(music_key)

    ascending_notes = scl.getPitches(start, end)
    for p in ascending_notes:
        n = note.Note(p)
        s.append(n)
    
    music_xml_path = s.write('musicxml', fp=None)
    return compress_music_xml_file(music_xml_path)


def convert_musicxml_file(file):
    filename = file.name
    if not filename.lower().endswith(('.xml', '.musicxml')):
        raise Exception("Unsupported file type:", filename)
    
    file_path = default_storage.save(filename, file)
    return compress_music_xml_file(file_path)
    
