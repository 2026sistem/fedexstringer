import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { Card, Badge, Spinner, EmptyState } from '../components/UI'

export default function Historial() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('pedidos')
        .select('*, clientes(nombre), cuerdas(nombre)')
        .order('created_at', { ascending: false })
      setPedidos(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = pedidos.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      (p.clientes?.nombre || '').toLowerCase().includes(q) ||
      (p.cuerdas?.nombre || '').toLowerCase().includes(q) ||
      (p.marca_raqueta || '').toLowerCase().includes(q) ||
      (p.modelo_raqueta || '').toLowerCase().includes(q)
    const matchEstado = !filtroEstado || p.estado === filtroEstado
    return matchSearch && matchEstado
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por cliente, cuerda o raqueta..."
          style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', fontSize: 14, background: 'var(--surface)', color: 'var(--text)' }} />
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
          style={{ padding: '8px 10px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', fontSize: 14, background: 'var(--surface)', color: 'var(--text)' }}>
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En proceso</option>
          <option value="listo">Listo</option>
          <option value="entregado">Entregado</option>
        </select>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <Spinner /> : filtered.length === 0 ? <EmptyState message="No se encontraron registros." /> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Fecha', 'Cliente', 'Raqueta', 'Cuerda', 'Tensión', 'Precio', 'Estado', 'Notas'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500, color: 'var(--text-2)', fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 14px', color: 'var(--text-2)', whiteSpace: 'nowrap' }}>
                    {new Date(p.created_at).toLocaleDateString('es-AR')}
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>{p.clientes?.nombre || '—'}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-2)' }}>{p.marca_raqueta} {p.modelo_raqueta}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-2)' }}>{p.cuerdas?.nombre || '—'}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-2)' }}>{p.tension_kg ? `${p.tension_kg} kg` : '—'}</td>
                  <td style={{ padding: '10px 14px' }}>{p.precio ? `$${Number(p.precio).toLocaleString('es-AR')}` : '—'}</td>
                  <td style={{ padding: '10px 14px' }}><Badge status={p.estado} /></td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-3)', fontStyle: p.notas ? 'italic' : 'normal', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.notas || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
