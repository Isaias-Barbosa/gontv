import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FiLink, FiSquare, FiUsers, FiDownload, FiUpload, FiPlay, FiInfo, FiCloud, FiCheckCircle, FiFilePlus } from 'react-icons/fi';
import VideoPlayer from 'components/VideoPlayer';

const WEBRTC_TRACKERS = [
  'wss://tracker.openwebtorrent.com',
  'wss://tracker.webtorrent.dev',
];

const LOCAL_WEBTORRENT_URL = `${process.env.PUBLIC_URL || ''}/webtorrent.min.js`;
const CDN_WEBTORRENT_URL = 'https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js';

let webtorrentPromise;
function loadWebTorrentSdk() {
  if (typeof window !== 'undefined' && window.WebTorrent) {
    return Promise.resolve(window.WebTorrent);
  }

  if (!webtorrentPromise) {
    webtorrentPromise = new Promise((resolve, reject) => {
      const loadScript = (src, isFallback = false) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;

        script.addEventListener('load', () => {
          if (window.WebTorrent) {
            resolve(window.WebTorrent);
          } else if (!isFallback) {
            loadScript(CDN_WEBTORRENT_URL, true);
          } else {
            webtorrentPromise = null;
            reject(new Error('O SDK do WebTorrent foi carregado, mas não está disponível no navegador.'));
          }
        }, { once: true });

        script.addEventListener('error', () => {
          script.remove();
          if (!isFallback) {
            loadScript(CDN_WEBTORRENT_URL, true);
          } else {
            webtorrentPromise = null;
            reject(new Error('Não foi possível carregar o WebTorrent. Verifique sua conexão com a internet.'));
          }
        }, { once: true });

        document.head.appendChild(script);
      };

      loadScript(LOCAL_WEBTORRENT_URL);
    });
  }

  return webtorrentPromise;
}

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
}

