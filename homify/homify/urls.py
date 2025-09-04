from django.urls import path

from .views import HomePage, ContactPage, PostListView, PostDetailView

urlpatterns = [
    path('', HomePage.as_view(), name='homepage'),
    path('contact-page/', ContactPage.as_view(), name='contact_page'),
    path('post/', PostListView.as_view(), name='post_list' ),
    path('post/<int:pk>/', PostDetailView.as_view(), name='post_detail' )
]