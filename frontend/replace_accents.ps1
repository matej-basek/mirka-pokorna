$files = Get-ChildItem -Path "c:\Users\matej\Desktop\Mirka Pokorna\frontend\src\components\*.tsx"
foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw
    $c = $c -replace "#c5a059", "#d68ca3"
    $c = $c -replace "#ffb7c5", "#d68ca3"
    $c = $c -replace "rgba\(\s*197\s*,\s*160\s*,\s*89\s*,", "rgba(214, 140, 163,"
    $c = $c -replace "rgba\(\s*255\s*,\s*183\s*,\s*197\s*,", "rgba(214, 140, 163,"
    $c = $c -replace "rgba\(\s*255\s*,\s*133\s*,\s*161\s*,", "rgba(214, 140, 163,"
    Set-Content -Path $f.FullName -Value $c
}
