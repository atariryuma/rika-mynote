#!/usr/bin/env pwsh
<#
.SYNOPSIS
  新単元の雛形ディレクトリを _templates/unit から生成する。
.EXAMPLE
  .\scripts\new-unit.ps1 -Grade 5 -Slug mono-no-tokekata -Title "もののとけ方"
#>
param(
  [Parameter(Mandatory)][ValidateSet(5,6)][int]$Grade,
  [Parameter(Mandatory)][ValidatePattern('^[a-z0-9][a-z0-9-]*$')][string]$Slug,
  [Parameter(Mandatory)][string]$Title
)

$root = Split-Path -Parent $PSScriptRoot
$dir = Join-Path $root "docs\${Grade}nen\$Slug"
$tpl = Join-Path $root "_templates\unit"

if (Test-Path $dir) { Write-Error "既に存在します: $dir"; exit 1 }
if (-not (Test-Path $tpl)) { Write-Error "テンプレが見つかりません: $tpl"; exit 1 }

New-Item -ItemType Directory -Path $dir | Out-Null
$enc = New-Object System.Text.UTF8Encoding($false)
Get-ChildItem $tpl -Filter *.md | ForEach-Object {
  $content = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
  $content = $content.Replace("{{unit}}", $Title).Replace("{{grade}}", "$Grade")
  [System.IO.File]::WriteAllText((Join-Path $dir $_.Name), $content, $enc)
}

Write-Host ""
Write-Host "✅ 生成: $dir" -ForegroundColor Green
Write-Host ""
Write-Host "次にやること:" -ForegroundColor Yellow
Write-Host "  1) mkdocs.yml の nav に以下を追記:"
Write-Host ""
Write-Host "    - ${Title}:"
Write-Host "        - Plan: ${Grade}nen/${Slug}/plan.md"
Write-Host "        - Do & Check: ${Grade}nen/${Slug}/do-check.md"
Write-Host "        - Action: ${Grade}nen/${Slug}/action.md"
Write-Host ""
Write-Host "  2) docs/index.md と docs/${Grade}nen/index.md のテーブルに行を追加"
Write-Host "  3) .\scripts\check.ps1 で strict ビルド"