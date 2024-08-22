#!/bin/pwsh

Set-Location FF16Pack
dotnet build -c Release
Set-Location ..

Copy-Item -Force "FF16Pack/FF16PackLib.CLI/bin/Release/net8.0/*" binaries/ff16pack

if($IsWindows) {
	Rename-Item "binaries/ff16pack/FF16PackLib.CLI.exe" "FF16PackLib.CLI.exe"
} else {
	Rename-Item "binaries/ff16pack/FF16PackLib.CLI" "FF16PackLib.CLI"
}

mkdir tmp -ErrorAction SilentlyContinue
Set-Location tmp

$nodeVersion = "v22.6.0"
$nodeLinux = "node-$nodeVersion-linux-x64"

if(![System.IO.File]::Exists("$nodeLinux.tar.xz")) {
    Invoke-WebRequest -Uri "https://nodejs.org/dist/$nodeVersion/$nodeLinux.tar.xz" -OutFile "$nodeLinux.tar.xz"
}
if($IsWindows) {
	tar -xf "${nodeLinux}.tar.xz" "**/bin/node"
} else {
	tar -xf "${nodeLinux}.tar.xz" --wildcards "**/bin/node"
}

# Windows
$nodeWin = "node-$nodeVersion-win-x64"

if(![System.IO.File]::Exists( "$nodeWin.zip")) {
    Invoke-WebRequest -Uri "https://nodejs.org/dist/$nodeVersion/$nodeWin.zip" -OutFile "$nodeWin.zip"
}


tar -xf "$nodeWin.zip" "$nodeWin/node.exe"

mkdir ../binaries/ffxvi-modmanager-runner -ErrorAction SilentlyContinue
Copy-Item -Force "$nodeLinux/bin/node" "../binaries/ffxvi-modmanager-runner/ffxvi-modmanager-runner-x86_64-unknown-linux-gnu"
Copy-Item -Force "$nodeWin/node.exe" "../binaries/ffxvi-modmanager-runner/ffxvi-modmanager-runner-x86_64-pc-windows-msvc.exe"


Set-Location ..