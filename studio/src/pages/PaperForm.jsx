import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPaper, createPaper, updatePaper } from '../api.js'

const CATEGORIES = ['papers', 'research', 'docs']

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function validate(form) {
  const errors = {}
  if (!form.title.trim()) errors.title = 'Title is required'
  if (!form.description.trim()) errors.description = 'Description is required'
  if (!form.slug.trim()) errors.slug = 'Slug is required'
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) errors.slug = 'Slug must be lowercase alphanumeric with hyphens only'
  if (!form.content.trim()) errors.content = 'Content is required'
  if (!form.category) errors.category = 'Category is required'
  return errors
}

export default function PaperForm() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isEdit = !!slug

  const [form, setForm] = useState({
    title: '',
    description: '',
    slug: '',
    content: '',
    category: 'papers',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    ;(async () => {
      try {
        const data = await getPaper(slug)
        setForm({
          title: data.paper.title,
          description: data.paper.description,
          slug: data.paper.slug,
          content: data.paper.content,
          category: data.paper.category,
        })
        setSlugManuallyEdited(true)
      } catch (err) {
        navigate('/', { state: { toast: { type: 'error', message: err.message } } })
      } finally {
        setLoading(false)
      }
    })()
  }, [slug, isEdit, navigate])

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && !slugManuallyEdited) {
        next.slug = slugify(value)
      }
      return next
    })
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSlugChange = (e) => {
    setSlugManuallyEdited(true)
    setForm((prev) => ({ ...prev, slug: e.target.value }))
    if (errors.slug) setErrors((prev) => ({ ...prev, slug: undefined }))
  }

  const handleGenerateSlug = () => {
    setSlugManuallyEdited(true)
    setForm((prev) => ({ ...prev, slug: slugify(prev.title) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validate(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setSaving(true)
    try {
      if (isEdit) {
        await updatePaper(slug, {
          title: form.title,
          description: form.description,
          content: form.content,
          category: form.category,
        })
      } else {
        await createPaper(form)
      }
      navigate('/')
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="empty-state"><p>Loading paper…</p></div>
  }

  return (
    <div className="form-page">
      <div className="form-page-header">
        <a href="/" className="back-link" onClick={(e) => { e.preventDefault(); navigate('/') }}>
          &larr; Back
        </a>
        <h1>{isEdit ? 'Edit Paper' : 'New Paper'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              className={`input ${errors.title ? 'input-error' : ''}`}
              value={form.title}
              onChange={handleChange('title')}
              placeholder="Paper title"
              autoFocus
            />
            {errors.title && <div className="field-error">{errors.title}</div>}
          </div>

          <div className="form-meta-2">
            <div className="form-group">
              <label htmlFor="slug">
                Slug
                {!slugManuallyEdited && (
                  <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--color-text-muted)', fontSize: 12, marginLeft: 8 }}>
                    (auto-generated from title)
                  </span>
                )}
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  id="slug"
                  className={`input ${errors.slug ? 'input-error' : ''}`}
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="paper-slug"
                  style={{ fontFamily: 'monospace', fontSize: 13 }}
                />
                {!slugManuallyEdited && (
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleGenerateSlug} style={{ whiteSpace: 'nowrap' }}>
                    Lock
                  </button>
                )}
              </div>
              {errors.slug && <div className="field-error">{errors.slug}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                className={`input ${errors.category ? 'input-error' : ''}`}
                value={form.category}
                onChange={handleChange('category')}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <div className="field-error">{errors.category}</div>}
            </div>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className={`input ${errors.description ? 'input-error' : ''}`}
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Short description displayed on the listing card"
              rows={2}
            />
            {errors.description && <div className="field-error">{errors.description}</div>}
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Content</label>
            <div className="split-pane">
              <textarea
                className={`input ${errors.content ? 'input-error' : ''}`}
                value={form.content}
                onChange={handleChange('content')}
                placeholder="Write markdown content here…"
                style={{ minHeight: 400 }}
              />
              <div className="preview-pane">
                {form.content.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {form.content}
                  </ReactMarkdown>
                ) : (
                  <div className="preview-placeholder">Preview will appear here</div>
                )}
              </div>
            </div>
            {errors.content && <div className="field-error">{errors.content}</div>}
          </div>

          {errors.submit && (
            <div className="field-error" style={{ gridColumn: '1 / -1' }}>{errors.submit}</div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Paper'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
