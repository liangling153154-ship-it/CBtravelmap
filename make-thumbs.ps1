# ============================================================
# make-thumbs.ps1 — generate small square thumbnails for map pins
# Reads every ASSETS image path referenced in data.js and writes a
# 128x128 center-cropped JPEG to "SEN WEB OTA - main\thumbs\<same path>".
# Re-run this whenever you add or change photos in data.js.
#   powershell -ExecutionPolicy Bypass -File .\make-thumbs.ps1
# ============================================================
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$assets = Join-Path $root "SEN WEB OTA - main"
$thumbRoot = Join-Path $assets "thumbs"
$dataJs = Get-Content (Join-Path $root "data.js") -Raw -Encoding UTF8

$paths = [regex]::Matches($dataJs, 'ASSETS \+ "([^"]+)"') | ForEach-Object { $_.Groups[1].Value } |
    Where-Object { $_ -match '\.(jpe?g|png)$' } | Sort-Object -Unique

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)

$size = 128
$done = 0; $skipped = 0
foreach ($rel in $paths) {
    $src = Join-Path $assets ($rel -replace "/", "\")
    if (-not (Test-Path $src)) { Write-Output "MISSING $rel"; $skipped++; continue }
    $dst = Join-Path $thumbRoot ($rel -replace "/", "\")
    New-Item -ItemType Directory -Force (Split-Path -Parent $dst) | Out-Null

    $img = [System.Drawing.Image]::FromFile($src)
    try {
        $side = [Math]::Min($img.Width, $img.Height)
        $srcX = [int](($img.Width - $side) / 2)
        $srcY = [int](($img.Height - $side) / 2)
        $bmp = New-Object System.Drawing.Bitmap($size, $size)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
        $srcRect = New-Object System.Drawing.Rectangle($srcX, $srcY, $side, $side)
        $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()
        if (Test-Path $dst) { Remove-Item $dst -Force }
        $bmp.Save($dst, $jpegCodec, $encParams)
        $bmp.Dispose()
        $done++
    } finally {
        $img.Dispose()
    }
}
Write-Output "thumbs done: $done, skipped: $skipped -> $thumbRoot"
