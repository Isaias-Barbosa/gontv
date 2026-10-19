function waitForRetry(ms, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
      reject(new DOMException('Busca interrompida.', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort);
      resolve();
    }, ms);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
  });
}

export async function scanMkvSubtitles(url, { signal, onTrack, onCue, onProgress, onRetry }, Parser) {
  let response;
  const attempts = 3;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    response = await fetch(url, { signal });
    if (![502, 503, 504].includes(response.status)) break;
    await response.body?.cancel().catch(() => {});
    if (attempt === attempts) {
      throw new Error(`O servidor do vídeo não respondeu após ${attempts} tentativas (HTTP ${response.status}). Tente mais tarde ou importe uma legenda .srt/.vtt. Isso não confirma que o link expirou.`);
    }
    onRetry?.({ attempt: attempt + 1, attempts, status: response.status });
    await waitForRetry(attempt * 2000, signal);
  }
  if (!response.ok) throw new Error([401, 403, 404, 410].includes(response.status)
    ? `Não foi possível acessar o MKV (HTTP ${response.status}). Confira a permissão e a validade do link.`
    : `Não foi possível ler o MKV (HTTP ${response.status}). Tente novamente mais tarde.`);
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
