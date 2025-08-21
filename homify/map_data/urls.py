from django.urls import path
from . import views

urlpatterns = [
    path('all-properties', views.PropertyAllListing , name='all_properties'),
]


