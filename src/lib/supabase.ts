import { createClient, SupabaseClient } from '@supabase/supabase-js'

let cachedClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient

  const supabaseUrl = process.env.SUPABASE_URL as string | undefined
  const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY) as string | undefined

  // Debug logging
  console.log('🔍 Environment Check:')
  console.log('SUPABASE_URL:', supabaseUrl ? '✅ SET' : '❌ NOT SET')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ SET' : '❌ NOT SET')
  console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET')

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase environment variables are not set. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY).')
  }

  cachedClient = createClient(supabaseUrl, supabaseServiceKey)
  return cachedClient
}

export async function uploadImageToSupabase(buffer: Buffer, filename: string, contentType?: string): Promise<string> {
  try {
    // Check if SERVICE_ROLE_KEY is available (required for storage upload)
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_ANON_KEY) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY is required for image upload')
    }

    const client = getSupabaseClient()
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'images'

    const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const path = `furniture-store/${Date.now()}-${sanitized}`

    console.log(`📤 Uploading image to Supabase Storage: ${bucket}/${path}`)

    const { data: uploadData, error } = await client.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: contentType || 'image/*',
        upsert: true
      })

    if (error) {
      console.error('❌ Supabase Storage upload error:', error)
      
      // Provide more specific error messages
      if (error.message?.includes('permission') || error.message?.includes('denied')) {
        throw new Error('Permission denied. Please ensure SUPABASE_SERVICE_ROLE_KEY is set in .env.local')
      }
      
      if (error.message?.includes('bucket') || error.message?.includes('not found')) {
        throw new Error(`Storage bucket "${bucket}" not found. Please check Supabase Storage configuration.`)
      }
      
      throw new Error(`Upload failed: ${error.message || 'Unknown error'}`)
    }

    const { data: urlData } = client.storage.from(bucket).getPublicUrl(path)
    const publicUrl = urlData.publicUrl
    
    console.log(`✅ Image uploaded successfully: ${publicUrl}`)
    return publicUrl
  } catch (error) {
    console.error('❌ Error in uploadImageToSupabase:', error)
    
    // Re-throw with better error message if it's not already a proper Error
    if (error instanceof Error) {
      throw error
    }
    
    // Handle fetch errors (network issues)
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMsg = String(error.message)
      if (errorMsg.includes('fetch')) {
        throw new Error('Network error: Unable to connect to Supabase. Please check your internet connection and SUPABASE_SERVICE_ROLE_KEY configuration.')
      }
    }
    
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
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


