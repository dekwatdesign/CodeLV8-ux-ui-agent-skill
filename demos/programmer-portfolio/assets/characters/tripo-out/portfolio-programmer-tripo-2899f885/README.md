# Tripo programmer candidate

Generated and inspected on 2026-10-13 via the explicitly confirmed Tripo 3D plan.

- Task: `2899f885-313a-4997-93eb-fbadb14f5437`
- Model: CLI `tripo-v3.1`, API `v3.1-20260211`
- One `text_to_model` operation, detailed geometry, quad output, texture/PBR, auto size.
- Actual charge: 45 credits total for this one task. Balance observed after generation: 425, with zero frozen credits. Local import, render and GLB export used no additional Tripo credits.

## Files and checks

- `model.fbx`: original Tripo output; unchanged.
- `task.json`: original task metadata, including prompt, billed credits and dates.
- `preview.png`: Tripo preview (image bytes may be WebP despite the CLI filename).
- `blender-preview.png`: actual Blender render, inspected visually.
- `character.blend`: editable local review scene with packed PBR images; also preserves the existing Blender scenes.
- `character.glb`: local web-format export of only the active review scene, with embedded textures.
- `blender-inspection.json`: measured original mesh counts and image metadata.
- `glb-verification.json`: saved GLB counts and embedded-image checks.

The original FBX imports as one mesh: 48,939 vertices and 48,849 faces, of which 48,764 are quads, 80 triangles and 5 ngons. Four source PBR maps (color, roughness, metallic, normal) are 2048×2048 and packed. The local review root normalizes the seated asset to a 1.6 m bounding height and faces it toward Blender -Y; the original FBX remains unchanged.

## Observed limits

The generation included a keyboard and a chair shell despite the intended isolated-character prompt. These props are merged into the main connected geometry rather than separate large components. There are also small disconnected geometry islands. Manual separation/cleanup is needed before placing the character into the existing desk/chair setup.

This candidate has no armature or animation. It was not substituted into the portfolio room; the existing animated room and its assets remain unchanged. No paid reroll, segmentation, rig or conversion was submitted. A failed local GLB assertion revealed an unrelated original-scene cube in the first multi-scene export; exporting with `use_active_scene=True` corrected this, and the final file passes one-mesh/one-scene checks.

The scene added to Blender is `Tripo Character Review`. The preceding live session is saved under `D:\Projects\CodeLV8-ux-ui-agent-skill\output\blender-backups\tripo-review-before\live-session.blend` for rollback.
