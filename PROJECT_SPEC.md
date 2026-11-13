# ARAS Desktop --- Project Specification

**Application:** Windows desktop application\
**Purpose:** ARAS system monitoring and accessible educational
visualization\
**Approach:** Simulation-first; physical sensor integration in a later
phase

## 1. Project overview

### Implementation handoff — 13 November 2026

The user has finished the initial modelling pass and is pausing modelling
work. Continue from the existing 3D implementation, not the older SVG
prototype. Artwork refinement remains optional future work; do not start
another modelling pass without a request.

- Active application: `aras-desktop/` (run npm commands there, not at the
  workspace root). `src/App.vue` opens `src/components/TankScene.vue`.
- Reusable Three.js procedural meshes: `src/three/tank.ts`,
  `azollaBeds.ts`, `filters.ts`, `waterPipes.ts`, and `airSystem.ts`.
  There are no Blender/GLB assets. Old SVG components are retained only
  as reference and are not the active scene.
- Built: round transparent tank, protective grid, three swimming fish,
  three raised Azolla trays, four exterior filter housings, water pipes,
  falling streams, and an air pump beneath the rack with four independent
  amber hoses and air-stone bubbles. Blue pipes carry water.
- Final alignment supersedes earlier front/back descriptions: tank,
  beds, and filter-array centres share world Z = -0.7. Their X positions
  are -3.7, 1.5, and 4.4 respectively. Beds and filters rotate Y by PI/2;
  their long axes run parallel. The bottom blue sketch is the reference.
- Bed base heights are 3.8, 5.3, and 6.8; tank water height is 3.0.
  All three bed returns descend by gravity and discharge above tank water.
  Tank wastewater travels near the floor, then rises at the filter inlet.
  Filtered supply drops into three parallel beds from overhead outlets.
  Upstream water lift remains unspecified; this is a visual prototype,
  not a validated hydraulic design. The air pump never moves water.
- Controls: orbit, zoom, View beds, View filters, Hide grid, Pause,
  Reset view. Native X hides to the tray; tray click restores, Exit quits.
- A startup crash was fixed by clamping negative RAF deltas and wrapping
  flow-marker progress with Euclidean modulo. Preserve these safeguards.
  Scene failures now report an error rather than silently going blank.
- Verified: frontend build, water-animation regression, and air-model
  construction/animation checks. Scene restoration after the crash was
  visually verified. Latest low wastewater pipe and air system await the
  user's visual review. A fresh installer has not been built for these changes.
- Run `npm run build` and
  `node --experimental-strip-types --test tests/waterPipes.test.mjs`
  from `aras-desktop/`. Use Node 24 as in the current environment.
- Sensor ingestion, numerical simulation, alerts, educational workflows,
  and real hardware integration are not implemented. Simulation in the
  title and the pump indicator describe illustrative animation only.
- User prefers to check visual changes personally; do not routinely
  control the app for layout checks unless requested or needed to debug.

ARAS Desktop is a Windows desktop application for an existing ARAS
aquaponics installation. It will recreate the physical system as a
modular animated scene, display system conditions, communicate abnormal
conditions through visual behaviours and notifications, and provide an
accessible learning interface for PPKI students.

The physical ARAS prototype already exists. This project develops the
software layer around it; it does not redesign or replace the mechanical
system.

The first version must work without physical sensor hardware. Simulated
readings will be used until the existing sensors and their communication
interface have been investigated.

## 2. Goals

1.  Recreate the physical ARAS layout in a friendly, enhanced cartoon
    style.
2.  Animate the system during normal operation.
3.  Change animations and indicators in response to simulated or real
    conditions.
4.  Provide a monitoring interface for responsible personnel.
5.  Provide an accessible educational interface using visuals, audio and
    guided activities.
6.  Support Windows system-tray operation.
7.  Keep the visualization independent of any specific sensor
    manufacturer or protocol.

## 3. Physical ARAS layout

The illustration must follow the physical arrangement described for the
existing prototype.

### Components

-   **Fish tank:** One circular fish tank in the initial illustration,
    containing Red Tilapia. Include the protective grid shown in the
    hand-drawn reference.
-   **Azolla beds:** Three rectangular growing beds arranged vertically
    as a stacked shelf structure.
