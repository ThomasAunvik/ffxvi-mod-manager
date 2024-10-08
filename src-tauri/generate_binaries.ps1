#!/bin/pwsh

Set-Location FF16Pack
dotnet build -c Release FF16Tools.CLI
Set-Location ..

Copy-Item -Force "FF16Pack/FF16Tools.CLI/bin/Release/net8.0/*" binaries/ff16pack

if($IsWindows) {
	Rename-Item "binaries/ff16pack/FF16Tools.CLI.exe" "FF16Tools.CLI.exe"
} else {
	Rename-Item "binaries/ff16pack/FF16Tools.CLI" "FF16Tools.CLI"
}

Copy-Item -Force "directstorage/*" "binaries/ff16pack"


New-Item -Name tmp -ItemType "directory" -Force
Set-Location tmp

New-Item -Path "../binaries/" -Name "ffxvi-modmanager-runner" -ItemType "directory" -Force

$nodeVersion = "v22.6.0"

if($IsLinux) {
	$nodeLinux = "node-$nodeVersion-linux-x64"

	if(![System.IO.File]::Exists("$nodeLinux.tar.xz")) {
		Invoke-WebRequest -Uri "https://nodejs.org/dist/$nodeVersion/$nodeLinux.tar.xz" -OutFile "$nodeLinux.tar.xz"
	}
	
	tar -xf "${nodeLinux}.tar.xz" --wildcards "**/bin/node"

	Copy-Item -Force "$nodeLinux/bin/node" "../binaries/ffxvi-modmanager-runner/ffxvi-modmanager-runner-x86_64-unknown-linux-gnu"
}

if($IsWindows) {
	# Windows
	$nodeWin = "node-$nodeVersion-win-x64"

	if(![System.IO.File]::Exists( "$nodeWin.zip")) {
		Invoke-WebRequest -Uri "https://nodejs.org/dist/$nodeVersion/$nodeWin.zip" -OutFile "$nodeWin.zip"
	}

	tar -xf "$nodeWin.zip" "$nodeWin/node.exe"

	Copy-Item -Force "$nodeWin/node.exe" "../binaries/ffxvi-modmanager-runner/ffxvi-modmanager-runner-x86_64-pc-windows-msvc.exe"
}


Set-Location ..