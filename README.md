# ARAS Desktop

A Windows desktop application for visualizing and monitoring an existing
ARAS aquaponics system, with an accessible educational interface for
PPKI students.

The application is being developed **simulation-first**. Actual sensor
integration will be added only after the existing ARAS hardware and its
available data interface have been investigated.

For the complete requirements, architecture, physical layout,
development phases and acceptance criteria, see
[`PROJECT_SPEC.md`](./PROJECT_SPEC.md).

## Current development status

**Handoff, 13 November 2026:** Initial 3D modelling pass is finished for
now. See `PROJECT_SPEC.md`, section “Implementation handoff”, for the
current files, completed features, layout coordinates, checks, known
limitations, and remaining work. Future models should read that section
before making changes. Live sensor/simulation services are not implemented.

Final layout correction: tank, rack, and filter-array centres are aligned
at world Z = -0.7. Earlier “left/front” descriptions below describe the
sketch perspective, not a remaining offset between the model centres.

The current app opens a first-pass interactive 3D fish tank built with
Three.js. It includes transparent tank walls, a separate water surface,
a removable protective grid, sand, plants, stones, and three animated
stylized red tilapia. Drag to orbit, scroll to zoom, and use the bottom
controls to hide the grid, pause motion, or reset the camera.

The reusable procedural models live in `aras-desktop/src/three/tank.ts`;
the renderer and animation lifecycle live in
`aras-desktop/src/components/TankScene.vue`. These are code-generated
meshes, not Blender or GLB assets. The earlier SVG components remain in
the project for reference. Rendering pauses when the document is hidden
and GPU resources are released when the view is unmounted. This is a
visual prototype, not live sensor data or a final anatomical fish model.

The next model, `aras-desktop/src/three/azollaBeds.ts`, adds three stacked
shallow trays with separate water surfaces and instanced floating Azolla
mats. **View beds** focuses the rack; **Reset view** restores the combined
tank and bed view. The rack leaves clearance underneath for the future
air pump. Dimensions remain illustrative pending hardware measurements.

Confirmed assembly order: beds, filters, air pump, then piping. Physical
placement is tank → beds → filters, with the air pump underneath the beds.
Water circulation is separately tank → filters → beds → tank. Air hoses
run from the air pump to both tank and beds. Water piping now connects
the tank, sequential filters, and three parallel bed branches. Air piping
now has its own independent pump and four amber hoses, separate from the
blue water pipes.

`aras-desktop/src/three/waterPipes.ts` adds overhead feed outlets and six
visible falling streams: three into the beds and three returning to the
tank. The rack is taller, with the lowest tray above the tank water level;
all bed return routes descend to outlets above the tank. Flow markers and
landing ripples follow the existing Pause control. The supply route from
the tank through filtration to the elevated beds is schematic: upstream
pressure/lift is not yet specified or simulated. This is not a pump-free
closed-loop hydraulic design, and the air pump is not used to lift water.

The wastewater route runs near the floor from a low tank outlet and rises
at the filter inlet. `aras-desktop/src/three/airSystem.ts` places the air
pump beneath the rack and connects one hose to the tank air stone and one
to each bed air stone. Bubbles originate at these diffusers; Pause also
pauses aeration animation. The pump indicator is illustrative, not a live
hardware status reading.

Four exterior-only cylindrical filter housings now live in
`aras-desktop/src/three/filters.ts`, on a shared raised platform. **View
filters** inspects them. The beds sit behind the tank, rotated so their
short ends face the default camera and their length extends away. The
camera follows the bottom blue layout sketch with an elevated oblique
view. The tank sits left/front, the beds to its right and slightly behind,
and the filter row runs parallel along the far side of the beds.
Filter internals are deliberately omitted for this assembly pass.

**Starting milestone:** Desktop foundation and modular ARAS visual
reconstruction.

The first milestone is not expected to connect to real sensors. It
should produce a working Windows desktop application that displays a
modular ARAS illustration and can hide to the system tray.

## Preferred technology stack

-   Tauri 2 --- Windows desktop shell and native functionality
-   Rust --- native desktop functionality
-   Vue 3 --- frontend components
-   TypeScript --- application and animation logic
-   Vite --- frontend development and build tooling
-   Three.js --- active modular 3D models and animations; SVG is legacy reference

