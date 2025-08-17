import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadToCloudinary } from '@/lib/cloudinary'

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
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const featured = formData.get('featured') === 'true' || formData.get('featured') === '1'
    
    let image = null
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
        
        // Upload to Cloudinary
        image = await uploadToCloudinary(buffer, filename)
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError)
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
      }
    }
    
    const data: {
      name: string
      description: string
      image: string | null
      category: string
      featured: boolean
      price: number
    } = {
      name,
      description,
      image,
      category,
      featured,
      price: 0
    }

    const priceValue = formData.get('price') as string | null
    if (priceValue && !isNaN(parseFloat(priceValue))) {
      data.price = parseFloat(priceValue)
    }

    const newProduct = await prisma.product.create({ data })
    
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}