param(
  [string]$EdgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
  [string]$PageUrl = "file:///C:/Users/Usuario/Downloads/PG/Esteban/index.html"
)

$ErrorActionPreference = "Stop"
$port = 9387
$root = Split-Path -Parent $PSScriptRoot
$browserProfilePath = Join-Path $root ".browser-smoke"
$screenshotDirectory = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $browserProfilePath, $screenshotDirectory | Out-Null

$arguments = @(
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--remote-debugging-port=$port",
  "--user-data-dir=$browserProfilePath",
  "--window-size=1440,1000",
  $PageUrl
)

$edge = Start-Process -FilePath $EdgePath -ArgumentList $arguments -PassThru -WindowStyle Hidden
$socket = $null
$script:messageId = 0

function Receive-CdpMessage {
  $stream = New-Object System.IO.MemoryStream
  do {
    $buffer = New-Object byte[] 65536
    $segment = New-Object System.ArraySegment[byte] -ArgumentList @(,$buffer)
    $result = $script:socket.ReceiveAsync($segment, [System.Threading.CancellationToken]::None).Result
    $stream.Write($buffer, 0, $result.Count)
  } while (-not $result.EndOfMessage)

  $json = [System.Text.Encoding]::UTF8.GetString($stream.ToArray())
  $stream.Dispose()
  return $json | ConvertFrom-Json
}

function Invoke-Cdp([string]$Method, [hashtable]$Parameters = @{}) {
  $script:messageId += 1
  $id = $script:messageId
  $payload = @{ id = $id; method = $Method; params = $Parameters } | ConvertTo-Json -Depth 12 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
  $segment = New-Object System.ArraySegment[byte] -ArgumentList @(,$bytes)
  $script:socket.SendAsync(
    $segment,
    [System.Net.WebSockets.WebSocketMessageType]::Text,
    $true,
    [System.Threading.CancellationToken]::None
  ).Wait()

  do { $message = Receive-CdpMessage } while ($null -eq $message.id -or [int]$message.id -ne $id)
  if ($message.error) { throw "${Method}: $($message.error.message)" }
  return $message.result
}

function Evaluate([string]$Expression) {
  $response = Invoke-Cdp "Runtime.evaluate" @{
    expression = $Expression
    returnByValue = $true
    awaitPromise = $true
  }
  if ($response.exceptionDetails) {
    $detail = $response.exceptionDetails.exception.description
    if (-not $detail) { $detail = $response.exceptionDetails.text }
    throw $detail
  }
  return $response.result.value
}

function Assert-Equal($Actual, $Expected, [string]$Label) {
  if ($Actual -ne $Expected) { throw "$Label — esperado: $Expected; recibido: $Actual" }
  Write-Host "OK  $Label"
}

function Save-Screenshot([string]$Name) {
  $capture = Invoke-Cdp "Page.captureScreenshot" @{ format = "png"; fromSurface = $true }
  $path = Join-Path $screenshotDirectory $Name
  [System.IO.File]::WriteAllBytes($path, [Convert]::FromBase64String($capture.data))
  Write-Host "OK  Captura $Name"
}

