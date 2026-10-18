import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import DPlayer from 'dplayer';
import { FiAlertCircle, FiRefreshCw, FiType, FiSquare } from 'react-icons/fi';
import { createSubtitleWorker } from 'lib/createSubtitleWorker';
import { alternateDiscordUrl, sourceInfo, subtitleSourceUrl } from 'lib/videoSources';
import './VideoPlayer.css';
const escapeCue = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const portuguese = language => /^(pt|por)(-|$)/i.test(language);
export default function VideoPlayer({ sources = [], title, poster }) {
  const [selectedSource, setSelectedSource] = useState(0);
  const [alternate, setAlternate] = useState(false);
  const originalUrl = sources[selectedSource]?.url?.trim() || '';
  const url = (alternate && alternateDiscordUrl(originalUrl)) || originalUrl;
  const info = sourceInfo(url);
  const container = useRef(null), player = useRef(null), worker = useRef(null), nativeTracks = useRef(new Map());
  const resume = useRef(null), selectedRef = useRef(''), manualSubtitle = useRef(false), autoStarted = useRef(false);
  const [error, setError] = useState('');
  const [tracks, setTracks] = useState([]);
  const [subtitle, setSubtitle] = useState('');
  const [phase, setPhase] = useState('idle');
  const [status, setStatus] = useState('As legendas internas serão buscadas ao iniciar a reprodução.');
  const [progress, setProgress] = useState({ read: 0, total: 0 });
  const [cueCount, setCueCount] = useState(0);
  const activate = useCallback(id => {
    selectedRef.current = id; setSubtitle(id);
    for (const [key, item] of nativeTracks.current) item.track.mode = key === id ? 'showing' : 'disabled';
  }, []);
  const clearTracks = useCallback(() => {
    for (const item of nativeTracks.current.values()) { item.track.mode = 'disabled'; while (item.track.cues?.length) item.track.removeCue(item.track.cues[0]); }
    nativeTracks.current.clear(); setTracks([]); activate(''); setCueCount(0); manualSubtitle.current = false;
  }, [activate]);
  const startScan = useCallback(() => {
    const video = player.current?.video;
    if (!video || !sourceInfo(url).mkv) return;
    autoStarted.current = true;
    worker.current?.terminate(); clearTracks(); setPhase('scanning');
    setStatus('Buscando idiomas e legendas internas…'); setProgress({ read: 0, total: 0 });
    if (!window.Worker || !window.VTTCue) { setPhase('error'); setStatus('Este navegador não oferece suporte à extração das legendas.'); return; }
    let current;
    try { current = createSubtitleWorker(); } catch { setPhase('error'); setStatus('Não foi possível iniciar a leitura de legendas. Recarregue a página.'); return; }
    worker.current = current;
    let count = 0;
    current.onmessage = event => {
      if (worker.current !== current) return;
      const data = event.data;
      if (data.type === 'track') {
        const t = data.track, id = String(t.number);
        const label = [t.language === 'und' ? 'Idioma não informado' : t.language, t.name].filter(Boolean).join(' · ');
        setTracks(previous => [...previous, { ...t, label }]);
        if (t.supported) {
          const track = video.addTextTrack('subtitles', label, t.language); track.mode = 'disabled';
          nativeTracks.current.set(id, { track, language: t.language, last: null });
          const previous = nativeTracks.current.get(selectedRef.current);
          if (!manualSubtitle.current && (!previous || (portuguese(t.language) && !portuguese(previous.language)))) activate(id);
        }
      }
      if (data.type === 'cues') {
        for (const item of data.cues) {
          const entry = nativeTracks.current.get(String(item.track));
          if (!entry) continue;
          if (entry.last?.estimated && entry.last.cue.startTime < item.start) entry.last.cue.endTime = Math.min(entry.last.cue.endTime, item.start);
          const cue = new window.VTTCue(item.start, item.end, escapeCue(item.text));
          entry.track.addCue(cue); entry.last = { cue, estimated: item.estimated }; count += 1;
        }
        setCueCount(count);
      }
      if (data.type === 'progress') setProgress({ read: data.read, total: data.total });
      if (data.type === 'done') {
        setPhase('done');
        setStatus(!data.tracks ? 'Nenhuma legenda interna encontrada.' : !nativeTracks.current.size ? 'As legendas deste arquivo são em imagem ou usam uma codificação não suportada.' : `Busca concluída. ${count} falas disponíveis.`);
        current.terminate(); worker.current = null;
      }
      if (['stopped', 'error'].includes(data.type)) {
        setPhase(data.type); setStatus(data.type === 'stopped' ? 'Busca interrompida. As falas já carregadas continuam disponíveis.' : data.message);
        current.terminate(); worker.current = null;
      }
    };
    current.onerror = () => { if (worker.current === current) { setPhase('error'); setStatus('A leitura de legendas falhou. Tente buscar novamente.'); current.terminate(); worker.current = null; } };
    current.postMessage({ type: 'start', url: subtitleSourceUrl(url) });
  }, [url, clearTracks, activate]);
  useEffect(() => {
    setError(''); worker.current?.terminate(); worker.current = null; clearTracks();
    setPhase('idle'); setStatus('As legendas internas serão buscadas ao iniciar a reprodução.'); setProgress({ read: 0, total: 0 }); autoStarted.current = false;
    if (!sourceInfo(url).direct || !container.current) return undefined;
    const instance = new DPlayer({ container: container.current, theme: '#34d399', lang: 'en', autoplay: false, preload: 'metadata', screenshot: false, video: { url, type: 'normal', pic: poster || '' } });
    player.current = instance;
    instance.video.setAttribute('aria-label', title || 'Player de vídeo');
    instance.on('loadedmetadata', () => { if (resume.current) { instance.seek(Math.min(resume.current.time, Number.isFinite(instance.video.duration) ? instance.video.duration : resume.current.time)); if (resume.current.playing) instance.play()?.catch?.(() => {}); resume.current = null; } });
    instance.on('error', () => setError(instance.video.error?.code === 4 ? 'O navegador não suporta o formato ou os codecs deste vídeo. Tente outro navegador ou uma fonte MP4/H.264.' : 'Não foi possível carregar o vídeo. O link pode ter expirado ou a conexão foi interrompida.'));
    instance.on('play', () => { if (sourceInfo(url).mkv && !autoStarted.current) startScan(); });
    return () => { worker.current?.terminate(); worker.current = null; clearTracks(); instance.destroy(); if (player.current === instance) player.current = null; };
  }, [url, poster, title, clearTracks, startScan]);
  const rememberPosition = () => { if (player.current?.video) resume.current = { time: player.current.video.currentTime || 0, playing: !player.current.video.paused }; };
  const changeSource = event => { rememberPosition(); setAlternate(false); setSelectedSource(Number(event.target.value)); };
  return <section className="gon-video-player" aria-label="Reprodução do episódio">
    {sources.length > 1 && <div className="gon-video-toolbar"><label>Fonte / qualidade <select value={selectedSource} onChange={changeSource}>{sources.map((source, index) => <option key={index} value={index}>{source.resolution || `Fonte ${index + 1}`}</option>)}</select></label></div>}
    {!info.valid ? <p role="alert" className="gon-player-message">Nenhuma fonte de vídeo válida foi cadastrada para este episódio.</p> : info.torrent ? <p className="gon-player-message">Esta fonte é um torrent. <Link to="/torrent">Abrir Player Torrent</Link></p> : info.direct ? <div className="gon-dplayer" ref={container} /> : <div className="gon-embed"><iframe title={title || 'Player do episódio'} src={url} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /></div>}
    {error && <p role="alert" className="gon-player-message gon-player-error"><FiAlertCircle />{error}</p>}
    {info.discord && <div className="gon-video-toolbar"><button type="button" onClick={() => { rememberPosition(); setAlternate(value => !value); }}><FiRefreshCw /> Alternar CDN / Media</button><span>Se o link falhar, tente o outro servidor do Discord.</span></div>}
    {info.mkv && <div className="gon-subtitle-panel">
      <div className="gon-subtitle-heading"><FiType /><strong>Legendas do MKV</strong><span>Texto embutido no arquivo</span></div>
      <div className="gon-subtitle-controls"><label>Idioma da legenda<select value={subtitle} onChange={event => { manualSubtitle.current = true; activate(event.target.value); }}><option value="">Desativadas</option>{tracks.map(track => <option key={track.number} value={String(track.number)} disabled={!track.supported}>{track.label}{!track.supported ? ' (não suportada)' : ''}</option>)}</select></label>
        {phase === 'scanning' ? <button type="button" onClick={() => worker.current?.postMessage({ type: 'stop' })}><FiSquare /> Interromper busca</button> : <button type="button" onClick={startScan}><FiRefreshCw />{phase === 'idle' ? 'Buscar legendas' : 'Buscar novamente'}</button>}
      </div>
      <p role="status" aria-live="polite">{phase === 'scanning' ? `${nativeTracks.current.size} faixa(s) de texto · ${cueCount} falas · ${(progress.read / 1048576).toFixed(1)} MB lidos. Você já pode selecionar um idioma.` : status}</p>
      {phase === 'scanning' && <progress aria-label="Leitura das legendas" max={progress.total || 1} {...(progress.total ? { value: progress.read } : {})} />}
      <small>A busca lê o MKV pela rede e pode transferir o arquivo inteiro, sem salvá-lo no dispositivo. SRT, ASS/SSA e WebVTT são exibidas como texto; estilos avançados e legendas em imagem não são suportados.</small>
    </div>}
  </section>;
}
