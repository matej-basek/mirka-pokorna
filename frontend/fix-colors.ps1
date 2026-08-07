$files = Get-ChildItem -Path "c:\Users\matej\Desktop\Mirka Pokorna\frontend\src\components\*.tsx"
foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw
    $c = $c -replace "color:\s*'rgba\(255,\s*255,\s*255,", "color: 'rgba(17, 17, 17,"
    $c = $c -replace "color:\s*'#fff'", "color: '#111'"
    $c = $c -replace "color:\s*'#ffffff'", "color: '#111111'"
    $c = $c -replace "color:\s*'rgba\(255,\s*255,\s*255'", "color: 'rgba(17, 17, 17'"
    Set-Content -Path $f.FullName -Value $c
}
