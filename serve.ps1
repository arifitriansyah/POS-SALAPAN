$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://*:$port/")
try {
    $listener.Start()
} catch {
    Write-Host "Binding to all interfaces requires Admin or specific prefix. Falling back to localhost..."
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
}

$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254*" } | Select-Object -First 1).IPAddress

Write-Host "========================================================" -ForegroundColor Green
Write-Host "  SERVER POS SALAPAN LOKAL AKTIF!" -ForegroundColor Yellow
Write-Host "  Akses dari Laptop : http://localhost:$port" -ForegroundColor Cyan
Write-Host "  Akses dari HP     : http://${localIP}:$port" -ForegroundColor Green
Write-Host "  (Pastikan laptop dan HP tersambung ke Wi-Fi yang sama)" -ForegroundColor Gray
Write-Host "  Tekan Ctrl + C untuk menghentikan server" -ForegroundColor Gray
Write-Host "========================================================" -ForegroundColor Green

$dir = $PSScriptRoot

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response
    
    $urlPath = $req.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrEmpty($urlPath)) { $urlPath = "index.html" }
    
    $filePath = Join-Path $dir $urlPath
    if (Test-Path $filePath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        switch ($ext) {
            ".html" { $res.ContentType = "text/html; charset=utf-8" }
            ".js"   { $res.ContentType = "application/javascript; charset=utf-8" }
            ".css"  { $res.ContentType = "text/css; charset=utf-8" }
            ".json" { $res.ContentType = "application/json; charset=utf-8" }
            Default { $res.ContentType = "application/octet-stream" }
        }
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $res.OutputStream.Write($msg, 0, $msg.Length)
    }
    $res.Close()
}
