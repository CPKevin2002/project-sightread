# sheet_generator/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .services import generate_random_music, generate_scale_in_key, convert_musicxml_file
import os

class RandomMusicSheetAPIView(APIView):
    def get(self, request, *args, **kwargs):
        music_xml_content = generate_random_music()
        return HttpResponse(music_xml_content, content_type='application/vnd.recordare.musicxml')
    
class ScaleAPIView(APIView):
    def get(self, request, *args, **kwargs):
        key_signature = request.query_params.get('key', 'C')
        start_note = request.query_params.get('start', 'C4')
        end_note = request.query_params.get('end', 'C5')
        music_xml_content = generate_scale_in_key(key_signature, start_note, end_note)

        return HttpResponse(music_xml_content, content_type='application/vnd.recordare.musicxml')
    
    
class ConvertMusicXMLAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        if 'file' not in request.data:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        file = request.data['file']

        try:
            file_data = convert_musicxml_file(file)
            return HttpResponse(file_data, content_type='application/vnd.recordare.musicxml')
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

