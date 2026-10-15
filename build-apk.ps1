# Boring Focus - Android APK Build & Packaging Script

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Boring Focus Android APK Build Tool" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$androidDir = Join-Path $scriptDir "android"
$assetsWwwDir = Join-Path $androidDir "app\src\main\assets\www"
$releaseDir = Join-Path $scriptDir "release"

# 1. Sync web assets into Android project
Write-Host "[1/3] Syncing distribution assets into android/app/src/main/assets/www/..." -ForegroundColor Green
if (!(Test-Path $assetsWwwDir)) {
    New-Item -ItemType Directory -Force -Path $assetsWwwDir | Out-Null
}
Copy-Item (Join-Path $scriptDir "index.html") -Destination (Join-Path $assetsWwwDir "index.html") -Force
Copy-Item (Join-Path $scriptDir "manifest.json") -Destination (Join-Path $assetsWwwDir "manifest.json") -Force
Copy-Item (Join-Path $scriptDir "sw.js") -Destination (Join-Path $assetsWwwDir "sw.js") -Force
Write-Host "  -> Web assets synced successfully." -ForegroundColor Gray

# 2. Check for Java & Android SDK
Write-Host "[2/3] Checking build environment for Java & Gradle..." -ForegroundColor Green
$javaCmd = Get-Command "java" -ErrorAction SilentlyContinue
$gradleCmd = Get-Command "gradle" -ErrorAction SilentlyContinue

if ($javaCmd -and $gradleCmd) {
    Write-Host "  -> Java and Gradle found! Running native APK compilation..." -ForegroundColor Green
    Set-Location $androidDir
    & gradle assembleDebug
    Set-Location $scriptDir

    $apkOutput = Join-Path $androidDir "app\build\outputs\apk\debug\app-debug.apk"
    if (Test-Path $apkOutput) {
        if (!(Test-Path $releaseDir)) { New-Item -ItemType Directory -Force -Path $releaseDir | Out-Null }
        $targetApk = Join-Path $releaseDir "BoringFocus-v1.0.0-debug.apk"
        Copy-Item $apkOutput -Destination $targetApk -Force
        Write-Host "==========================================================" -ForegroundColor Cyan
        Write-Host "  SUCCESS! APK generated:" -ForegroundColor Green
        Write-Host "  $targetApk" -ForegroundColor Yellow
        Write-Host "==========================================================" -ForegroundColor Cyan
        exit 0
    }
}

# If no native local toolchain is installed
Write-Host "  -> Local Java/Gradle compiler not found in system PATH." -ForegroundColor Yellow
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Options to get your APK immediately:" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Option 1 (Instant 1-Click on Phone - WebAPK):" -ForegroundColor White
Write-Host "  Open http://localhost:5173 (or your local IP) in Chrome on Android."
Write-Host "  Tap Menu (3 dots) -> 'Install app' or 'Add to Home screen'."
Write-Host "  Android compiles and installs the native APK directly on your phone!" -ForegroundColor Green
Write-Host ""
Write-Host "Option 2 (Android Studio):" -ForegroundColor White
Write-Host "  Open Android Studio -> 'Open Project' -> select '$androidDir'"
Write-Host "  Click 'Build' -> 'Build Bundle(s) / APK(s)' -> 'Build APK(s)'."
Write-Host ""
Write-Host "Option 3 (GitHub Actions Cloud Build):" -ForegroundColor White
Write-Host "  Push this folder to a GitHub repository."
Write-Host "  The included .github/workflows/build-apk.yml will build"
Write-Host "  and upload the .apk file automatically in under 2 minutes!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
