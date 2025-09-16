from django import forms
from django.forms import modelformset_factory
from .models import Property, PropertyImage
from django.contrib.gis.geos import Point


class PropertyForm(forms.ModelForm):
    latitude = forms.FloatField(widget=forms.HiddenInput(), required=True)
    longitude = forms.FloatField(widget=forms.HiddenInput(), required=True)

    class Meta:
        model = Property
        exclude = ["owner", "created_at", "updated_at",]
        widgets = {
            "amenities": forms.CheckboxSelectMultiple(attrs={"class": "form-check-input"}),  
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # If editing an existing property, pre-fill lat/lng from geom
        if self.instance and self.instance.geom:
            self.fields["latitude"].initial = self.instance.geom.y
            self.fields["longitude"].initial = self.instance.geom.x

        self.fields["latitude"].required = True
        self.fields["longitude"].required = True

    def save(self, commit=True):
        instance = super().save(commit=False)

        # Save location point
        lat = self.cleaned_data.get("latitude")
        lng = self.cleaned_data.get("longitude")
        if lat is not None and lng is not None:
            instance.geom = Point(lng, lat)  # GeoDjango expects (x=lng, y=lat)

        if commit:
            instance.save()
            self.save_m2m()  #

        return instance


# Formset for handling multiple property images
PropertyImageFormSet = modelformset_factory(
    PropertyImage,
    fields=("image", "caption"),
    extra=3,
    can_delete=True,
)
