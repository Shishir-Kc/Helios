import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import { isAuthenticated, clearToken, listPapers, deletePaper } from './api.js'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PaperForm from './pages/PaperForm.jsx'

function RequireAuth({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

function Layout({ onLogout }) {
  return (
    <div className="studio-layout">
      <header className="studio-header">
        <div className="studio-header-left">
          <Link to="/" className="studio-logo">HELIOS STUDIO</Link>
        </div>
        <div className="studio-header-right">
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>Log out</button>
        </div>
      </header>
      <main className="studio-main">
        <Routes>
          <Route path="/" element={<DashboardWrapper />} />
          <Route path="/papers/new" element={<PaperForm />} />
          <Route path="/papers/:slug/edit" element={<PaperForm />} />
        </Routes>
      </main>
    </div>
  )
}

function DashboardWrapper() {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const fetchPapers = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listPapers()
      setPapers(data.papers)
    } catch {
      setPapers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPapers()
  }, [fetchPapers])

  const handleDelete = useCallback(async (slug) => {
    try {
      await deletePaper(slug)
      setPapers((prev) => prev.filter((p) => p.slug !== slug))
      setToast({ type: 'success', message: 'Paper deleted' })
    } catch (err) {
      setToast({ type: 'error', message: err.message })
    }
  }, [])

  return (
    <>
      <Dashboard
        papers={papers}
        loading={loading}
        onDelete={handleDelete}
        onRefresh={fetchPapers}
      />
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  )
}

function App() {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearToken()
    navigate('/login')
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Layout onLogout={handleLogout} />
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default App
