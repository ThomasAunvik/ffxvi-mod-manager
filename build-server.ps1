#!/bin/pwsh

bun run build

Copy-Item -Force -R .next/static ./.next/standalone/.next
Copy-Item -Force -R public ./.next/standalone

Copy-Item -Force -R ./.next/standalone ./src-tauri/

sed 's/const currentPort = parseInt(process.env.PORT, 10) || 3000/const currentPort = parseInt(process.argv[2], 10) || 3000/' .\.next\standalone\server.js > .\src-tauri\standalone\server.js