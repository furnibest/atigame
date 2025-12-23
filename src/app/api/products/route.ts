import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImageToSupabase } from '@/lib/supabase'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📦 POST /api/products - Request received')
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const featured = formData.get('featured') === 'true' || formData.get('featured') === '1'
    
    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Nama produk wajib diisi' }, { status: 400 })
    }
    
    console.log('📝 Form data:', { name, description, category, featured })
    
    let image = null
    const imageFile = formData.get('image') as File
    
    if (imageFile && imageFile.size > 0) {
      console.log('🖼️ Image file detected:', { name: imageFile.name, size: imageFile.size, type: imageFile.type })
      
      try {
        // Validate file type
        if (!imageFile.type.startsWith('image/')) {
          console.error('❌ Invalid file type:', imageFile.type)
          return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
        }

        // Validate file size (max 5MB)
        if (imageFile.size > 5 * 1024 * 1024) {
          console.error('❌ File too large:', imageFile.size)
          return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
        }

        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Clean filename
        const filename = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        
        console.log('📤 Uploading image to Supabase Storage...')
        image = await uploadImageToSupabase(buffer, filename, imageFile.type)
        console.log('✅ Image uploaded:', image)
      } catch (uploadError) {
        console.error('❌ Error uploading file:', uploadError)
        const errorMsg = uploadError instanceof Error ? uploadError.message : 'Unknown error'
        return NextResponse.json({ error: `Failed to upload image: ${errorMsg}` }, { status: 500 })
      }
    }
    
    // Get price if provided
    const priceValue = formData.get('price') as string | null
    const price = priceValue && !isNaN(parseFloat(priceValue)) ? parseFloat(priceValue) : 0

    console.log('💾 Inserting product to MySQL database...')
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        image,
        category: category || 'Semua Produk',
        featured
      }
    })

    console.log('✅ Product created successfully:', product.id)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating product:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Failed to create product: ${errorMessage}` }, { status: 500 })
  }
}
