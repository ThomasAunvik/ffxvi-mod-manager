$path=$(Get-Location)

$Env:TAURI_SIGNING_PRIVATE_KEY = "$path/keys/ffxvi-mod-manager-updater.key"
$Env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = ''