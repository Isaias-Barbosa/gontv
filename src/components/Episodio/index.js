import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import Discus from 'components/Discus';
import VideoPlayer from 'components/VideoPlayer';
import './Episodio.css';
export default function Episodio({ anime, episodio, slug, languageEpisode }) {
  const index = anime.episodes.findIndex(episode => episode.id === episodio.id);
  const episode = anime.episodes[index];
  if (!episode) return <div className="p-8 text-white">Episódio não encontrado.</div>;
  const episodeLink = item => `/animes/${slug}/${item.titleSlug}/${languageEpisode}`;
  return <div className="bg-black-dark py-8">
    <div className="title-container"><h3 className="text-xl text-white text-center font-bold"><Link to={`/animes/${slug}`}><span className="border-b-2 border-emerald-400">{anime.title}</span></Link> - {episode.titleEpisodio}</h3></div>
    <main className="episode-main">
      <nav className="episode-navigation" aria-label="Navegação dos episódios">
        {index > 0 ? <Link to={episodeLink(anime.episodes[index - 1])}><AiOutlineLeft /> Anterior</Link> : <span />}
        <Link to={`/animes/${slug}`}>Todos os episódios</Link>
        {index < anime.episodes.length - 1 ? <Link to={episodeLink(anime.episodes[index + 1])}>Próximo <AiOutlineRight /></Link> : <span />}
      </nav>
      <VideoPlayer key={`${anime.id}:${episode.id}`} sources={(episode.videoUrl || []).filter(source => source.url?.trim())} title={`${anime.title} - ${episode.titleEpisodio}`} poster={episode.thumbnail} subtitles={episode.subtitles} />
      <section className="episode-comments"><h3>Comentários</h3><p>Cuidado com os spoilers. Utilize a tag spoiler ao comentar sobre o episódio.</p><Discus identifier={`${episode.titleSlug}-${episode.id}`} title={episode.titleEpisodio} /></section>
    </main>
  </div>;
}
