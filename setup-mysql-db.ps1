# Script untuk setup MySQL Database untuk ATIGAME
# Jalankan: .\setup-mysql-db.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup MySQL Database - ATIGAME" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cek apakah .env.local ada
if (-not (Test-Path .env.local)) {
    Write-Host "❌ File .env.local tidak ditemukan!" -ForegroundColor Red
    Write-Host "Buat file .env.local terlebih dahulu." -ForegroundColor Yellow
    exit 1
}

# Cek apakah DATABASE_URL sudah ada
$envContent = Get-Content .env.local -Raw
if ($envContent -match "DATABASE_URL\s*=") {
    Write-Host "✅ DATABASE_URL sudah ada di .env.local" -ForegroundColor Green
    $existingUrl = ([regex]::Match($envContent, 'DATABASE_URL\s*=\s*"([^"]+)"')).Groups[1].Value
    if ($existingUrl) {
        Write-Host "   Current: $existingUrl" -ForegroundColor Gray
    }
} else {
    Write-Host "📝 Menambahkan DATABASE_URL ke .env.local..." -ForegroundColor Yellow
    
    $dbUrl = "mysql://root:@localhost:3306/atigame"
    $dbUrlLine = "`n# MySQL Database Connection`nDATABASE_URL=`"$dbUrl`""
    
    Add-Content .env.local $dbUrlLine
    Write-Host "✅ DATABASE_URL ditambahkan: $dbUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Langkah-langkah:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Buat database 'atigame' di MySQL:" -ForegroundColor White
Write-Host "   - Buka phpMyAdmin (http://localhost/phpmyadmin)" -ForegroundColor Gray
Write-Host "   - Atau MySQL Workbench" -ForegroundColor Gray
Write-Host "   - Atau jalankan SQL: CREATE DATABASE atigame;" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Setelah database dibuat, jalankan:" -ForegroundColor White
Write-Host "   npm run db:push" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Restart server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Setup selesai! Ikuti langkah di atas untuk membuat database." -ForegroundColor Green
Write-Host ""
