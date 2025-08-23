from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.core.serializers import serialize
from listings.models import Property

# Create your views here.
def PropertyAllListing(request):
  location = Property.objects.all()
  geojson = serialize('geojson', location)
  return HttpResponse(geojson, content_type='application/json')

@login_required
def PropertyUserListing(request):
  location = Property.objects.filter(owner=request.user)
  geojson = serialize('geojson', location)
  return HttpResponse(geojson, content_type='application/json')

