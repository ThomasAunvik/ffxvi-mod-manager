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

### Before running, Install Binaries

Install the binaries required for the app.
```sh
cd src-tauri
./generate_binaries.ps1
```

This will build the FF16Pack repository (dotnet8), and copy the release binaries onto the `src-tauri/binaries` folder.

It will also download the node executables to be used when running the app server. The name of the executable will be named: `ffxvi-modmanager-runner` as the processor name.


### Start the application in Dev mode

Install Packages:

`bun i`

For Linux Install webkit2gkt for `javascriptcoregtk-4.0` library.

Arch: https://archlinux.org/packages/extra/x86_64/webkit2gtk


Then run the application with:

`bun run tauri:dev`

### Building the application

`bun run tauri:build`