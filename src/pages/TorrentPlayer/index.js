import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FiLink, FiSquare } from 'react-icons/fi';
import WebTorrent from 'webtorrent/dist/webtorrent.min.js';

const VIDEO_EXTENSION = /\.(mp4|m4v|webm|ogv|ogg|mov|mkv|avi)$/i;

export default function TorrentPlayer() {
  const [source, setSource] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [torrentName, setTorrentName] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [peerCount, setPeerCount] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const clientRef = useRef(null);
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  const disposeClient = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (clientRef.current) {
      clientRef.current.destroy();
      clientRef.current = null;
    }
  };

  useEffect(() => () => disposeClient(), []);

  useEffect(() => {
    const selectedFile = files[selectedFileIndex];
    const video = videoRef.current;
    if (!selectedFile || !video) return undefined;

    selectedFile.streamTo(video);
    video.load();

    return () => {
      video.removeAttribute('src');
      video.load();
    };
  }, [files, selectedFileIndex]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const torrentSource = source.trim();
    const isMagnet = /^magnet:\?/i.test(torrentSource);
    const isTorrentUrl = /^https?:\/\//i.test(torrentSource);

    if (!isMagnet && !isTorrentUrl) {
      setError('Informe um link magnet ou uma URL HTTP/HTTPS para o arquivo .torrent.');
      setStatus('error');
      return;
    }

    disposeClient();
    setError('');
    setFiles([]);
    setTorrentName('');
    setProgress(0);
    setPeerCount(0);
    setDownloadSpeed(0);
    setSelectedFileIndex(0);
    setStatus('loading');

    try {
      if (!window.isSecureContext || !('serviceWorker' in navigator)) {
        throw new Error('O streaming P2P exige HTTPS. Em desenvolvimento, use localhost.');
      }

      const registration = await navigator.serviceWorker.register('/webtorrent-sw.js', { scope: '/' });
      let worker = registration.active || registration.waiting || registration.installing;
      if (!worker) throw new Error('Não foi possível iniciar o serviço de streaming.');

      if (worker.state !== 'activated') {
        await new Promise((resolve, reject) => {
          const onStateChange = () => {
            if (worker.state === 'activated') {
              worker.removeEventListener('statechange', onStateChange);
              resolve();
            } else if (worker.state === 'redundant') {
              worker.removeEventListener('statechange', onStateChange);
              reject(new Error('O serviço de streaming não foi ativado. Recarregue a página e tente novamente.'));
            }
          };
          worker.addEventListener('statechange', onStateChange);
        });
      }

      const client = new WebTorrent({ dht: false, lsd: false, natUpnp: false, natPmp: false });
      clientRef.current = client;
      client.createServer({ controller: registration });
      client.on('error', (torrentError) => {
        setError(torrentError.message || 'Falha ao iniciar o torrent.');
        setStatus('error');
      });

      const torrent = client.add(torrentSource, (loadedTorrent) => {
        const videoFiles = loadedTorrent.files
          .filter((file) => VIDEO_EXTENSION.test(file.name));

        setTorrentName(loadedTorrent.name);
        setFiles(videoFiles);
        setStatus(videoFiles.length ? 'ready' : 'error');
        if (!videoFiles.length) setError('Este torrent não contém arquivos de vídeo compatíveis.');

        const updateStats = () => {
          setProgress(Math.round(loadedTorrent.progress * 100));
          setPeerCount(loadedTorrent.numPeers);
          setDownloadSpeed(loadedTorrent.downloadSpeed);
        };
        updateStats();
        timerRef.current = window.setInterval(updateStats, 1000);
      });

      torrent.on('error', (torrentError) => {
        setError(torrentError.message || 'Não foi possível carregar este torrent.');
        setStatus('error');
      });
    } catch (torrentError) {
      disposeClient();
      setError(torrentError.message || 'Não foi possível iniciar o player torrent.');
      setStatus('error');
    }
  };

  const handleStop = () => {
    disposeClient();
    setFiles([]);
    setTorrentName('');
    setProgress(0);
    setPeerCount(0);
    setDownloadSpeed(0);
    setStatus('idle');
    setError('');
  };

  return (
    <>
      <Helmet>
        <title>Gon.TV - Player Torrent</title>
      </Helmet>
      <main className="min-h-screen bg-black-dark px-4 py-10 text-white sm:px-6">
        <section className="mx-auto max-w-5xl">
          <header className="mb-8 border-b border-zinc-700 pb-5">
            <p className="mb-2 text-sm font-semibold uppercase text-emerald-400">Reprodução P2P</p>
            <h1 className="text-3xl font-bold">Player Torrent</h1>
          </header>

          <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="torrent-source">Link magnet ou URL do arquivo torrent</label>
            <input
              id="torrent-source"
              type="url"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              placeholder="Cole um link magnet ou a URL de um arquivo .torrent"
              className="min-w-0 flex-1 border border-zinc-600 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center justify-center gap-2 bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
            >
              <FiLink aria-hidden="true" />
              {status === 'loading' ? 'Conectando...' : 'Reproduzir'}
            </button>
            {status !== 'idle' && (
              <button
                type="button"
                onClick={handleStop}
                title="Parar reprodução"
                aria-label="Parar reprodução"
                className="flex items-center justify-center border border-zinc-600 px-4 py-3 text-white hover:border-rose-400 hover:text-rose-400"
              >
                <FiSquare aria-hidden="true" />
              </button>
            )}
          </form>

          <p className="mb-6 max-w-3xl text-sm text-zinc-400">
            O navegador conecta a peers WebRTC. Torrents sem peers compatíveis podem não iniciar; URLs .torrent também dependem de permissão CORS no servidor de origem.
          </p>

          {error && (
            <p role="alert" className="mb-5 border-l-4 border-rose-500 bg-zinc-900 px-4 py-3 text-rose-200">
              {error}
            </p>
          )}

          {status === 'loading' && <p className="mb-5 text-emerald-300">Buscando metadados do torrent...</p>}

          {files.length > 0 && (
            <section aria-label="Reprodução do torrent">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold">{torrentName}</h2>
                  <p className="text-sm text-zinc-400">{progress}% recebido · {peerCount} peers · {formatSpeed(downloadSpeed)}</p>
                </div>
                {files.length > 1 && (
                  <label className="flex items-center gap-3 text-sm">
                    Vídeo
                    <select
                      value={selectedFileIndex}
                      onChange={(event) => setSelectedFileIndex(Number(event.target.value))}
                      className="max-w-full border border-zinc-600 bg-zinc-900 px-3 py-2 text-white"
                    >
                      {files.map((file, index) => (
                        <option key={file.path} value={index}>{file.name}</option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
              <progress className="mb-4 h-1 w-full accent-emerald-400" value={progress} max="100" />
              <video ref={videoRef} className="aspect-video w-full bg-black" controls playsInline />
            </section>
          )}
        </section>
      </main>
    </>
  );
}

function formatSpeed(bytesPerSecond) {
  if (bytesPerSecond < 1024) return `${bytesPerSecond} B/s`;
  if (bytesPerSecond < 1024 * 1024) return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
  return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
}