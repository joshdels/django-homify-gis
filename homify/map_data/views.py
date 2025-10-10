from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.gis.geos import Polygon
from rest_framework.response import Response
from .serializers import PropertySerializer
from listings.models import Property
import json


@api_view(["GET", "POST"])
def PropertyAllListing(request):
  
  if request.method == "GET":
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
        
  elif request.method == "POST":   
    data = request.data
    print(data)
    price_max = data.get("priceMax")
    price_min = data.get("priceMin")
    properties = Property.objects.all()
    
    if price_min is not None and price_min != "":
        price_min = float(price_min)   # 👈 cast to number
        properties = properties.filter(price__gte=price_min)

    if price_max is not None and price_max != "":
        price_max = float(price_max)   # 👈 cast to number
        properties = properties.filter(price__lte=price_max)
    
   
  # Send final queryset     
  serializer = PropertySerializer(properties, many=True, context={"request": request})
  return Response(serializer.data)
  

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def PropertyUserListing(request):
  properties = Property.objects.filter(owner=request.user)
  serializer = PropertySerializer(properties, many=True, context={"request": request})
  return Response(serializer.data)


@api_view(["GET"])
def SinglePropertyListing(request, id):
  try:
     property_obj = Property.objects.get(pk=id)
  except Property.DoesNotExist:
    return Response({"error": "Property not found"}, status=404)
  
  serializer = PropertySerializer(property_obj, context={"request": request})
  
  feature = {
    "type": "Feature",
    "geometry": json.loads(property_obj.geom.geojson),  
    "properties": serializer.data
  }
  
  return Response({
    "type": "FeatureCollection", 
    "features": [serializer.data]}
  )



