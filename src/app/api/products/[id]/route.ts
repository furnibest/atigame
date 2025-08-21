import { NextRequest, NextResponse } from 'next/server'
import { uploadImageToSupabase, deleteImageByPublicUrl, getSupabaseClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseClient()
    const { data: product, error } = await supabase
      .from('Product')
      .select('*')
      .eq('id', parseInt(id))
      .single()
    
    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseClient()
    const { data: existing } = await supabase
      .from('Product')
      .select('*')
      .eq('id', parseInt(id))
      .single()
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const featured = formData.get('featured') === 'true' || formData.get('featured') === '1'
    
    const data: {
      name: string;
      description: string;
      category: string;
      featured: boolean;
      image?: string;
      price?: number;
    } = {
      name,
      description,
      category,
      featured
    }

    const priceValue = formData.get('price') as string | null
    if (priceValue && !isNaN(parseFloat(priceValue))) {
      data.price = parseFloat(priceValue)
    }
    
    const imageFile = formData.get('image') as File
    if (imageFile && imageFile.size > 0) {
      try {
        // Validate file type
        if (!imageFile.type.startsWith('image/')) {
          return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
        }

        // Validate file size (max 5MB)
        if (imageFile.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
        }
        
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Clean filename
        const filename = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        
        // Upload to Supabase Storage
        const newUrl = await uploadImageToSupabase(buffer, filename, imageFile.type)
        // Delete old image if exists
        if (existing?.image) {
          try { await deleteImageByPublicUrl(existing.image) } catch {}
        }
        data.image = newUrl
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError)
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
      }
    }
    
    const now = new Date().toISOString()
    const { data: updated, error } = await supabase
      .from('Product')
      .update({ ...data, updatedAt: now })
      .eq('id', parseInt(id))
      .select('*')
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseClient()
    const { data: product } = await supabase
      .from('Product')
      .select('image')
      .eq('id', parseInt(id))
      .single()
    if (product?.image) {
      try { await deleteImageByPublicUrl(product.image) } catch {}
    }
    const { error } = await supabase
      .from('Product')
      .delete()
      .eq('id', parseInt(id))
    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Product deleted' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}