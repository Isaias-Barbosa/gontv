import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import DPlayer from 'dplayer';
import { createPortal } from 'react-dom';
import { FiAlertCircle, FiRefreshCw, FiType, FiSquare } from 'react-icons/fi';
import { createSubtitleWorker } from 'lib/createSubtitleWorker';
import { sourceInfo, subtitleSourceUrl } from 'lib/videoSources';
import './VideoPlayer.css';
import SubtitleAppearance from './SubtitleAppearance';
const portuguese = language => /^(pt|por)(-|$)/i.test(language);
const EMPTY_SUBTITLES = [];
export default function VideoPlayer({ sources = [], title, poster, subtitles = EMPTY_SUBTITLES }) {
  const [selectedSource, setSelectedSource] = useState(0);
  const url = sources[selectedSource]?.url?.trim() || '';
  const info = sourceInfo(url);
  const hasSavedSubtitles = Array.isArray(subtitles) && subtitles.length > 0 && subtitles.some(s => Array.isArray(s.cues) && s.cues.length > 0);
  const container = useRef(null), player = useRef(null), worker = useRef(null), nativeTracks = useRef(new Map());
  const resume = useRef(null), selectedRef = useRef(''), manualSubtitle = useRef(false), autoStarted = useRef(false);
  const [error, setError] = useState('');
  const [tracks, setTracks] = useState([]);
  const [subtitle, setSubtitle] = useState('');
  const [phase, setPhase] = useState('idle');
  const [status, setStatus] = useState('As legendas internas serão buscadas ao iniciar a reprodução.');
  const [progress, setProgress] = useState({ read: 0, total: 0 });
  const [cueCount, setCueCount] = useState(0);
  const [captionHost, setCaptionHost] = useState(null);
  const [captionStyle, setCaptionStyle] = useState({});
  const [captions, setCaptions] = useState([]);
  const cueTexts = useRef(new WeakMap());
  const nativeFullscreen = useRef(false);
  const syncCaptions = useCallback(() => {
    const track = nativeTracks.current.get(selectedRef.current)?.track;
    const next = Array.from(track?.activeCues || []).map(cue => cueTexts.current.get(cue) ?? cue.text);
    setCaptions(previous => previous.length === next.length && previous.every((text, i) => text === next[i]) ? previous : next);
  }, []);
  const activate = useCallback(id => {
    selectedRef.current = id; setSubtitle(id);
    for (const [key, item] of nativeTracks.current) item.track.mode = key === id ? (nativeFullscreen.current ? 'showing' : 'hidden') : 'disabled';
    syncCaptions();
  }, [syncCaptions]);
  const clearTracks = useCallback(() => {
    for (const item of nativeTracks.current.values()) { item.track.mode = 'disabled'; item.track.removeEventListener?.('cuechange', syncCaptions); while (item.track.cues?.length) item.track.removeCue(item.track.cues[0]); }
    nativeTracks.current.clear(); setTracks([]); activate(''); setCueCount(0); manualSubtitle.current = false;
  }, [activate, syncCaptions]);
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
          track.addEventListener?.('cuechange', syncCaptions);
          const previous = nativeTracks.current.get(selectedRef.current);
          if (!manualSubtitle.current && (!previous || (portuguese(t.language) && !portuguese(previous.language)))) activate(id);
        }
      }
      if (data.type === 'cues') {
        for (const item of data.cues) {
          const entry = nativeTracks.current.get(String(item.track));
          if (!entry) continue;
          if (entry.last?.estimated && entry.last.cue.startTime < item.start) entry.last.cue.endTime = Math.min(entry.last.cue.endTime, item.start);
          const cue = new window.VTTCue(item.start, item.end, item.text);
          cueTexts.current.set(cue, item.text);
          entry.track.addCue(cue); entry.last = { cue, estimated: item.estimated }; count += 1;
        }
        setCueCount(count); syncCaptions();
      }
      if (data.type === 'progress') setProgress({ read: data.read, total: data.total });
      if (data.type === 'done') {
        setPhase('done');
        setStatus(!data.tracks ? 'Nenhuma legenda identificada como português brasileiro encontrada.' : !nativeTracks.current.size ? 'As legendas em português brasileiro são em imagem ou usam uma codificação não suportada.' : `Busca concluída. ${count} falas disponíveis em português brasileiro.`);
        current.terminate(); worker.current = null;
      }
      if (['stopped', 'error'].includes(data.type)) {
        setPhase(data.type); setStatus(data.type === 'stopped' ? 'Busca interrompida. As falas já carregadas continuam disponíveis.' : data.message);
        current.terminate(); worker.current = null;
      }
    };
    current.onerror = () => { if (worker.current === current) { setPhase('error'); setStatus('A leitura de legendas falhou. Tente buscar novamente.'); current.terminate(); worker.current = null; } };
    current.postMessage({ type: 'start', url: subtitleSourceUrl(url) });
  }, [url, clearTracks, activate, syncCaptions]);
  useEffect(() => {
    setError(''); worker.current?.terminate(); worker.current = null; clearTracks();
    setPhase('idle'); setStatus('As legendas internas serão buscadas ao iniciar a reprodução.'); setProgress({ read: 0, total: 0 }); autoStarted.current = false;
    if (!sourceInfo(url).direct || !container.current) return undefined;
    const instance = new DPlayer({ container: container.current, theme: '#34d399', lang: 'en', autoplay: false, preload: 'metadata', screenshot: false, video: { url, type: 'normal', pic: poster || '' } });
    player.current = instance;
    const host = document.createElement('div');
    nativeFullscreen.current = false;
    host.className = 'gon-caption-overlay';
    host.setAttribute('aria-label', 'Legenda do vídeo');
    (instance.video.parentElement || container.current).appendChild(host);
    setCaptionHost(host);
    // Keep native tracks timed but hidden, including any track exposed directly by the MKV or saved subtitles.
    const hideNativeCaptions = () => {
      if (!sourceInfo(url).mkv && !hasSavedSubtitles) return;
      const selected = nativeTracks.current.get(selectedRef.current)?.track;
      const selectedMode = nativeFullscreen.current ? 'showing' : 'hidden';
      if (selected && selected.mode !== selectedMode) selected.mode = selectedMode;
      for (const track of Array.from(instance.video.textTracks || [])) {
        if (!['subtitles', 'captions'].includes(track.kind)) continue;
        const mode = track === selected ? selectedMode : 'disabled';
        if (track.mode !== mode) track.mode = mode;
      }
    };
    const enterNativeFullscreen = () => { nativeFullscreen.current = true; host.hidden = true; hideNativeCaptions(); };
    const exitNativeFullscreen = () => { nativeFullscreen.current = false; host.hidden = false; hideNativeCaptions(); syncCaptions(); };
    instance.video.addEventListener('webkitbeginfullscreen', enterNativeFullscreen);
    instance.video.addEventListener('webkitendfullscreen', exitNativeFullscreen);
    hideNativeCaptions();
    instance.video.textTracks?.addEventListener?.('addtrack', hideNativeCaptions);
    instance.video.textTracks?.addEventListener?.('change', hideNativeCaptions);
    instance.video.addEventListener('timeupdate', syncCaptions);
    instance.video.addEventListener('seeked', syncCaptions);
    instance.video.addEventListener('loadedmetadata', hideNativeCaptions);
    instance.video.setAttribute('aria-label', title || 'Player de vídeo');

    // Mount pre-saved subtitles from Neon database immediately
    if (hasSavedSubtitles) {
      for (const sub of subtitles) {
        if (!sub.cues || sub.cues.length === 0) continue;
        const id = String(sub.language || 'pt-BR');
        const label = sub.label || 'Português (Brasil)';
        const track = instance.video.addTextTrack('subtitles', label, sub.language || 'pt-BR');
        track.mode = 'disabled';
        nativeTracks.current.set(id, { track, language: sub.language || 'pt-BR', last: null });
        track.addEventListener?.('cuechange', syncCaptions);

        for (const cue of sub.cues) {
          const vttCue = new window.VTTCue(cue.start, cue.end, cue.text);
          cueTexts.current.set(vttCue, cue.text);
          track.addCue(vttCue);
        }

        setTracks(prev => [...prev, { number: id, label, supported: true, language: sub.language || 'pt-BR' }]);
      }

      const defaultTrackId = String(subtitles[0].language || 'pt-BR');
      activate(defaultTrackId);
      setPhase('done');
      setStatus(`Legenda carregada do Neon (${subtitles[0].cues.length} falas).`);
      setCueCount(subtitles[0].cues.length);
      autoStarted.current = true;
    }

    instance.on('loadedmetadata', () => { if (resume.current) { instance.seek(Math.min(resume.current.time, Number.isFinite(instance.video.duration) ? instance.video.duration : resume.current.time)); if (resume.current.playing) instance.play()?.catch?.(() => {}); resume.current = null; } });
    instance.on('error', () => setError(instance.video.error?.code === 4 ? 'O navegador não suporta o formato ou os codecs deste vídeo. Tente outro navegador ou uma fonte MP4/H.264.' : 'Não foi possível carregar o vídeo. O link pode ter expirado ou a conexão foi interrompida.'));
    instance.on('play', () => { if (!hasSavedSubtitles && sourceInfo(url).mkv && !autoStarted.current) startScan(); });
    return () => {
      instance.video.textTracks?.removeEventListener?.('addtrack', hideNativeCaptions);
      instance.video.textTracks?.removeEventListener?.('change', hideNativeCaptions);
      instance.video.removeEventListener('timeupdate', syncCaptions);
      instance.video.removeEventListener('seeked', syncCaptions);
      instance.video.removeEventListener('loadedmetadata', hideNativeCaptions);
      instance.video.removeEventListener('webkitbeginfullscreen', enterNativeFullscreen);
      instance.video.removeEventListener('webkitendfullscreen', exitNativeFullscreen);
      worker.current?.terminate(); worker.current = null; clearTracks(); instance.destroy();
      if (player.current === instance) player.current = null;
    };
  }, [url, poster, title, clearTracks, startScan, syncCaptions, hasSavedSubtitles, subtitles, activate]);
  const rememberPosition = () => { if (player.current?.video) resume.current = { time: player.current.video.currentTime || 0, playing: !player.current.video.paused }; };
  const changeSource = event => { rememberPosition(); setSelectedSource(Number(event.target.value)); };
  return <section className="gon-video-player" aria-label="Reprodução do episódio">
    {sources.length > 1 && <div className="gon-video-toolbar"><label>Fonte / qualidade <select value={selectedSource} onChange={changeSource}>{sources.map((source, index) => <option key={index} value={index}>{source.resolution || `Fonte ${index + 1}`}</option>)}</select></label></div>}
    {!info.valid ? <p role="alert" className="gon-player-message">Nenhuma fonte de vídeo válida foi cadastrada para este episódio.</p> : info.torrent ? <p className="gon-player-message">Esta fonte é um torrent. <Link to="/torrent">Abrir Player Torrent</Link></p> : info.direct ? <div className="gon-dplayer" ref={container} /> : <div className="gon-embed"><iframe title={title || 'Player do episódio'} src={url} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /></div>}
    {captionHost && createPortal(captions.map((text, index) => <div key={index}><span style={captionStyle}>{text}</span></div>), captionHost)}
    {error && <p role="alert" className="gon-player-message gon-player-error"><FiAlertCircle />{error}</p>}
    {(info.mkv || hasSavedSubtitles) && <div className="gon-subtitle-panel">
      <div className="gon-subtitle-heading"><FiType /><strong>Legendas {hasSavedSubtitles ? '(Salvas no Neon)' : 'do MKV'}</strong><span>{hasSavedSubtitles ? 'Carregamento instantâneo' : 'Texto embutido no arquivo'}</span></div>
      <div className="gon-subtitle-controls"><label>Idioma da legenda<select value={subtitle} onChange={event => { manualSubtitle.current = true; activate(event.target.value); }}><option value="">Desativadas</option>{tracks.map(track => <option key={track.number} value={String(track.number)} disabled={!track.supported}>{track.label}{!track.supported ? ' (não suportada)' : ''}</option>)}</select></label>
        {!hasSavedSubtitles && (phase === 'scanning' ? <button type="button" onClick={() => worker.current?.postMessage({ type: 'stop' })}><FiSquare /> Interromper busca</button> : <button type="button" onClick={startScan}><FiRefreshCw />{phase === 'idle' ? 'Buscar legendas' : 'Buscar novamente'}</button>)}
      </div>
      <p role="status" aria-live="polite">{phase === 'scanning' ? `${nativeTracks.current.size} faixa(s) de texto · ${cueCount} falas · ${(progress.read / 1048576).toFixed(1)} MB lidos. Você já pode selecionar um idioma.` : status}</p>
      {phase === 'scanning' && <progress aria-label="Leitura das legendas" max={progress.total || 1} {...(progress.total ? { value: progress.read } : {})} />}
      <SubtitleAppearance onStyleChange={setCaptionStyle} />
      <small>{hasSavedSubtitles ? 'As legendas deste episódio foram extraídas e salvas no Neon, prontas para exibição instantânea sem reler o arquivo de vídeo.' : 'A busca lê o MKV pela rede e pode transferir o arquivo inteiro, sem salvá-lo no dispositivo. SRT, ASS/SSA e WebVTT são exibidas como texto; estilos avançados e legendas em imagem não são suportados.'}</small>
    </div>}
  </section>;
}
