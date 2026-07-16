import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFamily, createFamily, updateFamily } from '../api.js'

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
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.slug.trim()) errors.slug = 'Slug is required'
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) errors.slug = 'Slug must be lowercase alphanumeric with hyphens only'
  return errors
}

const EMPTY = {
  name: '',
  slug: '',
  description: '',
}

export default function FamilyForm() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isEdit = !!slug

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    ;(async () => {
      try {
        const data = await getFamily(slug)
        setForm({
          name: data.family.name,
          slug: data.family.slug,
          description: data.family.description ?? '',
        })
        setSlugManuallyEdited(true)
      } catch (err) {
        navigate('/families', { state: { toast: { type: 'error', message: err.message } } })
      } finally {
        setLoading(false)
      }
    })()
  }, [slug, isEdit, navigate])

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'name' && !slugManuallyEdited) {
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
    setForm((prev) => ({ ...prev, slug: slugify(prev.name) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validate(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setSaving(true)
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
    }

    try {
      if (isEdit) {
        await updateFamily(slug, payload)
      } else {
        await createFamily(payload)
      }
      navigate('/families')
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="empty-state"><p>Loading family…</p></div>
  }

  return (
    <div className="form-page">
      <div className="form-page-header">
        <a href="/families" className="back-link" onClick={(e) => { e.preventDefault(); navigate('/families') }}>
          &larr; Back
        </a>
        <h1>{isEdit ? 'Edit Family' : 'New Family'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              className={`input ${errors.name ? 'input-error' : ''}`}
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Family name (e.g. Aurora)"
              autoFocus
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="form-meta-2">
            <div className="form-group">
              <label htmlFor="slug">
                Slug
                {!slugManuallyEdited && (
                  <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--color-text-muted)', fontSize: 12, marginLeft: 8 }}>
                    (auto-generated from name)
                  </span>
                )}
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  id="slug"
                  className={`input ${errors.slug ? 'input-error' : ''}`}
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="family-slug"
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
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="input"
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Optional description of this model family"
              rows={3}
            />
          </div>

          {errors.submit && (
            <div className="field-error" style={{ gridColumn: '1 / -1' }}>{errors.submit}</div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/families')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Family'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
