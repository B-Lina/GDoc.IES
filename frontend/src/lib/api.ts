/**
 * Cliente API para G-Doc Backend
 * Configurado para conectarse con el servidor Django en desarrollo y producción
 */

const getBaseURL = () => {
  const env = import.meta.env;
  
  // En desarrollo, usa el proxy configurado en vite.config.ts
  if (import.meta.env.DEV) {
    return env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  }
  
  // En producción, usa la URL configurada o la misma del servidor
  return env.VITE_API_BASE_URL || '/api';
};

interface FetchOptions extends RequestInit {
  // Adds any custom options if needed
}

export class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = getBaseURL();
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  // POST request
  async post<T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PATCH request
  async patch<T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  // Upload file (multipart/form-data)
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    options?: FetchOptions
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const formData = new FormData();
    formData.append('file', file);

    // Agregar datos adicionales si existen
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    try {
      const response = await fetch(url, {
        ...options,
        method: 'POST',
        body: formData,
        // No establecer Content-Type, fetch lo hará automáticamente
        headers: {
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Upload Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`File upload failed: ${endpoint}`, error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const apiClient = new APIClient();

// Tipos comunes para la API
export interface DocumentoResponse {
  id: number;
  numero_documento: string;
  nombre: string;
  tipo: string;
  estado: string;
  fecha_creacion: string;
  validationType?: string;
  [key: string]: any;
}

export interface DashboardStats {
  total_documentos: number;
  documentos_pendientes: number;
  documentos_validados: number;
  documentos_rechazados: number;
  [key: string]: any;
}
