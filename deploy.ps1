# Deployment script for Prix DDI application
# Domain: prinnov.benit.biz
# PowerShell version for Windows

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting deployment for prinnov.benit.biz..." -ForegroundColor Cyan

# Check if .env.prod exists
if (-not (Test-Path ".env.prod")) {
    Write-Host "❌ Error: .env.prod file not found!" -ForegroundColor Red
    Write-Host "Please create .env.prod file with required environment variables."
    Write-Host "You can copy .env.prod.example and fill in the values."
    exit 1
}

Write-Host "✅ Environment file found" -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Docker is not running" -ForegroundColor Red
    exit 1
}

# Check SSL certificates
$sslCert = "nginx\ssl\fullchain.pem"
$sslKey = "nginx\ssl\privkey.pem"

if (-not (Test-Path $sslCert) -or -not (Test-Path $sslKey)) {
    Write-Host "⚠️  SSL certificates not found in nginx\ssl\" -ForegroundColor Yellow
    Write-Host "Please obtain SSL certificates (Let's Encrypt recommended) and place them in:"
    Write-Host "  - nginx\ssl\fullchain.pem"
    Write-Host "  - nginx\ssl\privkey.pem"
    Write-Host ""
    Write-Host "You can use certbot to obtain certificates:"
    Write-Host "  certbot certonly --standalone -d prinnov.benit.biz -d www.prinnov.benit.biz"
    Write-Host ""
    $response = Read-Host "Continue without SSL? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        exit 1
    }
}

# Stop existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml down 2>&1 | Out-Null

# Build and start services
Write-Host "🔨 Building Docker images..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml build --no-cache

Write-Host "🚀 Starting services..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service health
Write-Host "🏥 Checking service health..." -ForegroundColor Yellow
$maxRetries = 30
$retryCount = 0
$healthy = $false

while ($retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend is healthy" -ForegroundColor Green
            $healthy = $true
            break
        }
    } catch {
        # Continue retrying
    }
    $retryCount++
    Write-Host "Waiting for backend... ($retryCount/$maxRetries)"
    Start-Sleep -Seconds 2
}

if (-not $healthy) {
    Write-Host "❌ Backend health check failed" -ForegroundColor Red
    Write-Host "Checking logs..."
    docker-compose -f docker-compose.prod.yml logs backend
    exit 1
}

# Show running containers
Write-Host "📦 Running containers:" -ForegroundColor Green
docker-compose -f docker-compose.prod.yml ps

# Show logs
Write-Host "📋 Recent logs:" -ForegroundColor Green
docker-compose -f docker-compose.prod.yml logs --tail=50

Write-Host ""
Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Application is available at:"
Write-Host "   - https://prinnov.benit.biz"
Write-Host ""
Write-Host "📊 To view logs:"
Write-Host "   docker-compose -f docker-compose.prod.yml logs -f"
Write-Host ""
Write-Host "🛑 To stop services:"
Write-Host "   docker-compose -f docker-compose.prod.yml down"
Write-Host ""