Use the current official Tauri documentation when setting up the
project. Exact scaffold prompts and configuration options can change
between releases.

## Prerequisites

On Windows, install:

1.  **Node.js LTS** and npm.
2.  **Rust** using the official Rust installation instructions.
3.  **Microsoft C++ Build Tools** with the C++ build tools workload
    required by Tauri.
4.  **WebView2 Runtime** if it is not already available.
5.  **Visual Studio Code** and Git.

See the official Tauri v2 Windows prerequisites:
https://v2.tauri.app/start/prerequisites/

## Project scaffold

This workspace contains the Tauri 2 + Vue 3 + TypeScript application in
`aras-desktop/`.

## Install dependencies

From the application directory:

``` bash
cd aras-desktop
npm install
```

## Run in development mode

From `aras-desktop/`:

``` bash
npm run tauri dev
```

This launches the desktop app with the Vue frontend and Tauri shell.

The scene fills the window and scales without stretching or cropping the
system. Simulation status appears in the window title. Clicking **X** hides
the window to the system tray. Left-click the tray icon to restore it, or
right-click for **Open ARAS Desktop** and **Exit ARAS Desktop**. Use Exit to
quit completely. Native tray changes require restarting the desktop app;
an already installed copy needs a new build.

## Build the Windows application

From `aras-desktop/`:

``` bash
npm run tauri build
```

The production build creates the Windows installer and executable under
`src-tauri/target/release/bundle/`.

## Windows build notes

On a Windows machine, the Tauri desktop build requires the Visual Studio
C++ Build Tools and the Rust toolchain. In a Developer Command Prompt:

``` powershell
cd d:\Internship\ARAS-Desktop\aras-desktop
set PATH=%USERPROFILE%\.cargo\bin;%PATH%
call "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\VsDevCmd.bat" -arch=amd64 -host_arch=amd64
npm run tauri build
```

## Useful development commands

``` bash
cd aras-desktop
npm install
npm run dev
npm run tauri dev
npm run tauri build
```

## Initial implementation priorities

1.  Confirm the Tauri/Vue application builds and launches.
2.  Implement the main window and system-tray behaviour.
3.  Maintain the physical ARAS layout as modular Three.js models.
4.  Verify the water circulation path: **Fish Tank → Filter Array →
    Azolla Beds → Fish Tank.**
5.  Verify the separate air paths from the air pump to the fish tank and
    Azolla beds.
6.  Add continuous idle animations.
7.  Add simulated readings and condition-driven animations.

Do not start real sensor integration until the existing ARAS hardware,
available measurements and communication method are confirmed.

## Important physical-layout rules

-   Start with one circular fish tank.
-   Include three rectangular Azolla beds stacked vertically.
-   Place the sequential cylindrical filter array behind the Azolla
    beds.
-   Place the air pump underneath the Azolla beds.
-   Water flows from the fish tank to the filters, then to the Azolla
    beds, and returns to the fish tank.
-   Air is supplied independently to the fish tank and Azolla beds.
-   The air pump does not pump water.
-   Keep water pipes and air lines visually distinct.
-   Use a slightly elevated, side-on view based on the hand-drawn
    reference.

## Development rules

-   Do not flatten the ARAS illustration into one image; major elements
    must be independently controllable.
-   Keep monitoring, simulation, animation and notification logic
    separate.
-   Clearly distinguish simulated data from real sensor data.
-   Do not invent sensor availability or operational thresholds.
-   The initial application is for monitoring and education, not
    automatic control of pumps, valves or feeders.
-   Keep the application responsive and avoid unnecessary rendering
    while hidden in the system tray.

## Repository workflow

Before implementing a new phase:

1.  Read `PROJECT_SPEC.md`.
2.  Inspect the current code and dependencies.
3.  Confirm the milestone being implemented.
4.  Make small, reviewable changes.
5.  Run relevant builds and checks.
6.  Document new setup steps or decisions in this README.

## Reference documentation

-   Tauri v2: https://v2.tauri.app/
-   Tauri v2 prerequisites: https://v2.tauri.app/start/prerequisites/
-   Vue: https://vuejs.org/
-   TypeScript: https://www.typescriptlang.org/
-   Vite: https://vite.dev/
