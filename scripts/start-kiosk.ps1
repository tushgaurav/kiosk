<#
.SYNOPSIS
  Starts the SafeSurge kiosk: installs dependencies and rebuilds dist/ when
  needed, starts the server in the background (unless it is already up), then
  opens the kiosk full screen in Chrome or Edge.

.PARAMETER Windowed
  Open the kiosk in the default browser as a normal window instead of kiosk mode.

.PARAMETER Rebuild
  Rebuild dist/ even if it looks up to date.
#>
param(
  [switch]$Windowed,
  [switch]$Rebuild
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$Root = Split-Path -Parent $PSScriptRoot
$Logs = Join-Path $Root 'logs'
$LauncherLog = Join-Path $Logs 'launcher.log'
New-Item -ItemType Directory -Force -Path $Logs | Out-Null
Set-Location $Root

function Write-Log([string]$Message) {
  $line = '{0:yyyy-MM-dd HH:mm:ss}  {1}' -f (Get-Date), $Message
  Write-Host $line
  Add-Content -Path $LauncherLog -Value $line
}

function Stop-WithError([string]$Message) {
  Write-Log "ERROR: $Message"
  # At sign-in this runs without a visible console, so failures need a dialog.
  (New-Object -ComObject WScript.Shell).Popup($Message, 0, 'SafeSurge kiosk', 16) | Out-Null
  exit 1
}

function Invoke-Npm([string]$Arguments) {
  $env:NO_COLOR = '1'
  # Merge stderr inside cmd: in Windows PowerShell, native stderr piped through
  # 2>&1 turns into error records and would trip $ErrorActionPreference.
  cmd.exe /d /c "npm $Arguments 2>&1" | ForEach-Object { Write-Log "  $_" }
  return $LASTEXITCODE -eq 0
}

# Same rule as server/config.js: a real PORT variable wins over .env, else 3000.
function Get-KioskPort {
  if ($env:PORT) { return [int]$env:PORT }
  $envFile = Join-Path $Root '.env'
  if (Test-Path $envFile) {
    $match = Select-String -Path $envFile -Pattern '^\s*PORT\s*=\s*(\d+)' | Select-Object -First 1
    if ($match) { return [int]$match.Matches[0].Groups[1].Value }
  }
  return 3000
}

function Test-BuildStale {
  $shell = Join-Path $Root 'dist\index.html'
  if (-not (Test-Path $shell)) { return $true }
  $builtAt = (Get-Item $shell).LastWriteTime
  $inputs = 'src', 'public', 'index.html', 'admin.html', 'vite.config.js', 'package-lock.json' |
    ForEach-Object { Join-Path $Root $_ } |
    Where-Object { Test-Path $_ }
  $newer = Get-ChildItem -Path $inputs -Recurse -File |
    Where-Object { $_.LastWriteTime -gt $builtAt } |
    Select-Object -First 1
  return [bool]$newer
}

function Test-Server {
  try {
    Invoke-RestMethod -Uri "$Url/api/settings" -TimeoutSec 2 -UseBasicParsing | Out-Null
    return $true
  } catch {
    return $false
  }
}

function Find-Browser {
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe" |
    Where-Object { Test-Path $_ } |
    Select-Object -First 1
}

Write-Log '--- Starting SafeSurge kiosk ---'

$node = Get-Command node.exe -ErrorAction SilentlyContinue
if (-not $node) {
  Stop-WithError 'Node.js was not found. Install Node.js, sign out and back in, then try again.'
}

if (-not (Test-Path (Join-Path $Root 'node_modules'))) {
  Write-Log 'Installing dependencies (npm ci)...'
  if (-not (Invoke-Npm 'ci')) { Stop-WithError "npm ci failed. See $LauncherLog" }
}

if ($Rebuild -or (Test-BuildStale)) {
  Write-Log 'Building the kiosk (npm run build)...'
  if (-not (Invoke-Npm 'run build')) {
    if (Test-Path (Join-Path $Root 'dist\index.html')) {
      Write-Log 'Build failed - carrying on with the previous build.'
    } else {
      Stop-WithError "The build failed and there is no previous build to fall back on. See $LauncherLog"
    }
  }
}

$Port = Get-KioskPort
$Url = "http://localhost:$Port"

if (Test-Server) {
  Write-Log "Server already running at $Url"
} else {
  $out = Join-Path $Logs 'server.log'
  $err = Join-Path $Logs 'server.err.log'
  foreach ($file in $out, $err) {
    if (Test-Path $file) { Move-Item -Force $file ([IO.Path]::ChangeExtension($file, '.previous.log')) }
  }

  Write-Log "Starting the server on port $Port..."
  $server = Start-Process -FilePath $node.Source -ArgumentList 'server/index.js' -WorkingDirectory $Root `
    -WindowStyle Hidden -RedirectStandardOutput $out -RedirectStandardError $err -PassThru

  $deadline = (Get-Date).AddSeconds(30)
  while (-not (Test-Server)) {
    if ($server.HasExited) { Stop-WithError "The server stopped during startup. See $err" }
    if ((Get-Date) -gt $deadline) { Stop-WithError "The server did not answer on $Url within 30 seconds. See $err" }
    Start-Sleep -Milliseconds 500
  }
  Write-Log "Server is up at $Url (pid $($server.Id))"
}

$browser = Find-Browser
if ($Windowed -or -not $browser) {
  Write-Log "Opening $Url in the default browser"
  Start-Process $Url
  exit 0
}

# A dedicated profile makes --kiosk work even while the user's own browser is
# open, and keeps the kiosk's localStorage (queued leads) across reboots.
$profileDir = Join-Path $env:LOCALAPPDATA 'SafeSurgeKiosk\browser'
$exe = Split-Path -Leaf $browser

$running = Get-CimInstance Win32_Process -Filter "Name = '$exe'" |
  Where-Object { $_.CommandLine -and $_.CommandLine.Contains($profileDir) }
if ($running) {
  Write-Log 'The kiosk browser is already open.'
  exit 0
}

# After a power cut the browser offers to "restore pages"; mark the last session
# as a clean exit so the kiosk comes back without that prompt.
$prefs = Join-Path $profileDir 'Default\Preferences'
if (Test-Path $prefs) {
  $json = [IO.File]::ReadAllText($prefs)
  $json = $json -replace '"exit_type":\s*"[^"]*"', '"exit_type":"Normal"' -replace '"exited_cleanly":\s*false', '"exited_cleanly":true'
  [IO.File]::WriteAllText($prefs, $json)
}

$browserArgs = @(
  "--user-data-dir=`"$profileDir`"",
  '--kiosk',
  '--no-first-run',
  '--no-default-browser-check',
  '--noerrdialogs',
  '--disable-session-crashed-bubble',
  '--disable-pinch',
  '--overscroll-history-navigation=0',
  '--disable-features=Translate'
)
if ($exe -eq 'msedge.exe') { $browserArgs += '--edge-kiosk-type=fullscreen' }
$browserArgs += $Url

Write-Log "Opening $Url full screen in $exe"
Start-Process -FilePath $browser -ArgumentList $browserArgs
