import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FiLink, FiSquare } from 'react-icons/fi';

const WEBTOR_SDK_URL = 'https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js@0.2.19/dist/index.min.js';

let webtorSdkPromise;

function loadWebtorSdk() {
  if (window.webtor && typeof window.webtor.push === 'function') {
    return Promise.resolve(window.webtor);
  }

  if (!webtorSdkPromise) {
    webtorSdkPromise = new Promise((resolve, reject) => {
      let script = document.querySelector(`script[src="${WEBTOR_SDK_URL}"]`);
      const shouldAppend = !script;
      if (!script) {
        script = document.createElement('script');
        script.src = WEBTOR_SDK_URL;
        script.async = true;
      }

      script.addEventListener('load', () => {
        if (window.webtor && typeof window.webtor.push === 'function') {
          resolve(window.webtor);
        } else {
          webtorSdkPromise = null;
          reject(new Error('O SDK da Webtor foi carregado, mas não ficou disponível.'));
        }
      }, { once: true });
      script.addEventListener('error', () => {
        script.remove();
        webtorSdkPromise = null;
        reject(new Error('Não foi possível carregar o player da Webtor. Verifique sua conexão e tente novamente.'));
      }, { once: true });
      if (shouldAppend) document.head.appendChild(script);
    });
  }

  return webtorSdkPromise;
}

function getTorrentErrorMessage(event) {
  const detail = event && event.data;
  if (typeof detail === 'string' && detail.trim()) return detail;
  if (detail && typeof detail.message === 'string' && detail.message.trim()) return detail.message;
  return 'A Webtor não conseguiu carregar este torrent. Verifique o link e tente novamente.';
}

export default function TorrentPlayer() {
  const [source, setSource] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);
  const playerRef = useRef(null);
  const requestRef = useRef(0);

  useEffect(() => () => {
    requestRef.current += 1;
    if (playerRef.current) playerRef.current.replaceChildren();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    if (playerRef.current) playerRef.current.replaceChildren();
    setError('');
    setShowPlayer(false);

    const torrentSource = source.trim();
    const isMagnet = /^magnet:\?/i.test(torrentSource);
    let torrentUrl = false;
    if (/^https?:\/\//i.test(torrentSource)) {
      try {
        const parsedSource = new URL(torrentSource);
        torrentUrl = parsedSource.protocol === 'http:' || parsedSource.protocol === 'https:';
      } catch {
        torrentUrl = false;
      }
    }

    if (!isMagnet && !torrentUrl) {
      setError('Informe um link magnet ou uma URL HTTP/HTTPS para o arquivo .torrent.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setShowPlayer(true);

    try {
      const webtor = await loadWebtorSdk();
      if (requestId !== requestRef.current || !playerRef.current) return;

      const playerConfig = {
        id: 'webtor-player',
        width: '100%',
        header: true,
        controls: true,
        lang: 'pt',
        on: (sdkEvent) => {
          if (requestId !== requestRef.current) return;
          if (sdkEvent.name === 'torrent error') {
            setError(getTorrentErrorMessage(sdkEvent));
            setStatus('error');
          } else if (sdkEvent.name === 'inited' || sdkEvent.name === 'torrent fetched') {
            setStatus('ready');
          }
        },
      };

      if (isMagnet) {
        playerConfig.magnet = torrentSource;
      } else {
        playerConfig.torrentUrl = torrentSource;
      }

      webtor.push(playerConfig);

      const iframe = playerRef.current.querySelector('iframe');
      if (iframe) iframe.title = 'Player de torrent da Webtor';
      setStatus('ready');
    } catch (torrentError) {
      if (requestId !== requestRef.current) return;
      if (playerRef.current) playerRef.current.replaceChildren();
      setShowPlayer(false);
      setError(torrentError.message || 'Não foi possível iniciar o player torrent.');
      setStatus('error');
    }
  };

  const handleStop = () => {
    requestRef.current += 1;
    if (playerRef.current) playerRef.current.replaceChildren();
    setShowPlayer(false);
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
              type="text"
              inputMode="url"
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
            O player da Webtor conecta a peers compatíveis para transmitir o torrent. A disponibilidade depende dos peers e, para URLs .torrent, da permissão CORS do servidor de origem.
          </p>

          {error && (
            <p role="alert" className="mb-5 border-l-4 border-rose-500 bg-zinc-900 px-4 py-3 text-rose-200">
              {error}
            </p>
          )}

          {status === 'loading' && <p className="mb-5 text-emerald-300">Carregando o player da Webtor...</p>}
          <section aria-label="Reprodução do torrent" className={showPlayer ? '' : 'hidden'}>
            <div id="webtor-player" ref={playerRef} className="w-full overflow-hidden" />
          </section>
        </section>
      </main>
    </>
  );
}
