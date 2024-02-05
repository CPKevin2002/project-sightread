from django.test import TestCase
from .services import generate_random_music, generate_scale_in_key
import os

class MusicServicesTestCase(TestCase):
    def test_generate_random_music(self):
        # Test the generate_random_music function
        music_xml_content = generate_random_music()
        print(music_xml_content)
        self.assertTrue(music_xml_content.lower().startswith('<?xml version="1.0" encoding="utf-8"?>'))
        self.assertIn('<score-partwise', music_xml_content)
        
    def test_generate_scale_in_key(self):
        # Test the generate_scale_in_key function
        key_signature = 'C'
        start = 'C4'
        end = 'C5'
        generate_scale_in_key(key_signature, start, end)

