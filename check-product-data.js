// Quick script to check product data in database
// Run: node check-product-data.js

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })
    
    console.log('\n📦 Products in database:')
    console.log('='.repeat(60))
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Image: ${product.image || '(null) ❌'}`)
      console.log(`   Category: ${product.category}`)
      console.log(`   Created: ${product.createdAt}`)
    })
    
    console.log('\n' + '='.repeat(60))
    console.log(`\nTotal products: ${products.length}`)
    console.log(`Products with image: ${products.filter(p => p.image).length}`)
    console.log(`Products without image: ${products.filter(p => !p.image).length}`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProducts()