try {
  $target = $null
  for ($attempt = 0; $attempt -lt 30 -and -not $target; $attempt += 1) {
    try {
      $targets = Invoke-RestMethod "http://127.0.0.1:$port/json"
      $target = $targets | Where-Object { $_.type -eq "page" -and $_.url -like "file:*" } | Select-Object -First 1
    } catch { Start-Sleep -Milliseconds 150 }
  }
  if (-not $target) { throw "Edge no publicó un objetivo de depuración." }

  $script:socket = New-Object System.Net.WebSockets.ClientWebSocket
  $script:socket.ConnectAsync(
    [Uri]$target.webSocketDebuggerUrl,
    [System.Threading.CancellationToken]::None
  ).Wait()

  Invoke-Cdp "Runtime.enable" | Out-Null
  Invoke-Cdp "Page.enable" | Out-Null
  Evaluate "new Promise(resolve => { const check = () => document.querySelectorAll('.element-card').length === 118 ? resolve(true) : setTimeout(check, 40); check(); })" | Out-Null

  Assert-Equal (Evaluate "document.querySelectorAll('.element-card').length") 118 "118 tarjetas renderizadas"
  Assert-Equal (Evaluate "new Set([...document.querySelectorAll('.element-card')].map(x => x.dataset.atomicNumber)).size") 118 "Números atómicos únicos"

  Evaluate "(() => { const x = document.querySelector('#element-search'); x.value = 'Oxígeno'; x.dispatchEvent(new Event('input', { bubbles: true })); return true; })()" | Out-Null
  Assert-Equal (Evaluate "document.querySelectorAll('.element-card:not(.is-muted)').length") 1 "Búsqueda por nombre"
  Assert-Equal (Evaluate "document.querySelector('.element-card:not(.is-muted)').dataset.atomicNumber") "8" "Oxígeno corresponde a Z=8"

  Evaluate "document.querySelectorAll('.element-card')[7].click(); true" | Out-Null
  Assert-Equal (Evaluate "document.querySelector('#element-dialog').open") $true "Panel de detalle abierto"
  Assert-Equal (Evaluate "document.querySelector('#detail-name').textContent") "Oxígeno" "Nombre en el detalle"
  Assert-Equal (Evaluate "document.querySelectorAll('#identity-properties .property-item').length") 6 "Propiedades de identidad"
  Assert-Equal (Evaluate "document.querySelectorAll('#detail-uses li').length > 0") $true "Usos disponibles"
  Assert-Equal (Evaluate "document.querySelectorAll('#detail-facts li').length > 0") $true "Curiosidades disponibles"
  Save-Screenshot "smoke-detail.png"

  Evaluate "document.querySelector('#dialog-close').click(); new Promise(resolve => setTimeout(() => resolve(!document.querySelector('#element-dialog').open), 320))" | Out-Null
  Assert-Equal (Evaluate "document.querySelector('#element-dialog').open") $false "Panel de detalle cerrado"

  Evaluate "document.querySelector('#reset-filters').click(); document.querySelectorAll('.filter-chip')[1].click(); true" | Out-Null
  Assert-Equal (Evaluate "document.querySelectorAll('.element-card:not(.is-muted)').length") 6 "Filtro de metales alcalinos"
  Evaluate "document.querySelectorAll('.view-option')[1].click(); true" | Out-Null
  Assert-Equal (Evaluate "document.querySelectorAll('#element-list .list-element').length") 6 "Vista de lista filtrada"

  Evaluate "document.querySelector('#theme-toggle').click(); true" | Out-Null
  Assert-Equal (Evaluate "['light','dark'].includes(document.documentElement.dataset.theme)") $true "Cambio de tema"

  Invoke-Cdp "Emulation.setDeviceMetricsOverride" @{
    width = 390
    height = 844
    deviceScaleFactor = 1
    mobile = $true
    screenWidth = 390
    screenHeight = 844
  } | Out-Null
  Evaluate "location.reload(); true" | Out-Null
  Evaluate "new Promise(resolve => { const check = () => document.querySelectorAll('.element-card').length === 118 ? setTimeout(() => resolve(true), 100) : setTimeout(check, 40); check(); })" | Out-Null
  Assert-Equal (Evaluate "document.documentElement.clientWidth") 390 "Viewport móvil real"
  Assert-Equal (Evaluate "document.body.scrollWidth <= 390") $true "Sin desbordamiento horizontal global"
  Assert-Equal (Evaluate "document.querySelector('#periodic-scroll').scrollWidth > document.querySelector('#periodic-scroll').clientWidth") $true "Tabla desplazable en móvil"
  Save-Screenshot "smoke-mobile.png"

  Write-Host "`nPrueba de navegador completada correctamente."
}
finally {
  if ($script:socket -and $script:socket.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
    $script:socket.Dispose()
  }
  if ($edge -and -not $edge.HasExited) { Stop-Process -Id $edge.Id -Force }
}
