import { detectMotionBursts, type MotionSample } from "../vision/motion";

self.onmessage = (event: MessageEvent<MotionSample[]>) => {
  try {
    const bursts = detectMotionBursts(event.data ?? []);
    self.postMessage({ ok: true, bursts });
  } catch (error) {
    self.postMessage({ ok: false, error: error instanceof Error ? error.message : "Motion scan failed." });
  }
};
