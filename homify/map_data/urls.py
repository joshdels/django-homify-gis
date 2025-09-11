from django.urls import path
from . import views

urlpatterns = [
    path('all-properties/', views.PropertyAllListing , name='all_properties'),
    path('user-properties/', views.PropertyUserListing , name='user_properties'),
    path('single-property/<int:id>/', views.SinglePropertyListing , name='single_property'),
]


