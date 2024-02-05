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
        key_signature = request.query_params.get('key', 'C major')
        start_note = request.query_params.get('start', 'C4')
        end_note = request.query_params.get('end', 'C5')

        try:
            musicxml_path = generate_scale_in_key(key_signature, start_note, end_note)
            
            # Read the content of the MusicXML file
            with open(musicxml_path, 'rb') as f:
                file_content = f.read()

            # Clean up the file after sending the response
            os.remove(musicxml_path)

            # Set the content type and headers for file download
            response = Response(file_content, status=status.HTTP_200_OK, content_type='application/vnd.recordare.musicxml+xml')
            response['Content-Disposition'] = f'attachment; filename="{os.path.basename(musicxml_path)}"'
            return response

        except Exception as e:
            # Handle any exceptions that occur
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

