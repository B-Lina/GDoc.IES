"""
Vistas API del módulo documental.
FASE 1: endpoint de salud.
FASE 2: ViewSet CRUD para Documento.
FASE 3: OCR al subir documento.
FASE 4: Semáforo inteligente.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Documento
from .serializers import DocumentoSerializer
from .services.ocr_service import extraer_texto_ocr
from .services.semaforo_service import actualizar_estado_documento


@api_view(['GET'])
@permission_classes([AllowAny])
def api_health(request):
    """
    Salud de la API. Usado en FASE 1 para confirmar que el backend responde
    y que CORS/DRF están bien configurados.
    """
    return Response({
        'status': 'ok',
        'message': 'API G-Doc operativa',
        'version': '1.0',
    })


class DocumentoViewSet(viewsets.ModelViewSet):
    """
    ViewSet que proporciona acciones CRUD para Documento:
    - list: GET /api/documentos/ (lista todos)
    - create: POST /api/documentos/ (crear nuevo)
    - retrieve: GET /api/documentos/{id}/ (obtener uno)
    - update: PUT /api/documentos/{id}/ (actualizar completo)
    - partial_update: PATCH /api/documentos/{id}/ (actualizar parcial)
    - destroy: DELETE /api/documentos/{id}/ (eliminar)
    """
    queryset = Documento.objects.all()
    serializer_class = DocumentoSerializer
    permission_classes = [AllowAny]  # MVP; luego restringir
    parser_classes = [MultiPartParser, FormParser]  # Para subir archivos
    
    def get_serializer_context(self):
        """Añade el request al contexto del serializador para generar URLs absolutas."""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        """
        ========================================================================
        CREAR DOCUMENTO - AQUÍ SE EJECUTA EL SEMÁFORO AL SUBIR
        ========================================================================
        Crea el documento, ejecuta OCR y calcula el estado del semáforo.
        
        Flujo:
        1. Guarda el documento en BD
        2. Ejecuta OCR sobre el archivo (FASE 3)
        3. Calcula el estado del semáforo (FASE 4) -> ver semaforo_service.py
        4. Guarda texto_extraido y estado
        ========================================================================
        """
        doc = serializer.save()
        
        # FASE 3: Extraer texto con OCR
        try:
            if doc.archivo:
                ruta = doc.archivo.path
                texto = extraer_texto_ocr(ruta)
                if texto:
                    doc.texto_extraido = texto
        except Exception:
            # Si el archivo no está en disco (ej. almacenamiento remoto) o OCR falla, continuar
            pass
        
        # ====================================================================
        # FASE 4: CALCULAR ESTADO DEL SEMÁFORO
        # La lógica está en: documental/services/semaforo_service.py
        # ====================================================================
        actualizar_estado_documento(doc)
        
        # Guardar cambios (texto_extraido y estado)
        campos_a_actualizar = ['estado']
        if doc.texto_extraido:
            campos_a_actualizar.append('texto_extraido')
        doc.save(update_fields=campos_a_actualizar)
    
    def perform_update(self, serializer):
        """
        ========================================================================
        ACTUALIZAR DOCUMENTO - AQUÍ SE RECALCULA EL SEMÁFORO AL ACTUALIZAR
        ========================================================================
        Actualiza el documento y recalcula el estado del semáforo.
        
        La lógica del semáforo está en: documental/services/semaforo_service.py
        ========================================================================
        """
        doc = serializer.save()
        
        # ====================================================================
        # RECALCULAR ESTADO DEL SEMÁFORO
        # Se recalcula automáticamente si cambian campos relevantes:
        # - fecha_vencimiento
        # - fecha_emision
        # - texto_extraido (si se actualiza manualmente)
        # - numero_documento_usuario
        # ====================================================================
        actualizar_estado_documento(doc)
        doc.save(update_fields=['estado'])
