from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from listings.models import Property, PropertyImage

class PropertyImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ["id", "caption", "image_url"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class PropertySerializer(GeoFeatureModelSerializer):
    image_url = serializers.SerializerMethodField()
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        geo_field = "geom"
        fields = (
            "id", "owner", "category", "property_type", "address", "price",
            "bedrooms", "bathrooms", "status", "image_url", "images"
        )

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None
