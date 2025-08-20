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
    success_url = reverse_lazy("listing_user")

    def form_valid(self, form):
        # Set the logged-in user as owner
        form.instance.owner = self.request.user
        self.object = form.save()

        # Save each uploaded image
        for f in self.request.FILES.getlist("images"):
            PropertyImage.objects.create(property=self.object, image=f)

        return redirect(self.success_url)

        
        
class UserListView(LoginRequiredMixin, ListView):
    '''For User Specific'''
    model = Property
    template_name = 'listings/listing_userlist.html'
    context_object_name = "properties"
    
    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)
    
    
class PropertyUpdateView(LoginRequiredMixin, UpdateView):
    model = Property
    form_class = PropertyForm
    template_name = "listings/listing_update.html"
    success_url = reverse_lazy("listing_user")

    def get_queryset(self):
        # Only allow editing user's own properties
        return Property.objects.filter(owner=self.request.user)

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        form = self.form_class(request.POST, request.FILES, instance=self.object)
        
        if form.is_valid():
            property_instance = form.save()

            # Update main image if new file uploaded
            if 'image' in request.FILES:
                property_instance.image = request.FILES['image']
                property_instance.save()

            # Delete selected additional images
            for key in request.POST:
                if key.startswith("delete_image_"):
                    img_id = key.split("delete_image_")[1]
                    try:
                        img = PropertyImage.objects.get(id=img_id, property=property_instance)
                        img.delete()
                    except PropertyImage.DoesNotExist:
                        pass

            # Add new additional images
            for f in request.FILES.getlist("images"):
                PropertyImage.objects.create(property=property_instance, image=f)

            return redirect(self.success_url)
        else:
            return render(request, self.template_name, {"form": form, "properties": self.object})
    
    
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
        

        
    
