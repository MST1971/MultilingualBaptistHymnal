$path = "c:/apps/my-baptist-hymnal/src/components/HausaHymnDetail.js"
$lines = Get-Content $path
# Keep 1..1495 (Indices 0..1494)
# Skip 1496..1498 (Indices 1495..1497) - Simple if(!hymn)
# Keep 1499..1693 (Indices 1498..1692) - Logic
# Skip 1694..30244 (Indices 1693..30243) - Function and Duplicate const
# Keep 30245..End (Indices 30244..End)
$newLines = $lines[0..1494] + $lines[1498..1692] + $lines[30244..($lines.Count - 1)]
$newLines | Set-Content $path -Encoding UTF8
Write-Host "File trimmed successfully. New line count: " $newLines.Count