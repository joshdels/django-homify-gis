from django.urls import path

from .views import HomePage, PostListView, PostDetailView

urlpatterns = [
    path('', HomePage.as_view(), name='homepage'),
    path('post/', PostListView.as_view(), name='post_list' ),
    path('post/<int:pk>/', PostDetailView.as_view(), name='post_detail' )
]