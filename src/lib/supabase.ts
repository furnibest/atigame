import { createClient, SupabaseClient } from '@supabase/supabase-js'

let cachedClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient

  const supabaseUrl = process.env.SUPABASE_URL as string | undefined
  const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY) as string | undefined

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase environment variables are not set. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY).')
  }

  cachedClient = createClient(supabaseUrl, supabaseServiceKey)
  return cachedClient
}

export async function uploadImageToSupabase(buffer: Buffer, filename: string, contentType?: string): Promise<string> {
  const client = getSupabaseClient()
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'images'

  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  const path = `furniture-store/${Date.now()}-${sanitized}`

  const { error } = await client.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: contentType || 'image/*',
      upsert: true
    })

  if (error) {
    throw error
  }

  const { data } = client.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export function extractStoragePathFromPublicUrl(publicUrl: string): { bucket: string; path: string } | null {
  try {
    const url = new URL(publicUrl)
    const parts = url.pathname.split('/')
    const publicIdx = parts.findIndex((p) => p === 'public')
    if (publicIdx === -1 || publicIdx + 2 >= parts.length) return null
    const bucket = parts[publicIdx + 1]
    const path = parts.slice(publicIdx + 2).join('/')
    if (!bucket || !path) return null
    return { bucket, path }
  } catch {
    return null
  }
}

export async function deleteImageByPublicUrl(publicUrl: string): Promise<void> {
  const client = getSupabaseClient()
  const extracted = extractStoragePathFromPublicUrl(publicUrl)
  if (!extracted) return
  const { bucket, path } = extracted
  await client.storage.from(bucket).remove([path])
}


