# === Hardcoded App Metadata ===
$SiteFolder    = "D:\OneDrive\code\temp\shrinanabhajan.github.io\ShriGajananVijay"  # Local site copy

$ErrorActionPreference = 'Stop'

# --- Generate appbundle.zip + version.json ---
$bundleOut = Join-Path $SiteFolder "appbundle.zip"
if (Test-Path $bundleOut) { Remove-Item $bundleOut -Force }
Compress-Archive -Path (Join-Path $SiteFolder "*") -DestinationPath $bundleOut -Force
Write-Host "Created bundle: $bundleOut"

$versionFile = Join-Path $SiteFolder "version.json"
$versionString = (Get-Date).ToString("yyyy.MM.dd.HHmm")
@"
{
  "version": "$versionString"
}
"@ | Set-Content -Encoding UTF8 $versionFile
Write-Host "Created version.json with version $versionString"