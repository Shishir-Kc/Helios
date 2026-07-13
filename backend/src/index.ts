import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { adminAuth } from './auth'
import {
  getAllPapers,
  getPapersByCategory,
  getPaperBySlug,
  createPaper,
  updatePaper,
  deletePaper,
  isValidCategory,
  type CreatePaperInput,
  type UpdatePaperInput,
} from './db'

type Bindings = {
  DB: D1Database
  ADMIN_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

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
        return c.json({ error: `Invalid category. Must be one of: research, docs, papers` }, 400)
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
      return c.json({ error: 'Invalid category. Must be one of: research, docs, papers' }, 400)
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
      return c.json({ error: 'Invalid category. Must be one of: research, docs, papers' }, 400)
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

export default app
