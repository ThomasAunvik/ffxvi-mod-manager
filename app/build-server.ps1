#!/bin/pwsh

#bun run build

cp -R .next/static ./.next/standalone/.next/
cp -R public ./.next/standalone/

cp -R ./.next/standalone/ ./src-tauri/standalone/