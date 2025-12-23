# Script untuk menambahkan Service Role Key ke .env.local
# Jalankan: .\add-service-role-key.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tambahkan Service Role Key" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path .env.local)) {
    Write-Host "File .env.local tidak ditemukan!" -ForegroundColor Red
    exit 1
}

Write-Host "Langkah-langkah:" -ForegroundColor Yellow
Write-Host "1. Buka: https://supabase.com/dashboard/project/snhxmzsbventvvczezxl/settings/api" -ForegroundColor White
Write-Host "2. Scroll ke bagian Project API keys" -ForegroundColor White
Write-Host "3. Salin service_role key - BUKAN anon key!" -ForegroundColor White
Write-Host ""
Write-Host "PENTING: Service Role Key memiliki akses penuh ke database!" -ForegroundColor Red
Write-Host "Jangan share key ini secara publik!" -ForegroundColor Red
Write-Host ""

$serviceKey = Read-Host "Paste Service Role Key di sini (atau tekan Enter untuk skip)"

if ([string]::IsNullOrWhiteSpace($serviceKey)) {
    Write-Host "Service Role Key tidak diisi. Script dibatalkan." -ForegroundColor Yellow
    exit 0
}

$envLines = Get-Content .env.local
$found = $false
$updated = $false
$newLines = @()

foreach ($line in $envLines) {
    if ($line -match "SUPABASE_SERVICE_ROLE_KEY") {
        $found = $true
        if ($line -match "^#.*SUPABASE_SERVICE_ROLE_KEY") {
            $newLines += "SUPABASE_SERVICE_ROLE_KEY=$serviceKey"
            $updated = $true
            Write-Host "Service Role Key sudah di-uncomment dan diisi!" -ForegroundColor Green
        } else {
            Write-Host "SUPABASE_SERVICE_ROLE_KEY sudah ada di file." -ForegroundColor Yellow
            $replace = Read-Host "Ganti dengan key baru? Ketik y untuk ya"
            
            if ($replace -eq "y" -or $replace -eq "Y") {
                $newLines += "SUPABASE_SERVICE_ROLE_KEY=$serviceKey"
                $updated = $true
                Write-Host "Service Role Key sudah diupdate!" -ForegroundColor Green
            } else {
                $newLines += $line
                Write-Host "Dibatalkan. Key tidak diubah." -ForegroundColor Yellow
                exit 0
            }
        }
    } else {
        $newLines += $line
    }
}

if (-not $found) {
    $foundComment = $false
    $finalLines = @()
    
    foreach ($line in $newLines) {
        if ($line -match "PENTING: Service Role Key" -and -not $foundComment) {
            $finalLines += "SUPABASE_SERVICE_ROLE_KEY=$serviceKey"
            $finalLines += $line
            $foundComment = $true
            $updated = $true
        } else {
            $finalLines += $line
        }
    }
    
    if (-not $foundComment) {
        $finalLines += ""
        $finalLines += "SUPABASE_SERVICE_ROLE_KEY=$serviceKey"
        $updated = $true
    }
    
    $newLines = $finalLines
    Write-Host "Service Role Key sudah ditambahkan!" -ForegroundColor Green
}

if ($updated) {
    $newLines | Set-Content .env.local -Encoding UTF8
    Write-Host ""
    Write-Host "Selesai! File .env.local sudah diupdate." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Tidak ada perubahan yang dilakukan." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
Write-Host "1. RESTART server (Ctrl+C lalu npm run dev)" -ForegroundColor White
Write-Host "2. Test: .\test-service-role-key.ps1" -ForegroundColor White
Write-Host "3. Coba upload produk dengan gambar" -ForegroundColor White
Write-Host ""
