from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import DetailView, ListView, UpdateView, DeleteView
from .models import Property


class PropertyAllView(ListView):
    model = Property
    template_name = 'listings/listing_properties.html'
    context_object_name = 'properties'  
        
        
class PropertyDetailView(DetailView):
    model = Property
    template_name = 'listings/listing_detail.html'
    context_object_name = 'properties'
    
        
class UserListView(LoginRequiredMixin, ListView):
    '''For User Specific'''
    model = Property
    template_name = 'listings/listing_user.html'
    context_object_name = "properties"
    
    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)
    
    
class PropertyUpdateView(LoginRequiredMixin, UpdateView):
    model = Property
    template_name = 'listings/lising_update.html'
    context_object_name = 'properties'
    
    
class PropertyDeleteView(LoginRequiredMixin, DeleteView):
    model = Property
    template_name = 'listings/lising_delete.html'
    context_object_name = 'properties'
    

class PropertyListView(ListView):
    '''For observation might remove this?'''
    model = Property
    template_name = 'listings/listing_properties.html'
    context_object_name = 'properties'
    
    def get_queryset(self):
        property_type = self.kwargs.get('property_type')
        valid_types = [choice[0] for choice in Property.PROPERTY_TYPES]
        if property_type in valid_types:
            return Property.objects.filter(property_type=property_type)
        else:
            return Property.objects.none()
        

        
    
