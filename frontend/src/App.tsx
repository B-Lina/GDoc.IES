import { useEffect, useState } from 'react'
import { getHealth, type HealthResponse } from './api/client'
import { DocumentoUpload } from './components/DocumentoUpload'
import { DocumentosList } from './components/DocumentosList'

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch((e) => setError(e.message || 'Error al conectar con la API'))
      .finally(() => setLoading(false))
  }, [])

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1>G-Doc – MVP</h1>
      <p style={{ color: '#666' }}>Sistema de gestión documental con OCR y semáforo de validación</p>

      {/* Health check */}
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: 8 }}>
        <h2>Estado del Sistema</h2>
        {loading && <p>Comprobando conexión...</p>}
        {error && (
          <p style={{ color: 'crimson' }}>
            Error: {error}. Asegúrate de que el backend Django esté en marcha en el puerto 8000.
          </p>
        )}
        {health && (
          <div style={{ background: '#e8f5e9', padding: '1rem', borderRadius: 8 }}>
            <strong>✓ Conexión OK</strong>
            <pre style={{ margin: '0.5rem 0 0', fontSize: 14 }}>
              {JSON.stringify(health, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* FASE 2: CRUD Documentos - siempre visible para que no quede pantalla vacía */}
      <div style={{ marginBottom: '2rem' }}>
        <DocumentoUpload onUploadSuccess={handleRefresh} />
      </div>
      <div>
        <DocumentosList key={refreshKey} onRefresh={handleRefresh} />
      </div>
    </div>
  )
}

export default App
