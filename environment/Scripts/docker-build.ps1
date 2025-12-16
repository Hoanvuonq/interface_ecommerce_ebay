# PowerShell script to build and run Docker Compose for Frontend
# Usage: .\docker-build.ps1 [dev|staging|prod] [up|build|down|...]
# Example: .\docker-build.ps1 dev up --build

param(
    [ValidateSet('dev','staging','prod')]
    [string]$Environment = 'dev',
    
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$DockerComposeArgs = @('up', '--build')
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$EnvDir = Split-Path -Parent $ScriptDir
Set-Location $EnvDir

$ComposeFile = "compose/docker-compose.$Environment.yml"

if (-not (Test-Path $ComposeFile)) {
    Write-Host "Error: Compose file not found: $ComposeFile" -ForegroundColor Red
    exit 1
}

Write-Host "===============================" -ForegroundColor Cyan
Write-Host " Frontend Docker Compose" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host " Environment: $Environment" -ForegroundColor Yellow
Write-Host " Compose file: $ComposeFile" -ForegroundColor Yellow
Write-Host ""

docker compose -f $ComposeFile $DockerComposeArgs

