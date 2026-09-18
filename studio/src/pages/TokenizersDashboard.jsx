import { useEffect, useState } from 'react'
import { deleteTokenizer, listTokenizers, updateTokenizer, uploadTokenizer } from '../api.js'

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function TokenizersDashboard() {
  const [tokenizers, setTokenizers] = useState([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [bannerImageUrl, setBannerImageUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [editing, setEditing] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const refresh = () => {
    setLoading(true)
    listTokenizers()
      .then((data) => setTokenizers(data.tokenizers ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(refresh, [])

  const handleNameChange = (event) => {
    const value = event.target.value
    setName(value)
    if (!slug) setSlug(slugify(value))
  }

  const handleUpload = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    if (!name.trim() || (!editing && !slug.trim()) || (!editing && !file)) {
      setError(editing ? 'Name is required.' : 'Name, slug, and a .tokenizer file are required.')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await updateTokenizer(editing.slug, { name: name.trim(), banner_image_url: bannerImageUrl.trim(), github_url: githubUrl.trim(), file })
      } else {
        await uploadTokenizer({ name: name.trim(), slug: slug.trim(), banner_image_url: bannerImageUrl.trim(), github_url: githubUrl.trim(), file })
      }
      setName('')
      setSlug('')
      setBannerImageUrl('')
      setGithubUrl('')
      setEditing(null)
      setFile(null)
      event.target.reset()
      setMessage('Tokenizer uploaded successfully.')
      refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (tokenizer) => {
    if (!window.confirm(`Delete “${tokenizer.name}”?`)) return
    try {
      await deleteTokenizer(tokenizer.slug)
      setTokenizers((current) => current.filter((item) => item.slug !== tokenizer.slug))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <div className="dashboard-header">
        <h1>Tokenizers</h1>
      </div>

      <form className="form-card" onSubmit={handleUpload}>
        <h2>{editing ? 'Edit tokenizer' : 'Upload tokenizer'}</h2>
        <p className="form-card-description">Upload a trained <code>.tokenizer</code> file to Backblaze B2 and register its metadata in D1.</p>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="tokenizer-name">Name</label>
            <input className="input" id="tokenizer-name" value={name} onChange={handleNameChange} placeholder="Ember Tokenizer" />
          </div>
          <div className="form-group">
            <label htmlFor="tokenizer-slug">Slug</label>
            <input className="input" id="tokenizer-slug" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="ember-tokenizer" />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="tokenizer-banner">Banner image URL</label>
            <input className="input" id="tokenizer-banner" type="url" value={bannerImageUrl} onChange={(event) => setBannerImageUrl(event.target.value)} placeholder="https://cdn.example.com/ember-tokenizer-banner.webp" />
            <p className="form-help">Optional image used when this tokenizer is presented publicly.</p>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="tokenizer-github">GitHub repository URL</label>
            <input className="input" id="tokenizer-github" type="url" value={githubUrl} onChange={(event) => setGithubUrl(event.target.value)} placeholder="https://github.com/your-name/your-tokenizer" />
            <p className="form-help">Optional source code or tokenizer repository link.</p>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="tokenizer-file">Tokenizer file</label>
            <input className="input" id="tokenizer-file" type="file" accept=".tokenizer,application/octet-stream" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <p className="form-help">{editing ? 'Optional: select a replacement .tokenizer file.' : <>Select the trained tokenizer file, for example <code>ember.tokenizer</code>.</>}</p>
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Upload tokenizer'}</button>
        {editing && <button className="btn btn-secondary" type="button" onClick={() => { setEditing(null); setName(''); setSlug(''); setBannerImageUrl(''); setGithubUrl(''); setFile(null); setError('') }}>Cancel</button>}
      </form>

      {loading ? <div className="empty-state"><p>Loading tokenizers…</p></div> : tokenizers.length === 0 ? (
        <div className="empty-state"><p>No tokenizers uploaded yet.</p></div>
      ) : (
        <table className="papers-table">
          <thead><tr><th>Name</th><th>File</th><th>Size</th><th>Slug</th><th></th></tr></thead>
          <tbody>
            {tokenizers.map((tokenizer) => (
              <tr key={tokenizer.slug}>
                <td style={{ fontWeight: 500 }}>{tokenizer.name}</td>
                <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: 13 }}>{tokenizer.filename}</td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{formatBytes(tokenizer.size_bytes)}</td>
                <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: 13 }}>{tokenizer.slug}</td>
                <td className="actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(tokenizer); setName(tokenizer.name); setSlug(tokenizer.slug); setBannerImageUrl(tokenizer.banner_image_url ?? ''); setGithubUrl(tokenizer.github_url ?? ''); setFile(null); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Edit</button>
                  <a className="btn btn-ghost btn-sm" href={`${import.meta.env.VITE_API_URL ?? 'https://api.helios.shishirkhatri.com.np/api'}/helios/tokenizers/${tokenizer.slug}`}>Download</a>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(tokenizer)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
