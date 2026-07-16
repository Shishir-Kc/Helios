import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getModel, createModel, updateModel, listFamilies } from '../api.js'

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
  if (!form.tagline.trim()) errors.tagline = 'Tagline is required'
  if (!form.description.trim()) errors.description = 'Description is required'
  if (!form.content.trim()) errors.content = 'Content is required'
  return errors
}

const EMPTY = {
  name: '',
  slug: '',
  tagline: '',
  description: '',
  content: '',
  banner_image_url: '',
  card_image_url: '',
  parameters: '',
  context_length: '',
  base_model: '',
  required_hardware: '',
  huggingface_url: '',
  github_url: '',
  family_slug: '',
}

export default function ModelForm() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isEdit = !!slug

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [families, setFamilies] = useState([])

  useEffect(() => {
    listFamilies()
      .then((data) => setFamilies(data.families ?? []))
      .catch(() => setFamilies([]))
  }, [])

  useEffect(() => {
    if (!isEdit) return
    ;(async () => {
      try {
        const data = await getModel(slug)
        setForm({
          name: data.model.name,
          slug: data.model.slug,
          tagline: data.model.tagline,
          description: data.model.description,
          content: data.model.content,
          banner_image_url: data.model.banner_image_url ?? '',
          card_image_url: data.model.card_image_url ?? '',
          parameters: data.model.parameters ?? '',
          context_length: data.model.context_length ?? '',
          base_model: data.model.base_model ?? '',
          required_hardware: data.model.required_hardware ?? '',
          huggingface_url: data.model.huggingface_url ?? '',
          github_url: data.model.github_url ?? '',
          family_slug: data.model.family_slug ?? '',
        })
        setSlugManuallyEdited(true)
      } catch (err) {
        navigate('/models', { state: { toast: { type: 'error', message: err.message } } })
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

  const orNull = (v) => (v && v.trim() ? v.trim() : null)

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
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      content: form.content,
      banner_image_url: orNull(form.banner_image_url),
      card_image_url: orNull(form.card_image_url),
      parameters: orNull(form.parameters),
      context_length: orNull(form.context_length),
      base_model: orNull(form.base_model),
      required_hardware: orNull(form.required_hardware),
      huggingface_url: orNull(form.huggingface_url),
      github_url: orNull(form.github_url),
      family_slug: orNull(form.family_slug),
    }

    try {
      if (isEdit) {
        await updateModel(slug, payload)
      } else {
        await createModel(payload)
      }
      navigate('/models')
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="empty-state"><p>Loading model…</p></div>
  }

  return (
    <div className="form-page">
      <div className="form-page-header">
        <a href="/models" className="back-link" onClick={(e) => { e.preventDefault(); navigate('/models') }}>
          &larr; Back
        </a>
        <h1>{isEdit ? 'Edit Model' : 'New Model'}</h1>
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
              placeholder="Model name (e.g. Helios Aurora)"
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
                  placeholder="model-slug"
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
            <label htmlFor="family_slug">Family</label>
            <select
              id="family_slug"
              className="input"
              value={form.family_slug}
              onChange={handleChange('family_slug')}
            >
              <option value="">— No family —</option>
              {families.map((fam) => (
                <option key={fam.slug} value={fam.slug}>
                  {fam.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="tagline">Tagline</label>
            <input
              id="tagline"
              className={`input ${errors.tagline ? 'input-error' : ''}`}
              value={form.tagline}
              onChange={handleChange('tagline')}
              placeholder="Short one-line tagline shown on the card"
            />
            {errors.tagline && <div className="field-error">{errors.tagline}</div>}
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
            <label>Specifications</label>
            <div className="form-meta-2">
              <div className="form-group">
                <label htmlFor="parameters">Parameters</label>
                <input id="parameters" className="input" value={form.parameters} onChange={handleChange('parameters')} placeholder="e.g. 8B" />
              </div>
              <div className="form-group">
                <label htmlFor="context_length">Context Length</label>
                <input id="context_length" className="input" value={form.context_length} onChange={handleChange('context_length')} placeholder="e.g. 128k" />
              </div>
              <div className="form-group">
                <label htmlFor="base_model">Base Model</label>
                <input id="base_model" className="input" value={form.base_model} onChange={handleChange('base_model')} placeholder="e.g. Gemma 3" />
              </div>
              <div className="form-group">
                <label htmlFor="required_hardware">Required Hardware</label>
                <input id="required_hardware" className="input" value={form.required_hardware} onChange={handleChange('required_hardware')} placeholder="e.g. 8GB VRAM" />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Links</label>
            <div className="form-meta-2">
              <div className="form-group">
                <label htmlFor="huggingface_url">Hugging Face URL</label>
                <input id="huggingface_url" className="input" value={form.huggingface_url} onChange={handleChange('huggingface_url')} placeholder="https://huggingface.co/…" style={{ fontFamily: 'monospace', fontSize: 13 }} />
              </div>
              <div className="form-group">
                <label htmlFor="github_url">GitHub URL</label>
                <input id="github_url" className="input" value={form.github_url} onChange={handleChange('github_url')} placeholder="https://github.com/…" style={{ fontFamily: 'monospace', fontSize: 13 }} />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Images</label>
            <div className="form-meta-2">
              <div className="form-group">
                <label htmlFor="card_image_url">Card Image URL</label>
                <input id="card_image_url" className="input" value={form.card_image_url} onChange={handleChange('card_image_url')} placeholder="https://… (grid card)" style={{ fontFamily: 'monospace', fontSize: 13 }} />
                {form.card_image_url.trim() && (
                  <div className="image-preview"><img src={form.card_image_url} alt="card preview" /></div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="banner_image_url">Banner Image URL</label>
                <input id="banner_image_url" className="input" value={form.banner_image_url} onChange={handleChange('banner_image_url')} placeholder="https://… (detail banner)" style={{ fontFamily: 'monospace', fontSize: 13 }} />
                {form.banner_image_url.trim() && (
                  <div className="image-preview"><img src={form.banner_image_url} alt="banner preview" /></div>
                )}
              </div>
            </div>
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
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/models')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Model'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
