export interface MotionSample {
  timeSeconds: number;
  grayscale: Uint8Array;
}

export interface MotionBurst {
  id: string;
  startSeconds: number;
  endSeconds: number;
  activity: number;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function frameDifference(left: Uint8Array, right: Uint8Array): number {
  if (left.length !== right.length || left.length === 0) return 0;
  let sum = 0;
  for (let index = 0; index < left.length; index++) {
    sum += Math.abs(left[index] - right[index]);
  }
  return sum / left.length / 255;
}

/**
 * Finds bursts of image change. This is a motion-candidate detector, not a cube-move classifier.
 * Hand movement, camera shake, lighting changes, and background motion can all produce candidates.
 */
export function detectMotionBursts(samples: MotionSample[]): MotionBurst[] {
  if (samples.length < 3) return [];
  const differences = samples.slice(1).map((sample, index) => frameDifference(samples[index].grayscale, sample.grayscale));
  const baseline = median(differences);
  const deviations = differences.map(value => Math.abs(value - baseline));
  const threshold = Math.max(0.025, baseline + Math.max(0.012, median(deviations) * 2.5));
  const active = differences.map(value => value > threshold);
  const bursts: MotionBurst[] = [];
  const maxQuietGap = 2;
  let index = 0;

  while (index < active.length) {
    if (!active[index]) {
      index++;
      continue;
    }
    const startIndex = index;
    let lastActive = index;
    let quiet = 0;
    index++;
    while (index < active.length) {
      if (active[index]) {
        lastActive = index;
        quiet = 0;
      } else {
        quiet++;
        if (quiet > maxQuietGap) break;
      }
      index++;
    }
    const endIndex = Math.min(samples.length - 1, lastActive + 1);
    const startSeconds = samples[startIndex].timeSeconds;
    const endSeconds = samples[endIndex].timeSeconds;
    const span = differences.slice(startIndex, lastActive + 1);
    const activity = span.reduce((sum, value) => sum + value, 0) / Math.max(1, span.length);
    if (endSeconds - startSeconds >= 0.08) {
      bursts.push({
        id: `motion-${bursts.length + 1}`,
        startSeconds,
        endSeconds,
        activity: Math.min(1, activity),
      });
    }
  }

  return bursts;
}
