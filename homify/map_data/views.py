from django.http import HttpResponse
from django.core.serializers import serialize
from listings.models import Property

# Create your views here.
def PropertyAllListing(request):
  location = Property.objects.all()
  geojson = serialize('geojson', location)
  return HttpResponse(geojson, content_type='application/json')

