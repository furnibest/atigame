import { NextRequest, NextResponse } from 'next/server'
import { uploadImageToSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Clean filename
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    
    // Upload to Supabase Storage (Vercel FS is read-only)
    const imageUrl = await uploadImageToSupabase(buffer, filename, file.type)
    
    return NextResponse.json({ 
      success: true, 
      imageUrl,
      filename 
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
