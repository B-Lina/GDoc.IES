import { useEffect, useState } from 'react'
import { getDocumentos, deleteDocumento, type Documento } from '../api/client'

interface DocumentosListProps {
  onRefresh: () => void
}

export function DocumentosList({ onRefresh }: DocumentosListProps) {
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDocumentos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDocumentos()
      setDocumentos(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e.message || 'Error al cargar documentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocumentos()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este documento?')) return
    try {
      await deleteDocumento(id)
      await loadDocumentos()
      onRefresh()
    } catch (e: any) {
      alert('Error al eliminar: ' + (e.message || 'Error desconocido'))
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'verde': return '#4caf50'
      case 'amarillo': return '#ffc107'
      case 'rojo': return '#f44336'
      default: return '#999'
    }
  }

  const getEstadoEmoji = (estado: string) => {
    switch (estado) {
      case 'verde': return '🟢'
      case 'amarillo': return '🟡'
      case 'rojo': return '🔴'
      default: return '⚪'
    }
  }

  const list = Array.isArray(documentos) ? documentos : []

  if (loading) return <p>Cargando documentos...</p>
  if (error) return <p style={{ color: 'crimson' }}>Error: {error}</p>

  return (
    <div>
      <h2>Lista de Documentos ({list.length})</h2>
      {list.length === 0 ? (
        <p style={{ color: '#666' }}>No hay documentos aún. Sube uno para comenzar.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {list.map((doc) => (
            <div
              key={doc.id}
              style={{
                border: `2px solid ${getEstadoColor(doc.estado)}`,
                borderRadius: 8,
                padding: '1rem',
                background: '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2em' }}>{getEstadoEmoji(doc.estado)}</span>
                    <strong>{doc.nombre_archivo}</strong>
                    <span
                      style={{
                        background: getEstadoColor(doc.estado),
                        color: 'white',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 4,
                        fontSize: '0.85em',
                      }}
                    >
                      {doc.estado}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#666', marginTop: '0.5rem' }}>
                    <div>ID: {doc.id}</div>
                    {doc.fecha_emision && <div>Emisión: {new Date(doc.fecha_emision).toLocaleDateString('es-AR')}</div>}
                    {doc.fecha_vencimiento && (
                      <div>Vencimiento: {new Date(doc.fecha_vencimiento).toLocaleDateString('es-AR')}</div>
                    )}
                    <div>Carga: {new Date(doc.fecha_carga).toLocaleString('es-AR')}</div>
                    {doc.texto_extraido && (
                      <div style={{ marginTop: '0.5rem', maxHeight: 100, overflow: 'auto', fontSize: '0.85em' }}>
                        <strong>Texto OCR:</strong> {doc.texto_extraido.substring(0, 200)}
                        {doc.texto_extraido.length > 200 && '...'}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  style={{
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
