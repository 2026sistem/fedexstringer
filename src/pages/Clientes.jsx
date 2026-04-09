import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { Card, Btn, Input, Spinner, EmptyState } from '../components/UI'

function empty() {
  return { nombre: '', telefono: '', email: '', direccion: '', notas: '' }
}

function Avatar({ nombre }) {
  const colors = ['#e8f0eb','#eaf2fb','#faeeda','#fbeaf0','#eeedfe']
  const text = ['#1a472a','#1a5276','#854F0B','#72243E','#3C3489']
  const idx = nombre.charCodeAt(0) % 5
  const initials = nombre.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()
  return (
    <div style={{
      width:38,height:38,borderRadius:'50%',
      background:colors[idx],color:text[idx],
      display:'flex',alignItems:'center',justifyContent:'center',
      fontSize:13,fontWeight:600,flexShrink:0
    }}>{initials}</div>
  )
}

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty())
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [counts, setCounts] = useState({})

  async function load() {
    const [{ data: cl }, { data: ped }] = await Promise.all([
      supabase.from('clientes').select('*').order('nombre'),
      supabase.from('pedidos').select('cliente_id'),
    ])
    setClientes(cl || [])
    const c = {}
    for (const p of ped || []) c[p.cliente_id] = (c[p.cliente_id] || 0) + 1
    setCounts(c)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    if (!form.nombre) return alert('El nombre es obligatorio')
    setSaving(true)
    if (editId) {
      await supabase.from('clientes').update(form).eq('id', editId)
    } else {
      await supabase.from('clientes').insert(form)
    }
    setSaving(false)
    setShowForm(false)
    setEditId(null)
    setForm(empty())
    load()
  }

  async function del(id) {
    if (!confirm('¿Eliminar este cliente?')) return
    await supabase.from('clientes').delete().eq('id', id)
    load()
  }

  function edit(c) {
    setForm({
      nombre: c.nombre || '',
      telefono: c.telefono || '',
      email: c.email || '',
      direccion: c.direccion || '',
      notas: c.notas || '',
    })
    setEditId(c.id)
    setShowForm(true)
  }

  const filtered = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.telefono || '').includes(search) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const inputStyle = {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid var(--border-strong)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14,
    background: 'var(--surface)',
    color: 'var(--text)',
  }

  return (
    <div>
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar cliente..."
          style={inputStyle}
        />
        <Btn variant="primary" onClick={() => {
          setForm(empty()); setEditId(null); setShowForm(true)
        }}>+ Agregar cliente</Btn>
      </div>

      {showForm && (
        <Card style={{ marginBottom:20 }}>
          <div style={{ fontWeight:500, marginBottom:16 }}>
            {editId ? 'Editar cliente' : 'Nuevo cliente'}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Input label="Nombre *" value={form.nombre}
              onChange={v => set('nombre', v)} placeholder="Juan Pérez" required />
            <Input label="Teléfono" value={form.telefono}
              onChange={v => set('telefono', v)} placeholder="11 5555-1234" />
            <Input label="Email" type="email" value={form.email}
              onChange={v => set('email', v)} placeholder="juan@email.com" />
            <Input label="Zona / Dirección" value={form.direccion}
              onChange={v => set('direccion', v)} placeholder="Palermo, CABA" />
            <div style={{ gridColumn:'1/-1' }}>
              <Input label="Notas" value={form.notas}
                onChange={v => set('notas', v)}
                placeholder="ej: prefiere cuerdas suaves..." />
            </div>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:14 }}>
            <Btn variant="primary" onClick={save} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Btn>
            <Btn onClick={() => { setShowForm(false); setEditId(null) }}>
              Cancelar
            </Btn>
          </div>
        </Card>
      )}

      <Card style={{ padding:0, overflow:'hidden' }}>
        {loading ? <Spinner /> : filtered.length === 0
          ? <EmptyState message="No se encontraron clientes." />
          : (
          <div>
            {filtered.map((c, i) => (
              <div key={c.id}
                style={{
                  display:'flex', alignItems:'center', gap:14,
                  padding:'14px 20px',
                  borderBottom: i < filtered.length-1
                    ? '1px solid var(--border)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background='var(--bg)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <Avatar nombre={c.nombre} />
                <div style
