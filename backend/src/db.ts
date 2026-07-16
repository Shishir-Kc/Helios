export interface Paper {
  id: number
  title: string
  description: string
  slug: string
  content: string
  category: string
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface PaperListItem {
  id: number
  title: string
  description: string
  slug: string
  category: string
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface CreatePaperInput {
  title: string
  description: string
  slug: string
  content: string
  category: string
  image_url?: string | null
}

export interface UpdatePaperInput {
  title?: string
  description?: string
  content?: string
  category?: string
  image_url?: string | null
}

const VALID_CATEGORIES = ['research', 'docs', 'papers']

export function isValidCategory(cat: string): cat is 'research' | 'docs' | 'papers' {
  return VALID_CATEGORIES.includes(cat)
}

export function getAllPapers(db: D1Database): Promise<PaperListItem[]> {
  return db
    .prepare('SELECT id, title, description, slug, category, image_url, created_at, updated_at FROM papers ORDER BY created_at DESC')
    .all<PaperListItem>()
    .then((r) => r.results)
}

export function getPapersByCategory(db: D1Database, category: string): Promise<PaperListItem[]> {
  return db
    .prepare('SELECT id, title, description, slug, category, image_url, created_at, updated_at FROM papers WHERE category = ? ORDER BY created_at DESC')
    .bind(category)
    .all<PaperListItem>()
    .then((r) => r.results)
}

export function getPaperBySlug(db: D1Database, slug: string): Promise<Paper | null> {
  return db
    .prepare('SELECT * FROM papers WHERE slug = ?')
    .bind(slug)
    .first<Paper>()
}

export function createPaper(db: D1Database, input: CreatePaperInput): Promise<boolean> {
  return db
    .prepare('INSERT INTO papers (title, description, slug, content, category, image_url) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(input.title, input.description, input.slug, input.content, input.category, input.image_url ?? null)
    .run()
    .then((r) => r.success)
}

export function updatePaper(db: D1Database, slug: string, input: UpdatePaperInput): Promise<boolean> {
  const sets: string[] = []
  const values: unknown[] = []

  if (input.title !== undefined) {
    sets.push('title = ?')
    values.push(input.title)
  }
  if (input.description !== undefined) {
    sets.push('description = ?')
    values.push(input.description)
  }
  if (input.content !== undefined) {
    sets.push('content = ?')
    values.push(input.content)
  }
  if (input.category !== undefined) {
    sets.push('category = ?')
    values.push(input.category)
  }
  if (input.image_url !== undefined) {
    sets.push('image_url = ?')
    values.push(input.image_url)
  }

  if (sets.length === 0) return Promise.resolve(false)

  sets.push("updated_at = datetime('now')")
  values.push(slug)

  return db
    .prepare(`UPDATE papers SET ${sets.join(', ')} WHERE slug = ?`)
    .bind(...values)
    .run()
    .then((r) => r.success)
}

export function deletePaper(db: D1Database, slug: string): Promise<boolean> {
  return db
    .prepare('DELETE FROM papers WHERE slug = ?')
    .bind(slug)
    .run()
    .then((r) => r.success)
}

export interface Model {
  id: number
  name: string
  slug: string
  tagline: string
  description: string
  content: string
  banner_image_url: string | null
  card_image_url: string | null
  parameters: string | null
  context_length: string | null
  base_model: string | null
  required_hardware: string | null
  huggingface_url: string | null
  github_url: string | null
  created_at: string
  updated_at: string
}

export interface ModelListItem {
  id: number
  name: string
  slug: string
  tagline: string
  card_image_url: string | null
  created_at: string
  updated_at: string
}

export interface CreateModelInput {
  name: string
  slug: string
  tagline: string
  description: string
  content: string
  banner_image_url?: string | null
  card_image_url?: string | null
  parameters?: string | null
  context_length?: string | null
  base_model?: string | null
  required_hardware?: string | null
  huggingface_url?: string | null
  github_url?: string | null
}

export interface UpdateModelInput {
  name?: string
  tagline?: string
  description?: string
  content?: string
  banner_image_url?: string | null
  card_image_url?: string | null
  parameters?: string | null
  context_length?: string | null
  base_model?: string | null
  required_hardware?: string | null
  huggingface_url?: string | null
  github_url?: string | null
}

export function getAllModels(db: D1Database): Promise<ModelListItem[]> {
  return db
    .prepare('SELECT id, name, slug, tagline, card_image_url, created_at, updated_at FROM models ORDER BY created_at DESC')
    .all<ModelListItem>()
    .then((r) => r.results)
}

export function getModelBySlug(db: D1Database, slug: string): Promise<Model | null> {
  return db
    .prepare('SELECT * FROM models WHERE slug = ?')
    .bind(slug)
    .first<Model>()
}

export function createModel(db: D1Database, input: CreateModelInput): Promise<boolean> {
  return db
    .prepare(
      `INSERT INTO models (
        name, slug, tagline, description, content,
        banner_image_url, card_image_url, parameters, context_length,
        base_model, required_hardware, huggingface_url, github_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      input.name,
      input.slug,
      input.tagline,
      input.description,
      input.content,
      input.banner_image_url ?? null,
      input.card_image_url ?? null,
      input.parameters ?? null,
      input.context_length ?? null,
      input.base_model ?? null,
      input.required_hardware ?? null,
      input.huggingface_url ?? null,
      input.github_url ?? null
    )
    .run()
    .then((r) => r.success)
}

export function updateModel(db: D1Database, slug: string, input: UpdateModelInput): Promise<boolean> {
  const sets: string[] = []
  const values: unknown[] = []

  const add = (field: keyof UpdateModelInput, col: string) => {
    const v = input[field]
    if (v !== undefined) {
      sets.push(`${col} = ?`)
      values.push(v)
    }
  }

  add('name', 'name')
  add('tagline', 'tagline')
  add('description', 'description')
  add('content', 'content')
  add('banner_image_url', 'banner_image_url')
  add('card_image_url', 'card_image_url')
  add('parameters', 'parameters')
  add('context_length', 'context_length')
  add('base_model', 'base_model')
  add('required_hardware', 'required_hardware')
  add('huggingface_url', 'huggingface_url')
  add('github_url', 'github_url')

  if (sets.length === 0) return Promise.resolve(false)

  sets.push("updated_at = datetime('now')")
  values.push(slug)

  return db
    .prepare(`UPDATE models SET ${sets.join(', ')} WHERE slug = ?`)
    .bind(...values)
    .run()
    .then((r) => r.success)
}

export function deleteModel(db: D1Database, slug: string): Promise<boolean> {
  return db
    .prepare('DELETE FROM models WHERE slug = ?')
    .bind(slug)
    .run()
    .then((r) => r.success)
}
