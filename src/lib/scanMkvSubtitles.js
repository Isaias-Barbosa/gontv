export async function scanMkvSubtitles(url, { signal, onTrack, onCue, onProgress }, Parser) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Não foi possível ler o MKV (HTTP ${response.status}). O link pode ter expirado.`);
  if (!response.body) throw new Error('Este navegador não permite leitura progressiva do MKV.');
  const parser = new Parser(onTrack, onCue);
  const total = Number(response.headers.get('content-length')) || 0;
  const reader = response.body.getReader();
  let read = 0;
  try {
    while (true) {
      if (signal.aborted) throw new DOMException('Busca interrompida.', 'AbortError');
      const { done, value } = await reader.read();
      if (done) break;
      read += value.length;
      parser.push(value);
      onProgress({ read, total });
    }
    parser.finish();
    return { read, total, tracks: parser.tracks.size, cues: parser.cueCount };
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
