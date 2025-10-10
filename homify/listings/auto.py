from django.db import migrations

def create_amenities(apps, schema_editor):
    Amenity = apps.get_model("listings", "Amenity")
    for name in ["wiFi", "Parking", "Aircon"]:
        Amenity.objects.get_or_create(name=name)
        
class Migration(migrations.Migration):
    dependencies = [
        ("listings", "0001_intial"),
    ]
    
    operations = [
        migrations.RunPython(create_amenities),
    ]