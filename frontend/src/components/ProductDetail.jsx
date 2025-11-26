// src/components/ProductDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProductById } from '../api'
import { useCart } from '../CartContext'

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const { addToCart } = useCart()

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        setError('')
        setMessage('')
        const data = await fetchProductById(id)
        setProduct(data)
      } catch (err) {
        console.error(err)
        setError('Ошибка загрузки товара')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  function handleAddToCart() {
    if (!product) return
    addToCart(product, 1)
    setMessage('Товар добавлен в корзину')
    setTimeout(() => setMessage(''), 2000)
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Загрузка товара...</div>
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: 'red' }}>{error}</p>
        <Link to="/">← Вернуться в каталог</Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ padding: 20 }}>
        <p>Товар не найден.</p>
        <Link to="/">← Вернуться в каталог</Link>
      </div>
    )
  }

  return (
    <div style={{ padding: 20 }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: 20 }}>
        ← Назад в каталог
      </Link>

      <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 400 }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              style={{ width: '100%', borderRadius: 8 }}
            />
          ) : (
            <div
              style={{
                width: 300,
                height: 300,
                borderRadius: 8,
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#aaa',
              }}
            >
              Нет изображения
            </div>
          )}
        </div>

        <div style={{ maxWidth: 500 }}>
          <h1 style={{ marginBottom: 10 }}>{product.title}</h1>
          {product.brand && (
            <p style={{ marginBottom: 4 }}>
              <b>Бренд:</b> {product.brand}
            </p>
          )}
          {product.category && (
            <p style={{ marginBottom: 4 }}>
              <b>Категория:</b> {product.category.name}
            </p>
          )}
          <p style={{ marginBottom: 10 }}>
            <b>Цена:</b> {product.price} ₸
          </p>
          {product.color && (
            <p style={{ marginBottom: 4 }}>
              <b>Цвет:</b> {product.color}
            </p>
          )}
          {product.size && (
            <p style={{ marginBottom: 4 }}>
              <b>Размер:</b> {product.size}
            </p>
          )}
          <p style={{ marginTop: 16 }}>{product.description}</p>

          {message && (
            <p style={{ marginTop: 10, color: 'green', fontSize: 14 }}>
              {message}
            </p>
          )}

          <button
            style={{
              marginTop: 20,
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#333',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 15,
            }}
            onClick={handleAddToCart}
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
