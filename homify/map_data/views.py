from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import PropertySerializer
from listings.models import Property

@api_view(["GET"])
def PropertyAllListing(request):
  location = Property.objects.all()
  serializer = PropertySerializer(location, many=True, context={"request": request})
  return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def PropertyUserListing(request):
  location = Property.objects.filter(owner=request.user)
  serializer = PropertySerializer(location, many=True, context={"request": request})
  return Response(serializer.data)



