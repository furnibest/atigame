# 🔧 Environment Variables Setup Guide

## ⚠️ PENTING: Next.js Environment Variables

Next.js membedakan environment variables untuk **client-side** dan **server-side**:

### Client-Side (Browser)
Variables dengan prefix `NEXT_PUBLIC_` akan di-bundle dan bisa diakses di browser:
```env
NEXT_PUBLIC_SUPABASE_URL=https://snhxmzsbventvvczezxl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Server-Side (API Routes)
Variables **TANPA prefix** hanya bisa diakses di server-side (API routes, getServerSideProps, etc):
```env
SUPABASE_URL=https://snhxmzsbventvvczezxl.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_STORAGE_BUCKET=images
```

## 📝 File .env.local Lengkap

Buat file `.env.local` di root folder `atigame` dengan isi:

```env
# Frontend (Client-side) - dengan prefix NEXT_PUBLIC_
NEXT_PUBLIC_SUPABASE_URL=https://snhxmzsbventvvczezxl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuaHhtenNidmVudHZ2Y3plenhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTEyODEsImV4cCI6MjA3ODAyNzI4MX0.zGvhLpD3XRFwwCEaAONiXg3TU0do_mVY4CFXhHuNroY

# Backend (Server-side) - TANPA prefix untuk API routes
SUPABASE_URL=https://snhxmzsbventvvczezxl.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuaHhtenNidmVudHZ2Y3plenhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTEyODEsImV4cCI6MjA3ODAyNzI4MX0.zGvhLpD3XRFwwCEaAONiXg3TU0do_mVY4CFXhHuNroY
SUPABASE_STORAGE_BUCKET=images

# Optional - untuk fitur admin yang memerlukan elevated permissions
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 🔄 Restart Server

**PENTING:** Setelah menambahkan atau mengubah `.env.local`, RESTART dev server:

```bash
# Stop server (Ctrl+C di terminal)
# Atau paksa stop semua Node processes:
taskkill /F /IM node.exe

# Start ulang:
npm run dev
```

## 🐛 Troubleshooting

### Error: "Supabase environment variables are not set"

**Penyebab:** Environment variables tidak terbaca oleh API routes.

**Solusi:**
1. ✅ Pastikan file `.env.local` ada di root folder (sejajar dengan `package.json`)
2. ✅ Pastikan ada variables **TANPA prefix** `NEXT_PUBLIC_`:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` atau `SUPABASE_SERVICE_ROLE_KEY`
3. ✅ **RESTART** dev server setelah menambahkan variables
4. ✅ Cek apakah ada typo di nama variable

### Cek Environment Variables di Runtime

Tambahkan console.log di `src/lib/supabase.ts`:

```typescript
console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')
```

## 📚 Next.js Docs

- [Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Runtime Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#runtime-environment-variables)

## ✅ Current Setup Status

✅ Database: Product table created  
✅ Storage: images bucket configured  
✅ RLS: Enabled with policies  
✅ API Keys: Anon key configured  
⚠️ Service Role Key: Optional (untuk admin features)

**Server Status:** Running on http://localhost:3000

