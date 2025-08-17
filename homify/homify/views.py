from django.shortcuts import render
from django.views.generic import TemplateView, DetailView, ListView
from .models import Post

class HomePage(TemplateView):
    template_name = 'homepage.html'

class PostListView(ListView):
    model = Post
    context_object_name = 'posts'
    template_name = 'post/post_list.html'
    
class PostDetailView(DetailView):
    model = Post
    context_object_name = 'posts'
    template_name = 'post/post_detail.html'
    
