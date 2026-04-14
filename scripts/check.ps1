#!/usr/bin/env pwsh
# 厳格ビルド（CI 相当）。警告ゼロでないと失敗します。
Set-Location $PSScriptRoot\..
if (-not (Test-Path ".venv\Scripts\mkdocs.exe")) {
  Write-Error "venv が未作成です。README の初回セットアップを実行してください。"
  exit 1
}
& .\.venv\Scripts\mkdocs.exe build --strict --clean
if ($LASTEXITCODE -eq 0) { Write-Host "`n✅ strict build OK" -ForegroundColor Green }
else { Write-Host "`n❌ strict build FAILED" -ForegroundColor Red; exit $LASTEXITCODE }