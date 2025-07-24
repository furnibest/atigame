import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const category = formData.get('category') as string
    const featured = formData.get('featured') === 'true' || formData.get('featured') === '1'
    
    const data: {
      name: string;
      description: string;
      price: number;
      category: string;
      featured: boolean;
      image?: string;
    } = {
      name,
      description,
      price,
      category,
      featured
    }
    
    const imageFile = formData.get('image') as File
    if (imageFile && imageFile.size > 0) {
      try {
        const { writeFile } = await import('fs/promises')
        const { join } = await import('path')
        
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const timestamp = Date.now()
        const filename = `${timestamp}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        
        // Save to public/uploads directory
        const uploadPath = join(process.cwd(), 'public', 'uploads', filename)
        await writeFile(uploadPath, buffer)
        
        // Set the public URL
        data.image = `/uploads/${filename}`
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError)
        // Continue without updating image if upload fails
      }
    }
    
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data
    })
    
    return NextResponse.json(updatedProduct)
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
    await prisma.product.delete({
      where: { id: parseInt(id) }
    })
    
    return NextResponse.json({ message: 'Product deleted' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}