import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listFamilies } from '../api.js'

function ConfirmDialog({ slug, name, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h3>Delete &ldquo;{name}&rdquo;?</h3>
        <p>This action cannot be undone. The model will be permanently removed.</p>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={() => onConfirm(slug)}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function ModelsDashboard({ models, loading, onDelete, onRefresh }) {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [families, setFamilies] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    listFamilies()
      .then((data) => setFamilies(data.families ?? []))
      .catch(() => setFamilies([]))
  }, [])

  const familyName = (slug) => families.find((f) => f.slug === slug)?.name ?? '—'

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return <div className="empty-state"><p>Loading models…</p></div>
  }

  return (
    <>
      <div className="dashboard-header">
        <h1>Models</h1>
        <button className="btn btn-primary" onClick={() => navigate('/models/new')}>
          + New Model
        </button>
      </div>

      {models.length === 0 ? (
        <div className="empty-state">
          <p>No models yet.</p>
          <button className="btn btn-secondary" onClick={() => navigate('/models/new')}>
            Create your first model
          </button>
        </div>
      ) : (
        <table className="papers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Family</th>
              <th>Released</th>
              <th>Slug</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.slug}>
                <td style={{ fontWeight: 500 }}>{model.name}</td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                  {familyName(model.family_slug)}
                </td>
                <td>
                  {model.released ? (
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600">Released</span>
                  ) : (
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Draft</span>
                  )}
                </td>
                <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: 13 }}>
                  {model.slug}
                </td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                  {formatDate(model.created_at)}
                </td>
                <td className="actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate(`/models/${model.slug}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-danger)' }}
                    onClick={() => setDeleteTarget(model)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {deleteTarget && (
        <ConfirmDialog
          slug={deleteTarget.slug}
          name={deleteTarget.name}
          onConfirm={(slug) => {
            onDelete(slug)
            setDeleteTarget(null)
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  )
}
