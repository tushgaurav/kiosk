<#
.SYNOPSIS
  Adds a "SafeSurge Kiosk" shortcut to the current user's Startup folder so the
  kiosk starts at sign-in. Run with -Remove to take it out again.
#>
param([switch]$Remove)

$ErrorActionPreference = 'Stop'
$shortcut = Join-Path ([Environment]::GetFolderPath('Startup')) 'SafeSurge Kiosk.lnk'

if ($Remove) {
  if (Test-Path $shortcut) {
    Remove-Item $shortcut
    Write-Host "Removed from Startup: $shortcut"
  } else {
    Write-Host 'The kiosk is not in Startup - nothing to remove.'
  }
  return
}

$launcher = Join-Path $PSScriptRoot 'start-kiosk.ps1'
$link = (New-Object -ComObject WScript.Shell).CreateShortcut($shortcut)
$link.TargetPath = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
$link.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$launcher`""
$link.WorkingDirectory = Split-Path -Parent $PSScriptRoot
$link.WindowStyle = 7
$link.Description = 'Starts the SafeSurge kiosk server and opens it full screen.'
$link.Save()

Write-Host "Added to Startup: $shortcut"
Write-Host 'The kiosk will start automatically the next time this user signs in.'
