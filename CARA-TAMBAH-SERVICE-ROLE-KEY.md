# 🔑 Cara Menambahkan Service Role Key

## ⚠️ Masalah
Error: "Failed to upload image: fetch failed" atau "SUPABASE_SERVICE_ROLE_KEY is required"

## ✅ Solusi

### **Cara 1: Menggunakan Script PowerShell (Mudah)**

1. Buka terminal di folder project
2. Jalankan script:
   ```powershell
   .\add-service-role-key.ps1
   ```
3. Ikuti instruksi di layar
4. Paste Service Role Key ketika diminta
5. Restart server

### **Cara 2: Manual**

1. **Dapatkan Service Role Key:**
   - Buka: https://supabase.com/dashboard/project/snhxmzsbventvvczezxl/settings/api
   - Scroll ke bagian **"Project API keys"**
   - Salin **"service_role"** key (BUKAN anon key!)
   - ⚠️ Key ini panjang, pastikan copy semua!

2. **Edit file `.env.local`:**
   - Buka file `.env.local` di root folder
   - Cari baris yang di-comment:
     ```env
     # SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
     ```
   - Uncomment dan ganti dengan key yang Anda salin:
     ```env
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   - Simpan file

3. **Restart Server:**
   - Stop server: Tekan `Ctrl+C` di terminal
   - Start lagi: `npm run dev`

4. **Test:**
   - Coba upload produk lagi
   - Seharusnya tidak ada error lagi

---

## 🔍 Cara Cek Apakah Key Sudah Benar

Setelah restart server, cek terminal. Anda akan melihat:
```
🔍 Environment Check:
SUPABASE_URL: ✅ SET
SUPABASE_SERVICE_ROLE_KEY: ✅ SET
SUPABASE_ANON_KEY: ✅ SET
```

Jika `SUPABASE_SERVICE_ROLE_KEY: ❌ NOT SET`, berarti:
- Key belum ditambahkan, atau
- Server belum di-restart setelah menambahkan key

---

## ⚠️ PENTING: Keamanan

**Service Role Key** memiliki akses penuh ke database dan storage:
- ✅ Bisa bypass Row Level Security (RLS)
- ✅ Bisa upload/delete file di storage
- ✅ Bisa insert/update/delete data tanpa batasan

**JANGAN:**
- ❌ Commit file `.env.local` ke Git
- ❌ Share key ini secara publik
- ❌ Gunakan di client-side code

**File `.env.local` sudah ada di `.gitignore`**, jadi aman untuk development lokal.

---

## 🐛 Troubleshooting

### Error: "Service Role Key tidak valid"
- Pastikan Anda copy **service_role** key, bukan anon key
- Pastikan tidak ada spasi di awal/akhir key
- Pastikan key lengkap (biasanya sangat panjang)

### Error: "fetch failed" masih muncul
1. Cek apakah key sudah benar di `.env.local`
2. Restart server (wajib!)
3. Cek koneksi internet
4. Cek apakah Supabase project masih aktif

### Produk tersimpan tapi tanpa gambar
- Ini normal jika upload gambar gagal
- Produk tetap tersimpan, hanya tanpa gambar
- Setelah Service Role Key ditambahkan, gambar akan ter-upload dengan benar

---

## 📞 Masih Ada Masalah?

Jika masih error setelah menambahkan Service Role Key:
1. Screenshot error message
2. Cek terminal untuk log server
3. Cek browser console (F12)
4. Share informasi tersebut untuk debugging lebih lanjut

