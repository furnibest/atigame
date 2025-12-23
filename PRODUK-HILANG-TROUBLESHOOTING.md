# 🔧 Troubleshooting: Produk Hilang Setelah Upload

## 🐛 Masalah

Produk yang sudah di-upload hilang atau tidak muncul setelah disimpan.

## ✅ Perbaikan yang Sudah Dilakukan

### 1. **Validasi Input**

- ✅ Validasi field required (name, description, category)
- ✅ Error message yang lebih jelas dan informatif
- ✅ Validasi sebelum insert ke database

### 2. **Error Handling**

- ✅ Logging detail di setiap step proses
- ✅ Error message yang lebih informatif dengan detail dari Supabase
- ✅ Console logging untuk debugging

### 3. **Data Fetching**

- ✅ Cache-busting untuk memastikan data terbaru
- ✅ Logging jumlah produk yang di-load
- ✅ Error handling yang lebih baik

---

## 🔍 Cara Debugging

### 1. **Cek Browser Console**

Buka browser DevTools (F12) → Console tab, lalu:

- Upload produk baru
- Lihat log yang muncul:
  - `📦 Fetched products: [...]` - jumlah produk yang di-load
  - `✅ Loaded X products` - konfirmasi produk ter-load
  - `❌ Error fetching products: ...` - jika ada error

### 2. **Cek Server Logs**

Di terminal tempat `npm run dev` berjalan, cari:

- `📦 POST /api/products - Request received`
- `📝 Form data: {...}`
- `💾 Insert payload: {...}`
- `✅ Product created successfully: [ID]` atau `❌ Supabase insert error: ...`

### 3. **Cek Supabase Dashboard**

1. Buka Supabase Dashboard → Table Editor
2. Pilih tabel `Product`
3. Cek apakah produk ada di database
4. Jika ada di database tapi tidak muncul di aplikasi = masalah fetch
5. Jika tidak ada di database = masalah insert

---

## 🚨 Kemungkinan Penyebab & Solusi

### 1. **Service Role Key Tidak Ada**

**Gejala**:

- Error "Supabase environment variables are not set"
- Produk tidak tersimpan ke database
- Error di console: "permission denied" atau "RLS policy violation"

**Solusi**:

1. Buka file `.env.local` di root folder
2. Pastikan ada `SUPABASE_SERVICE_ROLE_KEY`:
   ```env
   SUPABASE_URL=https://snhxmzsbventvvczezxl.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_STORAGE_BUCKET=images
   ```
3. **Cara mendapatkan Service Role Key**:
   - Buka Supabase Dashboard
   - Settings → API
   - Copy "service_role" key (BUKAN anon key!)
   - Paste ke `.env.local`
4. **Restart server** setelah mengubah `.env.local`

### 2. **RLS (Row Level Security) Policy**

**Gejala**:

- Error "new row violates row-level security policy"
- Produk tidak tersimpan meskipun tidak ada error

**Solusi**:

1. Buka Supabase Dashboard → Authentication → Policies
2. Pilih tabel `Product`
3. Pastikan ada policy untuk INSERT:
   ```sql
   -- Policy untuk INSERT (create product)
   CREATE POLICY "Allow service role to insert products"
   ON public."Product"
   FOR INSERT
   TO service_role
   WITH CHECK (true);
   ```
4. Atau disable RLS sementara untuk testing:
   ```sql
   ALTER TABLE public."Product" DISABLE ROW LEVEL SECURITY;
   ```
   ⚠️ **Peringatan**: Hanya untuk development/testing!

### 3. **Cache Issue**

**Gejala**:

- Produk tersimpan di database tapi tidak muncul di list
- Refresh halaman tidak membantu

**Solusi**:

- ✅ Sudah diperbaiki dengan cache-busting
- Jika masih terjadi, coba:
  1. Hard refresh: `Ctrl + Shift + R` (Windows) atau `Cmd + Shift + R` (Mac)
  2. Clear browser cache
  3. Restart development server

### 4. **Data Tidak Valid**

**Gejala**:

- Error "null value in column 'name' violates not-null constraint"
- Error validation di console

**Solusi**:

- ✅ Sudah diperbaiki dengan validasi di API
- Pastikan semua field required terisi:
  - Nama produk (wajib)
  - Deskripsi (wajib)
  - Kategori (wajib)

### 5. **Network Error**

**Gejala**:

- Error "Failed to fetch" di console
- Request timeout

**Solusi**:

1. Cek koneksi internet
2. Cek apakah server masih running
3. Cek apakah Supabase URL benar di `.env.local`

---

## 📋 Checklist Troubleshooting

Sebelum melaporkan masalah, pastikan:

- [ ] File `.env.local` ada dan berisi `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Server sudah di-restart setelah mengubah `.env.local`
- [ ] Browser console terbuka dan tidak ada error merah
- [ ] Server logs menunjukkan `✅ Product created successfully`
- [ ] Sudah cek Supabase Dashboard → Table Editor untuk melihat produk
- [ ] Sudah coba hard refresh (`Ctrl + Shift + R`)
- [ ] Semua field form terisi dengan benar

---

## 🧪 Test Manual

### Test 1: Cek Environment Variables

```powershell
# Di PowerShell, jalankan:
node -e "console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET'); console.log('SERVICE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET')"
```

### Test 2: Test API Langsung

```javascript
// Di browser console (F12)
const formData = new FormData();
formData.append("name", "Test Product");
formData.append("description", "Test Description");
formData.append("category", "Meja");
formData.append("featured", "0");

fetch("/api/products", {
  method: "POST",
  body: formData,
})
  .then((res) => res.json())
  .then((data) => {
    console.log("✅ Success:", data);
    // Refresh halaman untuk melihat produk baru
    setTimeout(() => window.location.reload(), 1000);
  })
  .catch((err) => console.error("❌ Error:", err));
```

### Test 3: Cek Database Langsung

1. Buka Supabase Dashboard
2. Table Editor → Product
3. Cek apakah produk ada di database
4. Jika ada tapi tidak muncul di aplikasi = masalah fetch
5. Jika tidak ada = masalah insert

---

## 📞 Langkah Selanjutnya

Jika masalah masih terjadi setelah mengikuti langkah di atas:

1. **Screenshot error message** dari:

   - Browser console
   - Server logs
   - Supabase Dashboard (jika ada error)

2. **Cek Supabase Dashboard**:

   - Apakah produk ada di tabel `Product`?
   - Apakah ada error di Logs → Postgres Logs?

3. **Share informasi berikut**:
   - Error message lengkap
   - Screenshot console/server logs
   - Status produk di Supabase Dashboard
   - Apakah `SUPABASE_SERVICE_ROLE_KEY` sudah di-set?

---

## 🔐 Penting: Service Role Key

**Service Role Key** adalah kunci penting untuk:

- ✅ Bypass RLS (Row Level Security)
- ✅ Upload file ke Storage
- ✅ Insert/Update/Delete data tanpa batasan policy

**JANGAN** share Service Role Key secara publik! Key ini memiliki akses penuh ke database.

---

**Last Updated**: 2025-01-24
**Status**: ✅ Validasi & Error Handling diperbaiki
