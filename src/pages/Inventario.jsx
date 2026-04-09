import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { Card, Btn, Input, Select, Spinner, EmptyState } from '../components/UI'

const TIPOS = ['Policéster', 'Multifilamento', 'Nylon', 'Kevlar', 'Natural', 'Híbrido'].map(t => ({ value: t, label: t }))
const CALIBRES = ['1.15', '1.18', '1.20', '1.23', '1.25', '1.27', '1.30', '1.35'].map(c => ({ value: c, label: c + ' mm' }))

function empty() { return { nombre: '', marca: '', tipo: '', calibre: '', precio_set: '', stock: '', stock_minimo: '3' } }

function StockBar({ stock, min }) {
  const pct = Math.min(100, (stock / Math.max(min * 3, 1)) * 100)
  const color = stock <= 0 ? '#c0392b' : stock <= min ? '#b7600a' : '#1a472a'
  return (
    <div style={{ width: 80, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginTop: 4 }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2 }} />
    </div>
  )
}

export default function Inventario() {
  const [cuerdas, setCuerdas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty())
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)

  async function load() {
    const { data } = await supabase.from('cuerdas').select('*').order('nombre')
    setCuerdas(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    if (!form.nombre) return alert('El nombre es obligatorio')
    setSaving(true)
    const data = { ...form, precio_set: form.precio_set ? Number(form.precio_set) : null, stock: Number(form.stock) || 0, stock_minimo: Number(form.stock_minimo) || 3 }
    if (editId) {
      await supabase.from('cuerdas').update(data).eq('id', editId)
    } else {
      await supabase.from('cuerdas').insert(data)
    }
    setSaving(false)
    setShowForm(false)
    setEditId(null)
    setForm(empty())
    load()
  }

  async function del(id) {
    if (!confirm('¿Eliminar esta cuerda?')) return
    await supabase.from('cuerdas').delete().eq('id', id)
    load()
  }

  async function ajustarStock(id, delta) {
    const c = cuerdas.find(c => c.id === id)
    const nuevo = Math.max(0, (c.stock || 0) + delta)
    await supabase.from('cuerdas').update({ stock: nuevo }).eq('id', id)
    load()
  }

  function edit(c) {
    setForm({ nombre: c.nombre || '', marca: c.marca || '', tipo: c.tipo || '', calibre: c.calibre || '', precio_set: c.precio_set || '', stock: c.stock || '', stock_minimo: c.stock_minimo || '3' })
    setEditId(c.id)
    setShowForm(true)
  }

  const bajoStock = cuerdas.filter(c => (c.stock || 0) <= (c.stock_minimo || 3))
  const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        {bajoStock.length > 0 ? (
          <div style={{ background: 'var(--warn-light)', color: 'var(--warn)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500 }}>
            ⚠ {bajoStock.length} {bajoStock.length === 1 ? 'cuerda con stock bajo' : 'cuerdas con stock bajo'}
          </div>
        ) : <div />}
        <Btn variant="primary" onClick={() => { setForm(empty()); setEditId(null); setShowForm(true) }}>+ Agregar cuerda</Bt
