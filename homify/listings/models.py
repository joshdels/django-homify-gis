from django.contrib.auth.models import User
from django.db import models


class Property(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="properties")
    description = models.TextField(max_length=500, blank=True)
    
    CATEGORY_CHOICES = [
        ("residential", "Residential"),
        ("commercial", "Commercial"),
    ]
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="residential")

    PROPERTY_TYPES = [
        ("house", "House"),
        ("boarding_hosuse", "Boarding House"),
        ("apartment", "Apartment"),
        ("condo", "Condominium"),
        ("lot", "Lot"),
        ("commercial_lot", "Commercial Lot"),
        ("office", "Office Space"),
    ]
    property_type = models.CharField(max_length=50, choices=PROPERTY_TYPES)

    address = models.CharField(max_length=200, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    bedrooms = models.IntegerField(blank=True, null=True)
    bathrooms = models.IntegerField(blank=True, null=True)
    floor_storey = models.IntegerField(blank=True, null=True, default=1)
    floor_area = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    available_unit = models.IntegerField(blank=True, null=True, default=1)
    parking_spaces = models.IntegerField(blank=True, null=True)

    image = models.ImageField(upload_to="property_images/", blank=True, null=True)

    STATUS_CHOICES = [
        ("available", "Available"),
        ("rented", "Rented"),
        ("for_sale", "For Sale"),
        ("sold", "Sold"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="available")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"{self.get_property_type_display()} - {self.address or 'No Address'}"

    
class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="property_images/")
    caption = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"Image for {self.property.address or 'Property'}"
