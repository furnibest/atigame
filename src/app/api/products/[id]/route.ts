import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImageToLocal, deleteImageFromLocal } from '@/lib/fileStorage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    })
    
    if (!product) {
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
    const productId = parseInt(id)
    
    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id: productId }
    })
    
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const featured = formData.get('featured') === 'true' || formData.get('featured') === '1'
    
    const updateData: {
      name?: string;
      description?: string | null;
      category?: string;
      featured?: boolean;
      image?: string | null;
      price?: number;
    } = {
      name,
      description: description || null,
      category,
      featured
    }

    const priceValue = formData.get('price') as string | null
    if (priceValue && !isNaN(parseFloat(priceValue))) {
      updateData.price = parseFloat(priceValue)
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
        
        // Upload to local storage
        const newUrl = await uploadImageToLocal(buffer, filename, imageFile.type)
        // Delete old image if exists
        if (existing.image) {
          try { await deleteImageFromLocal(existing.image) } catch {}
        }
        updateData.image = newUrl
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError)
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
      }
    }
    
    const updated = await prisma.product.update({
      where: { id: productId },
      data: updateData
    })
    
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
    const productId = parseInt(id)
    
    // Get product to check if it exists and get image URL
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { image: true }
    })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Delete image from storage if exists
    if (product.image) {
      try { 
        await deleteImageFromLocal(product.image) 
      } catch (imageError) {
        console.error('Error deleting image from storage:', imageError)
        // Continue with product deletion even if image deletion fails
      }
    }
    
    // Delete product from database
    await prisma.product.delete({
      where: { id: productId }
    })
    
    return NextResponse.json({ message: 'Product deleted' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}