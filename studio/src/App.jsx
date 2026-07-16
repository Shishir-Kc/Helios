import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Navigate, useNavigate, Link, NavLink } from 'react-router-dom'
import { isAuthenticated, clearToken, listPapers, deletePaper, listModels, deleteModel, listFamilies, deleteFamily } from './api.js'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PaperForm from './pages/PaperForm.jsx'
import ModelsDashboard from './pages/ModelsDashboard.jsx'
import ModelForm from './pages/ModelForm.jsx'
import FamiliesDashboard from './pages/FamiliesDashboard.jsx'
import FamilyForm from './pages/FamilyForm.jsx'

function RequireAuth({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

function ModelsDashboardWrapper() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listModels()
      setModels(data.models)
    } catch {
      setModels([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchModels()
  }, [fetchModels])

  const handleDelete = useCallback(async (slug) => {
    try {
      await deleteModel(slug)
      setModels((prev) => prev.filter((m) => m.slug !== slug))
      setToast({ type: 'success', message: 'Model deleted' })
    } catch (err) {
      setToast({ type: 'error', message: err.message })
    }
  }, [])

  return (
    <>
      <ModelsDashboard
        models={models}
        loading={loading}
        onDelete={handleDelete}
        onRefresh={fetchModels}
      />
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  )
}

function FamiliesDashboardWrapper() {
  const [families, setFamilies] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const fetchFamiliesList = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listFamilies()
      setFamilies(data.families)
    } catch {
      setFamilies([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFamiliesList()
  }, [fetchFamiliesList])

  const handleDelete = useCallback(async (slug) => {
    try {
      await deleteFamily(slug)
      setFamilies((prev) => prev.filter((f) => f.slug !== slug))
      setToast({ type: 'success', message: 'Family deleted' })
    } catch (err) {
      setToast({ type: 'error', message: err.message })
    }
  }, [])

  return (
    <>
      <FamiliesDashboard
        families={families}
        loading={loading}
        onDelete={handleDelete}
      />
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  )
}

function Layout({ onLogout }) {
  return (
    <div className="studio-layout">
      <header className="studio-header">
        <div className="studio-header-left">
          <Link to="/" className="studio-logo">HELIOS STUDIO</Link>
          <nav className="studio-nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'studio-nav-link active' : 'studio-nav-link')}>
              Papers
            </NavLink>
            <NavLink to="/models" className={({ isActive }) => (isActive ? 'studio-nav-link active' : 'studio-nav-link')}>
              Models
            </NavLink>
            <NavLink to="/families" className={({ isActive }) => (isActive ? 'studio-nav-link active' : 'studio-nav-link')}>
              Families
            </NavLink>
          </nav>
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
          <Route path="/models" element={<ModelsDashboardWrapper />} />
          <Route path="/models/new" element={<ModelForm />} />
          <Route path="/models/:slug/edit" element={<ModelForm />} />
          <Route path="/families" element={<FamiliesDashboardWrapper />} />
          <Route path="/families/new" element={<FamilyForm />} />
          <Route path="/families/:slug/edit" element={<FamilyForm />} />
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
