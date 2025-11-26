// src/components/CartPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../CartContext'
import { createOrderFromCart } from '../api'

function CartPage({ user }) {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleCheckout() {
    setError('')
    setSuccess('')

    if (!user) {
      setError('Чтобы оформить заказ, нужно войти в аккаунт')
      navigate('/login')
      return
    }

    if (items.length === 0) {
      setError('Корзина пустая')
      return
    }

    try {
      setLoading(true)
      const order = await createOrderFromCart(items)
      clearCart()
      setSuccess(`Заказ #${order.id} успешно оформлен!`)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Ошибка при оформлении заказа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Корзина</h2>

      {items.length === 0 && (
        <div>
          Корзина пустая. <Link to="/">Перейти в каталог</Link>
        </div>
      )}

      {items.length > 0 && (
        <>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>Товар</th>
                <th style={{ borderBottom: '1px solid #ddd' }}>Цена</th>
                <th style={{ borderBottom: '1px solid #ddd' }}>Кол-во</th>
                <th style={{ borderBottom: '1px solid #ddd' }}>Сумма</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.product.id}>
                  <td style={{ padding: '8px 4px' }}>
                    <Link to={`/product/${item.product.id}`}>
                      {item.product.title}
                    </Link>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {item.product.price} ₸
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e =>
                        updateQuantity(
                          item.product.id,
                          Number(e.target.value) || 1
                        )
                      }
                      style={{ width: 60 }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {Number(item.product.price) * item.quantity} ₸
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => removeFromCart(item.product.id)}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginBottom: 10 }}>
            <b>Итого: {totalPrice} ₸</b>
          </div>

          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}

          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{ padding: '8px 16px' }}
          >
            {loading ? 'Оформление...' : 'Оформить заказ'}
          </button>
        </>
      )}
    </div>
  )
}

export default CartPage
