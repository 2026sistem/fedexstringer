import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { MetricCard, Badge, Spinner, EmptyState } from '../components/UI'

export default function Facturacion() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [mes, setMes] = useState(() => {
    const n = new Date()
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`
  })

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

  async function toggleCobrado(p) {
    const nuevo = p.estado === 'cobrado' ? 'entregado' : 'cobrado'
    await supabase.from('pedidos').update({ estado: nuevo }).eq('id', p.id)
    setPedidos(prev => prev.map(x => x.id === p.id ? { ...x, estado: nuevo } : x))
  }

  const [year, month] = mes.split('-').map(Number)
  const delMes = pedidos.filter(p => {
    const d = new Date(p.created_at)
    return d.getFullYear() === year && d.getMonth() + 1 === month
  })

  const cobrados = delMes.filter(p => p.estado === 'cobrado' || p.estado === 'entregado')
  const pendientes = delMes.filter(p => p.estado !== 'cobrado' && p.estado !== 'entregado' && p.precio)
  const ingresoCobrado = cobrados.reduce((a, p) => a + (p.precio || 0), 0)
  const ingresoPendiente = pendientes.reduce((a, p) => a + (p.precio || 0), 0)
  const promedio = cobrados.length > 0 ? Math.round(ingresoCobrado / cobrados.length) : 0

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <input type="month" value={mes} onChange={e => setMes(e.target.value)}
          style={{ padding: '7px 10px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', fontSize: 14, background: 'var(--surface)', color: 'var(--text)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        <MetricCard label="Ingresos cobrados" value={`$${ingresoCobrado.toLocaleString('es-AR')}`} sub={`${cobrados.length} trabajos`} color="var(--accent)" />
        <MetricCard label="Pendiente de cobro" value={`$${ingresoPendiente.toLocaleString('es-AR')}`} sub={`${pendientes.length} trabajos`} color={ingresoPendiente > 0 ? 'var(--warn)' : undefined} />
        <MetricCard label="Total del mes" value={`$${(ingresoCobrado + ingresoPendiente).toLocaleString('es-AR')}`} sub={`${delMes.length} pedidos`} />
        <MetricCard label="Promedio por trabajo" value={`$${promedio.toLocaleString('es-AR')}`} sub="solo cobrados" />
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontWeight: 500, fontSize: 14 }}>
          Detalle del mes
        </div>
        {loading ? <Spinner /> : delMes.length === 0 ? <EmptyState message="No hay pedidos en este mes." /> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Fecha', 'Cliente', 'Trabajo', 'Monto', 'Estado', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500, color: 'var(--text-2)', fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {delMes.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 14px', color: 'var(--text-2)', whiteSpace: 'nowrap' }}>{new Date(p.created_at).toLocaleDateString('es-AR')}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>{p.clientes?.nombre || '—'}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-2)' }}>{[p.cuerdas?.nombre, p.tension_kg ? `${p.tension_kg}kg` : null].filter(Boolean).join(' · ') || '—'}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>{p.precio ? `$${Number(p.precio).toLocaleString('es-AR')}` : '—'}</td>
                  <td style={{ padding: '10px 14px' }}><Badge status={p.estado} /></td>
                  <td style={{ padding: '10px 14px' }}>
                    {p.precio && (
                      <button onClick={() => toggleCobrado(p)}
                        style={{ fontSize: 12, color: p.estado === 'cobrado' ? 'var(--text-3)' : 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>
                        {p.estado === 'cobrado' ? 'Desmarcar' : 'Marcar cobrado'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
