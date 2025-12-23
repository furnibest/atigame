# Script untuk test apakah Service Role Key sudah benar
# Jalankan: .\test-service-role-key.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Service Role Key" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cek apakah .env.local ada
if (-not (Test-Path .env.local)) {
    Write-Host "❌ File .env.local tidak ditemukan!" -ForegroundColor Red
    exit 1
}

# Baca file .env.local
$envContent = Get-Content .env.local -Raw

# Cek apakah SUPABASE_SERVICE_ROLE_KEY ada
if ($envContent -match "SUPABASE_SERVICE_ROLE_KEY\s*=") {
    # Cek apakah di-comment
    if ($envContent -match "#\s*SUPABASE_SERVICE_ROLE_KEY\s*=") {
        Write-Host "❌ Service Role Key masih di-comment (ada tanda #)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Solusi:" -ForegroundColor Yellow
        Write-Host "1. Edit file .env.local" -ForegroundColor White
        Write-Host "2. Hapus tanda # di depan SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor White
        Write-Host "3. Restart server" -ForegroundColor White
        exit 1
    }
    
    # Extract key value
    if ($envContent -match "SUPABASE_SERVICE_ROLE_KEY\s*=\s*([^\s`"]+)") {
        $keyValue = $matches[1]
        
        if ($keyValue -eq "your_service_role_key_here" -or $keyValue -eq "") {
            Write-Host "❌ Service Role Key masih menggunakan placeholder" -ForegroundColor Red
            Write-Host ""
            Write-Host "Solusi:" -ForegroundColor Yellow
            Write-Host "1. Buka: https://supabase.com/dashboard/project/snhxmzsbventvvczezxl/settings/api" -ForegroundColor White
            Write-Host "2. Copy 'service_role' key" -ForegroundColor White
            Write-Host "3. Edit .env.local dan paste key tersebut" -ForegroundColor White
            Write-Host "4. Restart server" -ForegroundColor White
            exit 1
        }
        
        # Check key format (should start with eyJ)
        if ($keyValue -notmatch "^eyJ") {
            Write-Host "⚠️  Service Role Key format mungkin tidak benar (harus dimulai dengan eyJ)" -ForegroundColor Yellow
        }
        
        Write-Host "✅ Service Role Key sudah di-set" -ForegroundColor Green
        Write-Host "   Key length: $($keyValue.Length) characters" -ForegroundColor Gray
        Write-Host ""
        Write-Host "⚠️  Pastikan server sudah di-restart setelah mengubah .env.local!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Test upload gambar sekarang:" -ForegroundColor Cyan
        Write-Host "1. Buka: http://localhost:3000/admin/products" -ForegroundColor White
        Write-Host "2. Edit produk yang ada atau buat produk baru dengan gambar" -ForegroundColor White
        Write-Host "3. Foto harus muncul sekarang!" -ForegroundColor White
    }
} else {
    Write-Host "❌ SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env.local" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solusi:" -ForegroundColor Yellow
    Write-Host "Jalankan: .\add-service-role-key.ps1" -ForegroundColor Cyan
    exit 1
}

Write-Host ""

