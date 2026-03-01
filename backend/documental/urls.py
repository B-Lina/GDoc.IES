"""
URLs del módulo documental.
FASE 2: Router DRF para CRUD de Documento.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'documental'

# Router DRF para ViewSet
router = DefaultRouter()
router.register(r'documentos', views.DocumentoViewSet, basename='documento')

urlpatterns = [
    path('health/', views.api_health),
    path('', include(router.urls)),
]
