export interface Paper {
  id: number
  title: string
  description: string
  slug: string
  content: string
  category: string
  created_at: string
  updated_at: string
}

export interface PaperListItem {
  id: number
  title: string
  description: string
  slug: string
  category: string
  created_at: string
  updated_at: string
}

export interface CreatePaperInput {
  title: string
  description: string
  slug: string
  content: string
  category: string
}

export interface UpdatePaperInput {
  title?: string
  description?: string
  content?: string
  category?: string
}

const VALID_CATEGORIES = ['research', 'docs', 'papers']

export function isValidCategory(cat: string): cat is 'research' | 'docs' | 'papers' {
  return VALID_CATEGORIES.includes(cat)
}

export function getAllPapers(db: D1Database): Promise<PaperListItem[]> {
  return db
    .prepare('SELECT id, title, description, slug, category, created_at, updated_at FROM papers ORDER BY created_at DESC')
    .all<PaperListItem>()
    .then((r) => r.results)
}

export function getPapersByCategory(db: D1Database, category: string): Promise<PaperListItem[]> {
  return db
    .prepare('SELECT id, title, description, slug, category, created_at, updated_at FROM papers WHERE category = ? ORDER BY created_at DESC')
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
    .prepare('INSERT INTO papers (title, description, slug, content, category) VALUES (?, ?, ?, ?, ?)')
    .bind(input.title, input.description, input.slug, input.content, input.category)
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
