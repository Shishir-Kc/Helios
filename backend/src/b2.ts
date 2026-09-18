import { AwsClient } from 'aws4fetch'

export type B2Bindings = {
  B2_ENDPOINT: string
  B2_BUCKET: string
  B2_KEY_ID: string
  B2_APPLICATION_KEY: string
}

function getRegion(endpoint: string): string {
  const hostname = new URL(normalizeEndpoint(endpoint)).hostname
  const match = hostname.match(/^s3\.([^.]+)\./)
  if (!match) throw new Error('B2_ENDPOINT must look like https://s3.<region>.backblazeb2.com')
  return match[1]
}

function normalizeEndpoint(endpoint: string): string {
  const value = endpoint.trim()
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

function getObjectUrl(env: B2Bindings, key: string): string {
  const endpoint = normalizeEndpoint(env.B2_ENDPOINT).replace(/\/$/, '')
  const encodedKey = key.split('/').map(encodeURIComponent).join('/')
  return `${endpoint}/${encodeURIComponent(env.B2_BUCKET)}/${encodedKey}`
}

function getClient(env: B2Bindings): AwsClient {
  return new AwsClient({
    accessKeyId: env.B2_KEY_ID,
    secretAccessKey: env.B2_APPLICATION_KEY,
    service: 's3',
    region: getRegion(env.B2_ENDPOINT),
    retries: 2,
  })
}

async function assertSuccess(response: Response, operation: string): Promise<void> {
  if (response.ok) return
  const details = await response.text()
  throw new Error(`B2 ${operation} failed (${response.status}): ${details.slice(0, 300)}`)
}

export async function putB2Object(
  env: B2Bindings,
  key: string,
  body: ArrayBuffer,
  contentType: string,
): Promise<void> {
  const response = await getClient(env).fetch(getObjectUrl(env, key), {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body,
  })
  await assertSuccess(response, 'upload')
}

export function getB2Object(env: B2Bindings, key: string): Promise<Response> {
  return getClient(env).fetch(getObjectUrl(env, key), { method: 'GET' })
}

export async function deleteB2Object(env: B2Bindings, key: string): Promise<void> {
  const response = await getClient(env).fetch(getObjectUrl(env, key), { method: 'DELETE' })
  await assertSuccess(response, 'delete')
}
