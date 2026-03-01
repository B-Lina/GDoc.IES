"""
Serializadores DRF para el módulo documental.
FASE 2: Serializador para el modelo Documento con CRUD completo.
"""
from rest_framework import serializers
from .models import Documento


class DocumentoSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Documento.
    Permite crear, leer, actualizar y eliminar documentos.
    """
    
    # Campo calculado para mostrar el nombre del archivo
    nombre_archivo = serializers.SerializerMethodField()
    
    # Campo calculado para mostrar la URL del archivo
    url_archivo = serializers.SerializerMethodField()
    
    class Meta:
        model = Documento
        fields = [
            'id',
            'archivo',
            'nombre_archivo',
            'url_archivo',
            'fecha_emision',
            'fecha_vencimiento',
            'estado',
            'texto_extraido',
            'numero_documento_usuario',
            'fecha_carga',
        ]
        read_only_fields = ['id', 'fecha_carga', 'nombre_archivo', 'url_archivo']
    
    def get_nombre_archivo(self, obj):
        """Retorna solo el nombre del archivo sin la ruta completa."""
        if obj.archivo:
            return obj.archivo.name.split('/')[-1]
        return None
    
    def get_url_archivo(self, obj):
        """Retorna la URL completa del archivo para descarga/visualización."""
        if obj.archivo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.archivo.url)
            return obj.archivo.url
        return None
