import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './Papers.css'

const API = import.meta.env.VITE_API_URL ?? 'https://api.helios.shishirkhatri.com.np/api'

const CATEGORY_LABELS = {
  papers: 'Papers',
  research: 'Research',
  docs: 'Docs',
}

function DetailInner({ paper, category }) {
  return (
    <article className="paper-detail">
      <div className="paper-detail-header">
        <span className="caption paper-category-badge">{CATEGORY_LABELS[paper.category] || paper.category}</span>
        <h1 className="h2 paper-detail-title">{paper.title}</h1>
        <p className="body-small paper-detail-desc">{paper.description}</p>
        <div className="paper-detail-meta caption">
          <span>
            Published {new Date(paper.created_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </span>
          {paper.updated_at !== paper.created_at && (
            <span>
              · Updated {new Date(paper.updated_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>

      <div className="paper-detail-content markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children, ...props }) => <h1 className="h3" {...props}>{children}</h1>,
            h2: ({ children, ...props }) => <h2 className="h3" style={{ marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)' }} {...props}>{children}</h2>,
            h3: ({ children, ...props }) => <h3 style={{ marginTop: 'var(--space-8)', marginBottom: 'var(--space-3)' }} {...props}>{children}</h3>,
            p: ({ children, ...props }) => <p className="body-small" style={{ marginBottom: 'var(--space-4)', lineHeight: '1.7' }} {...props}>{children}</p>,
            ul: ({ children, ...props }) => <ul style={{ marginBottom: 'var(--space-4)', paddingLeft: 'var(--space-6)', lineHeight: '1.7' }} {...props}>{children}</ul>,
            ol: ({ children, ...props }) => <ol style={{ marginBottom: 'var(--space-4)', paddingLeft: 'var(--space-6)', lineHeight: '1.7' }} {...props}>{children}</ol>,
            li: ({ children, ...props }) => <li className="body-small" style={{ marginBottom: 'var(--space-2)' }} {...props}>{children}</li>,
            blockquote: ({ children, ...props }) => (
              <blockquote
                style={{
                  borderLeft: '4px solid var(--color-brand-blue)',
                  margin: 'var(--space-6) 0',
                  padding: 'var(--space-4) var(--space-6)',
                  backgroundColor: 'var(--color-surface-tertiary)',
                  borderRadius: '4px',
                }}
                {...props}
              >
                {children}
              </blockquote>
            ),
            code: ({ children, className, ...props }) => {
              const isInline = !className
              if (isInline) {
                return (
                  <code
                    style={{
                      backgroundColor: 'var(--color-surface-tertiary)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                )
              }
              return (
                <pre
                  style={{
                    backgroundColor: 'var(--color-near-black)',
                    color: 'var(--color-pure-white)',
                    padding: 'var(--space-6)',
                    borderRadius: '8px',
                    overflowX: 'auto',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    marginBottom: 'var(--space-6)',
                  }}
                >
                  <code {...props}>{children}</code>
                </pre>
              )
            },
            table: ({ children, ...props }) => (
              <div style={{ overflowX: 'auto', marginBottom: 'var(--space-6)' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '15px',
                  }}
                  {...props}
                >
                  {children}
                </table>
              </div>
            ),
            th: ({ children, ...props }) => (
              <th
                style={{
                  borderBottom: '2px solid var(--color-border-strong)',
                  padding: 'var(--space-3) var(--space-4)',
                  textAlign: 'left',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                {...props}
              >
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td
                style={{
                  borderBottom: '1px solid var(--color-border-subtle)',
                  padding: 'var(--space-3) var(--space-4)',
                }}
                {...props}
              >
                {children}
              </td>
            ),
            strong: ({ children, ...props }) => <strong style={{ fontWeight: 'var(--font-weight-medium)' }} {...props}>{children}</strong>,
            hr: (props) => <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)', margin: 'var(--space-10) 0' }} {...props} />,
          }}
        />
      </div>
    </article>
  )
}

export function CategoryDetail() {
  const location = useLocation()
  const category = location.pathname.split('/')[1]
  const { slug } = useParams()
  const [paper, setPaper] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API}/helios/papers/${slug}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error('Not found')
          throw new Error('Failed to fetch')
        }
        return res.json()
      })
      .then((data) => {
        setPaper(data.paper)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [slug])

  const backPath = `/${category}`

  if (loading) {
    return (
      <div className="papers-page">
        <div className="container"><p className="body-small">Loading...</p></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="papers-page">
        <div className="container">
          <p className="body-small papers-error">{error}</p>
          <Link to={backPath} className="caption" style={{ color: 'var(--color-brand-blue)', marginTop: 'var(--space-4)', display: 'inline-block' }}>
            ← Back
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="papers-page">
      <div className="paper-detail-nav">
        <div className="container">
          <Link to={backPath} className="caption" style={{ color: 'var(--color-medium-gray)' }}>
            ← Back to {CATEGORY_LABELS[category] || category}
          </Link>
        </div>
      </div>
      <section>
        <div className="container">
          <DetailInner paper={paper} category={category} />
        </div>
      </section>
    </div>
  )
}