-   **Filter array:** Multiple plastic cylindrical filter containers
    connected sequentially. The array is positioned behind the Azolla
    growing-bed structure.
-   **Air pump:** Positioned underneath the Azolla beds, with separate
    air delivery to the fish tank and beds.
-   **Water pipes:** Carry water through filtration and Azolla treatment
    and back to the fish tank.
-   **Air lines:** Carry air independently from the pump to the fish
    tank and Azolla beds.

Show one fish tank in the first illustration. The physical installation
may include another independent fish tank, but the two tanks are not
connected. Do not add a second tank to the first visual milestone.

Layout clarification (11 November 2026): the beds physically sit between
the tank and filter array. Physical placement does not indicate water-flow
order: circulation remains tank → filters → beds → tank. Build the beds,
then filters, then the air pump underneath the beds, and finally the water
and air piping. Refine the artwork after the assembly is complete.

### Camera and visual style

-   Use a slightly elevated, side-on view: show the sides and some of
    the tops of the components.
-   Place the beds behind the tank. Their short ends (width) face the
    viewer, with their long dimension extending away into the scene.
    Match the bottom blue reference sketch: tank at the left/front,
    beds to its right and slightly behind, with their length receding
    diagonally. The filter row runs parallel alongside the far side of
    the beds, not across the rear end. Use an elevated oblique side view
    showing the tray tops. Only filter exteriors are needed initially.
-   Use a friendly, enhanced cartoon style suitable for educational
    animations.
-   Use clean outlines, rounded shapes, clear silhouettes and consistent
    visual language.
-   Do not place a large title banner over the illustration.
-   Prioritize physical accuracy and clear component placement over
    decoration.

## 4. Water and air flow

Water circulation and air supply are separate systems and must never be
visually confused.

### Water circulation

**Fish Tank → Filter Array → Azolla Growing Beds → Fish Tank**

1.  Water leaves the fish tank carrying fish waste, including suspended
    solids.
2.  Water passes through the sequential filter containers, where
    suspended solids are removed.
3.  Filtered water enters the Azolla growing beds.
4.  Azolla takes up nutrients from the water, including nitrogen- and
    phosphorus-related nutrients.
5.  Treated water returns to the fish tank.

Requirements: - Make flow direction unambiguous using arrows or moving
water indicators. - Show the pipe route clearly. - The water route must
not pass through the air pump. - Do not draw a water connection from the
Azolla beds into the air pump. - Keep the return-to-fish-tank route
visible.

### Air supply

Water-piping implementation clarification (13 November 2026): raise all
three beds above the tank water level so their returns drain by gravity.
Bed feeds and tank returns end above the receiving surface with a visible
free-falling stream. The first piping pass uses three parallel beds.
Upstream water lift/pressure remains unspecified; do not represent the
whole closed loop as gravity-powered or use the air pump as a water pump.

The air pump supplies air separately to: - The fish tank. - The Azolla
growing beds.

Requirements: - Draw two distinct air delivery paths from the pump. -
Use a different line style or colour from the water pipes. - Bubbles may
be animated at the delivery points. - The pump does not pump water and
is not part of the water circulation sequence.

## 5. Technology and architecture

Preferred initial stack: - **Desktop shell:** Tauri 2 - **Native
functionality:** Rust - **Frontend:** Vue 3, TypeScript and Vite -
**Illustration:** Modular Three.js procedural meshes - **Animation:** Three.js
animations, with TypeScript controlling state and transitions -
**Optional effects:** Canvas only where it offers a clear benefit, such
as numerous particles - **Version control:** Git

Use the official Tauri 2 setup and current documentation when
scaffolding. Do not assume a particular plugin or API is available
without checking the installed version.

Do not introduce a separate backend, database or cloud service in the
first milestone. Keep the data interface modular so these can be added
if later requirements justify them.

## 6. Main software modules

### ARAS scene and visual components

Build the scene from independently controllable components. Suggested
components: - `ARASScene` - `FishTank` - `Fish` - `AzollaBeds` -
`FilterArray` - `AirPump` - `WaterPipes` - `AirLines` - `VisualEffects`

The illustration must not be one flattened image. Fish, water, plants,
filters, pipes, air bubbles and indicators must be independently
controllable. Use a consistent Three.js world coordinate system and keep visual
assets separate from application logic.

