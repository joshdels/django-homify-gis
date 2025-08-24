from django import forms
from django.forms import modelformset_factory
from .models import Property, PropertyImage
from django.contrib.gis.geos import Point

class PropertyForm(forms.ModelForm):
    latitude = forms.FloatField(widget=forms.HiddenInput(), required=True)
    longitude = forms.FloatField(widget=forms.HiddenInput(), required=True)
    
    class Meta:
        model = Property
        exclude = ["owner", "created_at", "updated_at", "image"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make sure the fields are optional at first so form renders
        if self.instance and self.instance.geom:
            self.fields['latitude'].initial = self.instance.geom.y
            self.fields['longitude'].initial = self.instance.geom.x            
        
        self.fields['latitude'].required = True
        self.fields['longitude'].required = True

    def save(self, commit=True):
        instance = super().save(commit=False)
        lat = self.cleaned_data.get('latitude')
        lng = self.cleaned_data.get('longitude')
        if lat is not None and lng is not None:
            instance.geom = Point(lng, lat)  # note Point(lng, lat)
        if commit:
            instance.save()
        return instance


PropertyImageFormSet = modelformset_factory(
    PropertyImage,
    fields=("image", "caption"),
    extra=3,
    can_delete=True
)
