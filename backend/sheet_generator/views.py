# sheet_generator/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import generate_random_music, generate_scale_in_key
import os

class RandomMusicSheetAPIView(APIView):
    def get(self, request, *args, **kwargs):
        music_xml_content = generate_random_music()
        return Response({'music_xml': music_xml_content})
    
class ScaleAPIView(APIView):
    def get(self, request, *args, **kwargs):
        key_signature = request.query_params.get('key', 'C')
        start_note = request.query_params.get('start', 'C4')
        end_note = request.query_params.get('end', 'C5')

        music_xml_content = generate_scale_in_key(key_signature, start_note, end_note)

        return Response({'music_xml': music_xml_content})
        

