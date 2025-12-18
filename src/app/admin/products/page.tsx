'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

interface Product {
  id: number
  name: string
  description: string
  image: string
  category: string
  featured: boolean
}

const API_URL = '/api/products'

export default function AdminProducts() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    image: null as File | null, 
    category: 'Semua Produk', 
    featured: false 
  })
  const [editId, setEditId] = useState<number | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const CATEGORY_OPTIONS = [
    'Semua Produk',
    'Meja',
    'Kursi',
    'Lemari',
    'Buffet',
    'Sofa'
  ]

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn')
    if (!loggedIn) {
      router.push('/admin')
      return
    }
    setIsLoggedIn(true)
    fetchProducts()
  }, [router])

  // Fetch products
  const fetchProducts = async () => {
    try {
      // Add cache-busting to ensure fresh data
      const res = await fetch(`${API_URL}?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const data = await res.json()
      console.log('📦 Fetched products:', data)
      if (Array.isArray(data)) {
        setProducts(data)
        console.log(`✅ Loaded ${data.length} products`)
      } else {
        console.warn('⚠️ Response is not an array:', data)
        setProducts([])
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      setProducts([])
    }
  }

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement
    if (target.name === 'image' && target.files) {
      const file = target.files[0]
      setForm({ ...form, image: file })
      if (file) {
        setPreview(URL.createObjectURL(file))
      }
    } else if (target.name === 'featured') {
      setForm({ ...form, featured: target.checked })
    } else {
      setForm({ ...form, [target.name]: target.value })
    }
  }

  // Handle submit (add/edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    
    formData.append('name', form.name)
    formData.append('description', form.description)
    formData.append('category', form.category)
    formData.append('featured', form.featured ? '1' : '0')
    if (form.image) formData.append('image', form.image)
    
    let res
    if (editId) {
      res = await fetch(`${API_URL}/${editId}`, { method: 'PUT', body: formData })
    } else {
      res = await fetch(API_URL, { method: 'POST', body: formData })
    }
    
    if (res.ok) {
      const savedProduct = await res.json().catch(() => null)
      console.log('✅ Product saved successfully:', savedProduct)
      setForm({ name: '', description: '', image: null, category: 'Semua Produk', featured: false })
      setPreview(null)
      setEditId(null)
      // Refresh products list
      await fetchProducts()
      alert('Produk berhasil disimpan!')
    } else {
      const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
      console.error('❌ Error saving product:', errorData)
      console.error('❌ Response status:', res.status)
      console.error('❌ Response statusText:', res.statusText)
      const errorMessage = errorData.error || errorData.message || res.statusText || 'Unknown error'
      alert(`Gagal menyimpan produk!\n\nError: ${errorMessage}\n\nSilakan cek console untuk detail lebih lanjut.`)
    }
    setLoading(false)
  }

  // Handle edit
  const handleEdit = (prod: Product) => {
    setForm({ 
      name: prod.name, 
      description: prod.description, 
      image: null, 
      category: prod.category || 'Semua Produk', 
      featured: !!prod.featured 
    })
    setEditId(prod.id)
    setPreview(prod.image || null)
  }

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!window.confirm('Hapus produk ini?')) return
    setLoading(true)
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    fetchProducts()
    setLoading(false)
  }

  // Handle cancel edit
  const handleCancel = () => {
    setForm({ name: '', description: '', image: null, category: 'Semua Produk', featured: false })
    setEditId(null)
    setPreview(null)
  }

  if (!isLoggedIn) {
    return <div>Loading...</div>
  }

  return (
    <AdminLayout>
      <div className="admin-products">
        <h2 style={{color:'#bfa16a', marginBottom:'1.5rem'}}>Manajemen Produk</h2>
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input 
              name="name" 
              placeholder="Nama produk" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-row">
            <select 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              required 
              style={{flex:1,padding:'0.7rem 1rem',borderRadius:6,border:'1px solid #ccc',fontSize:'1rem'}}
            >
              {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <label style={{display:'flex',alignItems:'center',gap:'0.5rem',marginLeft:'1rem'}}>
              <input 
                type="checkbox" 
                name="featured" 
                checked={form.featured} 
                onChange={handleChange} 
              />
              Produk Unggulan
            </label>
          </div>
          <textarea 
            name="description" 
            placeholder="Deskripsi" 
            value={form.description} 
            onChange={handleChange} 
            required 
          />
          <div className="form-row">
            <input 
              name="image" 
              type="file" 
              accept="image/*" 
              onChange={handleChange} 
            />
            {preview && (
              <Image 
                src={preview} 
                alt="preview" 
                className="img-preview" 
                width={120}
                height={120}
                unoptimized
              />
            )}
          </div>
          <div className="form-row">
            <button type="submit" disabled={loading}>
              {editId ? 'Update' : 'Tambah'} Produk
            </button>
            {editId && (
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Batal
              </button>
            )}
          </div>
        </form>
        
        <hr style={{margin:'2rem 0', borderColor:'#ececec'}} />
        
        <div className="product-table-wrap">
          <table className="product-table">
            <thead>
              <tr>
                <th>Gambar</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) && products.length > 0 ? products.map(prod => (
                <tr key={prod.id}>
                  <td>
                    {prod.image ? (
                      <Image 
                        src={prod.image} 
                        alt="img" 
                        className="img-thumb" 
                        width={60}
                        height={60}
                      />
                    ) : (
                      <div style={{width:60,height:60,background:'#f0f0f0',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:6}}>
                        No Image
                      </div>
                    )}
                  </td>
                  <td>
                    <div>{prod.name}</div>
                    {prod.featured && (
                      <span style={{
                        background: '#bfa16a',
                        color: 'white',
                        padding: '0.2rem 0.4rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        marginTop: '0.3rem',
                        display: 'inline-block'
                      }}>
                        UNGGULAN
                      </span>
                    )}
                  </td>
                  <td>{prod.category}</td>
                  <td style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {prod.description}
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(prod)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(prod.id)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} style={{textAlign:'center',color:'#aaa'}}>
                    Tidak ada produk
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}