### Animation engine

Support both: - **Idle animations:** fish swimming, gentle plant
movement, water-flow indicators and air bubbles. - **Condition-driven
animations:** behaviours and visual changes triggered by current system
state.

Animation state must be derived from application state. Avoid unrelated
random behaviour that could communicate an incorrect system condition.

### Monitoring service

Create a central monitoring/data layer that accepts readings from a data
source and exposes normalized application state.

Initially, the source is a simulator. Later, a sensor adapter can
translate actual ARAS hardware data into the same internal format.

Keep these concerns separate: - Receiving readings. - Validating and
normalizing readings. - Evaluating configured thresholds. - Producing
condition states. - Updating the visual scene. - Triggering
notifications.

Do not hardcode thresholds inside Vue components or animation files.

### Simulation service

Provide simulated readings and controls for demonstrating conditions
without connecting to ARAS hardware. Simulation data must be clearly
labelled as simulated and never presented as live hardware data.

### Notification service

Support application-level alerts initially, with native Windows
notifications added as appropriate.

Potential alert examples: - A monitored condition outside its configured
range. - A water-level warning. - A filter inspection or cleaning
reminder. - A feeding reminder.

Include alert severity, timestamp, acknowledgement and basic history.
Avoid repeatedly notifying for the same unresolved condition.

### Educational interface

Provide a simplified student-facing mode with: - Large illustrations and
pictograms. - Clear visual status indicators. - Audio prompts and
instructions. - Step-by-step guidance for approved activities. - Simple
task-completion feedback.

Do not rely on colour alone. Pair colour with symbols, shapes, audio or
short plain-language instructions. Design and validate activities with
teachers and intended users. Do not assume all PPKI students have the
same abilities or support needs.

## 7. Condition and animation examples

These are examples for design and simulation, not confirmed sensor
capabilities, validated thresholds or animal-health diagnoses.

  -----------------------------------------------------------------------
  Example condition                   Possible visual response
  ----------------------------------- -----------------------------------
  Low dissolved oxygen                Fish move towards the surface and
                                      display the agreed surface-gasping
                                      behaviour; show a warning

  Feeding time                        Show a feeding prompt and suitable
                                      fish activity

  Low water level                     Show the water level falling and
                                      highlight the condition

  Filter maintenance due              Highlight the relevant filter and
                                      display a cleaning reminder

  Water-quality reading outside       Show a warning and identify the
  configured limits                   reading requiring attention
  -----------------------------------------------------------------------

Use only measurements the existing ARAS hardware provides or that can be
reliably derived from available data. Confirm acceptable ranges and
animal responses with the responsible ARAS expert before operational
use.

Only describe a filter as clogged when supported by suitable
measurements or a confirmed inspection. Otherwise, use a maintenance
schedule or manually confirmed inspection status.

## 8. Desktop and system-tray behaviour

-   Launch in a normal application window.
-   Support standard window controls.
-   Closing the main window should hide it rather than terminate the
    process.
-   Provide a system-tray icon and menu.
-   Tray actions should include opening the application and explicitly
    exiting it.
-   Continue receiving and evaluating monitoring data while the window
    is hidden.
-   Avoid expensive graphical rendering while hidden.
-   Show whether the application is in simulation mode or disconnected
    from its data source.

The user must have an explicit way to exit the application completely.

## 9. Data and safety boundaries

-   The initial version is a monitoring and educational application, not
    an autonomous controller.
-   Do not operate pumps, valves, feeders or other physical equipment.
-   Do not claim an alert was delivered unless the notification
    operation succeeds.
-   Do not invent readings or label simulated readings as real.
-   Do not invent sensor availability, hardware protocols or thresholds.
-   Keep actual hardware integration behind a replaceable adapter.
-   When real integration is introduced, make loss of connection and
    stale readings visible.
-   Keep configuration changes separate from ordinary student
    interactions.
-   Restrict access to configuration and personnel functions when
    authentication and roles are implemented.

## 10. Suggested source structure

This is a suggested structure, not a requirement to create every file
immediately.

