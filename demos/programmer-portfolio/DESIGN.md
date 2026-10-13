# Programmer portfolio demo

Thai personal portfolio with an original animated Blender office diorama. All personal information, availability, skills and project case studies are fictional fixtures. Contact controls never send messages. Replace them before publication.

## Run

The current session reuses the verified repository server:

<http://127.0.0.1:8768/demos/programmer-portfolio/>

From the repository root, if port 8768 is available:

```powershell
python -m http.server 8768 --bind 127.0.0.1 --directory 'D:\Projects\CodeLV8-ux-ui-agent-skill'
```

Do not launch a second server on an occupied port. Serve over HTTP; opening `index.html` directly as a file does not support the module/model loading contract. No build, npm install, CDN, analytics or backend is needed at runtime.

## Decisions

- Primary visitor: a potential collaborator evaluating the programmer's working style and capabilities.
- Flow: introduction → personal background → capabilities → example projects → example contact details.
- Primary action: view selected projects. Project details open in native dialogs that preserve page position and return focus on close.
- Direction: warm sage Aurora surfaces, a restrained violet gradient, dark green typography, local LINE Seed Sans TH. Semantic CSS tokens live in `styles.css`.
- The 3D room adds a personal working context. Typing and a gentle head movement are looping GLB animations. A separate camera rotation is controlled by the visitor; scrolling is not captured by orbit controls.
- Mobile uses a single column; tablet keeps the scene beside the introduction. Long project titles wrap at 320px.
- Reduced motion starts animations paused. Explicit play remains available. Animations stop updating when the scene leaves the viewport or the tab is hidden; pixel ratio is capped.
- Static PNG stays available for JavaScript, WebGL, module or model loading failure. Main content does not depend on WebGL.

## Editable content and assets

| File | Purpose |
|---|---|
| `index.html` | Profile, capabilities, project cards, contact fixtures, metadata |
| `app.js` | Project detail fixtures, dialogs, contact copy feedback |
| `styles.css` | Shared semantic theme and responsive layouts |
| `studio.js` | Three.js renderer, GLB loading, animation/camera controls and fallback |
| `assets/studio.blend` | Editable Blender scene including original session scene and separate Portfolio Studio scene |
| `assets/studio.glb` | Restored original high-poly room: 9,441,216 bytes, 446,348 triangles, three object animation clips |
| `assets/studio-mobile.glb` | Restored original mobile room: 3,376,992 bytes, 142,220 triangles, the same three clips |
| `assets/studio-preview.png` | Rendered transparent fallback image |
| `tools/build_scene.py` | First-creation Blender script; refuses a duplicate Portfolio Studio scene |
| `tools/retopology_character.py` | Run after first creation to refine the character; refuses repeated application |
| `tools/retopology_high.py` | Rebuild connected torso and arms, preserve a quad control cage, export high/mobile detail levels |
| `tools/integrate_tripo_room.py` | Local room placement, keyboard/arm pose adjustment, morph animation and high/mobile export |
| `evidence/retopology.json` | Measured mesh counts, manifold checks, subdivision and backup location |
| `evidence/retopology-high.json` | Connected cage validation and high-poly subdivision counts |
| `evidence/high-export.json` | Counts parsed from both saved GLB binaries |

The exported clips target `Head motion`, `Typing hand L` and `Typing hand R`. The glasses, eyes and hair move with the head. The model uses original procedural geometry, not generated or purchased third-party assets.

### Initial character topology refinement (before the high-poly pass)

Head, hair cap, sweatshirt and both hands now have welded cube-to-sphere quad cages (384 quads each), replacing the UV sphere poles. Both sleeves are continuous shoulder–elbow–wrist quad sweeps with shared quad disk caps (352 quads each). All seven edited base meshes were checked for closed manifold edges, quad faces and nonzero face area. One subdivision level evaluates to 1,536 faces per sphere cage and 1,408 faces per sleeve.

The GLB exports evaluated modifiers, including the existing furniture bevels, so the web scene represents the smooth Blender surfaces. Head and hand accessors contain 1,538 vertices, and each sleeve contains 1,410 vertices. The head remains aligned with the monitor. Existing object animations are retained; this pass does not add a skeleton or skin weights, and deformation under a future armature has not been tested.

Original character meshes are retained in the hidden `Character Retopology Sources` collection and excluded from GLB export. Pre-change disk assets and the live Blender session are backed up at `output/blender-backups/retopology-v1-before`. For rollback, open `live-session.blend` and restore the three asset files from that directory. To reproduce from a fresh Blender scene, run `tools/build_scene.py`, then `tools/retopology_character.py` through Blender Python/MCP.

### Active procedural character: connected retopology and high polygon

`Sweatshirt` now contains the torso and both complete sleeves as one connected mesh. Shoulder ports are cut into the torso cage and share welded boundary vertices with the arm loops; longitudinal rings pass through shoulder, elbow and wrist, ending in quad cuff caps. The source cage has 1,632 quads and 1,634 vertices, one connected component, zero boundary/non-manifold edges and no zero-area faces. This changes mesh connectivity rather than only increasing subdivision.

