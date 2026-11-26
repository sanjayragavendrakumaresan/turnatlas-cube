import type { MotionBurst, MotionSample } from "./motion";

export interface VideoScanResult {
  durationSeconds: number;
  sampledFrames: number;
  bursts: MotionBurst[];
}

export type ProgressCallback = (progress: number) => void;

function waitForEvent(target: HTMLVideoElement, eventName: "loadedmetadata" | "seeked", timeoutMs = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("The video could not be decoded quickly enough. Try a shorter clip."));
    }, timeoutMs);
    const onSuccess = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("This browser could not read the video. Try an MP4 or WebM file."));
    };
    const cleanup = () => {
      window.clearTimeout(timer);
      target.removeEventListener(eventName, onSuccess);
      target.removeEventListener("error", onError);
    };
    target.addEventListener(eventName, onSuccess, { once: true });
    target.addEventListener("error", onError, { once: true });
  });
}

function toGrayscale(image: ImageData): Uint8Array {
  const output = new Uint8Array(image.width * image.height);
  for (let pixel = 0, index = 0; pixel < output.length; pixel++, index += 4) {
    output[pixel] = Math.round(image.data[index] * 0.2126 + image.data[index + 1] * 0.7152 + image.data[index + 2] * 0.0722);
  }
  return output;
}

function findBurstsInWorker(samples: MotionSample[]): Promise<MotionBurst[]> {
  if (typeof Worker === "undefined") {
    return import("./motion").then(({ detectMotionBursts }) => detectMotionBursts(samples));
  }
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("../workers/motion.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = event => {
      worker.terminate();
      if (event.data?.ok) resolve(event.data.bursts as MotionBurst[]);
      else reject(new Error(event.data?.error ?? "Motion scan failed."));
    };
    worker.onerror = () => {
      worker.terminate();
      reject(new Error("The local analysis worker stopped unexpectedly."));
    };
    worker.postMessage(samples, samples.map(sample => sample.grayscale.buffer));
  });
}

export async function analyzeVideoFile(
  file: File,
  startSeconds: number,
  endSeconds: number,
  onProgress: ProgressCallback = () => undefined,
): Promise<VideoScanResult> {
  if (!file.type.startsWith("video/")) throw new Error("Choose a video file to continue.");
  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.preload = "metadata";
  video.muted = true;
  video.playsInline = true;
  video.src = objectUrl;

  try {
    await waitForEvent(video, "loadedmetadata");
    const durationSeconds = video.duration;
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) throw new Error("The video duration could not be read.");
    if (durationSeconds > 60) throw new Error("The research prototype currently scans clips up to 60 seconds. Trim this video and try again.");

    const from = Math.max(0, Math.min(startSeconds, durationSeconds));
    const to = Math.max(from, Math.min(endSeconds, durationSeconds));
    if (to - from < 0.3) throw new Error("Choose a timing range at least 0.3 seconds long.");
    const step = Math.max(0.14, (to - from) / 420);
    const times: number[] = [];
    for (let time = from; time < to; time += step) times.push(time);
    times.push(to);

    const canvas = document.createElement("canvas");
    canvas.width = 40;
    canvas.height = 40;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("This browser could not create a local video sampling canvas.");

    const samples: MotionSample[] = [];
    for (let index = 0; index < times.length; index++) {
      const targetTime = times[index];
      if (Math.abs(video.currentTime - targetTime) > 0.01) {
        const seeked = waitForEvent(video, "seeked");
        video.currentTime = targetTime;
        await seeked;
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      samples.push({ timeSeconds: targetTime, grayscale: toGrayscale(context.getImageData(0, 0, canvas.width, canvas.height)) });
      if (index % 4 === 0 || index === times.length - 1) onProgress((index + 1) / times.length);
    }

    const bursts = await findBurstsInWorker(samples);
    return { durationSeconds, sampledFrames: samples.length, bursts };
  } finally {
    video.pause();
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(objectUrl);
  }
}
