# FFXVI Mod Manager Application

Clone Repository:

Initialize Submodules:

`git submodule update --init --recursive`

Build FF16Pack:

`cd app/src-tauri`

`./build.ps1` 
or 
`cd FF16Pack && dotnet build -c Release`


Go back to `app` folder.

Install Packages:

`bun i`

For Linux Install webkit2gkt for `javascriptcoregtk-4.0` library.

Arch: https://archlinux.org/packages/extra/x86_64/webkit2gtk


Then run the application with:

`bun run tauri`


## Packaging Server

Install `@yao-pkg/pkg` using npm
`npm install -g @yao-pkg/pkg`

run packager after standalone next build

`npx pkg .`