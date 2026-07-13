import { createMiddleware } from 'hono/factory'

export const adminAuth = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.slice(7)
  if (token !== c.env.ADMIN_API_KEY) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
})
