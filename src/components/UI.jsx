export function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '20px', ...style
    }}>
      {children}
    </div>
  )
}

export function Badge({ status }) {
  const map = {
    pendiente: { bg: 'var(--warn-light)', color: 'var(--warn)', label: 'Pendiente' },
    en_proceso: { bg: 'var(--info-light)', color: 'var(--info)', label: 'En proceso' },
    listo: { bg: 'var(--accent-light)', color: 'var(--accent)', label: 'Listo' },
    entregado: { bg: '#f0f0f0', color: '#555', label: 'Entregado' },
    cobrado: { bg: 'var(--accent-light)', color: 'var(--accent)', label: 'Cobrado' },
  }
  const s = map[status] || map.pendiente
  return (
    <span style={{
      display: 'inline-block', padding: '2px 9px', borderRadius: 20,
      fontSize: 12, fontWeight: 500, background: s.bg, color: s.color
    }}>{s.label}</span>
  )
}

export function Btn({ children, onClick, variant = 'default', style, disabled }) {
  const styles = {
    default: { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border-strong)' },
    primary: { background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' },
    danger: { background: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid #f5c6c2' },
  }
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 500,
        opacity: disabled ? 0.5 : 1, transition: 'opacity 0.1s', ...styles[variant], ...style
      }}
    >{children}</button>
  )
}

export function Input({ label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>{label}{required && ' *'}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          padding: '8px 10px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)',
          fontSize: 14, color: 'var(--text)', background: 'var(--surface)', transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      />
    </div>
  )
}

export function Select({ label, value, onChange, options, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>{label}{required && ' *'}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          padding: '8px 10px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)',
          fontSize: 14, color: 'var(--text)', background: 'var(--surface)', appearance: 'auto',
        }}
      >
        <option value="">Seleccionar...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export function MetricCard({ label, value, sub, color }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px' }}>
      <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color: color || 'var(--text)', lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

export function EmptyState({ message }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-3)' }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>🎾</div>
      <div style={{ fontSize: 14 }}>{message}</div>
    </div>
  )
}

export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <div style={{
        width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)',
        borderRadius: '50%', animation: 'spin 0.7s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
