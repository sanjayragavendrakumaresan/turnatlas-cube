import { describe, expect, it } from "vitest";
import { detectMotionBursts, type MotionSample } from "./motion";

const flat = (value: number) => new Uint8Array(64).fill(value);

function samplesWithMotion(): MotionSample[] {
  const values = [20, 20, 20, 180, 180, 20, 20, 20, 20];
  return values.map((value, index) => ({ timeSeconds: index * 0.15, grayscale: flat(value) }));
}

describe("motion candidate scan", () => {
  it("does not call motion intervals cube moves", () => {
    const bursts = detectMotionBursts(samplesWithMotion());
    expect(bursts.length).toBeGreaterThan(0);
    expect(bursts[0].activity).toBeGreaterThan(0);
    expect(bursts[0].startSeconds).toBeLessThan(bursts[0].endSeconds);
  });

  it("returns no candidates for too few frames or identical frames", () => {
    expect(detectMotionBursts([])).toEqual([]);
    expect(detectMotionBursts([{ timeSeconds: 0, grayscale: flat(50) }])).toEqual([]);
    const steady = Array.from({ length: 8 }, (_, index) => ({ timeSeconds: index * 0.2, grayscale: flat(50) }));
    expect(detectMotionBursts(steady)).toEqual([]);
  });
});
