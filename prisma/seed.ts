import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.product.deleteMany()

  // Create sample products
  const products = [
    {
      name: 'Luxury Teak Dining Table',
      description: 'Handcrafted solid teak dining table with elegant design',
      price: 2500000,
      image: '/images/dining-table.jpg',
      category: 'Dining Room',
      featured: true,
    },
    {
      name: 'Outdoor Rattan Sofa Set',
      description: 'Weather-resistant rattan sofa set perfect for outdoor spaces',
      price: 3200000,
      image: '/images/rattan-sofa.jpg',
      category: 'Outdoor',
      featured: true,
    },
    {
      name: 'Mahogany Coffee Table',
      description: 'Elegant mahogany coffee table with intricate carvings',
      price: 1800000,
      image: '/images/coffee-table.jpg',
      category: 'Living Room',
      featured: false,
    },
    {
      name: 'Bamboo Bookshelf',
      description: 'Eco-friendly bamboo bookshelf with modern design',
      price: 1200000,
      image: '/images/bookshelf.jpg',
      category: 'Study Room',
      featured: false,
    },
    {
      name: 'Teak Garden Bench',
      description: 'Durable teak garden bench for outdoor relaxation',
      price: 950000,
      image: '/images/garden-bench.jpg',
      category: 'Outdoor',
      featured: true,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })