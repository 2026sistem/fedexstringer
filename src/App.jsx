import { useState } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import Pedidos from './pages/Pedidos.jsx'
import Clientes from './pages/Clientes.jsx'
import Inventario from './pages/Inventario.jsx'
import Historial from './pages/Historial.jsx'
import Facturacion from './pages/Facturacion.jsx'

const NAV = [
  { id: 'dashboard', label: 'Inicio', icon: '⊞' },
  { id: 'pedidos', label: 'Pedidos', icon: '◎' },
  { id: 'clientes', label: 'Clientes', icon: '◉' },
  { id: 'inventario', label: 'Inventario', icon: '▦' },
  { id: 'historial', label: 'Historial', icon: '☰' },
  { id: 'facturacion', label: 'Facturación', icon: '$' },
]

const PAGES = { dashboard: Dashboard, pedidos: Pedidos, clientes: Clientes, inventario: Inventario, historial: Historial, facturacion: Facturacion }

export default function App() {
  const [page, setPage] = useState('dashboard')
  const Page = PAGES[page]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: 220, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50,
      }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--accent)', letterSpacing: '-0.3px' }}>🎾 StringPro</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Gestión de encordados</div>
        </div>
        <nav style={{ padding: '10px 10px', flex: 1 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px',
                borderRadius: 'var(--radius-sm)', marginBottom: 2, fontSize: 14, fontWeight: page === n.id ? 500 : 400,
                background: page === n.id ? 'var(--accent-light)' : 'transparent',
                color: page === n.id ? 'var(--accent)' : 'var(--text-2)',
              }}
            >
              <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-3)' }}>
          Fedexstringer · Plan gratuito
        </div>
      </aside>
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{
          background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          padding: '12px 24px', position: 'sticky', top: 0, zIndex: 30,
        }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>
            {NAV.find(n => n.id === page)?.label}
          </div>
        </header>
        <main style={{ flex: 1, padding: '24px', maxWidth: 1100, width: '100%' }}>
          <Page navigate={setPage} />
        </main>
      </div>
    </div>
  )
}
