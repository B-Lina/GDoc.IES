"""
Modelos del módulo documental.
FASE 2: Modelo Documento con campos para gestión y validación.
"""
from django.db import models
from django.core.validators import FileExtensionValidator


class Documento(models.Model):
    """
    Modelo que representa un documento subido al sistema.
    
    Campos:
    - archivo: archivo PDF/imagen subido
    - fecha_emision: fecha en que se emitió el documento
    - fecha_vencimiento: fecha de vencimiento (usado para semáforo)
    - estado: estado del semáforo (verde/amarillo/rojo)
    - texto_extraido: texto obtenido por OCR (Fase 3)
    - fecha_carga: timestamp de cuando se subió al sistema
    """
    
    ESTADO_CHOICES = [
        ('verde', '🟢 Válido'),
        ('amarillo', '🟡 Requiere revisión'),
        ('rojo', '🔴 Inválido'),
    ]
    
    archivo = models.FileField(
        upload_to='documentos/%Y/%m/%d/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'png', 'jpg', 'jpeg', 'tiff', 'bmp'])],
        help_text='Archivo del documento (PDF o imagen)'
    )
    
    fecha_emision = models.DateField(
        null=True,
        blank=True,
        help_text='Fecha en que se emitió el documento'
    )
    
    fecha_vencimiento = models.DateField(
        null=True,
        blank=True,
        help_text='Fecha de vencimiento del documento (usado para validación)'
    )
    
    estado = models.CharField(
        max_length=10,
        choices=ESTADO_CHOICES,
        default='amarillo',
        help_text='Estado del semáforo de validación'
    )
    
    texto_extraido = models.TextField(
        null=True,
        blank=True,
        help_text='Texto extraído mediante OCR (Fase 3)'
    )
    
    numero_documento_usuario = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        help_text='Número de documento del usuario (ej. DNI, pasaporte) para validación'
    )
    
    fecha_carga = models.DateTimeField(
        auto_now_add=True,
        help_text='Fecha y hora de carga del documento'
    )
    
    class Meta:
        ordering = ['-fecha_carga']
        verbose_name = 'Documento'
        verbose_name_plural = 'Documentos'
    
    def __str__(self):
        nombre_archivo = self.archivo.name.split('/')[-1] if self.archivo else 'Sin archivo'
        return f"{nombre_archivo} ({self.get_estado_display()})"
    
    def recalcular_estado(self):
        """
        Recalcula el estado del semáforo según las reglas de validación.
        FASE 4: Método helper para actualizar el estado manualmente si es necesario.
        """
        from .services.semaforo_service import actualizar_estado_documento
        actualizar_estado_documento(self)
        self.save(update_fields=['estado'])
