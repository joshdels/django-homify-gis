from django.shortcuts import redirect, render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import DetailView, ListView, UpdateView, DeleteView, CreateView
from django.urls import reverse_lazy
from .models import Property, PropertyImage
from .forms import PropertyForm, PropertyImageFormSet


class PropertyAllView(ListView):
    model = Property
    template_name = 'listings/listing_properties.html'
    context_object_name = 'properties'  
        
        
class PropertyDetailView(DetailView):
    model = Property
    template_name = 'listings/listing_detail.html'
    context_object_name = 'properties'
    

class PropertyCardListView(ListView):
    model = Property
    template_name= 'listings/listing_cardlist.html'
    context_object_name = 'properties'
    
    
class PropertyCreateView(LoginRequiredMixin, CreateView):
    model = Property
    form_class = PropertyForm
    template_name = "listings/listings_add_form.html"
    success_url = reverse_lazy("listing_user")  # adjust to your URL name

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.POST:
            context["images"] = PropertyImageFormSet(
                self.request.POST, self.request.FILES,
                queryset=PropertyImage.objects.none()
            )
        else:
            context["images"] = PropertyImageFormSet(queryset=PropertyImage.objects.none())
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        images = context["images"]
        form.instance.owner = self.request.user  # set logged-in user as owner
        self.object = form.save()

        if images.is_valid():
            for img_form in images:
                if img_form.cleaned_data:
                    image = img_form.save(commit=False)
                    image.property = self.object
                    image.save()
        return redirect(self.success_url)  
        
        
class UserListView(LoginRequiredMixin, ListView):
    '''For User Specific'''
    model = Property
    template_name = 'listings/listing_user.html'
    context_object_name = "properties"
    
    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)
    
    
class PropertyUpdateView(LoginRequiredMixin, UpdateView):
    model = Property
    form_class = PropertyForm
    template_name = "listings/listing_update.html"
    success_url = reverse_lazy("listing_user")

    def get_queryset(self):
        # only allow editing user’s own properties
        return Property.objects.filter(owner=self.request.user)
    
    
class PropertyDeleteView(LoginRequiredMixin, DeleteView):
    model = Property
    success_url = reverse_lazy("listing_user")
    
    def get(self, request, *args, **kwargs):
        return redirect("listing_user")
    

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
        

        
    
