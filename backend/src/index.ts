import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { adminAuth } from './auth'
import { deleteB2Object, getB2Object, putB2Object, type B2Bindings } from './b2'
import {
  getAllPapers,
  getPapersByCategory,
  getPaperBySlug,
  createPaper,
  updatePaper,
  deletePaper,
  isValidCategory,
  getAllModels,
  getModelsByFamily,
  getModelBySlug,
  createModel,
  updateModel,
  deleteModel,
  getAllFamilies,
  getFamilyBySlug,
  createFamily,
  updateFamily,
  deleteFamily,
  isValidSlug,
  type CreatePaperInput,
  type UpdatePaperInput,
  type CreateModelInput,
  type UpdateModelInput,
  type CreateFamilyInput,
  type UpdateFamilyInput,
  getAllTokenizers,
  getTokenizerBySlug,
  createTokenizer,
  deleteTokenizer,
  updateTokenizer,
} from './db'

type Bindings = {
  DB: D1Database
  ADMIN_API_KEY: string
} & B2Bindings

const app = new Hono<{ Bindings: Bindings }>()

const MAX_TOKENIZER_SIZE = 50 * 1024 * 1024

function allowedOrigin(origin: string): string {
  if (origin === 'https://helios.shishirkhatri.com.np') return origin
  if (origin === 'https://studio.helios.shishirkhatri.com.np') return origin
  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) return origin
  if (origin.endsWith('.helios-6ho.pages.dev') || origin.endsWith('.helios-studio-1wi.pages.dev')) return origin
  return ''
}

app.use('/api/*', cors({ origin: allowedOrigin }))

app.use('/api/*', async (c, next) => {
  await next()
  c.res.headers.set('X-Content-Type-Options', 'nosniff')
  c.res.headers.set('X-Frame-Options', 'DENY')
  c.res.headers.set('Referrer-Policy', 'no-referrer')
})

app.get('/api/helios/verify', adminAuth, (c) => {
  return c.json({ ok: true })
})

app.get('/api/helios/papers', async (c) => {
  try {
    const category = c.req.query('category')
    let papers
    if (category) {
      if (!isValidCategory(category)) {
        return c.json({ error: `Invalid category. Must be one of: research, docs, papers, tokenizer` }, 400)
      }
      papers = await getPapersByCategory(c.env.DB, category)
    } else {
      papers = await getAllPapers(c.env.DB)
    }
    return c.json({ papers })
  } catch (err) {
    return c.json({ error: 'Failed to fetch papers' }, 500)
  }
})

app.get('/api/helios/papers/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    const paper = await getPaperBySlug(c.env.DB, slug)
    if (!paper) return c.json({ error: 'Paper not found' }, 404)
    return c.json({ paper })
  } catch (err) {
    return c.json({ error: 'Failed to fetch paper' }, 500)
  }
})

app.post('/api/helios/papers', adminAuth, async (c) => {
  try {
    const body = await c.req.json<CreatePaperInput>()

    if (!body.title || !body.description || !body.slug || !body.content || !body.category) {
      return c.json({ error: 'Missing required fields: title, description, slug, content, category' }, 400)
    }

    if (!isValidCategory(body.category)) {
      return c.json({ error: 'Invalid category. Must be one of: research, docs, papers, tokenizer' }, 400)
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(body.slug)) {
      return c.json({ error: 'Slug must be lowercase alphanumeric with hyphens only' }, 400)
    }

    const existing = await getPaperBySlug(c.env.DB, body.slug)
    if (existing) {
      return c.json({ error: 'A paper with this slug already exists' }, 409)
    }

    const success = await createPaper(c.env.DB, body)
    if (!success) return c.json({ error: 'Failed to create paper' }, 500)

    const paper = await getPaperBySlug(c.env.DB, body.slug)
    return c.json({ paper }, 201)
  } catch (err) {
    return c.json({ error: 'Failed to create paper' }, 500)
  }
})

