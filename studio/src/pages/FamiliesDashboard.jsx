import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ConfirmDialog({ slug, name, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h3>Delete &ldquo;{name}&rdquo;?</h3>
        <p>This action cannot be undone. The family will be permanently removed.</p>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={() => onConfirm(slug)}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function FamiliesDashboard({ families, loading, onDelete }) {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const navigate = useNavigate()

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return <div className="empty-state"><p>Loading families…</p></div>
  }

  return (
    <>
      <div className="dashboard-header">
        <h1>Families</h1>
        <button className="btn btn-primary" onClick={() => navigate('/families/new')}>
          + New Family
        </button>
      </div>

      {families.length === 0 ? (
        <div className="empty-state">
          <p>No families yet.</p>
          <button className="btn btn-secondary" onClick={() => navigate('/families/new')}>
            Create your first family
          </button>
        </div>
      ) : (
        <table className="papers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {families.map((family) => (
              <tr key={family.slug}>
                <td style={{ fontWeight: 500 }}>{family.name}</td>
                <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: 13 }}>
                  {family.slug}
                </td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                  {formatDate(family.created_at)}
                </td>
                <td className="actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate(`/families/${family.slug}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-danger)' }}
                    onClick={() => setDeleteTarget(family)}
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
