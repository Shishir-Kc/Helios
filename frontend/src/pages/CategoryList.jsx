import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Papers.css'

const API = import.meta.env.VITE_API_URL ?? '/api'

const CATEGORY_META = {
  papers: {
    label: 'Papers',
    eyebrow: 'Research',
    description: 'Technical write-ups, benchmarks, and reflections on the Helios project.',
  },
  research: {
    label: 'Research',
    eyebrow: 'Research',
    description: 'Experiments, findings, and methodologies from the Helios research lab.',
  },
  docs: {
    label: 'Docs',
    eyebrow: 'Documentation',
    description: 'Guides, references, and tutorials for using Helios models and tools.',
  },
}

export function CategoryList({ category }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const meta = CATEGORY_META[category]

  useEffect(() => {
    fetch(`${API}/helios/papers?category=${category}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => {
        setItems(data.papers)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [category])

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
          <p className="body-small papers-error">Failed to load: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="papers-page">
      <section className="papers-hero">
        <div className="container">
          <div className="section-label">{meta.eyebrow}</div>
          <h1 className="h2 section-title">{meta.label}</h1>
          <p className="body-small section-desc">{meta.description}</p>
        </div>
      </section>

      <section>
        <div className="container">
          {items.length === 0 ? (
            <p className="body-small" style={{ color: 'var(--color-medium-gray)' }}>
              No {meta.label.toLowerCase()} published yet.
            </p>
          ) : (
            <div className="papers-grid">
              {items.map((item) => (
                <Link to={`/${category}/${item.slug}`} key={item.slug} className="paper-card">
                  <h3 className="h3 paper-card-title">{item.title}</h3>
                  <p className="body-small paper-card-desc">{item.description}</p>
                  <span className="caption paper-card-date">
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
