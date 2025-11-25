// src/components/ProductList.jsx
import { useEffect, useState } from 'react'
import { fetchProducts } from '../api'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    color: '',
    size: '',
  })

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadProducts(customFilters = {}) {
    setLoading(true)
    setError('')
    try {
      const data = await fetchProducts(customFilters)
      setProducts(data)
    } catch (err) {
      console.error(err)
      setError('Ошибка загрузки товаров')
    } finally {
      setLoading(false)
    }
  }

  function handleFilterChange(e) {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  function handleApplyFilters() {
    const params = {}
    if (filters.search) params.search = filters.search
    if (filters.brand) params.brand = filters.brand
    if (filters.color) params.color = filters.color
    if (filters.size) params.size = filters.size

    loadProducts(params)
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Загрузка товаров...</div>
  }

  if (error) {
    return <div style={{ padding: 20, color: 'red' }}>{error}</div>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Каталог товаров</h1>

      {/* Панель фильтров */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          name="search"
          placeholder="Поиск (название, описание, бренд...)"
          value={filters.search}
          onChange={handleFilterChange}
          style={{ padding: 8, minWidth: 220 }}
        />
        <input
          type="text"
          name="brand"
          placeholder="Бренд (Nike, Adidas...)"
          value={filters.brand}
          onChange={handleFilterChange}
          style={{ padding: 8, minWidth: 150 }}
        />
        <input
          type="text"
          name="color"
          placeholder="Цвет (white, black...)"
          value={filters.color}
          onChange={handleFilterChange}
          style={{ padding: 8, minWidth: 120 }}
        />
        <input
          type="text"
          name="size"
          placeholder="Размер (M, L, 42...)"
          value={filters.size}
          onChange={handleFilterChange}
          style={{ padding: 8, minWidth: 120 }}
        />
        <button
          onClick={handleApplyFilters}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            borderRadius: 6,
            border: '1px solid #333',
            background: '#333',
            color: '#fff',
          }}
        >
          Применить фильтры
        </button>
      </div>

      {/* Список товаров */}
      {products.length === 0 ? (
        <div>Товары не найдены.</div>
      ) : (
        <div
          style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          {products.map(p => (
            <div
              key={p.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 16,
                width: 220,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  style={{ width: '100%', height: 150, objectFit: 'cover', marginBottom: 8 }}
                />
              )}
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>{p.title}</h3>
              <p style={{ fontSize: 13, minHeight: 40, color: '#555' }}>
                {p.description}
              </p>
              <p style={{ fontWeight: 'bold', marginTop: 8 }}>{p.price} ₸</p>
              <p style={{ fontSize: 12, color: '#777' }}>
                {p.brand && <>Бренд: {p.brand}<br /></>}
                {p.color && <>Цвет: {p.color}<br /></>}
                {p.size && <>Размер: {p.size}</>}
              </p>
              {p.category && (
                <p style={{ fontSize: 12, color: '#999', marginTop: 6 }}>
                  Категория: {p.category.name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductList

{products.map(p => (
  <div
    key={p.id}
    style={{
      border: '1px solid #ddd',
      borderRadius: 8,
      padding: 16,
      width: 220,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    }}
  >
    <Link
      to={`/product/${p.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <h3 style={{ fontSize: 16, marginBottom: 8 }}>{p.title}</h3>
    </Link>
    <p style={{ fontSize: 13, minHeight: 40, color: '#555' }}>
      {p.description}
    </p>
    <p style={{ fontWeight: 'bold', marginTop: 8 }}>{p.price} ₸</p>
    {/* остальное как было */}
    <Link
      to={`/product/${p.id}`}
      style={{
        display: 'inline-block',
        marginTop: 10,
        fontSize: 13,
        color: '#0077ff',
      }}
    >
      Подробнее →
    </Link>
  </div>
))}