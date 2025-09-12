from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from listings.models import Property, PropertyImage, Amenity


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


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ["id", "name"]


class PropertySerializer(GeoFeatureModelSerializer):
    image_url = serializers.SerializerMethodField(read_only=True)      # ✅ single method field
    images = PropertyImageSerializer(many=True, read_only=True)        # ✅ many=True (reverse FK)
    amenities = AmenitySerializer(many=True, read_only=True)           # ✅ many=True (M2M)

    class Meta:
        model = Property
        geo_field = "geom"
        fields = "__all__"

    def get_image_url(self, obj):
        request = self.context.get("request")
        first_image = obj.images.first()
        if first_image and first_image.image:
            url = first_image.image.url
            return request.build_absolute_uri(url) if request else url
        return None
