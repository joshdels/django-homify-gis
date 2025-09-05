from rest_framework.decorators import api_view, permission_classes
from django.contrib.gis.geos import Polygon
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import PropertySerializer
from listings.models import Property

@api_view(["GET"])
def PropertyAllListing(request):
  try: 
    swLat = float(request.GET.get("swLat"))
    swLng = float(request.GET.get("swLng"))
    neLat = float(request.GET.get("neLat"))
    neLng = float(request.GET.get("neLng"))
  except (TypeError, ValueError):
    properties = Property.objects.all()
  else:
    bbox = Polygon.from_bbox((swLng, swLat, neLng, neLat))
    properties = Property.objects.filter(geom__within=bbox)
    
  serializer = PropertySerializer(properties, many=True, context={"request": request})
  return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def PropertyUserListing(request):
  properties = Property.objects.filter(owner=request.user)
  serializer = PropertySerializer(properties, many=True, context={"request": request})
  return Response(serializer.data)



