# TurnAtlas implementation plan

## Product goal

Build an original open-source web app that reconstructs the **moves performed** in a 3×3 cube solve from ordinary video and presents a timestamped, synchronized video/3D replay. This is not the same as detecting the final cube state and generating a solution. The app must show uncertainty and allow correction rather than inventing a confident move transcript.

## Architecture and constraints

The first version is a static React + TypeScript app on managed Webdev, with video processing in the browser. A Web Worker handles frame sampling and intensive work; browser-compatible vision inference uses only weights with verified distribution terms; TypeScript cube logic validates notation and state transitions. The local-only boundary avoids sending/retaining private footage and avoids moving heavy inference to a small application server. The first version has no accounts, database, persistent uploads, or human review.

Processing flow: load a local video; decode/sample frames; detect cube, visible facelets, and pose; estimate turn intervals and move labels; emit a chronological timestamped sequence with per-move confidence; validate against an optional known scramble/starting state; render a move report synchronized with video and a 3D cube. Intermediate observations and ambiguity must remain inspectable instead of being collapsed into unsupported hard labels.

The public code survey found no verified drop-in model for arbitrary-video move-history reconstruction. Labeled data and model training/evaluation are material dependencies. Do not copy code/checkpoints with absent licenses, and do not include user footage or derived annotations in the public repository without explicit permission and compatible terms. MIT applies only to original source code; model, dataset, and dependency licenses/provenance must be recorded separately.

First inference target: short, well-lit clips with one visible 3×3 cube, stable framing, and limited occlusion. The system must automatically propose intervals and moves, expose low-confidence intervals for correction, and abstain when unsupported. Broader camera angles, cube types, lighting, rapid/occluded solves, and accuracy claims require labeled held-out recordings and sequence-level evaluation. A single user clip can validate intake and expose failure modes, but cannot establish general accuracy.

## Project structure

- `client/src/pages/` — landing/demo, local-video setup wizard, and solve report routes.
- `client/src/components/` — video timeline, move strip, 3D cube view, confidence/correction controls, and responsive UI pieces.
- `client/src/vision/` — frame sampling, geometric/color observations, motion-interval proposals, inference adapter, confidence types, and worker messages.
- `client/src/cube/` — move notation, cube state representation, legality checks, sequence application, and replay timing.
- `client/src/workers/` — browser worker entry points that keep frame processing off the UI thread.
- `client/public/models/` — only weights approved for public distribution; each asset must have source/version/license metadata.
- `docs/` — supported-video guidance, privacy/data policy, inference limitations, dataset schema, and contribution guide.
- `tests/` — deterministic cube-notation/state tests and synthetic fixtures; no private video committed by default.

The initialized `web-db-user` starter runs as static Vite output because Server and Database are disabled. Build the app using its React/TypeScript frontend and static dev/build commands; do not add backend infrastructure, accounts, or external inference services without a separate plan and approval.

## Design direction

Use solve.vision only as a functional reference; do not reuse its name, logo, videos, proprietary page copy, or other third-party assets. The original visual direction is a “precision instrument for cube solvers”: deep ink/navy surfaces, clear off-white type, violet for active playback, and a distinctive chartreuse confidence marker. Layout prioritizes one solve timeline with video and 3D replay together, not a generic centered dashboard.

Core principles: make uncertainty visible; synchronize video, moves, and cube state; keep corrections reversible; explain video requirements and privacy before processing. Signature motifs: an orbiting-facelet wordmark, a confidence trace on the timeline, and a bright current-move indicator on the 3D replay. Interactions must be keyboard-accessible and precise; scrubbing, choosing a move, and changing its label update linked views. Keep motion short and functional, support reduced motion, and animate the cube only during replay.

Typography pairs a contemporary sans serif for interface text with tabular/monospaced notation and timestamps. Brand essence: “TurnAtlas maps the moves hidden in a cube solve video.” Personality: precise, candid, curious. Voice is direct and transparent, e.g. “Review the turns we could not read confidently.” and “Your clip stays on this device.” The logo is a custom orbiting-facelet glyph plus TurnAtlas wordmark. Chartreuse is the ownable signature color, primarily used for confidence and active annotations.

## Privacy, licensing, and public repository

Default processing is local in the browser. Do not retain uploads or use footage for training. The public repository is `https://github.com/sanjayragavendrakumaresan/turnatlas-cube`, public, MIT for original source code. Model weights/data and dependencies need independently verified terms. The website itself is not authorized for publication by the repo confirmation.
