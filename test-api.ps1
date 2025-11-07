# Test API Script untuk Atigame
Write-Host "Testing Atigame API..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET -ErrorAction Stop
    Write-Host "SUCCESS - Health Check: $($health | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "WARNING - Health endpoint not available: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# Test 2: GET Products
Write-Host "2. Testing GET /api/products..." -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method GET -ErrorAction Stop
    Write-Host "SUCCESS - Found $($products.Count) products" -ForegroundColor Green
    if ($products.Count -gt 0) {
        Write-Host "First product:" -ForegroundColor Cyan
        $products[0] | ConvertTo-Json -Depth 2
    } else {
        Write-Host "INFO - Database is empty (no products yet)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response body: $responseBody" -ForegroundColor Red
            $reader.Close()
        } catch {
            Write-Host "Could not read error response" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Test completed!" -ForegroundColor Cyan
