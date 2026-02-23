# G-Doc – Sistema de gestión documental (MVP)

Sistema de gestión documental con OCR y semáforo de validación (verde / amarillo / rojo).

- **Backend:** Django + Django REST Framework + PostgreSQL (o SQLite en desarrollo).
- **Frontend:** React + TypeScript + Vite + Axios.

---

## FASE 1 – Estructura base ✅ COMPLETADA

**Estado:** Validada y funcionando.

### Qué se ha construido

- **Backend Django**
  - Proyecto `config` con DRF y CORS.
  - App `documental` con endpoint `GET /api/health/` para comprobar que la API responde.
  - Base de datos: por defecto SQLite; opcional PostgreSQL mediante variables de entorno.

- **Frontend React**
  - Vite + React + TypeScript.
  - Cliente Axios en `src/api/client.ts`.
  - Página que llama a `/api/health/` y muestra el resultado (conexión OK o error).

### Por qué así

- **Un solo endpoint de salud:** permite validar Django, DRF, CORS y proxy sin depender de modelos ni BD compleja.
- **Proxy en Vite:** en desarrollo el frontend usa `/api` y Vite redirige al backend (puerto 8000), evitando problemas de CORS y misma-origen.
- **SQLite por defecto:** para poder probar la Fase 1 sin instalar PostgreSQL; luego se puede cambiar con `GDOC_DB_ENGINE=postgresql`.

### Cómo probar la conexión API

1. **Backend (en una terminal)**

   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate   # Windows
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

   Debe quedar escuchando en `http://127.0.0.1:8000`.

2. **Probar solo el backend**

   - Navegador: `http://127.0.0.1:8000/api/health/`
   - Debe devolver JSON: `{"status":"ok","message":"API G-Doc operativa","version":"1.0"}`

3. **Frontend (otra terminal)**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Abrir `http://localhost:5173`. Debe mostrarse "Conexión OK" y el JSON del health.

4. **Confirmación**

   - Si ves "Conexión OK" en la página, la Fase 1 está validada y se puede pasar a la Fase 2.

### Usar PostgreSQL (opcional)

Crear la base `gdoc` en PostgreSQL y definir, por ejemplo en `backend/.env`:

```env
GDOC_DB_ENGINE=postgresql
GDOC_DB_NAME=gdoc
GDOC_DB_USER=postgres
GDOC_DB_PASSWORD=tu_password
GDOC_DB_HOST=localhost
GDOC_DB_PORT=5432
```

Cargar variables (por ejemplo con `python-dotenv` en `manage.py` o con `export`/`set`) y ejecutar de nuevo `python manage.py migrate` y `runserver`.

---

## FASE 2 – Modelo de Datos (CRUD) ✅ COMPLETADA

**Estado:** Implementada y lista para validar.

### Qué se ha construido

- **Modelo Documento** (`backend/documental/models.py`)
  - Campos: `archivo`, `fecha_emision`, `fecha_vencimiento`, `estado`, `texto_extraido`, `fecha_carga`
  - Validación de extensiones de archivo (PDF, imágenes)
  - Estados: verde 🟢, amarillo 🟡, rojo 🔴

- **API REST completa** (`backend/documental/`)
  - Serializador DRF con campos calculados (`nombre_archivo`, `url_archivo`)
  - ViewSet con CRUD completo (list, create, retrieve, update, delete)
  - Endpoints: `/api/documentos/` (GET, POST), `/api/documentos/{id}/` (GET, PATCH, PUT, DELETE)
  - Soporte para subida de archivos (multipart/form-data)

- **Frontend React**
  - Componente `DocumentoUpload`: formulario para subir documentos
  - Componente `DocumentosList`: lista con colores según estado del semáforo
  - Cliente API actualizado con funciones CRUD

- **Admin Django** (`backend/documental/admin.py`)
  - Interfaz admin para gestionar documentos

### Cómo probar

1. **Aplicar migraciones:**
   ```powershell
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Reiniciar el servidor Django** (si estaba corriendo)

3. **Probar desde el frontend:**
   - Abre http://localhost:5173
   - Sube un documento PDF o imagen
   - Verifica que aparece en la lista con estado 🟡 (amarillo por defecto)
   - Prueba eliminar un documento

4. **Probar desde Postman/Thunder Client** (opcional):
   - `GET /api/documentos/` - Lista documentos
   - `POST /api/documentos/` - Crea documento (multipart/form-data)
   - `PATCH /api/documentos/{id}/` - Actualiza estado

**Instrucciones detalladas:** Ver `docs/FASE2-VALIDACION.md`

---

## FASE 3 – Integración OCR ✅ COMPLETADA

**Estado:** Implementada. Requiere Tesseract instalado para extraer texto.

### Qué se ha construido

- **Servicio OCR** (`documental/services/ocr_service.py`): extrae texto de imágenes (PNG, JPG, etc.) y PDFs con Tesseract.
- **Integración en la subida**: al crear un documento, se ejecuta OCR y se guarda el resultado en `texto_extraido`.
- **Dependencias:** `pytesseract`, `PyMuPDF` (PDF → imágenes).
- **Configuración:** opcional `TESSERACT_CMD` en `.env` o settings (ruta a `tesseract.exe` en Windows).

### Cómo probar

1. Instalar **Tesseract** en el sistema (ver `docs/FASE3-VALIDACION.md`).
2. `pip install -r requirements.txt` y reiniciar el servidor Django.
3. Subir una imagen o PDF con texto desde el frontend.
4. Comprobar que en la lista aparece "Texto OCR:" con el contenido extraído.

**Instrucciones detalladas:** Ver `docs/FASE3-VALIDACION.md`

---

## FASE 4 – Semáforo Inteligente ✅ COMPLETADA

**Estado:** Implementada. El estado se calcula automáticamente al crear o actualizar documentos.

### Qué se ha construido

- **Servicio semáforo** (`documental/services/semaforo_service.py`): calcula el estado según reglas de negocio.
- **Integración automática**: al crear o actualizar un documento, se calcula y guarda el estado automáticamente.
- **Reglas implementadas**:
  1. 🔴 **ROJO**: Documento vencido (`fecha_vencimiento < hoy`)
  2. 🟡 **AMARILLO**: Falta texto legible (`texto_extraido` vacío o < 10 caracteres)
  3. 🟢 **VERDE**: No vencido y con texto legible

### Cómo probar

1. Sube un documento con texto desde el frontend.
2. Actualiza la fecha de vencimiento a una fecha pasada → debe cambiar a 🔴 **ROJO**.
3. Sube un documento sin texto → debe quedar en 🟡 **AMARILLO**.
4. Sube un documento válido (con texto y fecha futura) → debe quedar en 🟢 **VERDE**.

**Instrucciones detalladas:** Ver `docs/FASE4-VALIDACION.md`

---

## Próximas fases

- **Fase 5:** Visualización mejorada en React (mostrar texto OCR completo, mejor UI, filtros por estado).
