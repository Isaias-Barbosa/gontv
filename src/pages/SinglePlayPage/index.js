import Episodio from 'components/Episodio';
import animeData from 'json/animes.json';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';



export default function SinglePlayPage() {

  const { slug, titleSlug, languageEpisode } = useParams();
  const anime = animeData.find((anime) => anime.slug === slug);

  if (!anime || !anime.episodes || anime.episodes.length === 0) {
    return <div>Anime não encontrado ou sem episódios</div>;
  }

  const episode = anime.episodes.find(
    (episode) => episode.titleSlug === titleSlug && episode.languageEpisode === languageEpisode
  );

  const pageTitle = ` Gon.TV - Assistir ${anime.title} - ${anime.language} - ${episode.titleEpisodio} - Online em FHD `;

  console.log(anime)
  if (!episode) {
    return <div>Episódio não encontrado</div>;
  }
  

  return <>
    <Helmet>
      <title>{pageTitle}</title>
    </Helmet><Episodio
      anime={anime}
      episodio={episode}
      slug={slug}
      titleSlug={titleSlug}
      languageEpisode={languageEpisode} />
  </>
}