The torso/arms, head, hair cap and two hands use Subdivision 3 in the editable Blender source. These five primary surfaces evaluate to 202,752 quad faces (body 104,448; each of the other four 24,576). The high GLB exports the evaluated geometry. The mobile variant exports Subdivision 2 on these surfaces; `studio.js` chooses it on initial page loads below 700 CSS px. Resizing a loaded page keeps its already loaded model.

The high pass preserves the existing three object animations, the monitor-facing head, glasses and seated pose. It retains archived intermediate meshes in `High Retopology Sources` and excludes both source collections from export. It does not add facial anatomy, skeletal rigging or skin weights; rig deformation remains unverified. No FPS guarantee is made for the high-poly model.

For reproduction, run `tools/retopology_high.py` after the two preceding scripts. For rollback to the preceding model, restore `studio.blend`, `studio.glb`, and `studio-preview.png` from `output/blender-backups/retopology-high-before`, open its `live-session.blend`, and restore the previous loader selection if needed. Backup files remain local-only.

### Archived experiment: room with Tripo character and typing animation

The active saved Blender scene is `Portfolio Tripo Studio`. It copies the existing room, desk, monitor, computer, lights and camera, retains evaluated furniture bevels, and places the Tripo candidate facing the monitor. The original `Portfolio Studio` and `Tripo Character Review` scenes remain in the file for comparison.

The generated keyboard and seat shell are reused because they are merged with the character geometry. The preceding keyboard/keycaps and seat/back are omitted from the copied room to prevent duplicates. A local pose adjustment raises the keyboard, fingers and lower sleeves to desk height; the chair pedestal/base are aligned with the new seat. This is a local edit of a copied mesh, and the original FBX/candidate remain intact.

Animation is authored locally with three shape keys: `Type left`, `Type right`, and `Breathe`. The first two move exposed fingers alternately (2,291 and 2,581 vertices affected); breathing adds small head movement. The 97-frame / 24fps loop exports as one GLB clip with a `weights` channel and three morph targets. It is morph animation, not a skeletal rig, and does not claim independent finger bones or full-body retargeting.

Desktop retains the packed 2K PBR maps. Mobile uses duplicated 1024px images without modifying the original materials. Both variants were verified in a real browser for loading, animation, pause/resume, rotation/reset and responsive layout. No additional Tripo credits were used for placement, animation or export.

Rollback files are under `output/blender-backups/tripo-room-integration-before`; restore the four preceding asset files and open `live-session.blend` to return to the earlier procedural room. Current measured artifacts are recorded in `evidence/tripo-room.json` and `evidence/tripo-room-export.json`.

### User-selected restoration

The user selected the original character again. The active public assets (`studio.blend`, both GLBs, and the PNG fallback) were restored byte-for-byte from `output/blender-backups/tripo-room-integration-before`; SHA-256 verification is recorded in `evidence/character-restore.json`. Their timestamps were refreshed so existing browsers revalidate the changed files.

Blender's active scene is again `Portfolio Studio`. The live Tripo review/integration scenes and all generated candidate files remain separate. The preceding Tripo room assets were archived at the exact path in `character-restore.json`. Current exported identity is recorded in `evidence/original-restored-export.json`: original Head present, no Tripo character, three animations in both variants. The in-app browser was reloaded and the original character inspected visually.

## Provenance

- Three.js **0.180.0**, MIT. Only required ESM renderer/core, GLTFLoader and BufferGeometryUtils are bundled locally. [Official docs](https://threejs.org/docs/) · `assets/vendor/LICENSE`.
- LINE Seed Sans TH Regular/Bold, unchanged local WOFF2 files reused from the existing PMS demo. [Official source](https://seed.line.me/) · `assets/fonts/OFL.txt`.
- Blender **5.2.2 LTS**, live MCP. The current work used no external generator or paid credits.
- Browser audit uses axe-core **4.10.3** as a test-only artifact under `output/playwright/vendor`; it is not loaded by the portfolio.

## Safety and rollback

The current workspace already had modified/untracked README, demos, skills and tests. This task added only this demo and a README link; it does not commit, push or publish them.

The original Blender session was saved before scene creation at `D:\Projects\CodeLV8-ux-ui-agent-skill\output\blender-backups\portfolio-original-session.blend`. Open that file in Blender to restore the pre-task scene. The working scene is additive and isolated as `Portfolio Studio`; no original objects were deleted. Generated `.blend1` backups are also retained outside the demo's public directory.

For code rollback, archive only `demos/programmer-portfolio` and remove its new README entry after reviewing those exact targets. Preserve unrelated existing changes. Backup files are local-only and must not be published. No canonical architecture, registry, security, database or deployment notes were changed; this repository had no matching registry entry, so source identity was verified from the user-provided workspace and Git root.

See [QA.md](QA.md) for obtained evidence and limits.