app.put('/api/helios/papers/:slug', adminAuth, async (c) => {
  try {
    const slug = c.req.param('slug')
    const body = await c.req.json<UpdatePaperInput>()

    if (body.category !== undefined && !isValidCategory(body.category)) {
      return c.json({ error: 'Invalid category. Must be one of: research, docs, papers, tokenizer' }, 400)
    }

    const existing = await getPaperBySlug(c.env.DB, slug)
    if (!existing) return c.json({ error: 'Paper not found' }, 404)

    const success = await updatePaper(c.env.DB, slug, body)
    if (!success) return c.json({ error: 'Failed to update paper' }, 500)

    const paper = await getPaperBySlug(c.env.DB, slug)
    return c.json({ paper })
  } catch (err) {
    return c.json({ error: 'Failed to update paper' }, 500)
  }
})

app.delete('/api/helios/papers/:slug', adminAuth, async (c) => {
  try {
    const slug = c.req.param('slug')

    const existing = await getPaperBySlug(c.env.DB, slug)
    if (!existing) return c.json({ error: 'Paper not found' }, 404)

    const success = await deletePaper(c.env.DB, slug)
    if (!success) return c.json({ error: 'Failed to delete paper' }, 500)

    return c.json({ message: 'Paper deleted' })
  } catch (err) {
    return c.json({ error: 'Failed to delete paper' }, 500)
  }
})

// --- Models ---

app.get('/api/helios/models', async (c) => {
  try {
    const family = c.req.query('family')
    const models = family
      ? await getModelsByFamily(c.env.DB, family)
      : await getAllModels(c.env.DB)
    return c.json({ models })
  } catch (err) {
    return c.json({ error: 'Failed to fetch models' }, 500)
  }
})

app.get('/api/helios/models/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    const model = await getModelBySlug(c.env.DB, slug)
    if (!model) return c.json({ error: 'Model not found' }, 404)
    return c.json({ model })
  } catch (err) {
    return c.json({ error: 'Failed to fetch model' }, 500)
  }
})

app.post('/api/helios/models', adminAuth, async (c) => {
  try {
    const body = await c.req.json<CreateModelInput>()

    if (!body.name || !body.slug || !body.tagline || !body.description || !body.content) {
      return c.json(
        { error: 'Missing required fields: name, slug, tagline, description, content' },
        400
      )
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(body.slug)) {
      return c.json({ error: 'Slug must be lowercase alphanumeric with hyphens only' }, 400)
    }

    const existing = await getModelBySlug(c.env.DB, body.slug)
    if (existing) {
      return c.json({ error: 'A model with this slug already exists' }, 409)
    }

    const success = await createModel(c.env.DB, body)
    if (!success) return c.json({ error: 'Failed to create model' }, 500)

    const model = await getModelBySlug(c.env.DB, body.slug)
    return c.json({ model }, 201)
  } catch (err) {
    return c.json({ error: 'Failed to create model' }, 500)
  }
})

app.put('/api/helios/models/:slug', adminAuth, async (c) => {
  try {
    const slug = c.req.param('slug')
    const body = await c.req.json<UpdateModelInput>()

    const existing = await getModelBySlug(c.env.DB, slug)
    if (!existing) return c.json({ error: 'Model not found' }, 404)

    const success = await updateModel(c.env.DB, slug, body)
    if (!success) return c.json({ error: 'Failed to update model' }, 500)

    const model = await getModelBySlug(c.env.DB, slug)
    return c.json({ model })
  } catch (err) {
    return c.json({ error: 'Failed to update model' }, 500)
  }
})

app.delete('/api/helios/models/:slug', adminAuth, async (c) => {
  try {
    const slug = c.req.param('slug')

    const existing = await getModelBySlug(c.env.DB, slug)
    if (!existing) return c.json({ error: 'Model not found' }, 404)

    const success = await deleteModel(c.env.DB, slug)
    if (!success) return c.json({ error: 'Failed to delete model' }, 500)

    return c.json({ message: 'Model deleted' })
  } catch (err) {
    return c.json({ error: 'Failed to delete model' }, 500)
  }
})

// --- Families ---

app.get('/api/helios/families', async (c) => {
  try {
    const families = await getAllFamilies(c.env.DB)
    return c.json({ families })
  } catch (err) {
    return c.json({ error: 'Failed to fetch families' }, 500)
  }
})

