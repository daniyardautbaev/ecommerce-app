// src/components/AdminProductsPage.jsx
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { createProduct, fetchProducts } from '../api'

function AdminProductsPage({ user }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    brand: '',
    color: '',
    size: '',
    category_id: '',
  })
  const [creating, setCreating] = useState(false)

  // защита маршрута
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (!user.is_staff) {
    return <div style={{ padding: 20 }}>Нет доступа (требуется admin).</div>
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (err) {
      console.error(err)
      setError('Ошибка загрузки списка товаров')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    setError('')

    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        brand: form.brand || '',
        color: form.color || '',
        size: form.size || '',
        category_id: form.category_id ? Number(form.category_id) : null,
      }

      await createProduct(payload)
      setForm({
        title: '',
        description: '',
        price: '',
        brand: '',
        color: '',
        size: '',
        category_id: '',
      })
      await loadProducts()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Ошибка при создании товара')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Админ-панель: товары</h2>

      {/* Форма создания товара */}
      <div
        style={{
          border: '1px solid #ddd',
          padding: 16,
          borderRadius: 8,
          marginBottom: 20,
          maxWidth: 500,
        }}
      >
        <h3>Добавить новый товар</h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="text"
            name="title"
            placeholder="Название"
            value={form.title}
            onChange={handleChange}
            required
            style={{ padding: 8 }}
          />
          <textarea
            name="description"
            placeholder="Описание"
            value={form.description}
            onChange={handleChange}
            rows={3}
            style={{ padding: 8 }}
          />
          <input
            type="number"
            step="0.01"
            name="price"
            placeholder="Цена"
            value={form.price}
            onChange={handleChange}
            required
            style={{ padding: 8 }}
          />
          <input
            type="text"
            name="brand"
            placeholder="Бренд"
            value={form.brand}
            onChange={handleChange}
            style={{ padding: 8 }}
          />
          <input
            type="text"
            name="color"
            placeholder="Цвет"
            value={form.color}
            onChange={handleChange}
            style={{ padding: 8 }}
          />
          <input
            type="text"
            name="size"
            placeholder="Размер"
            value={form.size}
            onChange={handleChange}
            style={{ padding: 8 }}
          />
          <input
            type="number"
            name="category_id"
            placeholder="ID категории (из Django admin)"
            value={form.category_id}
            onChange={handleChange}
            style={{ padding: 8 }}
          />

          {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}

          <button
            type="submit"
            disabled={creating}
            style={{ padding: 8, marginTop: 8 }}
          >
            {creating ? 'Создание...' : 'Создать товар'}
          </button>
        </form>
      </div>

      {/* Список товаров */}
      <h3>Все товары</h3>
      {loading ? (
        <div>Загрузка списка...</div>
      ) : products.length === 0 ? (
        <div>Товаров пока нет.</div>
      ) : (
        <ul>
          {products.map(p => (
            <li key={p.id}>
              #{p.id} – {p.title} ({p.price} ₸)
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AdminProductsPage
