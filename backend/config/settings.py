"""
Django settings for G-Doc (sistema de gestión documental).
Desarrollo: SQLite por defecto. Producción: PostgreSQL vía variables de entorno.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Cargar .env si existe (python-dotenv)
try:
    from dotenv import load_dotenv
    load_dotenv(BASE_DIR / '.env')
except ImportError:
    pass

SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-cambiar-en-produccion-gdoc-mvp'
)

DEBUG = os.environ.get('DJANGO_DEBUG', 'True').lower() in ('true', '1', 'yes')

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third party
    'rest_framework',
    'corsheaders',
    # Local
    'documental',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Base de datos: PostgreSQL si GDOC_DB_ENGINE=postgresql, si no SQLite (desarrollo)
db_engine = os.environ.get('GDOC_DB_ENGINE', 'sqlite')
if db_engine == 'postgresql':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('GDOC_DB_NAME', 'gdoc'),
            'USER': os.environ.get('GDOC_DB_USER', 'postgres'),
            'PASSWORD': os.environ.get('GDOC_DB_PASSWORD', ''),
            'HOST': os.environ.get('GDOC_DB_HOST', 'localhost'),
            'PORT': os.environ.get('GDOC_DB_PORT', '5432'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'es'
TIME_ZONE = 'America/Argentina/Buenos_Aires'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Media (archivos subidos)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # MVP; luego restringir
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# CORS: permitir frontend en desarrollo
CORS_ALLOWED_ORIGINS = os.environ.get(
    'CORS_ORIGINS',
    'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000'
).split(',')
# Alternativa para desarrollo: permitir todo (solo desarrollo)
if DEBUG and os.environ.get('CORS_ALLOW_ALL', 'true').lower() in ('true', '1'):
    CORS_ALLOW_ALL_ORIGINS = True

# OCR (Fase 3): ruta a Tesseract. En Windows suele ser necesario.
# Ejemplo: TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe
TESSERACT_CMD = os.environ.get('TESSERACT_CMD', '')
