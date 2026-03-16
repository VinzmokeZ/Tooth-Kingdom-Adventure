Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("icon.png")
$sizes = @{
    "mdpi" = 48;
    "hdpi" = 72;
    "xhdpi" = 96;
    "xxhdpi" = 144;
    "xxxhdpi" = 192
}
foreach ($key in $sizes.Keys) {
    $size = $sizes[$key]
    $newImg = [System.Drawing.Bitmap]::new($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($newImg)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $size, $size)
    $g.Dispose()
    
    $dir = "android\app\src\main\res\mipmap-$key"
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force }
    
    $path = Join-Path $dir "ic_launcher.png"
    $newImg.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $pathRound = Join-Path $dir "ic_launcher_round.png"
    $newImg.Save($pathRound, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $newImg.Dispose()
    Write-Host "Generated $path"
}
$img.Dispose()
