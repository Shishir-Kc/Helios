import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken, verifyKey } from '../api.js'

export default function Login() {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const trimmed = key.trim()
    if (!trimmed) {
      setError('API key is required')
      return
    }

    setLoading(true)

    try {
      const valid = await verifyKey(trimmed)

      if (!valid) {
        setError('Back off — you are not part of Kartabya.')
        return
      }

      setToken(trimmed)
      navigate('/')
    } catch {
      setError('Could not reach the server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Helios Studio</h1>
        <p>Enter your admin API key to manage content.</p>

        <div className="form-group">
          <label htmlFor="key">API Key</label>
          <input
            id="key"
            className={`input ${error ? 'input-error' : ''}`}
            type="password"
            placeholder="Paste your admin API key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoFocus
          />
          {error && <div className="field-error">{error}</div>}
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Verifying…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
