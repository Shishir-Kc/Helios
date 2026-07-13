import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function ConfirmDialog({ slug, title, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h3>Delete &ldquo;{title}&rdquo;?</h3>
        <p>This action cannot be undone. The paper will be permanently removed.</p>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={() => onConfirm(slug)}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ papers, loading, onDelete, onRefresh }) {
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
    return <div className="empty-state"><p>Loading papers…</p></div>
  }

  return (
    <>
      <div className="dashboard-header">
        <h1>Papers</h1>
        <button className="btn btn-primary" onClick={() => navigate('/papers/new')}>
          + New Paper
        </button>
      </div>

      {papers.length === 0 ? (
        <div className="empty-state">
          <p>No papers yet.</p>
          <button className="btn btn-secondary" onClick={() => navigate('/papers/new')}>
            Create your first paper
          </button>
        </div>
      ) : (
        <table className="papers-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Slug</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {papers.map((paper) => (
              <tr key={paper.slug}>
                <td style={{ fontWeight: 500 }}>{paper.title}</td>
                <td><span className="category-badge">{paper.category}</span></td>
                <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: 13 }}>
                  {paper.slug}
                </td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                  {formatDate(paper.created_at)}
                </td>
                <td className="actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate(`/papers/${paper.slug}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-danger)' }}
                    onClick={() => setDeleteTarget(paper)}
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
          title={deleteTarget.title}
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
