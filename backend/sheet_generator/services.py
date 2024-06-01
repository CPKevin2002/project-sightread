# sheet_generator/services.py
from music21 import stream, note, instrument, key, scale
import random, tempfile

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
    
     # Output the stream to a MusicXML file
    music_xml = s.write('musicxml', fp=None)

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
    music_xml = s.write('musicxml', fp=None)

    # Read the content of the file as a string
    with open(music_xml, 'r') as file:
        music_xml_content = file.read()
    
    return music_xml_content


@csrf_exempt
def convert_musicxml(request):
    if request.method == 'POST' and request.FILES.get('file'):
        file = request.FILES['file']
        filename = file.name
        file_path = default_storage.save(filename, file)

        if filename.lower().endswith(('.xml', '.musicxml')):
            # Convert .xml or .musicxml to .mxl using MuseScore
            temp_output_path = os.path.join(os.path.dirname(file_path), 'temp_output.mxl')
            command = f'mscore -o {temp_output_path} {file_path}'

            try:
                subprocess.run(command, shell=True, check=True)
                with open(temp_output_path, 'rb') as f:
                    file_data = f.read()

                # Clean up
                os.remove(file_path)
                os.remove(temp_output_path)

                return HttpResponse(file_data, content_type='application/vnd.recordare.musicxml+xml')
            except subprocess.CalledProcessError as e:
                return HttpResponseBadRequest(f"Error during file conversion: {str(e)}")
        elif filename.lower().endswith('.mxl'):
            with open(file_path, 'rb') as f:
                file_data = f.read()

            os.remove(file_path)
            return HttpResponse(file_data, content_type='application/vnd.recordare.musicxml+xml')
        else:
            return HttpResponseBadRequest("Unsupported file type")
    else:
        return HttpResponseBadRequest("Invalid request")

