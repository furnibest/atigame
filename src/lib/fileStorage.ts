import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

/**
 * Upload image to local storage
 * @param buffer - Image file buffer
 * @param filename - Original filename
 * @param contentType - MIME type (e.g., 'image/jpeg')
 * @returns Public URL path (e.g., '/uploads/1234567890-image.jpg')
 */
export async function uploadImageToLocal(
  buffer: Buffer,
  filename: string,
  contentType?: string
): Promise<string> {
  try {
    // Ensure upload directory exists
    await ensureUploadDir()

    // Sanitize filename
    const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    
    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const ext = sanitized.split('.').pop() || 'jpg'
    const uniqueFilename = `${timestamp}-${sanitized}`
    
    // Full path to save file
    const filePath = join(UPLOAD_DIR, uniqueFilename)
    
    // Write file to disk
    await writeFile(filePath, buffer)
    
    // Return public URL (relative to public folder)
    const publicUrl = `/uploads/${uniqueFilename}`
    
    console.log(`✅ Image uploaded to local storage: ${publicUrl}`)
    return publicUrl
  } catch (error) {
    console.error('❌ Error uploading image to local storage:', error)
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Delete image from local storage
 * @param publicUrl - Public URL path (e.g., '/uploads/1234567890-image.jpg')
 */
export async function deleteImageFromLocal(publicUrl: string): Promise<void> {
  try {
    // Extract filename from URL
    const filename = publicUrl.split('/').pop()
    if (!filename) {
      console.warn('⚠️ Could not extract filename from URL:', publicUrl)
      return
    }
    
    // Full path to file
    const filePath = join(UPLOAD_DIR, filename)
    
    // Check if file exists before deleting
    if (existsSync(filePath)) {
      await unlink(filePath)
      console.log(`✅ Image deleted from local storage: ${publicUrl}`)
    } else {
      console.warn('⚠️ File not found for deletion:', filePath)
    }
  } catch (error) {
    console.error('❌ Error deleting image from local storage:', error)
    // Don't throw error, just log it (file might already be deleted)
  }
}

