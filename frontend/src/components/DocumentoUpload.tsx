import { useState } from 'react'
import { createDocumento } from '../api/client'

interface DocumentoUploadProps {
  onUploadSuccess: () => void
}

export function DocumentoUpload({ onUploadSuccess }: DocumentoUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fechaEmision, setFechaEmision] = useState('')
  const [fechaVencimiento, setFechaVencimiento] = useState('')
  const [numeroDocumento, setNumeroDocumento] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Debes seleccionar un archivo')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const formData = new FormData()
      formData.append('archivo', file)
      if (fechaEmision) formData.append('fecha_emision', fechaEmision)
      if (fechaVencimiento) formData.append('fecha_vencimiento', fechaVencimiento)
      if (numeroDocumento) formData.append('numero_documento_usuario', numeroDocumento.trim())

      await createDocumento(formData)
      setSuccess(true)
      setFile(null)
      setFechaEmision('')
      setFechaVencimiento('')
      setNumeroDocumento('')
      
      // Resetear el input file
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      onUploadSuccess()
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000)
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || 'Error al subir documento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1.5rem', background: '#fff' }}>
      <h2>Subir Documento</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="file-input" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Archivo (PDF o imagen):
          </label>
          <input
            id="file-input"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
          {file && <p style={{ fontSize: '0.9em', color: '#666', marginTop: '0.25rem' }}>Seleccionado: {file.name}</p>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="fecha-emision" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Fecha de emisión (opcional):
          </label>
          <input
            id="fecha-emision"
            type="date"
            value={fechaEmision}
            onChange={(e) => setFechaEmision(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="fecha-vencimiento" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Fecha de vencimiento (opcional):
          </label>
          <input
            id="fecha-vencimiento"
            type="date"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="numero-documento" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Número de documento (opcional - para validación):
          </label>
          <input
            id="numero-documento"
            type="text"
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
            placeholder="Ej: 12345678"
            style={{ width: '100%', padding: '0.5rem' }}
          />
          <p style={{ fontSize: '0.85em', color: '#666', marginTop: '0.25rem' }}>
            Se verificará que este número aparezca en el documento escaneado
          </p>
        </div>

        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: 4, marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: 4, marginBottom: '1rem' }}>
            ✓ Documento subido correctamente
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !file}
          style={{
            background: loading ? '#ccc' : '#2196f3',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: 4,
            cursor: loading || !file ? 'not-allowed' : 'pointer',
            fontSize: '1em',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Subiendo...' : 'Subir Documento'}
        </button>
      </form>
    </div>
  )
}
