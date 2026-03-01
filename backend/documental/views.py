"""
Vistas API del módulo documental.
FASE 1-2: ViewSets CRUD para todos los modelos + Dashboard stats especial.
FASE 3: OCR al subir documento.
FASE 4: Semáforo inteligente.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from .models import (
    Documento, Postulante, Convocatoria, DocumentoRequerido,
    UsuarioPerfil, Expediente
)
from .serializers import (
    DocumentoSerializer, PostulanteSerializer, ConvocatoriaSerializer,
    DocumentoRequeridoSerializer, UsuarioPerfilSerializer, ExpedienteSerializer
)
from .services.ocr_service import extraer_texto_ocr
from .services.semaforo_service import actualizar_estado_documento


@api_view(['GET'])
@permission_classes([AllowAny])
def api_health(request):
    """
    Salud de la API. Usado para confirmar que el backend responde
    y que CORS/DRF están bien configurados.
    """
    return Response({
        'status': 'ok',
        'message': 'API G-Doc operativa',
        'version': '2.0',
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    """
    ========================================================================
    ENDPOINT ESPECIAL: ESTADÍSTICAS PARA EL DASHBOARD
    ========================================================================
    
    Retorna un JSON con métricas y contadores para los gráficos del dashboard.
    NO ES UN CRUD SIMPLE - calcula estadísticas agregadas en tiempo real.
    
    Respuesta:
    {
        "total_documentos": 10,
        "documentos_aprobados": 5,
        "documentos_pendientes": 3,
        "documentos_rechazados": 2,
        "documentos_en_revision": 0,
        "semaforo_verde": 5,
        "semaforo_amarillo": 3,
        "semaforo_rojo": 2,
        "convocatorias_activas": 3,
        "convocatorias_cerradas": 1,
        "total_postulantes": 45,
        "expedientes_total": 10,
        "expedientes_completos": 3,
        "expedientes_incompletos": 4,
        "expedientes_en_proceso": 3,
        "documentos_vencidos": 1,
        "documentos_por_vencer": 2,
    }
    ========================================================================
    """
    
    today = timezone.now().date()
    
    # Contar documentos por estado
    total_documentos = Documento.objects.count()
    documentos_aprobados = Documento.objects.filter(estado='aprobado').count()
    documentos_pendientes = Documento.objects.filter(estado='pendiente').count()
    documentos_rechazados = Documento.objects.filter(estado='rechazado').count()
    documentos_en_revision = Documento.objects.filter(estado='en_revision').count()
    
    # Contar documentos por semáforo
    semaforo_verde = Documento.objects.filter(estado_semaforo='verde').count()
    semaforo_amarillo = Documento.objects.filter(estado_semaforo='amarillo').count()
    semaforo_rojo = Documento.objects.filter(estado_semaforo='rojo').count()
    
    # Contar convocatorias
    convocatorias_activas = Convocatoria.objects.filter(
        estado='abierta',
        fecha_inicio__lte=today,
        fecha_fin__gte=today
    ).count()
    convocatorias_cerradas = Convocatoria.objects.filter(estado='cerrada').count()
    
    # Contratos postulantes y expedientes
    total_postulantes = Postulante.objects.filter(estado='activo').count()
    expedientes_total = Expediente.objects.count()
    expedientes_completos = Expediente.objects.filter(estado='completo').count()
    expedientes_incompletos = Expediente.objects.filter(estado='incompleto').count()
    expedientes_en_proceso = Expediente.objects.filter(estado='en_proceso').count()
    
    # Documentos vencidos y por vencer
    documentos_vencidos = Documento.objects.filter(
        fecha_vencimiento__lt=today,
        fecha_vencimiento__isnull=False
    ).count()
    
    # Documentos por vencer en los próximos 30 días
    fecha_proximamente = today + timedelta(days=30)
    documentos_por_vencer = Documento.objects.filter(
        fecha_vencimiento__gte=today,
        fecha_vencimiento__lte=fecha_proximamente,
        fecha_vencimiento__isnull=False
    ).count()
    
    return Response({
        'total_documentos': total_documentos,
        'documentos_aprobados': documentos_aprobados,
        'documentos_pendientes': documentos_pendientes,
        'documentos_rechazados': documentos_rechazados,
        'documentos_en_revision': documentos_en_revision,
        'semaforo_verde': semaforo_verde,
        'semaforo_amarillo': semaforo_amarillo,
        'semaforo_rojo': semaforo_rojo,
        'convocatorias_activas': convocatorias_activas,
        'convocatorias_cerradas': convocatorias_cerradas,
        'total_postulantes': total_postulantes,
        'expedientes_total': expedientes_total,
        'expedientes_completos': expedientes_completos,
        'expedientes_incompletos': expedientes_incompletos,
        'expedientes_en_proceso': expedientes_en_proceso,
        'documentos_vencidos': documentos_vencidos,
        'documentos_por_vencer': documentos_por_vencer,
    })


class PostulanteViewSet(viewsets.ModelViewSet):
    """
    ViewSet CRUD para Postulante.
    - list: GET /api/postulantes/
    - create: POST /api/postulantes/
    - retrieve: GET /api/postulantes/{id}/
    - update: PUT /api/postulantes/{id}/
    - partial_update: PATCH /api/postulantes/{id}/
    - destroy: DELETE /api/postulantes/{id}/
    """
    queryset = Postulante.objects.all()
    serializer_class = PostulanteSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['estado', 'numero_documento']
    search_fields = ['nombres', 'apellidos', 'email', 'numero_documento']


class ConvocatoriaViewSet(viewsets.ModelViewSet):
    """
    ViewSet CRUD para Convocatoria.
    - list: GET /api/convocatorias/
    - create: POST /api/convocatorias/
    - retrieve: GET /api/convocatorias/{id}/
    - update: PUT /api/convocatorias/{id}/
    - partial_update: PATCH /api/convocatorias/{id}/
    - destroy: DELETE /api/convocatorias/{id}/
    """
    queryset = Convocatoria.objects.all()
    serializer_class = ConvocatoriaSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['estado']
    search_fields = ['titulo', 'descripcion']
    ordering_fields = ['fecha_inicio', 'fecha_fin']
    ordering = ['-fecha_inicio']


class DocumentoRequeridoViewSet(viewsets.ModelViewSet):
    """
    ViewSet CRUD para DocumentoRequerido.
    - list: GET /api/documentos-requeridos/
    - create: POST /api/documentos-requeridos/
    - retrieve: GET /api/documentos-requeridos/{id}/
    - update: PUT /api/documentos-requeridos/{id}/
    - partial_update: PATCH /api/documentos-requeridos/{id}/
    - destroy: DELETE /api/documentos-requeridos/{id}/
    """
    queryset = DocumentoRequerido.objects.all()
    serializer_class = DocumentoRequeridoSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['convocatoria', 'obligatorio']
    search_fields = ['nombre']


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
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]
    filterset_fields = ['postulante', 'convocatoria', 'estado', 'estado_semaforo']
    search_fields = ['nombre_archivo', 'postulante__nombres', 'postulante__apellidos']
    ordering_fields = ['fecha_carga', 'confianza_ocr', 'estado']
    ordering = ['-fecha_carga']
    
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
        3. Calcula el estado del semáforo (FASE 4)
        4. Guarda texto_extraido y estado_semaforo
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
            # Si el archivo no está en disco o OCR falla, continuar
            pass
        
        # ====================================================================
        # FASE 4: CALCULAR ESTADO DEL SEMÁFORO
        # La lógica está en: documental/services/semaforo_service.py
        # ====================================================================
        actualizar_estado_documento(doc)
        
        # Guardar cambios
        campos_a_actualizar = ['estado_semaforo']
        if doc.texto_extraido:
            campos_a_actualizar.append('texto_extraido')
        doc.save(update_fields=campos_a_actualizar)
    
    def perform_update(self, serializer):
        """
        ========================================================================
        ACTUALIZAR DOCUMENTO - RECALCULAR SEMÁFORO AL ACTUALIZAR
        ========================================================================
        """
        doc = serializer.save()
        actualizar_estado_documento(doc)
        doc.save(update_fields=['estado_semaforo'])


class UsuarioPerfilViewSet(viewsets.ModelViewSet):
    """
    ViewSet CRUD para UsuarioPerfil.
    - list: GET /api/usuarios-perfil/
    - create: POST /api/usuarios-perfil/
    - retrieve: GET /api/usuarios-perfil/{id}/
    - update: PUT /api/usuarios-perfil/{id}/
    - partial_update: PATCH /api/usuarios-perfil/{id}/
    - destroy: DELETE /api/usuarios-perfil/{id}/
    """
    queryset = UsuarioPerfil.objects.all()
    serializer_class = UsuarioPerfilSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['rol']
    search_fields = ['usuario__username', 'usuario__first_name', 'usuario__last_name']


class ExpedienteViewSet(viewsets.ModelViewSet):
    """
    ViewSet CRUD para Expediente.
    - list: GET /api/expedientes/
    - create: POST /api/expedientes/
    - retrieve: GET /api/expedientes/{id}/
    - update: PUT /api/expedientes/{id}/
    - partial_update: PATCH /api/expedientes/{id}/
    - destroy: DELETE /api/expedientes/{id}/
    """
    queryset = Expediente.objects.all()
    serializer_class = ExpedienteSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['postulante', 'convocatoria', 'estado']
    search_fields = [
        'postulante__nombres', 'postulante__apellidos',
        'convocatoria__titulo'
    ]
    ordering_fields = ['creado_en', 'actualizado_en']
    ordering = ['-creado_en']
