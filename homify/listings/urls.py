from django.urls import path
from .views import (
    PropertyAllView, 
    PropertyCardListView,
    PropertyDetailView,
    UserListView, 
    PropertyCreateView,
    PropertyUpdateView,
    PropertyDeleteView,
    
    PropertyListView # for observation
)

urlpatterns = [
    path('', PropertyAllView.as_view(), name='listing_all'),
    path('cardlist/', PropertyCardListView.as_view(), name='listing_cardlist'),
    path('<int:pk>', PropertyDetailView.as_view(), name='listing_detail'),
    path('my-dashboard/', UserListView.as_view(), name="listing_user"),
    path('new/', PropertyCreateView.as_view(), name="listing_new"),
    path('<int:pk>/update/', PropertyUpdateView.as_view(), name='listing_update'),
    path('<int:pk>/delete', PropertyDeleteView.as_view(), name='listing_delete'),
    
    path('<str:property_type>/', PropertyListView.as_view(), name='listing_type'),
]
