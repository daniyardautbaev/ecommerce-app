// src/App.jsx
import { useEffect, useState } from 'react'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import LoginPage from './components/LoginPage'
import AdminProductsPage from './components/AdminProductsPage'
import CartPage from './components/CartPage'
import { fetchCurrentUser, getAccessToken, setAccessToken } from './api'
import { useCart } from './CartContext'

function App() {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const navigate = useNavigate()
  const { items } = useCart()

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setLoadingUser(false)
      return
    }

    async function loadUser() {
      try {
        const data = await fetchCurrentUser()
        setUser(data)
      } catch (err) {
        console.error(err)
        setAccessToken(null)
        setUser(null)
      } finally {
        setLoadingUser(false)
      }
    }

    loadUser()
  }, [])

  function handleLogout() {
    setAccessToken(null)
    setUser(null)
    navigate('/')
  }

  if (loadingUser) {
    return <div style={{ padding: 20 }}>Загрузка...</div>
  }

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 20px',
          borderBottom: '1px solid #ddd',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', gap: 15 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <b>Shop</b>
          </Link>
          {user && user.is_staff && (
            <Link to="/admin/products" style={{ textDecoration: 'none' }}>
              Админ: товары
            </Link>
          )}
          <Link to="/cart" style={{ textDecoration: 'none' }}>
            Корзина ({cartCount})
          </Link>
        </div>

        <div>
          {user ? (
            <>
              <span style={{ marginRight: 10 }}>
                Привет, {user.username} {user.is_staff && '(admin)'}
              </span>
              <button onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <Link to="/login">Войти</Link>
          )}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={setUser} />} />
        <Route path="/admin/products" element={<AdminProductsPage user={user} />} />
        <Route path="/cart" element={<CartPage user={user} />} />
      </Routes>
    </div>
  )
}

export default App
