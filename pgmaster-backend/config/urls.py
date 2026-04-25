"""
URL configuration for PGMaster project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.auth.urls')),
    path('api/v1/pg/', include('apps.pg.urls')),
    path('api/v1/rooms/', include('apps.rooms.urls')),
    path('api/v1/tenants/', include('apps.tenants.urls')),
    path('api/v1/payments/', include('apps.payments.urls')),
    path('api/v1/complaints/', include('apps.complaints.urls')),
    path('api/v1/notices/', include('apps.notices.urls')),
    path('api/v1/reports/', include('apps.reports.urls')),
    path('api/v1/subscriptions/', include('apps.subscriptions.urls')),
    path('api/v1/mess/', include('apps.mess.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
