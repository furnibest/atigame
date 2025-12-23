# Script untuk cek konfigurasi Storage Bucket
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  CEK KONFIGURASI STORAGE BUCKET" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Cek environment variable
if (Test-Path .env.local) {
    $envContent = Get-Content .env.local -Raw
    
    Write-Host "1. Cek Environment Variables:" -ForegroundColor Yellow
    Write-Host ""
    
    if ($envContent -match "SUPABASE_STORAGE_BUCKET\s*=\s*(\S+)") {
        $bucketName = $matches[1].Trim()
        Write-Host "   SUPABASE_STORAGE_BUCKET: $bucketName" -ForegroundColor Green
    } else {
        Write-Host "   SUPABASE_STORAGE_BUCKET: NOT SET (akan menggunakan default: 'images')" -ForegroundColor Yellow
        $bucketName = "images"
    }
    
    Write-Host ""
    Write-Host "2. Service Role Key:" -ForegroundColor Yellow
    if ($envContent -match "SUPABASE_SERVICE_ROLE_KEY\s*=\s*(\S+)") {
        Write-Host "   ✅ Service Role Key sudah di-set" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Service Role Key belum di-set" -ForegroundColor Red
        Write-Host "   (Wajib untuk upload gambar ke Storage)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  CEK STORAGE BUCKET DI SUPABASE" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Buka Supabase Dashboard untuk cek bucket:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   URL: https://supabase.com/dashboard/project/snhxmzsbventvvczezxl/storage/buckets" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Yang perlu dicek:" -ForegroundColor White
    Write-Host "   1. Apakah bucket '$bucketName' sudah ada?" -ForegroundColor Gray
    Write-Host "   2. Apakah bucket '$bucketName' adalah PUBLIC?" -ForegroundColor Gray
    Write-Host "   3. Apakah Storage Policies mengizinkan upload?" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Panduan lengkap: CEK-DAN-FIX-SUPABASE-STORAGE.md" -ForegroundColor Yellow
    Write-Host ""
    
} else {
    Write-Host "❌ File .env.local tidak ditemukan!" -ForegroundColor Red
    Write-Host "   Buat file .env.local terlebih dahulu." -ForegroundColor Yellow
}

