# sheet_generator/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .services import generate_random_music

class RandomMusicSheetAPIView(APIView):
    def get(self, request, *args, **kwargs):
        music_xml_content = generate_random_music()
        return Response({'music_xml': music_xml_content})
