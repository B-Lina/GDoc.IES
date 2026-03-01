"""
Configuración del admin de Django para el módulo documental.
"""
from django.contrib import admin
from .models import Documento


@admin.register(Documento)
class DocumentoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre_archivo', 'fecha_emision', 'fecha_vencimiento', 'estado', 'fecha_carga']
    list_filter = ['estado', 'fecha_carga', 'fecha_vencimiento']
    search_fields = ['archivo', 'texto_extraido']
    readonly_fields = ['fecha_carga']
    
    def nombre_archivo(self, obj):
        """Muestra solo el nombre del archivo en el admin."""
        if obj.archivo:
            return obj.archivo.name.split('/')[-1]
        return '-'
    nombre_archivo.short_description = 'Archivo'
