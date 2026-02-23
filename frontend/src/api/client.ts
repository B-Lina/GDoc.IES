/**
 * Cliente HTTP para la API G-Doc.
 * Base URL con proxy en dev (Vite) apunta a /api -> backend 8000.
 */
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Cliente para subida de archivos (multipart/form-data)
export const apiClientMultipart = axios.create({
  baseURL,
  timeout: 30000, // Más tiempo para subir archivos
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

export interface HealthResponse {
  status: string
  message: string
  version?: string
}

export interface Documento {
  id: number
  archivo: string
  nombre_archivo: string
  url_archivo: string
  fecha_emision: string | null
  fecha_vencimiento: string | null
  estado: 'verde' | 'amarillo' | 'rojo'
  texto_extraido: string | null
  numero_documento_usuario: string | null
  fecha_carga: string
}

export interface DocumentoCreate {
  archivo: File
  fecha_emision?: string
  fecha_vencimiento?: string
  numero_documento_usuario?: string
  estado?: 'verde' | 'amarillo' | 'rojo'
}

export interface DocumentoUpdate {
  fecha_emision?: string
  fecha_vencimiento?: string
  estado?: 'verde' | 'amarillo' | 'rojo'
  texto_extraido?: string
}

// Health check
export async function getHealth(): Promise<HealthResponse> {
  const { data } = await apiClient.get<HealthResponse>('/health/')
  return data
}

// La API con paginación devuelve { count, next, previous, results }
interface DocumentosPaginatedResponse {
  count?: number
  next?: string | null
  previous?: string | null
  results: Documento[]
}

// CRUD Documentos
export async function getDocumentos(): Promise<Documento[]> {
  const { data } = await apiClient.get<DocumentosPaginatedResponse | Documento[]>('/documentos/')
  // Si la respuesta es paginada (DRF por defecto), usar results
  if (data && typeof data === 'object' && 'results' in data && Array.isArray((data as DocumentosPaginatedResponse).results)) {
    return (data as DocumentosPaginatedResponse).results
  }
  return Array.isArray(data) ? data : []
}

export async function getDocumento(id: number): Promise<Documento> {
  const { data } = await apiClient.get<Documento>(`/documentos/${id}/`)
  return data
}

export async function createDocumento(formData: FormData): Promise<Documento> {
  const { data } = await apiClientMultipart.post<Documento>('/documentos/', formData)
  return data
}

export async function updateDocumento(id: number, updates: DocumentoUpdate): Promise<Documento> {
  const { data } = await apiClient.patch<Documento>(`/documentos/${id}/`, updates)
  return data
}

export async function deleteDocumento(id: number): Promise<void> {
  await apiClient.delete(`/documentos/${id}/`)
}
