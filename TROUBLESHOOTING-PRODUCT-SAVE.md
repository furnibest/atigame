# 🔧 Troubleshooting: Gagal Menyimpan Produk

## ✅ Perbaikan yang Sudah Dilakukan

### 1. **Error Handling di Frontend**
- ✅ Menambahkan error message yang lebih detail di alert
- ✅ Menambahkan console.log untuk debugging
- ✅ Menampilkan error message dari API response

### 2. **Logging di API Route**
- ✅ Menambahkan logging detail di setiap step:
  - Request received
  - Form data received
  - Image upload process
  - Database insert process
  - Success/error messages

### 3. **Error Messages**
- ✅ Error messages sekarang lebih informatif
- ✅ Menampilkan error message dari Supabase jika ada
- ✅ Menampilkan error message dari upload jika ada

---

## 🐛 Cara Debugging

### 1. **Cek Browser Console**
Buka browser DevTools (F12) → Console tab, lalu coba submit form. Anda akan melihat:
- Error message detail dari API
- Console.log dari frontend

### 2. **Cek Server Logs**
Di terminal tempat `npm run dev` berjalan, Anda akan melihat:
- `📦 POST /api/products - Request received`
- `📝 Form data: {...}`
- `🖼️ Image file detected: {...}` (jika ada gambar)
- `📤 Uploading image to Supabase...`
- `✅ Image uploaded: ...` atau `❌ Error uploading file: ...`
- `💾 Inserting product to database...`
- `✅ Product created successfully: ...` atau `❌ Supabase insert error: ...`

### 3. **Test API Langsung**
Gunakan PowerShell untuk test:
```powershell
$formData = @{
    name = "Test Product"
    description = "Test Description"
    category = "Meja"
    featured = "0"
}
Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method POST -Body $formData
```

---

## 🔍 Kemungkinan Masalah

### 1. **Environment Variables Tidak Terbaca**
**Gejala**: Error "Supabase environment variables are not set"

**Solusi**:
- Pastikan file `.env.local` ada di root folder
- Restart server setelah mengubah `.env.local`
- Atau set environment variables di PowerShell sebelum start server:
```powershell
$env:SUPABASE_URL="https://snhxmzsbventvvczezxl.supabase.co"
$env:SUPABASE_ANON_KEY="your_key_here"
npm run dev
```

### 2. **Image Upload Gagal**
**Gejala**: Error "Failed to upload image"

**Kemungkinan Penyebab**:
- File terlalu besar (>5MB)
- Format file tidak didukung
- Supabase Storage bucket tidak dikonfigurasi dengan benar
- Service Role Key tidak ada (diperlukan untuk upload)

**Solusi**:
- Pastikan file < 5MB
- Gunakan format: JPEG, PNG, GIF, WEBP
- Pastikan `SUPABASE_SERVICE_ROLE_KEY` ada di `.env.local`
- Cek Supabase Storage bucket `images` sudah dibuat

### 3. **Database Insert Gagal**
**Gejala**: Error "Failed to create product"

**Kemungkinan Penyebab**:
- RLS (Row Level Security) policy tidak mengizinkan insert
- Data tidak valid (null di field required)
- Koneksi ke Supabase gagal

**Solusi**:
- Cek RLS policies di Supabase dashboard
- Pastikan semua field required terisi
- Cek koneksi Supabase

### 4. **FormData Tidak Terkirim**
**Gejala**: Error "Unknown error" atau tidak ada data

**Solusi**:
- Pastikan form memiliki `enctype="multipart/form-data"` (otomatis dengan FormData)
- Cek Network tab di DevTools untuk melihat request yang dikirim
- Pastikan semua field form memiliki `name` attribute

---

## 📝 Checklist Sebelum Submit Form

- [ ] Nama produk sudah diisi
- [ ] Deskripsi sudah diisi
- [ ] Kategori sudah dipilih
- [ ] File gambar (jika ada) < 5MB dan format image
- [ ] Server sudah running
- [ ] Environment variables sudah di-set
- [ ] Browser console terbuka untuk melihat error

---

## 🚀 Test Manual

### Test tanpa gambar:
```javascript
// Di browser console
const formData = new FormData()
formData.append('name', 'Test Product')
formData.append('description', 'Test Description')
formData.append('category', 'Meja')
formData.append('featured', '0')

fetch('/api/products', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err))
```

### Test dengan gambar:
```javascript
// Di browser console
const formData = new FormData()
formData.append('name', 'Test Product')
formData.append('description', 'Test Description')
formData.append('category', 'Meja')
formData.append('featured', '0')

// Ambil file dari input file
const fileInput = document.querySelector('input[type="file"]')
if (fileInput.files[0]) {
  formData.append('image', fileInput.files[0])
}

fetch('/api/products', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err))
```

---

## 📞 Langkah Selanjutnya

1. **Coba submit form lagi** setelah restart server
2. **Cek browser console** untuk error message detail
3. **Cek server logs** untuk melihat step mana yang gagal
4. **Share error message** yang muncul untuk debugging lebih lanjut

---

**Last Updated**: 2025-11-07

