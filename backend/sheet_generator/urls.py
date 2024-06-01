from django.urls import path
from .views import RandomMusicSheetAPIView, ScaleAPIView, ConvertMusicXMLAPIView

urlpatterns = [
    path('random-sheet/', RandomMusicSheetAPIView.as_view(), name='random-sheet'),
    path('generate-scale/', ScaleAPIView.as_view(), name='generate-scale'),
    path('convert_musicxml/', ConvertMusicXMLAPIView.as_view(), name='convert_musicxml'),
]
