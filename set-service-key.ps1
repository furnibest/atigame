# Script sederhana untuk set Service Role Key
# Usage: .\set-service-key.ps1 "your_service_role_key_here"

param(
    [Parameter(Mandatory=$false)]
    [string]$ServiceKey = ""
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Set Service Role Key" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Jika tidak ada parameter, minta input
if ([string]::IsNullOrWhiteSpace($ServiceKey)) {
    Write-Host "Untuk menggunakan script ini, ada 2 cara:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Cara 1 (Parameter):" -ForegroundColor White
    Write-Host '  .\set-service-key.ps1 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."' -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Cara 2 (Input):" -ForegroundColor White
    Write-Host "  .\set-service-key.ps1" -ForegroundColor Cyan
    Write-Host "  (Lalu paste key ketika diminta)" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Dapatkan Service Role Key dari:" -ForegroundColor Yellow
    Write-Host "  https://supabase.com/dashboard/project/snhxmzsbventvvczezxl/settings/api" -ForegroundColor Cyan
    Write-Host ""
    
    $ServiceKey = Read-Host "Paste Service Role Key di sini"
}

if ([string]::IsNullOrWhiteSpace($ServiceKey)) {
    Write-Host "Service Role Key tidak diisi. Script dibatalkan." -ForegroundColor Red
    exit 1
}

# Cek file .env.local
if (-not (Test-Path .env.local)) {
    Write-Host "File .env.local tidak ditemukan!" -ForegroundColor Red
    Write-Host "Buat file .env.local terlebih dahulu." -ForegroundColor Yellow
    exit 1
}

# Baca file
$content = Get-Content .env.local -Raw

# Pattern untuk mencari SUPABASE_SERVICE_ROLE_KEY (yang di-comment atau tidak)
$pattern = "(?m)^\s*#?\s*SUPABASE_SERVICE_ROLE_KEY\s*=.*$"

if ($content -match $pattern) {
    # Replace existing line
    $newContent = $content -replace $pattern, "SUPABASE_SERVICE_ROLE_KEY=$ServiceKey"
    Write-Host "✅ Service Role Key sudah diupdate!" -ForegroundColor Green
} else {
    # Tambahkan baru di akhir file
    $newContent = $content.TrimEnd() + "`n`n# Service Role Key`nSUPABASE_SERVICE_ROLE_KEY=$ServiceKey`n"
    Write-Host "✅ Service Role Key sudah ditambahkan!" -ForegroundColor Green
}

# Simpan file
$newContent | Set-Content .env.local -Encoding UTF8 -NoNewline

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  BERHASIL!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
Write-Host "1. RESTART server (Ctrl+C lalu npm run dev)" -ForegroundColor White
Write-Host "2. Test: .\test-service-role-key.ps1" -ForegroundColor White
Write-Host "3. Coba upload produk dengan gambar" -ForegroundColor White
Write-Host ""

