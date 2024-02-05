from django.urls import path
from .views import RandomMusicSheetAPIView, ScaleAPIView

urlpatterns = [
    path('random-sheet/', RandomMusicSheetAPIView.as_view(), name='random-sheet'),
    path('generate-scale/', ScaleAPIView.as_view(), name='generate-scale'),
]