app.get('/api/helios/families/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    const family = await getFamilyBySlug(c.env.DB, slug)
    if (!family) return c.json({ error: 'Family not found' }, 404)
    return c.json({ family })
  } catch (err) {
    return c.json({ error: 'Failed to fetch family' }, 500)
  }
})

app.post('/api/helios/families', adminAuth, async (c) => {
  try {
    const body = await c.req.json<CreateFamilyInput>()

    if (!body.name || !body.slug) {
      return c.json({ error: 'Missing required fields: name, slug' }, 400)
    }

    if (!isValidSlug(body.slug)) {
      return c.json({ error: 'Slug must be lowercase alphanumeric with hyphens only' }, 400)
    }

    const existing = await getFamilyBySlug(c.env.DB, body.slug)
    if (existing) {
      return c.json({ error: 'A family with this slug already exists' }, 409)
    }

    const success = await createFamily(c.env.DB, body)
    if (!success) return c.json({ error: 'Failed to create family' }, 500)

    const family = await getFamilyBySlug(c.env.DB, body.slug)
    return c.json({ family }, 201)
  } catch (err) {
    return c.json({ error: 'Failed to create family' }, 500)
  }
})

app.put('/api/helios/families/:slug', adminAuth, async (c) => {
  try {
    const slug = c.req.param('slug')
    const body = await c.req.json<UpdateFamilyInput>()

    const existing = await getFamilyBySlug(c.env.DB, slug)
    if (!existing) return c.json({ error: 'Family not found' }, 404)

    const success = await updateFamily(c.env.DB, slug, body)
    if (!success) return c.json({ error: 'Failed to update family' }, 500)

    const family = await getFamilyBySlug(c.env.DB, slug)
    return c.json({ family })
  } catch (err) {
    return c.json({ error: 'Failed to update family' }, 500)
  }
})

app.delete('/api/helios/families/:slug', adminAuth, async (c) => {
  try {
    const slug = c.req.param('slug')

    const existing = await getFamilyBySlug(c.env.DB, slug)
    if (!existing) return c.json({ error: 'Family not found' }, 404)

    const success = await deleteFamily(c.env.DB, slug)
    if (!success) return c.json({ error: 'Failed to delete family' }, 500)

    return c.json({ message: 'Family deleted' })
  } catch (err) {
    return c.json({ error: 'Failed to delete family' }, 500)
  }
})

// --- Tokenizers ---

app.get('/api/helios/tokenizers', async (c) => {
  try {
    return c.json({ tokenizers: await getAllTokenizers(c.env.DB) })
  } catch (err) {
    return c.json({ error: 'Failed to fetch tokenizers' }, 500)
  }
})

app.get('/api/helios/tokenizers/:slug', async (c) => {
  try {
    const tokenizer = await getTokenizerBySlug(c.env.DB, c.req.param('slug'))
    if (!tokenizer) return c.json({ error: 'Tokenizer not found' }, 404)
    const object = await getB2Object(c.env, tokenizer.r2_key)
    if (!object.ok) return c.json({ error: 'Tokenizer file not found' }, 404)
    const headers = new Headers(object.headers)
    headers.set('Content-Disposition', `attachment; filename="${tokenizer.filename.replace(/["\\]/g, '')}"`)
    headers.set('Cache-Control', 'public, max-age=3600')
    return new Response(object.body, { headers })
  } catch (err) {
    return c.json({ error: 'Failed to download tokenizer' }, 500)
  }
})

