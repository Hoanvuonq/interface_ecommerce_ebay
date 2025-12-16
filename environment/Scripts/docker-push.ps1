# PowerShell script to build, tag and push Frontend image to Docker Hub
# Usage: .\docker-push.ps1 [dev|staging|prod] [tag]
# Example: .\docker-push.ps1 prod latest

param(
    [ValidateSet('dev','staging','prod')]
    [string]$Environment = 'prod',
    
    [string]$Tag = 'latest'
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$EnvDir = Split-Path -Parent $ScriptDir
Set-Location $EnvDir

$ComposeFile = "compose/docker-compose.$Environment.yml"
$DockerHubUser = "quy123zz"
$DockerHubRepo = "ecom_ebay"

Write-Host "===============================" -ForegroundColor Cyan
Write-Host " Frontend Docker Build & Push" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host " Environment: $Environment" -ForegroundColor Yellow
Write-Host " Tag: $Tag" -ForegroundColor Yellow
Write-Host " Repository: $DockerHubUser/$DockerHubRepo" -ForegroundColor Yellow
Write-Host ""

# Build image
Write-Host "[1/3] Building image..." -ForegroundColor Cyan
docker compose -f $ComposeFile build
if ($LASTEXITCODE -ne 0) { 
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1 
}

# Get image ID
Write-Host "[2/3] Detecting image ID..." -ForegroundColor Cyan
$ImageId = (docker compose -f $ComposeFile images --quiet nextjs-frontend 2>&1 | Where-Object { $_ -match '^[a-f0-9]{12,64}$' } | Select-Object -First 1).Trim()

if ([string]::IsNullOrEmpty($ImageId)) {
    Write-Host "ERROR: Image ID not found!" -ForegroundColor Red
    exit 1
}

Write-Host " Image ID: $ImageId" -ForegroundColor Green
Write-Host ""

# Tag and push
Write-Host "[3/3] Tagging and pushing..." -ForegroundColor Cyan
$FrontendTag = "$DockerHubUser/${DockerHubRepo}:frontend-$Tag"

Write-Host " Tagging: $FrontendTag" -ForegroundColor Yellow
docker tag $ImageId $FrontendTag
if ($LASTEXITCODE -ne 0) { 
    Write-Host "ERROR: Tagging failed!" -ForegroundColor Red
    exit 1 
}

Write-Host " Docker login..." -ForegroundColor Yellow
docker login
if ($LASTEXITCODE -ne 0) { 
    Write-Host "ERROR: Login failed!" -ForegroundColor Red
    exit 1 
}

Write-Host " Pushing: $FrontendTag" -ForegroundColor Yellow
docker push $FrontendTag
if ($LASTEXITCODE -ne 0) { 
    Write-Host "ERROR: Push failed!" -ForegroundColor Red
    exit 1 
}

Write-Host ""
Write-Host "===============================" -ForegroundColor Green
Write-Host " PUSH COMPLETED!" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host " Image: $FrontendTag" -ForegroundColor Green
Write-Host ""

