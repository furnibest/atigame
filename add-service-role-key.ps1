# Script untuk menambahkan Service Role Key ke .env.local
# Jalankan script ini: .\add-service-role-key.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tambahkan Service Role Key" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cek apakah .env.local ada
if (-not (Test-Path .env.local)) {
    Write-Host "❌ File .env.local tidak ditemukan!" -ForegroundColor Red
    Write-Host "Jalankan setup terlebih dahulu." -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Langkah-langkah:" -ForegroundColor Yellow
Write-Host "1. Buka: https://supabase.com/dashboard/project/snhxmzsbventvvczezxl/settings/api" -ForegroundColor White
Write-Host "2. Scroll ke bagian 'Project API keys'" -ForegroundColor White
Write-Host "3. Salin 'service_role' key (BUKAN anon key!)" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  PENTING: Service Role Key memiliki akses penuh ke database!" -ForegroundColor Red
Write-Host "   Jangan share key ini secara publik!" -ForegroundColor Red
Write-Host ""

$serviceKey = Read-Host "Paste Service Role Key di sini (atau tekan Enter untuk skip)"

if ([string]::IsNullOrWhiteSpace($serviceKey)) {
    Write-Host "❌ Service Role Key tidak diisi. Script dibatalkan." -ForegroundColor Yellow
    exit 0
}

# Baca file .env.local
$envContent = Get-Content .env.local -Raw

# Cek apakah SUPABASE_SERVICE_ROLE_KEY sudah ada
if ($envContent -match "SUPABASE_SERVICE_ROLE_KEY\s*=") {
    Write-Host "⚠️  SUPABASE_SERVICE_ROLE_KEY sudah ada di file." -ForegroundColor Yellow
    $replace = Read-Host "Ganti dengan key baru? (y/n)"
    
    if ($replace -eq "y" -or $replace -eq "Y") {
        # Replace existing key
        $envContent = $envContent -replace "SUPABASE_SERVICE_ROLE_KEY\s*=.*", "SUPABASE_SERVICE_ROLE_KEY=$serviceKey"
        Write-Host "✅ Service Role Key sudah diupdate!" -ForegroundColor Green
    } else {
        Write-Host "❌ Dibatalkan." -ForegroundColor Yellow
        exit 0
    }
} else {
    # Tambahkan key baru sebelum comment
    $newLine = "SUPABASE_SERVICE_ROLE_KEY=$serviceKey`n"
    $envContent = $envContent -replace "(# PENTING: Service Role Key)", "$newLine`$1"
    Write-Host "✅ Service Role Key sudah ditambahkan!" -ForegroundColor Green
}

# Simpan file
$envContent | Set-Content .env.local -Encoding UTF8

Write-Host ""
Write-Host "✅ Selesai! File .env.local sudah diupdate." -ForegroundColor Green
Write-Host ""
Write-Host "📝 Langkah selanjutnya:" -ForegroundColor Yellow
Write-Host "1. RESTART server (Ctrl+C lalu npm run dev)" -ForegroundColor White
Write-Host "2. Coba upload produk lagi" -ForegroundColor White
Write-Host ""

