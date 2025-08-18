from django.urls import path
from .views import (
    PropertyAllView, 
    PropertyDetailView,
    UserListView, 
    PropertyUpdateView,
    PropertyDeleteView,
    PropertyListView # for observation
)

urlpatterns = [
    path('', PropertyAllView.as_view(), name='listing_all'),
    path('<int:pk>', PropertyDetailView.as_view(), name='listing_detail'),
    path('my-properties/', UserListView.as_view(), name="listing_user"),
    path('<int:pk>', PropertyUpdateView.as_view(), name='listing_update'),
    path('<int:pk>', PropertyDeleteView.as_view(), name='listing_delete'),
    
    path('<str:property_type>/', PropertyListView.as_view(), name='listing_type'),
]