export default function TorrentPlayer() {
  const [activeTab, setActiveTab] = useState('webtorrent'); // 'webtorrent' | 'r2'

  // WebTorrent state
  const [torrentSource, setTorrentSource] = useState('');
  const [torrentStatus, setTorrentStatus] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'error'
  const [torrentError, setTorrentError] = useState('');
  const [torrentName, setTorrentName] = useState('');
  const [torrentFiles, setTorrentFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [stats, setStats] = useState({
    peers: 0,
    downloadSpeed: '0 B/s',
    uploadSpeed: '0 B/s',
    progress: 0,
    downloaded: '0 B',
    total: '0 B',
  });

  const clientRef = useRef(null);
  const torrentRef = useRef(null);
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const statsTimerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Cloudflare R2 state
  const [r2Url, setR2Url] = useState('');
  const [activeR2Source, setActiveR2Source] = useState('');

  // Cleanup WebTorrent on unmount
  useEffect(() => {
    return () => {
      if (statsTimerRef.current) clearInterval(statsTimerRef.current);
      if (clientRef.current) {
        try {
          clientRef.current.destroy();
        } catch {}
      }
    };
  }, []);

  const handleStopTorrent = () => {
    if (statsTimerRef.current) {
      clearInterval(statsTimerRef.current);
      statsTimerRef.current = null;
    }
    if (clientRef.current) {
      try {
        clientRef.current.destroy();
      } catch {}
      clientRef.current = null;
    }
    torrentRef.current = null;
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
    }
    if (playerContainerRef.current) {
      playerContainerRef.current.replaceChildren();
    }
    setTorrentStatus('idle');
    setTorrentError('');
    setTorrentName('');
    setTorrentFiles([]);
    setStats({
      peers: 0,
      downloadSpeed: '0 B/s',
      uploadSpeed: '0 B/s',
      progress: 0,
      downloaded: '0 B',
      total: '0 B',
    });
  };

  const playTorrentFile = (file) => {
    if (!file) return;

    if (playerContainerRef.current) {
      playerContainerRef.current.replaceChildren();
    }

    try {
      file.renderTo(videoRef.current, { autoplay: true }, (err) => {
        if (err) {
          console.warn('renderTo falhou, tentando appendTo:', err);
          if (playerContainerRef.current) {
            file.appendTo(playerContainerRef.current, { autoplay: true });
          }
        }
      });
    } catch {
      if (playerContainerRef.current) {
        file.appendTo(playerContainerRef.current, { autoplay: true });
      }
    }
  };

  const startTorrentWithSource = async (source) => {
    handleStopTorrent();

    if (!source) return;

    // Check if source is an HTTP/HTTPS URL to a .torrent file from sites that block CORS (like nyaa.si)
    if (typeof source === 'string' && /^https?:\/\//i.test(source) && /\.torrent(\?.*)?$/i.test(source)) {
      if (source.includes('nyaa.si')) {
        setTorrentError(
          'O Nyaa bloqueia o download direto de arquivos .torrent pelo navegador (bloqueio de CORS). Use o Link Magnet (ícone de ímã 🧲 no Nyaa) ou baixe o arquivo .torrent no seu computador e envie no botão abaixo.'
        );
        setTorrentStatus('error');
        return;
      }
    }

    setTorrentStatus('loading');
    setTorrentError('');

    try {
      const WebTorrentClass = await loadWebTorrentSdk();
      const client = new WebTorrentClass();
      clientRef.current = client;

      client.on('error', (err) => {
        console.error('WebTorrent client error:', err);
        const msg = err.message || '';
        if (msg.includes('Failed to fetch') || msg.includes('CORS') || msg.includes('NetworkError')) {
          setTorrentError(
            'Não foi possível baixar o arquivo .torrent devido à política de CORS do servidor de origem. Copie o Link Magnet (ícone de ímã 🧲) ou envie o arquivo .torrent baixado do seu PC.'
          );
        } else {
          setTorrentError(msg || 'Erro no cliente WebTorrent.');
        }
        setTorrentStatus('error');
      });

      client.add(source, { announce: WEBRTC_TRACKERS }, (torrent) => {
        torrentRef.current = torrent;
        setTorrentName(torrent.name || 'Torrent carregado');
        setTorrentFiles(torrent.files || []);
        setTorrentStatus('ready');

        // Look for video file: mp4, mkv, webm, etc.
        const videoFiles = torrent.files.filter((f) => /\.(mp4|mkv|webm|m4v|mov|avi)$/i.test(f.name));
        const targetIndex = videoFiles.length > 0 ? torrent.files.indexOf(videoFiles[0]) : 0;
        setSelectedFileIndex(targetIndex);

        playTorrentFile(torrent.files[targetIndex]);

        // Start stats loop
        statsTimerRef.current = setInterval(() => {
          if (!torrent || torrent.destroyed) return;
          setStats({
            peers: torrent.numPeers || 0,
            downloadSpeed: formatBytes(torrent.downloadSpeed) + '/s',
            uploadSpeed: formatBytes(torrent.uploadSpeed) + '/s',
            progress: (torrent.progress * 100).toFixed(1),
            downloaded: formatBytes(torrent.downloaded),
            total: formatBytes(torrent.length),
          });
        }, 1000);

        torrent.on('error', (err) => {
          console.error('Torrent error:', err);
          setTorrentError(err.message || 'Erro ao processar o torrent.');
          setTorrentStatus('error');
        });
      });
    } catch (err) {
      console.error(err);
      setTorrentError(err.message || 'Falha ao inicializar o WebTorrent.');
      setTorrentStatus('error');
    }
  };

  const handleTorrentSubmit = (event) => {
    event.preventDefault();
    startTorrentWithSource(torrentSource.trim());
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setTorrentSource(file.name);
      startTorrentWithSource(file);
      event.target.value = '';
    }
  };

  const handleSelectFile = (index) => {
    setSelectedFileIndex(index);
    if (torrentRef.current && torrentRef.current.files[index]) {
      playTorrentFile(torrentRef.current.files[index]);
    }
  };

  const handleR2Submit = (event) => {
    event.preventDefault();
    const cleanUrl = r2Url.trim();
    if (!cleanUrl) return;
    setActiveR2Source(cleanUrl);
  };

  return (
    <>
      <Helmet>
        <title>Gon.TV - Player WebTorrent & Cloudflare R2</title>
      </Helmet>
      <main className="min-h-screen bg-black-dark px-4 py-10 text-white sm:px-6">
        <section className="mx-auto max-w-5xl">
          <header className="mb-8 border-b border-zinc-700 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mb-1 text-sm font-semibold uppercase text-emerald-400">Streaming & Testes</p>
                <h1 className="text-3xl font-bold">Player de Vídeo</h1>
              </div>

              {/* Navigation Tabs */}
              <div className="flex rounded-lg border border-zinc-700 bg-zinc-900 p-1">
                <button
                  type="button"
                  onClick={() => {
                    handleStopTorrent();
                    setActiveTab('webtorrent');
                  }}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                    activeTab === 'webtorrent'
                      ? 'bg-emerald-500 text-black shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <FiLink aria-hidden="true" />
                  WebTorrent (P2P)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleStopTorrent();
                    setActiveTab('r2');
                  }}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                    activeTab === 'r2'
                      ? 'bg-emerald-500 text-black shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <FiCloud aria-hidden="true" />
                  Cloudflare R2 / Direto
                </button>
              </div>
            </div>
          </header>

          {/* TAB 1: WEBTORRENT */}
          {activeTab === 'webtorrent' && (
            <div>
              <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4 text-emerald-200">
                <div className="flex items-start gap-3">
                  <FiInfo className="mt-1 shrink-0 text-xl text-emerald-400" />
                  <div className="text-sm">
                    <p className="font-semibold text-emerald-300">Como usar o WebTorrent no navegador:</p>
                    <ul className="mt-1.5 list-inside list-disc space-y-1 text-zinc-300">
                      <li>
                        <strong>Link Magnet (Recomendado):</strong> Copie o link do ícone de ímã (🧲) no site de anime e cole abaixo. Não sofre bloqueio de CORS.
                      </li>
                      <li>
                        <strong>Arquivo .torrent:</strong> Baixe o arquivo no seu computador e envie pelo botão abaixo ou arraste para cá.
                      </li>
                      <li>
                        <strong>Aviso sobre Peers:</strong> Conecta exclusivamente com peers <strong>WebRTC</strong> (navegadores e WebTorrent Desktop). Se o torrent só tiver sementes em clientes TCP/UDP tradicionais, o número de peers ficará em 0.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <form onSubmit={handleTorrentSubmit} className="mb-3 flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="torrent-source">Link magnet ou URL .torrent</label>
                <input
                  id="torrent-source"
                  type="text"
                  value={torrentSource}
                  onChange={(event) => setTorrentSource(event.target.value)}
                  placeholder="Cole um link Magnet (magnet:?xt=...) ou nome do arquivo"
                  className="min-w-0 flex-1 border border-zinc-600 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                  required
                />
                <button
                  type="submit"
                  disabled={torrentStatus === 'loading'}
                  className="flex items-center justify-center gap-2 bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
                >
                  <FiPlay aria-hidden="true" />
                  {torrentStatus === 'loading' ? 'Conectando...' : 'Carregar Torrent'}
                </button>
                {torrentStatus !== 'idle' && (
                  <button
                    type="button"
                    onClick={handleStopTorrent}
                    title="Parar reprodução"
                    className="flex items-center justify-center border border-zinc-600 px-4 py-3 text-white hover:border-rose-400 hover:text-rose-400"
                  >
                    <FiSquare aria-hidden="true" />
                  </button>
                )}
              </form>

              {/* Local .torrent file upload button */}
              <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span>Ou envie o arquivo baixado do seu computador:</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".torrent,application/x-bittorrent"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded border border-zinc-600 bg-zinc-800 px-3 py-1.5 font-medium text-emerald-400 transition-colors hover:bg-zinc-700 hover:text-emerald-300"
                >
                  <FiFilePlus aria-hidden="true" />
                  Escolher arquivo .torrent
                </button>
              </div>

              {torrentError && (
                <div role="alert" className="mb-5 rounded-lg border-l-4 border-rose-500 bg-zinc-900 p-4 text-sm text-rose-200">
                  <p className="font-semibold text-rose-300">Atenção ao carregar o torrent:</p>
                  <p className="mt-1">{torrentError}</p>
                </div>
              )}

              {/* Status / Live Torrent Stats */}
              {torrentStatus !== 'idle' && (
                <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900 p-4">
                  {torrentName && (
                    <p className="mb-3 font-semibold text-emerald-400">
                      Torrent: <span className="text-white">{torrentName}</span>
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div className="flex items-center gap-2 rounded bg-zinc-800 p-2.5">
                      <FiUsers className="text-emerald-400" />
                      <div>
                        <p className="text-xs text-zinc-400">Peers WebRTC</p>
                        <p className="font-bold text-white">{stats.peers}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded bg-zinc-800 p-2.5">
                      <FiDownload className="text-sky-400" />
                      <div>
                        <p className="text-xs text-zinc-400">Download</p>
                        <p className="font-bold text-white">{stats.downloadSpeed}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded bg-zinc-800 p-2.5">
                      <FiUpload className="text-amber-400" />
                      <div>
                        <p className="text-xs text-zinc-400">Upload</p>
                        <p className="font-bold text-white">{stats.uploadSpeed}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded bg-zinc-800 p-2.5">
                      <div className="text-xs">
                        <p className="text-zinc-400">Progresso ({stats.progress}%)</p>
                        <p className="font-bold text-white">{stats.downloaded} / {stats.total}</p>
                      </div>
                    </div>
                  </div>

                  {/* Multiple files in torrent selector */}
                  {torrentFiles.length > 1 && (
                    <div className="mt-4 border-t border-zinc-700 pt-3">
                      <label className="text-xs font-semibold uppercase text-zinc-400">
                        Selecionar arquivo do torrent:
                      </label>
                      <div className="mt-1.5 flex max-h-36 flex-col gap-1 overflow-y-auto">
                        {torrentFiles.map((file, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectFile(idx)}
                            className={`flex items-center justify-between rounded px-3 py-1.5 text-left text-xs transition-colors ${
                              selectedFileIndex === idx
                                ? 'bg-emerald-600 text-white'
                                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            }`}
                          >
                            <span className="truncate">{file.name}</span>
                            <span className="ml-2 shrink-0 opacity-75">{formatBytes(file.length)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Video Player Display */}
              <div className={`mt-4 ${torrentStatus === 'idle' ? 'hidden' : ''}`}>
                <video
                  ref={videoRef}
                  controls
                  playsInline
                  className="max-h-[70vh] w-full rounded-lg bg-black shadow-lg"
                />
                <div ref={playerContainerRef} className="mt-2" />
              </div>
            </div>
          )}

          {/* TAB 2: CLOUDFLARE R2 */}
          {activeTab === 'r2' && (
            <div>
              <div className="mb-6 rounded-lg border border-sky-500/30 bg-sky-950/20 p-4 text-sky-200">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 shrink-0 text-xl text-sky-400" />
                  <div className="text-sm">
                    <p className="font-semibold text-sky-300">Cloudflare R2 - Streaming Direto & Rápido:</p>
                    <p className="mt-1 text-zinc-300">
                      O Cloudflare R2 oferece <strong>10 GB gratuitos</strong> e <strong>Zero custo de transferência (Egress)</strong>. Os vídeos carregam instantaneamente sem depender de sementes P2P e com suporte completo a legendas internas e busca rápida.
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      Dica: No painel do Cloudflare R2, certifique-se de configurar a política de <strong>CORS</strong> (disponível no arquivo <code className="text-sky-300">r2-cors.json</code> do projeto) para permitir requisições de áudio/vídeo e legendas.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleR2Submit} className="mb-6 flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="r2-source">URL do arquivo no Cloudflare R2</label>
                <input
                  id="r2-source"
                  type="url"
                  value={r2Url}
                  onChange={(event) => setR2Url(event.target.value)}
                  placeholder="https://pub-xxxxxxxx.r2.dev/anime-ep1.mp4 ou seu domínio"
                  className="min-w-0 flex-1 border border-zinc-600 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                  required
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-sky-500 px-5 py-3 font-semibold text-black hover:bg-sky-400"
                >
                  <FiPlay aria-hidden="true" />
                  Reproduzir R2
                </button>
                {activeR2Source && (
                  <button
                    type="button"
                    onClick={() => setActiveR2Source('')}
                    title="Limpar player"
                    className="flex items-center justify-center border border-zinc-600 px-4 py-3 text-white hover:border-rose-400 hover:text-rose-400"
                  >
                    <FiSquare aria-hidden="true" />
                  </button>
                )}
              </form>

              {/* R2 Video Player */}
              {activeR2Source ? (
                <div className="mt-6">
                  <VideoPlayer
                    sources={[{ resolution: 'Cloudflare R2 / Direto', url: activeR2Source }]}
                    title="Teste de Vídeo Cloudflare R2"
                  />
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-zinc-700 p-8 text-center text-zinc-400">
                  <FiCloud className="mx-auto mb-2 text-4xl text-zinc-500" />
                  <p>Cole acima o link público do seu arquivo MP4, MKV ou WebM hospedado no R2 e clique em Reproduzir.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
