export function createSubtitleWorker() {
  return new Worker(new URL('../workers/mkvSubtitles.worker.js', import.meta.url));
}
