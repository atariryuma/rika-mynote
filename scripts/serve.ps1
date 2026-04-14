#!/usr/bin/env pwsh
# ローカルプレビュー: http://127.0.0.1:8000/
Set-Location $PSScriptRoot\..
if (-not (Test-Path ".venv\Scripts\mkdocs.exe")) {
  Write-Error "venv が未作成です。README の初回セットアップを実行してください。"
  exit 1
}
& .\.venv\Scripts\mkdocs.exe serve --dev-addr 127.0.0.1:8000