from django.urls import path
from .views import RandomMusicSheetAPIView

urlpatterns = [
    path('random-sheet/', RandomMusicSheetAPIView.as_view(), name='random-sheet'),
]
