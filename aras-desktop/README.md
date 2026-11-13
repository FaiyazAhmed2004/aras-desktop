# ARAS Desktop

This project is a Tauri 2 app built with Vue 3, TypeScript, Vite, and a modular SVG-based ARAS illustration.

## Windows setup

1. Install Node.js LTS and npm.
2. Install Rust.
3. Install Visual Studio 2022 Build Tools with the Desktop C++ workload.
4. Open a Developer Command Prompt (or configure PATH for `cl.exe` and `link.exe`).

## Install dependencies

``` bash
cd aras-desktop
npm install
```

## Run the app in development mode

``` bash
cd aras-desktop
npm run tauri dev
```

## Build for Windows

``` bash
cd aras-desktop
npm run tauri build
```

The built executables and installers are written to `src-tauri/target/release/bundle/`.

## Notes

- Closing the window hides it to the system tray instead of exiting the application.
- The tray menu includes an explicit exit action.
- The initial milestone focuses on the static ARAS layout and desktop foundation rather than sensor control or hardware integration.