``` text
ARAS-Desktop/
├── src/
│   ├── assets/
│   │   ├── fish/
│   │   ├── plants/
│   │   ├── tanks/
│   │   ├── filters/
│   │   ├── pipes/
│   │   └── effects/
│   ├── components/
│   │   ├── ARASScene.vue
│   │   ├── FishTank.vue
│   │   ├── Fish.vue
│   │   ├── AzollaBeds.vue
│   │   ├── FilterArray.vue
│   │   ├── AirPump.vue
│   │   ├── WaterPipes.vue
│   │   └── AirLines.vue
│   ├── animations/
│   ├── services/
│   │   ├── monitoringService.ts
│   │   ├── simulationService.ts
│   │   ├── notificationService.ts
│   │   └── sensorAdapter.ts
│   ├── stores/
│   ├── types/
│   ├── views/
│   └── App.vue
├── src-tauri/
├── PROJECT_SPEC.md
├── README.md
└── package.json
```

Adapt this structure to the scaffolded Tauri/Vue project where sensible.
Avoid empty abstractions that are not needed by the current milestone.

## 11. Development phases

### Phase 1 --- Desktop foundation

-   Scaffold Tauri 2 with Vue 3 and TypeScript.
-   Confirm the application runs on Windows.
-   Add basic window behaviour and system-tray support.
-   Document setup and run commands.

### Phase 2 --- Static ARAS reconstruction

-   Build the fish tank, three Azolla beds, sequential cylindrical
    filter array and air pump.
-   Reproduce the agreed physical layout and slightly elevated side-on
    perspective.
-   Draw and verify the water route and independent air routes.
-   Keep major parts independently controllable.

**Milestone:** A static but modular ARAS illustration displayed in the
desktop application.

### Phase 3 --- Idle animation

-   Animate fish swimming.
-   Animate water-flow indicators.
-   Animate air bubbles.
-   Add subtle Azolla movement.
-   Keep animation smooth and controllable.

**Milestone:** The ARAS scene has continuous normal-operation
animations.

### Phase 4 --- Simulation and condition-driven behaviour

-   Add simulated readings.
-   Add configurable example thresholds.
-   Implement normal, attention and critical states.
-   Connect conditions to visual indicators and fish/filter/water
    behaviours.
-   Clearly label simulated data.

**Milestone:** Demonstrate normal and abnormal conditions without
physical hardware.

### Phase 5 --- Monitoring and notifications

-   Add a monitoring panel alongside the main scene.
-   Add alert acknowledgement and history.
-   Add native notifications where appropriate.
-   Verify background operation from the system tray.

### Phase 6 --- Educational mode

-   Add accessible visual instructions and audio prompts.
-   Add guided feeding and maintenance activities.
-   Review the interface with teachers and adapt it based on feedback.

### Phase 7 --- Physical ARAS integration

-   Inspect the existing sensors and controller.
-   Confirm available readings and how they can be accessed.
-   Implement the required sensor adapter.
-   Validate thresholds and alert behaviour with responsible ARAS
    personnel.
-   Test against the physical installation.

## 12. First milestone acceptance criteria

The first milestone is complete when: 1. The Tauri application builds
and launches on Windows. 2. The main window displays the ARAS scene. 3.
The scene contains one fish tank, three stacked Azolla beds, the filter
array alongside the far side of the beds, and the air pump beneath the beds. 4.
The water route is visibly represented as fish tank → filter array →
Azolla beds → fish tank. 5. The air pump has separate air lines to the
fish tank and Azolla beds, with no water connection. 6. Major visual
components are independently represented rather than flattened into one
image. 7. The application can hide to the system tray and can be
explicitly exited. 8. The README explains setup, development and
production build commands.

Do not begin full sensor integration or the complete educational
workflow before this foundation is reviewed.

## 13. Instructions for AI coding agents

Before changing code: 1. Read this entire specification and the README.
2. Inspect the existing repository and identify its scaffold and
dependency versions. 3. Briefly report the planned changes before
implementing them. 4. Follow the current phase and milestone; do not
attempt to build the entire product at once. 5. Prefer small, testable
changes. 6. Do not silently change the physical ARAS layout or water/air
flow. 7. Do not add unrequested hardware control, cloud services or
backend infrastructure. 8. Run relevant checks and report what was
actually tested. 9. Update the README when setup commands or project
structure change. 10. If a requirement is ambiguous or conflicts with
the existing scaffold, explain the issue and ask before making a
consequential assumption.
