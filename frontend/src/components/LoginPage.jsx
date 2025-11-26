// src/components/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, setAccessToken, fetchCurrentUser } from '../api'

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const tokens = await login(username, password)
      setAccessToken(tokens.access)
      const me = await fetchCurrentUser()
      onLoginSuccess(me)
      navigate('/')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{ padding: 8 }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: 8 }}
        />
        {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: 8, marginTop: 10 }}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage
