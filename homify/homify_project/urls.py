from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path("admin/", admin.site.urls),
    path('', include('homify.urls')),
    path("accounts/", include('django.contrib.auth.urls')),
    path("accounts/", include('accounts.urls')),
    path("listings/", include('listings.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
