# TurnAtlas outcomes

## 1. Original public product experience

- The app is branded TurnAtlas and explains that it attempts to reconstruct the moves actually performed in a 3×3 Rubik’s Cube solve video, not merely calculate a solution for the final cube state.
- The public experience includes a landing/demo page, a local-video setup flow, a reconstruction report/replay view, and privacy/use guidance.
- The design uses an original dark precision-instrument visual language with distinct TurnAtlas branding. It does not copy solve.vision’s name, logo, video, proprietary wording, or third-party assets without permission.
- The example data and visuals are either original/synthetic or included with verified rights and attribution.

## 2. Local video intake and preparation

- Users can select or drop a short local 3×3 solve video, preview it, and remove/replace it before analysis.
- The setup flow presents the steps Video, Scramble, Timing, Framing, and Upload/Analyse, and explains that the initial supported clips should keep one cube visible, in focus, well lit, and in frame through the solve.
- Users can provide an optional known scramble or starting state for validation. The UI explains that a solver-generated solution is not a reconstruction of the moves performed in the clip.
- Users can review/adjust solve start and end markers and, where implemented, crop or mask irrelevant additional cubes before processing.
- Unsupported formats, unreadable files, excessive duration/size, and missing required inputs produce clear, recoverable messages.
- Processing occurs in the browser by default. The app does not send or persist the video, require an account, or use the footage for training or human review.

## 3. Automatic chronological move reconstruction

- The inference path decodes/samples the selected clip, estimates cube/visible-facelet observations and pose over time, proposes move intervals, and infers chronological move notation rather than solving only the final state.
- Each proposed move carries a video timestamp and confidence/review state. The pipeline preserves ambiguous observations and abstains or flags a move when evidence is insufficient; it does not fabricate a complete sequence.
- A user can correct uncertain move labels and timing before treating the transcript as reviewed.
- When a known scramble/starting state is supplied, the sequence can be applied to that state and checked for consistency; this validation is clearly distinguished from visual recognition.
- The initial support claim is limited to the tested recording conditions. Broader lighting, camera angles, cube types, occlusion, fast turns, or sequence-level accuracy are not claimed without labeled held-out evaluation evidence.

## 4. Synchronized report and replay

- The report contains the selected video, a 3D cube reconstruction/replay, a chronological move list, timestamps, confidence/review indicators, and a timeline.
- Selecting a move seeks the video to the corresponding time and updates the 3D cube to the corresponding move state; video playback updates the active move/timeline position.
- The report supports both a solver-oriented/cuber’s view and a camera-oriented view where the implementation can represent them accurately.
- Users can edit uncertain moves and replay the corrected sequence without losing the original source video.
- Controls work responsively and with keyboard navigation; reduced-motion preferences are respected.

## 5. Open-source and responsible data handling

- The public GitHub repository is `sanjayragavendrakumaresan/turnatlas-cube`; original source is under MIT. Its README explains setup, supported input constraints, current algorithm limitations, and how to contribute.
- No unlicensed reference code, model checkpoint, dataset, video, or visual asset is copied into the repository. Model, dataset, and dependency provenance/licensing are recorded separately from the source license.
- User-provided clips are private test material unless the user separately authorizes public inclusion. No private video is committed by default.
- The app’s own privacy notice describes local processing, non-retention, and the fact that video is not used for training by default.

## 6. Build and handoff

- The static React/TypeScript app builds with the pinned project toolchain and includes its route manifest before the first dev-server start.
- The project is checked with the registered TypeScript diagnostics and its available type/build/tests before delivery.
- The change is saved to the managed Webdev canonical repository as a checkpoint. The approved public GitHub repository is synchronized without deleting its existing README/license or rewriting its history.
- The website is not published unless the user asks for publication.
