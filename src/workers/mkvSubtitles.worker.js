/* global globalThis:readonly */
import { MkvSubtitles } from '../lib/mkvSubtitles';
import { scanMkvSubtitles } from '../lib/scanMkvSubtitles';
let controller;
globalThis.onmessage = async event => {
  if (event.data.type === 'stop') { controller?.abort(); return; }
  if (event.data.type !== 'start' || controller) return;
  controller = new AbortController();
  let cues = [], lastUpdate = 0;
  const flush = () => { if (cues.length) { globalThis.postMessage({ type: 'cues', cues }); cues = []; } };
  try {
    const result = await scanMkvSubtitles(event.data.url, {
      signal: controller.signal,
      onTrack: track => globalThis.postMessage({ type: 'track', track }),
      onCue: (track, cue) => { cues.push({ track: track.number, ...cue }); if (cues.length >= 100) flush(); },
      onProgress: progress => { if (performance.now() - lastUpdate > 300) { lastUpdate = performance.now(); flush(); globalThis.postMessage({ type: 'progress', ...progress }); } },
    }, MkvSubtitles);
    flush(); globalThis.postMessage({ type: 'done', ...result });
  } catch (error) {
    flush(); globalThis.postMessage({ type: error.name === 'AbortError' ? 'stopped' : 'error', message: error instanceof TypeError ? 'Não foi possível ler o vídeo. Confira sua conexão, a API e a validade do link.' : error.message });
  } finally { controller = null; }
};