app.post('/api/helios/tokenizers', adminAuth, async (c) => {
  try {
    const body = await c.req.parseBody()
    const file = body.file instanceof File ? body.file : null
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
    const bannerImageUrl = typeof body.banner_image_url === 'string' ? body.banner_image_url.trim() : null
    const githubUrl = typeof body.github_url === 'string' ? body.github_url.trim() : null
    if (!name || !slug || !file) return c.json({ error: 'Name, slug, and a tokenizer file are required' }, 400)
    if (!isValidSlug(slug)) return c.json({ error: 'Slug must be lowercase alphanumeric with hyphens only' }, 400)
    if (!file.name.toLowerCase().endsWith('.tokenizer')) return c.json({ error: 'Tokenizer files must use the .tokenizer extension' }, 400)
    if (file.size > MAX_TOKENIZER_SIZE) return c.json({ error: 'Tokenizer file must be 50 MB or smaller' }, 413)
    if (await getTokenizerBySlug(c.env.DB, slug)) return c.json({ error: 'A tokenizer with this slug already exists' }, 409)

    const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const r2Key = `tokenizers/${slug}/${crypto.randomUUID()}-${safeFilename}`
    await putB2Object(c.env, r2Key, await file.arrayBuffer(), file.type || 'application/octet-stream')
    const success = await createTokenizer(c.env.DB, {
      name, slug, filename: safeFilename, content_type: file.type || 'application/octet-stream', size_bytes: file.size, r2_key: r2Key, banner_image_url: bannerImageUrl || null, github_url: githubUrl || null,
    })
    if (!success) {
      await deleteB2Object(c.env, r2Key)
      return c.json({ error: 'Failed to save tokenizer metadata' }, 500)
    }
    return c.json({ tokenizer: await getTokenizerBySlug(c.env.DB, slug) }, 201)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown upload error'
    console.error('Tokenizer upload failed:', message)
    return c.json({ error: `Failed to upload tokenizer: ${message}` }, 500)
  }
})

app.put('/api/helios/tokenizers/:slug', adminAuth, async (c) => {
  try {
    const slug = c.req.param('slug')
    const existing = await getTokenizerBySlug(c.env.DB, slug)
    if (!existing) return c.json({ error: 'Tokenizer not found' }, 404)
    const body = await c.req.parseBody()
    const file = body.file instanceof File ? body.file : null
    const name = typeof body.name === 'string' ? body.name.trim() : existing.name
    const bannerImageUrl = typeof body.banner_image_url === 'string' ? body.banner_image_url.trim() : null
    const githubUrl = typeof body.github_url === 'string' ? body.github_url.trim() : null
    if (!name) return c.json({ error: 'Name is required' }, 400)

    let newKey: string | undefined
    let filename: string | undefined
    let contentType: string | undefined
    let sizeBytes: number | undefined
    if (file) {
      if (!file.name.toLowerCase().endsWith('.tokenizer')) return c.json({ error: 'Tokenizer files must use the .tokenizer extension' }, 400)
      if (file.size > MAX_TOKENIZER_SIZE) return c.json({ error: 'Tokenizer file must be 50 MB or smaller' }, 413)
      filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      contentType = file.type || 'application/octet-stream'
      sizeBytes = file.size
      newKey = `tokenizers/${slug}/${crypto.randomUUID()}-${filename}`
      await putB2Object(c.env, newKey, await file.arrayBuffer(), contentType)
    }

    const success = await updateTokenizer(c.env.DB, slug, {
      name,
      filename,
      content_type: contentType,
      size_bytes: sizeBytes,
      r2_key: newKey,
      banner_image_url: bannerImageUrl,
      github_url: githubUrl,
    })
    if (!success) {
      if (newKey) await deleteB2Object(c.env, newKey)
      return c.json({ error: 'Failed to update tokenizer' }, 500)
    }
    if (newKey && newKey !== existing.r2_key) await deleteB2Object(c.env, existing.r2_key)
    return c.json({ tokenizer: await getTokenizerBySlug(c.env.DB, slug) })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown update error'
    console.error('Tokenizer update failed:', message)
    return c.json({ error: `Failed to update tokenizer: ${message}` }, 500)
  }
})

app.delete('/api/helios/tokenizers/:slug', adminAuth, async (c) => {
  try {
    const tokenizer = await getTokenizerBySlug(c.env.DB, c.req.param('slug'))
    if (!tokenizer) return c.json({ error: 'Tokenizer not found' }, 404)
    await deleteB2Object(c.env, tokenizer.r2_key)
    if (!await deleteTokenizer(c.env.DB, tokenizer.slug)) return c.json({ error: 'Failed to delete tokenizer metadata' }, 500)
    return c.json({ message: 'Tokenizer deleted' })
  } catch (err) {
    return c.json({ error: 'Failed to delete tokenizer' }, 500)
  }
})

export default app
