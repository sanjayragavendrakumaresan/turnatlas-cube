# turnatlas-cube
Open-source browser-based Rubik’s Cube video solve reconstruction and move-by-move replay.

## Current prototype

The current browser-only prototype accepts short local 3×3 solve videos, samples frames locally, highlights image-change intervals, allows manual move labels and timestamp edits, and replays the reviewed labels on a 3D cube. It includes cube notation/state logic and a responsive review UI.

**Important:** image-change intervals are not recognized cube turns. The prototype does not yet detect cube pose/facelets or automatically reconstruct a performed move sequence. Hand movement, camera shake, and lighting changes can trigger candidates. No accuracy claim is made. A usable recognition system still needs labeled clips, a vision model, and held-out sequence-level evaluation. Clips stay in the browser and are not used for training by default; do not commit private footage.

## Run locally

Requirements: Node.js and pnpm 10.18.0.

```sh
pnpm install --frozen-lockfile
pnpm dev:static
```

Checks: `pnpm check`, `pnpm test`, and `pnpm build:static`.

Contributions are welcome, especially reproducible datasets with consent/licensing provenance, cube pose and move recognition, and evaluation. Keep source/model/dataset/dependency terms distinct; original project source is MIT licensed (see `LICENSE`).
