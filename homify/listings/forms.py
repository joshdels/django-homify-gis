from django import forms
from django.forms import modelformset_factory
from .models import Property, PropertyImage

class PropertyForm(forms.ModelForm):
    class Meta:
        model = Property
        exclude = ["owner", "created_at", "updated_at"]

# A formset for multiple images (default: 3 upload slots, can increase dynamically with JS)
PropertyImageFormSet = modelformset_factory(
    PropertyImage,
    fields=("image", "caption"),
    extra=3,
    can_delete=True
)