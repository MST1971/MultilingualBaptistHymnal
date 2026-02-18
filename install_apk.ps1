$adb = "C:\Users\DELL\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$apk = "c:\apps\my-baptist-hymnal\android\app\build\outputs\apk\debug\app-debug.apk"

Write-Host "Using ADB at: $adb"
Write-Host "Installing APK: $apk"

& $adb install -r $apk

if ($LASTEXITCODE -ne 0) {
    Write-Host "Installation failed. Make sure your device is connected and USB debugging is enabled." -ForegroundColor Red
    Write-Host "For WiFi debugging:"
    Write-Host "1. Connect via USB first."
    Write-Host "2. Run: & `"$adb`" tcpip 5555"
    Write-Host "3. Disconnect USB."
    Write-Host "4. Run: & `"$adb`" connect <PHONE_IP>:5555"
} else {
    Write-Host "Installation successful!" -ForegroundColor Green
}
