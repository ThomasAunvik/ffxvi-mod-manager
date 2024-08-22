#!/bin/pwsh

mkdir tmp
Set-Location tmp

$nodeVersion = "v22.6.0"
$nodeLinux = "node-$nodeVersion-linux-x64"

if(![System.IO.File]::Exists("$nodeLinux.tar.xz")) {
    curl "https://nodejs.org/dist/$nodeVersion/$nodeLinux.tar.xz" -o "$nodeLinux.tar.xz"
}

tar -vxf "${nodeLinux}.tar.xz" --directory . --wildcards "**/bin/node"

# Windows
$nodeWin = "node-$nodeVersion-win-x64"

if(![System.IO.File]::Exists( "$nodeWin.zip")) {
    curl "https://nodejs.org/dist/$nodeVersion/$nodeWin.zip" -o "$nodeWin.zip"
}


unzip -o "$nodeWin.zip" "$nodeWin/node.exe"  -d .

mkdir ../binaries/node
cp "$nodeLinux/bin/node" "../binaries/node/node-x86_64-unknown-linux-gnu"
cp "$nodeWin/node.exe" "../binaries/node/node.exe"