from django.test import TestCase
from .services import generate_random_music, generate_scale_in_key
import os

class MusicServicesTestCase(TestCase):
    def test_generate_random_music(self):
        # Test the generate_random_music function
        music_xml_content = generate_random_music()
        print(music_xml_content)
        
    def test_generate_scale_in_key(self):
        # Test the generate_scale_in_key function
        key_signature = 'C'
        start = 'C4'
        end = 'C5'
        generate_scale_in_key(key_signature, start, end)


from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile
import os
from music21 import stream, note, converter

class ConvertMusicXMLTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        # Create a simple MusicXML file using music21
        s = stream.Stream()
        s.append(note.Note("C4"))
        s.append(note.Note("D4"))
        s.append(note.Note("E4"))
        
        self.original_musicxml_path = os.path.join(os.path.dirname(__file__), 'original.musicxml')

        s.write(fp=self.original_musicxml_path)

    def test_convert_musicxml_to_mxl(self):
        with open(self.original_musicxml_path, 'rb') as f:
            file = SimpleUploadedFile(f.name, f.read(), content_type="application/vnd.recordare.musicxml+xml")
            response = self.client.post('/api/convert_musicxml/', {'file': file})

        self.assertEqual(response.status_code, 200)

        # Save the response content to a temporary file
        converted_mxl_path = os.path.join(os.path.dirname(__file__), 'converted.mxl')
        with open(converted_mxl_path, 'wb') as f:
            f.write(response.content)

        # Parse the original and converted files using music21
        original_score = converter.parse(self.original_musicxml_path)
        converted_score = converter.parse(converted_mxl_path)

        os.remove(self.original_musicxml_path)
        os.remove(converted_mxl_path)

        # Check that the two scores are equal
        self.compare_notes(original_score, converted_score)

    def compare_notes(self, original_score, converted_score):
        original_notes = list(original_score.flat.notes)
        converted_notes = list(converted_score.flat.notes)

        self.assertEqual(len(original_notes), len(converted_notes), "Number of notes do not match")

        for original_note, converted_note in zip(original_notes, converted_notes):
            self.assertEqual(original_note.name, converted_note.name, f"Note names do not match: {original_note} vs {converted_note}")
            self.assertEqual(original_note.octave, converted_note.octave, f"Note octaves do not match: {original_note} vs {converted_note}")
            self.assertEqual(original_note.quarterLength, converted_note.quarterLength, f"Note durations do not match: {original_note} vs {converted_note}")



